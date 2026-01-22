# Phase 02 - Academic Data Structure

**Date**: 2026-01-22 | **Priority**: High | **Status**: Draft

## Overview

Academic structure: grades, classes, subjects, schedules, and enrollments for middle school (grades 6-9).

## Context

From mock data:
- SUPPORTED_GRADES: ['6', '7', '8', '9']
- Classes: 6A, 6B, 7A, etc.
- Each class has homeroom teacher, room, student count
- Teachers assigned to multiple classes for subjects

## Key Insights

1. **Middle school model**: Grades 6-9, ~6 classes per grade
2. **Class ID pattern**: [6-9][A-Z] (e.g., 6A, 9C)
3. **Homeroom teacher**: Each class has one GVCN
4. **Subject teaching**: Teachers teach multiple classes

## Schema Design

### 1. Grades (Khối)

```sql
CREATE TABLE grades (
  id TEXT PRIMARY KEY CHECK (id IN ('6', '7', '8', '9')),
  name TEXT NOT NULL UNIQUE, -- e.g., 'Khối 6', 'Khối 7'
  display_order INT DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO grades (id, name, display_order) VALUES
  ('6', 'Khối 6', 6),
  ('7', 'Khối 7', 7),
  ('8', 'Khối 8', 8),
  ('9', 'Khối 9', 9);
```

### 2. Classes (Lớp học)

```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY, -- e.g., '6A', '7B', '9C'
  name TEXT NOT NULL, -- Display name
  grade_id TEXT REFERENCES grades(id) ON DELETE RESTRICT,
  room TEXT, -- e.g., 'A101', 'P.101'
  capacity INT DEFAULT 40,
  homeroom_teacher_id UUID REFERENCES teachers(id),
  school_year TEXT DEFAULT '2024-2025',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_class_id CHECK (id ~ '^[6-9][A-Z]$')
);

CREATE INDEX idx_classes_grade ON classes(grade_id);
CREATE INDEX idx_classes_homeroom ON classes(homeroom_teacher_id);
CREATE INDEX idx_classes_year ON classes(school_year);

-- Trigger for updated_at
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Student count computed column (via view or function)
```

### 3. Subjects (Môn học)

```sql
CREATE TABLE subjects (
  id TEXT PRIMARY KEY, -- e.g., 'toan', 'van', 'anh'
  name TEXT NOT NULL UNIQUE, -- e.g., 'Toán', 'Tiếng Việt'
  name_en TEXT, -- e.g., 'Mathematics', 'Vietnamese'
  code TEXT UNIQUE NOT NULL, -- e.g., 'M_TOAN', 'M_VAN'
  is_core BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Vietnamese middle school subjects
INSERT INTO subjects (id, name, name_en, code, is_core, display_order) VALUES
  ('toan', 'Toán', 'Mathematics', 'M_TOAN', true, 1),
  ('van', 'Tiếng Việt', 'Vietnamese', 'M_VAN', true, 2),
  ('anh', 'Tiếng Anh', 'English', 'M_ANH', true, 3),
  ('ly', 'Vật lý', 'Physics', 'M_LY', false, 4),
  ('hoa', 'Hóa học', 'Chemistry', 'M_HOA', false, 5),
  ('sinh', 'Sinh học', 'Biology', 'M_SINH', false, 6),
  ('su', 'Lịch sử', 'History', 'M_SU', false, 7),
  ('dia', 'Địa lý', 'Geography', 'M_DIA', false, 8),
  ('gdcd', 'GDCĐ', 'Civics', 'M_GDCD', false, 9),
  ('tin', 'Tin học', 'IT', 'M_TIN', false, 10),
  ('td', 'Thể dục', 'PE', 'M_TD', false, 11),
  ('nhac', 'Âm nhạc', 'Music', 'M_NHAC', false, 12),
  ('mythuat', 'Mỹ thuật', 'Art', 'M_MYTHUAT', false, 13),
  ('congnghe', 'Công nghệ', 'Technology', 'M_CN', false, 14);
```

### 4. Class Enrollments (Học sinh trong lớp)

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_year TEXT DEFAULT '2024-2025',
  semester TEXT CHECK (semester IN ('1', '2', 'all')) DEFAULT 'all',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'transferred')),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  withdrawal_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(student_id, class_id, school_year)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_year ON enrollments(school_year);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Active enrollment check function
CREATE OR REPLACE FUNCTION get_student_class(student_uuid UUID, school_year TEXT DEFAULT '2024-2025')
RETURNS TEXT AS $$
  SELECT class_id FROM enrollments
  WHERE student_id = student_uuid
    AND school_year = school_year
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL STABLE;
```

### 5. Teacher Assignments (Giáo viên chủ nhiệm/giảng dạy)

```sql
CREATE TABLE teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES subjects(id) ON DELETE SET NULL, -- NULL = homeroom
  assignment_type TEXT CHECK (assignment_type IN ('homeroom', 'subject')) NOT NULL,
  school_year TEXT DEFAULT '2024-2025',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_homeroom UNIQUE (class_id, school_year, assignment_type)
    WHERE assignment_type = 'homeroom'
);

