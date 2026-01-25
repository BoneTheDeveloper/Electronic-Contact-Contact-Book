# Phase 01 - Student Data

**Status:** DONE
**Completed:** 2025-01-25
**Priority:** Critical (foundation for all other phases)

## Context

[plan.md](./plan.md) | Overview

## Key Insights

- Currently only 1 student exists (ST2024001 in 9A)
- Need 25 students across 3 classes (6A, 7B, 8C)
- Each student needs: profile, student record, enrollment, parent, guardian relationship

## Requirements

Create 25 new students:

| Class | Students | Gender Split |
|-------|----------|--------------|
| 6A (homeroom) | 10 | 5 male, 5 female |
| 7B | 8 | 4 male, 4 female |
| 8C | 7 | 3 male, 4 female |

### Student Data Structure
```sql
-- 1. Create auth user (via Supabase Auth or bypass with SQL)
-- 2. Create profile
INSERT INTO profiles (id, email, role, full_name, phone, status)
VALUES (uuid, email, 'student', name, phone, 'active');

-- 3. Create student record
INSERT INTO students (id, student_code, date_of_birth, gender)
VALUES (uuid, auto_code, dob, gender);

-- 4. Create enrollment
INSERT INTO enrollments (student_id, class_id, academic_year, status)
VALUES (student_uuid, class_id, '2024-2025', 'active');

-- 5. Link to existing parent or create new parent
-- Use existing parent: 61363a34-b945-4951-ae70-6109d47f3a75
INSERT INTO student_guardians (student_id, guardian_id, is_primary)
VALUES (student_uuid, parent_uuid, true);
```

## Implementation Steps

1. **Generate Vietnamese names** - Use common names for realism
2. **Create profiles** - Insert with auto-generated UUIDs
3. **Create students** - Let DB generate student codes
4. **Create enrollments** - Link to appropriate class
5. **Link parents** - Use existing test parent + create new ones

## Success Criteria

- 25 new student profiles created
- All students enrolled in correct classes
- Each student has guardian relationship
- student_code auto-generated correctly

## Summary

Successfully created 25 students across 3 classes for teacher GV0001:
- 6A (homeroom): 10 students (5 male, 5 female)
- 7B: 8 students (4 male, 4 female)
- 8C: 7 students (3 male, 4 female)

Each student was created with:
- Supabase auth user and profile
- Student record with auto-generated code
- Active enrollment in assigned class
- Guardian relationship to existing or new test parent

## Related Files

- `supabase/migrations/*` - Schema references
