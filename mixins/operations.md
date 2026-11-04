# Типизированные компонуемые операции

Обычный Postfix меняет результат целого метода. Если внутри метода нужно обернуть один вызов, изменить значение чтения поля или конкретную константу, используйте operation helpers. Они принадлежат загрузчику, доступны в обеих играх без optional API и проверяют выбранные IL-инструкции при установке. В отличие от динамических hooks, callbacks типизированы и вызываются напрямую.

## Обёртка вызова

`WrapOperation` заменяет выбранную операцию цепочкой статических обёрток. Последний аргумент обёртки — delegate продолжения с точной сигнатурой операции. Самостоятельный пример требует `Baldic.Loader.dll` и `0Harmony.dll`. В нём `Caller(3)` обычно возвращает `7`. Обёртка передаёт операции `5`, получает `10` и утраивает его; caller прибавляет `1`, результат — `31`.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.Operations
{
    public static class Targets
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Calculate(int amount) => amount * 2;

        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Caller(int amount) => Calculate(amount) + 1;
    }

    public static class OperationDemo
    {
        private static int Adjust(int amount, Func<int, int> next)
        {
            return next(amount + 2) * 3;
        }

        public static void Run()
        {
            using (var hook = Mixin.WrapOperation(
                AccessTools.Method(typeof(Targets), nameof(Targets.Caller)),
                AccessTools.Method(typeof(Targets), nameof(Targets.Calculate)),
                AccessTools.Method(typeof(OperationDemo), nameof(Adjust)),
                expectedMatches: 1))
            {
                if (Targets.Caller(3) != 31)
                    throw new InvalidOperationException("Operation wrapper failed");
            }
            if (Targets.Caller(3) != 7)
                throw new InvalidOperationException("Cleanup failed");
        }
    }
}
```

Обёртка может изменить операнды, вызвать `next` несколько раз или вернуть свой результат без продолжения. Повторный вызов продолжения повторяет и побочные эффекты операции. Для операции экземпляра первым операндом служит receiver, затем идут объявленные параметры. Для receiver-структуры используйте `ref T`. Для `ref`/`out` и необычных сигнатур объявите собственный delegate, а не пытайтесь представить их через `Func`.

Продолжение сохраняет исходную семантику `call`/`callvirt`, включая виртуальную диспетчеризацию и проверку null при его исполнении. Обёртка, которая пропускает `next`, может намеренно обойти и сам вызов, и его проверку null. Delegate продолжения действителен только во время работы обёртки; не сохраняйте его для отложенного вызова или использования после снятия регистрации.

Обёртки с большим `priority` находятся снаружи цепочки. При равном приоритете первая зарегистрированная находится снаружи. Таким образом, обёртка A может получить результат обёртки B, а не непосредственно исходного метода. Снятие одной регистрации перестраивает цепочку оставшихся обёрток.

## Изменение значения выражения

`ModifyExpressionValue(caller, expression, modifier)` применяет статический `T Modify(T value)` после выражения. Поддерживаются возвращающий значение метод, чтение поля и instance-конструктор с `newobj`. Это не изменение записи в поле и не изменение аргументов операции. Если тот же call site обёрнут через `WrapOperation`, модификатор получает результат всей цепочки обёрток.

Следующая самостоятельная единица использует результат отдельного вызова, затем константу. Каждая регистрация намеренно проверяется отдельно: первый блок превращает `5 + 3` в `10 + 3`, второй — в `5 + 6`.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.ValueOperations
{
    public static class Values
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Read() => 5;

        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Caller() => Read() + 3;
    }

    public static class ValueDemo
    {
        private static int Double(int value) => value * 2;

        public static void Run()
        {
            var caller = AccessTools.Method(typeof(Values), nameof(Values.Caller));
            var modifier = AccessTools.Method(typeof(ValueDemo), nameof(Double));
            using (var hook = Mixin.ModifyExpressionValue(caller,
                AccessTools.Method(typeof(Values), nameof(Values.Read)), modifier))
            {
                if (Values.Caller() != 13)
                    throw new InvalidOperationException("Expression modifier failed");
            }
            using (var hook = Mixin.ModifyConstant(caller, 3, modifier))
            {
                if (Values.Caller() != 11)
                    throw new InvalidOperationException("Constant modifier failed");
            }
        }
    }
}
```

