# Phase 02: Grades & Attendance

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md) | [phase-01-setup-core-data.md](phase-01-setup-core-data.md)

## Overview

Implement real Supabase queries for grades and attendance data, two of the most frequently accessed screens for students.

## Key Insights

1. Grades require joining `assessments` + `grade_entries` + `subjects` tables
2. Attendance is a simple query on `attendance` table with date filtering
3. Both screens already have good loading/error state UI
4. Need to handle semester/month filtering efficiently

## Requirements

### Functional Requirements
- [ ] Load grades from Supabase with proper joins
- [ ] Load attendance records with month filtering
- [ ] Support semester switching for grades
- [ ] Support month switching for attendance
- [ ] Calculate attendance percentage accurately
- [ ] Handle empty data gracefully

### Technical Requirements
- Efficient queries with proper indexing
- Support real-time updates (optional)
- Cache data to reduce queries

## Architecture

**Grades Query Structure:**
```
grade_entries
  → assessments (assessment details)
  → subjects (subject info)
  → students (filter by student_id)
```

**Attendance Query Structure:**
```
attendance
  → students (filter by student_id)
  → periods (period info, optional)
```

## Related Code Files

- `apps/mobile/src/screens/student/Grades.tsx` - Grades screen (lines 1-1075)
- `apps/mobile/src/screens/student/Attendance.tsx` - Attendance screen (lines 1-726)
- `apps/mobile/src/stores/student.ts` - Student store (lines 265-287)

## Implementation Steps

### Grades Implementation

1. **Create Grades Query** (`src/lib/supabase/queries/grades.ts`)
   ```typescript
   export async function getStudentGrades(
     studentId: string,
     semester: string
   ): Promise<Grade[]> {
     // Query grade_entries with assessments and subjects
     // Filter by student enrollment
     // Filter by semester
   }
   ```

2. **Update Student Store**
   - Replace `MOCK_GRADES` in `loadGrades()`
   - Add semester parameter
   - Calculate subject averages

3. **Test Grades Screen**
   - Verify data displays correctly
   - Test semester switching
   - Test empty states

### Attendance Implementation

1. **Create Attendance Query** (`src/lib/supabase/queries/attendance.ts`)
   ```typescript
   export async function getStudentAttendance(
     studentId: string,
     monthFilter?: string
   ): Promise<AttendanceRecord[]> {
     // Query attendance table
     // Filter by student_id and date range
   }
   ```

2. **Update Student Store**
   - Replace `generateMockAttendance()` in `loadAttendance()`
   - Add month filtering
   - Calculate attendance percentage

3. **Test Attendance Screen**
   - Verify weekly calendar displays correctly
   - Test month filtering
   - Verify attendance calculations

## Todo List

- [ ] Create grades query with proper joins
- [ ] Create attendance query with date filtering
- [ ] Update student store for grades
- [ ] Update student store for attendance
- [ ] Test with real student data
- [ ] Verify semester/month filtering works
- [ ] Check query performance

## Success Criteria

- [ ] Grades screen displays real student grades
- [ ] Semester switching works correctly
- [ ] Subject averages are calculated correctly
- [ ] Attendance screen shows real attendance data
- [ ] Month filtering works for attendance
- [ ] Attendance percentage is accurate
- [ ] Loading states work properly
- [ ] Errors are handled gracefully

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex joins slow down grades query | Medium | Optimize query, add indexes |
| Missing enrollment data | Medium | Handle gracefully, show empty state |
| Date filtering issues for attendance | Low | Use proper date comparisons |

## Database Queries

**Grades Query:**
```sql
SELECT
  ge.id,
  ge.score,
  ge.max_score,
  ge.notes,
  a.id as assessment_id,
  a.name as assessment_name,
  a.assessment_type,
  a.date,
  a.semester,
  s.id as subject_id,
  s.name as subject_name
FROM grade_entries ge
JOIN assessments a ON ge.assessment_id = a.id
JOIN subjects s ON a.subject_id = s.id
WHERE ge.student_id = $1
  AND a.semester = $2
ORDER BY a.date DESC
```

**Attendance Query:**
```sql
SELECT
  id,
  date,
  status,
  notes,
  period_id
FROM attendance
WHERE student_id = $1
  AND date >= $2 AND date <= $3
ORDER BY date DESC
```

## Next Steps

After completing this phase:
1. Move to [phase-03-schedule-dashboard.md](phase-03-schedule-dashboard.md)
2. Test grades and attendance with real student data
3. Verify query performance
