# Изменить генерацию этажа

Генераторные настройки — это assets `SceneObject` и `LevelObject`, а не уже построенные комнаты. Изменяйте их во время подготовки API, затем проверяйте **новый** забег. Работа с существующими дверями, светом и pickup относится к [runtime-фасадам](gameplay.md).

Для обычной замены пулов выбирайте `Levels.Change`: меньше деталей и предусмотрен немедленный вызов при поздней регистрации. Для согласования нескольких генераторных модов выбирайте `Worldgen.AddGeneratorChange`: явные стадии, modification marks и контроль замены level objects. Оба пути меняют общие данные на текущую сессию, а не только ближайшую генерацию.

## Упростить F1

Самостоятельный entrypoint через `init`, без дополнительных ресурсов. В manifest достаточно зависимости `baldic-api-registry` с её транзитивными модулями либо агрегатора из [начала работы](setup.md).

```csharp
using Baldic;
using Baldic.Api;
using ContentLevels = Baldic.Api.Lua.Levels;

namespace OrchardFloor
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            ContentLevels.Change((title, number, scene) =>
            {
                if (title != "F1") return;
                ContentLevels.RemoveEvent(scene, "Fog");
                ContentLevels.SetNpcCount(scene, 2);
                ContentLevels.AddItem(scene, "Apple", 70);
                ContentLevels.AddShopItem(scene, "Apple", 50);
                ContentLevels.SetTimeLimit(scene, 900f);
                ContentLevels.SetMapPrice(scene, 50);
            });
            ModdedSaves.AddDummyHandler(owner.Id);
            ModdedHighScores.AddAffectingMod(owner.Id);
        }
    }
}
```

Callback получает title, номер и конкретный `SceneObject`. Не ищите его заново через `Game.Scene`: во время подготовки живого забега ещё нет. Ссылки `scene.randomizedLevelObject` означают несколько вариантов генератора; helpers применяются к набору. `AddNpc`, `AddItem`, `AddShopItem`, `AddEvent` обновляют веса существующего выбора и предотвращают дубли выбранного объекта. `ForceItem` просто добавляет в список: повторный вызов может продублировать принудительный предмет.

Имена стандартного контента разрешаются через `Catalog`; неизвестное имя у helpers бросает исключение. `Levels.Change` перехватывает ошибку callback и записывает её для конкретного этажа, поэтому читайте журнал даже при успешном открытии меню. `Kind(scene)` сообщает класс manager без суффикса, `IsEndless(scene)` проверяет `EndlessGameManager`.

`SetSize` меняет квадратные min/max размеры в ячейках; это не запрос конкретной планировки. `SetEvents` задаёт число событий и при необходимости интервалы; удаление события из пула не отменяет уже идущий экземпляр. `SetNpcCount` управляет случайными NPC сверх forced. Остальные helpers и точные defaults — в [registry](../reference/bbplus/registry.md).

## Стадии изменения генератора

| Стадия | Назначение |
|---|---|
| `Preparation` | выбрать, какие `LevelObject` использует сцена; единственное место замены набора объектов |
| `Base` | сформировать базовые параметры |
| `Override` | заменить конфликтующие настройки |
| `Addend` | дополнить пулы и параметры; здесь работает registry |
| `Finalizer` | окончательно согласовать результат |

На каждой стадии callbacks выполняются в порядке зависимостей модов. На пару `modId + stage` разрешён один callback. Если внутри мода несколько функций, вызовите их из одного делегата. Передавайте отдельное enum-значение, а не комбинацию flags.

Самостоятельный entrypoint через `init`. Он добавляет стандартное яблоко в guaranteed loot поездок и меняет время F2, оставляя отметку об изменении. `GameAssets` уже подготовлен к моменту фактического вызова callbacks.

