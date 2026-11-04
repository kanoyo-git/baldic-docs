# Практические рецепты

Здесь каждый C# блок — самостоятельный файл для проекта из [начала работы](setup.md). Указывайте соответствующий класс в entrypoint manifest. Выбирайте один рецепт за раз или осознанно объединяйте entrypoints и зависимости. Зависимости `baldic-api` достаточно для всех примеров; ID `orchard` используется как пример владельца.

## Выдать зарегистрированный предмет в начале этажа

Этот entrypoint вызывается через `init` **в дополнение** к регистрации `orchard:apple` из первой главы. Если оформляете его отдельным пакетом, добавьте зависимость от пакета `orchard`, чтобы порядок регистрации был явным. Callback `game.begin` — момент, когда можно работать с инвентарём, в отличие от `AssetsFinal`.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Events;

namespace OrchardGift
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            EventBus.On("game.begin", data =>
            {
                if (!Game.InLevel) return;
                if (Inventory.Give("orchard:apple"))
                    Hud.Message("Вы получили садовое яблоко", 3f);
                else
                    Log.Warn(owner.Id, "Не удалось выдать яблоко: инвентарь заполнен");
            });
        }
    }
}
```

Это выдача на каждый `BeginPlay`; для выдачи один раз за забег храните признак в [save handler](saves.md). Для гарантированного предмета на полу используйте `Levels.ForceItem`; это другая механика, которая зависит от генератора. Пример намеренно использует `Inventory.Give`, потому что `Baldic.Api.Lua.Items.Give` подтверждает наличие игрока и предмета, но не проверяет свободный слот до вызова игрового `AddItem`.

## Одноразовый подарок по клику в мире

Самостоятельный entrypoint `init`; нужен `assets/gift.png`. Объект появляется в случайной точке первой найденной hallway room после `game.begin`. Если игрок освободил место и кликнул, он получает Quarter, а prop исчезает.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Events;

namespace OrchardGiftProp
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            EventBus.On("game.begin", data =>
            {
                if (!Game.InLevel) return;
                RoomController[] halls = Rooms.OfCategory("Hall");
                if (halls.Length == 0) return;
                var position = Rooms.RandomSpot(halls[0]);
                if (!position.HasValue) return;
                Props.Spawn(new PropSpec
                {
                    Sprite = "assets/gift.png",
                    Size = 3f,
                    Solid = false,
                    OnClick = (prop, player) =>
                    {
                        using (owner.Enter())
                        {
                            if (!Inventory.Give("Quarter", player.playerNumber)) return;
                            prop.Remove();
                        }
                    }
                }, position.Value);
            });
        }
    }
}
```

`PropSpec.OnClick` получает `PlayerManager`, поэтому пример выдаёт предмет именно кликнувшему игроку через его номер. Не путайте это с `ItemSpec.OnUse`, где аргументом является `PlayerMovement`. Собственные `Prop.Get`/`Set` пригодятся для счётчика кликов, но не переживут закрытие уровня без save handler.

## Личная статистика завершённых этажей

Самостоятельный entrypoint `init`, без ресурсов. `Storage.Add` пишет в профиль сразу; возвращённое число можно показать в меню статистики. В callback завершения не требуется доступ к HUD, который может уже закрываться.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Events;

namespace OrchardProgress
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            EventBus.On("level.finish", data =>
            {
                double total = Storage.Add("finishedFloors", 1, mod: owner.Id);
                Log.Info(owner.Id, "Пройдено этажей в профиле: " + total);
            });
        }
    }
}
```

Это счётчик событий завершения, а не система защиты от повторного прохождения. Загрузка старого save slot не откатит профильную статистику. Если счётчик должен откатываться вместе со слотом, замените Storage на данные handler из [главы о сохранениях](saves.md).

## Анимировать свой SpriteRenderer

Ниже самостоятельный helper, **без entrypoint**. Вызовите `AnimationSetup.Attach(owner, target)` после создания собственного `GameObject target` на уровне. Нужен `assets/fire.png` — sheet из четырёх кадров в ряд. Helper требует существующий `SpriteRenderer`, создаёт только animator, владеет им через `OwnObject` и не добавляет renderer к произвольному чужому объекту.

```csharp
using System;
using Baldic;
using Baldic.Api;
using UnityEngine;

