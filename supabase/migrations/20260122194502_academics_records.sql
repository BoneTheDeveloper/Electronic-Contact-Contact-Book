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
