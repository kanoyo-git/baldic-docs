# Ранний конвейер: доступ и структура сборок

Когда требуется изменить тело уже загруженного метода, используйте [runtime Mixins](../mixins/README.md). Если мод должен получить новое поле, интерфейс, базовый класс или возможность наследовать sealed-класс до его загрузки, нужна отдельная ранняя стадия. Она работает с метаданными Mono.Cecil перед активацией runtime-пакетов.

Два инструмента решают разные по объёму задачи. Access widener описывает стандартные изменения доступности в JSON. Чистый `IAssemblyTransformer` предоставляет произвольное преобразование метаданных и IL с последующей структурной проверкой. Для одного `private → public` предпочитайте декларативный файл: его проще проверить и сопоставить с игровой версией.

## Манифест и расположение файлов

```text
shape-mod/
  baldic.mod.json
  access/game-access.json
  early/ShapeTransformer.dll
  Runtime.dll
```

```json
{
  "schemaVersion": 1,
  "id": "shape-mod",
  "version": "1.0.0",
  "depends": { "baldic": ">=1.0.0", "bbplus": "*" },
  "accessWideners": ["access/game-access.json"],
  "transformers": ["early/ShapeTransformer.dll:Example.Early.ShapeTransformer"],
  "entrypoints": { "init": ["Runtime.dll:Example.RuntimeMod"] }
}
```

Пути в `accessWideners` и в DLL-части `transformers` относительны корню пакета. Они должны указывать существующий файл с расширением `.json` или `.dll`, без абсолютного пути, пустых сегментов, `.`/`..` и выхода через symlink. Transformer-декларация содержит ровно `путь.dll:Полное.Имя.Типа`. Если runtime entrypoint не нужен, `entrypoints` можно не объявлять; если не нужен transformer, уберите его декларацию, а не оставляйте отсутствующую DLL.

## Access widener

Пример содержимого `access/game-access.json` рассчитан на учебный тип `Example.Target` в `Assembly-CSharp.dll`. В реальном пакете замените цели на проверенные метаданные игры.

```json
{
  "schemaVersion": 1,
  "assembly": "Assembly-CSharp.dll",
  "types": [
    { "type": "Example.Target", "accessible": true, "extendable": true }
  ],
  "fields": [
    { "type": "Example.Target", "name": "value", "accessible": true, "mutable": true }
  ],
  "methods": [
    { "type": "Example.Target", "name": "Read", "parameters": ["System.Int32"], "accessible": true, "extendable": true },
    { "type": "Example.Target", "name": "Reset", "parameters": [], "accessible": true }
  ]
}
```

`assembly` — только имя файла сборки, без каталогов. `accessible` делает выбранное объявление public. Для класса `extendable` снимает sealed; для instance-метода делает его virtual и снимает final. Static-метод и конструктор нельзя сделать extendable. `mutable` снимает readonly у поля; literal-константа не может стать изменяемой этим флагом.

Типы поддерживают `accessible`/`extendable`, поля — `accessible`/`mutable`, методы — `accessible`/`extendable`. Флаги — bool. Неизвестное свойство, отсутствующая или неоднозначная цель, повторное объявление доступа и неправильный тип значения — ошибка. Не объявляйте одно и то же access target в двух пакетах в расчёте на то, что идентичные правила сольются: ранний конвейер проверяет дубликаты между пакетами.

`parameters` обязателен у метода и задаёт точные полные имена Cecil. Для метода без аргументов это `[]`, для by-reference параметра используется форма Cecil вроде `System.Int32&`, а не C# `ref int`. Вложенный тип адресуется Cecil-формой с `/`; для имени самого `type` также нормализуется `+`. В параметрах не подменяйте точное имя произвольным C# alias.

## Чистая transformer-сборка

Соберите transformer в **отдельную net472 DLL**. Её references — `sdk/early/Baldic.Loader.Preloader.dll`, `sdk/early/Mono.Cecil.dll`, framework и необходимые чистые зависимости. Runtime `Baldic.Loader.dll`, Unity, игровые DLL и optional API в этот проект не добавляются. Нельзя загрузить игровую цель через reflection из конструктора transformer или `TargetAssemblies`: изменять нужно переданный `AssemblyDefinition`.

Ниже самостоятельная C#-единица. Она снимает sealed с учебного класса и намеренно отказывает, если метаданные не соответствуют ожиданию. Для такого конкретного изменения достаточно access widener; пример показывает сам контракт transformer без выдуманных методов API.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Baldic.Transforms;
using Mono.Cecil;

