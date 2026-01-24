# Phase 04: Academic Screens

**Status:** Pending
**Priority:** High
**Dependencies:** Phase 01, Phase 02

## Overview

Implement the three core academic screens: Grades, Schedule, and Attendance. These are the most frequently used features by students.

## Context Links

- [Grades Wireframe](../../../docs/wireframe/Mobile/student/grades.html)
- [Schedule Wireframe](../../../docs/wireframe/Mobile/student/schedule.html)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md)

## Key Insights

1. Grades need semester toggle and GPA summary
2. Schedule needs day selector and period grouping
3. Attendance needs visual calendar
4. All three have appeal/request actions

## Requirements

### Grades Screen
- Semester selector tabs
- Overall GPA card with rank
- Subject cards with grade breakdown (TX1, TX2, TX3, GK, CK)
- Grade appeal modal

### Schedule Screen
- Week day selector (T2-T7)
- Morning/Afternoon section grouping
- Period cards with subject, teacher, room
- Time display

### Attendance Screen
- Month/year selector
- Visual calendar grid
- Statistics summary
- Absence detail list

## Implementation Steps

### Step 1: Grades Screen (`/student/grades`)

**Data Structure:**
```tsx
interface Grade {
  subjectId: string;
  subjectName: string;
  shortName: string;
  color: string;
  average: number;
  scores: {
    tx1: number | null;
    tx2: number | null;
    tx3: number | null;
    gk: number | null;
    ck: number | null;
  };
}
```

**Components:**
1. `SemesterTabs` - Toggle between semesters
2. `GPACard` - Large score display
3. `SubjectGradeCard` - Individual subject with scores grid
4. `GradeAppealModal` - Appeal form modal

**Grade Grid Cell:**
```tsx
// 5 small cards per subject
// TX1, TX2, TX3: Blue bg, blue-700 text
// GK: Purple bg, purple-700 text
// CK: Orange bg, orange-700 text
```

### Step 2: Schedule Screen (`/student/schedule`)

**Data Structure:**
```tsx
interface SchedulePeriod {
  period: number;
  dayOfWeek: number;
  subject: Subject;
  teacher: Teacher;
  room: string;
  startTime: string;
  endTime: string;
}
```

**Components:**
1. `WeekDaySelector` - Horizontal tabs (T2-T7)
2. `PeriodSection` - Morning/Afternoon grouping
3. `PeriodCard` - Individual class period

**Period Card Layout:**
- Period badge (orange/sky)
- Time range
- Subject name (bold)
- Teacher name + Room
- Subject icon circle

### Step 3: Attendance Screen (`/student/attendance`)

**Data Structure:**
```tsx
interface AttendanceDay {
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  periods?: number[];
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}
```

**Components:**
1. `MonthSelector` - Previous/Next month
2. `AttendanceCalendar` - Visual grid (7 columns)
3. `StatCards` - Summary stats (2x2 grid)
4. `AttendanceList` - Detail list with status

**Calendar Design:**
- 7-column grid for days of week
- Color-coded cells (green, red, amber, blue)
- Empty cells for non-school days
- Today indicator

## Related Code Files

- `apps/mobile/src/screens/student/Grades.tsx`
- `apps/mobile/src/screens/student/Schedule.tsx`
- `apps/mobile/src/screens/student/Attendance.tsx`
- `apps/web/lib/supabase/queries.ts` - Data queries

## Todo List

### Grades
- [ ] Create grades page structure
- [ ] Build SemesterTabs component
- [ ] Build GPACard component
- [ ] Build SubjectGradeCard with 5-score grid
- [ ] Add appeal button to each card
- [ ] Build GradeAppealModal
- [ ] Implement grade fetch from API
- [ ] Add loading/empty states

### Schedule
- [ ] Create schedule page structure
- [ ] Build WeekDaySelector component
- [ ] Build PeriodCard component
- [ ] Build PeriodSection grouping
- [ ] Implement schedule fetch from API
- [ ] Add active day highlighting
- [ ] Add loading/empty states

### Attendance
- [ ] Create attendance page structure
- [ ] Build MonthSelector component
- [ ] Build AttendanceCalendar grid
- [ ] Build StatCards (4-card grid)
- [ ] Build AttendanceList component
- [ ] Implement attendance fetch from API
- [ ] Add loading/empty states

### Testing
- [ ] Test grades for multiple semesters
- [ ] Test schedule for different days
- [ ] Test attendance month navigation
- [ ] Test responsive layouts
- [ ] Test appeal modal flow

## Success Criteria

- [ ] All three screens display data correctly
- [ ] Semester/day/month switching works
- [ ] Responsive layout on all breakpoints
- [ ] Appeal modal opens and submits
- [ ] Calendar shows correct month
- [ ] No TypeScript errors
- [ ] Loading states display properly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing grade data | High | Use empty state, guide to contact |
| Schedule not found | Medium | Show message for non-school days |
| Calendar rendering issues | Low | Use date-fns for calculations |

## Security Considerations

1. Students can only view their own grades
2. No grade manipulation in client code
3. Appeal submissions server-validated

## Next Steps

Once this phase is complete, proceed to [Phase 05: Payment Screens](phase-05-payment-screens.md)
