# Работающий уровень и расширения gameplay

Фасады `Baldic.Api.Game`, `Player`, `Inventory`, `Npcs`, `World`, `Rooms`, `Sounds`, `Hud` сокращают обычные действия в BB+. Они работают с реальными игровыми объектами. Имена контента обычно разрешаются без учёта регистра через `Catalog`, но программный ID зарегистрированного контента лучше передавать точно, например `orchard:apple`.

## Проверяйте наличие мира

`Game.Core` живёт в течение забега, `Game.Manager` — manager этажа, `Game.Env` — его `EnvironmentController`. `Game.InLevel` дополнительно требует игрока 0. `Game.Playing` отражает готовность игры после нажатия Play в лифте. `Game.Scene` и `LevelTitle` могут существовать раньше игрока.

Нет общего правила «все методы безопасны в меню». Свойства вроде `InLevel` вернут `false`, `Game.Player()` — `null`, списки NPC/комнат часто будут пустыми. Методы, которым нужен объект (`Player.Position`, `PlayerCamera.Offset`, `Hud.Tooltip`, некоторые методы `World`), могут бросить исключение. Проверьте `Game.InLevel`, затем конкретный результат поиска. `Npcs.Find` может вернуть `null` даже на работающем этаже: нужный NPC мог не появиться.

## События BB+ и их данные

Импортируйте `Baldic.Events`; источник событий игры устанавливает модуль `baldic-api-game`. Приоритет выше — callback раньше; при равенстве сохраняется порядок регистрации. Изменение подписок внутри dispatch влияет на следующий dispatch. `EventBus.On` возвращает `IDisposable`, владелец берётся из текущего context; dispatch восстанавливает его перед callback.

| Событие | `Instance` | `Args` от индекса 0 / момент |
|---|---|---|
| `scene.loaded` | `null` | имя сцены, load mode как `int` |
| `menu.open` | `MainMenu` | после `Start` |
| `level.generate` | `LevelBuilder` | после `StartGenerate`; это ещё не обещание готового мира |
| `player.spawn` | `PlayerManager` | после `Start`; игрок — в `Instance`, Args пуст |
| `game.begin`, `spawn.exit` | `BaseGameManager` | после BeginPlay / ExitedSpawn |
| `level.finish`, `level.restart`, `game.over` | `BaseGameManager` | после соответствующего перехода |
| `game.exit` | `CoreGameManager` | после доступного ReturnToMenu |
| `notebook.collect` | `BaseGameManager` | `Notebook` |
| `notebook.all` | `BaseGameManager` | переход к собранным тетрадям |
| `activity.complete` | `BaseGameManager` | `bool correct`, `Activity` |
| `spoop.begin` | `BaseGameManager` | после начала spoop mode |
| `baldi.anger` | `BaseGameManager` | `float amount` |
| `npc.spawn` | созданный `NPC` | Args пуст |
| `player.caught` | `Baldi` | `PlayerManager`; prefix, можно отменить |
| `points.add` | `CoreGameManager` | `int points`, `int player`, `bool animate`, `bool levelTotal`, `bool multiply`; mutable, отменяемое |
| `music.play` | `MusicManager` | `string song`, `float volume`, `bool loop`; mutable, отменяемое |

`GameEvent.Cancel()` влияет только там, где hook проверяет `Cancelled`. Например, отмена `game.begin` не откатывает уже выполненный `BeginPlay`. В `points.add` сохраняйте типы аргументов: boxed `int` для очков, `bool` для флагов. `EventBus.Emit` позволяет собственные синхронные события, но они не становятся hooks игры автоматически. Об атрибутах и hooks — [Loader lifecycle](../loader/lifecycle.md), [Mixins](../mixins/README.md).

## Временный бонус скорости

Самостоятельный файл для проекта из [начала работы](setup.md), entrypoint `init`, без ресурсов. При появлении игрока мод добавляет множитель ходьбы на пять секунд. Повторный `player.spawn` для того же игрока сначала снимает прежний бонус, а cleanup снимает оставшиеся при выгрузке владельца.

