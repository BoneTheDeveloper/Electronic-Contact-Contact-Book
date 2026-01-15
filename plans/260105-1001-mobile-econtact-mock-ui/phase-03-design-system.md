# Phase 3: Design System

**Context**: [plan.md](plan.md)
**Date**: 2025-01-05
**Priority**: High
**Status**: Pending

## Overview
Create design tokens, theme configuration, and reusable UI components.

## Key Insights
- Professional/Academic theme with blue/green colors
- Material Design components via React Native Paper
- Consistent spacing and typography

## Requirements
- Define color palette and typography
- Create theme configuration for React Native Paper
- Build reusable components (cards, badges, etc.)

## Implementation Steps

1. **Create theme config** (`assets/styles/theme.ts`)
   ```typescript
   export const colors = {
     primary: '#1e88e5',
     secondary: '#43a047',
     // ... (see tech-stack.md)
   }
   ```

2. **Configure React Native Paper theme**
   - Custom colors
   - Typography overrides
   - Component style overrides

3. **Create reusable components** (`src/components/`)
   - `GradeCard.tsx` - Display grade with color coding
   - `AttendanceBadge.tsx` - Present/Absent/Late badge
   - `NotificationCard.tsx` - Notification item
   - `FeeCard.tsx` - Fee status card
   - `StatCard.tsx` - Dashboard stat card

4. **Create utility functions** (`src/utils/`)
   - `formatDate.ts` - Date formatting
   - `getGradeColor.ts` - Color based on grade
   - `getAttendanceColor.ts` - Color based on status

## Component Specifications

### GradeCard
- Subject name, grade, trend indicator
- Color-coded: A(green), B(light green), C(yellow), D/F(red)

### AttendanceBadge
- Compact badge with status
- Colors: Present(green), Absent(red), Late(yellow), Excused(blue)

### NotificationCard
- Title, message, date, priority indicator
- Swipe actions (mark read, delete)

### FeeCard
- Fee type, amount, status, due date
- Status badges: Paid, Pending, Overdue

## Success Criteria
- [ ] Theme configured with correct colors
- [ ] All components render correctly
- [ ] Components accept TypeScript props
- [ ] Consistent spacing and typography

## Next Steps
Proceed to [phase-04-core-screens.md](phase-04-core-screens.md)
