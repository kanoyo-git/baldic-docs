# BBCR: ui

Сборка: `Baldic.Api.Bbcr.Ui.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `MenuPage`

`Baldic.Bbcr.MenuPage`

```text
public sealed class MenuPage
public UnityEngine.RectTransform Root { get; }
public Baldic.Bbcr.MenuPage Label(string text);
public Baldic.Bbcr.MenuPage Button(string label, System.Action action);
public Baldic.Bbcr.MenuPage Category(string title, System.Action<Baldic.Bbcr.MenuPage> build);
public Baldic.Bbcr.MenuPage Toggle(string label, System.Func<bool> read, System.Action<bool> write);
public Baldic.Bbcr.MenuPage Number(string label, System.Func<float> read, System.Action<float> write, float step = 1f);
public Baldic.Bbcr.MenuPage Number(string label, System.Func<double> read, System.Action<double> write, double step = 1d);
public Baldic.Bbcr.MenuPage Text(string label, System.Func<string> read, System.Action<string> write);
public Baldic.Bbcr.MenuPage Choice(string label, System.Collections.Generic.IEnumerable<string> choices, System.Func<string> read, System.Action<string> write);
public Baldic.Bbcr.MenuPage Key(string label, System.Func<UnityEngine.KeyCode> read, System.Action<UnityEngine.KeyCode> write);
public Baldic.Bbcr.MenuPage Key(string label, System.Func<Baldic.Loader.Configuration.KeyboardShortcut> read, System.Action<Baldic.Loader.Configuration.KeyboardShortcut> write);
```

## `Menus`

`Baldic.Bbcr.Menus`

```text
public static class Menus
public static bool IsOpen { get; }
public static System.IDisposable Register(string id, string title, System.Action<Baldic.Bbcr.MenuPage> build, Baldic.ModContext owner = null);
public static void Open(string id);
public static void OpenMods();
public static void Close();
```

## `UiMod`

`Baldic.Bbcr.UiMod`

```text
public sealed class UiMod
public void Init(Baldic.ModContext context);
public UiMod();
```
