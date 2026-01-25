# Phase 01: Database Queries & API

**Status:** Pending
**Priority:** High
**Dependencies:** None

## Context

Links: [plan.md](plan.md)

## Overview

Create Supabase query functions and API routes for attendance operations. This phase establishes the data layer for real attendance tracking, replacing mock data with actual database operations.

## Key Insights

1. Attendance table already exists with proper schema
2. Need query functions for CRUD operations
3. API routes need to handle class/date/period filtering
4. Bulk operations needed for efficiency
5. Statistics calculation from database

## Requirements

### Functional Requirements
- [ ] Create attendance query functions (get, create, update, bulk)
- [ ] Implement API routes for attendance operations
- [ ] Add filtering by class, date, period, status
- [ ] Implement bulk attendance save
- [ ] Calculate attendance statistics from database
- [ ] Add error handling and validation

### Technical Requirements
- Use Supabase client directly in server components
- Implement proper TypeScript types
- Handle database errors gracefully
- Support both full-day and period-based attendance

## Architecture

```
apps/web/
├── lib/
│   └── supabase/
│       └── queries/
│           └── attendance.ts          # Attendance query functions
├── app/
│   └── api/
│       └── teacher/
│           └── attendance/
│               ├── route.ts            # GET/POST attendance list
│               └── [classId]/
│                   └── route.ts        # Class-specific attendance
└── lib/
    └── services/
        └── attendance-service.ts      # Business logic layer
```

## Related Code Files

- `apps/web/app/api/attendance/route.ts` - Replace mock implementation
- `apps/web/lib/supabase/client.ts` - Supabase client (should exist)
- `apps/web/lib/types.ts` - Type definitions (lines ~1-200)

## Implementation Steps

### 1. Create Attendance Query Functions

**File:** `apps/web/lib/supabase/queries/attendance.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js'

export interface AttendanceRecord {
  id: string
  student_id: string
  class_id: string
  date: string
  period_id: number | null
  status: 'present' | 'absent' | 'late' | 'excused'
  notes: string | null
  recorded_by: string
  created_at: string
  updated_at: string
}

export interface AttendanceWithStudent extends AttendanceRecord {
  student: {
    id: string
    student_code: string
    full_name: string
  }
}

// Get attendance by class, date, and optional period
export async function getClassAttendance(
  supabase: SupabaseClient,
  classId: string,
  date: string,
  periodId?: number
): Promise<AttendanceWithStudent[]> {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      student:students!inner(
        id,
        student_code,
        full_name
      )
    `)
    .eq('class_id', classId)
    .eq('date', date)
    .order('student_code')

  if (periodId !== undefined) {
    query = query.eq('period_id', periodId)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

// Bulk insert/update attendance records
export async function saveAttendanceRecords(
  supabase: SupabaseClient,
  records: {
    student_id: string
    class_id: string
    date: string
    period_id: number | null
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
    recorded_by: string
  }[]
): Promise<void> {
  // Use upsert for idempotent operations
  const { error } = await supabase
    .from('attendance')
    .upsert(records, {
      onConflict: 'student_id,class_id,date,period_id'
    })

  if (error) throw error
}

// Get attendance statistics for a class
export async function getAttendanceStats(
  supabase: SupabaseClient,
  classId: string,
  date: string,
  periodId?: number
): Promise<{
  total: number
  present: number
  absent: number
  late: number
  excused: number
}> {
  let query = supabase
    .from('attendance')
    .select('status')
    .eq('class_id', classId)
    .eq('date', date)

  if (periodId !== undefined) {
    query = query.eq('period_id', periodId)
  }

  const { data, error } = await query

  if (error) throw error

  const stats = {
    total: data?.length || 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  }

  data?.forEach(record => {
    stats[record.status]++
  })

  return stats
}

// Get students with approved leave requests for date
export async function getApprovedLeaveRequests(
  supabase: SupabaseClient,
  classId: string,
  date: string
): Promise<Array<{
  student_id: string
  reason: string
}>> {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('student_id, reason')
    .eq('status', 'approved')
    .lte('start_date', date)
    .gte('end_date', date)

  if (error) throw error
  return data || []
}
```

### 2. Create Attendance API Routes

**File:** `apps/web/app/api/teacher/attendance/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getClassAttendance,
  getAttendanceStats
} from '@/lib/supabase/queries/attendance'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const classId = searchParams.get('classId')
  const date = searchParams.get('date')
  const periodId = searchParams.get('periodId')

  if (!classId || !date) {
    return NextResponse.json({
      success: false,
      message: 'Missing required parameters: classId, date'
    }, { status: 400 })
  }

  try {
    const [attendance, stats] = await Promise.all([
      getClassAttendance(
        supabase,
        classId,
        date,
        periodId ? parseInt(periodId) : undefined
      ),
      getAttendanceStats(
        supabase,
        classId,
        date,
        periodId ? parseInt(periodId) : undefined
      )
    ])

    return NextResponse.json({
      success: true,
      data: attendance,
      stats
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch attendance'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { classId, date, periodId, records, teacherId } = body

  if (!records || !Array.isArray(records)) {
    return NextResponse.json({
      success: false,
      message: 'Invalid records data'
    }, { status: 400 })
  }

  try {
    const { saveAttendanceRecords } = await import('@/lib/supabase/queries/attendance')

    await saveAttendanceRecords(
      supabase,
      records.map(r => ({
        ...r,
        class_id: classId,
        date,
        period_id: periodId || null,
        recorded_by: teacherId
      }))
    )

    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully'
    })
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to save attendance'
    }, { status: 500 })
  }
}
```

**File:** `apps/web/app/api/teacher/attendance/[classId]/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getClassAttendance } from '@/lib/supabase/queries/attendance'

