---
phase: 01
title: "Foundation - Directory Rename + Sidebar + Shared Components + Mock Data"
description: "Rename teacher-temp to teacher, update navigation with 11 items, create shared components, extend mock data"
estimated_time: 5.5h
parallel_with: NONE (BLOCKING)
depends_on: []
exclusive_ownership: true
---

## Phase 01: Foundation

**Status:** BLOCKING - Must complete before all other phases
**Parallelization:** Cannot run in parallel (base infrastructure)
**Execution Order:** FIRST

---

## Context Links

- [Main Plan](./plan.md)
- [Wireframe Analysis](./research/wireframe-analysis.md)
- [Existing Implementation](./research/existing-implementation.md)
- [Development Rules](../../../.claude/workflows/development-rules.md)

---

## Overview

Establish foundation for teacher portal implementation:
1. Rename `teacher-temp` directory → `teacher`
2. Update Sidebar navigation to 11 items (from 6)
3. Extend mock-data.ts with new functions
4. Update all internal links across pages

**Critical:** This phase modifies files that ALL other phases depend on. No other phase can start until this completes.

---

## Parallelization Info

**Can Run With:** NONE
**Blocks:** Phase 02A, Phase 02B, Phase 02C
**Exclusive Ownership:** YES - All modified files locked after this phase

---

## Requirements

### 1. Directory Rename
- Rename `apps/web/app/teacher-temp/` → `apps/web/app/teacher/`
- Verify all subdirectories move correctly
- Test layout.tsx loads from new path

### 2. Sidebar Navigation Update

**Current (6 items):**
- Tổng quan
- Điểm danh
- Nhập điểm
- Kiểm tra
- Tin nhắn
- Hạnh kiểm

**Target (11 items) organized by role:**

**Group 1: Cá nhân (Personal)**
1. Tổng quan (Dashboard)

**Group 2: Giảng dạy (GVBM)**
2. Lịch giảng dạy (Teaching Schedule) - NEW
3. Điểm danh (Attendance)
4. Quản lý lớp dạy (Class Management) - NEW
5. Nhập điểm số (Grade Entry)
6. Đánh giá nhận xét (Regular Assessment) - NEW
7. Phúc khảo điểm (Grade Review) - link to dashboard section

**Group 3: Chủ nhiệm (GVCN)**
8. Học tập & Hạnh kiểm (Academic & Conduct)
9. Quản lý lớp CN (Homeroom Class Management) - NEW
10. Phê duyệt nghỉ phép (Leave Approval) - NEW
11. Tin nhắn (Messages)

### 3. Mock Data Extensions

Add new functions to `apps/web/lib/mock-data.ts`:
- `getTeacherSchedule()` - Teaching schedule data
- `getClassManagementData()` - Class roster for management
- `getRegularAssessments()` - Student assessment data
- `getHomeroomClassData()` - Homeroom class details
- `getLeaveApprovalRequests()` - Leave request approval data

### 4. Internal Link Updates

Update all internal links in existing pages:
- Dashboard links to new pages
- Attendance/grades links use new paths
- All `/teacher-temp/*` → `/teacher/*`

---

## Architecture

### File Structure After Rename

```
apps/web/app/teacher/
├── layout.tsx                    # Teacher layout (renamed)
├── dashboard/
│   └── page.tsx                  # UPDATE: links to new pages
├── attendance/
│   ├── page.tsx                  # UPDATE: links use /teacher/
│   └── [classId]/page.tsx        # UPDATE: links use /teacher/
├── grades/
│   ├── page.tsx                  # UPDATE: links use /teacher/
│   └── [classId]/page.tsx        # UPDATE: links use /teacher/
├── assessments/
│   ├── page.tsx                  # UPDATE: links use /teacher/
│   └── [id]/page.tsx             # UPDATE: links use /teacher/
├── conduct/
│   └── page.tsx                  # UPDATE: links use /teacher/
├── messages/
│   ├── page.tsx                  # UPDATE: links use /teacher/
│   └── [id]/page.tsx             # UPDATE: links use /teacher/
├── schedule/                     # NEW - Phase 02A
│   └── page.tsx
├── class-management/             # NEW - Phase 02A
│   └── page.tsx
├── regular-assessment/           # NEW - Phase 02A
│   └── page.tsx
├── homeroom/                     # NEW - Phase 02A
│   └── page.tsx
└── leave-approval/               # NEW - Phase 02A
    └── page.tsx
```

---

## Related Code Files (EXCLUSIVE OWNERSHIP)

### Modified By Phase 01 ONLY

