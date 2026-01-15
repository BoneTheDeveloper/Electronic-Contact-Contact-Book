---
title: "Phase 02 - Shared Components Library"
description: "Create reusable component library to prevent duplication across all admin pages"
status: pending
priority: P0
effort: 4h
branch: master
tags: [components, shared, reusability, foundation]
created: 2026-01-15
---

# Phase 02: Shared Components Library

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Codebase Research**: `../260115-1648-admin-pages-implementation/research/researcher-02-codebase-report.md`
- **Design Guidelines**: `../../../docs/design-guidelines.md`

## Parallelization Info

**Blocks**: Phases 03-07 (but NOT Phase 02-User Management)
**Blocked by**: Phase 01
**Can run parallel with**: Phase 02-User Management only

## Overview

**Date**: 2026-01-15
**Description**: Build shared component library to ensure consistency and prevent code duplication
**Priority**: P0 (Critical - enables parallel execution)
**Effort**: 4 hours
**Status**: Pending

## Key Insights

From wireframe and codebase research:
1. All pages share identical UI patterns: cards, tables, forms, buttons
2. Existing components (`UserTable`, `StatsGrid`) are not reusable
3. Design tokens are consistent (#0284C7, rounded-xl, shadows)
4. Vietnamese labels require consistent typography
5. Forms need validation, error handling, loading states

## Requirements

### Functional Requirements
1. Create 10+ reusable components matching wireframe design
2. Support Vietnamese labels and characters
3. TypeScript interfaces for all props
4. Consistent styling with design tokens
5. Accessibility (WCAG 2.1 AA) throughout

### Non-Functional Requirements
- Zero duplication of UI code
- Component reusability > 70%
- TypeScript strict mode compliant
- Tailwind CSS utility classes
- Consistent prop naming conventions

## Architecture

### Directory Structure
```
apps/web/components/admin/
├── shared/                    # NEW DIRECTORY
│   ├── cards/
│   │   ├── StatCard.tsx          # Statistics card with trend
│   │   ├── ActionCard.tsx        # Card with action buttons
│   │   └── InfoCard.tsx          # Simple info card
│   ├── tables/
│   │   ├── DataTable.tsx         # Sortable, filterable table
│   │   ├── TablePagination.tsx   # Pagination controls
│   │   ├── TableActions.tsx      # Bulk actions
│   │   └── StatusBadge.tsx       # Colored status badges
│   ├── forms/
│   │   ├── FormField.tsx         # Input with label, error, helper
│   │   ├── FormSelect.tsx        # Dropdown select
│   │   ├── FormMultiSelect.tsx   # Multi-select with tags
│   │   ├── FormDateRange.tsx     # Date range picker
│   │   └── FormModal.tsx         # Modal with form
│   ├── buttons/
│   │   ├── PrimaryButton.tsx     # Primary action button
│   │   ├── SecondaryButton.tsx   # Secondary action button
│   │   ├── IconButton.tsx        # Icon-only button
│   │   └── ButtonGroup.tsx       # Button group
│   ├── filters/
│   │   ├── FilterBar.tsx         # Filter container
│   │   ├── FilterDropdown.tsx    # Single filter dropdown
│   │   ├── SearchInput.tsx       # Search with debounce
│   │   └── DateRangeFilter.tsx   # Date range filter
│   ├── tabs/
│   │   ├── TabContainer.tsx      # Tab container
│   │   └── TabPanel.tsx          # Tab content panel
│   └── index.ts                  # Export all components
```

### Component Design Principles

1. **Composition Over Configuration**: Small components that compose well
2. **Controlled Components**: Parent manages state, components render props
3. **TypeScript First**: Strong typing for all props
4. **Accessibility**: ARIA labels, keyboard navigation, focus management
5. **Responsive**: Mobile-first, works on all screen sizes

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/components/admin/shared/*` ✅ **CREATE ALL**

### Read-Only References
- `apps/web/components/admin/UserTable.tsx` - Reference for table patterns
- `apps/web/components/admin/StatsGrid.tsx` - Reference for card patterns
- `apps/web/lib/utils.ts` - Reference for `cn()` utility
- `apps/web/lib/mock-data.ts` - Reference for TypeScript interfaces

## File Ownership

### New Files (Create All)
1. **Card Components** (45 minutes)
   - `apps/web/components/admin/shared/cards/StatCard.tsx`
   - `apps/web/components/admin/shared/cards/ActionCard.tsx`
   - `apps/web/components/admin/shared/cards/InfoCard.tsx`

2. **Table Components** (90 minutes)
   - `apps/web/components/admin/shared/tables/DataTable.tsx`
   - `apps/web/components/admin/shared/tables/TablePagination.tsx`
   - `apps/web/components/admin/shared/tables/TableActions.tsx`
   - `apps/web/components/admin/shared/tables/StatusBadge.tsx`

3. **Form Components** (60 minutes)
   - `apps/web/components/admin/shared/forms/FormField.tsx`
   - `apps/web/components/admin/shared/forms/FormSelect.tsx`
   - `apps/web/components/admin/shared/forms/FormMultiSelect.tsx`
   - `apps/web/components/admin/shared/forms/FormDateRange.tsx`
   - `apps/web/components/admin/shared/forms/FormModal.tsx`

4. **Button Components** (30 minutes)
   - `apps/web/components/admin/shared/buttons/PrimaryButton.tsx`
   - `apps/web/components/admin/shared/buttons/SecondaryButton.tsx`
   - `apps/web/components/admin/shared/buttons/IconButton.tsx`
   - `apps/web/components/admin/shared/buttons/ButtonGroup.tsx`

5. **Filter Components** (45 minutes)
   - `apps/web/components/admin/shared/filters/FilterBar.tsx`
   - `apps/web/components/admin/shared/filters/FilterDropdown.tsx`
   - `apps/web/components/admin/shared/filters/SearchInput.tsx`
   - `apps/web/components/admin/shared/filters/DateRangeFilter.tsx`

6. **Tab Components** (30 minutes)
   - `apps/web/components/admin/shared/tabs/TabContainer.tsx`
   - `apps/web/components/admin/shared/tabs/TabPanel.tsx`

7. **Index File** (10 minutes)
   - `apps/web/components/admin/shared/index.ts`

**Total**: 23 new component files

## Implementation Steps

### Step 1: Card Components (45 minutes)

#### StatCard.tsx
```tsx
interface StatCardProps {
  title: string          // Vietnamese label
  value: string | number // Display value
  trend?: number         // Percentage change
  icon?: React.ReactNode // Icon element
  color?: 'blue' | 'green' | 'orange' | 'red'
}

// Usage example from wireframe:
<StatCard
  title="Tổng người dùng"
  value="3,519"
  trend={3.2}
  icon={<UsersIcon />}
  color="blue"
/>
```

#### ActionCard.tsx
```tsx
interface ActionCardProps {
  title: string
  description?: string
  actions: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }>
}
```

#### InfoCard.tsx
```tsx
interface InfoCardProps {
  title: string
  content: React.ReactNode
  footer?: React.ReactNode
}
```

### Step 2: Table Components (90 minutes)

#### DataTable.tsx
```tsx
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onSort?: (column: string) => void
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelect?: (id: string) => void
  loading?: boolean
}

interface Column<T> {
  key: keyof T
  label: string          // Vietnamese label
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}
```

#### StatusBadge.tsx
```tsx
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info'
  label: string          // Vietnamese label
}

// Colors from wireframe:
success: #22c55e (green)
warning: #f59e0b (amber)
error: #ef4444 (red)
info: #0d9488 (teal)
```

### Step 3: Form Components (60 minutes)

#### FormField.tsx
```tsx
interface FormFieldProps {
  label: string          // Vietnamese label
  name: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string   // Vietnamese placeholder
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  value: string
  onChange: (value: string) => void
}

// Design tokens:
// - Height: 48px
// - Border radius: 4px
// - Border color: #BDBDBD (error: #ef4444)
// - Label font: 12px/500 (Caption)
// - Input font: 14px/400 (Body 2)
```

#### FormModal.tsx
```tsx
interface FormModalProps {
  title: string          // Vietnamese title
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

// Animation: Slide in from right (translateX)
// Backdrop: Blur effect
```

### Step 4: Button Components (30 minutes)

#### PrimaryButton.tsx
```tsx
interface PrimaryButtonProps {
  children: string       // Vietnamese label
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
}

// Design tokens:
// - Background: #0284C7
// - Hover: #0369a1
// - Text: white
// - Height: 48px (medium)
// - Border radius: 4px
// - Font: 14px/500 uppercase, 1px letter-spacing
```

### Step 5: Filter Components (45 minutes)

#### FilterBar.tsx
```tsx
interface FilterBarProps {
  filters: Array<{
    key: string
    label: string
    type: 'select' | 'date' | 'search'
    options?: Array<{ value: string; label: string }>
  }>
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClear: () => void
}
```

### Step 6: Tab Components (30 minutes)

#### TabContainer.tsx
```tsx
interface TabContainerProps {
  tabs: Array<{
    id: string
    label: string          // Vietnamese label
    icon?: React.ReactNode
  }>
  activeTab: string
  onChange: (tabId: string) => void
}

// Design tokens:
// - Active background: rgba(2,132,199,0.1)
// - Active text: #0284C7
// - Active indicator: 2px bottom border
// - Hover: bg-slate-50
```

### Step 7: Create Index File (10 minutes)

```tsx
// apps/web/components/admin/shared/index.ts
export { StatCard, ActionCard, InfoCard } from './cards'
export { DataTable, TablePagination, TableActions, StatusBadge } from './tables'
export { FormField, FormSelect, FormMultiSelect, FormDateRange, FormModal } from './forms'
export { PrimaryButton, SecondaryButton, IconButton, ButtonGroup } from './buttons'
export { FilterBar, FilterDropdown, SearchInput, DateRangeFilter } from './filters'
export { TabContainer, TabPanel } from './tabs'

// Re-export types
export type { StatCardProps, ActionCardProps, InfoCardProps } from './cards'
export type { DataTableProps, Column, StatusBadgeProps } from './tables'
export type { FormFieldProps, FormSelectProps, FormModalProps } from './forms'
// ... etc
```

## Todo List

### Card Components
- [ ] Create StatCard.tsx with trend indicator
- [ ] Create ActionCard.tsx with action buttons
- [ ] Create InfoCard.tsx for simple display
- [ ] Test all card variants

### Table Components
- [ ] Create DataTable.tsx with sorting
- [ ] Create TablePagination.tsx (10/20/50 per page)
- [ ] Create TableActions.tsx for bulk actions
- [ ] Create StatusBadge.tsx with colors
- [ ] Test table with mock data

### Form Components
- [ ] Create FormField.tsx with validation
- [ ] Create FormSelect.tsx with options
- [ ] Create FormMultiSelect.tsx with tags
- [ ] Create FormDateRange.tsx
- [ ] Create FormModal.tsx with animations
- [ ] Test form validation

### Button Components
- [ ] Create PrimaryButton.tsx
- [ ] Create SecondaryButton.tsx
- [ ] Create IconButton.tsx
- [ ] Create ButtonGroup.tsx
- [ ] Test button states (hover, focus, disabled)

### Filter Components
- [ ] Create FilterBar.tsx
- [ ] Create FilterDropdown.tsx
- [ ] Create SearchInput.tsx with debounce
- [ ] Create DateRangeFilter.tsx
- [ ] Test filter combinations

### Tab Components
- [ ] Create TabContainer.tsx
- [ ] Create TabPanel.tsx
- [ ] Test tab switching

### Integration
- [ ] Create index.ts with all exports
- [ ] Run TypeScript type check
- [ ] Test component imports
- [ ] Verify accessibility (ARIA labels)
- [ ] Document components with comments
- [ ] Create usage examples

## Success Criteria

### Must Have (Blocking)
- ✅ All 23 components created
- ✅ TypeScript interfaces for all props
- ✅ Vietnamese labels supported (UTF-8)
- ✅ Design tokens match wireframe exactly
- ✅ Zero TypeScript errors
- ✅ Components import from shared/index.ts
- ✅ WCAG 2.1 AA compliance

### Should Have
- ✅ Consistent prop naming (label, value, onChange)
- ✅ Loading states for async operations
- ✅ Error states with red borders
- ✅ Hover/focus states on all interactive elements
- ✅ Responsive design (mobile + desktop)

### Could Have
- ✅ Storybook stories for visual testing
- ✅ Unit tests for each component
- ✅ Performance optimization (memo, useMemo)

## Conflict Prevention

### How This Phase Avoids Conflicts

1. **New Directory Only**: Creates `components/admin/shared/` (new)
2. **No Existing Files Modified**: All files are new
3. **Clear Ownership**: Shared components owned by Phase 02
4. **Read-Once Rule**: After Phase 02, shared components are READ-ONLY during parallel phases
5. **Version Lock**: Tag commit as `phase-02-complete` to freeze API

### Coordination Protocol

1. **Before starting**: Verify Phase 01 is complete
2. **During implementation**: Work in isolation (new files only)
3. **After completion**: Tag commit, broadcast API freeze
4. **Parallel phases**: Import from shared, never modify
5. **API changes**: If needed, require ALL phases to stop

### Change Management

**Scenario**: Phase 04 needs new shared component
**Solution**:
- Phase 04 creates component locally first
- After all phases complete, evaluate if component should be shared
- If yes, move to shared/ in integration phase

**Scenario**: Phase 03 needs modified shared component
**Solution**:
- DO NOT modify shared component during parallel execution
- Create wrapper component locally
- After all phases complete, evaluate if change should propagate

## Risk Assessment

### High Risk 🔴
- **Component API mismatch**: Parallel phases expect different APIs
  - **Probability**: Medium (different interpretations of wireframe)
  - **Impact**: Critical (breaks parallel execution)
  - **Mitigation**: Create detailed props documentation, usage examples

### Medium Risk 🟡
- **Vietnamese character encoding**: Special characters break
  - **Probability**: Low (UTF-8 standard)
  - **Impact**: Medium (display issues)
  - **Mitigation**: Test with Vietnamese text, verify charset

### Low Risk 🟢
- **TypeScript type mismatches**: Props don't match expected types
  - **Probability**: Low (strong typing)
  - **Impact**: Low (compile-time errors)
  - **Mitigation**: Strict TypeScript mode, typecheck before commit

## Security Considerations

1. **XSS Prevention**: All user input sanitized before rendering ✅
2. **CSRF Protection**: Forms include CSRF tokens ✅
3. **Input Validation**: Props validation with TypeScript + PropTypes ✅
4. **ARIA Labels**: All interactive elements accessible ✅

## Next Steps

### After Phase 02 Completion
1. **Commit and push** with message: `feat(shared): create shared component library`
2. **Tag commit**: `git tag phase-02-complete`
3. **Notify team**: "Shared components ready, can start parallel phases"
4. **Unblock Phases 03-07**: Can now run in parallel

### Parallel Phases Can Start
Once Phase 02 is complete, Phases 03-07 can run simultaneously:
- Phase 03: Academic Structure
- Phase 04: Attendance Page
- Phase 05: Grades Management
- Phase 06: Payments Page
- Phase 07: Notifications Page

## Unresolved Questions

1. Should we use a form library (React Hook Form) or native inputs?
2. Should we implement optimistic UI updates for better UX?
3. Should components support dark mode (future requirement)?

## References

- **Wireframe Components**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Existing Components**: `apps/web/components/admin/*`
- **Design Tokens**: `docs/design-guidelines.md`
- **Component Patterns**: `apps/web/components/admin/UserTable.tsx`

---

**Phase Version**: 1.0
**Last Updated**: 2026-01-15
**Status**: Ready to Start (After Phase 01)
