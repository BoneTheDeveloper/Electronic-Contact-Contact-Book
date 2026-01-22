# Phase 04: Component Testing

## Context Links

- [Phase 02: Library Compatibility](./phase-02-library-compatibility.md)
- [New Architecture Compatibility](../../apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md)
- [Integration Test Plan](../../apps/mobile/docs/INTEGRATION_TEST_PLAN.md)

## Overview

Test all screens and components after library upgrades to verify rendering and functionality.

## Key Insights

- React Native Paper 6.x may have rendering bugs with Fabric (not enabled)
- Navigation flows need verification after v7 updates
- AsyncStorage operations should be tested
- All screens need visual verification

## Requirements

- Test all parent/student screens render correctly
- Verify navigation flows work as expected
- Test AsyncStorage operations
- Document any rendering issues
- Create bug reports for issues found

## Architecture

**Test Coverage Areas:**

```
Screen Testing:
├── Auth Screens
│   ├── LoginScreen.tsx
│   └── CustomLoginScreen.tsx
├── Parent Screens (13 screens)
│   ├── Dashboard.tsx - Service icons, header, cards
│   ├── Schedule.tsx
│   ├── Grades.tsx
│   ├── Attendance.tsx
│   ├── LeaveRequest.tsx
│   ├── TeacherFeedback.tsx
│   ├── News.tsx
│   ├── Summary.tsx
│   ├── TeacherDirectory.tsx
│   ├── Payment*.tsx (4 screens)
│   ├── Messages.tsx
│   └── Notifications.tsx
└── Student Screens
    └── Dashboard.tsx

Navigation Testing:
├── Auth → Parent/Student flow
├── Tab navigation (Parent/Student tabs)
├── Stack navigation (HomeStack, ProfileStack, etc.)
└── Back navigation behavior

Storage Testing:
├── Auth state persistence
├── Child selection persistence
└── Any other AsyncStorage usage
```

## Related Code Files

**All Screens:**
- `apps/mobile/src/screens/**/*.tsx`

**Navigation:**
- `apps/mobile/src/navigation/*.tsx`

**Stores:**
- `apps/mobile/src/stores/*.ts`

**Test Scripts:**
- Create `apps/mobile/scripts/test-screens.ts`

## Implementation Steps

### 1. Create Screen Testing Script

**Create `apps/mobile/scripts/test-screens.ts`:**
```typescript
#!/usr/bin/env tsx

/**
 * Screen Testing Checklist
 * Run through each screen and verify rendering
 */

const SCREENS = {
  auth: ['LoginScreen', 'CustomLoginScreen'],
  parent: [
    'Dashboard',
    'Schedule',
    'Grades',
    'Attendance',
    'LeaveRequest',
    'TeacherFeedback',
    'News',
    'Summary',
    'TeacherDirectory',
    'PaymentOverview',
    'PaymentDetail',
    'PaymentMethod',
    'PaymentReceipt',
    'Messages',
    'Notifications',
  ],
  student: ['Dashboard'],
};

const CHECKLIST = [
  'Screen renders without errors',
  'Paper components display correctly',
  'Typography (Text variants) renders',
  'Buttons are tappable',
  'Cards render with proper elevation',
  'Icons display correctly',
  'ScrollViews work',
  'No console errors',
];

console.log('=== Screen Testing Checklist ===\n');
console.log('Navigate to each screen and verify:\n');
CHECKLIST.forEach((item, i) => console.log(`${i + 1}. ${item}`));
console.log('\n=== Screens to Test ===\n');
console.log(JSON.stringify(SCREENS, null, 2));
```

### 2. Manual Testing on iOS Simulator

```bash
cd apps/mobile
npx expo start --clear
# Press 'i' for iOS simulator
```

**Test Flow:**
1. Launch app
2. Login as parent (parent@econtact.vn / any password)
3. Navigate through each screen
4. Verify rendering
5. Test all navigation flows
6. Test tab switching
7. Test back navigation
8. Logout
9. Login as student (student@econtact.vn / any password)
10. Repeat checks