```csharp
using System.Collections.Generic;
using Baldic;
using Baldic.Api;
using Baldic.Events;

namespace OrchardSpeed
{
    [BaldicMod]
    public sealed class Mod
    {
        private readonly Dictionary<PlayerStatModifiers, ValueModifier> active =
            new Dictionary<PlayerStatModifiers, ValueModifier>();

        public void Init(ModContext owner)
        {
            EventBus.On("player.spawn", data =>
            {
                var player = data.Instance as PlayerManager;
                if (player == null) return;
                var stats = player.GetModifiers();
                if (active.TryGetValue(stats, out var old)) stats.RemoveModifier(old);
                var bonus = new ValueModifier(multiplier: 1.5f);
                active[stats] = bonus;
                stats.AddModifier(PlayerStat.WalkSpeed, bonus);
                stats.Apply();
                Timers.After(5f, () =>
                {
                    if (stats != null) stats.RemoveModifier(bonus);
                    if (active.TryGetValue(stats, out var current) && current == bonus)
                        active.Remove(stats);
                });
            });
            owner.Own(new Cleanup(() =>
            {
                foreach (var pair in active)
                    if (pair.Key != null) pair.Key.RemoveModifier(pair.Value);
                active.Clear();
            }));
        }
    }
}
```

`PlayerStatModifiers` хранит базовое значение и список modifiers: **base × произведение Multiplier + сумма Addend**. Пять доступных stats: `StaminaRise`, `StaminaMax`, `StaminaDrop`, `WalkSpeed`, `RunSpeed`. `GetModifiers` добавляет компонент лениво и снимает базовые значения с игрока. `Apply` записывает итог сейчас, дальше компонент делает это в `Update`. Прямое присваивание `walkSpeed` после этого может быть перезаписано.

Сохраняйте собственный `ValueModifier` и удаляйте именно его; не очищайте список чужих модов. `ChangeBaseStat` меняет базу, а не абсолютный итог при наличии других modifiers. Максимум выносливости не равен текущей выносливости: для восстановления используйте `Player.SetStamina(Player.StaminaMax())` либо конкретный `PlayerMovement.stamina`.

## Таймеры и переходы

`Timers.After(seconds, callback, realTime=false)` выполняется один раз; `Every` повторяется, `NextFrame` использует следующий tick. По умолчанию это Unity game time (`Time.deltaTime`), который останавливается с паузой; это не отдельный `EnvironmentTimeScale`. `realTime=true` использует `unscaledDeltaTime`. Интервал `Every` должен быть положительным. `TimerHandle.Cancel` отменяет выполнение.

Таймеры помнят context и снимаются при удалении владельца. Они **не привязаны автоматически к одному этажу**: callback после перехода должен проверить мир или отменяться при переходе. В текущей реализации первое exception таймера вызывает `Runtime.ReportFailure` и отключает таймер; лимит пяти ошибок, описанный у отдельных registries, к таймерам не относится.

## Игрок, инвентарь и камера

`Player.Position`, `Forward`, `CurrentCell`, `CurrentRoom` дают положение, а `Teleport`/`TeleportToCell` перемещают через игровой механизм. Внутри ячейки BB+ координаты масштабируются по 10 единиц; не смешивайте grid и world coordinates. `Stamina`, `SetStamina`, `AddStamina`, `AddSpeed`, `AddStatModifier` управляют выносливостью и скоростью, `Push`, `Squish`, `BreakRule` — взаимодействием с игровыми системами. Для совместимых бонусов используйте modifiers выше, а не повторные присваивания каждый кадр.

`Inventory.Give(name)` проверяет свободное место и возвращает успех; неизвестное имя бросает `ArgumentException`, а не возвращает `false`; `Has`, `Count`, `Take` работают по имени, `Slot`, `SetSlot`, `ClearSlot` — по индексу от нуля. `UseSelected` запускает обычное использование, `UseEffect` — эффект без расходования слота. `SetSize` ограничен поддерживаемыми игрой размерами 1–9; sticker-бонусы учитываются отдельно. `LockSlot` и `Disable` запрещают использование, не удаляя предметы.

