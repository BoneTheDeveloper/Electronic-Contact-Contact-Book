# Phase 04: Development Build Setup

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** Configure and create development builds with New Architecture enabled for local testing
**Priority:** P1 (Critical - first real test)
**Status:** pending
**Effort:** 2.5h

## Key Insights

- Expo Go does NOT support New Architecture - must use development builds
- Need EAS CLI installed and configured
- Local prebuild generates android/ and ios/ folders
- First build will take longer (compiling Fabric/TurboModules)

## Requirements

1. Install EAS CLI
2. Configure EAS for development builds
3. Run local prebuild to generate native code
4. Create development build for Android (emulator or physical)
5. Create development build for iOS (simulator or physical)
6. Test app launches with New Architecture enabled

## Architecture

```
Development Build Flow:
1. npx expo prebuild --clean
   ↓ Generates native code
2. npx expo run:android OR npx expo run:ios
   ↓ Compiles with New Architecture
3. Development app launches
   ↓ Can test all screens
```

## Related Code Files

- **Primary:** `/apps/mobile/eas.json`
- **Primary:** `/apps/mobile/app.json`
- **Generated:** `/apps/mobile/android/`
- **Generated:** `/apps/mobile/ios/`

## Implementation Steps

### Step 1: Install EAS CLI

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version

# Login to Expo account (required for EAS builds)
eas login
```

**Expected:** EAS CLI version >= 5.2.0

### Step 2: Update EAS Configuration

Edit `/apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "image": "latest"
      },
      "ios": {
        "simulator": true
      }
    },
    "development-device": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 3: Run Local Prebuild

```bash
cd /c/Project/electric_contact_book/apps/mobile

# Clean prebuild - generates fresh native code with New Architecture
npx expo prebuild --clean
```

**Expected:**
- `android/` folder created/updated
- `ios/` folder created/updated
- No errors in generation
- New Architecture code present in native folders

### Step 4: Verify Native Code Generation

```bash
# Check Android for New Architecture markers
grep -r "newArchEnabled" android/
grep -r "Fabric" android/app/src/main/jni/

# Check iOS for New Architecture markers
grep -r "newArchEnabled" ios/
grep -r "RCTFabricComponents" ios/

# Verify TurboModules present
ls -la android/app/src/main/jni/
ls -la ios/Pods/React-Fabric/
```

**Expected:** Multiple files referencing Fabric/TurboModules

### Step 5: Run Development Build on Android

#### Option A: Android Emulator

```bash
# Start Android emulator first (Android Studio AVD)
# Then run:
npx expo run:android
```

**Expected:**
- Gradle build succeeds
- App installs on emulator
- App launches without crashes
- Metro bundler connects

#### Option B: Physical Android Device

```bash
# Enable USB debugging on device
# Verify device connected:
adb devices

# Run build:
npx expo run:android
```

**Expected:** Same as emulator

### Step 6: Run Development Build on iOS

#### Option A: iOS Simulator

```bash
# Start iOS simulator (Xcode)
# Then run:
npx expo run:ios
```

**Expected:**
- Xcode build succeeds
- App installs on simulator
- App launches without crashes
- Metro bundler connects

#### Option B: Physical iOS Device

```bash
# Requires Apple Developer account
# Connect iPhone via USB
# Run:
npx expo run:ios --device
```

**Expected:** Same as simulator

### Step 7: Verify New Architecture is Active

**Method 1: Check React Native DevTools**

```javascript
// Add to App.tsx temporarily for verification:
import { NativeModules } from 'react-native';

useEffect(() => {
  if (NativeModules.PlatformConstants) {
    console.log('React Native Version:', NativeModules.PlatformConstants.reactNativeVersion);
    console.log('TurboModule enabled:', !!NativeModules.TurboModuleRegistry);
  }
}, []);
```

**Expected in Metro logs:**
```
TurboModule enabled: true
```

**Method 2: Check Bundle**

```bash
# In Metro bundler output, look for:
# "Fabric is enabled"
# "TurboModules are enabled"
```

## Todo List

- [ ] Install EAS CLI globally
- [ ] Login to Expo account
- [ ] Update eas.json with development build config
- [ ] Run `npx expo prebuild --clean`
- [ ] Verify android/ folder generated with New Architecture
- [ ] Verify ios/ folder generated with New Architecture
- [ ] Run `npx expo run:android` (emulator or device)
- [ ] Run `npx expo run:ios` (simulator or device)
- [ ] Verify app launches without crashes
- [ ] Add temporary verification code to App.tsx
- [ ] Check Metro logs for New Architecture enabled
- [ ] Remove verification code after confirmation
- [ ] Commit eas.json changes

## Success Criteria

