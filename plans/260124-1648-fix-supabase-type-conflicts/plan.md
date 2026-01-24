---
title: "Fix TypeScript Type Conflicts Between Supabase Schema and API"
description: "Comprehensive plan to resolve 105 TypeScript errors by regenerating types, fixing exports, updating nullability handling, and adding proper relationship hints"
status: pending
priority: P1
effort: 3h
branch: master
tags: [typescript, supabase, types, api]
created: 2026-01-24
---

## Executive Summary

**Current State:** 105 TypeScript errors across the codebase due to:
1. Stale auto-generated Supabase types
2. Export naming mismatch (`createClient` vs `createServerClient`)
3. Nullable type mismatches between DB and app types
4. Missing relationship hints causing ambiguous joins
5. Type inference issues in query functions

**Target State:** Zero TypeScript errors with proper type safety maintained.

**Dependencies:** None (self-contained fix)

---

## Phase 1: Regenerate Supabase Types (15 min)

**Files to Modify:**
- `apps/web/types/supabase.ts` (auto-generated, replace entirely)

**Command to Run:**
```bash
# From project root (REMOTE - project confirmed as lshmmoenfeodsrthsevf)
supabase gen types typescript --project-id lshmmoenfeodsrthsevf --schema public > apps/web/types/supabase.ts
```

**Expected Changes:**
- Updated nullability constraints
- Fixed relationship metadata
- NOTE: `students` table has NO `grade` column - accessed via `enrollments.classes.grades`

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep -E "column.*does not exist" | wc -l
# Should output 0
```

---

## Phase 2: Fix Export Naming (20 min)

**Problem:**
- `lib/supabase/server.ts` exports `createClient`
- Multiple files import as `createServerClient` which doesn't exist

**Files to Modify:**

### 2.1 Update imports in Student Portal pages (9 files)

**File:** `apps/web/app/student/feedback/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/leave/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/materials/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/news/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/summary/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/attendance/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/payments/page.tsx`
```diff
- import { createServerClient } from '@/lib/supabase/server';
+ import { createClient } from '@/lib/supabase/server';
```

**File:** `apps/web/app/student/schedule/page.tsx`
```diff
- import { createClient } from '@/lib/supabase/server';
+ // Already correct, no change needed
```

### 2.2 Update queries.ts import alias (internal)

**File:** `apps/web/lib/supabase/queries.ts:18`
```diff
- import { createClient as createServerClient } from './server'
+ import { createClient } from './server'
```

Then update all usages (92 occurrences):
```diff
- const supabase = await createServerClient()
+ const supabase = await createClient()
```

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep "createServerClient" | wc -l
# Should output 0
```

---

## Phase 3: Fix Type Inference in Cache Wrapper (30 min)

**Problem:**
Cache wrapper returns `Promise<unknown>` instead of properly typed promises.

**File:** `apps/web/lib/supabase/queries.ts:7-15`

**Current Implementation:**
```typescript
function cache<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, Promise<ReturnType<T>>>()
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key)!
  }) as T
}
```

**Fixed Implementation:**
```typescript
function cache<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (!cache.has(key)) {
      cache.set(key, fn(...args))
    }
    return cache.get(key)!
  }) as T
}
```

**Changes:**
1. `Map<string, Promise<ReturnType<T>>>` → `Map<string, ReturnType<T>>`
2. `...args: unknown[]` → `...args: Parameters<T>` (proper parameter typing)

**Affected Functions (no changes needed, just type fixes):**
- `getUsers` (line 109)
- `getDashboardStats` (line 249)
- `getTeacherStats` (line 331)
- `getClasses` (line 497)
- `getFeeAssignments` (line 662)
- `getFeeItems` (line 693)
- `getAssessments` (line 875)
- `getTeacherClasses` (line 976)
- `getTeacherSchedule` (line 1021)
- `getLeaveRequests` (line 1064)
- `getNotifications` (line 1112)
- `getRegularAssessments` (line 1270)

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep "is of type 'unknown'" | wc -l
# Should drop from ~20 to 0
```

---

## Phase 4: Fix Nullable vs Non-Nullable Mismatches (45 min)

**Problem:**
Database types allow `null` but app types don't. Need to handle nullability properly.

### 4.1 Update App Types for Nullability

**File:** `apps/web/lib/types.ts`

**Update `Class` interface:**
```diff
  export interface Class {
    id: string
    name: string
    grade: string
    teacher: string
-   studentCount: number
+   studentCount: number | null
    room: string
  }
