# Phase 2: Dashboard Screen

**Date:** 2026-01-24
**Priority:** High (Main navigation hub)
**Status:** Pending
**Wireframe:** `docs/wireframe/Mobile/student/dashboard.html`

---

## Overview

Update the Dashboard screen to match the wireframe with student header, 3x3 function grid, and proper styling.

---

## Current State

File: `apps/mobile/src/screens/student/Dashboard.tsx`
- Basic implementation exists
- Needs visual update to match wireframe

---

## Required Changes

### 1. Student Header Section
- Gradient background (135deg, #0284C7 to #0369A1)
- Avatar with initials (HB for "Hoàng B")
- Student name and class (Lớp 9A)
- Notification bell with badge (red dot with count)

### 2. 3x3 Function Grid
- 9 icons in 3x3 grid layout
- Each icon: white card, rounded-3xl, shadow-md
- Icon colors matching wireframe:
  - Schedule: Orange (#F97316)
  - Grades: Blue (#0284C7)
  - Attendance: Emerald (#10B981)
  - Materials: Rose (#F43F5E)
  - Leave: Rose (#F43F5E)
  - Feedback: Purple (#A855F7)
  - News: Sky (#0EA5E9)
  - Summary: Indigo (#6366F1)
  - Payments: Amber (#F59E0B)
- Touch feedback (scale: 0.92 on press)

### 3. Bottom Navigation
- 3 tabs: Home (🏠), Messages (💬), Profile (👤)
- Active tab highlighted in blue
- Notification badge on Messages

---

## Implementation Steps

1. ⏳ Read current Dashboard.tsx
2. ⏳ Update header section with gradient and student info
3. ⏳ Update function grid with proper styling
4. ⏳ Add navigation handlers
5. ⏳ Test on device

---

## Data Structure

```tsx
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;  // "HB"
  className: string;  // "9A"
  notificationCount: number;
}

interface FunctionItem {
  id: string;
  label: string;
  icon: string;  // Lucide icon name
  color: string;
  route: string;
}
```

---

## Related Files

- Wireframe: `docs/wireframe/Mobile/student/dashboard.html`
- Current: `apps/mobile/src/screens/student/Dashboard.tsx`
- Design: `docs/mobile_function/mobile-student-app-design.md`

---

## Success Criteria

- [ ] Matches wireframe design exactly
- [ ] Student info displays correctly
- [ ] All 9 functions navigate properly
- [ ] Notification badge shows correct count
- [ ] Touch feedback works on all icons
- [ ] Bottom navigation works

---

**Next Phase:** [Phase 3: Schedule](phase-03-schedule.md)
