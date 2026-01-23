# Database Migration Review: Multi-Channel Notifications & Sessions

**Date**: 2026-01-23
**Migration**: `20260123192900_notifications_sessions.sql`
**Types**: `apps/web/types/supabase.ts`
**Score**: **8.5/10**

---

## Summary

Well-structured migration with solid security foundations. Minor issues in data migration logic and missing RLS policy updates for existing notifications table.

---

## Critical Issues (Must Fix)

### 1. Missing Notifications Table RLS Update
**Severity**: Critical
**Location**: Line 141-177 (RLS Policies section)

**Problem**: Migration adds RLS to new tables (`notification_recipients`, `notification_logs`, `user_sessions`) but doesn't update existing `notifications` table RLS policies to handle new columns.

**Impact**: Admins/teachers creating bulk notifications via `notification_recipients` may be blocked by existing policies that only check `recipient_id = auth.uid()`.

**Fix**: Add to migration after line 177:
```sql
-- Update notifications RLS to support bulk notifications
DROP POLICY IF EXISTS "Teachers and admins can create notifications" ON notifications;

CREATE POLICY "Admins can create bulk notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Teachers can create notifications for their students"
  ON notifications FOR INSERT
  TO authenticated
  USING (
    is_teacher() AND (
      recipient_id IN (
        SELECT s.id FROM students s
        JOIN enrollments e ON s.id = e.student_id
        JOIN class_teachers ct ON e.class_id = ct.class_id
        WHERE ct.teacher_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM notification_recipients nr
        WHERE nr.notification_id = notifications.id
        AND nr.recipient_id IN (
          SELECT s.id FROM students s
          JOIN enrollments e ON s.id = e.student_id
          JOIN class_teachers ct ON e.class_id = ct.class_id
          WHERE ct.teacher_id = auth.uid()
        )
      )
    )
  );
```

### 2. Data Migration Logic Flaw
**Severity**: Critical
**Location**: Lines 267-275

**Problem**: Data migration creates `notification_recipients` from existing `notifications.recipient_id`, but doesn't handle notifications without `recipient_id` (e.g., broadcast announcements).

**Impact**: Pre-existing broadcast announcements become orphaned - no recipients linked.

**Fix**: Replace lines 267-275:
```sql
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

-- For notifications without recipient_id (broadcasts), skip recipient creation
-- These should be migrated manually or via notification_logs only
```

---

## High Priority Issues (Should Fix)

### 3. Missing Notification Logs Cleanup Policy
**Severity**: High
**Location**: Line 62-96 (notification_logs table)

**Problem**: No retention policy for `notification_logs`. Table grows indefinitely.

**Impact**: Database bloat, performance degradation over time.

**Fix**: Add after line 96:
```sql
-- Create function to clean old logs (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_notification_logs()
RETURNS VOID AS $$
BEGIN
  DELETE FROM notification_logs
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND status IN ('delivered', 'failed', 'bounced');
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-notification-logs', '0 2 * * *', 'SELECT cleanup_old_notification_logs()');
```

### 4. Session Termination Function Missing Security Check
**Severity**: High
**Location**: Lines 184-199

**Problem**: `terminate_user_sessions()` is `SECURITY DEFINER` but doesn't verify if caller owns the session or is admin.

**Impact**: Users could terminate other users' sessions.

**Fix**: Replace function (lines 184-199):
```sql
CREATE OR REPLACE FUNCTION terminate_user_sessions(
  p_user_id UUID,
  p_reason TEXT DEFAULT 'new_login'
)
RETURNS VOID AS $$
BEGIN
  -- Only users can terminate own sessions, or service role/admin can terminate any
  IF p_user_id != auth.uid() AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) AND auth.jwt() ->> 'role' != 'service_role' THEN
    RAISE EXCEPTION 'Permission denied: Cannot terminate other users'' sessions';
  END IF;

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
```

### 5. Missing Index for Notification Logs Queries
**Severity**: High
**Location**: Lines 84-95

**Problem**: Missing composite index for common query pattern: `notification_id + recipient_id + status`.

**Impact**: Slow queries when fetching delivery status for specific notification/recipient.

**Fix**: Add after line 95:
```sql
CREATE INDEX idx_notification_logs_notification_recipient_status
  ON notification_logs (notification_id, recipient_id, status);
```

---

## Medium Priority Issues (Nice to Have)

### 6. TypeScript Types Inconsistency
**Severity**: Medium
**Location**: `apps/web/types/supabase.ts`

**Problem**:
- Line 672: `priority` in Row type is `'low' | 'normal' | 'high' | 'emergency' | null`
- Migration line 11: `priority TEXT DEFAULT 'normal'` (non-nullable)

**Impact**: Type mismatch between database and TypeScript types.

**Fix**: Update `notifications` Row type in `supabase.ts` (line 672):
```typescript
priority: 'low' | 'normal' | 'high' | 'emergency'  // Remove | null
```

Same for `category` (line 675).

### 7. Missing Notification Priority Update Trigger
**Severity**: Medium
**Location**: Lines 10-16