```

**Update `FeeAssignment` interface:**
```diff
  export interface FeeAssignment {
    id: string
    name: string
-   targetGrades: string[]
+   targetGrades: string[] | null
    targetClasses: string[]
    feeItems: string[]
    startDate: string
    dueDate: string
-   reminderDays: number
-   reminderFrequency: 'once' | 'daily' | 'weekly'
-   totalStudents: number
-   totalAmount: number
+   reminderDays: number | null
+   reminderFrequency: 'once' | 'daily' | 'weekly' | null
+   totalStudents: number | null
+   totalAmount: number | null
    status: 'draft' | 'published' | 'closed'
    createdAt: string
  }
```

**Update `LeaveRequest` interface:**
```diff
  export interface LeaveRequest {
    id: string
    studentId: string
    studentName: string
    startDate: string
    endDate: string
    reason: string
    status: 'pending' | 'approved' | 'rejected'
-   submittedDate: string
+   submittedDate: string | null
  }
```

**Update `Notification` interface:**
```diff
  export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    targetRole: 'all' | 'teacher' | 'parent' | 'student'
-   createdAt: string
+   createdAt: string | null
  }
```

### 4.2 Add Null Coalescing in Queries (for strict type safety)

**File:** `apps/web/lib/supabase/queries.ts`

**Line 515-522 (getClasses):**
```diff
  return (data || []).map((c) => ({
    id: c.id,
    name: c.name,
    grade: c.grades.name,
    teacher: '',
-   studentCount: c.current_students,
+   studentCount: c.current_students ?? 0,
    room: c.room || ''
  }))
```

**Line 672-686 (getFeeAssignments):**
```diff
  return (data || []).map((fa) => ({
    id: fa.id,
    name: fa.name,
-   targetGrades: fa.target_grades,
+   targetGrades: fa.target_grades ?? [],
    targetClasses: fa.target_classes || [],
    feeItems: fa.fee_items,
    startDate: fa.start_date,
    dueDate: fa.due_date,
-   reminderDays: fa.reminder_days,
-   reminderFrequency: fa.reminder_frequency,
-   totalStudents: fa.total_students,
-   totalAmount: fa.total_amount,
+   reminderDays: fa.reminder_days ?? 0,
+   reminderFrequency: fa.reminder_frequency || 'once',
+   totalStudents: fa.total_students ?? 0,
+   totalAmount: fa.total_amount ?? 0,
    status: fa.status as FeeAssignment['status'],
-   createdAt: fa.created_at
+   createdAt: fa.created_at ?? new Date().toISOString()
  }))
```

**Line 1094-1103 (getLeaveRequests):**
```diff
  return (data || []).map((lr) => ({
    id: lr.id,
-   studentId: lr.students.id,
+   studentId: lr.students?.id ?? '',
    studentName: lr.students?.profiles?.full_name || 'Unknown',
    startDate: lr.start_date,
    endDate: lr.end_date,
    reason: lr.reason,
    status: lr.status as LeaveRequest['status'],
-   submittedDate: lr.created_at
+   submittedDate: lr.created_at ?? new Date().toISOString()
  }))
```

**Line 1123-1130 (getNotifications):**
```diff
  return (data || []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.content,
    type: n.type as Notification['type'],
    targetRole: 'all' as const,
-   createdAt: n.created_at
+   createdAt: n.created_at ?? new Date().toISOString()
  }))
```

**Line 1007 (getTeacherClasses):**
```diff
-   room: s.room || '',
+   room: s.room ?? '',
```

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep "null.*is not assignable" | wc -l
# Should output 0
```

