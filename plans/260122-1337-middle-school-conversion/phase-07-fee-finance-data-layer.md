# Phase 07: Fee & Finance Data Layer

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Wireframe:** `docs/wireframe/Web_app/Admin/payment.html`
- **Phase 01:** `phase-01-mock-data-layer.md` (grade 6-9 conversion)

## Parallelization Info
- **Execution Wave:** 3 (Can run in parallel with Phase 08, after Wave 2 complete)
- **Dependencies:** Phase 01 complete (grade 6-9 data structure)
- **Dependents:** Phase 08 (Fee API Routes), Phase 09 (Fee UI Components)
- **Estimated Time:** 1.5 hours

## Overview
- **Date:** 2026-01-22
- **Description:** Add fee/finance mock data for middle school (grades 6-9)
- **Priority:** P2 (Feature addition - not critical for grade conversion)
- **Implementation Status:** ✅ **COMPLETED**
- **Review Status:** ✅ **APPROVED**
- **Implementation Report:** `plans/reports/fullstack-developer-260122-1510-fee-finance-data-layer.md`

## Key Insights
From wireframe `docs/wireframe/Web_app/Admin/payment.html`:
- **Fee Item Library**: Tuition (HP-HK1: 2,500,000₫), Insurance (BHYT-25: 854,000₫), Uniform (DP-HK1: 850,000₫), Boarding (BT-HK1: 1,200,000₫)
- **Fee Types**: Mandatory (Bắt buộc) vs Voluntary (Tự nguyện)
- **Semesters**: HK1, HK2, Cả năm
- **Grade Selection**: Grades 6-9 (Khối 6-9) with 6 classes each
- **4-Step Wizard**: Select target → Choose fees → Configure timeline → Approve

## Requirements
Add fee/finance mock data to `apps/web/lib/mock-data.ts`:
- Fee items (types, amounts, codes, semesters)
- Grade data (6-9 with classes)
- Invoice generation mock functions
- Fee assignment wizard state data

## Architecture

### Data Types to Add
```typescript
interface FeeItem {
  id: string
  name: string  // 'Học phí', 'Bảo hiểm y tế', 'Tiền đồng phục', 'Tiền ăn bán trú'
  code: string  // 'HP-HK1', 'BHYT-25', 'DP-HK1', 'BT-HK1'
  type: 'mandatory' | 'voluntary'  // Bắt buộc, Tự nguyện
  amount: number  // VNĐ
  semester: '1' | '2' | 'all'  // Học kỳ 1, Học kỳ 2, Cả năm
  status: 'active' | 'inactive'
}

interface FeeAssignment {
  id: string
  name: string  // Tên phiếu thu
  targetGrades: string[]  // ['6', '7', '8', '9']
  targetClasses: string[]  // ['6A', '6B', ...]
  feeItems: string[]  // Fee item IDs
  startDate: string
  dueDate: string
  reminderDays: number
  reminderFrequency: 'once' | 'daily' | 'weekly'
  totalStudents: number
  totalAmount: number
  status: 'draft' | 'published' | 'closed'
}

interface GradeData {
  grade: string
  classes: string[]
  students: number
}
```

### Grade Structure (from wireframe)
```typescript
const gradeData = {
  '6': { classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
  '7': { classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
  '8': { classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
  '9': { classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
}
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 07 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/lib/mock-data.ts` | Add new section | Add fee types, GradeData | **Phase 07 ONLY** |

**NO OTHER PHASE modifies these additions**

## File Ownership

### **Phase 07 owns:**
- Fee item type definitions and mock data
- Grade data structure (6-9)
- Fee assignment mock functions
- Invoice generation mock functions

### **Data Contracts (for Phase 08):**

