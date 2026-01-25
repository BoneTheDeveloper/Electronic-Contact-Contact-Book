# Phase 07 - Grade Review Data

**Status:** Pending
**Priority:** Low

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- Dashboard shows "grade review requests" count
- Current query returns empty array (table may not exist yet)
- Grade reviews represent parent/student disputes

## Requirements

**Note:** The `grade_reviews` table may not exist. Check schema first.

If table exists:
```sql
INSERT INTO grade_reviews (
  grade_entry_id, requested_by, reason,
  status, created_at
)
VALUES (
  grade_uuid, parent_uuid, 'Đề nghị xem lại điểm',
  'pending', NOW()
);
```

### Status Distribution
| Status | Count |
|--------|-------|
| Pending | 2 |
| Approved | 1 |
| Rejected | 1 |

## Implementation Steps

1. **Check if grade_reviews table exists**
2. **If not**, skip or create table
3. **Create review requests** for a few grade entries
4. **Link to parent** as requested_by

## Success Criteria

- 4 grade review requests
- Dashboard shows pending count (2)
- Reviews link to valid grade entries

## Related Files

- `apps/web/lib/supabase/queries.ts:1515` - getGradeReviewRequests()
