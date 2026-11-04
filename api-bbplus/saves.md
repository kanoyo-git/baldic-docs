# Сохранения забега, профильные данные и результаты

Выберите, что именно сохраняете. Данные текущего забега должны ехать вместе с его modded slot; статистика профиля — жить независимо от выбранного забега; общая настройка — одинаковой для профилей. API даёт разные механизмы, и замена одного другим меняет поведение после загрузки старого слота.

| Данные | Механизм |
|---|---|
| Состояние забега, влияющее на продолжение | `ModSaveHandler`, `TextSaveHandler`, `JsonSaveHandler<T>` |
| Мод меняет совместимость, но не имеет своего payload | `ModdedSaves.AddDummyHandler(modId)` |
| Данные attachments с повторно создаваемыми holders | `AttachmentSaveHandler` |
| Ключи статистики текущего профиля | `Storage.Get/Set/Add` |
| Общие ключи всех профилей | `Storage.GetGlobal/SetGlobal` |
| Собственный файл при save/load профиля | `AddSaveLoadAction`, `AddUnmanagedAction` |
| Разделение результатов по модам и настройкам | `ModdedHighScores.AddAffectingMod(modId, tags)` |

## Handler для счётчика забега

Самостоятельный файл, entrypoint `init`, без ресурсов; учебный проект включает `Baldic.Api.Saves.dll`, `Game.dll` и `HighScores.dll`. В runtime для `JsonSaveHandler<T>` нужна `Newtonsoft.Json.dll`: handler вызывает её через reflection, отсутствие библиотеки проявится при сериализации. Установленный runtime должен поставлять совместимую зависимость.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Events;

namespace OrchardSave
{
    public sealed class RunData
    {
        public int Collected;
    }

    public sealed class OrchardHandler : JsonSaveHandler<RunData>
    {
        public OrchardHandler(string modId) : base(modId) { }

        public override string[] GenerateTags()
        {
            return new[] { "rules-v1" };
        }
    }

    [BaldicMod]
    public sealed class Mod
    {
        private OrchardHandler save;

        public void Init(ModContext owner)
        {
            save = new OrchardHandler(owner.Id);
            ModdedSaves.AddHandler(save);
            ModdedHighScores.AddAffectingMod(owner.Id, "rules-v1");
            EventBus.On("notebook.collect", data => save.Data.Collected++);
            EventBus.On("game.begin", data =>
            {
                if (Game.InLevel)
                    Hud.Message("Собрано за забег: " + save.Data.Collected, 3f);
            });
        }
    }
}
```

`Reset` у `JsonSaveHandler<T>` создаёт новый `T`; `SaveText` и `LoadText` сериализуют публичные поля/свойства через JSON. Не помещайте туда Unity-объекты, delegates и живые `PlayerManager`: сохраняйте ID и простые данные, а после загрузки ищите новые runtime-экземпляры. `OnCgmCreated(CoreGameManager cgm, bool fromSave)` позволяет связать данные с новым manager; это ещё не обещание, что все NPC этажа уже созданы.

`GenerateTags` описывает **несовместимые настройки**, а не красивые подписи. Смена `rules-v1` на `rules-v2` должна соответствовать реальной смене совместимости. `DisplayTags` оформляет их в меню, `TagsReady` откладывает сравнение, если их ещё нельзя вычислить. Версия DLL сама по себе не является универсальной миграцией payload.

`AddHandler` хранит один handler на `ModId`; следующий заменит предыдущий. Если нужны и счётчик, и attachments, объедините их в одном handler/payload, а не регистрируйте два и не теряйте первое состояние.

## Режим и слоты

`SaveMode`: `Unset` — ещё не выбран, `None` — отключено, `Vanilla` — штатное сохранение, `Modded` — формат API. `ModdedSaves.SetEnabled(true)` выбирает modded при наличии handlers или `AlwaysModded`, иначе vanilla. Это глобальная политика сессии: обычный мод регистрирует свой handler, а не насильно переключает режим всем.

Modded format имеет собственный versioned layout (текущий номер формата 8), список handler-модов и tags. Он не перезаписывает vanilla run save. Профильные файлы игры по-прежнему существуют: разделение касается формата забега API, а не отменяет любую штатную запись профиля.

`ModdedSaveSlots` выбирает слот по установленным handlers и tags. `CurrentSlot`, `Current`, `Partial` позволяют наблюдать выбор, `LoadSlot` возвращает `SaveLoadStatus`. Не заставляйте несовместимый слот загрузиться изменением tags без реальной поддержки старых данных. Лог восстановления списка слотов требует внимания; успешное чтение заголовка не доказывает исправный payload каждого handler.

Для бинарного формата наследуйте `ModSaveHandler` и реализуйте `Save(BinaryWriter)`, `Load(BinaryReader)`, `Reset`. Читайте поля в том же порядке, храните собственную версию payload и мигрируйте её явно. Для текстового собственного формата — `TextSaveHandler`. Полные типы, slot API и codec — [saves reference](../reference/bbplus/saves.md).

## Профильное и общее Storage

`Storage` сохраняет строки, числа и bool по ключу; числовые значения возвращаются как `double`. `null` удаляет ключ. Каждый `Set`/`Add` пишет файл сразу, поэтому это не место для записи 60 раз в секунду. Профиль выбирается через текущий `PlayerFileManager`; до выбора файла будет служебное имя `!UnassignedFile`.

Следующий самостоятельный helper не является entrypoint. Вызовите `Record(owner, Game.LevelTitle)` из обработчика завершения этажа. Явный `mod:` позволяет использовать его и из кода без текущего `ModContext`.

```csharp
using Baldic;
using Baldic.Api;

