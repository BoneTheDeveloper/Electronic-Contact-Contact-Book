---
title: "Phase 02B: Web Core Infrastructure"
description: "Setup Next.js app with App Router, shadcn/ui, and admin/teacher portals"
status: pending
priority: P1
effort: 4h
created: 2026-01-12
---

# Phase 02B: Web Core Infrastructure

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-01](./phase-01-project-setup.md)
- Research: [web-architecture](./research/researcher-web-architecture.md)
- Wireframes: [Admin dashboard](../../docs/wireframe/Web_app/Admin/dashboard.html)

## Parallelization Info
- **Can run with**: Phase 02A (Mobile), Phase 02C (Database)
- **Must complete before**: Phase 03 (Shared UI), Phase 04B/C (Features)
- **Exclusive files**: `apps/web/*` only

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Next.js 15 with App Router, separate Admin/Teacher portals |
| Review Status | Not Started |

## Key Insights
- Route groups `(admin)` and `(teacher)` for portal isolation
- shadcn/ui for consistent components
- Server components by default, client for interactivity

## Requirements
- Next.js 15
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui

## Architecture

### App Structure
```
apps/web/
├── next.config.js
├── tailwind.config.ts
├── app/
│   ├── (auth)/              # Auth route group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (admin)/             # Admin portal
│   │   ├── layout.tsx       # Sidebar layout
│   │   ├── page.tsx         # Dashboard
│   │   ├── users/
│   │   ├── classes/
│   │   └── payments/
│   ├── (teacher)/           # Teacher portal
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── attendance/
│   │   ├── grades/
│   │   └── messages/
│   ├── (shared)/            # Shared components
│   │   └── components/
│   └── api/                 # API routes (future)
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── layout/              # Sidebar, Header
│   └── charts/              # Data viz
├── lib/
│   ├── utils.ts             # shadcn utilities
│   └── mock-data.ts         # Mock loader
└── mock-data/
    └── *.json
```

### Layout Hierarchy
```
(app)                 # Root layout with providers
├── (auth)/            # Minimal layout
├── (admin)/           # Sidebar + header layout
│   └── pages...
└── (teacher)/         # Sidebar + header layout
    └── pages...
```

## File Ownership

### Files to Create (Exclusive to 02B)
| File | Owner |
|------|-------|
| `apps/web/next.config.js` | Phase 02B |
| `apps/web/tailwind.config.ts` | Phase 02B |
| `apps/web/package.json` | Phase 02B |
| `apps/web/app/(admin)/*` | Phase 02B |
| `apps/web/app/(teacher)/*` | Phase 02B |
| `apps/web/components/layout/*` | Phase 02B |
| `apps/web/lib/mock-data.ts` | Phase 02B |
| `apps/web/mock-data/*` | Phase 02B |

## Implementation Steps

1. **Initialize Next.js App**
   ```bash
   npx create-next-app@latest apps/web --typescript --tailwind --app --no-src-dir
   cd apps/web
   ```

2. **Initialize shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   # Choose: Yes to TypeScript, Yes to Tailwind, Yes to CSS variables
   ```

3. **Configure Tailwind**
   ```typescript
   // tailwind.config.ts
   import type { Config } from 'tailwindcss'

   export default {
     darkMode: ['class'],
     content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
     theme: {
       extend: {
         colors: {
           primary: { DEFAULT: '#0284C7', foreground: 'white' }
         }
       }
     }
   } satisfies Config
   ```

4. **Create Route Groups**
   ```bash
   mkdir -p app/\(auth\)/login
   mkdir -p app/\(admin\)/dashboard
   mkdir -p app/\(teacher\)/dashboard
   ```

5. **Build Admin Layout**
   ```typescript
   // app/(admin)/layout.tsx
   import { Sidebar } from '@/components/layout/Sidebar'
   import { Header } from '@/components/layout/Header'

   export default function AdminLayout({ children }) {
     return (
       <div className="flex h-screen">
         <Sidebar role="admin" />
         <main className="flex-1">{children}</main>
       </div>
     )
   }
   ```

6. **Create Sidebar Component**
   ```typescript
   // components/layout/Sidebar.tsx
   import Link from 'next/link'

   export function Sidebar({ role }: { role: 'admin' | 'teacher' }) {
     const navItems = role === 'admin'
       ? [{ href: '/admin/dashboard', label: 'Dashboard' }, ...]
       : [{ href: '/teacher/dashboard', label: 'Dashboard' }, ...]

     return (
       <aside className="w-64 bg-white border-r">
         {navItems.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
       </aside>
     )
   }
   ```

7. **Setup Mock Data**
   ```typescript
   // lib/mock-data.ts
   import mockUsers from '../mock-data/users.json'

   export async function getUsers() {
     return mockUsers
   }

   export async function getDashboardStats() {
     return {
       students: 1248,
       parents: 2186,
       teachers: 85,
       attendance: '96.4%',
       feesCollected: '84%'
     }
   }
   ```

8. **Create Admin Dashboard**
   ```typescript
   // app/(admin)/page.tsx
   import { getDashboardStats } from '@/lib/mock-data'

   export default async function AdminDashboard() {
     const stats = await getDashboardStats()

     return (
       <div className="p-8">
         <h1>Admin Dashboard</h1>
         <div className="grid grid-cols-5 gap-6">
           {/* Stats cards matching wireframe */}
         </div>
       </div>
     )
   }
   ```

## Todo List
- [ ] Initialize Next.js app
- [ ] Setup shadcn/ui
- [ ] Configure Tailwind theme
- [ ] Create route groups
- [ ] Build Sidebar component
- [ ] Build Header component
- [ ] Create admin dashboard page
- [ ] Create teacher dashboard page
- [ ] Setup mock data loader
- [ ] Test route navigation

## Success Criteria
- Dev server starts: `npm run dev`
- Admin dashboard accessible at `/admin/dashboard`
- Teacher dashboard accessible at `/teacher/dashboard`
- Sidebar navigation works
- Mock data displays on dashboard

## Conflict Prevention
- Exclusive ownership of `apps/web/*`
- No overlap with Phase 02A (different directory)
- Shared types consumed from `packages/shared-types`

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Route group confusion | Document naming in README |
| Server component hydration | Test client components early |
| Mock data type mismatches | Use shared types package |

## Security Considerations
- Mock auth (accepts any credentials)
- No real middleware protection yet
- Document this is for demo only

## Next Steps
- Phase 03 (Shared UI) - extract reusable components
- Phase 04B (Admin Features) - build admin screens
- Phase 04C (Teacher Features) - build teacher screens
