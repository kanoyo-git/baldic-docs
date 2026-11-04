# Loader: плагины, конфигурация и журнал

Сборка: `BepInEx.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../loader/README.md) · [Как читать справочник](README.md)

## `BasePlugin`

`Baldic.Loader.BasePlugin`

```text
public abstract class BasePlugin : BepInEx.BaseUnityPlugin
public Baldic.Loader.PluginInfo Info { get; }
public Baldic.Loader.Configuration.ConfigFile Config { get; }
protected Baldic.Loader.Logging.LogSource Logger { get; }
protected BasePlugin();
```

## `AcceptableValueBase`

`Baldic.Loader.Configuration.AcceptableValueBase`

```text
public abstract class AcceptableValueBase : BepInEx.Configuration.AcceptableValueBase
protected AcceptableValueBase(System.Type valueType);
```

## `AcceptableValueList<T>`

`Baldic.Loader.Configuration.AcceptableValueList`1`

```text
public sealed class AcceptableValueList<T> : Baldic.Loader.Configuration.AcceptableValueBase where T : System.IEquatable<T>
public T[] AcceptableValues { get; }
public AcceptableValueList<T>(params T[] values);
public virtual object Clamp(object value);
public virtual bool IsValid(object value);
public virtual string ToDescriptionString();
```

## `AcceptableValueRange<T>`

`Baldic.Loader.Configuration.AcceptableValueRange`1`

```text
public sealed class AcceptableValueRange<T> : Baldic.Loader.Configuration.AcceptableValueBase where T : System.IComparable
public T MinValue { get; }
public T MaxValue { get; }
public AcceptableValueRange<T>(T minValue, T maxValue);
public virtual object Clamp(object value);
public virtual bool IsValid(object value);
public virtual string ToDescriptionString();
```

## `ConfigDefinition`

`Baldic.Loader.Configuration.ConfigDefinition`

```text
public sealed class ConfigDefinition : System.IEquatable<Baldic.Loader.Configuration.ConfigDefinition>
public string Section { get; }
public string Key { get; }
public ConfigDefinition(string section, string key);
public bool Equals(Baldic.Loader.Configuration.ConfigDefinition other);
public virtual bool Equals(object obj);
public virtual int GetHashCode();
public virtual string ToString();
```

## `ConfigDescription`

`Baldic.Loader.Configuration.ConfigDescription`

```text
public sealed class ConfigDescription
public string Description { get; }
public Baldic.Loader.Configuration.AcceptableValueBase AcceptableValues { get; }
public object[] Tags { get; }
public ConfigDescription(string description, Baldic.Loader.Configuration.AcceptableValueBase acceptableValues = null, params object[] tags);
```

## `ConfigEntryBase`

`Baldic.Loader.Configuration.ConfigEntryBase`

```text
public abstract class ConfigEntryBase
public BepInEx.Configuration.ConfigEntryBase Legacy { get; }
public Baldic.Loader.Configuration.ConfigFile ConfigFile { get; }
public Baldic.Loader.Configuration.ConfigDefinition Definition { get; }
public Baldic.Loader.Configuration.ConfigDescription Description { get; }
public System.Type SettingType { get; }
public object DefaultValue { get; }
public object BoxedValue { get; set; }
public event System.EventHandler SettingChanged;
public string GetSerializedValue();
public void SetSerializedValue(string value);
```

## `ConfigEntry<T>`

`Baldic.Loader.Configuration.ConfigEntry`1`

```text
public class ConfigEntry<T> : Baldic.Loader.Configuration.ConfigEntryBase
public T Value { get; set; }
public object BoxedValue { get; set; }
```

## `ConfigFile`

`Baldic.Loader.Configuration.ConfigFile`

```text
public sealed class ConfigFile : System.Collections.Generic.IEnumerable<System.Collections.Generic.KeyValuePair<Baldic.Loader.Configuration.ConfigDefinition, Baldic.Loader.Configuration.ConfigEntryBase>>, System.Collections.IEnumerable
public BepInEx.Configuration.ConfigFile Legacy { get; }
public string ConfigFilePath { get; }
public bool SaveOnConfigSet { get; set; }
public event System.EventHandler<Baldic.Loader.Configuration.SettingChangedEventArgs> SettingChanged;
public ConfigFile(string path, bool saveOnInit = false);
public static Baldic.Loader.Configuration.ConfigFile FromCompatibility(object file);
public Baldic.Loader.Configuration.ConfigEntry<T> Bind<T>(string section, string key, T defaultValue, string description);
public Baldic.Loader.Configuration.ConfigEntry<T> Bind<T>(string section, string key, T defaultValue, Baldic.Loader.Configuration.ConfigDescription description = null);
public Baldic.Loader.Configuration.ConfigEntry<T> Bind<T>(Baldic.Loader.Configuration.ConfigDefinition definition, T defaultValue, Baldic.Loader.Configuration.ConfigDescription description = null);
public bool TryGetEntry<T>(Baldic.Loader.Configuration.ConfigDefinition definition, out Baldic.Loader.Configuration.ConfigEntry<T> entry);
public bool TryGetEntry<T>(string section, string key, out Baldic.Loader.Configuration.ConfigEntry<T> entry);
public System.Collections.Generic.IEnumerator<System.Collections.Generic.KeyValuePair<Baldic.Loader.Configuration.ConfigDefinition, Baldic.Loader.Configuration.ConfigEntryBase>> GetEnumerator();
public void Save();
public void Reload();
```

## `KeyboardShortcut`

`Baldic.Loader.Configuration.KeyboardShortcut`

