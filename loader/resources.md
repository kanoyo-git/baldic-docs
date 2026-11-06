# Ресурсные и data packs

Ресурсные packs принадлежат **не загрузчику**, а optional-модулю ASSETS. Для BB+ объявите `baldic-api-assets`, для BBCR — `baldic-api-bbcr-assets`; эти модули подтягивают соответствующие CORE/LOADING. Публичные типы `ResourcePacks`, `ResourceAssets`, `ResourceSnapshot` используются через `Baldic.Api` в обоих backends. Одних `Baldic.Loader.dll` и `0Harmony.dll` для этого раздела недостаточно.

Pack — каталог или ZIP с файлами `assets` и `data`. Он может быть выбран игроком, зарегистрирован программно или объявлен в manifest. Игровые текстуры, звуки, переводы и статические модели с поддерживаемыми именами заменяются автоматически; совместимый мод может читать свои ресурсы и привязывать их к своим объектам. Нет directory watchers, покадрового сканирования файлов или перезагрузки CLR-сборок.

## Выбор и приоритет

Поместите папку или ZIP в `resourcepacks/` в каталоге игры и откройте `Mods → Resource packs`. Слева находятся доступные пакеты, справа — включённые. Стрелка вправо включает пакет, стрелка влево выключает его; стрелки вверх и вниз меняют порядок. Нажмите на название пакета, чтобы увидеть описание и значок. Остальные нажимаемые надписи выделены жирным шрифтом. При совпадении ID побеждает верхний включённый пакет. У каждой колонки свои страницы. Кнопка `Apply packs` всегда доступна внизу и применяет изменения; `Rescan packs` обновляет список и сведения о пакетах. Выбор сохраняется в `BepInEx/config/Baldic/resource-packs.json` и восстанавливается при следующем запуске.

Для игры используйте lowercase имена объектов без вложенных каталогов:

```text
resourcepacks/my-pack/
  pack.mcmeta
  pack.png
  assets/baldic/textures/alarmclockicon_small.png
  assets/baldic/sounds/bal_allnotebooksnorm.wav
  assets/baldic/lang/english.json
  assets/baldic/models/example.obj
  assets/my-mod/textures/icon.png
```

Поддерживаются PNG, JPEG, BMP и TGA для текстур; WAV, OGG и MP3 для звуков. Имя после `textures/` сопоставляется с именем `Texture2D`; после `sounds/` — с именем `SoundObject` или исходного `AudioClip`. Текстура приводится к размеру оригинала. Заменяются игровые текстуры форматов RGBA32, ARGB32, BGRA32, RGB24, DXT1 и DXT5; другие форматы вызывают ошибку вместо незаметной порчи. При отключении возвращается исходный ресурс. Если пакет не удалось прочитать или применить, прежний выбранный набор остаётся активным. Шрифты, материалы и другие типы Unity автоматически не заменяются. Моды получают замены, если читают соответствующие ID через `ResourcePacks` или `ResourceAssets`, либо используют подходящие загруженные игровые объекты; для произвольного мода замена не гарантируется.

## Название, описание и значок

Необязательные `pack.mcmeta` и `pack.png` находятся в корне папки или ZIP. Без них используется имя папки или архива. `pack.png` — изображение PNG размером до 1 МиБ и 1024 × 1024 пикселей. В `pack.mcmeta` можно указать:

```json
{
  "pack": {
    "name": "Новая школа",
    "description": "Текстуры, звуки и переводы для школы."
  }
}
```

Описание также принимает Minecraft-форму с полями `text` и `extra`; показывается их текст без форматирования. Файл `pack.mcmeta` ограничен 64 КиБ. После изменения сведений нажмите `Rescan packs`.

## Переводы

Файл `assets/baldic/lang/english.json` заменяет строки выбранного английского языка. Имя файла соответствует имени языка игры строчными буквами: `english.json`, `french.json`, `japanese.json` или `test.json`. Можно использовать плоский словарь строк или игровой формат `items`:

```json
{
  "But_Options": "Настройки школы",
  "My_New_Key": "Новая строка"
}
```

