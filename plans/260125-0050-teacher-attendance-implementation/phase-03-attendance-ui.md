# Phase 03: Attendance Form UI

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01, Phase 02

## Context

Links: [plan.md](plan.md)

## Overview

Update the attendance form UI to use real database queries instead of mock data. Implement period selection, leave request auto-fill, real-time statistics, and proper save/confirm functionality matching the wireframe design.

## Key Insights

1. Wireframe shows clean table with status buttons (P, A, L, E)
2. Need period selection for subject teachers
3. Leave request auto-fill button required
4. Real-time stats update as statuses change
5. Save draft vs confirm final attendance
6. Match existing design language from wireframe

## Requirements

### Functional Requirements
- [ ] Load students from database for selected class
- [ ] Show period selector (for subject teachers) or session selector (morning/afternoon)
- [ ] Display existing attendance if already recorded
- [ ] Implement status button selection (P/A/L/E)
- [ ] Add auto-fill button for approved leave requests
- [ ] Implement save draft functionality
- [ ] Implement confirm attendance with notifications
- [ ] Real-time statistics updates
- [ ] Show notes input for each student
- [ ] Handle loading and error states

### Technical Requirements
- Use Server Components for initial data load
- Client Components for interactive form
- Optimistic UI updates for better UX
- Proper error handling and validation
- Match wireframe design exactly

## Architecture

```
apps/web/
├── app/
│   └── teacher/
│       └── attendance/
│           └── [classId]/
│               ├── page.tsx           # Server component (main)
│               └── components/
│                   ├── AttendanceForm.tsx        # Client form
│                   ├── StudentRow.tsx            # Student row component
│                   ├── StatusButton.tsx         # P/A/L/E button
│                   └── AttendanceStats.tsx      # Stats display
└── components/
    └── ui/                           # shadcn components
```

## Related Code Files

- `docs/wireframe/Web_app/Teacher/attendance.html` - Design reference
- `apps/web/app/teacher/attendance/[classId]/page.tsx` - Update with real data
- `apps/web/lib/supabase/queries/attendance.ts` - Use Phase 01 queries

## Wireframe Design Reference

From `attendance.html`:
- Status buttons: P (green), A (red), L (yellow), E (blue)
- Selected state: border + scale + shadow
- Stats footer: total students, present, absent count
- Action buttons: "Mark all present", "Auto-fill excused"
- Save draft vs confirm final buttons

## Implementation Steps

### 1. Create Attendance Form Client Component

