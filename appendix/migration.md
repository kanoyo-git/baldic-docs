# Перенос существующего мода

Начните с того, к какому контракту привязан DLL. Обычный BepInEx-плагин без вызовов Baldic API сохраняет свой бинарник. Старый Baldic consumer с прежними конфигами/patch descriptors пересобирается против нового SDK.

| Было в коде Baldic consumer | Теперь |
|---|---|
| `BepInEx.Configuration.ConfigFile/ConfigEntry<T>` | `Baldic.Loader.Configuration` |
| `BepInEx.Configuration.KeyboardShortcut` | `Baldic.Loader.Configuration.KeyboardShortcut` |
| `BepInEx.PluginInfo.Metadata.GUID` | `Baldic.Loader.PluginInfo.Id` |
| `HarmonyLib.HarmonyMethod` | `Baldic.Mixins.PatchMethod` |
| `HarmonyLib.CodeInstruction` | `Baldic.Mixins.CodeInstruction` |
| `HarmonyLib.AccessTools` | `Baldic.Mixins.AccessTools` |
| `HarmonyLib.HarmonyPatch/HarmonyPrefix/...` | `[Patch]/[Prefix]/...` |
| `Harmony` с patch owner | `Patcher`, либо context-owned `Mixin.CreatePatches` |
| поля `priority/before/after` descriptor | свойства `Priority/Before/After` |
| `HarmonyPatchType`/`Priority` | `PatchKind`/`PatchPriority` |

Имена reference DLL остаются `BepInEx.dll` и `0Harmony.dll`. Их не нужно переименовывать или класть в пакет. Получите их из одной поставки Loader.

## Последовательность переноса

1. Обновите shared compile references и `TargetFramework=net472`.
2. Замените типы публичных конфигов, patch descriptors, transpiler inputs/outputs и field delegates.
3. Пересоберите все свои DLL, которые обмениваются этими типами. Замена только верхнего entrypoint оставляет старые MethodRefs в зависимостях.
4. Сохраните ID модов и section/key настроек, если не планируете отдельную миграцию данных.
5. Для API выберите один game SDK и проверьте manifest dependencies.
6. Уберите старый hard dependency `baldic.api`, если он указывал на прежний host plugin.
7. Выполните `check`, затем тестовый запуск в изолированной установке.

Не делайте механический `using`-alias на старый тип: он меняет написание исходника, но не CLR-сигнатуру DLL. Совместимость общего движка не означает взаимозаменяемость own и legacy `CodeInstruction` в одной сигнатуре.

## Данные и конфиги

Существующие `.cfg` и формат shortcut сохраняются. `Legacy` bridges предназначены для границы с установленной библиотекой, возвращающей настоящий BepInEx объект; второй config store создавать не нужно.

`import-config` — явный перенос поддерживаемых TOML-значений в новый файл, не способ незаметно переписать пользовательский конфиг. `import-resources` копирует ресурсы и отказывает для DLL/EXE/SO/вложенных `.baldic`; исполняемый код переносится отдельно.

Одинаковая исходная логика не гарантирует перенос BB+ → BBCR. Сверьте [различия BBCR](../api-bbcr/porting.md), пересоберите отдельный backend и оставьте только его в игровом архиве.
