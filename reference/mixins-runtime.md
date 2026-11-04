# Mixins: контексты и операции

Сборка: `Baldic.Loader.dll`. Ниже — объявленные публичные и protected-контракты текущей сборки. Это справочник подписей, не готовый исходный файл; унаследованные Unity/.NET-члены повторно не перечисляются. Служебные компоненты с публичной видимостью также показаны: создавать runtime-драйверы вручную не требуется.

[К разделу руководства](../mixins/README.md) · [Как читать справочник](README.md)

## `InjectAttribute`

`Baldic.InjectAttribute`

```text
public sealed class InjectAttribute : Baldic.MixinAttribute
public Baldic.Mixins.At At { get; }
public InjectAttribute(string target, Baldic.Mixins.At at = (Baldic.Mixins.At)0);
```

## `MixinAttribute`

`Baldic.MixinAttribute`

```text
public abstract class MixinAttribute : System.Attribute
public string Target { get; }
public int Priority { get; set; }
public string When { get; set; }
protected MixinAttribute(string target);
```

## `At`

`Baldic.Mixins.At`

```text
public enum At
public const Baldic.Mixins.At Head = (Baldic.Mixins.At)0;
public const Baldic.Mixins.At Tail = (Baldic.Mixins.At)1;
public const Baldic.Mixins.At Return = (Baldic.Mixins.At)2;
```

## `HookContext`

`Baldic.Mixins.HookContext`

```text
public sealed class HookContext
public object Instance { get; }
public object[] Args { get; }
public object Result { get; set; }
public object ReturnValue { get; }
public bool Cancelled { get; }
public bool RunOriginal { get; }
public void SetReturn(object value);
public T Arg<T>(int i);
public void SetArg(int i, object value);
public void Cancel();
public void Cancel(object value);
public object CallOriginal();
public HookContext();
```

## `Mixin`

`Baldic.Mixins.Mixin`

```text
public static class Mixin
public static System.Reflection.MethodBase Target(string target);
public static System.IDisposable Patch(System.Reflection.MethodBase target, System.Reflection.MethodInfo prefix = null, System.Reflection.MethodInfo postfix = null, System.Reflection.MethodInfo transpiler = null, System.Reflection.MethodInfo finalizer = null, int priority = 0, string owner = null);
public static Baldic.Mixins.AccessTools.FieldRef<T, F> FieldRef<T, F>(string field) where T : class;
public static T MethodDelegate<T>(System.Reflection.MethodInfo method, object instance = null, bool virtualCall = true) where T : System.Delegate;
public static Baldic.Mixins.HookContext CurrentState(System.Reflection.MethodBase method);
public static System.Reflection.MethodInfo Method(string target);
public static System.IDisposable Inject(string target, Baldic.Mixins.At at, System.Action<Baldic.Mixins.HookContext> callback, int priority = 0, string owner = null);
public static System.IDisposable Inject(System.Reflection.MethodBase target, Baldic.Mixins.At at, System.Action<Baldic.Mixins.HookContext> callback, int priority = 0, string owner = null);
public static System.IDisposable Replace(string target, System.Func<Baldic.Mixins.HookContext, object> callback, int priority = 0, string owner = null, System.Func<bool> when = null);
public static System.IDisposable ModifyReturn(string target, System.Func<object, object> callback, int priority = 0, string owner = null);
public static System.IDisposable ModifyArg(string target, int arg, System.Func<object, object> callback, int priority = 0, string owner = null);
public static bool PrefixVoid(object __instance, object[] __args, System.Reflection.MethodBase __originalMethod, bool __runOriginal, ref Baldic.Mixins.HookContext __state);
public static bool Prefix<T>(object __instance, object[] __args, System.Reflection.MethodBase __originalMethod, bool __runOriginal, ref T __result, ref Baldic.Mixins.HookContext __state);
public static void PostfixVoid(System.Reflection.MethodBase __originalMethod, Baldic.Mixins.HookContext __state, bool __runOriginal, object[] args);
public static void Postfix<T>(System.Reflection.MethodBase __originalMethod, Baldic.Mixins.HookContext __state, bool __runOriginal, ref T __result, object[] args);
public static T Coerce<T>(object value);
public static System.Exception Finalizer(System.Exception __exception, System.Reflection.MethodBase __originalMethod);
public static Baldic.Mixins.Mixin.PatchSet CreatePatches(string owner, Baldic.ModContext context = null);
public static System.IDisposable Redirect(string caller, string target, System.Func<Baldic.Mixins.HookContext, object> callback, int priority = 0, string owner = null);
public static System.IDisposable Redirect(System.Reflection.MethodBase caller, System.Reflection.MethodInfo target, System.Func<Baldic.Mixins.HookContext, object> callback, int priority = 0, string owner = null);
public static object RunRedirect(int id, object instance, object[] args);
public static System.IDisposable WrapOperation(System.Reflection.MethodBase caller, System.Reflection.MethodInfo operation, System.Reflection.MethodInfo wrapper, int ordinal = -1, int expectedMatches = 1, int priority = 0, string owner = null);
public static System.IDisposable ModifyExpressionValue(System.Reflection.MethodBase caller, System.Reflection.MemberInfo expression, System.Reflection.MethodInfo modifier, int ordinal = -1, int expectedMatches = 1, int priority = 0, string owner = null);
public static System.IDisposable ModifyConstant<T>(System.Reflection.MethodBase caller, T constant, System.Reflection.MethodInfo modifier, int ordinal = -1, int expectedMatches = 1, int priority = 0, string owner = null);
public static System.IDisposable ModifyLocal(System.Reflection.MethodBase caller, int localIndex, Baldic.Mixins.Mixin.LocalAccess access, System.Reflection.MethodInfo modifier, int ordinal = -1, int expectedMatches = 1, int priority = 0, string owner = null);
```

## `LocalAccess`

`Baldic.Mixins.Mixin.LocalAccess`

```text
public enum LocalAccess
public const Baldic.Mixins.Mixin.LocalAccess Load = (Baldic.Mixins.Mixin.LocalAccess)0;
public const Baldic.Mixins.Mixin.LocalAccess Store = (Baldic.Mixins.Mixin.LocalAccess)1;
```

## `PatchSet`

`Baldic.Mixins.Mixin.PatchSet`

```text
public sealed class PatchSet : System.IDisposable
public void Patch(System.Reflection.MethodBase target, Baldic.Mixins.PatchMethod prefix = null, Baldic.Mixins.PatchMethod postfix = null, Baldic.Mixins.PatchMethod transpiler = null, Baldic.Mixins.PatchMethod finalizer = null);
public void PatchAll(System.Type type);
public void Dispose();
```

## `ModifyArgAttribute`

`Baldic.ModifyArgAttribute`

```text
public sealed class ModifyArgAttribute : Baldic.MixinAttribute
public int Index { get; }
public ModifyArgAttribute(string target, int index);
```

## `ModifyReturnAttribute`

`Baldic.ModifyReturnAttribute`

```text
public sealed class ModifyReturnAttribute : Baldic.MixinAttribute
public ModifyReturnAttribute(string target);
```

## `RedirectAttribute`

`Baldic.RedirectAttribute`

```text
public sealed class RedirectAttribute : Baldic.MixinAttribute
public string Callee { get; }
public RedirectAttribute(string target, string callee);
```

## `ReplaceAttribute`

`Baldic.ReplaceAttribute`

```text
public sealed class ReplaceAttribute : Baldic.MixinAttribute
public ReplaceAttribute(string target);
```
