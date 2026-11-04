# Практические рецепты BBCR

Примеры этой главы — отдельные моды. Для каждого используйте проект из [настройки SDK](setup.md), свой `baldic.mod.json` с `init` entrypoint на DLL и зависимость от агрегата `baldic-api-bbcr`. Не объединяйте несколько примеров с одинаковыми ID в одном пакете. Код не предполагает наличие BB+ сборок.

## Мод целиком: настройка скорости, меню и предмет

Цель: конфиг хранит включение и multiplier, меню редактирует их, начало уровня применяет owned movement modifier и создаёт pickup, а импортированное изображение становится иконкой предмета. При изменении конфига во время игры эффект пересоздаётся; при выходе lease освобождается. Это объединяет [Loading](loading-assets.md), [Game](game.md), [Content](content-world.md) и [UI](ui.md).

1. Создайте проект с именем сборки `FieldKit`. В manifest задайте ID `field-kit`, `init: ["FieldKit.dll"]`, зависимости `baldic`, `bbcr`, `baldic-api-bbcr` по первому уроку.
2. Добавьте в пакет `Textures/drink.png`: обычный PNG с прозрачным фоном. Один sprite используется для обеих игровых иконок ради короткого примера; для релиза подготовьте отдельно подходящие размеры small/large.
3. Добавьте к project references совместимую `BepInEx.dll`, потому что `AcceptableValueRange` имеет совместимый базовый тип. Остальные ссылки — Loader, все BBCR API DLL и BBCR game/Unity из setup.
4. Сохраните следующий полный код в `Mod.cs`, соберите и проверьте пакет.

```csharp
using System;
using System.Collections.Generic;
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;
using Baldic.Loader.Configuration;
using UnityEngine;

public sealed class FieldKitDrink : Item
{
    public override bool Use(PlayerManager player)
    {
        player.plm.AddStamina(25f, true);
        Destroy(gameObject);
        return true;
    }
}

[BaldicMod]
public sealed class FieldKit
{
    private ConfigEntry<bool> enabled;
    private ConfigEntry<float> speed;
    private IDisposable movement;
    private ItemObject drink;

    public void Init(ModContext context)
    {
        enabled = context.Config.Bind("General", "Enabled", true,
            "Enable the movement effect and the drink pickup.");
        speed = context.Config.Bind("Movement", "Multiplier", 1.1f,
            new ConfigDescription("Player speed multiplier.",
                new AcceptableValueRange<float>(0.5f, 2f)));

        EventHandler changed = (sender, args) =>
        {
            using (context.Enter()) ApplyMovement();
        };
        enabled.SettingChanged += changed;
        speed.SettingChanged += changed;
        context.Own(new Cleanup(() =>
        {
            enabled.SettingChanged -= changed;
            speed.SettingChanged -= changed;
            movement?.Dispose();
        }));

        Localization.RegisterProvider(language => new Dictionary<string, string>
        {
            ["FIELDKIT_Name"] = "Напиток отдыха",
            ["FIELDKIT_Description"] = "Восстанавливает 25 единиц выносливости."
        });
        Loading.Register(context.Id, () =>
        {
            var texture = Textures.FromMod(context.Id, "Textures", "drink.png");
            var icon = Sprites.FromTexture(texture, pixelsPerUnit: 100f);
            drink = Builders.Item<FieldKitDrink>("drink", "FIELDKIT_Name",
                "FIELDKIT_Description", icon, icon, cost: 10, price: 20);
        }, LoadingStage.Start);

        EventBus.On(GameEvents.GameBegin, e => ApplyMovement());
        EventBus.On(GameEvents.LevelExit, e =>
        {
            movement?.Dispose();
            movement = null;
        });
        EventBus.On(GameEvents.LevelInitialized, e =>
        {
            if (!enabled.Value || drink == null) return;
            var player = Game.Player();
            var environment = Game.Environment;
            if (player == null || environment == null) return;
            var tile = World.Tile(environment, player.transform.position);
            if (tile != null)
                World.SpawnItem(environment, tile.room, drink,
                    tile.transform.position + Vector3.up * 5f);
        });

        Menus.Register("field-kit.settings", "Field Kit", page =>
        {
            page.Label("Applies to the current player and future level starts.")
                .Toggle("Enabled", () => enabled.Value, value =>
                {
                    enabled.Value = value;
                    context.Config.Save();
                })
                .Number("Speed", () => speed.Value, value =>
                {
                    speed.Value = value;
                    context.Config.Save();
                }, 0.1f)
                .Button("Start Classic Story", () =>
                {
                    if (!Loading.Done || Game.Manager != null)
                        throw new InvalidOperationException("Return to the ready main menu.");
                    Menus.Close();
                    Game.Start(ClassicStyle.Classic, GameMode.Story);
                });
        });
    }

    private void ApplyMovement()
    {
        movement?.Dispose();
        movement = null;
        var player = Game.Player();
        if (enabled.Value && player != null)
            movement = Modifiers.Movement(player,
                new MovementModifier(Vector3.zero, speed.Value));
    }
}
```

Откройте страницу Field Kit, измените multiplier и запустите Classic Story. Нативная настройка Free сохраняется `Game.Start`: если на обычном menu loader заранее включён Free, этот вызов следует ему. Для строго Story-проверки заранее выключите Free в нативном меню; код не переписывает флаги профиля.

