# Dashboard Crash Analysis Report

**Date**: 2026-01-21
**Issue**: All redirects to dashboard crash for both teacher and admin roles
**Severity**: Critical - Complete dashboard failure

---

## Executive Summary

Dashboard crashes caused by **3 critical data structure mismatches** between page components and API routes. Both admin and teacher dashboards fail to render due to missing/incorrect data fields.

**Root Causes:**
1. Teacher dashboard API returns incomplete data (missing `classes` field)
2. Data type mismatch in schedule interface (`period: string` vs `period: number`)
3. Admin dashboard depends on mock-data functions that work correctly

---

## Technical Analysis

### Issue 1: Teacher Dashboard - Missing `classes` Field

**Location**: `apps/web/app/teacher/dashboard/page.tsx:72`

**Problem**: Page component expects `classes` field but API doesn't return it.

```typescript
// Page component expects:
const { stats, gradeReviews, leaveRequests, classes, schedule, assessments } = data
                                                           ^^^^^^ - REQUIRED

// But API route only returns:
{
  stats: {...},
  gradeReviews: [...],
  leaveRequests: [...],
  schedule: [...],
  assessments: {...}
  // MISSING: classes field!
}
```

**API Route**: `apps/web/app/api/teacher/dashboard/route.ts:14-31`

**Evidence**:
- Page interface (line 38-45) defines `classes` with specific structure
- API returns NO classes data
- Runtime error: `Cannot read properties of undefined (reading 'slice')` at line 328

**Impact**: Teacher dashboard crashes immediately on load.

---

### Issue 2: Schedule Interface Type Mismatch

**Location**: `apps/web/lib/mock-data.ts:326-333` vs `apps/web/lib/mock-data.ts:806-813`

**Problem**: Two conflicting schedule interfaces exist.

```typescript
// ScheduleItem (line 326-333) - Used by getTeacherStats()
export interface ScheduleItem {
  id: string
  period: string  // ← STRING type
  time: string
  className: string
  subject: string
  room: string
}

// TeacherScheduleItem (line 806-813) - Used by getTeacherSchedule()
export interface TeacherScheduleItem {
  period: number  // ← NUMBER type
  time: string
  className: string
  subject: string
  room: string
  date?: string
  // MISSING: id field
}
```

**Data mismatch**:
- `getTeacherStats()` returns `period: "Tiết 1-2"` (string)
- `getTeacherSchedule()` returns `period: 1` (number)
- Page component expects `period: number` (line 46)

**Impact**: Type errors, potential runtime crashes when rendering schedule.

---

### Issue 3: Teacher Dashboard Data Flow Breakdown

**Full data flow**:

1. **API call** (`page.tsx:61-67`):
   ```typescript
   fetchDashboardData() → fetch('/api/teacher/dashboard')
   ```

2. **API returns** (`route.ts:14-31`):
   - `stats` ✓
   - `gradeReviews` ✓
   - `leaveRequests` ✓
   - `schedule` ✓
   - `assessments` ✓
   - **`classes` ✗ MISSING**

3. **Component destructures** (`page.tsx:72`):
   ```typescript
   const { stats, gradeReviews, leaveRequests, classes, schedule, assessments } = data
                                                           ^^^^^^ undefined
   ```

4. **First use at line 328**:
   ```typescript
   {classes.slice(0, 4).map((cls) => (...))}
    ^^^^^^ undefined.slice() → CRASH
   ```

**Error Type**: `TypeError: Cannot read properties of undefined (reading 'slice')`

---

### Issue 4: Admin Dashboard Status

**Location**: `apps/web/app/admin/dashboard/page.tsx:25-32`

**Analysis**: Admin dashboard code structure is correct.

```typescript
const [stats, attendance, fees, activities, gradeDist] = await Promise.all([
  getDashboardStats(),       // ✓ Returns DashboardStats
  getAttendanceStats('week'), // ✓ Returns AttendanceStats
  getFeeStats('1'),           // ✓ Returns FeeStats
  getActivities(),            // ✓ Returns Activity[]
  getGradeDistribution(),     // ✓ Returns GradeDistribution[]
])
```

**All mock-data functions exist and return correct data.**

**Potential Issue**: Admin dashboard may crash if any component fails:
- `StatsGrid` (line 93)
- `AttendanceBoxes` (line 102)
- `FeeCollectionChart` (line 105)
- `ActivityLogTable` (line 109)
- `GradeDistribution` (line 115)
- `SupportRequests` (line 118)

**No obvious code issues in admin dashboard page itself.**

---

## Data Structure Comparison

### Teacher Dashboard Expected vs Actual

**Expected by Page** (`page.tsx:15-59`):
```typescript
interface DashboardData {
  stats: {
    teaching: number
    homeroom: string  // ← Expected string
    gradeReviewRequests: number
    leaveRequests: number
    pendingGrades: number
  }
  gradeReviews: Array<{...}>
  leaveRequests: Array<{...}>
  classes: Array<{...}>  // ← MISSING from API
  schedule: Array<{
    period: number  // ← Expected number
    subject: string
    className: string
    time: string
    room: string
  }>
  assessments: {...}
}
```

**Actually Returned by API** (`route.ts:14-31`):
```typescript
{
  stats: {
    homeroom: 1,  // ← number, not string!
    teaching: 5,
    students: 164,
    pendingAttendance: 2,  // ← Extra field not in interface
    pendingGrades: 23,
    gradeReviewRequests: 2,
    leaveRequests: 3,
    homeroomClassId: '10A1',  // ← Extra field
    todaySchedule: [...]  // ← Should be 'schedule', not nested in stats
  }
  // classes field MISSING entirely
}
```

