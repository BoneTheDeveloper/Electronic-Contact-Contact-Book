---
title: "Phase 05 - Attendance (Chuyên cần) Page"
description: "Create NEW attendance page with full CRUD operations"
status: pending
priority: P1
effort: 8h
branch: master
tags: [attendance, chuyen-can, new-page, crud]
created: 2026-01-15
---

# Phase 05: Attendance (Chuyên cần) Page

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 03-04, 06-07 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Create NEW attendance page ("Chuyên cần") with full CRUD operations
**Priority**: P1 (High)
**Effort**: 8 hours
**Status**: Pending

## Requirements

### From Wireframe

**Page Structure**
1. **Statistics Cards**:
   - Present: Count with green indicator
   - Absent: Count with red indicator
   - Late: Count with orange indicator
   - Excused: Count with blue indicator

2. **Filters**:
   - Class dropdown
   - Date range picker
   - Status filter (Present/Absent/Late/Excused)
   - Search by student name

3. **Attendance Table**:
   - Columns: Student, Class, Date, Status, Notes, Actions
   - Status badges with colors
   - Edit/Delete actions
   - Bulk mark attendance

4. **Actions**:
   - Mark Attendance button
   - Export report
   - Import bulk attendance

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/attendance/page.tsx` ✅ **CREATE NEW**
- `apps/web/components/admin/attendance/*` ✅ **CREATE ALL**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### New Files (Create All)
1. **`apps/web/app/admin/attendance/page.tsx`** - Main page
2. **`apps/web/components/admin/attendance/AttendanceStats.tsx`** - Stats cards
3. **`apps/web/components/admin/attendance/AttendanceTable.tsx`** - Data table
4. **`apps/web/components/admin/attendance/MarkAttendanceModal.tsx`** - Mark attendance
5. **`apps/web/components/admin/attendance/AttendanceForm.tsx`** - Form fields
6. **`apps/web/components/admin/attendance/AttendanceFilters.tsx`** - Filters

## Implementation Steps

### Step 1: Create Page Structure (1 hour)
- Create `apps/web/app/admin/attendance/page.tsx`
- Import shared components
- Set up layout with stats, filters, table
- Vietnamese labels

### Step 2: Attendance Stats (1.5 hours)
- Create 4 stat cards (Present, Absent, Late, Excused)
- Color-coded badges
- Trend indicators
- Click to filter

### Step 3: Attendance Filters (1.5 hours)
- Class dropdown
- Date range picker
- Status filter
- Search input
- Clear filters button

### Step 4: Attendance Table (2.5 hours)
- Student name with avatar
- Class column
- Date column
- Status badge (Present/Absent/Late/Excused)
- Notes column
- Edit/Delete actions
- Bulk selection

### Step 5: Mark Attendance Modal (1 hour)
- Multi-select students
- Date picker
- Status dropdown
- Notes field
- Submit/Cancel buttons

### Step 6: CRUD Operations (30 minutes)
- Create: Mark attendance modal
- Read: Table with filters
- Update: Edit attendance
- Delete: Remove attendance record

## Todo List

### Page Setup
- [ ] Create attendance page route
- [ ] Set up page layout
- [ ] Import shared components

### Statistics
- [ ] Create 4 stat cards
- [ ] Add color coding
- [ ] Add trend indicators
- [ ] Add click-to-filter

### Filters
- [ ] Class dropdown
- [ ] Date range picker
- [ ] Status filter
- [ ] Search input
- [ ] Clear button

### Table
- [ ] Create attendance table
- [ ] Add columns (Student, Class, Date, Status, Notes)
- [ ] Add status badges
- [ ] Add edit/delete actions
- [ ] Add bulk selection

### Modals
- [ ] Mark attendance modal
- [ ] Edit attendance modal
- [ ] Delete confirmation
- [ ] Form validation

### CRUD
- [ ] Create attendance
- [ ] Read/Filter attendance
- [ ] Update attendance
- [ ] Delete attendance

### Polish
- [ ] Vietnamese labels
- [ ] Loading states
- [ ] Error handling
- [ ] TypeScript check
- [ ] Test all flows

## Success Criteria

- ✅ Page accessible at `/admin/attendance`
- ✅ 4 stat cards with colors
- ✅ 4 filters working
- ✅ Table with 6 columns
- ✅ Status badges (Present/Absent/Late/Excused)
- ✅ CRUD operations working
- ✅ Bulk mark attendance
- ✅ Vietnamese labels
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only creates `apps/web/app/admin/attendance/*`
- No other phase touches these files
- Can run in parallel with Phases 03-04, 06-07

## References

- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Existing Pattern**: `apps/web/app/admin/users/page.tsx` (reference)

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
