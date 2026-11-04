# BBCR: assets

Сборка: `Baldic.Api.Bbcr.Assets.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbcr/README.md) · [Как читать справочник](../README.md)

## `AsepriteSheet`

`Baldic.Api.AsepriteSheet`

```text
public sealed class AsepriteSheet
public readonly System.Collections.Generic.List<Baldic.Api.AsepriteSheet.Frame> Frames;
public readonly System.Collections.Generic.List<Baldic.Api.AsepriteSheet.Tag> Tags;
public string Image;
public int ImageWidth;
public int ImageHeight;
public static Baldic.Api.AsepriteSheet Parse(string json);
public AsepriteSheet();
```

## `Frame`

`Baldic.Api.AsepriteSheet.Frame`

```text
public sealed class Frame
public Baldic.Api.PixelRect Rect;
public int DurationMs;
public Frame();
```

## `Tag`

`Baldic.Api.AsepriteSheet.Tag`

```text
public sealed class Tag
public string Name;
public int From;
public int To;
public string Direction;
public int Repeat;
public System.Collections.Generic.List<int> Sequence();
public Tag();
```

## `AssetsMod`

`Baldic.Api.AssetsMod`

```text
public sealed class AssetsMod
public static bool MidiFix;
public void Init(Baldic.ModContext ctx);
public AssetsMod();
```

## `Audio`

`Baldic.Api.Audio`

```text
public static class Audio
public static UnityEngine.AudioType TypeOf(string path);
public static UnityEngine.AudioClip FromFile(string path);
public static UnityEngine.AudioClip FromMod(string modId, params string[] parts);
```

## `AudioKinds`

`Baldic.Api.AudioKinds`

```text
public static class AudioKinds
public static string ForExtension(string path);
```

## `CubemapLayout`

`Baldic.Api.CubemapLayout`

```text
public static class CubemapLayout
public static readonly string[] Faces;
public static int[] Cell(int face, bool legacy = false);
public static int FaceSize(int width, int height, bool legacy = false);
```

## `Fonts`

`Baldic.Api.Fonts`

```text
public static class Fonts
public static TMPro.TMP_FontAsset FromFile(string path, int pointSize = 90, int padding = 9, UnityEngine.TextCore.LowLevel.GlyphRenderMode renderMode = (UnityEngine.TextCore.LowLevel.GlyphRenderMode)4122, int atlasWidth = 1024, int atlasHeight = 1024, TMPro.AtlasPopulationMode population = (TMPro.AtlasPopulationMode)1);
public static TMPro.TMP_FontAsset FromMod(string modId, params string[] parts);
public static TMPro.TMP_FontAsset FromFileLike(string path, TMPro.TMP_FontAsset reference, string characters);
public static void SetGlyphMetrics(TMPro.TMP_FontAsset font, uint character, float width, float height, float bearingX, float bearingY, float advance);
public static void RegisterReplacement(TMPro.TMP_FontAsset original, TMPro.TMP_FontAsset replacement);
public static void ApplyReplacements();
```

## `GmSoundFont`

`Baldic.Api.GmSoundFont`

```text
public static class GmSoundFont
public const int WaveRate = 112640;
public static readonly Baldic.Api.GmSoundFont.Family[] Families;
public static float Sample(Baldic.Api.GmSoundFont.Wave wave, int i, System.Random noise);
public static System.Int16 Timecents(float seconds);
public static System.Int16 SustainCentibels(float level);
public static byte[] Build();
```

## `Family`

`Baldic.Api.GmSoundFont.Family`

```text
public struct Family
public string Name;
public Baldic.Api.GmSoundFont.Wave Wave;
public float Attack;
public float Decay;
public float Sustain;
public float Release;
public Family(string name, Baldic.Api.GmSoundFont.Wave wave, float attack, float decay, float sustain, float release);
```

## `Wave`

`Baldic.Api.GmSoundFont.Wave`

```text
public enum Wave
public const Baldic.Api.GmSoundFont.Wave Sine = (Baldic.Api.GmSoundFont.Wave)0;
public const Baldic.Api.GmSoundFont.Wave Triangle = (Baldic.Api.GmSoundFont.Wave)1;
public const Baldic.Api.GmSoundFont.Wave Square = (Baldic.Api.GmSoundFont.Wave)2;
public const Baldic.Api.GmSoundFont.Wave Saw = (Baldic.Api.GmSoundFont.Wave)3;
public const Baldic.Api.GmSoundFont.Wave Noise = (Baldic.Api.GmSoundFont.Wave)4;
```

## `IResourceReload`

`Baldic.Api.IResourceReload`

```text
public interface IResourceReload : System.IDisposable
public abstract void Apply();
public abstract void Rollback();
```

## `Localization`

`Baldic.Api.Localization`

```text
public static class Localization
public static void RegisterMod(string modId);
public static void RegisterFile(Language language, string path);
public static void RegisterProvider(System.Func<Language, System.Collections.Generic.Dictionary<string, string>> provider);
public static void Refresh(Language language);
```

## `Midi`

`Baldic.Api.Midi`

```text
public static class Midi
public static string FromFile(string path, string id);
public static string FromMod(string modId, string id, params string[] parts);
public static string FromBytes(byte[] data, string id);
public static bool Has(string id);
public static void Unload(string id);
```

## `MidiIds`

`Baldic.Api.MidiIds`

```text
public static class MidiIds
public static string Allocate(string id, System.Func<string, bool> taken);
```

## `ModPaths`

`Baldic.Api.ModPaths`

```text
public static class ModPaths
public static string Root(string modId);
public static string Get(string modId, params string[] parts);
```

## `Models`

`Baldic.Api.Models`

```text
public static class Models
public static UnityEngine.GameObject FromFile(string path, System.Collections.Generic.Dictionary<string, UnityEngine.Material> materials = null);
public static UnityEngine.GameObject FromMod(string modId, params string[] parts);
```

## `ObjModel`

`Baldic.Api.ObjModel`

```text
public sealed class ObjModel
public readonly System.Collections.Generic.List<Baldic.Api.ObjModel.Part> Parts;
public readonly System.Collections.Generic.List<string> MaterialLibraries;
public static Baldic.Api.ObjModel Parse(string text);
public static System.Collections.Generic.List<Baldic.Api.ObjModel.Material> ParseMtl(string text);
public ObjModel();
```

## `Material`

`Baldic.Api.ObjModel.Material`

```text
public sealed class Material
public string Name;
public float[] Diffuse;
public float Alpha;
public string Texture;
public Material();
```

## `Part`

`Baldic.Api.ObjModel.Part`

```text
public sealed class Part
public string Name;
public readonly System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string, System.Collections.Generic.List<int>>> SubMeshes;
public readonly System.Collections.Generic.List<float[]> Positions;
public readonly System.Collections.Generic.List<float[]> Normals;
public readonly System.Collections.Generic.List<float[]> Uvs;
public Part();
```

## `PixelRect`

`Baldic.Api.PixelRect`

```text
public struct PixelRect
public int X;
public int Y;
public int W;
public int H;
public PixelRect(int x, int y, int w, int h);
public virtual string ToString();
```

## `ResourceAssets`

`Baldic.Api.ResourceAssets`

```text
public sealed class ResourceAssets : System.IDisposable
public ResourceAssets(Baldic.Api.ResourceId id, Baldic.ModContext owner = null, int priority = 1000);
public void AddTexture(Baldic.Api.ResourceId id);
public void AddAudio(Baldic.Api.ResourceId id);
public void AddJson(Baldic.Api.ResourceId id, Baldic.Api.ResourceKind kind = (Baldic.Api.ResourceKind)1);
public void AddLocalization(Baldic.Api.ResourceId id);
public UnityEngine.Texture2D GetTexture(Baldic.Api.ResourceId id);
public UnityEngine.AudioClip GetAudio(Baldic.Api.ResourceId id);
public object GetJson(Baldic.Api.ResourceId id, Baldic.Api.ResourceKind kind = (Baldic.Api.ResourceKind)1);
public System.Collections.Generic.IReadOnlyDictionary<string, string> GetLocalization(Baldic.Api.ResourceId id);
public void Dispose();
```

## `ResourceEntry`

`Baldic.Api.ResourceEntry`

```text
public sealed class ResourceEntry
public Baldic.Api.ResourceId Id { get; }
public Baldic.Api.ResourceId PackId { get; }
public Baldic.Api.ResourceKind Kind { get; }
public int Priority { get; }
public int Length { get; }
public byte[] ReadBytes();
public string ReadText();
public object ReadJson();
public System.Collections.Generic.IReadOnlyDictionary<string, string> ReadLocalization();
```

## `ResourceKind`

`Baldic.Api.ResourceKind`

```text
public enum ResourceKind
public const Baldic.Api.ResourceKind Assets = (Baldic.Api.ResourceKind)0;
public const Baldic.Api.ResourceKind Data = (Baldic.Api.ResourceKind)1;
```

## `ResourcePacks`

`Baldic.Api.ResourcePacks`

```text
public static class ResourcePacks
public static Baldic.Api.ResourceSnapshot Current { get; }
public static bool HasRegistrations { get; }
public static System.IDisposable Register(Baldic.Api.ResourceId id, string relativeRoot, int priority = 0, Baldic.ModContext owner = null);
public static System.IDisposable Listen(Baldic.Api.ResourceId id, System.Func<Baldic.Api.ResourceSnapshot, Baldic.Api.IResourceReload> prepare, int priority = 0, Baldic.ModContext owner = null);
public static void Reload();
```

## `ResourceSnapshot`

`Baldic.Api.ResourceSnapshot`

```text
public sealed class ResourceSnapshot
public long Generation { get; }
public bool TryGet(Baldic.Api.ResourceKind kind, Baldic.Api.ResourceId id, out Baldic.Api.ResourceEntry entry);
public Baldic.Api.ResourceEntry Get(Baldic.Api.ResourceKind kind, Baldic.Api.ResourceId id);
public System.Collections.Generic.IReadOnlyList<Baldic.Api.ResourceEntry> GetAll(Baldic.Api.ResourceKind kind, Baldic.Api.ResourceId id);
public System.Collections.Generic.IReadOnlyList<Baldic.Api.ResourceEntry> Find(Baldic.Api.ResourceKind kind, string pathPrefix = "");
```

## `SheetSlicing`

`Baldic.Api.SheetSlicing`

```text
public static class SheetSlicing
public static System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string, Baldic.Api.PixelRect>> ByCount(string texture, int width, int height, int across, int down);
public static System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<string, Baldic.Api.PixelRect>> BySize(string texture, int width, int height, int spriteW, int spriteH, int total = 0);
```

## `Sprites`

`Baldic.Api.Sprites`

```text
public static class Sprites
public static UnityEngine.Sprite FromTexture(UnityEngine.Texture2D t, float pixelsPerUnit = 1f, System.Nullable<UnityEngine.Vector2> pivot = default);
public static UnityEngine.Sprite FromFile(string path, float pixelsPerUnit = 1f, System.Nullable<UnityEngine.Vector2> pivot = default);
public static UnityEngine.Sprite FromMod(string modId, float pixelsPerUnit, params string[] parts);
public static UnityEngine.Sprite[] FromTextures(UnityEngine.Texture2D[] ts, float pixelsPerUnit = 1f);
public static UnityEngine.Sprite[] SliceByCount(UnityEngine.Texture2D t, int across, int down, float pixelsPerUnit = 1f, System.Nullable<UnityEngine.Vector2> pivot = default);
public static UnityEngine.Sprite[,] SliceByCount2D(UnityEngine.Texture2D t, int across, int down, float pixelsPerUnit = 1f, System.Nullable<UnityEngine.Vector2> pivot = default);
public static UnityEngine.Sprite[] SliceBySize(UnityEngine.Texture2D t, int width, int height, int total = 0, float pixelsPerUnit = 1f);
public static System.Collections.Generic.Dictionary<string, Baldic.Api.FrameAnimation<UnityEngine.Sprite>> AsepriteFromFile(string jsonPath, float pixelsPerUnit = 1f, System.Nullable<UnityEngine.Vector2> pivot = default);
public static System.Collections.Generic.Dictionary<string, Baldic.Api.FrameAnimation<UnityEngine.Sprite>> AsepriteFromMod(string modId, float pixelsPerUnit, params string[] parts);
```

## `TextureOps`

`Baldic.Api.TextureOps`

```text
public sealed class TextureOps
public Baldic.Api.TextureOps Load(string tag, params UnityEngine.Texture2D[] textures);
public Baldic.Api.TextureOps CutByMask(string tag, UnityEngine.Texture2D mask, string outTag);
public Baldic.Api.TextureOps SplitByColors(string tag, string outTag);
public Baldic.Api.TextureOps Trim(string tag);
public Baldic.Api.TextureOps RemoveEmpty(string tag, byte alphaThreshold = 0);
public Baldic.Api.TextureOps FlipAll(string tag, bool horizontal);
public Baldic.Api.TextureOps ForEach(string tag, System.Action<UnityEngine.Texture2D> action);
public UnityEngine.Texture2D[] Export(string tag, bool clear = true);
public TextureOps();
```

## `Textures`

`Baldic.Api.Textures`

```text
public static class Textures
public static UnityEngine.Texture2D FromFile(string path, UnityEngine.TextureFormat format = (UnityEngine.TextureFormat)4);
public static UnityEngine.Texture2D FromMod(string modId, params string[] parts);
public static UnityEngine.Texture2D[] FromFolder(string folder, string pattern = "*.png");
public static UnityEngine.Texture2D ReadableCopy(UnityEngine.Texture2D source);
public static UnityEngine.Texture2D Convert(UnityEngine.Texture2D t, UnityEngine.TextureFormat format);
public static UnityEngine.Texture2D FlipX(UnityEngine.Texture2D t);
public static UnityEngine.Texture2D FlipY(UnityEngine.Texture2D t);
public static UnityEngine.Texture2D Rotate180(UnityEngine.Texture2D t);
public static bool ReplaceInPlace(UnityEngine.Texture2D target, UnityEngine.Texture2D source);
public static bool ReplaceInPlace(string targetName, UnityEngine.Texture2D source);
public static int ReplaceFromFolder(string folder);
public static UnityEngine.Cubemap CubemapFromTexture(UnityEngine.Texture2D t, bool legacy = false);
public static UnityEngine.Cubemap CubemapFromFile(string path, bool legacy = false);
public static UnityEngine.Cubemap CubemapFromMod(string modId, params string[] parts);
public static UnityEngine.Texture2D CubemapToTexture(UnityEngine.Cubemap cube);
```

## `CatalogMod`

`Baldic.Bbcr.CatalogMod`

```text
public sealed class CatalogMod
public void Init(Baldic.ModContext context);
public CatalogMod();
```
