# Phase 04 - Grade Data

**Status:** Pending
**Priority:** High

## Context

[plan.md](./plan.md) | Overview
[phase-03-assessment-data.md](./phase-03-assessment-data.md) | Prerequisite

## Key Insights

- 0 grade entries exist
- Each student needs grades for each assessment
- Grade distribution should be realistic (bell curve)

## Requirements

### Grade Entry Structure
```sql
INSERT INTO grade_entries (
  assessment_id, student_id, score, status,
  graded_by, graded_at
)
VALUES (
  assessment_uuid, student_uuid, 8.5, 'graded',
  '33b6ed21-c8bc-4a74-8af3-73e93829aff0', NOW()
);
```

### Grade Distribution Strategy
- 15%: Excellent (9-10)
- 25%: Good (7-8.5)
- 40%: Average (5-6.5)
- 15%: Below average (3-4.5)
- 5%: Poor (0-2.5)

## Implementation Steps

1. **Get all assessment IDs** from phase 3
2. **Get all student IDs** for each class
3. **Generate grade entries** with realistic scores
4. **Set graded_by** to teacher GV0001

## Success Criteria

- ~125 grade entries (25 students × 5 assessments/student)
- Each assessment has grades for all class students
- Dashboard shows grade statistics

## Related Files

- `apps/web/lib/supabase/queries.ts:1104` - getGradeEntrySheet()
