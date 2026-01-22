---
title: "Phase 02: Development Build Profile Configuration"
description: "Configure and optimize development build profiles for physical device testing"
status: pending
priority: P1
effort: 45m
dependencies: ["phase-01-eas-setup-verification"]
created: 2026-01-21
---

# Phase 02: Development Build Profile Configuration

**Context:** `plan.md` | **Prev:** `phase-01-eas-setup-verification.md` | **Next:** `phase-03-credentials-setup.md`

## Overview

Configure EAS build profiles in `eas.json` for development client builds on physical Android and iOS devices.

## Current Configuration

**Existing eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "image": "latest",
        "credentialsSource": "remote"
      },
      "ios": {
        "simulator": true  // ⚠️ Needs change for physical devices
      }
    }
  }
}
```

**Issue:** iOS profile configured for simulator, not physical devices.

## Key Insights

1. **Development vs Simulator:** iOS builds need `simulator: false` for physical devices
2. **APK vs AAB:** Use `apk` for development (installable directly), `aab` for production
3. **Credentials:** Use `remote` (EAS-managed) for simplicity, or `local` for control
4. **Build Cache:** EAS caches builds, can speed up subsequent builds

## Requirements

### Build Profile Requirements

**Android Development Build:**
- developmentClient: true
- distribution: "internal"
- buildType: "apk"
- credentialsSource: "remote" (EAS-managed keystore)

**iOS Development Build:**
- developmentClient: true
- distribution: "internal"
- simulator: false (physical device)
- credentialsSource: "remote" (EAS-managed certificates)

### New Architecture Consideration

**Current State:** New Architecture disabled (`newArchEnabled: false` in app.json)

**For Development Builds:** Keep disabled for stability. Can enable in Phase 07 after testing.

## Implementation Steps

### Step 1: Review Current Configuration

```bash
cd C:\Project\electric_contact_book\apps\mobile

# View current eas.json
cat eas.json

