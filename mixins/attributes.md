# Два семейства атрибутов

В Baldic есть два разных способа декларативно описать перехват. `[Patch]` вместе с `[Prefix]`, `[Postfix]` и другими аннотациями принадлежит низкоуровневому `Baldic.Mixins`: классы нужно установить через `Patcher.PatchAll` либо `Mixin.PatchSet.PatchAll`. `[Inject]`, `[Replace]`, `[ModifyArg]`, `[ModifyReturn]` и `[Redirect]` находятся в `Baldic` и регистрируют динамические hooks при активации пакета. Их обработчики имеют другие сигнатуры.

## Типизированные аннотации

Этот самостоятельный пример использует только `0Harmony.dll`. Атрибут на классе указывает точную перегрузку, атрибут на методе — стадию. Применение атрибута само по себе ещё не устанавливает патч.

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.Annotations
{
    public static class Score
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Calculate(int count) => count * 2;
    }

    [Patch(typeof(Score), nameof(Score.Calculate), typeof(int))]
    public static class ScorePatch
    {
        [Postfix]
        [Priority(PatchPriority.High)]
        private static void After(ref int __result) => __result += 5;
    }

    public static class AnnotationDemo
    {
        public static void Run()
        {
            using (var patches = new Patcher("book.annotations"))
            {
                patches.PatchAll(typeof(ScorePatch));
                if (Score.Calculate(3) != 11)
                    throw new InvalidOperationException("Annotation was not applied");
            }
        }
    }
}
```

`PatchAll(Type)` применяет один выбранный тип; overload `Patcher.PatchAll(Assembly)` сканирует сборку. `PatchAllAttribute` — отдельная аннотация для всех объявленных методов целевого типа. Не путайте её с обычным вызовом `PatchAll`: широкий выбор целей редко нужен для узкой функции мода.

Для статических callbacks предусмотрены `[Prefix]`, `[Postfix]`, `[Transpiler]`, `[Finalizer]`, `[ILManipulator]`. Последний работает с MonoMod IL manipulator и требует соответствующей модели IL; он не является другим именем для `IEnumerable<CodeInstruction>`.

`[Priority]`, `[Before]` и `[After]` можно поставить на класс или callback. Они описывают порядок в общем движке; имена в `[Before("other.owner")]` и `[After("other.owner")]` — ID владельцев патчей. Точную область очистки задаёт `Patcher` или группа, которая выполняет установку.

## Выбор цели во время установки

Если тип находится только во время выполнения, используйте пустой `[Patch]` с `[TargetMethod]`. Следующий пример — отдельная единица; он ожидает загруженный тип игры `Example.Counter` с методом `Read(int)` и намеренно прекращает установку, если такого метода нет.

```csharp
using System;
using System.Reflection;
using Baldic.Mixins;

namespace Book.RuntimeTarget
{
    [Patch]
    public static class CounterPatch
    {
        [TargetMethod]
        private static MethodBase Resolve()
        {
            var type = AccessTools.TypeByName("Example.Counter");
            if (type == null) throw new TypeLoadException("Example.Counter");
            return AccessTools.Method(type, "Read", new[] { typeof(int) })
                ?? throw new MissingMethodException(type.FullName, "Read(int)");
        }

        [Postfix]
        private static void After(ref int __result) => __result += 1;
    }
}
```

`[TargetMethods]` позволяет вернуть `IEnumerable<MethodBase>` для нескольких целей. Их callbacks должны быть совместимы с каждой выбранной сигнатурой. `[Prepare]` управляет применением класса, `[Cleanup]` обрабатывает завершение его установки. Это служебные стадии обработки аннотированного класса; `[Cleanup]` не заменяет `Dispose` владельца при выгрузке мода. Для простого выбора перегрузки предпочитайте `[Patch(typeof(Target), "Read", typeof(int))]` вместо собственного поиска.

## Reverse patch

Reverse patch копирует тело исходного метода в подготовленный метод-заглушку. Это средство полезно, когда требуется отдельный типизированный вызов реализации, а обычный вызов цели снова вошёл бы в установленную цепочку. Это не динамический `HookContext.CallOriginal`.

Самостоятельный пример ниже копирует статическую реализацию в статическую заглушку с той же сигнатурой:

```csharp
using System;
using System.Runtime.CompilerServices;
using Baldic.Mixins;

