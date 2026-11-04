# BB+: highscores

Сборка: `Baldic.Api.HighScores.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `HighScoreFile`

`Baldic.Api.HighScoreFile`

```text
public sealed class HighScoreFile
public const byte Version = 0;
public const int TripCount = 16;
public const int TripRanks = 5;
public const string DefaultTripName = "Baldi";
public System.Collections.Generic.List<Baldic.Api.ModdedHighScore> Scores;
public int[] TripScores;
public string[] TripNames;
public void Write(System.IO.BinaryWriter w);
public static Baldic.Api.HighScoreFile Read(System.IO.BinaryReader r);
public byte[] ToBytes();
public System.Collections.Generic.IEnumerable<Baldic.Api.ModdedHighScore> Active(System.Collections.Generic.IEnumerable<Baldic.Api.SavedMod> current);
public static T[] Flatten<T>(T[,] m);
public static T[,] Unflatten<T>(T[] f, int a, int b, T fill);
public HighScoreFile();
```

## `HighScoresMod`

`Baldic.Api.HighScoresMod`

```text
public sealed class HighScoresMod
public void Init();
public HighScoresMod();
```

## `ModdedHighScore`

`Baldic.Api.ModdedHighScore`

```text
public sealed class ModdedHighScore
public string Name;
public int Score;
public int Seed;
public string LevelId;
public System.Collections.Generic.List<Baldic.Api.SavedMod> Mods;
public bool MatchesMods(System.Collections.Generic.IEnumerable<Baldic.Api.SavedMod> current);
public ModdedHighScore();
```

## `ModdedHighScores`

`Baldic.Api.ModdedHighScores`

```text
public static class ModdedHighScores
public static Baldic.Api.SaveMode Mode { get; }
public static Baldic.Api.HighScoreFile File { get; }
public static string FilePath { get; }
public static System.Collections.Generic.IReadOnlyList<Baldic.Api.SavedMod> CurrentMods { get; }
public static System.Collections.Generic.IEnumerable<Baldic.Api.ModdedHighScore> Active { get; }
public static void AddAffectingMod(string modId, params string[] tags);
public static void SetEnabled(bool enabled);
public static void SetMode(Baldic.Api.SaveMode m);
public static void SaveFile();
public static void DeleteInactive();
public static void DeleteAll();
```
