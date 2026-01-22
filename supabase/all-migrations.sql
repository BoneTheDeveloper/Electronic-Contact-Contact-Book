-- Migration: Core Schema (Profiles, Students, Teachers, Parents)
-- Created: 2026-01-22
-- Description: Core user and authentication schema using Supabase Auth

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  guardian_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_guardian ON students(guardian_id);

-- Trigger for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TEACHERS TABLE
-- ============================================
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_code TEXT UNIQUE NOT NULL,
  subject TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_teachers_code ON teachers(employee_code);

-- Trigger for updated_at
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PARENTS TABLE
-- ============================================
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER update_parents_updated_at
  BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STUDENT-GUARDIAN RELATIONSHIPS
-- ============================================
CREATE TABLE student_guardians (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_student ON student_guardians(student_id);
CREATE INDEX idx_student_guardians_guardian ON student_guardians(guardian_id);
-- Migration: Academic Data (Grades, Classes, Subjects, Enrollments)
-- Created: 2026-01-22
-- Description: Academic structure - grades, classes, subjects, schedules, enrollments

-- ============================================
-- GRADES TABLE
-- ============================================
CREATE TABLE grades (
  id TEXT PRIMARY KEY, -- '6', '7', '8', '9'
  name TEXT NOT NULL UNIQUE, -- 'Khối 6', 'Khối 7'
  display_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBJECTS TABLE
-- ============================================
CREATE TABLE subjects (
  id TEXT PRIMARY KEY, -- 'toan', 'van', 'anh'
  name TEXT NOT NULL UNIQUE, -- 'Toán', 'Tiếng Việt'
  name_en TEXT, -- 'Mathematics', 'Vietnamese'
  code TEXT UNIQUE NOT NULL, -- 'M_TOAN', 'M_VAN'
  is_core BOOLEAN DEFAULT false,
  display_order INT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_is_core ON subjects(is_core);

-- ============================================
-- CLASSES TABLE
-- ============================================
CREATE TABLE classes (
  id TEXT PRIMARY KEY, -- '6A', '6B', '7A'
  name TEXT NOT NULL UNIQUE, -- '6A', '6A1'
  grade_id TEXT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2024-2025',
  room TEXT, -- 'Phòng 201', 'A.2.3'
  capacity INT DEFAULT 40,
  current_students INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_grade ON classes(grade_id);
CREATE INDEX idx_classes_status ON classes(status);

-- Trigger for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PERIODS (Time Slots)
-- ============================================
CREATE TABLE periods (
  id INT PRIMARY KEY,
  name TEXT NOT NULL, -- 'Tiết 1', 'Tiết 2'
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_break BOOLEAN DEFAULT false,
  display_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCHEDULES TABLE
-- ============================================
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  period_id INT NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  room TEXT,
  semester TEXT DEFAULT '1' CHECK (semester IN ('1', '2', 'all')),
  school_year TEXT DEFAULT '2024-2025',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, period_id, day_of_week, school_year, semester)
);

CREATE INDEX idx_schedules_class ON schedules(class_id);
CREATE INDEX idx_schedules_teacher ON schedules(teacher_id);
CREATE INDEX idx_schedules_subject ON schedules(subject_id);

-- Trigger for updated_at
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2024-2025',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'graduated', 'withdrawn')),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  exit_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, academic_year)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_year ON enrollments(academic_year);

-- Trigger for updated_at
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CLASS TEACHERS (Homeroom Teachers)
-- ============================================
CREATE TABLE class_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  academic_year TEXT DEFAULT '2024-2025',
  semester TEXT DEFAULT '1' CHECK (semester IN ('1', '2', 'all')),
  is_primary BOOLEAN DEFAULT false,
  appointed_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, teacher_id, academic_year, semester)
);

CREATE INDEX idx_class_teachers_class ON class_teachers(class_id);
CREATE INDEX idx_class_teachers_teacher ON class_teachers(teacher_id);
-- Migration: Academics Records (Attendance, Grade Entries, Assessments)
-- Created: 2026-01-22
-- Description: Student attendance tracking, grade entries, and assessments

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period_id INT REFERENCES periods(id) ON DELETE SET NULL, -- NULL = full day
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  recorded_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, class_id, date, period_id)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);

-- Trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- 'Kiểm tra 15 phút', 'Giữa kỳ'
  assessment_type TEXT CHECK (assessment_type IN ('quiz', 'midterm', 'final', 'assignment', 'project')),

  date DATE NOT NULL,
  max_score DECIMAL(5,2) NOT NULL DEFAULT 10,
  weight DECIMAL(3,2) DEFAULT 1.0, -- Weight for calculating final grade

  semester TEXT DEFAULT '1' CHECK (semester IN ('1', '2', 'all')),
  school_year TEXT DEFAULT '2024-2025',

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_class ON assessments(class_id);
CREATE INDEX idx_assessments_subject ON assessments(subject_id);
CREATE INDEX idx_assessments_teacher ON assessments(teacher_id);
CREATE INDEX idx_assessments_date ON assessments(date);

-- Trigger for updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- GRADE ENTRIES TABLE
-- ============================================
CREATE TABLE grade_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,

  score DECIMAL(5,2),
  status TEXT DEFAULT 'graded' CHECK (status IN ('pending', 'graded', 'excused', 'absent')),
  notes TEXT,

  graded_by UUID REFERENCES teachers(id),
  graded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id, student_id)
);

CREATE INDEX idx_grade_entries_assessment ON grade_entries(assessment_id);
CREATE INDEX idx_grade_entries_student ON grade_entries(student_id);

-- Trigger for updated_at
CREATE TRIGGER update_grade_entries_updated_at
  BEFORE UPDATE ON grade_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update graded_at when score is entered
CREATE OR REPLACE FUNCTION update_graded_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score IS NOT NULL AND OLD.score IS NULL THEN
    NEW.graded_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_grade_entry_graded_at
  BEFORE UPDATE OF score ON grade_entries
  FOR EACH ROW EXECUTE FUNCTION update_graded_at();

-- ============================================
-- COMMENTS/REMARKS TABLE
-- ============================================
CREATE TABLE student_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,

  comment_type TEXT CHECK (comment_type IN ('academic', 'behavior', 'achievement', 'concern')),
  subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL,

  title TEXT,
  content TEXT NOT NULL,

  is_private BOOLEAN DEFAULT false, -- If true, only visible to teachers/admin
  semester TEXT DEFAULT '1' CHECK (semester IN ('1', '2', 'all')),
  school_year TEXT DEFAULT '2024-2025',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_comments_student ON student_comments(student_id);
CREATE INDEX idx_student_comments_teacher ON student_comments(teacher_id);
CREATE INDEX idx_student_comments_type ON student_comments(comment_type);

-- Trigger for updated_at
CREATE TRIGGER update_student_comments_updated_at
  BEFORE UPDATE ON student_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VIEWS
-- ============================================

-- Student Attendance Summary
CREATE VIEW student_attendance_summary AS
SELECT
  s.id AS student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  COUNT(*) FILTER (WHERE a.status = 'present') AS days_present,
  COUNT(*) FILTER (WHERE a.status = 'absent') AS days_absent,
  COUNT(*) FILTER (WHERE a.status = 'late') AS days_late,
  COUNT(*) FILTER (WHERE a.status = 'excused') AS days_excused,
  COUNT(*) AS total_days
FROM students s
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
LEFT JOIN attendance a ON a.student_id = s.id AND a.class_id = e.class_id
GROUP BY s.id, s.student_code, p.full_name, e.class_id, c.name;

-- Student Grade Summary
CREATE VIEW student_grade_summary AS
SELECT
  s.id AS student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  sub.name AS subject_name,
  COUNT(ge.id) AS total_assessments,
  ROUND(AVG(ge.score)::numeric, 2) AS average_score,
  SUM(CASE WHEN ge.score >= 8 THEN 1 ELSE 0 END) AS excellent_count,
  SUM(CASE WHEN ge.score >= 6.5 AND ge.score < 8 THEN 1 ELSE 0 END) AS good_count,
  SUM(CASE WHEN ge.score >= 5 AND ge.score < 6.5 THEN 1 ELSE 0 END) AS fair_count,
  SUM(CASE WHEN ge.score < 5 THEN 1 ELSE 0 END) AS poor_count
