# Динамические hooks и HookContext

Динамический hook получает единый `HookContext` вместо набора типизированных параметров. Этот уровень удобен, когда мод выбирает цель строкой, общим способом обрабатывает аргументы либо включает отдельные callbacks настройкой. За гибкость приходится платить упаковкой значений и созданием контекста вызова. Для частого игрового кода сравните этот путь с [типизированным патчем](typed-patches.md) и [операциями](operations.md).

## Установка и жизненный цикл

Самостоятельный пример ниже требует `Baldic.Loader.dll`. Вызовите `DynamicDemo.Run()` в runtime-стадии мода. Hook меняет аргумент `3` на `5`, тело возвращает `6`, а обработчик результата превращает его в `12`. После освобождения двух регистраций результат снова `4`.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.DynamicHooks
{
    public static class Counter
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Read(int amount) => amount + 1;
    }

    public static class DynamicDemo
    {
        public static void Run()
        {
            using (var before = Mixin.Inject(
                "Book.DynamicHooks.Counter::Read(int)", At.Head,
                context => context.SetArg(0, context.Arg<int>(0) + 2)))
            using (var after = Mixin.ModifyReturn(
                "Book.DynamicHooks.Counter::Read(int)", value => (int)value * 2))
            {
                if (Counter.Read(3) != 12)
                    throw new InvalidOperationException("Dynamic hook failed");
            }
            if (Counter.Read(3) != 4)
                throw new InvalidOperationException("Cleanup failed");
        }
    }
}
```

Каждая регистрация возвращает `IDisposable` и автоматически принадлежит `ModContext.Current`, если он установлен. `using` здесь сокращает демонстрацию. В моде, который должен работать до выгрузки, не закрывайте регистрацию сразу после `Init`: сохраните её для раннего отключения или оставьте очистку контексту. Параметр `owner` динамических методов — метка регистрации; общий движок устанавливает их адаптеры под собственным owner. Для точного внешнего ID цепочки используйте `CreatePatches`.

Callbacks динамических hooks выполняются с контекстом своего мода. Runtime диспетчер пропускает callbacks неактивного или faulted-контекста и передаёт ошибки обработчиков в `Runtime.ReportFailure`. У типизированных callbacks и operation wrappers нет этого дополнительного входа в ambient-контекст. Учитывайте разницу, если внутри callback вызываете API, зависящий от `ModContext.Current`.

## Что находится в контексте

| Член | Назначение |
| --- | --- |
| `Instance` | Получатель вызова, для static — `null` |
| `Args`, `Arg<T>(index)` | Аргументы по индексам управляемой сигнатуры |
| `SetArg(index, value)` | Изменение передаваемого аргумента |
| `Result`, `ReturnValue` | Текущее возвращаемое значение; `ReturnValue` — только чтение |
| `SetReturn(value)` | Запись результата, сама по себе не отменяет тело |
| `Cancel()`, `Cancel(value)` | Запретить исходное тело на входе; второй overload также задаёт результат |
| `Cancelled`, `RunOriginal` | Состояние отмены и флаг выполнения оригинала, переданный движком |
| `CallOriginal()` | Отдельно вызвать цель с текущими аргументами через обход Baldic handlers |

`HookContext` действует только внутри перехватываемого вызова. Не сохраняйте его в поле, задачу или coroutine. После завершения контекст инвалидируется; доступ к его данным выдаёт `HookContext expired`. Finalizer восстанавливает состояние вложенных вызовов и при исключении. Для отложенной работы скопируйте только необходимые значения и отдельно определите, безопасно ли сохранять ссылки на игровые объекты.

Аргументы нумеруются с нуля, без `this`; позиции `ref`/`out` соответствуют управляемой сигнатуре. В `At.Head` значение `out` ещё не следует считать результатом исходного метода. В фазе завершения доступны обновлённые аргументы. Типы записанных значений должны подходить цели.

`At.Head` работает на входе. `At.Tail` — на нормальном завершении через Postfix. В текущей реализации `At.Return` обслуживается той же фазой завершения, что и Tail: это не отдельный IL-перехват каждого `ret`, и он не вызывается вместо `finally` при выбросе исключения. Для произвольного управления выходами тела используйте transpiler либо типизированный Finalizer по задаче.

`SetReturn` в Head без отмены не является заменой результата тела: тело продолжает вычисление. Для замены используйте `Cancel(value)` или `Replace`, а для обработки уже вычисленного результата — Tail/`ModifyReturn`.

## Replace и CallOriginal

`Mixin.Replace(target, callback, priority, owner, when)` устанавливает единственную динамическую замену цели. Callback возвращает `object`, который становится результатом вместо исходного тела. Для `void` возвращайте `null`. Второй `Replace` на той же цели отвергается даже тогда, когда условия двух замен, по замыслу автора, не пересекаются.

`CallOriginal()` обходит Baldic handlers этой цели для отдельного вложенного вызова, однако чужие Harmony-совместимые патчи могут выполниться. Это не полностью «чистый оригинал» и не [reverse patch](attributes.md). Возвращённое значение принадлежит этому отдельному вызову: сам `CallOriginal()` не отменяет автоматически последующий исходный вызов внешнего перехвата. Используйте его внутри `Replace` либо явно отменяйте внешний Head, если тело должно выполниться ровно один раз.

Не вызывайте `CallOriginal()` рекурсивно для той же активной операции обхода. Внутреннее состояние обхода локально для потока; это не обещание безопасного выполнения игрового метода на произвольном потоке.

## Атрибуты и условия конфигурации

Этот самостоятельный класс требует `Baldic.Loader.dll`. Он рассчитан на манифест с `"mixins": ["ConditionalHooks.dll:Book.ConditionalHooks.Hooks"]`. Имя DLL должно совпадать с результатом вашей сборки. В примере цель содержится в той же сборке для воспроизводимости; реальный мод укажет существующий игровой метод.

```csharp
using System.Runtime.CompilerServices;
using Baldic;
using Baldic.Mixins;

