# BB+: stickers

Сборка: `Baldic.Api.Stickers.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `ExtendedStickerData`

`Baldic.Api.ExtendedStickerData`

```text
public class ExtendedStickerData : StickerData
public Sticker sticker;
public int stickerValueCap;
public string LocalizedTitle { get; }
public string LocalizedDescription { get; }
public virtual float OddsMultiplier(StickerManager m);
public virtual bool CanBeApplied();
public virtual UnityEngine.Sprite AppliedSprite(StickerStateData state);
public virtual UnityEngine.Sprite InventorySprite(StickerStateData state);
public virtual Baldic.Api.Handshake CanStackWith(StickerStateData self, StickerStateData other);
public virtual Baldic.Api.Handshake CanBeCovered(StickerStateData self, int slot);
public virtual Baldic.Api.Handshake CanCover(StickerStateData self, StickerStateData covered, int slot);
public virtual StickerStateData StateOnApply(StickerStateData inventoryState);
public virtual string InventoryDescription(StickerStateData state);
public virtual string AppliedDescription(StickerStateData state);
public virtual StickerStateData CreateState(int level, bool opened, bool sticky);
public virtual void Apply(StickerManager m, StickerStateData state, int slot);
protected static string Localized(string key);
public ExtendedStickerData();
```

## `ExtendedStickerStateData`

`Baldic.Api.ExtendedStickerStateData`

```text
public class ExtendedStickerStateData : StickerStateData
public ExtendedStickerStateData(Sticker sticker, int activeLevel, bool opened, bool sticky);
public virtual void Write(System.IO.BinaryWriter w);
public virtual void Read(System.IO.BinaryReader r);
public virtual Baldic.Api.ExtendedStickerStateData Copy();
```

## `GlueStickData`

`Baldic.Api.GlueStickData`

```text
public class GlueStickData : Baldic.Api.VanillaCompatibleStickerData
public virtual void Apply(StickerManager m, StickerStateData state, int slot);
public virtual Baldic.Api.Handshake CanCover(StickerStateData self, StickerStateData covered, int slot);
public GlueStickData();
```

## `StickerAppliedHandler`

`Baldic.Api.StickerAppliedHandler`

```text
public delegate void StickerAppliedHandler(StickerManager manager, StickerStateData state, int slot);
```

## `StickerBuilder<T>`

`Baldic.Api.StickerBuilder`1`

```text
public sealed class StickerBuilder<T> where T : Baldic.Api.ExtendedStickerData, new()
public StickerBuilder<T>(string modId);
public Baldic.Api.StickerBuilder<T> SetEnum(Sticker s);
public Baldic.Api.StickerBuilder<T> SetEnum(string name);
public Baldic.Api.StickerBuilder<T> SetSprite(UnityEngine.Sprite s);
public Baldic.Api.StickerBuilder<T> SetValueCap(int cap);
public Baldic.Api.StickerBuilder<T> SetDuplicateOddsMultiplier(float m);
public Baldic.Api.StickerBuilder<T> SetAsAffectingGenerator();
public Baldic.Api.StickerBuilder<T> SetAsBonusSticker();
public Baldic.Api.StickerBuilder<T> SetTags(params string[] tags);
public T Build();
```

## `StickerMeta`

`Baldic.Api.StickerMeta`

```text
public sealed class StickerMeta : Baldic.Api.MetaRecord
public Baldic.Api.StickerFlags Flags;
public Baldic.Api.ExtendedStickerData Value;
public Sticker Type { get; }
public StickerMeta(string modId, Baldic.Api.ExtendedStickerData value, Baldic.Api.StickerFlags flags = (Baldic.Api.StickerFlags)0, params string[] tags);
```

## `StickerMetas`

`Baldic.Api.StickerMetas`

```text
public static class StickerMetas
public static readonly Baldic.Api.MetaStorage<Sticker, Baldic.Api.StickerMeta> Storage;
public static Sticker[] Bonus { get; }
public static Baldic.Api.StickerMeta AddMeta(Baldic.Api.ExtendedStickerData data, string modId, Baldic.Api.StickerFlags flags, params string[] tags);
public static Baldic.Api.StickerMeta GetMeta(Sticker s);
public static Baldic.Api.StickerMeta GetMeta(StickerStateData s);
public static Baldic.Api.ExtendedStickerData Data(Sticker s);
```

## `StickerRules`

`Baldic.Api.StickerRules`

```text
public static class StickerRules
public const byte StateVersion = 1;
public static float DuplicateOdds(float multiplier, int value, int inInventory);
public static int ClampValue(int value, int cap);
public static void WriteState(System.IO.BinaryWriter w, int level, bool opened, bool sticky);
public static void ReadState(System.IO.BinaryReader r, out int level, out bool opened, out bool sticky);
public static System.Collections.Generic.List<System.Collections.Generic.List<int>> Stack<T>(System.Collections.Generic.IList<T> items, System.Func<T, bool> opened, System.Func<T, T, bool> canStack);
public static System.Collections.Generic.List<T> LeastOwned<T>(System.Collections.Generic.IEnumerable<T> candidates, System.Func<T, int> owned);
public static string TitleKey(string stickerName);
public static string DescriptionKey(string stickerName);
public static string Describe(string title, string description);
```

## `StickerStates`

`Baldic.Api.StickerStates`

```text
public static class StickerStates
public static void WriteState(System.IO.BinaryWriter w, StickerStateData s);
public static StickerStateData ReadState(System.IO.BinaryReader r, Sticker sticker);
public static StickerStateData Copy(StickerStateData s);
public static bool CanStack(StickerStateData a, StickerStateData b);
public static bool CanCover(StickerStateData coverer, StickerStateData covered, int slot);
public static StickerStateData AddSticker(StickerManager m, Sticker sticker, bool opened, bool sticky, bool animation);
public static void AddExisting(StickerManager m, StickerStateData state, bool animation);
public static StickerStateData AddRandom(StickerManager m, System.Collections.Generic.IList<WeightedSticker> potential, bool opened, bool sticky, bool animation);
public static int StackSize(StickerManager m, int inventoryId);
```

## `StickersMod`

`Baldic.Api.StickersMod`

```text
public sealed class StickersMod
public static event Baldic.Api.StickerAppliedHandler StickerApplied;
public void Init();
public StickersMod();
```

## `VanillaCompatibleStickerData`

`Baldic.Api.VanillaCompatibleStickerData`

```text
public class VanillaCompatibleStickerData : Baldic.Api.ExtendedStickerData
public virtual StickerStateData CreateState(int level, bool opened, bool sticky);
public VanillaCompatibleStickerData();
```