---

## Phase 5: Fix Relationship/Join Issues (30 min)

**Problem:**
Ambiguous relationships between `profiles` and `students` tables. Supabase requires explicit hints.

### 5.1 Fix Dashboard Student Query

**File:** `apps/web/app/student/dashboard/page.tsx`

**Lines 28-34:**
```diff
  const { data: student } = await supabase
    .from('students')
-   .select(`
-     id,
-     student_code,
-     grade,
-     section,
-     profiles!inner (
+   .select(`
+     id,
+     student_code,
+     profiles!students_id_fkey (
        full_name,
        email,
        role
      ),
      enrollments!inner (
        class_id,
        classes!inner (
          name,
          grades!inner (name)
        )
      )
    `)
```

**NOTE:** `grade` and `section` do NOT exist on `students` table. Grade comes from `enrollments.classes.grades.name`.

### 5.2 Fix getStudents Query

**File:** `apps/web/lib/supabase/queries.ts:436-443`

```diff
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      student_code,
-     profiles!inner(id, full_name, email, status),
+     profiles!students_id_fkey(id, full_name, email, status),
      enrollments!inner(class_id, status)
    `)
    .eq('enrollments.status', 'active')
```

### 5.3 Fix getStudentsByClass Query

**File:** `apps/web/lib/supabase/queries.ts:569-579`

```diff
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
      classes!inner(id, name),
      students!inner(
        id,
        student_code,
-       profiles!inner(full_name)
+       profiles!students_id_fkey(full_name)
      )
    `)
    .eq('class_id', classId)
    .eq('status', 'active')
```

### 5.4 Fix getTeacherClasses Query

**File:** `apps/web/lib/supabase/queries.ts:980-986`

```diff
  let query = supabase
    .from('schedules')
    .select(`
      class_id,
      room,
      subjects!inner(id, name),
-     classes!inner(id, name, grade_id, current_students, grades!inner(name))
+     classes!inner(id, name, grade_id, current_students, grades(id, name))
    `)
```

### 5.5 Fix getLeaveRequests Query

**File:** `apps/web/lib/supabase/queries.ts:1071-1082`

```diff
  let query = supabase
    .from('leave_requests')
    .select(`
      id,
      start_date,
      end_date,
      reason,
      status,
      created_at,
-     students!inner(
-       profiles!students_id_fkey(full_name)
-     )
+     students!inner(
+       id,
+       profiles!students_id_fkey(full_name)
+     )
    `)
```

### 5.6 Fix Other Student Profile Joins

**File:** `apps/web/lib/supabase/queries.ts`

**Line 854 (getClassStudents):**
```diff
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
-     students!inner(
-       profiles!inner(full_name)
-     )
+     students!inner(
+       profiles!students_id_fkey(full_name)
+     )
    `)
```

**Line 949 (getGradeEntrySheet):**
```diff
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
-     students!inner(
-       profiles!inner(full_name)
-     )
+     students!inner(
+       profiles!students_id_fkey(full_name)
+     )
    `)
```

**Line 1318 (getConductRatings):**
```diff
  let query = supabase
    .from('students')
    .select(`
      id,
      student_code,
-     profiles!inner(full_name),
+     profiles!students_id_fkey(full_name),
      enrollments!inner(class_id)
    `)
```

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep "more than one relationship" | wc -l
# Should output 0
```

---

## Phase 6: Fix Missing Component Exports (15 min)

**Problem:**
`SubjectBadge` component imported but not exported from constants file.

**File:** `apps/web/components/student/shared/constants.ts`

**Add at end of file:**
```typescript
// SubjectBadge component
export function SubjectBadge({
  subjectName,
  size = 'sm'
}: {
  subjectName: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const info = getSubjectInfo(subjectName)
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  return (
    <span className={`${info.bg} ${info.text} ${sizeClasses[size]} rounded-lg font-bold`}>
      {info.short}
    </span>
  )
}
```

**Import React at top of file:**
```diff
+ import React from 'react'

  /**
   * Student Portal Constants
```

