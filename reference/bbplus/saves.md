# BB+: saves

Сборка: `Baldic.Api.Saves.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `AttachmentSaveHandler`

`Baldic.Api.AttachmentSaveHandler`

```text
public sealed class AttachmentSaveHandler : Baldic.Api.TextSaveHandler
public AttachmentSaveHandler(System.Func<System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding>> bindings, Baldic.ModContext owner = null);
public virtual string SaveText();
public virtual void LoadText(string text);
public virtual void Reset();
public virtual void OnCgmCreated(CoreGameManager cgm, bool fromSave);
```

## `DummySaveHandler`

`Baldic.Api.DummySaveHandler`

```text
public sealed class DummySaveHandler : Baldic.Api.ModSaveHandler
public DummySaveHandler(string modId);
public virtual void Save(System.IO.BinaryWriter writer);
public virtual void Load(System.IO.BinaryReader reader);
public virtual void Reset();
```

## `ISaveCodecContext`

`Baldic.Api.ISaveCodecContext`

```text
public interface ISaveCodecContext
public abstract void WriteStickerState(System.IO.BinaryWriter w, Baldic.Api.SavedSticker s);
public abstract object ReadStickerState(System.IO.BinaryReader r, string stickerName);
public abstract void WriteHandler(System.IO.BinaryWriter w, string modId);
public abstract void ReadHandler(System.IO.BinaryReader r, string modId);
```

## `InstalledHandler`

`Baldic.Api.InstalledHandler`

```text
public struct InstalledHandler
public string Id;
public string[] Tags;
public bool TagsReady;
public InstalledHandler(string id, string[] tags, bool ready = true);
```

## `JsonMapper`

`Baldic.Api.JsonMapper`

```text
public static class JsonMapper
public static object ToJson(object o);
public static object FromJson(object v, System.Type t);
```

## `JsonSaveHandler<T>`

`Baldic.Api.JsonSaveHandler`1`

```text
public abstract class JsonSaveHandler<T> : Baldic.Api.TextSaveHandler where T : new()
public T Data;
protected JsonSaveHandler<T>(string modId);
public virtual string SaveText();
public virtual void LoadText(string text);
public virtual void Reset();
```

## `ModSaveHandler`

`Baldic.Api.ModSaveHandler`

```text
public abstract class ModSaveHandler
public string ModId { get; }
protected ModSaveHandler(string modId);
public abstract void Save(System.IO.BinaryWriter writer);
public abstract void Load(System.IO.BinaryReader reader);
public abstract void Reset();
public virtual void OnCgmCreated(CoreGameManager cgm, bool fromSave);
public virtual string[] GenerateTags();
public virtual string DisplayTags(string[] tags);
public virtual bool TagsReady();
```

## `ModdedSave`

`Baldic.Api.ModdedSave`

```text
public sealed class ModdedSave
public const int FormatVersion = 8;
public string ApiVersion;
public bool HasSave;
public int Version;
public System.Collections.Generic.List<Baldic.Api.SavedMod> Mods;
public Baldic.Api.SceneIdMethod SceneMethod;
public string SceneValue;
public int Seed;
public int Ytps;
public int Lives;
public int Attempts;
public int LifeMode;
public bool FieldTripPlayed;
public bool MapAvailable;
public bool MapPurchased;
public bool JohnnyHelped;
public bool TimeLimitChallenge;
public bool MapChallenge;
public bool InventoryChallenge;
public int MapSizeX;
public int MapSizeZ;
public bool[] FoundTiles;
public int[] MarkerIds;
public float[] MarkerPositions;
public System.Collections.Generic.List<Baldic.Api.SavedItem> Items;
public System.Collections.Generic.List<Baldic.Api.SavedItem> LockerItems;
public System.Collections.Generic.List<Baldic.Api.SavedSticker> ActiveStickers;
public System.Collections.Generic.List<Baldic.Api.SavedSticker> InventoryStickers;
public bool[] UpgradedSlots;
public bool CanTransfer;
public static string MetadataSceneValue(string modId, string name);
public void Write(System.IO.BinaryWriter w, Baldic.Api.ISaveCodecContext ctx);
public static Baldic.Api.ModdedSave ReadHeader(System.IO.BinaryReader r);
public static Baldic.Api.SaveLoadStatus Read(System.IO.BinaryReader r, Baldic.Api.ISaveCodecContext ctx, System.Func<string, bool> installed, out Baldic.Api.ModdedSave save);
public static Baldic.Api.ModdedSave ReadPartial(System.IO.BinaryReader r);
public byte[] ToBytes(Baldic.Api.ISaveCodecContext ctx);
public static void WriteStrings(System.IO.BinaryWriter w, string[] s);
public static string[] ReadStrings(System.IO.BinaryReader r);
public ModdedSave();
```

## `ModdedSaveManager`

`Baldic.Api.ModdedSaveManager`

```text
public sealed class ModdedSaveManager : UnityEngine.MonoBehaviour
public static Baldic.Api.ModdedSaveManager Instance { get; }
public Baldic.Api.ModdedSave Current { get; }
public int CurrentSlot { get; }
public ModdedSaveManager();
```

## `ModdedSaveSlots`

`Baldic.Api.ModdedSaveSlots`

