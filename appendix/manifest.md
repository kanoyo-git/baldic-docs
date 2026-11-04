# Поля baldic.mod.json

Манифест описывает пакет, а не параметры обычного BepInEx-плагина. `check` проверяет структуру пакета и declarations; наличие всех внешних зависимостей и готовность игры проверяются при реальном запуске.

| Поле | Значение |
|---|---|
| `schemaVersion` | Текущая схема — `1` |
| `id`, `version` | Стабильный package ID и semantic version |
| `name`, `description`, `authors`, `license` | Метаданные для пользователя |
| `depends` | Обязательные ID и диапазоны версий |
| `breaks` | Запрещённые комбинации ID/диапазона |
| `recommends`, `conflicts` | Предупреждения о рекомендуемых/нежелательных комбинациях |
| `provides` | Уникальные alias IDs |
| `entrypoints` | Stage → массив `DLL:Type` или `DLL` |
| `mixins` | Точные `DLL:Type` со статическими hook attributes |
| `accessWideners` | Относительные `.json` для ранней доступности/расширяемости |
| `transformers` | Pure early `DLL:Type`, реализующий IAssemblyTransformer |
| `nestedDependencies` | Вложенные `.baldic`, доступные resolver |
| `config` | Секции/ключи со схемой настроек |
| `gameVariants` | Отдельные реализации обычного мода для игр |
| `apiVariants` | Контейнер игрового API, не замена gameVariants обычного мода |

## Идентификаторы и зависимости

`baldic` обозначает Loader1.0.0, `bbplus` — игру0.14.5, `bbcr` — нормализованную1.1.0. Агрегаты API: `baldic-api` и `baldic-api-bbcr`. Их module IDs перечислены в соответствующих [BB+](../api-bbplus/README.md) и [BBCR](../api-bbcr/README.md) главах.

Поддерживаются точные версии, сравнения, caret, tilde, wildcards и альтернативы диапазонов. `provides` не даёт права затенить реальный API или plugin GUID. Порядок unrelated participants стабилизируется ordinal ID, но правильный порядок связанностей задавайте depends.

## Массивы declarations

Mixins и transformers требуют явный тип после `:`. Access paths оканчиваются `.json`, nested dependencies — `.baldic`. Пути используют `/`, остаются внутри package root и не содержат `.`/`..`, backslashes, absolute roots или symlinks. Повторные declarations отклоняются.

Внутри пакета сначала исполняются access files в их порядке, затем transformers в их порядке; пакеты идут по resolved dependency order. Один ошибочный structural transform может остановить запуск, поэтому такой DLL держат отдельно от обычного Unity-кода.

## Game variants

Контейнер с gameVariants содержит самостоятельный manifest/DLL/resources в каждой ветке, одинаковые ID/version контейнера и backend. Выбор происходит **до** регистрации DLL и resolver expansion. В root контейнера не размещаются исполняемые DLL вне веток. Вложенные/пересекающиеся variant roots и вложенный bundle внутри variant недопустимы.

Новые игровые поставки содержат один нужный маршрут. Если вы поддерживаете обе игры, соберите каждую реализацию отдельно; одинаковое assembly identity допустимо только потому, что противоположная ветка не загружается. [Подробности](../loader/dependencies.md).

## Config schema

Объект `config` имеет уровни section → key → descriptor. Поле type: `bool`, `int`, `float` или `string`; default обязателен и соответствует типу. `min/max` — только у числовых значений, `choices` — только у строк и с default внутри набора. В descriptor допускается описание.

Типизированный C# Bind поддерживает дополнительные значения, включая enum и KeyboardShortcut. Не добавляйте неизвестный JSON type ради доступа к ним.

## Устаревшие и недопустимые допущения

Поле `language` не выбирает язык исполнения: пакеты содержат C# DLL, историческое поле игнорируется. `.baldic` не является Lua-пакетом. Ссылка на API при компиляции не активирует его и не заменяет манифест. `init` не гарантирует наличие PlayerManager или загруженных vanilla assets.
