# Phase 3: Execution Guide

**Status:** Pending
**Priority:** High
**Date:** 2025-01-25

## Overview

Execute the SQL seeding script and verify data creation.

## Context

- [Seeding Script](seed-gv001-data.sql)
- Must replace placeholder IDs with actual UUIDs
- Execute via Supabase Dashboard or MCP

## Prerequisites

1. ✅ SQL script created
2. ⏳ Get GV001 teacher.id UUID
3. ⏳ Get ST2024001 student.id UUID
4. ⏳ Replace placeholders in script
5. ⏳ Execute script
6. ⏳ Verify data

## Implementation Steps

### Step 1: Get Required UUIDs

```sql
-- Get GV001's teacher ID
SELECT id, employee_code, email
FROM teachers t
JOIN profiles p ON t.id = p.id
WHERE employee_code = 'GV001';

-- Get ST2024001's student ID
SELECT id, student_code, email
FROM students s
JOIN profiles p ON s.id = p.id
WHERE student_code = 'ST2024001';
```

### Step 2: Update Script

Replace in `seed-gv001-data.sql`:
- `TEACHER_ID_HERE` → actual GV001 teacher UUID
- `STUDENT_ID_HERE` → actual ST2024001 student UUID

### Step 3: Execute Script

**Option A: Supabase Dashboard**
1. Go to Supabase Dashboard
2. SQL Editor
3. Paste script
4. Run

**Option B: Supabase MCP**
```bash
# Use mcp__supabase__execute_sql
```

### Step 4: Verify Data

```sql
-- Check classes created
SELECT * FROM classes WHERE id IN ('10A', '11B', '12C');

-- Check subjects created
SELECT * FROM subjects WHERE id IN ('toan', 'ly');

-- Check GV001 homeroom assignment
SELECT * FROM class_teachers WHERE class_id = '10A';

-- Check GV001 subject assignments
SELECT
  c.name as class_name,
  s.name as subject_name,
  sch.period_id,
  sch.day_of_week
FROM schedules sch
JOIN classes c ON sch.class_id = c.id
JOIN subjects s ON sch.subject_id = s.id
WHERE sch.teacher_id = 'TEACHER_ID_HERE';

-- Check ST2024001 enrollment
SELECT
  st.student_code,
  p.full_name,
  c.name as class_name
FROM enrollments e
JOIN students st ON e.student_id = st.id
JOIN profiles p ON st.id = p.id
JOIN classes c ON e.class_id = c.id
WHERE st.student_code = 'ST2024001';
```

## Success Criteria

- [ ] Grades 10, 11, 12 created
- [ ] Subjects Toán, Lý created
- [ ] Classes 10A, 11B, 12C created
- [ ] GV001 assigned as homeroom of 10A
- [ ] GV001 has 3 subject teaching schedules
- [ ] ST2024001 enrolled in 10A
- [ ] No foreign key errors
