# Phase 03: Schedule & Dashboard

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md) | [phase-01-setup-core-data.md](phase-01-setup-core-data.md)

## Overview

Implement real Supabase queries for schedule data and update the Dashboard screen to display real student information.

## Key Insights

1. Schedule requires joining `schedules`, `subjects`, `teachers`, `periods`, `classes` tables
2. Dashboard displays student profile info from Phase 01
3. Schedule screen has complex UI with day/period grouping
4. Need to handle makeup classes and exam schedules

## Requirements

### Functional Requirements
- [ ] Load weekly schedule from Supabase
- [ ] Display teacher names and room numbers
- [ ] Support day-of-week filtering
- [ ] Handle empty schedules gracefully
- [ ] Dashboard displays real student name, class info

### Technical Requirements
- Efficient query with proper joins
- Group schedule by day and period
- Map period IDs to time ranges

## Architecture

**Schedule Query Structure:**
```
schedules
  → subjects (subject name, code)
  → teachers (teacher name)
  → periods (time range)
  → classes (class info)
  → enrollments (filter by student's class)
```

## Related Code Files

- `apps/mobile/src/screens/student/Schedule.tsx` - Schedule screen (lines 1-630)
- `apps/mobile/src/screens/student/Dashboard.tsx` - Dashboard screen (lines 1-243)
- `apps/mobile/src/stores/student.ts` - Student store

## Implementation Steps

### Schedule Implementation

1. **Create Schedule Query** (`src/lib/supabase/queries/schedules.ts`)
   ```typescript
   export async function getStudentSchedule(
     classId: string,
     semester: string = '1',
     schoolYear: string = '2024-2025'
   ): Promise<ScheduleItem[]> {
     // Query schedules with subjects, teachers, periods
     // Filter by class_id, semester, school_year
   }
   ```

2. **Update Student Store**
   - Replace `MOCK_SCHEDULE` in `loadSchedule()`
   - Add semester and school year parameters
   - Group by day of week

3. **Test Schedule Screen**
   - Verify schedule displays correctly
   - Test day switching
   - Verify teacher names and rooms display

### Dashboard Updates

1. **Update Dashboard Screen**
   - Already uses `useStudentStore()` for student data
   - Should display real data after Phase 01
   - Verify avatar, name, class display correctly

2. **Test Dashboard**
   - Verify student info displays
   - Test with different students

## Todo List

- [ ] Create schedule query with all joins
- [ ] Update student store for schedule
- [ ] Test schedule screen with real data
- [ ] Verify day/period grouping works
- [ ] Test dashboard with real student data
- [ ] Handle empty schedules gracefully

## Success Criteria

- [ ] Schedule displays real class schedule
- [ ] Teacher names show correctly
- [ ] Room numbers display correctly
- [ ] Day switching works
- [ ] Dashboard shows real student name and class
- [ ] Empty schedules handled gracefully

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex schedule query slow | Medium | Optimize joins, add indexes |
| Missing teacher/period data | Low | Handle nulls gracefully |
| Schedule data incomplete | Low | Show partial data with indicators |

## Database Query

**Schedule Query:**
```sql
SELECT
  s.id,
  s.day_of_week,
  s.semester,
  s.school_year,
  s.room,
  s.notes,
  p.id as period_id,
  p.name as period_name,
  p.start_time,
  p.end_time,
  sub.id as subject_id,
  sub.name as subject_name,
  sub.code as subject_code,
  t.id as teacher_id,
  prof.full_name as teacher_name
FROM schedules s
JOIN periods p ON s.period_id = p.id
JOIN subjects sub ON s.subject_id = sub.id
JOIN teachers t ON s.teacher_id = t.id
JOIN profiles prof ON t.id = prof.id
WHERE s.class_id = $1
  AND s.semester = $2
  AND s.school_year = $3
ORDER BY s.day_of_week, p.id
```

## Next Steps

After completing this phase:
1. Move to [phase-04-leave-requests-appeals.md](phase-04-leave-requests-appeals.md)
2. Core screens (Dashboard, Grades, Attendance, Schedule) now use real data
3. Test complete student flow

## Unresolved Questions

- Should we implement real-time schedule updates?
- How to handle temporary schedule changes (makeup classes)?
