-- ==========================================
-- Teacher GV001 Data Seeding Script
-- ==========================================
-- Purpose: Create comprehensive test data for teacher GV001
-- Teacher: GV001 (gv001@econtact.vn)
-- Subjects: Toán (Math), Lý (Physics)
-- ==========================================

-- ==========================================
-- STEP 1: FOUNDATION DATA
-- ==========================================

-- Insert Grades 10, 11, 12
INSERT INTO grades (id, name, display_order, created_at)
VALUES
  ('10', 'Lớp 10', 10, NOW()),
  ('11', 'Lớp 11', 11, NOW()),
  ('12', 'Lớp 12', 12, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Subjects (Toán, Lý)
INSERT INTO subjects (id, name, name_en, code, is_core, display_order, created_at)
VALUES
  ('toan', 'Toán', 'Mathematics', 'TOAN', true, 1, NOW()),
  ('ly', 'Vật Lý', 'Physics', 'LY', true, 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Classes (10A, 11B, 12C)
INSERT INTO classes (id, name, grade_id, academic_year, room, capacity, current_students, status, created_at, updated_at)
VALUES
  ('10A', '10A', '10', '2024-2025', 'A101', 40, 25, 'active', NOW(), NOW()),
  ('11B', '11B', '11', '2024-2025', 'B201', 40, 30, 'active', NOW(), NOW()),
  ('12C', '12C', '12', '2024-2025', 'C301', 40, 28, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- STEP 2: TEACHER GV001 PROFILE
-- ==========================================

-- First, get or create profile for GV001
-- Note: This assumes the profile exists from test account setup
-- If not, uncomment the following:

-- INSERT INTO profiles (id, email, role, full_name, phone, status, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   'gv001@econtact.vn',
--   'teacher',
--   'Nguyễn Văn Giáo',
--   '0901234568',
--   'active',
--   NOW(),
--   NOW()
-- );

-- Get GV001's teacher ID (assumes it exists)
-- Replace TEACHER_ID_HERE with actual UUID from your database

-- ==========================================
-- STEP 3: TEACHER ASSIGNMENTS
-- ==========================================

-- Homeroom Assignment: GV001 is homeroom teacher for 10A
-- Replace TEACHER_ID_HERE with actual GV001 teacher UUID
INSERT INTO class_teachers (id, class_id, teacher_id, academic_year, semester, is_primary, appointed_date, notes, created_at)
VALUES (
  gen_random_uuid(),
  '10A',
  'TEACHER_ID_HERE', -- Replace with GV001's actual teacher.id UUID
  '2024-2025',
  'all',
  true, -- is_primary: homeroom teacher
  CURRENT_DATE,
  'Giáo viên chủ nhiệm lớp 10A',
  NOW()
) ON CONFLICT DO NOTHING;

-- Subject Teaching Assignments via Schedules
-- GV001 teaches Toán for 10A (periods 1-3, Mon-Wed-Fri)
INSERT INTO schedules (id, class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '10A',
  'toan',
  'TEACHER_ID_HERE', -- Replace with GV001's actual teacher.id UUID
  id,
  unnest(ARRAY[2, 4, 6]::int[]), -- Monday (2), Wednesday (4), Friday (6)
  'A101',
  '1',
  '2024-2025',
  NOW(),
  NOW()
FROM periods WHERE id IN (1, 2, 3)
ON CONFLICT DO NOTHING;

-- GV001 teaches Lý for 11B (periods 4-5, Tue-Thu)
INSERT INTO schedules (id, class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '11B',
  'ly',
  'TEACHER_ID_HERE', -- Replace with GV001's actual teacher.id UUID
  id,
  unnest(ARRAY[3, 5]::int[]), -- Tuesday (3), Thursday (5)
  'B201',
  '1',
  '2024-2025',
  NOW(),
  NOW()
FROM periods WHERE id IN (4, 5)
ON CONFLICT DO NOTHING;

-- GV001 teaches Toán for 12C (periods 6-7, Mon-Wed-Fri)
INSERT INTO schedules (id, class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year, created_at, updated_at)
SELECT
  gen_random_uuid(),
  '12C',
  'toan',
  'TEACHER_ID_HERE', -- Replace with GV001's actual teacher.id UUID
  id,
  unnest(ARRAY[2, 4, 6]::int[]), -- Monday (2), Wednesday (4), Friday (6)
  'C301',
  '1',
  '2024-2025',
  NOW(),
  NOW()
FROM periods WHERE id IN (6, 7)
ON CONFLICT DO NOTHING;

-- ==========================================
-- STEP 4: STUDENT ENROLLMENTS
-- ==========================================

-- Enroll test student ST2024001 in 10A (GV001's homeroom class)
-- Replace STUDENT_ID_HERE with ST2024001's actual student.id UUID
INSERT INTO enrollments (id, student_id, class_id, academic_year, status, enrollment_date, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'STUDENT_ID_HERE', -- Replace with ST2024001's actual student.id UUID
  '10A',
  '2024-2025',
  'active',
  CURRENT_DATE,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ==========================================
-- STEP 5: ADDITIONAL STUDENTS FOR REALISM
-- ==========================================

-- Create additional students for 10A (total 25 students)
-- This is optional - add if you want more realistic class sizes

-- Create additional students for 11B (total 30 students)

-- Create additional students for 12C (total 28 students)

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Verify GV001's classes:
-- SELECT
--   c.id as class_id,
--   c.name as class_name,
--   ct.is_primary as is_homeroom,
--   s.name as subject_taught
-- FROM classes c
-- LEFT JOIN class_teachers ct ON c.id = ct.class_id AND ct.teacher_id = 'TEACHER_ID_HERE'
-- LEFT JOIN schedules sch ON c.id = sch.class_id AND sch.teacher_id = 'TEACHER_ID_HERE'
-- LEFT JOIN subjects s ON sch.subject_id = s.id
-- WHERE ct.id IS NOT NULL OR sch.id IS NOT NULL;

-- Verify ST2024001 enrollment in 10A:
-- SELECT
--   st.student_code,
--   p.full_name,
--   c.name as class_name,
--   e.status as enrollment_status
-- FROM enrollments e
-- JOIN students st ON e.student_id = st.id
-- JOIN profiles p ON st.id = p.id
-- JOIN classes c ON e.class_id = c.id
-- WHERE st.student_code = 'ST2024001' AND c.id = '10A';
