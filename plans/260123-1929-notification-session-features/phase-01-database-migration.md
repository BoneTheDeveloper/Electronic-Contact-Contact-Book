---
title: "Phase 01: Database Migration"
description: "Create database schema for notifications and session tracking"
status: done
priority: P1
effort: 2h
tags: [database, migration, supabase, sql]
---

## Context

Existing notifications table (mock):
```sql
-- Current structure from Supabase
notifications (
  id uuid primary key,
  recipient_id uuid references profiles(id),
  sender_id uuid references profiles(id),
  title text,
  content text,
  type text, -- 'info', 'warning', 'success', 'error'
  is_read boolean default false,
  read_at timestamptz,
  created_at timestamptz default now()
)
```

Need: **recipient mapping**, **delivery tracking**, **session management**.

## Overview

Create 3 new tables:
1. `notification_recipients` - Many-to-many relationship
2. `notification_logs` - Delivery tracking per channel
3. `user_sessions` - Session tracking + device info

## Requirements

- Support tiered delivery (emergency/announcement/reminder)
- Track delivery status per channel (WebSocket/email/in-app)
- Enforce single session per user
- Audit log for all notification deliveries
- Device fingerprinting for session management

## Architecture

```
notifications (existing, modified)
  ├─ notification_recipients (new) - Links notifications → recipients
  │     └─ notification_logs (new) - Delivery status per channel
  └─ user_sessions (new) - One active session per user
```

## Implementation Steps

### Step 1: Modify Existing `notifications` Table

**File**: `supabase/migrations/20260123_notifications_schema.sql`

```sql
-- Add priority and scheduled delivery
alter table notifications
  add column priority text default 'normal'
    check (priority in ('low', 'normal', 'high', 'emergency')),
  add column scheduled_for timestamptz,
  add column expires_at timestamptz,
  add column category text default 'announcement'
    check (category in ('announcement', 'emergency', 'reminder', 'system'));

-- Add index for pending notifications
create index idx_notifications_pending
  on notifications (created_at)
  where is_read = false;

-- Add index for scheduled notifications
create index idx_notifications_scheduled
  on notifications (scheduled_for)
  where scheduled_for is not null;
```

### Step 2: Create `notification_recipients` Table

```sql
-- Many-to-many relationship: notifications → recipients
create table notification_recipients (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references notifications(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'teacher', 'parent', 'student')),
  created_at timestamptz default now(),

  -- Ensure unique recipient per notification
  unique (notification_id, recipient_id)
);

-- Indexes for querying
create index idx_notification_recipients_notification
  on notification_recipients (notification_id);
create index idx_notification_recipients_recipient
  on notification_recipients (recipient_id);
create index idx_notification_recipients_role
  on notification_recipients (role);
```

### Step 3: Create `notification_logs` Table

```sql
-- Track delivery status per channel
create table notification_logs (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references notifications(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,

  -- Channel info
  channel text not null check (channel in ('websocket', 'email', 'in_app', 'push')),
  status text not null check (status in ('pending', 'sent', 'delivered', 'failed', 'bounced')),

  -- Delivery metadata
  sent_at timestamptz,
  delivered_at timestamptz,
  failed_at timestamptz,
  error_message text,
  retry_count int default 0,

  -- External IDs (e.g., email message ID)
  external_id text,

  created_at timestamptz default now()
);

-- Indexes for querying
create index idx_notification_logs_notification
  on notification_logs (notification_id);
create index idx_notification_logs_recipient
  on notification_logs (recipient_id);
create index idx_notification_logs_status
  on notification_logs (status);
create index idx_notification_logs_channel
  on notification_logs (channel);
```

### Step 4: Create `user_sessions` Table

```sql
-- Track active sessions (single session per user enforcement)
create table user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,

  -- Session metadata
  session_token text unique not null, -- Supabase session token
  is_active boolean default true,
  last_active timestamptz default now(),

  -- Device info
  device_type text check (device_type in ('web', 'mobile_ios', 'mobile_android', 'desktop')),
  device_id text, -- Fingerprint or device token
  user_agent text,
  ip_address inet,

  -- Location (optional, for security)
  city text,
  country text,

  created_at timestamptz default now(),
  terminated_at timestamptz,
  termination_reason text, -- 'new_login', 'timeout', 'manual', 'admin'

  -- Ensure only one active session per user
  exclude using gist (user_id with =, is_active with =)
    where (is_active = true)
);

-- Indexes
create index idx_user_sessions_user
  on user_sessions (user_id);
create index idx_user_sessions_active
  on user_sessions (is_active) where is_active = true;
create index idx_user_sessions_token
  on user_sessions (session_token);

-- RLS Policies
alter table user_sessions enable row level security;

create policy "Users can view own sessions"
  on user_sessions for select
  using (auth.uid() = user_id);

create policy "Service can manage sessions"
  on user_sessions for all
  using (auth.jwt() ->> 'role' = 'service_role');
```

### Step 5: Create Helper Functions

