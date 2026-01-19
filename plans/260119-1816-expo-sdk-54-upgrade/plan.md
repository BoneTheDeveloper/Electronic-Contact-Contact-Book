---
title: "Expo SDK 54 & New Architecture Upgrade"
description: "Upgrade mobile app from Expo SDK 53/RN 0.76.5 to SDK 54/RN 0.81 with New Architecture enabled"
status: pending
priority: P1
effort: 16h
branch: master
tags: [expo, react-native, new-architecture, upgrade, mobile]
created: 2025-01-19
---

## Overview

This plan upgrades the mobile app from Expo SDK 53 (React Native 0.76.5) to Expo SDK 54 (React Native 0.81.0) with New Architecture enabled. This is a **critical infrastructure upgrade** that enables performance improvements, better bridgeless architecture, and future-proofs the app.

**⚠️ CRITICAL:** Development builds required - Expo Go will NOT work after this upgrade.

## Phases

| Phase | Focus | Status | Effort |
|-------|-------|--------|--------|
| [Phase 01: SDK Upgrade](./phase-01-sdk-upgrade.md) | Upgrade dependencies & SDK | ✅ completed | 4h |
| [Phase 02: New Architecture](./phase-02-new-architecture.md) | Enable New Arch config | ✅ completed | 3h |
| [Phase 03: Component Compatibility](./phase-03-component-compatibility.md) | Fix 37 components/screens | ✅ completed | 5h |
| [Phase 04: Testing](./phase-04-testing.md) | Validate all features | 🔄 in-progress (infrastructure ready) | 4h |

## Key Changes

- **Expo SDK:** 53.0.0 → 54.0.0
- **React Native:** 0.76.5 → 0.81.0
- **React Navigation:** v6 → v7
- **New Architecture:** disabled → enabled
- **Build System:** Development builds required (no Expo Go)

## Research Context

Based on prior research:
- React Navigation v7 migration required (breaking changes)
- React Native Paper menu component has known bug requiring patch
- 37 components/screens need verification
- Turbomodule format required for native modules

## Success Criteria

- [ ] App builds successfully with Expo SDK 54
- [ ] New Architecture enabled and verified
- [ ] All 37 screens functional
- [ ] No regressions in navigation
- [ ] Development builds working on iOS/Android

## Risks

- **HIGH:** React Navigation v7 breaking changes affect 37 screens
- **MEDIUM:** New Architecture compatibility issues with third-party libs
- **MEDIUM:** React Native Paper menu bug requires patch maintenance
- **LOW:** Development build setup complexity for team

## Quick Links

- [Phase 01 Details](./phase-01-sdk-upgrade.md) - SDK dependency upgrades
- [Phase 02 Details](./phase-02-new-architecture.md) - New Architecture setup
- [Phase 03 Details](./phase-03-component-compatibility.md) - Component fixes
- [Phase 04 Details](./phase-04-testing.md) - Testing strategy

## References

- [Expo SDK 54 Changelog](https://blog.expo.io/expo-sdk-54-0-0-5897594d1c6d)
- [React Native 0.81 Upgrade Guide](https://react.dev/blog/2025/01/09/react-native-0.81)
- [New Architecture Setup](https://react.dev/blog/2024/11/18/new-architecture-update)
- [React Navigation v7 Migration](https://reactnavigation.org/docs/7.x/migrating-from-6.x/)