**Problem**: No trigger to auto-adjust `priority` based on `type` for new notifications (data migration does this, but new inserts don't).

**Fix**: Add after line 16:
```sql
CREATE OR REPLACE FUNCTION set_notification_priority()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.priority IS NULL THEN
    NEW.priority := CASE
      WHEN NEW.type = 'alert' THEN 'emergency'
      WHEN NEW.type = 'payment' THEN 'high'
      WHEN NEW.type IN ('grade', 'attendance') THEN 'normal'
      ELSE 'low'
    END;
  END IF;

  IF NEW.category IS NULL THEN
    NEW.category := CASE
      WHEN NEW.type = 'reminder' THEN 'reminder'
      WHEN NEW.type = 'alert' THEN 'emergency'
      ELSE 'announcement'
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_notification_defaults
  BEFORE INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_notification_priority();
```

### 8. Session Token Not Hashed
**Severity**: Medium
**Location**: Line 107 (user_sessions.session_token)

**Problem**: Session tokens stored in plaintext. If database compromised, all sessions exposed.

**Fix**: Consider hashing tokens:
```sql
session_token_hash TEXT NOT NULL,
-- Store SHA-256 hash of token instead of plaintext
```

Note: Requires app-level changes to hash tokens before queries.

---

## Low Priority Suggestions

### 9. Add Notification Template System
**Location**: New table suggestion

For consistent notification formatting, consider:
```sql
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  title_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  priority TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. Add Notification Preferences Table
**Location**: New table suggestion

Allow users to customize notification channel preferences:
```sql
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  websocket_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. Add Composite Index for Notifications
**Location**: After line 30

For dashboard queries filtering by recipient + read status:
```sql
CREATE INDEX idx_notifications_recipient_read
  ON notifications (recipient_id, is_read, created_at DESC);
```

---

## Positive Observations

✅ **Excellent index coverage** - Partial indexes for pending/scheduled notifications (lines 19-30)
✅ **Proper CASCADE deletes** - All foreign keys correctly handle cleanup
✅ **CHECK constraints** - All enum-like columns validated
✅ **Security helper functions** - `get_notification_recipients()` handles complex filtering
✅ **Data migration included** - Preserves existing notification data
✅ **Realtime enabled** - WebSocket support added (line 302)
✅ **Trigger for last_active** - Auto-updates session activity (lines 246-259)
✅ **TypeScript types updated** - All new tables typed correctly
✅ **inet type for IP** - Proper PostgreSQL native type (line 115)
✅ **Unique constraint** - Prevents duplicate recipients (line 46)

---

## Migration Completeness Checklist

| Component | Status |
|-----------|--------|
| Tables created | ✅ notification_recipients, notification_logs, user_sessions |
| Columns added | ✅ notifications.priority, scheduled_for, expires_at, category |
| Indexes created | ✅ All required indexes present |
| RLS policies | ⚠️ Missing notifications table update |
| Helper functions | ✅ terminate_user_sessions, get_notification_recipients, update_session_last_active |
| Triggers | ✅ last_active auto-update |
| Data migration | ⚠️ Edge case: broadcast announcements |
| TypeScript types | ✅ All new tables typed |
| Permissions granted | ✅ Functions granted to authenticated |

---

## Recommended Actions (Priority Order)

1. **[CRITICAL]** Add RLS policy update for `notifications` table (Issue #1)
2. **[CRITICAL]** Fix data migration for broadcast announcements (Issue #2)
3. **[HIGH]** Add security check to `terminate_user_sessions()` (Issue #4)
4. **[HIGH]** Add missing composite index (Issue #5)
5. **[HIGH]** Implement notification log cleanup (Issue #3)
6. **[MEDIUM]** Fix TypeScript type nullability (Issue #6)
7. **[MEDIUM]** Add priority auto-set trigger (Issue #7)

---

## Unresolved Questions

1. Should `session_token` be hashed for security? (Requires app changes)
2. What is retention policy for `notification_logs`? (90 days suggested)
3. Should broadcast announcements (no recipient_id) be migrated or only new ones?
4. Is `pg_cron` extension available for scheduled cleanup jobs?
5. Should notification templates/preferences be added in Phase 02?

---

## Test Recommendations

```sql
-- Test 1: Verify RLS policies
SET ROLE authenticated;
SET request.jwt.claim.sub = 'admin-user-id';
SELECT * FROM notification_recipients; -- Should work
INSERT INTO notification_logs (...) VALUES (...); -- Should fail (service role only)

-- Test 2: Test session termination
SELECT terminate_user_sessions('other-user-id', 'manual'); -- Should fail for non-admin

-- Test 3: Test data migration
SELECT COUNT(*) FROM notification_recipients;
SELECT COUNT(*) FROM notifications WHERE recipient_id IS NOT NULL;
-- Counts should match

-- Test 4: Test function security
SELECT get_notification_recipients('student', NULL, NULL, NULL); -- Should work
SELECT * FROM notification_logs WHERE recipient_id != auth.uid(); -- Should fail
```
