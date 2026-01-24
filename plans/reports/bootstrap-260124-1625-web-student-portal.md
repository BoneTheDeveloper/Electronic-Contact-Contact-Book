# Web Student Portal - Plan Summary

**Date:** 2025-01-24
**Type:** Bootstrap Plan
**Status:** Ready for Review

---

## Executive Summary

This plan implements a complete student portal for the web application (`apps/web`) that matches the mobile wireframe designs in `docs/wireframe/Mobile/student/`. The portal will provide students with web-based access to all their academic information.

**Files Created:**
- Plan: `plans/260124-1625-web-student-portal/plan.md`
- Phases: 8 detailed phase files
- Design Doc: `docs/mobile_function/web-student-portal-design.md`

## Scope

### Screens to Implement (10 total)

| Screen | Route | Wireframe | Phase |
|--------|-------|-----------|-------|
| Dashboard | `/student/dashboard` | dashboard.html | 03 |
| Grades | `/student/grades` | grades.html | 04 |
| Schedule | `/student/schedule` | schedule.html | 04 |
| Attendance | `/student/attendance` | (referenced) | 04 |
| Payments | `/student/payments` | payment-overview.html | 05 |
| Payment Detail | `/student/payments/[id]` | payment-detail.html | 05 |
| News | `/student/news` | news.html | 06 |
| Notifications | Header Bell | notifications.html | 06 |
| Teacher Feedback | `/student/feedback` | teacher-feedback.html | 06 |
| Leave Request | `/student/leave` | leave-request.html | 07 |
| Summary | `/student/summary` | summary.html | 07 |
| Study Materials | `/student/materials` | (new) | 07 |

## Key Design Decisions

### 1. Layout System
- **Mobile (375px-768px):** Single column, bottom nav, back buttons
- **Tablet (768px-1024px):** Two columns, side nav, modals
- **Desktop (1024px+):** Three columns, persistent sidebar, data tables

### 2. Color Palette (from wireframes)
- Primary: `#0284C7` (blue)
- Gradient: `#0284C7` → `#0369A1`
- Subject colors match wireframe exactly

### 3. Component Architecture
```
apps/web/components/student/
├── layout/          # Sidebar, Nav, Header
├── shared/          # Reusable components
├── dashboard/       # Dashboard-specific
├── grades/          # Grades-specific
├── schedule/        # Schedule-specific
├── attendance/      # Attendance-specific
├── payments/        # Payments-specific
├── feedback/        # Feedback-specific
└── news/            # News-specific
```

### 4. Data Layer
- Supabase for backend (same as mobile)
- Shared queries from `lib/supabase/queries.ts`
- Zustand for client state (reuse from mobile)

## Implementation Phases

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 01 | Setup & Structure | 8 |
| 02 | Shared Components | 9 |
| 03 | Dashboard | 3 |
| 04 | Academic (Grades, Schedule, Attendance) | 15 |
| 05 | Payments | 12 |
| 06 | Communication (News, Notifications, Feedback) | 14 |
| 07 | Additional (Leave, Materials, Summary) | 12 |
| 08 | Testing & Deployment | - |

**Total Estimated Files:** ~70 new files

## Tech Stack

| Item | Technology |
|------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Data | Supabase |
| Testing | Jest + Playwright |

## Pros & Cons

### Pros
✓ Leverages existing mobile designs
✓ Reuses admin/teacher components
✓ Consistent UX across platforms
✓ Responsive by design
✓ Type-safe with TypeScript

### Cons
✗ Requires 8+ phases to complete
✗ ~70 new files to create
✗ Needs thorough testing
✗ Payment integration complexity

## Success Criteria

- [ ] All 10 screens matching wireframes
- [ ] Responsive on all breakpoints
- [ ] Real Supabase data integration
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Lighthouse score > 90

## Next Steps

1. **Review Plan:** Read through all phase files
2. **Approve Design:** Review `docs/mobile_function/web-student-portal-design.md`
3. **Start Phase 01:** Begin project setup

## Questions for User

1. Should the student portal support multiple languages (Vietnamese only)?
2. Do parents need access to the web student portal (currently mobile only)?
3. Should we implement real payment integration or mock for now?
4. Any specific browser requirements for desktop users?

---

## File Locations

**Plan Directory:** `plans/260124-1625-web-student-portal/`
**Design Doc:** `docs/mobile_function/web-student-portal-design.md`
**Wireframes:** `docs/wireframe/Mobile/student/*.html`
**Mobile Reference:** `apps/mobile/src/screens/student/*.tsx`

---

**Status:** Ready for your review and approval to begin implementation.
