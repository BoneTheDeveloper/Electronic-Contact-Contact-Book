---
title: "Middle School Conversion (THPT → THCS Grades 6-9)"
description: "Convert web app from High School (grades 10-12) to Middle School (grades 6-9) with parallel execution strategy. Includes Fee & Finance module implementation."
status: pending
priority: P1
effort: 10h
branch: master
tags: [thcs-conversion, grade-migration, parallel-execution, fee-finance]
created: 2026-01-22
---

## Overview

Convert the web application from Vietnamese High School (THPT - grades 10-12) to Middle School (THCS - grades 6-9). This plan uses **parallel execution strategy** to maximize development speed while maintaining zero file overlap conflicts.

**Key Changes:**
- Grade levels: 10, 11, 12 → 6, 7, 8, 9
- Class names: 10A, 11A, 12A → 6A, 7A, 8A, 9A
- Vietnamese terms: "Khối 10" → "Khối 6"
- Mock data updates across entire codebase

## Dependency Graph & Parallel Execution Groups

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PARALLEL EXECUTION GROUPS                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  GROUP 1 (Can run simultaneously - NO dependencies):                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │   Phase 01   │  │   Phase 02   │  │   Phase 03   │                 │
│  │ Mock Data    │  │ API Routes   │  │ Admin UI     │                 │
│  │    Layer     │  │              │  │ Components   │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│         │                  │                  │                           │
│         └──────────────────┼──────────────────┘                          │
│                            │                                          │
│  GROUP 2 (After GROUP 1 completes):                                      │
│  ┌──────────────┐  ┌──────────────┐                                    │
│  │   Phase 04   │  │   Phase 05   │                                    │
│  │ Teacher UI   │  │ Page         │                                    │
│  │ Components   │  │ Components   │                                    │
│  └──────────────┘  └──────────────┘                                    │
│         │                  │                                           │
│         └──────────────────┼──────────────────┐                         │
│                            │                  │                         │
│  GROUP 3 (Feature Addition - Can run parallel after GROUP 2):           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │   Phase 07   │  │   Phase 08   │  │   Phase 09   │                 │
│  │ Fee &        │  │ Fee &        │  │ Fee &        │                 │
│  │ Finance Data │  │ Finance API  │  │ Finance UI   │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│         │                  │                  │                          │
│         └──────────────────┼──────────────────┘                          │
│                            │                                          │
│  GROUP 4 (Sequential - depends on ALL phases):                           │
│                   ┌──────────────┐                                      │
│                   │   Phase 10   │                                      │
│                   │   Testing &  │                                      │
│                   │  Validation  │                                      │
│                   └──────────────┘                                      │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Execution Strategy

### **Parallel Execution Waves:**

**Wave 1 (0-2h):** Phases 01, 02, 03 run in parallel
- Phase 01: Mock data layer (data source, independent)
- Phase 02: API routes (data contract defined, independent)
- Phase 03: Admin UI components (read from API, independent)

**Wave 2 (2-4h):** Phases 04, 05 run in parallel after Wave 1
- Phase 04: Teacher UI components (read from API)
- Phase 05: Page components (consume UI components)

**Wave 3 (4-6h):** Phases 07, 08, 09 run in parallel (Fee & Finance Module)
- Phase 07: Fee & Finance data layer (additive, independent)
- Phase 08: Fee & Finance API routes (new endpoints)
- Phase 09: Fee & Finance UI components (new components)

**Wave 4 (6-8h):** Phase 10 runs sequentially
- Phase 10: Testing & validation (requires all code complete)

### **Total Time:** ~10 hours (vs 18+ hours sequential)

### **New Fee & Finance Module:**
- Phase 07: Add fee types, grade data, fee assignment mock data
- Phase 08: Create `/api/fee-items`, `/api/fee-assignments`, `/api/invoices` endpoints
- Phase 09: Create FeeItemsTable, FeeAssignmentWizard (4-step), QuickAccessCard

## File Ownership Matrix

**CRITICAL: Each file owned by exactly ONE phase - NO overlaps**

