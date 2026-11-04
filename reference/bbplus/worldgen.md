# BB+: worldgen

Сборка: `Baldic.Api.Worldgen.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `EndlessLevel`

`Baldic.Api.EndlessLevel`

```text
public sealed class EndlessLevel
public string ModId;
public string TypeKey;
public LevelType Type;
public readonly System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string, SceneObject>> Sizes;
public EndlessLevelTypeContainer ToContainer();
public EndlessLevel();
```

## `EndlessOverviewExtended`

`Baldic.Api.EndlessOverviewExtended`

```text
public sealed class EndlessOverviewExtended : UnityEngine.MonoBehaviour
public EndlessOverviewExtended();
```

## `ExtendedGenerationParameters`

`Baldic.Api.ExtendedGenerationParameters`

```text
public class ExtendedGenerationParameters : LevelGenerationParameters
public readonly Baldic.Api.ModDataBag ModData;
public readonly System.Collections.Generic.List<WeightedItemObject> ExtraPotentialItems;
public readonly System.Collections.Generic.List<ItemObject> ExtraForcedItems;
public object GetModData(string modId, string key);
public void SetModData(string modId, string key, object value);
public ExtendedGenerationParameters();
```

## `ExtendedLevelObject`

`Baldic.Api.ExtendedLevelObject`

```text
public class ExtendedLevelObject : LevelObject
public readonly Baldic.Api.ModDataBag ModData;
public readonly Baldic.Api.ModificationMarks Marks;
public object GetModData(string modId, string key);
public void SetModData(string modId, string key, object value);
public void MarkModified(string modId, Baldic.Api.GeneratorStage stages = (Baldic.Api.GeneratorStage)0);
public bool ModifiedAt(string modId, Baldic.Api.GeneratorStage stage);
public bool Modified(string modId);
public Baldic.Api.ExtendedLevelObject Clone();
public ExtendedLevelObject();
```

## `FieldTripLoot<TWeighted, TItem>`

`Baldic.Api.FieldTripLoot`2`

```text
public sealed class FieldTripLoot<TWeighted, TItem>
public readonly System.Collections.Generic.List<TWeighted> PotentialItems;
public readonly System.Collections.Generic.List<TItem> GuaranteedItems;
public FieldTripLoot<TWeighted, TItem>(System.Collections.Generic.IEnumerable<TWeighted> potential, System.Collections.Generic.IEnumerable<TItem> guaranteed);
```

## `GeneratorChanges`

`Baldic.Api.GeneratorChanges`

```text
public static class GeneratorChanges
public static readonly Baldic.Api.GeneratorStage[] Order;
public static System.Func<bool> TooLate;
public static System.Action<string> Warn;
public static Baldic.Api.GeneratorStage CurrentStage { get; }
public static bool Any { get; }
public static bool Register(string modId, Baldic.Api.GeneratorStage stage, System.Action<string, int, object> callback);
public static void Apply(string title, int number, object scene, System.Func<System.Collections.Generic.IList<object>> levelObjects, System.Collections.Generic.IList<string> loadOrder = null);
```

## `GeneratorStage`

`Baldic.Api.GeneratorStage`

```text
public enum GeneratorStage
public const Baldic.Api.GeneratorStage Invalid = (Baldic.Api.GeneratorStage)0;
public const Baldic.Api.GeneratorStage Preparation = (Baldic.Api.GeneratorStage)1;
public const Baldic.Api.GeneratorStage Base = (Baldic.Api.GeneratorStage)2;
public const Baldic.Api.GeneratorStage Override = (Baldic.Api.GeneratorStage)4;
public const Baldic.Api.GeneratorStage Addend = (Baldic.Api.GeneratorStage)8;
public const Baldic.Api.GeneratorStage Finalizer = (Baldic.Api.GeneratorStage)16;
```

## `ModificationMarks`

`Baldic.Api.ModificationMarks`

```text
public sealed class ModificationMarks
public System.Collections.Generic.IEnumerable<string> Mods { get; }
public void Mark(string modId, Baldic.Api.GeneratorStage stages = (Baldic.Api.GeneratorStage)0);
public bool ModifiedAt(string modId, Baldic.Api.GeneratorStage stage);
public bool Modified(string modId);
public void CopyFrom(Baldic.Api.ModificationMarks other);
public ModificationMarks();
```

## `SceneObjectExtensions`

`Baldic.Api.SceneObjectExtensions`

```text
public static class SceneObjectExtensions
public static Baldic.Api.ExtendedLevelObject[] ExtendedLevelObjects(SceneObject scene);
public static Baldic.Api.ExtendedLevelObject CurrentExtendedLevelObject(SceneObject scene);
```

## `Worldgen`

`Baldic.Api.Worldgen`

```text
public static class Worldgen
public static bool AddGeneratorChange(string modId, Baldic.Api.GeneratorStage stage, System.Action<string, int, SceneObject> callback);
public static void QueueScene(SceneObject scene);
public static void AddFieldTripLoot(string modId, System.Action<FieldTrips, Baldic.Api.FieldTripLoot<WeightedItemObject, ItemObject>> callback);
public static void AddEndlessLevel(Baldic.Api.EndlessLevel level);
public static void AddEndlessAction(string modId, System.Action<System.Collections.Generic.List<EndlessLevelTypeContainer>> action);
```

## `WorldgenMod`

`Baldic.Api.WorldgenMod`

```text
public sealed class WorldgenMod
public void Init();
public WorldgenMod();
```