```sql
-- Function: Terminate existing active sessions for a user
create or replace function terminate_user_sessions(
  p_user_id uuid,
  p_reason text default 'new_login'
)
returns void as $$
begin
  update user_sessions
  set
    is_active = false,
    terminated_at = now(),
    termination_reason = p_reason
  where
    user_id = p_user_id
    and is_active = true;
end;
$$ language plpgsql security definer;

-- Function: Get recipient IDs by role and filters
create or replace function get_notification_recipients(
  p_target_role text,
  p_target_grade_ids uuid[] default null,
  p_target_class_ids uuid[] default null,
  p_specific_user_ids uuid[] default null
)
returns table (user_id uuid, role text) as $$
begin
  return query
  select
    p.id as user_id,
    p.role
  from profiles p
  where
    -- Specific users (highest priority)
    (p_specific_user_ids is not null and p.id = any(p_specific_user_ids))
    or (
      -- By role
      p.role = p_target_role
      and p.status = 'active'
      -- Filter by grade/class if provided (for students)
      and (
        p_target_grade_ids is null
        or (p.role = 'student' and exists (
          select 1 from students s
          join enrollments e on s.id = e.student_id
          join classes c on e.class_id = c.id
          where s.id = p.id and c.grade_id = any(p_target_grade_ids)
        ))
      )
      and (
        p_target_class_ids is null
        or (p.role = 'student' and exists (
          select 1 from enrollments e
          where e.student_id = p.id and e.class_id = any(p_target_class_ids)
        ))
      )
    );
end;
$$ language plpgsql security definer;
```

### Step 6: Update Existing Data

```sql
-- Migrate existing notifications to new schema
-- Note: This is a one-time migration, adjust based on actual data

-- Create notification_recipients from existing recipient_id
insert into notification_recipients (notification_id, recipient_id, role)
select
  n.id as notification_id,
  n.recipient_id,
  p.role
from notifications n
join profiles p on n.recipient_id = p.id
where n.recipient_id is not null
on conflict (notification_id, recipient_id) do nothing;

-- Set default priority for existing notifications
update notifications
set
  priority = case
    when type = 'error' then 'high'
    when type = 'warning' then 'normal'
    else 'low'
  end,
  category = 'announcement'
where priority is null or category is null;
```

## Todo List

- [ ] Create migration file `20260123_notifications_schema.sql`
- [ ] Add `priority`, `scheduled_for`, `expires_at`, `category` to `notifications`
- [ ] Create `notification_recipients` table
- [ ] Create `notification_logs` table
- [ ] Create `user_sessions` table
- [ ] Create helper functions
- [ ] Run migration locally via Supabase CLI
- [ ] Test RLS policies
- [ ] Verify data integrity
- [ ] Generate TypeScript types (`npx supabase gen types typescript`)

## Success Criteria

- [ ] All tables created with correct indexes
- [ ] RLS policies enforce data isolation
- [ ] `user_sessions` unique constraint prevents multiple active sessions
- [ ] Migration runs without errors
- [ ] TypeScript types generated and valid
- [ ] Existing notification data migrated successfully

## Security Considerations

1. **RLS (Row Level Security)**: Enable on all tables
   - Users only see their own notifications/logs
   - Service role can manage all data

2. **Session Isolation**:
   - `exclude` constraint ensures single active session
   - `is_active` flag prevents race conditions

3. **PII Protection**:
   - IP addresses stored as `inet` type (PostgreSQL-native)
   - User agents logged for security audit

4. **Injection Prevention**:
   - Use parameterized queries in functions
   - Validate all input types

## Rollback Plan

```sql
-- Drop all new objects in reverse order
drop function if exists get_notification_recipients;
drop function if exists terminate_user_sessions;
drop table if exists user_sessions;
drop table if exists notification_logs;
drop table if exists notification_recipients;

-- Revert notifications table changes
alter table notifications
  drop column if exists priority,
  drop column if exists scheduled_for,
  drop column if exists expires_at,
  drop column if exists category;

-- Drop indexes
drop index if exists idx_notifications_pending;
drop index if exists idx_notifications_scheduled;
```

## Next Steps

After migration:
- Proceed to [Phase 02: Notification API](./phase-02-notification-api.md)
- Implement Supabase Realtime subscriptions
- Build email service integration
- Create API endpoints for notification CRUD

## ✅ COMPLETED

**Completed**: 2026-01-23 19:29
**Migration File**: `20260123192900_notifications_sessions.sql`
**Critical Fixes**: `20260123192900_notifications_sessions_critical_fixes`
**Review Score**: 8.5/10 (critical issues fixed)

### Summary
- Database migration applied successfully
- TypeScript types regenerated and updated
- All tables created with proper indexes and RLS policies
- Single session constraint enforced via unique index
- Existing notification data migrated

### Issues Fixed
- Fixed RLS policy syntax for user_sessions table
- Added proper cascade constraints to prevent orphaned data
- Optimized notification indexes for better query performance
- Enhanced session termination function error handling

### Next Phase
Proceed to [Phase 02: Notification API](./phase-02-notification-api.md)

## Unresolved Questions

1. Should we store device fingerprint hash or just user agent?
2. Push notification channel - use Firebase/APN directly or Supabase integration?
3. Notification retention policy - auto-delete after X days?
4. Email template storage - database or files?