`PlayerCamera.AddTilt` и `AddOffset` возвращают `CameraModifier`; сохраните его и передайте `Remove`, чтобы снять только своё воздействие. `SetFieldOfView` меняет угол, `SetFreeLook` включает вертикальный обзор, `Shake` создаёт временную тряску. `Watch` переключает цель наблюдения, `StopWatching` возвращает её. `LevelMap` раскрывает клетки/комнаты, добавляет arrows/markers и открывает карту; `Reveal` влияет на механику обнаружения и требует готовой карты.

## NPC: prefab и живой экземпляр

`Catalog.Npc(name)` возвращает asset/prefab; `Npcs.Find`, `All`, `Of`, `Nearest` ищут NPC текущего уровня. Изменение prefab не является управлением уже существующим экземпляром. `SpawnRandom`, `SpawnAt`, `Spawn` требуют готовый EnvironmentController; `Despawn` удаляет экземпляр.

`Npcs.GoTo`, `Wander`, `Chase`, `SetSpeed` влияют на движение, но родное поведение NPC может вернуть своё состояние. `SetSpeedMultiplier` действует поверх собственных скоростей, включая особенности Baldi. `SetFrozen`, `SetBlind`, `SetDeaf`, `SetEnabled`, `SetSilent`, `SetInvisible` решают разные задачи: невидимость не означает отсутствие collider, а mute не означает отключённую логику. `KeepCoroutinesWhenOff` — явная адаптация coroutine конкретных игровых типов к отключению объекта, а не универсальный pause всех корутин Unity.

`NpcObstacle` добавляет box-ограничение физического шага: NPC скользят вдоль него, но pathfinding не перестраивает маршруты вокруг коробки. Обновляйте `SetBounds` при перемещении собственного препятствия и вызывайте `Remove` при удалении. Для полноценной навигации мобильной мебели этого недостаточно.

## Мир, комнаты и предметы сцены

`World.CellAt`, `GridOf`, `CenterOf`, `Cells`, `RandomCell` связывают grid и world positions; `RoomAt`/`Rooms` находят комнаты. `World.SpawnItem` создаёт pickup, а не выдаёт предмет напрямую в инвентарь. `SpawnObject` использует имя уже загруженного prefab; проверьте `ObjectNames` вместо угадывания имён.

`Doors`, `Windows`, `LockAllDoors`, `BreakWindow`, `SetAllLights`, `SetRoomLightColor`, `OverrideLighting` управляют текущим миром. Согласовывайте глобальные изменения: `RestoreLighting` не восстанавливает произвольный стек независимых эффектов нескольких модов. `StartEvent` проигрывает объявление и jingle, `BeginEvent` запускает сразу, `BeginNewEvent` создаёт свежий экземпляр даже при уже работающем событии того же типа. `EndEvent` останавливает и таймер события. Специальная комната события должна существовать; `EnsureEventSpawnRoom` помогает конкретным spawner-событиям, а не строит любую требуемую комнату.

`Rooms.AddFunction(room, RoomFunctionSpec)` назначает callbacks входа/выхода игрока или NPC и `OnUpdate`. `AddToEveryLevel(category, spec)` ставит standing-регистрацию для категории. `ScriptedRoomFunction` отключает конкретный callback после пяти ошибок; это самостоятельная модель ошибок, отличная от EventBus. При вызовах owner-dependent API внутри room callbacks входите в сохранённый context явно.

`Props.Spawn(PropSpec, position)` создаёт sprite-объект с `OnClick`, `OnSighted`, `OnUnsighted`; `Size` — высота в игровых единицах, `Solid` включает простую коллизию. `SetSprite`, `MoveTo`, `SetVisible`, `Get`/`Set`, `Remove` работают с экземпляром. Props живут на уровне, состояние словаря не сериализуется автоматически. Рецепт — [кнопка в мире](recipes.md).

## Остальные игровые системы