| File | Type | Changes |
|------|------|---------|
| `apps/web/app/teacher-temp/` | Directory | RENAME to `teacher/` |
| `apps/web/components/layout/Sidebar.tsx` | Component | Update `teacherNavSections` array with 11 items |
| `apps/web/components/teacher/` | Directory | NEW - Shared components (5 files) |
| `apps/web/lib/mock-data.ts` | Data | Add 5 new data functions |
| `apps/web/app/teacher/dashboard/page.tsx` | Page | Update internal links |
| `apps/web/app/teacher/attendance/page.tsx` | Page | Update internal links |
| `apps/web/app/teacher/grades/page.tsx` | Page | Update internal links |
| `apps/web/app/teacher/assessments/page.tsx` | Page | Update internal links |
| `apps/web/app/teacher/conduct/page.tsx` | Page | Update internal links |
| `apps/web/app/teacher/messages/page.tsx` | Page | Update internal links |

**NO OTHER PHASE modifies these files.**

---

## File Ownership

### Exclusive to Phase 01

**Directory Rename:**
- `apps/web/app/teacher-temp/` → `apps/web/app/teacher/`

**Sidebar Navigation:**
- `apps/web/components/layout/Sidebar.tsx` (lines 37-59)
- No other phase touches Sidebar.tsx

**Shared Components (NEW from validation):**
- `apps/web/components/teacher/StudentAssessmentCard.tsx`
- `apps/web/components/teacher/RatingStars.tsx`
- `apps/web/components/teacher/AttendanceStatusButton.tsx`
- `apps/web/components/teacher/GradeInputCell.tsx`
- `apps/web/components/teacher/DualRatingBadge.tsx`
- Other phases IMPORT these components but don't modify

**Mock Data Extensions:**
- `apps/web/lib/mock-data.ts` (append new functions)
- Other phases READ from mock-data.ts but don't modify it

**Internal Links:**
- All existing page files (dashboard, attendance, etc.)
- Phase 02B/02C will update page CONTENT but not links

---

## Implementation Steps

### Step 1: Directory Rename (30 min)

```bash
# Windows PowerShell
cd C:\Project\electric_contact_book\apps\web\app
Rename-Item -Path "teacher-temp" -NewName "teacher"

# Verify
Get-ChildItem -Directory | Where-Object {$_.Name -like "teacher*"}
```

**Validation:**
- [ ] `apps/web/app/teacher/` exists
- [ ] `apps/web/app/teacher-temp/` does NOT exist
- [ ] All subdirectories moved (dashboard, attendance, etc.)

### Step 2: Update Sidebar Navigation (1h)

**File:** `apps/web/components/layout/Sidebar.tsx`

**Update `teacherNavSections` array (lines 37-59):**

```typescript
const teacherNavSections = [
  {
    label: 'Cá nhân',
    items: [
      { href: '/teacher/dashboard', label: 'Tổng quan', icon: 'grid' },
    ],
  },
  {
    label: 'Giảng dạy',
    items: [
      { href: '/teacher/schedule', label: 'Lịch giảng dạy', icon: 'calendar' },
      { href: '/teacher/attendance', label: 'Điểm danh', icon: 'calendar' },
      { href: '/teacher/class-management', label: 'Quản lý lớp dạy', icon: 'users' },
      { href: '/teacher/grades', label: 'Nhập điểm số', icon: 'edit' },
      { href: '/teacher/regular-assessment', label: 'Đánh giá nhận xét', icon: 'star' },
      { href: '/teacher/dashboard#grade-reviews', label: 'Phúc khảo điểm', icon: 'clipboard', badge: 2 },
    ],
  },
  {
    label: 'Chủ nhiệm',
    items: [
      { href: '/teacher/conduct', label: 'Học tập & Hạnh kiểm', icon: 'star' },
      { href: '/teacher/homeroom', label: 'Quản lý lớp CN', icon: 'users' },
      { href: '/teacher/leave-approval', label: 'Phê duyệt nghỉ phép', icon: 'check', badge: 3 },
      { href: '/teacher/messages', label: 'Tin nhắn', icon: 'message' },
    ],
  },
]
```

**Add New Icons:**
- `badge` property for notification badges
- Reuse existing icons where possible

**Validation:**
- [ ] All 11 items render
- [ ] Group labels correct (Cá nhân, Giảng dạy, Chủ nhiệm)
- [ ] Badges show for Phúc khảo điểm (2) and Phê duyệt nghỉ phép (3)

### Step 3: Create Shared Components (1.5h) ⭐ ADDED FROM VALIDATION

**Directory:** `apps/web/components/teacher/`

**Create shared components for reuse by Phases 02A/02B/02C:**

