# Student Supabase Integration Plan

**Date:** 2026-01-25
**Priority:** High
**Status:** Planning

## Overview

Integrate Supabase database with the mobile app's student screens to replace mock data with real data queries and mutations.

**Approach:** Prioritize core screens (Dashboard, Grades, Attendance, Schedule) with full CRUD operations using direct Supabase client.

## Phases

| Phase | Status | Link |
|-------|--------|------|
| 01: Setup & Core Data | Pending | [phase-01-setup-core-data.md](phase-01-setup-core-data.md) |
| 02: Grades & Attendance | Pending | [phase-02-grades-attendance.md](phase-02-grades-attendance.md) |
| 03: Schedule & Dashboard | Pending | [phase-03-schedule-dashboard.md](phase-03-schedule-dashboard.md) |
| 04: Leave Requests & Appeals | Pending | [phase-04-leave-requests-appeals.md](phase-04-leave-requests-appeals.md) |
| 05: News & Notifications | Pending | [phase-05-news-notifications.md](phase-05-news-notifications.md) |
| 06: Payments & Summary | Pending | [phase-06-payments-summary.md](phase-06-payments-summary.md) |

## Quick Stats

- **Total Phases:** 6
- **Screens to Update:** 9
- **Supabase Tables Used:** 12
- **New Files:** ~15
- **Modified Files:** ~10

## Related Code Files

- `apps/mobile/src/stores/student.ts` - Student data store (mock → real)
- `apps/mobile/src/screens/student/*` - Student screen components
- `apps/mobile/src/screens/student/Dashboard.tsx` - Dashboard screen
- `apps/mobile/src/screens/student/Grades.tsx` - Grades screen
- `apps/mobile/src/screens/student/Attendance.tsx` - Attendance screen
- `apps/mobile/src/screens/student/Schedule.tsx` - Schedule screen

## Database Tables

**Primary Tables:**
- `profiles` - User profiles
- `students` - Student data
- `enrollments` - Class enrollments
- `classes` - Class information
- `grades` - Grade levels
- `periods` - Time periods
- `subjects` - Subject information
- `schedules` - Class schedules
- `assessments` - Assessment/quiz definitions
- `grade_entries` - Student grade records
- `attendance` - Attendance records
- `leave_requests` - Leave absence requests

## Success Criteria

- [ ] Core screens (Dashboard, Grades, Attendance, Schedule) display real Supabase data
- [ ] Student can create leave requests that save to database
- [ ] Student can submit grade appeals that save to database
- [ ] Error handling and loading states work properly
- [ ] RLS policies allow students to read their own data
- [ ] App works with real authentication

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| RLS policies may block student data access | Verify RLS policies work for student role |
| API changes may break existing screens | Keep mock data as fallback during development |
| Performance issues with large datasets | Implement pagination and query optimization |
| Offline functionality not supported | Add optimistic UI updates |

## Next Steps

1. Complete Phase 01: Setup Supabase client and core student data loading
2. Verify RLS policies allow students to read their data
3. Test with real student accounts
