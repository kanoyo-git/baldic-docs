# Предметы, персонажи, события, плакаты и наклейки

Выберите уровень контроля. `Baldic.Api.Lua` предоставляет typed registries: заполните C# спецификацию, и API создаст enum, metadata, локализацию и игровой объект. Builders создают основу для собственных наследников `Item`, `NPC` и `RandomEvent`; интеграцию в пулы и более сложное поведение вы определяете сами. Namespace `Lua` не требует Lua runtime.

## ID и готовность

Используйте полные lowercase ID вида `orchard:apple`. Допустимы буквы `a-z`, цифры, `_`, `.`, `-`, а в правой части также `/`. Bare ID дополняется текущим mod ID; без context получится владелец `unknown`, поэтому регистрируйте из entrypoint или `using (owner.Enter())`. Это особенно важно, когда код вызывается из обычного Unity callback.

`Items.Register(ItemSpec)` возвращает **игровой enum `Items`**, `Characters.Register(CharacterSpec)` — `Character`, `RandomEvents.Register(EventSpec)` — `RandomEventType`, `Stickers.Register(StickerSpec)` — `Sticker`. Это не экземпляры в мире. Их `Get(id)` возвращает построенный шаблон; до подготовки он может быть `null`. `Posters.Register(PosterSpec)` сразу возвращает `PosterObject` и загружает файл синхронно.

Все регистраторы требуют корректные обязательные поля. Для предмета нужен `Sprite` либо обе `SmallSprite` и `LargeSprite`; для персонажа — `Sprite`; для плаката — `Image`; для наклейки — `Sprite`. `Items.Register` отвергает повторный ID. Некоторые другие registries допускают обновление specification того же владельца, но повторная регистрация не является универсальным способом пересобрать уже созданный prefab.

## Предмет со своим классом

[Первый мод](setup.md) уже показывает `ItemSpec`. Перейдём к `ItemBuilder`, когда эффект должен жить в собственном игровом классе. Следующий самостоятельный файл вызывается через `assetsStart`; нужны `assets/apple-small.png`, `assets/apple-large.png` и перевод ключей `Orchard_Apple_Name`/`Orchard_Apple_Desc` через [Localization](assets.md).

```csharp
using Baldic;
using Baldic.Api;
using ContentLevels = Baldic.Api.Lua.Levels;

namespace OrchardBuilder
{
    public sealed class OrchardApple : Item
    {
        public override bool Use(PlayerManager player)
        {
            player.plm.stamina = player.plm.StaminaMax;
            Destroy(gameObject);
            return true;
        }
    }

    [BaldicMod]
    public sealed class Mod
    {
        public void AssetsStart(ModContext owner)
        {
            owner.MarkContent();
            var small = Sprites.FromMod(owner.Id, 50f, "assets", "apple-small.png");
            var large = Sprites.FromMod(owner.Id, 50f, "assets", "apple-large.png");
            var apple = new ItemBuilder(owner.Id)
                .SetNameAndDescription("Orchard_Apple_Name", "Orchard_Apple_Desc")
                .SetSprites(small, large)
                .SetEnum("OrchardApple")
                .SetShopPrice(300)
                .SetGeneratorCost(40)
                .SetItemComponent<OrchardApple>()
                .SetMeta(ItemFlags.None, "food")
                .Build();
            ContentLevels.Change((title, number, scene) =>
            {
                if (title != "F1") return;
                ContentLevels.AddItem(scene, Enums.NameOf(apple.itemType), 50);
                ContentLevels.AddShopItem(scene, Enums.NameOf(apple.itemType), 50);
            });
            ModdedSaves.AddDummyHandler(owner.Id);
            ModdedHighScores.AddAffectingMod(owner.Id);
        }
    }
}
```

`Build()` создаёт `ItemObject` и prefab компонента, который игра клонирует при использовании. Поэтому `Destroy(gameObject)` в `Use` удаляет конкретный экземпляр эффекта. `SetItemComponent(Item instance)` позволяет передать заранее настроенный шаблон. `SetAsInstantUse` меняет поведение подбора: предмет используется сразу. Не обозначайте обычное яблоко как `Persists`: этот flag означает, что объект/эффект продолжает существовать после использования.

В `ItemSpec` `Price` — магазинная цена, `Cost` — стоимость для бюджета генератора; при `Cost <= 0` registry берёт цену. В builder это независимые значения с собственными defaults. `Weight` задаёт относительный шанс, а не цену или количество.

### Когда `InLevels` ничего не добавляет

Автоматическое добавление предмета выполняется один раз в generator stage `Addend`. В текущем коде `ItemSpec.InLevels` добавляет только в **непустой** `potentialItems`, а `InShop` — в **непустой** `scene.shopItems`. Пустой пул не создаётся. Если нужны именно пустые пулы, используйте `Levels.AddItem`/`AddShopItem`, которые создают массив, как в примере выше. `Floors` сравнивается с title этажа (`F1`, `F2`, `END`), а не с именем Unity-сцены; сравнение списка регистраторов учитывает регистр.

## Персонаж: от спецификации к поведению

