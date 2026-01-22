# Phase 01: Mock Data Layer Conversion

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Research:** `research/researcher-02-data-flow-analysis.md`

## Parallelization Info
- **Execution Wave:** 1 (Can run in parallel with Phases 02, 03)
- **Dependencies:** None (first phase - defines data contract)
- **Dependents:** Phase 02 (API Routes) depends on data contract
- **Estimated Time:** 1.5 hours

## Overview
- **Date:** 2026-01-22
- **Description:** Convert mock data from high school (grades 10-12) to middle school (grades 6-9)
- **Priority:** P1 (Critical path - defines data contract for all other phases)
- **Implementation Status:** pending
- **Review Status:** pending

## Key Insights
From research reports:
- `mock-data.ts` is single source of truth for ALL grade data
- Contains 7 classes (8A, 9A, 10A, 10B, 11A, 11B, 12A)
- Contains 8 students across grades 8-12
- Teacher assignments use class IDs (10A, 11A, etc.)
- All downstream components depend on this data

## Requirements
Convert all grade references in `apps/web/lib/mock-data.ts`:
- Student grade fields: 10A → 6A, 11A → 7A, 12A → 8A
- Class definitions: Remove 10A, 10B, 11A, 11B, 12A → Add 6A, 6B, 7A, 7B, 8A, 9A
- Teacher class assignments: Update classId references
- Vietnamese labels: "Khối 10" → "Khối 6"

## Architecture

### Data Flow
```
mock-data.ts (Phase 01)
    ↓
API Routes (Phase 02)
    ↓
UI Components (Phases 03, 04, 05)
```

### Grade Mapping
| Old (THPT) | New (THCS) | Vietnamese |
|------------|------------|------------|
| 10A, 10B   | 6A, 6B     | Khối 6     |
| 11A, 11B   | 7A, 7B     | Khối 7     |
| 12A        | 8A         | Khối 8     |
| -          | 9A         | Khối 9     |

### Class Structure
```typescript
// Current: 7 classes (8A, 9A, 10A, 10B, 11A, 11B, 12A)
// Target: 7 classes (6A, 6B, 7A, 7B, 8A, 9A)

classes: [
  { id: '6A', name: '6A', grade: '6', teacher: '...', studentCount: 35, room: 'A101' },
  { id: '6B', name: '6B', grade: '6', teacher: '...', studentCount: 33, room: 'A102' },
  { id: '7A', name: '7A', grade: '7', teacher: '...', studentCount: 32, room: 'B201' },
  { id: '7B', name: '7B', grade: '7', teacher: '...', studentCount: 34, room: 'B202' },
  { id: '8A', name: '8A', grade: '8', teacher: '...', studentCount: 31, room: 'C301' },
  { id: '9A', name: '9A', grade: '9', teacher: '...', studentCount: 36, room: 'A201' },
]
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 01 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/lib/mock-data.ts` | 1-1153 | All grade/class data | **Phase 01 ONLY** |

**NO OTHER PHASE modifies this file**

## File Ownership

### **Phase 01 owns:**
- `apps/web/lib/mock-data.ts` - Complete ownership, all changes

### **Interface Contracts (for Phase 02):**

```typescript
// Grade level contract (Phase 02 must implement)
export const SUPPORTED_GRADES = ['6', '7', '8', '9']

// Class ID pattern (Phase 02 must validate)
export const CLASS_ID_PATTERN = /^[6-9][A-Z]\d*$/

// Vietnamese grade labels (Phase 03, 04 must display)
export const GRADE_LABELS_VN: Record<string, string> = {
  '6': 'Khối 6',
  '7': 'Khối 7',
  '8': 'Khối 8',
  '9': 'Khối 9'
}
```

## Implementation Steps

### **Step 1: Update Student Data** (20 min)
```typescript
// Line 100-108: Update student grades
export async function getStudents(): Promise<Student[]> {
  return [
    { id: '1', name: 'Nguyễn Văn An', grade: '6A', attendance: 95, feesStatus: 'paid' },
    { id: '2', name: 'Trần Thị Bình', grade: '6B', attendance: 98, feesStatus: 'paid' },
    { id: '3', name: 'Lê Văn Cường', grade: '7A', attendance: 92, feesStatus: 'pending' },
    { id: '4', name: 'Phạm Thị Dung', grade: '9A', attendance: 97, feesStatus: 'paid' },
    { id: '5', name: 'Hoàng Văn Em', grade: '8A', attendance: 89, feesStatus: 'overdue' },
    { id: '6', name: 'Ngô Thị Giang', grade: '6A', attendance: 96, feesStatus: 'paid' },
    { id: '7', name: 'Đỗ Văn Hùng', grade: '7A', attendance: 94, feesStatus: 'pending' },
    { id: '8', name: 'Vũ Thị Lan', grade: '7B', attendance: 99, feesStatus: 'paid' },
  ]
}
```

