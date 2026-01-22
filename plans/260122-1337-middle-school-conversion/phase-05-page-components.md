# Phase 05: Page Components Conversion

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Research:** `research/researcher-02-data-flow-analysis.md`
- **Phase 03:** `phase-03-admin-ui-components.md` (consumes admin components)
- **Phase 04:** `phase-04-teacher-ui-components.md` (consumes teacher components)

## Parallelization Info
- **Execution Wave:** 2 (Runs after Phases 01-03 complete, parallel with Phase 04)
- **Dependencies:** Phases 03, 04 (consumes UI components)
- **Dependents:** None (last implementation phase before testing)
- **Estimated Time:** 1 hour

## Overview
- **Date:** 2026-01-22
- **Description:** Update page components to display middle school (grades 6-9) data
- **Priority:** P1 (Page layer - consumes all UI components)
- **Implementation Status:** pending
- **Review Status:** pending

## Key Insights
From research reports:
- Pages consume UI components from Phases 03, 04
- Pages may have grade-level state or routing logic
- Pages fetch data from API (Phase 02)
- Most page changes are minor (components handle heavy lifting)

## Requirements
Update page components to work with grades 6-9:
- Admin pages (dashboard, classes, grades, users, attendance, payments, notifications)
- Teacher pages (dashboard, grades, attendance, assessments, messages, homeroom)
- Remove any hardcoded grade references
- Update routing or state if needed

## Architecture

### Page Data Flow
```
API Routes (Phase 02)
    ↓
UI Components (Phases 03, 04)
    ↓
Page Components (Phase 05)
    ├── Admin pages (/app/admin/**/*)
    │   ├── dashboard/page.tsx
    │   ├── classes/page.tsx
    │   ├── grades/page.tsx
    │   ├── users/page.tsx
    │   ├── attendance/page.tsx
    │   ├── payments/page.tsx
    │   └── notifications/page.tsx
    └── Teacher pages (/app/teacher/**/*)
        ├── dashboard/page.tsx
        ├── grades/page.tsx
        ├── attendance/page.tsx
        ├── assessments/page.tsx
        ├── messages/page.tsx
        ├── homeroom/page.tsx
        └── schedule/page.tsx
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 05 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/app/admin/dashboard/page.tsx` | All | Stats grade context | **Phase 05 ONLY** |
| `apps/web/app/admin/classes/page.tsx` | All | Class management | **Phase 05 ONLY** |
| `apps/web/app/admin/classes/[id]/page.tsx` | All | Class detail | **Phase 05 ONLY** |
| `apps/web/app/admin/grades/page.tsx` | All | Grade management | **Phase 05 ONLY** |
| `apps/web/app/admin/users/page.tsx` | All | User management | **Phase 05 ONLY** |
| `apps/web/app/admin/users/[id]/page.tsx` | All | User detail | **Phase 05 ONLY** |
| `apps/web/app/admin/attendance/page.tsx` | All | Attendance management | **Phase 05 ONLY** |
| `apps/web/app/admin/payments/page.tsx` | All | Payment management | **Phase 05 ONLY** |
| `apps/web/app/admin/payments/invoice-tracker/page.tsx` | All | Invoice tracking | **Phase 05 ONLY** |
| `apps/web/app/admin/notifications/page.tsx` | All | Notification management | **Phase 05 ONLY** |
| `apps/web/app/teacher/dashboard/page.tsx` | All | Teacher dashboard | **Phase 05 ONLY** |
| `apps/web/app/teacher/grades/page.tsx` | All | Grade entry pages | **Phase 05 ONLY** |
| `apps/web/app/teacher/grades/[classId]/page.tsx` | All | Class grade entry | **Phase 05 ONLY** |
| `apps/web/app/teacher/attendance/page.tsx` | All | Attendance pages | **Phase 05 ONLY** |
| `apps/web/app/teacher/attendance/[classId]/page.tsx` | All | Class attendance | **Phase 05 ONLY** |
| `apps/web/app/teacher/assessments/page.tsx` | All | Assessments list | **Phase 05 ONLY** |
| `apps/web/app/teacher/assessments/[id]/page.tsx` | All | Assessment detail | **Phase 05 ONLY** |
| `apps/web/app/teacher/messages/page.tsx` | All | Messages page | **Phase 05 ONLY** |
| `apps/web/app/teacher/homeroom/page.tsx` | All | Homeroom page | **Phase 05 ONLY** |
| `apps/web/app/teacher/schedule/page.tsx` | All | Schedule page | **Phase 05 ONLY** |
| `apps/web/app/teacher/class-management/page.tsx` | All | Class management | **Phase 05 ONLY** |
| `apps/web/app/teacher/leave-approval/page.tsx` | All | Leave approval | **Phase 05 ONLY** |
| `apps/web/app/teacher/regular-assessment/page.tsx` | All | Regular assessment | **Phase 05 ONLY** |
| `apps/web/app/teacher/conduct/page.tsx` | All | Conduct page | **Phase 05 ONLY** |

