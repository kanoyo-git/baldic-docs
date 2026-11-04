# BB+: gameplay

Сборка: `Baldic.Api.Gameplay.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `AnimatedSpriteRotatorAnimator`

`Baldic.Api.AnimatedSpriteRotatorAnimator`

```text
public class AnimatedSpriteRotatorAnimator : Baldic.Api.ObjectFrameAnimator<UnityEngine.Sprite>
public AnimatedSpriteRotator rotator;
protected virtual void ApplyFrame(UnityEngine.Sprite value);
public void SetRenderer(UnityEngine.SpriteRenderer renderer);
public void AddAngledAnimation(string id, int angles, int fps, UnityEngine.Sprite[] sheet);
public void AddAngledAnimation(string id, int angles, float totalTime, UnityEngine.Sprite[] sheet);
public AnimatedSpriteRotatorAnimator();
```

## `AudioLoudness`

`Baldic.Api.AudioLoudness`

```text
public static class AudioLoudness
public static float Current(UnityEngine.AudioSource source, float window = 0.1f);
```

## `BaldiTvCharacters`

`Baldic.Api.BaldiTvCharacters`

```text
public static class BaldiTvCharacters
public const string Baldi = "baldi";
public static System.Func<SoundObject, string> CharacterFor;
public static System.Collections.Generic.IReadOnlyDictionary<string, Baldic.Api.TvCharacter> All { get; }
public static void Register(string id, Baldic.Api.TvCharacter character);
public static Baldic.Api.TvCharacter Get(string id);
public static void QueueCharacter(BaldiTV tv, string id, SoundObject sound);
public static UnityEngine.UI.Image ScreenOf(BaldiTV tv);
```

## `ButtonColorType`

`Baldic.Api.ButtonColorType`

```text
public sealed class ButtonColorType
public readonly System.Type Type;
public readonly System.ValueTuple<string, string>[] Materials;
public readonly string RendererField;
public readonly System.Func<UnityEngine.Component, UnityEngine.Material[], UnityEngine.Material> Pick;
public ButtonColorType(System.Type type, System.ValueTuple<string, string>[] materials, string rendererField, System.Func<UnityEngine.Component, UnityEngine.Material[], UnityEngine.Material> pick);
```

## `ButtonColors`

`Baldic.Api.ButtonColors`

```text
public static class ButtonColors
public const string Default = "Red";
public static System.Collections.Generic.IReadOnlyList<string> Colors { get; }
public static void RegisterType(Baldic.Api.ButtonColorType type);
public static bool Supports(System.Type type);
public static void Create(string name, UnityEngine.Color color);
public static bool TryGetColor(string name, out UnityEngine.Color color);
public static UnityEngine.Material[] MaterialsFor(System.Type type, string color);
public static bool ApplyColor(UnityEngine.Component button, string color);
public static bool ApplyMaterials(UnityEngine.Component button, UnityEngine.Material[] materials);
public static bool SetColor(GameButtonBase button, string color);
```

## `CullingPoint`

`Baldic.Api.CullingPoint`

```text
public class CullingPoint : UnityEngine.MonoBehaviour
public static System.Collections.Generic.IReadOnlyList<Baldic.Api.CullingPoint> All { get; }
public int ChunkId { get; }
public CullingPoint();
```

## `DebugFakeAnimator`

`Baldic.Api.DebugFakeAnimator`

```text
public class DebugFakeAnimator : Baldic.Api.SimpleFakeAnimator
public virtual void Play(string stateName, int layer, float normalizedTime);
public virtual void Play(int stateHash, int layer, float normalizedTime);
public virtual void SetParameter(int id, object value);
public DebugFakeAnimator();
```

## `ExtendedPosterObject`

`Baldic.Api.ExtendedPosterObject`

```text
public class ExtendedPosterObject : PosterObject
public Baldic.Api.PosterImageOverlay[] overlays;
public ExtendedPosterObject();
```

## `ExtendedPosterTextData`

`Baldic.Api.ExtendedPosterTextData`

```text
public class ExtendedPosterTextData : PosterTextData
public string[] formats;
public Baldic.Api.RegexReplacement[] replacements;
public ExtendedPosterTextData();
```

## `ExtendedPosters`

`Baldic.Api.ExtendedPosters`

```text
public static class ExtendedPosters
public const int MaxOverlays = 10;
public static UnityEngine.UI.RawImage[] ImagesOf(TextTextureGenerator gen);
```

## `FakeAnimator`

`Baldic.Api.FakeAnimator`

```text
public abstract class FakeAnimator : UnityEngine.MonoBehaviour
public UnityEngine.Animator Target { get; }
public float Speed { get; set; }
public abstract void Play(string stateName, int layer, float normalizedTime);
public abstract void Play(int stateHash, int layer, float normalizedTime);
public abstract object GetParameter(int id);
public abstract void SetParameter(int id, object value);
public virtual void SetTrigger(int id);
public virtual void ResetTrigger(int id);
protected virtual void OnDestroy();
protected FakeAnimator();
```

## `FakeAnimators`

`Baldic.Api.FakeAnimators`

```text
public static class FakeAnimators
public static readonly System.Collections.Generic.List<string> Unhooked;
public static bool TryGet(UnityEngine.Animator a, out Baldic.Api.FakeAnimator fake);
public static void Register(UnityEngine.Animator animator, Baldic.Api.FakeAnimator fake);
public static bool Remove(UnityEngine.Animator animator);
public static T AddFakeAnimator<T>(UnityEngine.Animator animator, bool disableReal = true) where T : Baldic.Api.FakeAnimator;
```

## `FrameAnimator<T>`

`Baldic.Api.FrameAnimator`1`

