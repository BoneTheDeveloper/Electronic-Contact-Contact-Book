# Supabase Database Schema Research for Teacher Data Seeding

## 1. Teacher-Related Tables

### teachers table
- **Structure:**
  - `id`: UUID (PK, FK to profiles.id)
  - `employee_code`: TEXT unique (auto-generated: "GV" + sequence)
  - `subject`: TEXT nullable
  - `join_date`: DATE default CURRENT_DATE
  - `created_at`, `updated_at`: timestamptz

- **Available Teachers (15):**
  - GV0001: Ngô Thị Sương
  - GV0002: Nguyễn Thị Sương
  - GV0003: Hồ Văn An
  - GV0004: Ngô Thị Gái
  - GV0005: Đỗ Thị Lan
  - GV0006: Bùi Thị Ngọc
  - GV0007: Hồ Văn An
  - GV0008: Vũ Văn Thành
  - GV0009: Vũ Thị Bình
  - GV0010: Trần Văn Em
  - GV0011: Phạm Thị Quỳnh
  - GV0012: Võ Vân Rạng
  - GV0013: Đỗ Văn Thành
  - GV0014: Phạm Thị Lan
  - GV0015: Phan Văn Thành

### class_teachers table
- **Purpose:** Homeroom teacher assignments
- **Structure:**
  - `id`: UUID (PK)
  - `class_id`: TEXT (FK to classes.id)
  - `teacher_id`: UUID (FK to teachers.id)
  - `academic_year`: TEXT default '2024-2025'
  - `semester`: TEXT check ('1', '2', 'all') default '1'
  - `is_primary`: BOOLEAN default false
  - `appointed_date`: DATE default CURRENT_DATE
  - `notes`: TEXT nullable
  - **Currently empty**

### schedules table
- **Purpose:** Subject teaching assignments
- **Structure:**
  - `id`: UUID (PK)
  - `class_id`: TEXT (FK to classes.id)
  - `subject_id`: TEXT (FK to subjects.id)
  - `teacher_id`: UUID (FK to teachers.id)
  - `period_id`: INTEGER (FK to periods.id)
  - `day_of_week`: INTEGER check (1-7)
  - `room`: TEXT nullable
  - `semester`: TEXT default '1'
  - `school_year`: TEXT default '2024-2025'
  - `notes`: TEXT nullable
  - **Currently empty**

## 2. Class-Related Tables

### classes table
- **Structure:**
  - `id`: TEXT (PK)
  - `name`: TEXT unique
  - `grade_id`: TEXT (FK to grades.id)
  - `academic_year`: TEXT default '2024-2025'
  - `room`: TEXT nullable
  - `capacity`: INTEGER default 40
  - `current_students`: INTEGER default 0
  - `status`: TEXT check ('active', 'inactive') default 'active'

- **Available Classes:**
  - 6B (Grade 6, 2 students)
  - 9A (Grade 9, 1 student)

### grades table
- **Structure:**
  - `id`: TEXT (PK)
  - `name`: TEXT unique
  - `display_order`: INTEGER

- **Available Grades:**
  - Lớp 6 (id: 6)
  - Lớp 9 (id: 9)

*Note: Missing Grades 10, 11, 12*

### subjects table
- **Structure:**
  - `id`: TEXT (PK)
  - `name`: TEXT unique
  - `name_en`: TEXT nullable
  - `code`: TEXT unique
  - `is_core`: BOOLEAN default false
  - `display_order`: INTEGER
  - `description`: TEXT nullable

- **Status: Empty table - needs to be seeded**

### periods table
- **Structure:**
  - `id`: INTEGER (PK)
  - `name`: TEXT
  - `start_time`: TIME
  - `end_time`: TIME
  - `is_break`: BOOLEAN default false
  - `display_order`: INTEGER

- **Available Periods (10):**
  1. Tiết 1: 07:00-07:45
  2. Tiết 2: 07:50-08:35
  3. Tiết 3: 08:40-09:25
  4. Tiết 4: 09:35-10:20
  5. Tiết 5: 10:25-11:10
  6. Tiết 6: 13:30-14:15
  7. Tiết 7: 14:20-15:05
  8. Tiết 8: 15:10-15:55
  9. Tiết 9: 16:30-17:15
  10. Tiết 10: 17:20-18:05