```typescript
// Fee items contract
export const FEE_ITEMS: FeeItem[] = [
  {
    id: 'tuition-hk1',
    name: 'Học phí',
    code: 'HP-HK1',
    type: 'mandatory',
    amount: 2500000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'insurance',
    name: 'Bảo hiểm y tế',
    code: 'BHYT-25',
    type: 'mandatory',
    amount: 854000,
    semester: 'all',
    status: 'active'
  },
  {
    id: 'uniform-hk1',
    name: 'Tiền đồng phục',
    code: 'DP-HK1',
    type: 'voluntary',
    amount: 850000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'boarding-hk1',
    name: 'Tiền ăn bán trú',
    code: 'BT-HK1',
    type: 'voluntary',
    amount: 1200000,
    semester: '1',
    status: 'active'
  }
]

// Grade data contract
export const GRADE_DATA: Record<string, GradeData> = {
  '6': { classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
  '7': { classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
  '8': { classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
  '9': { classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
}
```

## Implementation Steps

### **Step 1: Add Fee Type Definitions** (20 min)
```typescript
// Add to apps/web/lib/mock-data.ts after line 77

export interface FeeItem {
  id: string
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

export interface FeeAssignment {
  id: string
  name: string
  targetGrades: string[]
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

export interface GradeData {
  grade: string
  classes: string[]
  students: number
}
```

### **Step 2: Add Fee Items Mock Data** (15 min)
```typescript
// Add after getNotifications() function

export const FEE_ITEMS: FeeItem[] = [
  {
    id: 'tuition-hk1',
    name: 'Học phí',
    code: 'HP-HK1',
    type: 'mandatory',
    amount: 2500000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'insurance',
    name: 'Bảo hiểm y tế',
    code: 'BHYT-25',
    type: 'mandatory',
    amount: 854000,
    semester: 'all',
    status: 'active'
  },
  {
    id: 'uniform-hk1',
    name: 'Tiền đồng phục',
    code: 'DP-HK1',
    type: 'voluntary',
    amount: 850000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'boarding-hk1',
    name: 'Tiền ăn bán trú',
    code: 'BT-HK1',
    type: 'voluntary',
    amount: 1200000,
    semester: '1',
    status: 'active'
  }
]

export async function getFeeItems(): Promise<FeeItem[]> {
  return FEE_ITEMS
}

export async function getFeeItemById(id: string): Promise<FeeItem | undefined> {
  return FEE_ITEMS.find(item => item.id === id)
}
```

### **Step 3: Add Grade Data for Fee Assignment** (15 min)
```typescript
// Grade data structure matching wireframe

export const GRADE_DATA: Record<string, GradeData> = {
  '6': { classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
  '7': { classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
  '8': { classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
  '9': { classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
}

export async function getGradeData(): Promise<Record<string, GradeData>> {
  return GRADE_DATA
}

export async function getClassesByGrade(grade: string): Promise<string[]> {
  return GRADE_DATA[grade]?.classes || []
}
```

### **Step 4: Add Fee Assignment Functions** (20 min)
```typescript
// Mock fee assignments

export const FEE_ASSIGNMENTS: FeeAssignment[] = [
  {
    id: 'fa-001',
    name: 'Học phí HK1 - 2025',
    targetGrades: ['6', '7', '8', '9'],
    targetClasses: ['6A', '6B', '7A', '7B', '8A', '9A'],
    feeItems: ['tuition-hk1', 'insurance'],
    startDate: '2025-09-01',
    dueDate: '2025-10-15',
    reminderDays: 7,
    reminderFrequency: 'weekly',
    totalStudents: 278,
    totalAmount: 695000000,
    status: 'published',
    createdAt: '2025-08-20T00:00:00Z'
  }
]

export async function getFeeAssignments(): Promise<FeeAssignment[]> {
  return FEE_ASSIGNMENTS
}

export async function getFeeAssignmentById(id: string): Promise<FeeAssignment | undefined> {
  return FEE_ASSIGNMENTS.find(assignment => assignment.id === id)
}

export async function createFeeAssignment(data: Omit<FeeAssignment, 'id' | 'createdAt' | 'totalStudents' | 'totalAmount'>): Promise<FeeAssignment> {
  const totalStudents = data.targetClasses.reduce((sum, cls) => {
    const grade = cls.charAt(0)
    return sum + (GRADE_DATA[grade]?.students || 0) / 6  // Estimate: students per class
  }, 0)

  const totalAmount = data.feeItems.reduce((sum, feeId) => {
    const fee = FEE_ITEMS.find(f => f.id === feeId)
    return sum + (fee?.amount || 0)
  }, 0) * Math.round(totalStudents)

  const newAssignment: FeeAssignment = {
    ...data,
    id: `fa-${Date.now()}`,
    totalStudents: Math.round(totalStudents),
    totalAmount,
    createdAt: new Date().toISOString()
  }

  FEE_ASSIGNMENTS.push(newAssignment)
  return newAssignment
}
```

