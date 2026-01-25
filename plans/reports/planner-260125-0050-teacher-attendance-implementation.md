# Teacher Attendance Implementation Plan - Summary

**Date:** 2026-01-25
**Report Type:** Implementation Plan
**Status:** Created

## Overview

Created comprehensive 5-phase implementation plan for teacher attendance feature with real Supabase database integration, replacing existing mock data with full CRUD operations, teacher assignment logic, and parent notifications.

## Plan Location

`plans/260125-0050-teacher-attendance-implementation/`

## Phases Summary

| Phase | Focus | Effort | Priority |
|-------|-------|--------|----------|
| 01 | Database Queries & API | 2h | High |
| 02 | Teacher Assignment Logic | 1.5h | High |
| 03 | Attendance Form UI | 2.5h | High |
| 04 | Notification Integration | 1.5h | High |
| 05 | Testing | 0.5h | Medium |
| **Total** | | **8h** | |

## Key Features Implemented

### Phase 1: Database Queries & API
- `getClassAttendance()` - Query attendance by class/date/period
- `saveAttendanceRecords()` - Bulk upsert with conflict resolution
- `getAttendanceStats()` - Calculate present/absent/late/excused counts
- `getApprovedLeaveRequests()` - Query for auto-fill functionality
- API routes: GET/POST `/api/teacher/attendance`

### Phase 2: Teacher Assignment Logic
- `getTeacherClasses()` - Merge homeroom + subject assignments
- `isHomeroomTeacher()` - Check teacher role for specific class
- `getTeacherPeriodsForClass()` - Get accessible periods for subject teachers
- `getPeriods()` - Get all periods for UI
- Homeroom (GVCN) vs Subject (GVBM) role differentiation

### Phase 3: Attendance Form UI
- AttendanceForm client component with state management
- StudentRow with avatar, code, name display
- StatusButton components (P/A/L/E) with visual states
- AttendanceStats for real-time statistics
- Period selector for subject teachers
- Session selector (morning/afternoon) for homeroom
- Auto-fill button for approved leaves
- Save draft and confirm actions

### Phase 4: Notification Integration
- AttendanceNotificationService class
- Guardian resolution from student_guardians table
- Batch notifications for siblings (same guardian)
- createNotification() integration with existing system
- WebSocket delivery for real-time alerts
- Vietnamese language messages
- Different priorities: emergency (absent), normal (late)

### Phase 5: Testing
- Unit tests for query functions
- Integration tests for API routes
- E2E tests for homeroom and subject flows
- Performance benchmarks (<1s for 100 students)
- RLS policy verification
- Manual testing scenarios

## Database Tables Used

1. **attendance** - Primary attendance records
2. **students** - Student profiles with codes
3. **schedules** - Subject teacher class assignments
4. **class_teachers** - Homeroom teacher assignments
5. **periods** - Time periods for period-based attendance
6. **leave_requests** - Approved leaves for auto-fill
7. **student_guardians** - Parent-student relationships
8. **parents** - Guardian contact info
9. **notifications** - Notification records
10. **notification_recipients** - Notification delivery targets
11. **notification_logs** - Delivery tracking

## Technical Decisions

### Query Approach
- Direct Supabase client in server components
- React.cache() for query deduplication
- Upsert for idempotent attendance saves
- Join queries for efficient data loading

### State Management
- Server Components for initial data load
- Client Components for interactive form
- Map<string, AttendanceRecord> for O(1) lookups
- Real-time stats calculation from state

