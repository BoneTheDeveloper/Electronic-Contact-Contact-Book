# Phase 03 - Academics (Grades & Attendance)

**Date**: 2026-01-22 | **Priority**: High | **Status**: Draft

## Overview

Academic records: attendance, grade entries (oral, quiz, midterm, final), assessments, conduct ratings.

## Context

From mock data:
- Grade types: oral[], quiz[], midterm, final
- Attendance: present, absent, late, excused
- Conduct: good, fair, average, poor
- Assessments: quiz, midterm, final, oral
- Vietnamese grading system (0-10 scale)

## Key Insights

1. **Flexible grade arrays**: oral/quiz can have multiple entries
2. **Daily attendance**: needs date tracking
3. **Per subject per semester**: grades organized by class+subject+semester
4. **Conduct per semester**: linked to homeroom class

## Schema Design

### 1. Attendance (Điểm danh)

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note TEXT,
  recorded_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(student_id, attendance_date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- Trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2. Grade Entries (Bảng điểm)

```sql
CREATE TABLE grade_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  semester TEXT CHECK (semester IN ('1', '2')) NOT NULL,
  school_year TEXT DEFAULT '2024-2025',

  -- Grade types
  grade_type TEXT NOT NULL CHECK (grade_type IN ('oral', 'quiz', 'midterm', 'final')),
  sequence_num INT, -- For multiple oral/quiz (1, 2, 3...)
  score DECIMAL(3,1) CHECK (score BETWEEN 0 AND 10), -- 0.0 to 10.0
  max_score DECIMAL(3,1) DEFAULT 10.0,

  note TEXT,
  graded_by UUID REFERENCES teachers(id),
  graded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_grade_entry UNIQUE (student_id, class_id, subject_id, semester, grade_type, sequence_num)
);

CREATE INDEX idx_grade_student ON grade_entries(student_id);
CREATE INDEX idx_grade_class_subject ON grade_entries(class_id, subject_id);
CREATE INDEX idx_grade_semester ON grade_entries(semester);
CREATE INDEX idx_grade_type ON grade_entries(grade_type);

-- Trigger for updated_at
CREATE TRIGGER update_grade_entries_updated_at
  BEFORE UPDATE ON grade_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Get student grades for a class+subject
CREATE OR REPLACE FUNCTION get_student_grades(
  student_uuid UUID,
  class_text TEXT,
  subject_text TEXT,
  sem TEXT
) RETURNS TABLE (
  grade_type TEXT,
  scores DECIMAL[],
  avg_score DECIMAL
) AS $$
  SELECT
    grade_type,
    ARRAY_AGG(score ORDER BY sequence_num) FILTER (WHERE score IS NOT NULL),
    ROUND(AVG(score) FILTER (WHERE score IS NOT NULL)::numeric, 2)
  FROM grade_entries
  WHERE student_id = student_uuid
    AND class_id = class_text
    AND subject_id = subject_text
    AND semester = sem
  GROUP BY grade_type;
$$ LANGUAGE SQL STABLE;
```

### 3. Assessments (Đánh giá/Bài kiểm tra)

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'Kiểm tra 15 phút số 3'
  assessment_type TEXT CHECK (assessment_type IN ('quiz', 'midterm', 'final', 'oral')) NOT NULL,
  assessment_date DATE NOT NULL,
  max_score DECIMAL(3,1) DEFAULT 10.0,
  semester TEXT CHECK (semester IN ('1', '2')) NOT NULL,
  school_year TEXT DEFAULT '2024-2025',

  -- Status workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'graded')),

  -- Statistics (computed via trigger)
  total_students INT DEFAULT 0,
  submitted_count INT DEFAULT 0,
  graded_count INT DEFAULT 0,

  created_by UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_class ON assessments(class_id);