Подберите и используйте напиток при неполной stamina. Проверьте повторный старт, возврат в меню и повторное открытие настроек. Настройки также доступны через автоматическую Mods → ваш мод → Settings; обработчик `SettingChanged` обновит действующий модификатор. Если выключить модовый эффект после появления pickup, уже созданный предмет останется в мире: флаг управляет созданием на следующих стартах, а не поиском и уничтожением всех ранее выданных объектов.

Здесь созданы отдельные lifetimes: definitions/иконка и registration живут с контекстом мода, экземпляр pickup — с игровой сценой и ownership, movement lease — до пересоздания/выхода. `ApplyMovement` сначала освобождает прежний lease, поэтому изменение значения не накапливает множители. `Modifiers` дополнительно умеет очищать свои leases на нативной перезагрузке; повторный Dispose допустим.

## Заменить озвучку и вернуть оригинал

Для существующей vanilla-озвучки есть два подхода. Изменение `SoundObject.soundClip` сохраняет ссылки всех потребителей этого SoundObject, но требует восстановления поля. Создание нового `Builders.Sound` даёт собственное определение, однако потребителей надо явно переключить на него. Пример выбирает первый подход и сохраняет оригинал для cleanup.

Это отдельный полный `Mod.cs`; положите в пакет `Audios/replacement.wav`. Нужны Core, Loading, Assets, Loader, совместимая SDK `BepInEx.dll` для `context.Config` и игровые ссылки. Для точного выбора укажите в конфиге **имя SoundObject**, полученное из текущего BBCR-каталога: имя WAV-клипа и имя SoundObject не обязаны совпадать. Намеренно пустое значение приводит к понятной ошибке задания до установки замены.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;
using FileAudio = Baldic.Api.Audio;

[BaldicMod]
public sealed class ReplaceVoice
{
    public void Init(ModContext context)
    {
        var targetName = context.Config.Bind("Voice", "SoundObject", "",
            "Exact native SoundObject name to replace.");

        Loading.Register(context.Id, () =>
        {
            var target = Assets.Require<SoundObject>(targetName.Value);
            var replacement = FileAudio.FromMod(context.Id,
                "Audios", "replacement.wav");
            var original = target.soundClip;
            target.soundClip = replacement;
            context.Own(new Cleanup(() =>
            {
                if (target != null && target.soundClip == replacement)
                    target.soundClip = original;
            }));
        }, LoadingStage.Start);
    }
}
```

Cleanup проверяет, что поле всё ещё содержит нашу замену: он не затирает более позднее вмешательство другого мода. В больших локализациях этого недостаточно для всех сцен — вновь загруженные SoundObject и Timeline assets требуют отдельного обхода и явного ownership. Если меняете `subDuration`, subtitle key или другие поля, сохраните и восстановите **каждое изменённое поле**. Один новый клип не обновляет метаданные субтитров автоматически.

Для текстур также различайте ссылочную замену и `Textures.ReplaceInPlace`. Нативные материалы и sprite могут ссылаться на прежний объект, поэтому замена переменной не всегда меняет изображение. In-place операция возвращает bool и имеет требования формата/размеров; сохраняйте совместимую резервную копию и проверяйте результат. Не редактируйте нечитаемую/compressed texture как обычный массив Color без соответствующего преобразования.

## NPC и случайное событие

Для NPC сначала выберите рабочий шаблон по наличию Navigator и нужных native-компонентов. Создайте `Builders.Npc<T>(id, template, configure)`, затем в готовом environment вызовите `World.SpawnNpc(environment, definition, tilePosition)`. У полученного экземпляра можно вызвать нативные `Navigator.SetSpeed`, `TargetPosition`, `Hear` согласно правилам его поведения. Добавление definition в `Content` само по себе не включает NPC в `environment.Npcs`.

В `T : NPC` вызывайте `base.Initialize()`, если рассчитываете на нативную инициализацию и GameEvents. Нельзя заменить современный BB+ BehaviourState на одноимённый отсутствующий класс BBCR. Для сложного NPC сначала проверьте собственную логику через нативные virtual callbacks этой игры.

Для события создайте `Builders.RandomEvent<T>`, затем `World.ScheduleEvent(environment, definition, generationRandom, delay)`. В override `Begin` вызывайте base и устанавливайте эффект, в `End` снимайте **свой** эффект и вызывайте base. Регистрировать свои эффекты только в Begin без реализации End опасно для отмены/выгрузки. Duration задаётся min/max фабрики, момент запуска — delay; это разные параметры.

## Диагностика по симптому

| Симптом | Что проверить |
|---|---|
| DLL собирается, но `Init` не вызывается | Manifest entrypoint, ID/имя DLL, зависимости и ошибка пакета |
| `Require` не находит объект | Стадию Loading, точное имя/тип, различие name и Resources path |
| Custom Item есть в реестре, но нет в уровне | Вызван ли `World.SpawnItem`/native inventory и где находится pickup |
| Пул содержит NPC/предмет, но он не появляется | Использует ли конкретный native loader/builder этот пул |
| Счётчик тетрадей отстаёт от события | `NotebookCollected` против `NotebooksChanged` и `FoundNotebooks` |
| Несколько ускорений после изменения настройки | Освобождается ли предыдущий modifier lease |
| Ошибка «inside a mod context» | Идёт ли вызов из обычного Unity callback без `context.Enter()` |
| Окно/дверь есть, NPC не проходит | Native connection, соседние tiles и необходимость rebuild nav mesh |
| Custom save сбрасывается/не читается | Реальный slot, owner, версия DTO, exception вместо молчаливого fallback |

Последний раздел: [перенос с BB+ и реальных модов](porting.md).
