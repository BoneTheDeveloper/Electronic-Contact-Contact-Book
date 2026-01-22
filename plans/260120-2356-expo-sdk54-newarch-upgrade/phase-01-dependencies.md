# Phase 01: Dependencies & Configuration

**Parent Plan:** [plan.md](./plan.md)
**Research Reports:** [researcher-01](./research/researcher-01-report.md) | [researcher-02](./research/researcher-02-report.md)

## Overview

**Date:** 2026-01-21
**Description:** Verify all dependencies are compatible with New Architecture and install required build configuration plugins
**Priority:** P1 (Critical - must complete first)
**Status:** pending
**Effort:** 2h

## Key Insights

- **CRITICAL FIX:** React Native 0.76.6 → 0.81.0 upgrade required (SDK 54 requirement)
- **CRITICAL FIX:** React 18.3.1 → 19.1.0 upgrade required (SDK 54 requirement)
- Missing `expo-build-properties` plugin required for native build configuration
- Package.json has correct Expo SDK ~54.0.0 but incorrect React/React Native versions

## Requirements

1. Upgrade React Native from 0.76.6 to 0.81.0
2. Upgrade React from 18.3.1 to 19.1.0
3. Upgrade @types/react to match React 19
4. Install `expo-build-properties` plugin
5. Verify all dependencies are compatible with React 19
6. Update app.json with build properties configuration
7. Validate package.json excludes are correct

## Architecture

```
Current State:
package.json → Expo ~54.0.0 ✅
              → React Native 0.76.6 ❌ (needs 0.81.0)
              → React 18.3.1 ❌ (needs 19.1.0)
              → React Navigation 7.x ✅
              → expo-build-properties ❌ MISSING

Target State:
Upgrade React Native 0.76.6 → 0.81.0
Upgrade React 18.3.1 → 19.1.0
Add expo-build-properties plugin
Configure Android SDK 35
Configure iOS deployment target 15.1
```

## Related Code Files

- **Primary:** `/apps/mobile/package.json`
- **Primary:** `/apps/mobile/app.json`
- **Reference:** `/apps/mobile/eas.json` (existing EAS config)

## Implementation Steps

### Step 1: Upgrade React and React Native

