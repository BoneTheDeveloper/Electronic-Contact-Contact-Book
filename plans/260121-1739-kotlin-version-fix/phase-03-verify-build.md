# Phase 03: Verify Build

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Test EAS build with Kotlin 1.9.25
**Priority:** P1 (Critical)
**Status:** pending
**Effort:** 10m

## Key Insights

- EAS free tier has queue delays (5-10 min)
- Build takes 15-25 min after queuing
- Must wait for full compilation to verify fix

## Related Files

- **Build Config:** `apps/mobile/eas.json`
- **App Config:** `apps/mobile/app.json`

## Implementation Steps

### Step 1: Pre-build Validation
```bash
cd apps/mobile
npx expo config
```

Verify no config errors.

### Step 2: Trigger EAS Build
```bash
npx eas build --profile development --platform android --non-interactive
```

### Step 3: Monitor Build
Wait for build completion:
- Check EAS dashboard: https://expo.dev
- Monitor logs for Kotlin version confirmation
- Look for successful `:expo-modules-core:compileDebugKotlin`

### Step 4: Verify Success

**Expected Output:**
```
> Task :expo-modules-core:compileDebugKotlin
BUILD SUCCESSFUL
```

**Download APK** from provided link.

## Todo List

- [ ] Validate app.json config
- [ ] Trigger EAS build
- [ ] Monitor build progress
- [ ] Confirm build success
- [ ] Download and test APK

## Success Criteria

- [ ] Build completes without errors
- [ ] Kotlin 1.9.25 used in build
- [ ] APK downloads successfully
- [ ] App installs on device

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build still fails | Low | High | Check Gradle version compat |
| Queue delays | High | Low | Use paid tier for faster builds |
| New errors appear | Low | Medium | Review build logs carefully |

## Troubleshooting

**If build still fails:**
1. Check if Gradle version needs update
2. Verify expo-build-properties version
3. Try alternative override method
4. Check Expo SDK 52 release notes

**If Gradle errors:**
```bash
# May need to also update Gradle
# In expo-build-properties config:
"android": {
  "kotlinVersion": "1.9.25",
  "gradleVersion": "8.10.2"
}
```

## Next Steps

After successful build:
- Install APK on test device
- Start dev server: `npx expo start --dev-client`
- Verify all features work

## Unresolved Questions

1. Does Gradle 8.10.2 need update?
2. Are there other Compose Compiler conflicts?
3. Will this affect iOS builds?