```text
public static class ModdedSaveSlots
public static readonly System.Collections.Generic.SortedDictionary<int, Baldic.Api.ModdedSave> Partial;
public static Baldic.Api.ModdedSave Current { get; }
public static int CurrentSlot { get; }
public static string Folder { get; }
public static System.Collections.Generic.List<int> ReadList();
public static void Pick();
public static void WriteSlot(int slot, Baldic.Api.ModdedSave save);
public static Baldic.Api.SaveLoadStatus LoadSlot(int slot, bool addMissingTags, out Baldic.Api.ModdedSave save);
public static void DeleteSlot(int slot);
public static bool Transfer(int slot);
public static void DeleteCurrent();
public static void RecalculateTags();
```

## `ModdedSaves`

`Baldic.Api.ModdedSaves`

```text
public static class ModdedSaves
public const string ApiVersion = "0.0.1";
public static Baldic.Api.SaveMode Mode { get; }
public static bool AlwaysModded { get; }
public static int IntrusiveFeatures { get; }
public static bool Enabled { get; }
public static bool HasMods { get; }
public static System.Collections.Generic.IEnumerable<Baldic.Api.ModSaveHandler> AllHandlers { get; }
public static string ModdedRoot { get; }
public static string CurrentProfile { get; }
public static event System.Action<Baldic.Api.SaveMode> ModeChanged;
public static void EnableFeature(int flag);
public static void SetEnabled(bool enabled);
public static void AddHandler(Baldic.Api.ModSaveHandler h);
public static void AddDummyHandler(string modId);
public static Baldic.Api.ModSaveHandler Handler(string modId);
public static void AddSaveLoadAction(string modId, System.Action<bool, string> action);
public static void AddUnmanagedAction(string modId, System.Action<bool, string> action);
public static string ModFolder(string profile, string modId);
public static string ModFolderForCurrentProfile(string modId);
public static string UnmanagedFolder(string modId);
public static void RunActions(bool isSave);
```

## `SaveLoadStatus`

`Baldic.Api.SaveLoadStatus`

```text
public enum SaveLoadStatus
public const Baldic.Api.SaveLoadStatus Success = (Baldic.Api.SaveLoadStatus)0;
public const Baldic.Api.SaveLoadStatus NoSave = (Baldic.Api.SaveLoadStatus)1;
public const Baldic.Api.SaveLoadStatus MissingHandlers = (Baldic.Api.SaveLoadStatus)2;
public const Baldic.Api.SaveLoadStatus MissingItemsOrStickers = (Baldic.Api.SaveLoadStatus)3;
public const Baldic.Api.SaveLoadStatus MismatchedTags = (Baldic.Api.SaveLoadStatus)4;
```

## `SaveMode`

`Baldic.Api.SaveMode`

```text
public enum SaveMode
public const Baldic.Api.SaveMode Vanilla = (Baldic.Api.SaveMode)0;
public const Baldic.Api.SaveMode Modded = (Baldic.Api.SaveMode)1;
public const Baldic.Api.SaveMode None = (Baldic.Api.SaveMode)2;
public const Baldic.Api.SaveMode Unset = (Baldic.Api.SaveMode)3;
```

## `SaveSlots`

`Baldic.Api.SaveSlots`

```text
public static class SaveSlots
public static string FileName(int slot);
public static System.Collections.Generic.List<int> ParseList(string text);
public static string FormatList(System.Collections.Generic.IEnumerable<int> slots);
public static System.Collections.Generic.List<int> Scan(System.Collections.Generic.IEnumerable<string> fileNames);
public static bool IsCandidate(Baldic.Api.ModdedSave header, System.Collections.Generic.IList<Baldic.Api.InstalledHandler> installed);
public static int Pick(System.Collections.Generic.IDictionary<int, Baldic.Api.ModdedSave> headers, System.Collections.Generic.IList<Baldic.Api.InstalledHandler> installed, out bool duplicates);
public static int FreeIndex(System.Collections.Generic.IEnumerable<int> used);
public static string RawTags(string[] tags);
```

## `SavedItem`

`Baldic.Api.SavedItem`

```text
public sealed class SavedItem
public byte Version;
public string ModId;
public string Name;
public SavedItem();
public SavedItem(string modId, string name);
```

## `SavedMod`

`Baldic.Api.SavedMod`

```text
public sealed class SavedMod
public string Id;
public string[] Tags;
public SavedMod();
public SavedMod(string id, params string[] tags);
```

## `SavedSticker`

`Baldic.Api.SavedSticker`

```text
public sealed class SavedSticker
public string Name;
public object State;
public SavedSticker();
public SavedSticker(string name, object state);
```

## `SavesMod`

`Baldic.Api.SavesMod`

```text
public sealed class SavesMod
public void Init();
public SavesMod();
```

## `SceneIdMethod`

`Baldic.Api.SceneIdMethod`

```text
public enum SceneIdMethod
public const Baldic.Api.SceneIdMethod Metadata = (Baldic.Api.SceneIdMethod)0;
public const Baldic.Api.SceneIdMethod Legacy = (Baldic.Api.SceneIdMethod)1;
public const Baldic.Api.SceneIdMethod Name = (Baldic.Api.SceneIdMethod)2;
```

## `TextSaveHandler`

`Baldic.Api.TextSaveHandler`

```text
public abstract class TextSaveHandler : Baldic.Api.ModSaveHandler
protected TextSaveHandler(string modId);
public abstract string SaveText();
public abstract void LoadText(string text);
public void Save(System.IO.BinaryWriter writer);
public void Load(System.IO.BinaryReader reader);
```
