# Контент, уровни и мир

Модуль Content создаёт настоящие BBCR `ItemObject`, `NPC`, `RoomController`, `LevelAsset`, `SceneObject` и другие определения. Подключите `baldic-api-bbcr-content` или агрегат и соответствующие сборки [SDK](setup.md). Создание выполняется в основном потоке Unity под `ModContext`; готовый definition ещё не является экземпляром в уровне.

## Определение → регистрация → размещение

`Builders` самостоятельно создаёт и регистрирует объект в Core `Content`. `Builders.Item("drink", ...)` под модом `field-kit` регистрирует `field-kit:drink`; второй `Content.Register` с тем же ID вызовет ошибку дубликата. Все фабрики помечают мод как контентный и владеют созданными объектами. Переданные vanilla-иконки, материалы, клипы и исходные шаблоны остаются заимствованными.

| Фабрика | Что создаёт | Что нужно предоставить |
|---|---|---|
| `Builders.Item<T>` | `ItemObject` и неактивный prefab `T : Item` | Ключи имени/описания, маленькую/большую Sprite, при необходимости configure/cost/price |
| `Builders.Npc<T>` | Клон рабочего NPC с поведением `T : NPC` | Рабочий NPC-шаблон с Navigator; опционально configure и poster |
| `Builders.Room` | Комнатный шаблон без скопированных scene-тайлов | Исходную комнату, category либо новую category, настройки материалов |
| `Builders.RoomBuilder<T>` | Неактивный `T : RoomBuilder` | Реализацию нативного `Build`/настроек |
| `Builders.Level` | `LevelObject`, пустой либо клонированный | Шаблон/настройку нативных пулов |
| `Builders.LevelAsset` | Копию premade level data | `LevelAsset` либо `LevelDataContainer` |
| `Builders.Scene` | Клон SceneObject либо новый SceneObject | Исходную сцену; либо manager prefab, LevelAsset, title и number |
| `Builders.Poster` | `PosterObject` | Texture2D и необязательные `PosterTextData[]` |
| `Builders.Sound` | `SoundObject` | AudioClip; subtitleKey/type/volume по необходимости |
| `Builders.RandomEvent<T>` | Неактивный `T : RandomEvent` | Ключ описания, длительность, intro/configure по необходимости |

NPC builder сохраняет базовые поля `NPC`, навигацию, collider, спрайты и аудио рабочего шаблона; переназначает ссылки Navigator и Looker на новый компонент. Это не перенос всех приватных полей производного vanilla-класса. Если логика нового NPC полагается на специальные ссылки, установите их в `configure` и проверьте после спавна.

## Урок: собственный предмет и pickup

Полный `Mod.cs` ниже не требует внешних картинок: он заимствует две иконки уже загруженного предмета. Создайте проект из [первого урока](setup.md), замените его код этим блоком; агрегат в manifest уже включает Content и Assets. Укажите `id` мода `field-kit`, чтобы имена ресурсов соответствовали примеру. Это самостоятельный пример, его не нужно добавлять поверх первого класса.

```csharp
using System.Collections.Generic;
using System.Linq;
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;
using UnityEngine;

public sealed class RestDrink : Item
{
    public override bool Use(PlayerManager player)
    {
        player.plm.AddStamina(25f, true);
        Destroy(gameObject);
        return true;
    }
}

[BaldicMod]
public sealed class FieldKitContent
{
    private ItemObject drink;

    public void Init(ModContext context)
    {
        Localization.RegisterProvider(language => new Dictionary<string, string>
        {
            ["FIELDKIT_Drink_Name"] = "Напиток отдыха",
            ["FIELDKIT_Drink_Description"] = "Восстанавливает немного выносливости."
        });

        Loading.Register(context.Id, () =>
        {
            var source = Assets.All<ItemObject>().First(value =>
                value.itemSpriteSmall != null && value.itemSpriteLarge != null);
            drink = Builders.Item<RestDrink>("drink",
                "FIELDKIT_Drink_Name", "FIELDKIT_Drink_Description",
                source.itemSpriteSmall, source.itemSpriteLarge,
                cost: 10, price: 20);
        }, LoadingStage.Start);

        EventBus.On(GameEvents.LevelInitialized, e =>
        {
            var manager = e.Instance as BaseGameManager;
            var player = Game.Player();
            if (drink == null || manager == null || player == null) return;
            var tile = World.Tile(manager.Ec, player.transform.position);
            if (tile == null) return;
            World.SpawnItem(manager.Ec, tile.room, drink,
                tile.transform.position + Vector3.up * 5f);
        });
    }
}
```