```bash
# Create teacher components directory
mkdir -p apps/web/components/teacher
```

**Components to create:**

**1. StudentAssessmentCard**
```tsx
// apps/web/components/teacher/StudentAssessmentCard.tsx
interface StudentAssessmentCardProps {
  assessment: RegularAssessment
  onEvaluate?: (studentId: string) => void
  onEdit?: (studentId: string) => void
  onContactParent?: (studentId: string) => void
}
// 3-state card: evaluated (green), pending (amber dashed), needs-attention (red)
```

**2. RatingStars**
```tsx
// apps/web/components/teacher/RatingStars.tsx
interface RatingStarsProps {
  rating: number
  interactive?: boolean
  onChange?: (rating: number) => void
}
// Display 1-5 stars with optional interactivity
```

**3. AttendanceStatusButton**
```tsx
// apps/web/components/teacher/AttendanceStatusButton.tsx
interface AttendanceStatusButtonProps {
  status: 'P' | 'A' | 'L' | 'E'
  active: boolean
  onClick: () => void
}
// P/A/L/E toggle with color coding
```

**4. GradeInputCell**
```tsx
// apps/web/components/teacher/GradeInputCell.tsx
interface GradeInputCellProps {
  value?: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}
// Number input with validation (0-10, step 0.25)
```

**5. DualRatingBadge**
```tsx
// apps/web/components/teacher/DualRatingBadge.tsx
interface DualRatingBadgeProps {
  type: 'academic' | 'conduct'
  rating: string
  score?: number
}
// Academic + conduct rating display with color coding
```

**Validation:**
- [ ] All 5 components created
- [ ] TypeScript compiles without errors
- [ ] Components exported correctly
- [ ] Ready for import by Phase 02A/02B/02C

### Step 4: Extend Mock Data (2h)

**File:** `apps/web/lib/mock-data.ts`

**Add new TypeScript interfaces:**

```typescript
// Teaching Schedule
export interface ScheduleItem {
  period: number
  time: string
  className: string
  subject: string
  room: string
  date?: string
}

// Class Management
export interface ClassManagementDetail {
  classId: string
  className: string
  subject: string
  grade: string
  room: string
  schedule: ScheduleItem[]
  students: {
    id: string
    name: string
    code: string
    email?: string
    phone?: string
    status: 'active' | 'withdrawn'
  }[]
}

// Regular Assessment
export interface RegularAssessment {
  studentId: string
  studentName: string
  classId: string
  className: string
  subject: string
  status: 'evaluated' | 'pending' | 'needs-attention'
  comment?: {
    category: string
    content: string
  }
  rating?: number // 1-5 stars
  createdAt: string
}

// Homeroom Class
export interface HomeroomClassDetail {
  classId: string
  className: string
  grade: string
  room: string
  studentCount: number
  maleCount: number
  femaleCount: number
  classMonitor?: string
  students: {
    id: string
    name: string
    code: string
    dob: string
    parentName: string
    parentPhone: string
    address: string
  }[]
}

// Leave Approval
export interface LeaveRequestApproval {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  parentContact?: string
}
```

**Add new mock data functions:**

```typescript
// Teaching Schedule
export async function getTeacherSchedule(
  teacherId?: string,
  date?: string
): Promise<ScheduleItem[]> {
  return [
    { period: 1, time: '07:30 - 08:15', className: '10A1', subject: 'Toán', room: 'P.101' },
    { period: 2, time: '08:20 - 09:05', className: '11A3', subject: 'Toán', room: 'P.201' },
    { period: 3, time: '09:15 - 10:00', className: '10A1', subject: 'Toán', room: 'P.101' },
    { period: 4, time: '10:10 - 10:55', className: '12A2', subject: 'Toán', room: 'P.302' },
    { period: 5, time: '11:00 - 11:45', className: '11A3', subject: 'Toán', room: 'P.201' },
  ]
}

// Class Management
export async function getClassManagementData(
  classId: string
): Promise<ClassManagementDetail> {
  return {
    classId,
    className: '10A1',
    subject: 'Toán',
    grade: '10',
    room: 'P.101',
    schedule: await getTeacherSchedule(),
    students: [
      { id: '1', name: 'Nguyễn Văn An', code: 'HV001', status: 'active' },
      { id: '2', name: 'Trần Thị Bình', code: 'HV002', status: 'active' },
      // ... more students
    ],
  }
}

// Regular Assessment
export async function getRegularAssessments(
  teacherId?: string,
  filters?: {
    classId?: string
    status?: 'evaluated' | 'pending' | 'needs-attention'
  }
): Promise<RegularAssessment[]> {
  return [
    {
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Tiến bộ học tập', content: 'Có tiến bộ tốt trong giải toán' },
      rating: 4,
      createdAt: '2026-01-14',
    },
    {
      studentId: '2',
      studentName: 'Trần Thị Bình',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'pending',
    },
    // ... more assessments
  ]
}

// Homeroom Class
export async function getHomeroomClassData(
  classId: string
): Promise<HomeroomClassDetail> {
  return {
    classId: '10A1',
    className: '10A1',
    grade: '10',
    room: 'P.101',
    studentCount: 45,
    maleCount: 23,
    femaleCount: 22,
    classMonitor: 'Nguyễn Văn An',
    students: [
      {
        id: '1',
        name: 'Nguyễn Văn An',
        code: 'HS001',
        dob: '2008-05-15',
        parentName: 'Nguyễn Văn X',
        parentPhone: '0901234567',
        address: '123 Đường A, Quận B, TP HCM',
      },
      // ... more students
    ],
  }
}

// Leave Approval
export async function getLeaveApprovalRequests(
  classId: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequestApproval[]> {
  return [
    {
      id: 'LR001',
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '10A1',
      className: '10A1',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      reason: 'Đi cùng gia đình công tác',
      status: 'pending',
      submittedDate: '2026-01-15',
      parentContact: '0901234567',
    },
    // ... more requests
  ]
}
```

