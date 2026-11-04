# Ресурсные и data packs

Ресурсные packs принадлежат **не загрузчику**, а optional-модулю ASSETS. Для BB+ объявите `baldic-api-assets`, для BBCR — `baldic-api-bbcr-assets`; эти модули подтягивают соответствующие CORE/LOADING. Публичные типы `ResourcePacks`, `ResourceAssets`, `ResourceSnapshot` используются через `Baldic.Api` в обоих backends. Одних `Baldic.Loader.dll` и `0Harmony.dll` для этого раздела недостаточно.

Pack — явно зарегистрированный каталог с файлами `assets` и `data`. Регистрация и перезагрузка не меняют автоматически ванильные материалы, звуки или таблицы языка. Мод сам выбирает ресурсы и привязывает подготовленные значения к своим объектам. Нет directory watchers, покадрового сканирования или перезагрузки CLR-сборок.

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

`ResourcePacks.Current.Get(kind, id)` возвращает победивший файл, `GetAll` — весь стек версий. Больший `priority` pack выигрывает; при равенстве первым идёт меньший ordinal pack ID, независимо от порядка регистрации. `Find(kind, "tags/")` выбирает победившие файлы с данным префиксом пути и возвращает их в порядке ID.

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

Коллекция `ResourceAssets` не прописывает свои словари в локализацию игры. Для этого отдельно используйте `Localization.RegisterProvider` выбранного backend и обновление активного языка из apply-транзакции. Если мод временно занял ванильный material/audio/language binding, восстановите его в owner cleanup **до** уничтожения своих prepared assets. Игровые особенности этого связывания описываются в [BB+ API](../api-bbplus/README.md) и [BBCR API](../api-bbcr/README.md).

Сгенерировать JSON/языковые данные можно через [datagen](tooling.md). Он создаёт файлы, а зарегистрировать и применить pack должен runtime-мод. Справочник адресов и манифеста: [термины](../appendix/glossary.md), [манифест](../appendix/manifest.md).