namespace OrchardAnimation
{
    public static class AnimationSetup
    {
        public static SpriteRendererAnimator Attach(ModContext owner, GameObject target)
        {
            var renderer = target.GetComponent<SpriteRenderer>();
            if (renderer == null) throw new ArgumentException("Нужен SpriteRenderer", nameof(target));
            using (owner.Enter())
            {
                var sheet = Textures.FromMod(owner.Id, "assets", "fire.png");
                Sprite[] frames = Sprites.SliceByCount(sheet, 4, 1, 50f);
                var animator = owner.OwnObject(target.AddComponent<SpriteRendererAnimator>());
                animator.spriteRenderer = renderer;
                animator.ec = Game.Env;
                animator.timeScale = TimeScaleType.Environment;
                animator.AddAnimation("idle", new FrameAnimation<Sprite>(8, frames));
                animator.Play("idle", 1f, true);
                return animator;
            }
        }
    }
}
```

`timeScale` и `ec` выбраны для анимации уровня. Для меню этот EnvironmentController отсутствует: выберите подходящую шкалу, а не сохраняйте старый `Game.Env`. В `Attach` нет кэша: вызывайте один раз на создаваемый объект, а не каждый `Update`. Для большого числа одинаковых props загрузите sheet один раз и переиспользуйте кадры на протяжении жизни владельца.

## Повторно применить перевод к новой сцене

Для перевода данных зарегистрируйте `Localization.RegisterMod` либо provider в `Init`. Для изменённых картинок/шрифтов UI сцены используйте её фактическую инициализацию и собственный кэш. Мод русификации TWGS следует именно этой схеме: entrypoint создаёт owned Unity-компонент, регистрирует translation provider и refresh, собирает индекс файлов, ставит loading coroutine для тяжёлых ресурсов, затем повторно применяет оформление к созданным сценам. Одна замена компонентов стартового меню не охватывает будущие экземпляры.

Обработчик `SceneManager.sceneLoaded` — обычное событие Unity: сохраните `owner`, начните с проверки `owner.Active`, войдите в `using (owner.Enter())`, а отписку добавьте через `owner.Own(new Cleanup(...))`. При пакетной загрузке отдавайте кадр через `yield return null` по накопленному времени работы, не только по количеству файлов. Это сохраняет отзывчивость экрана загрузки, но не делает Unity texture/audio API потокобезопасным.

## Движение, собственный patch и обычные API вместе

Мод HL1 Movement показывает разделение обязанностей: `Init` создаёт `Mixin.PatchSet` с owner, привязывает config и клавиши, подписывает frame callback и cleanup, а `AssetsStart` регистрирует игровой предмет. Callback изменения config и frame-действие явно восстанавливают `owner.Enter()`. При cleanup мод выключает собственный режим, останавливает свои level-компоненты, отписывается и освобождает patches.

Этот шаблон полезен, когда gameplay API недостаточно для новой физики. Сначала используйте готовые `Player`, `Npcs`, `World`, `PlayerCamera` для поддерживаемых операций, а конкретные отсутствующие точки расширяйте [Mixins](../mixins/README.md). Не превращайте каждое действие в reflection-перехват и не предполагайте, что BBCR использует те же типы движения: у общего мода должны быть отдельные backend-адаптеры.

## Как расширять пример без потери проверяемости

Добавляйте один наблюдаемый результат за раз: сначала `Get(id)` после подготовки, затем выдача в inventory, использование, добавление в пул, магазин, сохранение и переход. Для NPC сначала prefab и spawn на рабочем уровне, затем зрение/контакт, затем случайная генерация. Для звука сначала `AudioClip`, затем `SoundObject` и subtitle, затем spatial playback или TV.

К каждому новому ресурсу проверяйте упаковку и регистр пути; к callback — момент вызова, owner и очистку; к механике — поведение после загрузки сохранения. Если операция изменила баланс, добавьте affecting mod для результатов и нужный save handler. [Диагностика](diagnostics.md) даёт контрольные точки и типовые причины отказа.
