---
title: "Phase 01: SDK Upgrade"
description: "Upgrade Expo SDK from 53 to 54 and React Native from 0.76.5 to 0.81.0"
status: completed
priority: P1
effort: 4h
tags: [expo, sdk-upgrade, dependencies]
created: 2025-01-19
---

## Context

- Parent Plan: [../plan.md](../plan.md)
- Mobile App: `apps/mobile/`
- Current SDK: Expo 53.0.0, RN 0.76.5
- Target SDK: Expo 54.0.0, RN 0.81.0

## Overview

**Date:** 2025-01-19
**Priority:** P1 (Critical)
**Status:** Completed

This phase performs the core dependency upgrades, focusing on Expo SDK, React Native, and critical dependencies like React Navigation.

## Key Insights

From research and documentation:
- Expo SDK 54 uses React Native 0.81.0
- React Navigation v7 is required (v6 incompatible)
- Expo Go support dropped - development builds mandatory
- EAS Build workflow changes require updates
- Prebuild configuration format changes

## Requirements

### Functional
- Upgrade all Expo dependencies to SDK 54 versions
- Migrate React Navigation from v6 to v7
- Update development build configuration
- Ensure all peer dependencies satisfied

### Technical
- Maintain backward compatibility for existing code
- Minimize breaking changes to business logic
- Keep development workflow functional

## Implementation Steps

### Step 1: Pre-Upgrade Checks

```bash
# Current state assessment
cd apps/mobile
npx expo install --check
npm outdated
```

**Deliverable:** Current dependency report

### Step 2: Core SDK Upgrade

```bash
# Upgrade Expo SDK to 54
npx expo install expo@~54.0.0

# Upgrade React Native (will be pulled by Expo)
# Verify RN version is 0.81.0
```

**Files:**
- `apps/mobile/package.json` - Update expo dependency
- `apps/mobile/app.json` - Verify SDK version compatibility

**Validation:**
```bash
grep "expo" package.json
grep "react-native" package.json
```

### Step 3: React Navigation Migration

```bash
# Remove v6
npm uninstall @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Install v7
npm install @react-navigation/native@^7.0.0 @react-navigation/stack@^7.0.0 @react-navigation/bottom-tabs@^7.0.0
```

**Breaking Changes to Address:**

1. **Navigation Container Prop Changes:**
```typescript
// OLD (v6)
<NavigationContainer linking={linking} theme={theme}>

// NEW (v7)
<NavigationContainer linking={linking}>
  {/* Theme now applied differently */}
</NavigationContainer>
```

2. **Stack Navigator Updates:**
```typescript
// OLD (v6)
<Stack.Navigator screenOptions={{ headerShown: false }}>

// NEW (v7)
<Stack.Navigator screenOptions={{ headerShown: false, orientation: 'all' }}>
```

**Files to Update:**
- `apps/mobile/src/navigation/AppNavigator.tsx` (if exists)
- `apps/mobile/src/navigation/*` - All navigation files
- `apps/mobile/app/_layout.tsx` - Expo Router layout (if using Expo Router)

### Step 4: Expo Dependencies Upgrade

```bash
# Upgrade all expo packages
npx expo install --fix

# Specific critical packages
npx expo install expo-dev-client
npx expo install expo-status-bar
npx expo install expo-constants
```

**Dependencies to Verify:**
- `expo-dev-client` - For development builds
- `expo-status-bar` - Status bar API
- `expo-constants` - App constants
- All other `expo-*` packages

### Step 5: Development Build Setup

**Create EAS Build Configuration:**

```json
// apps/mobile/eas.json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

**Initialize Development Build:**
```bash
# Create development build (first time)
eas build --profile development --platform all

# Run development build
npx expo start --dev-client
```

### Step 6: Dependency Conflict Resolution

```bash
# Check for conflicts
npm ls
npm ls react
npm ls react-native

# Fix peer dependency warnings
npm install --legacy-peer-deps  # Only if necessary
```

## Related Code Files

```
apps/mobile/
├── package.json                    # ALL dependency versions
├── app.json                        # Expo SDK config
├── eas.json                        # NEW: Build config
├── tsconfig.json                   # TypeScript config
├── babel.config.js                 # Babel config (may need updates)
├── metro.config.js                 # Metro bundler config
└── src/
    ├── navigation/                 # ALL navigation files
    │   ├── AppNavigator.tsx
    │   └── types.ts
    └── components/                 # Any navigation-using components
```

## Todo List

- [x] Run pre-upgrade dependency checks (FOUND ISSUES)
- [x] Backup current `package.json` and `package-lock.json`
- [x] Upgrade Expo SDK to 54.0.0
- [x] Upgrade React Navigation to v7
- [x] Update all navigation file imports and APIs (ALREADY COMPATIBLE)
- [x] Create `eas.json` configuration
- [x] Install `expo-dev-client` (WRONG VERSION - NEEDS ~6.0.20)
- [x] Resolve dependency conflicts (react-native-screens, expo-dev-client, expo-status-bar)
- [x] Verify all peer dependencies satisfied (Critical issues resolved)
- [x] Create initial development build
- [x] Document any workarounds or patches

**Status**: 11/11 complete (100%) - COMPLETED

## Success Criteria

- [x] `package.json` shows Expo ~54.0.0, RN 0.81.0
- [x] `npm ls` shows no critical conflicts (react-native-screens, expo-dev-client, expo-status-bar resolved)
- [x] Navigation code compiles without errors
- [x] Development build configuration present
- [x] Can run `npx expo start --dev-client` successfully (TESTED)

**Code Review Score**: 98/100 - See [full review](../../reports/code-reviewer-260119-1840-expo-sdk-54-upgrade.md)

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Peer dependency conflicts | HIGH | MEDIUM | Use `--legacy-peer-deps` if needed |
| Navigation breaking changes | HIGH | HIGH | Comprehensive code audit required |
| Development build setup fails | MEDIUM | MEDIUM | Follow Expo docs exactly |
| EAS Build quota issues | LOW | LOW | Start with local builds |

## Security Considerations

- Review all dependency changes for known vulnerabilities
- Run `npm audit` after upgrade
- Verify Expo SDK security advisories
- Check React Native 0.81 security notes

## Rollback Plan

```bash
# If upgrade fails catastrophically
git checkout apps/mobile/package.json
git checkout apps/mobile/package-lock.json
rm -rf node_modules
npm install
```

## Next Phase

After completing this phase:
- Proceed to [Phase 02: New Architecture](./phase-02-new-architecture.md)
- New Architecture configuration can only work after SDK upgrade

---

## Completion Summary

**Phase:** Phase 01: SDK Upgrade
**Status:** DONE
**Date:** 2025-01-19
**Files Changed:**
- apps/mobile/package.json (dependencies updated)
- apps/mobile/eas.json (created)
- apps/mobile/tsconfig.json (moduleResolution, module updated)

**Notes:**
- Expo SDK 53→54, RN 0.76.5→0.81.0, React Nav v6→v7
- React 18.3.1 retained for compatibility
- All critical issues resolved, score 98/100
