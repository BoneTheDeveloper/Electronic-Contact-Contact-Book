# Multi-Channel Notification System Architecture Research

## Proven Delivery Patterns

### 1. Multi-Channel Delivery Architecture

**Real-time Channels:**
- **WebSockets**: Live updates for in-app notifications using Supabase Realtime
- **SSE (Server-Sent Events)**: Fallback for browser compatibility
- **In-app Inbox**: Persistent notifications with read status tracking

**Asynchronous Channels:**
- **Email**: Detailed communications requiring responses
- **Future Mobile Push**: High-priority alerts when mobile app available
- **SMS**: Emergency alerts only (high cost)

### 2. Tiered Delivery Strategy by Urgency

**Emergency Alerts (Critical):**
- All channels simultaneously
- Immediate WebSocket + SSE + SMS + Email
- Auto-escalation if not acknowledged

**Announcements (High):**
- WebSockets + SSE + Email
- Mobile push (when available)
- 24-hour retention in inbox

**Reminders (Normal):**
- WebSockets + SSE only
- In-app inbox with 7-day retention
- No email delivery

### 3. Supabase Integration Patterns

**Realtime Subscriptions:**
```typescript
// notifications table with RLS
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('announcement', 'emergency', 'reminder')),
  priority INTEGER NOT NULL DEFAULT 1,
  sender_id uuid REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

// notification_recipients table
CREATE TABLE notification_recipients (
  notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  channel VARCHAR(20)[] NOT NULL,
  delivered BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  PRIMARY KEY (notification_id, user_id)
);
```

**Subscription Pattern:**
```typescript
// Client-side subscription
supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `recipient_id=eq.${userId}`
  }, handleNotification)
  .subscribe();
```

### 4. Database Schema Design

**Core Tables:**
1. `notifications` - Message content and metadata
2. `notification_recipients` - Delivery tracking per user
3. `notification_logs` - Delivery attempt records
4. `user_preferences` - Channel opt-ins

**Key Fields:**
- `priority`: 1=Normal, 2=High, 3=Critical
- `channels`: Array of enabled channels
- `delivery_status`: pending/success/failed
- `read_at`: NULL until user opens
- `expires_at`: Auto-cleanup time

### 5. Priority Levels & Escalation

**Priority System:**
- Level 1: Standard notifications (no escalation)
- Level 2: High priority (retry after 1 hour)
- Level 3: Emergency (retry every 15 minutes, SMS backup)

**Escalation Rules:**
- Unackged critical alerts → SMS → Voice call
- Failed email delivery → Web push fallback
- Weekend/holidays → Delay non-urgent notifications

## Implementation Recommendations

1. **Start simple**: WebSockets + in-app inbox now
2. **Email integration** for announcements
3. **Supabase RLS** for security and targeting
4. **Exponential backoff** for failed deliveries
5. **Rate limiting** to prevent spam

## Future Mobile Extension

- Add push notification service (Expo/FCM)
- Implement offline queueing
- Battery-aware delivery scheduling
- Cellular data optimization

## Unresolved Questions

1. Should SMS be included now or only when mobile app launches?
2. What's the optimal retention period for notification history?
3. How to handle parent-student notification overlap?