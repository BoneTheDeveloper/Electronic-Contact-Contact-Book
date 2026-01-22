# Phase 02: Fix ImportExcelModal Design

**Status:** Pending
**Priority:** Medium

## Context

- **Wireframe:** `docs/wireframe/Web_app/Admin/user-management.html` (lines 773-845)
- **Current:** `apps/web/components/admin/users/modals/ImportExcelModal.tsx`

## Key Changes Required

### 1. Modal Design
- The wireframe shows a centered modal (not slide-in)
- Size: `max-w-lg` (approx 512px)
- Rounded: `rounded-3xl`

### 2. File Upload Area
- Blue gradient background: `bg-blue-50`
- Dashed border: `border-2 border-dashed`
- Icon: Blue box with upload icon

### 3. Template Download Section
- Green accent color for template section
- Icon + text layout

## Implementation Steps

1. Update modal styling to match wireframe
2. Fix file upload area styling
3. Update template download section
4. Ensure consistent button styling

## Files to Modify

- `apps/web/components/admin/users/modals/ImportExcelModal.tsx`
