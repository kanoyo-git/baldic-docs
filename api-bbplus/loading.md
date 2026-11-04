# Когда регистрировать и когда создавать

Loader lifecycle и экран подготовки API решают разные задачи. `Init` — место для подписок, объявления контента и регистрации будущей работы. `LoadingStage` — момент, когда игровые шаблоны уже находятся в памяти. Рабочий уровень появляется позднее: даже `AssetsFinal` не означает наличие игрока или `EnvironmentController`.

## Порядок BB+ backend

| Момент | Что уже доступно и что делать |
|---|---|
| `init` Loader | `ModContext`, config, собственные файлы; зарегистрируйте callbacks, specs и loading jobs |
| Warmup API | сцена `Game` временно загружается и выгружается; `GameAssets.Prepare()` создаёт кэш и вызывает `OnPrepared` |
| `LoadingPhase.AfterWarmup` | API создаёт базовую metadata и дополнительные данные |
| `Start` / `assetsStart` | игровые шаблоны доступны; стройте предметы, NPC, картинки, новые сцены |
| `AfterStart` | worldgen заменяет `LevelObject` расширенными клонами |
| `Pre` / `assetsPre` | последняя стадия регистрации generator features; работайте с расширенными объектами |
| `AfterPre` | запрет новых generator changes уже включён; применяются изменения этажей и loot поездок |
| `BeforePost` | подготовка отложенных MIDI |
| `Post` / `assetsPost` | ресурсы, не меняющие подготовленную генерацию |
| После `Post` | перезагрузка локализации, `AfterPost` и настройка результатов |
| `Final` / `assetsFinal` | итоговая проверка созданного контента |
| `Loading.Finished` | `Loading.Done == true`, экран закрыт; это всё ещё может быть меню |
| `player.spawn`, `game.begin` | появился конкретный игрок / началась игра на этаже |

Порядок стадий фиксирован. Внутри стадии `Loading.Register` сортирует работу по load order модов, а затем по порядку регистрации. `Loading.CurrentStage` показывает текущую стадию либо `null`. Полные [Loader lifecycle](../loader/lifecycle.md) и [API-сигнатуры Loading](../reference/bbplus/loading.md) дополняют эту таблицу.

Есть два способа выполнения: метод `AssetsStart` с `assetsStart` в manifest удобен для короткого кода и автоматически вызывается Loader в контексте мода; `Loading.Register` удобен для отдельной coroutine и отображения прогресса. Не вызывайте одну и ту же инициализацию обоими способами.

## Coroutine с корректным владельцем

Самостоятельный файл для проекта из [начала работы](setup.md). Нужны `assets/apple.png` и `assets/chime.wav`; manifest должен вызывать `init` этого класса. Результат — загруженные ресурсы в собственном `AssetRegistry`, а не предмет в игровых пулах.

```csharp
using System.Collections;
using Baldic;
using Baldic.Api;
using UnityEngine;

namespace OrchardLoading
{
    [BaldicMod]
    public sealed class Mod
    {
        private ModContext owner;
        private readonly AssetRegistry assets = new AssetRegistry();

        public void Init(ModContext context)
        {
            owner = context;
            Loading.Register(owner.Id, Prepare, LoadingStage.Start);
        }

        private IEnumerator Prepare()
        {
            yield return 2;
            yield return "Подготовка сада";
            using (owner.Enter())
            {
                assets.Add("apple", Sprites.FromMod(owner.Id, 50f, "assets", "apple.png"));
            }
            yield return "Изображение готово";
            yield return null;
            using (owner.Enter())
            {
                assets.Add("chime", Baldic.Api.Audio.FromMod(owner.Id, "assets", "chime.wav"));
            }
            yield return "Звук готов";
        }
    }
}
```

В текущем BB+ `Loading.Register` хранит ID для порядка и журнала, но при вызове factory и `MoveNext()` **не делает `owner.Enter()`**. Это важно для `OwnObject`, неявных владельцев, путей и новых подписок. Сохраняйте context из `Init` и явно входите в него в исполняемой части coroutine. В примере контекст не удерживается через `yield return null`.

