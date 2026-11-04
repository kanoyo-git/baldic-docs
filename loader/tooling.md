# SDK, сборка, генерация данных и игровые тесты

Инструменты автора отделены от runtime игры. Для них требуются **.NET SDK 10** и **Python 3.11 или новее**. Обычный runtime-мод компилируется как `net472`; generator для datagen — как `net10.0`; ранний transformer — отдельная чистая `net472` DLL. Наличие .NET runtime без SDK не позволяет выполнить `dotnet build`.

Команды ниже запускаются из checkout или извлечённого выпуска с каталогом `tools`. Путь `DOTNET` выбирает .NET host для Python-инструментов; без него сначала проверяется пользовательский `~/.dotnet/dotnet`, затем PATH. Публичный набор команд и точные параметры собраны в [CLI](../appendix/cli.md).

## Окружение автора

Укажите источники только для чтения: исходную установленную игру, полный loader core одного выпуска и каталог MSBuild SDK. Для автора API-мода дополнительно нужен распакованный backend API **вне** runtime `mods`.

```sh
export BALDIC_GAME_DIR="/path/to/Baldi's Basics Plus"
export BALDIC_BBCR_GAME_DIR="/path/to/Baldi's Basics Classic Remastered"
export BALDIC_LOADER_DLL="/path/to/release/payload/BepInEx/core/Baldic.Loader.dll"
export BALDIC_SDK_DIR="/path/to/release/sdk/msbuild"

python3 tools/baldic.py create ./my-mod --id my-mod
python3 tools/baldic.py mod-build ./my-mod
python3 tools/baldic.py mod-package ./my-mod --output ./releases/my-mod-1.0.0.baldic
```

`create` создаёт новый bare loader-проект; существующий каталог не перезаписывается. `--api` выбирает пример с API, `--target-game bbcr` — backend BBCR. Целевая игра без явного флага определяется по декларациям пакета; пакет, называющий обе игры, требует явного выбора. Для универсального контейнера сначала собираются проекты отдельных ветвей, затем пакетуется контейнер.

API references берутся из извлечённого `games/bbplus` через `BALDIC_API_DIR` или `games/bbcr` через `BALDIC_API_BBCR_DIR`. Runtime archive для запусков и подготовки SDK можно указать в `BALDIC_API_ARCHIVE`. Нельзя подменять compile references копией API другого backend и ожидать, что одинаковые пространства имён сделают её бинарно подходящей.

`mod-build` компилирует единственный корневой `.csproj`, переносит собственные runtime DLL в пакет и запускает `check`. `mod-package` проверяет исходный пакет, пишет новый `.baldic` и проверяет результат; существующий output отвергается. Hidden directories и `bin`/`obj`/`build`/`.work`, исходники `.cs`/`.csproj` и `.pdb` в обычный мод-архив не включаются. Это не разрешение складывать игровые DLL в произвольную видимую папку: проверка shared identities и содержимого остаётся обязательной.

## MSBuild

Минимальный runtime-проект использует props/targets SDK. Для BBCR замените `bbplus` на `bbcr`:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <BaldicTargetGame>bbplus</BaldicTargetGame>
  </PropertyGroup>
  <Import Project="$(BALDIC_SDK_DIR)/Baldic.Mod.props" />
  <Import Project="$(BALDIC_SDK_DIR)/Baldic.Mod.targets" />