namespace Book.ReversePatches
{
    public static class Source
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Read(int value) => value + 7;
    }

    public static class ReverseDemo
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int OriginalRead(int value)
        {
            throw new NotSupportedException("Reverse patch is not installed");
        }

        public static void Run()
        {
            using (var patches = new Patcher("book.reverse"))
            {
                patches.ReversePatch(
                    AccessTools.Method(typeof(Source), nameof(Source.Read)),
                    AccessTools.Method(typeof(ReverseDemo), nameof(OriginalRead)));
                if (OriginalRead(2) != 9)
                    throw new InvalidOperationException("Reverse patch failed");
            }
        }
    }
}
```

`snapshot: false` выбирает исходное тело. `snapshot: true` использует снимок с transpiler-преобразованиями, доступными в момент создания reverse patch; не трактуйте его как живую ссылку на последующие изменения цепочки или как запуск всех Prefix/Postfix. Декларативный вариант использует `[ReversePatch]` либо `[ReversePatch(true)]` вместе с описанием цели `[Patch]`. Для метода экземпляра сигнатура заглушки должна учитывать получателя как первый параметр.

У текущего backend есть ограничение snapshot-пути: он ожидает существующую запись патчей для исходного метода. На полностью непатченной цели запрос snapshot может завершиться ошибкой из-за отсутствующей записи. Если нужен исходный код без преобразований, оставляйте `snapshot: false`; не используйте snapshot как универсальный способ копирования любой цели.

Есть и отдельная граница legacy interop: автоматический поиск локальной transpiler-функции внутри reverse-заглушки распознаёт возвращаемый тип `IEnumerable<HarmonyLib.CodeInstruction>`. Локальная функция с собственным `IEnumerable<Baldic.Mixins.CodeInstruction>` этим механизмом сейчас автоматически не обнаруживается. Это ограничение именно поиска дополнительного reverse-transpiler; обычные собственные transpilers, установленные через `Patch`, используют `Baldic.Mixins.CodeInstruction`.

Не используйте reverse patch как контракт временного `using`: не обещайте восстановление исходного тела заглушки через обычный `UnpatchSelf`. Это отдельное копирование реализации, а не обычный callback в цепочке цели. Устанавливайте его один раз до первого вызова заглушки.

## Динамические аннотации и When

Динамические аннотации обслуживает `AttributeBindings`. Пакет может содержать только класс hooks без entrypoint: укажите `"mixins": ["Hooks.dll:Example.Hooks"]` в манифесте. Загрузчик свяжет конфигурационные поля типа и зарегистрирует его статические callbacks. Сборки, объявленные через entrypoints, также проходят привязку атрибутов; повторная декларация уже обработанного типа не нужна.

Подробный пример с `When` находится в [динамических hooks](dynamic-hooks.md). Здесь важно различие: `[Inject]` принимает `void Callback(HookContext)`, `[Replace]`/`[Redirect]` — `object Callback(HookContext)`, а `[ModifyArg]`/`[ModifyReturn]` — `object Callback(object)`. Типизированные `ref int __result` относятся к `[Postfix]`, а не к `[ModifyReturn]`.

`When = "General.Enabled"` ищет булеву конфигурационную запись; `When = "!General.Enabled"` инвертирует её. Проверка выполняется при вызове, поэтому изменение записи не требует переустановки патча. Ссылка на неизвестную или небулеву запись вызывает ошибку регистрации. Сначала объявите настройку и проверьте её имя в [главе о конфигурации](../loader/configuration.md).
