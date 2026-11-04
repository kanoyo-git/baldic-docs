# Настройки и нативное меню

`Baldic.Bbcr.Menus` создаёт страницы в стиле Classic Remastered через `StandardMenuButton` и игровой курсор. Модуль UI добавляет Mods в главное меню и категорию Mods в нативные игровые Options. Его ID — `baldic-api-bbcr-ui`, сборка — `Baldic.Api.Bbcr.Ui.dll`. Не используйте BB+ Options API в BBCR.

Для обычных настроек достаточно `context.Config.Bind`: автоматическая страница Settings отображает зарегистрированные параметры мода. Собственная страница `Menus.Register` нужна для действий, пояснений и особой группировки. Можно применять оба подхода: они работают с одними ConfigEntry, если вы связываете controls с этими entries.

## Урок: сохраняемые настройки

Это полный отдельный `Mod.cs` для проекта [первого урока](setup.md). Требуются Core, Loading и UI BBCR, Loader, игровые Unity references; **для `ConfigDescription`/`AcceptableValueRange` добавьте совместимую `BepInEx.dll` из SDK**. Эти классы находятся в `Baldic.Loader.Configuration`, хотя их метаданные совместимы с BepInEx.

```csharp
using Baldic;
using Baldic.Bbcr;
using Baldic.Loader.Configuration;
using UnityEngine;

[BaldicMod]
public sealed class FieldKitSettings
{
    public void Init(ModContext context)
    {
        var enabled = context.Config.Bind("General", "Enabled", true,
            "Enable this mod's effects.");
        var speed = context.Config.Bind("Movement", "Multiplier", 1.1f,
            new ConfigDescription("Movement multiplier.",
                new AcceptableValueRange<float>(0.5f, 2f)));
        var message = context.Config.Bind("General", "Message", "Hello BBCR",
            "Text used by the mod.");
        var preset = context.Config.Bind("General", "Preset", "Normal",
            new ConfigDescription("Preset name.",
                new AcceptableValueList<string>("Normal", "Quiet")));
        var key = context.Config.Bind("Keys", "Action",
            new KeyboardShortcut(KeyCode.M), "Action shortcut.");

        Menus.Register("field-kit.settings", "Field Kit", page =>
        {
            page.Label("Settings are saved to this mod's config.")
                .Toggle("Enabled", () => enabled.Value, value =>
                {
                    enabled.Value = value;
                    context.Config.Save();
                })
                .Number("Speed", () => speed.Value, value =>
                {
                    speed.Value = value;
                    context.Config.Save();
                }, 0.1f)
                .Text("Message", () => message.Value, value =>
                {
                    message.Value = value;
                    context.Config.Save();
                })
                .Choice("Preset", new[] { "Normal", "Quiet" },
                    () => preset.Value, value =>
                    {
                        preset.Value = value;
                        context.Config.Save();
                    })
                .Key("Action", () => key.Value, value =>
                {
                    key.Value = value;
                    context.Config.Save();
                })
                .Category("About", child => child.Label("A BBCR example."))
                .Button("Reload config", () => context.Config.Reload());
        });
    }
}
```

Откройте Mods → Mod pages → Field Kit. Измените значение, вернитесь назад и откройте страницу снова; оно должно остаться тем же. Перезапуск игры проверяет сохранение на диск. Урок только создаёт настройки: скорость игрока он ещё не меняет. Связь параметра с игровым эффектом показана в [практическом рецепте](recipes.md).

`context.Config` хранится в loader config-каталоге как `<id-мода>.cfg`; этот файл не является нативным `PlayerConfig_<профиль>.cfg`. `ConfigEntry.Value` — текущее типизированное значение. `ConfigDescription` задаёт описание и допустимые значения; UI шагает по числу, а диапазон ConfigEntry ограничивает результат. Если поля разрешено изменять несколькими способами, обработчик эффекта должен читать entry, а не отдельную несинхронизированную переменную.

## Контракт controls

| Вызов `MenuPage` | Представление | Ограничения |
|---|---|---|
| `Label(text)` | Строки текста | Переводы строки разделяют rows; очень длинные строки режутся по 96 символов |
| `Button(label, Action)` | Нативная кнопка | Действие выполняется при нажатии |
| `Category(title, Action<MenuPage>)` | Подстраница и стрелка | Содержимое строится при открытии/обновлении |
| `Toggle(label, Func<bool>, Action<bool>)` | On/Off | Запись выполняет ваш setter |
| `Number` для float/double | −, значение, + | Шаг по умолчанию 1; прямой ввод использует invariant culture и требует конечное число |
| `Text` | Текстовое поле через отдельный editor | Enter применяет, Escape отменяет |
| `Choice` | Циклический выбор | Список должен быть непустым; это строки, не enum reflection adapter |
| `Key` для `KeyCode` | Захват одной клавиши | Escape отменяет |
| `Key` для `KeyboardShortcut` | Клавиша с модификаторами | Захватываются Shift/Ctrl/Alt, удерживаемые при выборе |
| `Root` | `RectTransform` текущего body | Для собственного UI; тело может быть перестроено |

