# Phase 04: Install and Test

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Install development client APK on Android device and test app functionality
**Priority:** P1 (Final validation phase)
**Status:** pending
**Effort:** 30m

## Key Insights

- APK installs like any Android app
- Dev Client replaces Expo Go for development
- Connects to local dev server via QR code or manual URL
- Full native module access
- No Metro bundler errors

## Requirements

1. Android device or emulator
2. Built APK from Phase 03
3. Device on same network as development machine
4. USB cable or file transfer method

## Architecture

**Connection Flow:**
```
Dev Server (localhost:8081) ←→ Network ←→ Dev Client App
                                              ↓
                                        React Native 0.76.6
                                              ↓
                                        All Native Modules
```

## Related Files

- **App Entry:** `/apps/mobile/App.tsx`
- **Navigation:** `/apps/mobile/src/navigation/`
- **Metro Config:** `/apps/mobile/metro.config.js`

## Implementation Steps

### Step 1: Transfer APK to Device

**Option A: USB Transfer (Recommended)**
```bash
# Connect device via USB
# Enable file transfer mode
# Copy APK to device Downloads
# Use file manager to install
```

**Option B: Download directly on device**
```bash
# Upload APK to cloud storage (Google Drive, Dropbox)
# Download on device
# Install from Downloads
# Allow "Install from unknown sources" if prompted
```

**Option C: ADB Install (if Android SDK available)**
```bash
adb install EContact-School-*.apk
```

### Step 2: Install Development Client

**On Android device:**
1. Open the APK file (from Downloads, file manager, or browser)
2. Tap "Install"
3. Wait for installation (~30 seconds)
4. Tap "Open" or find app in app drawer

**App icon:** "EContact School" (Expo logo with your app name)

### Step 3: Start Development Server

```bash
cd C:\Project\electric_contact_book\apps\mobile

# Start dev server
pnpm start

# Or with cache clear
pnpm dev
```

**Expected Output:**
```
Starting project at C:\Project\electric_contact_book\apps\mobile
Starting Metro Bundler
Waiting on http://localhost:8081
Logs for your project will appear below.

› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
```

### Step 4: Connect Dev Client

**Option A: QR Code Scan (Recommended)**
1. Ensure device and computer on same Wi-Fi
2. Open "EContact School" Dev Client app
3. Tap "Scan QR Code" or enter URL manually
4. Scan QR code in terminal
5. App should load and connect

**Option B: Manual URL Entry**
1. Find your computer's IP address:
```bash
ipconfig | findstr IPv4
# Example: 192.168.100.11
```
2. In Dev Client, enter: `exp://192.168.100.11:8081`

**Option C: Android Emulator (if using)**
```bash
# Press 'a' in terminal
# Dev Client opens in connected emulator
```

### Step 5: Verify App Functionality

**Test Checklist:**

**1. App Launch**
- [ ] App opens without crash
- [ ] Shows "EContact School" splash/loading
- [ ] Main screen renders correctly

**2. Navigation**
- [ ] Bottom tabs visible and working
- [ ] Stack navigation works (back button)
- [ ] Screen transitions smooth

**3. UI Components**
- [ ] React Native Paper components render
- [ ] Buttons, text inputs work
- [ ] Theme applied (light/dark)
- [ ] Safe areas handled correctly

**4. Features**
- [ ] State management works (Zustand)
- [ ] AsyncStorage operations work
- [ ] No Metro bundler errors in terminal
- [ ] Hot reload works (save file → app updates)

**5. Performance**
- [ ] App responsive (no lag)
- [ ] Memory usage reasonable
- [ ] No excessive warnings in logs

### Step 6: Debugging Setup

**View Device Logs:**
```bash
# Terminal shows live logs from device
# Look for errors, warnings, info messages
```

**React Native Debugger:**
```bash
# Shake device in Dev Client (Cmd+M on emulator)
# Enable "Debug" menu
# Opens Chrome DevTools for debugging
```

**Fast Refresh:**
```bash
# Save any .tsx/.ts file
# App reloads automatically
# Changes reflect instantly
```

## Todo List

- [ ] Transfer APK to Android device
- [ ] Install Dev Client app
- [ ] Start development server
- [ ] Connect Dev Client to server
- [ ] Test app launch and navigation
- [ ] Verify all features work
- [ ] Test hot reload functionality

