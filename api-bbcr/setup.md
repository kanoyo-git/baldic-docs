# Проект и первый BBCR-мод

Цель первого проекта: загрузить свою DLL в BBCR, дождаться игровых ресурсов, вывести количество предметов и открыть страницу Mods. Предполагается установленный Baldic Loader 1.0.0 и API BBCR 0.0.1. Установку и структуру пакетов разбирает [раздел Loader](../loader/packages.md).

## Выберите SDK своей игры

Для релиза с отдельными API-архивами используйте `baldic-api-bbcr.baldic`. Это ZIP-пакет; извлеките его **в каталог SDK вне игрового `mods/`**, найдите backend `games/bbcr` и укажите его как `BALDIC_API_BBCR_DIR`. В старом универсальном `baldic-api.baldic` выбирается та же ветка `games/bbcr`. В игру устанавливается архив пакета, а извлечённый SDK нужен компилятору.

Есть два способа получить игровые ссылки:

| Способ | Когда подходит | Ограничение |
|---|---|---|
| `BALDI_Data/Managed` установленного BBCR | Обычный мод без структурных изменений зависимостей | Показывает исходные игровые типы |
| `prepare-sdk` с выбранными зависимостями | Access wideners, структурные mixins и добавленные члены | SDK нужно пересоздавать после изменения таких зависимостей |

Команду `prepare-sdk`, manifest SDK и MSBuild-интеграцию смотрите в [инструментах](../loader/tooling.md). Полученные игровые DLL предназначены только для локальной компиляции: не включайте их в мод.

## Создайте проект

При наличии авторских tools команды ниже создают пример для BBCR. Запускайте их из корня комплекта tools, в котором существует `tools/baldic.py`; пути `/path/to/...` замените своими. Python нужен версии 3.11+, .NET SDK — 10.

```sh
export BALDIC_BBCR_GAME_DIR="/path/to/Classic Remastered"
export BALDIC_LOADER_DLL="/path/to/release/payload/BepInEx/core/Baldic.Loader.dll"
export BALDIC_API_BBCR_DIR="/path/to/bbcr-sdk/games/bbcr"
python tools/baldic.py create /path/to/hello-bbcr --id hello-bbcr --api --target-game bbcr
python tools/baldic.py mod-build /path/to/hello-bbcr
python tools/baldic.py check /path/to/hello-bbcr
python tools/baldic.py mod-package /path/to/hello-bbcr --output /path/to/hello-bbcr.baldic
```

