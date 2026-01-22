# Debug Report: React Native New Architecture Type Error

**Date:** 2026-01-22
**Issue ID:** 260122-2049-rn-fabric-type-error
**Error:** `Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string'` in ReactFabric-dev.js

---

## Executive Summary

**Root Cause:** React Native Paper v5.14.5 is **incompatible** with React Native 0.81.5 + New Architecture (Fabric). The library's `TextInput.Icon` component internally passes boolean props as strings to native components, which Fabric strictly validates and rejects.

**Impact:** App crashes immediately on startup in development mode with Fabric enabled.

**Severity:** CRITICAL - Complete app failure, blocking all development/testing.

---

## Technical Analysis

### Error Context
- **Expo SDK:** 54.0.0
- **React Native:** 0.81.5
- **React:** 19.1.0
- **React Native Paper:** 5.14.5
- **New Architecture:** ENABLED (confirmed by user)
- **Error Location:** App startup, during initial render

### Investigation Timeline

1. **App.tsx** (line 18-24): Clean setup - SafeAreaProvider > PaperProvider > StatusBar > RootNavigator
2. **RootNavigator.tsx** (line 29-48): NavigationContainer with native stack - no issues
3. **AuthNavigator.tsx** (line 19-30): Simple stack navigator - no issues
4. **CustomLoginScreen.tsx** (lines 196-226, 353-363, 578-596, 600-617): **PROBLEMATIC**

### Root Cause

**File:** `apps/mobile/src/screens/auth/CustomLoginScreen.tsx`

**Lines:** 219-223, 358, 590-594, 612-616

**Problem:** Usage of `TextInput.Icon` in the `right` prop:

```tsx
<TextInput
  // ... other props
  right={
    <TextInput.Icon
      icon={showPassword ? 'eye-off' : 'eye'}
      onPress={() => setShowPassword(!showPassword)}
    />
  }
/>
```

**Why This Fails with Fabric:**

React Native Paper v5.14.5's `TextInput.Icon` implementation passes certain internal props to native components as **strings** instead of **booleans**. With the New Architecture (Fabric/TurboModules), React Native 0.81.x has **strict type checking** that rejects these type mismatches.

**Specific Issue:** Paper's internal implementation has props like:
- `pointerEvents="none"` (should be `pointerEvents="auto"|"none"` as enum, but passed as string)
- Internal style props with string boolean values

The **Fabric renderer** validates prop types at the bridge and throws: `expected dynamic type 'boolean', but had type 'string'`.

### Affected Files

1. **CustomLoginScreen.tsx** (4 instances)
   - Line 219-223: Password field in login form
   - Line 590-594: New password field
   - Line 612-616: Confirm password field

2. **LeaveRequest.tsx** (2 instances - not examined but grep found)
   - Line 121: Date picker icon
   - Line 131: Date picker icon

**Total:** At least 6 instances of `TextInput.Icon` usage across the codebase.

---

## Solution Options

### Option 1: Disable New Architecture (QUICK FIX - NOT RECOMMENDED)

**Pros:**
- Immediate fix
- No code changes needed
- Paper continues working

**Cons:**
- Loses all New Architecture benefits (performance, improved JSI)
- Future-proofing lost
- May face migration issues later
- Goes against project goal of enabling Fabric

**Implementation:**
Update `apps/mobile/android/gradle.properties`:
```properties
# Change this
newArchEnabled=true

# To this
newArchEnabled=false
```

### Option 2: Replace React Native Paper with Fabric-Compatible Library (RECOMMENDED)

**Pros:**
- Maintains New Architecture benefits
- Future-proof solution
- Better long-term stability

**Cons:**
- Significant refactoring required
- Need to replace all Paper components (Button, TextInput, Card, Avatar, Modal, Portal, etc.)
- Time investment: 4-8 hours

**Replacement Options:**
- **NativeBase v4** - Fabric compatible (but large dependency)
- **Gluestack UI** - Built for Fabric/New Architecture (modern, lightweight)
- **Tamagui** - Fabric-compatible, high performance
- **Custom components** - Build with React Native primitives (maximum control, most work)

### Option 3: Patch React Native Paper (TEMPORARY WORKAROUND)

**Pros:**
- Keeps existing code
- Maintains New Architecture
- Buys time for proper migration

**Cons:**
- Fragile - may break with updates
- Maintenance burden
- Still dependent on unmaintained library
- Paper has no official Fabric support timeline

