# Диагностика и проверка мода

Отделяйте отказ загрузить пакет, ошибку подготовки assets и ошибку конкретного игрового callback. Одно сообщение на HUD не заменяет stack trace. Сначала найдите mod ID, phase, первое исключение и вложенную причину; затем проверьте, построился ли нужный объект и действительно ли существует мир.

## Какой канал использовать

`Log.Info(modId, text)` сообщает нормальное завершение шага, `Log.Warn` — ожидаемое ограничение, `Log.Error` — ошибку с контекстом. Добавляйте ID ресурса/контента и стадию: «не удалось построить orchard:apple: assets/apple.png» полезнее «не работает яблоко». Не пишите успешную запись до фактического завершения операции.

`Diagnostics.AddWarningScreen(text, fatal)` добавляет страницу стартового warning screen. Для необязательной особенности используйте `fatal:false`; `fatal:true` означает реальную невозможность продолжать. `WarningsPassed` сообщает, что warning flow уже пройден: после начала warning screen или его прохождения попытка добавить страницу бросит `InvalidOperationException`.

`Diagnostics.ShowError(message, seconds=5f)` показывает overlay на HUD; он полезен для краткой понятной ошибки во время игры. Подробности пишите в журнал. `CauseCrash(modId, exception)` и `CauseCrashQuiet` переводят игру в error flow API; это не обычный способ сообщить об отсутствующем необязательном файле. `CrashText.Build` формирует текст отчёта. Полный контракт — [diagnostics reference](../reference/bbplus/diagnostics.md).

## Проверка после подготовки

Самостоятельный файл, entrypoint `assetsFinal`. Добавьте его как проверку к моду, который уже зарегистрировал `orchard:apple`, либо замените ID на свой. Для отдельно установленной DLL без такого предмета исключение ожидаемо.

```csharp
using System;
using Baldic;
using Baldic.Api;
using ContentItems = Baldic.Api.Lua.Items;

namespace OrchardValidation
{
    [BaldicMod]
    public sealed class Mod
    {
        public void AssetsFinal(ModContext owner)
        {
            if (!GameAssets.Prepared)
                throw new InvalidOperationException("Игровые assets не подготовлены");
            ItemObject item = ContentItems.Get("orchard:apple");
            if (item == null)
                throw new InvalidOperationException("Нет orchard:apple; проверьте первую ошибку Build в журнале");
            if (item.item == null || item.itemSpriteSmall == null || item.itemSpriteLarge == null)
                throw new InvalidOperationException("Неполный prefab orchard:apple");
            ItemMeta metadata = item.GetMeta();
            if (metadata == null || !metadata.Tags.Contains("food"))
                throw new InvalidOperationException("Нет ожидаемой metadata orchard:apple");
            Log.Info(owner.Id, "ORCHARD_CONTENT_VALIDATED");
        }
    }
}
```

Проверка metadata обязательна именно для яблока с тегом `food` из [первого мода](setup.md). Для другого контента формулируйте собственные проверяемые условия. `GameAssets.Prepared` означает выполнение подготовки, а не гарантию существования каждого необязательного шаблона; проверяйте требуемые ссылки отдельно.

## Частые симптомы

| Симптом | Что проверить |
|---|---|
| DLL не выполняет `Init` | имя DLL/type и stage в manifest, удовлетворённые dependencies, поддерживаемую игру |
| `Items.Get` вернул null в `Init` | отложенное построение; перенесите проверку в `AssetsFinal` |
| Предмет виден в каталоге, но не появляется | `Floors`, веса, наличие исходного пула, дедлайн регистрации, новый ли этаж |
| Не найден `NpcTemplate` | не вызывайте `NPCBuilder.Build` до warmup |
| `unknown` вместо mod ID | callback запущен без owner context; восстановите `owner.Enter` |
| Изображение есть на диске, но не загружается | относительный путь, регистр, нужный файл в архиве, формат |
| Кириллица квадратиками | локализация отдельно от glyph/font replacements |
| Нет игрока/HUD в callback | проверьте момент события и `Game.InLevel`, а не только `Loading.Done` |
| Timer внезапно прекратился | первое exception приводит к `Runtime.ReportFailure`; читайте журнал |
| NPC/event callback перестал выполняться | пять ошибок конкретной пары ID/callback; исправьте первую причину |
| Настройка не влияет на старый этаж | generator assets были обработаны один раз; начните новый забег/сессию |
| Save slot не выбран | набор handlers и compatibility tags; не удаляйте файл до чтения статуса |

## Проверка перед публикацией

Скомпилируйте на BB+ 0.14.5 с теми DLL, которые целятся в runtime. Проверьте manifest и состав пакета: чужие игровые/API DLL не должны случайно ехать внутри него. Затем проверьте cold start, подготовку ресурсов, новый уровень, применение эффекта, переход и продолжение сохранения — только те сценарии, которые мод заявляет.

Для случайной генерации проверяйте и состав пула, и наблюдаемое появление на нескольких seeds. Для unload отдельно проверьте удаление подписок и восстановление собственного временного эффекта; это не доказывает hot reload новых enum и content assets. Сохраняйте компактный журнал с exit status, версиями и hash собранного пакета. После теста остановите процессы и удалите созданные вами временные копии/кэши/большие записи, сохраняя исходную игру, пользовательские данные и итоговый пакет.

[Инструменты Loader](../loader/tooling.md) описывают упаковку и доступные проверки. Эта книга описывает текущие публичные исходники и компилируемые примеры; компиляцию нельзя выдавать за подтверждённое прохождение всех игровых комбинаций.
