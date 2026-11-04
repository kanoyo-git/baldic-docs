# Loader: пакеты и общие контракты

Сборка: `Baldic.Loader.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../loader/README.md) · [Как читать справочник](README.md)

## `MiniJson`

`Baldic.Api.MiniJson`

```text
public static class MiniJson
public static object Parse(string text);
public static System.Collections.Generic.Dictionary<string, object> Object(object v);
public static System.Collections.Generic.List<object> Array(object v);
public static double Num(object obj, string key);
public static string Str(object obj, string key);
public static object Get(object obj, string key);
public static string Write(object v);
```

## `PrefabContainerGuard`

`Baldic.Api.PrefabContainerGuard`

```text
public sealed class PrefabContainerGuard : UnityEngine.MonoBehaviour
public PrefabContainerGuard();
```

## `Prefabs`

`Baldic.Api.Prefabs`

```text
public static class Prefabs
public static UnityEngine.Transform Container { get; }
public static void DontUnload(UnityEngine.Object o);
public static void AllowUnload(UnityEngine.Object o);
public static bool IsKept(UnityEngine.Object o);
public static UnityEngine.GameObject MakePrefab(UnityEngine.GameObject go, bool setActive = true);
public static bool IsPrefab(UnityEngine.Object o);
```

## `RuntimeDriver`

`Baldic.Api.RuntimeDriver`

```text
public sealed class RuntimeDriver : UnityEngine.MonoBehaviour
public RuntimeDriver();
```

## `SerializationProbe`

`Baldic.Api.SerializationProbe`

```text
public sealed class SerializationProbe : UnityEngine.MonoBehaviour
public Baldic.Api.SerializationProbeData Data;
public SerializationProbe();
```

## `SerializationProbeData`

`Baldic.Api.SerializationProbeData`

```text
public sealed class SerializationProbeData
public int Value;
public SerializationProbeData();
```

## `AssemblyRules`

`Baldic.AssemblyRules`

```text
public static class AssemblyRules
public static bool Protected(string name);
```

## `AttributeBindings`

`Baldic.AttributeBindings`

```text
public static class AttributeBindings
public static void Register(Baldic.ModContext context, System.Type type);
```

## `BaldicModAttribute`

`Baldic.BaldicModAttribute`

```text
public sealed class BaldicModAttribute : System.Attribute
public BaldicModAttribute();
```

## `Cleanup`

`Baldic.Cleanup`

```text
public sealed class Cleanup : System.IDisposable
public Cleanup(System.Action action);
public void Dispose();
```

## `ConfigAttribute`

`Baldic.ConfigAttribute`

```text
public sealed class ConfigAttribute : System.Attribute
public readonly string Section;
public readonly string Key;
public ConfigAttribute(string section, string key);
```

## `ConfigSetting`

`Baldic.ConfigSetting`

```text
public sealed class ConfigSetting
public string Section;
public string Key;
public string Description;
public System.Type Type;
public object Default;
public System.Nullable<double> Minimum;
public System.Nullable<double> Maximum;
public string[] Choices;
public static System.Collections.Generic.IEnumerable<Baldic.ConfigSetting> Parse(System.Collections.Generic.Dictionary<string, object> schema);
public ConfigSetting();
```

## `Driver`

`Baldic.Driver`

```text
public static class Driver
public static UnityEngine.MonoBehaviour Instance { get; set; }
public static event System.Action Frame;
public static void InitializeThread();
public static void CheckThread();
public static void Tick();
```

## `EventBus`

`Baldic.Events.EventBus`

```text
public static class EventBus
public static bool HasListeners(string name);
public static System.IDisposable On(string name, System.Action<Baldic.Events.GameEvent> callback, int priority = 0, string owner = null);
public static bool Has(string name);
public static void Emit(string name, Baldic.Events.GameEvent data);
```

## `GameEvent`

`Baldic.Events.GameEvent`

```text
public sealed class GameEvent
public object Instance;
public object[] Args;
public bool Cancelled;
public void Cancel();
public GameEvent();
```

## `GameEvents`

`Baldic.Events.GameEvents`

```text
public static class GameEvents
public const string GameBegin = "game.begin";
public const string GameOver = "game.over";
public const string PlayerSpawn = "player.spawn";
public const string GameExit = "game.exit";
```

## `Runtime`

`Baldic.Loader.Runtime`

```text
public static class Runtime
public static System.Action<string> StageRunner;
public static System.Action<Baldic.ModContext, System.Exception> FailureHandler;
public static string GameId { get; }
public static string GameName { get; }
public static string GameVersion { get; }
public static string ApiPackageId { get; }
public static System.Collections.Generic.IReadOnlyList<Baldic.LoaderDiagnostic> Diagnostics { get; }
public static bool HasFatal { get; }
public static System.Collections.Generic.IReadOnlyList<Baldic.ModInfo> Mods { get; set; }
public static System.Collections.Generic.IList<string> LoadOrder { get; set; }
public static event System.Action<Baldic.LoaderDiagnostic> DiagnosticReported;
public static void ReportDiagnostic(string text, bool fatal = false);
public static void SetEnabled(Baldic.ModInfo mod, bool enabled);
public static void ReportFailure(Baldic.ModContext context, System.Exception error);
public static void RunStage(string stage);
public static string RootOf(string id);
```

## `RuntimeEntrypoint`

`Baldic.Loader.RuntimeEntrypoint`

```text
public static class RuntimeEntrypoint
public static void Initialize(UnityEngine.GameObject manager);
```

## `LoaderDiagnostic`

`Baldic.LoaderDiagnostic`

```text
public sealed class LoaderDiagnostic
public string Text { get; }
public bool Fatal { get; }
public LoaderDiagnostic(string text, bool fatal);
```

## `Log`

`Baldic.Log`

```text
public static class Log
public static event System.Action<Baldic.LogLevel, string, string> Written;
public static void Debug(string id, string message);
public static void Info(string id, string message);
public static void Warn(string id, string message);
public static void Error(string id, string message);
```

## `LogLevel`

`Baldic.LogLevel`

```text
public enum LogLevel
public const Baldic.LogLevel Debug = (Baldic.LogLevel)0;
public const Baldic.LogLevel Info = (Baldic.LogLevel)1;
public const Baldic.LogLevel Warning = (Baldic.LogLevel)2;
public const Baldic.LogLevel Error = (Baldic.LogLevel)3;
public const Baldic.LogLevel Fatal = (Baldic.LogLevel)4;
```

## `ModContext`

`Baldic.ModContext`

```text
public sealed class ModContext : System.IDisposable
public static Baldic.ModContext Current { get; }
public string Id { get; }
public string Version { get; }
public string Root { get; }
public string Phase { get; set; }
public Baldic.Loader.Configuration.ConfigFile Config { get; }
public Baldic.Loader.PluginInfo PluginInfo { get; }
public bool Active { get; }
public bool Faulted { get; }
public uint Generation { get; }
public int ResourceCount { get; }
public bool HasContent { get; }
public static event System.Action<string> OnUnload;
public void MarkContent();
public ModContext(string id, string version, string root, Baldic.Loader.Configuration.ConfigFile config, Baldic.Loader.PluginInfo plugin = null);
public Baldic.ModContext.Scope Enter();
public T Own<T>(T resource) where T : System.IDisposable;
public T OwnObject<T>(T value) where T : UnityEngine.Object;
public void Dispose();
```

## `Scope`

`Baldic.ModContext.Scope`

```text
public struct Scope : System.IDisposable
public void Dispose();
```

## `ModInfo`

`Baldic.ModInfo`

```text
public sealed class ModInfo
public string Id;
public string Version;
public string Name;
public string Root;
public string Error;
public bool Enabled;
public bool RestartRequired;
public bool Builtin;
public bool ExternalPlugin;
public Baldic.Package Manifest;
public Baldic.ModContext Context;
public ModInfo();
```

## `Mods`

`Baldic.Mods`

```text
public static class Mods
public static System.Func<UnityEngine.MonoBehaviour, object, Baldic.ModContext> RegisterPlugin;
public static Baldic.ModContext Register(UnityEngine.MonoBehaviour plugin, object entrypoint);
```

## `OnAttribute`

`Baldic.OnAttribute`

```text
public sealed class OnAttribute : System.Attribute
public string Event { get; }
public int Priority { get; set; }
public OnAttribute(string name);
```

## `Package`

`Baldic.Package`

```text
public sealed class Package
public const string LoaderVersion = "1.0.0";
public string Id;
public string Name;
public string Version;
public string Root;
public string Source;
public string Fingerprint;
public string Description;
public string License;
public string[] Authors;
public string[] Provides;
public string[] Mixins;
public string[] Transformers;
public string[] AccessWideners;
public string[] NestedDependencies;
public Baldic.Package Parent;
public System.Collections.Generic.Dictionary<string, string> Depends;
public System.Collections.Generic.Dictionary<string, string> Recommends;
public System.Collections.Generic.Dictionary<string, string> Breaks;
public System.Collections.Generic.Dictionary<string, string> Conflicts;
public System.Collections.Generic.Dictionary<string, string[]> Entrypoints;
public System.Collections.Generic.Dictionary<string, object> Config;
public static readonly string[] Stages;
public bool Requires(Baldic.Package dependency);
public static Baldic.Package Parse(string text, string root, string source);
public Package();
```

## `PackageDiscovery`

`Baldic.PackageDiscovery`

```text
public sealed class PackageDiscovery
public PackageDiscovery(string cache, System.Func<string, System.Collections.Generic.IEnumerable<string>> selectRoots = null);
public static string Hash(string file);
public static string Fingerprint(string root);
public static Baldic.Package Read(string root, string source, string manifest = "baldic.mod.json");
public Baldic.Package[] Expand(Baldic.Package parent);
```

## `PackagePaths`

`Baldic.PackagePaths`

```text
public static class PackagePaths
public static string Within(string root, string relative);
public static System.Collections.Generic.IEnumerable<string> Files(string root);
public static void Extract(string archive, string destination);
```

## `Resolution`

`Baldic.Resolution`

```text
public sealed class Resolution
public readonly System.Collections.Generic.List<Baldic.Package> Order;
public readonly System.Collections.Generic.Dictionary<string, string> Errors;
public readonly System.Collections.Generic.List<string> Warnings;
public Resolution();
```

## `Resolver`

`Baldic.Resolver`

```text
public static class Resolver
public static Baldic.Resolution Resolve(System.Collections.Generic.IEnumerable<Baldic.Package> packages, System.Collections.Generic.IDictionary<string, string> environment);
```

## `SemVersion`

`Baldic.SemVersion`

```text
public sealed class SemVersion : System.IComparable<Baldic.SemVersion>
public readonly int Major;
public readonly int Minor;
public readonly int Patch;
public static Baldic.SemVersion Parse(string value);
public int CompareTo(Baldic.SemVersion b);
```

## `GameTestAttribute`

`Baldic.Testing.GameTestAttribute`

```text
public sealed class GameTestAttribute : System.Attribute
public string Name { get; }
public double TimeoutSeconds { get; set; }
public GameTestAttribute(string name);
```

## `GameTestContext`

`Baldic.Testing.GameTestContext`

```text
public sealed class GameTestContext
public void Assert(bool condition, string message);
public void Equal<T>(T expected, T actual, string message);
public T Own<T>(T resource) where T : System.IDisposable;
public System.Collections.IEnumerator WaitFrames(int frames);
public System.Collections.IEnumerator WaitUntil(System.Func<bool> condition);
public void Screenshot(string name);
```

## `GameTestResult`

`Baldic.Testing.GameTestResult`

```text
public sealed class GameTestResult
public string Name { get; }
public bool Passed { get; }
public string Error { get; }
public int Assertions { get; }
public double Seconds { get; }
public GameTestResult();
```

## `GameTestRunner`

`Baldic.Testing.GameTestRunner`

```text
public sealed class GameTestRunner
public bool Finished { get; }
public System.Collections.Generic.IReadOnlyList<Baldic.Testing.GameTestResult> Results { get; }
public GameTestRunner(System.Func<double> clock, System.Action<string> screenshot = null);
public void Add(string name, System.Func<Baldic.Testing.GameTestContext, System.Collections.IEnumerator> body, double timeoutSeconds = 10d, System.Func<System.IDisposable> scope = null);
public bool Remove(string name);
public System.Collections.IEnumerator Run();
```

## `GameTests`

`Baldic.Testing.GameTests`

```text
public static class GameTests
public static bool Enabled { get; }
public static void Register(string name, System.Func<Baldic.Testing.GameTestContext, System.Collections.IEnumerator> body, double timeoutSeconds = 10d);
public static void Register(System.Type testClass);
```

## `VersionRange`

`Baldic.VersionRange`

```text
public static class VersionRange
public static bool Matches(string version, string range);
```
