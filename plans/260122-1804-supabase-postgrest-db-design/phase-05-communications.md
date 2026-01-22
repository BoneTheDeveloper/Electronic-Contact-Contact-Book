# Phase 05 - Communications & Requests

**Date**: 2026-01-22 | **Priority**: High | **Status**: Draft

## Overview

Notifications, parent-teacher messaging, leave requests system.

## Context

From mock data:
- Notifications: info, warning, success, error types
- Conversations between teachers and parents
- Leave requests: pending, approved, rejected
- Target roles: all, teacher, parent, student

## Key Insights

1. **Notifications**: Broadcast to role-based audiences
2. **Conversations**: 1-to-1 or 1-to-many (teacher-parents)
3. **Leave requests**: Student submits, homeroom approves
4. **Read status**: Track notification/message reads

## Schema Design

### 1. Notifications (Thông báo)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Targeting
  target_role TEXT CHECK (target_role IN ('all', 'admin', 'teacher', 'parent', 'student')) NOT NULL,
  target_grades TEXT[], -- Optional: specific grades
  target_classes TEXT[], -- Optional: specific classes

  -- Notification type
  type TEXT CHECK (type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',

  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Attachments
  attachment_url TEXT,

  -- Publisher
  published_by UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),

  -- Scheduling
  scheduled_for TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT scheduled_after_publish CHECK (scheduled_for IS NULL OR scheduled_for >= published_at)
);

CREATE INDEX idx_notifications_target ON notifications(target_role);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_published ON notifications(published_at DESC);