Выходной `.baldic` должен быть новым файлом. При повторной упаковке задайте другое имя либо удалите только собственный предыдущий артефакт. Если DLL собирается вручную, минимальный проект выглядит так; сохраните его как `HelloBbcr.csproj` рядом с `Mod.cs`.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <LangVersion>latest</LangVersion>
    <AssemblyName>HelloBbcr</AssemblyName>
    <BaldicApiDir>$(BALDIC_API_BBCR_DIR)</BaldicApiDir>
    <BaldicLoader>$(BALDIC_LOADER_DLL)</BaldicLoader>
    <GameDir>$(BALDIC_BBCR_GAME_DIR)</GameDir>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies.net472"
                      Version="1.0.3" PrivateAssets="all" />
    <Reference Include="$(BaldicApiDir)/Baldic.Api.Bbcr.*.dll">
      <Private>false</Private>
    </Reference>
    <Reference Include="Baldic.Loader">
      <HintPath>$(BaldicLoader)</HintPath><Private>false</Private>
    </Reference>
    <Reference Include="$(GameDir)/BALDI_Data/Managed/Assembly-CSharp.dll">
      <Private>false</Private>
    </Reference>
    <Reference Include="$(GameDir)/BALDI_Data/Managed/UnityEngine*.dll">
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>
```

`Private=false` не копирует SDK и игровые сборки в выход мода. Для кода, который непосредственно использует TMP, добавьте игровую `Unity.TextMeshPro.dll`. Для кода с MIDI-параметрами или иными библиотеками BBCR добавляйте их реальные сборки из Managed. Любой код с `context.Config`/`Baldic.Loader.Configuration` требует также совместимую `BepInEx.dll` из SDK/того же релиза loader; примеры Mixins могут требовать SDK `0Harmony.dll`. [Общий авторский SDK](../loader/tooling.md) добавляет основные ссылки автоматически.

## Manifest

Файл `baldic.mod.json` должен лежать в корне пакета. Здесь зависимость от агрегата сознательная: последующие уроки используют все модули.

```json
{
  "id": "hello-bbcr",
  "name": "Hello BBCR",
  "version": "1.0.0",
  "depends": {
    "baldic": ">=1.0.0",
    "bbcr": "1.1.0",
    "baldic-api-bbcr": ">=0.0.1"
  },
  "entrypoints": {
    "init": ["HelloBbcr.dll"]
  }
}
```

Ограничение `bbcr: 1.1.0` фиксирует проверяемую игровую версию. Если вы сознательно поддерживаете другие версии, расширяйте диапазон после проверки. Ключ `bbcr` — предоставляемая загрузчиком игра, отдельный мод с таким ID создавать не нужно.

## Код

Следующий блок — полный `Mod.cs`, собираемый проектом выше. Атрибут и `ModContext` находятся в `Baldic`; совместимая загрузка — в `Baldic.Api`; игровые функции — в `Baldic.Bbcr`. Alias `GameEvents` устраняет совпадение имени с общими `Baldic.Events.GameEvents`.

```csharp
using Baldic;
using Baldic.Api;
using Baldic.Bbcr;
using Baldic.Events;
using GameEvents = Baldic.Bbcr.GameEvents;

[BaldicMod]
public sealed class HelloBbcr
{
    public void Init(ModContext context)
    {
        Log.Info(context.Id, "Game: " + Baldic.Loader.Runtime.GameName
            + " " + Baldic.Loader.Runtime.GameVersion);

        Loading.Register(context.Id, () =>
        {
            Log.Info(context.Id, "Loaded items: " + Assets.All<ItemObject>().Count);
        }, LoadingStage.Start);

        EventBus.On(GameEvents.GameBegin, e =>
        {
            Log.Info(context.Id, "BBCR level began: " + e.Instance);
        });

        Menus.Register("hello-bbcr.settings", "Hello BBCR", page =>
        {
            page.Label("A Classic Remastered mod");
        });
    }
}
```

Здесь `Loading.Register` захватывает ID для определения порядка загрузки и выполняет действие в контексте мода. Подписка EventBus и регистрация страницы принадлежат этому контексту; хранить их дескрипторы для обязательной ручной очистки не требуется. Если нужно отключить одну из них раньше выгрузки, сохраните возвращённый `IDisposable` и вызовите `Dispose`.

## Проверка результата

1. `mod-build` должен закончиться с кодом 0. Для ручного проекта выполните `dotnet build HelloBbcr.csproj -c Release`; скопируйте только свою `HelloBbcr.dll` из `bin/Release/net472` к manifest.
2. `check` должен подтвердить структуру manifest, объявленные файлы и entrypoint; разрешение установленных зависимостей дополнительно проверяет loader при запуске. Упакованный архив должен содержать manifest и собственную DLL в корне.
3. После обычного запуска BBCR дождитесь главного меню и завершения загрузки API. В журнале мода должны появиться название игры и `Loaded items:`.
4. Откройте Mods → Mod pages → Hello BBCR. При старте уровня журнал должен получить `BBCR level began:`.

Наличие DLL в папке ещё не подтверждает загрузку entrypoint. Ошибку сборки устраняйте по первой содержательной диагностике компилятора; ошибку загрузки — по диагностике конкретного пакета в Mods/Diagnostics и полному stack trace.

Следующий шаг: [файлы, ресурсы и стадии](loading-assets.md).