# Note existing settings
# Plan changes needed
```

---

### Step 2: Update iOS Development Profile

**Current Issue:** iOS profile builds for simulator only.

**Update `eas.json`:**

```json
{
  "cli": {
    "version": ">= 5.2.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "image": "latest",
        "credentialsSource": "remote"
      },
      "ios": {
        "simulator": false,  // ✅ Changed: Build for physical devices
        "credentialsSource": "remote"
      }
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true  // For iOS Simulator testing (Mac only)
      }
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
        "buildConfiguration": "Release"
      },
      "android": {
        "autoIncrement": true,
        "buildType": "app-bundle"
      }
    }
  }
}
```

**Changes Made:**
1. Added `simulator: false` to ios.development
2. Added `credentialsSource: "remote"` to ios.development
3. Created separate `development-simulator` profile for Mac testing

---

### Step 3: Add Runtime Configuration (Optional)

**For development workflow convenience, add to `eas.json`:**

```json
{
  "build": {
    // ... existing build profiles ...
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

**Note:** Skip for now - configure during production setup.

---

### Step 4: Validate Configuration

```bash
# Validate eas.json syntax
npx expo config --validate

# Check build profiles are recognized
eas build:list --platform=android --limit=1
eas build:list --platform=ios --limit=1

# No errors = valid configuration
```

---

### Step 5: Test Configuration (Dry Run)

```bash
# Test Android build configuration (doesn't build)
eas build --profile development --platform android --non-interactive --output-path=./test.apk

# Expected: Configuration valid, prompts for missing credentials
# Cancel with Ctrl+C after validation passes
```

---

### Step 6: Create Build Scripts (Convenience)

**Update `apps/mobile/package.json`:**

```json
{
  "scripts": {
    "start": "expo start",
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build:dev:android": "eas build --profile development --platform android",
    "build:dev:ios": "eas build --profile development --platform ios",
    "build:preview:android": "eas build --profile preview --platform android",
    "build:preview:ios": "eas build --profile preview --platform ios",
    "build:prod:android": "eas build --profile production --platform android",
    "build:prod:ios": "eas build --profile production --platform ios",
    "update": "eas update --branch production --message 'Update'",
    "update:dev": "eas update --branch development --message 'Dev update'",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "postinstall": "patch-package"
  }
}
```

**Benefits:**
- Consistent build commands
- Easy to remember
- Team standardization

---

### Step 7: Document Build Profiles

**Create `apps/mobile/docs/BUILD_PROFILES.md`:**

```markdown
# Build Profiles Reference

## Development Builds

### Android (Physical Device)
```bash
npm run build:dev:android
# or
eas build --profile development --platform android
```
- Output: APK file
- Distribution: Internal (direct install)
- Install: Download and install on Android device
- Purpose: Development and testing

### iOS (Physical Device)
```bash
npm run build:dev:ios
# or
eas build --profile development --platform ios
```
- Output: IPA file
- Distribution: TestFlight
- Install: TestFlight app on iOS device
- Purpose: Development and testing

## Preview Builds

Testing builds closer to production:
```bash
npm run build:preview:android
npm run build:preview:ios
```

## Production Builds

For app store submission:
```bash
npm run build:prod:android
npm run build:prod:ios
```
```

---

## Todo List

- [ ] Review current eas.json configuration
- [ ] Update iOS development profile for physical devices
- [ ] Add development-simulator profile for Mac testing
- [ ] Validate eas.json syntax
- [ ] Test configuration with dry run
- [ ] Add build scripts to package.json
- [ ] Document build profiles
- [ ] Commit configuration changes

## Success Criteria

**Phase Complete When:**
- iOS development profile targets physical devices (`simulator: false`)
- Android development profile produces APK
- Configuration validates without errors
- Build scripts added to package.json
- Documentation created

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Invalid JSON syntax | Low | Medium | Validate with `npx expo config` |
| Wrong build type | Low | Low | APK for dev, AAB for prod |
| Simulator confusion | Medium | Medium | Clear profile naming |
| Credentials missing | Medium | High | Configure in Phase 03 |

## Security Considerations

- **Never commit** service account keys
- **Use .gitignore** for credential files
- **Document** credential storage location
- **Use EAS-managed** credentials when possible

## Troubleshooting

### Issue: "Invalid eas.json"

**Solution:**
```bash
# Validate JSON
cat eas.json | jq .

# Check for syntax errors
# Common issues:
# - Missing commas
# - Trailing commas
# - Wrong quote types
```

---

### Issue: "Unknown build profile"

**Solution:**
```bash
# Verify profile name matches eas.json
eas build --profile development --platform android

# Check profile exists in eas.json
grep -A 10 '"development"' eas.json
```

---

### Issue: "simulator build on physical device"

**Solution:**
```json
// Change in eas.json
"ios": {
  "simulator": false  // Must be false for physical devices
}
```

---

## Validation Commands

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Validate configuration
npx expo config --validate

# 2. Check build profiles
cat eas.json | jq '.build'

# 3. Test Android config (dry run)
eas build --profile development --platform android --non-interactive

# 4. Test iOS config (dry run)
eas build --profile development --platform ios --non-interactive
```

## Related Files

- `apps/mobile/eas.json` - Build profiles configuration
- `apps/mobile/package.json` - Build scripts
- `apps/mobile/app.json` - App configuration
- `apps/mobile/docs/BUILD_PROFILES.md` - Build profiles documentation (to create)

## Next Steps

After configuration complete, proceed to **Phase 03: Credentials Setup** to configure signing credentials for Android and iOS.

## Build Profile Reference

### Profile Comparison

| Profile | Client | Distribution | Android | iOS | Purpose |
|---------|--------|--------------|---------|-----|---------|
| development | Dev Client | Internal | APK | IPA | Development testing |
| development-simulator | Dev Client | Internal | N/A | Simulator | Mac development |
| preview | Production | Internal | APK | IPA | Beta testing |
| production | Production | Store | AAB | IPA | App store submission |

### Development Build Characteristics

- **Includes:** expo-dev-client
- **Enables:** Fast Refresh, React DevTools
- **Connects:** To local dev server
- **Updates:** Via OTA (no rebuild needed)
- **Distribution:** Direct install (APK) or TestFlight (IPA)

---

**Status:** Pending
**Last Updated:** 2026-01-21
