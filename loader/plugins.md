# Обычные плагины

Плагин получает Unity callbacks и загружается из `BepInEx/plugins`. Пакетный манифест для него не нужен. Старые BepInEx плагины остаются совместимыми; для новых используйте собственный фасад Loader.

```csharp
using Baldic.Loader;

[Plugin("example.hello", "Hello Plugin", "1.0.0")]
public sealed class HelloPlugin : BasePlugin
{
    void Awake()
    {
        bool enabled = Config.Bind("General", "Enabled", true).Value;
        Logger.LogInfo(Info.Id + ": enabled=" + enabled);
    }
}
```

Этот DLL компилируется для `net472` со ссылками на совместимую `BepInEx.dll` и Unity DLL своей игры. Если используете `Patcher`, добавьте `0Harmony.dll`. Все shared references — `Private=false`. Размещайте только собственный DLL и его приватные зависимости.

## Метаданные и зависимости

`[Dependency(id, DependencyKind.Hard)]`, soft-вариант и перегрузка с минимальной версией задают связи обычных плагинов. `[Incompatibility]` запрещает совместную загрузку; `[Process]` ограничивает имя процесса. Это правила chainloader, они не заменяются package `depends`.

`Info` содержит собственные `Id/Name/Version/Location/Instance/Config/Dependencies`. `Plugins.All` и `Plugins.Find(id)` читают канонический реестр. `Plugins.FromInstance(component)` получает сведения по самому компоненту и работает в `Awake`.

Unity вызывает Awake внутри AddComponent раньше, чем chainloader присвоит поле `PluginInfo.Instance`. Поэтому при собственном создании плагина нельзя требовать, чтобы поиск по глобальному Instance уже сработал. Для участия в стадиях используйте штатный путь ниже.

## Подключение к стадиям Baldic

```csharp
using Baldic;
using Baldic.Loader;

[Plugin("example.staged", "Staged Plugin", "1.0.0")]
public sealed class StagedPlugin : BasePlugin
{
    void Awake()
    {
        Mods.Register(this, this);
    }

    public void Init(ModContext context)
    {
        Log.Info(context.Id, "Плагин участвует в стадиях Baldic");
    }
}
```

Нужна дополнительная ссылка на `Baldic.Loader.dll`. `Mods.Register` принимает Unity `MonoBehaviour`, находит реальную plugin metadata/config и возвращает контекст. Повторная регистрация той же пары идемпотентна. Другой entrypoint для того же плагина или новый участник после закрытия barrier вызывают ошибку.

Регистрация добавляет плагин в общий граф стадий, но не переигрывает уже выполненный Awake. Участник остаётся внешним плагином: переключатель пакетной активации не должен выдавать его за выгружаемый managed package.

Runtime готовится chainloader раньше обычных плагинов. Обязательная зависимость от старого host GUID `baldic.api` больше не нужна. Игровые assets по-прежнему ждут своих стадий.

[Жизненный цикл](lifecycle.md) · [Mixins в плагине](../mixins/typed-patches.md) · [Точные plugin contracts](../reference/loader-facades.md).
