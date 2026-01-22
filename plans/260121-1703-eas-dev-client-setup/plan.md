---
title: "EAS Development Client Build Setup"
description: "Configure and create EAS development client builds for physical device testing"
status: pending
priority: P2
effort: 6h
branch: master
tags: [eas, expo, dev-client, builds, mobile]
created: 2026-01-21
---

# EAS Development Client Build Setup

**Progressive Disclosure:** This plan configures EAS Development Client builds for testing the School Management mobile app on physical devices.

## Context

**Project:** School Management System - Mobile App
**Location:** `apps/mobile/`
**Current State:**
- Expo SDK 52.0.0
- React Native 0.76.6
- EAS project: `34d17c6d-8e17-4a4c-a2d7-f38d943667f3`
- User: @bonethedev
- Bundle ID: `com.schoolmanagement.econtact`
- New Architecture: **Disabled** (current)

## Why Development Builds?

**Expo Go Limitations:**
- SDK 52+ not fully supported
- No custom native modules
- Limited configuration
- Cannot test native features

**Development Client Benefits:**
- Full native module support
- Custom native code
- Fast Refresh for rapid iteration
- Production-like environment
- OTA update capability

## Phases Overview

1. **EAS Setup Verification** (30m) - Verify EAS configuration and credentials
2. **Development Build Profile** (45m) - Configure build profiles for development builds
3. **Credentials Setup** (60m) - Set up Android keystore and iOS certificates
4. **First Development Build** (90m) - Create first development build for Android
5. **OTA Updates Setup** (45m) - Configure OTA updates for rapid iteration
6. **Testing & Verification** (60m) - Test builds on physical devices

## Key Outcomes

- Working development client for Android APK
- Working development client for iOS (TestFlight)
- OTA update workflow configured
- Development build documentation
- Troubleshooting guide

## Quick Start

```bash
cd apps/mobile

# Build Android development client
eas build --profile development --platform android

# Build iOS development client
eas build --profile development --platform ios

# Start development server
npx expo start --dev-client
```

## Phase Files

- `phase-01-eas-setup-verification.md` - Verify EAS configuration
- `phase-02-development-build-profile.md` - Configure development build profiles
- `phase-03-credentials-setup.md` - Set up signing credentials
- `phase-04-first-development-build.md` - Create first development build
- `phase-05-ota-updates.md` - Configure OTA updates
- `phase-06-testing-verification.md` - Test and verify builds

## Related Documentation

- `apps/mobile/docs/PRODUCTION_BUILD_GUIDE.md` - Production build reference
- `apps/mobile/docs/NEW_ARCHITECTURE_TESTING.md` - New Architecture status
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Development Client Docs](https://docs.expo.dev/develop/development-builds/introduction/)

## Success Criteria

- [ ] Android development build installs on physical device
- [ ] iOS development build installs via TestFlight
- [ ] Development server connects successfully
- [ ] Fast Refresh works during development
- [ ] OTA updates publish and install correctly
- [ ] All core features functional in development build

## Risks & Considerations

**Platform Limitations:**
- iOS builds require macOS for local builds
- EAS builds work on any platform (recommended)
- Windows: Use EAS cloud builds for both platforms

**Credentials Management:**
- Android keystore must be backed up securely
- iOS certificates expire annually
- EAS-managed credentials recommended for teams

**Build Times:**
- Android: 10-20 minutes (EAS Free tier)
- iOS: 15-30 minutes (EAS Free tier)
- First build may take longer

## Next Steps

Start with **Phase 01: EAS Setup Verification** to ensure all prerequisites are met before building.

---

**Created:** 2026-01-21
**Maintained By:** Development Team
**Last Updated:** 2026-01-21