Протокол `LoadingTask`: первый `yield` — `int` ожидаемых шагов, второй — начальный `string`; последующий `string` обновляет текст и засчитывает шаг, `int` увеличивает ожидаемое число, остальные значения передаются Unity. `yield return null` отдаёт кадр; один только текстовый `yield` не гарантирует кадр между тяжёлыми операциями. При ошибочных первых двух значениях будет `LoadingProtocolException`. Для простой `Action` overload сам формирует заголовок.

## Поздние регистрации различаются

| API | Поведение после подготовки |
|---|---|
| `Loading.Register(...)` | предупреждает, если стадия уже началась/закончилась; работа не переигрывается |
| `Worldgen.AddGeneratorChange(...)` | после `Pre` возвращает `false` и предупреждает; повтор той же пары mod/stage до дедлайна бросает исключение |
| `Items.Register`, `Characters.Register`, `RandomEvents.Register`, `Stickers.Register` | при `GameAssets.Prepared` строят объект сразу; уже обработанные генератором пулы сами не пересобирают |
| `Posters.Register` | строит плакат синхронно, без очереди `OnPrepared` |
| `Levels.Change(...)` | если изменения этажей уже применялись, callback сразу вызывается для подготовленных сцен |
| `Localization.Register...` | регистрирует источник; для уже открытого языка нужен `Localization.Refresh` |

`Loading.Register` берёт snapshot списка перед вызовом stage entrypoints. Регистрация новой работы для той же стадии внутри `AssetsStart`/`AssetsPre` опаздывает. Регистрируйте её в `Init` либо для ещё не начавшейся стадии. `AddPhase` предназначен прежде всего для модулей API; в BB+ не обещает автоматическую owner-очистку, которую может иметь другой backend.

## Core: находить, различать, сохранять шаблоны

`Find.One<T>(name)` и `Find.All<T>()` ищут Unity-объекты, включая загруженные ресурсы. Это не обещание, что объект уже существует до warmup. `Catalog` — более предметный поиск по контенту. `AssetRegistry.Shared` хранит подготовленные шаблоны; собственный registry удобнее для ресурсов одного мода. Ключи разделены по типам: `Get<Sprite>("apple")` и `Get<Texture2D>("apple")` — разные записи; отсутствующая запись возвращает default.

Расширенные значения enum создавайте через `Enums.GetOrExtend<T>(name)`, ищите через `TryValueOf<T>`, сохраняйте через `NameOf`, а не числовое значение. Новые значения выдаются runtime; число не является стабильным ID между наборами модов. `Enums.ValueOf<T>` бросает исключение для неизвестного имени. `Enums.Extend` не подходит для повторной регистрации одного имени.

`Prefabs.MakePrefab`/extension `MakePrefab` и `Prefabs.DontUnload` сохраняют шаблоны, но не заменяют создание экземпляра в игровом мире. `Reflect` открывает приватные поля/методы; такие обращения зависят от версии игры. `Handshakes.Compare` объединяет ответы `Handshake` с приоритетом принудительных согласия/отказа; это утилита согласования, а не автоматическая шина запросов между модами. `ModDataBag` хранит данные в памяти по mod ID и ключу, без автоматического сохранения на диск.

## Владение и очистка

Используйте `owner.OwnObject` для созданных Unity-объектов и `owner.Own(new Cleanup(...))` для обычных C# событий. Автоматическое владение выполняется только при наличии текущего `ModContext` либо явного owner-параметра. Unity `Update`, обычное событие `SceneManager.sceneLoaded` и callbacks typed registries не становятся entrypoint Loader только из-за того, что их назначили в `Init`.

Удаление владельца снимает поддерживаемые подписки и освобождает его ресурсы, но не гарантирует обратимость всех изменений enum, metadata, prefab и генерации. Мод с новым контентом должен помечать его через `MarkContent` (регистраторы делают это сами); полный цикл смены контента безопаснее выполнять перезапуском. Подробности — [ресурсы и владение](../loader/resources.md) и [attachments](../loader/attachments.md).