`Item.Use(PlayerManager)` возвращает `bool` по нативному контракту. В этом примере использование применяет эффект, уничтожает созданный для использования GameObject и возвращает `true`; настройка полей `ItemObject` сама по себе не реализовала бы действие предмета. `AddStamina(..., true)` использует ограничение нативного максимума.

`World.SpawnItem` создаёт pickup и включает его в `environment.items`. Это не прямое добавление предмета в инвентарь: игрок должен подобрать pickup. Для прямого выдавания используйте нативный `player.itm.AddItem` с учётом заполненности, либо `SetItem` с осознанным выбором слота. Не обходите нативные границы массива и выбранный `selectedItem`.

Проверка урока: Start завершается без ошибки, после начала обычного уровня рядом с игроком виден pickup, название/описание локализованы, использование восстанавливает stamina и расходует предмет. Один удачный compile не проверяет размеры иконок, позицию pickup и реальные правила inventory.

## Границы загрузки уровня

`Generation.OnBegin(Action<GenerationContext>, priority=0)` вызывается из prefix нативного `LevelBuilder.StartGenerate`, до начала загрузки. `OnComplete` вызывается после фактического завершения coroutine `LevelLoader.Load`, только если `levelCreated=true`, и раньше инициализации менеджера. Обе подписки возвращают owned `IDisposable`.

`GenerationContext` содержит `Builder`, `Environment`, `Seed` и `System.Random Random`: используется `builder.controlledRNG`, а при его отсутствии создаётся RNG из seed сессии. Для воспроизводимой собственной выборки передавайте этот RNG в `Generation.Select<T>(IEnumerable<WeightedSelection<T>>, random)`. Выбор требует непустой последовательности с неотрицательными весами и суммой в пределах положительного Int32.

В `OnComplete` удобно размещать геометрию; не рассчитывайте на готовые HUD и игроков. В `LevelInitialized` уже уместны операции с инициализированным менеджером и доступным игроком, но всё равно проверяйте `null`: специальные/custom менеджеры могут отличаться.

## Пулы и premade data

`Generation.AddItem`, `AddNpc`, `AddPoster`, `AddEvent`, `AddRoomBuilder` добавляют элемент в соответствующий **нативный пул LevelObject** и возвращают lease, удаляющий именно эту вставку. Вес должен быть положительным. RoomBuilder-пулы поддерживают `Class`, `Faculty`, `Office`; другие категории этим методом отвергаются. Для premade custom room используйте данные `LevelAsset.rooms`.

Добавление в пул не гарантирует появление элемента: конкретный нативный builder должен этот пул читать. Особенно важно это в BBCR: `LevelGenerator.Generate` сообщает, что процедурный генератор удалён. Content не восстанавливает генератор BB+ и не обещает его алгоритмы. Для надёжного собственного уровня используйте premade `LevelAsset`, native builders и/или прямое размещение `World`.

`Generation.AddRoom(LevelAsset, RoomData)` возвращает индекс комнаты; очистка удаляет комнату и исправляет затронутые индексы тайлов, дверей и basic button receivers. `Generation.SetTile(LevelAsset, IntVector2, int bin, int roomId)` редактирует данные до загрузки: проверяет координаты в `levelSize`, bin в диапазоне 0..16 и существующий roomId. При очистке восстанавливает прежнее значение, если собственная замена ещё присутствует. Это не тот же метод, что изменение уже созданных scene-тайлов.

Для пользовательской сцены порядок такой:

