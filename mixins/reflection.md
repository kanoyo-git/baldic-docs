# Закрытые члены, FieldRef и делегаты

Доступ к приватному полю не требует делать всё содержимое класса публичным. Для изменения конкретного поля или вызова конкретного закрытого метода можно использовать `AccessTools` из `Baldic.Mixins`. Отдельный [access widener](../loader/early-pipeline.md) нужен, когда доступность требуется изменить в метаданных до загрузки, например для компиляции прямого обращения или наследования.

## Поиск точной цели

`AccessTools.Method(type, name, parameters, generics)` ищет метод, включая закрытые и унаследованные. `DeclaredMethod` ограничивает поиск выбранным типом. Передавайте массив типов параметров для перегруженного метода; возвращённый `null` обработайте в момент установки функции. Для конструктора есть `Constructor`, для аксессоров — `PropertyGetter` и `PropertySetter`. Патчится именно getter/setter-метод, а не объект `PropertyInfo`.

`Mixin.Method("Example.Counter::Read(int)")` возвращает `MethodInfo`, разрешая тип среди загруженных сборок. `Mixin.Target` дополнительно понимает `.ctor` и `.cctor` и возвращает `MethodBase`. Строковые сигнатуры поддерживают имена типов и распространённые псевдонимы `int`, `float`, `bool`, `string`, `double`; `ref int` и `out int` отмечают by-reference параметр. Если совпадений не ровно одно, регистрация не выбирает случайную перегрузку.

Простой строковый разбор не является полным парсером синтаксиса C#. Для сложной сигнатуры, особенно содержащей generic-типы с запятыми, используйте reflection и точные `Type[]`, а не пытайтесь представить произвольный тип в строковом target.

## Ссылка на настоящее поле

`FieldRef` возвращает ссылку на поле, а не копию его значения. Следующий самостоятельный пример требует `0Harmony.dll` и использует низкоуровневый accessor. Ссылка и делегат создаются один раз, затем переиспользуются.

```csharp
using System;
using Baldic.Mixins;

namespace Book.PrivateAccess
{
    public sealed class Counter
    {
        private int value;
        public Counter(int initial) { value = initial; }
        public int Value => value;
        private int Add(int amount) => value + amount;
    }

    public static class AccessDemo
    {
        private static readonly AccessTools.FieldRef<Counter, int> ValueRef =
            AccessTools.FieldRefAccess<Counter, int>("value");

        private static readonly Func<Counter, int, int> Add =
            AccessTools.MethodDelegate<Func<Counter, int, int>>(
                AccessTools.Method(typeof(Counter), "Add", new[] { typeof(int) }));

        public static void Run()
        {
            var counter = new Counter(3);
            ValueRef(counter) = 20;
            if (counter.Value != 20 || Add(counter, 2) != 22)
                throw new InvalidOperationException("Private access failed");
        }
    }
}
```

В loader API эквивалентный accessor создаётся через `Mixin.FieldRef<Counter, int>("value")`, а делегат — через `Mixin.MethodDelegate<Func<Counter, int, int>>(method)`. `Mixin.FieldRef` требует `T : class` и предназначен для поля экземпляра. Публичный facade не содержит отдельного набора accessor-методов для любых комбинаций static/struct-полей; не переносите все overloads сторонних reflection-библиотек по аналогии.

Тип поля должен соответствовать типу accessor. Отсутствующее поле или несовместимая сигнатура — реальная ошибка установки, которую лучше обнаружить до первого игрового вызова. Переименование приватного поля новой версией игры ломает такой контракт. Публичный API игры, если он существует, обычно устойчивее.

## Открытые и связанные делегаты

В примере `Func<Counter, int, int>` — открытый делегат: экземпляр передаётся первым аргументом при каждом вызове. Если вызвать `AccessTools.MethodDelegate<Func<int, int>>(method, instance: counter)`, получится связанный делегат для конкретного объекта. Для статического метода receiver в сигнатуре не нужен.

`virtualCall: true` по умолчанию сохраняет виртуальную диспетчеризацию; `false` выбирает прямой вызов выбранной реализации. Выбор имеет смысл для виртуальных методов и должен соответствовать задаче, особенно при вызове реализации базового класса. Делегат должен точно описывать аргументы и результат; для `ref`/`out` объявите собственный delegate-тип.

Создавайте accessor и делегат при установке функции или в кэше. Повторный reflection-поиск и создание делегатов внутри `Update` добавляют работу, которой легко избежать. Сам доступ не делает поле безопасным для конкурентного изменения и не отменяет инварианты класса: запись допустимого `int` ещё не гарантирует допустимое состояние объекта.
