# Mixins: патчер и IL

Сборка: `0Harmony.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../mixins/README.md) · [Как читать справочник](README.md)

## `AccessTools`

`Baldic.Mixins.AccessTools`

```text
public static class AccessTools
public static System.Type TypeByName(string name);
public static System.Reflection.MethodInfo Method(System.Type type, string name, System.Type[] parameters = null, System.Type[] generics = null);
public static System.Reflection.MethodInfo DeclaredMethod(System.Type type, string name, System.Type[] parameters = null, System.Type[] generics = null);
public static System.Reflection.ConstructorInfo Constructor(System.Type type, System.Type[] parameters = null, bool searchForStatic = false);
public static System.Reflection.FieldInfo Field(System.Type type, string name);
public static System.Reflection.MethodInfo PropertyGetter(System.Type type, string name);
public static System.Reflection.MethodInfo PropertySetter(System.Type type, string name);
public static System.Collections.Generic.List<System.Reflection.MethodInfo> GetDeclaredMethods(System.Type type);
public static Baldic.Mixins.AccessTools.FieldRef<T, F> FieldRefAccess<T, F>(string name);
public static T MethodDelegate<T>(System.Reflection.MethodInfo method, object instance = null, bool virtualCall = true) where T : System.Delegate;
```

## `FieldRef<in T, F>`

`Baldic.Mixins.AccessTools.FieldRef`2`

```text
public delegate ref F FieldRef<in T, F>(T instance = default);
```

## `AfterAttribute`

`Baldic.Mixins.AfterAttribute`

```text
public sealed class AfterAttribute : HarmonyLib.HarmonyAfter
public AfterAttribute(params string[] owners);
```

## `BeforeAttribute`

`Baldic.Mixins.BeforeAttribute`

```text
public sealed class BeforeAttribute : HarmonyLib.HarmonyBefore
public BeforeAttribute(params string[] owners);
```

## `CleanupAttribute`

`Baldic.Mixins.CleanupAttribute`

```text
public sealed class CleanupAttribute : HarmonyLib.HarmonyCleanup
public CleanupAttribute();
```

## `CodeInstruction`

`Baldic.Mixins.CodeInstruction`

```text
public sealed class CodeInstruction
public System.Reflection.Emit.OpCode opcode;
public object operand;
public System.Collections.Generic.List<System.Reflection.Emit.Label> labels;
public System.Collections.Generic.List<Baldic.Mixins.ExceptionBlock> blocks;
public CodeInstruction(System.Reflection.Emit.OpCode opcode, object operand = null);
public CodeInstruction(Baldic.Mixins.CodeInstruction instruction);
public Baldic.Mixins.CodeInstruction Clone();
public Baldic.Mixins.CodeInstruction Clone(System.Reflection.Emit.OpCode value);
public Baldic.Mixins.CodeInstruction Clone(object value);
public bool Calls(System.Reflection.MethodInfo method);
public Baldic.Mixins.CodeInstruction MoveLabelsFrom(Baldic.Mixins.CodeInstruction source);
public Baldic.Mixins.CodeInstruction MoveBlocksFrom(Baldic.Mixins.CodeInstruction source);
```

## `ExceptionBlock`

`Baldic.Mixins.ExceptionBlock`

```text
public sealed class ExceptionBlock
public Baldic.Mixins.ExceptionBlockType blockType;
public System.Type catchType;
public ExceptionBlock(Baldic.Mixins.ExceptionBlockType blockType, System.Type catchType = null);
```

## `ExceptionBlockType`

`Baldic.Mixins.ExceptionBlockType`

```text
public enum ExceptionBlockType
public const Baldic.Mixins.ExceptionBlockType BeginExceptionBlock = (Baldic.Mixins.ExceptionBlockType)0;
public const Baldic.Mixins.ExceptionBlockType BeginCatchBlock = (Baldic.Mixins.ExceptionBlockType)1;
public const Baldic.Mixins.ExceptionBlockType BeginExceptFilterBlock = (Baldic.Mixins.ExceptionBlockType)2;
public const Baldic.Mixins.ExceptionBlockType BeginFaultBlock = (Baldic.Mixins.ExceptionBlockType)3;
public const Baldic.Mixins.ExceptionBlockType BeginFinallyBlock = (Baldic.Mixins.ExceptionBlockType)4;
public const Baldic.Mixins.ExceptionBlockType EndExceptionBlock = (Baldic.Mixins.ExceptionBlockType)5;
```

## `FinalizerAttribute`

`Baldic.Mixins.FinalizerAttribute`

```text
public sealed class FinalizerAttribute : HarmonyLib.HarmonyFinalizer
public FinalizerAttribute();
```

## `ILManipulatorAttribute`

`Baldic.Mixins.ILManipulatorAttribute`

```text
public sealed class ILManipulatorAttribute : HarmonyLib.HarmonyILManipulator
public ILManipulatorAttribute();
```

## `PatchAllAttribute`

`Baldic.Mixins.PatchAllAttribute`

