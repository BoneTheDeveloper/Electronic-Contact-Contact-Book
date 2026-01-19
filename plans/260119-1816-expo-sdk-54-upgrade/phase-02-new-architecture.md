---
title: "Phase 02: New Architecture"
description: "Enable React Native New Architecture (Fabric/TurboModules) for bridgeless performance"
status: completed
priority: P1
effort: 3h
tags: [new-architecture, fabric, turbomodules, performance]
created: 2025-01-19
completed: 2026-01-19
---

## Context

- Parent Plan: [../plan.md](../plan.md)
- Mobile App: `apps/mobile/`
- Prerequisite: [Phase 01: SDK Upgrade](./phase-01-sdk-upgrade.md) complete
- Target: Enable New Architecture in RN 0.81

## Overview

**Date:** 2025-01-19
**Priority:** P1 (Critical)
**Status:** Pending

This phase enables React Native's New Architecture (Fabric + TurboModules), which removes the old bridge, improves performance, and enables modern React features.

## Key Insights

From React Native documentation:
- New Architecture requires explicit opt-in for existing projects
- Fabric replaces old view manager with C++ core
- TurboModules replace bridge-based native modules
- React Native 0.81 has stable New Architecture support
- All native modules must be updated or marked as legacy

## Requirements

### Functional
- Enable New Architecture in app configuration
- Configure Fabric for native views
- Set up TurboModule infrastructure
- Ensure third-party library compatibility

### Technical
- Maintain backward compatibility where possible
- Provide fallback for incompatible libraries
- Document any legacy modules retained

## Architecture Decisions

### New Architecture Components

1. **Fabric (New Render System)**
   - C++-based renderer
   - Synchronous native view updates
   - Improved memory management

2. **TurboModules (New Module System)**
   - JSI-based instead of bridge
   - Lazy loading of native modules
   - Better TypeScript support

3. **Codegen**
   - Generates type-safe native bindings
   - Autogenerates C++/ObjC/Java specs from JS

### Configuration Strategy

```typescript
// New Architecture flags
{
  "newArchEnabled": true,  // Enable Fabric/TurboModules
  "bridgeless": true       // Remove old bridge completely
}
```

## Implementation Steps

### Step 1: Verify RN 0.81 Installation

```bash
cd apps/mobile
grep "react-native" package.json
# Should show: "react-native": "0.81.0"
```

**Deliverable:** Confirmed RN 0.81.0 installed

### Step 2: Enable New Architecture in Config

**Update `app.json`:**

```json
{
  "expo": {
    "name": "econtact",
    "slug": "econtact",
    "version": "1.0.0",
    "newArchEnabled": true,
    "jsEngine": "hermes",
    "plugins": [
      [
        "expo-dev-client",
        {
          "newArchEnabled": true
        }
      ]
    ]
  }
}
```

**Create `react-native.config.js`:**

```javascript
module.exports = {
  dependencies: {
    'react-native-new-architecture': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
```

**Files:**
- `apps/mobile/app.json` - Add `newArchEnabled`
- `apps/mobile/react-native.config.js` - NEW FILE

### Step 3: Configure Hermes for New Architecture

**Verify Hermes configuration:**

```bash
# Ensure Hermes enabled (default in SDK 54)
grep "jsEngine" app.json
# Should be: "jsEngine": "hermes"
```

**Hermes + New Architecture Benefits:**
- Direct JSI access from C++
- No serialization overhead
- Improved startup time

### Step 4: Update Babel Configuration

**Update `babel.config.js`:**

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // Optional: If using resolver
      ['module-resolver', {
        alias: {
          '@': './src'
        }
      }]
    ],
  };
};
```

**Files:**
- `apps/mobile/babel.config.js` - Ensure plugin compatibility

### Step 5: Verify Third-Party Library Compatibility

**Check critical libraries:**

```bash
# Check which libraries support New Architecture
npx expo install --check

