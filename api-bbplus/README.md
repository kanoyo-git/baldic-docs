# API для Baldi’s Basics Plus

Этот раздел — руководство по **Baldic API 0.0.1 для BB+ 0.14.5**. Он описывает C# API, который работает поверх Baldic Loader. Для BBCR используется [другой backend](../api-bbcr/README.md); совпадающее имя метода не означает одинаковую реализацию.

Начните с [рабочего мода](setup.md), затем прочитайте [порядок загрузки](loading.md). После этого выбирайте задачу: [ресурсы](assets.md), [предметы, персонажи, события и наклейки](content.md), [генерация](worldgen.md), [работающий уровень](gameplay.md), [интерфейс](ui.md), [сохранения](saves.md), [диагностика](diagnostics.md). [Рецепты](recipes.md) связывают эти части в законченные сценарии.

## Что устанавливать

`baldic-api` — пакет-агрегатор без собственной DLL. Он зависит от всех пятнадцати модулей. Для первых модов удобно указать его; для библиотеки или компактного пакета можно перечислить только используемые модули. Зависимость в manifest определяет наличие и порядок загрузки, а `<Reference>` в проекте — доступность типов компилятору. Нужны обе стороны.

| Модуль / пакет | Когда нужен | Глава и полный публичный справочник |
|---|---|---|
| `core` / `baldic-api-core` | enum, поиск, шаблоны, metadata-independent утилиты | [Загрузка](loading.md), [справочник](../reference/bbplus/core.md) |
| `diagnostics` / `baldic-api-diagnostics` | предупреждения и сообщения об ошибках | [Диагностика](diagnostics.md), [справочник](../reference/bbplus/diagnostics.md) |
| `loading` / `baldic-api-loading` | стадии подготовки ресурсов | [Загрузка](loading.md), [справочник](../reference/bbplus/loading.md) |
| `assets` / `baldic-api-assets` | изображения, звук, модели, шрифты, переводы, resource packs | [Ресурсы](assets.md), [справочник](../reference/bbplus/assets.md) |
| `metadata` / `baldic-api-metadata` | владелец, группы, флаги и теги контента | [Контент](content.md), [справочник](../reference/bbplus/metadata.md) |
| `worldgen` / `baldic-api-worldgen` | изменения настроек этажей, endless, поездки | [Генерация](worldgen.md), [справочник](../reference/bbplus/worldgen.md) |
| `builders` / `baldic-api-builders` | собственные наследники игровых классов и фабрики | [Контент](content.md), [справочник](../reference/bbplus/builders.md) |
| `stickers` / `baldic-api-stickers` | расширенные данные и состояния наклеек | [Контент](content.md), [справочник](../reference/bbplus/stickers.md) |
| `saves` / `baldic-api-saves` | данные забега и совместимость слотов | [Сохранения](saves.md), [справочник](../reference/bbplus/saves.md) |
| `highscores` / `baldic-api-highscores` | результаты с учётом набора модов | [Сохранения](saves.md), [справочник](../reference/bbplus/highscores.md) |
| `options-ui` / `baldic-api-options-ui` | категории настроек и UI-компоненты | [Интерфейс](ui.md), [справочник](../reference/bbplus/options-ui.md) |
| `patches` / `baldic-api-patches` | системные исправления ввода и курсора | [Интерфейс](ui.md), [справочник](../reference/bbplus/patches.md) |
| `gameplay` / `baldic-api-gameplay` | модификаторы, анимация, ТВ, плакаты, culling | [Уровень](gameplay.md), [справочник](../reference/bbplus/gameplay.md) |
| `registry` / `baldic-api-registry` | регистрация через `ItemSpec`, `CharacterSpec` и другие спецификации | [Контент](content.md), [справочник](../reference/bbplus/registry.md) |
| `game` / `baldic-api-game` | игрок, мир, NPC, HUD, таймеры и профильное хранилище | [Уровень](gameplay.md), [справочник](../reference/bbplus/game.md) |

## Пространства имён и сборки

Основной namespace — `Baldic.Api`. Регистраторы `Items`, `Characters`, `RandomEvents`, `Posters`, `Stickers`, `Levels` и фасад `FieldTrips` находятся в **`Baldic.Api.Lua`**. Это настоящие типизированные C# классы. Namespace сохранён для совместимости исходников; Lua runtime или Lua-скрипт для их использования не требуются. В примерах применяются aliases, поскольку игра уже содержит enum `Items`, `Sticker` и `FieldTrips`.

`ModContext`, `[BaldicMod]`, `Log`, `Driver`, `Baldic.Loader.Runtime` и `Baldic.Events` предоставляет **`Baldic.Loader.dll`**. API перехватов использует namespace `Baldic.Mixins`: обёртки Loader и типы совместимого fork `0Harmony.dll` работают вместе. DLL `Baldic.Mixins.dll` для этих примеров не нужна. `Baldic.Loader.Configuration` определяется в совместимом fork `BepInEx.dll`. Игровые модули называются `Baldic.Api.Core.dll`, `Baldic.Api.Registry.dll` и т. д. Совместимые зависимости `BepInEx.dll` и `0Harmony.dll` сохраняют свои имена.

Об установке Loader, формате пакета и перехватах читайте в разделах [Loader](../loader/README.md), [пакеты](../loader/packages.md), [Mixins](../mixins/README.md). API не заменяет Unity: класс предмета по-прежнему наследует `Item`, сложный NPC — `NPC`, длительная работа — `IEnumerator` или компонент.

## Границы примеров

Каждый C# блок ниже — отдельный исходный файл или явно обозначенный набор классов. Не объединяйте разные варианты entrypoint в одну DLL без изменения manifest. Все примеры рассчитаны на проект из [начала работы](setup.md); дополнительные файлы ресурсов перечислены возле кода. Компиляция проверяет имена и сигнатуры, но появление предмета на случайно сгенерированном этаже требует отдельной проверки в игре.