| Задача | Фасад и практическая граница |
|---|---|
| Звук и субтитры | `Sounds.Play` для игрока, `PlayAt` для точки, `PlayOn` для объекта; `Caption` без звука; MIDI и файловая музыка — разные методы |
| Сообщение/картинка/HUD | `Hud.Message`, `ShowImage`, `Overlay`, `Tooltip`, `ShowGauge`; координаты картинок от верхнего левого угла 480×360; нужен HUD |
| Магазин | сначала `Shop.Exists`; `SetItem`, `SetPrice`, `Restock`; `Free` влияет на все покупки, включая карту и restock |
| Задания | `Activities.Solve` выполняет игровое решение с очками/тетрадью; `Complete` только вызывает соответствующий completion; проверяйте нужную семантику |
| Структуры | `Structures` ищет конвейеры, лифты, рычаги, steam valves, teleporters, wormholes и краны текущего уровня; объекты могут отсутствовать на конкретном типе этажа |
| Режим | `Modes` управляет life mode, challenge, mirror, lantern; такие изменения влияют на баланс и high scores |
| Поездка | `Baldic.Api.Lua.FieldTrips`: текущий trip, доступность автобуса, `SetTrip`, `Start`, результат minigame; `Start` вернёт false при отсутствии автобуса |
| Постоянные ключи | `Storage` пишет профильные/общие значения сразу; [это не состояние слота](saves.md) |
| Список контента | `Catalog.Item/Npc/Event/Scene/Sound/Poster/Room`, `*Names`, `Asset<T>`; ищет загруженные assets, не обещает незагруженный контент |
| Corruption | `Effects.Vector2Corruption`/`Vector3Corruption` влияют на создаваемые числовые векторы; глобальный эффект требует осторожной проверки и восстановления |

## Gameplay: анимация, TV, плакаты, culling

`FrameAnimation<T>` содержит значения кадров и длительность; `FrameAnimator<T>` воспроизводит именованные клипы с default animation, loop, pause, speed и timescale. Для sprite renderer выберите `SpriteRendererAnimator`, для UI — `ImageAnimator`/`RawImageAnimator`, для углов — rotator-аниматоры. Назначьте целевой renderer/image, `ec` и шкалу времени; добавьте animation через `AddAnimation`, затем `Play`. Пустой или неправильный sheet не превращается в рабочую анимацию автоматически.

`VolumeAnimator` выбирает клип по громкости `audioSource`; `AudioLoudness.Current` и `Loudness.Index` дают составляющие алгоритма. `FakeAnimators` направляет поддерживаемые вызовы Unity Animator на `ISimpleAnimator`; это совместимость определённых операций, а не исполнение любого AnimatorController и всех переходов.

`BaldiTvCharacters.Register(id, new SimpleTvCharacter(frames, sounds))` задаёт TV-персонажа. `QueueCharacter(tv, id, sound)` ставит его для конкретного звука; `CharacterFor` определяет выбор по звуку. Для собственной сложной речи наследуйте `TvCharacter` и реализуйте `OwnsSound`/`Speak`. Загружайте кадры и звук заранее, а не при каждом объявлении.

`ExtendedPosterObject.overlays` рисует дополнительные изображения поверх poster, максимум `ExtendedPosters.MaxOverlays == 10`. `ExtendedPosterTextData.formats` содержит локализационные ключи аргументов `string.Format`, `replacements` — regex-подстановки по порядку. Неверный формат не заменяет проверку локализации и визуального результата.

`CullingPoint` на объекте альтернативной камеры расширяет видимые chunks от её позиции. Он не перемещает игровую камеру и не исправляет произвольный custom renderer. Для портала перемещайте marker вместе с камерой; вне уровня `ChunkId=-1`. Больше markers означает больше видимой геометрии и стоимость вычислений.

Точные сигнатуры всех фасадов — [game](../reference/bbplus/game.md), расширений — [gameplay](../reference/bbplus/gameplay.md), базовой анимации — [core](../reference/bbplus/core.md).