namespace Book.ConditionalHooks
{
    public static class Target
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Read(int value) => value;
    }

    public static class Hooks
    {
        [Config("General", "Enabled")]
        public static bool Enabled = true;

        [Inject("Book.ConditionalHooks.Target::Read(int)", At.Head,
            When = "General.Enabled", Priority = 10)]
        private static void Before(HookContext context)
        {
            context.SetArg(0, context.Arg<int>(0) + 2);
        }

        [ModifyReturn("Book.ConditionalHooks.Target::Read(int)",
            When = "General.Enabled")]
        private static object After(object value) => (int)value * 3;
    }
}
```

Настройка связывается до регистрации атрибутов этого типа. `When` ссылается на булеву запись `Section.Key`; `!Section.Key` инвертирует условие. Для `[Inject]` ложное условие пропускает обработчик, для модификаторов возвращает неизменённое значение. Отключённый `[Replace]` не отменяет тело, отключённый `[Redirect]` вызывает оригинальную операцию через контекст. Условие читается при каждом вызове, однако сам runtime-патч остаётся установленным.

Программный `Replace` имеет параметр `when: Func<bool>`. Не переносите этот параметр на все методы по аналогии: `Inject`, `ModifyArg` и `ModifyReturn` такого overload не объявляют. Для условного `Inject` проверьте настройку внутри callback.

## Redirect и ограничения

`Mixin.Redirect(caller, callee, callback)` переписывает проверенные `call`/`callvirt` внутри выбранного caller. Он меняет вызовы callee только в этом методе, а не все вызовы callee в игре. Совпадающие call sites преобразуются при установке; стек вызовов не просматривается на каждом обращении. Callback получает `HookContext` вызываемой операции и возвращает её результат. Его `CallOriginal()` вызывает callee с текущими аргументами.

Две регистрации Redirect для одной пары caller/callee конфликтуют. Этот API не предоставляет `ordinal` и точного `expectedMatches`. Если нужны выбор отдельного вхождения, совместная обёртка нескольких модов или типизированный continuation, выбирайте [WrapOperation](operations.md).

Динамические hooks отвергают, в частности, открытые generic-цели, by-reference/pointer результат и указатели в аргументах. Они работают с методами, не с конструкторами. Redirect дополнительно не поддерживает `ref`/`out` параметры callee и нестатический callee на value type. Не пытайтесь компенсировать неподдерживаемую сигнатуру приведением `object`: выберите типизированный патч или транспайлер и проверьте совместимость с фактическим методом.
