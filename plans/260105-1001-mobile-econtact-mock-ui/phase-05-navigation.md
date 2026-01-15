# Phase 5: Navigation

**Context**: [plan.md](plan.md)
**Date**: 2025-01-05
**Priority**: Medium
**Status**: Pending

## Overview
Set up React Navigation with stack and tab navigators.

## Key Insights
- Bottom tab for main sections
- Stack for nested navigation
- Auth flow handling

## Requirements
- Bottom tab navigation (5 tabs)
- Stack navigation for drill-down
- Auth flow (login → main app)

## Implementation Steps

1. **Create navigation structure** (`src/navigation/`)
   - `AppNavigator.tsx` - Main navigator
   - `AuthNavigator.tsx` - Auth flow
   - `TabNavigator.tsx` - Bottom tabs

2. **Tab Configuration** (5 tabs)
   - Dashboard (home icon)
   - Grades (school icon)
   - Attendance (calendar icon)
   - Notifications (bell icon)
   - Profile (person icon)

3. **Auth Flow**
   - AuthScreen (login)
   - Check for authenticated user in store
   - Redirect to main app if logged in

4. **Navigation Types**
   - Define route params with TypeScript
   - Type-safe navigation

## Navigation Structure

```
AppNavigator
├── AuthNavigator
│   └── AuthScreen
└── MainTabs
    ├── DashboardStack
    │   └── DashboardScreen
    ├── GradesStack
    │   └── GradesScreen
    ├── AttendanceStack
    │   └── AttendanceScreen
    ├── NotificationsStack
    │   └── NotificationsScreen
    └── ProfileStack
        └── ProfileScreen
```

## Success Criteria
- [ ] Bottom tabs visible on all main screens
- [ ] Auth flow redirects correctly
- [ ] TypeScript types for navigation
- [ ] Smooth transitions

## Next Steps
Proceed to [phase-06-polish-test.md](phase-06-polish-test.md)
