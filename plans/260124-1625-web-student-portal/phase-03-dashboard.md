# Phase 03: Student Dashboard

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01, Phase 02

## Overview

Implement the main student dashboard with student header, function grid, and quick navigation to all features. This is the entry point for students after login.

## Context Links

- [Wireframe: dashboard.html](../../../docs/wireframe/Mobile/student/dashboard.html)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md#1-dashboard-studentdashboard)

## Key Insights

1. Dashboard is the "home base" for students
2. 9 function icons must match mobile exactly
3. Student header shows avatar, name, class, notification bell
4. Stats row shows key metrics at a glance

## Requirements

1. Display student profile header with avatar
2. Show 9-function navigation grid
3. Display quick stat cards (GPA, Attendance, etc.)
4. Handle notification badge count
5. Responsive layout for all screen sizes

## Implementation Steps

### Step 1: Create Dashboard Page
```tsx
// apps/web/app/student/dashboard/page.tsx
export default function StudentDashboard() {
  // Fetch student data
  // Fetch notification count
  // Render layout
}
```

### Step 2: Student Header Component
```tsx
// components/student/dashboard/StudentHeader.tsx
interface StudentHeaderProps {
  student: {
    id: string;
    name: string;
 initials: string;
    class: string;
    avatar?: string;
  };
  notificationCount: number;
}
```

**Layout:**
- Gradient blue background
- Avatar circle (80px) with initials or photo
- Name (extra bold, large)
- Class name below
- Notification bell with red badge

### Step 3: Function Grid Component
```tsx
// components/student/dashboard/FunctionGrid.tsx
const FUNCTIONS = [
  { id: 'schedule', label: 'Thời khóa biểu', icon: CalendarIcon, route: '/student/schedule', color: 'orange' },
  { id: 'grades', label: 'Bảng điểm môn học', icon: CheckCircleIcon, route: '/student/grades', color: 'blue' },
  { id: 'attendance', label: 'Lịch sử điểm danh', icon: UserCheckIcon, route: '/student/attendance', color: 'green' },
  { id: 'materials', label: 'Tài liệu học tập', icon: BookIcon, route: '/student/materials', color: 'rose' },
  { id: 'leave', label: 'Đơn xin nghỉ phép', icon: FilePlusIcon, route: '/student/leave', color: 'rose' },
  { id: 'feedback', label: 'Nhận xét giáo viên', icon: MessageIcon, route: '/student/feedback', color: 'purple' },
  { id: 'news', label: 'Tin tức & sự kiện', icon: NewspaperIcon, route: '/student/news', color: 'sky' },
  { id: 'summary', label: 'Kết quả tổng hợp', icon: PieChartIcon, route: '/student/summary', color: 'indigo' },
  { id: 'payments', label: 'Học phí', icon: DollarSignIcon, route: '/student/payments', color: 'amber' },
];
```

**Grid Layout:**
- Mobile: 3 columns × 3 rows (gap-y-12, gap-x-4)
- Tablet: 4 columns × 3 rows
- Desktop: 4 columns × 3 rows, max-width constraint

**Function Card:**
- White background, rounded-3xl (28px)
- Shadow and border
- Icon (32px) in colored circle
- Label below (10px, uppercase, tracking-tight)
- Active scale animation (0.92)

### Step 4: Stat Row (Optional Enhancement)
```tsx
// Quick stats below function grid
// GPA | Attendance Rate | Conduct | Notifications
```

## Related Code Files

- `apps/mobile/src/screens/student/Dashboard.tsx` - Mobile reference
- `apps/web/app/admin/dashboard/page.tsx` - Admin dashboard reference

## Todo List

- [ ] Create dashboard page structure
- [ ] Build StudentHeader component
- [ ] Build FunctionGrid with 9 items
- [ ] Add function icons with correct colors
- [ ] Implement navigation on click
- [ ] Add notification badge logic
- [ ] Add loading states
- [ ] Add empty states
- [ ] Test responsive layout (375px, 768px, 1024px, 1440px)
- [ ] Test navigation flow

## Success Criteria

- [ ] Dashboard renders with student data
- [ ] All 9 function cards display correctly
- [ ] Icons match wireframe colors exactly
- [ ] Click navigates to correct route
- [ ] Notification badge shows correct count
- [ ] Mobile layout (375px) matches wireframe
- [ ] Tablet/desktop layout is responsive
- [ ] Loading state shows while fetching data

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing student data | High | Show loading, then empty state |
| Broken navigation | Medium | Use Next.js Link component |
| Icon inconsistency | Low | Use lucide-react icons |

## Security Considerations

1. Validate student owns the data being displayed
2. No sensitive data in URL params
3. Rate limit dashboard refresh

## Next Steps

Once this phase is complete, proceed to [Phase 04: Academic Screens](phase-04-academic-screens.md)
