# Notification System Research Report

## Database Schema

### Notifications Table Structure
- **id**: UUID primary key
- **sender_id**: UUID (admin creating notification)
- **title**: text (required)
- **content**: text (required)
- **category**: 'announcement' | 'emergency' | 'reminder' | 'system'
- **priority**: 'low' | 'normal' | 'high' | 'emergency'
- **scheduled_for**: TIMESTAMPTZ (optional)
- **expires_at**: TIMESTAMPTZ (optional)
- **type**: legacy field ('payment', 'attendance', 'grade', 'announcement', 'reminder', 'alert')
- **related_type**: text (e.g., 'attendance')
- **related_id**: text (reference to attendance record)
- **is_read**: boolean (default false)
- **read_at**: TIMESTAMPTZ
- **created_at**: TIMESTAMPTZ

### Notification Recipients Table
- **id**: UUID primary key
- **notification_id**: UUID (references notifications)
- **recipient_id**: UUID (references profiles)
- **role**: 'admin' | 'teacher' | 'parent' | 'student'
- **created_at**: TIMESTAMPTZ

### Notification Logs Table
- **id**: UUID primary key
- **notification_id**: UUID (references notifications)
- **recipient_id**: UUID (references profiles)
- **channel**: 'websocket' | 'email' | 'in_app' | 'push'
- **status**: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
- **sent_at**: TIMESTAMPTZ
- **delivered_at**: TIMESTAMPTZ
- **failed_at**: TIMESTAMPTZ
- **error_message**: text
- **retry_count**: int (default 0)
- **external_id**: text (email message ID, etc.)
- **created_at**: TIMESTAMPTZ

## Creating Notifications

### Service Function
Use `createNotification()` in `apps/web/lib/services/notification-service.ts`:

```typescript
const notification = await createNotification({
  title: "Student Absence Alert",
  content: "Your child was absent today",
  category: "emergency", // or "announcement"
  priority: "high",
  targetRole: "parent",
  targetGradeIds: [gradeId], // optional
  targetClassIds: [classId], // optional
  targetUserIds: [parentIds], // optional
  scheduledFor: null, // or ISO string
}, adminId);
```

### Database Function Helper
Use `get_notification_recipients` to resolve recipients:
- Filters by role, grade, class, or specific users
- Returns array of user_id and role

## Parent Linking

### Student-Parent Relationships
1. **Single Guardian**: `students.guardian_id → profiles.id`
2. **Multiple Guardians**: `student_guardians` table
   - student_id (references students)
   - guardian_id (references parents)
   - is_primary (boolean)

### Helper Functions
- `get_parent_children()`: Returns student_ids for logged-in parent
- `is_parent()`: Checks if current user is parent

### Query Pattern for Parents of Absent Students
```sql
-- Get all parents of absent students for today
SELECT DISTINCT p.id, p.email, p.full_name, p.phone
FROM profiles p
JOIN student_guardians sg ON p.id = sg.guardian_id
JOIN students s ON sg.student_id = s.id
JOIN attendance a ON s.id = a.student_id
WHERE a.date = CURRENT_DATE
AND a.status = 'absent'
AND sg.is_primary = true;
```

## Attendance Notifications

### Supported Categories
- **Emergency**: For immediate absences (delivers via all channels)
- **Announcement**: For general attendance updates (WebSocket + email)
- **Reminder**: For scheduled reminders (in-app only)

### Priority Levels
- **Emergency**: High priority, immediate delivery
- **High**: Important attendance alerts
- **Normal**: Regular attendance updates
- **Low**: Informational notifications

### Status Values
- **present**
- **absent**
- **late**
- **excused**

## Sending Attendance Notifications

### API Route
Use `POST /api/notifications` with:
```json
{
  "title": "Your Child's Absence Notification",
  "content": "Your child, John Doe, was absent on 2026-01-25",
  "category": "emergency",
  "priority": "high",
  "targetRole": "parent",
  "relatedType": "attendance",
  "relatedId": "attendance-record-uuid"
}
```

### Code Example for Creating Attendance Notification
```typescript
// Get absent students for today
const { data: absentStudents } = await supabase
  .from('attendance')
  .select(`
    student_id,
    students!inner (
      id,
      student_code,
      full_name,
      student_guardians!inner (
        guardian_id,
        parents!inner (
          id,
          email,
          full_name,
          phone
        )
      )
    )
  `)
  .eq('date', new Date().toISOString().split('T')[0])
  .eq('status', 'absent');

// Group by parent
const parentMap = new Map();
absentStudents.forEach(student => {
  student.students.student_guardians.forEach(guardian => {
    if (!guardian.parents) return;

    const parent = guardian.parents;
    if (!parentMap.has(parent.id)) {
      parentMap.set(parent.id, {
        parent,
        students: []
      });
    }
    parentMap.get(parent.id).students.push(student.students);
  });
});

// Create notification for each parent
for (const [parentId, data] of parentMap) {
  const studentList = data.students.map(s => s.full_name).join(', ');

  await createNotification({
    title: `Absence Alert for ${studentList}`,
    content: `Your child/children were absent today: ${studentList}`,
    category: 'emergency',
    priority: 'high',
    targetRole: 'parent',
    targetUserIds: [parentId],
    relatedType: 'attendance',
    relatedId: null
  }, adminId);
}
```

## Existing Utilities

### Helper Functions
- `getNotificationRecipients()`: Database function to resolve recipients
- `getMyNotifications()`: Get notifications for current user
- `markAsRead()`: Mark notifications as read
- `getDeliveryStatus()`: Check notification delivery status

### Delivery Channels
- **WebSocket**: Real-time in-app notifications
- **Email**: External email delivery (placeholder)
- **In-App**: Stored in notifications table

### Notification Types
Already supports attendance-related notifications:
- Attendance type: 'attendance'
- Can be linked to specific attendance records via `related_type` and `related_id`

## Recommendations

1. **Create dedicated attendance notification function** for easier handling
2. **Batch processing** for multiple absent students
3. **Email integration** needs to be implemented for external delivery
4. **Webhook integration** for real-time attendance updates
5. **Scheduling** for delayed notifications (e.g., end of day summaries)

## Unresolved Questions

1. What timezone should be used for attendance dates?
2. Should late notifications have different priority than absent?
3. How to handle multiple guardians for same student?
4. What's the expected volume of daily attendance notifications?
5. Should notifications be sent immediately or at end of day?