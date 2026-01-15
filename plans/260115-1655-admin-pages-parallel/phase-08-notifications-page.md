---
title: "Phase 08 - Notifications Page Update"
description: "Update existing notifications page with broadcast functionality"
status: pending
priority: P1
effort: 2h
branch: master
tags: [notifications, update, broadcast, templates]
created: 2026-01-15
---

# Phase 08: Notifications Page Update

## Context Links
- **Parent Plan**: `plan.md`
- **Wireframe Research**: `../260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`
- **Shared Components**: `phase-02-shared-components.md`

## Parallelization Info

**Blocks**: None
**Blocked by**: Phase 01 (Sidebar), Phase 02 (Shared Components)
**Can run parallel with**: Phases 03-07 (ZERO file overlap)

## Overview

**Date**: 2026-01-15
**Description**: Update existing notifications page with broadcast functionality and template system
**Priority**: P1 (High)
**Effort**: 2 hours
**Status**: Pending

## Requirements

### From Wireframe

**Page Structure**
1. **Broadcast Notification**:
   - Recipient selection (All/Class/Student/Parent/Teacher)
   - Title input
   - Message body (rich text)
   - Send button

2. **Notification Templates**:
   - Template library table
   - Columns: Template Name, Category, Last Used, Actions
   - Use template button
   - Edit/Delete templates

3. **Sent Notifications**:
   - History table
   - Columns: Title, Recipients, Sent Date, Status, Actions
   - View details modal
   - Resend option

4. **Filters**:
   - Date range picker
   - Recipient type filter
   - Status filter (Sent/Failed/Pending)

## Related Code Files

### Exclusive Ownership (This Phase ONLY)
- `apps/web/app/admin/notifications/page.tsx` ✅ **MODIFY**
- `apps/web/components/admin/notifications/*` ✅ **CREATE NEW**

### Can Import (Read-Only)
- `apps/web/components/admin/shared/*` (from Phase 02)

## File Ownership

### Modified Files
1. **`apps/web/app/admin/notifications/page.tsx`**
   - Update layout to match wireframe
   - Add broadcast form
   - Import shared components

### New Files (Create All)
1. **`apps/web/components/admin/notifications/BroadcastForm.tsx`** - Broadcast form
2. **`apps/web/components/admin/notifications/TemplateLibrary.tsx`** - Templates table
3. **`apps/web/components/admin/notifications/SentHistory.tsx`** - Sent notifications
4. **`apps/web/components/admin/notifications/NotificationModal.tsx`** - View details
5. **`apps/web/components/admin/notifications/TemplateEditor.tsx`** - Template editor

## Implementation Steps

### Step 1: Update Page Layout (30 minutes)
- Import shared components
- Add broadcast form section
- Add template library table
- Add sent history table
- Vietnamese labels

### Step 2: Broadcast Form (45 minutes)
- Recipient dropdown (All/Class/Student/Parent/Teacher)
- Title input
- Message body (textarea or rich text)
- Send button
- Clear button

### Step 3: Template Library (30 minutes)
- Table with templates
- Columns: Template Name, Category, Last Used, Actions
- Use template button
- Add/Edit/Delete modals
- Vietnamese labels

### Step 4: Sent History (30 minutes)
- Table with sent notifications
- Columns: Title, Recipients, Sent Date, Status, Actions
- View details modal
- Resend option
- Status badges (Sent/Failed/Pending)

### Step 5: Filters (15 minutes)
- Date range picker
- Recipient type filter
- Status filter
- Clear filters button

## Todo List

### Page Layout
- [ ] Update notifications page layout
- [ ] Add broadcast form section
- [ ] Add template library section
- [ ] Add sent history section

### Broadcast Form
- [ ] Recipient dropdown
- [ ] Title input
- [ ] Message body
- [ ] Send button
- [ ] Clear button

### Template Library
- [ ] Create templates table
- [ ] Add template modal
- [ ] Edit template modal
- [ ] Delete template
- [ ] Use template button

### Sent History
- [ ] Create sent notifications table
- [ ] Status badges (Sent/Failed/Pending)
- [ ] View details modal
- [ ] Resend option

### Filters
- [ ] Date range picker
- [ ] Recipient type filter
- [ ] Status filter
- [ ] Clear button

### Polish
- [ ] Vietnamese labels
- [ ] Loading states
- [ ] Error handling
- [ ] TypeScript check
- [ ] Test broadcast

## Success Criteria

- ✅ Broadcast form working
- ✅ Template library with CRUD
- ✅ Sent history with filters
- ✅ Status badges (Sent/Failed/Pending)
- ✅ View details modal
- ✅ Resend option
- ✅ Vietnamese labels
- ✅ Zero TypeScript errors

## Conflict Prevention

**Zero Overlap**:
- Only modifies `apps/web/app/admin/notifications/*`
- No other phase touches these files
- Can run in parallel with Phases 03-07

## References

- **Current Page**: `apps/web/app/admin/notifications/page.tsx`
- **Wireframe**: `plans/260115-1648-admin-pages-implementation/research/researcher-01-wireframe-report.md`

---

**Phase Version**: 1.0
**Status**: Ready to Start (After Phase 02)
