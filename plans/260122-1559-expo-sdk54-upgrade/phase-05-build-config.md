# Phase 05: Build Configuration

## Context Links

- [Research: Expo SDK 54](../260122-1532-expo-sdk54-upgrade/research/researcher-01-expo-sdk54-upgrade.md)
- [Production Build Guide](../../apps/mobile/docs/PRODUCTION_BUILD_GUIDE.md)

## Overview

Configure app.json and EAS build for SDK 54 development builds since Expo Go is no longer supported.

## Key Insights

- Expo SDK 54 requires development builds (no Expo Go)
- EAS Build configuration needs updates
- iOS TestFlight for physical device testing
- Android APK/AAB for distribution

## Requirements

- Update app.json for SDK 54
- Configure EAS build profiles
- Set up development build workflow
- Create development build for testing
- Document build process

## Architecture

**Build Workflow:**
```
Development:
├── iOS Simulator: npx expo start (works)
├── Android Emulator: npx expo start (works)
├── iOS Physical: Development build (TestFlight)
└── Android Physical: Development build (APK)

Production:
├── iOS: App Store (TestFlight → Production)
└── Android: Play Store (Internal → Production)
```

**EAS Build Profiles:**
```
development:
├── developmentClient: true
├── distribution: internal
├── iOS: simulator support
└── Android: APK for testing

preview:
├── distribution: internal
├── For TestFlight / beta testing
└── No simulator support

production:
├── distribution: store
├── Auto-increment version
└── Store submission ready
```

## Related Code Files

- `apps/mobile/app.json` - Expo config
- `apps/mobile/eas.json` - Build profiles
- `apps/mobile/docs/PRODUCTION_BUILD_GUIDE.md` - Build documentation

## Implementation Steps

### 1. Update app.json for SDK 54

**Current app.json:**
```json
{
  "expo": {
    "name": "EContact School",
    "slug": "econtact-school",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.schoolmanagement.econtact"
    },
    "android": {
      "package": "com.schoolmanagement.econtact"
    },
    "plugins": [
      "expo-dev-client",
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "1.9.25"
          }
        }
      ]
    ],
    "jsEngine": "hermes",
    "experiments": {
      "typedRoutes": false
    },
    "newArchEnabled": false,
    "extra": {
      "eas": {
        "projectId": "34d17c6d-8e17-4a4c-a2d7-f38d943667f3"
      }
    }
  }
}
```

**Updates for SDK 54:**
```json
{
  "expo": {
    "name": "EContact School",
    "slug": "econtact-school",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.schoolmanagement.econtact",
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.schoolmanagement.econtact",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "config": {
        "androidGoToHomeScreen": true
      }
    },
    "plugins": [
      "expo-dev-client",
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "2.0.0",
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "buildToolsVersion": "35.0.0"
          },
          "ios": {
            "deploymentTarget": "13.4"
          }
        }
      ]
    ],
    "jsEngine": "hermes",
    "experiments": {
      "typedRoutes": false
    },
    "newArchEnabled": false,
    "extra": {
      "eas": {
        "projectId": "34d17c6d-8e17-4a4c-a2d7-f38d943667f3"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/34d17c6d-8e17-4a4c-a2d7-f38d943667f3"
    }
  }
}
```

**Key Changes:**
- `userInterfaceStyle`: "automatic" (supports dark mode)
- Android: Compile/target SDK 35
- Kotlin version: 2.0.0
- iOS deployment target: 13.4
- Added runtimeVersion and updates for OTA

### 2. Update eas.json Build Profiles

**Current eas.json:**
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
        "simulator": true
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

**Updates for SDK 54:**
```json
{
  "cli": {
    "version": ">= 7.0.0",
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
        "simulator": true
      },
      "env": {
        "APP_ENV": "development"
      }
    },
    "development-device": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      },
      "env": {
        "APP_ENV": "staging"
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
      },
      "env": {
        "APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json"
      }
    }
  }
}
```

### 3. Update Package Scripts

**Add to package.json:**
```json
{
  "scripts": {
    "start": "expo start",
    "dev": "expo start --clear",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",

    "build:dev": "eas build --profile development --platform all",
    "build:dev:ios": "eas build --profile development --platform ios",
    "build:dev:android": "eas build --profile development --platform android",
    "build:dev:device": "eas build --profile development-device --platform all",

    "build:preview": "eas build --profile preview --platform all",
    "build:preview:ios": "eas build --profile preview --platform ios",
    "build:preview:android": "eas build --profile preview --platform android",

    "build:prod": "eas build --profile production --platform all",
    "build:prod:ios": "eas build --profile production --platform ios",
    "build:prod:android": "eas build --profile production --platform android",

    "update": "eas update --branch production --message 'Update'",
    "update:dev": "eas update --branch development --message 'Dev update'"
  }
}
```

### 4. Test Development Build

**For iOS Simulator (still works):**
```bash
cd apps/mobile
npx expo start --clear
# Press 'i'
```

**For Android Emulator (still works):**
```bash
cd apps/mobile
npx expo start --clear
# Press 'a'
```

**For iOS Physical Device (requires build):**
```bash
cd apps/mobile
eas build --profile development-device --platform ios
# Follow prompts, install via TestFlight
```

**For Android Physical Device:**
```bash
cd apps/mobile
eas build --profile development-device --platform android
# Download APK and install
```

### 5. Update Documentation

**Update PRODUCTION_BUILD_GUIDE.md:**

```markdown
# Production Build Guide - SDK 54

## Important: Expo Go Not Supported

Expo SDK 54+ requires development builds. Expo Go only supports SDK 53 and below.

## Development Workflow

### Local Development (Simulators/Emulators)
```bash
npx expo start --clear
# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
```

### Physical Device Testing

#### iOS (TestFlight Required)
```bash
# Create development build
eas build --profile development-device --platform ios

# Install via TestFlight
# Test on physical device
```

#### Android (APK Installation)
```bash
# Create development build
eas build --profile development-device --platform android

# Download APK from EAS
# Install on device
```

## Build Profiles

### Development
- For local development
- Simulator/emulator support
- Fast iteration

### Development-Device
- For physical device testing
- Internal distribution
- TestFlight/APK installation

### Preview
- For beta testing
- Internal distribution
- Pre-production testing

### Production
- For app stores
- Store distribution
- Auto-increment versions

## OTA Updates
```bash
# Publish update
eas update --branch production --message "Fix bug"

# Development branch update
eas update --branch development --message "Dev feature"
```
```

## Todo List

- [ ] Update app.json for SDK 54
- [ ] Update eas.json build profiles
- [ ] Add build scripts to package.json
- [ ] Test iOS simulator build
- [ ] Test Android emulator build
- [ ] Create development build for iOS
- [ ] Create development build for Android
- [ ] Update PRODUCTION_BUILD_GUIDE.md
- [ ] Test development build on physical iOS device
- [ ] Test development build on physical Android device

## Success Criteria

- [ ] app.json configured for SDK 54
- [ ] eas.json has all required profiles
- [ ] Development build succeeds for iOS
- [ ] Development build succeeds for Android
- [ ] App installs on physical devices
- [ ] Documentation updated

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build failures | Medium | High | Test all profiles |
| Certificate issues | Medium | High | Use EAS credentials |
| TestFlight delays | Low | Medium | Plan ahead |
| APK installation issues | Low | Low | Document process |

## Security Considerations

- Never commit credentials
- Use EAS remote credentials
- Secure Apple Developer account
- Secure Google Play Console access

## Next Steps

Proceed to Phase 06: Validation
