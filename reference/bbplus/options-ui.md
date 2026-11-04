# BB+: options-ui

Сборка: `Baldic.Api.OptionsUi.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `BaldiFonts`

`Baldic.Api.BaldiFonts`

```text
public enum BaldiFonts
public const Baldic.Api.BaldiFonts ComicSans12 = (Baldic.Api.BaldiFonts)0;
public const Baldic.Api.BaldiFonts ComicSans18 = (Baldic.Api.BaldiFonts)1;
public const Baldic.Api.BaldiFonts ComicSans24 = (Baldic.Api.BaldiFonts)2;
public const Baldic.Api.BaldiFonts ComicSans36 = (Baldic.Api.BaldiFonts)3;
public const Baldic.Api.BaldiFonts BoldComicSans12 = (Baldic.Api.BaldiFonts)4;
public const Baldic.Api.BaldiFonts BoldComicSans24 = (Baldic.Api.BaldiFonts)5;
public const Baldic.Api.BaldiFonts SmoothComicSans12 = (Baldic.Api.BaldiFonts)6;
public const Baldic.Api.BaldiFonts SmoothComicSans18 = (Baldic.Api.BaldiFonts)7;
public const Baldic.Api.BaldiFonts SmoothComicSans24 = (Baldic.Api.BaldiFonts)8;
public const Baldic.Api.BaldiFonts SmoothComicSans36 = (Baldic.Api.BaldiFonts)9;
```

## `CustomOptions`

`Baldic.Api.CustomOptions`

```text
public static class CustomOptions
public static event System.Action<OptionsMenu, Baldic.Api.CustomOptionsHandler> MenuOpened;
public static event System.Action<OptionsMenu, Baldic.Api.CustomOptionsHandler> MenuClosed;
```

## `CustomOptionsCategory`

`Baldic.Api.CustomOptionsCategory`

```text
public abstract class CustomOptionsCategory : UnityEngine.MonoBehaviour
public OptionsMenu Menu { get; }
public TooltipController Tooltips { get; }
public static UnityEngine.Sprite ArrowLeft { get; }
public static UnityEngine.Sprite ArrowLeftHighlight { get; }
public static UnityEngine.Sprite ArrowRight { get; }
public static UnityEngine.Sprite ArrowRightHighlight { get; }
public static UnityEngine.Sprite BarOff { get; }
public static UnityEngine.Sprite BarOn { get; }
public static UnityEngine.Sprite CheckBox { get; }
public static UnityEngine.Sprite CheckMark { get; }
public static SoundObject Silence { get; }
public abstract void Build();
protected static UnityEngine.Sprite MenuSprite(string name);
public TMPro.TextMeshProUGUI CreateText(string name, string text, UnityEngine.Vector3 position, Baldic.Api.BaldiFonts font = (Baldic.Api.BaldiFonts)2, TMPro.TextAlignmentOptions alignment = (TMPro.TextAlignmentOptions)514, System.Nullable<UnityEngine.Vector2> size = default, System.Nullable<UnityEngine.Color> color = default);
public StandardMenuButton CreateTextButton(UnityEngine.Events.UnityAction action, string name, string text, UnityEngine.Vector3 position, Baldic.Api.BaldiFonts font = (Baldic.Api.BaldiFonts)2, TMPro.TextAlignmentOptions alignment = (TMPro.TextAlignmentOptions)514, System.Nullable<UnityEngine.Vector2> size = default, System.Nullable<UnityEngine.Color> color = default);
public UnityEngine.UI.Image CreateImage(UnityEngine.Sprite sprite, string name, UnityEngine.Vector3 position, System.Nullable<UnityEngine.Vector2> size = default);
public StandardMenuButton CreateImageButton(UnityEngine.Events.UnityAction action, UnityEngine.Sprite normal, UnityEngine.Sprite highlighted, string name, UnityEngine.Vector3 position, System.Nullable<UnityEngine.Vector2> size = default);
public AdjustmentBars CreateBars(UnityEngine.Events.UnityAction onChange, string name, UnityEngine.Vector3 position, int count);
public MenuToggle CreateToggle(string name, string text, bool value, UnityEngine.Vector3 position, float width = 250f);
public StandardMenuButton CreateApplyButton(UnityEngine.Events.UnityAction action);
public void AddTooltip(StandardMenuButton b, string key);
public void AddTooltip(AdjustmentBars bars, string key);
public void AddTooltip(MenuToggle toggle, string key);
public StandardMenuButton CreateTooltipRegion(string name, string key, UnityEngine.Vector3 position, UnityEngine.Vector2 size, bool visible = false);
protected CustomOptionsCategory();
```

## `CustomOptionsHandler`

`Baldic.Api.CustomOptionsHandler`

```text
public sealed class CustomOptionsHandler : UnityEngine.MonoBehaviour
public OptionsMenu Menu { get; }
public System.Collections.Generic.IReadOnlyList<Baldic.Api.CustomOptionsCategory> Categories { get; }
public T AddCategory<T>(string name) where T : Baldic.Api.CustomOptionsCategory;
public T InsertCategory<T>(string name, int index) where T : Baldic.Api.CustomOptionsCategory;
public CustomOptionsHandler();
```

## `HighScoresCategory`

`Baldic.Api.HighScoresCategory`

```text
public sealed class HighScoresCategory : Baldic.Api.CustomOptionsCategory
public virtual void Build();
public void Refresh();
public HighScoresCategory();
```

## `OptionsUiMod`

`Baldic.Api.OptionsUiMod`

```text
public sealed class OptionsUiMod
public void Init();
public OptionsUiMod();
```

## `SavedGamesCategory`

`Baldic.Api.SavedGamesCategory`

```text
public sealed class SavedGamesCategory : Baldic.Api.CustomOptionsCategory
public virtual void Build();
public void Refresh();
public SavedGamesCategory();
```

## `UiHelpers`

`Baldic.Api.UiHelpers`

```text
public static class UiHelpers
public static readonly UnityEngine.Vector2 ScreenSize;
public static int FontSize(Baldic.Api.BaldiFonts f);
public static string AssetName(Baldic.Api.BaldiFonts f);
public static TMPro.TMP_FontAsset Font(Baldic.Api.BaldiFonts f);
public static UnityEngine.Vector3 FromTopLeft(UnityEngine.Vector3 p);
public static UnityEngine.UI.Image CreateImage(UnityEngine.Sprite sprite, UnityEngine.Transform parent, UnityEngine.Vector3 position, bool correctPosition = false, float scale = 1f);
public static TMPro.TextMeshProUGUI CreateText(Baldic.Api.BaldiFonts font, string text, UnityEngine.Transform parent, UnityEngine.Vector3 position, bool correctPosition = false);
public static UnityEngine.Canvas CreateBlankScreen(string name, bool assignCamera = true, bool active = true);
public static CursorInitiator AddCursor(UnityEngine.Canvas canvas, System.Nullable<UnityEngine.Vector2> screenSize = default, CursorController cursor = null);
public static UnityEngine.GameObject AddBlackBars(UnityEngine.Transform parent);
public static Baldic.Api.UiPointer Pointer(UnityEngine.GameObject go);
public static Baldic.Api.UiWheel Wheel(UnityEngine.GameObject go);
public static int RawValue(AdjustmentBars bars);
```

## `UiPointer`

`Baldic.Api.UiPointer`

```text
public sealed class UiPointer : UnityEngine.MonoBehaviour, UnityEngine.EventSystems.IPointerClickHandler, UnityEngine.EventSystems.IEventSystemHandler, UnityEngine.EventSystems.IPointerEnterHandler, UnityEngine.EventSystems.IPointerExitHandler, UnityEngine.EventSystems.IPointerDownHandler, UnityEngine.EventSystems.IPointerUpHandler
public System.Action<int> Click;
public System.Action<bool> Hover;
public System.Action<int> Down;
public System.Action<int> Up;
public bool Hovered { get; }
public void OnPointerClick(UnityEngine.EventSystems.PointerEventData e);
public void OnPointerDown(UnityEngine.EventSystems.PointerEventData e);
public void OnPointerUp(UnityEngine.EventSystems.PointerEventData e);
public void OnPointerEnter(UnityEngine.EventSystems.PointerEventData e);
public void OnPointerExit(UnityEngine.EventSystems.PointerEventData e);
public UiPointer();
```

## `UiWheel`

`Baldic.Api.UiWheel`

```text
public sealed class UiWheel : UnityEngine.MonoBehaviour, UnityEngine.EventSystems.IScrollHandler, UnityEngine.EventSystems.IEventSystemHandler
public System.Action<float> Wheel;
public void OnScroll(UnityEngine.EventSystems.PointerEventData e);
public UiWheel();
```
