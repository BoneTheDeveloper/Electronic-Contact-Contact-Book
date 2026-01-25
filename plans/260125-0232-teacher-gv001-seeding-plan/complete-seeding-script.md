-- ==========================================
-- COMPLETE GV001 DATA SEEDING SCRIPT
-- ==========================================
-- Execute this in Supabase Dashboard SQL Editor
-- Or use Supabase MCP after creating auth user
-- ==========================================

-- ==========================================
-- IMPORTANT: PRE-REQUISITE
-- ==========================================
-- You MUST first create the auth user via Supabase Auth:
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Email: gv001@econtact.vn
-- 4. Password: Test123456!
-- 5. Auto Confirm User: ON
-- 6. Click "Create user"
-- 7. Copy the user UUID from the users table
-- 8. Replace USER_UUID_HERE below with actual UUID

-- ==========================================
-- STEP 1: CREATE PROFILE & TEACHER RECORD
-- ==========================================

-- Create profile (replace USER_UUID_HERE with actual auth.users.id)
INSERT INTO profiles (id, email, role, full_name, phone, status, created_at, updated_at)
VALUES (
  'USER_UUID_HERE', -- Replace with actual UUID from auth.users
  'gv001@econtact.vn',
  'teacher',
  'Nguyễn Văn Giáo',
  '0901234568',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Create teacher record with auto-generated employee_code
INSERT INTO teachers (id, employee_code, subject, join_date, created_at, updated_at)
VALUES (
  'USER_UUID_HERE',
  'GV0001',
  'Toán, Lý',
  CURRENT_DATE,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  employee_code = 'GV0001',
  subject = 'Toán, Lý',
  updated_at = NOW();

-- ==========================================
-- STEP 2: FOUNDATION DATA (Grades, Subjects, Classes)
-- ==========================================

-- Insert Grades 10, 11, 12
INSERT INTO grades (id, name, display_order, created_at)
VALUES
  ('10', 'Lớp 10', 10, NOW()),
  ('11', 'Lớp 11', 11, NOW()),
  ('12', 'Lớp 12', 12, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Subjects (Toán, Lý)
INSERT INTO subjects (id, name, name_en, code, is_core, display_order, description, created_at)
VALUES
  ('toan', 'Toán', 'Mathematics', 'TOAN', true, 1, 'Môn Toán học', NOW()),
  ('ly', 'Vật Lý', 'Physics', 'LY', true, 2, 'Môn Vật Lý', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Classes (10A, 11B, 12C)
INSERT INTO classes (id, name, grade_id, academic_year, room, capacity, current_students, status, created_at, updated_at)
VALUES
  ('10A', '10A', '10', '2024-2025', 'A101', 40, 25, 'active', NOW(), NOW()),
  ('11B', '11B', '11', '2024-2025', 'B201', 40, 30, 'active', NOW(), NOW()),
  ('12C', '12C', '12', '2024-2025', 'C301', 40, 28, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- STEP 3: TEACHER ASSIGNMENTS
-- ==========================================

-- Homeroom Assignment: GV001 is homeroom teacher for 10A
INSERT INTO class_teachers (id, class_id, teacher_id, academic_year, semester, is_primary, appointed_date, notes, created_at)
VALUES (
  gen_random_uuid(),
  '10A',
  'USER_UUID_HERE',
  '2024-2025',
  'all',
  true,
  CURRENT_DATE,
  'Giáo viên chủ nhiệm',
  NOW()
) ON CONFLICT DO NOTHING;

-- Subject Teaching: GV001 teaches Toán for 10A
-- Period 1 (7:00-7:45) on Monday (2), Wednesday (4), Friday (6)
INSERT INTO schedules (class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
VALUES
  ('10A', 'toan', 'USER_UUID_HERE', 1, 2, 'A101', '1', '2024-2025', NOW(), NOW()),
  ('10A', 'toan', 'USER_UUID_HERE', 1, 4, 'A101', '1', '2024-2025', NOW(), NOW()),
  ('10A', 'toan', 'USER_UUID_HERE', 1, 6, 'A101', '1', '2024-2025', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Subject Teaching: GV001 teaches Lý for 11B
-- Period 4 (9:15-10:00) on Tuesday (3), Thursday (5)
INSERT INTO schedules (class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
VALUES
  ('11B', 'ly', 'USER_UUID_HERE', 4, 3, 'B201', '1', '2024-2025', NOW(), NOW()),
  ('11B', 'ly', 'USER_UUID_HERE', 4, 5, 'B201', '1', '2024-2025', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Subject Teaching: GV001 teaches Toán for 12C
-- Period 2 (7:50-8:35) on Monday (2), Wednesday (4), Friday (6)
INSERT INTO schedules (class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
VALUES
  ('12C', 'toan', 'USER_UUID_HERE', 2, 2, 'C301', '1', '2024-2025', NOW(), NOW()),
  ('12C', 'toan', 'USER_UUID_HERE', 2, 4, 'C301', '1', '2024-2025', NOW(), NOW()),
  ('12C', 'toan', 'USER_UUID_HERE', 2, 6, 'C301', '1', '2024-2025', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ==========================================
-- STEP 4: ENROLL TEST STUDENT IN 10A
-- ==========================================

-- Get ST2024001 student ID and enroll in 10A
INSERT INTO enrollments (student_id, class_id, academic_year, status, enrollment_date, created_at, updated_at)
SELECT id, '10A', '2024-2025', 'active', CURRENT_DATE, NOW(), NOW()
FROM students
WHERE student_code = 'ST2024001'
ON CONFLICT DO NOTHING;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- 1. Verify GV001 account
SELECT
  p.email,
  p.full_name,
  t.employee_code,
  t.subject
FROM profiles p
JOIN teachers t ON p.id = t.id
WHERE p.email = 'gv001@econtact.vn' OR t.employee_code = 'GV0001';

-- 2. Verify classes created
SELECT id, name, grade_id, room, current_students
FROM classes
WHERE id IN ('10A', '11B', '12C')
ORDER BY name;

-- 3. Verify subjects created
SELECT id, name, name_en, code
FROM subjects
WHERE id IN ('toan', 'ly');

-- 4. Verify GV001 homeroom assignment
SELECT
  c.name as class_name,
  ct.is_primary as is_homeroom,
  ct.appointed_date
FROM class_teachers ct
JOIN classes c ON ct.class_id = c.id
WHERE ct.teacher_id = 'USER_UUID_HERE';

-- 5. Verify GV001 subject teaching assignments
SELECT
  c.name as class_name,
  s.name as subject_name,
  p.name as period_name,
  p.start_time,
  p.end_time,
  CASE sch.day_of_week
    WHEN 2 THEN 'Monday'
    WHEN 3 THEN 'Tuesday'
    WHEN 4 THEN 'Wednesday'
    WHEN 5 THEN 'Thursday'
    WHEN 6 THEN 'Friday'
    WHEN 7 => 'Saturday'
    WHEN 1 THEN 'Sunday'
  END as day_of_week
FROM schedules sch
JOIN classes c ON sch.class_id = c.id
JOIN subjects s ON sch.subject_id = s.id
JOIN periods p ON sch.period_id = p.id
WHERE sch.teacher_id = 'USER_UUID_HERE'
ORDER BY c.name, s.name, sch.day_of_week;

-- 6. Verify ST2024001 enrollment in 10A
SELECT
  st.student_code,
  p.full_name,
  c.name as class_name,
  e.status
FROM enrollments e
JOIN students st ON e.student_id = st.id
JOIN profiles p ON st.id = p.id
JOIN classes c ON e.class_id = c.id
WHERE st.student_code = 'ST2024001' AND c.id = '10A';

-- ==========================================
-- SUMMARY
-- ==========================================
-- After execution, GV001 should have:
-- - 1 homeroom class: 10A
-- - 3 subject-taught classes:
--   * 10A - Toán (3 periods/week)
--   * 11B - Lý (2 periods/week)
--   * 12C - Toán (3 periods/week)
-- - Test student ST2024001 enrolled in 10A
-- ==========================================
