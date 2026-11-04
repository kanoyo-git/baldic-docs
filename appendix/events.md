# События и payload

`Baldic.Events.EventBus` доступен в Loader. Он работает с именем события и `GameEvent`, содержащим `Instance`, `Args` и `Cancelled`. `On` принимает callback, приоритет и необязательного owner; `Emit` вызывает снимок слушателей в owner thread.

Параметр `owner` у `On` — строковый ID для атрибуции. Жизненный цикл и контекст callback захватываются из `ModContext.Current` при регистрации; передача строки ID сама по себе не создаёт контекст и не назначает ему владение подпиской.

```csharp
using Baldic;
using Baldic.Events;

[BaldicMod]
public sealed class PingExample
{
    public void Init(ModContext owner)
    {
        EventBus.On("example.ping", data =>
        {
            Log.Info(owner.Id, "Payload: " + data.Args[0]);
        });
        EventBus.Emit("example.ping", new GameEvent
        {
            Instance = this,
            Args = new object[] { 42 }
        });
    }
}
```

Внутри entrypoint On захватывает активный контекст; подписка удаляется с владельцем. Ошибка callback передаётся через Runtime.ReportFailure; faulted/inactive owner не должен продолжать обычные dispatch callbacks.

## Cancelled — часть протокола события

`Cancel()` меняет флаг. EventBus сам по себе не прерывает оставшиеся callbacks и не отменяет любой native метод. Отмена имеет эффект только там, где конкретный publisher читает флаг и реализует соответствующее поведение. В собственном publisher вы должны сделать это явно.

## Игровые события

Набор, payload, момент и поддержка отмены зависят от game backend. Общие константы Loader не устанавливают hooks в игру без API. Для BB+ см. [gameplay](../api-bbplus/gameplay.md), для BBCR — [события игры](../api-bbcr/game.md).

Не приводите `Instance` и `Args` к типам по догадке. Сверьте таблицу конкретного события, а при создании своего события договоритесь о payload с потребителями.

При одновременном импорте `Baldic.Events` и `Baldic.Bbcr` имя `GameEvents` неоднозначно. Используйте полное имя или alias для констант выбранной игры.
