-- Migration: Communications (Notifications, Messages, Leave Requests)
-- Created: 2026-01-22
-- Description: Notifications, messages, and leave request management

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  type TEXT CHECK (type IN ('payment', 'attendance', 'grade', 'announcement', 'reminder', 'alert')),

  related_type TEXT, -- 'invoice', 'attendance', 'grade_entry'
  related_id TEXT, -- ID of related record

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Mark as read when accessed
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    NEW.read_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_notification_read_at
  BEFORE UPDATE OF is_read ON notifications
  FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Thread (conversation group)
  thread_id UUID NOT NULL, -- Groups messages in a conversation

  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  subject TEXT,
  content TEXT NOT NULL,

  -- For linking to specific records
  related_type TEXT, -- 'student', 'invoice', 'enrollment'
  related_id TEXT,

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Reply tracking
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_forwarded BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Mark as read when accessed
CREATE TRIGGER set_message_read_at
  BEFORE UPDATE OF is_read ON messages
  FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- ============================================
-- MESSAGE PARTICIPANTS (for group threads)
-- ============================================
CREATE TABLE message_participants (
  thread_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false, -- Can add/remove participants
  last_read_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

CREATE INDEX idx_message_participants_user ON message_participants(user_id);

-- ============================================
-- LEAVE REQUESTS TABLE
-- ============================================
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,

  request_type TEXT CHECK (request_type IN ('sick', 'personal', 'family', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  reason TEXT NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),

  -- Approval tracking
  approved_by UUID REFERENCES teachers(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Attachments (medical certificate, etc.)
  attachment_url TEXT,

  -- Academic impact
  requires_makeup BOOLEAN DEFAULT false,
  makeup_notes TEXT,

  created_by UUID REFERENCES profiles(id), -- Parent who created request
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_requests_student ON leave_requests(student_id);
CREATE INDEX idx_leave_requests_class ON leave_requests(class_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Trigger for updated_at
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update approved_at
CREATE OR REPLACE FUNCTION update_leave_approved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at := NOW();
  ELSIF NEW.status != 'approved' THEN
    NEW.approved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leave_approved_at
  BEFORE UPDATE OF status ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_leave_approved_at();

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  type TEXT CHECK (type IN ('general', 'urgent', 'event', 'holiday', 'exam')),

  -- Target audience
  target_role TEXT CHECK (target_role IN ('all', 'admin', 'teacher', 'parent', 'student')),

  -- Attachments (images, documents)
  attachment_url TEXT,

  -- Publishing
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  is_pinned BOOLEAN DEFAULT false,
  pin_until TIMESTAMPTZ,

  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_target_role ON announcements(target_role);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VIEWS
-- ============================================

-- Unread message count per user
CREATE VIEW unread_message_counts AS
SELECT
  recipient_id AS user_id,
  COUNT(*) AS unread_count
FROM messages
WHERE is_read = false
GROUP BY recipient_id;

-- Recent notifications for user
CREATE VIEW recent_notifications AS
SELECT
  n.*,
  p.full_name AS sender_name
FROM notifications n
LEFT JOIN profiles p ON p.id = n.sender_id
ORDER BY n.created_at DESC;

-- Pending leave requests for class
CREATE VIEW pending_leave_requests AS
SELECT
  lr.*,
  s.student_code,
  p.full_name AS student_name,
  c.name AS class_name
FROM leave_requests lr
JOIN students s ON s.id = lr.student_id
JOIN profiles p ON p.id = s.id
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
LEFT JOIN classes c ON c.id = e.class_id
WHERE lr.status = 'pending'
ORDER BY lr.created_at DESC;

-- Active announcements
CREATE VIEW active_announcements AS
SELECT *
FROM announcements
WHERE (expires_at IS NULL OR expires_at > NOW())
  AND published_at <= NOW()
ORDER BY
  is_pinned DESC,
  published_at DESC;

-- Message thread summary
CREATE VIEW message_thread_summary AS
SELECT
  m.thread_id,
  m.sender_id,
  m.recipient_id,
  m.subject,
  m.content AS last_message,
  m.created_at AS last_message_at,
  COALESCE(unread_counts.unread_count, 0) AS unread_count
FROM (
  SELECT DISTINCT ON (thread_id) thread_id, sender_id, recipient_id, subject, content, created_at
  FROM messages
  ORDER BY thread_id, created_at DESC
) m
LEFT JOIN (
  SELECT thread_id, recipient_id, COUNT(*) AS unread_count
  FROM messages
  WHERE is_read = false
  GROUP BY thread_id, recipient_id
) unread_counts ON unread_counts.thread_id = m.thread_id AND unread_counts.recipient_id = m.recipient_id
ORDER BY m.created_at DESC;