---

## Specific Error Locations

### Teacher Dashboard

1. **Line 72**: Destructuring fails - `classes` is undefined
2. **Line 328**: `classes.slice(0, 4)` crashes
3. **Line 93**: `stats.homeroom` type mismatch (expects string, gets number)
4. **Line 370-378**: Schedule rendering may fail due to period type mismatch

### Admin Dashboard

- No direct issues found in page component
- Check admin component files for errors:
  - `apps/web/components/admin/StatsGrid.tsx`
  - `apps/web/components/admin/AttendanceBoxes.tsx`
  - `apps/web/components/admin/FeeCollectionChart.tsx`
  - `apps/web/components/admin/ActivityLogTable.tsx`
  - `apps/web/components/admin/GradeDistribution.tsx`
  - `apps/web/components/admin/SupportRequests.tsx`

---

## Recommended Fixes

### Fix 1: Add `classes` to Teacher Dashboard API

**File**: `apps/web/app/api/teacher/dashboard/route.ts`

```typescript
// Add this import
import { getTeacherClasses } from '@/lib/mock-data'

// In GET handler, add:
const classes = await getTeacherClasses(teacherId)

// Update response:
return NextResponse.json({
  success: true,
  data: {
    stats: {...},
    gradeReviews,
    leaveRequests: leaveRequests.filter(r => r.status === 'pending'),
    classes,  // ← ADD THIS
    schedule,
    assessments: {...}
  }
})
```

### Fix 2: Fix Schedule Type Mismatch

**File**: `apps/web/lib/mock-data.ts`

**Option A**: Update `ScheduleItem` to match component expectations:
```typescript
export interface ScheduleItem {
  period: number  // Change from string to number
  time: string
  className: string
  subject: string
  room: string
}
```

**Option B**: Update `getTeacherStats()` to return correct types:
```typescript
todaySchedule: [
  {
    id: '1',
    period: 1,  // Change from 'Tiết 1-2' to 1
    time: '07:30 - 09:00',
    className: '10A',
    subject: 'Toán học',
    room: 'A102',
  },
  // ...
]
```

### Fix 3: Fix `stats.homeroom` Type Mismatch

**File**: `apps/web/app/api/teacher/dashboard/route.ts` OR `apps/web/lib/mock-data.ts`

**Option A**: Change API to return string:
```typescript
stats: {
  ...stats,
  homeroom: stats.homeroomClassId || '10A',  // Return class name as string
}
```

**Option B**: Change page component to accept number:
```typescript
stats: {
  teaching: number
  homeroom: number | string  // Accept both
  // ...
}
```

### Fix 4: Update API Response Structure

**File**: `apps/web/app/api/teacher/dashboard/route.ts`

Extract `schedule` from `stats.todaySchedule`:
```typescript
const stats = await getTeacherStats(teacherId)
const { todaySchedule, ...restStats } = stats

return NextResponse.json({
  success: true,
  data: {
    stats: restStats,
    schedule: todaySchedule,  // Move to top level
    classes,
    // ...
  }
})
```

---

## Testing Plan

1. **Apply Fix 1**: Add `classes` to API response
2. **Apply Fix 2**: Standardize schedule interface
3. **Apply Fix 3**: Fix `homeroom` type mismatch
4. **Apply Fix 4**: Reorganize API response structure
5. **Test teacher dashboard**: Load `/teacher/dashboard`
6. **Test admin dashboard**: Load `/admin/dashboard`
7. **Verify all components render** without console errors

---

## Priority Levels

| Fix | Priority | Complexity | Impact |
|-----|----------|------------|--------|
| Fix 1: Add classes to API | **CRITICAL** | Low | Unblocks teacher dashboard |
| Fix 2: Schedule types | **HIGH** | Medium | Prevents runtime errors |
| Fix 3: Homeroom type | **MEDIUM** | Low | Fixes display issue |
| Fix 4: Response structure | **MEDIUM** | Low | Improves data consistency |

---

## Admin Dashboard Investigation Notes

Admin dashboard page code is clean and correctly structured. If admin dashboard crashes:
1. Check browser console for specific error
2. Inspect admin component files listed above
3. Verify mock-data functions return expected data
4. Check for runtime errors in StatsGrid, AttendanceBoxes, etc.

---

## Unresolved Questions

1. **Admin Dashboard**: Does admin dashboard actually crash? Page code looks correct. Need actual browser error to diagnose.
2. **Middleware Redirect**: Teacher redirect goes to `/teacher-temp/dashboard` instead of `/teacher/dashboard` - is this intentional? (Line 38 in middleware.ts)
3. **Authentication**: Are auth cookies being set correctly? Both dashboards require authenticated user.
4. **Environment Variables**: Is `NEXT_PUBLIC_APP_URL` set correctly for API calls?

---

## Next Steps

1. **Immediate**: Apply Fix 1 (add classes to API) - this is the crash cause
2. **High Priority**: Apply Fix 2 (schedule types) - prevents runtime errors
3. **Test**: Verify both dashboards load correctly
4. **Debug Admin**: If admin still crashes, get browser console error
5. **Review**: Check middleware redirect logic for `/teacher-temp` vs `/teacher`

---

**Report End**