export async function GET(
  request: Request,
  { params }: { params: { classId: string } }
) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const periodId = searchParams.get('periodId')

  try {
    const attendance = await getClassAttendance(
      supabase,
      params.classId,
      date,
      periodId ? parseInt(periodId) : undefined
    )

    return NextResponse.json({
      success: true,
      data: attendance
    })
  } catch (error) {
    console.error('Error fetching class attendance:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch attendance'
    }, { status: 500 })
  }
}
```

### 3. Create Attendance Service

**File:** `apps/web/lib/services/attendance-service.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js'

export interface AttendanceInput {
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export class AttendanceService {
  constructor(private supabase: SupabaseClient) {}

  async saveClassAttendance(
    classId: string,
    date: string,
    periodId: number | null,
    records: AttendanceInput[],
    teacherId: string
  ): Promise<void> {
    const { saveAttendanceRecords } = await import('@/lib/supabase/queries/attendance')

    await saveAttendanceRecords(
      this.supabase,
      records.map(r => ({
        student_id: r.studentId,
        class_id: classId,
        date,
        period_id: periodId,
        status: r.status,
        notes: r.notes || null,
        recorded_by: teacherId
      }))
    )
  }

  async getAbsentStudents(
    classId: string,
    date: string,
    periodId?: number
  ): Promise<Array<{ studentId: string; studentName: string }>> {
    const { getClassAttendance } = await import('@/lib/supabase/queries/attendance')

    const attendance = await getClassAttendance(
      this.supabase,
      classId,
      date,
      periodId
    )

    return attendance
      .filter(a => a.status === 'absent' || a.status === 'late')
      .map(a => ({
        studentId: a.student_id,
        studentName: a.student.full_name
      }))
  }
}
```

## Todo List

- [ ] Create `apps/web/lib/supabase/queries/attendance.ts`
- [ ] Implement `getClassAttendance()` function
- [ ] Implement `saveAttendanceRecords()` function
- [ ] Implement `getAttendanceStats()` function
- [ ] Implement `getApprovedLeaveRequests()` function
- [ ] Create `apps/web/app/api/teacher/attendance/route.ts`
- [ ] Implement GET endpoint with filtering
- [ ] Implement POST endpoint for saving
- [ ] Create `apps/web/app/api/teacher/attendance/[classId]/route.ts`
- [ ] Create `apps/web/lib/services/attendance-service.ts`
- [ ] Add TypeScript types for all functions
- [ ] Add error handling for all API routes
- [ ] Test query functions with real data

## Success Criteria

- [ ] Can fetch attendance by class/date/period
- [ ] Can save attendance records in bulk
- [ ] Can calculate attendance statistics
- [ ] Can query approved leave requests
- [ ] API routes handle errors gracefully
- [ ] TypeScript types are correct
- [ ] Queries use proper indexes for performance

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Query performance issues | Medium | Add database indexes on (class_id, date, period_id) |
| Bulk insert failures | Medium | Implement transaction rollback |
| Type mismatches | Low | Strict TypeScript types |

## Security Considerations

- Verify RLS policies for teacher role
- Validate all input parameters
- Sanitize user-provided notes
- Audit trail via `recorded_by` field

## Next Steps

After completing this phase:
1. Move to [phase-02-teacher-assignment.md](phase-02-teacher-assignment.md)
2. Test queries with real attendance data
3. Verify RLS policies work correctly

## Unresolved Questions

1. Should we use server-side Supabase client or service role?
2. How to handle concurrent attendance edits?
3. What's the max batch size for bulk operations?