Самостоятельный entrypoint через `init`. Нужны `assets/gardener.png` и `assets/gardener-poster.png`. Этот вариант выбирает персонажа из пула F2/F3; он начинает преследование при обнаружении игрока и возвращается к блужданию после потери цели.

```csharp
using Baldic;
using Baldic.Api.Lua;

namespace OrchardCharacter
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            Characters.Register(new CharacterSpec
            {
                Id = "orchard:gardener",
                Name = "Садовник",
                Description = "Следит за посетителями сада.",
                Sprite = "assets/gardener.png",
                Poster = "assets/gardener-poster.png",
                Scale = 1f,
                Speed = 14f,
                Sees = true,
                Fov = 120f,
                SightDistance = 80f,
                Floors = new[] { "F2", "F3" },
                Rooms = new[] { "Hall" },
                Weight = 80,
                OnPlayerSighted = (npc, player) => npc.Chase(player),
                OnPlayerLost = (npc, player) => npc.Wander(),
                OnTouchPlayer = (npc, player) =>
                {
                    using (owner.Enter())
                    {
                        Baldic.Api.Hud.Message("Не топчите грядки!", 2f);
                    }
                }
            });
        }
    }
}
```

`Scale=1` сопоставляет высоту с Principal; `Sprite="game:Name"` использует уже загруженный игровой sprite с его размером. Отрицательный `Fov` — обзор вокруг себя. `Flying` позволяет двигаться над опасностями; это не готовая трёхмерная навигация. `Forced=true` делает персонажа обязательным на подходящих этажах; пустой `Floors` означает этажи с обычным случайным пулом, а не обещание NPC во всех сценах, включая меню и поездки.

Callbacks получают `RegisteredNpc`, а события зрения и контакта — ещё и `PlayerManager`. `OnUpdate(npc, dt)` использует NPC time scale, `OnHear(npc, position, value)` — слух, `OnArrive` — прибытие `GoTo`. У NPC есть `Wander`, `Chase`, `GoTo`, `Stop`, `SetSpeed`, `SetFrozen`, `SetVisible`, `SetSprite`, `Say`, `BreakRule`, `SeesPlayer`, `DistanceTo` и временные `Get`/`Set`. `Characters.Get` — prefab, `All(id)` — экземпляры, `Spawn(id, position)` создаёт экземпляр на существующем уровне. Временные `Get`/`Set` не являются сохранением забега.

Когда нужны собственные behaviour/navigation states и overrides методов игры, используйте `NPCBuilder<T>` с `T : NPC`. Он строит основу из очищенного шаблона Beans и настраивает Entity, Navigator, Looker, trigger и metadata. Сначала задайте enum, sprite/poster, затем `AddLooker`/`AddTrigger`, категории спавна и navigation/audio настройки. Вызывайте `Build` в loading stage: до warmup `NpcTemplate` отсутствует. Builder не добавляет NPC в пулы; это отдельная задача `Levels.AddNpc` или worldgen. Полные методы — [builders](../reference/bbplus/builders.md).

## Случайное событие

Самостоятельный entrypoint через `init`, без дополнительных файлов. Событие показывает подпись, длится 20–30 секунд и сообщает о начале/конце. Здесь нет глобальной смены света, которую трудно корректно восстановить при перекрытии двух событий.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Api.Lua;
using ContentEvents = Baldic.Api.Lua.RandomEvents;

namespace OrchardEvent
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            ContentEvents.Register(new EventSpec
            {
                Id = "orchard:break",
                Announcement = "Время садового перерыва!",
                MinTime = 20f,
                MaxTime = 30f,
                Floors = new[] { "F2", "F3" },
                Weight = 80,
                OnBegin = ev =>
                {
                    using (owner.Enter()) Hud.Message("Перерыв начался", 3f);
                },
                OnEnd = ev =>
                {
                    using (owner.Enter()) Hud.Message("Перерыв закончился", 3f);
                }
            });
        }
    }
}
```

`AnnouncementSound` и `Jingle` принимают файл мода либо имя игрового звука. `OnUpdate` получает время с environment scale. `RegisteredEvent` даёт `Env`, `Active`, `TimeLeft`, `SetTimeLeft`, `End`, `Get` и `Set`; словарь очищается после `End`. `RandomEvents.Get` — prefab, `Running(id)` — активный экземпляр. Для объявления через TV используйте `World.StartEvent(id)`, для немедленного начала — `World.BeginEvent(id)`. События, требующие заранее созданной комнаты, не получают её автоматически при вызове фасада.

`RandomEventBuilder<T>` нужен собственному наследнику `RandomEvent`; `EntityBuilder` — физическому Entity, `GameManagerBuilder<T>` — manager prefab. Фабрики создают игровые звуки, обычные/цепочечные/персонажные плакаты, окна, door materials и map materials. Они создают данные и шаблоны, а не автоматически размещённый мир.

## Плакаты

`Posters.Register(new PosterSpec { Id=..., Image=..., Floors=..., Weight=... })` синхронно создаёт обычный `PosterObject`. Для файла изображения удобно использовать 256×256, как в игре. Регистрация включает добавление в poster pool на указанных этажах; `Get(id)` позволяет затем вручную разместить его через `World.PlacePoster`. Пустой `Floors` выбирает этажи с существующим непустым пулом плакатов. Явный список может расширить пустой массив, но не заменяет отсутствующий `null`-пул.

Для текста используйте `Factories.Poster(texture, PosterTextData[])`, а для image overlays — `ExtendedPosterObject` из gameplay. [Расширенные плакаты](gameplay.md) поддерживают дополнительные изображения и обработку строк. Совпадающие текстовые ключи разных модов могут конфликтовать: задавайте собственный prefix.

## Наклейка с эффектом на очки

Спецификация наклейки задаёт изображение, цену вероятности и данные, но не реализует бонус сама. Самостоятельный entrypoint через `init`; нужен `assets/lucky.png`. Для callbacks EventBus импортируется `Baldic.Events`, предоставляемый Loader.

```csharp
using System;
using Baldic;
using Baldic.Api;
using Baldic.Api.Lua;
using Baldic.Events;
using ContentStickers = Baldic.Api.Lua.Stickers;