Переводы объединяются **по ключам**: значение верхнего пакета имеет приоритет, а отсутствующие ключи берутся из нижних пакетов и игры. Они применяются после зарегистрированных переводов модов, включая TWGS, и откатываются при отключении пакета. TWGS использует игровой язык English, поэтому для него нужен `english.json`: файл не добавляет новый язык в меню. Игра или мод должны иметь шрифт с нужными символами.

Активные стандартные `TextLocalizer` обновляются при применении пакетов. Мод со своими текстовыми компонентами может подписаться на `Localization.PackTranslationsChanged` и обновить их из `LocalizationManager`; подписку следует снять при выгрузке мода. Языковые файлы в других namespace автоматически к игре не привязываются: их читает соответствующий мод.

## Анимированные текстуры

Для анимации положите кадры один под другим в PNG, например `assets/baldic/textures/example.png`, и рядом создайте `example.png.mcmeta`:

```json
{
  "animation": {
    "frametime": 4,
    "frames": [0, { "index": 1, "time": 8 }]
  }
}
```

Верхний кадр имеет индекс 0. Время задаётся в тиках по 1/20 секунды; в примере первый кадр длится четыре тика, второй — восемь. Если `frames` не указан, все кадры воспроизводятся по порядку с длительностью `frametime`; по умолчанию она равна одному тику. По умолчанию кадры квадратные, их высоту можно задать полем `height`, а ширину — `width` (она должна равняться ширине PNG). Поддерживается до 1024 кадров, вертикальная полоса ограничена 16 млн пикселей; подготовленные кадры каждой целевой текстуры тоже ограничены 16 млн пикселей. Интерполяция между кадрами не поддерживается. Сам PNG и `.mcmeta` выбираются по приоритету как отдельные файлы.

## Статические модели

`assets/baldic/models/<имя>.obj` заменяет визуальную геометрию загруженного `MeshFilter` с соответствующим именем исходного меша. Используйте lowercase имя без каталогов. OBJ ограничен 8 МиБ и должен содержать одну часть с одной группой материала; существующий материал объекта сохраняется. У замены сохраняются UV-координаты, а нормали при необходимости пересчитываются. Коллизии, физика и скелетные модели `SkinnedMeshRenderer` не изменяются: форма столкновений может отличаться от видимой модели. При отключении пакета возвращается исходный меш.

## Мастерская и пакеты без DLL

Откройте `Mods → Resource packs → Workshop`. `Prepare inbox` создаёт каталог `BepInEx/config/Baldic/ResourceWorkbench/Inbox`; положите файлы в `assets/<namespace>/<путь>` или `data/<namespace>/<путь>`. В `Preview inbox` можно просмотреть изображение или воспроизвести звук. Укажите уникальный `Pack ID` и нажмите `Create pack`: новая папка появится в `resourcepacks/`, существующий пакет не перезаписывается. Затем выберите его в списке и примените. `Reload registered packs` повторно читает включённые пакеты и запускает обычную транзакцию listeners.

Созданный пакет не содержит DLL. Его manifest объявляет каталог ресурсов:

```json
{
  "id": "my-resource-pack",
  "version": "1.0.0",
  "depends": { "baldic": ">=1.0.0" },
  "resourcePacks": ["resources"]
}
```

Модуль ASSETS регистрирует эти пути от имени включённого мода до стадии `preLaunch` пользовательских модов. Для архивного `.baldic` каталог читается из распакованного кэша; для редактирования и перезагрузки во время игры удобнее пакет-папка.

## Структура и ID

```text
my-mod/
  baldic.mod.json
  MyMod.dll
  packs/base/
    assets/my-mod/textures/icon.png
    assets/my-mod/audio/notice.wav
    assets/my-mod/lang/ru_ru.json
    data/my-mod/rules/example.json
```

Файл `data/my-mod/rules/example.json` имеет ID `my-mod:rules/example.json` и вид `ResourceKind.Data`; `assets/my-mod/textures/icon.png` — ID `my-mod:textures/icon.png` и вид `Assets`. Вид ресурса входит в адрес: одинаковые ID в `data` и `assets` независимы.

