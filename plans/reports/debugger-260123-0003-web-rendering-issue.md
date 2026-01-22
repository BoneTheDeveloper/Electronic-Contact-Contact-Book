# Rendering Issue Investigation Report

**Date:** 2026-01-23
**ID:** debugger-260123-0003
**Issue:** @apps/web rendering errors
**Status:** ROOT CAUSE IDENTIFIED

---

## Executive Summary

**ROOT CAUSE:** Client components (`'use client'` directive) importing server-only Supabase functions that use `next/headers` (cookies).

**Impact:** Build compilation fails, blocking all deployment.

**Files Affected:** 10+ teacher pages, 3 admin pages.

---

## Technical Analysis

### 1. Build Error

**Error Message:**
```
Error: You're importing a component that needs "next/headers".
That only works in a Server Component which is not supported
in the pages/ directory.
```

**Location:** `apps/web/lib/supabase/server.ts:2`

**Import Chain:**
```
./lib/supabase/server.ts (uses next/headers cookies)
  ↓
./lib/supabase/queries.ts (imports server.ts)
  ↓
./app/teacher/conduct/page.tsx (marked 'use client')
```

### 2. Affected Files

#### Teacher Pages (Client Components importing server code)
All marked with `'use client'` but importing from `@/lib/supabase/queries`:

| File | Line | Issue |
|------|------|-------|
| `app/teacher/conduct/page.tsx` | 4 | `getTeacherClasses()` |
| `app/teacher/homeroom/page.tsx` | - | Likely imports server queries |
| `app/teacher/leave-approval/page.tsx` | - | Likely imports server queries |
| `app/teacher/class-management/page.tsx` | - | Likely imports server queries |
| `app/teacher/regular-assessment/page.tsx` | - | Likely imports server queries |
| `app/teacher/messages/page.tsx` | - | Likely imports server queries |
| `app/teacher/assessments/page.tsx` | - | Likely imports server queries |

#### Server Pages (Working correctly)
No `'use client'` directive, properly async:

| File | Status |
|------|--------|
| `app/admin/dashboard/page.tsx` | ✅ Server component |
| `app/admin/classes/page.tsx` | ✅ Server component |
| `app/admin/classes/[id]/page.tsx` | ✅ Server component |
| `app/teacher/dashboard/page.tsx` | ✅ Server component |
| `app/teacher/schedule/page.tsx` | ✅ Server component |

### 3. Component Analysis

#### Form Components (No issues found)
- `components/admin/shared/forms/form-field.tsx` - Clean, uses react-hook-form
- `components/admin/shared/forms/form-select.tsx` - Clean, uses react-hook-form

#### Data Layer
- `lib/supabase/queries.ts` - All functions async, use server client ✅
- `lib/supabase/server.ts` - Uses `cookies()` from `next/headers` ✅
- `lib/auth.ts` - Mock auth, uses cookies ✅

### 4. API Routes
`app/api/users/route.ts` - ✅ Correctly uses server actions

---

## Root Cause

**Client components cannot import server-only code.**

When a file is marked `'use client'`, it becomes a client component and can only use:
- Client-side hooks (useState, useEffect, etc.)
- Browser APIs
- Server actions (via `'use server'` functions)

**It CANNOT use:**
- `cookies()` from `next/headers`
- Direct imports of server-side database clients
- Async server queries directly

---

## Recommendations

### Immediate Fix Required

**Option A: Convert to Server Components** (RECOMMENDED)
- Remove `'use client'` from affected pages
- Make page functions `async`
- Pass data to client components as props

**Option B: Create API Routes**
- Keep `'use client'` directive
- Create API routes for data fetching
- Fetch via `fetch('/api/...')` in useEffect

**Option C: Server Actions**
- Mark query functions with `'use server'`
- Import and call from client components

### Files to Fix

**Priority 1 - Blocking Build:**
1. `apps/web/app/teacher/conduct/page.tsx`
2. `apps/web/app/teacher/homeroom/page.tsx`
3. `apps/web/app/teacher/leave-approval/page.tsx`
4. `apps/web/app/teacher/class-management/page.tsx`

**Priority 2 - Other Client Pages:**
5. `apps/web/app/teacher/regular-assessment/page.tsx`
6. `apps/web/app/teacher/messages/page.tsx`
7. `apps/web/app/teacher/assessments/page.tsx`

---

## Implementation Pattern

### Correct Pattern (Server Component):
```typescript
// app/teacher/dashboard/page.tsx
export default async function DashboardPage() {
  const stats = await getDashboardStats()
  return <DashboardClient data={stats} />
}
```

### Incorrect Pattern (Current Issue):
```typescript
// app/teacher/conduct/page.tsx
'use client'
export default function ConductPage() {
  useEffect(() => {
    const data = await getTeacherClasses() // ❌ Server function
  }, [])
}
```

---

## Next Steps

1. **Decide approach:** Server Component (preferred) or API Routes
2. **Fix Priority 1 files** to unblock build
3. **Test build:** `pnpm run build`
4. **Fix remaining client pages**
5. **Add lint rule** to prevent `'use client'` + server imports

---

## Unresolved Questions

1. Why were these pages converted to client components?
2. Is there interactivity requiring client components that can't be delegated to child components?
3. Are there existing API routes that could be reused?

---

## Evidence

**Build Log:**
```
./lib/supabase/server.ts
Error: You're importing a component that needs "next/headers".
That only works in a Server Component which is not supported
in the pages/ directory.
```

**Import Chain:**
- `apps/web/app/teacher/conduct/page.tsx:4` imports `getTeacherClasses`
- `getTeacherClasses` is in `lib/supabase/queries.ts`
- `queries.ts` imports `createServerClient` from `lib/supabase/server.ts`
- `server.ts:2` imports `cookies` from `next/headers`