**NO OTHER PHASE modifies these files**

## File Ownership

### **Phase 05 owns:**
- All `apps/web/app/admin/**/*` page files
- All `apps/web/app/teacher/**/*` page files

### **Component Contracts (from Phases 03, 04):**
```typescript
// Phase 03 provides admin components:
<AcademicStructure grades={['6', '7', '8', '9']} />
<ClassCard id="6A" name="6A" grade="6" ... />
<StudentTable students={[{ grade: '6A', ... }]} />

// Phase 04 provides teacher components:
<GradeEntryForm classId="6A" subject="Toán" />
<AttendanceForm classId="6A" students={[...]} />
<ConversationList conversations={[{ className: '6A1', ... }]} />
```

## Implementation Steps

### **Step 1: Update Admin Dashboard** (10 min)
```typescript
// apps/web/app/admin/dashboard/page.tsx

export default function AdminDashboard() {
  // Stats from API - grade context already updated in Phase 02
  const { data: stats } = useSWR('/api/dashboard')

  // Dashboard stats may show grade distribution
  // Phase 02 API returns grade 6-9 data
  // No hardcoded grade references needed

  return (
    <div>
      <h1>Admin Dashboard - THCS</h1>
      <StatsGrid stats={stats} />  {/* Consumes API data */}
      <GradeDistribution />         {/* Phase 03 component */}
      {/* Other admin components */}
    </div>
  )
}
```

### **Step 2: Update Admin Classes Page** (10 min)
```typescript
// apps/web/app/admin/classes/page.tsx

export default function ClassesPage() {
  const { data: classes } = useSWR('/api/classes')

  // Classes API returns grades 6-9 (Phase 02)
  // AcademicStructure component handles grade filter (Phase 03)

  return (
    <div>
      <h1>Quản lý lớp học</h1>
      <AcademicStructure classes={classes} />  {/* Phase 03 component */}
    </div>
  )
}
```

### **Step 3: Update Admin Class Detail Page** (10 min)
```typescript
// apps/web/app/admin/classes/[id]/page.tsx

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const { id } = params  // '6A', '7A', etc.

  const { data: classData } = useSWR(`/api/classes/${id}`)

  // Class detail shows grade 6-9 data from API
  // Components handle display (Phase 03)

  return (
    <div>
      <h1>Chi tiết lớp {id}</h1>  {/* Shows '6A', '7A', etc. */}
      <ClassCard {...classData} />  {/* Phase 03 component */}
      <StudentTable students={classData.students} />
    </div>
  )
}
```

### **Step 4: Update Admin Grades Page** (5 min)
```typescript
// apps/web/app/admin/grades/page.tsx

export default function GradesPage() {
  // Grades management - uses components from Phase 03
  // No hardcoded grade references

  return (
    <div>
      <h1>Quản lý học tập</h1>
      <GradesManagement />  {/* Phase 03 component */}
    </div>
  )
}
```

### **Step 5: Update Admin Users Page** (5 min)
```typescript
// apps/web/app/admin/users/page.tsx

export default function UsersPage() {
  // User management - uses components from Phase 03
  // User class assignments show grade 6-9 from API

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <UserTable />  {/* Phase 03 component */}
    </div>
  )
}
```

### **Step 6: Update Admin Remaining Pages** (10 min)
```typescript
// apps/web/app/admin/attendance/page.tsx
// apps/web/app/admin/payments/page.tsx
// apps/web/app/admin/payments/invoice-tracker/page.tsx
// apps/web/app/admin/notifications/page.tsx

// These pages consume Phase 03 components
// No grade-specific logic in pages
// Components handle all grade 6-9 display

export default function AttendancePage() {
  return (
    <div>
      <h1>Quản lý chuyên cần</h1>
      <AttendanceManagement />  {/* Phase 03 component */}
    </div>
  )
}
```

### **Step 7: Update Teacher Dashboard** (10 min)
```typescript
// apps/web/app/teacher/dashboard/page.tsx

export default function TeacherDashboard() {
  const { data: dashboard } = useSWR('/api/teacher/dashboard')

  // Dashboard API returns grade 6-9 data (Phase 02)
  // Components handle display (Phase 04)

  return (
    <div>
      <h1>Teacher Dashboard - THCS</h1>
      <StatsGrid stats={dashboard.stats} />
      <TodaySchedule schedule={dashboard.todaySchedule} />
      {/* Other teacher dashboard components */}
    </div>
  )
}
```

