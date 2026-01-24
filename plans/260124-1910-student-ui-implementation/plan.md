# Student UI Implementation Plan

**Date:** 2026-01-24
**Status:** In Progress
**Reference:** `docs/mobile_function/mobile-student-app-design.md`

---

## Overview

Implement all 9 student screens in the mobile app to match the wireframes in `docs/wireframe/Mobile/student/`. The Grades screen is already complete.

---

## Phase Status

| Phase | Status | Link |
|-------|--------|------|
| Phase 1: Shared Components | ✅ Done | [phase-01-shared-components.md](phase-01-shared-components.md) |
| Phase 2: Dashboard Screen | ⏳ Pending | [phase-02-dashboard.md](phase-02-dashboard.md) |
| Phase 3: Schedule Screen | ⏳ Pending | [phase-03-schedule.md](phase-03-schedule.md) |
| Phase 4: Attendance Screen | ⏳ Pending | [phase-04-attendance.md](phase-04-attendance.md) |
| Phase 5: Leave Request Screen | ⏳ Pending | [phase-05-leave-request.md](phase-05-leave-request.md) |
| Phase 6: Teacher Feedback Screen | ⏳ Pending | [phase-06-teacher-feedback.md](phase-06-teacher-feedback.md) |
| Phase 7: News Screen | ⏳ Pending | [phase-07-news.md](phase-07-news.md) |
| Phase 8: Payment Screens | ⏳ Pending | [phase-08-payments.md](phase-08-payments.md) |
| Phase 9: Summary Screen | ⏳ Pending | [phase-09-summary.md](phase-09-summary.md) |
| Phase 10: Testing & Polish | ⏳ Pending | [phase-10-testing.md](phase-10-testing.md) |

---

## Quick Summary

### Already Complete
- ✅ Grades screen with color-coded cells, custom picker, appeal modal
- ✅ GradePicker component

### To Implement (8 screens)
1. **Dashboard** - Student header, 3x3 function grid, bottom nav
2. **Schedule** - Week day selector, period cards
3. **Attendance** - Calendar view, stats cards
4. **Leave Request** - Form with picker, request history
5. **Teacher Feedback** - Filter tabs, feedback cards with stars
6. **News** - Category tabs, featured card, news list
7. **Payment** - Overview + Detail screens, invoice cards
8. **Summary** - Overall score, stats grid, progress bars

---

## Design System Constants

```tsx
// Colors
const COLORS = {
  primary: '#0284C7',
  primaryDark: '#0369A1',
  bgApp: '#F8FAFC',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  // ... (see design doc)
};

// Border Radius
const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 28,
};
```

---

## Implementation Order

1. **Shared components** first (reusable across screens)
2. **Dashboard** as anchor (main navigation hub)
3. **Remaining screens** in priority order
4. **Testing** after each screen

---

## Files to Create/Modify

### New Components
- `src/components/ui/DatePicker.tsx` - Custom date picker modal
- `src/components/ui/WeekDaySelector.tsx` - Horizontal day tabs
- `src/components/ui/PeriodCard.tsx` - Schedule period card
- `src/components/ui/StatCard.tsx` - Summary stat card
- `src/components/ui/FeedbackCard.tsx` - Teacher feedback card
- `src/components/ui/NewsCard.tsx` - News article card
- `src/components/ui/InvoiceCard.tsx` - Payment invoice card
- `src/components/ui/Calendar.tsx` - Attendance calendar

### Screens to Update
- `src/screens/student/Dashboard.tsx` - Update to match wireframe
- `src/screens/student/Schedule.tsx` - Update to match wireframe
- `src/screens/student/Attendance.tsx` - Update to match wireframe
- `src/screens/student/LeaveRequest.tsx` - Update to match wireframe
- `src/screens/student/TeacherFeedback.tsx` - Update to match wireframe
- `src/screens/student/News.tsx` - Update to match wireframe
- `src/screens/student/Payment.tsx` - Update to match wireframe
- `src/screens/student/Summary.tsx` - Update to match wireframe

---

## Success Criteria

- ✅ All screens match wireframe design exactly
- ✅ Consistent spacing, colors, typography
- ✅ Smooth animations and touch feedback
- ✅ No TypeScript errors
- ✅ Proper Vietnamese localization
- ✅ Works on iOS and Android

---

**Last Updated:** 2026-01-24 19:10
