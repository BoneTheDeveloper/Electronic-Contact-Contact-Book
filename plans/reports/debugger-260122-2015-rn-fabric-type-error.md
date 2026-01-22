# Debugging Report: React Native Fabric TypeError
**Date:** 2026-01-22
**ID:** debugger-260122-2015-rn-fabric-type-error
**Type:** Fabric/New Architecture Compatibility Issue

---

## Executive Summary

**Issue:** `TypeError: expected dynamic type 'boolean', but had type 'string'` in React Native Fabric

**Root Cause:** `underlineStyle={{ display: 'none' }}` prop passed to react-native-paper's `TextInput` component. The `display: 'none'` value is a STRING, but React Native Fabric's underlying native component expects a BOOLEAN for certain style properties.

**Impact:** App crash on screens using CustomLoginScreen with TextInput components

**Status:** Root cause identified, fix ready

---

## Root Cause Analysis

### 1. Error Location

**File:** `C:/Project/electric_contact_book/apps/mobile/src/screens/auth/CustomLoginScreen.tsx`

**Affected Lines:**
- Line 203: `underlineStyle={{ display: 'none' }}`
- Line 219: `underlineStyle={{ display: 'none' }}`
- Line 363: `underlineStyle={{ display: 'none' }}`
- Line 417: `underlineStyle={{ display: 'none' }}`
- Line 593: `underlineStyle={{ display: 'none' }}`
- Line 616: `underlineStyle={{ display: 'none' }}`

### 2. Technical Explanation

**Problem Chain:**
1. **react-native-paper** v5.14.5 `TextInput` component accepts `underlineStyle` prop
2. In **React Native 0.81** with **Fabric enabled**, style props are passed directly to native components
3. Fabric's type validation is stricter than the old renderer
4. `display: 'none'` (string) conflicts with native prop type expectations
5. Error: `TypeError: expected dynamic type 'boolean', but had type 'string'`

**Why Now?**
- Expo SDK 54.0.0 uses React Native 0.81.5
- React Native 0.81 enables Fabric/New Architecture by default
- React 19.1.0 changes internal prop handling
- react-native-paper 5.14.5 doesn't fully support RN 0.81 + Fabric yet

### 3. Known Compatibility Issues

Based on web search, multiple issues exist between react-native-paper 5.14.5 and RN 0.81:

- [Issue #4797](https://github.com/callstack/react-native-paper/issues/4797): Support request for RN 0.81
- [Issue #4807](https://github.com/callstack/react-native-paper/issues/4807): Menu can only be opened once
- [Issue #4810](https://github.com/callstack/react-native-paper/issues/4810): TouchableRipple not working
- [Issue #4814](https://github.com/callstack/react-native-paper/issues/4814): Menu flashes on Android

---

## Recommended Fixes

### Fix 1: Remove underlineStyle (Recommended)

**Change all instances from:**
```tsx
<TextInput
  underlineStyle={{ display: 'none' }}
  mode="flat"
  ...
/>
```

**To:**
```tsx
<TextInput
  mode="flat"
  ...
/>
```

**Why:** `mode="flat"` in react-native-paper already removes the underline. The `underlineStyle` prop is unnecessary and causes the Fabric type error.

### Fix 2: Use mode="outlined" Instead

If you want visible borders:
```tsx
<TextInput
  mode="outlined"
  ...
/>
```

### Fix 3: Disable Fabric (Temporary Workaround)

Not recommended as it defeats the purpose of upgrading to RN 0.81.

---

## Implementation Plan

### Phase 1: Fix underlineStyle Usage
1. Remove all `underlineStyle={{ display: 'none' }}` from CustomLoginScreen.tsx
2. Test on Android/iOS development builds
3. Verify no more Fabric type errors

### Phase 2: Audit Other Screens
1. Search all `.tsx` files for `underlineStyle` usage
2. Apply same fix pattern
3. Full regression test

### Phase 3: Monitor react-native-paper Updates
1. Watch [Issue #4797](https://github.com/callstack/react-native-paper/issues/4797) for official RN 0.81 support
2. Upgrade when stable version available

---

## Affected Files

| File | Lines | Action |
|------|-------|--------|
| `src/screens/auth/CustomLoginScreen.tsx` | 203, 219, 363, 417, 593, 616 | Remove `underlineStyle` prop |
| `src/screens/auth/LoginScreen.tsx` | None found | No action needed |
| `src/screens/parent/LeaveRequest.tsx` | None found | No action needed |

---

## Testing Strategy

1. **Unit Test:** Run app with CustomLoginScreen as entry point
2. **Integration Test:** Navigate through all login flows (login, forgot password, OTP, change password)
3. **Platform Test:** Test on both Android and iOS dev clients
4. **Regression Test:** Verify no new issues introduced

---

## Prevention

1. **Add ESLint rule** to catch `underlineStyle` with `display: 'none'`
2. **Code review checklist:** Verify no Fabric-incompatible props
3. **Stay updated** on react-native-paper Fabric compatibility progress

---

## Unresolved Questions

1. Are there other style props causing similar issues in react-native-paper components?
2. Should we downgrade to RN 0.76-0.77 range for stability until react-native-paper fully supports RN 0.81?
3. What is the timeline for official react-native-paper RN 0.81 support?

---

## Sources

- [React Native Paper Issue #4797 - Support for React Native 0.81](https://github.com/callstack/react-native-paper/issues/4797)
- [React Native Paper Issue #4807 - Menu can only be opened once](https://github.com/callstack/react-native-paper/issues/4807)
- [React Native Paper Issue #4810 - TouchableRipple not working](https://github.com/callstack/react-native-paper/issues/4810)
- [React Native Paper Issue #4814 - Menu flashes on Android](https://github.com/callstack/react-native-paper/issues/4814)
- [React Native Paper Documentation - TextInput Component](https://callstack.github.io/react-native-paper/docs/components/TextInput/)
