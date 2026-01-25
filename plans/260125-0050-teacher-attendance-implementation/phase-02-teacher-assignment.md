# Phase 02: Teacher Assignment Logic

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md)

## Overview

Implement logic to determine which classes a teacher can access based on their role (homeroom GVCN vs subject teacher GVBM). This ensures teachers only see and manage attendance for classes they are authorized to teach.

## Key Insights

1. Teachers have two types of class assignments: homeroom (via `class_teachers`) and subject (via `schedules`)
2. Homeroom teachers can mark full-day attendance
3. Subject teachers can only mark attendance for their specific periods
4. Need to merge both assignment types into single class list
5. Must respect RLS policies for data access

## Requirements

### Functional Requirements
- [ ] Query teacher's homeroom class assignments
- [ ] Query teacher's subject class assignments via schedule
- [ ] Merge both assignment types into unified list
- [ ] Mark which classes are homeroom vs subject
- [ ] Filter accessible periods for subject teachers
- [ ] Add authentication-based teacher ID resolution

### Technical Requirements
- Join multiple tables (class_teachers, schedules, classes, periods, subjects)
- Deduplicate classes (teacher may be both GVCN and GVBM for same class)
- Cache results for performance
- Handle teachers with no assignments

## Architecture

```
apps/web/
├── lib/
│   └── supabase/
│       └── queries/
│           └── teachers.ts              # Teacher assignment queries
└── types.ts                             # Add TeacherClass type
```

## Related Code Files

- `apps/web/app/teacher/attendance/page.tsx` - Uses `getTeacherClasses()`
- `apps/web/lib/supabase/queries/` - New file for teacher queries

## Database Schema

### class_teachers (Homeroom Assignments)
```sql
class_teachers (
  id UUID,
  class_id TEXT REFERENCES classes(id),
  teacher_id UUID REFERENCES teachers(id),
  academic_year TEXT,
  semester INTEGER,
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(class_id, academic_year, semester)
)
```

### schedules (Subject Teacher Assignments)
```sql
schedules (
  id UUID,
  class_id TEXT REFERENCES classes(id),
  teacher_id UUID REFERENCES teachers(id),
  subject_id UUID REFERENCES subjects(id),
  period_id INTEGER REFERENCES periods(id),
  day_of_week INTEGER,
  semester INTEGER,
  academic_year TEXT
)
```

## Implementation Steps

### 1. Create Teacher Query Functions

**File:** `apps/web/lib/supabase/queries/teachers.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'

export interface TeacherClass {
  id: string
  name: string
  grade: string
  room: string
  studentCount: number
  subject?: string              // For subject teachers
  periodId?: number              // For subject teachers (period-specific)
  schedule?: string              // Display schedule info
  isHomeroom: boolean            // True if GVCN
  isSubject: boolean             // True if GVBM
}

// Get all classes a teacher can access (homeroom + subject)
export const getTeacherClasses = cache(async (
  supabase: SupabaseClient,
  teacherId: string,
  academicYear?: string
): Promise<TeacherClass[]> => {
  const currentYear = academicYear || new Date().getFullYear().toString()

  // Get homeroom classes
  const { data: homeroomClasses, error: homeroomError } = await supabase
    .from('class_teachers')
    .select(`
      class_id,
      is_primary,
      classes!inner (
        id,
        name,
        grade,
        room,
        current_students
      )
    `)
    .eq('teacher_id', teacherId)
    .eq('academic_year', currentYear)

  if (homeroomError) throw homeroomError

  // Get subject classes from schedule
  const { data: subjectClasses, error: subjectError } = await supabase
    .from('schedules')
    .select(`
      class_id,
      subject_id,
      period_id,
      day_of_week,
      classes!inner (
        id,
        name,
        grade,
        room,
        current_students
      ),
      subjects!inner (
        id,
        name
      )
    `)
    .eq('teacher_id', teacherId)
    .eq('academic_year', currentYear)

  if (subjectError) throw subjectError

  // Merge results
  const classMap = new Map<string, TeacherClass>()

  // Add homeroom classes
  homeroomClasses?.forEach(({ class_id, is_primary, classes }) => {
    classMap.set(class_id, {
      id: classes.id,
      name: classes.name,
      grade: classes.grade,
      room: classes.room,
      studentCount: classes.current_students || 0,
      isHomeroom: true,
      isSubject: false
    })
  })

  // Add or merge subject classes
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  subjectClasses?.forEach(({ class_id, subject_id, period_id, day_of_week, classes, subjects }) => {
    const existing = classMap.get(class_id)

    if (existing) {
      // Teacher is both homeroom and subject teacher
      existing.isSubject = true
      existing.subject = subjects.name
      existing.periodId = period_id
      existing.schedule = `${dayNames[day_of_week]} - Tiết ${period_id}`
    } else {
      // Subject teacher only
      classMap.set(class_id, {
        id: classes.id,
        name: classes.name,
        grade: classes.grade,
        room: classes.room,
        studentCount: classes.current_students || 0,
        subject: subjects.name,
        periodId: period_id,
        schedule: `${dayNames[day_of_week]} - Tiết ${period_id}`,
        isHomeroom: false,
        isSubject: true
      })
    }
  })

  return Array.from(classMap.values())
})

// Check if teacher is homeroom for a specific class
export const isHomeroomTeacher = cache(async (
  supabase: SupabaseClient,
  teacherId: string,
  classId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('class_teachers')
    .select('id')
    .eq('teacher_id', teacherId)
    .eq('class_id', classId)
    .single()

  if (error || !data) return false
  return true
})

// Get periods teacher teaches for a specific class
export const getTeacherPeriodsForClass = cache(async (
  supabase: SupabaseClient,
  teacherId: string,
  classId: string,
  dayOfWeek?: number
): Promise<number[]> => {
  let query = supabase
    .from('schedules')
    .select('period_id')
    .eq('teacher_id', teacherId)
    .eq('class_id', classId)

  if (dayOfWeek !== undefined) {
    query = query.eq('day_of_week', dayOfWeek)
  }

  const { data, error } = await query

  if (error) throw error
  return [...new Set(data?.map(d => d.period_id) || [])]
})

// Get all periods for attendance UI
export const getPeriods = cache(async (
  supabase: SupabaseClient
): Promise<Array<{ id: number; name: string; startTime: string; endTime: string }>> => {
  const { data, error } = await supabase
    .from('periods')
    .select('*')
    .order('id')

  if (error) throw error
  return data || []
})
```

