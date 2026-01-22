# Function & Action Updates - Middle School Conversion (THPT → THCS)

**Plan:** `plans/260122-1337-middle-school-conversion/`
**Date:** 2026-01-22
**Scope:** All functions requiring updates for grades 6-9 conversion

---

## Summary Table

| Phase | Area | Functions | Files |
|-------|------|-----------|-------|
| 01 | Mock Data | 18 functions | `apps/web/lib/mock-data.ts` |
| 02 | API Routes | 6 endpoints | `apps/web/app/api/**/route.ts` |
| 03 | Admin UI | 6 components | `apps/web/components/admin/*` |
| 04 | Teacher UI | 5 components | `apps/web/components/teacher/*` |
| 05 | Pages | 2 pages | `apps/web/app/admin/dashboard/page.tsx`, `apps/web/app/teacher/dashboard/page.tsx` |
| 07 | Fee Data | 8 functions | `apps/web/lib/mock-data.ts` (additive) |
| 08 | Fee API | 7 endpoints | `apps/web/app/api/fee-*/route.ts` (new) |
| 09 | Fee UI | 4 components | `apps/web/components/admin/payments/*` (new) |

---

## Phase 01: Mock Data Layer Updates

**File:** `apps/web/lib/mock-data.ts`

### Functions Requiring Grade 10-12 → 6-9 Changes

| Function | Lines | Changes | Grade References |
|----------|-------|---------|------------------|
| `getStudents()` | 98-110 | Update student grades | 10A → 6A, 11A → 7A, 12A → 8A |
| `getUsers()` | 112-124 | Update classId assignments | classId: '10A' → '6A' |
| `getClasses()` | 132-143 | Update class definitions | 10A, 10B, 11A, 11B, 12A → 6A, 6B, 7A, 7B, 8A, 9A |
| `getInvoices()` | 157-169 | Update invoice grades | Linked to student grades |
| `getGradeDistribution()` | 244-260 | Update grade labels | 'Khối 10' → 'Khối 6' |
| `getActivities()` | 262-280 | Update activity class refs | Class mentions |
| `getTeacherClasses()` | 411-466 | Update teacher assignments | Class IDs, grades |
| `getTeacherStats()` | 467-505 | Update schedule class names | Line 476-502 |
| `getTeacherSchedule()` | 886-907 | Update schedule data | Class names |
| `getAssessments()` | 570-614 | Update assessment classes | classId references |
| `getTeacherConversations()` | 671-709 | Update conversation classes | className field |
| `getGradeReviewRequests()` | 743-772 | Update review classes | classId field |
| `getLeaveRequests()` | 773-885 | Update leave classes | classId field |
| `getClassManagementData()` | 900-911 | Update class data | All grade refs |
| `getRegularAssessments()` | 928-1011 | Update assessment classes | All class IDs |
| `getHomeroomClassData()` | 1012-1074 | Update homeroom class | Class structure |
| `getLeaveApprovalRequests()` | 1075-1153 | Update approval classes | All class refs |

### Data Structures Requiring Updates

| Type | Field | Change |
|------|-------|--------|
| `Student` | `grade` | '10A' → '6A' |
| `User` | `classId` | '10A1' → '6A1' |
| `Class` | `id`, `name`, `grade` | '10A', '10', etc. → '6A', '6' |
| `Invoice` | `studentId` (linked) | Via student grade |

---

## Phase 02: API Route Updates

**Directory:** `apps/web/app/api/`

### Endpoints Requiring Updates

| Endpoint | File | Changes |
|----------|------|---------|
| `GET /api/classes` | `classes/route.ts` | Return grade 6-9 data |
| `GET /api/grades` | `grades/route.ts` | Update grade validation |
| `GET /api/teacher/dashboard` | `teacher/dashboard/route.ts` | **CRITICAL**: Remove hardcoded '10A1' |
| `GET /api/teacher/classes` | `teacher/classes/route.ts` | Validate grades 6-9 |
| `GET /api/teacher/schedule` | `teacher/schedule/route.ts` | Update schedule data |
| `GET /api/teacher/homeroom` | `teacher/homeroom/route.ts` | Update default classId |

### Critical Fix Required

