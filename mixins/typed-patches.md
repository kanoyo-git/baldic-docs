# Типизированные Prefix, Postfix и владельцы

Типизированный патч получает параметры непосредственно от движка. Он не обязан принимать каждый аргумент исходного метода: объявите только необходимые параметры и специальные имена. Prefix выполняется до исходного тела, Postfix обрабатывает нормальный результат, а Finalizer предназначен для завершения вызова с учётом исключения.

## Полный пример с Patcher

Ниже отдельная компилируемая единица со ссылкой на собственную `0Harmony.dll`. Вызовите `TypedPatchDemo.Run()` из точки входа мода. До патча `Read(3)` возвращает `4`. Prefix увеличивает аргумент до `5` и сохраняет исходное `3`; Postfix прибавляет это состояние к результату `6`, получая `9`. После выхода из `using` возвращается исходное поведение.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.TypedPatches
{
    public static class Meter
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Read(int amount) => amount + 1;
    }

    public static class TypedPatchDemo
    {
        public static void Run()
        {
            using (var patches = new Patcher("book.typed-meter"))
            {
                patches.Patch(
                    AccessTools.Method(typeof(Meter), nameof(Meter.Read)),
                    prefix: new PatchMethod(typeof(TypedPatchDemo), nameof(Before)),
                    postfix: new PatchMethod(typeof(TypedPatchDemo), nameof(After)));
                if (Meter.Read(3) != 9) throw new InvalidOperationException("Patch failed");
            }
            if (Meter.Read(3) != 4) throw new InvalidOperationException("Cleanup failed");
        }

        private static void Before(ref int amount, out int __state)
        {
            __state = amount;
            amount += 2;
        }

        private static void After(int __state, ref int __result)
        {
            __result += __state;
        }
    }
}
```

`ref int amount` меняет аргумент, который получит исходный метод. Имя `amount` соответствует исходной сигнатуре; для привязки по позиции движок также поддерживает `__0`, `__1` и следующие индексы. `ref int __result` меняет возвращаемое значение. Для метода экземпляра `__instance` даёт получателя вызова; для статического метода экземпляра нет.

`out int __state` здесь является выходным параметром Prefix, а не аргументом целевого метода. Движок передаёт сохранённое значение в Postfix того же класса. Состояние относится к одному вызову, поэтому подходит и для рекурсивных вызовов. Если разные callbacks используют `__state`, размещайте соответствующие Prefix/Postfix в одном классе и согласуйте тип состояния.

Обычные `ref`/`out` параметры самой цели тоже адресуются по имени или индексу с совместимым типом. Не читайте исходное содержимое `out` до того, как оно определено. При пропуске исходного метода ответственность за необходимые выходные значения переходит к патчу.

## Пропуск исходного тела и исключения

Следующий самостоятельный пример демонстрирует Prefix, возвращающий `false`. Он устанавливает результат и выходной аргумент вместо тела `TryRead`; исходный метод не вызывается.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.SkipPatch
{
    public static class Reader
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static bool TryRead(int key, out int value)
        {
            value = key;
            return false;
        }
    }

    public static class SkipDemo
    {
        public static void Run()
        {
            using (var patches = new Patcher("book.skip-read"))
            {
                patches.Patch(AccessTools.Method(typeof(Reader), nameof(Reader.TryRead)),
                    prefix: new PatchMethod(typeof(SkipDemo), nameof(Before)));
                if (!Reader.TryRead(2, out int value) || value != 20)
                    throw new InvalidOperationException("Unexpected replacement");
            }
        }

        private static bool Before(int key, ref int value, ref bool __result)
        {
            value = key * 10;
            __result = true;
            return false;
        }
    }
}
```

`false` не означает «удалить всю цепочку патчей»: дальнейшее выполнение callbacks определяется общим движком и их сигнатурами. Postfix может выполняться и при пропущенном исходном теле. Если логика зависит от факта выполнения, используйте специальный параметр `bool __runOriginal`, а не предположение о том, что ваш Prefix был единственным.

