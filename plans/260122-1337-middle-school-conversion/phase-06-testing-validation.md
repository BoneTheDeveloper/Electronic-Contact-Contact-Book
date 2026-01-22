# Phase 06: Testing & Validation

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **All Phases:** 01-05 must be complete before this phase begins

## Parallelization Info
- **Execution Wave:** 3 (Sequential - runs after all other phases complete)
- **Dependencies:** Phases 01, 02, 03, 04, 05 (all must be complete)
- **Dependents:** None (final phase)
- **Estimated Time:** 1 hour

## Overview
- **Date:** 2026-01-22
- **Description:** Comprehensive testing and validation of middle school conversion
- **Priority:** P1 (Critical validation phase)
- **Implementation Status:** pending
- **Review Status:** pending

## Key Insights
From research reports:
- Must validate NO grade 10-12 references remain
- Must verify all functionality works end-to-end
- Cross-phase integration testing required
- Data integrity validation critical

## Requirements
Comprehensive validation of grade 6-9 conversion:
- Search for any remaining grade 10-12 references
- Test all API endpoints return grade 6-9 data
- Test all UI components display grades 6-9
- Test all pages render correctly
- Validate data flow from API → UI
- Cross-phase integration testing

## Architecture

### Testing Strategy
```
┌─────────────────────────────────────────────────────────┐
│              PHASE 06: TESTING & VALIDATION             │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Reference Search (Grep)                              │
│     └── Search for: '10A|11A|12A|Khối 10|Khối 11|Khối 12' │
│                                                           │
│  2. API Testing                                          │
│     ├── GET /api/classes → returns 6A, 7A, 8A, 9A       │
│     ├── GET /api/grades → grade 6-9 data                │
│     └── GET /api/teacher/dashboard → classId 6A-9A      │
│                                                           │
│  3. Component Testing                                    │
│     ├── Admin: AcademicStructure → grade buttons 6-9    │
│     ├── Admin: ClassCard → displays 6A, 7A, etc.        │
│     ├── Teacher: GradeEntryForm → classId 6A-9A         │
│     └── Teacher: AttendanceForm → class options 6A-9A   │
│                                                           │
│  4. Page Testing                                         │
│     ├── Admin: /admin/classes → shows 6A, 7A, etc.      │
│     ├── Admin: /admin/grades → grade 6-9 data           │
│     ├── Teacher: /teacher/dashboard → classId 6A-9A     │
│     └── Teacher: /teacher/grades → 6A, 7A, etc.         │
│                                                           │
│  5. Integration Testing                                  │
│     └── End-to-end: API → Component → Page flow         │
│                                                           │
│  6. Data Integrity Validation                            │
│     ├── Class IDs: 6A, 6B, 7A, 7B, 8A, 9A               │
│     ├── Grade levels: 6, 7, 8, 9                         │
│     ├── Vietnamese: Khối 6, Khối 7, Khối 8, Khối 9       │
│     └── No 10, 11, 12 references remain                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Related Code Files

### **Phase 06 validates ALL phases:**

| Phase | Files to Validate | Validation Criteria |
|-------|-------------------|---------------------|
| Phase 01 | `apps/web/lib/mock-data.ts` | No grade 10-12 refs, all 6-9 |
| Phase 02 | `apps/web/app/api/**/*.ts` | API returns 6-9 data |
| Phase 03 | `apps/web/components/admin/**/*.tsx` | Display grades 6-9 |
| Phase 04 | `apps/web/components/teacher/**/*.tsx` | Display grades 6-9 |
| Phase 05 | `apps/web/app/admin/**/*.tsx`, `apps/web/app/teacher/**/*.tsx` | Pages render correctly |

**Phase 06 creates NO new files, only validates**

## Implementation Steps

### **Step 1: Reference Search Validation** (15 min)
```bash
# Search for any remaining grade 10-12 references
cd C:\Project\electric_contact_book\apps\web

# Search for high school grade references
grep -r "10A\|11A\|12A" --include="*.ts" --include="*.tsx" . || echo "No 10A, 11A, 12A found ✓"

# Search for Vietnamese grade labels
grep -r "Khối 10\|Khối 11\|Khối 12" --include="*.ts" --include="*.tsx" . || echo "No Khối 10-12 found ✓"

# Search for numeric grade refs 10-12
grep -r "grade.*1[0-2]\|grade.*:[ ]*1[0-2]" --include="*.ts" --include="*.tsx" . || echo "No grade 10-12 found ✓"

# Expected output: All grep commands return "No ... found ✓"
```

### **Step 2: API Endpoint Testing** (15 min)
```bash
# Test API endpoints return grade 6-9 data

