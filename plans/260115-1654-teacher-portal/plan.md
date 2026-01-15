---
title: "Teacher Portal Implementation - Complete Wireframe Alignment"
description: "Implement teacher portal with 11 navigation items, rename teacher-temp to teacher, add 5 new pages, update 6 existing pages to match wireframes"
status: approved
priority: P1
effort: 33.5h
branch: master
tags: [teacher, portal, wireframe, navigation, rename, new-pages]
created: 2026-01-15
validated: 2026-01-15
---

## Validation Summary

**Validated:** 2026-01-15
**Questions Asked:** 4

### Confirmed Decisions

| Decision | Choice | Impact |
|----------|--------|--------|
| **State Management** | Local useState (Recommended) | Phases 02B/02C use useState for interactive features. No Zustand dependency. |
| **Component Sharing** | Shared in Phase 01 (Recommended) | StudentAssessmentCard, RatingStars, etc. created in Phase 01 for reuse by 02A/02B/02C. |
| **Mock vs API** | Mock only now (Recommended) | No API route stubs. Pure mock-data.ts implementation. API integration deferred. |
| **Grade Locking** | Teacher controls (Recommended) | Teachers can lock/unlock their own grades. No admin approval needed. |

### Action Items
- [ ] Update Phase 01 to include shared component creation (StudentAssessmentCard, RatingStars, etc.)
- [ ] Add grade lock toggle UI to grades page (teacher-controlled)
- [ ] All phases use useState for form state

---

## Executive Summary

Implement complete teacher portal matching wireframe specifications with 11 navigation items, role-based separation (GVBM vs GVCN), and parallel execution strategy for 3 independent work groups.

**Key Deliverables:**
- Rename `teacher-temp` → `teacher`
- Implement 5 NEW pages: Teaching Schedule, Class Management, Regular Assessment, Homeroom Management, Leave Approval
- Update 6 existing pages: Dashboard, Attendance, Grades, Assessments, Conduct, Messages
- Complete navigation with 11 menu items organized by role

**Parallel Strategy:** 3 independent groups executing simultaneously with exclusive file ownership.

---

## Dependency Graph

```
                    ┌─────────────────────────────────────────────┐
                    │     PHASE 01: Foundation (5.5h) ⭐ UPDATED  │
                    │  Rename + Sidebar + Shared Components + Data│
                    └─────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
            ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
            │  GROUP A     │  │  GROUP B     │  │  GROUP C     │
            │  (8h)        │  │  (8h)        │  │  (8h)        │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
            ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
            │ PHASE 02A    │  │ PHASE 02B    │  │ PHASE 02C    │
            │ New Pages    │  │ Page Updates │  │ Page Updates │
            │ (Parallel)   │  │ (Parallel)   │  │ (Parallel)   │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │          PHASE 03: Integration (2h)│
                    │  Testing + Bug Fixes + Validation │
                    └─────────────────────────────────────┘
```

**Groups Can Execute In Parallel After Phase 01:**
- **GROUP A (02A):** Teaching Schedule, Class Management, Regular Assessment
- **GROUP B (02B):** Dashboard Update, Attendance Update, Grades Update
- **GROUP C (02C):** Assessments Update, Conduct Update, Messages Update

---

## File Ownership Matrix

### Phase 01: Foundation (Exclusive Ownership)

| File/Dir | Owner Phase | Modified By | Notes |
|----------|-------------|-------------|-------|
| `apps/web/app/teacher-temp/` | 01 | Phase 01 ONLY | Directory rename |
| `apps/web/components/layout/Sidebar.tsx` | 01 | Phase 01 ONLY | Update nav links |
| `apps/web/lib/mock-data.ts` | 01 | Phase 01 ONLY | Extend mock data |

### Phase 02A: New Pages (GROUP A)

| File/Dir | Owner Phase | Modified By | Notes |
|----------|-------------|-------------|-------|
| `apps/web/app/teacher/schedule/page.tsx` | 02A | Group A ONLY | NEW - Teaching Schedule |
| `apps/web/app/teacher/class-management/page.tsx` | 02A | Group A ONLY | NEW - Class Management |
| `apps/web/app/teacher/regular-assessment/page.tsx` | 02A | Group A ONLY | NEW - Regular Assessment |
| `apps/web/app/teacher/homeroom/page.tsx` | 02A | Group A ONLY | NEW - Homeroom Management |
| `apps/web/app/teacher/leave-approval/page.tsx` | 02A | Group A ONLY | NEW - Leave Approval |

### Phase 02B: Page Updates (GROUP B)