1. После прогрева найдите нужный native `SceneObject` и рабочий manager prefab.
2. Склонируйте исходные premade data через подходящий overload `Builders.LevelAsset`; изменяйте свою копию.
3. Создайте SceneObject через `Builders.Scene(id, manager, level, title, number)` либо клонируйте сцену и настройте её действительные нативные ссылки. Клон сохраняет заимствованные ссылки: объект SceneObject сам по себе не является глубокой копией всех prefab и ассетов сцены.
4. На главном меню после `Loading.Done` вызовите `Game.Load` для созданной сцены. Если нужно открыть обычный стиль с нативными прогрессом/Free-настройками, используйте `Game.Start`, а не ручную подмену scene-полей.

## Уже созданный мир

Все координаты сетки — `IntVector2(x,z)`. В overload `World.Tile(environment, Vector3)` координаты получаются через `FloorToInt(x/10f)` и `FloorToInt(z/10f)`. `Tile` возвращает `null` без environment, без сетки, за её границами или на пустой позиции. Остальные операции не являются null-safe фасадом: передайте существующий environment/room/tile согласно их контракту.

| Группа | Методы | Существенное условие |
|---|---|---|
| Чтение | `Tile`, `Rooms`, `Tiles`, `TryPath`, `Distance` | `TryPath` возвращает bool и out-список; выбирайте реальный `PathType` |
| Новая геометрия | `CreateRoom`, `CreateTile` | Комната требует рабочих материалов; tile — свободных координат внутри текущей сетки |
| Изменение стен | `SwapTile`, `Connect`, `Close` | `Connect` требует тайлы по обе стороны; bin зависит от prefab-массива environment |
| Удаление | `DestroyTile` | Произвольное удаление исходной геометрии автоматически не восстанавливается |
| Предметы/NPC | `SpawnItem`, `SpawnNpc` | NPC требует существующего tile; предмет — корректных room/position |
| Двери | `CreateDoor` | Два соседних тайла и рабочий Door prefab |
| Окна | `CreateWindow` | Рабочий WindowObject; результат может быть `null`, если native build не создал окно |
| Постеры/свет | `Poster`, `Light`, `SetLight`, `SetAllLights` | Существующий тайл; корректное направление стены/настройка света |
| Атмосфера | `Fog`, `TimeScale` | Возвращают lease; удаление не забирает ранее добавленный чужой объект |
| Звук мира | `Noise`, `Silence` | Нативные noise priority/value и длительность |
| Навигация | `RefreshNavigation(environment, rebuildMesh=false)` | Для изменения геометрии при необходимости передать `true` |
| События | `ScheduleEvent` | Рабочий RandomEvent prefab, RNG и неотрицательный delay |

`World.CreateRoom` не расширяет размеры environment. Найдите свободные позиции внутри текущей сетки и создавайте room из очищенного `Builders.Room`-шаблона. После создания тайлов и соединений вызывайте `RefreshNavigation(environment, true)`, если новая геометрия требует перестройки mesh. Нельзя считать успешное создание GameObject достаточным для работающего прохода NPC.

## Очистка и её пределы

Новые объекты и добавленные native-list entries принадлежат моду. Для `SwapTile`, `Connect`, `Close` сохраняются предыдущие wall bins: восстановление делается, если на месте всё ещё bin, установленный этой операцией. Уничтоженный vanilla-тайл, произвольное изменение общего материала или полей чужого объекта требуют собственного восстановления либо перезагрузки уровня. Не обещайте полную обратимость любого edit только потому, что helper использует `ModContext`.

`World.Light` сохраняет прежние параметры источника и восстанавливает их при cleanup. `SetLight` и `SetAllLights` — прямые переключатели, без собственного возвращаемого lease. `World.Poster` вызывает нативный build; не считайте его универсальной транзакционной заменой уже существующего изображения на стене.

`ScheduleEvent` клонирует prefab, выполняет native Initialize/SetEventTime/PremadeSetup, запускает нативный таймер и отслеживает его. На cleanup отменяются таймеры, удаляются соответствующие entries, а активное событие получает `End`. Собственный override `End` должен действительно снимать собственные эффекты; API не умеет вывести их из произвольного C#-кода. При ручном `End` не добавляйте второй таймер тому же экземпляру.

Далее: [настройки и нативное меню](ui.md). Полный перечень overload: [Content](../reference/bbcr/content.md).
