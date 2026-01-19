---
title: "Phase 03: Component Compatibility"
description: "Verify and fix all 37 components/screens for Expo SDK 54 and New Architecture compatibility"
status: pending
priority: P1
effort: 5h
tags: [components, screens, compatibility, testing]
created: 2025-01-19
---

## Context

- Parent Plan: [../plan.md](../plan.md)
- Mobile App: `apps/mobile/`
- Prerequisites:
  - [Phase 01: SDK Upgrade](./phase-01-sdk-upgrade.md) complete
  - [Phase 02: New Architecture](./phase-02-new-architecture.md) complete
- Scope: 37 components/screens identified in research

## Overview

**Date:** 2025-01-19
**Priority:** P1 (Critical)
**Status:** Pending

This phase systematically verifies and fixes all components and screens to work with Expo SDK 54, React Navigation v7, and New Architecture.

## Key Insights

From component audit:
- 37 screens/components need verification
- React Navigation v7 has breaking API changes
- React Native Paper menu component has known bug
- List views may need performance optimization with Fabric
- All navigation-dependent screens need updates

## Requirements

### Functional
- All 37 screens render without errors
- Navigation works across all routes
- Component interactions functional
- No visual regressions

### Technical
- Fix React Navigation v7 breaking changes
- Apply React Native Paper patch if needed
- Optimize for Fabric (New Architecture)
- Ensure TypeScript compatibility

## Component Inventory

### Critical Navigation Screens (Priority 1)

| Screen | Path | Navigation Changes | Risk |
|--------|------|-------------------|------|
| Auth Flow | `app/auth/*` | NavigationContainer props | HIGH |
| Dashboard | `app/dashboard.tsx` | Stack navigator updates | MEDIUM |
| Student List | `app/students/*` | Tab navigation | MEDIUM |
| Student Detail | `app/students/[id].tsx` | Route params | HIGH |

### Secondary Screens (Priority 2)

| Screen | Path | Issues | Risk |
|--------|------|--------|------|
| Attendance | `app/attendance.tsx` | State management | MEDIUM |
| Grades | `app/grades.tsx` | List rendering | LOW |
| Messages | `app/messages.tsx` | FlatList updates | LOW |
| Profile | `app/profile.tsx` | Component APIs | LOW |

### Shared Components (Priority 3)

| Component | Path | Issues | Risk |
|-----------|------|--------|------|
| Navigation Bar | `components/NavigationBar.*` | Navigation v7 | HIGH |
| Tab Bar | `components/TabBar.*` | Bottom tabs v7 | HIGH |
| Cards | `components/*Card.*` | Paper library | MEDIUM |
| Lists | `components/*List.*` | Fabric optimization | LOW |

## Implementation Steps

### Step 1: Component Audit

```bash
# List all screen files
cd apps/mobile
find app -name "*.tsx" -type f
find src/components -name "*.tsx" -type f

# Generate component inventory
npx tsc --noEmit 2>&1 | grep "error TS"
```

**Deliverable:** Complete component inventory with issues

### Step 2: Fix React Navigation v7 Breaking Changes

**2.1 Navigation Container**

```typescript
// BEFORE (v6)
// app/_layout.tsx
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './rootNavigation';

export default function RootLayout() {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {/* ... */}
    </NavigationContainer>
  );
}

// AFTER (v7)
import { NavigationContainer } from '@react-navigation/native';

export default function RootLayout() {
  return (
    <NavigationContainer
      linking={linking}
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - My App`,
      }}
    >
      {/* ... */}
    </NavigationContainer>
  );
}
```

**2.2 Stack Navigator**

```typescript
// BEFORE (v6)
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator
  screenOptions={{
    headerShown: false,
    cardStyle: { backgroundColor: '#fff' }
  }}
>

// AFTER (v7)
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator
  screenOptions={{
    headerShown: false,
    contentStyle: { backgroundColor: '#fff' },  // Changed prop name
    orientation: 'all',  // New prop
    animation: 'default',  // Explicit animation
  }}
>
```

**2.3 Bottom Tabs Navigator**

```typescript
// BEFORE (v6)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#007AFF',
  }}
>

// AFTER (v7)
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#999',
    tabBarLabelStyle: { fontSize: 12 },  // More explicit styling
    headerShown: false,  // Explicit header control
  }}