**Verification:**
```bash
cd apps/web && npx tsc --noEmit 2>&1 | grep "SubjectBadge" | wc -l
# Should output 0
```

---

## Phase 7: Fix Additional Type Issues (25 min)

### 7.0 Add Missing Notification Type Definitions

**Problem:**
`NotificationCategory` and `NotificationPriority` types are referenced in code but not defined. These match database constraints.

**File:** `apps/web/lib/types.ts`

**Add at end of file:**
```typescript
// Notification types matching database constraints
export type NotificationCategory = 'announcement' | 'emergency' | 'reminder' | 'system'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'emergency'
```

**Database constraints (for reference):**
- `category`: `announcement | emergency | reminder | system` (from `notifications.category` check)
- `priority`: `low | normal | high | emergency` (from `notifications.priority` check)

### 7.1 Fix StatusBadge Missing Import

**File:** `apps/web/app/student/attendance/page.tsx:181`

**Add import:**
```diff
+ import { StatusBadge } from '@/components/shared/status-badge';
```

**Or replace with inline component if StatusBadge doesn't exist:**
```diff
- <StatusBadge status={status} />
+ <span className={`px-2 py-1 rounded-full text-xs font-bold ${
+   status === 'present' ? 'bg-emerald-100 text-emerald-700' :
+   status === 'absent' ? 'bg-red-100 text-red-600' :
+   status === 'late' ? 'bg-amber-100 text-amber-600' :
+   'bg-blue-100 text-blue-700'
+ }`}>
+   {STATUS_COLORS[status]?.label || status}
+ </span>
```

### 7.2 Fix Status Comparison Error

**File:** `apps/web/app/student/attendance/page.tsx:152`

**The issue is comparing 'none' with attendance status. Fix:**
```diff
- {status === 'none' && (
+ {(status === 'pending' || !status) && (
```

### 7.3 Fix Student Layout student_id Error

**File:** `apps/web/app/student/layout.tsx`

**The error shows profiles table doesn't have student_id column. The query should use profiles directly:**

```diff
  const { data: profile } = await supabase
    .from('profiles')
-   .select('student_id, role')
+   .select('id, role')
    .eq('id', user.id)
    .single()

  const studentId = profile?.id
```

**Then update all references (lines 35, 37, 39, 50, 57, 62):**
```diff
-   if (profile?.role === 'student') {
+   if (profile?.role === 'student' && studentId) {
```

### 7.4 Fix Leave Status Type Mismatch

**File:** `apps/web/app/student/leave/page.tsx:138`

**Leave request status doesn't match attendance status:**
```diff
  const statusColor = {
-   pending: 'bg-amber-100 text-amber-700',
-   approved: 'bg-emerald-100 text-emerald-700',
-   rejected: 'bg-red-100 text-red-600'
- }[request.status] || 'bg-gray-100 text-gray-600'
+   pending: 'bg-amber-100 text-amber-700',
+   approved: 'bg-emerald-100 text-emerald-700',
+   rejected: 'bg-red-100 text-red-600'
+  }[request.status as keyof typeof statusColor] || 'bg-gray-100 text-gray-600'
```

### 7.5 Fix student_guardians Query

**File:** `apps/web/app/api/student-guardians/route.ts`

**The query references non-existent columns. Fix:**
```diff
  const { data, error } = await supabase
    .from('student_guardians')
-   .select(`
+   .select(`
      student_id,
      guardian_id,
-     students!inner (
-       id,
-       student_code,
-       grade,
-       section,
-       profiles!inner (full_name)
-     ),
-     guardians!inner (
-       id,
-       profiles!inner (full_name, email, phone)
-     )
+     students!inner(
+       id,
+       student_code,
+       profiles!students_id_fkey(full_name)
+     ),
+     parents!inner(
+       id,
+       profiles!inner(full_name, email, phone)
+     )
    `)
```

### 7.6 Fix realtime.ts Type Errors

**File:** `apps/web/lib/supabase/realtime.ts`

**Add proper type guards:**
```diff
  const payload = newRecord