**File:** `apps/web/app/api/teacher/dashboard/route.ts`
```typescript
// BEFORE (Line ~158):
const classId = '10A1'  // HARDCODED!

// AFTER:
const classes = await getTeacherClasses(teacherId)
const homeroomClass = classes.find(c => c.isHomeroom)
const classId = homeroomClass?.id || '6A'  // Dynamic
```

---

## Phase 03: Admin UI Component Updates

**Directory:** `apps/web/components/admin/`

### Components Requiring Updates

| Component | File | Changes |
|-----------|------|---------|
| `AcademicStructure.tsx` | `classes/AcademicStructure.tsx` | Grade filter buttons: 10, 11, 12 → 6, 7, 8, 9 |
| `StudentTable.tsx` | `StudentTable.tsx` | Grade display column |
| `ClassCard.tsx` | `ClassCard.tsx` | Show grade 6-9 info |
| `UserTable.tsx` | `UserTable.tsx` | User class assignments |
| `GradeDistribution.tsx` | `GradeDistribution.tsx` | Grade labels in chart |
| `ActivityLogTable.tsx` | `ActivityLogTable.tsx` | Activity class references |
| `filter-bar.tsx` | `shared/filters/filter-bar.tsx` | Grade filter options |
| `data-table.tsx` | `shared/tables/data-table.tsx` | Table grade columns |

---

## Phase 04: Teacher UI Component Updates

**Directory:** `apps/web/components/teacher/`

### Components Requiring Updates

| Component | File | Changes |
|-----------|------|---------|
| `GradeEntryForm.tsx` | `GradeEntryForm.tsx` | Grade calculations for 6-9 |
| `AttendanceForm.tsx` | `AttendanceForm.tsx` | Class selection dropdown |
| `GradeInputCell.tsx` | `GradeInputCell.tsx` | Grade input validation |
| `StudentAssessmentCard.tsx` | `StudentAssessmentCard.tsx` | Performance display |
| `ConversationList.tsx` | `ConversationList.tsx` | Class conversation refs |

---

## Phase 05: Page Component Updates

**Files:** `apps/web/app/admin/dashboard/page.tsx`, `apps/web/app/teacher/dashboard/page.tsx`

### Admin Dashboard (`apps/web/app/admin/dashboard/page.tsx`)

| Section | Lines | Changes |
|---------|-------|---------|
| Stats cards | 34-70 | Display grade 6-9 data |
| Fee collection | 105 | Linked to grade 6-9 fees |
| Grade distribution | 115 | Show grades 6-9 in chart |

### Teacher Dashboard (`apps/web/app/teacher/dashboard/page.tsx`)

| Section | Lines | Changes |
|---------|-------|---------|
| Stats grid | 102-156 | Update: "Lớp chủ nhiệm 10A" → "Lớp chủ nhiệm 6A" |
| Grade reviews | 161-213 | Display grade 6-9 reviews |
| Assessments | 215-268 | Show assessment stats for 6-9 |
| Leave requests | 270-331 | Update: "Lớp chủ nhiệm 10A" → "Lớp chủ nhiệm 6A" (Line 277) |
| My classes | 333-378 | Display grade 6-9 classes |
| Today's schedule | 383-407 | Show schedule for 6-9 classes |

**CRITICAL TEXT UPDATE (Line 277):**
```typescript
// BEFORE:
Lớp chủ nhiệm 10A

// AFTER:
Lớp chủ nhiệm 6A
```

---

## Phase 07: Fee & Finance Data Additions

**File:** `apps/web/lib/mock-data.ts`

### New Functions to Add

| Function | Description | Returns |
|----------|-------------|---------|
| `getFeeItems()` | List all fee types | `FeeItem[]` |
| `getFeeItemById(id)` | Get single fee item | `FeeItem` |
| `getGradeData()` | Get grades 6-9 structure | `Record<string, GradeData>` |
| `getClassesByGrade(grade)` | Get classes for grade | `string[]` |
| `getFeeAssignments()` | List all fee assignments | `FeeAssignment[]` |
| `getFeeAssignmentById(id)` | Get single assignment | `FeeAssignment` |
| `createFeeAssignment(data)` | Create new assignment | `FeeAssignment` |
| `generateInvoicesFromAssignment(id)` | Generate invoices | `Invoice[]` |
| `getPaymentStats()` | Calculate payment statistics | `PaymentStats` |

