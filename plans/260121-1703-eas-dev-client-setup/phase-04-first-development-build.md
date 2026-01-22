---
title: "Phase 04: First Development Build"
description: "Create and deploy first development client build for Android and iOS"
status: pending
priority: P1
effort: 90m
dependencies: ["phase-03-credentials-setup"]
created: 2026-01-21
---

# Phase 04: First Development Build

**Context:** `plan.md` | **Prev:** `phase-03-credentials-setup.md` | **Next:** `phase-05-ota-updates.md`

## Overview

Create first development client builds for Android (APK) and iOS (IPA/TestFlight) using EAS cloud builds.

## Current State

**Prerequisites Complete:**
- ✅ EAS configured
- ✅ Build profiles configured
- ✅ Credentials set up
- ✅ Project ready for builds

**Next:** Create first builds

## Key Insights

1. **Build Times:** First builds take longer (15-30 min)
2. **Android:** APK installs directly on devices
3. **iOS:** IPA distributed via TestFlight
4. **Windows:** Can build both platforms via EAS cloud
5. **Monitoring:** Use EAS dashboard to track progress

## Requirements

### Before Building

- [ ] EAS credentials verified
- [ ] Build profiles configured
- [ ] Clean git status (recommended)
- [ ] Device ready for testing
- [ ] Stable internet connection

### Device Requirements

**Android:**
- Android 5.0+ (Lollipop)
- Allow installs from unknown sources
- 100MB free space

**iOS:**
- iOS 15.1+
- TestFlight app installed
- 200MB free space

## Implementation Steps

### Step 1: Pre-Build Checks

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Verify EAS status
eas whoami

# 2. Check project info
eas project:info

# 3. Verify credentials
eas credentials:list

# 4. Validate configuration
npx expo config --validate

# 5. Check git status
git status
```

**Expected:** All checks pass, no errors

---

### Step 2: Create Android Development Build

```bash
# Start Android build
eas build --profile development --platform android

# Or use npm script:
npm run build:dev:android
```

**Build Process:**
1. EAS queues build
2. Provides build ID
3. Takes 10-20 minutes
4. Sends email when complete
5. Provides download link

**Expected Output:**
```
Build started...
Build ID: [BUILD_ID]
Build page: https://expo.dev/accounts/bonethedev/projects/econtact-school/builds/[BUILD_ID]

✓ Build queued
```

**Monitoring:**
```bash
# Check build status
eas build:status [BUILD_ID]

# View build logs
eas build:view [BUILD_ID]

# Or visit EAS dashboard
# https://expo.dev
```

---

### Step 3: Download and Install Android Build

**When Build Complete:**

1. **Download APK:**
   - Email link from EAS
   - Or EAS dashboard > Builds > [BUILD_ID]
   - Download `.apk` file

2. **Install on Device:**
   ```bash
   # Option 1: Direct install (if device connected via ADB)
   adb install econtact-school-development.apk

   # Option 2: Transfer and install
   # - Send APK to device (email, cloud storage, USB)
   # - Open APK on device
   # - Allow install from unknown source
   # - Install
   ```

3. **Verify Installation:**
   - App icon appears on home screen
   - App name: "EContact School"
   - Opens without crash
   - Shows "Waiting for development server" message

---

### Step 4: Create iOS Development Build

```bash
# Start iOS build
eas build --profile development --platform ios

# Or use npm script:
npm run build:dev:ios
```

**Build Process:**
1. EAS queues build
2. Provides build ID
3. Takes 15-30 minutes
4. Distributes via TestFlight
5. Sends TestFlight invite email

**Expected Output:**
```
Build started...
Build ID: [BUILD_ID]
Build page: https://expo.dev/accounts/bonethedev/projects/econtact-school/builds/[BUILD_ID]

✓ Build queued
```

**Note:** iOS builds require Apple Developer credentials configured in Phase 03.

---

### Step 5: Install iOS Build via TestFlight

**When Build Complete:**

1. **TestFlight Invitation:**
   - Email sent to testers
   - Includes TestFlight link
   - Open on iOS device

2. **Install via TestFlight:**
   - Open TestFlight app
   - Accept invitation
   - Install "EContact School"
   - Wait for download

3. **Verify Installation:**
   - App appears on home screen
   - Opens without crash
   - Shows "Waiting for development server" message

---

### Step 6: Start Development Server

```bash
cd C:\Project\electric_contact_book\apps\mobile

# Start development server
npx expo start --dev-client

# Expected output:
# › Metro waiting on exp://192.168.x.x:8081
# › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

### Step 7: Connect Device to Development Server

**Android:**

1. **Ensure device and computer on same network**
2. **Open development build app**
3. **Shake device** (or use dev menu)
4. **Select "Enter URL manually"**
5. **Enter:** `exp://[YOUR_COMPUTER_IP]:8081`

**Alternative (QR Code):**
```bash
# In dev server terminal, press:
# 'a' - Android (opens via adb)
# 's' - Send QR code via email
```

**iOS:**

1. **Ensure device and computer on same network**
2. **Open development build via TestFlight**
3. **Shake device** (dev menu)
4. **Select "Enter URL manually"**
5. **Enter:** `exp://[YOUR_COMPUTER_IP]:8081`

**Verify Connection:**
- App loads your development code
- Shows login screen
- Can interact with app
- Changes reflect immediately (Fast Refresh)

---

### Step 8: Test Development Build

**Basic Functionality Test:**

- [ ] App launches successfully
- [ ] Login screen displays
- [ ] Mock authentication works
- [ ] Navigate to parent/student dashboard
- [ ] Service icons render
- [ ] No red box errors
- [ ] Fast Refresh works (make code change, see update)

