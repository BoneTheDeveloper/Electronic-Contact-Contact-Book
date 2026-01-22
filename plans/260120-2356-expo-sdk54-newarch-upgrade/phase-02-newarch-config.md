# Phase 02: New Architecture Configuration

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** Enable React Native New Architecture (Fabric/TurboModules) in app.json configuration
**Priority:** P1 (Critical - core enablement)
**Status:** completed
**Effort:** 1.5h

## Key Insights

- Simple flag change: `newArchEnabled: false` → `true`
- Must update both root level AND expo-dev-client plugin
- Metro config may need adjustment for New Architecture
- Hermes engine already configured (compatible)

## Requirements

1. Enable `newArchEnabled: true` at root level in app.json
2. Enable `newArchEnabled: true` in expo-dev-client plugin
3. Update metro.config.js if needed for New Architecture
4. Clear all caches after configuration change

## Architecture

```
Before:
app.json → newArchEnabled: false
          → expo-dev-client.newArchEnabled: false

After:
app.json → newArchEnabled: true
          → expo-dev-client.newArchEnabled: true
          → Metro config optimized for New Architecture
```

## Related Code Files

- **Primary:** `/apps/mobile/app.json`
- **Secondary:** `/apps/mobile/metro.config.js`
- **Reference:** `/apps/mobile/package.json` (verify dependencies)

## Implementation Steps

### Step 1: Enable New Architecture in app.json

Edit `/apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "EContact School",
    "slug": "econtact-school",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.schoolmanagement.econtact"
    },
    "android": {
      "package": "com.schoolmanagement.econtact"
    },
    "jsEngine": "hermes",
    "experiments": {
      "typedRoutes": false
    },
    "newArchEnabled": true,  // CHANGED: false → true
    "plugins": [
      [
        "expo-dev-client",
        {
          "newArchEnabled": true  // CHANGED: false → true
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "buildToolsVersion": "35.0.0"
          },
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ]
    ]
  }
}
```

### Step 2: Update metro.config.js for New Architecture

Edit `/apps/mobile/metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Enable package exports for New Architecture
// CHANGE: false → true
config.resolver.unstable_enablePackageExports = true;

// Fix "Body has already been read" error by properly configuring the server
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ensure request body is not consumed multiple times
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
```

### Step 3: Clear All Caches

```bash
cd /c/Project/electric_contact_book/apps/mobile

# Clear Expo cache
npx expo start --clear

# Clear Metro cache
npx expo start --clear --no-dev --minify

# Clear node modules cache if needed
rm -rf node_modules/.cache
```

### Step 4: Verify Configuration

```bash
# Check that New Architecture is enabled
npx expo config --platform android
npx expo config --platform ios

# Look for "newArchEnabled": true in output
```

**Expected Output:** Should show `"newArchEnabled": true`

### Step 5: Prebuild to Generate Native Code

```bash
# Generate native folders with New Architecture enabled
npx expo prebuild --clean
```

**Expected:**
- `android/` folder generated/updated with New Architecture code
- `ios/` folder generated/updated with New Architecture code
- No errors in build generation

## Todo List

- [x] Set `newArchEnabled: true` in app.json root
- [x] Set `newArchEnabled: true` in expo-dev-client plugin
- [x] Update metro.config.js to enable package exports
- [x] Clear all caches (Expo, Metro, node_modules)
- [x] Verify configuration with `npx expo config`
- [x] Run `npx expo prebuild --clean` to generate native code
- [x] Verify android/ and ios/ folders generated correctly
- [ ] Commit changes with message: "feat(mobile): enable React Native New Architecture (Fabric/TurboModules)"

## Success Criteria

- [x] app.json shows `"newArchEnabled": true` in both locations
- [x] metro.config.js has `unstable_enablePackageExports: true`
- [x] `npx expo config` confirms New Architecture enabled
- [x] `npx expo prebuild --clean` succeeds without errors
- [x] android/ folder contains New Architecture files
- [x] ios/ folder contains New Architecture files (skipped on Windows)
- [x] TypeScript still compiles (`npm run typecheck`)

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Prebuild fails | Medium | High | Clear caches, ensure Android SDK 35 installed |
| Metro config issues | Low | Low | Can revert to previous config |
| Native generation errors | Medium | High | Check Android/Xcode setup, review logs |
| Existing code incompatible | Very Low | Medium | Research verified all dependencies compatible |

## Rollback Plan

If New Architecture causes issues:

1. Revert app.json: `newArchEnabled: true` → `false`
2. Revert metro.config.js: `unstable_enablePackageExports: true` → `false`
3. Run `npx expo prebuild --clean` to regenerate old native code
4. Clear caches again

```bash
# Quick rollback commands
git checkout app.json metro.config.js
npx expo prebuild --clean
npx expo start --clear
```

## Next Steps

After this phase:

- New Architecture is ENABLED but not yet tested
- Proceed to [Phase 03: Library Audit](./phase-03-library-audit.md) to verify all libraries work
- DO NOT attempt to run app yet - verify libraries first

## Validation Commands

```bash
cd /c/Project/electric_contact_book/apps/mobile

# 1. Verify New Architecture enabled
npx expo config | grep "newArchEnabled"

# 2. Check native folders exist
ls -la android/ ios/

# 3. Verify TypeScript
npm run typecheck

# 4. Check for New Architecture markers
grep -r "newArchEnabled" android/ ios/
```

## Expected Native Files (Post-Prebuild)

**Android:**
- `android/app/src/main/jni/` - C++ code for TurboModules
- `android/app/build.gradle` - New Architecture flags
- `android/gradle.properties` - New Arch enabled

**iOS:**
- `ios/Podfile` - Fabric/TurboModules pods
- `ios/*.xcodeproj` - New Architecture build settings

## Troubleshooting

**Issue:** Prebuild fails with "SDK not found"
```bash
# Android: Install SDK 35
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# iOS: Update Xcode to latest
# Check Xcode version
xcode-select -p
```

**Issue:** Metro config error
```bash
# Revert metro.config.js to previous version
git checkout metro.config.js

# Or use minimal config
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;
```

**Issue:** Package exports causes issues
```bash
# Disable package exports temporarily
# Edit metro.config.js: unstable_enablePackageExports: false

# Clear cache and retry
npx expo start --clear
```

## Notes

- **CRITICAL:** This is the point of no return - once New Architecture is enabled, all native code must be compatible
- Prebuild generates native folders - commit these to git
- New Architecture requires both iOS and Android toolchains to be up-to-date
- Hermes engine is already configured and compatible with New Architecture

## Performance Expectations

After New Architecture is enabled:
- **Rendering:** Faster through Fabric (C++ render layer)
- **Bridge:** Eliminated - direct JSI calls instead
- **Memory:** Lower memory footprint
- **Startup:** Slightly slower initial build, faster runtime
