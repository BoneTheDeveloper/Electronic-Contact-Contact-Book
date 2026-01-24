# Phase 1: Shared Components

**Date:** 2026-01-24
**Priority:** High (Foundation for all screens)
**Status:** In Progress

---

## Overview

Create reusable UI components that will be used across multiple student screens. Following DRY principle and ensuring consistency.

---

## Components to Create

### 1. DatePicker Component
**File:** `apps/mobile/src/components/ui/DatePicker.tsx`

Custom modal date picker matching wireframe style:
- Month/year selector
- Calendar grid with day selection
- Bottom sheet slide-up animation
- Vietnamese locale

```tsx
interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}
```

### 2. WeekDaySelector Component
**File:** `apps/mobile/src/components/ui/WeekDaySelector.tsx`

Horizontal scrollable day tabs for schedule:
- T2-T7 labels
- Date number below
- Active state styling
- Touch feedback

```tsx
interface WeekDaySelectorProps {
  selectedDay: number; // 1-7 (Mon-Sun)
  weekStart: Date;
  onChange: (day: number) => void;
}
```

### 3. StatCard Component
**File:** `apps/mobile/src/components/ui/StatCard.tsx`

Summary statistic cards with icons:
- Used in Dashboard and Summary
- Gradient or solid background options
- Label + Value + Icon

```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  variant?: 'solid' | 'gradient';
}
```

### 4. StatusBadge Component
**File:** `apps/mobile/src/components/ui/StatusBadge.tsx`

Status badges with consistent colors:
- paid / unpaid / partial (payments)
- present / absent / late / excused (attendance)
- approved / pending (leave requests)

```tsx
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}
```

### 5. Avatar Initials Component
**File:** `apps/mobile/src/components/ui/AvatarInitials.tsx`

Circle avatar with initials:
- Gradient background
- White text
- Different sizes

```tsx
interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  gradient?: 'blue' | 'purple' | 'orange' | 'emerald';
}
```

---

## Implementation Steps

1. ✅ Create DatePicker component
2. ✅ Create WeekDaySelector component
3. ✅ Create StatCard component
4. ✅ Create StatusBadge component
5. ✅ Create AvatarInitials component
6. ⏳ Export from index.ts
7. ⏳ Test each component in isolation

---

## Related Files

- Design: `docs/mobile_function/mobile-student-app-design.md`
- Wireframes: `docs/wireframe/Mobile/student/*.html`

---

## Success Criteria

- [ ] All components export from `src/components/ui/index.ts`
- [ ] TypeScript types defined correctly
- [ ] No prop-type errors
- [ ] Touch feedback animations work
- [ ] Consistent with wireframe styling

---

**Next Phase:** [Phase 2: Dashboard](phase-02-dashboard.md)