`ResourceId` принимает lowercase namespace из `a-z`, `0-9`, `_`, `.`, `-`; путь дополнительно допускает `/` между непустыми сегментами. Абсолютные пути, `\`, сегменты `.`/`..` и symlinks не допускаются. ID регистрации pack и listener должен использовать namespace владельца мода. Сами файлы внутри pack могут иметь другой namespace, чтобы мод мог явно переопределить чужой ресурс.

## Установка pack и подготовка объектов

Следующая самостоятельная единица работает с обоими backends при подключении соответствующих CORE/ASSETS и Unity references из SDK. Она ожидает приведённую структуру pack и namespace, совпадающий с `context.Id`; точка входа объявляется обычным `entrypoints.init`. `Icon` читается после успешной перезагрузки, а не кэшируется навсегда отдельно от коллекции.

```csharp
using Baldic;
using Baldic.Api;
using UnityEngine;

namespace Book.Resources
{
    [BaldicMod]
    public sealed class ResourceMod
    {
        private ResourceAssets assets;
        private ResourceId icon;

        public Texture2D Icon => assets.GetTexture(icon);

        public void Init(ModContext context)
        {
            ResourcePacks.Register(new ResourceId(context.Id, "base"),
                "packs/base", owner: context);
            assets = new ResourceAssets(new ResourceId(context.Id, "prepared"), context);
            icon = new ResourceId(context.Id, "textures/icon.png");
            assets.AddTexture(icon);
            assets.AddAudio(new ResourceId(context.Id, "audio/notice.wav"));
            assets.AddLocalization(new ResourceId(context.Id, "lang/ru_ru.json"));
            assets.AddJson(new ResourceId(context.Id, "rules/example.json"));
            ResourcePacks.Reload();
        }
    }
}
```

`Register` сразу читает pack и публикует новый snapshot через listener-транзакцию. Создание `ResourceAssets` и добавление деклараций само по себе не запускает ещё один reload: после регистрации всех потребителей явно вызывается `ResourcePacks.Reload()`. Если pack регистрируется позже других listeners, его первоначальная публикация уже обязана удовлетворять их требованиям.

Отсутствующий объявленный файл приводит к ошибке подготовки. Для optional-ресурса сначала используйте `Current.TryGet(kind, id, out entry)` и объявляйте его только при наличии; иначе обязательная декларация не станет optional из-за перехвата исключения в getter. Повторять один ID listener или pack нельзя. Регистрации и `ResourceAssets` принадлежат захваченному `ModContext` и освобождаются с ним.

Texture preparation поддерживает PNG/JPEG через Unity и существующий reader BMP/TGA; audio — WAV/OGG/MP3 через decoder Unity, с ожиданием одной подготовки до 30 секунд. Reload выполняется на Unity owner thread и способен занять заметное время: выбирайте границу меню/загрузки. Не вызывайте его из фонового потока ради обхода задержки.

## Выбор версии ресурса

`ResourcePacks.Current.Get(kind, id)` возвращает победивший файл, `GetAll` — весь стек версий. До пользовательского выбора больший `priority` pack выигрывает; при равенстве первым идёт меньший ordinal pack ID, независимо от порядка регистрации. После применения выбора порядок задаёт игрок. `Find(kind, "tags/")` выбирает победившие файлы с данным префиксом пути и возвращает их в порядке ID.

`ResourceEntry.ReadBytes()` возвращает отдельный массив, `ReadText()` — UTF-8 текст, `ReadJson()` — отдельное дерево dictionary/list/чисел MiniJson. JSON ограничен глубиной 64. Для языка подходит плоский словарь строк или native-форма `{ "items": [{ "key": "Example", "value": "Текст" }] }`. Один pack ограничен 8192 файлами, 64 МиБ на файл и 256 МиБ суммарно.

Snapshot удерживает прочитанные байты независимо от последующих изменений файлов. Подготовленные `Texture2D`/`AudioClip` имеют иной срок жизни: после успешного reload старые объекты уничтожаются. Не сохраняйте старый объект для будущего использования после смены поколения. `ResourceAssets.GetJson` даёт независимую копию дерева; изменение её элементов не редактирует исходный pack или подготовленную генерацию.

## Своя reload-транзакция

Если от ресурсов зависит вычисленная конфигурация, зарегистрируйте `ResourcePacks.Listen(id, prepare, priority, owner)`. Все `prepare` завершаются до первого `Apply`. Listener с большим приоритетом выполняется раньше; при равенстве сравниваются его ID. `ResourceAssets` по умолчанию имеет приоритет 1000: потребителю, чей `Apply` читает новые prepared assets, нужен меньший приоритет.

Следующая самостоятельная единица показывает транзакцию для обычной строки. До вызова `Install` pack уже должен предоставлять `data/<id>/rules/message.txt`. `Install` регистрирует listener; первую подготовку выполняет отдельный явный `Reload` после настройки всех зависимостей.

```csharp
using System;
using Baldic;
using Baldic.Api;

