---
title: "Multi-Channel Notifications & Single Session Management"
description: "Admin notifications with tiered delivery (WebSocket/inbox/email) + single session per account enforcement"
status: in-progress
priority: P1
effort: 16h
branch: master
tags: [notifications, real-time, session-management, security, websocket, email]
created: 2026-01-23
---

## Overview

Implement **(1)** multi-channel notification system with tiered delivery and **(2)** single-session-per-account enforcement.

### Feature 1: Multi-Channel Notification System
- **Admin**: Send notifications to schools/teachers/students/parents
- **Types**: Announcements, emergency alerts, reminders
- **Tiered Delivery**:
  - Emergency: All channels (WebSocket + in-app + email)
  - Announcements: In-app + email
  - Reminders: In-app only
- **Channels**: WebSocket (real-time), in-app inbox, email
- **Database**: `notifications`, `notification_recipients`, `notification_logs`

### Feature 2: Single-Session-Per-Account
- One active session per user
- New login invalidates old session gracefully
- Device tracking and session management
- Middleware validation

## Phases

| Phase | File | Focus | Est |
|-------|------|-------|-----|
| 01 | [phase-01-database-migration.md](./phase-01-database-migration.md) | Database schema for notifications + session tracking | 2h |
| 02 | [phase-02-notification-api.md](./phase-02-notification-api.md) | Real-time API, WebSocket, email integration | 5h |
| 03 | [phase-03-notification-ui.md](./phase-03-notification-ui.md) | In-app inbox, admin notification composer | 4h |
| 04 | [phase-04-single-session.md](./phase-04-single-session.md) | Session tracking, middleware, graceful termination | 5h |

## Progress

- [x] Phase 01: Database Migration - Completed 2026-01-23 19:29
- [x] Phase 02: Notification API - Completed 2026-01-23
- [x] Phase 03: Notification UI - Completed 2026-01-23
- [ ] Phase 04: Single Session

## Tech Stack

**Backend**: Supabase (PostgreSQL + Realtime + Auth), Next.js 15 API routes
**Real-time**: Supabase Realtime (WebSocket subscriptions)
**Email**: Resend or SendGrid
**Frontend**: React Server Components, React Query, Zustand
**Mobile**: React Native with Supabase Realtime client

## Key Decisions

### Notification Delivery
- **Supabase Realtime** for WebSocket (cheaper, native integration)
- **Database queue** pattern for reliability
- **Tiered priority** system for channel selection

### Session Management
- **Supabase Auth** sessions + custom `user_sessions` table
- **Cookie-based** session validation (existing pattern)
- **Graceful logout** via Realtime channel broadcast

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Email delivery delays | Medium | Queue system + retry logic |
| WebSocket connection drops | Low | Auto-reconnect + fallback polling |
| Session race conditions | High | Database-level unique constraint |
| Mobile WebSocket support | Medium | Test on iOS/Android early |

## Dependencies

- Supabase project configured with Realtime enabled
- Email service API key (Resend/SendGrid)
- Existing auth system (`apps/web/lib/auth.ts`)
- Existing notifications table (currently in mock)

## Next Steps

1. Review all phase files
2. Run database migration (Phase 01)
3. Implement API layer (Phase 02)
4. Build UI components (Phase 03)
5. Add session enforcement (Phase 04)
6. Integration testing
7. Deploy to production

---

**Report bugs**: Create issue in project tracker
**Questions**: Check individual phase files
