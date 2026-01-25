# Teacher Database Schema Research Report

## Executive Summary

This report analyzes the database schema and existing data for the teacher dashboard, specifically focusing on teacher GV001 (ID: 33b6ed21-c8bc-4a74-8af3-73e93829aff0). The system has a comprehensive schema but lacks sufficient test data to support a fully functional teacher dashboard.

## Table Schemas & Relationships

### Core User Tables

#### profiles
- **Purpose**: Main user table for all roles
- **Key columns**: id (PK), email, role, full_name, phone, status, avatar_url
- **Relationship**: Links to role-specific tables via id
- **Current data**: 1,834 total profiles

#### teachers
- **Purpose**: Teacher-specific information
- **Key columns**: id (PK), employee_code (unique), subject, join_date
- **Relationship**: FK to profiles.id
- **Current data**: 15 teachers

#### students
- **Purpose**: Student-specific information
- **Key columns**: id (PK), student_code (unique), date_of_birth, gender, address, enrollment_date, guardian_id
- **Relationship**: FK to profiles.id
- **Current data**: 907 students

#### parents
- **Purpose**: Parent-specific information
- **Key columns**: id (PK), parent_code (unique, format: PH202600001), relationship
- **Relationship**: FK to profiles.id
- **Current data**: 907 parents

#### admins
- **Purpose**: Admin-specific information
- **Key columns**: id (PK), admin_code (unique), department, join_date
- **Relationship**: FK to profiles.id
- **Current data**: 2 admins

### Academic Structure

#### grades
- **Purpose**: Academic grade levels (Lớp 10, 11, 12)
- **Key columns**: id (PK), name, display_order
- **Relationship**: FK to classes.grade_id
- **Current data**: 4 grades

#### classes
- **Purpose**: Individual classes within grades
- **Key columns**: id (PK), name, grade_id, academic_year, room, capacity, current_students, status
- **Relationship**: FK to grades.id, class_teachers.class_id, enrollments.class_id
- **Current data**: 5 classes

#### subjects
- **Purpose**: Academic subjects
- **Key columns**: id (PK), name, name_en, code, is_core, display_order, description
- **Relationship**: FK to schedules.subject_id, assessments.subject_id
- **Current data**: 2 subjects (Toán, Lý)

#### periods
- **Purpose**: Time periods for daily schedule
- **Key columns**: id (PK), name, start_time, end_time, is_break, display_order
- **Relationship**: FK to schedules.period_id, attendance.period_id
- **Current data**: 10 periods

### Schedule & Teaching

#### schedules
- **Purpose**: Teacher class schedule assignments
- **Key columns**: id (PK), class_id, subject_id, teacher_id, period_id, day_of_week, room, semester, school_year
- **Relationship**:
  - FK to classes.id
  - FK to subjects.id
  - FK to teachers.id
  - FK to periods.id
- **Current data**: 8 schedule entries for GV001

#### class_teachers
- **Purpose**: Homeroom teacher assignments
- **Key columns**: id (PK), class_id, teacher_id, academic_year, semester, is_primary, appointed_date, notes
- **Relationship**: FK to classes.id, teachers.id
- **Current data**: 1 entry (GV001 is homeroom for 6A)

### Academic Records

#### assessments
- **Purpose**: Assignments, tests, and exams
- **Key columns**: id (PK), class_id, subject_id, teacher_id, name, assessment_type, date, max_score, weight, semester, school_year
- **Relationship**:
  - FK to classes.id
  - FK to subjects.id
  - FK to teachers.id
- **Current data**: 0 (empty for GV001)

#### grade_entries
- **Purpose**: Individual student grades for assessments
- **Key columns**: id (PK), assessment_id, student_id, score, status, notes, graded_by, graded_at
- **Relationship**:
  - FK to assessments.id
  - FK to students.id
  - FK to teachers.id (graded_by)
- **Current data**: 0 (empty)

### Attendance

#### attendance
- **Purpose**: Student attendance records
- **Key columns**: id (PK), student_id, class_id, date, period_id, status, notes, recorded_by
- **Relationship**:
  - FK to students.id
  - FK to classes.id
  - FK to periods.id
  - FK to teachers.id (recorded_by)
- **Current data**: 0 (empty)

### Enrollment & Guardianship

#### enrollments
- **Purpose**: Student-class enrollment records
- **Key columns**: id (PK), student_id, class_id, academic_year, status, enrollment_date, exit_date, notes
- **Relationship**:
  - FK to students.id
  - FK to classes.id
- **Current data**: 4 entries

#### student_guardians
- **Purpose**: Junction table for student-guardian relationships
- **Key columns**: student_id (PK), guardian_id (PK), is_primary
- **Relationship**:
  - FK to students.id
  - FK to parents.id
- **Current data**: 4 entries

### Administrative

#### leave_requests
- **Purpose**: Student leave/absence requests
- **Key columns**: id (PK), student_id, class_id, request_type, start_date, end_date, reason, status, approved_by, approved_at
- **Relationship**:
  - FK to students.id
  - FK to classes.id
  - FK to teachers.id (approved_by)
- **Current data**: 0 (empty)

