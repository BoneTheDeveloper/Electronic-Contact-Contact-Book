# Phase 03: Admin UI Components Conversion

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Research:** `research/researcher-01-wireframe-analysis.md`, `research/researcher-02-data-flow-analysis.md`
- **Phase 01:** `phase-01-mock-data-layer.md` (data source)
- **Phase 02:** `phase-02-api-routes.md` (API layer)

## Parallelization Info
- **Execution Wave:** 1 (Can run in parallel with Phase 02)
- **Dependencies:** Phase 02 API routes (consumes API data)
- **Dependents:** Phase 05 (Page Components consume these components)
- **Estimated Time:** 1.5 hours

## Overview
- **Date:** 2026-01-22
- **Description:** Update Admin UI components to display middle school (grades 6-9) data
- **Priority:** P1 (UI layer for admin interface)
- **Implementation Status:** pending
- **Review Status:** pending

## Key Insights
From research reports:
- Admin components display grade filters, class cards, student tables
- Grade filter buttons: ['Khối 10', '11', '12'] → ['Khối 6', '7', '8', '9']
- Components read from API (Phase 02), don't directly access mock data
- AcademicStructure.tsx is most critical (grade selector)

## Requirements
Update Admin UI components to display grades 6-9:
- Grade filter buttons and dropdowns
- Class card displays
- Student table grade columns
- Activity log grade references
- Distribution charts

## Architecture

### Component Data Flow
```
API Routes (Phase 02)
    ↓ (fetch data)
Admin UI Components (Phase 03)
    ├── AcademicStructure.tsx (grade selector)
    ├── ClassCard.tsx (class display)
    ├── StudentTable.tsx (student grades)
    ├── UserTable.tsx (user class assignments)
    ├── GradeDistribution.tsx (performance charts)
    ├── ActivityLogTable.tsx (grade activities)
    └── Shared components (filters, tables)
    ↓
Admin Pages (Phase 05)
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 03 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/components/admin/classes/AcademicStructure.tsx` | 166+ | Grade filter buttons | **Phase 03 ONLY** |
| `apps/web/components/admin/ClassCard.tsx` | All | Class grade display | **Phase 03 ONLY** |
| `apps/web/components/admin/StudentTable.tsx` | All | Student grade column | **Phase 03 ONLY** |
| `apps/web/components/admin/UserTable.tsx` | All | User class assignments | **Phase 03 ONLY** |
| `apps/web/components/admin/GradeDistribution.tsx` | All | Grade distribution labels | **Phase 03 ONLY** |
| `apps/web/components/admin/ActivityLogTable.tsx` | All | Activity grade refs | **Phase 03 ONLY** |
| `apps/web/components/admin/shared/filters/filter-bar.tsx` | All | Grade filter options | **Phase 03 ONLY** |
| `apps/web/components/admin/shared/tables/data-table.tsx` | All | Table grade columns | **Phase 03 ONLY** |

**NO OTHER PHASE modifies these files**

## File Ownership

### **Phase 03 owns:**
- All `apps/web/components/admin/**/*` components
- All `apps/web/components/admin/shared/**/*` components

### **API Contract (from Phase 02):**
```typescript
// Phase 02 exposes:
GET /api/classes → ClassDTO[]  // { id: '6A', grade: '6', name: '6A', ... }
GET /api/students → StudentDTO[]  // { grade: '6A', ... }

// Phase 03 consumes via fetch/swr:
const { data: classes } = useSWR('/api/classes')
// classes now contain: { id: '6A', grade: '6', name: '6A', ... }
```

## Implementation Steps

### **Step 1: Update AcademicStructure.tsx** (CRITICAL) (30 min)
```typescript
// apps/web/components/admin/classes/AcademicStructure.tsx

// OLD (Line 166):
const gradeOptions = [
  { id: 10, name: 'Khối 10', active: true },
  { id: 11, name: 'Khối 11', active: false },
  { id: 12, name: 'Khối 12', active: false }
]

// NEW:
const gradeOptions = [
  { id: 6, name: 'Khối 6', active: true },
  { id: 7, name: 'Khối 7', active: false },
  { id: 8, name: 'Khối 8', active: false },
  { id: 9, name: 'Khối 9', active: false }
]

// Update class display (Line 185+)
// Class cards will show '6A', '7A', etc. from API
// No hardcoded grade references needed

// Update filter logic
const filteredClasses = classes.filter(c =>
  selectedGrade === null || c.grade === selectedGrade.toString()
)
```

### **Step 2: Update ClassCard.tsx** (15 min)
```typescript
// apps/web/components/admin/ClassCard.tsx

interface ClassCardProps {
  id: string      // '6A', '7A', etc.
  name: string    // '6A', '7A', etc.
  grade: string   // '6', '7', '8', '9'
  teacher: string
  studentCount: number
  room: string
}

// Component receives grade 6-9 data from API
// Display logic remains same
export function ClassCard({ id, name, grade, teacher, studentCount, room }: ClassCardProps) {
  return (
    <div className="class-card">
      <h3>Lớp {name}</h3>
      <p>Khối {grade}</p>  {/* Shows '6', '7', etc. */}
      <p>GVCN: {teacher}</p>
      <p>Sĩ số: {studentCount}</p>
      <p>Phòng: {room}</p>
    </div>
  )
}
```

