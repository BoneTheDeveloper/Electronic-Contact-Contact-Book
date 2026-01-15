---
title: "Phase 06 - Grades Management Page"
description: "Create NEW grades management page with grade entry interface"
status: pending
priority: P1
effort: 6h
branch: master
tags: [grades, management, new-page, distribution]
created: 2026-01-15
---

# Phase 06: Grades Management Page

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 03-05, 07 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Create NEW grades management page with grade entry interface and distribution charts
**Priority**: P1 (High)
**Effort**: 6 hours
**Status**: Pending

## Requirements

### From Wireframe

**Page Structure**
1. **Statistics Cards**:
   - Average Score: X.X (trend)
   - Highest Score: XXX (trend)
   - Lowest Score: XXX (trend)
   - Grade A Count: XX (trend)
   - Grade F Count: XX (trend)

2. **Filters**:
   - Class dropdown
   - Subject dropdown
   - Semester dropdown
   - Exam type dropdown

3. **Grade Distribution Chart**:
   - Bar chart for A/B/C/D/F distribution
   - Color-coded (A: green, B: blue, C: yellow, D: orange, F: red)

4. **Grades Table**:
   - Columns: Student, Class, Subject, Exam Type, Score, Grade, Actions
   - Edit/Delete actions
   - Bulk grade entry

5. **Actions**:
   - Enter Grades button
   - Export report
   - Import bulk grades

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/grades/page.tsx` ✅ **CREATE NEW**
- `apps/web/components/admin/grades/*` ✅ **CREATE ALL**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### New Files (Create All)
1. **`apps/web/app/admin/grades/page.tsx`** - Main page
2. **`apps/web/components/admin/grades/GradeStats.tsx`** - Stats cards
3. **`apps/web/components/admin/grades/GradeDistribution.tsx`** - Distribution chart
4. **`apps/web/components/admin/grades/GradeTable.tsx`** - Data table
5. **`apps/web/components/admin/grades/EnterGradeModal.tsx`** - Enter grades
6. **`apps/web/components/admin/grades/GradeForm.tsx`** - Form fields
7. **`apps/web/components/admin/grades/GradeFilters.tsx`** - Filters

## Implementation Steps

### Step 1: Create Page Structure (1 hour)
- Create `apps/web/app/admin/grades/page.tsx`
- Import shared components
- Set up layout with stats, chart, filters, table
- Vietnamese labels

### Step 2: Grade Stats (1 hour)
- Create 5 stat cards (Average, Highest, Lowest, A count, F count)
- Color-coded badges
- Trend indicators
- Click to filter

### Step 3: Grade Distribution Chart (1.5 hours)
- Bar chart component (use simple HTML/CSS or library)
- A/B/C/D/F bars
- Color-coded (A: #22c55e, B: #0284C7, C: #eab308, D: #f97316, F: #ef4444)
- Percentage labels

### Step 4: Grade Filters (1 hour)
- Class dropdown
- Subject dropdown
- Semester dropdown
- Exam type dropdown
- Clear filters button

### Step 5: Grades Table (1.5 hours)
- Student name with avatar
- Class column
- Subject column
- Exam type column
- Score column (numeric input)
- Grade badge (A/B/C/D/F)
- Edit/Delete actions
- Bulk selection

### Step 6: Enter Grades Modal (30 minutes)
- Multi-select students
- Subject dropdown
- Exam type dropdown
- Score inputs
- Auto-calculate grades
- Submit/Cancel buttons

## Todo List

### Page Setup
- [ ] Create grades page route
- [ ] Set up page layout
- [ ] Import shared components

### Statistics
- [ ] Create 5 stat cards
- [ ] Add color coding
- [ ] Add trend indicators
- [ ] Add click-to-filter

### Distribution Chart
- [ ] Create bar chart component
- [ ] Add A/B/C/D/F bars
- [ ] Color-coded grades
- [ ] Percentage labels

### Filters
- [ ] Class dropdown
- [ ] Subject dropdown
- [ ] Semester dropdown
- [ ] Exam type dropdown
- [ ] Clear button

### Table
- [ ] Create grades table
- [ ] Add columns (Student, Class, Subject, Exam, Score, Grade)
- [ ] Add grade badges
- [ ] Add edit/delete actions
- [ ] Add bulk selection

### Modals
- [ ] Enter grades modal
- [ ] Edit grade modal
- [ ] Delete confirmation
- [ ] Auto-calculate grades

### Polish
- [ ] Vietnamese labels
- [ ] Loading states
- [ ] Error handling
- [ ] TypeScript check
- [ ] Test all flows

## Success Criteria

- ✅ Page accessible at `/admin/grades`
- ✅ 5 stat cards with trends
- ✅ Distribution chart (A/B/C/D/F)
- ✅ 4 filters working
- ✅ Table with 7 columns
- ✅ Grade badges (A/B/C/D/F)
- ✅ CRUD operations working
- ✅ Bulk grade entry
- ✅ Vietnamese labels
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only creates `apps/web/app/admin/grades/*`
- No other phase touches these files
- Can run in parallel with Phases 03-05, 07

## References

- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Existing Pattern**: `apps/web/app/admin/users/page.tsx` (reference)

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