# Verify specific libraries
npm ls react-navigation
npm ls react-native-paper
npm ls react-native-reanimated
```

**Known Compatibility Status:**

| Library | New Arch Support | Action Needed |
|---------|------------------|---------------|
| React Navigation v7 | ✅ Yes | None |
| React Native Paper | ⚠️ Partial | May need patch |
| React Native Reanimated | ✅ Yes | None |
| Expo modules | ✅ Yes | Ensure latest |
| Custom native modules | ❌ No | Update to TurboModule |

**React Native Paper Patch:**

```bash
# If menu bug occurs
npm install patch-package
npx patch-package react-native-paper
```

### Step 6: Enable Codegen (If Using Custom Modules)

**Create `src/specs/NativeMyModule.ts`:**

```typescript
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  doSomething(input: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');
```

**Run Codegen:**

```bash
# Generate native bindings
npx react-native codegen
```

**Files:**
- `apps/mobile/src/specs/*` - Type definitions
- `apps/mobile/ios/*` - Generated iOS specs
- `apps/mobile/android/*` - Generated Android specs

### Step 7: Prebuild Configuration

**Generate native code:**

```bash
# Clear existing native code
rm -rf ios android

# Regenerate with New Architecture
npx expo prebuild --clean
```

**Verify Generated Files:**

```bash
# iOS
ls ios/NewArchitecture  # Should exist

# Android
cat android/gradle.properties | grep NewArch
# Should show: newArchEnabled=true
```

### Step 8: Development Build with New Architecture

**Build and test:**

```bash
# iOS development build
eas build --profile development --platform ios

# Android development build
eas build --profile development --platform android

# Or local builds
npx expo run:ios
npx expo run:android
```

**Verification:**

```typescript
// Add temporary check in app
import { NativeModules } from 'react-native';

console.log('New Architecture Enabled:', NativeModules.PlatformConstants?.isTurboModuleEnabled);
```

## Related Code Files

```
apps/mobile/
├── app.json                        # NEW: newArchEnabled flag
├── react-native.config.js          # NEW FILE
├── babel.config.js                 # UPDATE: plugin compatibility
├── ios/                            # GENERATED: New Architecture files
│   └── NewArchitecture/
├── android/                        # GENERATED: gradle updates
│   └── gradle.properties           # UPDATE: newArchEnabled
└── src/
    ├── specs/                      # NEW: TurboModule specs (if needed)
    └── components/                 # VERIFY: New Arch compatibility
```

## Todo List

- [ ] Verify React Native 0.81.0 installed
- [ ] Add `newArchEnabled: true` to `app.json`
- [ ] Create `react-native.config.js`
- [ ] Verify Hermes enabled
- [ ] Update `babel.config.js` for compatibility
- [ ] Audit third-party library compatibility
- [ ] Apply React Native Paper patch if needed
- [ ] Create TurboModule specs (if custom modules)
- [ ] Run `npx expo prebuild --clean`
- [ ] Build development version with New Arch
- [ ] Verify New Architecture enabled at runtime
- [ ] Document any libraries using legacy mode

## Success Criteria

- [ ] `app.json` has `newArchEnabled: true`
- [ ] `ios/NewArchitecture` directory exists
- [ ] Android `gradle.properties` shows `newArchEnabled=true`
- [ ] Development build runs without crash
- [ ] Runtime check confirms New Architecture active
- [ ] No bridge-related warnings in console

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Third-party lib incompatibility | HIGH | MEDIUM | Use legacy mode, report issue |
| Prebuild generation fails | MEDIUM | LOW | Clear `ios/android` directories |
| Runtime crashes on specific screens | HIGH | MEDIUM | Comprehensive testing in Phase 04 |
| Performance regression | LOW | VERY LOW | New Architecture should improve |

## Security Considerations

- Review New Architecture security implications
- Ensure JSI access properly sandboxed
- Verify TurboModule permissions
- Check for new attack surfaces in C++ code

## Troubleshooting

### New Architecture Not Enabling

```bash
# Clear all caches
watchman watch-del-all
rm -rf node_modules
rm -rf ios/build
rm -rf android/build
npm install
npx expo prebuild --clean
```

### Library Compatibility Issues

```bash
# Check specific library
npm ls [library-name]

# Force legacy bridge for specific module
# In android/gradle.properties
# NewArchEnabled=false (temporary)
```

### Build Failures

```bash
# Check Xcode/Android Studio versions
xcode-select --version  # iOS: 15.0+
sdkmanager --version    # Android: 34.0+

# Update if needed
```

## Next Phase

After completing this phase:
- Proceed to [Phase 03: Component Compatibility](./phase-03-component-compatibility.md)
- All infrastructure ready for component verification