| File Path | Owner Phase | Change Type |
|-----------|-------------|-------------|
| `apps/web/lib/mock-data.ts` | 01 | Update all grade refs 10-12 → 6-9 |
| `apps/web/app/api/classes/route.ts` | 02 | Update class data |
| `apps/web/app/api/grades/route.ts` | 02 | Update grade data |
| `apps/web/app/api/teacher/dashboard/route.ts` | 02 | Update hardcoded class ID |
| `apps/web/components/admin/classes/AcademicStructure.tsx` | 03 | Grade filter buttons |
| `apps/web/components/admin/StudentTable.tsx` | 03 | Display grades |
| `apps/web/components/admin/ClassCard.tsx` | 03 | Show class info |
| `apps/web/components/admin/UserTable.tsx` | 03 | User class assignments |
| `apps/web/components/admin/GradeDistribution.tsx` | 03 | Performance display |
| `apps/web/components/admin/ActivityLogTable.tsx` | 03 | Grade activities |
| `apps/web/components/admin/shared/filters/filter-bar.tsx` | 03 | Grade filtering |
| `apps/web/components/admin/shared/tables/data-table.tsx` | 03 | Table grade columns |
| `apps/web/components/teacher/GradeEntryForm.tsx` | 04 | Grade calculations |
| `apps/web/components/teacher/AttendanceForm.tsx` | 04 | Class selection |
| `apps/web/components/teacher/GradeInputCell.tsx` | 04 | Grade input |
| `apps/web/components/teacher/StudentAssessmentCard.tsx` | 04 | Performance display |
| `apps/web/components/teacher/ConversationList.tsx` | 04 | Class conversations |
| `apps/web/app/admin/**/*.tsx` | 05 | Admin pages |
| `apps/web/app/teacher/**/*.tsx` | 05 | Teacher pages |
| **FEE & FINANCE MODULE:** | | |
| `apps/web/lib/mock-data.ts` | 07 | **Add** fee types, GRADE_DATA, FEE_ASSIGNMENTS |
| `apps/web/app/api/fee-items/route.ts` | 08 | **New** fee items CRUD |
| `apps/web/app/api/fee-items/[id]/route.ts` | 08 | **New** fee item operations |
| `apps/web/app/api/fee-assignments/route.ts` | 08 | **New** assignment CRUD |
| `apps/web/app/api/fee-assignments/[id]/route.ts` | 08 | **New** assignment operations |
| `apps/web/app/api/invoices/route.ts` | 08 | **New** invoice listing |
| `apps/web/app/api/invoices/[id]/route.ts` | 08 | **New** invoice operations |
| `apps/web/app/api/payments/stats/route.ts` | 08 | **New** payment statistics |
| `apps/web/components/admin/payments/FeeItemsTable.tsx` | 09 | **New** fee item library |
| `apps/web/components/admin/payments/FeeAssignmentWizard.tsx` | 09 | **New** 4-step wizard |
| `apps/web/components/admin/payments/QuickAccessCard.tsx` | 09 | **New** invoice tracker link |
| `apps/web/components/admin/payments/AddFeeModal.tsx` | 09 | **New** create fee form |
| `apps/web/components/admin/payments/PaymentsManagement.tsx` | 09 | **Update** use new components |

## Parallel Execution Requirements

### **Phase Independence Guarantees:**

1. **Phase 01 (Mock Data):** Independent data source
   - Changes data contract from grades 10-12 to 6-9
   - No dependencies on other phases
   - Can run in complete isolation

2. **Phase 02 (API Routes):** Independent API layer
   - Reads from mock data (data contract defined)
   - No UI dependencies
   - Can run in parallel with Phase 01 (contract defined first)

3. **Phase 03 (Admin UI):** Independent component layer
   - Reads from API routes (contract stable)
   - No shared files with other phases
   - Can run in parallel after data contract defined

4. **Phase 04 (Teacher UI):** Independent component layer
   - Reads from API routes
   - No shared files with Phase 03
   - Can run in parallel with Phase 05

5. **Phase 05 (Page Components):** Independent page layer
   - Consumes Admin & Teacher UI components
   - No overlap with component files
   - Can run in parallel with Phase 04

6. **Phase 06 (Testing):** Sequential validation
   - Depends on all phases completing
   - Runs after all code changes

## Data Contracts Between Phases

### **Contract 1: Phase 01 → Phase 02**
```typescript
// Grade level contract
export const GRADE_LEVELS = ['6', '7', '8', '9'] // was ['10', '11', '12']

// Class name pattern
export const CLASS_PATTERN = /^[6-9][A-Z]\d*$/ // was /^[1][0-2][A-Z]\d*$/

// Vietnamese grade labels
export const GRADE_LABELS = {
  '6': 'Khối 6',
  '7': 'Khối 7',
  '8': 'Khối 8',
  '9': 'Khối 9'
}
```

### **Contract 2: Phase 02 → Phases 03, 04, 05**
```typescript
// API response contracts remain stable
interface Class {
  id: string      // '6A', '7A', etc.
  name: string    // '6A', '7A', etc.
  grade: string   // '6', '7', '8', '9'
  teacher: string
  studentCount: number
  room: string
}

interface Student {
  id: string
  name: string
  grade: string   // '6A', '7A', etc.
  attendance: number
  feesStatus: 'paid' | 'pending' | 'overdue'
}
```