### **Step 2: Update User Class Assignments** (15 min)
```typescript
// Line 112-123: Update user classId fields
export async function getUsers(): Promise<User[]> {
  return [
    { id: '1', name: 'Admin User', email: 'admin@school.vn', role: 'admin', status: 'active' },
    { id: '2', name: 'Nguyễn Thanh T.', email: 'nguyenthanh@school.vn', role: 'teacher', status: 'active', classId: '6A' },
    { id: '3', name: 'Trần Thị Mai', email: 'tranmai@school.vn', role: 'teacher', status: 'active', classId: '7A' },
    { id: '4', name: 'Lê Văn Nam', email: 'lenam@school.vn', role: 'parent', status: 'active' },
    { id: '5', name: 'Phạm Thị Hoa', email: 'phamhoa@school.vn', role: 'parent', status: 'active' },
    { id: '6', name: 'Nguyễn Văn An', email: 'nguyenan@school.vn', role: 'student', status: 'active', classId: '6A' },
    { id: '7', name: 'Trần Thị Bình', email: 'tranbinh@school.vn', role: 'student', status: 'active', classId: '6B' },
    { id: '8', name: 'Lê Văn Cường', email: 'lecuong@school.vn', role: 'student', status: 'inactive', classId: '7A' },
  ]
}
```

### **Step 3: Update Class Data** (20 min)
```typescript
// Line 132-142: Update class definitions
export async function getClasses(): Promise<Class[]> {
  return [
    { id: '6A', name: '6A', grade: '6', teacher: 'Nguyễn Thanh T.', studentCount: 35, room: 'A101' },
    { id: '6B', name: '6B', grade: '6', teacher: 'Trần Thị Mai', studentCount: 33, room: 'A102' },
    { id: '7A', name: '7A', grade: '7', teacher: 'Lê Văn Chính', studentCount: 32, room: 'B201' },
    { id: '7B', name: '7B', grade: '7', teacher: 'Phạm Thị Dung', studentCount: 34, room: 'B202' },
    { id: '8A', name: '8A', grade: '8', teacher: 'Hoàng Văn Em', studentCount: 31, room: 'C301' },
    { id: '9A', name: '9A', grade: '9', teacher: 'Ngô Thị Giang', studentCount: 36, room: 'A201' },
  ]
}
```

### **Step 4: Update Teacher Class Assignments** (20 min)
```typescript
// Line 411-463: Update teacher classes
export async function getTeacherClasses(teacherId: string = '2'): Promise<TeacherClass[]> {
  return [
    {
      id: '6A',
      name: '6A',
      subject: 'Toán',
      grade: '6',
      room: 'A102',
      studentCount: 35,
      schedule: 'Thứ 2-4-6, Tiết 1-3',
      isHomeroom: true,
    },
    {
      id: '7A3',
      name: '7A3',
      subject: 'Toán',
      grade: '7',
      room: 'A205',
      studentCount: 32,
      schedule: 'Thứ 3-5, Tiết 4-5',
      isHomeroom: false,
    },
    {
      id: '8B',
      name: '8B',
      subject: 'Toán',
      grade: '8',
      room: 'B101',
      studentCount: 38,
      schedule: 'Thứ 2-4-6, Tiết 6-7',
      isHomeroom: false,
    },
    {
      id: '9A1',
      name: '9A1',
      subject: 'Toán',
      grade: '9',
      room: 'C201',
      studentCount: 31,
      schedule: 'Thứ 3-5, Tiết 7-9',
      isHomeroom: false,
    },
  ]
}
```

### **Step 5: Update Teacher Schedule** (15 min)
```typescript
// Line 476-502: Update schedule class names
todaySchedule: [
  {
    id: '1',
    period: 'Tiết 1-2',
    time: '07:30 - 09:00',
    className: '6A',
    subject: 'Toán học',
    room: 'A102',
  },
  {
    id: '2',
    period: 'Tiết 4',
    time: '10:15 - 11:00',
    className: '7A3',
    subject: 'Toán học',
    room: 'A205',
  },
  {
    id: '3',
    period: 'Tiết 6',
    time: '14:00 - 14:45',
    className: '8B',
    subject: 'Toán học',
    room: 'B101',
  },
],
```