# 1. Test /api/classes
curl http://localhost:3000/api/classes | jq '.[] | .id, .grade'
# Expected output: "6A", "6", "7A", "7", "8A", "8", "9A", "9"

# 2. Test /api/grades
curl http://localhost:3000/api/grades | jq '.students[] | .grade'
# Expected output: "6A", "6B", "7A", "7B", "8A", "9A"

# 3. Test /api/teacher/dashboard
curl http://localhost:3000/api/teacher/dashboard?teacherId=2 | jq '.classId'
# Expected output: "6A" or 7A-9A (NOT "10A", "11A", "12A")

# 4. Test /api/teacher/classes
curl http://localhost:3000/api/teacher/classes?teacherId=2 | jq '.[] | .id, .grade'
# Expected output: "6A", "6", "7A3", "7", "8B", "8", "9A1", "9"

# 5. Test /api/teacher/homeroom
curl http://localhost:3000/api/teacher/homeroom?classId=6A | jq '.grade'
# Expected output: "6"
```

### **Step 3: Admin Component Validation** (10 min)
```typescript
// Test admin components display grades 6-9

// 1. AcademicStructure component
test('AcademicStructure shows grade buttons 6-9', () => {
  render(<AcademicStructure />)
  expect(screen.getByText('Khối 6')).toBeInTheDocument()
  expect(screen.getByText('Khối 7')).toBeInTheDocument()
  expect(screen.getByText('Khối 8')).toBeInTheDocument()
  expect(screen.getByText('Khối 9')).toBeInTheDocument()
  expect(screen.queryByText('Khối 10')).not.toBeInTheDocument()
  expect(screen.queryByText('Khối 11')).not.toBeInTheDocument()
  expect(screen.queryByText('Khối 12')).not.toBeInTheDocument()
})

// 2. ClassCard component
test('ClassCard displays middle school classes', async () => {
  const mockClass = { id: '6A', name: '6A', grade: '6', teacher: 'Nguyễn T.', studentCount: 35, room: 'A101' }
  render(<ClassCard {...mockClass} />)
  expect(screen.getByText('Lớp 6A')).toBeInTheDocument()
  expect(screen.getByText('Khối 6')).toBeInTheDocument()
})

// 3. StudentTable component
test('StudentTable shows grade 6-9 classes', async () => {
  const mockStudents = [
    { id: '1', name: 'Nguyễn An', grade: '6A', attendance: 95, feesStatus: 'paid' },
    { id: '2', name: 'Trần Bình', grade: '7A', attendance: 98, feesStatus: 'paid' }
  ]
  render(<StudentTable students={mockStudents} />)
  expect(screen.getByText('6A')).toBeInTheDocument()
  expect(screen.getByText('7A')).toBeInTheDocument()
})
```

### **Step 4: Teacher Component Validation** (10 min)
```typescript
// Test teacher components work with grades 6-9

// 1. GradeEntryForm component
test('GradeEntryForm works with middle school class', () => {
  render(<GradeEntryForm classId="6A" subject="Toán" />)
  expect(screen.getByText(/Nhập điểm.*Lớp 6A/)).toBeInTheDocument()
})

// 2. AttendanceForm component
test('AttendanceForm shows middle school classes', () => {
  const { container } = render(<AttendanceForm classId="6A" students={[]} />)
  expect(screen.getByText(/Điểm danh.*Lớp 6A/)).toBeInTheDocument()
})

// 3. ConversationList component
test('ConversationList shows middle school class references', async () => {
  const mockConversations = [
    { id: '1', parentName: 'Nguyễn An', studentName: 'Nguyễn An', className: '6A1', ... }
  ]
  render(<ConversationList conversations={mockConversations} />)
  expect(screen.getByText('6A1')).toBeInTheDocument()
})
```

### **Step 5: Page Integration Testing** (10 min)
```typescript
// Test pages render with grade 6-9 data

// 1. Admin Classes Page
test('Admin classes page shows middle school classes', async () => {
  render(<ClassesPage />)
  await waitFor(() => {
    expect(screen.getByText('6A')).toBeInTheDocument()
    expect(screen.getByText('7A')).toBeInTheDocument()
    expect(screen.queryByText('10A')).not.toBeInTheDocument()
  })
})

// 2. Teacher Dashboard Page
test('Teacher dashboard shows middle school data', async () => {
  render(<TeacherDashboard />)
  await waitFor(() => {
    // Dashboard should show classId 6A-9A, NOT 10A-12A
    expect(screen.queryByText('10A')).not.toBeInTheDocument()
  })
})