### **Step 8: Update Teacher Grades Pages** (10 min)
```typescript
// apps/web/app/teacher/grades/page.tsx
// apps/web/app/teacher/grades/[classId]/page.tsx

export default function GradesPage() {
  const { data: classes } = useSWR('/api/teacher/classes')

  return (
    <div>
      <h1>Nhập điểm</h1>
      <ClassSelector classes={classes} />  {/* Shows 6A, 7A, etc. */}
    </div>
  )
}

export default function ClassGradesPage({ params }: { params: { classId: string } }) {
  const { classId } = params  // '6A', '7A', etc.

  return (
    <div>
      <h1>Nhập điểm - Lớp {classId}</h1>
      <GradeEntryForm classId={classId} subject="Toán" />  {/* Phase 04 component */}
    </div>
  )
}
```

### **Step 9: Update Teacher Attendance Pages** (10 min)
```typescript
// apps/web/app/teacher/attendance/page.tsx
// apps/web/app/teacher/attendance/[classId]/page.tsx

export default function AttendancePage() {
  const { data: classes } = useSWR('/api/teacher/classes')

  return (
    <div>
      <h1>Điểm danh</h1>
      <ClassSelector classes={classes} />  {/* Shows 6A, 7A, etc. */}
    </div>
  )
}

export default function ClassAttendancePage({ params }: { params: { classId: string } }) {
  const { classId } = params  // '6A', '7A', etc.

  return (
    <div>
      <h1>Điểm danh - Lớp {classId}</h1>
      <AttendanceForm classId={classId} />  {/* Phase 04 component */}
    </div>
  )
}
```

### **Step 10: Update Teacher Remaining Pages** (10 min)
```typescript
// apps/web/app/teacher/assessments/page.tsx
// apps/web/app/teacher/assessments/[id]/page.tsx
// apps/web/app/teacher/messages/page.tsx
// apps/web/app/teacher/homeroom/page.tsx
// apps/web/app/teacher/schedule/page.tsx
// apps/web/app/teacher/class-management/page.tsx
// apps/web/app/teacher/leave-approval/page.tsx
// apps/web/app/teacher/regular-assessment/page.tsx
// apps/web/app/teacher/conduct/page.tsx

// These pages consume Phase 04 components
// No grade-specific logic in pages
// Components handle all grade 6-9 display

export default function AssessmentsPage() {
  return (
    <div>
      <h1>Quản lý đánh giá</h1>
      <AssessmentsList />  {/* Phase 04 component */}
    </div>
  )
}

export default function MessagesPage() {
  return (
    <div>
      <h1>Tin nhắn</h1>
      <ConversationList />  {/* Phase 04 component - shows 6A1, 7A1, etc. */}
    </div>
  )
}
```

## Todo List
- [ ] Update admin dashboard page (Step 1)
- [ ] Update admin classes page (Step 2)
- [ ] Update admin class detail page (Step 3)
- [ ] Update admin grades page (Step 4)
- [ ] Update admin users page (Step 5)
- [ ] Update admin remaining pages (Step 6)
- [ ] Update teacher dashboard page (Step 7)
- [ ] Update teacher grades pages (Step 8)
- [ ] Update teacher attendance pages (Step 9)
- [ ] Update teacher remaining pages (Step 10)
- [ ] Test all pages render with grade 6-9 data

## Success Criteria
- [ ] All admin pages display grade 6-9 data
- [ ] All teacher pages display grade 6-9 data
- [ ] Page routing works with grade 6-9 class IDs
- [ ] No hardcoded '10A', '11A', '12A' references in pages
- [ ] Pages consume components correctly
- [ ] All pages render without errors

## Conflict Prevention

### **How Phase 05 Avoids Conflicts:**
1. **Exclusive file ownership** - Only Phase 05 modifies page files
2. **Consumes components** - Doesn't modify Phase 03, 04 components
3. **Read-only from API** - Consumes Phase 02 API, doesn't modify
4. **No data transformation** - Pages orchestrate, components transform

### **Page Contract Guarantees:**
```typescript
// Phase 05 guarantees pages consume components:
<AcademicStructure classes={classes} />  // Phase 03
<GradeEntryForm classId="6A" />          // Phase 04
```

### **Integration with Other Phases:**
- **Phase 02 (API):** Phase 05 reads API, doesn't modify routes
- **Phase 03 (Admin UI):** Phase 05 consumes, doesn't modify components
- **Phase 04 (Teacher UI):** Phase 05 consumes, doesn't modify components

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hardcoded page state | Low | Medium | Use API data |
| Routing issues | Low | Medium | Test dynamic routes |
| Component prop mismatch | Low | High | Maintain component interfaces |
| Missing page update | Low | Low | Grep search all page files |

## Security Considerations
- Maintain existing page-level authentication
- Preserve role-based access control
- No new security changes (page transformation only)

## Next Steps
1. Complete all implementation steps
2. Test all pages in browser
3. Verify pages consume components correctly
4. Mark phase complete for Phase 06 testing
