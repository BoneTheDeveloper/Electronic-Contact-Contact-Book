---
title: "Phase 03 - User Management Page"
description: "Update existing user management page to match wireframe design exactly"
status: pending
priority: P1
effort: 1h
branch: master
tags: [users, management, update, vietnamese]
created: 2026-01-15
---

# Phase 03: User Management Page

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 04-07 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Update existing user management page to match wireframe design with Vietnamese labels
**Priority**: P1 (High)
**Effort**: 1 hour
**Status**: Pending

## Requirements

### From Wireframe
1. **Statistics Cards** (5-column grid):
   - Total Users: 3,519 (+3.2%)
   - Admin: 5 (stable)
   - Teachers: 85 (stable)
   - Parents: 2,186 (+1.8%)
   - Students: 1,248 (+2.5%)

2. **Multi-Filters**:
   - Role dropdown (Admin/Teacher/Parent/Student)
   - Status dropdown (Active/Inactive)
   - Grade/Class dropdown
   - Clear button

3. **Data Table**:
   - Columns: User, Role, Class/Unit, Status, Last Login, Actions
   - Striped rows with hover
   - Pagination (10/20/50 per page)
   - Bulk selection checkboxes

4. **Action Buttons**:
   - Import Excel
   - Add User
   - Shadow effects

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/users/page.tsx` ✅ **MODIFY**
- `apps/web/components/admin/users/*` ✅ **MODIFY**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### Modified Files
1. **`apps/web/app/admin/users/page.tsx`**
   - Update layout to match wireframe
   - Import shared components
   - Vietnamese labels

2. **`apps/web/components/admin/UserTable.tsx`**
   - Update columns to match wireframe
   - Add bulk selection
   - Vietnamese headers

3. **`apps/web/components/admin/StatsGrid.tsx`**
   - Update to 5-column layout
   - Add trend indicators
   - Vietnamese labels

## Implementation Steps

### Step 1: Update Stats Grid (15 minutes)
- Use `StatCard` from shared components
- 5 cards with trends
- Vietnamese labels

### Step 2: Update Filter Bar (15 minutes)
- Use `FilterBar` from shared components
- Role, Status, Class/Class filters
- Vietnamese labels

### Step 3: Update User Table (20 minutes)
- Use `DataTable` from shared components
- Columns: User, Role, Class/Unit, Status, Last Login, Actions
- Bulk selection
- Pagination

### Step 4: Add Action Buttons (10 minutes)
- Import Excel button
- Add User button
- Vietnamese labels

## Todo List

- [ ] Update stats grid to 5-column layout
- [ ] Add trend indicators to stat cards
- [ ] Update filter bar with 3 filters
- [ ] Update table columns to match wireframe
- [ ] Add bulk selection checkboxes
- [ ] Add pagination (10/20/50)
- [ ] Add Import Excel button
- [ ] Add Add User button
- [ ] Test all functionality
- [ ] Verify Vietnamese labels

## Success Criteria

- ✅ 5 stat cards with trends
- ✅ 3 filters (Role, Status, Class/Class)
- ✅ Table with 6 columns
- ✅ Bulk selection working
- ✅ Pagination working
- ✅ Vietnamese labels throughout
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only modifies `apps/web/app/admin/users/*`
- No other phase touches these files
- Can run in parallel with Phases 04-07

## References

- **Current Page**: `apps/web/app/admin/users/page.tsx`
- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