FROM students s
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
JOIN grade_entries ge ON ge.student_id = s.id
JOIN assessments a ON a.id = ge.assessment_id
JOIN subjects sub ON sub.id = a.subject_id
GROUP BY s.id, s.student_code, p.full_name, e.class_id, c.name, sub.name;
-- Migration: Finance & Payments (Fee Items, Assignments, Invoices)
-- Created: 2026-01-22
-- Description: Fee management: fee items, assignments, invoices, payments

-- ============================================
-- FEE ITEMS TABLE
-- ============================================
CREATE TABLE fee_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE NOT NULL,
  description TEXT,

  fee_type TEXT CHECK (fee_type IN ('mandatory', 'voluntary')) NOT NULL,
  amount DECIMAL(15,0) NOT NULL,

  semester TEXT CHECK (semester IN ('1', '2', 'all')) DEFAULT 'all',
  academic_year TEXT DEFAULT '2024-2025',

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fee_items_type ON fee_items(fee_type);
CREATE INDEX idx_fee_items_semester ON fee_items(semester);
CREATE INDEX idx_fee_items_status ON fee_items(status);

-- Trigger for updated_at
CREATE TRIGGER update_fee_items_updated_at
  BEFORE UPDATE ON fee_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FEE ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE fee_assignments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,

  target_grades TEXT[],
  target_classes TEXT[],

  fee_items UUID[] NOT NULL,

  start_date DATE NOT NULL,
  due_date DATE NOT NULL,

  semester TEXT CHECK (semester IN ('1', '2', 'all')) DEFAULT 'all',
  academic_year TEXT DEFAULT '2024-2025',

  reminder_days INT DEFAULT 7,
  reminder_frequency TEXT CHECK (reminder_frequency IN ('once', 'daily', 'weekly')) DEFAULT 'once',

  total_students INT DEFAULT 0,
  total_amount DECIMAL(15,0) DEFAULT 0,
  collected_amount DECIMAL(15,0) DEFAULT 0,

  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),

  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (due_date > start_date)
);

CREATE INDEX idx_fee_assignments_status ON fee_assignments(status);
CREATE INDEX idx_fee_assignments_due ON fee_assignments(due_date);
CREATE INDEX idx_fee_assignments_semester ON fee_assignments(semester);
CREATE INDEX idx_fee_assignments_academic_year ON fee_assignments(academic_year);
CREATE INDEX idx_fee_assignments_grades ON fee_assignments USING GIN(target_grades);
CREATE INDEX idx_fee_assignments_classes ON fee_assignments USING GIN(target_classes);

-- Trigger for updated_at
CREATE TRIGGER update_fee_assignments_updated_at
  BEFORE UPDATE ON fee_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate totals when fee items or target changes
