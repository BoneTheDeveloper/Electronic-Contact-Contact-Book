# Phase 06 - Leave Request Data

**Status:** Pending
**Priority:** Medium

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- 0 leave requests exist
- Dashboard shows "leave requests" count
- Only homeroom teacher (6A) sees leave requests for that class
- Need mix of pending/approved/rejected

## Requirements

### Leave Request Structure
```sql
INSERT INTO leave_requests (
  student_id, class_id, request_type,
  start_date, end_date, reason, status,
  created_by
)
VALUES (
  student_uuid, '6A', 'sick',
  '2025-01-20', '2025-01-22', 'Sốt xuất huyết', 'pending',
  parent_uuid
);
```

### Request Types
- sick (ốm đau)
- personal (cá nhân)
- family (gia đình)
- other (khác)

### Status Distribution
| Status | Count |
|--------|-------|
| Pending | 3 |
| Approved | 4 |
| Rejected | 1 |
| Cancelled | 1 |

## Implementation Steps

1. **Select 6A students** (homeroom class only)
2. **Create leave requests** with realistic Vietnamese reasons
3. **Vary dates** across past month
4. **Mix statuses** for variety
5. **Link to parent profiles** as created_by

## Success Criteria

- 9 leave requests for 6A students
- Dashboard shows pending count (3)
- All requests have valid student, class, parent links

## Related Files

- `apps/web/lib/supabase/queries.ts:1230` - getLeaveRequests()
- `apps/web/app/api/teacher/dashboard/route.ts:22` - Leave request query