Модификаторы одного значения выполняются по убыванию приоритета, затем по порядку регистрации. Их точные типы аргумента и результата должны совпадать с типом значения; автоматическое числовое преобразование здесь не заменяет правильную сигнатуру.

`ModifyConstant<T>` выбирает literal-инструкции IL: 32-битные целые представления, 64-битные целые, `float`, `double`, строки и null-ссылки. Для null укажите ссылочный тип явно, например `ModifyConstant<string>(caller, null, modifier)`. Булево `true` и целое `1` могут иметь одну IL-инструкцию и не различаются одним поиском литерала. Компилятор может представить небольшой `long` загрузкой `int` с последующей конверсией: ищите реально испущенный тип IL. `decimal` и произвольные структуры не являются поддерживаемыми литералами.

## Локальные переменные

`ModifyLocal` принимает нулевой индекс local slot в `MethodBody.LocalVariables` и `Mixin.LocalAccess.Load` либо `Store`. Load меняет загруженную копию значения; Store меняет значение непосредственно перед записью. `ldloca`, то есть загрузка адреса, не считается обычным чтением.

Этот helper — не обращение к локальной переменной по её C#-имени. Индексы и количество загрузок меняются при обновлении компилятора и настройках оптимизации. Сначала исследуйте IL конкретной сборки; затем укажите ожидаемое число совпадений. Пример ниже — фрагмент метода установки, а не универсальная цель: `caller` должен быть проверенным `MethodBase` с local slot 2 типа `float`, `modifier` — `MethodInfo` статического `float Scale(float)`, и тело должно содержать ровно три обычных загрузки этого slot.

```csharp
var hook = Mixin.ModifyLocal(caller, 2, Mixin.LocalAccess.Load,
    modifier, ordinal: 0, expectedMatches: 3);
```

Здесь изменяется только первая из трёх загрузок. Если такой структуры тела больше нет, установка должна завершиться ошибкой, чтобы мод не менял случайную локальную переменную.

## Выбор вхождения и проверка обновлений

Все четыре helper принимают `ordinal`, `expectedMatches`, `priority` и `owner`. `expectedMatches` — точное положительное число совпадающих инструкций **до** выбора одного вхождения. `ordinal` — нулевой индекс выбранного совпадения, `-1` означает все. Чтобы изменить второй из трёх одинаковых вызовов, задайте `ordinal: 1, expectedMatches: 3`. Значение по умолчанию `expectedMatches: 1` специально отвергает исчезнувшие и внезапно продублированные места.

Число проверяется по входящему телу transpiler-цепочки, до применения этих operation registrations, а не по исходному C# и не по результату уже испущенных обёрток. Чужой transpiler, включая Redirect той же операции, может удалить выбранную инструкцию и вызвать явный конфликт. При отклонённом добавлении восстанавливается ранее установленная цепочка; сообщение включает owner, caller, ожидаемое и найденное количество.

Возвращаемая регистрация принадлежит текущему `ModContext`; её можно снять раньше через `Dispose`. `owner` помогает идентифицировать регистрацию, но не задаёт отдельную пользовательскую Harmony-цепочку для каждой операции. Wrappers и continuation delegates создаются и кэшируются при установке/перестроении. На вызове нет `HookContext`, массива упакованных аргументов, reflection invocation и отдельной аллокации continuation.

## Границы

Caller должен иметь закрытое управляемое тело. Operation wrappers не поддерживают открытые generic-операции, varargs, pointer/by-reference результат и prefixed calls вроде `constrained.`. `ref`/`out` операнды поддерживаются при точном delegate-контракте. Не объявляйте все подобные сигнатуры невозможными только потому, что динамический Redirect их не поддерживает.

Wrapper-only цепочка сохраняет исходный `tail.`. Добавление модификатора результата требует работы после вызова, поэтому удаляет `tail.` для изменённого выражения. Это изменение IL-семантики следует учитывать, когда код специально зависит от хвостового вызова. Для случаев вне контракта helpers используйте [собственный transpiler](transpilers.md) и проверяйте его на конкретной сборке игры.
