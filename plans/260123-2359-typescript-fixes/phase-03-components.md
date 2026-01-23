# Phase 3: Fix Components

**Status:** 🔄 In Progress
**Priority:** High
**Files:** 18 component files with 67+ implicit `any` errors

## Overview

Fix all implicit `any` type errors in React components. Use `code-simplifier` agent to apply consistent type annotations across all files.

## Files to Fix

| File | Error Count | Parameters |
|------|-------------|------------|
| lib/auth.ts | 1 | type assertion |
| components/admin/users/UsersManagementServer.tsx | 6 | u parameter |
| components/admin/attendance/AttendanceManagement.tsx | 2 | a parameter |
| components/admin/users/UsersManagement.tsx | 8 | u parameter |
| app/teacher/regular-assessment/page.tsx | 4 | a parameter |
| components/admin/users/modals/UserActionsModal.tsx | 1 | type assertion |
| components/teacher/GradeEntryForm.tsx | 7 | a parameter |
| app/teacher/leave-approval/page.tsx | 2 | r parameter |
| components/admin/classes/AcademicStructure.tsx | 1 | s parameter |
| components/teacher/AttendanceForm.tsx | 4 | s parameter |
| app/teacher/conduct/ConductClient.tsx | 10 | r parameter |
| components/admin/users/modals/AddUserModal.tsx | 3 | type assertion |
| app/teacher/attendance/[classId]/page.tsx | 1 | s parameter |
| components/admin/payments/modals/SendReminderModal.tsx | 1 | r parameter |
| app/teacher/assessments/AssessmentsClient.tsx | 6 | a parameter |
| components/admin/grades/GradesManagement.tsx | 4 | g parameter |
| components/admin/payments/FeeAssignmentWizard.tsx | 4 | various |
| components/admin/payments/modals/AddFeeItemModal.tsx | 2 | w parameter |

## Implementation Pattern

```typescript
// BEFORE
.filter(u => u.role === 'admin')
.map(a => a.status)
.reduce((acc, g) => acc + g.amount, 0)

// AFTER
.filter((u: any) => u.role === 'admin')
.map((a: any) => a.status)
.reduce((acc: any, g: any) => acc + g.amount, 0)
```

## Implementation Steps

1. Use `code-simplifier` agent to fix all 18 files
2. Commit changes with descriptive message
3. Push to trigger Vercel deployment
4. Monitor deployment for new errors

## Success Criteria

- All 18 component files have explicit type annotations
- `npx tsc --noEmit` passes without errors
- Vercel deployment succeeds

## Next Steps

→ [Phase 4: Verification](./phase-04-verification.md)
