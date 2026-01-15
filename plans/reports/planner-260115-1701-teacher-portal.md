# Teacher Portal Implementation Plan - Summary Report

**Date:** 2026-01-15
**Plan:** `plans/260115-1654-teacher-portal/`
**Status:** Ready for Implementation
**Estimated Total Time:** 32 hours

---

## Executive Summary

Comprehensive parallel-optimized implementation plan for teacher portal with complete wireframe alignment. Plan includes 5 phases with 3 independent work groups executing in parallel after foundation phase.

**Key Deliverables:**
- Rename `teacher-temp` → `teacher`
- 5 NEW pages matching wireframes
- 6 updated pages with enhanced features
- Complete 11-item navigation system
- 100% wireframe compliance

---

## Plan Structure

### Main Plan File
- **Location:** `plans/260115-1654-teacher-portal/plan.md`
- **Contents:** Overview, dependency graph, file ownership matrix, execution strategy

### Phase Files (5 total)

| Phase | File | Duration | Parallel | Status |
|-------|------|----------|----------|--------|
| 01 | `phase-01-foundation.md` | 4h | NO (BLOCKING) | Required first |
| 02A | `phase-02A-new-pages.md` | 8h | YES (with 02B, 02C) | After 01 |
| 02B | `phase-02B-core-pages.md` | 8h | YES (with 02A, 02C) | After 01 |
| 02C | `phase-02C-secondary-pages.md` | 8h | YES (with 02A, 02B) | After 01 |
| 03 | `phase-03-integration.md` | 2h | NO (FINAL) | After all |

---

## Parallel Execution Strategy

### Dependency Graph

```
Phase 01 (Foundation) - 4h
    │
    ├─────────────┬─────────────┬─────────────┐
    │             │             │             │
 Phase 02A      Phase 02B     Phase 02C
 (New Pages)   (Core Pages)  (Secondary)
   8h            8h            8h
    │             │             │
    └─────────────┴─────────────┘
                  │
             Phase 03
          (Integration)
              2h
```

### Group Allocation

**GROUP A (Phase 02A):** New Pages
- Teaching Schedule (NEW)
- Class Management (NEW)
- Regular Assessment (NEW)
- Homeroom Management (NEW)
- Leave Approval (NEW)

**GROUP B (Phase 02B):** Core Pages
- Dashboard (UPDATE)
- Attendance (UPDATE)
- Grades (UPDATE)

**GROUP C (Phase 02C):** Secondary Pages
- Assessments (UPDATE)
- Conduct (UPDATE)
- Messages (UPDATE)

---

## File Ownership Matrix

### Phase 01: Foundation (Exclusive)
- `apps/web/app/teacher-temp/` → `apps/web/app/teacher/` (RENAME)
- `apps/web/components/layout/Sidebar.tsx` (UPDATE - navigation)
- `apps/web/lib/mock-data.ts` (EXTEND - new functions)

### Phase 02A: New Pages (Exclusive)
- `/teacher/schedule/page.tsx` (NEW)
- `/teacher/class-management/page.tsx` (NEW)
- `/teacher/regular-assessment/page.tsx` (NEW)
- `/teacher/homeroom/page.tsx` (NEW)
- `/teacher/leave-approval/page.tsx` (NEW)

### Phase 02B: Core Pages (Exclusive)
- `/teacher/dashboard/page.tsx` (UPDATE)
- `/teacher/attendance/page.tsx` (UPDATE)
- `/teacher/attendance/[classId]/page.tsx` (UPDATE)
- `/teacher/grades/page.tsx` (UPDATE)
- `/teacher/grades/[classId]/page.tsx` (UPDATE)

### Phase 02C: Secondary Pages (Exclusive)
- `/teacher/assessments/page.tsx` (UPDATE)
- `/teacher/assessments/[id]/page.tsx` (UPDATE)
- `/teacher/conduct/page.tsx` (UPDATE)
- `/teacher/messages/page.tsx` (UPDATE)
- `/teacher/messages/[id]/page.tsx` (UPDATE)

**Conflict Risk:** ZERO (exclusive directory ownership)

---

## Navigation Structure (Final)

### Group 1: Cá nhân (Personal)
1. ✅ Tổng quan (Dashboard)

### Group 2: Giảng dạy (GVBM)
2. ✅ Lịch giảng dạy (Teaching Schedule) - NEW
3. ✅ Điểm danh (Attendance)
4. ✅ Quản lý lớp dạy (Class Management) - NEW
5. ✅ Nhập điểm số (Grade Entry)
6. ✅ Đánh giá nhận xét (Regular Assessment) - NEW
7. ✅ Phúc khảo điểm (Grade Review)

### Group 3: Chủ nhiệm (GVCN)
8. ✅ Học tập & Hạnh kiểm (Academic & Conduct)
9. ✅ Quản lý lớp CN (Homeroom Class Management) - NEW
10. ✅ Phê duyệt nghỉ phép (Leave Approval) - NEW
11. ✅ Tin nhắn (Messages)

**Total: 11 navigation items (up from 6)**

---

## Key Features by Page

### New Pages (02A)

**Teaching Schedule:**
- Timeline view of daily schedule
- Filter by date/week
- Color-coded by subject

**Class Management:**
- Student roster for subject classes
- Search and filter
- Export functionality