namespace OrchardSticker
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            ContentStickers.Register(new StickerSpec
            {
                Id = "orchard:lucky",
                Name = "Удачный урожай",
                Description = "+10% к положительным начислениям очков.",
                Sprite = "assets/lucky.png",
                Floors = new[] { "F1", "F2", "F3" },
                Weight = 40,
                ValueCap = 3
            });
            EventBus.On("points.add", data =>
            {
                int points = (int)data.Args[0];
                if (points <= 0) return;
                int count = ContentStickers.Value("orchard:lucky");
                data.Args[0] = (int)Math.Floor(points * (1.0 + 0.1 * count));
            });
            ModdedHighScores.AddAffectingMod(owner.Id);
            ModdedSaves.AddDummyHandler(owner.Id);
        }
    }
}
```

`Value(id)` считает применённый эффект с cap; `Count(id)` включает и применённые, и переносимые копии. `Give` кладёт наклейку в инвентарь. `Applied`, `Apply`, `Glued`, `SetGlued` работают с индексами слотов от нуля. `OpenPacks` открывает нераспакованные пачки. `Bonus=true` выбирает bonus packs. Вес — относительный выбор внутри подходящих пачек.

Для нестандартного stacking, cover, изображения по состоянию и произвольных данных используйте `StickerBuilder<T>` с `T : ExtendedStickerData, new()`. Переопределяйте `CanStackWith`, `CanCover`, `CanBeCovered`, `StateOnApply`, `CreateState`, `AppliedSprite`, `InventorySprite` и `Apply` по задаче. Собственный `ExtendedStickerStateData` сериализуется через `Write`/`Read`; поддерживайте одинаковый порядок полей и корректный `Copy`. Обычный `VanillaCompatibleStickerData` сохраняет стандартный layout состояния. Подробнее — [stickers](../reference/bbplus/stickers.md).

## Metadata для совместной работы модов

`Meta.Items`, `Meta.NPCs`, `Meta.Events`, `Meta.Scenes`, `Meta.LevelTypes` хранят записи о контенте; начальные записи игры добавляет модуль metadata после warmup. `GetMeta()` может вернуть `null`, если объект ещё не учтён; проверяйте это перед `Tags.Contains`.

Builder сам создаёт metadata. Для существующего контента сначала прочитайте запись, а не перезаписывайте её через `AddMeta` вслепую. `ItemMeta.Group` объединяет варианты одного предмета; флаги `MultipleUse`, `InstantUse`, `NoUses`, `Persists`, `CreatesEntity` описывают свойства, на которые опираются другие моды. Они не реализуют эффект сами. У NPC это `CanHear`, `CanMove`, `CanSee`, `HasTrigger`, `HasSprite` и другие flags; у random events — `RoomSpecific`, `CharacterSpecific`, `AffectsGenerator` и т. д.

Теги — свободные строки; namespace в теге (`orchard:fruit`) уменьшает случайные совпадения. `FindByTags(matchAll, tags)` поддерживает все либо любой тег. `EventRequirements` читает соглашения `requiredC_...` и `requiredR_...`; наличие тега само по себе не создаёт отсутствующую комнату или NPC. Полный контракт — [metadata](../reference/bbplus/metadata.md), [registry](../reference/bbplus/registry.md).

## Ошибки callbacks и выгрузка

У `Characters` и `RandomEvents` текущая реализация отключает **конкретную пару content ID + callback** после пяти ошибок и пишет причину в журнал. `RegisteredItem.Use` обрабатывает ошибку `OnUse` иначе: пишет журнал, уничтожает экземпляр эффекта и возвращает `false`; общего лимита пяти ошибок там нет. Эти callbacks не входят автоматически в owner context — явно входите в него для операций, которым нужен владелец.

Словари зарегистрированного контента, enum и изменения пулов не являются универсально откатываемой транзакцией. `MarkContent` и restart важны при изменении набора контента. Не обещайте пользователю безопасную горячую перезагрузку любого content-мода только потому, что отдельная подписка или ресурс умеет освобождаться.
