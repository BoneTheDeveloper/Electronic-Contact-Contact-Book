# Phase 04: Notification Integration

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01, Phase 02, Phase 03

## Context

Links: [plan.md](plan.md)

## Overview

Implement parent notifications when students are marked absent or late. Integrates with the existing notification system to send alerts via WebSocket and email to guardians of absent/late students.

## Key Insights

1. Notification system already exists (from research)
2. Use `createNotification()` function from notification service
3. Need to query guardians for absent/late students
4. Support multiple guardians per student
5. Batch notifications for efficiency
6. Different priority for absent vs late

## Requirements

### Functional Requirements
- [ ] Query guardians for absent/late students
- [ ] Create attendance notifications for each parent
- [ ] Send notifications via WebSocket
- [ ] Send notifications via email (placeholder)
- [ ] Batch notifications for students with same guardians
- [ ] Handle notification failures gracefully
- [ ] Track notification delivery status
- [ ] Support Vietnamese language messages

### Technical Requirements
- Use existing notification service
- Query `student_guardians` and `parents` tables
- Handle multiple guardians per student
- Use notification logs for delivery tracking
- Retry failed notifications

## Architecture

```
apps/web/
├── lib/
│   └── services/
│       └── attendance-notification-service.ts   # Notification logic
├── app/
│   └── api/
│       └── teacher/
│           └── attendance/
│               └── [classId]/
│                   └── confirm/
│                       └── route.ts             # Confirm + notify
```

## Related Code Files

- `apps/web/lib/services/notification-service.ts` - Existing notification functions
- `plans/reports/researcher-260125-0045-notification-system-research.md` - Notification research
- `apps/web/app/api/notifications/route.ts` - Notification API

## Database Schema

### student_guardians
```sql
student_guardians (
  student_id UUID REFERENCES students(id),
  guardian_id UUID REFERENCES parents(id),
  is_primary BOOLEAN DEFAULT false,
  relationship TEXT
)
```

### notifications
```sql
notifications (
  id UUID,
  sender_id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  priority TEXT,
  related_type TEXT,
  related_id TEXT,
  created_at TIMESTAMPTZ
)
```

### notification_recipients
```sql
notification_recipients (
  id UUID,
  notification_id UUID REFERENCES notifications(id),
  recipient_id UUID REFERENCES profiles(id),
  role TEXT,
  created_at TIMESTAMPTZ
)
```

## Implementation Steps

### 1. Create Attendance Notification Service

**File:** `apps/web/lib/services/attendance-notification-service.ts`

