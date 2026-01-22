---
title: "Web Rendering Performance Fix"
description: "Fix build errors, add error boundaries, Suspense, and improve Supabase error handling for web app stability"
status: pending
priority: P1
effort: 4h
branch: master
tags: [next.js, error-handling, performance, supabase]
created: 2026-01-23
---

# Web Rendering Performance Fix

## Problem Summary

Based on debugger report `debugger-260123-0003-web-rendering-issue.md`, the web app faces critical rendering issues:

1. **Build Failure**: Client components importing server-only Supabase functions using `next/headers`
2. **Missing Error Boundaries**: No error handling for runtime errors
3. **No Suspense Boundaries**: No loading states for async data fetching
4. **Unsafe DB Queries**: Supabase queries throw unhandled errors
5. **Auth Flow Issues**: No graceful fallback for auth failures

## Phases Overview

| Phase | Status | File | Focus |
|-------|--------|------|-------|
| 01 | pending | [phase-01-error-boundaries.md](./phase-01-error-boundaries.md) | Add error boundaries |
| 02 | pending | [phase-02-suspense-loading.md](./phase-02-suspense-loading.md) | Add Suspense + loading states |
| 03 | pending | [phase-03-supabase-error-handling.md](./phase-03-supabase-error-handling.md) | Safe DB query wrapper |
| 04 | pending | [phase-04-auth-improvements.md](./phase-04-auth-improvements.md) | Better auth error handling |
| 05 | pending | [phase-05-database-validation.md](./phase-05-database-validation.md) | Health check + validation |

## Context Links

- **Debugger Report**: `plans/reports/debugger-260123-0003-web-rendering-issue.md`
- **Root Layout**: `apps/web/app/layout.tsx`
- **Auth Library**: `apps/web/lib/auth.ts`
- **Supabase Queries**: `apps/web/lib/supabase/queries.ts`

## Success Criteria

- [ ] Build completes without errors (`pnpm run build`)
- [ ] All pages render with fallback UI on error
- [ ] Loading states show during data fetch
- [ ] DB errors handled gracefully with safe defaults
- [ ] Auth failures redirect to login with context
- [ ] Health check endpoint responds

## Risk Assessment

- **Risk Level**: Medium (affects all web pages)
- **Breaking Changes**: No (only adding error handling)
- **Dependencies**: None (uses existing patterns)
- **Rollback**: Easy (git revert)

---

## Unresolved Questions

1. Should we use React Error Boundary or Next.js app/error.tsx?
2. Should loading UI be skeleton screens or spinners?
3. Should we add retry logic for failed DB queries?

---

*Plan created: 2026-01-23*
*Last updated: 2026-01-23*
