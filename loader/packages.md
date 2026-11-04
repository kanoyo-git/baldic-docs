# Пакеты и манифест

Пакет — единица зависимостей, стадий, конфигурации и владения. Его корень содержит `baldic.mod.json`. Вложенные ресурсы и приватные библиотеки разрешены, но объявления в манифесте должны указывать на действительные файлы.

```text
my-mod/
  baldic.mod.json
  MyMod.dll
  assets/
    icon.png
```

`.baldic` — ZIP с таким же корнем. Не добавляйте лишний внешний каталог `my-mod/` внутри архива.

## Рабочий манифест

```json
{
  "schemaVersion": 1,
  "id": "my-mod",
  "version": "1.0.0",
  "name": "My Mod",
  "authors": ["Author"],
  "description": "Мой первый мод",
  "license": "MIT",
  "depends": { "baldic": ">=1.0.0" },
  "entrypoints": {
    "preLaunch": ["MyMod.dll:Example.Mod"],
    "init": ["MyMod.dll:Example.Mod"],
    "postInit": ["MyMod.dll:Example.Mod"]
  }
}
```

ID соответствует `[a-z][a-z0-9_.-]{0,127}`. Версии и диапазоны — semantic versions. ID принадлежит пакету, plugin GUID принадлежит обычному плагину: не занимайте уже существующие игровые/API/plugin IDs.

`DLL:Namespace.Type` выбирает один тип с `[BaldicMod]`. Запись `MyMod.dll` выбирает все отмеченные типы этой сборки. У типа должна быть пригодная для создания экземпляра форма; абстрактные и открытые generic entrypoints не подходят. Один экземпляр типа сохраняется между его объявленными стадиями.

Методы стадий принимают либо ничего, либо ровно `ModContext`, возвращают `void` и именуются `PreLaunch`, `Init`, `PostInit`, `AssetsStart`, `AssetsPre`, `AssetsPost`, `AssetsFinal`, `Test`. Coroutine работы регистрируются через игровой loading API; возвращать `IEnumerator` из `Init` нельзя.

## Добавление игрового API

Для BB+ добавьте `"bbplus": "0.14.5"` и `"baldic-api": "^0.0.1"` либо точные используемые модули. Для BBCR — `"bbcr": "1.1.0"` и `"baldic-api-bbcr": "^0.0.1"`.

Ссылка на DLL при компиляции не заменяет зависимость в манифесте. Зависимость не является гарантией, что игровая сцена или ассеты уже готовы: это решается [стадиями](lifecycle.md).

## Схема настроек

```json
{
  "schemaVersion": 1,
  "id": "settings-example",
  "version": "1.0.0",
  "depends": { "baldic": ">=1.0.0" },
  "config": {
    "General": {
      "enabled": { "type": "bool", "default": true },
      "amount": { "type": "int", "default": 3, "min": 1, "max": 10 },
      "mode": { "type": "string", "default": "normal", "choices": ["normal", "fast"] }
    }
  }
}
```

Схема поддерживает `bool/int/float/string`. Числовые границы и строковые choices проверяются; default должен входить в диапазон или набор. `KeyboardShortcut` задаётся через типизированный C# Bind, а не выдуманный тип JSON-схемы.

## Проверка и ограничения

Не включайте в мод `Baldic.Loader.dll`, `BepInEx.dll`, `0Harmony.dll`, API DLL, Unity DLL или `Assembly-CSharp.dll`. Ссылки на них собираются с `Private=false`. Не помещайте тестовые плагины в обычную поставку.

Для переносимости используйте относительные пути с `/`. Абсолютные пути, `..`, symlinks, конфликтующие ZIP paths и чрезмерная распаковка отклоняются. Это относится и к декларациям access wideners, transformers и nested dependencies.

[Полный разбор полей](../appendix/manifest.md) · [Зависимости и game variants](dependencies.md) · [Команды](../appendix/cli.md).