```typescript
import { SupabaseClient } from '@supabase/supabase-js'

interface AbsentStudent {
  studentId: string
  studentName: string
  studentCode: string
  status: 'absent' | 'late'
  notes?: string
}

interface Guardian {
  id: string
  fullName: string
  email: string
  phone: string
  isPrimary: boolean
}

interface NotificationResult {
  success: boolean
  notificationId?: string
  recipientsCount: number
  errors?: string[]
}

export class AttendanceNotificationService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Send attendance notifications to guardians of absent/late students
   */
  async sendAttendanceNotifications(
    absentStudents: AbsentStudent[],
    classId: string,
    className: string,
    date: string,
    senderId: string
  ): Promise<NotificationResult> {
    if (absentStudents.length === 0) {
      return {
        success: true,
        recipientsCount: 0,
      }
    }

    try {
      // Get all unique guardians for absent students
      const guardiansMap = await this.getGuardiansForStudents(absentStudents)

      // Group students by guardian for batched notifications
      const notifications: Array<{
        guardianId: string
        students: AbsentStudent[]
        guardian: Guardian
      }> = []

      guardiansMap.forEach((guardian, guardianId) => {
        const students = absentStudents.filter(s =>
          guardian.studentIds.includes(s.studentId)
        )

        notifications.push({
          guardianId,
          students,
          guardian: guardian.guardian,
        })
      })

      // Create notifications
      const results = await Promise.allSettled(
        notifications.map(n =>
          this.createGuardianNotification(
            n.guardian,
            n.students,
            className,
            date,
            senderId
          )
        )
      )

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => r.reason)

      return {
        success: errors.length === 0,
        recipientsCount: notifications.length,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (error) {
      console.error('Error sending attendance notifications:', error)
      return {
        success: false,
        recipientsCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }

  /**
   * Get guardians for a list of students
   */
  private async getGuardiansForStudents(
    students: AbsentStudent[]
  ): Promise<Map<string, { guardian: Guardian; studentIds: string[] }>> {
    const studentIds = students.map(s => s.studentId)

    const { data, error } = await this.supabase
      .from('student_guardians')
      .select(`
        guardian_id,
        is_primary,
        parents!inner (
          id,
          full_name,
          email,
          phone
        )
      `)
      .in('student_id', studentIds)

    if (error) throw error

    // Group by guardian
    const guardiansMap = new Map<string, { guardian: Guardian; studentIds: string[] }>()

    data?.forEach(({ guardian_id, is_primary, parents }) => {
      if (!guardiansMap.has(guardian_id)) {
        guardiansMap.set(guardian_id, {
          guardian: {
            id: parents.id,
            fullName: parents.full_name,
            email: parents.email,
            phone: parents.phone,
            isPrimary: is_primary,
          },
          studentIds: [],
        })
      }

      // We'll need to query which student this guardian is linked to
      // For now, add all students (will be filtered below)
    })

    // Now get which students belong to which guardians
    const { data: guardianStudents, error: gsError } = await this.supabase
      .from('student_guardians')
      .select('guardian_id, student_id')
      .in('student_id', studentIds)

    if (gsError) throw gsError

    guardianStudents?.forEach(({ guardian_id, student_id }) => {
      const entry = guardiansMap.get(guardian_id)
      if (entry && !entry.studentIds.includes(student_id)) {
        entry.studentIds.push(student_id)
      }
    })

    return guardiansMap
  }

  /**
   * Create notification for a single guardian
   */
  private async createGuardianNotification(
    guardian: Guardian,
    students: AbsentStudent[],
    className: string,
    date: string,
    senderId: string
  ): Promise<string> {
    // Determine notification content based on student statuses
    const absentStudents = students.filter(s => s.status === 'absent')
    const lateStudents = students.filter(s => s.status === 'late')

    const hasAbsent = absentStudents.length > 0
    const hasLate = lateStudents.length > 0

    // Build student list text
    const studentNames = students.map(s => s.studentName).join(', ')
    const studentDetails = students.map(s => {
      const statusText = s.status === 'absent' ? 'vắng mặt' : 'đi muộn'
      return `${s.studentName} (${statusText})`
    }).join(', ')

    // Create title and content
    let title: string
    let content: string
    let priority: 'normal' | 'high' | 'emergency'

    if (hasAbsent && hasLate) {
      title = `Thông báo điểm danh: ${studentNames}`
      content = `Con quý vị (${studentDetails}) trong lớp ${className} ngày ${date} đã vắng mặt hoặc đi muộn. Vui lòng liên hệ với giáo viên nếu cần thêm thông tin.`
      priority = 'high'
    } else if (hasAbsent) {
      title = `Thông báo vắng mặt: ${studentNames}`
      content = `Con quý vị (${studentNames}) trong lớp ${className} đã vắng mặt vào ngày ${date}. Nếu con có đơn nghỉ phép được duyệt, vui lòng bỏ qua thông báo này.`
      priority = 'high'
    } else {
      title = `Thông báo đi muộn: ${studentNames}`
      content = `Con quý vị (${studentNames}) trong lớp ${className} đã đi muộn vào ngày ${date}.`
      priority = 'normal'
    }

    // Use existing notification service
    const { createNotification } = await import('./notification-service')

    const notification = await createNotification(
      {
        title,
        content,
        category: 'emergency', // Attendance alerts are urgent
        priority,
        targetRole: 'parent',
        targetUserIds: [guardian.id],
        relatedType: 'attendance',
        relatedId: `${className}_${date}`,
      },
      senderId
    )

    return notification.id
  }

  /**
   * Get notification delivery status
   */
  async getNotificationStatus(
    notificationId: string
  ): Promise<Array<{
    channel: string
    status: string
    sentAt?: string
    errorMessage?: string
  }>> {
    const { data, error } = await this.supabase
      .from('notification_logs')
      .select('*')
      .eq('notification_id', notificationId)

    if (error) throw error

    return data?.map(log => ({
      channel: log.channel,
      status: log.status,
      sentAt: log.sent_at,
      errorMessage: log.error_message,
    })) || []
  }
}
```

### 2. Create Confirm API Route

