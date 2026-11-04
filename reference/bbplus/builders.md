# BB+: builders

Сборка: `Baldic.Api.Builders.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `BuilderExtensions`

`Baldic.Api.BuilderExtensions`

```text
public static class BuilderExtensions
public static UnityEngine.Material WithMainTexture(UnityEngine.Material m, UnityEngine.Texture t);
public static UnityEngine.Texture MainTexture(UnityEngine.Material m);
public static UnityEngine.Material WithTextureColor(UnityEngine.Material m, UnityEngine.Color c);
public static UnityEngine.Color TextureColor(UnityEngine.Material m);
public static UnityEngine.Material WithMask(UnityEngine.Material m, UnityEngine.Texture t);
public static UnityEngine.Texture Mask(UnityEngine.Material m);
public static int CellIndex(RoomAsset r, int x, int z);
public static CellData CellAt(RoomAsset r, int x, int z);
public static void ApplyDoorMaterials(StandardDoor door, StandardDoorMats mats, int side = -1);
public static void SetSheets(SpriteRotationMap map, UnityEngine.Sprite[] sheet, UnityEngine.Sprite[] overrideSheet = null);
public static StandardMenuButton ConvertToButton(UnityEngine.GameObject go, bool autoAssign = true);
public static void InitializeAllEvents(StandardMenuButton b);
public static TextLocalizer GetLocalizer(TMPro.TMP_Text text);
```

## `BuilderRules`

`Baldic.Api.BuilderRules`

```text
public static class BuilderRules
public static float SubtitleDuration(float requested, float clipLength, out bool subtitle);
public static void SetRange(ref float min, ref float max, System.Nullable<float> newMin, System.Nullable<float> newMax);
public static string ItemObjectName(string nameKey);
public static string PosterName(string texture);
public static string PosterChainName(string texture);
public static string BoardName(string key);
public static string MapTileName(string texture);
public static string DefaultModeKey(bool mainGame);
```

## `BuildersMod`

`Baldic.Api.BuildersMod`

```text
public sealed class BuildersMod
public void Init();
public BuildersMod();
```

## `EntityBuilder`

`Baldic.Api.EntityBuilder`

```text
public sealed class EntityBuilder
public Baldic.Api.EntityBuilder SetName(string name);
public Baldic.Api.EntityBuilder SetBaseRadius(float r);
public Baldic.Api.EntityBuilder SetHeight(float h);
public Baldic.Api.EntityBuilder AddTrigger(float radius);
public Baldic.Api.EntityBuilder SetLayer(string layer);
public Baldic.Api.EntityBuilder SetLayerCollisionMask(UnityEngine.LayerMask mask);
public Baldic.Api.EntityBuilder SetRenderBase(System.Func<Entity, UnityEngine.Transform> make);
public static UnityEngine.Transform DefaultRenderBase(Entity e);
public Entity Build();
public EntityBuilder();
```

## `Factories`

`Baldic.Api.Factories`

```text
public static class Factories
public static UnityEngine.Material SpriteBillboard { get; }
public static StandardDoorMats DoorMats(UnityEngine.Texture2D open, UnityEngine.Texture2D shut, string name = null);
public static WindowObject Window(UnityEngine.Texture2D texture, UnityEngine.Texture2D broken, UnityEngine.Texture2D mask = null, string name = null);
public static SoundObject Sound(UnityEngine.AudioClip clip, string subtitleKey, SoundType type, UnityEngine.Color color, float subDuration = -1f);
public static PosterObject Poster(UnityEngine.Texture2D texture, PosterTextData[] text = null);
public static PosterObject PosterChain(UnityEngine.Texture2D[] textures, PosterTextData[] text = null);
public static PosterObject CharacterPoster(UnityEngine.Texture2D texture, string nameKey, string descKey);
public static PosterObject LevelTypeBoard(string key);
public static UnityEngine.Material MapTile(UnityEngine.Texture2D texture);
```

## `GameManagerBuilder<T>`

`Baldic.Api.GameManagerBuilder`1`