CREATE INDEX idx_teacher_assignments_teacher ON teacher_assignments(teacher_id);
CREATE INDEX idx_teacher_assignments_class ON teacher_assignments(class_id);
CREATE INDEX idx_teacher_assignments_subject ON teacher_assignments(subject_id);

-- Get homeroom teacher
CREATE OR REPLACE FUNCTION get_homeroom_teacher(class_text TEXT)
RETURNS UUID AS $$
  SELECT teacher_id FROM teacher_assignments
  WHERE class_id = class_text
    AND assignment_type = 'homeroom'
    AND school_year = '2024-2025'
  LIMIT 1;
$$ LANGUAGE SQL STABLE;
```

### 6. Schedule Templates (Thời khóa biểu mẫu)

```sql
CREATE TABLE schedule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 2 AND 7), -- 2=Mon, 7=Sat
  period_start INT CHECK (period_start BETWEEN 1 AND 10),
  period_end INT CHECK (period_end BETWEEN 1 AND 10),
  room TEXT,
  school_year TEXT DEFAULT '2024-2025',
  semester TEXT CHECK (semester IN ('1', '2', 'all')) DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_period_range CHECK (period_end >= period_start)
);

CREATE INDEX idx_schedule_class ON schedule_templates(class_id);
CREATE INDEX idx_schedule_teacher ON schedule_templates(teacher_id);
CREATE INDEX idx_schedule_day_period ON schedule_templates(day_of_week, period_start);
```

### 7. Periods (Tiết học)

```sql
CREATE TABLE periods (
  id INT PRIMARY KEY CHECK (id BETWEEN 1 AND 10),
  name TEXT NOT NULL, -- e.g., 'Tiết 1', 'Tiết 2'
  start_time TIME NOT NULL, -- e.g., '07:30:00'
  end_time TIME NOT NULL,   -- e.g., '08:15:00'
  is_break BOOLEAN DEFAULT false,
  display_order INT DEFAULT id
);

-- Seed periods (Vietnamese school schedule)
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
```

## Views

### Active Class View

```sql
CREATE VIEW active_classes AS
SELECT
  c.id,
  c.name,
  c.grade_id,
  c.room,
  c.capacity,
  c.homeroom_teacher_id,
  p.full_name AS homeroom_teacher_name,
  c.school_year,
  COUNT(e.student_id) AS student_count,
  COUNT(e.student_id) FILTER (WHERE e.status = 'active') AS active_students
FROM classes c
LEFT JOIN teacher_assignments ta ON ta.class_id = c.id AND ta.assignment_type = 'homeroom'
LEFT JOIN teachers t ON t.id = ta.teacher_id
LEFT JOIN profiles p ON p.id = t.id
LEFT JOIN enrollments e ON e.class_id = c.id AND e.school_year = c.school_year
WHERE c.status = 'active'
GROUP BY c.id, c.name, c.grade_id, c.room, c.capacity, c.homeroom_teacher_id, p.full_name, c.school_year;
```

### Student Class Info View

```sql
CREATE VIEW student_class_info AS
SELECT
  s.id AS student_id,
  s.student_code,
  p.full_name AS student_name,
  e.class_id,
  c.name AS class_name,
  c.grade_id,
  g.name AS grade_name,
  c.room,
  c.school_year,
  e.status AS enrollment_status
FROM students s
JOIN profiles p ON p.id = s.id
JOIN enrollments e ON e.student_id = s.id AND e.status = 'active'
JOIN classes c ON c.id = e.class_id
JOIN grades g ON g.id = c.grade_id;
```

## API Endpoints

```
GET    /grades                          -- List grades
GET    /classes                         -- List all classes
GET    /active_classes                  -- List active classes with counts
GET    /classes?id=eq.6A                -- Get specific class
GET    /subjects                        -- List subjects
GET    /enrollments                     -- List enrollments
GET    /enrollments?student_id=eq.{uuid} -- Get student's class
GET    /teacher_assignments             -- List assignments
GET    /schedule_templates              -- Get schedule template
GET    /student_class_info              -- Get student class details
```

## Requirements Met

- [x] Grades 6-9 structure
- [x] Class management with homeroom teachers
- [x] Subject catalog
- [x] Student enrollment tracking
- [x] Teacher assignment (homeroom + subject)
- [x] Schedule template system

## Next Steps

Phase 03: Academics (attendance, grades, assessments).