```csharp
using System;
using Baldic;
using Baldic.Api;

namespace OrchardGenerator
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            bool accepted = Worldgen.AddGeneratorChange(owner.Id, GeneratorStage.Addend,
                (title, number, scene) =>
                {
                    if (title != "F2") return;
                    foreach (ExtendedLevelObject level in scene.ExtendedLevelObjects())
                    {
                        level.timeLimit = 900f;
                        level.SetModData(owner.Id, "relaxed", true);
                        level.MarkModified(owner.Id);
                    }
                });
            if (!accepted) throw new InvalidOperationException("Генератор уже подготовлен");
            Worldgen.AddFieldTripLoot(owner.Id, (trip, loot) =>
            {
                ItemObject apple = Catalog.Item("Apple");
                if (apple != null && !loot.GuaranteedItems.Contains(apple))
                    loot.GuaranteedItems.Add(apple);
            });
            ModdedSaves.AddDummyHandler(owner.Id);
            ModdedHighScores.AddAffectingMod(owner.Id);
        }
    }
}
```

Регистрация должна завершиться в `init`, `Start` или `Pre`. Сразу после `Pre` выставляется `Loading.TooLateForGeneratorFeatures`; последующая регистрация возвращает `false`, а не откладывается на следующий этаж. Callback выполняется при подготовке сцен, а не на каждом новом seed. После `Preparation` менять набор level objects нельзя: проверка в конце стадий бросит исключение.

## Расширенные объекты и данные

После `Start` worldgen конвертирует обычные level objects в `ExtendedLevelObject`, сохраняя поля и оставляя общую ссылку для сцены. `scene.ExtendedLevelObjects()` перечисляет расширенные варианты; `CurrentExtendedLevelObject()` возвращает выбранный вариант по правилам игры. `Clone()` сохраняет поля, `ModData` и marks; это не обещание глубокого клонирования всех вложенных Unity-объектов.

`SetModData(modId, key, value)` хранит дополнительные данные, `MarkModified` записывает владельца и текущую generator stage. Для проверки доступны `Modified`/`ModifiedAt`. Вне выполняемой стадии передайте stage явно, иначе `MarkModified` бросит исключение. При подготовке runtime-параметров `ExtendedGenerationParameters.ModData` получает данные исходного extended object. Это не сериализация на диск; для неё нужны [save handlers](saves.md).

У `ExtendedGenerationParameters` есть `ExtraPotentialItems` и `ExtraForcedItems`. Наличие public списка не является достаточной гарантией применения: текущая подстановка параметров явно добавляет `ExtraForcedItems` в `forcedItems`, а `ExtraPotentialItems` не следует считать автоматически объединяемым пулом. Для предсказуемого добавления обычных предметов используйте `LevelObject.potentialItems` или `Levels.AddItem`.

## Новый endless-вариант

`Levels.AddEndlessMap(name, change, from = null, size = "Medium")` копирует подходящий игровой endless scene и его level objects, добавляет локализационные ключи и entry в overview. `from` — имя исходного scene asset; `null` выбирает первый endless asset. Вызывайте после warmup, до завершения `Pre`, например в `AssetsStart`. В `change` настройте копию через `Levels` helpers, затем API ставит её в очередь generator changes.

Низкоуровневый путь — `Worldgen.AddEndlessLevel(EndlessLevel)` с `ModId`, `TypeKey`, `Type` и списком `Sizes` (`key → SceneObject`). Это даёт полный контроль над меню, но сцены, manager и generator data нужно подготовить самостоятельно. Для новой сцены вызывайте `Worldgen.QueueScene`; это очередь применения изменений, а не загрузка Unity-сцены с диска. Не передавайте в неё неподготовленные обычные level objects после этапа конвертации.

`AddEndlessLevel` и `AddEndlessAction` отмечают мод как влияющий на high scores. Обычные собственные правки баланса следует отдельно зарегистрировать через `ModdedHighScores.AddAffectingMod`.

## Loot поездок и проверка

`AddFieldTripLoot` принимает один callback на mod ID и mutable `PotentialItems`/`GuaranteedItems`. Он применяется к найденным `FieldTripObject` с подходящей hub room function; добавление callback позднее не переигрывает уже обработанный loot. Не переносите сюда BBCR generation hooks: там другой мир и другой backend.

Проверяйте сначала наборы `Levels.Scenes()`/`LevelObjects(scene)` после подготовки, затем новый seed. Отдельно проверьте F1/F2, endless и pitstop, если заявляете их поддержку. Редкое случайное выпадение не доказывает отсутствие предмета в пуле; отсутствие exception тоже не доказывает корректную планировку. [Worldgen reference](../reference/bbplus/worldgen.md) содержит все публичные сигнатуры.
