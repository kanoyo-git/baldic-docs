# Загрузить и применить ресурсы

У API есть два пути: файловые загрузчики `FromMod` для ресурсов пакета и `ResourcePacks` для явной системы именованных ресурсов с транзакционной перезагрузкой. Для одного предмета достаточно первого. Второй нужен, когда несколько пакетов переопределяют один ID или мод должен повторно подготовить целую согласованную группу данных.

## Файлы собственного мода

`ModPaths.Get(modId, parts...)` разрешает путь внутри корня установленного пакета через проверку `PackagePaths.Within`. Это работает и с папкой, и с подготовленным Loader архивом `.baldic`. Не собирайте пути к extraction/cache вручную. Путь к картинке в `ItemSpec` считается от корня мода, а не от папки DLL или текущего рабочего каталога процесса.

Ниже самостоятельный entrypoint, который вызывается через `assetsStart`. Нужны `assets/apple.png`, `assets/chime.wav`, `assets/theme.mid`, `assets/chair.obj` и, если OBJ ссылается на материал, его MTL и текстуры. Полный проект — в [начале работы](setup.md).

```csharp
using Baldic;
using Baldic.Api;
using UnityEngine;

namespace OrchardAssets
{
    [BaldicMod]
    public sealed class Mod
    {
        public void AssetsStart(ModContext owner)
        {
            var texture = Textures.FromMod(owner.Id, "assets", "apple.png");
            var sprite = Sprites.FromTexture(texture, 50f);
            var clip = Baldic.Api.Audio.FromMod(owner.Id, "assets", "chime.wav");
            var sound = Factories.Sound(clip, "Orchard_Chime", SoundType.Effect, Color.white);
            string song = Midi.FromMod(owner.Id, "orchard_theme", "assets", "theme.mid");
            GameObject chair = Models.FromMod(owner.Id, "assets", "chair.obj");
            Log.Info(owner.Id, "Ресурсы готовы: " + sprite.name + ", MIDI=" + song);
        }
    }
}
```

Файловые загрузчики и фабрика звука учитывают текущий context для владения созданными ресурсами. Здесь `song` — имя зарегистрированной MIDI-композиции, которое позднее принимает `Sounds.PlayMusic`. Не передавайте туда путь файла. `SoundObject` — игровой звук с типом и субтитрами; `AudioClip` — только аудиоданные. `Factories.Sound` создаёт объект; `Sounds.Play`, `PlayAt` и `PlayOn` воспроизводят его в нужном контексте. Субтитр `Orchard_Chime` добавьте в локализацию или замените на пустую строку.

`Textures.FromFile` поддерживает загрузку изображений через Unity, отдельные BMP/TGA-декодеры и DDS DXT1/DXT5. Созданная текстура использует `FilterMode.Point`. `Sprites.FromTexture` задаёт pivot и pixels per unit; PPU влияет на размер в мире. `SliceByCount` режет на сетку, `SliceBySize` — по размеру кадра. `AsepriteFromMod` принимает экспорт JSON со sprite sheet и возвращает `Dictionary<string, FrameAnimation<Sprite>>` по тегам анимации. Это не загрузка бинарного `.aseprite`.

`Audio.FromFile` синхронно декодирует WAV/OGG/MP3 через Unity. Не вызывайте его каждый кадр. `Midi.FromMod` регистрирует композицию; assets backend подготавливает отложенные MIDI перед `Post`. Техническая настройка `midiFix` относится к модулю assets и добавляет General MIDI soundfont; она не превращает MIDI в `AudioClip`. `Models.FromMod` читает OBJ с MTL, а не произвольный формат модели или Unity AssetBundle. Точные overloads — в [справочнике assets](../reference/bbplus/assets.md).

## Заменить существующую текстуру

Присваивание новой текстуры одному renderer меняет только эту ссылку. `Textures.ReplaceInPlace(target, source)` изменяет содержимое целевой текстуры, поэтому изменения видят её существующие пользователи. Размеры должны совпадать; учитывайте формат и доступность чтения. Для несовместимого формата подготовьте `Textures.Convert(source, target.format)`; для GPU-текстуры может понадобиться `ReadableCopy`.

Возвращаемый `bool` проверяйте. `false` нельзя считать подтверждённой заменой. Пакетный `ReplaceFromFolder` сопоставляет имена, что требует аккуратного контроля совпадений. Полноценный русификатор также повторно применяет оформление к новым сценам: разовая замена видимых компонентов меню не охватывает будущие экземпляры UI.