- [ ] EAS CLI installed and logged in
- [ ] `npx expo prebuild --clean` succeeds
- [ ] android/ folder contains Fabric/TurboModule code
- [ ] ios/ folder contains Fabric/TurboModule code
- [ ] Android development build runs successfully
- [ ] iOS development build runs successfully
- [ ] App launches on both platforms without crashes
- [ ] Metro logs confirm New Architecture enabled
- [ ] Can navigate to at least one screen

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Android build fails | Medium | High | Check Android SDK 35 installed, JAVA_HOME set |
| iOS build fails | Medium | High | Check Xcode version, CocoaPods installed |
| App crashes on launch | Low | Critical | Check console logs, verify all libs compatible |
| Prebuild fails | Low | High | Clear caches, check node_modules |
| Metro connection fails | Low | Medium | Clear cache, check network settings |

## Rollback Plan

If development build fails:

### Android Rollback

```bash
# Clean android folder
rm -rf android/

# Revert to old architecture
# Edit app.json: newArchEnabled: false

# Regenerate old native code
npx expo prebuild --clean
```

### iOS Rollback

```bash
# Clean ios folder
rm -rf ios/

# Revert to old architecture
# Edit app.json: newArchEnabled: false

# Regenerate old native code
npx expo prebuild --clean
```

### Complete Rollback

```bash
# Revert all Phase 02 changes
git checkout app.json metro.config.js

# Clean and regenerate
npx expo prebuild --clean
npx expo start --clear
```

## Next Steps

After successful development builds:

- New Architecture is RUNNING and verified
- Proceed to [Phase 05: Component Testing](./phase-05-component-testing.md)
- Test all 37 screens for regressions

## Validation Commands

```bash
cd /c/Project/electric_contact_book/apps/mobile

# 1. Verify EAS CLI
eas --version

# 2. Check native folders exist
ls -la android/ ios/

# 3. Verify New Architecture code present
grep -r "Fabric" android/ ios/ | head -5

# 4. Check app.json still has newArchEnabled: true
cat app.json | grep "newArchEnabled"

# 5. TypeScript check
npm run typecheck
```

## Expected Build Times

**First Build (Cold):**
- Android: 5-10 minutes
- iOS: 5-15 minutes

**Subsequent Builds (Warm):**
- Android: 1-3 minutes
- iOS: 2-5 minutes

**Factors:**
- CPU speed
- SSD vs HDD
- Cached dependencies
- New Architecture compilation adds ~20% to first build

## Troubleshooting

### Android Build Fails

**Issue:** "SDK not found"
```bash
# Install Android SDK 35
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# Set JAVA_HOME
export JAVA_HOME=/path/to/java17
```

**Issue:** Gradle build error
```bash
# Clean Gradle cache
cd android
./gradlew clean

# Try again
cd ..
npx expo run:android
```

### iOS Build Fails

**Issue:** "CocoaPods not installed"
```bash
# Install CocoaPods
sudo gem install cocoapods

# Update pods
cd ios
pod install
cd ..

# Try again
npx expo run:ios
```

**Issue:** Xcode version too old
```bash
# Update Xcode from App Store
# Requires Xcode 15+ for New Architecture

# Check Xcode version
xcodebuild -version
```

### App Crashes on Launch

**Issue:** White screen then crash
```bash
# Check Metro logs for errors
npx expo start --clear

# Check native logs
# Android: adb logcat
# iOS: Open Console.app, filter by app name
```

**Issue:** "TurboModule not found"
```bash
# Verify prebuild completed successfully
ls -la android/app/src/main/jni/

# Re-run prebuild
npx expo prebuild --clean
```

### Prebuild Fails

**Issue:** "File already exists"
```bash
# Clean folders manually
rm -rf android/ ios/

# Clear caches
npx expo start --clear

# Try prebuild again
npx expo prebuild --clean
```

## Notes

- **CRITICAL:** First build takes much longer - be patient
- Development builds are REQUIRED for New Architecture testing
- Expo Go does NOT support New Architecture
- Always use `--clean` flag when regenerating native code
- Keep native folders in git after this phase

## Performance Verification

After app launches successfully:

1. **Check rendering performance**
   - Navigate between screens
   - Scroll lists
   - Open modals

2. **Check memory usage**
   - Android: Android Studio Profiler
   - iOS: Xcode Instruments

3. **Check startup time**
   - Should be similar or slightly faster than old architecture
   - First launch may be slower (compilation)

## Next Phase Preparation

Before moving to Phase 05:

- [ ] Development build running smoothly
- [ ] No crashes on app launch
- [ ] Metro bundler connects reliably
- [ ] Can navigate to multiple screens
- [ ] Console logs show no critical errors
