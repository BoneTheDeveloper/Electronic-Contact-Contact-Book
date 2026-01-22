# Phase 02: Suspense & Loading States

**Date**: 2026-01-23
**Priority**: P1
**Status**: pending
**Effort**: 45m

---

## Context Links

- **Related Files**:
  - `apps/web/app/layout.tsx` - Root layout (add Suspense)
  - `apps/web/app/admin/dashboard/page.tsx` - Example async page
  - `apps/web/app/teacher/dashboard/page.tsx` - Example async page

---

## Overview

Add React Suspense boundaries and loading pages to show loading states during async data fetching.

## Key Insights

From code analysis:
- Dashboard pages fetch data async but no loading UI
- Users see blank screen during data fetch
- Next.js supports automatic loading.tsx files

## Requirements

1. Wrap root layout in Suspense
2. Create loading pages for dashboard routes
3. Create reusable loading components
4. Add skeleton screens for better UX

## Implementation Steps

### Step 1: Create Root Loading Page

**File**: `apps/web/app/loading.tsx`

```tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">Đang tải...</p>
      </div>
    </div>
  )
}
```

### Step 2: Create Admin Dashboard Loading

**File**: `apps/web/app/admin/dashboard/loading.tsx`

```tsx
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 p-8">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  )
}
```

### Step 3: Create Teacher Dashboard Loading

**File**: `apps/web/app/teacher/dashboard/loading.tsx`

```tsx
export default function TeacherDashboardLoading() {
  return (
    <div className="space-y-8 p-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-8">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
```

### Step 4: Create Loading Components

**File**: `apps/web/components/ui/loading.tsx`

```tsx
export function PageLoading({ message = 'Đang tải...' }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">{message}</p>
      </div>
    </div>
  )
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="h-10 bg-gray-100 rounded animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-50 rounded animate-pulse" />
      ))}
    </div>
  )
}
```

### Step 5: Wrap Root Layout in Suspense

**File**: `apps/web/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { PageLoading } from '@/components/ui/loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'School Management System - Admin & Teacher Portals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
```

## Todo List

- [ ] Create `apps/web/app/loading.tsx`
- [ ] Create `apps/web/app/admin/dashboard/loading.tsx`
- [ ] Create `apps/web/app/teacher/dashboard/loading.tsx`
- [ ] Create `apps/web/components/ui/loading.tsx`
- [ ] Update `apps/web/app/layout.tsx` with Suspense
- [ ] Test loading states on slow networks

## Success Criteria

- [ ] Loading states show during data fetch
- [ ] Skeleton screens match actual layout
- [ ] No blank screens during navigation
- [ ] Loading animations smooth (60fps)

## Risk Assessment

- **Risk**: Low (only adds loading UI)
- **Impact**: Positive (better perceived performance)
- **Testing**: Chrome DevTools throttling

---

**Next Phase**: [Phase 03 - Supabase Error Handling](./phase-03-supabase-error-handling.md)
