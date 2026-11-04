# BB+: metadata

Сборка: `Baldic.Api.Metadata.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `BaseContent`

`Baldic.Api.BaseContent`

```text
public static class BaseContent
public static bool Created { get; }
public static void Create();
```

## `EventRequirements`

`Baldic.Api.EventRequirements`

```text
public static class EventRequirements
public const string CharacterPrefix = "requiredC_";
public const string RoomPrefix = "requiredR_";
public static string[] Characters(System.Collections.Generic.IEnumerable<string> tags);
public static string[] Rooms(System.Collections.Generic.IEnumerable<string> tags);
```

## `IMeta`

`Baldic.Api.IMeta`

```text
public interface IMeta
public System.Collections.Generic.HashSet<string> Tags { get; }
public string ModId { get; }
```

## `ItemFlags`

`Baldic.Api.ItemFlags`

```text
public enum ItemFlags
public const Baldic.Api.ItemFlags None = (Baldic.Api.ItemFlags)0;
public const Baldic.Api.ItemFlags MultipleUse = (Baldic.Api.ItemFlags)1;
public const Baldic.Api.ItemFlags InstantUse = (Baldic.Api.ItemFlags)2;
public const Baldic.Api.ItemFlags NoUses = (Baldic.Api.ItemFlags)4;
public const Baldic.Api.ItemFlags Persists = (Baldic.Api.ItemFlags)8;
public const Baldic.Api.ItemFlags CreatesEntity = (Baldic.Api.ItemFlags)16;
public const Baldic.Api.ItemFlags HasTutorialVariant = (Baldic.Api.ItemFlags)32;
public const Baldic.Api.ItemFlags Unobtainable = (Baldic.Api.ItemFlags)64;
```

## `ItemMeta`

`Baldic.Api.ItemMeta`

```text
public sealed class ItemMeta : Baldic.Api.MetaRecord
public Baldic.Api.ItemFlags Flags;
public ItemObject[] Group;
public ItemObject Value { get; }
public int GeneratorCost { get; }
public string NameKey { get; }
public Items Type { get; }
public ItemMeta(string modId, ItemObject[] group, Baldic.Api.ItemFlags flags = (Baldic.Api.ItemFlags)0, params string[] tags);
```

## `ItemMetaStorage`

`Baldic.Api.ItemMetaStorage`

```text
public sealed class ItemMetaStorage : Baldic.Api.MetaStorage<ItemObject, Baldic.Api.ItemMeta>
public void Add(Baldic.Api.ItemMeta meta);
public Baldic.Api.ItemMeta FindByEnum(Items type, string modId = null);
public Baldic.Api.ItemMeta[] WithFlags(Baldic.Api.ItemFlags flags);
public Baldic.Api.ItemMeta[] WithoutFlags(Baldic.Api.ItemFlags flags);
public Baldic.Api.ItemMeta[] FromMod(string modId);
public ItemObject PointsClosestTo(int amount, bool exact = false);
public static int PointsValue(ItemObject o);
public bool RemoveFromGroup(ItemObject o);
public ItemMetaStorage();
```

## `LevelTypeMeta`

`Baldic.Api.LevelTypeMeta`

```text
public sealed class LevelTypeMeta : Baldic.Api.MetaRecord
public LevelType Value;
public PosterObject Board;
public LevelTypeMeta(string modId, LevelType value, PosterObject board, params string[] tags);
```

## `Meta`

`Baldic.Api.Meta`

```text
public static class Meta
public static readonly Baldic.Api.ItemMetaStorage Items;
public static readonly Baldic.Api.NPCMetaStorage NPCs;
public static readonly Baldic.Api.MetaStorage<RandomEventType, Baldic.Api.RandomEventMeta> Events;
public static readonly Baldic.Api.MetaStorage<SceneObject, Baldic.Api.SceneMeta> Scenes;
public static readonly Baldic.Api.MetaStorage<LevelType, Baldic.Api.LevelTypeMeta> LevelTypes;
public static Baldic.Api.ItemMeta AddMeta(ItemObject o, string modId, Baldic.Api.ItemFlags flags, params string[] tags);
public static Baldic.Api.ItemMeta GetMeta(ItemObject o);
public static Baldic.Api.NPCMeta AddMeta(NPC npc, string modId, Baldic.Api.NPCFlags flags, params string[] tags);
public static Baldic.Api.NPCMeta GetMeta(NPC npc);
public static Baldic.Api.RandomEventMeta AddMeta(RandomEvent e, string modId, Baldic.Api.RandomEventFlags flags, params string[] tags);
public static Baldic.Api.RandomEventMeta GetMeta(RandomEvent e);
public static Baldic.Api.SceneMeta AddMeta(SceneObject s, string modId, params string[] tags);
public static Baldic.Api.SceneMeta GetMeta(SceneObject s);
public static Baldic.Api.LevelTypeMeta AddMeta(LevelType t, string modId, PosterObject board, params string[] tags);
public static Baldic.Api.LevelTypeMeta GetMeta(LevelType t);
```

## `MetaRecord`

`Baldic.Api.MetaRecord`

```text
public abstract class MetaRecord : Baldic.Api.IMeta
public System.Collections.Generic.HashSet<string> Tags { get; }
public string ModId { get; set; }
protected MetaRecord(string modId, System.Collections.Generic.IEnumerable<string> tags);
```

## `MetaStorage<TKey, TMeta>`

`Baldic.Api.MetaStorage`2`

