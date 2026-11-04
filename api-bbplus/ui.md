# Настройки, UI и системные исправления

Для обычного значения используйте config Loader: оно сохраняется и попадает в автоматически построенное меню мода. Для собственного расположения элементов используйте `CustomOptionsCategory`. Для взаимодействия на игровом HUD — фасад `Hud`, для Unity UI вне стандартной options-страницы — `UiHelpers` и pointer-компоненты.

## Категория с переключением значения

Самостоятельный файл, manifest вызывает `init`; проект и зависимости — из [начала работы](setup.md). Пример не требует изображений и добавляет категорию при открытии options. Значение хранится в config, а не в статическом поле без сохранения.

```csharp
using System;
using Baldic;
using Baldic.Api;
using Baldic.Loader.Configuration;
using UnityEngine;

namespace OrchardOptions
{
    [BaldicMod]
    public sealed class Mod
    {
        internal static ConfigEntry<bool> Greeting;

        public void Init(ModContext owner)
        {
            Greeting = owner.Config.Bind("General", "Greeting", true, "Показывать приветствие");
            Action<OptionsMenu, CustomOptionsHandler> opened = (menu, handler) =>
                handler.AddCategory<OrchardCategory>("Сад");
            CustomOptions.MenuOpened += opened;
            owner.Own(new Cleanup(() => CustomOptions.MenuOpened -= opened));
        }
    }

    public sealed class OrchardCategory : CustomOptionsCategory
    {
        public override void Build()
        {
            CreateText("Title", "Настройки сада", new Vector3(0f, 70f, 0f));
            var button = CreateTextButton(() => { }, "Greeting", "", Vector3.zero);
            Action refresh = () => button.text.text =
                "Приветствие: " + (Mod.Greeting.Value ? "да" : "нет");
            button.OnPress.AddListener(() =>
            {
                Mod.Greeting.Value = !Mod.Greeting.Value;
                refresh();
            });
            refresh();
        }
    }
}
```

Событие `MenuOpened` — обычное C# событие, поэтому нужна явная отписка через `Cleanup`. `AddCategory<T>` создаёт категорию и вызывает `Build`; не создавайте её заранее на другом GameObject. UI callbacks не получают автоматически текущий mod context. Для обращения к `Storage`, загрузки картинок или создания owned ресурсов из кнопки сохраните owner и выполняйте `using (owner.Enter())` либо передайте mod ID там, где это поддержано. Изменение `ConfigEntry.Value` в примере не требует неявного owner.

`InsertCategory<T>(name, index)` позволяет выбрать место. В категории доступны `Menu`, `Tooltips`, стандартные arrow/bar/check sprites, `CreateText`, `CreateTextButton`, `CreateImage`, `CreateImageButton`, `CreateBars`, `CreateToggle`, `CreateApplyButton` и tooltip helpers. `CreateTextButton` принимает **action, внутреннее имя, видимый текст, position** — имя объекта не является подписью кнопки. По умолчанию текст чёрный, font `ComicSans24`; для кириллицы подготовьте [шрифт](assets.md).

Полные [config Loader](../loader/configuration.md) и [options-ui reference](../reference/bbplus/options-ui.md) описывают расширенные варианты. Встроенные `SavedGamesCategory` и `HighScoresCategory` обслуживают экраны слотов и результатов API; не подменяйте всю систему настроек собственным manager без необходимости.

## Pointer, колесо и слои

`UiHelpers.CreateText`, `CreateImage`, создание screen/cursor помогают повторить стиль игры. `UiHelpers.Pointer(go)` добавляет `UiPointer`: `Click`, `Down`, `Up` получают номер кнопки (0 — левая, 1 — правая), `Hover` — bool. `UiHelpers.Wheel(go)` даёт `UiWheel` для scroll. Это Unity EventSystem callbacks: объект должен иметь подходящий raycast target, быть на нужном Canvas, а EventSystem должен доставлять события. Добавление pointer к неинтерактивной картинке не гарантирует клики.

Когда используете `StandardMenuButton`, его игровые события и pointer callbacks — разные способы взаимодействия. Не назначайте одну операцию обоими путями без проверки: можно получить двойной вызов. Прячьте созданный UI вместе со сценой и удаляйте собственные подписки; не храните старый `OptionsMenu` между открытиями.

## Цвета игровых кнопок

Модуль gameplay содержит `ButtonColors`: `Create(name, color)` создаёт именованный набор цветов, `ApplyColor(component, name)`/extension `SetColor` применяют его к поддерживаемой кнопке. `Supports(type)` проверяет известный тип, `TryGetColor` — наличие цвета; проверяйте возвращаемые `bool`, если компонент может оказаться неподдерживаемым. Для другого типа кнопки регистрируется `ButtonColorType` с правилами материалов через `RegisterType`. Подготовьте цвета после warmup, когда доступны исходные материалы; эта система относится к игровым кнопкам и не заменяет настройку текста обычной UI-категории. Полный контракт — [gameplay reference](../reference/bbplus/gameplay.md).

## Что делает модуль patches

`baldic-api-patches` устанавливает системные исправления сам, через свой entrypoint. Это не набор методов, которые каждый мод должен вызвать вручную:

- Linux keyboard fix работает для `LinuxPlayer` с `DISPLAY` и доступными X11-функциями; при отсутствии библиотеки/функций пишет предупреждение. Наличие Linux не означает работу этого X11 пути в любом окружении Wayland.
- Cursor position fix согласует положение указателя с composited/render texture UI, изменением размеров окна и мышью/аналоговым вводом; при уходе фокуса или отключении восстанавливает удерживаемое состояние курсора.
- Cursor layer fix держит указатель над добавленным содержимым, а native tooltips и нижнюю панель — в нужном порядке поверх него.

Зависимость `baldic-api` уже включает patches; при выборе отдельных модулей добавьте `baldic-api-patches`, если рассчитываете на эти исправления. Они не исправляют произвольный неверный Canvas, raycast target или обработчик кнопки стороннего мода. Для BBCR существует отдельный пакет patches; его поведение не следует подставлять в описание BB+.

[Справочник patches](../reference/bbplus/patches.md) отличает публичный entrypoint от внутренних классов исправлений. Если нужен собственный перехват UI метода, используйте [Baldic.Mixins](../mixins/README.md), а не вызывайте internal-классы API через reflection.