namespace Example.Early
{
    public sealed class ShapeTransformer : IAssemblyTransformer
    {
        public IEnumerable<string> TargetAssemblies => new[] { "Assembly-CSharp.dll" };

        public void Transform(AssemblyDefinition assembly, TransformContext context)
        {
            var target = assembly.MainModule.Types.SingleOrDefault(
                type => type.FullName == "Example.Target");
            if (target == null || target.IsInterface || target.IsValueType)
                throw new InvalidOperationException("Expected class Example.Target");
            target.IsSealed = false;
            context.Log("Made Example.Target extendable");
        }
    }
}
```

`TransformContext` предоставляет `Id`, `Root`, `ManagedPath` и `Log(string)`. `Root` относится к владельцу transformer; target assemblies задаются именами вроде `Assembly-CSharp.dll`, без пути. Дополнительные чистые DLL поставляйте внутри своего пакета или объявленной обязательной зависимости. Helper и Cecil помечайте `Private=false`: они предоставляются ранним SDK, а не пакуются как собственные библиотеки мода.

Пример отдельного проекта; `BALDIC_EARLY_SDK` здесь — выбранная вами переменная для каталога `sdk/early`, а не автоматически определяемое свойство Baldic:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <LangVersion>latest</LangVersion>
    <AssemblyName>ShapeTransformer</AssemblyName>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.NETFramework.ReferenceAssemblies.net472" Version="1.0.3" PrivateAssets="all" />
    <Reference Include="Baldic.Loader.Preloader">
      <HintPath>$(BALDIC_EARLY_SDK)/Baldic.Loader.Preloader.dll</HintPath>
      <Private>false</Private>
    </Reference>
    <Reference Include="Mono.Cecil">
      <HintPath>$(BALDIC_EARLY_SDK)/Mono.Cecil.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>
```

Не импортируйте в чистый проект runtime `Baldic.Mod.props`, который добавляет игровые и loader references. Runtime-мод с `Runtime.dll` компилируется отдельным проектом по обычным правилам [tooling](tooling.md).

## Порядок и ошибки

Пакеты выполняются в разрешённом порядке обязательных зависимостей. Внутри пакета идут access-файлы, затем transformers, в порядке их деклараций. Если два структурных изменения зависят друг от друга, объявите эту связь явно; приоритеты runtime Mixins не управляют ранним конвейером.

После каждой операции проверяются идентичность сборки, имена/дубликаты членов, изменения интерфейсов и базовых классов, корректность связей конструкторов, форма изменённых тел и глубины IL-стека. Это не полный семантический анализ: успешно записанный IL может всё ещё нарушать игровой контракт, например порядок инициализации полей. Проверяйте фактическое поведение на заявленных версиях игры.

Исключение transformer, невалидный результат или преждевременная загрузка цели фатальны для запуска. После структурных изменений отказ runtime-активации пакета также требует остановки/перезапуска: форму уже загруженного CLR-типа нельзя откатить снятием hooks. Здесь нет горячего включения DLL, watcher или автоматического восстановления прежней формы типа.

## Подготовка compile references

Расширение доступа в работающей игре не изменяет исходную DLL, по которой компилируется ваш мод. До сборки runtime-проекта создайте локальный SDK с тем же выбранным графом и преобразованиями:

```sh
python3 tools/baldic.py prepare-sdk ./shape-mod \
  --managed "/path/to/game/BALDI_Data/Managed" \
  --dependency ./libraries/required-library.baldic \
  --output ./shape-mod/.sdk
```

Если внешней библиотеки нет, не добавляйте `--dependency`. Для API-мода передайте выбранный API archive как ещё одну зависимость. `--managed` задаёт исходную игровую сборку явно; иначе инструменты берут каталог выбранной игры из окружения. Каталог output должен быть новым и находиться вне исходного Managed. Исходные игровые файлы остаются входами только для чтения.

В runtime-проекте установите `BaldicReferencePath` на полученный `.sdk`. В MSBuild есть `BaldicPrepareSdk`, который создаёт `.sdk` рядом с проектом и учитывает `BaldicDependency`. Он не перезаписывает существующий SDK. При изменении transformer, access-файла, версии игры или структурной зависимости подготовьте ссылки заново и пересоберите потребителя.

`baldic-sdk.json` сохраняет сведения об игре, версиях и fingerprints пакетов, исходных хешах, transformed DLL и dependency references. Runtime сверяет выбранные fingerprints с ранним обнаружением. Сгенерированные игровые DLL — исключительно локальные материалы разработки: не публикуйте их в архиве мода, release или репозитории. Полные параметры команд находятся в [CLI](../appendix/cli.md), ошибки выбора версии — в [зависимостях](dependencies.md).