**File:** `apps/web/app/teacher/attendance/[classId]/components/AttendanceForm.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StudentRow from './StudentRow'
import AttendanceStats from './AttendanceStats'

interface Student {
  id: string
  student_code: string
  full_name: string
  approved_leave?: boolean
}

interface AttendanceRecord {
  student_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

interface AttendanceFormProps {
  classId: string
  className: string
  students: Student[]
  existingAttendance?: Map<string, AttendanceRecord>
  isHomeroom: boolean
  availablePeriods?: Array<{ id: number; name: string }>
  onSave: (data: AttendanceRecord[]) => Promise<void>
  onConfirm: (data: AttendanceRecord[]) => Promise<void>
}

export default function AttendanceForm({
  classId,
  className,
  students,
  existingAttendance = new Map(),
  isHomeroom,
  availablePeriods,
  onSave,
  onConfirm,
}: AttendanceFormProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [session, setSession] = useState<'morning' | 'afternoon'>(
    new Date().getHours() < 12 ? 'morning' : 'afternoon'
  )
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(
    existingAttendance
  )
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Update stats
  const stats = {
    total: students.length,
    present: Array.from(attendance.values()).filter(
      (r) => r.status === 'present'
    ).length,
    absent: Array.from(attendance.values()).filter(
      (r) => r.status === 'absent' || r.status === 'late'
    ).length,
    late: Array.from(attendance.values()).filter(
      (r) => r.status === 'late'
    ).length,
    excused: Array.from(attendance.values()).filter(
      (r) => r.status === 'excused'
    ).length,
  }

  const allMarked = attendance.size === students.length

  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    setAttendance((prev) => {
      const newMap = new Map(prev)
      const existing = newMap.get(studentId)
      newMap.set(studentId, {
        ...existing,
        student_id: studentId,
        status,
      })
      return newMap
    })
    setHasChanges(true)
  }

  const handleNoteChange = (studentId: string, notes: string) => {
    setAttendance((prev) => {
      const newMap = new Map(prev)
      const existing = newMap.get(studentId)
      newMap.set(studentId, {
        ...existing,
        student_id: studentId,
        notes,
      })
      return newMap
    })
    setHasChanges(true)
  }

  const markAllPresent = () => {
    students.forEach((student) => {
      setAttendance((prev) => {
        const newMap = new Map(prev)
        newMap.set(student.id, {
          student_id: student.id,
          status: 'present',
          notes: null,
        })
        return newMap
      })
    })
    setHasChanges(true)
  }

  const autoFillExcused = () => {
    let count = 0
    students.forEach((student) => {
      if (student.approved_leave) {
        setAttendance((prev) => {
          const newMap = new Map(prev)
          newMap.set(student.id, {
            student_id: student.id,
            status: 'excused',
            notes: 'Đơn nghỉ phép đã duyệt',
          })
          return newMap
        })
        count++
      }
    })
    setHasChanges(true)
    alert(`Đã tự động điền ${count} học sinh có đơn nghỉ phép`)
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      await onSave(Array.from(attendance.values()))
      setHasChanges(false)
      alert('Đã lưu nháp thành công')
    } catch (error) {
      alert('Lưu nháp thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirm = async () => {
    if (!confirm('Xác nhận hoàn thành điểm danh? Hành động này sẽ gửi thông báo đến phụ huynh của học sinh vắng mặt.')) {
      return
    }

    setIsSaving(true)
    try {
      await onConfirm(Array.from(attendance.values()))
      setHasChanges(false)
      alert('Đã xác nhận hoàn thành điểm danh')
    } catch (error) {
      alert('Xác nhận thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Ngày điểm danh
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Period (for subject teachers) or Session (for homeroom) */}
            {!isHomeroom && availablePeriods && availablePeriods.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tiết học
                </label>
                <Select
                  value={selectedPeriod || ''}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tiết" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePeriods.map((period) => (
                      <SelectItem key={period.id} value={period.id.toString()}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Buổi
                </label>
                <Select
                  value={session}
                  onValueChange={(v: 'morning' | 'afternoon') => setSession(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Buổi Sáng</SelectItem>
                    <SelectItem value="afternoon">Buổi Chiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách học sinh</CardTitle>
              <AttendanceStats stats={stats} />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={markAllPresent}
                variant="outline"
                size="sm"
              >
                Đánh dấu tất cả có mặt
              </Button>
              <Button
                onClick={autoFillExcused}
                variant="outline"
                size="sm"
              >
                Tự động điền đơn nghỉ phép
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Status Legend */}
          <div className="flex items-center gap-6 text-sm mb-4 px-2">
            <span className="font-semibold text-gray-400 uppercase text-xs">
              Chú thích:
            </span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                P
              </span>
              <span className="text-gray-600">Có mặt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                A
              </span>
              <span className="text-gray-600">Vắng không phép</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">
                L
              </span>
              <span className="text-gray-600">Muộn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                E
              </span>
              <span className="text-gray-600">Vắng có phép</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    STT
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Họ và tên
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase w-48">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, index) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    index={index}
                    attendance={attendance.get(student.id)}
                    onStatusChange={handleStatusChange}
                    onNoteChange={handleNoteChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            onClick={handleSaveDraft}
            variant="outline"
            disabled={!hasChanges || isSaving}
          >
            Lưu nháp
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allMarked || isSaving}
            className="bg-sky-600 hover:bg-sky-700"
          >
            Xác nhận hoàn thành
          </Button>
        </div>
        {hasChanges && (
          <span className="text-sm text-gray-500">
            Có thay đổi chưa lưu
          </span>
        )}
      </div>
    </div>
  )
}
```

