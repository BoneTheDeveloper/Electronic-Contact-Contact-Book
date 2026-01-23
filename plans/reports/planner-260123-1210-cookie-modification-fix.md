# Research Report: Cookie Modification Error Fix

**Date:** 2026-01-23
**Issue:** Cookie modification error in Next.js App Router
**Status:** Root cause confirmed, solution designed

## Executive Summary

The `getUser()` function in `apps/web/lib/auth.ts` attempts to delete cookies when called from Server Components, violating Next.js App Router constraints. Simple fix: remove `cookieStore.delete()` calls, let session validation handle cleanup passively.

## Root Cause Analysis

**Problem:** Lines 256 and 263 in `apps/web/lib/auth.ts` call `cookieStore.delete()` within `getUser()`, which is invoked from:
- `apps/web/app/teacher/layout.tsx` (Server Component)
- `apps/web/app/admin/layout.tsx` (Server Component)
- `apps/web/app/teacher/dashboard/page.tsx` (Server Component)
- `apps/web/app/teacher/conduct/page.tsx` (Server Component)

**Constraint:** Next.js App Router only allows cookie modification in:
- Server Actions (marked with `'use server'`)
- Route Handlers (API routes in `app/api/`)

**Violation:** Server Components cannot modify cookies directly.

## Recommended Solution

**Approach:** Remove `cookieStore.delete()` calls, return `null` for invalid sessions.

**Flow:**
1. Invalid cookie → `getUser()` returns `null`
2. `requireAuth()` detects `null` → redirects to `/login`
3. Logout Server Action handles cookie cleanup (valid context)

**Benefits:**
- Minimal code change (2 lines removed)
- No architectural changes needed
- Maintains security (Supabase validates sessions)
- Cleaner separation of concerns

## Implementation Plan

**Location:** `plans/260123-1210-cookie-modification-fix/plan.md`

**Effort:** 1 hour total
- Code changes: 15 min
- Verification: 10 min
- Testing: 35 min

**Files to Modify:**
- `apps/web/lib/auth.ts` (remove 2 lines)

**Testing:**
- Valid login flow
- Invalid session handling
- Session expiry
- Logout flow
- Direct protected route access

## Edge Cases

1. **Stale Cookies:** Remain in browser but fail validation - acceptable
2. **Concurrent Requests:** Stateless validation - no issues
3. **Cookie Size:** Current implementation safe (<1KB)
4. **Security:** No degradation - Supabase authoritative

## Success Criteria

- [ ] No cookie modification errors
- [ ] Login/logout flows work
- [ ] Invalid sessions redirect properly
- [ ] TypeScript/ESLint/build checks pass

## Unresolved Questions

None.
