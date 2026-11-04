# Настройки, клавиши и журнал

Используйте `Baldic.Loader.Configuration`. `ModContext.Config` уже соответствует пакету и сохраняется в `BepInEx/config/<id>.cfg`. Плагин получает собственный Config от `BasePlugin`.

Для первого примера нужны ссылки на `Baldic.Loader.dll`, совместимую SDK `BepInEx.dll` и Unity DLL своей игры: типы `Baldic.Loader.Configuration` предоставляет совместимое ядро, а `KeyCode` — Unity. Все ссылки оставляйте с `Private=false`; минимальный проект первого мода сам их не добавляет.

## Типизированный Bind

```csharp
using Baldic;
using Baldic.Loader.Configuration;
using UnityEngine;

[BaldicMod]
public sealed class SettingsMod
{
    ConfigEntry<int> amount;
    ConfigEntry<KeyboardShortcut> action;

    public void Init(ModContext owner)
    {
        amount = owner.Config.Bind("General", "Amount", 3,
            new ConfigDescription("Количество", new AcceptableValueRange<int>(1, 10)));
        action = owner.Config.Bind("Keys", "Action",
            new KeyboardShortcut(KeyCode.K, KeyCode.LeftControl), "Клавиша действия");
        Log.Info(owner.Id, "Количество: " + amount.Value);
    }
}
```

Один section/key создаёт одну каноническую запись. Bind возвращает существующее значение, если ключ уже был связан с тем же типом `T`; это не команда сбросить default. Несовпадающий тип при повторном `Bind<T>` или `TryGetEntry<T>` вызывает исключение, а не преобразование значения или `false`. `Value` типизирован, `BoxedValue` нужен универсальному UI, `GetSerializedValue/SetSerializedValue` используют тот же сериализатор.

`AcceptableValueRange<T>` ограничивает числовые значения, `AcceptableValueList<T>` — допустимые варианты. Собственный `KeyboardShortcut` хранится как совместимая каноническая shortcut-запись; формат файла и modifiers сохраняются. В новом API допустим и `AcceptableValueList<KeyboardShortcut>`.

## Автоматическая привязка

```csharp
using Baldic;

[BaldicMod]
public sealed class BoundSettings
{
    [Config("General", "Enabled")]
    public bool Enabled = true;

    public void Init(ModContext owner)
    {
        Log.Info(owner.Id, "Включено: " + Enabled);
    }
}
```

Атрибут связывает field/property с записью и обновляет его при изменении. Property должна иметь getter и setter без index parameters. Статические поля связываются на уровне типа, instance-поля — на экземпляре entrypoint. JSON-схема манифеста может дополнить ключи диапазонами и описаниями.

## Наблюдение и сохранение

У entry есть `SettingChanged`, у файла — `SettingChanged` с `ChangedSetting`. Файловый event изолирует исключения подписчиков. Entry-level event следует обычной multicast-семантике; не полагайтесь на изоляцию нескольких его обработчиков.

По умолчанию `SaveOnConfigSet` определяет запись изменений. Для пакетного редактирования временно отключите его, внесите изменения, вызовите `Save`, затем восстановите прежнее значение. `Reload` меняет уже связанные entries и уведомляет подписчиков, поэтому не нужно повторно создавать UI bindings.

Событие выполняется в потоке, где изменилось значение. Оно не переносит работу в Unity thread. Отписку своего обработчика оформляйте через `owner.Own(new Cleanup(...))`.

При одновременных `Bind/TryGetEntry` создание view защищено, а underlying storage остаётся общим. Это не делает произвольный код внутри ваших подписчиков потокобезопасным.

## Опрос клавиши

`KeyboardShortcut.IsDown`, `IsPressed`, `IsUp` учитывают основную клавишу и modifiers. Вызывайте их в подходящей игровой фазе, а не один раз в `Init`. Проверяйте состояние паузы/меню своего мода; отсутствие нажатия не означает ошибку загрузки.

## Логи и пути

Для пакета используйте `Baldic.Log.Info/Warn/Error/Debug(owner.Id, message)`. Контекст добавляет фазу к сообщению. Для обычного плагина есть `Logger.LogInfo/LogWarning/LogError`, для отдельного источника — `Baldic.Loader.Logging.LogSource.Create(name)`.

`Baldic.Loader.Paths` даёт GameRootPath, RootPath, CorePath, ManagedPath, PluginPath, PatcherPath, ConfigPath, CachePath и ExecutablePath. Не зашивайте пути конкретного компьютера.

Совместимые объекты доступны через явно обозначенные `Legacy` bridges. В обычном новом коде они не нужны. Старый plugin Config и новое view отражают одни значения и события.

[Полные конфигурационные подписи](../reference/loader-facades.md) · [Миграция](../appendix/migration.md).