## 3. Student Enrollment

### students table
- **Structure:**
  - `id`: UUID (PK, FK to profiles.id)
  - `student_code`: TEXT unique (auto-generated)
  - `date_of_birth`: DATE nullable
  - `gender`: TEXT check ('male', 'female') nullable
  - `address`: TEXT nullable
  - `enrollment_date`: DATE default CURRENT_DATE
  - `guardian_id`: UUID nullable (FK to profiles.id)

### enrollments table
- **Structure:**
  - `id`: UUID (PK)
  - `student_id`: UUID (FK to students.id)
  - `class_id`: TEXT (FK to classes.id)
  - `academic_year`: TEXT default '2024-2025'
  - `status`: TEXT check ('active', 'transferred', 'graduated', 'withdrawn') default 'active'
  - `enrollment_date`: DATE default CURRENT_DATE
  - `exit_date`: DATE nullable
  - `notes`: TEXT nullable

- **Sample Enrollments (3 total):**
  - Student 202690906 in 9A
  - Student 202690804 in 6B
  - Student 202670337 in 6B

## 4. Key Foreign Key Relationships

### Primary Keys ↔ Foreign Keys
- **teachers.id** → **class_teachers.teacher_id**
- **teachers.id** → **schedules.teacher_id**
- **classes.id** → **class_teachers.class_id**
- **classes.id** → **schedules.class_id**
- **subjects.id** → **schedules.subject_id**
- **periods.id** → **schedules.period_id**
- **students.id** → **enrollments.student_id**
- **classes.id** → **enrollments.class_id**

### Profile Hierarchy
- **auth.users** → **profiles.id**
- **profiles.id** → **teachers.id**
- **profiles.id** → **students.id**

## 5. Required vs Optional Fields

### Required Fields for Seeding
- **teachers:** employee_code (auto-gen), id
- **class_teachers:** class_id, teacher_id
- **schedules:** class_id, teacher_id, period_id, day_of_week
- **classes:** id, name, grade_id
- **subjects:** id, name, code
- **grades:** id, name

### Optional Fields
- **teachers:** subject (nullable)
- **class_teachers:** academic_year, semester, is_primary, appointed_date, notes
- **schedules:** subject_id, room, semester, school_year, notes
- **classes:** room, capacity, current_students, status

## 6. Current Data Status

### ✅ Available
- 15 teachers with profile info
- 2 grades (6, 9) - need to add 10, 11, 12
- 2 classes (6B, 9A)
- 10 time periods
- 3 student enrollments

### ❌ Missing/Empty
- **subjects table** (completely empty)
- **schedules table** (completely empty)
- **class_teachers table** (completely empty)
- Grade levels 10, 11, 12
- Missing classes for existing grades

## 7. Teacher Assignment Strategy for GV001

GV001 (Ngô Thị Sương) can be assigned in two ways:

### A. Homeroom Teacher (via class_teachers)
```sql
INSERT INTO class_teachers (class_id, teacher_id, is_primary)
VALUES ('6B', '33b6ed21-c8bc-4a74-8af3-73e93829aff0', true);
```

### B. Subject Teacher (via schedules)
```sql
INSERT INTO schedules (class_id, subject_id, teacher_id, period_id, day_of_week)
VALUES ('6B', 'MATH', '33b6ed21-c8bc-4a74-8af3-73e93829aff0', 1, 2);
```

## 8. Key Questions & Next Steps

### Unresolved Questions
1. **Subjects:** What subjects should be created? (Toán, Lý, etc.)
2. **Grade Levels:** Should we add grades 10, 11, 12 immediately?
3. **Class Structure:** How many classes per grade? Naming convention?
4. **Academic Year:** Is 2024-2025 the correct year?

### Immediate Requirements
1. **Seed subjects table** with Vietnamese subjects
2. **Create missing grade levels** (10, 11, 12)
3. **Create additional classes** for existing grades
4. **Define teacher assignment strategy** (homeroom vs subject)
5. **Establish class-teacher relationship** pattern