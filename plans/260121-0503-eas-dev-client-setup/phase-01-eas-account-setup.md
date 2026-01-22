# Phase 01: EAS Account Setup

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Set up EAS account, configure authentication, and prepare project for cloud builds
**Priority:** P1 (Critical - blocks all subsequent phases)
**Status:** pending
**Effort:** 30m

## Key Insights

- EAS (Expo Application Services) provides cloud build infrastructure
- Free tier: 30 builds/month, sufficient for development
- Requires Expo account (can use GitHub login)
- One-time setup per project

## Requirements

1. Create/login to Expo account
2. Authenticate with EAS CLI
3. Configure project for EAS builds
4. Verify EAS project ID

## Related Files

- **Primary:** `/apps/mobile/eas.json` (already configured)
- **Project:** `/apps/mobile/app.json` (already configured)
- **Documentation:** [EAS Build Documentation](https://docs.expo.dev/eas)

## Implementation Steps

### Step 1: Install EAS CLI

```bash
cd C:\Project\electric_contact_book\apps\mobile
npm install -g eas-cli
```

**Verify:**
```bash
eas --version
# Expected: >= 5.2.0
```

### Step 2: Login to Expo Account

```bash
npx eas login
```

**Options:**
- Use existing Expo account (recommended)
- Sign up with email
- Login with GitHub

**Expected Output:**
```
✔ Logged in
```

### Step 3: Configure EAS Project

```bash
npx eas build:configure
```

**What it does:**
- Creates EAS project
- Adds `projectId` to `app.json`
- Configures build profiles

**Expected Output:**
```
✔ Created project EContact School
✔ Generated Android Keystore
✔ Configured eas.json
```

**Verify app.json contains:**
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

### Step 4: Verify Configuration

```bash
eas whoami
```

**Expected:** Shows your Expo account email

```bash
eas project:info
```

**Expected:** Shows project details with ID

## Todo List

- [ ] Install EAS CLI globally
- [ ] Login to Expo account
- [ ] Configure EAS project
- [ ] Verify project ID in app.json
- [ ] Run `eas whoami` to confirm authentication

## Success Criteria

- [ ] `eas --version` shows >= 5.2.0
- [ ] `eas login` completes successfully
- [ ] `eas build:configure` adds projectId to app.json
- [ ] `eas whoami` shows correct account

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| No Expo account | Low | Low | Create during login, use GitHub |
| EAS CLI install fails | Low | Low | Use `npx eas` without global install |
| Project ID conflicts | Very Low | Low | EAS auto-generates unique IDs |
| Network issues | Medium | Medium | Retry, check proxy settings |

## Troubleshooting

**Issue:** `eas: command not found`
```bash
# Use npx instead
npx eas login
```

**Issue:** Login fails
```bash
# Clear cache
npx eas logout
npx eas login
```

**Issue:** Project not found
```bash
# Reconfigure
npx eas build:configure
```

## Next Steps

After completing this phase, proceed to [Phase 02: Dependencies Installation](./phase-02-dependencies-install.md)

## Validation Commands

```bash
# Verify EAS CLI
eas --version

# Verify login
eas whoami

# Verify project
eas project:info

# Check app.json for projectId
cat app.json | grep projectId
```