Postfix не заменяет `finally`. Для наблюдения за исключением используйте Finalizer с параметром `Exception __exception`. Finalizer, возвращающий `Exception`, может вернуть исходное исключение, другое исключение или `null` для подавления. Подавление меняет контракт метода; делайте это только если мод действительно задаёт осмысленный результат и состояние после сбоя. Типизированные callbacks не проходят через обработчик ошибок динамических hooks.

## Группа с ModContext

`Patcher` — низкий уровень: он не привязывается автоматически к текущему моду. Освободите его через `Dispose`/`UnpatchSelf`, например при уничтожении [плагина](../loader/plugins.md). Если патчи должны принадлежать пакету Baldic, используйте группу. Следующий фрагмент размещается внутри метода инициализации с параметром `ModContext context`, после подключения типов из первого примера:

```csharp
using Baldic;
using Baldic.Mixins;

namespace Book.TypedPatches
{
    public static class OwnedMeterPatches
    {
        public static Mixin.PatchSet Install(ModContext context)
        {
            var patches = Mixin.CreatePatches("book.owned-meter", context);
            patches.Patch(AccessTools.Method(typeof(Meter), nameof(Meter.Read)),
                postfix: new PatchMethod(typeof(OwnedMeterPatches), nameof(After))
                {
                    Priority = PatchPriority.High,
                    After = new[] { "example.prerequisite" }
                });
            return patches;
        }

        private static void After(ref int __result) => __result += 10;
    }
}
```

Группа сохраняет owner ID ровно как передан: `book.owned-meter`. Указанный `context` владеет её очисткой; без параметра берётся `ModContext.Current`. Передавайте контекст API-модуля явно, когда устанавливаете общую функцию по запросу другого мода. Иначе общий патч может ошибочно принадлежать вызывающему модулю. Повторный `Dispose` группы допустим, установка после него выбрасывает `ObjectDisposedException`. Две группы с одинаковым owner намеренно разделяют область удаления.

Для одного патча есть `Mixin.Patch`: он принимает `MethodInfo` callbacks и возвращает `IDisposable`, который тоже принадлежит текущему контексту. Его внутренний owner имеет уникальный суффикс; параметр `owner` здесь не означает точный ID общего движка. В отличие от `PatchMethod`/`PatchSet`, этот метод явно задаёт переданный `priority`, включая значение по умолчанию `0`. Для сохранения собственной метаинформации descriptor и точного owner выбирайте `CreatePatches`.

## Порядок и снятие

`PatchMethod.Priority`, `Before` и `After` передаются общему движку. `Before`/`After` содержат owner ID, а не имена методов или DLL. Есть константы `PatchPriority.First` (800), `High` (600), `Normal` (400), `Low` (200). Не выводите из одного числа универсальный порядок всех стадий: Prefix, Postfix и transpiler имеют разные роли, а зависимости между владельцами тоже влияют на цепочку. Противоречивые требования порядка не делают моды совместимыми.

`Patcher.GetOwners(target)` показывает владельцев зарегистрированных патчей. `UnpatchSelf()` и `Dispose()` удаляют патчи данного owner. `Unpatch(target, PatchKind.Postfix)` удаляет его Postfix на одной цели; явный третий параметр задаёт другой owner. `Unpatch(target, callbackMethod)` выбирает конкретный метод callback, поэтому используйте этот overload осознанно, особенно если один callback переиспользуется разными владельцами. Удаление своего owner сохраняет патчи остальных модов.

При ошибке `PatchAll` часть целей могла уже получить патчи. Группа остаётся объектом с определённой областью владения, но установка нескольких целей не обещает общую транзакцию. Освободите группу, если отказываетесь от функции после ошибки. Дальше: [описание патчей атрибутами](attributes.md).
