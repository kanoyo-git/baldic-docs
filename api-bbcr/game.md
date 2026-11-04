# Игра, режимы и события

`Baldic.Api.Bbcr.Game.dll` предоставляет `Baldic.Bbcr.Game`, `GameEvents`, `Modifiers` и MIDI-подписки `Audio`. В manifest используйте `baldic-api-bbcr-game` либо агрегат. Типы, возвращаемые фасадом, — настоящие классы BBCR из игрового `Assembly-CSharp.dll`.

## Сессия и текущий уровень

| API | Тип | Время жизни и отсутствие |
|---|---|---|
| `Game.Session` | `CoreGameManager` | Нативная сессия; `null` до её создания/после уничтожения |
| `Game.Manager` | `BaseGameManager` | Менеджер текущего уровня; `null` вне уровня |
| `Game.Environment` | `EnvironmentController` | `Manager.Ec`, если менеджер доступен |
| `Game.Classic` | `ClassicBaseManager` | Cast текущего менеджера; возможен `null` |
| `Game.ManagerAs<T>()` | `T : BaseGameManager` | `null`, если текущий менеджер не этого типа |
| `Game.Player(number=0)` | `PlayerManager` | `null` без environment, при неверном индексе или отсутствии игрока |
| `Game.Camera(number=0)` | `GameCamera` | `null` без соответствующего игрока/сессии |
| `Game.Hud(number=0)` | `HudManager` | То же правило доступности |
| `Game.Loader` | `GameLoader` | Поиск активного menu loader; обычно отсутствует в игровой сцене |
| `Game.Input`, `Game.Music` | `InputManager`, `MusicManager` | Нативные singleton; возможен `null` при ранней инициализации |

`Game.IsPlaying` проверяет `Environment.Active`, `Paused` читает состояние сессии, `Endless` — флаг Classic-менеджера. `Free` учитывает `Mode.Free`, `freeRun` и `ClassicFreeManager`. `Style` возвращает nullable `ClassicStyle`: известные менеджеры распознаются напрямую, иначе используется выбранный loader стиль. У неизвестной custom/secret сцены значения может не быть; проверяйте настоящий тип `Manager`, если нужна особая механика.

## Стиль, Story/Endless и Free

В нативном BBCR `ClassicStyle` содержит Classic, Party, Demo, Null; `GameMode` содержит Story и Endless. Free — настройка loader, а не третье значение `GameMode`.

| Стиль | Story | Endless | Free |
|---|---|---|---|
| Classic | `ClassicGameManager` | `ClassicEndlessManager` | `ClassicFreeManager` |
| Party | `ClassicPartyManager` | `PartyEndlessManager` | `ClassicFreeManager` |
| Demo | `ClassicDemoManager` | `DemoEndlessManager` | `ClassicFreeManager` |
| NULL/glitch | `ClassicNullManager` | Отдельной нативной таблицы режима здесь нет | Не обобщать как обычный Free |

`Game.Start(ClassicStyle style, GameMode mode=GameMode.Story)` вызывает нативные `GameLoader.SetStyle` и `StartGame`. Он сохраняет нативный выбор Fun/Free и ветку NULL/glitch, зависящую от прогресса. Передача `ClassicStyle.Null` не выдаёт разблокировку.

`Game.Load(SceneObject scene, GameMode mode=GameMode.Story, int lives=0, int? seed=null)` инициализирует сессию, при наличии seed устанавливает его, затем вызывает нативный `LoadLevel`. Используйте его из главного меню с готовой зарегистрированной сценой. Перед вызовами дождитесь `Loading.Done`: API отвергает начатую и незавершённую загрузку, но не превращает ранний вызов до `Loading.Started` в безопасный способ обойти готовность меню.

Для basement, secret, music room и finale используйте `ManagerAs<ClassicBasementManager>()`, `ManagerAs<ClassicSecretManager>()`, `ManagerAs<ClassicMusicRoomManager>()`, `ManagerAs<ClassicFinaleManager>()`. Доступ к этим типам не означает, что helper запускает или завершает их сюжет за мод.

