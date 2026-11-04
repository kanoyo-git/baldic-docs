# BBCR: content

Сборка: `Baldic.Api.Bbcr.Content.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `Builders`

`Baldic.Bbcr.Builders`

```text
public static class Builders
public static ItemObject Item<T>(string id, string nameKey, string descriptionKey, UnityEngine.Sprite small, UnityEngine.Sprite large, System.Action<T> configure = null, int cost = 25, int price = 50) where T : Item;
public static T Npc<T>(string id, NPC template, System.Action<T> configure = null, PosterObject poster = null) where T : NPC;
public static RoomController Room(string id, RoomController template, System.Nullable<RoomCategory> category = default, System.Action<RoomController> configure = null);
public static T RoomBuilder<T>(string id, System.Action<T> configure = null) where T : RoomBuilder;
public static LevelObject Level(string id, LevelObject template = null, System.Action<LevelObject> configure = null);
public static LevelAsset LevelAsset(string id, LevelAsset template, System.Action<LevelAsset> configure = null);
public static LevelAsset LevelAsset(string id, LevelDataContainer template, System.Action<LevelAsset> configure = null);
public static SceneObject Scene(string id, SceneObject template, System.Action<SceneObject> configure = null);
public static SceneObject Scene(string id, BaseGameManager manager, LevelAsset level, string title, int number = 0);
public static PosterObject Poster(string id, UnityEngine.Texture2D texture, PosterTextData[] text = null);
public static SoundObject Sound(string id, UnityEngine.AudioClip clip, string subtitleKey = null, SoundType type = (SoundType)1, float volume = 1f);
public static T RandomEvent<T>(string id, string descriptionKey, float minDuration = 30f, float maxDuration = 60f, SoundObject intro = null, System.Action<T> configure = null) where T : RandomEvent;
```

## `ContentMod`

`Baldic.Bbcr.ContentMod`

```text
public sealed class ContentMod
public void PreLaunch(Baldic.ModContext context);
public void Init(Baldic.ModContext context);
public ContentMod();
```

## `Generation`

`Baldic.Bbcr.Generation`

```text
public static class Generation
public const string Beginning = "bbcr.generation.begin";
public const string Completed = "bbcr.generation.complete";
public static System.IDisposable OnBegin(System.Action<Baldic.Bbcr.GenerationContext> callback, int priority = 0);
public static System.IDisposable OnComplete(System.Action<Baldic.Bbcr.GenerationContext> callback, int priority = 0);
public static T Select<T>(System.Collections.Generic.IEnumerable<WeightedSelection<T>> choices, System.Random random);
public static System.IDisposable AddItem(LevelObject level, ItemObject item, int weight = 100);
public static System.IDisposable AddPoster(LevelObject level, PosterObject poster, int weight = 100);
public static System.IDisposable AddNpc(LevelObject level, NPC npc, int weight = 100);
public static System.IDisposable AddEvent(LevelObject level, RandomEvent randomEvent, int weight = 100);
public static System.IDisposable AddRoomBuilder(LevelObject level, RoomBuilder builder, RoomCategory category, int weight = 100);
public static int AddRoom(LevelAsset level, RoomData room);
public static void SetTile(LevelAsset level, IntVector2 position, int bin, int roomId);
```

## `GenerationContext`

`Baldic.Bbcr.GenerationContext`

```text
public sealed class GenerationContext
public LevelBuilder Builder { get; }
public EnvironmentController Environment { get; }
public int Seed { get; }
public System.Random Random { get; }
```

## `World`

`Baldic.Bbcr.World`

```text
public static class World
public static TileController Tile(EnvironmentController environment, IntVector2 position);
public static TileController Tile(EnvironmentController environment, UnityEngine.Vector3 position);
public static System.Collections.Generic.IReadOnlyList<RoomController> Rooms(EnvironmentController environment, System.Nullable<RoomCategory> category = default);
public static System.Collections.Generic.IReadOnlyList<TileController> Tiles(EnvironmentController environment);
public static System.Collections.Generic.IReadOnlyList<TileController> Tiles(RoomController room);
public static bool TryPath(EnvironmentController environment, TileController from, TileController to, out System.Collections.Generic.List<TileController> path, PathType type = (PathType)1);
public static int Distance(EnvironmentController environment, TileController from, TileController to, PathType type = (PathType)1);
public static void RefreshNavigation(EnvironmentController environment, bool rebuildMesh = false);
public static RoomController CreateRoom(EnvironmentController environment, RoomController template, IntVector2 position, IntVector2 size);
public static TileController CreateTile(EnvironmentController environment, RoomController room, IntVector2 position, int bin);
public static TileController SwapTile(EnvironmentController environment, IntVector2 position, int bin);
public static void DestroyTile(EnvironmentController environment, IntVector2 position);
public static void Connect(EnvironmentController environment, IntVector2 position, Direction direction, bool keepContents = true);
public static void Close(EnvironmentController environment, IntVector2 position, Direction direction);
public static NPC SpawnNpc(EnvironmentController environment, NPC prefab, IntVector2 position);
public static Pickup SpawnItem(EnvironmentController environment, RoomController room, ItemObject item, UnityEngine.Vector3 position);
public static Door CreateDoor(EnvironmentController environment, Door prefab, IntVector2 position, Direction direction);
public static Window CreateWindow(EnvironmentController environment, WindowObject definition, IntVector2 position, Direction direction, bool keepContents = true);
public static void Poster(EnvironmentController environment, PosterObject poster, IntVector2 position, Direction direction);
public static void Light(EnvironmentController environment, IntVector2 position, UnityEngine.Color color, int strength);
public static void SetLight(EnvironmentController environment, IntVector2 position, bool enabled);
public static void SetAllLights(EnvironmentController environment, bool enabled);
public static System.IDisposable Fog(EnvironmentController environment, Fog fog);
public static System.IDisposable TimeScale(EnvironmentController environment, TimeScaleModifier modifier);
public static void Noise(EnvironmentController environment, UnityEngine.Vector3 position, int value);
public static void Silence(EnvironmentController environment, float seconds);
public static RandomEvent ScheduleEvent(EnvironmentController environment, RandomEvent prefab, System.Random random, float delay = 0f);
```