**Validation:**
- [ ] TypeScript compiles without errors
- [ ] All functions return correct types
- [ ] Mock data matches wireframe structure

### Step 5: Update Internal Links (30 min)

**Files to update:**
- `apps/web/app/teacher/dashboard/page.tsx`
- `apps/web/app/teacher/attendance/page.tsx`
- `apps/web/app/teacher/grades/page.tsx`
- `apps/web/app/teacher/assessments/page.tsx`
- `apps/web/app/teacher/conduct/page.tsx`
- `apps/web/app/teacher/messages/page.tsx`

**Find and replace:**
```bash
# Run in each file
- /teacher-temp/ → /teacher/
```

**Validation:**
- [ ] No `/teacher-temp/` references remain
- [ ] All links start with `/teacher/`
- [ ] Navigation clicks work without errors

---

## Conflict Prevention

### How Phase 01 Prevents Conflicts

1. **Exclusive File Ownership:**
   - Only Phase 01 modifies Sidebar.tsx
   - Only Phase 01 modifies directory structure
   - Only Phase 01 extends mock-data.ts (other phases only READ)

2. **Clear Interface:**
   - Phase 02A/B/C read from mock-data.ts but don't modify
   - Phase 02A/B/C use existing directory structure
   - Phase 02A/B/C don't touch navigation

3. **Blocking Strategy:**
   - Phase 01 MUST complete first
   - No parallel execution possible
   - Single point of failure (easier to debug)

---

## Risk Assessment

### High Risk
- **Directory rename fails** → Git history issues
  - **Mitigation:** Commit changes before rename, test thoroughly

### Medium Risk
- **Sidebar navigation breaks** → All pages inaccessible
  - **Mitigation:** Test each link manually before proceeding

### Low Risk
- **Mock data type errors** → TypeScript catches immediately
  - **Mitigation:** Run `npm run typecheck` after changes

---

## Testing Checklist

### Pre-Phase 01 Completion
- [ ] Directory renamed successfully
- [ ] Layout loads from new path
- [ ] All 11 navigation items render
- [ ] Navigation badges show correct counts
- [ ] Mock data functions added
- [ ] TypeScript compiles without errors
- [ ] Internal links updated
- [ ] Manual test: Click all 11 navigation items
- [ ] Manual test: No `/teacher-temp/` in browser console

### Handoff to Phase 02A/B/C
- [ ] Git commit with message "feat(teacher): rename teacher-temp to teacher and add 11-item navigation"
- [ ] All tests passing
- [ ] Ready for parallel execution

---

## Next Phase Dependencies

After Phase 01 completes, these phases can run IN PARALLEL:

- **Phase 02A:** New Pages (uses mock data, creates new directories)
- **Phase 02B:** Core Pages Update (updates page content, not structure)
- **Phase 02C:** Secondary Pages Update (updates page content, not structure)

**All phases read from:**
- `apps/web/lib/mock-data.ts` (READ-ONLY after Phase 01)
- `apps/web/components/layout/Sidebar.tsx` (READ-ONLY after Phase 01)

**No conflicts possible** due to exclusive file ownership.

---

## Unresolved Questions

1. Should `Phúc khảo điểm` link to dashboard section or separate page?
2. Badge counts (2, 3) - static or dynamic from mock data?
3. Icon consistency - reuse existing or add new for new pages?
