# API для Classic Remastered

Этот раздел описывает **Baldic API 0.0.1 для Baldi's Basics Classic Remastered 1.1**. Загрузчик определяет игру как `bbcr`, а её версию для зависимостей — как `1.1.0`. Это отдельный SDK: мод BBCR собирают с игровыми сборками BBCR и `Baldic.Api.Bbcr.*.dll`.

Начните с [проекта и первого мода](setup.md), затем пройдите [загрузку ресурсов](loading-assets.md), [события игры](game.md), [создание контента и мира](content-world.md), [настройки и меню](ui.md), [сохранения](data-saves.md). [Практические рецепты](recipes.md) соединяют эти части, а [перенос с BB+](porting.md) объясняет границы совместимости. Устройство самого загрузчика рассматривается в [общем разделе](../loader/README.md); методы перехвата — в [Mixins](../mixins/README.md).

## Восемь модулей

Агрегат `baldic-api-bbcr` не содержит отдельной игровой обёртки: его manifest зависит от восьми модулей. Все перечисленные модули имеют версию **0.0.1**. Можно зависеть от агрегата ради полного набора или от нужных модулей ради меньшего графа загрузки. Зависимость от модуля должна быть в manifest; одной ссылки на DLL при сборке недостаточно.

| ID модуля | Сборка | Что использовать | Справочник |
|---|---|---|---|
| `baldic-api-bbcr-core` | `Baldic.Api.Bbcr.Core.dll` | `Assets`, `Content`; совместимые утилиты `Baldic.Api` | [Core](../reference/bbcr/core.md) |
| `baldic-api-bbcr-loading` | `Baldic.Api.Bbcr.Loading.dll` | `Baldic.Api.Loading`, стадии и прогресс | [Loading](../reference/bbcr/loading.md) |
| `baldic-api-bbcr-assets` | `Baldic.Api.Bbcr.Assets.dll` | Файлы, изображения, звук, шрифты, MIDI, локализация, resource packs | [Assets](../reference/bbcr/assets.md) |
| `baldic-api-bbcr-game` | `Baldic.Api.Bbcr.Game.dll` | `Game`, `GameEvents`, `Modifiers`, MIDI-подписки | [Game](../reference/bbcr/game.md) |
| `baldic-api-bbcr-content` | `Baldic.Api.Bbcr.Content.dll` | `Builders`, `Generation`, `World` | [Content](../reference/bbcr/content.md) |
| `baldic-api-bbcr-ui` | `Baldic.Api.Bbcr.Ui.dll` | `Menus`, `MenuPage`, нативное меню Mods | [UI](../reference/bbcr/ui.md) |
| `baldic-api-bbcr-data` | `Baldic.Api.Bbcr.Data.dll` | `Saves`, `Scores`, `Achievements`, `AttachmentPersistence` | [Data](../reference/bbcr/data.md) |
| `baldic-api-bbcr-patches` | `Baldic.Api.Bbcr.Patches.dll` | Исправления ввода и курсора, устанавливаемые самим модулем | [Patches](../reference/bbcr/patches.md) |

Типы, зависящие от BBCR, находятся преимущественно в `Baldic.Bbcr`. Совместимые утилиты из Core/Loading/Assets сохраняют `Baldic.Api`, но скомпилированы в **BBCR-сборки**. Совпадение namespace с BB+ не требует установки BB+ API. `Baldic.ModContext`, события, конфиги и Mixins предоставляет общий `Baldic.Loader.dll`.

## Что здесь считается готовностью

`Init` означает, что можно регистрировать подписки, страницы и задания загрузки. Это ещё не обещает наличие шаблонов игры. `LoadingStage.Start` выполняется на главном меню после прогрева ресурсов. `Loading.Done` означает завершение API-загрузки в этой игровой сессии. `Generation.OnComplete` означает готовность загруженной геометрии; игроки и HUD ещё могут отсутствовать. `GameEvents.LevelInitialized` и `GameEvents.GameBegin` относятся к менеджеру уровня и имеют собственный нативный порядок вызовов.

Не держите `PlayerManager`, `RoomController`, `TileController` или менеджер уровня как вечные singleton-объекты. На перезапуске и возврате в меню они уничтожаются; повторно получайте их для нового уровня. Проверка Unity-объектов на `null` учитывает и уничтоженный нативный объект.

## Чем BBCR отличается от BB+

| Задача | BBCR 1.1 | Следствие для мода |
|---|---|---|
| Игровые ссылки | Собственный `Assembly-CSharp.dll` | Даже одинаково названные классы могут иметь другие поля и сигнатуры |
| Мир | `TileController`, сетка тайлов, `RoomController` | Не использовать BB+ `Cell` |
| Движение | `PlayerMovement.cc`, `NPC.Navigator.Cc` | В этой игре нет BB+ `Entity` |
| Поведение NPC | Виртуальные методы `NPC`, нативный Navigator/Looker | Не переносить современную BB+ машину состояний как существующий API |
| Режимы | Classic/Party/Demo/NULL, Story/Endless и отдельная настройка Free | Стиль, режим и Free — разные значения |
| Уровни | Нативный `LevelLoader`, premade `LevelAsset` и builders | `LevelGenerator.Generate` не предоставляет рабочую процедурную генерацию BB+ |
| Математика | `YCTP`, `ClassicMathBook`, corruption/spoop | Сбор тетради, изменение счётчика и ответ — отдельные события |
| MIDI | Нативный `PlayMidi(string, bool)` | Не копировать трёхаргументный BB+ вызов |
| Прогресс | `PlayerFile_*.sav`, `PlayerConfig_*.cfg`, `ClassicScoreData` | Файлы BB+ API не являются форматом BBCR |
| Меню | `StandardMenuButton`, `OptionsMenu`, нативный курсор | Использовать BBCR `Menus`, не BB+ Options-обёртки |
| Коллекции | Нет нативной системы прогресса стикеров BB+ | Изображение или attachment не создаёт такую систему автоматически |

## Владение и поток

Создание Unity-контента и изменение мира выполняйте в основном потоке Unity и в контексте мода. Lifecycle-вызовы, EventBus и задания Loading восстанавливают зарегистрированный `ModContext`. Обычный Unity `Update`, произвольный callback и coroutine сами этого не делают: сохраните context и используйте `using (context.Enter())` вокруг операций API либо передавайте явный `owner`, если метод его принимает.

API владеет созданными им объектами и возвращаемыми lease-дескрипторами. `Dispose` такого дескриптора снимает конкретную регистрацию/модификатор; выгрузка контекста освобождает принадлежащие ему ресурсы. Регистрация позаимствованного vanilla-объекта не делает мод владельцем самого объекта. Изменения чужих полей требуют собственного восстановления — это показано в [рецепте замены звука](recipes.md).

Следующий шаг: [собрать первый BBCR-мод](setup.md).
