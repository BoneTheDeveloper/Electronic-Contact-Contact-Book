# Grade Database Schema Analysis Report

## Database Tables Structure

### 1. Core Grade Tables

**grades** (Reference table)
- `id` TEXT PRIMARY KEY ('6', '7', '8', '9')
- `name` TEXT UNIQUE ('Khối 6', 'Khối 7')
- `display_order` INT
- `created_at` TIMESTAMPTZ

**subjects** (Reference table)
- `id` TEXT PRIMARY KEY ('toan', 'van', 'anh')
- `name` TEXT UNIQUE ('Toán', 'Tiếng Việt')
- `name_en` TEXT ('Mathematics', 'Vietnamese')
- `code` TEXT UNIQUE ('M_TOAN', 'M_VAN')
- `is_core` BOOLEAN
- `description` TEXT
- `display_order` INT

**classes**
- `id` TEXT PRIMARY KEY ('6A', '6B', '7A')
- `name` TEXT UNIQUE
- `grade_id` TEXT REFERENCES grades
- `academic_year` TEXT DEFAULT '2024-2025'
- `room` TEXT
- `capacity` INT
- `current_students` INT
- `status` TEXT DEFAULT 'active'
- `created_at`, `updated_at` TIMESTAMPTZ

**assessments** (Grade categories/assignments)
- `id` UUID PRIMARY KEY
- `class_id` TEXT REFERENCES classes
- `subject_id` TEXT REFERENCES subjects
- `teacher_id` UUID REFERENCES teachers
- `name` TEXT ('Kiểm tra 15 phút', 'Giữa kỳ')
- `assessment_type` TEXT ('quiz', 'midterm', 'final', 'assignment', 'project')
- `date` DATE
- `max_score` DECIMAL(5,2) DEFAULT 10
- `weight` DECIMAL(3,2) DEFAULT 1.0 (Weight for final grade calculation)
- `semester` TEXT DEFAULT '1' ('1', '2', 'all')
- `school_year` TEXT DEFAULT '2024-2025'
- `notes` TEXT
- `created_at`, `updated_at` TIMESTAMPTZ

**grade_entries** (Individual student grades)
- `id` UUID PRIMARY KEY
- `assessment_id` UUID REFERENCES assessments
- `student_id` UUID REFERENCES students
- `score` DECIMAL(5,2) (Actual score 0-10)
- `status` TEXT DEFAULT 'graded' ('pending', 'graded', 'excused', 'absent')
- `notes` TEXT
- `graded_by` UUID REFERENCES teachers
- `graded_at` TIMESTAMPTZ (Auto-updated when score entered)
- `created_at`, `updated_at` TIMESTAMPTZ
- UNIQUE(assessment_id, student_id)

## Available Grade Types

From assessments table:
- `quiz` - Short quizzes (15-30 min)
- `midterm` - Midterm exams
- `final` - Final exams
- `assignment` - Homework assignments
- `project` - Projects

## Grade Calculation Formula

Based on wireframe analysis, the final grade calculation uses weighted average:
```
ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
```

Where:
- TX1, TX2, TX3: Three periodic assessment scores (weight: 1 each)
- GK: Midterm score (weight: 2)
- CK: Final score (weight: 3)
- Total weight = 1+1+1+2+3 = 8

Grade scale:
- Excellent (Giỏi): ≥ 8.0
- Good (Khá): 6.5 - 7.9
- Average (Trung bình): 5.0 - 6.4
- Poor (Yếu): < 5.0

## Existing API Endpoints

From queries.ts:
- `getAssessments(teacherId)` - Get teacher's assessments with submission counts
- `getGradeEntrySheet(classId, subject)` - Get empty grade sheet structure
- Teacher can view/manage class grades via RLS policies

## RLS Policies for Grade Access

**Grade Entries Table:**
- Students: Can view own grades
- Parents: Can view children's grades
- Teachers: Can manage grades for their classes
- Admins: Full access

**Assessments Table:**
- Students: Can view class assessments
- Parents: Can view children's assessments
- Teachers: Can manage own assessments only
- Admins: Can view all assessments

## Grade Locking Mechanism

**Current Implementation:**
1. Wireframe shows UI lock button with confirmation dialog
2. Grades can be locked to prevent further editing
3. Locked grades show "locked" class and disabled inputs
4. Only admins can unlock (confirmed in UI text)

**Missing Implementation:**
- No database field for grade locking status
- Need to add `locked` boolean field to grade_entries or assessments
- Need RLS policy for locked grades (only admin can update)
- Need lock/unlock timestamp fields

## Gaps for Implementation

1. **Locking System**: Need to add locking mechanism to database
2. **Weight Configuration**: Currently hardcoded weights, need flexible assessment types
3. **Grade History**: No audit trail for grade changes
4. **Bulk Operations**: Wireframe shows Excel import/export, not implemented
5. **Review System**: Wireframe shows review requests feature, no database table

## Recommendations

1. Add `is_locked` field to assessments table
2. Create `grade_reviews` table for appeal requests
3. Add `grade_history` table for audit trail
4. Implement weight configuration per assessment type
5. Add bulk grade import/export API endpoints

---
*Report generated: 2026-01-25*
*Analysis based on migrations, types, queries, and wireframe*