-   ? { id: newRecord.id, ...newRecord }
+   ? (newRecord && 'id' in newRecord ? { id: newRecord.id as string, ...newRecord } : {})
    : oldRecord || {}

+ if ('id' in payload && payload.id) {
    const notification: NotificationListItem = {
      id: payload.id as string,
-     title: payload.title,
-     content: payload.content,
-     category: payload.category as NotificationCategory,
-     priority: payload.priority as NotificationPriority,
-     isRead: payload.is_read ?? false,
-     createdAt: payload.created_at ?? new Date().toISOString()
+     title: 'title' in payload ? payload.title as string : '',
+     content: 'content' in payload ? payload.content as string : '',
+     category: ('category' in payload ? payload.category : 'info') as NotificationCategory,
+     priority: ('priority' in payload ? payload.priority : 'normal') as NotificationPriority,
+     isRead: ('is_read' in payload ? payload.is_read : false) as boolean,
+     createdAt: 'created_at' in payload ? (payload.created_at as string) ?? new Date().toISOString() : new Date().toISOString()
    }
+ }
```

### 7.7 Fix Notification Service Type Errors

**File:** `apps/web/lib/services/notification-service.ts`

**Lines 145-146, 192, 244, 261:**
```diff
  return {
    ...notificationData,
-   category: notification.category as NotificationCategory,
-   priority: notification.priority as NotificationPriority,
+   category: (notification.category ?? 'info') as NotificationCategory,
+   priority: (notification.priority ?? 'normal') as NotificationPriority,
  }
```

**Define proper type casts for notification lists:**
```diff
  return notifications.map(n => ({
    ...n,
-   category: n.category,
-   priority: n.priority
+   category: (n.category ?? 'info') as NotificationCategory,
+   priority: (n.priority ?? 'normal') as NotificationPriority
  })) as UserNotification[]
```

---

## Phase 8: Fix Payment and Invoice Type Issues (20 min)

### 8.1 Fix PaymentsManagement Type Errors

**File:** `apps/web/components/admin/payments/PaymentsManagement.tsx`

**Line 158:**
```diff
- const formatter = new Intl.NumberFormat('vi-VN')
+ const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

- {typeof invoice.total_amount === 'number' && formatter.format(invoice.total_amount)}
+ {formatter.format((invoice.total_amount ?? 0) as number)}
```

**Line 166:**
```diff
- {invoice.remaining_amount}
+ {invoice.remaining_amount ?? 0}
```

**Line 173:**
```diff
- {}}
+ (invoice.remaining_amount ?? 0).toString()}
```

**Line 187:**
```diff
- statusStyles[invoice.status]
+ statusStyles[invoice.status as keyof typeof statusStyles]
```

### 8.2 Fix Modal Type Errors

**File:** `apps/web/components/admin/payments/modals/InvoiceDetailModal.tsx:94`

```diff
- statusConfig[value].label
+ statusConfig[status as keyof typeof statusConfig].label
```

**File:** `apps/web/components/admin/payments/modals/PaymentConfirmModal.tsx:104`

```diff
- statusConfig[value].label
+ statusConfig[status as keyof typeof statusConfig].label
```

---

## Phase 9: Verify and Final Testing (20 min)

### 9.1 Run Full Type Check

```bash
cd apps/web && npx tsc --noEmit 2>&1 | tee typecheck-errors.txt
```

**Expected Output:**
```
# Zero errors
```

### 9.2 Verify Build Success

```bash
cd apps/web && npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (3/3)
✓ Finalizing page optimization
```

### 9.3 Test Critical User Flows

1. **Student Dashboard:**
   - Access `/student/dashboard`
   - Verify profile loads correctly
   - Check class information displays

2. **Student Attendance:**
   - Access `/student/attendance`
   - Verify attendance records display
   - Check status badges render

3. **Fee Assignments API:**
   - Test `GET /api/fee-assignments`
   - Verify response structure matches types

4. **Student Guardians API:**
   - Test `GET /api/student-guardians`
   - Verify guardian relationships load

### 9.4 Create Regression Test

**File:** `apps/web/__tests__/type-check.test.ts` (create if doesn't exist)

```typescript
import { describe, it, expect } from 'vitest'
import {
  getFeeAssignments,
  getFeeItems,
  getTeacherStats,
  getStudents,
  getClasses
} from '@/lib/supabase/queries'
import type {
  FeeAssignment,
  FeeItem,
  TeacherStats,
  Student,
  Class
} from '@/lib/types'