**Test Fast Refresh:**
```bash
# While app running:
# 1. Open src/screens/parent/Dashboard.tsx
# 2. Make small change (e.g., text)
# 3. Save file
# 4. App should update automatically
```

---

### Step 9: Document Build Process

**Update `apps/mobile/docs/DEVELOPMENT_BUILDS.md`:**

```markdown
# Development Builds

## Current Builds

### Android Development Build
- **Build Date:** [DATE]
- **Build ID:** [BUILD_ID]
- **Download:** [LINK]
- **Install:** Direct APK install

### iOS Development Build
- **Build Date:** [DATE]
- **Build ID:** [BUILD_ID]
- **Install:** TestFlight

## Usage

### Start Development Server
```bash
cd apps/mobile
npx expo start --dev-client
```

### Connect Device
1. Ensure same network
2. Open development build
3. Shake device for dev menu
4. Enter URL: `exp://[COMPUTER_IP]:8081`

## Troubleshooting

**"Cannot connect to development server"**
- Check same network
- Check firewall
- Verify IP address

**"Red box error"**
- Check terminal for errors
- Restart dev server: `npx expo start --clear`
```

---

## Todo List

- [ ] Run pre-build checks
- [ ] Create Android development build
- [ ] Download and install Android APK
- [ ] Create iOS development build
- [ ] Install iOS via TestFlight
- [ ] Start development server
- [ ] Connect Android device
- [ ] Connect iOS device
- [ ] Test basic functionality
- [ ] Test Fast Refresh
- [ ] Document builds

## Success Criteria

**Phase Complete When:**
- Android development build installed on device
- iOS development build installed via TestFlight
- Both devices connect to dev server
- Fast Refresh working
- Basic app functionality verified
- No critical errors

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Build fails | Medium | High | Check logs, fix errors, retry |
| Long build time | High | Low | Use EAS dashboard to monitor |
| Device won't connect | Medium | Medium | Check network, firewall |
| App crashes on launch | Low | High | Check logs, verify dependencies |
| Fast Refresh not working | Low | Low | Restart dev server |

## Troubleshooting

### Issue: "Build failed"

**Solution:**
```bash
# 1. Check build logs
eas build:view [BUILD_ID]

# 2. Common issues:
#    - Dependencies not installed
#    - Syntax errors in code
#    - Invalid configuration
#    - Missing native modules

# 3. Fix issues
# 4. Retry build
eas build --profile development --platform android
```

---

### Issue: "Device won't connect to dev server"

**Solution:**
```bash
# 1. Check same network
# Computer IP: ipconfig (Windows) / ifconfig (Mac/Linux)
# Device IP: Settings > Wi-Fi > Network info

# 2. Check firewall
# Windows: Allow Node.js through firewall
# macOS: Allow incoming connections

# 3. Restart dev server
npx expo start --clear --dev-client

# 4. Try tunnel mode (if networks differ)
npx expo start --tunnel
```

---

### Issue: "App crashes on launch"

**Solution:**
```bash
# 1. Check device logs
# Android: adb logcat
# iOS: Xcode > Devices > Logs

# 2. Check for missing native modules
npm list

# 3. Verify New Architecture disabled
# Check app.json: "newArchEnabled": false

# 4. Rebuild with clean cache
eas build --profile development --platform android --clear-cache
```

---

### Issue: "Fast Refresh not working"

**Solution:**
```bash
# 1. Ensure using --dev-client flag
npx expo start --dev-client

# 2. Shake device, verify "Fast Refresh" enabled

# 3. Restart dev server
npx expo start --clear --dev-client

# 4. Check for Fast Refresh errors in terminal
```

---

## Validation Commands

```bash
cd C:\Project\electric_contact_book\apps\mobile

# 1. Pre-build checks
eas whoami
eas project:info
npx expo config --validate

# 2. Start builds
eas build --profile development --platform android
eas build --profile development --platform ios

# 3. Monitor builds
eas build:status [BUILD_ID]
eas build:view [BUILD_ID]

# 4. Start dev server
npx expo start --dev-client

# 5. Test connection
# Shake device > Enter URL > exp://[IP]:8081
```

## Build Time Estimates

| Platform | First Build | Subsequent Builds |
|----------|-------------|-------------------|
| Android | 15-20 min | 10-15 min |
| iOS | 20-30 min | 15-20 min |

**Factors:**
- EAS queue time
- Project size
- Number of dependencies
- Network speed

## Expected Outputs

### Android Build
- **File:** `econtact-school-[version]-development.apk`
- **Size:** ~50-80 MB
- **Install:** Direct APK install

### iOS Build
- **Distribution:** TestFlight
- **Size:** ~100-150 MB
- **Install:** TestFlight app

## Related Files

- `apps/mobile/eas.json` - Build configuration
- `apps/mobile/docs/DEVELOPMENT_BUILDS.md` - Build documentation (to create)
- `apps/mobile/.gitignore` - Ensure APK not committed

## Next Steps

After builds complete and tested, proceed to **Phase 05: OTA Updates** to configure over-the-air updates for rapid iteration.

## Important Notes

**Development Build Characteristics:**
- Includes expo-dev-client
- Connects to local dev server
- Enables Fast Refresh
- Allows React DevTools
- Updates via OTA (next phase)

**Production Build Differences:**
- No dev client
- Self-contained
- No Fast Refresh
- Updates via app store

**Build Artifacts:**
- **DO NOT commit** APK/IPA to git
- **DO share** via EAS dashboard
- **DO document** build IDs and dates

---

**Status:** Pending
**Last Updated:** 2026-01-21
