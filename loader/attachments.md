# Типизированные attachments и сохранение

Attachments добавляют namespaced-значение существующему **ссылочному объекту**, не меняя его CLR-класс. Это сервис optional CORE: для BB+ нужен `baldic-api-core`, для BBCR — `baldic-api-bbcr-core`. Публичный контракт находится в `Baldic.Api` обоих backends. Это не loader-only функция, не расширение формата vanilla save и не автоматическая замена прежнего `ModDataBag`.

Сервис не ставит глобальный hook на `Instantiate` и не сканирует объекты каждый кадр. Значения живут в `ConditionalWeakTable`: attachment не удерживает holder, даже если значение ссылается обратно на него. Два разных объекта, которые сравниваются через `Equals` как равные, всё равно имеют независимые attachments.

## Объявление и использование

Этот самостоятельный класс требует runtime loader и CORE выбранной игры. Он регистрирует сохраняемый счётчик, добавляет посещение произвольному ссылочному holder и даёт явные методы capture/restore. Вызывайте методы сервиса на Unity owner thread.

```csharp
using System.Globalization;
using Baldic;
using Baldic.Api;

namespace Book.AttachmentCounters
{
    [BaldicMod]
    public sealed class VisitMod
    {
        private ModContext owner;
        private AttachmentType<int> visits;

        public void Init(ModContext context)
        {
            owner = context;
            visits = Attachments.Register<int>(new ResourceId(context.Id, "visits"),
                factory: () => 0,
                copy: value => value,
                encode: value => value.ToString(CultureInfo.InvariantCulture),
                decode: text => int.Parse(text, CultureInfo.InvariantCulture),
                version: 1, owner: context);
        }

        public int Visit(object holder)
        {
            int value = Attachments.Get(holder, visits) + 1;
            Attachments.Set(holder, visits, value);
            return value;
        }

        public string Capture(object holder) => Attachments.Capture(holder, owner);
        public void Restore(object holder, string payload) =>
            Attachments.Restore(holder, payload, owner);
    }
}
```

ID определения должен принадлежать namespace owner и следовать правилам [ResourceId](resources.md). Повторный ID запрещён до освобождения прежнего определения. `Get(holder, type)` создаёт default один раз: через factory либо `default(T)`. `TryGet` не создаёт значение. `Set`, `Remove` и `Clear(holder)` изменяют данные выбранного holder. Обратите внимание: `Clear` очищает его значения всех зарегистрированных типов, а не только вызывающего мода; для узкого изменения используйте `Remove(holder, yourType)`.

Null, boxed value types и уничтоженные Unity objects отвергаются. Определение принадлежит `ModContext`; disposal определения или контекста снимает его weak storage без обхода holders. Сами значения — обычные managed данные: удаление attachment не вызывает `IDisposable.Dispose` произвольного значения. Native resources и другие disposables держите под обычным механизмом владения мода.

## Копирование всегда явное

После создания клона вызовите `Attachments.Copy(original, clone)`. Без `copy` значение этого определения **не переносится**. Для `int` достаточно `value => value`; для изменяемого списка нужен отдельный экземпляр, например `value => new List<int>(value)`, с корректной глубиной копирования для вашего содержимого. Сам Unity clone не запускает этот copier автоматически.

Сначала выполняются все copiers, затем меняются значения назначения. Если copier выбросил исключение, staged изменения не применяются. Регистрация/удаление определений во время copier или codec меняет revision и прерывает операцию до применения staging. Это не откатывает сторонние эффекты callback: не меняйте там сами holders, чужие attachments или внешнее состояние.

## Persistence — отдельное включение

Определение становится persistent, только если переданы **оба** `encode` и `decode`. Оставьте оба отсутствующими для временных данных. Кодек преобразует значение в строку и обратно; CLR type metadata не интерпретируется. `version` по умолчанию 1, допустимы положительные версии. Snapshot с другой версией известного определения отвергается; автоматической миграции codecs нет.

`Capture(holder, owner)` выдаёт format-1 JSON только с присутствующими persistent values этого owner. Factory ради capture не вызывается. `Restore` валидирует и декодирует известные значения до изменения holder. Persistent определения владельца, отсутствующие в snapshot, удаляются, так что следующий `Get` снова создаст default. Transient-данные и другие owners не затрагиваются.

Неизвестный definition ID в namespace того же владельца проверяется и пропускается; следующий capture его не сохраняет. Чужой namespace и некорректная оболочка — ошибка. Snapshot ограничен 1 МиБ **символов**, 4096 entries и глубиной JSON 64. Это ограниченный payload, а не формат для больших текстур или произвольных object graphs.

## Стабильные привязки нескольких holders

Для сохранения runtime-объектов назначьте логические ID независимо от экземпляров. Следующая самостоятельная единица использует те же registered attachment definitions, что остальной мод, и не сохраняет их самостоятельно на диск:

