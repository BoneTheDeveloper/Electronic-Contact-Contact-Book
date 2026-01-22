-- ============================================
-- SEED DATA
-- ============================================
-- IMPORTANT NOTES:
-- - Admin user: Create via Supabase dashboard or CLI (not in seed.sql)
-- - Teachers/Students/Parents: Created via web app (AddUserModal)
-- - Fee items: Added dynamically via admin panel (your custom function)
-- - This seed only contains static reference data
-- ============================================

-- ============================================
-- INSERT GRADES
-- ============================================
INSERT INTO grades (id, name, display_order) VALUES
  ('6', 'Khối 6', 6),
  ('7', 'Khối 7', 7),
  ('8', 'Khối 8', 8),
  ('9', 'Khối 9', 9);

-- ============================================
-- INSERT SUBJECTS
-- ============================================
INSERT INTO subjects (id, name, name_en, code, is_core, display_order) VALUES
  ('toan', 'Toán', 'Mathematics', 'M_TOAN', true, 1),
  ('van', 'Tiếng Việt', 'Vietnamese', 'M_VAN', true, 2),
  ('anh', 'Tiếng Anh', 'English', 'M_ANH', true, 3),
  ('ly', 'Vật lý', 'Physics', 'M_LY', false, 4),
  ('hoa', 'Hóa học', 'Chemistry', 'M_HOA', false, 5),
  ('sinh', 'Sinh học', 'Biology', 'M_SINH', false, 6),
  ('su', 'Lịch sử', 'History', 'M_SU', false, 7),
  ('dia', 'Địa lý', 'Geography', 'M_DIA', false, 8),
  ('gdcd', 'GDCD', 'Civic Education', 'M_GDCD', false, 9),
  ('td', 'Tiếng Trung', 'Chinese', 'M_TD', false, 10),
  ('tin', 'Tin học', 'IT', 'M_TIN', false, 11),
  ('th', 'Thể dục', 'PE', 'M_TH', false, 12),
  ('anhvan', 'Tiếng Anh (bổ sung)', 'English Extra', 'M_ANHVAN', false, 13);

-- ============================================
-- INSERT PERIODS
-- ============================================
INSERT INTO periods (id, name, start_time, end_time, is_break, display_order) VALUES
  (1, 'Tiết 1', '07:30:00', '08:15:00', false, 1),
  (2, 'Tiết 2', '08:20:00', '09:05:00', false, 2),
  (3, 'Tiết 3', '09:15:00', '10:00:00', false, 3),
  (4, 'Tiết 4', '10:10:00', '10:55:00', false, 4),
  (5, 'Tiết 5', '11:00:00', '11:45:00', false, 5),
  (6, 'Tiết 6', '14:00:00', '14:45:00', false, 6),
  (7, 'Tiết 7', '14:50:00', '15:35:00', false, 7),
  (8, 'Tiết 8', '15:40:00', '16:25:00', false, 8),
  (9, 'Tiết 9', '16:30:00', '17:15:00', false, 9),
  (10, 'Tiết 10', '17:20:00', '18:05:00', false, 10);

-- ============================================
-- ADMIN USER CREATION INSTRUCTIONS
-- ============================================
--
-- After running migrations, create the initial admin user:
--
-- OPTION 1: Via Supabase Dashboard
-- 1. Go to Supabase dashboard -> Authentication -> Users
-- 2. Click "Add user" -> "Create new user"
-- 3. Enter email: admin@school.edu
-- 4. Set a secure password
-- 5. Click "Auto Confirm User" to skip email verification
-- 6. The handle_new_user() trigger will auto-create the profile with role='admin'
--
-- OPTION 2: Via Supabase CLI
-- npx supabase auth admin create \
--   --email admin@school.edu \
--   --password YOUR_SECURE_PASSWORD \
--   --email-confirm
--
-- ============================================
-- USER CREATION VIA APP
-- ============================================
--
-- Teachers, Students, and Parents are created through the web app:
-- - Navigate to: /admin/users
-- - Click "Thêm người dùng" (Add User)
-- - Fill in the form (see Phase 01 for field details)
-- - The app will:
--   1. Create auth user via Supabase Auth
--   2. Auto-create profile via trigger
--   3. Insert into role-specific table (students/teachers/parents)
--   4. Generate auto codes (HS20260001, GV20260001, PH20260001)
--
-- ============================================
