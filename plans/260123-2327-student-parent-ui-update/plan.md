---
title: "Mobile UI Update: Student Dashboard & Parent Consistency"
description: "Update student dashboard to match wireframe design (remove sections, add gradient) & standardize parent UI colors/typography"
status: pending
priority: P2
effort: 6h
branch: master
tags: [mobile, ui, refactor, parallel]
created: 2026-01-23
---

## Dependency Graph (Parallel Execution)

```
Phase 01: Student Dashboard
Phase 02: Parent Colors      } ── PARALLEL ──┐
Phase 03: Navigation                         │
                                           ├─> Phase 04: Shared Screens
                                         (SEQ: depends on 01-03)
```

## Execution Strategy

**Parallel Batch 1** (Independent, Run Concurrently):
- Phase 01: Student Dashboard Simplification
- Phase 02: Parent Color Consistency
- Phase 03: Navigation Updates

**Sequential** (After Batch 1):
- Phase 04: Shared Screen Styling (depends on color/theme fixes from 01-03)

## File Ownership Matrix

| Phase | Files Owned | Modifications |
|-------|-------------|---------------|
| 01 | `apps/mobile/src/screens/student/Dashboard.tsx` | Remove sections, add gradient, adjust spacing |
| 02 | `apps/mobile/src/screens/parent/Dashboard.tsx`, `apps/mobile/src/theme/colors.ts` | Replace #0284C7 with theme.colors.primary |
| 03 | `apps/mobile/src/navigation/ParentTabs.tsx`, `apps/mobile/src/navigation/StudentTabs.tsx` | Standardize tab bar styling, colors |
| 04 | `apps/mobile/src/screens/parent/{Schedule,Grades,Attendance,TeacherFeedback,LeaveRequest,News,Summary}.tsx` | Apply consistent styling from Phase 01-03 |

## Phase Files

- [Phase 01: Student Dashboard](./phase-01-student-dashboard-simplification.md)
- [Phase 02: Parent Colors](./phase-02-parent-color-consistency.md)
- [Phase 03: Navigation](./phase-03-navigation-updates.md)
- [Phase 04: Shared Screens](./phase-04-shared-screen-styling.md)

## Success Criteria

✅ Student dashboard matches wireframe (no stats/assignments sections)
✅ Parent UI uses theme.colors.primary consistently
✅ Navigation bars have consistent styling
✅ Shared screens (Schedule, Grades, etc.) have unified look
✅ No merge conflicts between phases
✅ All changes follow KISS/DRY principles

## Related Docs

- Research: [researcher-01-student-ui-report.md](./research/researcher-01-student-ui-report.md)
- Research: [researcher-02-parent-ui-report.md](./research/researcher-02-parent-ui-report.md)
- Wireframe: `docs/wireframe/Mobile/student/dashboard.html`