### 2. Create Student Row Component

**File:** `apps/web/app/teacher/attendance/[classId]/components/StudentRow.tsx`

```typescript
'use client'

import StatusButton from './StatusButton'

interface Student {
  id: string
  student_code: string
  full_name: string
  approved_leave?: boolean
}

interface AttendanceRecord {
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

interface StudentRowProps {
  student: Student
  index: number
  attendance?: AttendanceRecord
  onStatusChange: (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => void
  onNoteChange: (studentId: string, notes: string) => void
}

export default function StudentRow({
  student,
  index,
  attendance,
  onStatusChange,
  onNoteChange,
}: StudentRowProps) {
  const initials = student.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg font-semibold text-gray-600 text-sm">
          {index + 1}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {student.full_name}
            </p>
            <p className="text-xs text-gray-400">{student.student_code}</p>
            {student.approved_leave && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded">
                Đã duyệt đơn nghỉ
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <StatusButton
            status="present"
            selected={attendance?.status === 'present'}
            onClick={() => onStatusChange(student.id, 'present')}
          />
          <StatusButton
            status="absent"
            selected={attendance?.status === 'absent'}
            onClick={() => onStatusChange(student.id, 'absent')}
          />
          <StatusButton
            status="late"
            selected={attendance?.status === 'late'}
            onClick={() => onStatusChange(student.id, 'late')}
          />
          <StatusButton
            status="excused"
            selected={attendance?.status === 'excused'}
            onClick={() => onStatusChange(student.id, 'excused')}
          />
        </div>
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={attendance?.notes || ''}
          onChange={(e) => onNoteChange(student.id, e.target.value)}
          placeholder="Ghi chú..."
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-100 outline-none"
        />
      </td>
    </tr>
  )
}
```

### 3. Create Status Button Component

**File:** `apps/web/app/teacher/attendance/[classId]/components/StatusButton.tsx`

```typescript
'use client'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

interface StatusButtonProps {
  status: AttendanceStatus
  selected: boolean
  onClick: () => void
}

const statusConfig = {
  present: {
    label: 'P',
    baseClass: 'bg-green-100 text-green-700 hover:bg-green-200',
    selectedClass: 'bg-green-700 text-white',
  },
  absent: {
    label: 'A',
    baseClass: 'bg-red-100 text-red-700 hover:bg-red-200',
    selectedClass: 'bg-red-700 text-white',
  },
  late: {
    label: 'L',
    baseClass: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    selectedClass: 'bg-yellow-700 text-white',
  },
  excused: {
    label: 'E',
    baseClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    selectedClass: 'bg-blue-700 text-white',
  },
}

export default function StatusButton({
  status,
  selected,
  onClick,
}: StatusButtonProps) {
  const config = statusConfig[status]

  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 rounded-lg font-semibold text-sm
        transition-all duration-200
        ${selected ? config.selectedClass : config.baseClass}
        ${selected ? 'scale-110 shadow-lg ring-2 ring-offset-2 ring-sky-300' : 'hover:scale-105'}
      `}
    >
      {config.label}
    </button>
  )
}
```

### 4. Create Stats Component

**File:** `apps/web/app/teacher/attendance/[classId]/components/AttendanceStats.tsx`

```typescript
interface AttendanceStatsProps {
  stats: {
    total: number
    present: number
    absent: number
    late: number
    excused: number
  }
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-1">
      <span className="text-gray-700">{stats.total}</span> học sinh •{' '}
      <span className="text-green-600">{stats.present}</span> có mặt •{' '}
      <span className="text-red-600">{stats.absent}</span> vắng
    </p>
  )
}
```

### 5. Update Main Page

**File:** `apps/web/app/teacher/attendance/[classId]/page.tsx`

```typescript
import { createClient } from '@/lib/supabase/server'
import { getClassStudents, getApprovedLeaveRequests } from '@/lib/supabase/queries/attendance'
import { isHomeroomTeacher, getPeriods } from '@/lib/supabase/queries/teachers'
import AttendanceForm from './components/AttendanceForm'