</Project>
```

Props по умолчанию задают `net472`, `LangVersion=latest`, framework reference package и ссылки на `Baldic.Loader`, совместимые `BepInEx`/`0Harmony`, Unity/игру и optional API, если указан каталог. Shared references помечаются `Private=false`, чтобы они не становились частью мода. `BaldicReferencePath` по умолчанию указывает `BALDI_Data/Managed`; для ранних изменений замените его каталогом подготовленного `.sdk`.

| Target | Что выполняет |
| --- | --- |
| `Build` / `BaldicStage` | Собирает и кладёт собственную DLL и private dependency DLL рядом с манифестом |
| `BaldicCheck` | Build, затем проверка пакета без активации |
| `BaldicPackage` | Check, затем новый архив по `BaldicOutputPackage` |
| `BaldicRun` | Check, затем изолированный `dev-run` |
| `BaldicGameTest` | Check, затем opt-in native game tests |
| `BaldicPrepareSdk` | Создаёт новый `.sdk` с выбранными structural dependencies |
| `BaldicDatagen` | Явно генерирует данные, если задан `BaldicGeneratorAssembly` |

Например, `dotnet msbuild ./my-mod/MyMod.csproj -restore -t:BaldicCheck` проверяет собранный мод. `BaldicOutputPackage` по умолчанию — `.baldic` рядом с каталогом проекта; для повторного выпуска задайте новое имя. `BaldicGeneratedDir` по умолчанию `generated`. `BaldicPython` по умолчанию `python`; если это не Python 3.11+, укажите соответствующую команду явно. `BaldicToolsDir` можно переопределить, если инструменты расположены отдельно от SDK.

`BaldicUseApi` становится true, если задан API reference directory; иначе нативные MSBuild-запуски передают `--no-api`. Для API-запуска установите `BaldicApiArchive` либо `BALDIC_API_ARCHIVE`. Дополнительные пакеты задаются items:

```xml
<ItemGroup>
  <BaldicDependency Include="../libraries/example-library.baldic" />
</ItemGroup>
```

Они участвуют и в SDK preparation, и в runtime probe. `BaldicPrepareSdk` не перезаписывает старый `.sdk`; после изменения structural dependency подготовьте новый набор references. О порядке этих операций читайте в [раннем конвейере](early-pipeline.md).

## IDE и отладка

```sh
python3 tools/baldic.py setup-ide ./my-mod --target-game bbcr
```

Команда создаёт process-based VS Code tasks Build, Check, Package, Run, Game tests, Prepare SDK и добавляет рекомендацию `ms-dotnettools.csharp`. Она обновляет свои задачи с префиксом `Baldic:`, сохраняя посторонние. Package task использует фиксированное имя рядом с проектом: после первого успешного архива задайте новое имя для следующего выпуска, а не рассчитывайте на overwrite. Существующий `tasks.json` должен содержать корректный массив `tasks`.

Rider/Visual Studio могут вызывать те же MSBuild targets. Retail Unity player требует подходящего Mono debugging setup для attach. SDK не включает CLR hot replacement, не устанавливает watcher DLL и не обещает работающий debug agent только от наличия IDE task.

## Datagen: данные во время разработки

Generator — авторская `net10.0` библиотека со ссылкой на `tools/Baldic.Datagen/Baldic.Datagen.dll`, с `Private=false`. Она реализует `Baldic.DataGeneration.IDataGenerator.Generate(DataOutput)`. В release-инструментах DLL находится под `tools`; в source checkout используйте результат сборки инструмента. Не добавляйте её в runtime references игры.

Следующая самостоятельная единица создаёт русские строки, tag и произвольный JSON:

```csharp
using System.Collections.Generic;
using Baldic.DataGeneration;

namespace Book.Generation
{
    public sealed class ExampleGenerator : IDataGenerator
    {
        public void Generate(DataOutput output)
        {
            output.Translations("my-mod:ru_ru", new Dictionary<string, string>
            {
                { "MyMod_Welcome", "Добро пожаловать" }
            });
            output.Tag("my-mod:movable", new[] { "my-mod:chair", "my-mod:table" });
            output.WriteJson("data/my-mod/rules/example.json", new
            {
                minimum = 2,
                maximum = 5
            });
        }
    }
}
```

```sh
dotnet build ./my-generator -c Release
python3 tools/baldic.py datagen ./my-generator/bin/Release/net10.0/MyGenerator.dll \
  --output ./generated-pack