### 3. Manual Testing on Android Emulator

```bash
cd apps/mobile
npx expo start --clear
# Press 'a' for Android emulator
```

**Repeat test flow from iOS.**

### 4. Test Paper Components Specifically

**Focus areas:**
- Avatar component (initials, icons)
- Card component (elevation, borders)
- Text variants (headlineLarge, titleLarge, bodyMedium, etc.)
- Button components
- TextInput components (if any)
- BottomNavigation in tabs

**Known Paper 6.x Issues to Monitor:**
- Rendering glitches on animations
- Touch handling problems
- Theme switching issues
- Elevation/shadow inconsistencies

### 5. Test Navigation Behavior

**Critical Navigation Flows:**
- Auth → Main tabs
- Tab switching (Home, Schedule, Messages, Profile)
- Stack navigation (e.g., PaymentOverview → PaymentDetail)
- Back navigation (hardware back, header back button)
- Deep linking (if configured)

**React Navigation 7.x Specific Tests:**
- `navigate()` to new screen
- `popTo()` for back navigation
- `navigationInChildEnabled` behavior (if using)

### 6. Test AsyncStorage Operations

**Find all AsyncStorage usage:**
```bash
cd apps/mobile
grep -r "AsyncStorage" src/
```

**Test scenarios:**
- Login persistence on app restart
- Selected child persistence
- Any other stored data

**Clear storage and retest:**
```bash
# In app, add debug button to clear storage:
await AsyncStorage.clear();
```

### 7. Document Test Results

**Create test results file:**
```bash
touch apps/mobile/docs/TEST_RESULTS_SDK54.md
```

**Template:**
```markdown
# SDK 54 Test Results

**Date:** 2026-01-22
**Tester:** [Name]
**Build:** Development build / Simulator

## Screens Tested

### Auth
- [x] LoginScreen - Pass
- [x] CustomLoginScreen - Pass

### Parent Screens
- [ ] Dashboard - Notes: ...
- [ ] Schedule - Notes: ...
...

## Navigation Tested
- [ ] Auth flow
- [ ] Tab navigation
- [ ] Stack navigation
- [ ] Back navigation

## Issues Found

### Issue #1: [Description]
- Screen: ...
- Severity: ...
- Steps to reproduce: ...
- Screenshot: ...

## Paper Component Issues
- [ ] Avatar rendering
- [ ] Card elevation
- [ ] Text variants
- [ ] Other

## Overall Status
- [ ] Pass - Ready for production
- [ ] Pass with minor issues
- [ ] Fail - Blocker issues found
```

## Todo List

- [ ] Create screen testing script
- [ ] Test all auth screens on iOS
- [ ] Test all parent screens on iOS
- [ ] Test all student screens on iOS
- [ ] Test navigation flows on iOS
- [ ] Test AsyncStorage operations
- [ ] Repeat all tests on Android
- [ ] Document test results
- [ ] Create bug reports for issues

## Success Criteria

- [ ] All screens render without errors
- [ ] Navigation flows work correctly
- [ ] Paper components display properly
- [ ] No console errors
- [ ] AsyncStorage operations work
- [ ] Test results documented

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Paper rendering bugs | High | Medium | Document issues, report to GitHub |
| Navigation state loss | Low | High | Test thoroughly, fix issues |
| AsyncStorage data loss | Very Low | High | Verify persistence |
| Platform-specific bugs | Medium | Medium | Test both iOS/Android |

## Security Considerations

- Verify no sensitive data logged in console
- Check AsyncStorage doesn't expose credentials
- Verify no memory leaks in screens

## Known Issues to Monitor

### React Native Paper 6.x
- Rendering glitches: Monitor GitHub issues
- Touch handling: Test all interactive elements
- Theme consistency: Verify across all screens

### React Navigation 7.x
- navigate() behavior: Verify all navigation calls
- Back navigation: Test all back scenarios

## Next Steps

Proceed to Phase 05: Build Configuration