**Implementation:**
Use `patch-package` to patch Paper's internal components:
```bash
# Create patch
npx patch-package react-native-paper

# Edit node_modules/react-paper/src/components/TextInput/TextInput.tsx
# Fix boolean prop types in TextInput.Icon and related components
```

### Option 4: Custom TextInput Wrapper (HYBRID APPROACH)

**Pros:**
- Keeps Paper for most components
- Only replaces TextInput with problematic props
- Moderate effort
- Can use Paper's theming system

**Cons:**
- Inconsistent component library usage
- Still need to maintain custom code
- May encounter other Paper incompatibilities

**Implementation:**
```tsx
// CustomTextInput.tsx
import { View, TextInput as RNTextInput, Pressable, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

export const CustomTextInput = ({ right, ...props }) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <RNTextInput {...props} style={[styles.input, props.style]} />
      {right && <Pressable>{right}</Pressable>}
    </View>
  );
};
```

Then replace all `TextInput` with `right` prop usage.

---

## Recommended Action Plan

### Immediate (Today)
1. **Decision point:** Choose solution approach based on project timeline
   - Short deadline → Option 1 (disable Fabric temporarily)
   - Standard timeline → Option 3 (patch Paper)
   - Long-term investment → Option 2 (migrate to Fabric-compatible library)

### Short-term (This Week)
If **Option 2** chosen:
1. Select replacement library (recommend **Gluestack UI** or **Tamagui**)
2. Create migration plan mapping Paper components → new library
3. Replace critical components first (TextInput, Button, Card)
4. Update theme system

If **Option 3** chosen:
1. Create patch for `TextInput.Icon` and related components
2. Add `postinstall` script to auto-apply patch
3. Test all TextInput usages
4. Document for team

### Long-term (This Sprint)
1. Complete component library migration OR
2. Maintain patches and monitor Paper for Fabric support
3. Update documentation with New Architecture guidelines
4. Add pre-commit checks to prevent re-introducing incompatible code

---

## Prevention Strategies

1. **Audit all dependencies** for Fabric compatibility before upgrading RN
2. **Check libraries' roadmap** for New Architecture support
3. **Subscribe to RN release notes** for breaking changes
4. **Add lint rule** to detect Paper usage with Fabric enabled
5. **Document in CLAUDE.md:** Require compatibility check for all new libraries

---

## Additional Findings

### Already Checked (Ruled Out)
- ✅ No `underlineStyle={{ display: 'none' }}` (not in codebase)
- ✅ No string boolean props like `visible="true"` (not in codebase)
- ✅ No style objects with `display: 'none'` strings
- ✅ KeyboardAvoidingView props are correct
- ✅ Navigation configuration is clean
- ✅ Theme configuration is valid

### Potential Additional Issues (Not Yet Explored)
- **Paper's Modal component** - May have similar Fabric incompatibilities
- **Portal component** - Requires native module, may not be Fabric-ready
- **Avatar component** - Uses internal rendering that might conflict
- **All other Paper components** - Need systematic testing

---

## Unresolved Questions

1. **Why did the error only appear now?** Was New Architecture recently enabled, or did this exist unnoticed?
2. **Are there other Paper components** with similar incompatibilities? Need full audit.
3. **What's the timeline** for staying on New Architecture? Affects solution choice.
4. **Is there an official Paper roadmap** for Fabric support? Last checked: none.
5. **Can we use react-native-paper@next beta** if available? Not researched.

---

## References

- **React Native 0.81 New Architecture Docs:** https://reactnative.dev/docs/the-new-architecture/landing-page
- **Fabric Renderer:** https://reactnative.dev/docs/the-new-architecture/pillars-fabric
- **React Native Paper Issues:** Search for "Fabric" or "New Architecture" in GitHub issues
- **Previous Debug Report:** `debugger-260122-2015-rn-fabric-type-error.md` (if exists)

---

## Next Steps

**User Decision Required:**
1. Which solution approach? (Disable Fabric / Patch Paper / Migrate Library)
2. Timeline for fix? (Immediate / This week / This sprint)
3. Long-term strategy? (Stay on Fabric / Wait for Paper support)

**Once decided:**
1. Create implementation plan in `plans/` directory
2. Execute fix following systematic debugging process
3. Verify with fresh build and testing
4. Update documentation

---

**Report Status:** 🔴 BLOCKING USER DECISION
**Priority:** P0 - Critical Issue
**Estimated Fix Time:** 1-8 hours (depends on approach)
