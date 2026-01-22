-- Migration: Row Level Security (RLS) Policies
-- Created: 2026-01-22
-- Description: Security policies for role-based access control

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

-- Core tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;

-- Academic tables
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;

-- Academics tables
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_comments ENABLE ROW LEVEL SECURITY;

-- Finance tables
ALTER TABLE fee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Communication tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(user_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = user_role AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role('teacher');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is parent
CREATE OR REPLACE FUNCTION is_parent()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role('parent');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role('student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get children IDs for parent
CREATE OR REPLACE FUNCTION get_parent_children()
RETURNS UUID[] AS $$
DECLARE
  children UUID[];
BEGIN
  IF is_parent() THEN
    SELECT ARRAY_AGG(DISTINCT student_id) INTO children
    FROM student_guardians
    WHERE guardian_id = auth.uid();
    RETURN COALESCE(children, ARRAY[]::UUID[]);
  END IF;
  RETURN ARRAY[]::UUID[];
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STUDENT TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own profile"
  ON students FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Parents can view children"
  ON students FOR SELECT
  TO authenticated
  USING (id = ANY(get_parent_children()) OR id IN (SELECT student_id FROM student_guardians WHERE guardian_id = auth.uid()));

CREATE POLICY "Teachers can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (is_teacher() OR is_admin());

CREATE POLICY "Admins can manage all students"
  ON students FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- TEACHER TABLE POLICIES
-- ============================================

CREATE POLICY "Teachers can view own profile"
  ON teachers FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Teachers can view all teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (is_teacher() OR is_admin());

CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- PARENT TABLE POLICIES
-- ============================================

CREATE POLICY "Parents can view own profile"
  ON parents FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Parents can view all parents"
  ON parents FOR SELECT
  TO authenticated
  USING (is_parent() OR is_teacher() OR is_admin());

-- ============================================
-- CLASS TABLE POLICIES
-- ============================================

CREATE POLICY "All authenticated can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers can manage classes"
  ON classes FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- SCHEDULE TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own schedule"
  ON schedules FOR SELECT
  TO authenticated
  USING (
    is_student() AND
    class_id IN (SELECT class_id FROM enrollments WHERE student_id = auth.uid() AND status = 'active')
  );

CREATE POLICY "Parents can view children schedule"
  ON schedules FOR SELECT
  TO authenticated
  USING (
    is_parent() AND
    class_id IN (
      SELECT e.class_id
      FROM enrollments e
      WHERE e.student_id = ANY(get_parent_children()) AND e.status = 'active'
    )
  );

CREATE POLICY "Teachers can view their schedule"
  ON schedules FOR SELECT
  TO authenticated
  USING (is_teacher() AND teacher_id = auth.uid());

CREATE POLICY "Admins can view all schedules"
  ON schedules FOR SELECT
  TO authenticated
  USING (is_admin());

-- ============================================
-- ENROLLMENT TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own enrollment"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view children enrollment"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id = ANY(get_parent_children()));

CREATE POLICY "Teachers can view class enrollment"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    is_teacher() AND
    class_id IN (SELECT id FROM classes WHERE id IN (
      SELECT class_id FROM schedules WHERE teacher_id = auth.uid()
    ))
  );

CREATE POLICY "Admins can manage enrollments"
  ON enrollments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view children attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (student_id = ANY(get_parent_children()));

CREATE POLICY "Teachers can manage class attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- ASSESSMENT TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view class assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (
    is_student() AND
    class_id IN (SELECT class_id FROM enrollments WHERE student_id = auth.uid() AND status = 'active')
  );

CREATE POLICY "Parents can view children assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (
    is_parent() AND
    class_id IN (
      SELECT class_id FROM enrollments WHERE student_id = ANY(get_parent_children()) AND status = 'active'
    )
  );

CREATE POLICY "Teachers can manage own assessments"
  ON assessments FOR ALL
  TO authenticated
  USING (is_teacher() AND teacher_id = auth.uid())
  WITH CHECK (is_teacher() AND teacher_id = auth.uid());

CREATE POLICY "Admins can view all assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (is_admin());

-- ============================================
-- GRADE ENTRY TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own grades"
  ON grade_entries FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view children grades"
  ON grade_entries FOR SELECT
  TO authenticated
  USING (student_id = ANY(get_parent_children()));

CREATE POLICY "Teachers can manage class grades"
  ON grade_entries FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- FEE ITEMS TABLE POLICIES
-- ============================================

CREATE POLICY "Parents can view fee items"
  ON fee_items FOR SELECT
  TO authenticated
  USING (is_parent() OR is_student());

CREATE POLICY "Teachers and admins can manage fee items"
  ON fee_items FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- INVOICE TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can view children invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (student_id = ANY(get_parent_children()));

CREATE POLICY "Teachers and admins can manage invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- PAYMENT TRANSACTION TABLE POLICIES
-- ============================================

CREATE POLICY "Students can view own payments"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    is_student() AND
    invoice_id IN (SELECT id FROM invoices WHERE student_id = auth.uid())
  );

CREATE POLICY "Parents can view children payments"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    is_parent() AND
    invoice_id IN (SELECT id FROM invoices WHERE student_id = ANY(get_parent_children()))
  );

CREATE POLICY "Teachers and admins can manage payments"
  ON payment_transactions FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- NOTIFICATION TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Teachers and admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- MESSAGE TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own sent messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- ============================================
-- LEAVE REQUEST TABLE POLICIES
-- ============================================

CREATE POLICY "Parents can view own leave requests"
  ON leave_requests FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Parents can create leave requests"
  ON leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Teachers can manage class leave requests"
  ON leave_requests FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- ANNOUNCEMENT TABLE POLICIES
-- ============================================

CREATE POLICY "All authenticated can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (is_teacher() OR is_admin())
  WITH CHECK (is_teacher() OR is_admin());

-- ============================================
-- REFERENCE DATA (read-only for all)
-- ============================================

CREATE POLICY "All authenticated can view grades"
  ON grades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated can view periods"
  ON periods FOR SELECT
  TO authenticated
  USING (true);
