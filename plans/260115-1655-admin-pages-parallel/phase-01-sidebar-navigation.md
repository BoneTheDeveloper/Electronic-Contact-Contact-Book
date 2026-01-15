---
title: "Phase 01 - Sidebar Navigation Update"
description: "Update sidebar with new routes and rename 'Điểm danh' to 'Chuyên cần'"
status: pending
priority: P0
effort: 1h
branch: master
tags: [sidebar, navigation, vietnamese, foundation]
created: 2026-01-15
---

# Phase 01: Sidebar Navigation Update

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Design Guidelines**: `../../../docs/design-guidelines.md`

## Parallelization Info

**Blocks**: All other phases (02-07)
**Blocked by**: None
**Can run parallel with**: None (FOUNDATION PHASE - MUST RUN FIRST)

## Overview

**Date**: 2026-01-15
**Description**: Update sidebar navigation to add new routes and rename "Điểm danh" to "Chuyên cần"
**Priority**: P0 (Critical - blocks all other phases)
**Effort**: 1 hour
**Status**: Pending

## Key Insights

From wireframe research:
1. Navigation label "Điểm danh" must be renamed to "Chuyên cần"
2. New route `/admin/grades` must be added
3. Navigation structure follows 3-section pattern: Chính, Quản trị, Vận hành
4. Active states use `#0284C7` with rgba(2,132,199,0.1) background
5. Active indicator: 2px vertical bar on left

## Requirements

### Functional Requirements
1. Rename "Điểm danh" → "Chuyên cần" in admin navigation
2. Add "Quản lý Điểm số" route (`/admin/grades`)
3. Maintain existing navigation structure
4. Preserve active state styling
5. Keep Vietnamese labels consistent

### Non-Functional Requirements
- Zero breaking changes to existing routes
- Maintain accessibility (ARIA labels)
- Preserve hover/focus states
- No TypeScript errors

## Architecture

### Component Structure
```
components/layout/
└── Sidebar.tsx (MODIFY - EXCLUSIVE OWNERSHIP)
```

### Navigation Data Structure
```typescript
const adminNavSections = [
  {
    label: 'Chính',
    items: [
      { href: '/admin/dashboard', label: 'Tổng quan', icon: 'grid' },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      { href: '/admin/users', label: 'Người dùng', icon: 'users' },
      { href: '/admin/classes', label: 'Học thuật (Lớp/Môn)', icon: 'school' },
    ],
  },
  {
    label: 'Vận hành',
    items: [
      { href: '/admin/attendance', label: 'Chuyên cần', icon: 'calendar' }, // CHANGED
      { href: '/admin/grades', label: 'Quản lý Điểm số', icon: 'check' },    // NEW
      { href: '/admin/payments', label: 'Học phí & Tài chính', icon: 'card' },
      { href: '/admin/notifications', label: 'Thông báo', icon: 'bell' },
    ],
  },
]
```

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/components/layout/Sidebar.tsx` ✅ **MODIFY**

### Read-Only References
- `apps/web/app/admin/layout.tsx` - Read to understand layout structure
- `apps/web/lib/utils.ts` - Read for `cn()` utility

## File Ownership

### Modified Files
1. **`apps/web/components/layout/Sidebar.tsx`**
   - **Action**: Update `adminNavSections` array
   - **Lines**: 12-35 (navigation configuration)
   - **Changes**:
     - Line 29: Change `'Điểm danh'` → `'Chuyên cần'`
     - Line 30: Add new grades route
   - **Ownership**: EXCLUSIVE to Phase 01
   - **No other phases may modify this file**

### New Files
None (this phase only modifies existing file)

## Implementation Steps

### Step 1: Update Navigation Label (5 minutes)
```tsx
// BEFORE
{ href: '/admin/attendance', label: 'Điểm danh', icon: 'calendar' },

