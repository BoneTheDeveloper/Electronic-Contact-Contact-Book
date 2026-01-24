# Phase 01: Project Setup & Structure

**Status:** Pending
**Priority:** Critical
**Dependencies:** None

## Overview

Create the foundational structure for the student portal in the web application, including routing, authentication, and base layout components.

## Context Links

- [Wireframe Designs](../../../docs/wireframe/Mobile/student/)
- [Web App Structure](../../../apps/web/app/)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md)

## Key Insights

1. Web app already has admin/teacher auth - extend for students
2. Shared components can be reused from `apps/web/components/`
3. Tailwind CSS and shadcn/ui already configured
4. Supabase MCP available for data queries

## Requirements

1. Create student route structure in Next.js App Router
2. Set up student authentication middleware
3. Create base layout components
4. Configure navigation structure

## Architecture

```
apps/web/app/
├── student/                    # NEW - Student portal
│   ├── layout.tsx             # Student layout wrapper
│   ├── page.tsx               # Dashboard (redirect)
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard
│   ├── schedule/
│   │   └── page.tsx
│   ├── grades/
│   │   └── page.tsx
│   ├── attendance/
│   │   └── page.tsx
│   ├── payments/
│   │   ├── page.tsx           # Payment overview
│   │   └── [id]/
│   │       └── page.tsx       # Payment detail
│   ├── leave/
│   │   └── page.tsx
│   ├── feedback/
│   │   └── page.tsx
│   ├── news/
│   │   └── page.tsx
│   ├── summary/
│   │   └── page.tsx
│   └── materials/
│       └── page.tsx
├── components/
│   └── student/               # NEW - Student components
│       ├── layout/
│       │   ├── StudentSidebar.tsx
│       │   ├── StudentHeader.tsx
│       │   └── StudentNav.tsx
│       └── shared/
│       ├── PageHeader.tsx
│       ├── StatCard.tsx
│       └── LoadingState.tsx
├── lib/
│   ├── middleware/
│   │   └── student-auth.ts    # NEW
│   └── hooks/
│       └── useStudentAuth.ts  # NEW
```

## Implementation Steps

### Step 1: Create Route Structure
```bash
# Create all student route directories
mkdir -p apps/web/app/student/{dashboard,schedule,grades,attendance,payments/[id],leave,feedback,news,summary,materials}
```

### Step 2: Create Student Layout (`app/student/layout.tsx`)
```tsx
// Features:
// - Authentication check
// - Sidebar navigation (desktop)
// - Bottom navigation (mobile)
// - Student header with avatar
// - Notification bell with badge
```

### Step 3: Authentication Middleware
```tsx
// lib/middleware/student-auth.ts
// Check if user is authenticated
// Check if user role is 'student'
// Redirect to login if not authenticated
// Redirect to respective portal if wrong role
```

### Step 4: Base Components
- `StudentSidebar` - Desktop left navigation
- `StudentNav` - Mobile bottom navigation (3 items)
- `StudentHeader` - Top header with profile

## Related Code Files

- `apps/web/app/admin/layout.tsx` - Reference for admin layout
- `apps/web/app/teacher/layout.tsx` - Reference for teacher layout
- `apps/web/lib/middleware/session-validation.ts` - Auth reference

## Todo List

- [ ] Create student route directories
- [ ] Create `app/student/layout.tsx` with auth check
- [ ] Create `app/student/page.tsx` redirect to dashboard
- [ ] Create `components/student/layout/StudentSidebar.tsx`
- [ ] Create `components/student/layout/StudentNav.tsx` (mobile)
- [ ] Create `components/student/layout/StudentHeader.tsx`
- [ ] Create `lib/middleware/student-auth.ts`
- [ ] Create `lib/hooks/useStudentAuth.ts`
- [ ] Add student navigation items to shared config
- [ ] Test auth flow with student credentials

## Success Criteria

- [ ] Visiting `/student` redirects authenticated students to dashboard
- [ ] Unauthenticated users redirected to login
- [ ] Admin/teacher users redirected to their portals
- [ ] Sidebar visible on desktop (>1024px)
- [ ] Bottom nav visible on mobile (<768px)
- [ ] No TypeScript errors
- [ ] No console errors

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Auth conflict with admin/teacher | High | Use role-based middleware |
| Mobile nav overlap with content | Medium | Add proper padding to body |
| Route conflicts | Low | Use unique route names |

## Security Considerations

1. Verify student can only access their own data
2. Implement proper session validation
3. CSRF protection on form submissions
4. Rate limiting on API endpoints

## Next Steps

Once this phase is complete, proceed to [Phase 02: Shared Components](phase-02-shared-components.md)
