---
title: "EAS Development Client Setup"
description: "Build and configure EAS Development Client for Android testing with React Native 0.76.6 and Expo SDK 54"
status: pending
priority: P1
effort: 3h
branch: master
tags: [expo, eas, dev-client, android, mobile]
created: 2026-01-21
---

# EAS Development Client Setup

**Overview:** Build custom development client via EAS to support React Native 0.76.6 with full native module access, bypassing Expo Go limitations.

**Problem:** Expo Go doesn't support React Native 0.76.6's internal type definitions, causing Metro bundler errors.

**Solution:** Build custom development client with EAS cloud build service.

## Implementation Phases

| Phase | Status | Description |
|-------|--------|-------------|
| [Phase 01](./phase-01-eas-account-setup.md) | pending | EAS account authentication and project configuration |
| [Phase 02](./phase-02-dependencies-install.md) | pending | Install expo-dev-client and dependencies |
| [Phase 03](./phase-03-build-dev-client.md) | pending | Build Android development client via EAS |
| [Phase 04](./phase-04-install-and-test.md) | pending | Install APK and test app functionality |

## Quick Start

```bash
# Navigate to mobile app
cd apps/mobile

# Install dependencies
pnpm install

# Login to EAS
npx eas login

# Configure EAS project
npx eas build:configure

# Build development client
pnpm run build:android
```

## Key Configuration Files

- **package.json**: Added `expo-dev-client ~4.0.2` and build scripts
- **app.json**: Configured with `expo-dev-client` plugin
- **eas.json**: Pre-configured build profiles (development, preview, production)

## Success Criteria

- [ ] EAS account authenticated
- [ ] Development client APK built successfully
- [ ] APK installed on Android device
- [ ] Dev Client connects to development server
- [ ] All app features work without Metro bundler errors

## Related Files

- `/apps/mobile/package.json` - Dependencies and scripts
- `/apps/mobile/app.json` - Expo configuration
- `/apps/mobile/eas.json` - EAS build profiles
- `/apps/mobile/metro.config.js` - Metro bundler config

## Next Steps

1. Start with [Phase 01](./phase-01-eas-account-setup.md)
2. Ensure EAS account is properly configured before building
3. First build takes 10-20 minutes, subsequent builds are faster

## Notes

- **Build Time**: First build ~15-20 min, cached builds ~5-10 min
- **Cost**: Free tier covers 30 builds/month
- **Platform**: Currently Android only, iOS requires Mac setup
- **Alternatives**: If EAS fails, consider local build with Android Studio