### New Data Types

```typescript
interface FeeItem {
  id: string
  name: string  // 'Học phí', 'Bảo hiểm y tế', 'Tiền đồng phục', 'Tiền ăn bán trú'
  code: string  // 'HP-HK1', 'BHYT-25', 'DP-HK1', 'BT-HK1'
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

interface FeeAssignment {
  id: string
  name: string
  targetGrades: string[]  // ['6', '7', '8', '9']
  targetClasses: string[]
  feeItems: string[]
  startDate: string
  dueDate: string
  reminderDays: number
  reminderFrequency: 'once' | 'daily' | 'weekly'
  totalStudents: number
  totalAmount: number
  status: 'draft' | 'published' | 'closed'
  createdAt: string
}

interface GradeData {
  grade: string
  classes: string[]
  students: number
}

const GRADE_DATA = {
  '6': { classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
  '7': { classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
  '8': { classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
  '9': { classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
}
```

---

## Phase 08: Fee & Finance API Routes (NEW)

**Directory:** `apps/web/app/api/`

### New Endpoints to Create

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/fee-items` | GET | List all fee items (filter by semester/type) |
| `/api/fee-items` | POST | Create new fee item |
| `/api/fee-items/[id]` | GET | Get single fee item |
| `/api/fee-items/[id]` | PUT | Update fee item |
| `/api/fee-items/[id]` | DELETE | Delete fee item |
| `/api/fee-assignments` | GET | List all assignments |
| `/api/fee-assignments` | POST | Create from wizard |
| `/api/fee-assignments/[id]` | GET | Get assignment details |
| `/api/fee-assignments/[id]` | PUT | Update assignment |
| `/api/fee-assignments/[id]` | DELETE | Delete assignment |
| `/api/invoices` | GET | List with filters (status, class, search) |
| `/api/invoices/[id]` | GET | Get invoice details |
| `/api/invoices/[id]/confirm` | POST | Confirm payment |
| `/api/payments/stats` | GET | Payment statistics |
| `/api/grades/data` | GET | Grade data for 6-9 |

---

## Phase 09: Fee & Finance UI Components (NEW)

**Directory:** `apps/web/components/admin/payments/`

### New Components to Create

| Component | File | Description |
|-----------|------|-------------|
| `FeeItemsTable` | `FeeItemsTable.tsx` | Fee item library with CRUD |
| `FeeAssignmentWizard` | `FeeAssignmentWizard.tsx` | 4-step wizard (Select → Choose → Configure → Approve) |
| `QuickAccessCard` | `QuickAccessCard.tsx` | Link to invoice tracker |
| `AddFeeModal` | `AddFeeModal.tsx` | Create fee item form |

### Components to Update

| Component | File | Changes |
|-----------|------|---------|
| `PaymentsManagement` | `PaymentsManagement.tsx` | Add tabs for "Danh mục Khoản thu" and "Thiết lập Đợt thu" |

---

## Quick Reference: Grade Mapping Table

| Old (THPT) | New (THCS) | Vietnamese | Class Count | Students |
|------------|------------|------------|-------------|----------|
| 10A, 10B | 6A, 6B | Khối 6 | 6 classes | 180 |
| 11A, 11B | 7A, 7B | Khối 7 | 6 classes | 195 |
| 12A | 8A | Khối 8 | 6 classes | 188 |
| (none) | 9A | Khối 9 | 6 classes | 175 |

**Total Classes:** 6 classes per grade × 4 grades = **24 classes**

---

## Critical Text Replacements

| Context | Old Text | New Text |
|---------|----------|----------|
| Dashboard subtitle | "Lớp chủ nhiệm 10A" | "Lớp chủ nhiệm 6A" |
| Vietnamese labels | "Khối 10", "Khối 11", "Khối 12" | "Khối 6", "Khối 7", "Khối 8", "Khối 9" |
| Class names | "10A", "11A", "12A" | "6A", "7A", "8A", "9A" |
| Student grades | "10A1" | "6A1" |

---

## Action Checklist by Phase

### Phase 01 (Mock Data) - 18 functions
- [ ] `getStudents()` - Update 8 students
- [ ] `getUsers()` - Update classId for 2 users
- [ ] `getClasses()` - Update 7 classes
- [ ] `getInvoices()` - Verify student grades
- [ ] `getGradeDistribution()` - Update labels
- [ ] `getActivities()` - Check class mentions
- [ ] `getTeacherClasses()` - Update 4 classes
- [ ] `getTeacherStats()` - Update schedule
- [ ] `getTeacherSchedule()` - Update 3 periods
- [ ] `getAssessments()` - Update 4 assessments
- [ ] `getTeacherConversations()` - Update conversations
- [ ] `getGradeReviewRequests()` - Update reviews
- [ ] `getLeaveRequests()` - Update leave requests
- [ ] `getClassManagementData()` - Update class data
- [ ] `getRegularAssessments()` - Update assessments
- [ ] `getHomeroomClassData()` - Update homeroom
- [ ] `getLeaveApprovalRequests()` - Update approvals
- [ ] Add `getFeeItems()` - NEW
- [ ] Add `getGradeData()` - NEW

### Phase 02 (API Routes) - 6 endpoints
- [ ] `/api/classes` - Verify returns 6-9
- [ ] `/api/grades` - Update validation
- [ ] `/api/teacher/dashboard` - **FIX HARDCODED '10A1'**
- [ ] `/api/teacher/classes` - Add 6-9 validation
- [ ] `/api/teacher/schedule` - Verify data
- [ ] `/api/teacher/homeroom` - Update default to '6A'

### Phase 03 (Admin UI) - 8 components
- [ ] `AcademicStructure.tsx` - Grade buttons
- [ ] `StudentTable.tsx` - Grade column
- [ ] `ClassCard.tsx` - Class info
- [ ] `UserTable.tsx` - Class assignments
- [ ] `GradeDistribution.tsx` - Chart labels
- [ ] `ActivityLogTable.tsx` - Class refs
- [ ] `filter-bar.tsx` - Filter options
- [ ] `data-table.tsx` - Table columns

### Phase 04 (Teacher UI) - 5 components
- [ ] `GradeEntryForm.tsx` - Calculations
- [ ] `AttendanceForm.tsx` - Class dropdown
- [ ] `GradeInputCell.tsx` - Input validation
- [ ] `StudentAssessmentCard.tsx` - Display
- [ ] `ConversationList.tsx` - Class refs

### Phase 05 (Pages) - 2 pages
- [ ] `admin/dashboard/page.tsx` - All sections
- [ ] `teacher/dashboard/page.tsx` - **Line 277: "10A" → "6A"**

### Phase 07 (Fee Data) - 8 functions ADD
- [ ] Add FeeItem type
- [ ] Add FeeAssignment type
- [ ] Add GradeData type
- [ ] Create FEE_ITEMS constant
- [ ] Create GRADE_DATA constant
- [ ] Implement getFeeItems()
- [ ] Implement getFeeAssignments()
- [ ] Implement createFeeAssignment()

### Phase 08 (Fee API) - 7 routes NEW
- [ ] Create `/api/fee-items/route.ts`
- [ ] Create `/api/fee-items/[id]/route.ts`
- [ ] Create `/api/fee-assignments/route.ts`
- [ ] Create `/api/fee-assignments/[id]/route.ts`
- [ ] Create `/api/invoices/route.ts`
- [ ] Create `/api/invoices/[id]/route.ts`
- [ ] Create `/api/payments/stats/route.ts`

### Phase 09 (Fee UI) - 4 components (1 update, 3 new)
- [ ] Create `FeeItemsTable.tsx`
- [ ] Create `FeeAssignmentWizard.tsx`
- [ ] Create `QuickAccessCard.tsx`
- [ ] Update `PaymentsManagement.tsx`

---

## Unresolved Questions

1. Should teacher dashboard show "Lớp chủ nhiệm 6A" or keep dynamic from API?
2. Are there middle school-specific fee amounts vs high school?
3. Should fee items differ by grade level (6 vs 9)?

---

**Report:** `plans/reports/function-updates-middle-school-conversion.md`
**Generated:** 2026-01-22
