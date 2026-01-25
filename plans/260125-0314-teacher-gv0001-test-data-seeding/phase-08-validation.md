# Phase 08 - Validation

**Status:** Pending
**Priority:** Critical

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- Must verify dashboard displays correctly after seeding
- Check all data relationships are valid
- Ensure no foreign key violations

## Validation Checklist

### Dashboard Stats
- [ ] `teaching` count matches classes
- [ ] `homeroom` count = 1
- [ ] `students` count = 25
- [ ] `pendingAttendance` > 0 for today
- [ ] `pendingGrades` = 0 (all graded)
- [ ] `gradeReviewRequests` shows correct count
- [ ] `leaveRequests` shows pending count
- [ ] `todaySchedule` shows current day's classes

### Data Sections
- [ ] `gradeReviews` array populated
- [ ] `leaveRequests` filtered by status='pending'
- [ ] `schedule` returns week's schedule
- [ ] `classes` includes all 3 classes
- [ ] `assessments.evaluated` count correct
- [ ] `assessments.pending` count correct
- [ ] `assessments.positive` count (rating >= 4)
- [ ] `assessments.needsAttention` count

### API Response Test
```bash
curl "http://localhost:3000/api/teacher/dashboard?teacherId=33b6ed21-c8bc-4a74-8af3-73e93829aff0"
```

## Implementation Steps

1. **Run dashboard API** with teacher ID
2. **Verify response structure** matches expected
3. **Check counts** in each section
4. **Test frontend** loads correctly
5. **Verify no errors** in console

## Success Criteria

- Dashboard API returns 200 status
- All stats populate correctly
- Frontend displays data without errors
- No foreign key violations in DB

## Related Files

- `apps/web/app/api/teacher/dashboard/route.ts` - Dashboard endpoint