## Подписка и изменение скорости

Полный пример отдельного мода; сборка требует Loader, Core, Loading, Game и BBCR/Unity references из [настройки](setup.md). Manifest — `init` на эту DLL и зависимость от Game. После начала каждого уровня создаётся отдельный нативный модификатор.

```csharp
using Baldic;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;
using UnityEngine;

[BaldicMod]
public sealed class FasterClassic
{
    public void Init(ModContext context)
    {
        EventBus.On(GameEvents.GameBegin, e =>
        {
            var player = Game.Player();
            if (player == null) return;
            Modifiers.Movement(player,
                new MovementModifier(Vector3.zero, 1.1f));
            Log.Info(context.Id, "Movement modifier attached");
        });
    }
}
```

`Modifiers.Movement` принимает `PlayerManager`, `NPC` или `ActivityModifier`; `Modifiers.Time` принимает environment и `TimeScaleModifier`. Все возвращают `IDisposable`. Дескриптор автоматически принадлежит текущему context; его можно освободить раньше для снятия эффекта. API также снимает свои level-модификаторы при выполненном выходе/перезагрузке и собственной выгрузке. Повторное присоединение **того же экземпляра** modifier к той же цели отвергается: нельзя взять lease на чужой уже установленный объект.

В примере нет ручной записи в `walkSpeed` и обратного присваивания: native movement addends суммируются, multipliers перемножаются, поэтому несколько эффектов могут сосуществовать. Если нужно менять stamina, применяйте реальные методы `PlayerMovement`, например `AddStamina`; API не вводит второй независимый счётчик stamina.

## События и payload

Подписка: `EventBus.On(GameEvents.<имя>, callback, priority)`. У `GameEvent.Instance` находится объект из второй колонки, у `Args` — значения из третьей. Используйте константы: общие четыре топика имеют имена `game.begin`, `player.spawn`, `game.over`, `game.exit`; остальные игровые константы относятся к `bbcr.*`.

| Константа | `Instance` | `Args` |
|---|---|---|
| `GameBegin` | `BaseGameManager` | Пусто |
| `PlayerSpawn` | `PlayerManager` | `CoreGameManager` |
| `GameOver` | `CoreGameManager` | `Transform` игрока, `Baldi`, field-trip `bool` |
| `GameExit` | `CoreGameManager` | Пусто |
| `LevelInitialized` | `BaseGameManager` | Пусто |
| `LevelExit` | `CoreGameManager` | Менеджер, захваченный до выхода |
| `LevelSelected` | `GameLoader` | `SceneObject` |
| `StyleSelected` | `GameLoader` | `ClassicStyle` |
| `NotebookCollected` | `BaseGameManager` | `Notebook` |
| `NotebooksChanged` | `BaseGameManager` | Нативный аргумент количества |
| `ActivityCompleted` | `BaseGameManager` | `bool correct`, `Activity` |
| `Paused` | `CoreGameManager` | Новое состояние `bool` |
| `ItemAdded` | `ItemManager` | `ItemObject` |
| `ItemSet` | `ItemManager` | `ItemObject`, `int slot` |
| `ItemUsed` | `ItemManager` | Предмет, выбранный перед попыткой использования |
| `ItemRemoved` | `ItemManager` | Удалённый `ItemObject`, `int slot` |
| `NpcSpawned`, `NpcDespawned` | `NPC` | Пусто |
| `NpcHeard` | `NPC` | `Vector3 position`, `int priority` |
| `PlayerSighted`, `PlayerLost` | `NPC` | `PlayerManager` |
| `PlayerTeleported` | `PlayerManager` | Новая и предыдущая `Vector3` |
| `ClassicSpoop`, `MathCorrupted` | Менеджер BBCR | Пусто |
| `YctpOpened` | `YCTP` | `ClassicBaseManager` |
| `YctpSubmitted` | `YCTP` | Пусто |
| `RandomEventBegin`, `RandomEventEnd` | `RandomEvent` | Пусто |

