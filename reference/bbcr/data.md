# BBCR: data

Сборка: `Baldic.Api.Bbcr.Data.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `Achievements`

`Baldic.Bbcr.Achievements`

```text
public static class Achievements
public static AchievementManager Native { get; }
public static System.Collections.Generic.IReadOnlyList<Baldic.Bbcr.ModAchievement> All { get; }
public static bool IsUnlocked(Achievement achievement);
public static void SetNative(Achievement achievement, bool unlocked);
public static System.IDisposable Register(string id, string name, string description, Baldic.ModContext owner = null);
public static bool IsUnlocked(string id);
public static bool Unlock(string id);
```

## `AttachmentPersistence`

`Baldic.Bbcr.AttachmentPersistence`

```text
public static class AttachmentPersistence
public static string PathFor(string slot, Baldic.ModContext owner = null);
public static void Save(string slot, System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding> bindings, Baldic.ModContext owner = null);
public static void Load(string slot, System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding> bindings, Baldic.ModContext owner = null);
public static System.IDisposable Register(string slot, System.Func<System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding>> bindings, Baldic.ModContext owner = null);
```

## `DataMod`

`Baldic.Bbcr.DataMod`

```text
public sealed class DataMod
public const string Saving = "bbcr.save.saving";
public const string Saved = "bbcr.save.saved";
public const string Loaded = "bbcr.save.loaded";
public const string ScoresSaved = "bbcr.scores.saved";
public const string ScoresLoaded = "bbcr.scores.loaded";
public const string AchievementChanged = "bbcr.achievement.changed";
public void Init(Baldic.ModContext context);
public DataMod();
```

## `ModAchievement`

`Baldic.Bbcr.ModAchievement`

```text
public sealed class ModAchievement
public string Id { get; }
public string Name { get; }
public string Description { get; }
public Baldic.ModContext Owner { get; }
public ModAchievement();
```

## `Saves`

`Baldic.Bbcr.Saves`

```text
public static class Saves
public static PlayerFileManager Native { get; }
public static string PathFor(string slot, Baldic.ModContext owner = null);
public static void Write<T>(string slot, T data, int version = 1, Baldic.ModContext owner = null);
public static T Read<T>(string slot, T fallback = default, int version = 1, Baldic.ModContext owner = null);
public static bool Exists(string slot, Baldic.ModContext owner = null);
public static void Delete(string slot, Baldic.ModContext owner = null);
public static void SaveNative();
public static bool LoadNative();
```

## `ScoreEntry`

`Baldic.Bbcr.ScoreEntry`

```text
public sealed class ScoreEntry
public string Name;
public int Score;
public string[] Mods;
public ScoreEntry();
```

## `Scores`

`Baldic.Bbcr.Scores`

```text
public static class Scores
public static HighScoreManager Native { get; }
public static ClassicScoreData Snapshot();
public static int SubmitNative(int score, string name, ClassicStyle style);
public static System.Collections.Generic.IReadOnlyList<Baldic.Bbcr.ScoreEntry> Read(string board, Baldic.ModContext owner = null);
public static int Submit(string board, int score, string name, int capacity = 5, Baldic.ModContext owner = null);
```
