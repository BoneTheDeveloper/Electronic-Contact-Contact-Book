# Phase 03: Build Development Client

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Build Android development client APK using EAS cloud build service
**Priority:** P1 (Critical - core deliverable)
**Status:** pending
**Effort:** 20m (active) + 15-20m (build time)

## Key Insights

- EAS cloud build handles Android SDK requirements
- First build: 15-20 minutes, cached builds: 5-10 minutes
- Uses `development` profile from eas.json
- Generates installable APK file
- Build happens in cloud, no local resources needed

## Requirements

1. EAS account authenticated (Phase 01)
2. Dependencies installed (Phase 02)
3. Active internet connection
4. EAS project configured

## Architecture

**Build Process:**
```
Local Machine → EAS CLI → EAS Cloud Build
                                    ↓
                              Clone code
                                    ↓
                              Install deps
                                    ↓
                              Compile native
                                    ↓
                              Generate APK
                                    ↓
                              Download link
```

**EAS Build Profile (development):**
```json
{
  "developmentClient": true,
  "distribution": "internal",
  "android": {
    "buildType": "apk",
    "image": "latest"
  }
}
```

## Related Files

- **Build Config:** `/apps/mobile/eas.json`
- **App Config:** `/apps/mobile/app.json`
- **Package:** `/apps/mobile/package.json`

## Implementation Steps

### Step 1: Pre-Build Verification

```bash
cd C:\Project\electric_contact_book\apps\mobile

# Verify EAS authentication
eas whoami

# Verify project configuration
eas project:info

# Check build profile
cat eas.json | grep -A 10 "development"
```

**Expected Output:**
- EAS shows your account
- Project ID configured
- development profile exists

### Step 2: Trigger EAS Build

```bash
eas build --profile development --platform android
```

**Or using npm script:**
```bash
pnpm run build:android
```

**Expected Prompt:**
```
✔ Would you like to automatically create an Android Keystore?
› yes / no
```

**Select: yes** (EAS will generate and manage keystore)

### Step 3: Monitor Build Progress

Build progresses through stages:

1. **Queue** (1-2 min)
   ```
   ✔ Build queued
   ```

2. **Build in Progress** (10-15 min)
   ```
   ✔ Build started
   ✔ Cloning repository
   ✔ Installing dependencies
   ✔ Configuring project
   ✔ Building application
   ```

3. **Complete**
   ```
   ✔ Build finished
   ```

**Monitor via:**
```bash
# Terminal shows live updates
# Or check EAS dashboard: https://expo.dev
```

### Step 4: Download APK

When build completes:
```
✔ Build finished
✔ APK available at: https://expo.dev/artifacts/...
```

**Download options:**

**Option A: Direct download link**
```bash
# EAS provides URL in terminal
# Open in browser to download
```

**Option B: EAS CLI download**
```bash
eas build:view [build-id]
# Follow prompts to download
```

**Option C: Install directly to device**
```bash
# If device connected via ADB
eas build:install [build-id]
```

### Step 5: Verify APK

```bash
# Check downloaded file
ls -lh *.apk

# Expected: ~50-100MB file size
# Name pattern: EContact-School-[version]-dev.apk
```

## Todo List

- [ ] Verify EAS authentication
- [ ] Check eas.json configuration
- [ ] Trigger EAS build
- [ ] Monitor build progress
- [ ] Download APK file
- [ ] Verify APK size and integrity

## Success Criteria

- [ ] Build completes without errors
- [ ] Status shows "Build finished"
- [ ] APK download link provided
- [ ] APK file size between 50-100MB
- [ ] Build available in EAS dashboard

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build fails (native code) | Low | High | Check logs, fix errors, retry |
| Build timeout (network) | Low | Medium | Stable connection required |
| Out of build credits | Very Low | High | Free tier: 30 builds/month |
| APK corrupted on download | Very Low | Low | Re-download from link |
| EAS service down | Very Low | Medium | Check status page, retry later |

## Troubleshooting

**Issue:** Build fails with native compilation error
```bash
# View detailed logs
eas build:view [build-id]

# Check error details
# Common fixes:
# - Update dependencies
# - Check app.json configuration
# - Verify plugin compatibility
```

**Issue:** Build stuck in queue
```bash
# Check EAS status
# Visit: https://status.expo.dev

# Cancel and retry
eas build cancel [build-id]
eas build --profile development --platform android
```

**Issue:** "Out of builds"
```bash
# Check build usage
eas build:list

# Options:
# 1. Wait for monthly reset
# 2. Upgrade to paid plan
# 3. Use local build (requires Android Studio)
```

**Issue:** Keystore generation error
```bash
# Let EAS create keystore (select 'yes' when prompted)
# Or provide existing keystore in eas.json:
"android": {
  "keystore": {
    "keystorePath": "./keystore.jks"
  }
}
```

## Build Output Example

**Successful build:**
```
✔ Build queued (run: eas build:view [run-id] for details)
✔ Build started (run: eas build:view [run-id] for details)
✔ Cloning repository
✔ Installing dependencies 8m 32s
✔ Configuring project
✔ Building application 6m 45s
✔ Build finished

Build details:
  Platform: android
  Type: development-client
  Version: 1.0.0
  Status: finished

APK: https://expo.dev/artifacts/eas/...
Size: 67.2 MB
```

## EAS Dashboard

**Monitor builds online:**
1. Visit https://expo.dev
2. Login to your account
3. Select "EContact School" project
4. View build history and logs

**Dashboard features:**
- Real-time build logs
- Build artifacts storage
- Build history and metrics
- Team collaboration (if applicable)

## Next Steps

After successful build, proceed to [Phase 04: Install and Test](./phase-04-install-and-test.md)

## Validation Commands

```bash
# Check build status
eas build:list

# View specific build
eas build:view [build-id]

# List recent builds
eas build:list --limit=10 --platform=android
```

## Important Notes

- **First build is longest** - Subsequent builds use caching
- **Builds expire** - Artifacts available for ~90 days
- **Incremental builds** - Only rebuild changed code (faster)
- **Background builds** - Can work while build runs in cloud
- **Local caching** - EAS caches node_modules for faster builds

## Build Variations

**For testing without EAS (requires Android Studio):**
```bash
pnpm run android
# Only works if Android SDK installed locally
# Not recommended for current setup
```

**For different build profiles:**
```bash
# Preview build (test distribution)
eas build --profile preview --platform android

# Production build (store ready)
eas build --profile production --platform android
```