```text
public sealed class PatchAllAttribute : HarmonyLib.HarmonyPatchAll
public PatchAllAttribute();
```

## `PatchAttribute`

`Baldic.Mixins.PatchAttribute`

```text
public sealed class PatchAttribute : HarmonyLib.HarmonyPatch
public PatchAttribute();
public PatchAttribute(System.Type type);
public PatchAttribute(string method);
public PatchAttribute(System.Type type, string method);
public PatchAttribute(System.Type type, string method, params System.Type[] arguments);
```

## `PatchKind`

`Baldic.Mixins.PatchKind`

```text
public enum PatchKind
public const Baldic.Mixins.PatchKind All = (Baldic.Mixins.PatchKind)0;
public const Baldic.Mixins.PatchKind Prefix = (Baldic.Mixins.PatchKind)1;
public const Baldic.Mixins.PatchKind Postfix = (Baldic.Mixins.PatchKind)2;
public const Baldic.Mixins.PatchKind Transpiler = (Baldic.Mixins.PatchKind)3;
public const Baldic.Mixins.PatchKind Finalizer = (Baldic.Mixins.PatchKind)4;
public const Baldic.Mixins.PatchKind ReversePatch = (Baldic.Mixins.PatchKind)5;
public const Baldic.Mixins.PatchKind ILManipulator = (Baldic.Mixins.PatchKind)6;
```

## `PatchMethod`

`Baldic.Mixins.PatchMethod`

```text
public sealed class PatchMethod : HarmonyLib.HarmonyMethod
public int Priority { get; set; }
public string[] Before { get; set; }
public string[] After { get; set; }
public PatchMethod(System.Reflection.MethodInfo method);
public PatchMethod(System.Type type, string method, System.Type[] arguments = null);
```

## `PatchPriority`

`Baldic.Mixins.PatchPriority`

```text
public static class PatchPriority
public const int First = 800;
public const int High = 600;
public const int Normal = 400;
public const int Low = 200;
```

## `Patcher`

`Baldic.Mixins.Patcher`

```text
public sealed class Patcher : System.IDisposable
public string Id { get; }
public Patcher(string id);
public System.Reflection.MethodInfo Patch(System.Reflection.MethodBase original, Baldic.Mixins.PatchMethod prefix = null, Baldic.Mixins.PatchMethod postfix = null, Baldic.Mixins.PatchMethod transpiler = null, Baldic.Mixins.PatchMethod finalizer = null, Baldic.Mixins.PatchMethod ilmanipulator = null);
public void PatchAll(System.Type type);
public void PatchAll(System.Reflection.Assembly assembly);
public System.Reflection.MethodInfo ReversePatch(System.Reflection.MethodBase original, System.Reflection.MethodInfo standin, bool snapshot = false);
public static System.Collections.Generic.IEnumerable<string> GetOwners(System.Reflection.MethodBase original);
public static System.Collections.Generic.IEnumerable<Baldic.Mixins.CodeInstruction> GetCurrentInstructions(System.Reflection.MethodBase original);
public void UnpatchSelf();
public void Unpatch(System.Reflection.MethodBase original, Baldic.Mixins.PatchKind kind, string owner = null);
public void Unpatch(System.Reflection.MethodBase original, System.Reflection.MethodInfo callback);
public void Dispose();
```

## `PostfixAttribute`

`Baldic.Mixins.PostfixAttribute`

```text
public sealed class PostfixAttribute : HarmonyLib.HarmonyPostfix
public PostfixAttribute();
```

## `PrefixAttribute`

`Baldic.Mixins.PrefixAttribute`

```text
public sealed class PrefixAttribute : HarmonyLib.HarmonyPrefix
public PrefixAttribute();
```

## `PrepareAttribute`

`Baldic.Mixins.PrepareAttribute`

```text
public sealed class PrepareAttribute : HarmonyLib.HarmonyPrepare
public PrepareAttribute();
```

## `PriorityAttribute`

`Baldic.Mixins.PriorityAttribute`

```text
public sealed class PriorityAttribute : HarmonyLib.HarmonyPriority
public PriorityAttribute(int priority);
```

## `ReversePatchAttribute`

`Baldic.Mixins.ReversePatchAttribute`

```text
public sealed class ReversePatchAttribute : HarmonyLib.HarmonyReversePatch
public ReversePatchAttribute(bool snapshot = false);
```

## `TargetMethodAttribute`

`Baldic.Mixins.TargetMethodAttribute`

```text
public sealed class TargetMethodAttribute : HarmonyLib.HarmonyTargetMethod
public TargetMethodAttribute();
```

## `TargetMethodsAttribute`

`Baldic.Mixins.TargetMethodsAttribute`

```text
public sealed class TargetMethodsAttribute : HarmonyLib.HarmonyTargetMethods
public TargetMethodsAttribute();
```

## `TranspilerAttribute`

`Baldic.Mixins.TranspilerAttribute`

```text
public sealed class TranspilerAttribute : HarmonyLib.HarmonyTranspiler
public TranspilerAttribute();
```
