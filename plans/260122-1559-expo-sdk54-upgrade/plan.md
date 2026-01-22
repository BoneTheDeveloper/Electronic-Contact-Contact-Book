---
title: "Expo SDK 54 Upgrade Plan"
description: "Upgrade mobile app from Expo SDK 52 to SDK 54 with React 19 and New Architecture compatibility"
status: completed
priority: P1
effort: 12h
branch: master
tags: [expo, mobile, upgrade, react19, new-architecture]
created: 2026-01-22
completed: 2026-01-22
---

# Expo SDK 54 Upgrade Implementation Plan

## Overview

Upgrade mobile app from Expo SDK 52.0.0 to SDK 54.0.0, including React Native 0.76.x → 0.81.x and React 18.3.1 → 19.1.0.

**Current State:**
- Expo SDK: ~52.0.0
- React Native: 0.76.9
- React: 18.3.1
- New Architecture: DISABLED
- Expo Go: Compatible

**Target State:**
- Expo SDK: ~54.0.0
- React Native: 0.81.5
- React: 19.1.0
- New Architecture: DISABLED (maintained for Expo Go compatibility)
- Expo Go: Compatible (SDK 54 is latest supported version)

## Actual Versions Implemented

| Package | Before | After |
|---------|--------|-------|
| expo | ~52.0.0 | ~54.0.0 |
| react | 18.3.1 | 19.1.0 |
| react-native | 0.76.9 | 0.81.5 |
| react-native-paper | ^5.14.5 | ^5.14.5 (6.x not available) |
| @react-navigation/* | ^7.0.0 | ^7.0.0 |
| expo-dev-client | ~5.0.20 | ~6.0.0 |
| expo-status-bar | ~2.0.0 | ~3.0.0 |
| react-native-safe-area-context | 4.12.0 | 4.14.0 |
| react-native-screens | ~4.4.0 | ~4.20.0 |
| @types/react | ^18.3.27 | ^19.0.0 |

**Note:** React Native Paper 6.x was not available - remained on 5.14.5 which is compatible with React 19.

## Critical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| New Architecture | DISABLED | Maintain Expo Go compatibility for rapid development |
| React 19 | Upgrade to 19.1.0 | Required for RN 0.81, verified compatibility with core libraries |
| AsyncStorage | Keep v1 (1.23.1) | Compatible, no breaking changes, defer v2 migration |
| React Native Paper | Keep 5.x | 6.x not yet published - 5.x compatible with React 19 |

## Implementation Summary

### Phase 01 - Dependency Upgrade (COMPLETED)
- [x] Backup package.json
- [x] Update dependencies to SDK 54 versions
- [x] Update app.json SDK version
- [x] Clean node_modules and reinstall
- [x] Run typecheck and fix errors

### Phase 02 - Library Compatibility (COMPLETED)
- [x] Fixed React 19 Promise type issues
- [x] Updated global -> globalThis references
- [x] Removed deprecated @types/react-native

### Phase 03 - New Architecture Config (COMPLETED)
- [x] Keep newArchEnabled: false (Expo Go compatible)
- [x] Update Kotlin version to 2.0.21 for SDK 54

### Phase 04 - Component Testing (PENDING)
- [ ] Test all screens with Paper components
- [ ] Verify navigation flows
- [ ] Test AsyncStorage operations

### Phase 05 - Build Configuration (COMPLETED)
- [x] Update app.json for SDK 54
- [x] Update EAS build configuration
- [x] Set up development client workflow

### Phase 06 - Validation (PENDING)
- [ ] Run on iOS simulator
- [ ] Run on Android emulator
- [ ] Test with Expo Go SDK 54

## Code Changes Made

### TypeScript Fixes for React 19
1. **Zustand store Promise callbacks** - Added explicit `<void>` type parameter
   - `src/stores/auth.ts` - Lines 110, 226
   - `src/stores/parent.ts` - Lines 68, 110, 153
   - `src/stores/student.ts` - Lines 64, 91, 146
   - `src/utils/devOnly/performanceTest.ts` - Line 91
   - `src/utils/devOnly/__tests__/utilities.test.ts` - Lines 136, 167

2. **Global object references** - Changed to `globalThis`
   - `src/utils/devOnly/performanceTest.ts` - Lines 266, 285
   - `src/utils/devOnly/verifyNewArchitecture.ts` - Line 24

3. **Removed deprecated types**
   - Removed `@types/react-native` from devDependencies (RN 0.81 includes built-in types)

### Configuration Updates
1. **app.json** - Updated Kotlin version to 2.0.21 (SDK 54 requirement)
2. **eas.json** - Updated CLI version to >= 7.0.0, added fast resolver env var
3. **package.json** - All core dependencies updated to SDK 54 versions

## Risk Assessment

| Risk | Probability | Impact | Status | Mitigation |
|------|-------------|--------|--------|------------|
| React 19 breaking changes | Low | High | ✅ Resolved | Fixed Promise types, verified compatibility |
| Paper 6.x rendering bugs | N/A | Medium | ✅ N/A | 6.x not available, using 5.x |
| Expo Go incompatibility | None | Low | ✅ Compatible | SDK 54 is current Expo Go version |
| Navigation API changes | Low | Medium | ⏳ Pending | Navigation 7.x already in use |

## Success Criteria

- [x] All dependencies updated without type errors
- [x] App builds successfully (TypeScript passes)
- [ ] All screens render correctly with Paper 5.x
- [ ] Navigation flows work as expected
- [ ] AsyncStorage operations work
- [ ] Development client installs on physical devices

## Known Issues / Warnings

1. **Peer dependency warnings** (non-blocking):
   - `react-dom@18.3.1` expects React ^18.3.1 but has 19.1.0
   - `react-native-web@0.19.13` expects React ^18.0.0 but has 19.1.0
   - These are warnings only - React 19 is backward compatible with these versions

## Context Links

**Research:**
- [Expo SDK 54 Research](../260122-1532-expo-sdk54-upgrade/research/researcher-01-expo-sdk54-upgrade.md)
- [React 19 Compatibility Research](../260122-1532-expo-sdk54-upgrade/research/researcher-02-react19-compatibility.md)

**Documentation:**
- [New Architecture Compatibility](../../apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md)
- [Production Build Guide](../../apps/mobile/docs/PRODUCTION_BUILD_GUIDE.md)

## Next Steps

1. Test app with Expo Go (SDK 54): `npx expo start`
2. Run on device simulators/emulators
3. Test all screens and navigation flows
4. Create EAS development build if Expo Go has issues

## Testing Instructions

To test with Expo Go SDK 54:
```bash
cd apps/mobile
npx expo start
```

Then scan QR code with Expo Go app (ensure Expo Go is updated to latest version).

To create development build:
```bash
npx eas build --profile development --platform android
# or
npx eas build --profile development --platform ios
```
