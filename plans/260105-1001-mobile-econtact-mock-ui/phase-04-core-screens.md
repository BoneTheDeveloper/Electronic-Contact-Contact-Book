# Phase 4: Core Screens

**Context**: [plan.md](plan.md)
**Date**: 2025-01-05
**Priority**: High
**Status**: Pending

## Overview
Implement MVP screens for the econtact app using mock data.

## Key Insights
- Start with auth, dashboard, profile
- Reuse components from design system
- Mock login accepts any credentials

## Requirements
- 7 core screens functional
- Each screen uses appropriate mock data
- Smooth transitions between screens

## Implementation Steps

1. **Auth Screen** (`src/screens/AuthScreen.tsx`)
   - Simple login form (email, password)
   - Mock authentication (accepts any input)
   - Store user in Zustand store

2. **Dashboard** (`src/screens/DashboardScreen.tsx`)
   - Welcome message with user name
   - Quick stats: attendance %, avg grade, pending fees
   - Recent notifications (3-5 items)
   - Quick action buttons

3. **Profile** (`src/screens/ProfileScreen.tsx`)
   - User info (name, email, phone)
   - Student details (class, admission number)
   - Emergency contact info

4. **Grades** (`src/screens/GradesScreen.tsx`)
   - List of subjects with grades
   - Use GradeCard component
   - Filter by assessment type
   - Average grade calculation

5. **Attendance** (`src/screens/AttendanceScreen.tsx`)
   - Calendar view (current month)
   - Color-coded days (present/absent/late)
   - Attendance summary (total days, %)
   - AttendanceBadge component

6. **Notifications** (`src/screens/NotificationsScreen.tsx`)
   - List of all notifications
   - Filter by type/priority
   - NotificationCard component
   - Mark as read functionality

7. **Fees** (`src/screens/FeesScreen.tsx`)
   - List of fee records
   - FeeCard component
   - Total amount, pending amount
   - Status filter

## Screen Layout Guidelines

- Header with screen title and back button (where applicable)
- Content in ScrollView for overflow
- Loading states during data fetch
- Error handling with user-friendly messages

## Success Criteria
- [ ] All 7 screens render correctly
- [ ] Mock data displays properly
- [ ] Navigation between screens works
- [ ] TypeScript no errors
- [ ] Responsive layout

## Next Steps
Proceed to [phase-05-navigation.md](phase-05-navigation.md)