```text
public class MetaStorage<TKey, TMeta> where TMeta : class, Baldic.Api.IMeta
public System.Collections.Generic.IEnumerable<TKey> Keys { get; }
public virtual void Add(TKey key, TMeta meta);
public System.Collections.Generic.IReadOnlyList<TMeta> All();
public TMeta Get(TKey key);
public bool Has(TKey key);
public TMeta Find(System.Func<TMeta, bool> predicate);
public TMeta[] FindAll(System.Func<TMeta, bool> predicate);
public TMeta[] FindByTags(bool matchAll, params string[] tags);
public bool Remove(TKey key);
public bool RemoveRecord(TMeta meta);
public MetaStorage<TKey, TMeta>();
```

## `MetadataMod`

`Baldic.Api.MetadataMod`

```text
public sealed class MetadataMod
public void Init();
public MetadataMod();
```

## `NPCFlags`

`Baldic.Api.NPCFlags`

```text
public enum NPCFlags
public const Baldic.Api.NPCFlags None = (Baldic.Api.NPCFlags)0;
public const Baldic.Api.NPCFlags CanHear = (Baldic.Api.NPCFlags)1;
public const Baldic.Api.NPCFlags CanMove = (Baldic.Api.NPCFlags)2;
public const Baldic.Api.NPCFlags CanSee = (Baldic.Api.NPCFlags)4;
public const Baldic.Api.NPCFlags MakeNoise = (Baldic.Api.NPCFlags)8;
public const Baldic.Api.NPCFlags HasTrigger = (Baldic.Api.NPCFlags)16;
public const Baldic.Api.NPCFlags HasSprite = (Baldic.Api.NPCFlags)32;
public const Baldic.Api.NPCFlags IsBlockade = (Baldic.Api.NPCFlags)64;
public const Baldic.Api.NPCFlags NonStandardSpawn = (Baldic.Api.NPCFlags)128;
public const Baldic.Api.NPCFlags HasRoom = (Baldic.Api.NPCFlags)256;
public const Baldic.Api.NPCFlags Standard = (Baldic.Api.NPCFlags)54;
public const Baldic.Api.NPCFlags StandardNoCollide = (Baldic.Api.NPCFlags)38;
public const Baldic.Api.NPCFlags StandardAndHear = (Baldic.Api.NPCFlags)55;
```

## `NPCMeta`

`Baldic.Api.NPCMeta`

```text
public sealed class NPCMeta : Baldic.Api.MetaRecord
public Baldic.Api.NPCFlags Flags;
public string NameKey;
public Character Character;
public readonly System.Collections.Generic.Dictionary<string, NPC> Prefabs;
public string MainPrefabKey;
public NPC Value { get; }
public NPCMeta(string modId, NPC prefab, Baldic.Api.NPCFlags flags, string nameKey = null, params string[] tags);
public void AddPrefab(NPC prefab);
public bool RemovePrefab(string name);
public void ReplaceComponent<TOld, TNew>() where TOld : UnityEngine.Component where TNew : TOld;
```

## `NPCMetaStorage`

`Baldic.Api.NPCMetaStorage`

```text
public sealed class NPCMetaStorage : Baldic.Api.MetaStorage<Character, Baldic.Api.NPCMeta>
public Baldic.Api.NPCMeta AddOrVariant(Baldic.Api.NPCMeta meta);
public NPCMetaStorage();
```

## `RandomEventFlags`

`Baldic.Api.RandomEventFlags`

```text
public enum RandomEventFlags
public const Baldic.Api.RandomEventFlags None = (Baldic.Api.RandomEventFlags)0;
public const Baldic.Api.RandomEventFlags CharacterSpecific = (Baldic.Api.RandomEventFlags)1;
public const Baldic.Api.RandomEventFlags RoomSpecific = (Baldic.Api.RandomEventFlags)2;
public const Baldic.Api.RandomEventFlags Permanent = (Baldic.Api.RandomEventFlags)4;
public const Baldic.Api.RandomEventFlags AffectsGenerator = (Baldic.Api.RandomEventFlags)8;
public const Baldic.Api.RandomEventFlags Special = (Baldic.Api.RandomEventFlags)16;
public const Baldic.Api.RandomEventFlags UsesCurtains = (Baldic.Api.RandomEventFlags)40;
```

## `RandomEventMeta`

`Baldic.Api.RandomEventMeta`

```text
public sealed class RandomEventMeta : Baldic.Api.MetaRecord
public Baldic.Api.RandomEventFlags Flags;
public RandomEvent Value;
public RandomEventType Type { get; }
public SoundObject Intro { get; }
public string DescriptionKey { get; }
public Character[] RequiredCharacters { get; }
public RoomCategory[] RequiredRooms { get; }
public RandomEventMeta(string modId, RandomEvent value, Baldic.Api.RandomEventFlags flags = (Baldic.Api.RandomEventFlags)0, params string[] tags);
public void RequireCharacter(Character c);
public void RequireRoom(RoomCategory r);
```

## `SceneMeta`

`Baldic.Api.SceneMeta`

```text
public sealed class SceneMeta : Baldic.Api.MetaRecord
public SceneObject Value;
public readonly System.Collections.Generic.List<LevelType> SupportedLevelTypes;
public bool RandomlyGenerated { get; }
public int Number { get; }
public string Title { get; }
public SceneMeta(string modId, SceneObject value, params string[] tags);
```

## `StickerFlags`

`Baldic.Api.StickerFlags`

```text
public enum StickerFlags
public const Baldic.Api.StickerFlags None = (Baldic.Api.StickerFlags)0;
public const Baldic.Api.StickerFlags AffectsLevelGeneration = (Baldic.Api.StickerFlags)1;
public const Baldic.Api.StickerFlags IsBonus = (Baldic.Api.StickerFlags)2;
```

## `StickerPackOrder`

`Baldic.Api.StickerPackOrder`

```text
public static class StickerPackOrder
public static System.Collections.Generic.List<T> Sort<T>(System.Collections.Generic.IEnumerable<T> items, System.Func<T, string> name);
```