interface PageProps {
  params: {
    classId: string
  }
  searchParams: {
    date?: string
    periodId?: string
  }
}

export default async function AttendancePage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { classId } = params
  const date = searchParams.date || new Date().toISOString().split('T')[0]

  // Get current user
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please login</div>
  }

  const teacherId = user.user_metadata.teacher_id || user.id

  // Check if homeroom teacher
  const isHomeroom = await isHomeroomTeacher(supabase, teacherId, classId)

  // Get class students
  const students = await getClassStudents(supabase, classId)

  // Get approved leave requests for this date
  const approvedLeaves = await getApprovedLeaveRequests(supabase, classId, date)
  const leaveSet = new Set(approvedLeaves.map(l => l.student_id))

  // Add approved_leave flag to students
  const studentsWithLeave = students.map(s => ({
    ...s,
    approved_leave: leaveSet.has(s.id)
  }))

  // Get periods if subject teacher
  let availablePeriods = null
  if (!isHomeroom) {
    availablePeriods = await getPeriods(supabase)
  }

  // Handler functions
  const handleSave = async (records: any[]) => {
    'use server'
    // Implementation in Phase 04
  }

  const handleConfirm = async (records: any[]) => {
    'use server'
    // Implementation in Phase 04
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
        <p className="text-gray-500">
          {isHomeroom ? 'Giáo viên chủ nhiệm' : 'Giáo viên bộ môn'}
        </p>
      </div>

      <AttendanceForm
        classId={classId}
        className={studentsWithLeave[0]?.class_name || 'Lớp học'}
        students={studentsWithLeave}
        isHomeroom={isHomeroom}
        availablePeriods={availablePeriods || undefined}
        onSave={handleSave}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
```

## Todo List

- [ ] Create AttendanceForm client component
- [ ] Create StudentRow component
- [ ] Create StatusButton component
- [ ] Create AttendanceStats component
- [ ] Update [classId]/page.tsx to load real data
- [ ] Implement getClassStudents query
- [ ] Add period/session selection
- [ ] Implement auto-fill for leave requests
- [ ] Add save draft functionality
- [ ] Add confirm functionality
- [ ] Test with homeroom teacher
- [ ] Test with subject teacher
- [ ] Verify UI matches wireframe

## Success Criteria

- [ ] Students load from database
- [ ] Status buttons work correctly
- [ ] Auto-fill for approved leaves works
- [ ] Real-time stats update
- [ ] Save draft works
- [ ] Confirm works (without notifications yet)
- [ ] UI matches wireframe design
- [ ] Loading states display properly
- [ ] Errors handled gracefully

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex client state management | Medium | Use React hooks properly |
| Performance with many students | Medium | Virtualization for large classes |
| Form state loss on refresh | Low | Add localStorage backup |
| Type mismatches | Low | Strict TypeScript types |

## Design Checklist

From wireframe `attendance.html`:
- [ ] Status button colors (P green, A red, L yellow, E blue)
- [ ] Selected state with border + scale
- [ ] Stats footer (total, present, absent counts)
- [ ] "Mark all present" button
- [ ] "Auto-fill excused" button
- [ ] Save draft button
- [ ] Confirm button (disabled until all marked)
- [ ] Notes input for each student

## Next Steps

After completing this phase:
1. Move to [phase-04-notifications.md](phase-04-notifications.md)
2. Test UI with real teacher accounts
3. Verify period selection works for subject teachers

## Unresolved Questions

1. Should we use virtualization for large classes (>50 students)?
2. How to handle students added/removed during attendance?
3. Should we auto-save to localStorage?
