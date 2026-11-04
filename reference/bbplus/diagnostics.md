# BB+: diagnostics

Сборка: `Baldic.Api.Diagnostics.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `CrashText`

`Baldic.Api.CrashText`

```text
public static class CrashText
public const int FadeSteps = 8;
public static string Build(string modId, System.Exception e);
public static string Build(string modId, string message, string stack);
public static float OverlayAlpha(float t, float shownFor);
```

## `Diagnostics`

`Baldic.Api.Diagnostics`

```text
public static class Diagnostics
public static bool Crashed { get; }
public static bool WarningsPassed { get; }
public static void AddWarningScreen(string text, bool fatal);
public static void CauseCrash(string modId, System.Exception e);
public static void CauseCrashQuiet(string modId, System.Exception e);
public static void ShowError(string message, float seconds = 5f);
```

## `DiagnosticsMod`

`Baldic.Api.DiagnosticsMod`

```text
public sealed class DiagnosticsMod
public static bool VisibleExceptions;
public void Init();
public DiagnosticsMod();
```

## `ErrorOverlay`

`Baldic.Api.ErrorOverlay`

```text
public sealed class ErrorOverlay : UnityEngine.MonoBehaviour
public static System.Collections.Generic.IReadOnlyList<Baldic.Api.ErrorOverlay> All { get; }
public string Text { get; }
public void Show(string message, float seconds);
public ErrorOverlay();
```

## `WarningScreens`

`Baldic.Api.WarningScreens`

```text
public static class WarningScreens
public static bool Passed { get; }
public static bool HasFatal { get; }
public static void Add(string text, bool fatal);
public static void Install(Baldic.Mixins.Patcher harmony);
public static void Install(Baldic.Mixins.Mixin.PatchSet patches);
```