**WARNING:** React 19 has breaking changes. Review [React 19 upgrade guide](https://react.dev/blog/2024/12/05/react-19) first.

```bash
cd /c/Project/electric_contact_book/apps/mobile

# Remove expo exclusions temporarily to allow upgrades
# Edit package.json: remove "react", "react-native" from expo.install.exclude

# Upgrade React Native to 0.81.0
npx expo install react-native@0.81.0

# Upgrade React to 19.1.0
npx expo install react@19.1.0

# Upgrade @types/react for React 19
npm install --save-dev @types/react@^19.0.0
```

**Expected Result:**
- react-native: 0.81.0 ✅
- react: 19.1.0 ✅
- @types/react: ^19.0.0 ✅

### Step 2: Verify React 19 Compatibility

React 19 breaking changes to review:
- `React.createRef()` API changes
- Component type definitions updated
- Context API behavior changes
- Form handling changes (if using forms)
- `useTransition` / `useDeferredValue` API updates

```bash
# Check for React 19 incompatibilities
npm list react react-native
```

### Step 3: Install expo-build-properties

```bash
npx expo install expo-build-properties
```

**Expected Result:** Plugin added to package.json dependencies

### Step 4: Verify All Dependencies

```bash
# Check Expo SDK version
npm list expo

# Check all dependencies
npm list --depth=0
```

**Expected Versions:**
- expo: ~54.0.0 ✅
- react-native: 0.81.0 ✅ (upgraded)
- react: 19.1.0 ✅ (upgraded)
- @react-navigation/*: 7.x ✅
- react-native-paper: 5.14.5 ✅

### Step 5: Update app.json with Build Properties

Edit `/apps/mobile/app.json`:

```json
{
  "expo": {
    "name": "EContact School",
    "slug": "econtact-school",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.schoolmanagement.econtact"
    },
    "android": {
      "package": "com.schoolmanagement.econtact"
    },
    "jsEngine": "hermes",
    "experiments": {
      "typedRoutes": false
    },
    "newArchEnabled": false,  // Will change in Phase 02
    "plugins": [
      [
        "expo-dev-client",
        {
          "newArchEnabled": false  // Will change in Phase 02
        }
      ],
      [  // ADD THIS BLOCK
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "targetSdkVersion": 35,
            "buildToolsVersion": "35.0.0"
          },
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ]
    ]
  }
}
```

### Step 6: Validate Configuration

```bash
# Validate app.json syntax
npx expo config --type prebuild

# Check for any config errors
npx expo doctor
```

**Expected:** No errors, valid configuration

## Todo List

- [ ] Backup current package.json and app.json
- [ ] Remove "react" and "react-native" from expo.install.exclude in package.json
- [ ] Upgrade React Native from 0.76.6 to 0.81.0
- [ ] Upgrade React from 18.3.1 to 19.1.0
- [ ] Upgrade @types/react to ^19.0.0
- [ ] Run TypeScript check to identify React 19 incompatibilities
- [ ] Fix any React 19 type errors or breaking changes
- [ ] Install expo-build-properties plugin
- [ ] Add build properties configuration to app.json
- [ ] Validate app.json syntax
- [ ] Run `npx expo doctor` to check for issues
- [ ] Test app compilation with React 19
- [ ] Commit changes with message: "feat(mobile): upgrade to React Native 0.81 + React 19.1 for SDK 54 compatibility"

## Success Criteria

- [ ] React Native upgraded to 0.81.0
- [ ] React upgraded to 19.1.0
- [ ] @types/react upgraded to ^19.0.0
- [ ] `expo-build-properties` in package.json dependencies
- [ ] app.json contains build properties plugin configuration
- [ ] Android SDK 35 configured
- [ ] iOS deployment target 15.1 configured
- [ ] `npx expo doctor` passes without errors
- [ ] TypeScript compilation still works (`npm run typecheck`)
- [ ] No React 19 breaking change errors in codebase

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| React 19 breaking changes | High | High | Review React 19 changelog, audit all React usage |
| React Native 0.81 breaking changes | Medium | High | Review RN 0.81 changelog, test all screens |
| TypeScript errors from React 19 types | High | Medium | Update type definitions, fix type mismatches |
| npm install fails | Low | Low | Use `npx expo install` for version compatibility |
| app.json syntax error | Low | Medium | Validate with `npx expo config` |
| Build properties incompatible | Very Low | High | Expo SDK 54 officially supports this plugin |

## Rollback Plan

If React 19 or RN 0.81 upgrade fails:

1. Restore package.json from backup
2. Restore app.json from backup
3. Run `rm -rf node_modules package-lock.json`
4. Run `npm install` to restore previous versions
5. Git reset to previous commit

```bash
# Quick rollback
git checkout package.json package-lock.json app.json
rm -rf node_modules
npm install
npm run typecheck
```

## Next Steps

Once this phase is complete and validated:

- React 19 and RN 0.81 installed and working
- All TypeScript errors resolved
- Proceed to [Phase 02: New Architecture Config](./phase-02-newarch-config.md)
- DO NOT enable newArchEnabled yet - that's Phase 02

## Validation Commands

```bash
# Run all validation checks
cd /c/Project/electric_contact_book/apps/mobile

# 1. Check React and React Native versions
npm list react react-native

# 2. Check expo-build-properties
npm list expo-build-properties

# 3. Validate config
npx expo config

# 4. Type check
npm run typecheck

# 5. Expo doctor
npx expo doctor

# 6. Check for React 19 specific issues
grep -r "React.createRef" src/
grep -r "ReactDOM" src/
```

## Notes

- **CRITICAL:** React 19 is a major version with breaking changes - review all React usage
- **CRITICAL:** React Native 0.81 is a major version upgrade - test thoroughly
- React 19 requires @types/react ^19.0.0
- This phase upgrades core dependencies before enabling New Architecture
- New Architecture enablement happens in Phase 02
- Build properties plugin allows fine-grained control over native builds

## React 19 Breaking Changes Reference

Key changes to review:
1. `React.createRef()` - API simplified
2. `React.useRef()` - Type definitions changed
3. Form handling - New form actions API
4. Context - Provider/Consumer type changes
5. `useTransition` / `useDeferredValue` - API updates
6. Component types - `FunctionComponent` types updated
7. `ReactDOM` - If used, check for API changes

## Troubleshooting

**Issue:** `npx expo install` fails
```bash
# Try manual install with specific version
npm install expo-build-properties --save-exact
```

**Issue:** app.json validation error
```bash
# Check JSON syntax
cat app.json | python -m json.tool
# or
npx expo config --type prebuild
```

**Issue:** Build properties version conflict
```bash
# Check compatible versions
npx expo install expo-build-properties --fix
```
