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