### Как читать события правильно

`LevelInitialized` уведомляет о завершении внешнего нативного `Initialize`. Некоторые менеджеры вызывают `BeginPlay` **внутри** него: `GameBegin` тогда придёт раньше. Если нужна геометрия до инициализации менеджера, используйте [Generation](content-world.md). Не стройте универсальный порядок «Initialized → Begin».

Виртуальная цепочка с вызовами `base` даёт одно уведомление для внешнего завершённого вызова. Для пользовательского override, который вообще не вызывает нативный базовый метод, перехват базового класса не обеспечит событие; спавните через `World` и при необходимости публикуйте собственное явно названное событие.

`NotebookCollected` следует за `CollectNotebook`, но Classic может сначала открыть YCTP и лишь затем менять счётчик. `NotebooksChanged.Args[0]` — аргумент нативного вызова, не итог. Для итогового прогресса читайте `Game.Manager.FoundNotebooks`. `YctpSubmitted` сообщает о `SubmitAnswer`, а не о верном ответе. `ActivityCompleted` содержит отдельный `correct`.

`ItemUsed` сообщает о завершившейся попытке использования. Фактическое удаление отслеживайте через `ItemRemoved`. `NpcSpawned` приходит после `NPC.Initialize`; внешний `EnvironmentController.SpawnNPC` ещё может завершать активацию и привязку игроков. Для действий после всего спавна используйте объект, возвращённый `World.SpawnNpc`.

`LevelExit` публикуется после реально выполненного `PrepareForReload` или `ReturnToMenu`. Захваченный прежний менеджер и его scene-объекты к этому моменту уже могут быть уничтожены. При выполненном `ReturnToMenu` дополнительно приходит `GameExit`, очищается фасад. Отменённый mixin-prefix выход не публикует эти события и не снимает level-модификаторы. `LevelSelected` также учитывает выполнение оригинала.

Эти уведомления не являются отменяемыми командами. `e.Cancelled=true` не отменяет нативную операцию; сам EventBus также не прекращает доставку по этому флагу. Отдельный пользовательский listener может читать его по собственному контракту. Для изменения аргументов, результата или отмены используйте [Baldic.Mixins](../mixins/README.md).

## Движение, NPC и звук остаются нативными

Игрок движется через `player.plm` и `PlayerMovement.cc`; NPC — через `npc.Navigator` и `Navigator.Cc`. Методы `Teleport`, `RuleBreak`, `Hide`, `Navigator.FindPath/SetSpeed/WanderRandom`, HUD и инвентарь сохраняют нативные требования и семантику. BBCR не получает `Entity`, `Cell` или машину состояний NPC только от подключения Baldic.

`Baldic.Bbcr.Audio.OnMidi(MusicManager.MidiEventFunction)` передаёт `MidiPlayerTK.MPTKEvent`; `OnMidiLoop(MusicManager.MidiLoopFunction)` — имя MIDI как `string`; `OnMidiTransition(Action)` — уведомление без аргументов. Подписки возвращают owned lease, восстанавливают context и снимаются даже после уничтожения нативного MusicManager. Для непосредственного использования `MPTKEvent` добавьте сборку с этим типом из Managed BBCR.

Проигрывание выполняет `Game.Music.PlayMidi(string, bool)`, а обычные звуки — нативный `AudioManager.PlaySingle`, очередь, loop/fade/pause. У `Baldic.Api.Audio` другая роль: он импортирует `AudioClip` из файла. В [рецептах](recipes.md) показано создание игрового звука и безопасная замена существующего.

Далее: [определения контента и геометрия](content-world.md). Полный контракт: [справочник Game](../reference/bbcr/game.md).