// AFTER
{ href: '/admin/attendance', label: 'Chuyên cần', icon: 'calendar' },
```

### Step 2: Add Grades Route (5 minutes)
```tsx
// Add AFTER attendance route
{ href: '/admin/grades', label: 'Quản lý Điểm số', icon: 'check' },
```

### Step 3: Verify Active State Logic (5 minutes)
- Ensure `pathname === item.href` works for new route
- Test active styling displays correctly
- Verify active indicator (left border) shows

### Step 4: Icon Verification (5 minutes)
- Confirm `check` icon exists in `icons` object (lines 92-97)
- If not present, add icon SVG definition

### Step 5: Testing (40 minutes)
1. **Visual Test**: Open sidebar, verify label changed
2. **Navigation Test**: Click "Chuyên cần", verify route works
3. **Active State Test**: Verify blue background on active
4. **Accessibility Test**: Check ARIA labels present
5. **TypeScript Test**: Run `npm run typecheck`
6. **Vietnamese Test**: Verify all labels in Vietnamese

## Todo List

- [ ] Rename "Điểm danh" → "Chuyên cần" in adminNavSections
- [ ] Add `/admin/grades` route with icon
- [ ] Verify `check` icon exists in icons object
- [ ] Test navigation active state
- [ ] Run TypeScript type check
- [ ] Test in browser (localhost:3000)
- [ ] Verify Vietnamese labels display correctly
- [ ] Check accessibility (tab navigation, screen reader)
- [ ] Commit changes with descriptive message

## Success Criteria

### Must Have (Blocking)
- ✅ "Điểm danh" renamed to "Chuyên cần"
- ✅ New route `/admin/grades` added to navigation
- ✅ Clicking "Chuyên cần" navigates to `/admin/attendance`
- ✅ Clicking "Quản lý Điểm số" navigates to `/admin/grades`
- ✅ Active state styling works for all routes
- ✅ Zero TypeScript errors
- ✅ Zero console errors in browser

### Should Have
- ✅ Hover states preserved
- ✅ Focus states preserved
- ✅ Active indicator (left border) displays
- ✅ Responsive layout maintained

### Could Have
- ✅ Smooth transitions maintained
- ✅ Icon consistency verified

## Conflict Prevention

### How This Phase Avoids Conflicts

1. **Single File Modification**: Only modifies `Sidebar.tsx`
2. **Clear Boundaries**: Changes isolated to lines 12-35
3. **No Shared Components**: Does not create or modify shared components
4. **Read-Only Access**: Other phases only read sidebar, never modify
5. **Early Completion**: Runs first, before any parallel phases

### Coordination Protocol

1. **Before starting**: Verify no other phase is modifying `Sidebar.tsx`
2. **During implementation**: Lock `Sidebar.tsx` file (git commit early)
3. **After completion**: Tag commit as `phase-01-complete`
4. **Notify team**: Broadcast that Phase 01 is complete
5. **Other phases**: Can now read from updated sidebar

### Risk Mitigation

**Risk**: Multiple phases trying to add routes simultaneously
**Mitigation**: Phase 01 MUST complete first (sequential dependency)

**Risk**: Icon not defined for new route
**Mitigation**: Verify icon exists in Phase 01, add if missing

**Risk**: TypeScript errors break other phases
**Mitigation**: Run typecheck before marking complete

## Risk Assessment

### High Risk 🔴
- **Breaking existing navigation**: If sidebar breaks, all pages inaccessible
  - **Probability**: Low (simple text change)
  - **Impact**: Critical (blocks all development)
  - **Mitigation**: Test thoroughly before committing

### Medium Risk 🟡
- **Vietnamese encoding issues**: Special characters display incorrectly
  - **Probability**: Low (UTF-8 standard)
  - **Impact**: Medium (UX issue)
  - **Mitigation**: Test in browser, verify charset

### Low Risk 🟢
- **Icon not found**: Check icon missing from icon object
  - **Probability**: Low (icon exists in codebase)
  - **Impact**: Low (visual glitch)
  - **Mitigation**: Add icon if missing

## Security Considerations

1. **XSS Prevention**: Labels are hardcoded strings, not user input ✅
2. **Link Injection**: Routes are static, no dynamic params ✅
3. **CSRF Protection**: Navigation is client-side only ✅
4. **Authentication**: Routes protected by auth layout ✅

## Next Steps

### After Phase 01 Completion
1. **Commit and push** changes with message: `feat(sidebar): rename attendance and add grades route`
2. **Tag commit**: `git tag phase-01-complete`
3. **Notify team**: "Phase 01 complete, can start Phase 02 (Shared Components)"
4. **Unblock parallel phases**: Phases 03-07 can now reference updated sidebar

### Phase 02 Can Start
Once Phase 01 is complete, Phase 02 (Shared Components) can begin.

### Parallel Phases Can Start
Once Phase 02 is complete, Phases 03-07 can run in parallel.

## Unresolved Questions

1. Should we add a "Loading" state for navigation transitions?
2. Do we need breadcrumb navigation for deeper routes?
3. Should navigation be collapsible on mobile?

## References

- **Current Sidebar**: `apps/web/components/layout/Sidebar.tsx`
- **Admin Layout**: `apps/web/app/admin/layout.tsx`
- **Wireframe Labels**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Design Tokens**: `docs/design-guidelines.md` (Section: Color System)

---

**Phase Version**: 1.0
**Last Updated**: 2026-01-15
**Status**: Ready to Start (Blocks all other phases)
