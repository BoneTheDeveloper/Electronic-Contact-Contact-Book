# Phase 01: Fix AddUserModal Design

**Status:** In Progress
**Priority:** High

## Context

- **Wireframe:** `docs/wireframe/Web_app/Admin/user-management.html` (lines 488-771)
- **Current:** `apps/web/components/admin/users/modals/AddUserModal.tsx`

## Key Changes Required

### 1. Modal Position & Animation
- Change from centered modal to **slide-in from right**
- Width: `max-w-2xl` (approx 672px)
- Animation: `slideIn` from right

### 2. Role Selection (Step 1)
- **Remove tabs** - Replace with **radio button cards** (3 columns grid)
- Each card shows:
  - Icon in colored circle (blue/purple/teal)
  - Role label below
  - `peer-checked` styling for selected state

### 3. Step Indicators
- Add 3 progress dots at top
- Fill dots as user progresses through steps

### 4. Code Preview (Step 2)
- **Gradient background:** `from-blue-50 to-indigo-50`
- Border: `border border-blue-200`
- Show rule text: `[Tiền tố vai trò] + [Năm hiện tại] + [Số thứ tự tự tăng]`

### 5. Form Fields Grouping
- Add headers: "Bước X: Chọn..."
- Border separators between sections
- Better visual grouping with `border-t border-slate-200 pt-6`

### 6. Account Settings
- Toggle switches for checkboxes (not native checkboxes)
- Better card styling for settings

## Implementation Steps

1. Create new slide-in modal variant
2. Rewrite role selection with radio cards
3. Add step indicators
4. Update code preview styling
5. Group form fields with proper headers
6. Replace checkboxes with toggle switches

## Files to Modify

- `apps/web/components/admin/users/modals/AddUserModal.tsx`
- May need to update `BaseModal.tsx` or create slide-in variant