namespace OrchardStorage
{
    public static class Progress
    {
        public static double Record(ModContext owner, string floor)
        {
            double completed = Storage.Add("completedFloors", 1, mod: owner.Id);
            Storage.Set("lastFloor", floor, mod: owner.Id);
            return completed;
        }

        public static bool GreetingEnabled(ModContext owner)
        {
            return (bool)Storage.GetGlobal("greeting", true, mod: owner.Id);
        }
    }
}
```

`Get(key, fallback, mod)`, `Has`, `Keys`, `Clear` работают с профильной таблицей. `GetGlobal`, `SetGlobal`, `HasGlobal`, `GlobalKeys` — с общей. `ProfileExists(name)` проверяет наличие штатного файла профиля, а не наличие конкретного modded slot. `Clear` стирает все профильные ключи мода; не используйте его как обычный reset забега.

Файлы API лежат под `Application.persistentDataPath/Modded`: `ModFolderForCurrentProfile(modId)` даёт папку текущего профиля, `UnmanagedFolder(modId)` — общую. `AddSaveLoadAction(modId, (saving, folder) => ...)` получает подготовленную профильную папку при сохранении/загрузке player file; `AddUnmanagedAction` — общую. Эти actions не сериализуют автоматически payload конкретного run slot.

## Attachments

Attachments связывают данные с holder-объектом без изменения его класса. Для сохранения выберите устойчивые binding ID и в callback `AttachmentSaveHandler` каждый раз возвращайте bindings для **новых** runtime holders. Handler сохраняет envelope, валидирует его при чтении, а восстанавливает после создания CGM. Не захватывайте старый уничтоженный manager или игрок в делегате bindings.

Восстановление только по имени Unity-объекта ненадёжно при нескольких NPC одного типа. Разработайте стабильную идентичность своего контента и поведение при отсутствии holder. Механизм и полный пример определения ключей — [attachments Loader](../loader/attachments.md), [saves reference](../reference/bbplus/saves.md).

## Результаты

`ModdedHighScores.AddAffectingMod(owner.Id, tags...)` отделяет результаты модифицированного баланса от другого набора affecting mods. Не требуется для чисто визуальной замены, которая действительно не меняет gameplay. Новый endless level отмечается worldgen автоматически; обычный speed bonus/новый предмет должен отмечаться явно.

`CurrentMods` показывает текущий набор, `Active` — подходящие endless results. Текущая реализация хранит trip score/name arrays отдельно внутри общего highscore-файла; не обещайте столь же подробное разделение field-trip результатов по набору модов, как у записей endless. `DeleteInactive` и `DeleteAll` удаляют сохранённые результаты: не вызывайте их автоматически при инициализации мода. Детали — [highscores](../reference/bbplus/highscores.md).
