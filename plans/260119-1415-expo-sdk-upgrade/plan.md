# [Upgrade] Expo SDK 50 → 54

**Date**: 2026-01-19
**Type**: Dependency Upgrade
**Priority**: High
**Component**: Mobile App (apps/mobile)

## Executive Summary
Mobile app uses Expo SDK 50 but Expo Go requires SDK 54. Upgrade to latest SDK for compatibility.

## Current State

### Dependencies (SDK 50)
```json
{
  "expo": "~50.0.0",
  "expo-status-bar": "~1.11.1",
  "react": "18.2.0",
  "react-native": "0.73.6",
  "react-native-safe-area-context": "4.8.2",
  "react-native-screens": "~3.29.0",
  "react-native-svg": "^15.15.1"
}
```

### Target State (SDK 54)
According to [Expo SDK 54 changelog](https://docs.expo.dev/changelog/2024/10-16-sdk-54/):
- `expo`: ^54.0.0
- `expo-status-bar`: ~2.0.0
- `react`: 18.3.1
- `react-native`: 0.76.5
- `react-native-safe-area-context`: 4.12.0
- `react-native-screens`: ~4.4.0
- `react-native-svg`: 15.8.0

## Breaking Changes to Address

### 1. React Native 0.76 Architecture Changes
- New Architecture enabled by default
- Fabric & TurboModules required

### 2. Expo Modules Updates
- Some packages renamed or moved
- API changes in expo-status-bar, expo-asset

### 3. React Navigation Compatibility
- Verify React Native 0.76 compatibility
- May need minor adjustments

## Implementation Steps

1. [ ] Update package.json dependencies to SDK 54 versions
2. [ ] Run `npx expo install --fix` to auto-fix peer deps
3. [ ] Update babel.config.js if needed
4. [ ] Update app.json for new SDK requirements
5. [ ] Test compilation: `npx tsc --noEmit`
6. [ ] Test Metro bundler startup
7. [ ] Verify app runs in Expo Go (SDK 54)

## Verification Plan

- [ ] `pnpm install` succeeds without conflicts
- [ ] TypeScript compilation passes
- [ ] Metro bundler starts without errors
- [ ] Expo Go connects successfully
- [ ] App navigation works
- [ ] All screens render correctly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes in RN 0.76 | Medium | Test thoroughly, check React Navigation compat |
| Package conflicts | Medium | Use `expo install --fix` to resolve |
| App behavior changes | Low | Core features unlikely to break |

## Rollback Plan

If upgrade fails:
1. Restore package.json from git
2. Run `pnpm install` to restore previous versions

## TODO Checklist

- [ ] Update package.json
- [ ] Run expo install --fix
- [ ] Update app.json
- [ ] Test compilation
- [ ] Test in Expo Go
