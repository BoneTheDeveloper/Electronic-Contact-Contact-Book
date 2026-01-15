---
title: "Phase 04 - Academic Structure Page"
description: "Enhance classes page with tab system (Years, Grades, Subjects)"
status: pending
priority: P1
effort: 6h
branch: master
tags: [academic, classes, tabs, hierarchy]
created: 2026-01-15
---

# Phase 04: Academic Structure Page

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 03, 05-07 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Enhance existing classes page with 3-tab system matching wireframe design
**Priority**: P1 (High)
**Effort**: 6 hours
**Status**: Pending

## Requirements

### From Wireframe

**Tab 1: Years & Semesters**
- Current year highlighted with gradient card
- Semester dates display (I: 01/09 - 15/01, II: 16/01 - 31/05)
- Statistics summary
- Add year/semester modals

**Tab 2: Grades & Classes**
- Sidebar grade selection
- Class cards in grid layout
- Hover effects with elevation
- Add grade/class modals

**Tab 3: Subject List**
- Category grouping
- Subject coefficient configuration
- Multi-select tag interface

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/classes/page.tsx` ✅ **MODIFY**
- `apps/web/components/admin/classes/*` ✅ **CREATE NEW**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### Modified Files
1. **`apps/web/app/admin/classes/page.tsx`**
   - Add tab container
   - Route to 3 tab panels
   - Vietnamese labels

### New Files (Create All)
1. **`apps/web/components/admin/classes/YearsSemestersTab.tsx`**
2. **`apps/web/components/admin/classes/GradesClassesTab.tsx`**
3. **`apps/web/components/admin/classes/SubjectListTab.tsx`**
4. **`apps/web/components/admin/classes/YearCard.tsx`**
5. **`apps/web/components/admin/classes/ClassCard.tsx`**
6. **`apps/web/components/admin/classes/SubjectItem.tsx`**
7. **`apps/web/components/admin/classes/GradeSidebar.tsx`**

## Implementation Steps

### Step 1: Create Tab Structure (1 hour)
- Use `TabContainer` from shared components
- Create 3 tab panels
- Vietnamese tab labels

### Step 2: Years & Semesters Tab (1.5 hours)
- Year cards with gradient highlights
- Semester date displays
- Statistics summaries
- Add year modal

### Step 3: Grades & Classes Tab (2 hours)
- Grade sidebar navigation
- Class cards grid layout
- Hover effects
- Add class/grade modals

### Step 4: Subject List Tab (1 hour)
- Category grouping
- Coefficient configuration
- Multi-select tags
- Add subject modal

### Step 5: Integration (30 minutes)
- Connect tabs to page
- Test tab switching
- Verify data flow

## Todo List

### Tab Structure
- [ ] Create tab container with 3 tabs
- [ ] Create tab panel components
- [ ] Add Vietnamese labels

### Tab 1: Years & Semesters
- [ ] Create year card component
- [ ] Display semester dates
- [ ] Add statistics
- [ ] Add year modal
- [ ] Test add/edit year

### Tab 2: Grades & Classes
- [ ] Create grade sidebar
- [ ] Create class card component
- [ ] Grid layout for classes
- [ ] Hover effects
- [ ] Add class/grade modals
- [ ] Test add/edit class

### Tab 3: Subject List
- [ ] Create subject item component
- [ ] Category grouping
- [ ] Coefficient inputs
- [ ] Multi-select tags
- [ ] Add subject modal
- [ ] Test add/edit subject

### Integration
- [ ] Connect all tabs to page
- [ ] Test tab switching
- [ ] Verify data persistence
- [ ] Test all modals
- [ ] Vietnamese labels check
- [ ] TypeScript check

## Success Criteria

- ✅ 3 tabs working (Years, Grades, Subjects)
- ✅ Tab switching smooth
- ✅ Year cards with gradients
- ✅ Class cards grid layout
- ✅ Subject list with categories
- ✅ All modals working
- ✅ Vietnamese labels throughout
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only modifies `apps/web/app/admin/classes/*`
- No other phase touches these files
- Can run in parallel with Phases 03, 05-07

## References

- **Current Page**: `apps/web/app/admin/classes/page.tsx`
- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