## Conflict Prevention Strategy

### **1. File-Level Separation**
- Each file owned by exactly ONE phase
- Clear ownership documented in each phase file
- No shared files between phases

### **2. Data Contract Isolation**
- Phase 01 defines data contract first
- Phase 02 implements API to contract
- Phases 03-05 consume stable API contract
- No runtime state sharing

### **3. Parallel Execution Protocols**
- Wave 1: Phases 01-03 run independently (0-2h)
- Wave 2: Phases 04-05 run independently (2-4h)
- Wave 3: Phase 06 validates all changes (4-6h)

### **4. Change Validation**
- Each phase validates its own changes
- Phase 06 performs cross-phase integration testing
- No phase modifies another phase's files

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data contract mismatch | High | Define contract upfront in Phase 01 |
| File overlap conflicts | Medium | Clear ownership matrix, no overlaps |
| Grade reference misses | Medium | Comprehensive grep search + validation |
| UI filter inconsistencies | Low | Phase 06 validation catches |
| Teacher dashboard hardcoded refs | Low | Phase 02 updates API routes |

## Success Criteria

### **Phase Completion:**
- [ ] Phase 01: All mock data uses grades 6-9
- [ ] Phase 02: All API routes return grade 6-9 data
- [ ] Phase 03: Admin UI displays grades 6-9
- [ ] Phase 04: Teacher UI displays grades 6-9
- [ ] Phase 05: All pages show grade 6-9 data
- [ ] Phase 06: All tests pass, no grade 10-12 references remain

### **Integration Validation:**
- [ ] No references to grades 10, 11, 12 remain
- [ ] All class names follow 6A, 7A, 8A, 9A pattern
- [ ] All Vietnamese labels show "Khối 6-9"
- [ ] Teacher dashboard works with grade 6-9 classes
- [ ] Admin filters show grades 6-9 options
- [ ] All functionality works end-to-end

## Validation Summary

**Validated:** 2026-01-22
**Questions asked:** 6

### Confirmed Decisions
| Question | Decision |
|----------|----------|
| Scope | Basic conversion only - grade mapping (10A→6A) with no THCS-specific features |
| Class sizes | Use planned sizes: 6A(35), 6B(33), 7A(32), 7B(34), 8A(31), 9A(36) |
| Parallel execution | Wave 1: Full parallel (Phases 01-03 simultaneously) |
| Naming convention | Keep "6A" format (simple, matches wireframes) |
| Teacher dashboard | **Yes, complete wireframe** - add Academic & Conduct Rating + Regular Assessment stats |
| Validation level | Basic validation (grep + visual check) |

### Action Items Based on Validation
- [ ] **Phase 04/05 expansion needed**: Add Academic & Conduct Rating section to teacher dashboard
- [ ] **Phase 04/05 expansion needed**: Add detailed Regular Assessment stats (142 evaluated, 8 pending, 128 positive, 14 needs attention)
- [ ] Update phase files to include wireframe-matching UI components
- [ ] Validation: Grep search for remaining grade 10-12 references + visual check of deployed app

## Unresolved Questions

*All previously unresolved questions now resolved via validation.*

## Next Steps

1. Execute Phase 01 (Mock Data Layer) - defines data contract
2. Execute Phase 02 (API Routes) - implements API contract
3. Execute Phase 03 (Admin UI) - parallel with Phase 02
4. Execute Phase 04 (Teacher UI) - after Wave 1 complete
5. Execute Phase 05 (Page Components) - parallel with Phase 04
6. **[NEW]** Execute Phases 07, 08, 09 (Fee & Finance Module) - parallel execution
7. Execute Phase 10 (Testing & Validation) - sequential validation

---

**Plan Directory:** `plans/260122-1337-middle-school-conversion/`
**Research Reports:**
- `research/researcher-01-wireframe-analysis.md`
- `research/researcher-02-data-flow-analysis.md`

**Phase Files:**
- `phase-01-mock-data-layer.md`
- `phase-02-api-routes.md`
- `phase-03-admin-ui-components.md`
- `phase-04-teacher-ui-components.md`
- `phase-05-page-components.md`
- `phase-06-testing-validation.md` (removed, renumbered to 10)
- `phase-07-fee-finance-data-layer.md` **[NEW]**
- `phase-08-fee-finance-api-routes.md` **[NEW]**
- `phase-09-fee-finance-ui-components.md` **[NEW]**
