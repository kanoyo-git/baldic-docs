# Загрузка и ресурсы BBCR

Шаблоны предметов, комнат и персонажей BBCR становятся доступны по мере нативной загрузки. Зарегистрируйте работу в `Init`, а поиск и создание контента перенесите в `LoadingStage.Start` либо метод `AssetsStart`. Оба пути выполняются на главном меню под контекстом мода. Урок использует Core, Loading и Assets из [SDK BBCR](setup.md).

## Порядок загрузки

| Граница | Что происходит | Что делать моду |
|---|---|---|
| `Init` | Регистрация собственных задач, подписок и страниц | Прочитать конфиг, добавить callback; не требовать ещё не загруженные prefab |
| `AfterWarmup` | Фазы API после прогрева игровых ресурсов | API кэширует игровые типы и подготавливает звук/шрифты |
| `Start` / `assetsStart` | Первый пользовательский этап | Загрузить изображения/звук, создать определения контента |
| `AfterStart` | Фазы API | Не считать, что здесь появляется генератор BB+ |
| `Pre` / `assetsPre` | Следующий пользовательский этап | Завершить раннюю настройку определений |
| `AfterPre` | `TooLateForGeneratorFeatures=true` | Это общий флаг протокола, не обещание процедурной генерации BBCR |
| `BeforePost` | В частности, отложенная регистрация MIDI | Песни, зарегистрированные ранее, передаются нативной системе |
| `Post` / `assetsPost` | Пользовательская работа после ранних фаз | Настроить связи между загруженным контентом |
| `AfterPost` | В частности, обновление локализации | Обновляются активные и уже инициализированные нативные текстовые метки |
| `Final` / `assetsFinal` | Последний пользовательский этап | Финальная проверка своих определений |
| Завершение | `Loading.Done=true`, затем `Loading.Finished`, затем `bbcr.assets.ready` | Разрешить пользователю запуск собственных сцен |

Внутри каждой стадии loader сначала вызывает соответствующие entrypoints, а затем зарегистрированные через `Loading.Register` задачи. Сами регистрации упорядочены по порядку модов в графе загрузки и по очереди регистрации. Не регистрируйте один и тот же импорт и в entrypoint, и в callback: он выполнится дважды.

`Loading.Register` после уже пройденной стадии пишет предупреждение; задача не воспроизводит завершённую загрузку задним числом. `Loading.Finished` — обычное статическое C#-событие: при прямой подписке снимайте свой обработчик через `context.Own(new Cleanup(...))`. Для простого уведомления удобнее owned-подписка `EventBus.On("bbcr.assets.ready", ...)`.

## Coroutine с прогрессом

Это полный отдельный `Mod.cs`; manifest должен указывать собранную DLL как `init` entrypoint. В пакете нужен файл `Textures/badge.png`. Изображение загружается через `ModPaths`, который проверяет границы каталога пакета.

```csharp
using System.Collections;
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;

[BaldicMod]
public sealed class BadgeAssets
{
    public void Init(ModContext context)
    {
        Loading.Register(context.Id, () => Load(context), LoadingStage.Start);
    }

    private IEnumerator Load(ModContext context)
    {
        yield return 2;
        yield return "Preparing badge";

        var texture = Textures.FromMod(context.Id, "Textures", "badge.png");
        var sprite = Sprites.FromTexture(texture, pixelsPerUnit: 100f);
        Content.Register("badge.icon", sprite);
        yield return "Badge imported";

        Log.Info(context.Id, "Loaded native items: " + Assets.All<ItemObject>().Count);
        yield return null;
        yield return "Native catalog inspected";
    }
}
```

Первый `yield` обязан быть `int` — ожидаемое число шагов; второй — `string`, начальный текст. После заголовка строка увеличивает счётчик выполненных шагов и меняет текст, целое число добавляет ожидаемые шаги, а `null`, вложенные enumerator и Unity yield instructions передаются scheduler. Отсутствие двух начальных значений или неверный тип вызывает `LoadingProtocolException`.