| File/Dir | Owner Phase | Modified By | Notes |
|----------|-------------|-------------|-------|
| `apps/web/app/teacher/dashboard/page.tsx` | 02B | Group B ONLY | UPDATE - Add sections |
| `apps/web/app/teacher/attendance/page.tsx` | 02B | Group B ONLY | UPDATE - Status buttons |
| `apps/web/app/teacher/attendance/[classId]/page.tsx` | 02B | Group B ONLY | UPDATE - Wireframe match |
| `apps/web/app/teacher/grades/page.tsx` | 02B | Group B ONLY | UPDATE - Formula + lock |
| `apps/web/app/teacher/grades/[classId]/page.tsx` | 02B | Group B ONLY | UPDATE - Grade inputs |

### Phase 02C: Page Updates (GROUP C)

| File/Dir | Owner Phase | Modified By | Notes |
|----------|-------------|-------------|-------|
| `apps/web/app/teacher/assessments/page.tsx` | 02C | Group C ONLY | UPDATE - Wireframe match |
| `apps/web/app/teacher/assessments/[id]/page.tsx` | 02C | Group C ONLY | UPDATE - Detail view |
| `apps/web/app/teacher/conduct/page.tsx` | 02C | Group C ONLY | UPDATE - Dual ratings |
| `apps/web/app/teacher/messages/page.tsx` | 02C | Group C ONLY | UPDATE - 3-column layout |
| `apps/web/app/teacher/messages/[id]/page.tsx` | 02C | Group C ONLY | UPDATE - Chat view |

---

## Execution Strategy

### Phase 01: Foundation (4h) - MUST COMPLETE FIRST

**Objective:** Establish base infrastructure for all groups

**Deliverables:**
1. Rename `teacher-temp` → `teacher` directory
2. Update Sidebar navigation with 11 items
3. Extend mock-data.ts with new functions
4. Update all internal links

**Exclusive Files:** All directory/navigation files locked after Phase 01

**Blocking:** YES - Groups 02A, 02B, 02C CANNOT start until Phase 01 completes

---

### Phase 02A: New Pages - GROUP A (8h)

**Objective:** Implement 5 NEW pages from wireframes

**Parallel With:** Phase 02B, Phase 02C

**Exclusive Files:** New page directories (no overlap with 02B/02C)

**Deliverables:**
1. Teaching Schedule (Lịch giảng dạy) - Timeline view with filter
2. Class Management (Quản lý lớp dạy) - Student list management
3. Regular Assessment (Đánh giá nhận xét) - Student evaluation cards
4. Homeroom Management (Quản lý lớp CN) - Class roster management
5. Leave Approval (Phê duyệt nghỉ phép) - Approval workflow

**Dependencies:** Requires Phase 01 completion for mock data

---

### Phase 02B: Core Pages Update - GROUP B (8h)

**Objective:** Update Dashboard, Attendance, Grades to wireframes

**Parallel With:** Phase 02A, Phase 02C

**Exclusive Files:** Dashboard, Attendance, Grades directories

**Deliverables:**
1. **Dashboard:** Add grade review section, regular assessment summary, academic/conduct section, leave requests table, today's schedule sidebar
2. **Attendance:** Add status buttons (P/A/L/E), bulk actions, save/confirm workflow, auto-fill excused
3. **Grades:** Add grade formula display, TX1/TX2/TX3/GK/CK columns, average calculation, color coding, lock mechanism

**Dependencies:** Requires Phase 01 completion

---

### Phase 02C: Secondary Pages Update - GROUP C (8h)

**Objective:** Update Assessments, Conduct, Messages to wireframes

**Parallel With:** Phase 02A, Phase 02B

**Exclusive Files:** Assessments, Conduct, Messages directories

**Deliverables:**
1. **Assessments:** Update to wireframe with student cards, rating stars, 3 states (evaluated/pending/needs attention)
2. **Conduct:** Update to wireframe with dual rating columns (academic + conduct), rating scales, pagination
3. **Messages:** Update to 3-column layout (chat list | conversation | contact info), online indicators, message bubbles

**Dependencies:** Requires Phase 01 completion

---

### Phase 03: Integration (2h)

**Objective:** Merge all groups, fix conflicts, validate

**Execution:** Single agent combining all work

**Deliverables:**
1. Merge Phase 02A, 02B, 02C branches
2. Resolve any file conflicts
3. End-to-end testing of all 11 pages
4. Navigation flow validation
5. Wireframe compliance check
6. Bug fixes and polish

---

## Navigation Structure (Final)

### Group 1: Cá nhân (Personal)
1. ✅ **Tổng quan** (Dashboard) - UPDATE Phase 02B