// 3. Teacher Grades Page
test('Teacher grades page shows middle school classes', async () => {
  render(<GradesPage />)
  await waitFor(() => {
    expect(screen.getByText('6A')).toBeInTheDocument()
    expect(screen.getByText('7A')).toBeInTheDocument()
  })
})
```

### **Step 6: Data Integrity Validation** (10 min)
```typescript
// Validate data flow integrity

test('Data flow: API → Component → Page', async () => {
  // 1. Mock API returns grade 6-9 data
  mockGetClasses.mockResolvedValue([
    { id: '6A', name: '6A', grade: '6', ... },
    { id: '7A', name: '7A', grade: '7', ... }
  ])

  // 2. Component receives grade 6-9 data
  const { container } = render(<AcademicStructure />)

  // 3. Page displays grade 6-9 data
  expect(screen.getByText('6A')).toBeInTheDocument()
  expect(screen.getByText('7A')).toBeInTheDocument()

  // 4. No grade 10-12 data leaks through
  expect(screen.queryByText('10A')).not.toBeInTheDocument()
  expect(screen.queryByText('11A')).not.toBeInTheDocument()
  expect(screen.queryByText('12A')).not.toBeInTheDocument()
})
```

## Todo List
- [ ] Run reference search for grade 10-12 (Step 1)
- [ ] Test all API endpoints return grade 6-9 data (Step 2)
- [ ] Validate admin components display grades 6-9 (Step 3)
- [ ] Validate teacher components work with grades 6-9 (Step 4)
- [ ] Test pages render with grade 6-9 data (Step 5)
- [ ] Validate data flow integrity (Step 6)
- [ ] Run full application test suite
- [ ] Verify no regressions

## Success Criteria

### **Reference Search:**
- [ ] No '10A', '11A', '12A' references found
- [ ] No 'Khối 10', 'Khối 11', 'Khối 12' found
- [ ] No numeric grade 10-12 references found

### **API Testing:**
- [ ] `/api/classes` returns only grades 6-9
- [ ] `/api/grades` returns only grade 6-9 students
- [ ] `/api/teacher/dashboard` returns classId 6A-9A
- [ ] All API responses contain grade 6-9 data

### **Component Testing:**
- [ ] Admin components display grades 6-9
- [ ] Teacher components work with grades 6-9
- [ ] No components display grade 10-12 data

### **Page Testing:**
- [ ] Admin pages render with grade 6-9 data
- [ ] Teacher pages render with grade 6-9 data
- [ ] No pages show grade 10-12 references

### **Integration Testing:**
- [ ] Data flows correctly: API → Component → Page
- [ ] No data corruption between layers
- [ ] All functionality works end-to-end

## Conflict Prevention

### **How Phase 06 Prevents Issues:**
1. **Comprehensive search** - Finds ALL remaining grade 10-12 refs
2. **API validation** - Ensures data contract integrity
3. **Component testing** - Validates UI display correctness
4. **Page testing** - Validates integration
5. **No file modifications** - Read-only validation, no conflicts

### **Validation Guarantees:**
- Phase 06 produces validation report only
- No code changes in Phase 06
- If issues found, report to appropriate phase for fix

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missed grade reference | Medium | High | Comprehensive grep search |
| API data inconsistency | Low | High | Test all endpoints |
| Component display bug | Low | Medium | Component unit tests |
| Page rendering issue | Low | Medium | Integration tests |
| Data flow corruption | Low | High | End-to-end tests |

## Security Considerations
- Validate no access control bypassed during conversion
- Ensure authentication still works with grade 6-9 data
- Verify authorization rules still enforced

## Next Steps

### **If All Tests Pass:**
1. Generate validation report
2. Mark plan complete
3. Deploy to production

### **If Tests Fail:**
1. Document failures in validation report
2. Assign to appropriate phase for fixes
3. Re-run Phase 06 after fixes

---

## Validation Report Template

```markdown
# Middle School Conversion - Validation Report

**Date:** 2026-01-22
**Phases Validated:** 01, 02, 03, 04, 05
**Status:** PASSED / FAILED

## Reference Search Results
- Grade 10-12 references: 0 found ✓
- Vietnamese Khối 10-12: 0 found ✓
- Numeric grade 10-12: 0 found ✓

## API Test Results
- GET /api/classes: PASSED ✓
- GET /api/grades: PASSED ✓
- GET /api/teacher/dashboard: PASSED ✓
- GET /api/teacher/classes: PASSED ✓
- GET /api/teacher/homeroom: PASSED ✓

## Component Test Results
- Admin components: PASSED ✓
- Teacher components: PASSED ✓

## Page Test Results
- Admin pages: PASSED ✓
- Teacher pages: PASSED ✓

## Integration Test Results
- Data flow integrity: PASSED ✓

## Issues Found
None

## Recommendation
APPROVED for production deployment
```
