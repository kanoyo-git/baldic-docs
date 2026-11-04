# BBCR: loading

Сборка: `Baldic.Api.Bbcr.Loading.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `Loading`

`Baldic.Api.Loading`

```text
public static class Loading
public static bool Done { get; }
public static bool Started { get; }
public static bool TooLateForGeneratorFeatures { get; }
public static System.Nullable<Baldic.Api.LoadingStage> CurrentStage { get; }
public static string ApiVersion { get; }
public static event System.Action Finished;
public static void Register(string modId, System.Collections.IEnumerator coroutine, Baldic.Api.LoadingStage stage);
public static void Register(string modId, System.Func<System.Collections.IEnumerator> create, Baldic.Api.LoadingStage stage);
public static void Register(string modId, System.Action action, Baldic.Api.LoadingStage stage);
public static void Register(string modId, System.Action action, string stage);
public static void Register(System.Action action, Baldic.Api.LoadingStage stage);
public static void AddPhase(Baldic.Api.LoadingPhase phase, string name, System.Func<System.Collections.IEnumerator> work);
public static void AddPhase(Baldic.Api.LoadingPhase phase, string name, System.Action work);
public static System.Collections.Generic.List<Baldic.Api.LoadingEvent> EventsOf(Baldic.Api.LoadingStage stage);
```

## `LoadingEvent`

`Baldic.Api.LoadingEvent`

```text
public sealed class LoadingEvent
public string ModId;
public Baldic.Api.LoadingStage Stage;
public System.Func<System.Collections.IEnumerator> Create;
public int Seq;
public LoadingEvent();
```

## `LoadingMod`

`Baldic.Api.LoadingMod`

```text
public sealed class LoadingMod
public void Init(Baldic.ModContext context);
public LoadingMod();
```

## `LoadingOrder`

`Baldic.Api.LoadingOrder`

```text
public static class LoadingOrder
public static System.Collections.Generic.List<Baldic.Api.LoadingEvent> Sort(System.Collections.Generic.IEnumerable<Baldic.Api.LoadingEvent> events, System.Collections.Generic.IList<string> loadOrder);
```

## `LoadingPhase`

`Baldic.Api.LoadingPhase`

```text
public enum LoadingPhase
public const Baldic.Api.LoadingPhase AfterWarmup = (Baldic.Api.LoadingPhase)0;
public const Baldic.Api.LoadingPhase AfterStart = (Baldic.Api.LoadingPhase)1;
public const Baldic.Api.LoadingPhase AfterPre = (Baldic.Api.LoadingPhase)2;
public const Baldic.Api.LoadingPhase BeforePost = (Baldic.Api.LoadingPhase)3;
public const Baldic.Api.LoadingPhase AfterPost = (Baldic.Api.LoadingPhase)4;
```

## `LoadingProtocolException`

`Baldic.Api.LoadingProtocolException`

```text
public sealed class LoadingProtocolException : System.Exception
public LoadingProtocolException(string modId, string message);
```

## `LoadingStage`

`Baldic.Api.LoadingStage`

```text
public enum LoadingStage
public const Baldic.Api.LoadingStage Start = (Baldic.Api.LoadingStage)0;
public const Baldic.Api.LoadingStage Pre = (Baldic.Api.LoadingStage)1;
public const Baldic.Api.LoadingStage Post = (Baldic.Api.LoadingStage)2;
public const Baldic.Api.LoadingStage Final = (Baldic.Api.LoadingStage)3;
```

## `LoadingTask`

`Baldic.Api.LoadingTask`

```text
public sealed class LoadingTask
public string ModId { get; }
public int Steps { get; }
public int MaxSteps { get; }
public string Text { get; }
public bool Done { get; }
public object Current { get; }
public float Progress { get; }
public LoadingTask(string modId, System.Collections.IEnumerator inner);
public static System.Collections.IEnumerator FromAction(System.Action action, string text = "");
public bool MoveNext();
```

## `VersionText`

`Baldic.Api.VersionText`

```text
public static class VersionText
public static int Compare(string a, string b);
public static string FromJson(string json);
public static string UpdateStatus(string local, string latest);
```