namespace Book.ResourceTransactions
{
    public sealed class MessageBinding
    {
        public string Current { get; private set; } = "";

        public IDisposable Install(ModContext owner)
        {
            var resource = new ResourceId(owner.Id, "rules/message.txt");
            return ResourcePacks.Listen(new ResourceId(owner.Id, "message-consumer"),
                snapshot => new Change(this,
                    snapshot.Get(ResourceKind.Data, resource).ReadText()),
                priority: 0, owner: owner);
        }

        private sealed class Change : IResourceReload
        {
            private readonly MessageBinding binding;
            private readonly string previous;
            private readonly string next;

            public Change(MessageBinding binding, string next)
            {
                this.binding = binding;
                previous = binding.Current;
                this.next = next;
            }

            public void Apply() { binding.Current = next; }
            public void Rollback() { binding.Current = previous; }
            public void Dispose() { }
        }
    }
}
```

Prepare не должен менять живое состояние. Он создаёт staged values и запоминает прежние привязки. `Apply` устанавливает новое, `Rollback` возвращает **всё**, включая частичные изменения внутри `Apply`, который выбросил исключение. `Dispose` освобождает staging после неудачи либо retired state после успеха. Пустой `Dispose` в примере допустим, потому что строки не требуют отдельного native cleanup; для Unity objects понадобится настоящая очистка владельца этих объектов.

При ошибке подготовки/применения `Current` и его `Generation` не меняются. Применённые транзакции откатываются в обратном порядке, включая ту, чей `Apply` упал. Ошибки rollback агрегируются: транзакционность механизма не может восстановить произвольный внешний побочный эффект, который listener забыл откатить.

Callbacks выполняются на owner thread в контексте владельца listener. Рекурсивный/off-thread reload запрещён. Нельзя добавлять регистрации из reload callback. Снятие регистрации или disposal владельца происходит сразу; если это случилось во время подготовки/применения, транзакция прерывается и прежнее поколение сохраняется. Cleanup уже неактивного владельца выполняется без повторного входа в его контекст.

## Удаление и локализация

Disposal pack вне reload пересобирает snapshot из закэшированных surviving packs, не читая диск заново. Через ту же транзакцию могут открыться нижние версии ресурса. Если потребитель отвергает изменение, последнее хорошее поколение остаётся живым, хотя удалённый источник уже снят с регистрации. Сначала освобождайте зависимого потребителя, потом pack, без которого он не работает.

Коллекция `ResourceAssets` сама не прописывает произвольные словари в локализацию игры. Для своих namespace используйте `Localization.RegisterProvider` выбранного backend и обновление активного языка из apply-транзакции; путь `assets/baldic/lang/<язык>.json` обрабатывается системой пакетов автоматически. Если мод временно занял ванильный material/audio/language binding, восстановите его в owner cleanup **до** уничтожения своих prepared assets. Игровые особенности этого связывания описываются в [BB+ API](../api-bbplus/README.md) и [BBCR API](../api-bbcr/README.md).

Сгенерировать JSON/языковые данные можно через [datagen](tooling.md). Он создаёт файлы, а зарегистрировать и применить pack должен runtime-мод. Справочник адресов и манифеста: [термины](../appendix/glossary.md), [манифест](../appendix/manifest.md).