```text
public class GameManagerBuilder<T> where T : BaseGameManager
protected float GradeValue;
protected float NotebookAnger;
protected float FinishDelay;
protected int LevelNumber;
protected bool CompleteMap;
protected string NameKey;
protected Baldic.Api.NpcSpawnMode Spawn;
protected ElevatorScreen Elevator;
protected string ObjectName;
public Baldic.Api.GameManagerBuilder<T> SetObjectName(string name);
public Baldic.Api.GameManagerBuilder<T> SetGradeValue(float v);
public Baldic.Api.GameManagerBuilder<T> SetNotebookAngerValue(float v);
public Baldic.Api.GameManagerBuilder<T> SetLevelNumber(int n);
public Baldic.Api.GameManagerBuilder<T> SetFinishDelay(float s);
public Baldic.Api.GameManagerBuilder<T> SetCompleteMapOnReady(bool v = true);
public Baldic.Api.GameManagerBuilder<T> SetNameKey(string key);
public Baldic.Api.GameManagerBuilder<T> SetNPCSpawnMode(Baldic.Api.NpcSpawnMode m);
public Baldic.Api.GameManagerBuilder<T> SetElevatorScreen(ElevatorScreen s);
protected virtual void Configure(T manager);
public T Build();
public GameManagerBuilder<T>();
```

## `ItemBuilder`

`Baldic.Api.ItemBuilder`

```text
public sealed class ItemBuilder
public ItemBuilder(string modId);
public Baldic.Api.ItemBuilder SetNameAndDescription(string nameKey, string descKey);
public Baldic.Api.ItemBuilder SetSprites(UnityEngine.Sprite small, UnityEngine.Sprite large);
public Baldic.Api.ItemBuilder SetEnum(Items type);
public Baldic.Api.ItemBuilder SetEnum(string name);
public Baldic.Api.ItemBuilder SetShopPrice(int price);
public Baldic.Api.ItemBuilder SetGeneratorCost(int cost);
public Baldic.Api.ItemBuilder SetItemComponent<T>() where T : Item;
public Baldic.Api.ItemBuilder SetItemComponent(Item instance);
public Baldic.Api.ItemBuilder SetAsInstantUse();
public Baldic.Api.ItemBuilder SetMeta(Baldic.Api.ItemFlags flags, params string[] tags);
public Baldic.Api.ItemBuilder SetMeta(Baldic.Api.ItemMeta existing);
public Baldic.Api.ItemBuilder SetPickupSound(SoundObject sound);
public Baldic.Api.ItemBuilder SetAsNotOverridable();
public ItemObject Build();
```

## `MainGameManagerBuilder<T>`

`Baldic.Api.MainGameManagerBuilder`1`

```text
public sealed class MainGameManagerBuilder<T> : Baldic.Api.GameManagerBuilder<T> where T : MainGameManager
public Baldic.Api.MainGameManagerBuilder<T> SetHappyBaldi(HappyBaldi prefab);
public Baldic.Api.MainGameManagerBuilder<T> SetHappyBaldiIntro(SoundObject intro);
public Baldic.Api.MainGameManagerBuilder<T> SetPitstop(SceneObject pitstop);
public Baldic.Api.MainGameManagerBuilder<T> SetAllNotebooksSound(SoundObject s);
protected virtual void Configure(T m);
public MainGameManagerBuilder<T>();
```

## `NPCBuilder<T>`

`Baldic.Api.NPCBuilder`1`

