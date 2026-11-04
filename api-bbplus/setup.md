# Первый мод: яблоко с собственным эффектом

Результат этой главы — DLL, которую Loader загружает из пакета `orchard`; предмет появляется в пулах F1/F2 и магазинах этих этажей, а при использовании восстанавливает выносливость. Пошаговый путь использует `ItemSpec`: меньше кода и готовая интеграция с генерацией. [ItemBuilder](content.md) удобнее, когда нужен собственный компонент `Item`, состояние или особые metadata-флаги.

## 1. Подготовьте SDK и проект

Нужны установленный Baldic Loader, BB+ backend API 0.0.1, .NET SDK и **managed DLL именно BB+ 0.14.5**. Файлы другой игры или версии могут скомпилировать код с иными сигнатурами и сломать его при загрузке.

Создайте папку проекта и сохраните `Orchard.csproj`. Передайте `BaldicLoader`, `BaldicApiDir`, `GameManaged` и `BepInExCore` через `dotnet build -p:...`; это абсолютные пути к `Baldic.Loader.dll`, каталогу с пятнадцатью `Baldic.Api.*.dll` BB+ backend, `BALDI_Data/Managed` и `BepInEx/core` установленного Baldic runtime соответственно. В `BaldicApiDir` не смешивайте DLL backend BBCR. Проект использует wildcard для DLL игровых типов, Unity и API, чтобы учебные примеры следующих глав собирались без ручного подбора транзитивных ссылок.

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <LangVersion>latest</LangVersion>
    <AssemblyName>Orchard</AssemblyName>
    <Nullable>disable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies.net472"
                      Version="1.0.3" PrivateAssets="all" />
    <Reference Include="Baldic.Loader">
      <HintPath>$(BaldicLoader)</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="BepInEx">
      <HintPath>$(BepInExCore)/BepInEx.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="0Harmony">
      <HintPath>$(BepInExCore)/0Harmony.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="$(BaldicApiDir)/Baldic.Api.*.dll">
      <Private>false</Private>
    </Reference>
    <Reference Include="$(GameManaged)/Assembly-CSharp*.dll">
      <Private>false</Private>
    </Reference>
    <Reference Include="$(GameManaged)/Unity*.dll">
      <Private>false</Private>
    </Reference>
    <Reference Include="Rewired_Core">
      <HintPath>$(GameManaged)/Rewired_Core.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>
```

Не добавляйте wildcard на все `Managed/*.dll`: игровые копии `System.dll`/`System.Core.dll` конфликтуют с reference assemblies .NET Framework.

Это проект потребителя SDK: никакой `ProjectReference` на исходники Loader не требуется. Ссылки на `BepInEx.dll` и `0Harmony.dll` берутся из установленного Baldic runtime: новые namespaces `Baldic.Loader.Configuration` и `Baldic.Mixins` могут определять типы именно в совместимых сборках с этими именами. Не подставляйте случайные сторонние DLL с таким же именем. Как собирать и упаковывать проекты инструментами Loader — в [инструментах](../loader/tooling.md).

## 2. Напишите entrypoint

Сохраните следующий самостоятельный файл как `Mod.cs`. `Init` выполняется в контексте владельца пакета: регистратор получает ID и корень файлов автоматически. Callback `OnUse` получает **`PlayerMovement`**, а не `PlayerManager`. `true` означает, что игра должна расходовать предмет. Для обычного предмета без мгновенного использования `InstantUse` оставляют `false`.

```csharp
using Baldic;
using Baldic.Api;
using ContentItems = Baldic.Api.Lua.Items;
using Baldic.Api.Lua;

namespace Orchard
{
    [BaldicMod]
    public sealed class Mod
    {
        public void Init(ModContext owner)
        {
            ContentItems.Register(new ItemSpec
            {
                Id = "orchard:apple",
                Name = "Садовое яблоко",
                Description = "Полностью восстанавливает выносливость.",
                Sprite = "assets/apple.png",
                Price = 300,
                Cost = 40,
                Tags = new[] { "food" },
                InLevels = true,
                InShop = true,
                Floors = new[] { "F1", "F2" },
                Weight = 50,
                OnUse = movement =>
                {
                    movement.stamina = movement.StaminaMax;
                    return true;
                }
            });
            ModdedHighScores.AddAffectingMod(owner.Id);
            ModdedSaves.AddDummyHandler(owner.Id);
            Log.Info(owner.Id, "Orchard: спецификация предмета зарегистрирована");
        }

        public void AssetsFinal(ModContext owner)
        {
            if (ContentItems.Get("orchard:apple") == null)
                throw new System.InvalidOperationException("Предмет не был построен");
            Log.Info(owner.Id, "Orchard: предмет готов");
        }
    }
}
```

Регистрация в `Init` ещё не гарантирует построенный `ItemObject`: он создаётся после подготовки игровых ресурсов. Поэтому проверка находится в `AssetsFinal`. Она будет выполнена только при наличии соответствующего entrypoint в manifest. О совместимости сохранений и результатов — [отдельная глава](saves.md).

## 3. Соберите пакет

Итоговая папка в `<game>/mods/orchard/`:

```text
orchard/
├── baldic.mod.json
├── Orchard.dll
└── assets/
    └── apple.png
```

Нарисуйте `apple.png` с прозрачностью. Один файл используется для инвентаря и мира; отдельные размеры задаются через `SmallSprite` и `LargeSprite`. Имена и регистр путей должны точно совпадать, особенно на Linux.

Полный `baldic.mod.json`:

```json
{
  "schemaVersion": 1,
  "id": "orchard",
  "name": "Садовое яблоко",
  "version": "1.0.0",
  "authors": ["Автор мода"],
  "depends": {
    "baldic": ">=1.0.0",
    "bbplus": "*",
    "baldic-api": "0.0.1"
  },
  "entrypoints": {
    "init": ["Orchard.dll:Orchard.Mod"],
    "assetsFinal": ["Orchard.dll:Orchard.Mod"]
  }
}
```

`bbplus` — виртуальный ID игры; это не DLL. Если вместо агрегатора выбираете отдельные модули, этому примеру нужны `baldic-api-registry`, `baldic-api-saves`, `baldic-api-highscores` и их транзитивные зависимости. Ограничение версии `0.0.1` фиксирует API, описанный в книге. Правила диапазонов и архив `.baldic` разобраны в [формате пакетов](../loader/packages.md) и [зависимостях](../loader/dependencies.md).

## 4. Проверьте результат

Сначала соберите проект: ожидается успешный exit code и `Orchard.dll`. Скопируйте только свою DLL, manifest и ресурсы; игровые DLL и API входят в установленный runtime и не должны дублироваться внутри мода.

Запустите игру обычным способом. В журнале найдите две записи `Orchard`: сначала о регистрации, затем о готовности. Отсутствие второй при наличии первой означает проблему подготовки ресурсов или стадий, а не обязательно проблему discovery. Начните новый забег: изменения пулов не пересобирают уже созданный этаж. Для быстрой проверки эффекта используйте рецепт [выдать предмет на старте](recipes.md), затем вернитесь к случайному появлению в генерации.

`Weight=50` — относительный вес в пуле, а не 50% и не гарантия появления. У `Items.Give` слабая гарантия результата: он возвращает `true`, если найдены предмет и игрок, затем вызывает игровой `AddItem`; для проверки свободного слота используйте [Inventory.Give](gameplay.md). Обратите внимание и на [условия добавления в пулы](content.md).
