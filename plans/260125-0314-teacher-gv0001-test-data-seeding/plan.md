# Teacher GV0001 Test Data Seeding Plan

**Status:** In Progress
**Phase 01:** 2025-01-25 DONE
**Created:** 2025-01-25
**Target:** Teacher GV0001 (33b6ed21-c8bc-4a74-8af3-73e93829aff0)

## Overview

Create complete realistic test data for teacher GV0001 to fully populate all dashboard functions:
- Stats (teaching classes, homeroom, students, pending items)
- Grade reviews
- Leave requests
- Schedule
- Classes with students
- Assessments with grades

## Current State

| Metric | Value |
|--------|-------|
| Classes Taught | 3 (6A, 7B, 8C) |
| Homeroom | 1 (6A) |
| Students | 1 |
| Assessments | 0 |
| Grades | 0 |
| Attendance | 0 |
| Leave Requests | 0 |

## Phases

| Phase | Status | File |
|-------|--------|------|
| 01 - Student Data | [DONE](./phase-01-student-data.md) | Create 25-30 students across 3 classes |
| 02 - Schedule Data | [pending](./phase-02-schedule-data.md) | Complete weekly schedule for all classes |
| 03 - Assessment Data | [pending](./phase-03-assessment-data.md) | Create quizzes, midterms, finals |
| 04 - Grade Data | [pending](./phase-04-grade-data.md) | Generate realistic grade entries |
| 05 - Attendance Data | [pending](./phase-05-attendance-data.md) | Daily attendance for current month |
| 06 - Leave Request Data | [pending](./phase-06-leave-request-data.md) | Pending/approved/rejected requests |
| 07 - Grade Review Data | [pending](./phase-07-grade-review-data.md) | Parent/student grade reviews |
| 08 - Validation | [pending](./phase-08-validation.md) | Verify dashboard displays correctly |

## Target Data

### Students
- **6A**: 10 students (homeroom class)
- **7B**: 8 students
- **8C**: 7 students
- **Total**: 25 students

### Assessments per Class
- 3 quizzes per subject
- 1 midterm per subject
- 1 final per subject

### Attendance
- Past 30 days
- All periods for each class

## Related Code

| File | Purpose |
|------|---------|
| `apps/web/app/api/teacher/dashboard/route.ts` | Dashboard endpoint |
| `apps/web/lib/supabase/queries.ts` | Data queries |
| `docs/test_account.md` | Test account reference |
