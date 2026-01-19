---
title: "Phase 04: Testing"
description: "Comprehensive testing of all 37 screens and features after Expo SDK 54 and New Architecture upgrade"
status: in-progress
priority: P1
effort: 4h
tags: [testing, validation, qa, new-architecture]
created: 2025-01-19
updated: 2026-01-19
---

## Context

- Parent Plan: [../plan.md](../plan.md)
- Mobile App: `apps/mobile/`
- Prerequisites:
  - [Phase 01: SDK Upgrade](./phase-01-sdk-upgrade.md) complete
  - [Phase 02: New Architecture](./phase-02-new-architecture.md) complete
  - [Phase 03: Component Compatibility](./phase-03-component-compatibility.md) complete

## Overview

**Date:** 2025-01-19
**Priority:** P1 (Critical)
**Status:** In Progress (Testing Infrastructure Complete)

This phase performs comprehensive testing to validate the Expo SDK 54 and New Architecture upgrade across all 37 screens, user flows, and features.

### Testing Infrastructure Created ✅

All testing utilities have been implemented in `apps/mobile/src/utils/devOnly/`:

- **verifyNewArchitecture.ts** - New Architecture verification (Fabric, TurboModules, Hermes)
- **screenChecklist.ts** - Complete list of 37 screens with categories and critical flags
- **performanceTest.ts** - Performance measurement utilities
- **TEST_REPORT_TEMPLATE.md** - Comprehensive test report template
- **README.md** - Complete documentation for testing utilities
- **index.ts** - Central export with `runDevChecks()` entry point

### Next Steps

The testing infrastructure is ready. Manual testing on physical devices/simulators is required to:
1. Build development versions for iOS and Android
2. Run `runDevChecks()` to verify New Architecture
3. Test all 37 screens using the checklist
4. Execute performance tests
5. Document results in test report

## Key Insights

