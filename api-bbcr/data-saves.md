# Сохранения, таблицы рекордов и достижения

Модуль `baldic-api-bbcr-data` отделяет данные мода от нативных файлов Classic Remastered. Namespace — `Baldic.Bbcr`, сборка — `Baldic.Api.Bbcr.Data.dll`. Подключите этот модуль либо агрегат; при сборке используйте [SDK BBCR](setup.md).

Есть три разных задачи: настройки пользователя относятся к `context.Config`, независимый прогресс мода — к `Saves`, данные на объектах — к `Attachments` с явной привязкой/сохранением. Ни один из этих способов автоматически не превращает ваш прогресс в нативный checkpoint BBCR.

## Независимый файл мода

| Вызов | Контракт |
|---|---|
| `Saves.PathFor(slot, owner=null)` | Проверенный путь к JSON текущего владельца |
| `Saves.Write<T>(slot, data, version=1, owner=null)` | JSON envelope и атомарная замена предыдущего файла |
| `Saves.Read<T>(slot, fallback=default, version=1, owner=null)` | Fallback только при отсутствии файла |
| `Saves.Exists`, `Delete` | Те же правила slot и owner |
| `Saves.Native` | Нативный `PlayerFileManager`, возможен `null` |
| `Saves.SaveNative`, `LoadNative` | Настоящие native save/load; требуют загруженный profile manager |

Путь обычного mod save: `Application.persistentDataPath/Baldic/bbcr/<id-мода>/<slot>.json`. Он разделён по моду, **но не по нативному профилю**. Если данные должны различаться по профилю, задайте свою стабильную схему slot либо используйте profile-aware `AttachmentPersistence` ниже. `owner` по умолчанию — текущий context; вне lifecycle/owned callback передавайте сохранённый context явно.

Slot начинается с буквы, цифры, `_` или `-`, далее допускает также точки; `..`, slash, backslash и абсолютные пути запрещены. `version` должен быть положительным. Envelope хранит `format=1`, версию ваших данных и `data`, включая явный `null`. Повреждённый JSON, неизвестный format и несовпадающая версия вызывают ошибку; API не делает молчаливый reset или автоматическую миграцию.

Запись сначала сериализует данные, пишет временный файл и заменяет существующий. Ошибка сериализации/IO не должна превращать прежний save в частично записанный JSON. Метаданные CLR `$type` не активируются. Храните простые DTO, числа, строки и namespaced content IDs; не сериализуйте живые Unity-объекты и не сохраняйте временные номера расширенных enum.

## Урок: число запусков и своё достижение

Полный `Mod.cs` для отдельного мода. Нужны Core, Game и Data, Loader и BBCR game/Unity references. В manifest объявите `init` и агрегат либо перечисленные модули. Внешние data-файлы не требуются.

```csharp
using System;
using Baldic;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;

[Serializable]
public sealed class VisitProgress
{
    public int LevelsStarted;
}

[BaldicMod]
public sealed class SchoolVisits
{
    public void Init(ModContext context)
    {
        var progress = Saves.Read("visits", new VisitProgress(), version: 1);
        Achievements.Register("first-visit", "First visit", "Start a school level.");
        string achievementId = context.Id + ":first-visit";

        EventBus.On(GameEvents.GameBegin, e =>
        {
            progress.LevelsStarted++;
            Saves.Write("visits", progress, version: 1);
            Achievements.Unlock(achievementId);
            Log.Info(context.Id, "Levels started: " + progress.LevelsStarted);
        });
    }
}
```

Урок считает `GameBegin` на уровнях, включая повторный старт; он не измеряет число завершённых кампаний. После двух запусков уровня и перезапуска игры должно читаться сохранённое число. Первое `Unlock` возвращает `true`, следующие — `false`. Если изменить version в коде без конвертации файла, ожидается ошибка версии: это полезный сигнал для авторской миграции.

## Нативные файлы и события

BBCR хранит progress в зашифрованном `PlayerFile_<name>.sav`, настройки профиля — в `PlayerConfig_<name>.cfg`, рекорды — в `HighScores.hgh`. Нативный `PlayerFileManager.Save` пересобирает собственную структуру: добавленные вами произвольные поля JSON не становятся поддерживаемыми данными. `Saves.Write` не вмешивается в эти файлы.

| Константа `DataMod` | `GameEvent.Instance` | `Args` |
|---|---|---|
| `Saving` / `Saved` | `PlayerFileManager` | Нативная версия save как `int` |
| `Loaded` | `PlayerFileManager` | Возвращённый native load success как `bool` |
| `ScoresSaved` / `ScoresLoaded` | `HighScoreManager` | Пусто |
| `AchievementChanged` | `AchievementManager` | `Achievement`, запрошенное состояние `bool` |

Это уведомления об обращении к нативному методу. `Loaded` требует проверки `Args[0]`, прежде чем считать профиль восстановленным. `AchievementChanged` не заменяет проверку фактического состояния с учётом native cheat/Steam-правил. Нативные методы действительно сохраняют/меняют профиль: не вызывайте их просто для проверки наличия API на пользовательском save.

## Рекорды

`Scores.Native` возвращает `HighScoreManager`; без него `Snapshot` и `SubmitNative` вызывают ошибку. `Snapshot()` возвращает `ClassicScoreData` с **копиями** массивов имён/очков/флагов. Изменение snapshot не редактирует нативные таблицы.

