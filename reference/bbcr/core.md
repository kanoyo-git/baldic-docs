# BBCR: core

Сборка: `Baldic.Api.Bbcr.Core.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `AnimationClock<T>`

`Baldic.Api.AnimationClock`1`

```text
public sealed class AnimationClock<T>
public string CurrentId { get; }
public int FrameIndex { get; }
public float Time { get; }
public bool Looping { get; set; }
public bool Paused { get; set; }
public float Speed { get; set; }
public string DefaultId { get; }
public float DefaultSpeed { get; }
public System.Collections.Generic.IDictionary<string, Baldic.Api.FrameAnimation<T>> Animations { get; }
public Baldic.Api.FrameAnimation<T> Current { get; }
public bool HasFrame { get; }
public T Value { get; }
public event System.Action<string> Finished;
public void Add(string id, Baldic.Api.FrameAnimation<T> anim);
public void Play(string id, float speed, System.Nullable<bool> loop = default);
public void PlayFrom(string id, float speed, float time, System.Nullable<bool> loop = default);
public void Stop();
public void SetDefault(string id, float speed, bool start = false);
public void Advance(float dt);
public AnimationClock<T>();
```

## `AssetRegistry`

`Baldic.Api.AssetRegistry`

```text
public class AssetRegistry
public readonly System.Collections.Generic.HashSet<System.Type> IgnoredTypes;
public static readonly Baldic.Api.AssetRegistry Shared;
public object this[System.Type t, string key] { get; set; }
public object this[string key] { get; }
public int Count { get; }
public void Add<T>(string key, T value);
public void Add(System.Type t, string key, object value);
public void AddRange<T>(System.Collections.Generic.IEnumerable<T> values);
public void AddRange<T>(System.Collections.Generic.IList<T> values, System.Collections.Generic.IList<string> keys);
public void AddRange<T>(System.Collections.Generic.IEnumerable<T> values, System.Func<T, string> key);
public void AddRange<T>(System.Collections.Generic.IDictionary<string, T> values);
public void AddRange<T>(System.Collections.Generic.IDictionary<T, string> values, string prefix);
public void AddFromResources<T>(string name = null, bool stripClone = false) where T : UnityEngine.Object;
public T Get<T>(string key);
public T[] All<T>();
public bool Contains<T>(string key);
public bool Remove<T>(string key);
public void Clear<T>();
public AssetRegistry();
```

## `AttachmentBinding`

`Baldic.Api.AttachmentBinding`

```text
public sealed class AttachmentBinding
public Baldic.Api.ResourceId Id { get; }
public object Holder { get; }
public AttachmentBinding(string id, object holder);
public AttachmentBinding(Baldic.Api.ResourceId id, object holder);
```

## `AttachmentType`

`Baldic.Api.AttachmentType`

```text
public abstract class AttachmentType : System.IDisposable
public Baldic.Api.ResourceId Id { get; }
public Baldic.ModContext Owner { get; }
public int Version { get; }
public bool Persistent { get; }
public bool Disposed { get; }
public void Dispose();
```

## `AttachmentType<T>`

`Baldic.Api.AttachmentType`1`

```text
public sealed class AttachmentType<T> : Baldic.Api.AttachmentType
```

## `Attachments`

`Baldic.Api.Attachments`

```text
public static class Attachments
public static Baldic.Api.AttachmentType<T> Register<T>(Baldic.Api.ResourceId id, System.Func<T> factory = null, System.Func<T, T> copy = null, System.Func<T, string> encode = null, System.Func<string, T> decode = null, int version = 1, Baldic.ModContext owner = null);
public static T Get<T>(object holder, Baldic.Api.AttachmentType<T> type);
public static bool TryGet<T>(object holder, Baldic.Api.AttachmentType<T> type, out T value);
public static void Set<T>(object holder, Baldic.Api.AttachmentType<T> type, T value);
public static bool Remove<T>(object holder, Baldic.Api.AttachmentType<T> type);
public static void Clear(object holder);
public static void Copy(object source, object target);
public static string Capture(object holder, Baldic.ModContext owner = null);
public static void Restore(object holder, string snapshot, Baldic.ModContext owner = null);
public static string CaptureBindings(System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding> bindings, Baldic.ModContext owner = null);
public static void RestoreBindings(System.Collections.Generic.IEnumerable<Baldic.Api.AttachmentBinding> bindings, string snapshot, Baldic.ModContext owner = null);
```

## `Enums`

`Baldic.Api.Enums`

```text
public static class Enums
public const int Offset = 256;
public static System.Action<string> Warn;
public static object Extend(System.Type t, string name);
public static T Extend<T>(string name) where T : System.Enum;
public static object GetOrExtend(System.Type t, string name);
public static T GetOrExtend<T>(string name) where T : System.Enum;
public static string NameOf(System.Type t, object value);
public static string NameOf<T>(T value) where T : System.Enum;
public static object TryValueOf(System.Type t, string name);
public static System.Nullable<T> TryValueOf<T>(string name) where T : struct, System.Enum;
public static object ValueOf(System.Type t, string name);
public static T ValueOf<T>(string name) where T : System.Enum;
public static bool Exists(System.Type t, string name);
public static bool Exists<T>(string name) where T : System.Enum;
public static object[] AllValues(System.Type t);
public static T[] AllValues<T>() where T : System.Enum;
public static string[] AddedNames(System.Type t);
```

## `Find`

`Baldic.Api.Find`

```text
public static class Find
public static UnityEngine.Object[] All(System.Type type, bool originalsOnly = false);
public static UnityEngine.Object[] Named(System.Type type, string name, bool originalsOnly = false);
public static UnityEngine.Object One(System.Type type, string name, bool originalsOnly = false);
public static T[] All<T>(bool originalsOnly = false) where T : UnityEngine.Object;
public static T[] Named<T>(string name, bool originalsOnly = false) where T : UnityEngine.Object;
public static T One<T>(string name, bool originalsOnly = false) where T : UnityEngine.Object;
public static UnityEngine.Object ByName(System.Type type, string name);
```

## `FrameAnimation<T>`

`Baldic.Api.FrameAnimation`1`