```text
public sealed class NPCBuilder<T> where T : NPC
public NPCBuilder<T>(string modId);
public Baldic.Api.NPCBuilder<T> SetName(string objectName);
public Baldic.Api.NPCBuilder<T> SetMetaName(string nameKey);
public Baldic.Api.NPCBuilder<T> SetEnum(Character c);
public Baldic.Api.NPCBuilder<T> SetEnum(string name);
public Baldic.Api.NPCBuilder<T> SetPoster(PosterObject poster);
public Baldic.Api.NPCBuilder<T> SetPoster(UnityEngine.Texture2D texture, string titleKey, string descKey);
public Baldic.Api.NPCBuilder<T> SetMetaTags(params string[] tags);
public Baldic.Api.NPCBuilder<T> AddMetaFlag(Baldic.Api.NPCFlags flags);
public Baldic.Api.NPCBuilder<T> AddLooker();
public Baldic.Api.NPCBuilder<T> AddTrigger();
public Baldic.Api.NPCBuilder<T> AddHeatmap();
public Baldic.Api.NPCBuilder<T> IgnorePlayerOnSpawn();
public Baldic.Api.NPCBuilder<T> SetAirborne();
public Baldic.Api.NPCBuilder<T> SetStationary();
public Baldic.Api.NPCBuilder<T> SetNoSprite();
public Baldic.Api.NPCBuilder<T> SetFOV(float fov);
public Baldic.Api.NPCBuilder<T> SetMaxSightDistance(float distance);
public Baldic.Api.NPCBuilder<T> DisableAutoRotation();
public Baldic.Api.NPCBuilder<T> DisableNavigationPrecision();
public Baldic.Api.NPCBuilder<T> EnableAcceleration();
public Baldic.Api.NPCBuilder<T> SetAudioTimeScale(TimeScaleType type);
public Baldic.Api.NPCBuilder<T> DisableAudioTimeScale();
public Baldic.Api.NPCBuilder<T> SetMinMaxAudioDistance(float min, float max);
public Baldic.Api.NPCBuilder<T> SetForcedSubtitleColor(UnityEngine.Color c);
public Baldic.Api.NPCBuilder<T> IgnorePlayerVisibility();
public Baldic.Api.NPCBuilder<T> SetWanderEnterRooms();
public Baldic.Api.NPCBuilder<T> AddSpawnableRoomCategories(params RoomCategory[] categories);
public Baldic.Api.NPCBuilder<T> AddPotentialRoomAsset(RoomAsset asset, int weight);
public T Build();
```

## `NpcSpawnMode`

`Baldic.Api.NpcSpawnMode`

```text
public enum NpcSpawnMode
public const Baldic.Api.NpcSpawnMode Never = (Baldic.Api.NpcSpawnMode)0;
public const Baldic.Api.NpcSpawnMode OnInitialize = (Baldic.Api.NpcSpawnMode)1;
public const Baldic.Api.NpcSpawnMode OnSpawnExit = (Baldic.Api.NpcSpawnMode)2;
```

## `RandomEventBuilder<T>`

`Baldic.Api.RandomEventBuilder`1`

```text
public sealed class RandomEventBuilder<T> where T : RandomEvent
public RandomEventBuilder<T>(string modId);
public Baldic.Api.RandomEventBuilder<T> SetEnum(RandomEventType t);
public Baldic.Api.RandomEventBuilder<T> SetEnum(string name);
public Baldic.Api.RandomEventBuilder<T> SetName(string name);
public Baldic.Api.RandomEventBuilder<T> SetSound(SoundObject intro);
public Baldic.Api.RandomEventBuilder<T> SetJingle(SoundObject jingle);
public Baldic.Api.RandomEventBuilder<T> AddRoomAsset(RoomAsset room, int weight = 100);
public Baldic.Api.RandomEventBuilder<T> AddRequiredCharacter(Character c);
public Baldic.Api.RandomEventBuilder<T> SetMeta(Baldic.Api.RandomEventFlags flags, params string[] tags);
public Baldic.Api.RandomEventBuilder<T> SetUsesCurtains();
public Baldic.Api.RandomEventBuilder<T> SetMinMaxTime(float min, float max);
public Baldic.Api.RandomEventBuilder<T> SetMinTime(float min);
public Baldic.Api.RandomEventBuilder<T> SetMaxTime(float max);
public T Build();
```