`SubmitNative(int score, string name, ClassicStyle style)` использует действительный `HighScoreManager.AddScore` и возвращает native rank. Допустимы только Classic, Party, Demo: отдельной NULL/glitch таблицы BBCR нет. Этот вызов не является безопасной собственной leaderboard-песочницей.

Для своей таблицы используйте `Scores.Submit(board, score, name, capacity=5, owner=null)` и `Scores.Read(board, owner=null)`. Данные хранятся в mod-save slot `scores.<board>`, нативный `HighScores.hgh` не изменяется. Очки сортируются по убыванию, при равенстве сохраняется порядок добавления. `capacity` должен быть не меньше 1, `name` не может быть `null`; `board` должен образовывать допустимый slot. Возвращается индекс новой записи в оставленном списке или `-1`, если она не прошла ограничение capacity.

`ScoreEntry` содержит `Name`, `Score`, `Mods`. В `Mods` записываются включённые non-builtin контентные моды без ошибки, а не полный список всех DLL процесса. Это контекст результата, не доказательство одинаковых игровых правил.

## Достижения

`Achievements.IsUnlocked(Achievement)` и `SetNative(Achievement, bool)` работают с реальными фиксированными native arrays. Вызов `SetNative` сохраняет нативную семантику, включая cheat/Steam-ограничения. Не расширяйте enum `Achievement`, чтобы затем индексировать им существующие массивы.

Свои достижения создавайте `Achievements.Register(id, name, description, owner=null)`, проверяйте через `IsUnlocked(string fullId)`, открывайте через `Unlock(string fullId)`. Регистрация возвращает owned lease; duplicate ID отвергается. `Achievements.All` перечисляет определения. Разблокировка сохраняется в mod-файле `achievements`, идемпотентна и при первом успехе публикует `bbcr.achievement.custom`: `Instance` — `ModAchievement`, `Args[0]` — полный ID. Она не выдаёт Steam achievement. Снятие регистрации удаляет определение из реестра, но не стирает накопленный файл unlock-флагов.

## Attachments и профили

`Baldic.Api.Attachments` из BBCR Core хранит типизированные значения по слабой ссылочной идентичности holder. Это дополнительное состояние без изменения игровых классов. Сохранение и копирование включаются явно: `encode/decode` нужны для persistence, `copy` — для `Attachments.Copy`; обычный Unity Instantiate не обещает перенос attachment.

`Baldic.Bbcr.AttachmentPersistence` добавляет отдельные файлы с разделением по модулю, slot и SHA-256 имени native-профиля. `PathFor` требует загруженный профиль с непустым `PlayerFileManager.fileName`. Он не записывает snapshot внутрь зашифрованного vanilla-save.

Полный самостоятельный пример ниже сохраняет счётчик на обычном CLR holder, который живёт всё время работы мода. Для Unity-holder схема та же, но bindings должны возвращать **актуальные** объекты каждого нового уровня. Нужны Core, Loading, Game и Data; UI не требуется.

```csharp
using System.Collections.Generic;
using System.Globalization;
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;

[BaldicMod]
public sealed class ProfileVisits
{
    private readonly object holder = new object();
    private AttachmentType<int> count;
    private string bindingId;

    public void Init(ModContext context)
    {
        bindingId = context.Id + ":profile-counter";
        count = Attachments.Register<int>(
            new ResourceId(context.Id, "visits"),
            factory: () => 0,
            encode: value => value.ToString(CultureInfo.InvariantCulture),
            decode: text => int.Parse(text, CultureInfo.InvariantCulture));

        EventBus.On("bbcr.assets.ready", e =>
        {
            AttachmentPersistence.Register("visits", Bindings);
        });

        EventBus.On(GameEvents.GameBegin, e =>
        {
            Attachments.Set(holder, count, Attachments.Get(holder, count) + 1);
            AttachmentPersistence.Save("visits", Bindings());
        });
    }

    private IEnumerable<AttachmentBinding> Bindings()
    {
        yield return new AttachmentBinding(bindingId, holder);
    }
}
```

На главном меню после `bbcr.assets.ready` пример ожидает уже загруженный профиль. Если ваш продуктовый flow допускает меню без профиля, переносите `Register` на границу фактической готовности профиля; не вызывайте его дважды для одной пары мод/slot. При регистрации текущий профиль читается один раз, далее подписки сохраняют snapshot на `DataMod.Saved` и восстанавливают на успешный `DataMod.Loaded`. В примере также есть явная запись после изменения счётчика, поэтому ожидать следующего native Save не нужно.

Binding ID — постоянный логический ID вроде `my-mod:profile-counter`, а не `GetInstanceID` и не имя Unity-клона. Все binding IDs должны быть уникальными и принадлежать namespace текущего мода. Отсутствующий snapshot восстанавливается как пустой: сохранённые attachments на переданных holders очищаются, а последующий `Get` снова использует factory. Несовместимую версию зарегистрированного attachment reader отвергает; это не механизм автоматической миграции.

Продолжение: [составные рецепты](recipes.md). Общая модель attachments: [Loader/Attachments](../loader/attachments.md), полный контракт BBCR: [Data](../reference/bbcr/data.md).
