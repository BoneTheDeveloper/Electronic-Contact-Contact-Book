# Teacher Attendance System Design

## Overview
The teacher attendance system allows teachers (both homeroom and subject teachers) to mark daily student attendance with real-time notifications to parents.

## Database Schema

### Core Tables

#### `attendance` Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  date DATE NOT NULL,
  period_id INT REFERENCES periods(id),
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  recorded_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, date, period_id)
);
```

#### `leave_requests` Table
```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id),
  reason TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `periods` Table
```sql
CREATE TABLE periods (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);
```

### Relationships
- `attendance.student_id` → `students.id`
- `attendance.class_id` → `classes.id`
- `attendance.period_id` → `periods.id`
- `attendance.recorded_by` → `teachers.id`
- `leave_requests.student_id` → `students.id`

## API Endpoints

### GET `/api/teacher/attendance/{classId}`
Get students list with attendance status for a class.

**Query Parameters:**
- `date` (required): ISO date string (YYYY-MM-DD)
- `periodId` (optional): Period number for subject teachers

**Response:**
```typescript
{
  success: boolean,
  data: Array<{
    id: string,
    student_id: string,
    student_code: string,
    full_name: string,
    gender: 'male' | 'female' | null,
    status: 'present' | 'absent' | 'late' | 'excused' | null,
    notes: string | null,
    has_approved_leave: boolean
  }>
}
```

### POST `/api/teacher/attendance`
Save attendance records and send notifications.

**Request Body:**
```typescript
{
  classId: string,
  date: string,
  periodId?: number,
  records: Array<{
    student_id: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    notes?: string
  }>,
  sendNotifications?: boolean
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  stats?: {
    total: number,
    present: number,
    absent: number,
    late: number,
    excused: number
  },
  notificationResult?: {
    success: boolean,
    sent: number,
    failed: number
  }
}
```

### GET `/api/periods`
Get all school periods.

**Response:**
```typescript
{
  success: boolean,
  periods: Array<{
    id: number,
    name: string,
    start_time: string,
    end_time: string
  }>
}
```

## Teacher Permissions

### Homeroom Teachers (GVCN)
- Can mark attendance for entire day (all periods)
- Can mark attendance for specific periods
- Can override any period's attendance

### Subject Teachers (GVBM)
- Can only mark attendance for their assigned periods
- Period assignment verified via `schedules` table
- Cannot mark attendance for other teachers' periods

### Permission Check Logic
```typescript
async function canTeacherTakeAttendance(
  teacherId: string,
  classId: string,
  periodId?: number
): Promise<{ can: boolean; reason?: string }> {
  // Check homeroom status first
  const homeroomCheck = await isHomeroomTeacher(teacherId, classId)
  if (homeroomCheck) return { can: true }

  // For subject teachers, verify schedule
  if (periodId) {
    const dayOfWeek = new Date().getDay()
    const scheduleCheck = await verifySchedule(
      teacherId, classId, periodId, dayOfWeek
    )
    return scheduleCheck ? { can: true } : {
      can: false,
      reason: 'Giáo viên không được phân công dạy tiết này'
    }
  }

  return { can: true } // View-only permission
}
```

## Notification System

### Trigger Conditions
Notifications sent to guardians when:
- Student marked as `absent`
- Student marked as `late`

### Notification Content

#### Absent Notification
```
Title: "Thông báo vắng mặt: [Student Name]"
Content: "Con [Student Name] - Lớp [Class] vắng mặt học ngày [Date].
Phụ huynh vui lòng liên hệ với giáo viên nếu có lý do đã biết."
Priority: high
Category: emergency
```

#### Late Notification
```
Title: "Thông báo đi muộn: [Student Name]"
Content: "Con [Student Name] - Lớp [Class] đi muộn học ngày [Date].
Phụ huynh vui lòng nhắc con đi học đúng giờ."
Priority: normal
Category: reminder
```

### Notification Flow
```
saveAttendanceRecords()
    ↓
getAbsentStudents() // Filter absent/late
    ↓
sendAttendanceNotifications()
    ↓
For each student:
  ├─ Fetch student's guardians (student_guardians)
  ├─ Create notification for each guardian
  └─ Insert into notifications table
```

## UI Components

### AttendanceFormClient
**Location:** `apps/web/components/teacher/AttendanceFormClient.tsx`