**Regular Assessment:**
- 3-state student cards (evaluated/pending/needs attention)
- 1-5 star ratings
- Comment categories

**Homeroom Management:**
- Class overview stats
- Detailed student list
- Parent contact info

**Leave Approval:**
- Pending requests list
- Approve/reject actions
- Request history

### Updated Pages (02B)

**Dashboard:**
- Grade review section
- Regular assessment summary
- Leave requests table
- Today's schedule sidebar

**Attendance:**
- P/A/L/E status buttons with color coding
- Bulk actions (mark all present, auto-fill excused)
- Save draft / Confirm workflow

**Grades:**
- Grade formula display
- TX1/TX2/TX3/GK/CK columns
- Auto-calculated averages with color coding
- Lock mechanism
- Class statistics

### Updated Pages (02C)

**Assessments:**
- 3-state student cards
- Rating stars
- Filter by status

**Conduct:**
- Dual rating display (academic + conduct)
- Rating summaries
- Pagination

**Messages:**
- 3-column layout (chat list | conversation | contact info)
- Online indicators
- Message bubbles (sent/received)
- Typing indicator

---

## Mock Data Extensions

### New Functions (Phase 01)

```typescript
getTeacherSchedule(teacherId?, date?) - Teaching schedule
getClassManagementData(classId) - Class roster details
getRegularAssessments(teacherId?, filters?) - Student assessments
getHomeroomClassData(classId) - Homeroom class details
getLeaveApprovalRequests(classId, status?) - Leave requests
```

---

## Component Library

### Reusable Components

**Existing (Reuse):**
- Card, Button, Badge, Input, Table
- Dashboard stats card pattern
- Table layouts
- Filter bar pattern

**New Components:**
- `ScheduleTimeline` - Timeline view
- `StudentAssessmentCard` - 3-state evaluation card
- `RatingStars` - 1-5 star display/input
- `AttendanceStatusButton` - P/A/L/E toggle
- `GradeInputCell` - Number input with validation
- `GradeAverageDisplay` - Color-coded average
- `DualRatingBadge` - Academic + conduct rating
- `ChatBubble` - Message bubble (sent/received)
- `OnlineIndicator` - Online status dot
- `TypingIndicator` - Animated typing dots

---

## Risk Assessment

### High Risk
- **Merge conflicts** between groups → Phase 03 dedicated to resolution (2h)
- **Navigation breaking** → Phase 01 tests thoroughly

### Medium Risk
- **Missing mock data** → Phase 01 creates all functions upfront
- **Complex features** (grade calc, chat layout) → Detailed specs in phase files

### Low Risk
- **TypeScript errors** → Caught immediately
- **Styling inconsistency** → Follow existing patterns

---

## Success Criteria

### Must Have
- ✅ All 11 navigation items functional
- ✅ 5 new pages implemented
- ✅ 6 existing pages updated
- ✅ Zero merge conflicts blocking deployment
- ✅ Complete navigation flow
- ✅ Mock data supports all pages

### Should Have
- ✅ Responsive design maintained
- ✅ Consistent styling
- ✅ Wireframe compliance 100%

### Could Have
- File uploads (future)
- Real-time chat (future)
- Export functionality (future)

---

## Implementation Timeline

### Week 1
- **Day 1-2:** Phase 01 - Foundation (4h)
- **Day 3-5:** Phase 02A, 02B, 02C - Parallel execution (8h each)

### Week 2
- **Day 1:** Phase 03 - Integration & Testing (2h)
- **Day 2:** Bug fixes & polish
- **Day 3:** Deployment readiness
- **Day 4-5:** Production deployment

**Total:** ~32 hours of development time

---

## Next Steps

1. **Review Plan:** Stakeholder approval
2. **Assign Teams:** 3 groups for parallel execution
3. **Setup Git:** Branches for each phase
4. **Start Phase 01:** Foundation work
5. **Parallel Execution:** Phases 02A, 02B, 02C
6. **Integration:** Phase 03 merge and test
7. **Deploy:** Production release

---

## Unresolved Questions

1. Should evaluation modal be inline or separate page? (Regular Assessment)
2. Grade lock - admin only or teacher can unlock?
3. Leave approval - should send notification to parent?
4. Real-time chat - WebSocket or polling?
5. Export to Excel - priority level?

---

## Files Created

### Plan Files
- `plan.md` - Main plan with overview and strategy
- `phase-01-foundation.md` - Directory rename, navigation, mock data
- `phase-02A-new-pages.md` - 5 new pages implementation
- `phase-02B-core-pages.md` - Dashboard, attendance, grades updates
- `phase-02C-secondary-pages.md` - Assessments, conduct, messages updates
- `phase-03-integration.md` - Merge, testing, validation

### Research Files (Existing)
- `research/wireframe-analysis.md` - Wireframe specifications
- `research/existing-implementation.md` - Current implementation analysis

---

## Summary

**Comprehensive parallel-optimized plan ready for implementation.**

✅ 5 phases with clear dependencies
✅ 3 independent work groups
✅ Exclusive file ownership prevents conflicts
✅ Detailed implementation steps for each phase
✅ Component library defined
✅ Mock data extensions specified
✅ Risk assessment complete
✅ Success criteria defined
✅ 32-hour timeline realistic

**Ready to execute.**