## Success Criteria

- [ ] Dev Client installs without errors
- [ ] App connects to development server
- [ ] No Metro bundler errors (main goal!)
- [ ] Navigation works correctly
- [ ] All UI components render properly
- [ ] Hot reload functions
- [ ] App is stable and responsive

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Device incompatible | Very Low | Medium | Check Android version (5.0+) |
| Network connection fails | Medium | High | Same Wi-Fi, check firewall |
| APK install blocked | Low | Low | Enable "unknown sources" |
| App crashes on launch | Low | High | Check logs, rebuild if needed |
| Metro bundler still errors | Very Low | Critical | Verify EAS build used (not Expo Go) |

## Troubleshooting

**Issue:** "Unable to load script from network"
```bash
# Check device and computer on same network
# Verify firewall allows port 8081
# Try manual URL entry instead of QR
# Check IP address: ipconfig
```

**Issue:** "Connection timeout"
```bash
# Restart dev server
pnpm start

# Clear Metro cache
pnpm start --clear

# Check antivirus/firewall
```

**Issue:** "App crashes immediately"
```bash
# Check terminal logs for errors
# Verify APK downloaded completely
# Rebuild if needed:
eas build --profile development --platform android
```

**Issue:** "Hot reload not working"
```bash
# Shake device, tap "Reload"
# Verify metro bundler shows "Fast Refresh" enabled
# Check file saves trigger bundler updates
```

**Issue:** Metro bundler errors appear
```bash
# This should NOT happen with Dev Client
# If it does, verify:
# 1. Using Dev Client app (not Expo Go)
# 2. Connected to development server
# 3. Using correct EAS build profile
```

## Comparison: Before vs After

**Before (Expo Go):**
```
✗ Metro bundler errors with RN 0.76.6 specs
✗ Flow type definitions causing crashes
✗ Limited native module support
✗ Stuck on older React Native versions
```

**After (Dev Client):**
```
✓ No Metro bundler errors
✓ Full React Native 0.76.6 support
✓ All native modules included
✓ Fast Refresh working
✓ Full feature parity with production
```

## Development Workflow

**Daily Development:**
```bash
# 1. Start dev server
pnpm start

# 2. Open Dev Client app (already installed)

# 3. Scan QR or enter URL (connects automatically)

# 4. Develop with hot reload
# - Edit files
# - App updates automatically
# - Shake device for debug menu

# 5. When done, close Dev Client
# - Stop dev server: Ctrl+C
```

**Rebuilding Dev Client (Rare):**
```bash
# Only needed when:
# - Adding new native dependencies
# - Changing app.json configuration
# - Updating Expo SDK

# Trigger rebuild
pnpm run build:android

# Install new APK
# Overwrites existing Dev Client
```

## Next Steps

After successful testing:
1. Continue app development normally
2. Use Dev Client for all testing
3. Build preview/production builds when ready
4. Share Dev Client APK with team for testing

## Validation Commands

```bash
# Check if server is running
curl http://localhost:8081/status

# View connected devices
# Terminal shows: "››› Metro waiting on exp://..."

# Test bundle
curl http://localhost:8081/index.bundle?platform=android
```

## Important Notes

- **Dev Client is permanent** - No need to rebuild unless dependencies change
- **Same network required** - Device and computer must communicate
- **Hot Reload is fast** - Changes reflect in 1-2 seconds
- **Debugging enabled** - Shake device for debug menu
- **Production builds separate** - Use preview/production profiles for store builds

## Quick Reference

**Common Commands:**
```bash
# Start dev server
pnpm start

# Start with cache clear
pnpm dev

# Rebuild Dev Client
pnpm run build:android

# Check EAS builds
eas build:list

# View build logs
eas build:view [build-id]
```

**Keyboard Shortcuts (Terminal):**
```
a  - Open Android
m  - Toggle menu
r  - Reload app
d  - Toggle debug menu
```

**Device Gestures:**
```
Shake device - Debug menu
Two-finger tap - Reload
```

---

**Plan Complete!** Your EAS Development Client is now set up and working.

No more Expo Go compatibility issues. Full React Native 0.76.6 support with all native modules.
