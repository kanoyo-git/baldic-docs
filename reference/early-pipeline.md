# Ранняя загрузка и преобразования

Сборка: `Baldic.Loader.Preloader.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../loader/early-pipeline.md) · [Как читать справочник](README.md)

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

## `AssemblyRules`

`Baldic.AssemblyRules`

```text
public static class AssemblyRules
public static bool Protected(string name);
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

## `PreloaderEntrypoint`

`Baldic.Loader.PreloaderEntrypoint`

```text
public static class PreloaderEntrypoint
public static bool PackagesPending { get; }
public static void Register();
public static void Validate();
public static void PrepareRuntime();
public static void CompletePackages(System.Action<string, long, long> progress);
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

## `AccessTransforms`

`Baldic.Transforms.AccessTransforms`

```text
public static class AccessTransforms
public static string Validate(string json);
```

## `EarlyTransforms`

`Baldic.Transforms.EarlyTransforms`

```text
public sealed class EarlyTransforms
public System.Collections.Generic.IEnumerable<string> TargetDLLs { get; }
public System.Collections.Generic.IEnumerable<string> PackageIds { get; }
public System.Exception Failure { get; }
public bool IsComplete { get; }
public static Baldic.Transforms.EarlyTransforms Initialize(System.Collections.Generic.IEnumerable<Baldic.Package> packages, string managedPath, System.Action<string> log = null);
public void Patch(Mono.Cecil.AssemblyDefinition assembly);
public void ValidateComplete();
public static string[] PrepareSdk(System.Collections.Generic.IEnumerable<Baldic.Package> packages, string managedPath, string outputPath, System.Action<string> log = null);
```

## `IAssemblyTransformer`

`Baldic.Transforms.IAssemblyTransformer`

```text
public interface IAssemblyTransformer
public System.Collections.Generic.IEnumerable<string> TargetAssemblies { get; }
public abstract void Transform(Mono.Cecil.AssemblyDefinition assembly, Baldic.Transforms.TransformContext context);
```

## `TransformContext`

`Baldic.Transforms.TransformContext`

```text
public sealed class TransformContext
public string Id { get; }
public string Root { get; }
public string ManagedPath { get; }
public void Log(string message);
```

## `TransformException`

`Baldic.Transforms.TransformException`

```text
public sealed class TransformException : System.InvalidOperationException
public string PackageId { get; }
public string Target { get; }
public string Declaration { get; }
```

## `VersionRange`

`Baldic.VersionRange`

```text
public static class VersionRange
public static bool Matches(string version, string range);
```
