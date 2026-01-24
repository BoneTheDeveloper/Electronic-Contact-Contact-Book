# Phase 02: Shared Components & Layout

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01

## Overview

Create reusable components that will be used across all student screens, ensuring consistency and reducing code duplication.

## Context Links

- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md#components-inventory)
- [Shared Components](../../../apps/web/components/)

## Key Insights

1. Many components already exist in admin - can adapt
2. shadcn/ui provides base components to extend
3. Mobile-first responsive design needed
4. Consistent styling with wireframes

## Requirements

1. Create student-specific shared components
2. Ensure responsive behavior
3. Match wireframe styling exactly
4. Support accessibility standards

## Component Specifications

### 1. PageHeader Component
```tsx
// components/student/shared/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  actions?: React.ReactNode;
}
```

**Design:**
- Gradient blue background (#0284C7 → #0369A1)
- White text with rounded bottom corners
- Back button (mobile) or breadcrumb (desktop)
- Action buttons on right

### 2. StatCard Component
```tsx
// components/student/shared/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: number;
}
```

**Design:**
- White background, rounded-3xl
- Subtle shadow and border
- Icon in colored circle
- Large value, small label

### 3. SubjectBadge Component
```tsx
// components/student/shared/SubjectBadge.tsx
interface SubjectBadgeProps {
  shortName: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Design:**
- Rounded-xl container
- Colored background matching subject
- Bold text (2-3 chars)

### 4. StatusBadge Component
```tsx
// components/student/shared/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'present' | 'absent' | 'late' | 'paid' | 'unpaid' | 'pending';
}
```

**Colors:**
- present/paid: green-100 bg, green-700 text
- absent/unpaid: red-100 bg, red-600 text
- late/pending: amber-100 bg, amber-600 text

### 5. FunctionGrid Component (Dashboard)
```tsx
// components/student/dashboard/FunctionGrid.tsx
interface FunctionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number;
}
```

**Design:**
- 3x3 grid on mobile
- 4x3 grid on tablet+
- White cards with colored icons
- Scale animation on hover/active

### 6. LoadingSkeleton Component
```tsx
// components/student/shared/LoadingSkeleton.tsx
interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'table' | 'header';
  count?: number;
}
```

### 7. EmptyState Component
```tsx
// components/student/shared/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Implementation Steps

### Step 1: Create Component Directory
```bash
mkdir -p apps/web/components/student/{shared,dashboard,grades,schedule,attendance,payments,feedback,news}
```

### Step 2: Build Base Components (Priority Order)
1. `PageHeader` - Used by all screens
2. `StatCard` - Used by dashboard, summary
3. `StatusBadge` - Universal status indicator
4. `SubjectBadge` - Grades, schedule
5. `LoadingSkeleton` - All screens during load
6. `EmptyState` - No data states

### Step 3: Build Dashboard Components
1. `StudentHeader` - Profile card in header
2. `FunctionGrid` - 9-icon navigation
3. `StatRow` - 4 summary cards

### Step 4: Create Storybook Stories (Optional)
```tsx
// stories/student/StatCard.stories.tsx
export default {
  component: StatCard,
  tags: ['autodocs'],
}
```

## Related Code Files

- `apps/web/components/admin/shared/` - Reference implementations
- `apps/web/components/ui/` - shadcn base components

## Todo List

- [ ] Create `components/student/shared/` directory
- [ ] Build `PageHeader` component
- [ ] Build `StatCard` component with all color variants
- [ ] Build `SubjectBadge` component
- [ ] Build `StatusBadge` component with all statuses
- [ ] Build `LoadingSkeleton` with 4 variants
- [ ] Build `EmptyState` component
- [ ] Build `StudentHeader` (dashboard)
- [ ] Build `FunctionGrid` with 9 function items
- [ ] Build `StatRow` component
- [ ] Add component unit tests
- [ ] Test responsive behavior

## Success Criteria

- [ ] All components render without errors
- [ ] Components match wireframe designs exactly
- [ ] Mobile responsive (375px width works)
- [ ] Desktop responsive (1024px+ width works)
- [ ] Accessibility check passes
- [ ] TypeScript types complete
- [ ] Component prop types exported

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Component name conflicts | Low | Use `student/` prefix |
| Styling inconsistencies | Medium | Use design tokens |
| Performance overhead | Low | Lazy load components |

## Security Considerations

- Sanitize all user input in props
- Validate icon content (no XSS)
- Safe navigation for optional props

## Next Steps

Once this phase is complete, proceed to [Phase 03: Dashboard](phase-03-dashboard.md)