Задача выше создаёт texture и sprite под контекстом мода: они будут уничтожены при его освобождении. `Content.Register` добавляет ID `<id-мода>:badge.icon`; регистрация сама по себе не добавляет иконку в инвентарь, сцену или UI. Из другого мода запрашивайте её по полному ID и объявляйте зависимость от поставщика.

## Три разных способа найти объект

| Вызов | Результат | Если объекта нет |
|---|---|---|
| `Assets.All<T>()` | Все загруженные Unity-объекты типа, включая неактивные шаблоны | Пустой список |
| `Assets.One<T>(name)` | Первый объект с точным `UnityEngine.Object.name` | `null` |
| `Assets.Require<T>(name)` | То же, но с обязательным наличием | `KeyNotFoundException` с подсказкой дождаться главного меню |
| `Assets.Resource<T>(path)` | Нативный `Resources.Load<T>` по Resources-пути | Нативный `null` |
| `Content.TryGet<T>(id, out value)` | Объект, зарегистрированный модом с точным полным ID | `false`, `value=null` |
| `Content.Get<T>(id)` | Обязательный зарегистрированный объект нужного типа | `KeyNotFoundException` |

Имя объекта не является Resources-путём. `Assets.All` хранит кэш по типу; Core очищает его при загрузке/выгрузке сцены. Создание через Core/Builders также обновляет кэш. Если вы сами создали объект нативным Unity API и хотите сразу найти его через `Assets`, вызовите `Assets.Refresh()`. Запросы предназначены для setup и редких операций, не для повторного полного сканирования в каждом кадре.

`AssetRegistry.Shared` — отдельный реестр вида «тип → имя → объект». Модуль Assets наполняет его материалами, текстурами, спрайтами, звуками, предметами, постерами, сценами, LevelObject/LevelAsset, NPC и комнатами. Добавление с тем же ключом **заменяет** запись, тогда как `Content.Register` отвергает дубликат. Для публичного контента мода используйте `Content` с namespaced ID, а не случайное vanilla-имя.

## Остальные утилиты Core

`Find.All<T>`, `Named<T>`, `One<T>` — непосредственный поиск загруженных объектов, также с overload для `Type`; в отличие от `Assets`, этот helper не использует scene-кэш. Его `originalsOnly` фильтрует по неотрицательному Unity instance ID, а не доказывает, что объект принадлежит vanilla или конкретному пакету.

`Reflect.ReflectionGet/Set/Invoke` читает приватные и унаследованные члены; отсутствие поля/метода вызывает исключение. Это escape hatch для реального native-члена, не способ получить BB+ поле в BBCR. Для перегруженного метода предпочтительнее разрешить точную сигнатуру через Mixins/AccessTools. `CloneInto` и `ReplaceComponent` копируют поля, но не реализуют полноценную game-specific инициализацию/ownership: для обычного контента предпочтительнее `Assets` и `Builders`.

`ModDataBag` — обычный словарь по mod ID и ключу; `CopyFrom` копирует ссылки значений и сам по себе ничего не сохраняет на диск. Для типизированных данных с owned definition и явным persistence используйте [Attachments](data-saves.md). Не путайте `HighScoreMods` из shared utilities с составом `ScoreEntry.Mods`: Data BBCR собирает последний по фактическим контентным ModContext.

`Frame<T>`, `FrameAnimation<T>`, `AnimationClock<T>` описывают кадры и playback state. Clock продвигается явно через `Advance(dt)`; он не создаёт Unity Update и не назначает SpriteRenderer автоматически. Для ожиданий есть `WaitForScaledSeconds` с вариантами NPC/environment/activity: в BBCR `ForNpc` использует `npc.ec.NpcTimeScale`, а не отсутствующий BB+ NPC TimeScale-контракт.

## Создание и владение