CREATE INDEX idx_assessments_subject ON assessments(subject_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_date ON assessments(assessment_date);
CREATE INDEX idx_assessments_status ON assessments(status);

-- Trigger for updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4. Assessment Grades (Điểm chi tiết bài kiểm tra)

```sql
CREATE TABLE assessment_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  score DECIMAL(3,1) CHECK (score BETWEEN 0 AND 10),
  note TEXT,
  graded_by UUID REFERENCES teachers(id),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(assessment_id, student_id)
);

CREATE INDEX idx_assessment_grades_assessment ON assessment_grades(assessment_id);
CREATE INDEX idx_assessment_grades_student ON assessment_grades(student_id);

-- Update assessment stats on grade insert/update
CREATE OR REPLACE FUNCTION update_assessment_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assessments
  SET
    submitted_count = (SELECT COUNT(*) FROM assessment_grades WHERE assessment_id = NEW.assessment_id AND score IS NOT NULL),
    graded_count = (SELECT COUNT(*) FROM assessment_grades WHERE assessment_id = NEW.assessment_id AND graded_at IS NOT NULL)
  WHERE id = NEW.assessment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assessment_stats_on_insert
  AFTER INSERT OR UPDATE ON assessment_grades
  FOR EACH ROW EXECUTE FUNCTION update_assessment_stats();
```

### 5. Conduct Ratings (Hạnh kiểm)

```sql
CREATE TABLE conduct_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  semester TEXT CHECK (semester IN ('1', '2')) NOT NULL,
  school_year TEXT DEFAULT '2024-2025',

  -- Academic rating (Tư chất học tập)
  academic_rating TEXT CHECK (academic_rating IN ('excellent-plus', 'excellent', 'good', 'average', 'needs-improvement')),
  academic_score DECIMAL(3,1), -- Average score from all subjects

  -- Conduct rating (Hạnh kiểm)
  conduct_rating TEXT CHECK (conduct_rating IN ('good', 'fair', 'average', 'poor')),

  notes TEXT,
  rated_by UUID REFERENCES teachers(id), -- Usually homeroom teacher
  rated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(student_id, class_id, semester, school_year)
);

CREATE INDEX idx_conduct_student ON conduct_ratings(student_id);
CREATE INDEX idx_conduct_class ON conduct_ratings(class_id);
CREATE INDEX idx_conduct_semester ON conduct_ratings(semester);

-- Vietnamese rating labels
-- academic_rating: Tốt (9.0+), Khá (8.0-8.9), TB khá (7.0-7.9), TB (5.0-6.9), Yếu (<5)
-- conduct_rating: Tốt, Khá, TB, Yếu

-- Trigger for updated_at
CREATE TRIGGER update_conduct_ratings_updated_at
  BEFORE UPDATE ON conduct_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 6. Regular Assessments (Đánh giá thường xuyên - Tự đánh giá/HKI)

```sql
CREATE TABLE regular_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id),

  -- Assessment content
  category TEXT NOT NULL, -- e.g., 'Tiến bộ học tập', 'Đóng góp lớp', 'Cần cải thiện'
  content TEXT NOT NULL, -- Detailed comment
  rating INT CHECK (rating BETWEEN 1 AND 5), -- 1-5 stars

  -- Status
  status TEXT DEFAULT 'evaluated' CHECK (status IN ('evaluated', 'pending', 'needs-attention')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regular_assessments_student ON regular_assessments(student_id);
CREATE INDEX idx_regular_assessments_class ON regular_assessments(class_id);
CREATE INDEX idx_regular_assessments_subject ON regular_assessments(subject_id);
CREATE INDEX idx_regular_assessments_status ON regular_assessments(status);
```

### 7. Grade Review Requests (Phúc khảo)

```sql
CREATE TABLE grade_review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  grade_entry_id UUID REFERENCES grade_entries(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,

  current_score DECIMAL(3,1),
  reason TEXT NOT NULL,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_date DATE DEFAULT CURRENT_DATE,
  reviewed_by UUID REFERENCES teachers(id),
  review_note TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_review_requests_student ON grade_review_requests(student_id);
CREATE INDEX idx_review_requests_class ON grade_review_requests(class_id);
CREATE INDEX idx_review_requests_status ON grade_review_requests(status);
```

## Views

### Student Grade Summary View

```sql
CREATE VIEW student_grade_summary AS
SELECT
  ge.student_id,
  s.student_code,
  p.full_name AS student_name,
  ge.class_id,
  c.name AS class_name,
  ge.subject_id,
  sub.name AS subject_name,
  ge.semester,
  ge.grade_type,
  ARRAY_AGG(ge.score ORDER BY ge.sequence_num) FILTER (WHERE ge.score IS NOT NULL) AS scores,
  ROUND(AVG(ge.score) FILTER (WHERE ge.score IS NOT NULL)::numeric, 2) AS average_score,
  ge.school_year
FROM grade_entries ge
JOIN students s ON s.id = ge.student_id
JOIN profiles p ON p.id = s.id
JOIN classes c ON c.id = ge.class_id
JOIN subjects sub ON sub.id = ge.subject_id
GROUP BY
  ge.student_id, s.student_code, p.full_name,
  ge.class_id, c.name,
  ge.subject_id, sub.name,
  ge.semester, ge.grade_type, ge.school_year;
```

### Attendance Summary View

```sql
CREATE VIEW attendance_summary AS
SELECT
  student_id,
  class_id,
  EXTRACT(YEAR FROM attendance_date) AS year,
  EXTRACT(MONTH FROM attendance_date) AS month,
  COUNT(*) FILTER (WHERE status = 'present') AS present_count,
  COUNT(*) FILTER (WHERE status = 'absent') AS absent_count,
  COUNT(*) FILTER (WHERE status = 'late') AS late_count,
  COUNT(*) FILTER (WHERE status = 'excused') AS excused_count,
  COUNT(*) AS total_days
FROM attendance
GROUP BY student_id, class_id, EXTRACT(YEAR FROM attendance_date), EXTRACT(MONTH FROM attendance_date);
```

## API Endpoints

```
GET    /attendance                           -- List attendance records
POST   /attendance                           -- Mark attendance
PATCH  /attendance?id=eq.{uuid}              -- Update attendance

GET    /grade_entries                        -- List grade entries
POST   /grade_entries                        -- Add grade
GET    /student_grade_summary                -- Get grade summary

GET    /assessments                          -- List assessments
POST   /assessments                          -- Create assessment
GET    /assessment_grades                    -- List assessment grades

GET    /conduct_ratings                      -- List conduct ratings
POST   /conduct_ratings                      -- Add conduct rating

GET    /regular_assessments                  -- Regular assessments
GET    /grade_review_requests                -- Review requests
```

## Requirements Met

- [x] Daily attendance tracking
- [x] Grade entries (oral, quiz, midterm, final)
- [x] Assessment management
- [x] Conduct ratings per semester
- [x] Regular assessments (teacher comments)
- [x] Grade review requests
- [x] Views for summaries

## Next Steps

Phase 04: Finance (fees, invoices, payments).