```csharp
using Baldic;
using Baldic.Api;

namespace Book.AttachmentBindings
{
    public static class SessionSnapshot
    {
        public static AttachmentBinding[] Bind(ModContext owner,
            object session, object player)
        {
            return new[]
            {
                new AttachmentBinding(new ResourceId(owner.Id, "session"), session),
                new AttachmentBinding(new ResourceId(owner.Id, "player/0"), player)
            };
        }

        public static string Capture(ModContext owner, object session, object player)
        {
            return Attachments.CaptureBindings(Bind(owner, session, player), owner);
        }

        public static void Restore(ModContext owner, object session,
            object player, string payload)
        {
            Attachments.RestoreBindings(Bind(owner, session, player), payload, owner);
        }
    }
}
```

Binding ID должен быть уникальным namespaced ID владельца. Не стройте его из Unity instance ID, display name или `GetHashCode()`. После создания новых holders восстановите те же логические ID с новыми ссылками. `RestoreBindings` сначала готовит изменения для всех supplied holders: одна ошибка декодирования оставляет их значения неприменёнными. Неизвестные bindings пропускаются; если текущего binding нет в snapshot, persistent values его владельца удаляются.

## BB+: modded run slots

Для интеграции с BB+ saves объявите `baldic-api-saves` (он требует CORE и другие собственные модули). Следующая самостоятельная единица регистрирует `AttachmentSaveHandler` в существующем `ModdedSaves` под контекстом мода:

```csharp
using System;
using System.Collections.Generic;
using Baldic;
using Baldic.Api;

namespace Book.BbplusAttachmentSaves
{
    public static class SaveRegistration
    {
        public static void Install(ModContext owner,
            Func<IEnumerable<AttachmentBinding>> currentBindings)
        {
            using (owner.Enter())
                ModdedSaves.AddHandler(new AttachmentSaveHandler(currentBindings, owner));
        }
    }
}
```

Binding callback должен каждый раз находить **текущие** holders и возвращать пустую коллекцию, пока их нет. При чтении save валидируется оболочка payload, который ждёт в handler до `OnCgmCreated`; декодирование значений для новых holders происходит при фактическом восстановлении. Новый запуск/reset очищает сохранённые persistent values.

Handler использует прежний per-mod payload выбранного native modded run slot и не меняет save byte format. Хранилище держит один handler на mod ID: повторный `AddHandler` заменяет прежнюю ссылку. Если у мода уже есть собственный, встроите `CaptureBindings`/`RestoreBindings` в него, а не ставьте второй и не заменяйте существующую логику. Регистрация очищается через обычное владение save API; профили и modded slots сохраняют свою изоляцию.

## BBCR: профиль и слот

Для BBCR объявите `baldic-api-bbcr-data`; он использует CORE/LOADING/GAME. Сервис `Baldic.Bbcr.AttachmentPersistence` хранит отдельные versioned files рядом с per-mod saves, не изменяя native encrypted saves. Самостоятельный пример показывает явные вызовы и отдельную optional-подписку:

```csharp
using System;
using System.Collections.Generic;
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;

namespace Book.BbcrAttachmentSaves
{
    public static class ProfileSnapshots
    {
        public static void Save(ModContext owner, IEnumerable<AttachmentBinding> bindings)
        {
            AttachmentPersistence.Save("progress", bindings, owner);
        }

        public static void Load(ModContext owner, IEnumerable<AttachmentBinding> bindings)
        {
            AttachmentPersistence.Load("progress", bindings, owner);
        }

        public static IDisposable Subscribe(ModContext owner,
            Func<IEnumerable<AttachmentBinding>> currentBindings)
        {
            return AttachmentPersistence.Register("progress", currentBindings, owner);
        }
    }
}
```

`PathFor(slot, owner)` включает валидированный slot и SHA-256 имени загруженного native-профиля. Owner, профиль и slot дают раздельные файлы. Для явного Save/Load профиль уже должен быть загружен. Отсутствующий файл при Load сбрасывает persistent values этого owner у supplied bindings к состоянию без значений.

`Register` при уже загруженном профиле сразу выполняет Load, затем подписывается на native saved/успешный loaded event. При более ранней регистрации данные инициализирует первый успешный native load. Подписки и файл attachments не появляются без явного opt-in. Один owner/slot нельзя зарегистрировать дважды. Передавайте функцию разрешения текущих holders, а не фиксированный массив уничтоженных игровых экземпляров.

При изменении версии собственного payload спроектируйте миграцию до передачи snapshot в Restore; простой bump `version` приводит к отказу, а не к конвертации. Для конкретных жизненных циклов holders и saves см. [BB+ API](../api-bbplus/README.md), [BBCR API](../api-bbcr/README.md) и [диагностику](../appendix/troubleshooting.md).