`Assets.Create<T>(name)` создаёт принадлежащий моду `ScriptableObject`, удерживает его от выгрузки и помечает мод как добавляющий контент. `Assets.Clone<T>(original, name=null, template=true)` клонирует объект; при `template=true` GameObject/Component попадает под неактивный постоянный контейнер шаблонов. Клон компонента принадлежит моду целиком через его GameObject. В корне пакета не нужно хранить ещё одну копию prefab после создания шаблона.

`template=false` нужен для экземпляров, участвующих в сцене: разместите их под нужным scene root, настройте и явно активируйте по нативным правилам. Для NPC, pickup и дверей предпочтительнее `World`, потому что одного `Instantiate` мало для включения в игровые списки и установки ссылок.

`Assets.Bundle(relativePath)` загружает AssetBundle из пакета и при очистке вызывает `Unload(false)`. Уже загруженные из bundle Unity-объекты этот вызов не уничтожает: если вы сами извлекаете и создаёте экземпляры, назначьте им владельца через `context.OwnObject`. Bundle должен соответствовать Unity/платформе игры; API не конвертирует произвольный Unity-проект.

## Файлы, звук и локализация

| Помощник `Baldic.Api` | Применение |
|---|---|
| `Textures.FromFile`, `FromMod` | Загрузить изображение; PNG/JPEG идут через Unity, BMP/TGA и поддерживаемые DDS имеют дополнительные readers |
| `Sprites.FromTexture`, `FromFile`, `SliceByCount`, `SliceBySize` | Sprite и листы кадров; размеры и pixels-per-unit задаёт автор |
| `Audio.FromFile`, `FromMod` | Получить `AudioClip`; для игрового звука затем создать `Builders.Sound` |
| `Fonts.FromFile`, `FromFileLike`, `RegisterReplacement` | TMP-шрифт и подмена; для кириллицы требуются реальные глифы |
| `Models.FromFile`, `FromMod` | Импорт OBJ; настройка native collider/поведения остаётся задачей мода |
| `Midi.FromFile(path, id)`, `FromBytes` | Регистрация MIDI и возвращаемое имя для playback |
| `Localization.RegisterMod`, `RegisterFile`, `RegisterProvider` | Словари нативной локализации |

В BBCR есть два `Audio`: файловый импорт `Baldic.Api.Audio` и события MIDI `Baldic.Bbcr.Audio`. При использовании обоих явно укажите полное имя или `using`-alias. Локализация текста не переключает автоматически язык озвучки, субтитров и текстур: это разные состояния BBCR.

`Localization.RegisterMod(context.Id)` читает `Language/<имя Language>/*.json` внутри пакета в ordinal-порядке имён. Нативный JSON для такого файла:

```json
{
  "items": [
    { "key": "MYMOD_Badge_Name", "value": "Значок" },
    { "key": "MYMOD_Badge_Description", "value": "Сувенир из школы." }
  ]
}
```

Например, каталог `Language/English` добавляет русский текст при выбранном `Language.English`; это осознанная замена текста в существующем языке, а не автоматическое появление новой локали в меню. Для независимых resource packs и перезагрузки ресурсов используйте [общую главу ресурсов](../loader/resources.md): эти классы доступны и в BBCR-сборке Assets. Формат `assets/<namespace>/lang/...` ресурс-пака и описанный выше нативный `Language/...` — разные протоколы; выбирайте соответствующий reader.

Удаление localization provider снимает поставщика, но не восстанавливает уже изменённые значения нативного словаря. Если меняете чужие ключи и обещаете горячую очистку, сохраните и восстановите их значения. Реальный BBCR-русификатор делает именно это, а также отдельно обновляет вновь активируемые метки и layout.

Следующий шаг: [игра и события](game.md). Полные сигнатуры: [Core](../reference/bbcr/core.md), [Loading](../reference/bbcr/loading.md), [Assets](../reference/bbcr/assets.md).
