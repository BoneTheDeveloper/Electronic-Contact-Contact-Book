# Phase 02 - Schedule Data

**Status:** Pending
**Priority:** High

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- Teacher already has 8 schedule entries (3 for 6A, 3 for 8C, 2 for 7B)
- Need to verify schedule covers full week properly
- Schedule drives dashboard's "today's schedule" display

## Current Schedule

| Class | Subject | Day | Period | Room |
|-------|---------|-----|--------|------|
| 6A | Toán | Tue (2) | 1 | A101 |
| 6A | Toán | Thu (4) | 1 | A101 |
| 6A | Toán | Sat (6) | 1 | A101 |
| 7B | Vật Lý | Wed (3) | 4 | B201 |
| 7B | Vật Lý | Fri (5) | 4 | B201 |
| 8C | Toán | Tue (2) | 2 | C301 |
| 8C | Toán | Thu (4) | 2 | C301 |
| 8C | Toán | Sat (6) | 2 | C301 |

## Requirements

Schedule is adequate. No changes needed unless:
- Want to add more periods per class
- Want to add more subjects

## Implementation Steps

1. **Verify** existing schedule covers dashboard needs
2. **Optional**: Add more schedule entries for variety

## Success Criteria

- Dashboard shows today's schedule correctly
- All 3 classes appear in teacher's class list

## Related Files

- `apps/web/app/api/teacher/dashboard/route.ts:19` - Schedule query