**File:** `apps/web/app/api/teacher/attendance/[classId]/confirm/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AttendanceNotificationService } from '@/lib/services/attendance-notification-service'

interface ConfirmRequest {
  classId: string
  className: string
  date: string
  periodId?: number
  records: Array<{
    studentId: string
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
  }>
  teacherId: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json() as ConfirmRequest

  const { classId, className, date, periodId, records, teacherId } = body

  if (!records || !Array.isArray(records)) {
    return NextResponse.json({
      success: false,
      message: 'Invalid records data'
    }, { status: 400 })
  }

  try {
    // 1. Save attendance records
    const { saveAttendanceRecords } = await import('@/lib/supabase/queries/attendance')

    await saveAttendanceRecords(
      supabase,
      records.map(r => ({
        student_id: r.studentId,
        class_id: classId,
        date,
        period_id: periodId || null,
        status: r.status,
        notes: r.notes || null,
        recorded_by: teacherId
      }))
    )

    // 2. Identify absent/late students for notifications
    const absentStudents = records
      .filter(r => r.status === 'absent' || r.status === 'late')
      .map(r => ({
        studentId: r.studentId,
        status: r.status,
      }))

    // 3. Get student details for notifications
    if (absentStudents.length > 0) {
      const studentIds = absentStudents.map(s => s.studentId)

      const { data: students } = await supabase
        .from('students')
        .select('id, student_code, full_name')
        .in('id', studentIds)

      const studentsWithDetails = absentStudents.map(as => {
        const student = students?.find(s => s.id === as.studentId)
        return {
          ...as,
          studentName: student?.full_name || 'Unknown',
          studentCode: student?.student_code || '',
        }
      })

      // 4. Send notifications to guardians
      const notificationService = new AttendanceNotificationService(supabase)

      const result = await notificationService.sendAttendanceNotifications(
        studentsWithDetails,
        classId,
        className,
        date,
        teacherId
      )

      if (!result.success) {
        console.error('Notification errors:', result.errors)
        // Still return success for attendance, but log notification issues
      }
    }

    return NextResponse.json({
      success: true,
      message: absentStudents.length > 0
        ? `Đã xác nhận điểm danh và gửi thông báo đến phụ huynh`
        : 'Đã xác nhận điểm danh',
      notifiedCount: absentStudents.length,
    })
  } catch (error) {
    console.error('Error confirming attendance:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to confirm attendance'
    }, { status: 500 })
  }
}
```

### 3. Update Attendance Form to Use Confirm API

**File:** `apps/web/app/teacher/attendance/[classId]/components/AttendanceForm.tsx` (partial update)

```typescript
// Update the handleConfirm function
const handleConfirm = async () => {
  const absentCount = Array.from(attendance.values()).filter(
    (r) => r.status === 'absent' || r.status === 'late'
  ).length

  const confirmMessage = absentCount > 0
    ? `Xác nhận hoàn thành điểm danh? Hành động này sẽ gửi thông báo đến phụ huynh của ${absentCount} học sinh vắng/muộn.`
    : 'Xác nhận hoàn thành điểm danh?'

  if (!confirm(confirmMessage)) {
    return
  }

  setIsSaving(true)
  try {
    const response = await fetch(`/api/teacher/attendance/${classId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId,
        className,
        date: selectedDate,
        periodId: selectedPeriod ? parseInt(selectedPeriod) : null,
        records: Array.from(attendance.values()),
        teacherId: 'current-teacher-id', // TODO: from auth
      }),
    })

    const result = await response.json()

    if (result.success) {
      setHasChanges(false)
      alert(result.message)
    } else {
      alert('Xác nhận thất bại: ' + result.message)
    }
  } catch (error) {
    alert('Xác nhận thất bại')
  } finally {
    setIsSaving(false)
  }
}
```

## Todo List

- [ ] Create AttendanceNotificationService class
- [ ] Implement getGuardiansForStudents method
- [ ] Implement createGuardianNotification method
- [ ] Implement sendAttendanceNotifications method
- [ ] Create confirm API route
- [ ] Update AttendanceForm to use confirm API
- [ ] Add loading state for notifications
- [ ] Test notification delivery to parents
- [ ] Test with multiple guardians per student
- [ ] Test notification failure handling
- [ ] Verify Vietnamese language messages
- [ ] Add notification status tracking UI

## Success Criteria

- [ ] Parents receive notifications for absent students
- [ ] Parents receive notifications for late students
- [ ] Notifications include student name, class, date
- [ ] Multiple guardians per student handled correctly
- [ ] Notification delivery status tracked
- [ ] Failed notifications logged
- [ ] Vietnamese messages are natural and clear
- [ ] High priority for absent, normal for late

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Notification service unavailable | Medium | Log attendance as confirmed, retry notifications |
| Invalid guardian email/phone | Low | Skip delivery, log error |
| Duplicate notifications | Medium | Deduplicate by guardian within time window |
| Message localization issues | Low | Use consistent Vietnamese templates |

## Security Considerations

- Verify teacher permissions before sending notifications
- Don't expose guardian contact info in error messages
- Audit all notifications sent
- Rate limit notification creation

## Testing Scenarios

1. Single student absent, one guardian
2. Multiple students absent, same guardian (siblings)
3. Student absent, multiple guardians (mother + father)
4. Student late (lower priority notification)
5. Mix of absent and late students
6. Notification delivery failure
7. Guardian with invalid email

## Next Steps

After completing this phase:
1. Move to [phase-05-testing.md](phase-05-testing.md)
2. Test notification flow end-to-end
3. Verify message clarity and tone

## Unresolved Questions

1. Should notifications be sent immediately or batched at end of day?
2. How to handle students with excused absences (approved leave)?
3. What if guardian has opted out of notifications?
4. Should we include teacher contact info in notification?
5. How to handle notification retries for failed deliveries?