Controls принимают функции чтения и записи, а не копии значений. Сеттер сохраняет значение или вызывает эффект; getter читает актуальное состояние при render. Обычная страница показывает семь строк на страницу, встроенная Options-категория — шесть; длинные настройки автоматически получают пагинацию.

Числовой editor принимает точку как десятичный разделитель. Проверки диапазона, целочисленности и смысловых ограничений задавайте в ConfigEntry/сеттере. Факт наличия кнопок `−/+` не означает, что произвольное число валидно для вашей механики.

## Открытие, контекст и очистка

`Menus.Register(id, title, build, owner=null)` возвращает `IDisposable`; owner берётся из текущего context. Page ID глобален внутри Menus, не получает namespace автоматически: включайте ID своего мода в строку. Повторная регистрация того же ID вызывает ошибку. Снятие регистрации открытой страницы закрывает меню.

`Menus.Open(id)`, `OpenMods()`, `Close()` управляют страницами; `IsOpen` сообщает состояние. Регистрировать страницу можно в `Init`, но открывать её следует после `Loading.Done` и готовности **нативного курсора главного меню**. Открытие в ClassicLauncher/Logo или во время загрузки не поддерживается. Для своей кнопки или hotkey сначала проверьте состояние игры; tutorial не обещает, что Mods является универсальным in-game overlay для любой сцены.

Build callback и действия controls выполняются в контексте владельца страницы. Ошибки логируются с ID мода и отображаются как status страницы. Native menus блокирует нажатия во время перехода `GlobalCam`; закрытие возвращает прежний UI и положение курсора. Не реализуйте второй курсор поверх этого механизма.

`Root` и созданные rows не следует кэшировать навсегда: refresh заново строит body. Не подписывайтесь на глобальные события и не создавайте игровые definitions внутри `build`: он вызывается многократно. Регистрации, import и event subscriptions делайте один раз в lifecycle, а `build` используйте для представления состояния.

Если подписываетесь напрямую на `ConfigEntry.SettingChanged`, снимите обработчик через `context.Own(new Cleanup(...))`. Такой C#-callback не гарантирует активный `ModContext`; для создания/удаления контента и других context-зависимых действий внутри него используйте `using (context.Enter())`. В [составном рецепте](recipes.md) это сделано явно.

## Автоматическая Settings и диагностика

Модуль показывает типизированные настройки bool, числа, enum, KeyCode, KeyboardShortcut и строки; для `AcceptableValueList<string>` использует choice. Настройки неактивного мода могут строиться по manifest config. Для disabled/content-модов статус может требовать перезапуска: переключение Enabled не является гарантией полного горячего пересоздания игрового мира.

В Mods также доступны сведения о версии/зависимостях, ошибки пакета и Diagnostics. Если нет самой страницы, сначала проверьте, выполнился ли `Init` вашего мода и установлен ли UI-модуль. Если страница есть, но control падает, проверьте status и журнал setter; отсутствие вашего эффекта после корректной записи значения надо диагностировать в игровой подписке, а не в рисовании кнопки.

## Зачем нужен модуль Patches

`baldic-api-bbcr-patches` — устанавливаемый набор исправлений ввода/курсора, а не библиотека для объявления патчей вашего мода. Собственные перехваты пишутся через общий `Baldic.Mixins`. Агрегат BBCR уже включает Patches; вручную вызывать его внутренние Install-методы не нужно.

Модуль устанавливает три группы исправлений: Linux-ввод клавиш независимо от раскладки, позиционирование меню-курсора с учётом GlobalCam/render texture и корректный порядок курсора/tooltip относительно добавленного UI. Linux keyboard fix включается только для LinuxPlayer с `DISPLAY` и доступным X11/XInput2; при недоступных native-возможностях пишет предупреждение и сохраняет стандартный ввод. Это не обещание одинакового поведения для произвольного Wayland-only окружения.

Позиционный патч учитывает фокус, переключение между мышью и аналоговым вводом, размер экрана и возвращение прежнего cursor lock/visibility. Поэтому новая страница должна пользоваться native UI flow; постоянное ручное присваивание позиции Unity Cursor или бесконтрольное создание второго курсора может конфликтовать с этими правилами. Подробнее: [справочник Patches](../reference/bbcr/patches.md).

Далее: [сохранения и прогресс](data-saves.md). Точные overload: [справочник UI](../reference/bbcr/ui.md), общие конфиги: [Configuration](../loader/configuration.md).