### **Step 6: Update Assessment Data** (10 min)
```typescript
// Line 570-612: Update assessment class IDs
export async function getAssessments(teacherId: string = '2'): Promise<Assessment[]> {
  return [
    {
      id: '1',
      classId: '6A',
      className: '6A',
      subject: 'Toán',
      type: 'quiz',
      name: 'Kiểm tra 15 phút số 3',
      date: '2026-01-15',
      maxScore: 10,
      submittedCount: 35,
      totalCount: 35,
      status: 'graded',
    },
    // ... update all classId: '10A' → '6A', '9A3' → '7A3', etc.
  ]
}
```

### **Step 7: Update Conversations & Other Data** (10 min)
```typescript
// Line 671-707: Update conversation class names
export async function getTeacherConversations(teacherId: string = '2'): Promise<Conversation[]> {
  return [
    {
      id: '1',
      parentName: 'Nguyễn Văn An',
      studentName: 'Nguyễn Văn An',
      studentId: 'HS001',
      className: '6A1',  // was '10A1'
      lastMessage: 'Thưa thầy, em có thể xin lịch hẹn gặp không ạ?',
      timestamp: '10 phút trước',
      unreadCount: 2,
      online: true,
    },
    // ... update all className references
  ]
}
```

### **Step 8: Update All Remaining References** (20 min)
- Update `getGradeReviewRequests()` class IDs
- Update `getClassManagementData()` class info
- Update `getRegularAssessments()` class IDs
- Update `getHomeroomClassData()` class info
- Update `getLeaveApprovalRequests()` class IDs
- Update `getTeacherSchedule()` class names

## Todo List
- [ ] Update `getStudents()` - change student grades (Step 1)
- [ ] Update `getUsers()` - change classId assignments (Step 2)
- [ ] Update `getClasses()` - change class definitions (Step 3)
- [ ] Update `getTeacherClasses()` - change teacher assignments (Step 4)
- [ ] Update `getTeacherStats()` - change schedule class names (Step 5)
- [ ] Update `getAssessments()` - change assessment class IDs (Step 6)
- [ ] Update `getTeacherConversations()` - change conversation classes (Step 7)
- [ ] Update remaining functions with grade/class references (Step 8)
- [ ] Verify no grade 10-12 references remain
- [ ] Test data export contracts

## Success Criteria
- [ ] No references to grades 10, 11, 12 remain in `mock-data.ts`
- [ ] All class IDs follow pattern: 6A, 6B, 7A, 7B, 8A, 9A
- [ ] All student grade fields use grades 6-9
- [ ] All teacher class assignments use grades 6-9
- [ ] Data export functions return grade 6-9 data
- [ ] TypeScript compilation passes
- [ ] No test failures in mock-data tests

## Conflict Prevention

### **How Phase 01 Avoids Conflicts:**
1. **Exclusive file ownership** - Only Phase 01 modifies `mock-data.ts`
2. **Interface stability** - Exports stable TypeScript interfaces
3. **No runtime dependencies** - Data source, not consumer
4. **Clear contract** - Defines data contract for Phase 02

### **Data Contract Guarantees:**
```typescript
// Phase 01 guarantees these exports:
export interface Student { grade: string }  // Will be '6A', '7A', etc.
export interface Class { grade: string }     // Will be '6', '7', etc.
export async function getClasses(): Promise<Class[]>  // Returns grades 6-9
export async function getStudents(): Promise<Student[]> // Returns grades 6-9
```

### **Phase 02 Integration:**
- Phase 02 reads from `mock-data.ts` (not modifies)
- Phase 02 implements API routes to expose data
- Phase 02 validates data contract (grades 6-9)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missed grade reference | Medium | High | Comprehensive grep search |
| Class ID inconsistency | Low | Medium | Follow pattern strictly |
| TypeScript type errors | Low | Low | Compile check |
| Data contract mismatch | Low | High | Clear interface exports |

## Security Considerations
- No security changes (data transformation only)
- Maintain existing data validation
- Preserve access control patterns

## Next Steps
1. Complete all implementation steps
2. Run TypeScript compilation check
3. Verify no grade 10-12 references with grep
4. Mark phase complete for Phase 02 to begin