### **Step 3: Update StudentTable.tsx** (15 min)
```typescript
// apps/web/components/admin/StudentTable.tsx

interface Student {
  id: string
  name: string
  grade: string  // '6A', '7A', etc.
  attendance: number
  feesStatus: 'paid' | 'pending' | 'overdue'
}

// Table columns display grade
const columns = [
  { key: 'id', header: 'Mã SV' },
  { key: 'name', header: 'Họ tên' },
  { key: 'grade', header: 'Lớp' },  // Shows '6A', '7A', etc.
  { key: 'attendance', header: 'Chuyên cần' },
  { key: 'feesStatus', header: 'Học phí' },
]

// No hardcoded grade values - display from API data
```

### **Step 4: Update UserTable.tsx** (15 min)
```typescript
// apps/web/components/admin/UserTable.tsx

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'parent' | 'student'
  status: 'active' | 'inactive'
  classId?: string  // '6A', '7A', etc. for teachers/students
}

// Display class assignments
// No hardcoded values - use data from API
```

### **Step 5: Update GradeDistribution.tsx** (15 min)
```typescript
// apps/web/components/admin/GradeDistribution.tsx

interface GradeDistribution {
  grade: string      // 'Giỏi', 'Khá', 'Trung bình', 'Yếu' (unchanged)
  percentage: number
  color: string
}

// Distribution categories remain same for middle school
// Only grade level context changes (6-9 vs 10-12)
// No component changes needed - just context
```

### **Step 6: Update ActivityLogTable.tsx** (10 min)
```typescript
// apps/web/components/admin/ActivityLogTable.tsx

interface Activity {
  id: string
  user: string
  action: string
  time: string
  note: string  // May contain grade references
}

// Activities show class names (6A, 7A, etc.) from API
// No hardcoded values needed
```

### **Step 7: Update Shared Filter Component** (10 min)
```typescript
// apps/web/components/admin/shared/filters/filter-bar.tsx

// Grade filter dropdown
const gradeOptions = [
  { value: '6', label: 'Khối 6' },
  { value: '7', label: 'Khối 7' },
  { value: '8', label: 'Khối 8' },
  { value: '9', label: 'Khối 9' },
]

// Remove: { value: '10', label: 'Khối 10' }, etc.
```

### **Step 8: Update Shared Table Component** (10 min)
```typescript
// apps/web/components/admin/shared/tables/data-table.tsx

// Table grade column renderer
const renderGradeColumn = (grade: string) => {
  // grade is '6A', '7A', etc. from API
  return <span className="grade-badge">{grade}</span>
}

// No hardcoded values needed
```

## Todo List
- [x] Update `AcademicStructure.tsx` - grade filter buttons (Step 1)
- [x] Update `ClassCard.tsx` - class display (Step 2)
- [x] Update `StudentTable.tsx` - student grade column (Step 3)
- [x] Update `UserTable.tsx` - user class assignments (Step 4)
- [x] Verify `GradeDistribution.tsx` - no changes needed (Step 5)
- [x] Update `ActivityLogTable.tsx` - activity references (Step 6)
- [x] Update `filter-bar.tsx` - grade filter options (Step 7)
- [x] Update `data-table.tsx` - grade column renderer (Step 8)
- [x] Test all admin components display grades 6-9

## Success Criteria
- [x] Grade selector shows 'Khối 6', '7', '8', '9' options
- [x] Class cards display '6A', '7A', '8A', '9A' classes
- [x] Student table shows grade 6-9 class assignments
- [x] User table displays grade 6-9 class IDs
- [x] Filter dropdowns offer grades 6-9
- [x] No hardcoded '10A', '11A', '12A' references remain
- [x] All admin components render correctly

## Conflict Prevention

### **How Phase 03 Avoids Conflicts:**
1. **Exclusive file ownership** - Only Phase 03 modifies admin components
2. **Read-only from Phase 02** - Consumes API, doesn't modify routes
3. **No shared files** - Admin components separate from teacher components (Phase 04)
4. **Stable component props** - Maintains existing component interfaces

### **Component Contract Guarantees:**
```typescript
// Phase 03 guarantees stable component props:
<ClassCard id="6A" name="6A" grade="6" ... />
<StudentTable students={[{ grade: '6A', ... }]} />
<UserTable users={[{ classId: '6A', ... }]} />
```

### **Integration with Other Phases:**
- **Phase 02 (API):** Phase 03 reads API, doesn't modify routes
- **Phase 04 (Teacher UI):** Separate component directories, no overlap
- **Phase 05 (Pages):** Consumes these components, doesn't modify them

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hardcoded grade filter | Medium | High | AcademicStructure critical |
| Class display inconsistencies | Low | Medium | Use API data throughout |
| Component prop break | Low | Medium | Maintain existing interfaces |
| Missing admin component | Low | Low | Grep search for all refs |

## Security Considerations
- Maintain existing access controls
- Preserve admin-only component restrictions
- No new security changes (UI transformation only)

## Next Steps
1. Complete all implementation steps
2. Test admin components in isolation
3. Verify components consume API data correctly
4. Mark phase complete for Phase 05 to consume