>
```

**Files to Update:**
- `apps/mobile/app/_layout.tsx` (or `app/index.tsx` depending on structure)
- All navigator files in `src/navigation/*`
- Any screen using navigation hooks directly

### Step 3: Fix React Native Paper Menu Bug

**Apply Patch:**

```bash
# Install patch-package
npm install patch-package --save-dev

# Create patch for menu bug
# After reproducing the bug:
npx patch-package react-native-paper

# Verify patch created
ls patches/react-native-paper+*.patch
```

**Update package.json:**

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

**Alternative:** Use alternative menu component if patch doesn't work.

### Step 4: Update Navigation Hook Usage

**useNavigation Hook:**

```typescript
// BEFORE (v6)
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('ScreenName', { id: 123 });

// AFTER (v7) - Same API, verify types
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<NavigationProp>();
navigation.navigate('ScreenName', { id: 123 });
```

**useRoute Hook:**

```typescript
// BEFORE (v6)
import { useRoute } from '@react-navigation/native';

const route = useRoute();
const { id } = route.params;

// AFTER (v7) - Verify type safety
import { type RouteProp } from '@react-navigation/native';

type RouteType = RouteProp<RootStackParamList, 'ScreenName'>;
const route = useRoute<RouteType>();
const { id } = route.params;
```

### Step 5: Optimize Lists for Fabric

**FlatList Updates:**

```typescript
// BEFORE
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
/>

// AFTER (Fabric-optimized)
const renderItem = useCallback(({ item }) => (
  <MemoizedItem item={item} />
), []);

const keyExtractor = useCallback((item) => item.id, []);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  removeClippedSubviews={true}  // Better with Fabric
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### Step 6: Update Type Definitions

**Navigation Types:**

```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  StudentDetail: { studentId: string };
  // ... all routes
};

export type TabParamList = {
  Dashboard: undefined;
  Students: undefined;
  Attendance: undefined;
  // ... all tabs
};
```

### Step 7: Screen-by-Screen Verification

**Verification Checklist:**

```typescript
// Add temporary dev-only verification
// utils/devOnly/verifyNewArch.ts
import { Platform, NativeModules } from 'react-native';

export const verifyNewArchitecture = () => {
  if (__DEV__) {
    console.log('Platform:', Platform.OS);
    console.log('New Arch Enabled:', NativeModules.PlatformConstants?.isTurboModuleEnabled);
    console.log('Hermes:', !!global.HermesInternal);
  }
};
```

**Test Each Screen:**

1. Load screen without crash
2. Navigate to screen from different routes
3. Navigate from screen to other screens
4. Test all interactive elements
5. Verify state management works
6. Check for console errors

### Step 8: Component Library Updates

**Update Shared Components:**

- Button components
- Card components
- List items
- Form inputs
- Modal/dialog components
- Loading states

**Files:**
- `apps/mobile/src/components/*` - All components

## Related Code Files

```
apps/mobile/
├── app/                            # ALL screen files
│   ├── _layout.tsx                 # Navigation container
│   ├── [tab]/                      # Tab screens
│   │   ├── index.tsx
│   │   └── ...
│   ├── auth/                       # Auth screens
│   ├── students/                   # Student screens
│   └── ...
├── src/
│   ├── components/                 # ALL components (37 total)
│   │   ├── navigation/             # Navigation components
│   │   ├── ui/                     # UI components
│   │   └── ...
│   ├── navigation/                 # Navigation configuration
│   │   ├── types.ts                # Type definitions
│   │   └── navigators.tsx
│   └── utils/
│       └── devOnly/
│           └── verifyNewArch.ts    # NEW: Verification helper
└── patches/                        # NEW: React Native Paper patch
    └── react-native-paper+*.patch
```

## Todo List

### Phase 3a: Navigation (HIGH Priority)
- [ ] Update NavigationContainer to v7 API
- [ ] Update Stack Navigator to v7 API
- [ ] Update Tab Navigator to v7 API
- [ ] Fix all `useNavigation` hook usage
- [ ] Fix all `useRoute` hook usage
- [ ] Update navigation type definitions

### Phase 3b: Auth Screens
- [ ] Verify and fix login screen
- [ ] Verify and fix register screen
- [ ] Verify and fix password reset screen
- [ ] Test auth flow end-to-end

### Phase 3c: Student Screens (Priority: HIGH)
- [ ] Fix student list screen
- [ ] Fix student detail screen
- [ ] Fix student create/edit forms
- [ ] Verify navigation between student screens

### Phase 3d: Other Screens (Priority: MEDIUM)
- [ ] Fix dashboard screen
- [ ] Fix attendance screen
- [ ] Fix grades screen
- [ ] Fix messages screen
- [ ] Fix profile screen
- [ ] Fix all remaining screens (~25 total)

### Phase 3e: Shared Components (Priority: MEDIUM)
- [ ] Apply React Native Paper patch
- [ ] Verify and fix card components
- [ ] Verify and fix list components
- [ ] Verify and fix form components
- [ ] Verify and fix modal components
- [ ] Optimize lists for Fabric

### Phase 3f: Type Safety (Priority: LOW)
- [ ] Update all navigation types
- [ ] Fix TypeScript errors
- [ ] Add missing type definitions
- [ ] Verify all `any` types removed

## Success Criteria

- [ ] All 37 screens render without errors
- [ ] Navigation works across all routes
- [ ] No TypeScript compilation errors
- [ ] React Native Paper menu functional
- [ ] Lists optimized for Fabric
- [ ] All interactive elements work
- [ ] No console warnings/errors

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Navigation breaking changes not caught | CRITICAL | MEDIUM | Comprehensive testing |
| React Native Paper patch fails | HIGH | LOW | Use alternative component |
| List performance regression | MEDIUM | LOW | Fabric should improve |
| Type errors cause runtime crashes | HIGH | MEDIUM | Strict TypeScript check |

## Security Considerations

- Verify navigation guards still work
- Check route param validation
- Ensure authentication checks intact
- Verify sensitive data protection

## Troubleshooting

### Navigation Not Working

```typescript
// Add debugging
import { useNavigationState } from '@react-navigation/native';

const state = useNavigationState((state) => state);
console.log('Navigation State:', JSON.stringify(state, null, 2));
```

### Component Crashes

```bash
# Check specific component
npx react-native run-ios --verbose
# Look for "fatal error" in logs

# Check New Architecture compatibility
# Add console.log in component lifecycle
```

### Type Errors

```bash
# Strict type check
npx tsc --noEmit --strict
# Fix all errors before proceeding
```

## Next Phase

After completing this phase:
- Proceed to [Phase 04: Testing](./phase-04-testing.md)
- All components ready for comprehensive testing
