---
title: "Phase 01: EAS Setup Verification"
description: "Verify EAS configuration, authentication, and project setup"
status: pending
priority: P1
effort: 30m
dependencies: []
created: 2026-01-21
---

# Phase 01: EAS Setup Verification

**Context:** `plan.md` | **Next:** `phase-02-development-build-profile.md`

## Overview

Verify EAS CLI installation, authentication status, and project configuration before creating development builds.

## Current State

**Verified:**
- ✅ EAS account: @bonethedev
- ✅ Project ID: 34d17c6d-8e17-4a4c-a2d7-f38d943667f3
- ✅ Expo SDK: 52.0.0
- ✅ eas.json configured

**To Verify:**
- EAS CLI version
- Project configuration validity
- Build profile settings
- Development dependencies

## Key Insights

1. **EAS CLI Requirement:** Version >= 5.2.0 required for SDK 52
2. **Project Already Configured:** `eas.json` exists with development profile
3. **Development Client Plugin:** Already configured in `app.json`
4. **Windows Consideration:** Use EAS cloud builds (not local builds)

## Requirements

### Prerequisites

- [x] Node.js >= 18.0.0
- [x] pnpm >= 8.0.0
- [ ] EAS CLI >= 5.2.0 (to verify)
- [ ] Valid EAS account
- [ ] Project configured with EAS

### Files to Check

- `apps/mobile/eas.json` - Build configuration
- `apps/mobile/app.json` - App configuration
- `apps/mobile/package.json` - Dependencies

## Implementation Steps

### Step 1: Verify EAS CLI Installation

```bash
# Check EAS CLI version
eas --version

# Expected: >= 5.2.0
# If not installed or outdated:
npm install -g eas-cli@latest
```

**Validation:** Version >= 5.2.0

---

### Step 2: Verify Authentication Status

```bash
cd C:\Project\electric_contact_book\apps\mobile

# Check current user
eas whoami

# Expected: @bonethedev
# If not logged in:
eas login
```

**Validation:** Shows @bonethedev

---

### Step 3: Verify Project Configuration

```bash
# Check project info
eas project:info

# Expected output:
# - ID: 34d17c6d-8e17-4a4c-a2d7-f38d943667f3
# - Name: @bonethedev/econtact-school
```

**Validation:** Project ID matches

---

### Step 4: Validate app.json

```bash
# Validate app configuration
npx expo config --type json

# Check for:
# - expo-dev-client plugin
# - Correct bundle ID
# - Project ID in extra.eas
```

**Validation:** No errors, all fields present

---

### Step 5: Validate eas.json

```bash
# Check build profiles
eas build:list

# Verify development profile exists:
# - developmentClient: true
# - distribution: "internal"
# - android.buildType: "apk"
# - ios.simulator: false (for physical devices)
```

**Validation:** Development profile configured correctly

---

### Step 6: Check Dependencies

```bash
# Verify expo-dev-client installed
npm list expo-dev-client

# Expected: ~4.0.0

# Check for common dev dependencies
npm list | grep -E "(expo-dev-client|expo-status-bar)"
```

**Validation:** expo-dev-client installed

---

### Step 7: Verify Git Status

```bash
cd C:\Project\electric_contact_book

# Check git status
git status

# Ensure no uncommitted changes in mobile/app.json or mobile/eas.json
# Commit changes if needed before building
```

**Validation:** Clean git state or committed changes

---

## Todo List

- [ ] Verify EAS CLI version >= 5.2.0
- [ ] Confirm logged in as @bonethedev
- [ ] Validate project ID matches
- [ ] Check app.json has expo-dev-client plugin
- [ ] Verify eas.json development profile
- [ ] Confirm expo-dev-client dependency installed
- [ ] Check git status for uncommitted config changes
- [ ] Document any issues found

## Success Criteria

**Phase Complete When:**
- EAS CLI version >= 5.2.0 installed
- Logged in as @bonethedev
- Project configuration valid
- Development profile exists in eas.json
- expo-dev-client plugin enabled
- No configuration errors

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| EAS CLI outdated | Medium | Medium | Upgrade with npm install -g eas-cli |
| Wrong account logged in | Low | High | Logout and login as @bonethedev |
| Project ID mismatch | Low | Critical | Verify with eas project:info |
| Missing dependencies | Low | Medium | Run pnpm install |
| Git conflicts | Low | Low | Commit or stash changes |

## Security Considerations

- **Never commit** EAS credentials to git
- **Never share** build artifacts publicly
- **Verify** project ownership before building
- **Use** EAS-managed credentials when possible

## Troubleshooting

### Issue: "eas: command not found"

**Solution:**
```bash
npm install -g eas-cli
# Or use npx:
npx eas build --profile development --platform android
```

---

### Issue: "Not logged in"

**Solution:**
```bash
eas login
# Enter credentials for @bonethedev
```

---

### Issue: "Project not found"

**Solution:**
```bash
eas build:configure
# Follow prompts to link project
```

---

### Issue: "expo-dev-client not installed"

**Solution:**
```bash
cd apps/mobile
pnpm install expo-dev-client
```

---

### Issue: "Invalid app.json"

**Solution:**
```bash
npx expo config --validate
# Fix reported errors
```

---

## Validation Commands

```bash
# Complete verification script
cd C:\Project\electric_contact_book\apps\mobile

# 1. Check EAS CLI
eas --version

# 2. Check authentication
eas whoami

# 3. Check project
eas project:info

# 4. Validate config
npx expo config --type json

# 5. Check dependencies
npm list expo-dev-client

# 6. List recent builds
eas build:list --limit=5
```

## Expected Output

**Successful Verification:**
```
✓ EAS CLI: 5.2.0
✓ Authenticated: @bonethedev
✓ Project: 34d17c6d-8e17-4a4c-a2d7-f38d943667f3
✓ SDK: 52.0.0
✓ Plugin: expo-dev-client
✓ Dependencies: Installed
```

## Related Files

- `apps/mobile/eas.json` - Build profiles
- `apps/mobile/app.json` - App configuration
- `apps/mobile/package.json` - Dependencies

## Next Steps

After verification complete, proceed to **Phase 02: Development Build Profile** to configure build profiles for physical devices.

## Notes

- **Windows Platform:** All builds must use EAS cloud (no local iOS builds on Windows)
- **Free Tier:** EAS free tier has build time limits (plan accordingly)
- **First Build:** May take longer due to setup

---

**Status:** Pending
**Last Updated:** 2026-01-21
