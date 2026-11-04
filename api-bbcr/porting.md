# Перенос мода на BBCR

Общий loader не делает игры бинарно совместимыми. При переносе нужен отдельный build с игровыми сборками **Classic Remastered 1.1** и BBCR API 0.0.1. [BB+ API](../api-bbplus/README.md) и BBCR API могут иметь похожие имена helpers, но работают с разными типами, игровыми правилами и файлами.

## Выбор архитектуры

| Подход | Когда выбирать | Цена |
|---|---|---|
| Отдельные проекты BB+/BBCR и общий независимый код | Сильно различаются игровой контент и UI | Два build/manifest; проще увидеть границы native API |
| Общий project с `#if BBCR` в тонком игровом адаптере | Большая часть алгоритма не зависит от игры | Нужно проверять обе компиляции; условная компиляция не исправляет неправильную семантику |

Не копируйте старый порт вместо исходного мода при переносе с нуля: сначала перечислите функции оригинала и переносите их по действительным native-контрактам. Чистую математику, формат собственных данных и конфигурационные ключи можно разделять; player/NPC/world/UI glue необходимо проверять отдельно.

## Карта замены зависимостей

| Область | Для BBCR | Что проверить при переносе |
|---|---|---|
| Runtime mod | `[BaldicMod]`, `Baldic.ModContext` | DLL entrypoint и lifecycle в [Loader](../loader/lifecycle.md) |
| Конфиг | `Baldic.Loader.Configuration` и `context.Config` | Типы defaults, constraints, SettingChanged, сохранение и миграция ключей |
| Патчи | `Baldic.Mixins` | Настоящий BBCR target, overload, виртуальные цепочки, owner/Dispose |
| Игровой SDK | `Baldic.Api.Bbcr.*.dll` | Отсутствие BB+ `Baldic.Api.*` backend DLL в итоговом пакете |
| Фасад | `Baldic.Bbcr.Game` | Session против manager/environment и null вне уровня |
| Контент | `Baldic.Bbcr.Builders`, `Content`, `World` | Шаблон против экземпляра, namespaced ID, native-list insertion |
| Мир | `TileController`, `IntVector2`, `RoomController` | Пустые позиции, wall bins, 10 единиц на tile, nav mesh |
| Игрок/NPC | `PlayerMovement.cc`, `Navigator.Cc` | CharacterController, масштаб времени, коллизии; отсутствует Entity |
| UI | `Baldic.Bbcr.Menus` | Нативный курсор/переходы/готовность; свои TMP глифы и layout |
| Музыка | Native `MusicManager.PlayMidi(string,bool)` | Удаление предположения о BB+ трёхаргументном overload |
| Сохранения | `Saves`, `AttachmentPersistence`, native BBCR formats | Content IDs вместо enum numbers; profile separation задаётся явно |

Сборка против BBCR должна разрешать одно семейство API. Namespace `Baldic.Api` у `Loading`, `Textures`, `Localization`, `Enums` и `Attachments` допустим: эти совместимые файлы скомпилированы в BBCR-модули. Он не даёт права подключать BB+ DLL для закрытия ошибки компилятора.

## Особенности игрового переноса

BBCR имеет Classic, Party, Demo и NULL/glitch. Story/Endless задаёт `GameMode`, Free хранится отдельно у loader/сессии. `ClassicFreeManager` используется несколькими стилями, поэтому проверка только `manager is ClassicFreeManager` не восстанавливает стиль. Используйте `Game.Style` с обработкой `null`, а для secret/finale/basement — реальные manager-типы.

Взаимодействие с тетрадью может открыть `YCTP` до увеличения счётчика. `YctpSubmitted` не означает correct; для успешности activity смотрите `ActivityCompleted.Args[0]`, для числа тетрадей — `FoundNotebooks`. `ClassicSpoop` и `MathCorrupted` описывают разные нативные переходы. Не сводите их в одно BB+ событие «этаж начался».

LevelObject weighted pool не является процедурным генератором. BBCR сохранил premade levels, loaders и room builders; `LevelGenerator.Generate` сообщает об удалённой процедурной генерации. Восстановление собственной генерации — отдельная функция мода, а не галочка совместимости. Так же нет нативной коллекции/прогресса стикеров BB+: generic sprite и custom attachment не являются её заменой без реализации правил.