```

`Translations` пишет `assets/my-mod/lang/ru_ru.json`, `Tag` — `data/my-mod/tags/movable.json`; ID и относительные пути валидируются. Object properties, tag values и хеши формируются детерминированно. JSON не создаёт исполняемое NPC/item-поведение: его должен прочитать и применить ваш runtime-код.

Output — отдельный каталог генератора с `generated-manifest.json`. При повторе проверяются учтённые пути и хеши: каталог без manifest, чужой файл или ручная правка generated file не перезаписываются. Providers работают со staging; неудачная генерация оставляет прежний output. Не добавляйте сторонние побочные эффекты в generator в расчёте, что файловая транзакция откатит их тоже.

Перенесите полученные `assets`/`data` в [зарегистрированный resource pack](resources.md). Не поставляйте generator DLL и .NET 10 tool dependencies как игровые сборки. Для генерируемых данных и handwritten files выбирайте разные каталоги.

## Native coroutine GameTests

Игровой тест должен исполняться в настоящем Unity player. Framework находится в `Baldic.Testing` загрузчика и работает без optional API. В entrypoint стадии `test` вызовите `GameTests.Register(typeof(Checks))` под контекстом мода. Test method — static `IEnumerator Method(GameTestContext)` с `[GameTest]`; также доступна прямая регистрация имени и typed callback.

Следующая самостоятельная `net472` единица проверяет реальную установку типизированного патча в нативном процессе. Объявите `"test": ["MyTests.dll:Book.NativeChecks.TestMod"]` в entrypoints и запускайте только тестовым инструментом. Учебная цель имеет `NoInlining`, что не меняет глобальные параметры Mono игры.

```csharp
using System.Collections;
using System.Runtime.CompilerServices;
using Baldic;
using Baldic.Mixins;
using Baldic.Testing;

namespace Book.NativeChecks
{
    [BaldicMod]
    public sealed class TestMod
    {
        public void Test(ModContext context) => GameTests.Register(typeof(Checks));
    }

    public static class Checks
    {
        [MethodImpl(MethodImplOptions.NoInlining)]
        public static int Value() => 5;

        public static void After(ref int __result) => __result += 2;

        [GameTest("typed-result", TimeoutSeconds = 15)]
        private static IEnumerator Verify(GameTestContext test)
        {
            test.Own(Mixin.Patch(
                typeof(Checks).GetMethod(nameof(Value)),
                postfix: typeof(Checks).GetMethod(nameof(After))));
            yield return test.WaitFrames(2);
            test.Equal(7, Value(), "typed postfix result");
            test.Screenshot("typed-result");
            yield return null;
        }
    }
}
```

`WaitFrames`, `WaitUntil`, `null` и вложенный `IEnumerator` поддерживаются. Произвольный Unity wait object отвергается, чтобы не обходить test deadline. `test.Own` освобождает ресурсы при успехе, assertion failure, timeout и disposal coroutine. Тесты кооперативны: бесконечный блокирующий цикл на главном потоке не прервёт внутренний deadline; на этот случай нужен timeout внешнего процесса.

```sh
python3 tools/baldic.py game-test ./my-tests \
  --target-game bbplus --no-api --headless --timeout 150
python3 tools/baldic.py game-test ./my-tests \
  --target-game bbcr --api-archive ./libraries/baldic-api.baldic --headless
python3 tools/baldic.py dev-run ./my-mod --target-game bbplus --no-api
```

Второй вызов предполагает тестовый пакет, совместимый с BBCR. Повторяемый `--dependency` добавляет библиотеки, `--loader` выбирает полный host, `--api-archive` — runtime API. `--scene MainMenu` по умолчанию проходит native launcher/warning/profile flow, а пустой `--scene ""` оставляет начальную сцену. `--headless` на Linux использует gamescope и реальный GPU; это не обещание запуска Unity без графической системы. Для обычного просмотра используйте `dev-run`.

Инструмент создаёт отдельные копии игры и профиля под `.work/development`, включает `BALDIC_GAME_TEST=1`, ждёт readiness установленного API, запускает test stage и записывает `game-tests.json`. Отсутствие тестов, ошибка пакета, native Error/Exception/Assert, неполученный screenshot или timeout означают неуспех. Итог `result.json` включает native exit code и проверку неизменности входных payload hashes: наличие JSON само по себе не равно успешному запуску.

Процессы завершаются до очистки; disposable games/profiles удаляются и при ошибке, компактные логи, screenshots и отчёты остаются. Linux-профиль использует отдельные XDG paths. На Windows redirected directories не означают полной изоляции Unity PlayerPrefs от реестра, поэтому не переносите тесты в пользовательский профиль. Не публикуйте тестовые fixtures или игровые DLL как часть release. Практика чтения результатов и ошибок собрана в [диагностике](../appendix/troubleshooting.md).