### **Step 5: Add Invoice-Related Functions** (20 min)
```typescript
// Enhanced invoice generation from fee assignments

export async function generateInvoicesFromAssignment(assignmentId: string): Promise<Invoice[]> {
  const assignment = await getFeeAssignmentById(assignmentId)
  if (!assignment) return []

  const invoices: Invoice[] = []
  const students = await getStudents()

  for (const cls of assignment.targetClasses) {
    const classStudents = students.filter(s => s.grade === cls)
    for (const student of classStudents) {
      invoices.push({
        id: `inv-${assignment.id}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        amount: assignment.totalAmount / assignment.totalStudents,
        status: 'pending',
        dueDate: assignment.dueDate
      })
    }
  }

  return invoices
}

export async function getPaymentStats(): Promise<{
  totalAmount: number
  collectedAmount: number
  pendingCount: number
  overdueCount: number
  collectionRate: number
}> {
  const invoices = await getInvoices()

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const collectedAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    totalAmount,
    collectedAmount,
    pendingCount,
    overdueCount,
    collectionRate
  }
}
```

## Todo List
- [x] Add FeeItem, FeeAssignment, GradeData type definitions
- [x] Add FEE_ITEMS constant with 4 fee types
- [x] Add getFeeItems() and getFeeItemById() functions
- [x] Add GRADE_DATA for grades 6-9
- [x] Add getGradeData() and getClassesByGrade() functions
- [x] Add FEE_ASSIGNMENTS mock data
- [x] Add createFeeAssignment() function
- [x] Add generateInvoicesFromAssignment() function
- [x] Add getPaymentStats() function
- [x] Verify TypeScript compilation

## Success Criteria
- [x] All fee types match wireframe (Học phí, BHYT, Đồng phục, Bán trú)
- [x] All amounts match wireframe exactly
- [x] Grade data includes grades 6-9 with 6 classes each
- [x] Fee assignment workflow generates correct invoice counts
- [x] Payment stats calculate correctly
- [x] TypeScript compilation passes

## Conflict Prevention

### **How Phase 07 Avoids Conflicts:**
1. **Additive changes only** - Adds new types/functions, doesn't modify existing
2. **Separate exports** - New exports don't conflict with Phase 01
3. **No modifications to existing data** - Only adds new fee-related data

### **Data Contract Guarantees:**
```typescript
// Phase 07 guarantees these new exports:
export interface FeeItem { ... }
export interface FeeAssignment { ... }
export const FEE_ITEMS: FeeItem[]
export const GRADE_DATA: Record<string, GradeData>
export async function getFeeItems(): Promise<FeeItem[]>
export async function getFeeAssignments(): Promise<FeeAssignment[]>
export async function createFeeAssignment(...): Promise<FeeAssignment>
```

### **Phase 08 Integration:**
- Phase 08 reads new fee data (not modifies)
- Phase 08 implements API routes to expose fee data
- Phase 08 validates fee data contracts

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Type name conflicts | Low | Medium | Use descriptive prefixes (Fee*, FeeAssignment*) |
| Amount calculation errors | Low | High | Match wireframe amounts exactly |
| Grade class mismatch | Low | Medium | Use same structure as Phase 01 |
| Invoice count overflow | Low | Low | Mock data limited quantity |

## Security Considerations
- No security changes (data addition only)
- Maintain existing data validation patterns
- Preserve access control patterns

## Next Steps
1. Complete all implementation steps
2. Run TypeScript compilation check
3. Verify data matches wireframe exactly
4. Mark phase complete for Phase 08 to begin
