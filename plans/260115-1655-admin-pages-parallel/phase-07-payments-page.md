---
title: "Phase 07 - Payments Page Enhancement"
description: "Enhance existing payments page with multi-step wizard"
status: pending
priority: P1
effort: 4h
branch: master
tags: [payments, enhancement, wizard, fees]
created: 2026-01-15
---

# Phase 07: Payments Page Enhancement

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 03-06 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Enhance existing payments page with multi-step wizard and fee tracking
**Priority**: P1 (High)
**Effort**: 4 hours
**Status**: Pending

## Requirements

### From Wireframe

**Page Structure**
1. **Multi-Step Wizard**:
   - Step 1: Select Fee Items
   - Step 2: Assign to Classes/Students
   - Step 3: Review & Confirm
   - Step 4: Payment Status

2. **Fee Item Library**:
   - Table with fee items
   - Columns: Item Name, Amount, Type, Frequency, Actions
   - Add/Edit/Delete fee items

3. **Invoice Tracker**:
   - Invoice list with status
   - Status badges (Paid/Pending/Overdue)
   - Payment date tracking

4. **Fee Assignment**:
   - Class selection
   - Student selection
   - Fee item selection
   - Due date picker

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/payments/page.tsx` ✅ **MODIFY**
- `apps/web/components/admin/payments/*` ✅ **CREATE NEW**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### Modified Files
1. **`apps/web/app/admin/payments/page.tsx`**
   - Update layout to match wireframe
   - Add multi-step wizard
   - Import shared components

### New Files (Create All)
1. **`apps/web/components/admin/payments/FeeWizard.tsx`** - Multi-step wizard
2. **`apps/web/components/admin/payments/FeeItemLibrary.tsx`** - Fee items table
3. **`apps/web/components/admin/payments/InvoiceTracker.tsx`** - Invoice list
4. **`apps/web/components/admin/payments/FeeAssignmentForm.tsx`** - Assignment form
5. **`apps/web/components/admin/payments/PaymentStatusBadge.tsx`** - Status badges

## Implementation Steps

### Step 1: Update Page Layout (1 hour)
- Import shared components
- Add wizard container
- Add fee library table
- Add invoice tracker
- Vietnamese labels

### Step 2: Fee Wizard (1.5 hours)
- Step 1: Select fee items (multi-select)
- Step 2: Assign to classes/students
- Step 3: Review summary
- Step 4: Confirm and create invoices
- Progress indicator
- Next/Back buttons

### Step 3: Fee Item Library (1 hour)
- Table with fee items
- Columns: Item Name, Amount, Type, Frequency, Actions
- Add/Edit/Delete modals
- Vietnamese labels

### Step 4: Invoice Tracker (30 minutes)
- Invoice list with filters
- Status badges (Paid/Pending/Overdue)
- Payment date tracking
- View details modal

## Todo List

### Page Layout
- [ ] Update payments page layout
- [ ] Add wizard container
- [ ] Add fee library section
- [ ] Add invoice tracker section

### Fee Wizard
- [ ] Create 4-step wizard
- [ ] Step 1: Select fee items
- [ ] Step 2: Assign to classes/students
- [ ] Step 3: Review summary
- [ ] Step 4: Confirm
- [ ] Progress indicator
- [ ] Next/Back navigation

### Fee Library
- [ ] Create fee items table
- [ ] Add item modal
- [ ] Edit item modal
- [ ] Delete item confirmation
- [ ] Vietnamese labels

### Invoice Tracker
- [ ] Create invoice list
- [ ] Status badges (Paid/Pending/Overdue)
- [ ] Payment date tracking
- [ ] View details modal

### Polish
- [ ] Vietnamese labels
- [ ] Loading states
- [ ] Error handling
- [ ] TypeScript check
- [ ] Test wizard flow

## Success Criteria

- ✅ 4-step wizard working
- ✅ Fee items table with CRUD
- ✅ Invoice tracker with filters
- ✅ Status badges (Paid/Pending/Overdue)
- ✅ Wizard navigation smooth
- ✅ Vietnamese labels
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only modifies `apps/web/app/admin/payments/*`
- No other phase touches these files
- Can run in parallel with Phases 03-06

## References

- **Current Page**: `apps/web/app/admin/payments/page.tsx`
- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