CREATE OR REPLACE FUNCTION calculate_assignment_totals()
RETURNS TRIGGER AS $$
DECLARE
  fee_total DECIMAL(15,0);
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO fee_total
  FROM fee_items
  WHERE id = ANY(NEW.fee_items);

  NEW.total_amount := fee_total * COALESCE(NEW.total_students, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_fee_assignment_totals
  BEFORE INSERT OR UPDATE OF fee_items, total_students ON fee_assignments
  FOR EACH ROW EXECUTE FUNCTION calculate_assignment_totals();

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE,

  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_assignment_id TEXT REFERENCES fee_assignments(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  description TEXT,

  amount DECIMAL(15,0) NOT NULL,
  discount_amount DECIMAL(15,0) DEFAULT 0,
  total_amount DECIMAL(15,0) GENERATED ALWAYS AS (amount - discount_amount) STORED,

  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled')),

  paid_amount DECIMAL(15,0) DEFAULT 0,
  paid_date DATE,

  payment_method TEXT,
  transaction_ref TEXT,

  notes TEXT,
  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_assignment ON invoices(fee_assignment_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);

-- Trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update status based on payment
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.paid_amount >= NEW.total_amount THEN
    NEW.status := 'paid';
    NEW.paid_date := COALESCE(NEW.paid_date, CURRENT_DATE);
  ELSIF NEW.paid_amount > 0 THEN
    NEW.status := 'partial';
  ELSEIF NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  ELSE
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_payment_status
  BEFORE INSERT OR UPDATE OF paid_amount, total_amount, due_date ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoice_status();

-- ============================================
-- PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  amount DECIMAL(15,0) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'qr_code', 'card', 'other')),
  transaction_ref TEXT UNIQUE,

  receipt_number TEXT,
  proof_url TEXT,

  processed_by UUID REFERENCES teachers(id),
  processed_at TIMESTAMPTZ DEFAULT NOW(),

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_invoice ON payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_ref ON payment_transactions(transaction_ref);
CREATE INDEX idx_payment_transactions_date ON payment_transactions(processed_at);

-- Update invoice paid_amount on payment
CREATE OR REPLACE FUNCTION update_invoice_payment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET paid_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM payment_transactions
    WHERE invoice_id = NEW.invoice_id
  )
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_on_payment
  AFTER INSERT OR UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_invoice_payment();