#### notifications
- **Purpose**: System notifications
- **Key columns**: id (PK), recipient_id, sender_id, title, content, type, related_type, related_id, is_read, priority
- **Relationship**: FK to profiles.id (recipient_id, sender_id)
- **Current data**: 0 (empty)

#### messages
- **Purpose**: Direct messaging system
- **Key columns**: id (PK), thread_id, sender_id, recipient_id, subject, content, related_type, related_id
- **Relationship**: FK to profiles.id (sender_id, recipient_id)
- **Current data**: 0 (empty)

## Current Data for Teacher GV001

### Teacher Profile
- **ID**: 33b6ed21-c8bc-4a74-8af3-73e93829aff0
- **Email**: gv001@econtact.vn
- **Full Name**: Nguyễn Văn Giáo
- **Employee Code**: GV0001
- **Subject**: Toán, Lý
- **Join Date**: 2026-01-23

### Class Assignments
- **Homeroom Class**: 6A (Lớp 6A)
  - Primary teacher: Yes
  - Academic Year: 2024-2025
  - Semester: all
  - Appointed: 2026-01-24
  - Notes: Giáo viên chủ nhiệm

### Teaching Schedule
Teaches 3 classes:
1. **6A** - Toán (Math)
   - Period 1 (07:00-07:45) on Monday, Thursday, Saturday
   - Room: A101

2. **8C** - Toán (Math)
   - Period 2 (07:50-08:35) on Monday, Thursday, Saturday
   - Room: C301

3. **7B** - Lý (Physics)
   - Period 4 (09:35-10:20) on Tuesday, Wednesday, Friday
   - Room: B201

### Student Enrollment
- **6A**: Only 1 student (ST2024001 - Test Student)
- **8C**: No students enrolled
- **7B**: No students enrolled

### Missing Data
1. **Assessments**: No assessments created
2. **Grades**: No grade entries
3. **Attendance**: No attendance records
4. **Leave Requests**: No leave requests
5. **Comments**: No student comments
6. **Additional Students**: Only 1 total student across all classes

## Data Relationships Summary

### Foreign Key Relationships
- **profiles.id** → teachers.id, students.id, parents.id, admins.id
- **teachers.id** → schedules.teacher_id, class_teachers.teacher_id, assessments.teacher_id, attendance.recorded_by, grade_entries.graded_by
- **students.id** → enrollments.student_id, attendance.student_id, grade_entries.student_id, leave_requests.student_id
- **classes.id** → class_teachers.class_id, schedules.class_id, assessments.class_id, enrollments.class_id, attendance.class_id
- **subjects.id** → schedules.subject_id, assessments.subject_id
- **periods.id** → schedules.period_id, attendance.period_id

### Many-to-Many Relationships
- **students ↔ parents**: Through student_guardians junction table
- **teachers ↔ classes**: Through schedules and class_teachers junction tables
- **students ↔ classes**: Through enrollments table

## Critical Missing Data for Dashboard Functionality

### 1. Student Enrollment Data
- Need more students in classes 6A, 8C, and 7B
- Current: Only 1 student total (6A)
- Required: ~25-30 students per class for realistic testing

### 2. Academic Records
- **Assessments**: Create assignments for each subject/class
- **Grade Entries**: Input grades for students
- **Attendance**: Mark attendance records

### 3. Administrative Data
- **Leave Requests**: Create sample leave requests
- **Student Comments**: Add academic/behavior comments
- **Notifications**: System notifications

### 4. Time & Schedule Data
- **Periods**: Verify all time periods exist
- **Academic Calendar**: School year, semester dates

## Recommendations

### Immediate Actions
1. **Seed more students** (75+ total across 3 classes)
2. **Create assessments** for each subject taught
3. **Generate sample attendance records**
4. **Create leave requests** for testing approval workflow

### Data Quality Issues
1. **Class Sizes**: Current classes have unrealistic student counts
2. **Schedule Consistency**: Verify no overlapping schedules
3. **Subject Coverage**: Only 2 subjects exist (need more variety)

### Performance Considerations
1. **Query Optimization**: The queries use proper indexing on foreign keys
2. **Caching**: Use React.cache for frequently accessed data
3. **Pagination**: Implement for large datasets (students, grades)

## Technical Implementation Notes

### Dashboard Query Patterns
1. **Teacher Stats**: Aggregate queries from multiple tables
2. **Class Management**: Join schedules, enrollments, and students
3. **Grade Entry**: Join assessments, grade_entries, and student profiles
4. **Attendance**: Filter by date, class, and period

### Security Considerations
- All tables have RLS (Row Level Security) enabled
- Proper foreign key constraints maintain data integrity
- Role-based access control through profiles.role field

## Unresolved Questions

1. **Academic Year**: How many academic years should be supported?
2. **Semester System**: Should dashboard support both semesters simultaneously?
3. **Grade Scale**: What is the scoring system (0-10, percentage, letter grades)?
4. **Attendance Rules**: What constitutes excused vs unexcused absences?
5. **Parent Communication**: How are parent-teacher communications tracked?

## Conclusion

The database schema is well-designed and comprehensive for a teacher dashboard system. However, significant test data seeding is required to fully implement and test the teacher dashboard functionality. The current state only has basic teacher assignments with minimal student data.