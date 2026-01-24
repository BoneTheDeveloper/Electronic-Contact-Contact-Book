# Student Screens Architecture

## Overview

Student screens fetch data directly from the student record. Parent screens reuse the same components but fetch data for their selected child.

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                              │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │ Supabase Queries │         │     Database      │             │
│  │  (getStudent*)   │◄────────┤  students, grades,│             │
│  └──────────────────┘         │  attendance, etc │             │
│                                └──────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                         Store Layer                             │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  useStudentStore │         │  useParentStore  │             │
│  │ - studentId      │         │ - children[]     │             │
│  │ - studentData    │         │ - selectedChildId│             │
│  │ - grades[]       │         │ - selectedChild  │             │
│  │ - attendance[]   │         │ - (delegates to  │             │
│  │ - loadXxx()      │         │   student data)  │             │
│  └──────────────────┘         └──────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
         �                                    ▲
         │                                    │
┌──────────────┐                    ┌────────────────┐
│Student Screen│                    │  Parent Screen │
│              │                    │                │
│ Get student  │                    │ Get selected   │
│ ID from auth │                    │ child ID from  │
│              │                    │ parent store   │
└──────────────┘                    └────────────────┘
```

## Key Principles

1. **Student owns their data** - All data queries are based on `student_id`
2. **Parent views child's data** - Parent screens use selected child's ID
3. **Shared UI components** - Same interface, different data source
4. **Supabase MCP** - Use Supabase queries for real data

## Student Screen Pattern

### 1. Student Store

```typescript
// stores/student.ts
interface StudentState {
  studentId: string | null;
  studentData: StudentData | null;
  grades: Grade[];
  attendance: AttendanceRecord[];
  schedule: ScheduleItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadStudentData: (studentId: string) => Promise<void>;
  loadGrades: (studentId: string) => Promise<void>;
  loadAttendance: (studentId: string) => Promise<void>;
  loadSchedule: (studentId: string) => Promise<void>;
}
```

### 2. Student Screen Component

```typescript
// screens/student/Grades.tsx
import { useStudentStore } from '../../stores';

export const StudentGradesScreen: React.FC = () => {
  const { studentId, grades, loadGrades } = useStudentStore();

  useEffect(() => {
    if (studentId) {
      loadGrades(studentId);
    }
  }, [studentId]);

  // Render grades using student-specific data
};
```

## Parent Screen Pattern

### 1. Parent Store

```typescript
// stores/parent.ts
interface ParentState {
  children: ChildData[];
  selectedChildId: string | null;

  // Get selected child (delegates to student data)
  getSelectedChildId: () => string | null;
}
```

### 2. Parent Screen Component

```typescript
// screens/parent/Grades.tsx
import { useParentStore } from '../../stores';

export const GradesScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
  const childStudentId = selectedChild?.id;

  // Use same data fetching logic as student screen
  // but with child's student ID
  const { grades, loadGrades } = useStudentStore();

  useEffect(() => {
    if (childStudentId) {
      loadGrades(childStudentId);
    }
  }, [childStudentId]);

  // Render same UI as student screen
};
```

## Supabase Query Functions

Create reusable query functions in `lib/supabase/queries.ts`:

```typescript
// Get student grades
export const getStudentGrades = async (studentId: string) => {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('student_id', studentId as any);
  return data;
};

// Get student attendance
export const getStudentAttendance = async (studentId: string) => {
  const { data, error } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('student_id', studentId as any);
  return data;
};

// Get student schedule
export const getStudentSchedule = async (studentId: string) => {
  const { data, error } = await supabase
    .from('class_schedules')
    .select('*, subjects(*)')
    .eq('class_id', studentId as any);
  return data;
};
```

## Shared Component Pattern

Create shared components that accept `studentId` prop:

```typescript
// components/student/GradesList.tsx
interface GradesListProps {
  studentId: string;
  showAppealButton?: boolean;
}

export const GradesList: React.FC<GradesListProps> = ({
  studentId,
  showAppealButton = true
}) => {
  const { grades, isLoading } = useStudentStore();

  useEffect(() => {
    loadGrades(studentId);
  }, [studentId]);

  // Render grades list
};
```

## Screen List

### Student Screens (use authenticated student's ID)

| Screen | Route | Data Source |
|--------|-------|-------------|
| Dashboard | `StudentDashboard` | `user.id` from auth |
| Schedule | `StudentSchedule` | `student_id` |
| Grades | `StudentGrades` | `student_id` |
| Attendance | `StudentAttendance` | `student_id` |
| Study Materials | `StudentStudyMaterials` | `student_id` |
| Leave Request | `StudentLeaveRequest` | `student_id` |
| Teacher Feedback | `StudentTeacherFeedback` | `student_id` |
| News | `StudentNews` | `student_id` |
| Summary | `StudentSummary` | `student_id` |
| Payment | `StudentPayment` | `student_id` |

### Parent Screens (use selected child's ID)

| Screen | Route | Data Source |
|--------|-------|-------------|
| Child Selection | `ChildSelection` | Lists children |
| Dashboard | `Dashboard` | Shows selected child |
| Schedule | `Schedule` | `selectedChild.id` |
| Grades | `Grades` | `selectedChild.id` |
| Attendance | `Attendance` | `selectedChild.id` |
| Leave Request | `LeaveRequest` | `selectedChild.id` |
| Teacher Feedback | `TeacherFeedback` | `selectedChild.id` |
| News | `News` | `selectedChild.id` |
| Summary | `Summary` | `selectedChild.id` |
| Payment Overview | `PaymentOverview` | `selectedChild.id` |

## Implementation Checklist

### Phase 1: Data Layer
- [ ] Create Supabase query functions for student data
  - [ ] `getStudentGrades(studentId)`
  - [ ] `getStudentAttendance(studentId)`
  - [ ] `getStudentSchedule(studentId)`
  - [ ] `getStudentProfile(studentId)`
  - [ ] `getStudentPayments(studentId)`

### Phase 2: Student Store
- [ ] Update `useStudentStore` to use real Supabase queries
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add cache invalidation

### Phase 3: Student Screens
- [ ] Refactor `StudentAttendance` to use Supabase data
- [ ] Refactor `StudentGrades` to use Supabase data
- [ ] Create `StudentSchedule` screen
- [ ] Create `StudentStudyMaterials` screen
- [ ] Create `StudentPayment` screen

### Phase 4: Parent Screens
- [ ] Update `ParentAttendance` to use selected child ID
- [ ] Update `ParentGrades` to use selected child ID
- [ ] Update all parent screens to delegate to student data

## Button Guidelines

See `docs/mobile_function/` for specific button styles and interactions.

## Notes

- Student login: Direct access to their own data
- Parent login: Must select child first, then view that child's data
- Both use same underlying data queries, just different `student_id`