## Локализация и шрифты

Для обычной локализации разместите JSON в `Language/English/` или другой папке с именем enum `Language`, затем вызовите `Localization.RegisterMod(owner.Id)` из `Init`. Формат файла:

```json
{
  "items": [
    { "key": "Orchard_Chime", "value": "Звонок" },
    { "key": "Orchard_Hello", "value": "Добро пожаловать в сад!" }
  ]
}
```

Альтернатива — `RegisterFile(Language, path)` для конкретного файла или `RegisterProvider(Func<Language, Dictionary<string,string>>)` для программного источника. Callback provider вызывается при загрузке языка; возвращайте только нужные переводы. Если язык уже загружен, `Localization.Refresh(language)` сразу объединяет зарегистрированные источники с таблицей. `Refresh(Language.English)` позволяет применять русские строки поверх английского языка, как делает мод русификации; это осознанная политика конкретного мода, а не автоматический выбор API.

Переведённая строка ещё не означает наличие кириллических glyph. `Fonts.FromFileLike(path, reference, characters)` создаёт шрифт с опорой на метрики исходного; `RegisterReplacement` и `ApplyReplacements` применяют подмену. При необходимости корректируйте glyph через `SetGlyphMetrics`. Делайте это во время подготовки или инициализации сцены, а не в `Update`. Сохраняйте оригинальные имена регистрационных ключей, когда другие системы ищут шрифт по имени. Для TMP нужны ссылки на `Unity.TextMeshPro.dll` и Unity UI, уже включённые в учебный проект.

## Именованные resource packs

Файловый `assets/apple.png` и resource ID `orchard:apple.png` — разные механизмы. Resource pack содержит тип (`assets`/`data`), namespace и путь. Для примера ниже структура такова:

```text
packs/base/
├── assets/orchard/apple.png
└── data/orchard/settings.json
```

В `settings.json` положите `{ "price": 300 }`. Самостоятельный entrypoint вызывается через `assetsStart`; ID pack и listener принадлежат текущему mod ID `orchard`. При изменении manifest ID измените namespace файлов или resource ID.

```csharp
using Baldic;
using Baldic.Api;

namespace OrchardPack
{
    [BaldicMod]
    public sealed class Mod
    {
        private ResourceAssets assets;

        public void AssetsStart(ModContext owner)
        {
            ResourcePacks.Register(new ResourceId(owner.Id, "base"), "packs/base", owner: owner);
            assets = new ResourceAssets(new ResourceId(owner.Id, "assets"), owner);
            assets.AddTexture(new ResourceId("orchard", "apple.png"));
            assets.AddJson(new ResourceId("orchard", "settings.json"));
            ResourcePacks.Reload();
            var image = assets.GetTexture(new ResourceId("orchard", "apple.png"));
            object settings = assets.GetJson(new ResourceId("orchard", "settings.json"));
            Log.Info(owner.Id, "Поколение " + ResourcePacks.Current.Generation + ": " + image.name);
        }
    }
}
```

`AddTexture`/`AddJson` объявляют потребность; `Get...` до подготовки бросает исключение. `Register` публикует pack в snapshot, но listener, созданный позднее, потребует `Reload`. При одинаковом resource ID победит больший priority, при равенстве — меньший ordinal pack ID. `GetAll` позволяет прочитать стек переопределений; `Current.Generation` отличает опубликованные поколения.

`Reload` выполняется явно, на Unity owner thread, без файлового watcher и без фонового обновления каждый кадр. Listener готовит `IResourceReload`: `Apply` применяет, `Rollback` отменяет даже частичное применение, `Dispose` освобождает staging/старые ресурсы. Если подготовка или применение не удались, `Current` и поколение остаются прежними. `ResourceAssets` уже реализует этот протокол для заявленных ресурсов.

Не сохраняйте старую ссылку на `Texture2D` после успешного reload: старое поколение освобождается. Получите новую и обновите renderer/UI в своей транзакции. Файлы `assets/baldic/lang/<язык>.json` применяются к игре автоматически; для языковых ресурсов других namespace зарегистрируйте соответствующий provider или listener. Подробный общий протокол — [ресурсы Loader](../loader/resources.md), полный BB+ контракт — [assets](../reference/bbplus/assets.md).
