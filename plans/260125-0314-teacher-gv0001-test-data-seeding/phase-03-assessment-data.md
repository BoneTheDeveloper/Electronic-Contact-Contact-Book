# Phase 03 - Assessment Data

**Status:** Pending
**Priority:** High

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- 0 assessments exist currently
- Need assessments for Toán (6A, 8C) and Vật Lý (7B)
- Assessments are prerequisite for grade entries

## Requirements

### Assessments per Class

| Class | Subject | Quizzes | Midterm | Final |
|-------|---------|---------|---------|-------|
| 6A | Toán | 3 | 1 | 1 |
| 7B | Vật Lý | 3 | 1 | 1 |
| 8C | Toán | 3 | 1 | 1 |
| **Total** | | **9** | **3** | **3** |

### Assessment Structure
```sql
INSERT INTO assessments (
  id, class_id, subject_id, teacher_id,
  name, assessment_type, date, max_score,
  semester, school_year
)
VALUES (
  uuid, class_id, subject_id, '33b6ed21-c8bc-4a74-8af3-73e93829aff0',
  '15 phút lần 1', 'quiz', '2025-01-10', 10,
  '1', '2024-2025'
);
```

### Subject IDs
```sql
SELECT id, name FROM subjects;
-- Need to verify: 'toan' or 'Toán', 'ly' or 'Vật Lý'
```

## Implementation Steps

1. **Query subject IDs** for Toán and Vật Lý
2. **Create assessments** with realistic dates (past 30 days)
3. **Vary assessment names** (15 phút, 1 tiết, giữa kỳ, cuối kỳ)

## Success Criteria

- 15 assessments created total
- Each class has 5 assessments
- Dashboard shows pending assessments count

## Related Files

- `apps/web/lib/supabase/queries.ts:1040` - getAssessments()