```text
public abstract class FrameAnimator<T> : UnityEngine.MonoBehaviour, Baldic.Api.ISimpleAnimator, UnityEngine.ISerializationCallbackReceiver
public TimeScaleType timeScale;
public EnvironmentController ec;
protected readonly Baldic.Api.AnimationClock<T> Clock;
public System.Collections.Generic.IDictionary<string, Baldic.Api.FrameAnimation<T>> Animations { get; }
public string CurrentAnimation { get; }
public int CurrentFrame { get; }
public float CurrentTime { get; }
public bool Paused { get; set; }
public bool Looping { get; set; }
public float RawSpeed { get; set; }
public string DefaultAnimation { get; }
public float EffectiveSpeed { get; }
protected FrameAnimator<T>();
public void LoadAnimations(System.Collections.Generic.IDictionary<string, Baldic.Api.FrameAnimation<T>> animations);
public void AddAnimation(string id, Baldic.Api.FrameAnimation<T> animation);
public void Play(string id, float speed);
public void Play(string id, float speed, bool loop);
public void PlayFrom(string id, float speed, float time, System.Nullable<bool> loop = default);
public void Stop();
public void Pause(bool paused = true);
public void SetLooping(bool loop);
public void ChangeSpeed(float speed);
public void SetDefaultAnimation(string id, float speed, bool start = false);
protected virtual void OnAnimationFinished(string id);
protected virtual void Awake();
protected virtual void Update();
protected abstract void ApplyFrame(T value);
protected abstract void StoreValues(System.Collections.Generic.List<T> values);
protected abstract System.Collections.Generic.IList<T> LoadValues();
public void OnBeforeSerialize();
public void OnAfterDeserialize();
```

## `GameplayMod`

`Baldic.Api.GameplayMod`

```text
public sealed class GameplayMod
public GameplayMod();
public void Init();
```

## `ISimpleAnimator`

`Baldic.Api.ISimpleAnimator`

```text
public interface ISimpleAnimator
public float RawSpeed { get; set; }
public abstract void Play(string id, float speed);
```

## `ImageAnimator`

`Baldic.Api.ImageAnimator`

```text
public class ImageAnimator : Baldic.Api.ObjectFrameAnimator<UnityEngine.Sprite>
public UnityEngine.UI.Image image;
protected virtual void ApplyFrame(UnityEngine.Sprite value);
public ImageAnimator();
```

## `Loudness`

`Baldic.Api.Loudness`

```text
public static class Loudness
public static float Peak(float[] samples, int count);
public static int Index(float volume, float multiplier, int count, System.Func<float, float> curve = null);
public static System.ValueTuple<int, int> Window(int position, int frequency, float seconds);
```

## `ObjectFrameAnimator<T>`

