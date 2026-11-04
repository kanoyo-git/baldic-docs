# Первый C#-пакет

Сделаем мод, который пишет сообщение в журнал. Он использует только Loader и подходит обеим играм.

## Подготовьте ссылки

Разработчику нужны .NET SDK 10 и Python 3.11+. Игроку эти инструменты для готового мода не нужны. Возьмите core DLL из одной текущей поставки Baldic.

```sh
export BALDIC_LOADER_DLL="/path/to/release/payload/BepInEx/core/Baldic.Loader.dll"
python3 /path/to/release/tools/baldic.py create /path/to/hello-mod --id hello-mod
```

На Windows задайте переменную в текущем PowerShell-сеансе:

```powershell
$env:BALDIC_LOADER_DLL = "C:\Baldic\payload\BepInEx\core\Baldic.Loader.dll"
python C:\Baldic\tools\baldic.py create C:\Mods\hello-mod --id hello-mod
```

## Добавьте код

Файл `Mod.cs`:

```csharp
using Baldic;

[BaldicMod]
public sealed class HelloMod
{
    public void Init(ModContext context)
    {
        Log.Info(context.Id, "Привет из Baldic!");
    }
}
```

В корне пакета нужен `baldic.mod.json`. Имя DLL должно совпадать с `AssemblyName` вашего проекта; здесь оно `HelloMod`:

```json
{
  "schemaVersion": 1,
  "id": "hello-mod",
  "version": "1.0.0",
  "name": "Hello Mod",
  "depends": { "baldic": ">=1.0.0" },
  "entrypoints": { "init": ["HelloMod.dll:HelloMod"] }
}
```

Замените содержимое созданного `HelloLoader.csproj` следующим проектом. Оставьте в корне **один** `.csproj`: не добавляйте рядом второй. Здесь `AssemblyName` изменён на `HelloMod`, как в манифесте:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <LangVersion>latest</LangVersion>
    <AssemblyName>HelloMod</AssemblyName>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies.net472" Version="1.0.3" PrivateAssets="all" />
    <Reference Include="Baldic.Loader">
      <HintPath>$(BALDIC_LOADER_DLL)</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>
```

Здесь не используются конфиги, Unity или patch descriptors. Для них добавляются соответствующие core/game references либо используется общий [MSBuild SDK](../loader/tooling.md). Не меняйте `TargetFramework` игрового DLL на `net10.0`: .NET10 нужен инструментам разработки, а игра исполняет `net472` в Mono.

## Соберите и упакуйте

```sh
python3 /path/to/release/tools/baldic.py mod-build /path/to/hello-mod
python3 /path/to/release/tools/baldic.py check /path/to/hello-mod
python3 /path/to/release/tools/baldic.py mod-package /path/to/hello-mod --output /path/to/hello-mod.baldic
```

Если вместо штатного `mod-build` вы используете обычный `dotnet build`, проверьте, что собственный DLL оказался рядом с манифестом. `check` не создаёт недостающий DLL. Существующий output-архив не перезаписывается: выберите новое имя или удалите только свой старый результат.

Положите полученный файл в `mods/`, запустите игру и найдите сообщение в `BepInEx/LogOutput.log`. Для доступа к игре продолжайте с [BB+](../api-bbplus/setup.md) или [BBCR](../api-bbcr/setup.md).
