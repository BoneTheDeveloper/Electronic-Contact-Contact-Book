---
title: "Phase 1: Database Setup"
description: "Create parent-child relationships in student_guardians table"
status: pending
priority: P1
effort: 1h
branch: master
tags: [database, supabase, setup]
created: 2026-01-23
---

## Overview

Populate the `student_guardians` junction table with sample parent-child relationships to enable multi-child support.

**Context Links:**
- Research: [Parent-Child Selection Research](../../reports/researcher-260123-2151-parent-child-selection.md)
- Schema: Database has `student_guardians` table (currently empty)
- Test Parent: Phone `0901234569` in profiles table

## Requirements

### Functional
- Link test parent to 2-3 students
- Set primary/secondary guardian flags
- Ensure referential integrity
- Verify data with test queries

### Non-Functional
- Maintain existing data integrity
- Use valid UUIDs from actual records
- Follow existing schema constraints

## Current Schema

```sql
student_guardians (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  guardian_id UUID REFERENCES parents(id),
  is_primary BOOLEAN DEFAULT false,
  relationship_type VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Implementation Steps

### Step 1: Identify Test Data IDs (10 min)

Query existing profiles/students/parents to get valid UUIDs:

```sql
-- Get parent profile ID
SELECT id, full_name, phone FROM profiles WHERE phone = '0901234569';

-- Get parent record ID
SELECT id, profile_id FROM parents WHERE profile_id = [PROFILE_ID_FROM_ABOVE];

-- Get available students
SELECT s.id, p.full_name, s.student_code
FROM students s
JOIN profiles p ON s.profile_id = p.id
WHERE p.status = 'active'
LIMIT 5;
```

**Expected Output:**
- Parent profile UUID
- Parent record UUID
- 2-3 student UUIDs

### Step 2: Create Sample Relationships (15 min)

Insert parent-child relationships:

```sql
INSERT INTO student_guardians (student_id, guardian_id, is_primary, relationship_type, created_at, updated_at)
VALUES
  -- First child (primary)
  (
    '[STUDENT_1_UUID]',
    '[PARENT_UUID]',
    true,
    'father',
    NOW(),
    NOW()
  ),
  -- Second child (secondary)
  (
    '[STUDENT_2_UUID]',
    '[PARENT_UUID]',
    false,
    'father',
    NOW(),
    NOW()
  ),
  -- Optional third child
  (
    '[STUDENT_3_UUID]',
    '[PARENT_UUID]',
    false,
    'father',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;
```

### Step 3: Verify Data (10 min)

```sql
-- Verify insertions
SELECT
  sg.id,
  sg.is_primary,
  sg.relationship_type,
  p.full_name AS parent_name,
  prof.phone AS parent_phone,
  s.student_code,
  prof_s.full_name AS student_name
FROM student_guardians sg
JOIN parents p ON sg.guardian_id = p.id
JOIN profiles prof ON p.profile_id = prof.id
JOIN students s ON sg.student_id = s.id
JOIN profiles prof_s ON s.profile_id = prof_s.id
WHERE prof.phone = '0901234569'
ORDER BY sg.is_primary DESC, prof_s.full_name;
```

**Expected Result:** 2-3 rows showing parent-student links

### Step 4: Test Query (5 min)

Verify mobile app can fetch this data:

```sql
-- Simulate mobile query
SELECT
  sg.student_id,
  sg.is_primary,
  s.id,
  s.student_code,
  s.grade,
  s.section,
  prof.full_name,
  prof.avatar_url
FROM student_guardians sg
JOIN students s ON sg.student_id = s.id
JOIN profiles prof ON s.profile_id = prof.id
WHERE sg.guardian_id = '[PARENT_UUID]'
  AND prof.status = 'active';
```

## Success Criteria

- [ ] `student_guardians` has 2-3 rows for test parent
- [ ] All UUID references valid (FK constraints satisfied)
- [ ] One child marked as `is_primary = true`
- [ ] Verification query returns correct data
- [ ] Test query returns properly structured results

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Invalid UUIDs | Low | High | Use queries to get real IDs |
| Duplicate entries | Low | Low | `ON CONFLICT DO NOTHING` |
| FK constraint fails | Low | High | Verify all IDs exist before insert |

## Rollback Plan

```sql
-- Remove test relationships if needed
DELETE FROM student_guardians
WHERE guardian_id = '[PARENT_UUID]';
```

## Deliverables

1. SQL script with actual UUIDs filled in
2. Verification query results (screenshot/text)
3. Documented parent UUID for Phase 2

## Next Phase

Once database setup complete, proceed to [Phase 2: API Integration](./phase-02-api-integration.md)