**Features:**
- Date picker (max = today)
- Period selector (for subject teachers)
- Status buttons: Present (P), Absent (A), Late (L), Excused (E)
- Auto-fill approved leaves button
- Real-time statistics display
- Notes field for each student

**State Management:**
```typescript
interface Student {
  id: string
  student_id: string
  student_code: string
  full_name: string
  gender: 'male' | 'female' | null
  status: AttendanceStatus | null
  notes: string | null
  has_approved_leave: boolean
}
```

### Auto-Fill Approved Leaves
Students with approved leave requests for selected date:
- Status automatically set to `excused`
- Notes pre-filled with leave reason
- Visual indicator: "Đơn nghỉ phép" badge

## Business Rules

### Attendance Status Rules
1. **Present (P)**: Student attended class on time
2. **Absent (A)**: Student did not attend (triggers notification)
3. **Late (L)**: Student arrived after start time (triggers notification)
4. **Excused (E)**: Absence with approved reason (no notification)

### Same-Day Edit Policy
- Teachers can modify attendance any time on the same day
- Re-saving notifications re-sends to guardians
- After midnight, attendance becomes read-only (admin override required)

### Approved Leave Handling
- Leave requests approved by homeroom teacher
- Auto-fills as `excused` status
- Overrides manual attendance marks
- Leave validity: `start_date <= selected_date <= end_date`

## Statistics Calculation

### Real-Time Stats
```typescript
const stats = {
  total: students.length,
  present: marked.filter(s => s.status === 'present').length,
  absent: marked.filter(s => s.status === 'absent').length,
  late: marked.filter(s => s.status === 'late').length,
  excused: marked.filter(s => s.status === 'excused').length
}
```

## Key Functions Reference

### Query Functions (`apps/web/lib/supabase/queries/attendance.ts`)

```typescript
// Get students for attendance marking
getClassStudentsForAttendance(classId: string, date: string)
  → Promise<StudentForAttendance[]>

// Save attendance records (upsert for idempotency)
saveAttendanceRecords(records: AttendanceInput[])
  → Promise<void>

// Get attendance statistics
getAttendanceStats(classId: string, date: string, periodId?: number)
  → Promise<AttendanceStats>

// Get approved leave requests
getApprovedLeaveRequests(classId: string, date: string)
  → Promise<LeaveRequestInfo[]>

// Get absent/late students for notification
getAbsentStudents(classId: string, date: string, periodId?: number)
  → Promise<Array<{student_id, student_name, status}>>
```

### Service Functions (`apps/web/lib/services/attendance-notification-service.ts`)

```typescript
// Send notifications to guardians
sendAttendanceNotifications(
  classId: string,
  date: string,
  absentStudents: AbsentStudentInfo[],
  periodId?: number
) → Promise<{success: boolean, sent: number, failed: number}>

// Check if notification was already sent
wasNotificationSent(
  studentId: string,
  date: string,
  periodId?: number
) → Promise<boolean>
```

## Mobile App Integration

### Student/Parent View
- View daily attendance status
- Attendance history calendar
- Absent/late notifications
- Leave request submission

### Data Flow
```
Teacher (Web) → Supabase → Realtime → Mobile App (Student/Parent)
```

## Security & RLS

### Row Level Security Policies
```sql
-- Teachers can only mark attendance for their assigned classes
CREATE POLICY teachers_attendance_insert ON attendance
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM class_teachers
      WHERE class_id = NEW.class_id
      AND teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM schedules
      WHERE class_id = NEW.class_id
      AND teacher_id = auth.uid()
    )
  );

-- Teachers can only view their classes' attendance
CREATE POLICY teachers_attendance_select ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_teachers
      WHERE class_id = attendance.class_id
      AND teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM schedules
      WHERE class_id = attendance.class_id
      AND teacher_id = auth.uid()
    )
  );
```

## Error Handling

### Common Errors
| Error | Cause | Resolution |
|-------|-------|------------|
| `class_not_assigned` | Teacher not assigned to class | Check class_teachers or schedules |
| `period_not_assigned` | Subject teacher wrong period | Verify schedule assignment |
| `attendance_locked` | Past date attendance modification | Admin override required |
| `invalid_status` | Invalid attendance status | Must be: present, absent, late, excused |

## Future Enhancements
- [ ] Bulk attendance marking (all present)
- [ ] Attendance pattern detection
- [ ] Automated attendance from classroom devices
- [ ] Parent response to notifications
- [ ] Attendance analytics dashboard
