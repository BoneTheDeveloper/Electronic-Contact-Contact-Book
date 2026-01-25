---
title: "Teacher Attendance Implementation"
description: "Implement real Supabase integration for teacher attendance feature with database queries, teacher assignment logic, and parent notifications"
status: pending
priority: P1
effort: 8h
branch: master
tags: [attendance, teacher, supabase, notifications, database]
created: 2026-01-25
---

# Teacher Attendance Implementation Plan

**Date:** 2026-01-25
**Priority:** High (P1)
**Status:** Planning

## Overview

Replace mock data with real Supabase integration for the teacher attendance feature. Implements database queries, teacher class assignment logic (homeroom vs subject teachers), period-based attendance tracking, leave request integration, and parent notifications for absent/late students.

**Approach:** Incremental implementation with 5 phases - database queries, teacher assignment logic, UI integration, notifications, and testing.

## Phases

| Phase | Status | Link |
|-------|--------|------|
| 01: Database Queries & API | Pending | [phase-01-database-api.md](phase-01-database-api.md) |
| 02: Teacher Assignment Logic | Pending | [phase-02-teacher-assignment.md](phase-02-teacher-assignment.md) |
| 03: Attendance Form UI | Pending | [phase-03-attendance-ui.md](phase-03-attendance-ui.md) |
| 04: Notification Integration | Pending | [phase-04-notifications.md](phase-04-notifications.md) |
| 05: Testing | Pending | [phase-05-testing.md](phase-05-testing.md) |

## Quick Stats

- **Total Phases:** 5
- **Database Tables:** 8 (attendance, students, schedules, class_teachers, periods, leave_requests, profiles, notifications)
- **New Files:** ~12
- **Modified Files:** ~6
- **API Routes:** 3 new, 2 modified

## Related Code Files

### Existing Files (to be modified)
- `apps/web/app/teacher/attendance/page.tsx` - Attendance class list (mock → real)
- `apps/web/app/teacher/attendance/[classId]/page.tsx` - Attendance form page
- `apps/web/app/api/attendance/route.ts` - Mock API → real Supabase
- `apps/web/lib/types.ts` - Type definitions

### New Files to Create
- `apps/web/lib/supabase/queries/attendance.ts` - Attendance queries
- `apps/web/lib/supabase/queries/teachers.ts` - Teacher class queries
- `apps/web/app/api/teacher/attendance/route.ts` - Teacher attendance API
- `apps/web/app/api/teacher/attendance/[classId]/route.ts` - Class attendance API
- `apps/web/lib/services/attendance-service.ts` - Attendance business logic
- `apps/web/lib/services/notification-service.ts` - Parent notifications

## Database Schema

### Primary Tables Used

**attendance:**
- `id` (UUID)
- `student_id` → students(id)
- `class_id` → classes(id)
- `date` (DATE)
- `period_id` → periods(id) - NULL for full-day
- `status` ('present', 'absent', 'late', 'excused')
- `notes` (TEXT)
- `recorded_by` → teachers(id)

**schedules:**
- Links subject teachers to classes
- Contains `period_id`, `day_of_week`, `semester`

**class_teachers:**
- Links homeroom teachers to classes
- Has `is_primary` flag for main GVCN

**periods:**
- Time slots for period-based attendance
- `start_time`, `end_time`

**leave_requests:**
- Approved absences auto-fill as 'excused'
- `status` = 'approved' for integration

## Requirements Breakdown

### Phase 1: Database Queries & API
- [ ] Create Supabase query functions for attendance CRUD
- [ ] Implement API routes for attendance operations
- [ ] Add attendance retrieval by class/date/period
- [ ] Implement bulk attendance save
- [ ] Add attendance statistics calculation

### Phase 2: Teacher Assignment Logic
- [ ] Query teacher's assigned classes (homeroom + subject)
- [ ] Differentiate between GVCN and GVBM roles
- [ ] Filter classes based on teacher's schedule
- [ ] Implement period-based class access
- [ ] Add authentication-based access control

### Phase 3: Attendance Form UI
- [ ] Update UI to use real database queries
- [ ] Implement period selection (if subject teacher)
- [ ] Add leave request auto-fill button
- [ ] Real-time statistics calculation
- [ ] Save draft and confirm functionality

### Phase 4: Notification Integration
- [ ] Create notification service for attendance
- [ ] Send alerts to parents for absent students
- [ ] Send alerts to parents for late students
- [ ] Batch notifications for multiple students
- [ ] Handle multiple guardians per student

### Phase 5: Testing
- [ ] Test homeroom teacher attendance flow
- [ ] Test subject teacher attendance flow
- [ ] Test parent notification delivery
- [ ] Test leave request integration
- [ ] Test attendance statistics accuracy

## Success Criteria

- [ ] Teachers can view their assigned classes (homeroom + subject)
- [ ] Teachers can mark attendance by period or full day
- [ ] Approved leave requests auto-fill as excused
- [ ] Parents receive notifications for absent/late students
- [ ] Attendance statistics calculate correctly
- [ ] RLS policies prevent unauthorized access
- [ ] UI matches wireframe design

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS policies block teacher access | High | Verify RLS before implementation |
| Complex teacher-class relationships | Medium | Clear query patterns with joins |
| Notification delivery failures | Medium | Error handling + retry logic |
| Performance with large classes | Low | Pagination + query optimization |
| Multiple guardians confusion | Low | Use is_primary flag |

## Technical Considerations

### Teacher Assignment Logic
- **Homeroom (GVCN):** Query `class_teachers` where `teacher_id = current_teacher`
- **Subject (GVBM):** Query `schedules` where `teacher_id = current_teacher`
- **Period-based:** Subject teachers only see specific periods

### Attendance Status Mapping
- Wireframe: P (Present), A (Absent), L (Late), E (Excused)
- Database: 'present', 'absent', 'late', 'excused'

### Parent Notification Flow
1. Teacher confirms attendance
2. System identifies absent/late students
3. Query guardians via `student_guardians`
4. Create notifications via `createNotification()`
5. Deliver via WebSocket/email

### Leave Request Integration
```sql
-- Query to get approved leave requests
SELECT lr.student_id, lr.start_date, lr.end_date, lr.reason
FROM leave_requests lr
WHERE lr.status = 'approved'
AND lr.start_date <= :attendance_date
AND lr.end_date >= :attendance_date
```

## Dependencies

- Supabase RLS policies configured for teacher role
- Notification system (already implemented)
- Leave request system (already implemented)
- Teacher authentication (needs integration)

## Next Steps

1. Complete Phase 01: Database Queries & API
2. Verify RLS policies allow teacher operations
3. Test with real teacher accounts
4. Integrate authentication for teacher ID resolution

## Unresolved Questions

1. Should attendance be confirmed immediately or end of day?
2. How to handle attendance modifications after notifications sent?
3. Should teachers be able to mark future attendance?
4. What timezone to use for attendance date?
5. How to handle substitute teachers?