`Enums.GetOrExtend<T>(fullId)` помогает получить namespaced enum value, но не расширяет произвольные native-массивы и не делает формат vanilla-save безопасным для этого значения. Сохраняйте `Content` ID либо `Enums.NameOf` и разрешайте их после регистрации определений. Native Achievement остаётся фиксированным enum для своих массивов; custom achievements создаются отдельным Data API.

## Что показывает настоящий BBCR-русификатор

В репозитории есть отдельный BBCR build TWGS Russifier с обычным `Init`, `Localization.RegisterProvider`, фазой `AfterWarmup`, `Baldic.Mixins` и игровыми событиями. Этот пример полезен как набор необходимых действий при локализации, а не как универсальная гарантия для любого русского шрифта или новой версии игры.

Реальные обязанности такого мода распределены по слоям:

1. Загрузить словарь, аудио, изображения и PosterData; добавить недостающие ключи осознанно.
2. Настроить TMP-шрифты и метрики кириллицы, применить replacements.
3. Подменить clip у загруженных SoundObject; для texture выполнить совместимую in-place операцию с резервной копией.
4. Обновить активные text labels после локализации и вновь активируемые элементы через собственные компоненты/хуки.
5. Отдельно исправить layout, YCTP/книги, названия режима и Timeline audio finale.
6. Сохранить исходные значения чужих полей/словарей и восстановить их в cleanup; снять собственный SceneManager callback и уничтожить созданный UI.

Переключение `Language.English` в provider может быть частью русификации существующей локали. Оно не меняет автоматически speech/texture/subtitle language. Удаление provider не возвращает прежний словарь — у реального мода есть собственные snapshots. Копирование одного `RegisterProvider` без этих действий не является полным портом русификатора.

## Что показывает BBCR-ветка HL1 Movement

У HL1 Movement общая математика движения и отдельные `#if BBCR` адаптеры. В BBCR-ветке wrapper получает игрока, camera и HUD через `Baldic.Bbcr.Game`, ввод — через реальные `movementAnalogData`/`cameraAnalogData` нативного InputManager. Физика NPC использует `Navigator.Cc`, а не отсутствующий `Entity`.

Конфиг этого мода объявлен через `Baldic.Loader.Configuration`; движение переключается из `SettingChanged` под `owner.Enter()`. Патчи создаются `Mixin.CreatePatches(..., owner)`, lifecycle освобождает их и собственные обработчики. Отдельный BBCR-код управляет коллизиями, переносом предметов и импульсами: API-фасад не предоставляет готовую физику Half-Life.

Для своего переноса полезно повторить границу: алгоритм принимает независимые vectors/input/state, а адаптеры отвечают за реальные game types и lifetimes. Не переносите целиком чужие физические допущения только потому, что обе игры используют Unity.

## Процедура проверки порта

1. **Компиляция.** Только BBCR game и BBCR API; отсутствие ссылок на BB+ и требуемые импортом SDK версии.
2. **Загрузка.** Проверенный manifest/entrypoint, attributable diagnostics, корректный `Init` и completion стадий.
3. **Контент.** Работа предмета через native UseItem, действительный NPC Initialize/navigation, pickup и scene links, корректный cleanup.
4. **Режимы.** Каждый заявленный стиль и Story/Endless/Free; не заявляйте NULL boss campaign по факту загрузки NULL-менеджера.
5. **Мир.** Tiles/соседи/двери/окна, путь NPC после геометрии, lights и event End при возврате/выгрузке.
6. **Данные.** Повторное чтение после нового процесса, кириллица, версии, разные профили, неизменность vanilla-файлов при custom save.
7. **UI.** Вход/назад/закрытие, native cursor, editor/shortcut, текущий effect после config change.
8. **Платформы.** Каждая обещанная ОС и authentic game build отдельно. Сборка или Linux-проверка не доказывает нативный Windows gameplay.

Для native game tests и изолированных профилей используйте [инструменты](../loader/tooling.md). Сохраняйте компактные журналы, manifest входов, hash артефакта и фактический exit status конкретного запуска; после теста останавливайте процессы и удаляйте собственные временные игры/кэши/записи. Исходные установки и файлы пользователя сохраняйте.

Книга описывает контракт текущих исходников 0.0.1 и проверяемые авторские примеры. Она не обещает прохождение всех secret/finale веток, всех seed, произвольной комбинации сторонних модов или автоматически рабочей migration из BB+.
