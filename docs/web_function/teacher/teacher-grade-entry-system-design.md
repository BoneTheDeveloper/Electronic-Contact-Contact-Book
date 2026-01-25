# Teacher Grade Entry System Design

## Overview
The teacher grade entry system enables teachers to input student grades following the Vietnamese education system's weighted average formula, with support for locking grades and calculating class statistics.

## Database Schema

### Core Tables

#### `assessments` Table
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  teacher_id UUID NOT NULL REFERENCES teachers(id),
  name VARCHAR(100) NOT NULL,
  assessment_type VARCHAR(10) NOT NULL CHECK (assessment_type IN ('tx1', 'tx2', 'tx3', 'gk', 'ck')),
  weight DECIMAL(3,2) NOT NULL,
  max_score DECIMAL(5,2) DEFAULT 10.0,
  date DATE NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  semester VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Assessment Types:**
- `tx1`, `tx2`, `tx3`: Regular tests (weight = 1.0 each)
- `gk`: Midterm exam (weight = 2.0)
- `ck`: Final exam (weight = 3.0)

#### `grade_entries` Table
```sql
CREATE TABLE grade_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  score DECIMAL(5,2),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'locked')),
  notes TEXT,
  graded_by UUID REFERENCES teachers(id),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assessment_id)
);
```

### Relationships
- `assessments.class_id` → `classes.id`
- `assessments.subject_id` → `subjects.id`
- `assessments.teacher_id` → `teachers.id`
- `grade_entries.student_id` → `students.id`
- `grade_entries.assessment_id` → `assessments.id`

## Grade Calculation Formula

### Vietnamese Education Standard
```
ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
```

Where:
- **TX1, TX2, TX3**: Regular test scores (coefficient 1 each)
- **GK**: Midterm exam score (coefficient 2)
- **CK**: Final exam score (coefficient 3)
- **Total weight**: 1 + 1 + 1 + 2 + 3 = 8

### Grade Classification

| Average | Classification | Color |
|---------|---------------|-------|
| ≥ 8.0 | Giỏi (Excellent) | Green |
| 6.5 - 7.9 | Khá (Good) | Blue |
| 5.0 - 6.4 | Trung bình (Average) | Yellow/Amber |
| < 5.0 | Yếu (Poor) | Red |

## API Endpoints

### GET `/api/teacher/grades/{classId}`
Get students with grades for a class.

**Query Parameters:**
- `subjectId` (required): Subject UUID
- `schoolYear` (optional, default: "2024-2025")
- `semester` (optional, default: "2")

**Response:**
```typescript
{
  success: boolean,
  data: {
    students: Array<{
      student_id: string,
      student_code: string,
      full_name: string,
      tx1_score: number | null,
      tx2_score: number | null,
      tx3_score: number | null,
      gk_score: number | null,
      ck_score: number | null,
      average: number | null
    }>,
    lockStatus: {
      is_locked: boolean,
      locked_by: string | null,
      locked_at: string | null
    },
    stats: {
      excellent: number,
      good: number,
      average: number,
      poor: number,
      classAverage: number
    },
    schoolYear: string,
    semester: string
  }
}
```

### POST `/api/teacher/grades`
Save grade entries with optional locking.

**Request Body:**
```typescript
{
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  entries: Array<{
    student_id: string,
    assessment_id: string,
    score: number | null,
    notes?: string,
    status?: 'draft' | 'submitted' | 'locked'
  }>,
  action: 'draft' | 'lock' // 'lock' to finalize grades
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  stats?: {
    excellent: number,
    good: number,
    average: number,
    poor: number,
    classAverage: number
  }
}
```

## Grade Locking Mechanism

### Lock Conditions
- **Initiator**: Teacher who owns the class/subject
- **Scope**: Per class, subject, school year, semester
- **Unlock**: Admin only (by design requirement)

### Lock Status Flow
```
draft → submitted → locked
         ↑           ↑
         └───────────┘ (can revert before lock)
```

### Lock Behavior
- **Draft**: Grades editable, not visible to students/parents
- **Submitted**: Grades editable, visible to students/parents
- **Locked**: Grades read-only, visible to students/parents

### Implementation
```typescript
// Check lock status
async function getGradeLockStatus(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
): Promise<GradeLockStatus> {
  const { data } = await supabase
    .from('grade_entries')
    .select('status, graded_by, graded_at')
    .eq('assessments.class_id', classId)
    .eq('assessments.subject_id', subjectId)
    .eq('assessments.school_year', schoolYear)
    .eq('assessments.semester', semester)
    .eq('status', 'locked')
    .limit(1)

  return data?.length > 0
    ? { is_locked: true, locked_by: data[0].graded_by, locked_at: data[0].graded_at }
    : { is_locked: false, locked_by: null, locked_at: null }
}

// Lock grades (admin-only unlock)
async function lockGrades(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
): Promise<void> {
  await supabase
    .from('grade_entries')
    .update({
      status: 'locked',
      graded_by: teacherId,
      graded_at: new Date().toISOString()
    })
    .eq('assessments.class_id', classId)
    .eq('assessments.subject_id', subjectId)
    .eq('assessments.school_year', schoolYear)
    .eq('assessments.semester', semester)
    .neq('status', 'locked')
}
```

