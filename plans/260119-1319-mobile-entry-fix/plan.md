# [Bug Fix] Mobile App Entry Point Configuration

**Date**: 2026-01-19
**Type**: Bug Fix
**Priority**: Critical
**Component**: Mobile App (apps/mobile)

## Executive Summary
Mobile app fails to start due to: (1) Missing asset files referenced in app.json, (2) Entry point mismatch between package.json pointing to expo-router/entry while using custom navigation in App.tsx.

## Issue Analysis

### Symptoms
- `Error: Asset not found: C:\Project\electric_contact_book\apps\mobile\assets\icon.png`
- `ConfigError: Cannot resolve entry file: The 'main' field defined in your 'package.json' points to an unresolvable or non-existent path`

### Root Cause
1. **Entry Point Conflict**: package.json uses `"main": "expo-router/entry"` but App.tsx implements custom React Navigation (not Expo Router)
2. **Missing Assets**: app.json references non-existent assets:
   - ./assets/icon.png
   - ./assets/splash.png
   - ./assets/adaptive-icon.png
   - ./assets/favicon.png

### Evidence
- **Error Location**: apps/mobile/package.json:5, apps/mobile/app.json:7-29
- **Actual Entry File**: apps/mobile/App.tsx exists with RootNavigator
- **Assets Directory**: Only contains README.md

## Solution Design

### Approach
Keep existing custom navigation (React Navigation) by fixing entry point to App.tsx and creating minimal placeholder assets.

### Changes Required

1. **package.json** (`apps/mobile/package.json`): Change `"main"` from `"expo-router/entry"` to `"./App.tsx"`
2. **app.json** (`apps/mobile/app.json`): Remove or update asset paths to point to valid locations
3. **Assets** (`apps/mobile/assets/`): Create minimal placeholder images or use Expo's default asset handling

### Testing Changes
- Run `pnpm --filter @school-management/mobile start` - should start Metro bundler without errors
- Verify app launches in Expo Go/dev client

## Implementation Steps

1. [ ] Fix package.json main entry - file: `apps/mobile/package.json`
2. [ ] Update app.json to use data URI or remove asset references - file: `apps/mobile/app.json`
3. [ ] Create minimal assets OR use Expo's built-in defaults - directory: `apps/mobile/assets/`
4. [ ] Test Metro bundler startup
5. [ ] Verify no ConfigError remains

## Verification Plan

### Test Cases
- [ ] `pnpm --filter @school-management/mobile dev` - Metro starts successfully
- [ ] No "Asset not found" errors
- [ ] No "Cannot resolve entry file" errors
- [ ] App navigation works correctly

### Rollback Plan
If issues occur:
1. Revert package.json main field
2. Restore app.json asset paths

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing navigation | Low | Only changing entry point, App.tsx remains unchanged |
| Asset quality issues | Low | Using minimal placeholders that can be replaced later |

## TODO Checklist

- [x] Update package.json main field
- [x] Fix app.json asset references
- [x] Create/update assets (using Expo defaults)
- [x] Test Metro startup
- [x] Verify app runs in dev client

**Status**: ✅ DONE (2026-01-19 13:36)
**Code Review**: See `plans/reports/code-reviewer-260119-1332-mobile-entry-fix.md`
**Test Report**: See `plans/reports/tester-260119-1325-mobile-entry-fix.md`
