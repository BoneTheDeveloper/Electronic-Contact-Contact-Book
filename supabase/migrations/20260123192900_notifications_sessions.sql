-- Migration: Multi-Channel Notifications & Single Session Management
-- Created: 2026-01-23
-- Description: Add notification delivery tracking and user session management

-- ============================================
-- MODIFY EXISTING NOTIFICATIONS TABLE
-- ============================================

-- Add new columns for tiered delivery and scheduling
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'announcement'
    CHECK (category IN ('announcement', 'emergency', 'reminder', 'system'));

-- Add index for pending notifications
CREATE INDEX IF NOT EXISTS idx_notifications_pending
  ON notifications (created_at DESC)
  WHERE is_read = false;

-- Add index for scheduled notifications
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled
  ON notifications (scheduled_for)
  WHERE scheduled_for IS NOT NULL;

-- Add index for priority-based queries
CREATE INDEX IF NOT EXISTS idx_notifications_priority
  ON notifications (priority, created_at DESC);

-- ============================================
-- NOTIFICATION RECIPIENTS TABLE
-- ============================================
-- Many-to-many relationship: notifications → recipients
-- Enables bulk notification sending with per-recipient tracking

CREATE TABLE IF NOT EXISTS notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique recipient per notification
  CONSTRAINT notification_recipient_unique UNIQUE (notification_id, recipient_id)
);

-- Indexes for querying
CREATE INDEX idx_notification_recipients_notification
  ON notification_recipients (notification_id);
CREATE INDEX idx_notification_recipients_recipient
  ON notification_recipients (recipient_id);
CREATE INDEX idx_notification_recipients_role
  ON notification_recipients (role);

-- ============================================
-- NOTIFICATION LOGS TABLE
-- ============================================
-- Track delivery status per channel (WebSocket, email, in-app, push)

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Channel info
  channel TEXT NOT NULL CHECK (channel IN ('websocket', 'email', 'in_app', 'push')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),

  -- Delivery metadata
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INT DEFAULT 0,

  -- External IDs (e.g., email message ID)
  external_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for querying and monitoring
CREATE INDEX idx_notification_logs_notification
  ON notification_logs (notification_id);
CREATE INDEX idx_notification_logs_recipient
  ON notification_logs (recipient_id);
CREATE INDEX idx_notification_logs_status
  ON notification_logs (status);
CREATE INDEX idx_notification_logs_channel
  ON notification_logs (channel);
CREATE INDEX idx_notification_logs_pending
  ON notification_logs (created_at)
  WHERE status = 'pending';

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
-- Track active sessions (single session per user enforcement)

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Session metadata
  session_token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_active TIMESTAMPTZ DEFAULT NOW(),

  -- Device info
  device_type TEXT CHECK (device_type IN ('web', 'mobile_ios', 'mobile_android', 'desktop')),
  device_id TEXT,
  user_agent TEXT,
  ip_address INET,

  -- Location (optional, for security)
  city TEXT,
  country TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  terminated_at TIMESTAMPTZ,
  termination_reason TEXT CHECK (termination_reason IN ('new_login', 'timeout', 'manual', 'admin')),

  -- Single session enforced via app logic using terminate_user_sessions() function
);

-- Indexes
CREATE INDEX idx_user_sessions_user
  ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_active
  ON user_sessions (is_active) WHERE is_active = true;
CREATE INDEX idx_user_sessions_token
  ON user_sessions (session_token);
CREATE INDEX idx_user_sessions_last_active
  ON user_sessions (last_active DESC);

-- ============================================
-- RLS POLICIES FOR USER SESSIONS
-- ============================================
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view own sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all sessions
CREATE POLICY "Service can manage sessions"
  ON user_sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- RLS POLICIES FOR NOTIFICATION RECIPIENTS
-- ============================================
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification recipients"
  ON notification_recipients FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Service can manage notification recipients"
  ON notification_recipients FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- RLS POLICIES FOR NOTIFICATION LOGS
-- ============================================
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification logs"
  ON notification_logs FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Service can manage notification logs"
  ON notification_logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function: Terminate existing active sessions for a user
CREATE OR REPLACE FUNCTION terminate_user_sessions(
  p_user_id UUID,
  p_reason TEXT DEFAULT 'new_login'
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_sessions
  SET
    is_active = false,
    terminated_at = NOW(),
    termination_reason = p_reason
  WHERE
    user_id = p_user_id
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get recipient IDs by role and filters
CREATE OR REPLACE FUNCTION get_notification_recipients(
  p_target_role TEXT,
  p_target_grade_ids UUID[] DEFAULT NULL,
  p_target_class_ids UUID[] DEFAULT NULL,
  p_specific_user_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (user_id UUID, role TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS user_id,
    p.role
  FROM profiles p
  WHERE
    -- Specific users (highest priority)
    (p_specific_user_ids IS NOT NULL AND p.id = ANY(p_specific_user_ids))
    OR (
      -- By role
      p.role = p_target_role
      AND p.status = 'active'
      -- Filter by grade/class if provided (for students)
      AND (
        p_target_grade_ids IS NULL
        OR (p.role = 'student' AND EXISTS (
          SELECT 1 FROM students s
          JOIN enrollments e ON s.id = e.student_id
          JOIN classes c ON e.class_id = c.id
          WHERE s.id = p.id AND c.grade_id = ANY(p_target_grade_ids)
          AND e.status = 'active'
        ))
      )
      AND (
        p_target_class_ids IS NULL
        OR (p.role = 'student' AND EXISTS (
          SELECT 1 FROM enrollments e
          WHERE e.student_id = p.id AND e.class_id = ANY(p_target_class_ids)
          AND e.status = 'active'
        ))
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update last_active timestamp for session
CREATE OR REPLACE FUNCTION update_session_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_active
CREATE TRIGGER update_user_sessions_last_active
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  WHEN (OLD.last_active IS NULL OR OLD.last_active < NOW() - INTERVAL '5 minutes')
  EXECUTE FUNCTION update_session_last_active();

-- ============================================
-- MIGRATE EXISTING DATA
-- ============================================

-- Create notification_recipients from existing notifications
-- Only for notifications that have a valid recipient_id
INSERT INTO notification_recipients (notification_id, recipient_id, role)
SELECT
  n.id AS notification_id,
  n.recipient_id,
  p.role
FROM notifications n
INNER JOIN profiles p ON n.recipient_id = p.id
WHERE n.recipient_id IS NOT NULL
ON CONFLICT (notification_id, recipient_id) DO NOTHING;

-- Set default priority/category for existing notifications
UPDATE notifications
SET
  priority = CASE
    WHEN type = 'alert' THEN 'emergency'
    WHEN type = 'payment' THEN 'high'
    WHEN type IN ('grade', 'attendance') THEN 'normal'
    ELSE 'low'
  END,
  category = CASE
    WHEN type = 'reminder' THEN 'reminder'
    WHEN type = 'alert' THEN 'emergency'
    ELSE 'announcement'
  END
WHERE priority IS NULL OR category IS NULL;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION terminate_user_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION get_notification_recipients TO authenticated;

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