-- Notification reads (tracking who read what)
CREATE TABLE notification_reads (
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX idx_notification_reads_user ON notification_reads(user_id);
CREATE INDEX idx_notification_reads_notification ON notification_reads(notification_id);

-- Mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO notification_reads (notification_id, user_id)
  VALUES (notification_uuid, user_uuid)
  ON CONFLICT (notification_id, user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
```

### 2. Conversations (Hội thoại)

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  parent_id UUID NOT NULL REFERENCES parents(id),

  -- Related student (optional, for parent-teacher about student)
  student_id UUID REFERENCES students(id),

  -- Conversation metadata
  subject TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),

  -- Unread counts
  teacher_unread INT DEFAULT 0,
  parent_unread INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(teacher_id, parent_id, student_id)
);

CREATE INDEX idx_conversations_teacher ON conversations(teacher_id);
CREATE INDEX idx_conversations_parent ON conversations(parent_id);
CREATE INDEX idx_conversations_student ON conversations(student_id);
CREATE INDEX idx_conversations_status ON conversations(status);

-- Trigger for updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. Messages (Tin nhắn)

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Sender
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'parent')),

  -- Content
  content TEXT NOT NULL,
  attachment_url TEXT,

  -- Status
  is_deleted BOOLEAN DEFAULT false,

  -- Read receipts
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Update conversation unread count and last message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    parent_unread = CASE WHEN NEW.sender_role = 'teacher' THEN parent_unread + 1 ELSE parent_unread END,
    teacher_unread = CASE WHEN NEW.sender_role = 'parent' THEN teacher_unread + 1 ELSE teacher_unread END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_after_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Mark messages as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
  conversation_uuid UUID,
  user_uuid UUID
) RETURNS VOID AS $$
BEGIN
  -- Mark messages as read
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = conversation_uuid
    AND sender_id != user_uuid
    AND read_at IS NULL;

  -- Reset unread count
  UPDATE conversations
  SET
    teacher_unread = CASE WHEN EXISTS (SELECT 1 FROM teachers WHERE id = user_uuid) THEN 0 ELSE teacher_unread END,
    parent_unread = CASE WHEN EXISTS (SELECT 1 FROM parents WHERE id = user_uuid) THEN 0 ELSE parent_unread END
  WHERE id = conversation_uuid;
END;
$$ LANGUAGE plpgsql;
```

### 4. Leave Requests (Đơn xin nghỉ)

```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

  -- Leave details
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,

  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Submitter
  submitted_by UUID REFERENCES parents(id), -- Parent who submitted
  submitted_at TIMESTAMPTZ DEFAULT NOW(),

  -- Approver (homeroom teacher)
  reviewed_by UUID REFERENCES teachers(id),
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,

  -- Contact
  parent_contact TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_requests_student ON leave_requests(student_id);
CREATE INDEX idx_leave_requests_class ON leave_requests(class_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Trigger for updated_at
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Views

### User Notifications View

```sql
CREATE VIEW user_notifications AS
SELECT
  n.id,
  n.title,
  n.message,
  n.type,
  n.priority,
  n.attachment_url,
  n.published_at,
  nr.read_at IS NOT NULL AS is_read,
  nr.read_at,
  n.published_by,
  p.full_name AS publisher_name
FROM notifications n
CROSS JOIN LATERAL (
  -- Get current user (would need auth.uid() in real query)
  SELECT id FROM profiles LIMIT 1
) AS u
LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = u.id
LEFT JOIN profiles p ON p.id = n.published_by
WHERE
  n.target_role = 'all'
  OR n.target_role = (SELECT role FROM profiles WHERE id = u.id)
  OR n.target_grades IS NOT NULL AND (
    SELECT c.grade_id FROM enrollments e
    JOIN classes c ON c.id = e.class_id
    WHERE e.student_id = u.id AND e.status = 'active'
    LIMIT 1
  ) = ANY(n.target_grades)
ORDER BY n.published_at DESC;
```

### Teacher Conversations View

```sql
CREATE VIEW teacher_conversations_view AS
SELECT
  c.id,
  c.teacher_id,
  c.parent_id,
  c.student_id,
  s.student_code,
  sp.full_name AS student_name,
  c.subject,
  c.last_message_at,
  c.last_message_preview,
  c.teacher_unread,
  pp.full_name AS parent_name,
  pp.avatar_url AS parent_avatar,
  e.class_id,
  c.status
FROM conversations c
JOIN teachers t ON t.id = c.teacher_id
LEFT JOIN students s ON s.id = c.student_id
LEFT JOIN profiles sp ON sp.id = s.id
LEFT JOIN parents p ON p.id = c.parent_id
LEFT JOIN profiles pp ON pp.id = p.id
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'active';
```

### Parent Conversations View

```sql
CREATE VIEW parent_conversations_view AS
SELECT
  c.id,
  c.parent_id,
  c.teacher_id,
  c.student_id,
  s.student_code,
  sp.full_name AS student_name,
  c.subject,
  c.last_message_at,
  c.last_message_preview,
  c.parent_unread,
  tp.full_name AS teacher_name,
  tp.avatar_url AS teacher_avatar,
  e.class_id,
  c.name AS class_name,
  c.status
FROM conversations c
JOIN parents p ON p.id = c.parent_id
LEFT JOIN students s ON s.id = c.student_id
LEFT JOIN profiles sp ON sp.id = s.id
LEFT JOIN teachers t ON t.id = c.teacher_id
LEFT JOIN profiles tp ON tp.id = t.id
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
LEFT JOIN classes c ON c.id = e.class_id;
```

## API Endpoints

```
GET    /notifications                    -- List notifications for user
POST   /notifications                    -- Create notification (admin/teacher)
POST   /rpc/mark_notification_read       -- Mark as read

GET    /conversations                    -- List user's conversations
GET    /conversations?id=eq.{uuid}       -- Get specific conversation
GET    /messages?conversation_id=eq.{uuid} -- Get messages in conversation
POST   /messages                         -- Send message
POST   /rpc/mark_conversation_read       -- Mark conversation as read

GET    /leave_requests                   -- List leave requests
POST   /leave_requests                   -- Submit leave request (parent)
PATCH  /leave_requests?id=eq.{uuid}      -- Approve/reject (teacher)
```

## Requirements Met

- [x] Role-based notifications
- [x] Teacher-parent messaging
- [x] Read/unread tracking
- [x] Leave request workflow
- [x] Message read receipts

## Next Steps

Phase 06: RLS Policies for security.
