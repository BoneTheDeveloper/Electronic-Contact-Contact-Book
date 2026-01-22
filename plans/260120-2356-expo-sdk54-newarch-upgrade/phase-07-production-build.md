# Phase 07: Production Build Configuration

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** Configure production builds with New Architecture enabled for App Store and Google Play submission
**Priority:** P1 (Critical - deployment)
**Status:** pending
**Effort:** 2.5h

## Key Insights

- Development builds verified working
- Need separate production build configuration
- EAS Build service recommended for production
- Must configure app signing (iOS + Android)
- Production builds should be optimized and minified
- Need to test production builds before submission

## Requirements

1. Configure production build profiles in eas.json
2. Set up app signing credentials (iOS + Android)
3. Create production build for Android
4. Create production build for iOS
5. Test production builds thoroughly
6. Verify New Architecture still enabled in production
7. Prepare for app store submission

## Architecture

```
Build Pipeline:
1. eas.json configuration
   ↓
2. EAS Build service (cloud build)
   ↓
3. Production .aab (Android) / .ipa (iOS)
   ↓
4. Store submission testing
   ↓
5. App Store / Google Play release
```

## Related Code Files

- **Primary:** `/apps/mobile/eas.json`
- **Primary:** `/apps/mobile/app.json`
- **Build Output:** `.aab` file (Android)
- **Build Output:** `.ipa` file (iOS)

## Implementation Steps

