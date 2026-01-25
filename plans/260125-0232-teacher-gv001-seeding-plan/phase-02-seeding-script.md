# Phase 2: SQL Seeding Script

**Status:** Ready
**Priority:** High
**Date:** 2025-01-25

## Overview

Create comprehensive SQL script to seed all required data for GV001 teacher.

## Context

- [Research Report](../../reports/researcher-260125-0233-supabase-database-teacher-data-seeding.md)
- Teacher: GV001 needs homeroom class + 3 subject classes
- Test student ST2024001 must be in homeroom class

## Key Findings from Research

**Critical gaps to fill:**
- subjects table EMPTY (need Toán, Lý)
- grades table missing 10, 11, 12
- Only 2 classes exist (6B, 9A)
- class_teachers and schedules tables EMPTY

## Data to Create

### 1. Foundation Data
```sql
-- Grades 10, 11, 12
-- Subjects: Toán, Lý
-- Classes: 10A, 11B, 12C
-- Periods (if missing)
```

### 2. Teacher GV001 Assignments
```sql
-- Homeroom: class_teachers (10A, is_primary=true)
-- Subject teaching: schedules (10A-Toán, 11B-Lý, 12C-Toán)
```

### 3. Student Enrollments
```sql
-- ST2024001 enrolled in 10A
-- Additional students for all 3 classes
```

## SQL Script Structure

```sql
-- 1. Foundation Data
INSERT INTO grades (id, name, display_order) VALUES ...
INSERT INTO subjects (id, name, name_en, code, ...) VALUES ...
INSERT INTO classes (id, name, grade_id, ...) VALUES ...

-- 2. Teacher Assignments
INSERT INTO class_teachers (class_id, teacher_id, is_primary, ...) VALUES ...
INSERT INTO schedules (class_id, subject_id, teacher_id, period_id, day_of_week, ...) VALUES ...

-- 3. Student Enrollments
INSERT INTO enrollments (student_id, class_id, ...) VALUES ...
```

## Implementation Steps

1. [ ] Create SQL script file
2. [ ] Add foundation data (grades, subjects, classes)
3. [ ] Add GV001 profile/teacher record if needed
4. [ ] Add homeroom assignment (10A)
5. [ ] Add subject teaching assignments (3 classes)
6. [ ] Add student enrollments
7. [ ] Verify script syntax

## Success Criteria

- SQL script runs without errors
- All foreign keys properly resolved
- GV001 has 1 homeroom + 3 subject classes
- ST2024001 enrolled in 10A
