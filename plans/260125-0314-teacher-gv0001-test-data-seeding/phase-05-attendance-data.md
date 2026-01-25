# Phase 05 - Attendance Data

**Status:** Pending
**Priority:** Medium

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- 0 attendance records exist
- Dashboard shows "pending attendance" count
- Need attendance for current date to show pending

## Requirements

### Attendance Structure
```sql
INSERT INTO attendance (
  student_id, class_id, date, period_id, status,
  recorded_by
)
VALUES (
  student_uuid, class_id, CURRENT_DATE, period_id, 'present',
  '33b6ed21-c8bc-4a74-8af3-73e93829aff0'
);
```

### Attendance Strategy

| Status | Percentage |
|--------|------------|
| Present | 85% |
| Late | 8% |
| Excused | 4% |
| Absent | 3% |

### Coverage
- Past 30 days
- All periods where teacher teaches
- Mix of statuses for realism

## Implementation Steps

1. **Get teacher's schedule** for periods
2. **Generate attendance** for past 30 days
3. **Leave today's attendance empty** - shows as "pending"
4. **Mix statuses** per distribution

## Success Criteria

- ~600 attendance records (3 classes × ~25 students × 8 periods × ~30 days)
- Dashboard shows accurate attendance rate
- Today's attendance shows as pending

## Related Files

- `apps/web/lib/supabase/queries.ts:1008` - getClassStudents()
- `apps/web/app/api/teacher/dashboard/route.ts:550` - pendingAttendance query