`Baldic.Api.ObjectFrameAnimator`1`

```text
public abstract class ObjectFrameAnimator<T> : Baldic.Api.FrameAnimator<T> where T : UnityEngine.Object
protected virtual void StoreValues(System.Collections.Generic.List<T> values);
protected virtual System.Collections.Generic.IList<T> LoadValues();
protected ObjectFrameAnimator<T>();
```

## `PlayerStat`

`Baldic.Api.PlayerStat`

```text
public static class PlayerStat
public const string StaminaRise = "staminaRise";
public const string StaminaMax = "staminaMax";
public const string StaminaDrop = "staminaDrop";
public const string WalkSpeed = "walkSpeed";
public const string RunSpeed = "runSpeed";
public static readonly string[] All;
```

## `PlayerStatExtensions`

`Baldic.Api.PlayerStatExtensions`

```text
public static class PlayerStatExtensions
public static Baldic.Api.PlayerStatModifiers GetModifiers(PlayerManager pm);
public static Baldic.Api.PlayerStatModifiers GetModifiers(PlayerMovement plm);
```

## `PlayerStatModifiers`

`Baldic.Api.PlayerStatModifiers`

```text
public sealed class PlayerStatModifiers : UnityEngine.MonoBehaviour
public readonly Baldic.Api.StatSheet Sheet;
public PlayerMovement Movement { get; }
public float this[string stat] { get; }
public void Apply();
public void AddModifier(string stat, Baldic.Api.ValueModifier modifier);
public void RemoveModifier(Baldic.Api.ValueModifier modifier);
public void ChangeBaseStat(string stat, float value);
public PlayerStatModifiers();
```

## `PosterImageOverlay`

`Baldic.Api.PosterImageOverlay`

```text
public class PosterImageOverlay
public UnityEngine.Texture2D texture;
public UnityEngine.Vector2Int position;
public UnityEngine.Vector2Int size;
public PosterImageOverlay();
public PosterImageOverlay(UnityEngine.Texture2D texture, UnityEngine.Vector2Int position, UnityEngine.Vector2Int size = default);
```

## `PosterText`

`Baldic.Api.PosterText`

```text
public static class PosterText
public static string Process(string text, System.Collections.Generic.IEnumerable<string> formats, System.Collections.Generic.IEnumerable<Baldic.Api.RegexReplacement> replacements, System.Func<string, string> localize);
```

## `RawImageAnimator`

`Baldic.Api.RawImageAnimator`

```text
public class RawImageAnimator : Baldic.Api.ObjectFrameAnimator<UnityEngine.Texture2D>
public UnityEngine.UI.RawImage image;
protected virtual void ApplyFrame(UnityEngine.Texture2D value);
public RawImageAnimator();
```

## `RegexReplacement`

`Baldic.Api.RegexReplacement`

```text
public struct RegexReplacement
public string Pattern;
public string Replacement;
public RegexReplacement(string pattern, string replacement);
```

## `SimpleFakeAnimator`

`Baldic.Api.SimpleFakeAnimator`

```text
public class SimpleFakeAnimator : Baldic.Api.FakeAnimator
public UnityEngine.MonoBehaviour animator;
public float Speed { get; set; }
public void KnowState(string name);
public virtual void Play(string stateName, int layer, float normalizedTime);
public virtual void Play(int stateHash, int layer, float normalizedTime);
public virtual object GetParameter(int id);
public virtual void SetParameter(int id, object value);
public SimpleFakeAnimator();
```

## `SimpleTvCharacter`

`Baldic.Api.SimpleTvCharacter`

```text
public class SimpleTvCharacter : Baldic.Api.TvCharacter
public readonly System.Collections.Generic.List<SoundObject> Sounds;
public UnityEngine.Sprite[] TalkFrames;
public float VolumeMultiplier;
public UnityEngine.AnimationCurve Sensitivity;
public SimpleTvCharacter(UnityEngine.Sprite[] talkFrames, params SoundObject[] sounds);
public virtual bool OwnsSound(SoundObject sound);
public virtual System.Collections.IEnumerator Speak(UnityEngine.UI.Image screen, BaldiTV tv, AudioManager audio, SoundObject sound);
```

## `SpriteRendererAnimator`

`Baldic.Api.SpriteRendererAnimator`

```text
public class SpriteRendererAnimator : Baldic.Api.ObjectFrameAnimator<UnityEngine.Sprite>
public UnityEngine.SpriteRenderer spriteRenderer;
protected virtual void ApplyFrame(UnityEngine.Sprite value);
public SpriteRendererAnimator();
```

## `SpriteRotatorAnimator`

`Baldic.Api.SpriteRotatorAnimator`

```text
public class SpriteRotatorAnimator : Baldic.Api.FrameAnimator<UnityEngine.Sprite[]>
public SpriteRotator rotator;
protected virtual void ApplyFrame(UnityEngine.Sprite[] value);
protected virtual void StoreValues(System.Collections.Generic.List<UnityEngine.Sprite[]> values);
protected virtual System.Collections.Generic.IList<UnityEngine.Sprite[]> LoadValues();
public SpriteRotatorAnimator();
```

## `StatSheet`

`Baldic.Api.StatSheet`

```text
public sealed class StatSheet
public System.Collections.Generic.IEnumerable<string> Stats { get; }
public float GetBase(string stat);
public void SetBase(string stat, float value);
public void Add(string stat, Baldic.Api.ValueModifier modifier);
public bool Remove(Baldic.Api.ValueModifier modifier);
public System.Collections.Generic.IReadOnlyList<Baldic.Api.ValueModifier> ModifiersOf(string stat);
public float Value(string stat);
public StatSheet();
```

## `TvCharacter`

`Baldic.Api.TvCharacter`

```text
public abstract class TvCharacter
public abstract bool OwnsSound(SoundObject sound);
public abstract System.Collections.IEnumerator Speak(UnityEngine.UI.Image screen, BaldiTV tv, AudioManager audio, SoundObject sound);
protected TvCharacter();
```

## `ValueModifier`

`Baldic.Api.ValueModifier`

```text
public sealed class ValueModifier
public float Multiplier;
public float Addend;
public ValueModifier(float multiplier = 1f, float addend = 0f);
```

## `VolumeAnimator`

`Baldic.Api.VolumeAnimator`

```text
public class VolumeAnimator : UnityEngine.MonoBehaviour
public string[] animations;
public float volumeMultiplier;
public UnityEngine.AnimationCurve sensitivity;
public UnityEngine.AudioSource audioSource;
public float window;
public UnityEngine.MonoBehaviour animator;
public VolumeAnimator();
```