### Step 1: Configure Production Build Profiles

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
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "autoIncrement": true,
        "buildConfiguration": "Release",
        "bundleIdentifier": "com.schoolmanagement.econtact"
      },
      "android": {
        "autoIncrement": true,
        "buildType": "app-bundle",
        "bundleIdentifier": "com.schoolmanagement.econtact"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 2: Verify New Architecture in Production Config

Ensure `/apps/mobile/app.json` still has:

```json
{
  "expo": {
    "newArchEnabled": true,
    "plugins": [
      ["expo-dev-client", {"newArchEnabled": true}],
      ["expo-build-properties", {
        "android": {
          "compileSdkVersion": 35,
          "targetSdkVersion": 35,
          "buildToolsVersion": "35.0.0"
        },
        "ios": {
          "deploymentTarget": "15.1"
        }
      }]
    ]
  }
}
```

### Step 3: Set Up Android Signing

#### Option A: Let EAS Manage Android Keystore (Recommended)

```bash
# Configure EAS to manage keystore
eas credentials:manage:android --platform android

# EAS will generate and store keystore securely
```

**Advantages:**
- No local keystore management
- Secure cloud storage
- Easy team collaboration

#### Option B: Use Your Own Keystore

```bash
# Generate keystore locally
keytool -genkeypair -v -storetype PKCS12 \
  -keystore econtact-school-release.keystore \
  -alias econtact-school-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=EContact School, OU=Development, O=School Management, C=VN"

# Upload to EAS
eas credentials:manage:android --platform android
```

### Step 4: Set Up iOS Signing

```bash
# Requires Apple Developer account
# Configure EAS with Apple credentials

eas credentials:manage:ios --platform ios

# EAS will guide you through:
# 1. Apple ID email
# 2. App-specific password
# 3. Team ID
# 4. Distribution certificate
# 5. Provisioning profile
```

### Step 5: Create Production Build - Android

```bash
cd /c/Project/electric_contact_book/apps/mobile

# Build Android App Bundle (.aab) for Play Store
eas build --platform android --profile production

# Or build APK for direct distribution
eas build --platform android --profile production --output ./android-production.apk
```

**Expected:**
- Build takes 10-20 minutes on EAS
- Produces `.aab` or `.apk` file
- Build URL provided in console
- Download and test the build

### Step 6: Create Production Build - iOS

```bash
cd /c/Project/electric_contact_book/apps/mobile

# Build iOS Archive (.ipa) for App Store
eas build --platform ios --profile production
```

**Expected:**
- Build takes 15-30 minutes on EAS
- Produces `.ipa` file
- Build URL provided in console
- Download and test the build

### Step 7: Test Production Builds

#### Android Production Build Test

```bash
# Install .aab on test device
# Upload to Google Play Internal Testing
# Or install .apk directly:
adb install android-production.apk

# Test all scenarios from Phase 06
# Verify New Architecture is enabled
# Check performance is acceptable
```

**Test Checklist:**
- [ ] App launches without crashes
- [ ] All screens render correctly
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable
- [ ] New Architecture verified enabled

#### iOS Production Build Test

```bash
# Install .ipa on test device
# Use TestFlight or direct installation

# Test all scenarios from Phase 06
# Verify New Architecture is enabled
# Check performance is acceptable
```

**Test Checklist:**
- [ ] App launches without crashes
- [ ] All screens render correctly
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable
- [ ] New Architecture verified enabled

### Step 8: Verify New Architecture in Production

**Method 1: Check Build Configuration**

```bash
# The build should include:
# - Fabric render layer
# - TurboModule support
# - JSI bindings

# Verify by checking app bundle contents (Android)
unzip -l android-production.aab | grep -i fabric

# Or check IPA contents (iOS)
unzip -l ios-production.ipa | grep -i fabric
```

**Method 2: Runtime Verification**

```javascript
// Add temporary verification code in App.tsx:
import { NativeModules } from 'react-native';

export default function App() {
  useEffect(() => {
    if (__DEV__) {
      // Only in development mode
      const constants = NativeModules.PlatformConstants;
      console.log('React Native Version:', constants?.reactNativeVersion);
      console.log('TurboModule Registry:', !!NativeModules.TurboModuleRegistry);
    }
  }, []);

  // ... rest of App component
}
```

**Expected in development logs:**
```
TurboModule Registry: true
```

**Note:** Production builds won't show console logs, but verification code ensures New Architecture APIs exist.

### Step 9: Update Build Documentation

Create `/apps/mobile/docs/PRODUCTION_BUILD_GUIDE.md`:

```markdown
# Production Build Guide

**Last Updated:** 2026-01-21
**New Architecture:** ENABLED (Fabric + TurboModules)

## Build Commands

### Android Production Build

```bash
# App Bundle for Play Store
eas build --platform android --profile production

# APK for direct distribution
eas build --platform android --profile production --output ./build/android-production.apk
```

### iOS Production Build

```bash
# Archive for App Store
eas build --platform ios --profile production
```

## Build Configuration

- **Expo SDK:** ~54.0.0
- **React Native:** 0.76.6
- **New Architecture:** Enabled
- **Android SDK:** 35
- **iOS Deployment Target:** 15.1

## Signing

### Android
- **Keystore:** Managed by EAS (or local)
- **Bundle ID:** com.schoolmanagement.econtact
- **Build Type:** app-bundle (.aab)

### iOS
- **Certificate:** Managed by EAS
- **Bundle ID:** com.schoolmanagement.econtact
- **Team ID:** YOUR_TEAM_ID
- **Provisioning Profile:** Managed by EAS

## Testing Production Builds

1. Download build from EAS
2. Install on test device
3. Run integration test scenarios
4. Verify New Architecture enabled
5. Check performance metrics
6. Verify no crashes or errors

## Store Submission

### Google Play Store
1. Upload .aab to Play Console
2. Complete store listing
3. Submit for review
4. Track review status

### Apple App Store
1. Upload .ipa via Transporter or EAS submit
2. Complete store listing in App Store Connect
3. Submit for review
4. Track review status

## Version Management

- **Version:** 1.0.0
- **Build Number:** Auto-incremented by EAS
- **Release Track:** Production

## Rollback Plan

If production build has issues:

1. Revert code changes
2. Create new build with old architecture
3. Submit as emergency update
4. Communicate with users
```

## Todo List

- [ ] Update eas.json with production configuration
- [ ] Verify New Architecture enabled in app.json
- [ ] Set up Android signing credentials
- [ ] Set up iOS signing credentials
- [ ] Create Android production build
- [ ] Create iOS production build
- [ ] Download and install Android build on test device
- [ ] Download and install iOS build on test device
- [ ] Test Android production build thoroughly
- [ ] Test iOS production build thoroughly
- [ ] Verify New Architecture enabled in production
- [ ] Document build process
- [ ] Commit all configuration changes

## Success Criteria

- [ ] eas.json configured for production builds
- [ ] Android credentials set up
- [ ] iOS credentials set up
- [ ] Android production build created successfully
- [ ] iOS production build created successfully
- [ ] Android build tests pass all scenarios
- [ ] iOS build tests pass all scenarios
- [ ] New Architecture verified in production builds
- [ ] Performance acceptable in production builds
- [ ] No crashes or errors in production builds
- [ ] Ready for app store submission

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build fails on EAS | Low | High | Verify configuration, check EAS status |
| Signing issues | Medium | High | Use EAS-managed credentials |
| Production build crashes | Very Low | Critical | Thorough testing before submission |
| New Architecture not enabled | Very Low | High | Verify configuration before build |
| Store rejection | Low | Medium | Follow store guidelines carefully |

## Rollback Plan

If production build has critical issues:

### Option 1: Fix Issues and Rebuild

```bash
# Fix issues in code
# Test fixes in development build
# Create new production build
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Option 2: Revert to Old Architecture

```bash
# Revert New Architecture changes
git checkout app.json metro.config.js

# Create new production build
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Option 3: Emergency OTA Update

```bash
# If critical bug found after release:
# Fix bug in code
# Create OTA update (no new build)
eas update --branch production --message "Critical fix"
```

## Next Steps

After production build configuration:

- Production builds created and tested
- Ready for app store submission
- Create release plan for rollout
- Monitor for issues after release

## Validation Commands

```bash
cd /c/Project/electric_contact_book/apps/mobile

# 1. Verify EAS configuration
eas build:list

# 2. Check build status
eas build:status [BUILD_ID]

# 3. Validate app.json
npx expo config

# 4. TypeScript check
npm run typecheck

# 5. Lint check
npm run lint
```

## Build Times

**EAS Build Times:**
- Android: 10-20 minutes
- iOS: 15-30 minutes

**Factors:**
- Queue time (other builds)
- Project size
- Dependencies
- Native modules

## Store Submission Checklist

### Google Play Store
- [ ] .aab uploaded to Play Console
- [ ] Store listing complete (title, description, screenshots)
- [ ] Content rating complete
- [ ] Privacy policy URL provided
- [ ] Signing key managed by EAS
- [ ] Target SDK 35
- [ ] 64-bit architecture required
- [ ] App icon and feature graphic
- [ ] Screenshots for phone and tablet
- [ ] Release notes prepared

### Apple App Store
- [ ] .ipa uploaded via Transporter or EAS submit
- [ ] App Store Connect listing complete
- [ ] App icon provided (all sizes)
- [ ] Screenshots for all device sizes
- [ ] Privacy details complete
- [ ] Age rating calculated
- [ ] Export compliance documentation
- [ ] App preview videos (optional)
- [ ] Review information provided
- [ ] Demo account credentials (if needed)

## Notes

- **CRITICAL:** Test production builds THOROUGHLY before submission
- Store review can take 1-3 days (iOS) or 1-7 days (Android)
- Plan release timing accordingly
- Have rollback plan ready
- Monitor crashes after release (Firebase Crashlytics recommended)
- Prepare for user support

## Post-Release Monitoring

After app store release:

1. **Monitor Crashes**
   - Set up crash reporting (Firebase Crashlytics)
   - Review crash reports daily
   - Fix critical crashes immediately

2. **Monitor Performance**
   - Track app startup time
   - Monitor ANR rates (Android)
   - Watch for memory issues

3. **Monitor Reviews**
   - Respond to user reviews
   - Address reported issues
   - Track ratings

4. **Prepare Updates**
   - Plan for quick bug fix releases
   - Use OTA updates for minor fixes
   - Full builds for critical issues

## Troubleshooting

### Build Fails on EAS

**Issue:** "Build failed - generic error"
```bash
# Check build logs
eas build:view [BUILD_ID]

# Common fixes:
# - Verify app.json syntax
# - Check node_modules integrity
# - Verify bundle ID uniqueness
```

**Issue:** "Signing failed"
```bash
# Reset credentials
eas credentials:reset:android
eas credentials:reset:ios

# Reconfigure
eas credentials:manage:android
eas credentials:manage:ios
```

### Production Build Crashes

**Issue:** "Crashes on launch"
```bash
# Check device logs for stack trace
# Verify all libraries compatible with New Architecture
# Check for missing native modules

# Temporary fix: Revert to old architecture
git checkout app.json
```

**Issue:** "Crashes on specific screen"
```bash
# Identify problematic screen
# Check React Native Paper components
# Test without problematic component
# Report issue to library GitHub
```

### Store Rejection

**Issue:** "App rejected for guideline violations"
```bash
# Review rejection reason
# Fix violations
# Resubmit
# Common issues:
# - Missing permissions explanation
# - Incomplete store listing
# - Guidelines violations
# - Bugs found during review
```