```text
public class FrameAnimation<T>
public Baldic.Api.Frame<T>[] Frames;
public float Length { get; }
public FrameAnimation<T>(int fps, T[] values);
public FrameAnimation<T>(T[] values, float totalTime);
public FrameAnimation<T>(Baldic.Api.Frame<T>[] frames);
```

## `Frame<T>`

`Baldic.Api.Frame`1`

```text
public struct Frame<T>
public T Value;
public float Duration;
public Frame<T>(T value, float duration);
```

## `HighScoreMods`

`Baldic.Api.HighScoreMods`

```text
public static class HighScoreMods
public static System.Collections.Generic.IReadOnlyList<string> All { get; }
public static void Register(string modId);
```

## `ModDataBag`

`Baldic.Api.ModDataBag`

```text
public sealed class ModDataBag
public System.Collections.Generic.IEnumerable<string> Mods { get; }
public object Get(string modId, string key);
public T Get<T>(string modId, string key, T fallback = default);
public void Set(string modId, string key, object value);
public bool Has(string modId, string key);
public void CopyFrom(Baldic.Api.ModDataBag other);
public ModDataBag();
```

## `Reflect`

`Baldic.Api.Reflect`

```text
public static class Reflect
public static object ReflectionGet(object target, string name);
public static T ReflectionGet<T>(object target, string name);
public static void ReflectionSet(object target, string name, object value);
public static object ReflectionInvoke(object target, string name, params object[] args);
public static void ListAdd(object target, string name, object value);
public static bool ListRemove(object target, string name, object value);
public static void ListSet(object target, string name, object[] values);
public static void CopyFields(object from, object to, System.Type upTo);
public static TTo CloneInto<TTo>(UnityEngine.ScriptableObject original) where TTo : UnityEngine.ScriptableObject;
public static TNew ReplaceComponent<TNew>(UnityEngine.Component old, bool redirectReferences = true) where TNew : UnityEngine.Component;
public static System.Collections.Generic.List<object> Drain(System.Collections.IEnumerator e);
public static T GetOrAddComponent<T>(UnityEngine.GameObject go) where T : UnityEngine.Component;
```

## `ResourceId`

`Baldic.Api.ResourceId`

```text
public struct ResourceId : System.IEquatable<Baldic.Api.ResourceId>, System.IComparable<Baldic.Api.ResourceId>
public string Namespace { get; }
public string Path { get; }
public bool IsValid { get; }
public ResourceId(string space, string path);
public static Baldic.Api.ResourceId Parse(string value);
public static bool TryParse(string value, out Baldic.Api.ResourceId result);
public virtual string ToString();
public bool Equals(Baldic.Api.ResourceId other);
public virtual bool Equals(object value);
public virtual int GetHashCode();
public int CompareTo(Baldic.Api.ResourceId other);
public static bool operator ==(Baldic.Api.ResourceId a, Baldic.Api.ResourceId b);
public static bool operator !=(Baldic.Api.ResourceId a, Baldic.Api.ResourceId b);
```

## `ResourceJson`

`Baldic.Api.ResourceJson`

```text
public static class ResourceJson
public static object Parse(string text, int maxCharacters = 67108864);
```

## `WaitForScaledSeconds`

`Baldic.Api.WaitForScaledSeconds`

```text
public class WaitForScaledSeconds : UnityEngine.CustomYieldInstruction
public bool keepWaiting { get; }
public WaitForScaledSeconds(float seconds, System.Func<float> scale);
public static Baldic.Api.WaitForScaledSeconds Npc(EnvironmentController ec, float s);
public static Baldic.Api.WaitForScaledSeconds Environment(EnvironmentController ec, float s);
public static Baldic.Api.WaitForScaledSeconds Activity(ActivityModifier am, float s);
public static Baldic.Api.WaitForScaledSeconds ForNpc(NPC npc, float s);
```

## `Assets`

`Baldic.Bbcr.Assets`

```text
public static class Assets
public static void Refresh();
public static System.Collections.Generic.IReadOnlyList<T> All<T>() where T : UnityEngine.Object;
public static T One<T>(string name) where T : UnityEngine.Object;
public static T Require<T>(string name) where T : UnityEngine.Object;
public static T Create<T>(string name) where T : UnityEngine.ScriptableObject;
public static T Clone<T>(T original, string name = null, bool template = true) where T : UnityEngine.Object;
public static T Resource<T>(string path) where T : UnityEngine.Object;
public static UnityEngine.AssetBundle Bundle(string relativePath);
```

## `Content`

`Baldic.Bbcr.Content`

```text
public static class Content
public static string Key(string id, Baldic.ModContext context = null);
public static System.IDisposable Register<T>(string id, T value, Baldic.ModContext context = null) where T : UnityEngine.Object;
public static bool TryGet<T>(string id, out T value) where T : UnityEngine.Object;
public static T Get<T>(string id) where T : UnityEngine.Object;
public static System.Collections.Generic.IReadOnlyDictionary<string, T> All<T>() where T : UnityEngine.Object;
public static string OwnerOf(string id);
```

## `CoreMod`

`Baldic.Bbcr.CoreMod`

```text
public sealed class CoreMod
public void PreLaunch(Baldic.ModContext context);
public CoreMod();
```