## Assessment Auto-Creation

### Automatic Assessment Generation
When teacher opens grade entry for class/subject/semester:

```typescript
async function getOrCreateClassAssessments(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
): Promise<Record<string, string>> {
  // Check existing assessments
  const existing = await getAssessments(classId, subjectId, schoolYear, semester)
  const assessmentMap = new Map(existing.map(a => [a.assessment_type, a.id]))

  // Create missing assessments
  const types = ['tx1', 'tx2', 'tx3', 'gk', 'ck'] as const
  const weights = { tx1: 1, tx2: 1, tx3: 1, gk: 2, ck: 3 }
  const names = {
    tx1: 'Kiểm tra viết 1',
    tx2: 'Kiểm tra viết 2',
    tx3: 'Kiểm tra viết 3',
    gk: 'Giữa kỳ',
    ck: 'Cuối kỳ'
  }

  const result: Record<string, string> = {}
  for (const type of types) {
    if (assessmentMap.has(type)) {
      result[type] = assessmentMap.get(type)!
    } else {
      const newAssessment = await createAssessment({
        class_id: classId,
        subject_id: subjectId,
        teacher_id: teacherId,
        name: names[type],
        assessment_type: type,
        weight: weights[type],
        max_score: 10,
        school_year: schoolYear,
        semester: semester
      })
      result[type] = newAssessment.id
    }
  }
  return result
}
```

## UI Components

### GradeEntryFormClient
**Location:** `apps/web/components/teacher/GradeEntryFormClient.tsx`

**Features:**
- Filters: School year, semester, class, subject
- Grade inputs: TX1, TX2, TX3, GK, CK
- Real-time average calculation per student
- Color-coded averages
- Class statistics dashboard
- Save draft / Lock grades buttons
- Excel import/export (UI only - not implemented)

### Grade Input Cell
```typescript
interface GradeInputProps {
  value: number | null,
  onChange: (value: number | null) => void,
  disabled: boolean,
  min: 0,
  max: 10,
  step: 0.25
}
```

**Validation Rules:**
- Range: 0.0 - 10.0
- Step: 0.25 (quarter points)
- Visual feedback: Green bg when filled

## Statistics Calculation

### Class Statistics
```typescript
interface GradeStatistics {
  excellent: number  // Count of averages ≥ 8.0
  good: number       // Count of averages 6.5 - 7.9
  average: number    // Count of averages 5.0 - 6.4
  poor: number       // Count of averages < 5.0
  classAverage: number // Average of all student averages
}
```

**Calculation Logic:**
```typescript
async function calculateGradeStatistics(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
): Promise<GradeStatistics> {
  const grades = await getStudentGradesForClass(
    classId, subjectId, schoolYear, semester
  )

  const averages = grades
    .map(g => g.average)
    .filter((a): a is number => a !== null)

  return {
    excellent: averages.filter(a => a >= 8.0).length,
    good: averages.filter(a => a >= 6.5 && a < 8.0).length,
    average: averages.filter(a => a >= 5.0 && a < 6.5).length,
    poor: averages.filter(a => a < 5.0).length,
    classAverage: averages.length > 0
      ? averages.reduce((a, b) => a + b, 0) / averages.length
      : 0
  }
}
```

## Teacher Assignment Logic

### Class Access for Grade Entry

```typescript
interface TeacherClass {
  id: string
  class_id: string
  class_name: string
  subject_id: string
  subject_name: string
  grade: string
  student_count: number
  is_homeroom: boolean
}
```

### Permission Model
1. **Subject Teachers**: Can enter grades ONLY for subjects they teach
   - Verified via `schedules` table
   - One entry per class-subject combination

2. **Homeroom Teachers**: Special entry "Tất cả môn"
   - Can view all subjects for their class
   - Cannot enter grades (not subject teacher)

### Service Function
```typescript
async function getTeacherClassesForGrades(
  teacherId: string
): Promise<TeacherClass[]> {
  // Get subject teacher assignments
  const scheduleData = await supabase
    .from('schedules')
    .select(`
      class_id,
      subject_id,
      classes!inner(id, name, grade_id, current_students, grades!inner(name)),
      subjects!inner(id, name)
    `)
    .eq('teacher_id', teacherId)
    .eq('school_year', '2024-2025')

  // Create unique class-subject combinations
  const uniqueCombos = new Map<string, TeacherClass>()
  scheduleData.forEach(s => {
    const key = `${s.classes.id}_${s.subjects.id}`
    if (!uniqueCombos.has(key)) {
      uniqueCombos.set(key, {
        id: key,
        class_id: s.classes.id,
        class_name: s.classes.name,
        subject_id: s.subjects.id,
        subject_name: s.subjects.name,
        name: s.classes.name,
        grade: s.classes.grades.name,
        student_count: s.classes.current_students,
        is_homeroom: false
      })
    }
  })

  return Array.from(uniqueCombos.values())
    .sort((a, b) => a.class_name.localeCompare(b.class_name))
}
```

