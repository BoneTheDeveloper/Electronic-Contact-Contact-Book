# Middle School Conversion Plan - Summary Report

**Plan ID:** 260122-1348-middle-school-conversion
**Date:** 2026-01-22
**Type:** Parallel-Optimized Implementation Plan
**Status:** Complete

---

## Executive Summary

Created comprehensive parallel-optimized implementation plan for converting the web application from Vietnamese High School (THPT - grades 10-12) to Middle School (THCS - grades 6-9).

**Key Achievement:** 6-hour parallel execution strategy (vs 12+ hours sequential) through zero file-overlap phase design.

---

## Plan Structure

### Main Plan File
`plans/260122-1337-middle-school-conversion/plan.md`

### Phase Files (6 phases, parallel-optimized)
1. `phase-01-mock-data-layer.md` - Data source conversion
2. `phase-02-api-routes.md` - API layer updates
3. `phase-03-admin-ui-components.md` - Admin UI conversion
4. `phase-04-teacher-ui-components.md` - Teacher UI conversion
5. `phase-05-page-components.md` - Page layer updates
6. `phase-06-testing-validation.md` - Comprehensive validation

---

## Parallel Execution Strategy

### Wave 1 (0-2 hours): Phases 01, 02, 03 run concurrently
```
Phase 01 (Mock Data) ────┐
                          ├──> No dependencies, independent execution
Phase 02 (API Routes) ───┤
                          │
Phase 03 (Admin UI) ─────┘
```

### Wave 2 (2-4 hours): Phases 04, 05 run concurrently
```
Phase 04 (Teacher UI) ────┐
                          ├──> After Wave 1 complete, independent execution
Phase 05 (Pages) ─────────┘
```

### Wave 3 (4-6 hours): Phase 06 sequential validation
```
Phase 06 (Testing) ───────> Depends on ALL phases
```

**Total Time: ~6 hours (vs 12+ sequential)**

---

## File Ownership Matrix (Zero Overlap)

| Phase | Files Owned | Count |
|-------|-------------|-------|
| 01 | `apps/web/lib/mock-data.ts` | 1 |
| 02 | `apps/web/app/api/**/*.ts` | 6 |
| 03 | `apps/web/components/admin/**/*.tsx` | 8 |
| 04 | `apps/web/components/teacher/**/*.tsx` | 10 |
| 05 | `apps/web/app/admin/**/*.tsx`, `apps/web/app/teacher/**/*.tsx` | 22 |
| 06 | (Validation only, no files) | 0 |

**Total: 47 files across 5 phases, 0 overlaps**

---

## Grade Conversion Mapping

### Data Layer Changes
| Old (THPT) | New (THCS) | Vietnamese |
|------------|------------|------------|
| 10A, 10B   | 6A, 6B     | Khối 6     |
| 11A, 11B   | 7A, 7B     | Khối 7     |
| 12A        | 8A         | Khối 8     |
| -          | 9A         | Khối 9     |

### Class Structure
- Current: 7 classes (8A, 9A, 10A, 10B, 11A, 11B, 12A)
- Target: 7 classes (6A, 6B, 7A, 7B, 8A, 9A)

---

## Key Conversion Requirements

### Phase 01 (Mock Data) - 1.5h
- Update all student grades: 10A→6A, 11A→7A, 12A→8A, 9A→5A, 8A→4A
- Update class definitions to 6A, 6B, 7A, 7B, 8A, 9A
- Update teacher class assignments
- Update all mock data functions

### Phase 02 (API Routes) - 1h
- Remove hardcoded class ID '10A1' → '6A1' in teacher dashboard
- Update grade validation to 6-9 range
- Verify all API routes return grade 6-9 data

### Phase 03 (Admin UI) - 1.5h
- Update AcademicStructure grade buttons: ['Khối 10','11','12'] → ['Khối 6','7','8','9']
- Update ClassCard, StudentTable, UserTable displays
- Update shared filter components

### Phase 04 (Teacher UI) - 1h
- Update GradeEntryForm class display
- Update AttendanceForm class selector options
- Update ConversationList class references

### Phase 05 (Pages) - 1h
- Update all admin pages to consume Phase 03 components
- Update all teacher pages to consume Phase 04 components
- Verify page routing with grade 6-9 class IDs

### Phase 06 (Testing) - 1h
- Grep search for remaining grade 10-12 references
- Test all API endpoints
- Validate all components display grades 6-9
- Test all pages render correctly
- Cross-phase integration testing