### 2. Update Types

**File:** `apps/web/lib/types.ts` (add to existing types)

```typescript
// Add to existing types file

export interface TeacherClass {
  id: string
  name: string
  grade: string
  room: string
  studentCount: number
  subject?: string
  periodId?: number
  schedule?: string
  isHomeroom: boolean
  isSubject: boolean
}

export interface Period {
  id: number
  name: string
  startTime: string
  endTime: string
}
```

### 3. Update Attendance Page

**File:** `apps/web/app/teacher/attendance/page.tsx` (modify existing)

```typescript
import { createClient } from '@/lib/supabase/server'
import { getTeacherClasses } from '@/lib/supabase/queries/teachers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AttendanceListPage() {
  const supabase = await createClient()

  // TODO: Get real teacher ID from auth session
  // For now, use a placeholder or get from session
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please login</div>
  }

  // Get teacher profile ID from user metadata
  const teacherId = user.user_metadata.teacher_id || user.id

  const classes = await getTeacherClasses(supabase, teacherId)

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
        <p className="text-gray-500">Chọn lớp để điểm danh</p>
      </div>

      {/* Classes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Link key={cls.id} href={`/teacher/attendance/${cls.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{cls.name}</CardTitle>
                    {cls.subject && (
                      <p className="text-sm text-gray-600">Môn: {cls.subject}</p>
                    )}
                  </div>
                  {cls.isHomeroom && (
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                      Chủ nhiệm
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{cls.studentCount} học sinh</span>
                  </div>
                  {cls.schedule && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{cls.schedule}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Phòng {cls.room}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Bạn chưa được phân công lớp học nào</p>
        </div>
      )}
    </div>
  )
}
```

## Todo List

- [ ] Create `apps/web/lib/supabase/queries/teachers.ts`
- [ ] Implement `getTeacherClasses()` with homeroom + subject merge
- [ ] Implement `isHomeroomTeacher()` helper
- [ ] Implement `getTeacherPeriodsForClass()` helper
- [ ] Implement `getPeriods()` for period list
- [ ] Add TeacherClass type to `types.ts`
- [ ] Update `apps/web/app/teacher/attendance/page.tsx` to use real queries
- [ ] Add auth session integration for teacher ID
- [ ] Test with homeroom teacher account
- [ ] Test with subject teacher account
- [ ] Test with teacher who is both homeroom and subject
- [ ] Verify RLS policies work correctly

## Success Criteria

- [ ] Homeroom teachers see their assigned classes
- [ ] Subject teachers see classes they teach
- [ ] Teachers with both roles see all classes
- [ ] Classes show correct homeroom/subject badges
- [ ] Period filtering works for subject teachers
- [ ] Auth session correctly identifies teacher
- [ ] RLS policies prevent unauthorized access

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Query returns duplicate classes | Medium | Use Map to deduplicate by class_id |
| Missing academic_year data | Low | Default to current year |
| Auth session not available | High | Add fallback/error handling |
| Performance with many classes | Low | Add caching with React.cache |

## Security Considerations

- Verify teacher_id from auth session (not from URL)
- Check RLS policies for class_teachers and schedules
- Prevent teachers from accessing other teachers' classes
- Audit all attendance operations with recorded_by

## Next Steps

After completing this phase:
1. Move to [phase-03-attendance-ui.md](phase-03-attendance-ui.md)
2. Test with different teacher roles
3. Verify class filtering works correctly

## Unresolved Questions

1. What to display if teacher has both roles for same class?
2. How to handle teachers with no classes assigned?
3. Should we show past/future scheduled classes?
4. How to determine current academic year programmatically?
