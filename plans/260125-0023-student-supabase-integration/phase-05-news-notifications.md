# Phase 05: News & Notifications

**Status:** Pending
**Priority:** Low
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md) | [phase-01-setup-core-data.md](phase-01-setup-core-data.md)

## Overview

Implement news/announcements loading from Supabase. This phase is lower priority as the existing mock data is sufficient for initial testing.

## Key Insights

1. News comes from `announcements` table
2. Notifications come from `notifications` table with `notification_recipients`
3. Need to filter by target_role = 'student'
4. Support for category filtering

## Requirements

### Functional Requirements
- [ ] Load announcements from Supabase
- [ ] Load notifications for student
- [ ] Support category filtering
- [ ] Mark notifications as read
- [ ] Display pinned announcements first

### Technical Requirements
- Filter by target_role and expiration
- Order by pinned status and date
- Handle empty states

## Architecture

**News Query:**
```typescript
// Get announcements targeting students
announcements WHERE target_role IN ('student', 'all')
```

**Notifications Query:**
```typescript
// Get notifications for specific student
notifications JOIN notification_recipients WHERE recipient_id = studentId
```

## Related Code Files

- `apps/mobile/src/screens/student/News.tsx` - News screen (lines 1-117)
- `apps/mobile/src/screens/student/Dashboard.tsx` - Notification badge (lines 96-103)

## Implementation Steps

1. **Create News Queries** (`src/lib/supabase/queries/news.ts`)
   ```typescript
   export async function getAnnouncements(
     targetRole: string = 'student'
   ): Promise<Announcement[]>

   export async function getNotifications(
     recipientId: string
   ): Promise<Notification[]>

   export async function markNotificationRead(
     notificationId: string,
     recipientId: string
   ): Promise<void>
   ```

2. **Update News Screen**
   - Load announcements from Supabase
   - Filter by category
   - Show pinned announcements first

3. **Update Dashboard**
   - Load notification count
   - Display badge

## Todo List

- [ ] Create announcements query
- [ ] Create notifications query
- [ ] Create mark read mutation
- [ ] Update News screen
- [ ] Update Dashboard notification badge
- [ ] Test with real announcements

## Success Criteria

- [ ] News screen displays real announcements
- [ ] Category filtering works
- [ ] Pinned items show first
- [ ] Notification badge shows count
- [ ] Can mark notifications as read

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| No announcements in database | Low | Show empty state |
| Notification count wrong | Low | Recalculate on load |

## Database Queries

**Announcements Query:**
```sql
SELECT
  id,
  title,
  content,
  type,
  attachment_url,
  published_at,
  expires_at,
  is_pinned
FROM announcements
WHERE target_role IN ('student', 'all')
  AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY is_pinned DESC, published_at DESC
```

**Notifications Query:**
```sql
SELECT DISTINCT
  n.id,
  n.title,
  n.content,
  n.type,
  n.category,
  n.created_at,
  nr.is_read,
  nr.read_at
FROM notifications n
JOIN notification_recipients nr ON n.id = nr.notification_id
WHERE nr.recipient_id = $1
ORDER BY n.created_at DESC
```

## Next Steps

After completing this phase:
1. Move to [phase-06-payments-summary.md](phase-06-payments-summary.md)
2. Most student screens now use real data
3. Test full student flow

## Unresolved Questions

- Should we implement real-time notifications?
- How to handle notification permissions on mobile?