### Group 2: Giảng dạy (GVBM - Subject Teacher)
2. ✅ **Lịch giảng dạy** (Teaching Schedule) - NEW Phase 02A
3. ✅ **Điểm danh** (Attendance) - UPDATE Phase 02B
4. ✅ **Quản lý lớp dạy** (Class Management) - NEW Phase 02A
5. ✅ **Nhập điểm số** (Grade Entry) - UPDATE Phase 02B
6. ✅ **Đánh giá nhận xét** (Regular Assessment) - NEW Phase 02A
7. ✅ **Phúc khảo điểm** (Grade Review) - Add link to Dashboard

### Group 3: Chủ nhiệm (GVCN - Homeroom Teacher)
8. ✅ **Học tập & Hạnh kiểm** (Academic & Conduct) - UPDATE Phase 02C
9. ✅ **Quản lý lớp CN** (Homeroom Class Management) - NEW Phase 02A
10. ✅ **Phê duyệt nghỉ phép** (Leave Approval) - NEW Phase 02A
11. ✅ **Tin nhắn** (Messages) - UPDATE Phase 02C

---

## Mock Data Extensions Required

### New Functions for Phase 01

```typescript
// Teaching Schedule
getTeacherSchedule(teacherId?: string, date?: string): ScheduleItem[]

// Class Management
getClassManagementData(classId: string): ClassManagementDetail

// Regular Assessment
getRegularAssessments(teacherId?: string, filters?: AssessmentFilters): RegularAssessment[]

// Homeroom Management
getHomeroomClassData(classId: string): HomeroomClassDetail

// Leave Approval
getLeaveApprovalRequests(classId: string, status?: 'pending' | 'approved' | 'rejected'): LeaveRequest[]
```

---

## Component Reusability

### Reuse from teacher-temp
- Dashboard stats card pattern
- Class list card grid
- Table layouts
- Filter bar pattern

### New Components Needed
- **AttendanceStatusButton** - P/A/L/E toggle
- **GradeInputCell** - Number input with validation
- **StudentAssessmentCard** - 3-state evaluation card
- **RatingStars** - 1-5 star display/input
- **ChatBubble** - Message bubble with sent/received variants
- **ScheduleTimeline** - Timeline view for schedule
- **DualRatingBadge** - Academic + conduct rating display

---

## Risk Assessment

### High Risk
- **Merge conflicts** between groups → Phase 03 dedicated to resolution
- **Sidebar navigation** breaking → Phase 01 tests thoroughly
- **Mock data consistency** → Phase 01 creates all data functions upfront

### Medium Risk
- **Wireframe deviation** → Each phase includes wireframe reference
- **Missing components** → Component library created in Phase 01
- **Navigation flow** → Phase 03 validates all 11 links

### Low Risk
- **Styling inconsistency** → Using existing Tailwind patterns
- **Type errors** → TypeScript strict mode

---

## Validation Checklist

### Phase 01 Validation
- [ ] Directory renamed successfully
- [ ] All 11 navigation items working
- [ ] Mock data functions return correct types
- [ ] No broken links in navigation

### Phase 02A Validation
- [ ] 5 new pages render without errors
- [ ] Navigation links to new pages work
- [ ] Mock data displays correctly
- [ ] Wireframe patterns matched

### Phase 02B Validation
- [ ] Dashboard has all sections from wireframe
- [ ] Attendance has P/A/L/E buttons
- [ ] Grades have formula + lock mechanism
- [ ] All internal links work

### Phase 02C Validation
- [ ] Assessments show 3 card states
- [ ] Conduct shows dual ratings
- [ ] Messages shows 3-column layout
- [ ] Navigation flow complete

### Phase 03 Validation
- [ ] All 11 pages accessible
- [ ] No console errors
- [ ] Responsive design works
- [ ] Wireframe compliance 100%

---

## Success Criteria

1. ✅ All 11 navigation items functional
2. ✅ 5 new pages implemented matching wireframes
3. ✅ 6 existing pages updated to wireframe specs
4. ✅ Zero merge conflicts blocking deployment
5. ✅ Complete navigation flow (all links work)
6. ✅ Mock data supports all pages
7. ✅ Responsive design maintained
8. ✅ Consistent styling across all pages

---

## Phase Files

- [Phase 01: Foundation](./phase-01-foundation.md)
- [Phase 02A: New Pages](./phase-02A-new-pages.md)
- [Phase 02B: Core Pages Update](./phase-02B-core-pages.md)
- [Phase 02C: Secondary Pages Update](./phase-02C-secondary-pages.md)
- [Phase 03: Integration](./phase-03-integration.md)
