# BB+: registry

Сборка: `Baldic.Api.Registry.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `ContentIds`

`Baldic.Api.ContentIds`

```text
public static class ContentIds
public static string Normalize(string id, string modId);
public static string EnumName(string id);
public static string NameKey(string prefix, string id);
public static float MatchingPixelsPerUnit(int pixels, float referenceWidth, float referencePixelsPerUnit);
```

## `CharacterSpec`

`Baldic.Api.Lua.CharacterSpec`

```text
public sealed class CharacterSpec
public string Id;
public string Name;
public string Description;
public string Sprite;
public string Poster;
public float Scale;
public float Speed;
public bool Sees;
public float Fov;
public float SightDistance;
public bool Flying;
public string[] Floors;
public int Weight;
public bool Forced;
public string[] Rooms;
public string[] Tags;
public System.Action<Baldic.Api.Lua.RegisteredNpc> OnSpawn;
public System.Action<Baldic.Api.Lua.RegisteredNpc, float> OnUpdate;
public System.Action<Baldic.Api.Lua.RegisteredNpc, PlayerManager> OnPlayerSighted;
public System.Action<Baldic.Api.Lua.RegisteredNpc, PlayerManager> OnPlayerInSight;
public System.Action<Baldic.Api.Lua.RegisteredNpc, PlayerManager> OnPlayerLost;
public System.Action<Baldic.Api.Lua.RegisteredNpc, PlayerManager> OnTouchPlayer;
public System.Action<Baldic.Api.Lua.RegisteredNpc, NPC> OnTouchNpc;
public System.Action<Baldic.Api.Lua.RegisteredNpc, UnityEngine.Vector3, int> OnHear;
public System.Action<Baldic.Api.Lua.RegisteredNpc> OnArrive;
public System.Action<Baldic.Api.Lua.RegisteredNpc> OnDespawn;
public CharacterSpec();
```

## `Characters`

`Baldic.Api.Lua.Characters`

```text
public static class Characters
public static Character Register(Baldic.Api.Lua.CharacterSpec spec);
public static NPC Get(string id);
public static string[] Ids();
public static Baldic.Api.Lua.RegisteredNpc Spawn(string id, UnityEngine.Vector3 position);
public static Baldic.Api.Lua.RegisteredNpc[] All(string id);
```

## `EventSpec`

`Baldic.Api.Lua.EventSpec`

```text
public sealed class EventSpec
public string Id;
public string Announcement;
public string AnnouncementSound;
public string Jingle;
public float MinTime;
public float MaxTime;
public string[] Floors;
public int Weight;
public string[] Tags;
public System.Action<Baldic.Api.Lua.RegisteredEvent> OnBegin;
public System.Action<Baldic.Api.Lua.RegisteredEvent, float> OnUpdate;
public System.Action<Baldic.Api.Lua.RegisteredEvent> OnEnd;
public EventSpec();
```

## `ItemSpec`

`Baldic.Api.Lua.ItemSpec`

```text
public sealed class ItemSpec
public string Id;
public string Name;
public string Description;
public string Sprite;
public string SmallSprite;
public string LargeSprite;
public int Price;
public int Cost;
public string[] Tags;
public System.Func<PlayerMovement, bool> OnUse;
public bool InstantUse;
public bool InLevels;
public bool InShop;
public string[] Floors;
public int Weight;
public ItemSpec();
```

## `Items`

`Baldic.Api.Lua.Items`

```text
public static class Items
public static Items Register(Baldic.Api.Lua.ItemSpec spec);
public static ItemObject Get(string id);
public static bool Give(string id);
```

## `Levels`

`Baldic.Api.Lua.Levels`

```text
public static class Levels
public static void Change(System.Action<string, int, SceneObject> fn);
public static SceneObject[] Scenes();
public static string Kind(SceneObject scene);
public static bool IsEndless(SceneObject scene);
public static SceneObject AddEndlessMap(string name, System.Action<SceneObject> change, string from = null, string size = "Medium");
public static LevelObject[] LevelObjects(SceneObject scene);
public static void AddNpc(SceneObject scene, string character, int weight = 100);
public static void ForceNpc(SceneObject scene, string character);
public static void RemoveNpc(SceneObject scene, string character);
public static string[] Npcs(SceneObject scene);
public static void SetNpcCount(SceneObject scene, int count);
public static void AddItem(SceneObject scene, string item, int weight = 50);
public static void ForceItem(SceneObject scene, string item);
public static void AddShopItem(SceneObject scene, string item, int weight = 50);
public static void RemoveItem(SceneObject scene, string item);
public static void SetItemValue(SceneObject scene, int value);
public static void SetShopSize(SceneObject scene, int count);
public static void AddEvent(SceneObject scene, string ev, int weight = 100);
public static void RemoveEvent(SceneObject scene, string ev);
public static string[] Events(SceneObject scene);
public static void SetEvents(SceneObject scene, int min, int max, float minGap = -1f, float maxGap = -1f);
public static void SetSize(SceneObject scene, int min, int max);
public static void SetTimeLimit(SceneObject scene, float seconds);
public static void SetExits(SceneObject scene, int count);
public static void SetLights(SceneObject scene, UnityEngine.Color color, int strength = 10);
public static void SetMapPrice(SceneObject scene, int price);
public static void SetSkippable(SceneObject scene, bool skippable);
```

## `PosterSpec`

`Baldic.Api.Lua.PosterSpec`

```text
public sealed class PosterSpec
public string Id;
public string Image;
public string[] Floors;
public int Weight;
public PosterSpec();
```

## `Posters`

`Baldic.Api.Lua.Posters`

```text
public static class Posters
public static PosterObject Register(Baldic.Api.Lua.PosterSpec spec);
public static PosterObject Get(string id);
public static string[] Ids();
```

## `RandomEvents`

`Baldic.Api.Lua.RandomEvents`

```text
public static class RandomEvents
public static RandomEventType Register(Baldic.Api.Lua.EventSpec spec);
public static RandomEvent Get(string id);
public static string[] Ids();
public static Baldic.Api.Lua.RegisteredEvent Running(string id);
```

## `RegisteredEvent`

`Baldic.Api.Lua.RegisteredEvent`

```text
public sealed class RegisteredEvent : RandomEvent
public string contentId;
public EnvironmentController Env { get; }
public float TimeLeft { get; }
public void SetTimeLeft(float seconds);
public object Get(string key);
public void Set(string key, object value);
public virtual void Begin();
public virtual void End();
public RegisteredEvent();
```

## `RegisteredItem`

`Baldic.Api.Lua.RegisteredItem`

```text
public sealed class RegisteredItem : Item
public string contentId;
public virtual bool Use(PlayerManager pm);
public RegisteredItem();
```

## `RegisteredNpc`

`Baldic.Api.Lua.RegisteredNpc`

```text
public sealed class RegisteredNpc : NPC
public string contentId;
public string Mode { get; }
public PlayerManager Target { get; }
public UnityEngine.Vector3 Position { get; }
public float Speed { get; }
public object Get(string key);
public void Set(string key, object value);
public virtual void Initialize();
public void Wander();
public void Chase(PlayerManager player);
public void GoTo(UnityEngine.Vector3 position);
public void Stop();
public void SetSpeed(float speed);
public void Teleport(UnityEngine.Vector3 position);
public void SetFrozen(bool frozen);
public void SetVisible(bool visible);
public float DistanceTo(UnityEngine.Vector3 position);
public bool SeesPlayer(PlayerManager player);
public void SetSprite(string path);
public void Say(string sound);
public void BreakRule(string rule, float seconds);
protected virtual void VirtualUpdate();
public virtual void PlayerSighted(PlayerManager player);
public virtual void PlayerInSight(PlayerManager player);
public virtual void PlayerLost(PlayerManager player);
public virtual void Hear(UnityEngine.GameObject source, UnityEngine.Vector3 position, int value);
protected virtual void VirtualOnTriggerEnter(Entity otherEntity, UnityEngine.Collider other);
public virtual void Despawn();
public RegisteredNpc();
```

## `RegisteredNpcState`

`Baldic.Api.Lua.RegisteredNpcState`

```text
public sealed class RegisteredNpcState : NpcState
public RegisteredNpcState(Baldic.Api.Lua.RegisteredNpc npc);
public virtual void DestinationEmpty();
```

## `StickerSpec`

`Baldic.Api.Lua.StickerSpec`

```text
public sealed class StickerSpec
public string Id;
public string Name;
public string Description;
public string Sprite;
public int Weight;
public string[] Floors;
public int ValueCap;
public bool Bonus;
public string[] Tags;
public StickerSpec();
```

## `Stickers`

`Baldic.Api.Lua.Stickers`

```text
public static class Stickers
public static int SlotCount { get; }
public static Sticker Register(Baldic.Api.Lua.StickerSpec spec);
public static int Value(string id);
public static void Give(string id, bool animate = true);
public static int Count(string id);
public static string[] Inventory();
public static void ClearApplied();
public static string NameOf(Sticker s);
public static string[] Ids();
public static string Applied(int slot);
public static bool Apply(int slot, string id);
public static bool Glued(int slot);
public static void SetGlued(int slot, bool glued);
public static void OpenPacks(bool animate = false);
```

## `ModsMenu`

`Baldic.Api.ModsMenu`

```text
public sealed class ModsMenu : Baldic.Api.CustomOptionsCategory
public virtual void Build();
public static void Install(Baldic.Mixins.Patcher harmony);
public static void Install(Baldic.Mixins.Mixin.PatchSet patches);
public static void Open();
public ModsMenu();
```

## `RegistryMod`

`Baldic.Api.RegistryMod`

```text
public sealed class RegistryMod
public void Init();
public RegistryMod();
```
