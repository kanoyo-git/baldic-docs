# Baldic Loader

Loader — общая основа двух игровых API. Он запускает совместимые плагины и C#-пакеты, разрешает зависимости, готовит ранние преобразования и связывает мод с его конфигом и ресурсами.

## Выберите модель мода

| Ситуация | Начало |
|---|---|
| Самостоятельный пакет со стадиями и ресурсами | `[BaldicMod]` + `baldic.mod.json` в `mods/` |
| Обычный Unity-плагин с `Awake/Update` | `BasePlugin` + `[Plugin]` в `BepInEx/plugins` |
| Только декларативные mixins | Манифест с `mixins`, без entrypoints |
| Изменение формы типа до загрузки игры | Отдельный pure transformer + `prepare-sdk` |

Пакеты и обычные плагины сосуществуют. Их конфиги и patch owners опираются на канонические объекты BepInEx/HarmonyX; новая модель не создаёт параллельный реестр плагинов или отдельную копию `.cfg`.

## Что изучить

1. [Пакеты и манифест](packages.md).
2. [Жизненный цикл и владение](lifecycle.md).
3. [Настройки и журнал](configuration.md).
4. [Плагины и участие в стадиях](plugins.md).
5. [Зависимости](dependencies.md), [авторские инструменты](tooling.md), [ранняя загрузка](early-pipeline.md).

[Resource packs](resources.md) и [attachments](attachments.md) доступны через соответствующие игровые модули. В их главах явно указаны зависимости: наличие Loader само по себе не устанавливает эти optional API.

Точные подписи: [фасады Loader](../reference/loader-facades.md), [пакетный runtime](../reference/loader-runtime.md).