```text
public struct KeyboardShortcut : System.IEquatable<Baldic.Loader.Configuration.KeyboardShortcut>
public static readonly Baldic.Loader.Configuration.KeyboardShortcut Empty;
public UnityEngine.KeyCode MainKey { get; }
public System.Collections.Generic.IEnumerable<UnityEngine.KeyCode> Modifiers { get; }
public KeyboardShortcut(UnityEngine.KeyCode mainKey, params UnityEngine.KeyCode[] modifiers);
public static Baldic.Loader.Configuration.KeyboardShortcut Deserialize(string value);
public string Serialize();
public bool IsDown();
public bool IsPressed();
public bool IsUp();
public bool Equals(Baldic.Loader.Configuration.KeyboardShortcut other);
public virtual bool Equals(object obj);
public virtual int GetHashCode();
public virtual string ToString();
```

## `SettingChangedEventArgs`

`Baldic.Loader.Configuration.SettingChangedEventArgs`

```text
public sealed class SettingChangedEventArgs : System.EventArgs
public Baldic.Loader.Configuration.ConfigEntryBase ChangedSetting { get; }
```

## `DependencyAttribute`

`Baldic.Loader.DependencyAttribute`

```text
public sealed class DependencyAttribute : BepInEx.BepInDependency
public DependencyAttribute(string id, Baldic.Loader.DependencyKind kind = (Baldic.Loader.DependencyKind)1);
public DependencyAttribute(string id, string minimumVersion);
```

## `DependencyKind`

`Baldic.Loader.DependencyKind`

```text
public enum DependencyKind
public const Baldic.Loader.DependencyKind Hard = (Baldic.Loader.DependencyKind)1;
public const Baldic.Loader.DependencyKind Soft = (Baldic.Loader.DependencyKind)2;
```

## `IncompatibilityAttribute`

`Baldic.Loader.IncompatibilityAttribute`

```text
public sealed class IncompatibilityAttribute : BepInEx.BepInIncompatibility
public IncompatibilityAttribute(string id);
```

## `LogEventArgs`

`Baldic.Loader.Logging.LogEventArgs`

```text
public sealed class LogEventArgs : System.EventArgs
public object Data { get; }
public Baldic.Loader.Logging.LogLevel Level { get; }
```

## `LogLevel`

`Baldic.Loader.Logging.LogLevel`

```text
public enum LogLevel
public const Baldic.Loader.Logging.LogLevel None = (Baldic.Loader.Logging.LogLevel)0;
public const Baldic.Loader.Logging.LogLevel Fatal = (Baldic.Loader.Logging.LogLevel)1;
public const Baldic.Loader.Logging.LogLevel Error = (Baldic.Loader.Logging.LogLevel)2;
public const Baldic.Loader.Logging.LogLevel Warning = (Baldic.Loader.Logging.LogLevel)4;
public const Baldic.Loader.Logging.LogLevel Message = (Baldic.Loader.Logging.LogLevel)8;
public const Baldic.Loader.Logging.LogLevel Info = (Baldic.Loader.Logging.LogLevel)16;
public const Baldic.Loader.Logging.LogLevel Debug = (Baldic.Loader.Logging.LogLevel)32;
public const Baldic.Loader.Logging.LogLevel All = (Baldic.Loader.Logging.LogLevel)63;
```

## `LogSource`

`Baldic.Loader.Logging.LogSource`

```text
public sealed class LogSource
public BepInEx.Logging.ManualLogSource Legacy { get; }
public string SourceName { get; }
public event System.EventHandler<Baldic.Loader.Logging.LogEventArgs> LogEvent;
public static Baldic.Loader.Logging.LogSource Create(string name);
public static void FlushDiskLogs();
public void Log(Baldic.Loader.Logging.LogLevel level, object data);
public void LogFatal(object data);
public void LogError(object data);
public void LogWarning(object data);
public void LogMessage(object data);
public void LogInfo(object data);
public void LogDebug(object data);
```

## `Paths`

`Baldic.Loader.Paths`

```text
public static class Paths
public static string GameRootPath { get; }
public static string RootPath { get; }
public static string CorePath { get; }
public static string ManagedPath { get; }
public static string PluginPath { get; }
public static string PatcherPath { get; }
public static string ConfigPath { get; }
public static string CachePath { get; }
public static string ExecutablePath { get; }
```

## `PluginAttribute`

`Baldic.Loader.PluginAttribute`

```text
public sealed class PluginAttribute : BepInEx.BepInPlugin
public PluginAttribute(string id, string name, string version);
```

## `PluginDependency`

`Baldic.Loader.PluginDependency`

```text
public sealed class PluginDependency
public string Id { get; }
public Baldic.Loader.DependencyKind Kind { get; }
public System.Version MinimumVersion { get; }
```

## `PluginInfo`

`Baldic.Loader.PluginInfo`

```text
public sealed class PluginInfo
public BepInEx.PluginInfo Legacy { get; }
public string Id { get; }
public string Name { get; }
public System.Version Version { get; }
public string Location { get; }
public UnityEngine.MonoBehaviour Instance { get; }
public Baldic.Loader.Configuration.ConfigFile Config { get; }
public System.Collections.Generic.IEnumerable<Baldic.Loader.PluginDependency> Dependencies { get; }
public static Baldic.Loader.PluginInfo FromCompatibility(object value);
```

## `Plugins`

`Baldic.Loader.Plugins`

```text
public static class Plugins
public static System.Collections.Generic.IEnumerable<Baldic.Loader.PluginInfo> All { get; }
public static Baldic.Loader.PluginInfo Find(string id);
public static Baldic.Loader.PluginInfo FromInstance(UnityEngine.MonoBehaviour instance);
```

## `ProcessAttribute`

`Baldic.Loader.ProcessAttribute`

```text
public sealed class ProcessAttribute : BepInEx.BepInProcess
public ProcessAttribute(string name);
```