---

## Data Contracts Between Phases

### Contract 1: Phase 01 → Phase 02
```typescript
export const GRADE_LEVELS = ['6', '7', '8', '9']
export const CLASS_PATTERN = /^[6-9][A-Z]\d*$/
export const GRADE_LABELS_VN = { '6': 'Khối 6', '7': 'Khối 7', '8': 'Khối 8', '9': 'Khối 9' }
```

### Contract 2: Phase 02 → Phases 03, 04, 05
```typescript
interface ClassDTO {
  id: string      // '6A', '7A', etc.
  name: string    // '6A', '7A', etc.
  grade: string   // '6', '7', '8', '9'
  teacher: string
  studentCount: number
  room: string
}
```

---

## Conflict Prevention Strategy

### 1. File-Level Separation
- Each file owned by exactly ONE phase
- Clear ownership documented in each phase file
- No shared files between phases

### 2. Data Contract Isolation
- Phase 01 defines data contract first
- Phase 02 implements API to contract
- Phases 03-05 consume stable API contract
- No runtime state sharing

### 3. Parallel Execution Protocols
- Wave 1: Phases 01-03 run independently (0-2h)
- Wave 2: Phases 04-05 run independently (2-4h)
- Wave 3: Phase 06 validates all changes (4-6h)

### 4. Change Validation
- Each phase validates its own changes
- Phase 06 performs cross-phase integration testing
- No phase modifies another phase's files

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Data contract mismatch | High | Low | Define contract upfront in Phase 01 |
| File overlap conflicts | Medium | Low | Clear ownership matrix, no overlaps |
| Grade reference misses | High | Medium | Comprehensive grep search + validation |
| UI filter inconsistencies | Medium | Low | Phase 06 validation catches |
| Teacher dashboard hardcoded refs | Medium | Low | Phase 02 updates API routes |

---

## Success Criteria

### Phase Completion
- [ ] Phase 01: All mock data uses grades 6-9
- [ ] Phase 02: All API routes return grade 6-9 data
- [ ] Phase 03: Admin UI displays grades 6-9
- [ ] Phase 04: Teacher UI displays grades 6-9
- [ ] Phase 05: All pages show grade 6-9 data
- [ ] Phase 06: All tests pass, no grade 10-12 references remain

### Integration Validation
- [ ] No references to grades 10, 11, 12 remain
- [ ] All class names follow 6A, 7A, 8A, 9A pattern
- [ ] All Vietnamese labels show "Khối 6-9"
- [ ] Teacher dashboard works with grade 6-9 classes
- [ ] Admin filters show grades 6-9 options
- [ ] All functionality works end-to-end

---

## Unresolved Questions

1. Should grade naming convention change beyond 6A-9A (e.g., "Lớp 6A")?
2. Are there middle school-specific business rules (vs high school)?
3. Should class size limits differ (middle school: 35-40, high school: 40-45)?
4. Are there THCS-specific assessment requirements?

---

## Next Steps

1. **Execute Wave 1** (0-2h): Run Phases 01, 02, 03 in parallel
2. **Execute Wave 2** (2-4h): Run Phases 04, 05 in parallel
3. **Execute Wave 3** (4-6h): Run Phase 06 validation
4. **Deploy** upon successful validation

---

## Research Reports Referenced

1. `plans/260122-1337-middle-school-conversion/research/researcher-01-wireframe-analysis.md`
   - Wireframe component analysis
   - Grade structure conversion requirements
   - Vietnamese terminology updates

2. `plans/260122-1337-middle-school-conversion/research/researcher-02-data-flow-analysis.md`
   - Data layer architecture
   - API route dependencies
   - File-by-file change requirements

---

## Plan Files Location

**Root:** `C:\Project\electric_contact_book\plans\260122-1337-middle-school-conversion\`

**Files:**
- `plan.md` - Main plan with dependency graph & execution strategy
- `phase-01-mock-data-layer.md` - Mock data conversion (1.5h)
- `phase-02-api-routes.md` - API route updates (1h)
- `phase-03-admin-ui-components.md` - Admin UI conversion (1.5h)
- `phase-04-teacher-ui-components.md` - Teacher UI conversion (1h)
- `phase-05-page-components.md` - Page layer updates (1h)
- `phase-06-testing-validation.md` - Validation phase (1h)

**Total Effort:** 6 hours (parallel execution)

---

*Report Generated: 2026-01-22*
*Planner: AI Planning Agent*
*Branch: master*