describe('Type Safety Regression Tests', () => {
  it('getFeeAssignments returns correct type', async () => {
    const assignments: FeeAssignment[] = await getFeeAssignments()
    expect(Array.isArray(assignments)).toBe(true)
  })

  it('getFeeItems returns correct type', async () => {
    const items: FeeItem[] = await getFeeItems()
    expect(Array.isArray(items)).toBe(true)
  })

  it('getTeacherStats returns correct type', async () => {
    const stats: TeacherStats = await getTeacherStats('test-id')
    expect(stats).toHaveProperty('homeroom')
  })

  it('getStudents returns correct type', async () => {
    const students: Student[] = await getStudents()
    expect(Array.isArray(students)).toBe(true)
  })

  it('getClasses returns correct type', async () => {
    const classes: Class[] = await getClasses()
    expect(Array.isArray(classes)).toBe(true)
  })
})
```

Run tests:
```bash
cd apps/web && npm test
```

---

## Summary of Changes

| Phase | Files Modified | Lines Changed | Est. Time |
|-------|---------------|---------------|-----------|
| 1 | `types/supabase.ts` | ~2300 (auto) | 15 min |
| 2 | 9 student pages + queries.ts | ~100 | 20 min |
| 3 | `queries.ts` | 8 | 30 min |
| 4 | `types.ts` + `queries.ts` | ~50 | 45 min |
| 5 | 6 query functions + dashboard | ~60 | 30 min |
| 6 | `constants.ts` | +20 | 15 min |
| 7 | 7 various files | ~80 | 25 min |
| 8 | 3 payment components | ~30 | 20 min |
| 9 | Test files | +50 | 20 min |
| **Total** | **~30 files** | **~2700 lines** | **3 hours** |

---

## Rollback Plan

If issues arise:

1. **Revert supabase types:**
   ```bash
   git checkout HEAD -- apps/web/types/supabase.ts
   ```

2. **Revert all changes:**
   ```bash
   git checkout HEAD -- apps/web/
   ```

3. **Restore from backup (if created):**
   ```bash
   cp -r apps/web.backup/* apps/web/
   ```

---

## Success Criteria

- ✅ Zero TypeScript errors (`npx tsc --noEmit` exits cleanly)
- ✅ Production build succeeds (`npm run build` completes)
- ✅ All tests pass (`npm test` passes)
- ✅ Critical user paths functional (dashboard, attendance, fees)
- ✅ No runtime type errors in browser console

---

## Unresolved Questions

### Resolved ✅

1. ~~**Environment Variables:** Where is the Supabase connection configured?~~
   - **FOUND:** `.env` at root with `NEXT_PUBLIC_SUPABASE_URL` and anon key
   - Project: `lshmmoenfeodsrthsevf.supabase.co`

2. ~~**Database Schema:** Confirm that `grade` column exists on `students` table in production.~~
   - **CONFIRMED:** `grade` does NOT exist on `students` table
   - Access via: `students → enrollments → classes → grades.name`
   - Phase 5.1 updated to remove non-existent columns

3. ~~**Notification Types:** `NotificationCategory` and `NotificationPriority` types referenced but not defined.~~
   - **FIXED:** Added Phase 7.0 to define these types matching database constraints

4. ~~**Remote Database:** Type generation uses `--local` flag.~~
   - **FIXED:** Phase 1 updated to use `--project-id lshmmoenfeodsrthsevf`

### Remaining ⚠️

4. **StatusBadge Component:** Referenced in `apps/web/app/student/attendance/page.tsx:181` but may not exist. Phase 7.1 provides inline fallback.
