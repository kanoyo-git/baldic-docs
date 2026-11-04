# BBCR: game

Сборка: `Baldic.Api.Bbcr.Game.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `Audio`

`Baldic.Bbcr.Audio`

```text
public static class Audio
public static System.IDisposable OnMidi(MusicManager.MidiEventFunction callback);
public static System.IDisposable OnMidiLoop(MusicManager.MidiLoopFunction callback);
public static System.IDisposable OnMidiTransition(System.Action callback);
```

## `Game`

`Baldic.Bbcr.Game`

```text
public static class Game
public static CoreGameManager Session { get; }
public static BaseGameManager Manager { get; }
public static EnvironmentController Environment { get; }
public static ClassicBaseManager Classic { get; }
public static InputManager Input { get; }
public static MusicManager Music { get; }
public static bool IsPlaying { get; }
public static bool Paused { get; }
public static bool Endless { get; }
public static bool Free { get; }
public static System.Nullable<ClassicStyle> Style { get; }
public static GameLoader Loader { get; }
public static T ManagerAs<T>() where T : BaseGameManager;
public static PlayerManager Player(int number = 0);
public static GameCamera Camera(int number = 0);
public static HudManager Hud(int number = 0);
public static void Start(ClassicStyle style, GameMode mode = (GameMode)0);
public static void Load(SceneObject scene, GameMode mode = (GameMode)0, int lives = 0, System.Nullable<int> seed = default);
```

## `GameEvents`

`Baldic.Bbcr.GameEvents`

```text
public static class GameEvents
public const string GameBegin = "game.begin";
public const string PlayerSpawn = "player.spawn";
public const string GameOver = "game.over";
public const string GameExit = "game.exit";
public const string LevelInitialized = "bbcr.level.initialized";
public const string LevelExit = "bbcr.level.exit";
public const string LevelSelected = "bbcr.level.selected";
public const string StyleSelected = "bbcr.style.selected";
public const string NotebookCollected = "bbcr.notebook.collected";
public const string NotebooksChanged = "bbcr.notebooks.changed";
public const string ActivityCompleted = "bbcr.activity.completed";
public const string Paused = "bbcr.pause.changed";
public const string ItemAdded = "bbcr.item.added";
public const string ItemUsed = "bbcr.item.used";
public const string ItemRemoved = "bbcr.item.removed";
public const string ItemSet = "bbcr.item.set";
public const string NpcSpawned = "bbcr.npc.spawned";
public const string NpcDespawned = "bbcr.npc.despawned";
public const string NpcHeard = "bbcr.npc.heard";
public const string PlayerSighted = "bbcr.npc.player.sighted";
public const string PlayerLost = "bbcr.npc.player.lost";
public const string PlayerTeleported = "bbcr.player.teleported";
public const string ClassicSpoop = "bbcr.classic.spoop";
public const string MathCorrupted = "bbcr.classic.math.corrupted";
public const string YctpOpened = "bbcr.yctp.opened";
public const string YctpSubmitted = "bbcr.yctp.submitted";
public const string RandomEventBegin = "bbcr.event.begin";
public const string RandomEventEnd = "bbcr.event.end";
```

## `GameMod`

`Baldic.Bbcr.GameMod`

```text
public sealed class GameMod
public void PreLaunch(Baldic.ModContext context);
public GameMod();
```

## `Modifiers`

`Baldic.Bbcr.Modifiers`

```text
public static class Modifiers
public static System.IDisposable Movement(PlayerManager player, MovementModifier modifier);
public static System.IDisposable Movement(NPC npc, MovementModifier modifier);
public static System.IDisposable Movement(ActivityModifier target, MovementModifier modifier);
public static System.IDisposable Time(EnvironmentController environment, TimeScaleModifier modifier);
```