## Key Functions Reference

### Query Functions (`apps/web/lib/supabase/queries/grades.ts`)

```typescript
// Get students with grades for a class
getStudentGradesForClass(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
) → Promise<StudentGradeInfo[]>

// Calculate weighted average
calculateAverage(
  tx1: number | null,
  tx2: number | null,
  tx3: number | null,
  gk: number | null,
  ck: number | null
) → number | null

// Get or create assessments (TX1, TX2, TX3, GK, CK)
getOrCreateClassAssessments(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
) → Promise<Record<string, string>>

// Save or update grade entries
saveGradeEntries(
  entries: GradeInput[],
  teacherId: string
) → Promise<void>

// Get grade lock status
getGradeLockStatus(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
) → Promise<GradeLockStatus>

// Lock grades
lockGrades(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
) → Promise<void>

// Calculate class statistics
calculateGradeStatistics(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
) → Promise<GradeStatistics>
```

## Data Flow

### Grade Entry Workflow
```
1. Teacher selects class/subject/semester
   ↓
2. System auto-creates assessments (TX1, TX2, TX3, GK, CK)
   ↓
3. System fetches enrolled students + existing grades
   ↓
4. Teacher enters grades (0-10, step 0.25)
   ↓
5. Real-time average calculation per student
   ↓
6. Real-time class statistics update
   ↓
7. Save draft or Lock grades
   ↓
8. If locked: grades become read-only (admin-only unlock)
```

## Mobile App Integration

### Student View
- View grades by subject/semester
- Real-time average calculation
- Grade history charts
- Performance comparison with class average

### Parent View
- Child's grades by subject
- Attendance + grades correlation
- Receive notifications when grades posted
- Grade improvement tracking

### Realtime Sync
```
Teacher (Web) → Supabase → Realtime → Mobile App (Student/Parent)
```

## Security & RLS

### Row Level Security Policies
```sql
-- Teachers can only enter grades for their assigned subjects
CREATE POLICY teachers_grade_entries_insert ON grade_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN schedules s ON s.class_id = a.class_id
                        AND s.subject_id = a.subject_id
      WHERE a.id = NEW.assessment_id
      AND s.teacher_id = auth.uid()
    )
  );

-- Teachers can only view their classes' grades
CREATE POLICY teachers_grade_entries_select ON grade_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assessments a
      JOIN schedules s ON s.class_id = a.class_id
                        AND s.subject_id = a.subject_id
      WHERE a.id = grade_entries.assessment_id
      AND s.teacher_id = auth.uid()
    )
  );

-- Admins can view/modify all grades
CREATE POLICY admins_grade_entries_all ON grade_entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
  );
```

## Error Handling

### Common Errors
| Error | Cause | Resolution |
|-------|-------|------------|
| `subject_not_assigned` | Teacher doesn't teach subject | Check schedules table |
| `grade_locked` | Grades already locked | Admin override required |
| `invalid_score` | Score outside 0-10 range | Validate input |
| `assessment_missing` | Assessment not found | Auto-create assessments |

## Excel Import/Export

### Current Status: UI Only
- Buttons displayed ("Tải template", "Import từ Excel")
- Not implemented (as per user requirement)

### Future Implementation Plan
1. **Template Download**: Generate Excel template with student list
2. **Import**: Parse Excel file, validate scores, bulk insert
3. **Export**: Export current grades to Excel format

## Grade Review System (Future)

### Planned Features
- Student/Parent grade review requests
- Teacher review response
- Admin arbitration
- Review history tracking

### Database Schema (Future)
```sql
CREATE TABLE grade_reviews (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  assessment_id UUID REFERENCES assessments(id),
  current_score DECIMAL(5,2),
  requested_score DECIMAL(5,2),
  reason TEXT,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Best Practices

### For Teachers
1. **Save frequently**: Use "Lưu nháp" to prevent data loss
2. **Double-check before locking**: Locked grades require admin to unlock
3. **Validate input**: Ensure scores are 0-10 with 0.25 increments
4. **Use auto-fill**: Auto-fill approved leaves to save time

### For Developers
1. **Always upsert**: Use onConflict for idempotent operations
2. **Calculate client-side**: Real-time averages for better UX
3. **Batch operations**: Use Promise.all for parallel queries
4. **Error boundaries**: Handle Supabase errors gracefully
