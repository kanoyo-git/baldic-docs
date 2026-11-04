# BB+: game

Сборка: `Baldic.Api.Game.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../../api-bbplus/README.md) · [Как читать справочник](../README.md)

## `Activities`

`Baldic.Api.Activities`

```text
public static class Activities
public static Activity[] All();
public static MathMachine[] MathMachines();
public static Activity[] Remaining();
public static Activity Nearest(UnityEngine.Vector3 position);
public static void Complete(Activity activity, bool correct = true, int player = 0);
public static void Reset(Activity activity);
public static void SetCorrupted(Activity activity, bool corrupted);
public static void SetBonusMode(Activity activity, bool bonus);
public static void SetPower(Activity activity, bool on);
public static int Answer(MathMachine machine);
public static int ProblemCount(MathMachine machine);
public static void SetProblemCount(MathMachine machine, int count);
public static bool Solve(Activity activity);
public static int SolveAll();
public static void FinishBuster(BalloonBuster buster);
```

## `BitCrusherFilter`

`Baldic.Api.BitCrusherFilter`

```text
public sealed class BitCrusherFilter : UnityEngine.MonoBehaviour
public BitCrusherFilter();
```

## `Catalog`

`Baldic.Api.Catalog`

```text
public static class Catalog
public static ItemObject Item(Items type);
public static ItemObject Item(string name);
public static ItemObject[] AllItems();
public static string[] ItemNames();
public static NPC Npc(Character character);
public static NPC Npc(string name);
public static NPC[] AllNpcs();
public static string[] NpcNames();
public static RandomEvent Event(RandomEventType type);
public static RandomEvent Event(string name);
public static string[] EventNames();
public static SceneObject Scene(string nameOrTitle);
public static SceneObject[] AllScenes();
public static SoundObject Sound(string name);
public static string[] SoundNames();
public static PosterObject Poster(string name);
public static string[] PosterNames();
public static RoomAsset Room(string name);
public static string[] RoomNames();
public static UnityEngine.Texture2D Texture(string name);
public static UnityEngine.Sprite Sprite(string name);
public static UnityEngine.Material Material(string name);
public static FieldTripObject FieldTrip(string name);
public static T Asset<T>(string name) where T : UnityEngine.Object;
public static string[] Names<T>() where T : UnityEngine.Object;
public static string[] EnumNames(string enumName);
```

## `Effects`

`Baldic.Api.Effects`

```text
public static class Effects
public static float Vector2Corruption { get; set; }
public static float Vector3Corruption { get; set; }
```

## `Game`

`Baldic.Api.Game`

```text
public static class Game
public static CoreGameManager Core { get; }
public static BaseGameManager Manager { get; }
public static EnvironmentController Env { get; }
public static bool InLevel { get; }
public static bool Playing { get; }
public static Baldi Baldi { get; }
public static SceneObject Scene { get; }
public static string LevelTitle { get; }
public static int LevelNumber { get; }
public static Mode Mode { get; }
public static int Seed { get; }
public static bool Paused { get; }
public static float LevelTime { get; }
public static int Lives { get; }
public static int NotebooksFound { get; }
public static int NotebookTotal { get; }
public static bool Ending { get; }
public static float ElevatorScreenSpeed { get; set; }
public static PlayerManager Player(int index = 0);
public static HudManager Hud(int index = 0);
public static void TogglePause(bool openScreen = true);
public static int Points(int player = 0);
public static void AddPoints(int amount, int player = 0, bool animate = true);
public static void AddLives(int amount);
public static void SetLives(int value);
public static void CollectNotebooks(int count = 1);
public static void AngerBaldi(float amount);
public static void PleaseBaldi(float seconds, bool rewardSticker = false);
public static void BeginSpoopMode();
public static void FinishLevel();
public static void LoadNextLevel();
public static void ReturnToMenu();
public static bool EndGame(UnityEngine.Component by, System.Nullable<UnityEngine.Vector3> cameraOffset = default, int player = 0);
public static TimeScaleModifier AddTimeScale(float npcs = 1f, float environment = 1f, float player = 1f);
public static void RemoveTimeScale(TimeScaleModifier modifier);
public static void MakeNoise(UnityEngine.Vector3 position, int value, UnityEngine.GameObject source = null);
public static void Rumble(float strength, float seconds);
public static bool Input(string action, bool onDown = true);
public static string Text(string key);
```

## `GameMod`

`Baldic.Api.GameMod`

```text
public sealed class GameMod
public GameMod();
public void Init();
```

## `Hud`

`Baldic.Api.Hud`

```text
public static class Hud
public static TMPro.TextMeshProUGUI Message(string text, float seconds = 3f, float y = 60f, int player = 0);
public static UnityEngine.UI.Image ShowImage(string path, float x, float y, float width, float height, float seconds = 0f, int player = 0);
public static UnityEngine.UI.Image Overlay(string path, float seconds = 1f, int player = 0);
public static void Tooltip(string text, int player = 0);
public static void CloseTooltip(int player = 0);
public static void SetCounterText(string text, int line = 0, bool spin = false, int player = 0);
public static void ShowNotebookCounter(bool visible, int player = 0);
public static void Hide(bool hidden, int player = 0);
public static void Darken(bool dark, int player = 0);
public static void SetStaminaBar(float value, int player = 0);
public static void Baldicator(bool coming, int player = 0);
public static void ShowSticker(UnityEngine.Sprite sprite, int player = 0);
public static BaldiTV Tv(int player = 0);
public static void TvSpeak(SoundObject line, int player = 0);
public static void TvAnnounce(SoundObject line, int player = 0);
public static HudGauge ShowGauge(UnityEngine.Sprite icon, float totalSeconds, int player = 0);
```

## `Inventory`

`Baldic.Api.Inventory`

```text
public static class Inventory
public static bool Give(ItemObject item, int player = 0);
public static bool Give(string item, int player = 0);
public static bool Has(string item, int player = 0);
public static bool Has(ItemObject item, int player = 0);
public static int Count(string item, int player = 0);
public static bool Take(string item, int player = 0);
public static ItemObject Slot(int slot, int player = 0);
public static void SetSlot(int slot, ItemObject item, int player = 0);
public static void SetSlot(int slot, string item, int player = 0);
public static void ClearSlot(int slot, int player = 0);
public static void Clear(int player = 0);
public static ItemObject[] Items(int player = 0);
public static string[] Names(int player = 0);
public static int Selected(int player = 0);
public static ItemObject SelectedItem(int player = 0);
public static void Select(int slot, int player = 0);
public static bool UseEffect(ItemObject item, int player = 0);
public static bool UseEffect(string item, int player = 0);
public static void UseSelected(int player = 0);
public static bool Full(int player = 0);
public static int Size(int player = 0);
public static void SetSize(int size, int player = 0);
public static void LockSlot(int slot, bool locked, int player = 0);
public static void Disable(bool disabled, int player = 0);
```

## `LevelMap`

`Baldic.Api.LevelMap`

```text
public static class LevelMap
public static int RevealedCells { get; }
public static int PlayerDiscoveredCells { get; }
public static void Reveal();
public static void RevealCell(int x, int z);
public static void RevealRoom(RoomController room);
public static bool IsRevealed(int x, int z);
public static void AddArrow(Entity target, UnityEngine.Color color);
public static void AddArrow(NPC npc, UnityEngine.Color color);
public static void RemoveArrows(Entity target);
public static void AddMarker(UnityEngine.Vector3 position, int id = 0);
public static void Open(bool toMap = true);
public static void Close();
```

## `FieldTrips`

`Baldic.Api.Lua.FieldTrips`

```text
public static class FieldTrips
public static FieldTripObject Current { get; }
public static string CurrentName { get; }
public static bool Available { get; }
public static bool Played { get; }
public static FieldTripEntranceRoomFunction Bus { get; }
public static MinigameBase Minigame { get; }
public static bool MinigameScoring { get; }
public static void SetAvailable(bool available);
public static void SetTrip(string name);
public static FieldTripObject[] All();
public static bool WinMinigame(bool perfect = true);
public static bool Start(bool needPass = false);
```

## `Modes`

`Baldic.Api.Modes`

```text
public static class Modes
public static string LifeMode { get; }
public static bool IsChallenge { get; }
public static string Challenge { get; }
public static bool Mirrored { get; }
public static LanternMode Lantern { get; }
public static void SetLifeMode(string mode);
public static bool WinChallenge();
public static void Mirror();
public static void Unmirror();
public static LanternMode StartLantern(float strength = 4f, System.Nullable<UnityEngine.Color> color = default);
public static void AddLantern(UnityEngine.Component target, float strength = 4f, System.Nullable<UnityEngine.Color> color = default);
public static LanternSource LanternOf(UnityEngine.Component target);
public static bool RemoveLantern(UnityEngine.Component target);
public static void StopLantern();
```

## `NpcObstacle`

`Baldic.Api.NpcObstacle`

```text
public sealed class NpcObstacle
public float MinX { get; }
public float MaxX { get; }
public float MinZ { get; }
public float MaxZ { get; }
public bool Active { get; set; }
public bool Removed { get; }
public void SetBounds(UnityEngine.Vector3 min, UnityEngine.Vector3 max);
public void Remove();
public static bool Out(float x, float z, float radius, float minX, float maxX, float minZ, float maxZ, out float ox, out float oz);
public static bool Step(float sx, float sz, float ex, float ez, float radius, float minX, float maxX, float minZ, float maxZ, out float ox, out float oz);
```

## `Npcs`

`Baldic.Api.Npcs`

```text
public static class Npcs
public static int KeepCoroutinesWhenOff(string typeName);
public static int KeptCoroutines(UnityEngine.MonoBehaviour owner);
public static NPC[] All();
public static NPC[] Of(Character character);
public static NPC[] Of(string character);
public static NPC Find(string character);
public static Baldi Baldi();
public static NPC Nearest(UnityEngine.Vector3 position, string character = null);
public static NPC Spawn(NPC prefab, int x, int z);
public static NPC Spawn(string character, int x, int z);
public static NPC SpawnAt(string character, UnityEngine.Vector3 position);
public static NPC SpawnRandom(string character);
public static void Despawn(NPC npc);
public static int DespawnAll(string character);
public static void Teleport(NPC npc, UnityEngine.Vector3 position);
public static void GoTo(NPC npc, UnityEngine.Vector3 position);
public static void Wander(NPC npc);
public static void Chase(NPC npc, int player = 0);
public static float Speed(NPC npc);
public static void SetSpeed(NPC npc, float speed);
public static void DistractBaldi();
public static bool StartJumprope(int player = 0);
public static void SetSweeping(NPC sweep, bool on);
public static void SetBullyShown(NPC bully, bool shown);
public static void SetFrozen(NPC npc, bool frozen);
public static Cell CellOf(NPC npc);
public static string State(NPC npc);
public static string NameOf(NPC npc);
public static void BaldiHear(UnityEngine.Vector3 position, int value, bool showIndicator = true);
public static void SetBaldiAnger(float value);
public static void PraiseBaldi(float seconds);
public static Baldic.Api.NpcObstacle AddObstacle(UnityEngine.Vector3 min, UnityEngine.Vector3 max);
public static Baldic.Api.NpcObstacle[] Obstacles();
public static void ClearObstacles();
public static float SpeedMultiplier(NPC npc);
public static void SetSpeedMultiplier(NPC npc, float multiplier);
public static bool Deaf(NPC npc);
public static void SetDeaf(NPC npc, bool deaf);
public static bool Blind(NPC npc);
public static void SetBlind(NPC npc, bool blind);
public static bool Enabled(NPC npc);
public static void SetEnabled(NPC npc, bool enabled);
public static void SetSilent(UnityEngine.Component target, bool silent);
public static void SetInvisible(UnityEngine.Component target, bool invisible);
public static void SetScale(UnityEngine.Component target, float scale);
public static void SetGuilt(NPC npc, string rule, float seconds);
```

## `Player`

`Baldic.Api.Player`

```text
public static class Player
public static PlayerManager Get(int player = 0);
public static UnityEngine.Vector3 Position(int player = 0);
public static UnityEngine.Vector3 Forward(int player = 0);
public static Cell CurrentCell(int player = 0);
public static RoomController CurrentRoom(int player = 0);
public static void Teleport(UnityEngine.Vector3 position, int player = 0);
public static void TeleportToCell(int x, int z, int player = 0);
public static float Stamina(int player = 0);
public static void SetStamina(float value, int player = 0);
public static float StaminaMax(int player = 0);
public static void AddStamina(float value, bool limited = true, int player = 0);
public static Baldic.Api.ValueModifier AddSpeed(float multiplier, float addend = 0f, int player = 0);
public static Baldic.Api.ValueModifier AddStatModifier(string stat, float multiplier, float addend = 0f, int player = 0);
public static void RemoveSpeed(Baldic.Api.ValueModifier modifier, int player = 0);
public static void RemoveStatModifier(Baldic.Api.ValueModifier modifier, int player = 0);
public static MovementModifier AddMovement(UnityEngine.Vector3 addend, float multiplier = 1f, int player = 0);
public static void RemoveMovement(MovementModifier modifier, int player = 0);
public static TimeScaleModifier AddTimeScale(float scale, int player = 0);
public static void RemoveTimeScale(TimeScaleModifier modifier, int player = 0);
public static bool Invincible(int player = 0);
public static void SetInvincible(bool value, int player = 0);
public static bool Hidden(int player = 0);
public static void SetHidden(bool value, int player = 0);
public static void SetFrozen(bool value, int player = 0);
public static string Guilt(int player = 0);
public static void BreakRule(string rule, float seconds, int player = 0);
public static void ClearGuilt(int player = 0);
public static void SetNametag(bool value, int player = 0);
public static Force Push(UnityEngine.Vector3 direction, float speed = 30f, float deceleration = -20f, int player = 0);
public static void StopPush(Force force, int player = 0);
public static void Squish(float seconds, int player = 0);
public static bool Squished(int player = 0);
public static float Reach(int player = 0);
public static void SetReach(float reach, int player = 0);
public static float LightLevel(int player = 0);
public static bool Noclip(int player = 0);
public static void SetNoclip(bool on, int player = 0);
public static void OnTeleport(System.Action<PlayerManager, UnityEngine.Vector3, UnityEngine.Vector3> handler, int player = 0);
public static UnityEngine.Vector2 MoveInput(int player = 0);
public static UnityEngine.Vector2 LookInput(int player = 0);
```

## `PlayerCamera`

`Baldic.Api.PlayerCamera`

```text
public static class PlayerCamera
public static bool FreeLook { get; }
public static GameCamera Get(int player = 0);
public static CameraModifier AddTilt(float pitch, float yaw, float roll, int player = 0);
public static void Remove(CameraModifier modifier, int player = 0);
public static void Shake(float strength, float seconds, int player = 0);
public static UnityEngine.Vector3 Offset(int player = 0);
public static void SetOffset(UnityEngine.Vector3 offset, int player = 0);
public static void Watch(UnityEngine.Component target, int player = 0);
public static void StopWatching(int player = 0);
public static void SetControllable(bool value, int player = 0);
public static void SetRendering(bool value, int player = 0);
public static UnityEngine.Camera Unity(int player = 0);
public static CameraModifier AddOffset(UnityEngine.Vector3 offset, int player = 0);
public static float FieldOfView(int player = 0);
public static void SetFieldOfView(float degrees, int player = 0);
public static void SetFreeLook(bool on);
public static UnityEngine.Vector3 Position(int player = 0);
public static UnityEngine.Vector3 Forward(int player = 0);
```

## `Prop`

`Baldic.Api.Prop`

```text
public sealed class Prop : UnityEngine.MonoBehaviour, IClickable<int>
public UnityEngine.Vector3 Position { get; }
public void Clicked(int player);
public void ClickableSighted(int player);
public void ClickableUnsighted(int player);
public bool ClickableHidden();
public bool ClickableRequiresNormalHeight();
public object Get(string key);
public void Set(string key, object value);
public void MoveTo(UnityEngine.Vector3 position);
public void SetVisible(bool visible);
public void SetSprite(string path);
public void Remove();
public Prop();
```

## `PropSpec`

`Baldic.Api.PropSpec`

```text
public sealed class PropSpec
public string Sprite;
public float Size;
public bool Solid;
public System.Action<Baldic.Api.Prop, PlayerManager> OnClick;
public System.Action<Baldic.Api.Prop, PlayerManager> OnSighted;
public System.Action<Baldic.Api.Prop, PlayerManager> OnUnsighted;
public PropSpec();
```

## `Props`

`Baldic.Api.Props`

```text
public static class Props
public static Baldic.Api.Prop Spawn(Baldic.Api.PropSpec spec, UnityEngine.Vector3 position);
public static Baldic.Api.Prop[] All();
```

## `RoomFunctionSpec`

`Baldic.Api.RoomFunctionSpec`

```text
public sealed class RoomFunctionSpec
public System.Action<RoomController, PlayerManager> OnPlayerEnter;
public System.Action<RoomController, PlayerManager> OnPlayerExit;
public System.Action<RoomController, NPC> OnNpcEnter;
public System.Action<RoomController, NPC> OnNpcExit;
public System.Action<RoomController, float> OnUpdate;
public RoomFunctionSpec();
```

## `Rooms`

`Baldic.Api.Rooms`

```text
public static class Rooms
public static RoomController MainHall { get; }
public static RoomController[] All();
public static RoomController[] OfCategory(string category);
public static string CategoryOf(RoomController room);
public static RoomController At(UnityEngine.Vector3 position);
public static RoomController OfPlayer(int player = 0);
public static UnityEngine.Vector3 Center(RoomController room);
public static UnityEngine.Vector3[] Cells(RoomController room);
public static System.Nullable<UnityEngine.Vector3> RandomSpot(RoomController room);
public static bool Powered(RoomController room);
public static void SetPower(RoomController room, bool on);
public static Door[] Doors(RoomController room);
public static void LockDoors(RoomController room, bool locked = true, float seconds = 0f);
public static void OpenDoors(RoomController room, bool open = true, float seconds = 0f);
public static Pickup[] Pickups(RoomController room);
public static RoomFunction[] Functions(RoomController room);
public static bool HasFunction(RoomController room, string typeName);
public static Baldic.Api.ScriptedRoomFunction AddFunction(RoomController room, Baldic.Api.RoomFunctionSpec spec);
public static void AddToEveryLevel(string category, Baldic.Api.RoomFunctionSpec spec);
public static void RemoveFunction(Baldic.Api.ScriptedRoomFunction function);
```

## `ScriptedRoomFunction`

`Baldic.Api.ScriptedRoomFunction`

```text
public sealed class ScriptedRoomFunction : RoomFunction
public int Players { get; }
public int Npcs { get; }
public virtual void OnPlayerEnter(PlayerManager player);
public virtual void OnPlayerExit(PlayerManager player);
public virtual void OnNpcEnter(NPC npc);
public virtual void OnNpcExit(NPC npc);
public ScriptedRoomFunction();
```

## `Shop`

`Baldic.Api.Shop`

```text
public static class Shop
public static StoreRoomFunction Store { get; }
public static bool Exists { get; }
public static int RestockPrice { get; set; }
public static float SaleChance { get; set; }
public static bool Free { get; set; }
public static Pickup[] Pickups();
public static ItemObject[] Items();
public static void SetItem(int slot, ItemObject item, int price = -1);
public static void SetItem(int slot, string item, int price = -1);
public static void SetPrice(int slot, int price);
public static void Restock();
```

## `Sounds`

`Baldic.Api.Sounds`

```text
public static class Sounds
public static bool MusicPlaying { get; }
public static bool BitCrusher { get; set; }
public static int BitCrusherSampleRate { get; set; }
public static int BitCrusherBitDepth { get; set; }
public static SoundObject Make(UnityEngine.AudioClip clip, string subtitle = "", SoundType type = (SoundType)1);
public static SoundObject Make(UnityEngine.AudioClip clip, string subtitle, SoundType type, UnityEngine.Color color);
public static SoundObject Load(string path, string subtitle = "", SoundType type = (SoundType)1);
public static SoundObject Get(string name);
public static void Play(SoundObject sound);
public static void Play(string name);
public static SoundObject Caption(string text, float seconds = 3f, System.Nullable<UnityEngine.Color> color = default);
public static UnityEngine.GameObject PlayAt(SoundObject sound, UnityEngine.Vector3 position);
public static UnityEngine.GameObject PlayAt(string name, UnityEngine.Vector3 position);
public static void PlayOn(UnityEngine.GameObject target, SoundObject sound);
public static void ShowSubtitles(UnityEngine.Component source, bool shown);
public static void PlayMusic(string song, bool loop = true, float volume = 1f);
public static void StopMusic();
public static void PauseMusic(bool paused);
public static void SetMusicSpeed(float speed);
public static void SetMusicVolume(float volume);
public static void PlayMusicFile(UnityEngine.AudioClip clip, bool loop = true);
public static void StopMusicFile();
```

## `Storage`

`Baldic.Api.Storage`

```text
public static class Storage
public static bool ProfileExists(string profile);
public static object Get(string key, object fallback = null, string mod = null);
public static void Set(string key, object value, string mod = null);
public static bool Has(string key, string mod = null);
public static double Add(string key, double amount, string mod = null);
public static string[] Keys(string mod = null);
public static object GetGlobal(string key, object fallback = null, string mod = null);
public static void SetGlobal(string key, object value, string mod = null);
public static bool HasGlobal(string key, string mod = null);
public static string[] GlobalKeys(string mod = null);
public static void Clear(string mod = null);
```

## `Structures`

`Baldic.Api.Structures`

```text
public static class Structures
public static BeltManager[] Belts();
public static void SetBeltsRunning(bool running);
public static HideableLocker[] Lockers();
public static VentController[] Vents();
public static Elevator[] Elevators();
public static Elevator[] OpenExits();
public static Elevator NearestElevator(UnityEngine.Vector3 position);
public static void SetElevatorState(Elevator elevator, string state);
public static void SetGate(Elevator elevator, bool open);
public static PowerLeverController[] PowerLevers();
public static void SetLever(PowerLeverController lever, bool on);
public static void BlowFuse(PowerLeverController lever);
public static BreakerController[] Breakers();
public static SteamValveController[] SteamValves();
public static void SetSteam(SteamValveController valve, bool on);
public static bool SteamOn(SteamValveController valve);
public static TeleporterController[] Teleporters();
public static void Teleport(TeleporterController from, int destination);
public static WormholeController[] Wormholes();
public static void Pulse(WormholeController wormhole);
public static CraneController[] Cranes();
public static string[] LevelStructureNames();
```

## `TimerHandle`

`Baldic.Api.TimerHandle`

```text
public sealed class TimerHandle
public bool Active { get; }
public void Cancel();
public TimerHandle();
```

## `Timers`

`Baldic.Api.Timers`

```text
public static class Timers
public static int Count { get; }
public static Baldic.Api.TimerHandle After(float seconds, System.Action callback, bool realTime = false);
public static Baldic.Api.TimerHandle Every(float seconds, System.Action callback, bool realTime = false);
public static Baldic.Api.TimerHandle NextFrame(System.Action callback);
public static void Cancel(Baldic.Api.TimerHandle timer);
```

## `World`

`Baldic.Api.World`

```text
public static class World
public static IntVector2 Size { get; }
public static UnityEngine.Cubemap Skybox { get; set; }
public static UnityEngine.Color SkyboxColor { get; set; }
public static int CollisionMask(int layer);
public static Cell CellAt(int x, int z);
public static Cell CellAt(UnityEngine.Vector3 position);
public static IntVector2 GridOf(UnityEngine.Vector3 position);
public static UnityEngine.Vector3 CenterOf(int x, int z);
public static Cell[] Cells();
public static Cell RandomCell();
public static int Distance(UnityEngine.Vector3 from, UnityEngine.Vector3 to);
public static RoomController[] Rooms();
public static RoomController[] Rooms(string category);
public static RoomController RoomAt(UnityEngine.Vector3 position);
public static UnityEngine.Vector3 RoomCenter(RoomController room);
public static UnityEngine.Vector3 RandomPositionIn(RoomController room);
public static void SetRoomPower(RoomController room, bool on);
public static void SetAllLights(bool on);
public static void SetLight(Cell cell, bool on);
public static void SetRoomLightColor(RoomController room, UnityEngine.Color color);
public static void FlickerLights(bool on);
public static void RefreshLights();
public static float LightLevel(UnityEngine.Vector3 position);
public static void OverrideLighting(UnityEngine.Color color);
public static void RestoreLighting();
public static UnityEngine.Cubemap[] Skyboxes();
public static Door[] Doors();
public static StandardDoor[] StandardDoors();
public static void LockAllDoors(float seconds = 0f);
public static void UnlockAllDoors();
public static Door DoorAt(Cell cell, Direction side);
public static Window[] Windows();
public static bool BreakWindow(UnityEngine.Component part, bool noise = true);
public static UnityEngine.Vector3 Penetration(UnityEngine.Vector3 centre, UnityEngine.Vector3 size, UnityEngine.Collider collider);
public static string PlacePoster(PosterObject poster, UnityEngine.Vector3 position, string side = null);
public static string PlacePoster(string poster, UnityEngine.Vector3 position, string side = null);
public static Pickup[] Pickups();
public static Pickup SpawnItem(ItemObject item, UnityEngine.Vector3 position);
public static string[] ObjectNames(string contains = null);
public static UnityEngine.GameObject SpawnObject(string name, UnityEngine.Vector3 position, float angle = 0f);
public static Pickup SpawnItem(string item, UnityEngine.Vector3 position);
public static void SpawnItemInRandomRoom(string item);
public static Notebook[] Notebooks();
public static Notebook[] RemainingNotebooks();
public static Activity[] Activities();
public static RandomEventType[] ActiveEvents();
public static RandomEvent[] Events();
public static RandomEvent StartEvent(string type, float delay = 0f);
public static RandomEvent BeginEvent(string type);
public static RandomEvent BeginNewEvent(string type);
public static void EnsureEventSpawnRoom();
public static void EndEvent(RandomEvent ev);
public static void EndAllEvents();
public static Elevator[] Elevators();
public static void SetTimeLimit(float seconds);
public static string DisplayTime();
```
