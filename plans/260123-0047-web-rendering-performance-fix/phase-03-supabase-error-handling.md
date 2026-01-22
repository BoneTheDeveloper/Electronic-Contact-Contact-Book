# Phase 03: Supabase Error Handling

**Date**: 2026-01-23
**Priority**: P1
**Status**: pending
**Effort**: 1h

---

## Context Links

- **Related Files**:
  - `apps/web/lib/supabase/queries.ts` - All DB queries
  - `apps/web/app/admin/dashboard/page.tsx` - Example usage
  - `apps/web/app/teacher/dashboard/page.tsx` - Example usage

---

## Overview

Add safe wrapper for Supabase queries to handle errors gracefully with fallback values.

## Key Insights

From debugger and code review:
- Supabase queries throw unhandled errors
- `handleQueryError()` just re-throws
- No safe defaults for missing data
- Dashboard pages already have some `.catch()` patterns

## Requirements

1. Create safe query wrapper function
2. Update all query functions to use safe wrapper
3. Add type-safe default values
4. Log errors for debugging

## Implementation Steps

### Step 1: Create Safe Query Wrapper

**File**: `apps/web/lib/supabase/wrapper.ts`

```typescript
/**
 * Safe Supabase query wrapper
 * Returns default value on error instead of throwing
 */

export type SafeQueryOptions<T> = {
  defaultValue: T
  context?: string
  onError?: (error: Error) => void
}

/**
 * Wrap async function with error handling
 * Usage: await safeQuery(() => getData(), { defaultValue: [] })
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  options: SafeQueryOptions<T>
): Promise<T> {
  const { defaultValue, context = 'SupabaseQuery', onError } = options

  try {
    return await queryFn()
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))

    // Log error for debugging
    console.error(`[${context}]`, err.message)
    console.error('Stack:', err.stack)

    // Call custom error handler if provided
    onError?.(err)

    // Return default value instead of throwing
    return defaultValue
  }
}

/**
 * Wrap multiple queries in parallel
 * Usage: await safeAll([getUsers(), getClasses()], { defaultValues: [[], []] })
 */
export async function safeAll<T extends unknown[]>(
  queries: [...{ [K in keyof T]: () => Promise<T[K]> }],
  options: {
    defaultValues: T
    context?: string
  }
): Promise<T> {
  const { defaultValues, context = 'SupabaseBatchQuery' } = options

  try {
    return await Promise.all(queries.map(q => q())) as T
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error(`[${context}]`, err.message)
    return defaultValues
  }
}

/**
 * Create a safe version of any query function
 * Usage: const safeGetUsers = withSafeQuery(getUsers, { defaultValue: [] })
 */
export function withSafeQuery<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
  options: SafeQueryOptions<T>
) {
  return async (...args: Args): Promise<T> => {
    return safeQuery(() => fn(...args), options)
  }
}
```

### Step 2: Update Dashboard Queries

**File**: `apps/web/app/admin/dashboard/page.tsx`

Current code needs update:
```typescript
// Current (unsafe):
const [stats, attendance, fees, activities, gradeDist] = await Promise.all([
  getDashboardStats(),
  getAttendanceStats('week'),
  getFeeStats('1'),
  getActivities(),
  getGradeDistribution(),
])

// Updated (safe):
import { safeQuery, safeAll } from '@/lib/supabase/wrapper'

const [stats, attendance, fees, activities, gradeDist] = await safeAll(
  [
    () => getDashboardStats(),
    () => getAttendanceStats('week'),
    () => getFeeStats('1'),
    () => getActivities(),
    () => getGradeDistribution(),
  ],
  {
    defaultValues: [
      { students: 0, parents: 0, teachers: 0, attendance: '0%', feesCollected: '0%', revenue: 0, pendingPayments: 0 },
      { excused: 0, unexcused: 0, tardy: 0 },
      { percentage: 0, paidAmount: '0₫', remainingAmount: '0₫', totalAmount: '0₫', paidStudents: 0, totalStudents: 0 },
      [],
      [],
    ],
    context: 'AdminDashboard',
  }
)
```

### Step 3: Update Teacher Dashboard

**File**: `apps/web/app/teacher/dashboard/page.tsx`

Already has `.catch()` - improve with wrapper:

```typescript
import { safeQuery } from '@/lib/supabase/wrapper'

async function fetchDashboardData(): Promise<DashboardData> {
  const user = await requireAuth()
  const teacherId = user.id

  // Safe query for classes
  const teacherClasses = await safeQuery(
    () => getTeacherClasses(teacherId),
    { defaultValue: [], context: 'getTeacherClasses' }
  )

  const homeroomClass = teacherClasses.find((c) => c.isHomeroom)
  const homeroomClassId = homeroomClass?.id || '6A1'

  const defaultStats: TeacherStats = {
    homeroom: 0,
    teaching: 0,
    students: 0,
    pendingAttendance: 0,
    pendingGrades: 0,
    gradeReviewRequests: 0,
    leaveRequests: 0,
    todaySchedule: [],
  }

  // Parallel safe queries
  const [stats, leaveRequests, schedule, classes] = await safeAll(
    [
      () => getTeacherStats(teacherId),
      () => getLeaveRequests(homeroomClassId),
      () => getTeacherSchedule(teacherId),
      () => Promise.resolve(teacherClasses),
    ],
    {
      defaultValues: [defaultStats, [], [], teacherClasses],
      context: 'TeacherDashboard',
    }
  )

  return {
    stats: { ...stats, homeroomClassId },
    gradeReviews: [],
    leaveRequests: (leaveRequests || []).filter((r) => r.status === 'pending'),
    schedule: schedule || [],
    classes: classes || [],
    assessments: { evaluated: 0, pending: 0, positive: 0, needsAttention: 0 },
  }
}
```

### Step 4: Update Query Library

**File**: `apps/web/lib/supabase/queries.ts`

Add default exports for common queries:

```typescript
// At end of file, add safe versions:

export const safe = {
  getUsers: () => safeQuery(getUsers, { defaultValue: [], context: 'getUsers' }),
  getDashboardStats: () => safeQuery(getDashboardStats, {
    defaultValue: {
      students: 0,
      parents: 0,
      teachers: 0,
      attendance: '0%',
      feesCollected: '0%',
      revenue: 0,
      pendingPayments: 0,
    },
    context: 'getDashboardStats',
  }),
  getTeacherStats: (id: string) => safeQuery(() => getTeacherStats(id), {
    defaultValue: {
      homeroom: 0,
      teaching: 0,
      students: 0,
      pendingAttendance: 0,
      pendingGrades: 0,
      gradeReviewRequests: 0,
      leaveRequests: 0,
      todaySchedule: [],
    },
    context: 'getTeacherStats',
  }),
  // Add more as needed...
}
```

## Todo List

- [ ] Create `apps/web/lib/supabase/wrapper.ts`
- [ ] Update `apps/web/app/admin/dashboard/page.tsx`
- [ ] Update `apps/web/app/teacher/dashboard/page.tsx`
- [ ] Add safe exports to `apps/web/lib/supabase/queries.ts`
- [ ] Test with Supabase connection errors
- [ ] Verify default values display correctly

## Success Criteria

- [ ] DB errors don't crash pages
- [ ] Default values display on error
- [ ] Errors logged to console
- [ ] All dashboard pages handle errors gracefully

## Risk Assessment

- **Risk**: Low (only adds error handling)
- **Impact**: High (prevents crashes)
- **Testing**: Disable Supabase, verify fallback

---

**Next Phase**: [Phase 04 - Auth Improvements](./phase-04-auth-improvements.md)