From testing requirements:
- Development builds required (Expo Go won't work)
- Need to test on both iOS and Android
- New Architecture changes runtime behavior
- Navigation v7 changes all route transitions
- Performance characteristics may differ

## Requirements

### Functional
- All 37 screens functional without crashes
- All user flows work end-to-end
- Navigation works across all routes
- No regressions in existing features

### Technical
- Validate New Architecture enabled
- Verify Fabric rendering correctly
- Confirm TurboModules working
- Performance benchmarks acceptable

## Testing Strategy

### Test Matrix

| Platform | Build Type | Device Type | Coverage |
|----------|-----------|-------------|----------|
| iOS | Development | Simulator (iPhone 15) | All screens |
| iOS | Production | Simulator (iPhone SE) | Smoke tests |
| Android | Development | Emulator (Pixel 6) | All screens |
| Android | Production | Emulator (Low-end) | Smoke tests |
| Physical | Development | Real devices | Critical flows |

### Test Categories

1. **Smoke Tests** - Quick validation of critical paths
2. **Functional Tests** - All screens and features
3. **Navigation Tests** - All routes and transitions
4. **Performance Tests** - Frame rates, memory, startup
5. **New Architecture Tests** - Fabric/TurboModule verification

## Implementation Steps

### Step 1: Pre-Test Setup

**Install Development Build:**

```bash
# Build development versions
eas build --profile development --platform ios
eas build --profile development --platform android

# Or run locally
npx expo run:ios
npx expo run:android
```

**Enable New Architecture Verification:**

```typescript
// src/utils/devOnly/verifyNewArchitecture.ts
import { Platform, NativeModules } from 'react-native';

export interface NewArchitectureInfo {
  platform: string;
  newArchEnabled: boolean;
  hermesEnabled: boolean;
  turboModulesEnabled: boolean;
}

export const verifyNewArchitecture = (): NewArchitectureInfo => {
  const constants = NativeModules.PlatformConstants;

  return {
    platform: Platform.OS,
    newArchEnabled: constants?.isTurboModuleEnabled ?? false,
    hermesEnabled: !!global.HermesInternal,
    turboModulesEnabled: constants?.isTurboModuleEnabled ?? false,
  };
};

// Call from app root in DEV mode
if (__DEV__) {
  console.log('New Architecture:', verifyNewArchitecture());
}
```

**Deliverable:** Working development builds on both platforms

### Step 2: Smoke Tests (Critical Flows)

**Test Critical User Journeys:**

```bash
# Start development server
npx expo start --dev-client

# Test these flows:
```

| Flow | Steps | Expected Result |
|------|-------|-----------------|
| **Auth Flow** | Login → Dashboard → Logout | Successful auth, redirect to login |
| **Navigation** | All tabs accessible | Smooth transitions |
| **Student List** | Load → Scroll → Tap detail | List renders, navigation works |
| **Search** | Type query → Filter results | Real-time filtering |
| **Form Submit** | Fill form → Submit → Success | Data saved, redirect |

**Validation Criteria:**
- No crashes
- Navigation completes
- Data persists
- UI responsive

### Step 3: Screen-by-Screen Tests

**Create Test Checklist:**

```typescript
// tests/screenChecklist.ts
export const SCREEN_CHECKLIST = [
  // Auth Screens
  { path: 'auth/login', name: 'Login', critical: true },
  { path: 'auth/register', name: 'Register', critical: true },
  { path: 'auth/forgot-password', name: 'Forgot Password', critical: false },

  // Main Tabs
  { path: 'dashboard', name: 'Dashboard', critical: true },
  { path: 'students', name: 'Student List', critical: true },
  { path: 'attendance', name: 'Attendance', critical: true },
  { path: 'grades', name: 'Grades', critical: false },
  { path: 'messages', name: 'Messages', critical: false },
  { path: 'profile', name: 'Profile', critical: true },

  // Student Screens
  { path: 'students/[id]', name: 'Student Detail', critical: true },
  { path: 'students/new', name: 'New Student', critical: true },
  { path: 'students/[id]/edit', name: 'Edit Student', critical: true },

  // ... all 37 screens
];
```

**Test Each Screen:**

For each screen, verify:

1. **Rendering**
   - [ ] Screen loads without crash
   - [ ] All elements visible
   - [ ] No layout shifts
   - [ ] Styling correct

2. **Interactions**
   - [ ] Buttons respond to touch
   - [ ] Inputs accept text
   - [ ] Scrolls work smoothly
   - [ ] Modals open/close

3. **Navigation**
   - [ ] Back button works
   - [ ] Deep links work
   - [ ] Tab transitions smooth
   - [ ] Stack transitions animate

4. **Data**
   - [ ] Mock data loads
   - [ ] API calls succeed
   - [ ] State persists
   - [ ] Errors handled

### Step 4: Navigation Tests

**Test All Routes:**

```typescript
// tests/navigationTest.ts
import { navigationRef } from './rootNavigation';

export const testNavigation = async () => {
  const routes = [
    'Dashboard',
    'StudentList',
    'StudentDetail',
    // ... all routes
  ];

  for (const route of routes) {
    try {
      navigationRef.current?.navigate(route as never);
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`✅ Navigation to ${route} successful`);
    } catch (error) {
      console.error(`❌ Navigation to ${route} failed:`, error);
    }
  }
};
```

**Navigation Checklist:**

- [ ] All tabs accessible from tab bar
- [ ] Stack navigation works forward/back
- [ ] Deep linking works (e.g., `exp://.../students/123`)
- [ ] Nested navigation works
- [ ] Navigation params passed correctly
- [ ] Type-safe navigation working

### Step 5: New Architecture Verification

**Verify Fabric Enabled:**

```typescript
// Check if Fabric is rendering views
import { findNodeHandle, UIManager } from 'react-native';

export const verifyFabric = () => {
  // In React Native 0.81+, check if using Fabric renderer
  // This is a simplified check
  const hasFabricFeatures = !!(UIManager as any).getViewManagerConfig;

  console.log('Fabric features available:', hasFabricFeatures);

  return hasFabricFeatures;
};
```

**Verify TurboModules:**

```typescript
import { NativeModules } from 'react-native';

export const verifyTurboModules = () => {
  // Check if modules are using TurboModule format
  const modules = Object.keys(NativeModules);

  const turboModules = modules.filter(module => {
    try {
      return (NativeModules as any)[module]?.__turboModuleProxy;
    } catch {
      return false;
    }
  });

  console.log('TurboModules:', turboModules);

  return turboModules;
};
```

**Performance Benchmarks:**

```typescript
// tests/performanceTest.ts
import { Performance } from 'react-native';

export const measurePerformance = async (operation: () => Promise<void>) => {
  const start = Performance.now();
  await operation();
  const end = Performance.now();

  const duration = end - start;
  console.log(`Operation took ${duration.toFixed(2)}ms`);

  return duration;
};

// Test critical operations
await measurePerformance(async () => {
  // Navigate to heavy screen
  navigationRef.current?.navigate('StudentList');
});
```

**Acceptable Benchmarks:**

| Metric | Target | Max |
|--------|--------|-----|
| App startup | < 2s | 3s |
| Screen transition | < 300ms | 500ms |
| List scroll (60fps) | No drops | 1 drop per 100 items |
| Memory usage | < 200MB | 300MB |

### Step 6: Component-Specific Tests

**React Native Paper Components:**

```typescript
// Test all Paper components
import { Button, Card, Menu, TextInput } from 'react-native-paper';

export const testPaperComponents = () => {
  // Menu component (known bug)
  // Test menu open/close functionality

  // Cards
  // Test card press, elevation

  // Text inputs
  // Test focus, validation

  // Buttons
  // Test loading states, disabled states
};
```

**React Navigation v7:**

- [ ] NavigationContainer renders
- [ ] Stack navigators work
- [ ] Tab navigators work
- [ ] Drawer navigators work (if used)
- [ ] Linking works
- [ ] Deep linking works

**List Components:**

- [ ] FlatList scrolls smoothly
- [ ] SectionList works
- [ ] VirtualizedList works
- [ ] Pull-to-refresh works
- [ ] Infinite scroll works

### Step 7: Platform-Specific Tests

**iOS-Specific:**

- [ ] Safe areas correct
- [ ] Status bar behavior
- [ ] Keyboard handling
- [ ] Gestures (swipe back)
- [ ] Dark mode

**Android-Specific:**

- [ ] Back button handling
- [ ] Hardware keyboard
- [ ] Permissions flow
- [ ] Notifications (if used)
- [ ] Material Design 3

### Step 8: Regression Tests

**Test Previously Working Features:**

- [ ] Authentication works
- [ ] Data persistence works
- [ ] Offline mode works (if implemented)
- [ ] Error boundaries work
- [ ] Logging works

## Related Code Files

```
apps/mobile/
├── src/
│   ├── utils/
│   │   └── devOnly/
│   │       ├── verifyNewArchitecture.ts    # NEW: New Arch check
│   │       └── performanceTest.ts          # NEW: Performance tests
│   └── tests/                               # NEW: Test utilities
│       ├── screenChecklist.ts
│       ├── navigationTest.ts
│       └── componentTests.ts
└── __tests__/                               # Existing tests
    └── ...
```

## Todo List

### Setup
- [ ] Build iOS development version
- [ ] Build Android development version
- [ ] Install on test devices
- [ ] Create test checklist document
- [ ] Set up performance monitoring

### Smoke Tests
- [ ] Test auth flow (login/logout)
- [ ] Test main navigation
- [ ] Test critical screens (dashboard, students)
- [ ] Test form submission
- [ ] Test data persistence

### Screen Tests (37 Total)
- [ ] Test all auth screens (3)
- [ ] Test all tab screens (6)
- [ ] Test all student screens (~10)
- [ ] Test all other screens (~18)

### Navigation Tests
- [ ] Test all routes
- [ ] Test deep linking
- [ ] Test navigation params
- [ ] Test nested navigation
- [ ] Test type-safe navigation

### New Architecture Tests
- [ ] Verify Fabric enabled
- [ ] Verify TurboModules enabled
- [ ] Measure app startup time
- [ ] Measure screen transitions
- [ ] Profile list scrolling
- [ ] Check memory usage

### Platform Tests
- [ ] Test iOS-specific features
- [ ] Test Android-specific features
- [ ] Test on real devices
- [ ] Test on different screen sizes
- [ ] Test orientation changes

### Regression Tests
- [ ] Test all previously working features
- [ ] Test error handling
- [ ] Test edge cases
- [ ] Test offline scenarios
- [ ] Test error boundaries

## Success Criteria

- [ ] All 37 screens render without crashes
- [ ] All navigation flows work
- [ ] New Architecture verified active
- [ ] Performance benchmarks met
- [ ] No regressions in existing features
- [ ] Both iOS and Android working
- [ ] Development builds stable

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Device-specific crashes | HIGH | MEDIUM | Test on multiple devices |
| Performance regression | MEDIUM | LOW | New Arch should improve |
| Navigation state loss | HIGH | LOW | Deep link testing |
| Third-party lib issues | MEDIUM | MEDIUM | Component isolation |

## Security Considerations

- Verify authentication still secure
- Check API calls still authorized
- Ensure data encryption works
- Verify deep link security
- Check for new attack surfaces

## Test Report Template

```markdown
# Test Report: Expo SDK 54 Upgrade

## Environment
- Date: 2025-01-19
- Tester: [Name]
- Platform: iOS/Android
- Build: Development

## Results
- Total Screens: 37
- Passed: 37
- Failed: 0
- Skipped: 0

## Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Screenshot (if applicable)

## Performance
- App startup: 1.8s
- Screen transition: 250ms
- List scroll: 60fps

## New Architecture
- Fabric: Enabled ✓
- TurboModules: Active ✓
- Hermes: Enabled ✓
```

## Rollback Criteria

**Rollback if:**
- Critical crashes on >20% of screens
- Performance regression >50%
- Navigation completely broken
- Data loss occurs
- Security vulnerabilities introduced

## Next Phase

After completing this phase:
- All testing complete
- Bugs fixed
- Documentation updated
- Ready for production deployment

## Go/No-Go Decision

**Go Criteria:**
- ✅ All 37 screens functional
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ New Architecture verified

**No-Go if:**
- ❌ Critical bugs remain
- ❌ Performance degraded
- ❌ New Architecture not working