-- Update fee assignment collected amount
CREATE OR REPLACE FUNCTION update_assignment_collected()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE fee_assignments fa
  SET collected_amount = (
    SELECT COALESCE(SUM(pt.amount), 0)
    FROM payment_transactions pt
    JOIN invoices i ON i.id = pt.invoice_id
    WHERE i.fee_assignment_id = fa.id
  )
  WHERE fa.id = (SELECT fee_assignment_id FROM invoices WHERE id = NEW.invoice_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assignment_on_payment
  AFTER INSERT ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_assignment_collected();

-- ============================================
-- INVOICE ITEMS TABLE
-- ============================================
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  fee_item_id UUID REFERENCES fee_items(id) ON DELETE SET NULL,

  item_name TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(15,0) NOT NULL,
  amount DECIMAL(15,0) GENERATED ALWAYS AS (quantity * unit_price) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_fee_item ON invoice_items(fee_item_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Generate Invoices from Fee Assignment
CREATE OR REPLACE FUNCTION generate_invoices_from_assignment(
  assignment_id TEXT
) RETURNS INT AS $$
DECLARE
  student_record RECORD;
  fee_item_record RECORD;
  invoice_count INT := 0;
  fee_total DECIMAL(15,0);
  new_invoice_id TEXT;
  target_classes_list TEXT[];
BEGIN
  SELECT fa.*, fi.amount INTO fee_total
  FROM fee_assignments fa
  CROSS JOIN LATERAL (
    SELECT COALESCE(SUM(amount), 0) AS amount
    FROM fee_items
    WHERE id = ANY(fa.fee_items)
  ) fi
  WHERE fa.id = assignment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fee assignment not found';
  END IF;

  target_classes_list := (
    SELECT ARRAY(
      SELECT unnest(target_classes)
      UNION
      SELECT c.id
      FROM classes c
      WHERE c.grade_id = ANY(target_grades)
    )
  )
  FROM fee_assignments
  WHERE id = assignment_id;

  FOR student_record IN
    SELECT DISTINCT e.student_id, e.class_id, s.student_code, p.full_name
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    JOIN profiles p ON p.id = s.id
    WHERE e.class_id = ANY(target_classes_list)
      AND e.status = 'active'
      AND e.school_year = '2024-2025'
  LOOP
    new_invoice_id := 'inv-' || assignment_id || '-' || student_record.student_code;

    INSERT INTO invoices (
      id,
      invoice_number,
      student_id,
      fee_assignment_id,
      name,
      amount,
      due_date,
      status
    ) VALUES (
      new_invoice_id,
      'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(invoice_count::text, 4, '0'),
      student_record.student_id,
      assignment_id,
      'Học phí - ' || student_record.full_name,
      fee_total,
      (SELECT due_date FROM fee_assignments WHERE id = assignment_id),
      'pending'
    );

    FOR fee_item_record IN
      SELECT id, name, amount
      FROM fee_items
      WHERE id = ANY((SELECT fee_items FROM fee_assignments WHERE id = assignment_id))
    LOOP
      INSERT INTO invoice_items (
        invoice_id,
        fee_item_id,
        item_name,
        quantity,
        unit_price
      ) VALUES (
        new_invoice_id,
        fee_item_record.id,
        fee_item_record.name,
        1,
        fee_item_record.amount
      );
    END LOOP;

    invoice_count := invoice_count + 1;
  END LOOP;

  UPDATE fee_assignments
  SET total_students = invoice_count
  WHERE id = assignment_id;

  RETURN invoice_count;
END;
$$ LANGUAGE plpgsql;

-- Get Payment Statistics
CREATE OR REPLACE FUNCTION get_payment_stats(
  academic_year TEXT DEFAULT '2024-2025',
  semester TEXT DEFAULT '1'
) RETURNS TABLE (
  total_invoices BIGINT,
  total_amount DECIMAL(15,0),
  paid_invoices BIGINT,
  paid_amount DECIMAL(15,0),
  pending_invoices BIGINT,
  overdue_invoices BIGINT,
  collection_rate DECIMAL(5,2)
) AS $$
  SELECT
    COUNT(*) AS total_invoices,
    COALESCE(SUM(i.total_amount), 0) AS total_amount,
    COUNT(*) FILTER (WHERE i.status = 'paid') AS paid_invoices,
    COALESCE(SUM(i.paid_amount), 0) AS paid_amount,
    COUNT(*) FILTER (WHERE i.status = 'pending') AS pending_invoices,
    COUNT(*) FILTER (WHERE i.status = 'overdue') AS overdue_invoices,
    CASE
      WHEN SUM(i.total_amount) > 0 THEN
        ROUND((SUM(i.paid_amount) / SUM(i.total_amount) * 100)::numeric, 2)
      ELSE 0
    END AS collection_rate
  FROM invoices i
  JOIN fee_assignments fa ON fa.id = i.fee_assignment_id
  WHERE fa.academic_year = academic_year
    AND (fa.semester = semester OR fa.semester = 'all');
$$ LANGUAGE SQL STABLE;

-- ============================================
-- VIEWS
-- ============================================

-- Invoice Summary View
CREATE VIEW invoice_summary AS
SELECT
  i.id,
  i.invoice_number,
  i.student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  i.fee_assignment_id,
  fa.name AS assignment_name,
  i.total_amount,
  i.paid_amount,
  i.total_amount - i.paid_amount AS remaining_amount,
  i.status,
  i.due_date,
  i.paid_date,
  CASE WHEN i.due_date < CURRENT_DATE AND i.status != 'paid' THEN true ELSE false END AS is_overdue
FROM invoices i
JOIN students s ON s.id = i.student_id
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
LEFT JOIN fee_assignments fa ON fa.id = i.fee_assignment_id;

-- Student Fee Status View
CREATE VIEW student_fee_status AS
SELECT
  s.id AS student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  COUNT(i.id) FILTER (WHERE i.status = 'pending') AS pending_fees,
  COUNT(i.id) FILTER (WHERE i.status = 'overdue') AS overdue_fees,
  COUNT(i.id) FILTER (WHERE i.status = 'paid') AS paid_fees,
  SUM(i.total_amount) AS total_fees,
  SUM(i.paid_amount) AS total_paid,
  SUM(i.total_amount - i.paid_amount) AS total_remaining
FROM students s
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
LEFT JOIN invoices i ON i.student_id = s.id
GROUP BY s.id, s.student_code, p.full_name, e.class_id, c.name;
-- Migration: Communications (Notifications, Messages, Leave Requests)
-- Created: 2026-01-22
-- Description: Notifications, messages, and leave request management

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  type TEXT CHECK (type IN ('payment', 'attendance', 'grade', 'announcement', 'reminder', 'alert')),

  related_type TEXT, -- 'invoice', 'attendance', 'grade_entry'
  related_id TEXT, -- ID of related record

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Mark as read when accessed
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = true AND OLD.is_read = false THEN
    NEW.read_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_notification_read_at
  BEFORE UPDATE OF is_read ON notifications
  FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Thread (conversation group)
  thread_id UUID NOT NULL, -- Groups messages in a conversation

  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  subject TEXT,
  content TEXT NOT NULL,

  -- For linking to specific records
  related_type TEXT, -- 'student', 'invoice', 'enrollment'
  related_id TEXT,

  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Reply tracking
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_forwarded BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Mark as read when accessed
CREATE TRIGGER set_message_read_at
  BEFORE UPDATE OF is_read ON messages
  FOR EACH ROW EXECUTE FUNCTION mark_notification_read();

-- ============================================
-- MESSAGE PARTICIPANTS (for group threads)
-- ============================================
CREATE TABLE message_participants (
  thread_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT false, -- Can add/remove participants
  last_read_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (thread_id, user_id)
);

CREATE INDEX idx_message_participants_user ON message_participants(user_id);

-- ============================================
-- LEAVE REQUESTS TABLE
-- ============================================
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,

  request_type TEXT CHECK (request_type IN ('sick', 'personal', 'family', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  reason TEXT NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),

  -- Approval tracking
  approved_by UUID REFERENCES teachers(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Attachments (medical certificate, etc.)
  attachment_url TEXT,

  -- Academic impact
  requires_makeup BOOLEAN DEFAULT false,
  makeup_notes TEXT,

  created_by UUID REFERENCES profiles(id), -- Parent who created request
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_requests_student ON leave_requests(student_id);
CREATE INDEX idx_leave_requests_class ON leave_requests(class_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

-- Trigger for updated_at
CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update approved_at
CREATE OR REPLACE FUNCTION update_leave_approved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at := NOW();
  ELSIF NEW.status != 'approved' THEN
    NEW.approved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leave_approved_at
  BEFORE UPDATE OF status ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_leave_approved_at();

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  content TEXT NOT NULL,

  type TEXT CHECK (type IN ('general', 'urgent', 'event', 'holiday', 'exam')),

  -- Target audience
  target_role TEXT CHECK (target_role IN ('all', 'admin', 'teacher', 'parent', 'student')),

  -- Attachments (images, documents)
  attachment_url TEXT,

  -- Publishing
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  is_pinned BOOLEAN DEFAULT false,
  pin_until TIMESTAMPTZ,

  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_target_role ON announcements(target_role);
CREATE INDEX idx_announcements_published_at ON announcements(published_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VIEWS
-- ============================================

-- Unread message count per user
CREATE VIEW unread_message_counts AS
SELECT
  recipient_id AS user_id,
  COUNT(*) AS unread_count
FROM messages
WHERE is_read = false
GROUP BY recipient_id;

-- Recent notifications for user
CREATE VIEW recent_notifications AS
SELECT
  n.*,
  p.full_name AS sender_name
FROM notifications n
LEFT JOIN profiles p ON p.id = n.sender_id
ORDER BY n.created_at DESC;

-- Pending leave requests for class
CREATE VIEW pending_leave_requests AS
SELECT
  lr.*,
  s.student_code,
  p.full_name AS student_name,
  c.name AS class_name
FROM leave_requests lr
JOIN students s ON s.id = lr.student_id
JOIN profiles p ON p.id = s.id
LEFT JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
LEFT JOIN classes c ON c.id = e.class_id
WHERE lr.status = 'pending'
ORDER BY lr.created_at DESC;

-- Active announcements
CREATE VIEW active_announcements AS
SELECT *
FROM announcements
WHERE (expires_at IS NULL OR expires_at > NOW())
  AND published_at <= NOW()
ORDER BY
  is_pinned DESC,
  published_at DESC;

-- Message thread summary
CREATE VIEW message_thread_summary AS
SELECT
  m.thread_id,
  m.sender_id,
  m.recipient_id,
  m.subject,
  m.content AS last_message,
  m.created_at AS last_message_at,
  COALESCE(unread_counts.unread_count, 0) AS unread_count
FROM (
  SELECT DISTINCT ON (thread_id) thread_id, sender_id, recipient_id, subject, content, created_at
  FROM messages
  ORDER BY thread_id, created_at DESC
) m
LEFT JOIN (
  SELECT thread_id, recipient_id, COUNT(*) AS unread_count
  FROM messages
  WHERE is_read = false
  GROUP BY thread_id, recipient_id
) unread_counts ON unread_counts.thread_id = m.thread_id AND unread_counts.recipient_id = m.recipient_id
ORDER BY m.created_at DESC;
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
-- Migration: Seed Admin Users
-- Created: 2026-01-22
-- Description: Create 3 initial admin user accounts

-- NOTE: These users must be created via Supabase Auth first
-- Run this AFTER creating the auth users via:
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
-- 2. Or use Supabase CLI: npx supabase auth admin create --email ... --password ...

-- ============================================
-- INSERT PROFILES FOR ADMIN USERS
-- ============================================
-- The auth.users.id will be different - update these UUIDs after creating auth users

-- Admin 1: Principal/Head Admin
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@school.edu', 'admin', 'Principal Admin', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Admin 2: System Administrator
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000002', 'sysadmin@school.edu', 'admin', 'System Administrator', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Admin 3: Academic Administrator
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000003', 'academic@school.edu', 'admin', 'Academic Administrator', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- ============================================
-- INSTRUCTIONS FOR CREATING AUTH USERS
-- ============================================
--
-- OPTION 1: Via Supabase Dashboard
-- 1. Go to: https://supabase.com/dashboard/project/lshmmoenfeodsrthsevf/auth/users
-- 2. Click "Add user" → "Create new user" for each admin:
--
--   Admin 1:
--   - Email: admin@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--   - After creating, note the User ID and update the profile above
--
--   Admin 2:
--   - Email: sysadmin@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--
--   Admin 3:
--   - Email: academic@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--
-- OPTION 2: Via Supabase CLI (update email/password as needed)
-- npx supabase auth admin create \
--   --email admin@school.edu \
--   --password YOUR_SECURE_PASSWORD \
--   --email-confirm
--
-- OPTION 3: Generate real UUIDs and create both auth + profile
-- Run the function below to create 3 admin users with auto-generated UUIDs
-- SELECT create_admin_user('admin@school.edu', 'Principal Admin', '0123456789');
-- SELECT create_admin_user('sysadmin@school.edu', 'System Administrator', '0123456789');
-- SELECT create_admin_user('academic@school.edu', 'Academic Administrator', '0123456789');

-- ============================================
-- HELPER FUNCTION TO CREATE ADMIN USER
-- ============================================
-- This function creates both auth user and profile in one transaction
-- Only use this if you have service_role key access

CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  full_name TEXT,
  phone TEXT DEFAULT '0123456789'
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  new_password TEXT := gen_random_uuid()::text;
BEGIN
  -- Insert into auth.users (requires service_role)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    gen_random_uuid(),
    user_email,
    crypt(new_password, gen_salt('bf')),
    NOW(),
    '{"role": "admin", "full_name": "' || full_name || '"}'
  )
  RETURNING id INTO new_user_id;

  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, role, full_name, phone, status)
  VALUES (
    new_user_id,
    user_email,
    'admin',
    full_name,
    phone,
    'active'
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ALTERNATIVE: Simple insert with existing auth users
-- ============================================
-- If you have already created auth users via dashboard,
-- run this to create their profiles (update IDs accordingly):

-- Get the actual auth user IDs from:
-- SELECT id, email FROM auth.users WHERE email LIKE '%@school.edu';

-- Then insert profiles with those IDs:
-- INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
--   ('ACTUAL_UUID_FROM_AUTH', 'admin@school.edu', 'admin', 'Principal Admin', '0123456789', 'active')
-- ON CONFLICT (id) DO NOTHING;
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
