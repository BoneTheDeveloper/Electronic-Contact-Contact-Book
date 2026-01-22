# Phase 02: Dependencies Installation

**Parent Plan:** [plan.md](./plan.md)

## Overview

**Date:** 2026-01-21
**Description:** Install expo-dev-client and all project dependencies
**Priority:** P1 (Required before build)
**Status:** pending
**Effort:** 15m

## Key Insights

- expo-dev-client ~4.0.2 already added to package.json
- react-native-screens downgraded to ~3.34.0 for compatibility
- All navigation and UI libraries pre-configured
- No additional dependencies needed

## Requirements

1. Install all npm dependencies
2. Verify expo-dev-client is installed
3. Check for any dependency conflicts
4. Validate package.json configuration

## Related Files

- **Primary:** `/apps/mobile/package.json`
- **Config:** `/apps/mobile/app.json`
- **Lock:** `pnpm-lock.yaml`

## Implementation Steps

### Step 1: Navigate to Project Directory

```bash
cd C:\Project\electric_contact_book\apps\mobile
```

### Step 2: Clean Existing Dependencies (Optional but Recommended)

```bash
# Remove node_modules and lock file if any issues occur
rm -rf node_modules
rm -f pnpm-lock.yaml
```

### Step 3: Install Dependencies

```bash
pnpm install
```

**Expected Output:**
```
Packages: +XX
Progress: resolved XXX, reused XX, downloaded XX, added XX
...
Done in XXs
```

**What gets installed:**
- `expo-dev-client ~4.0.2` - Development client runtime
- `expo ~54.0.0` - Expo SDK
- `react-native 0.76.6` - React Native framework
- `react-native-screens ~3.34.0` - Navigation screens (downgraded)
- `react-navigation 7.x` - Navigation libraries
- `react-native-paper 5.14.5` - Material UI components

### Step 4: Verify Installation

```bash
# Check expo-dev-client is installed
pnpm list expo-dev-client

# Expected: expo-dev-client 4.0.x

# Check all dependencies
pnpm list --depth=0
```

### Step 5: Validate Configuration

```bash
# Check app.json syntax
npx expo config --type prebuild

# Verify eas.json
npx eas build:list
```

## Todo List

- [ ] Navigate to project directory
- [ ] Run `pnpm install`
- [ ] Verify expo-dev-client installation
- [ ] Check for dependency conflicts
- [ ] Validate app.json configuration

## Success Criteria

- [ ] `pnpm install` completes without errors
- [ ] `expo-dev-client` shows in `pnpm list` output
- [ ] No peer dependency warnings
- [ ] `node_modules` contains expo-dev-client folder

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Peer dependency conflicts | Low | Medium | Override in package.json already set |
| Network timeout | Low | Low | Retry pnpm install |
| pnpm not installed | Very Low | High | Use npm as fallback |
| Cache corruption | Low | Low | Clear pnpm cache |

## Troubleshooting

**Issue:** peer dependency warnings
```bash
# Already handled in package.json overrides
# If warnings persist, check versions:
pnpm why react-navigation
```

**Issue:** install fails
```bash
# Clear pnpm cache
pnpm store prune

# Retry install
pnpm install
```

**Issue:** expo-dev-client not found
```bash
# Verify package.json
cat package.json | grep expo-dev-client

# Reinstall
pnpm install expo-dev-client@~4.0.2
```

## Current Configuration

**package.json key dependencies:**
```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-dev-client": "~4.0.2",
    "react": "18.3.1",
    "react-native": "0.76.6",
    "react-native-screens": "~3.34.0",
    "@react-navigation/native": "^7.0.0",
    "react-native-paper": "^5.14.5"
  }
}
```

**app.json plugin:**
```json
{
  "plugins": ["expo-dev-client"]
}
```

## Next Steps

After installation completes, proceed to [Phase 03: Build Development Client](./phase-03-build-dev-client.md)

## Validation Commands

```bash
# Verify all dependencies
pnpm list --depth=0

# Check expo-dev-client specifically
pnpm list expo-dev-client

# Validate Expo config
npx expo config

# Check for any issues
npx expo doctor
```

## Notes

- First installation may take 2-3 minutes
- Subsequent installs use pnpm cache (much faster)
- No native code compilation required (handled by EAS)
- react-native-screens downgrade is intentional for Expo Go compatibility fallback