### Notification Strategy
- Batch by guardian (siblings get single notification)
- Emergency priority for absent students
- No notification for excused absences
- Async notification delivery (don't block attendance save)

### UI/UX Patterns
- Optimistic updates for button clicks
- Visual feedback (scale, border, shadow) for selected status
- Color-coded status buttons (green, red, yellow, blue)
- Real-time stats footer
- Loading and error states

## RLS Policy Requirements

```sql
-- Teachers can read classes they teach
CREATE POLICY "Teachers can view their classes"
ON class_teachers FOR SELECT
USING (teacher_id = auth.uid());

-- Teachers can read their schedule
CREATE POLICY "Teachers can view their schedule"
ON schedules FOR SELECT
USING (teacher_id = auth.uid());

-- Teachers can manage attendance for their classes
CREATE POLICY "Teachers can manage class attendance"
ON attendance FOR ALL
USING (
  class_id IN (
    SELECT class_id FROM class_teachers WHERE teacher_id = auth.uid()
    UNION
    SELECT class_id FROM schedules WHERE teacher_id = auth.uid()
  )
);
```

## Files to Create

### Query Functions
- `apps/web/lib/supabase/queries/attendance.ts`
- `apps/web/lib/supabase/queries/teachers.ts`

### API Routes
- `apps/web/app/api/teacher/attendance/route.ts`
- `apps/web/app/api/teacher/attendance/[classId]/route.ts`
- `apps/web/app/api/teacher/attendance/[classId]/confirm/route.ts`

### Services
- `apps/web/lib/services/attendance-service.ts`
- `apps/web/lib/services/attendance-notification-service.ts`

### Components
- `apps/web/app/teacher/attendance/[classId]/components/AttendanceForm.tsx`
- `apps/web/app/teacher/attendance/[classId]/components/StudentRow.tsx`
- `apps/web/app/teacher/attendance/[classId]/components/StatusButton.tsx`
- `apps/web/app/teacher/attendance/[classId]/components/AttendanceStats.tsx`

### Tests
- `apps/web/lib/__tests__/queries/attendance.test.ts`
- `apps/web/lib/__tests__/queries/teachers.test.ts`
- `apps/web/app/api/__tests__/teacher/attendance.test.ts`

## Files to Modify

- `apps/web/app/teacher/attendance/page.tsx` - Use real getTeacherClasses()
- `apps/web/app/teacher/attendance/[classId]/page.tsx` - Server component data loading
- `apps/web/app/api/attendance/route.ts` - Replace mock with real queries
- `apps/web/lib/types.ts` - Add TeacherClass, Period types

## Dependencies

- Existing notification system (confirmed available)
- Leave request system (confirmed available)
- Supabase RLS policies (need verification)
- Teacher auth session (need integration)

## Success Metrics

- [ ] Teachers can view assigned classes (homeroom + subject)
- [ ] Teachers can mark attendance (full-day or period-based)
- [ ] Approved leaves auto-fill as excused
- [ ] Parents receive notifications for absent/late students
- [ ] Attendance statistics accurate
- [ ] RLS policies prevent unauthorized access
- [ ] UI matches wireframe design
- [ ] Performance benchmarks met (<1s for 100 students)
- [ ] All automated tests pass
- [ ] Code coverage > 80%

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| RLS policies too restrictive | Test early with real teacher accounts |
| Performance with large classes | Add pagination, optimize queries |
| Notification delivery failures | Async delivery, retry logic, error logging |
| Complex state management | Use React hooks properly, add tests |
| Auth integration gaps | Use user metadata for teacher_id mapping |

## Next Steps

1. **Phase 01:** Implement database queries and API routes
2. Verify RLS policies allow teacher operations
3. **Phase 02:** Implement teacher assignment logic
4. Test with different teacher roles
5. **Phase 03:** Build attendance form UI
6. Match wireframe design exactly
7. **Phase 04:** Integrate notification system
8. Test notification delivery
9. **Phase 05:** Comprehensive testing
10. Deploy to staging for UAT

## Unresolved Questions

1. Should attendance be confirmed immediately or end of day?
2. How to handle attendance modifications after notifications sent?
3. Should teachers be able to mark future attendance?
4. What timezone for attendance date?
5. How to handle substitute teachers?
6. Should notifications be batched to end of day?
7. How to handle parents who opted out of notifications?

## References

- Wireframe: `docs/wireframe/Web_app/Teacher/attendance.html`
- Attendance Research: `plans/reports/researcher-260125-0045-attendance-system-analysis.md`
- Notification Research: `plans/reports/researcher-260125-0045-notification-system-research.md`
- Existing Code: `apps/web/app/teacher/attendance/`

## Notes

- Plan follows existing plan template structure
- Effort estimates based on similar features
- Phase order optimized for dependencies
- Testing phase can run in parallel with development
- All code includes TypeScript types
- Vietnamese language support throughout
- Wireframe design strictly followed
