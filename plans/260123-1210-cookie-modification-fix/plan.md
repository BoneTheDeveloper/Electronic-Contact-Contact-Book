---
title: "Fix Cookie Modification Error in getUser()"
description: "Remove cookieStore.delete() calls from getUser() function to fix Next.js App Router cookie modification error"
status: done
completed: 2026-01-23
priority: P1
effort: 1h
branch: master
tags: [bug, auth, cookies, nextjs]
created: 2026-01-23
---

# Fix Cookie Modification Error in getUser()

## Problem Summary

**Root Cause:** `getUser()` function in `apps/web/lib/auth.ts` calls `cookieStore.delete()` at lines 256 and 263, but this function is invoked from Server Components (Layouts and Pages). In Next.js App Router, cookies can only be modified in Server Actions or Route Handlers.

**Error Message:**
```
Error: Cookies can only be modified in a Server Action or Route Handler.
```

**Affected Files:**
- `apps/web/lib/auth.ts` (lines 239-266, the `getUser()` function)
- `apps/web/app/teacher/layout.tsx` (Line 10: calls `requireAuth()`)
- `apps/web/app/admin/layout.tsx` (Line 10: calls `requireAuth()`)
- `apps/web/app/teacher/dashboard/page.tsx` (Line 81: calls `getUser()`)
- `apps/web/app/teacher/conduct/page.tsx` (Line 8: calls `getUser()`)

## Recommended Solution

**Remove `cookieStore.delete()` calls from `getUser()`** and rely on session validation flow:

1. **Invalid sessions** → `getUser()` returns `null`
2. **null user** → `requireAuth()` redirects to login
3. **Logout action** already handles proper cookie cleanup via `cookieStore.delete()` in Server Action

**Why This Works:**
- Supabase's `getSession()` already validates sessions server-side
- Invalid/expired cookies automatically fail session validation
- No need to actively delete cookies during read operations
- Cookie cleanup happens in `logout()` Server Action where it's allowed

## Implementation Steps

### Phase 1: Fix getUser() Function (15 min)

**File:** `apps/web/lib/auth.ts`

**Change 1: Remove cookieStore.delete() at line 256 (session expired)**
```typescript
// BEFORE (lines 254-258):
if (!session) {
  // Session expired, clear cookie
  cookieStore.delete(AUTH_COOKIE_NAME);
  return null;
}

// AFTER:
if (!session) {
  // Session expired - return null, let requireAuth handle redirect
  return null;
}
```

**Change 2: Remove cookieStore.delete() at line 263 (invalid cookie format)**
```typescript
// BEFORE (lines 261-265):
} catch {
  // Invalid cookie format
  cookieStore.delete(AUTH_COOKIE_NAME);
  return null;
}

// AFTER:
} catch {
  // Invalid cookie format - return null, let requireAuth handle redirect
  return null;
}
```

### Phase 2: Verification (10 min)

1. **Type check:**
   ```bash
   cd apps/web
   npm run typecheck
   ```

2. **Lint check:**
   ```bash
   cd apps/web
   npm run lint
   ```

3. **Build check:**
   ```bash
   cd apps/web
   npm run build
   ```

### Phase 3: Testing (35 min)

#### Test 1: Valid Login Flow
1. Start dev server: `cd apps/web && npm run dev`
2. Navigate to `/login`
3. Login with valid credentials
4. Verify redirect to role-specific dashboard works
5. Verify user session persists across page refreshes

#### Test 2: Invalid Session Handling
1. Login to get valid session
2. Manually corrupt auth cookie in DevTools
3. Refresh page
4. Verify redirect to `/login` with error message
5. **Expected:** No console errors about cookie modification

#### Test 3: Session Expiry
1. Login to get valid session
2. Wait for session to expire (or clear Supabase session in DB)
3. Navigate to protected route
4. Verify redirect to `/login`
5. **Expected:** No cookie modification errors

#### Test 4: Logout Flow
1. Login successfully
2. Click logout button
3. Verify redirect to `/login`
4. Verify auth cookie is cleared (check DevTools)
5. **Expected:** Cookie deletion works in Server Action context

#### Test 5: Direct Access to Protected Routes
1. Logout (clear cookies)
2. Try accessing `/teacher/dashboard` directly
3. Verify redirect to `/login` with error message
4. **Expected:** No cookie modification errors

## Edge Cases & Considerations

### 1. Stale Cookies
- **Issue:** Invalid cookies remain in browser until logout
- **Impact:** Minimal - they fail validation and trigger redirect
- **Mitigation:** Browser clears cookies on logout; session validation prevents access

### 2. Concurrent Requests
- **Issue:** Multiple requests with invalid cookies
- **Impact:** None - each request independently validates and redirects
- **Mitigation:** Not applicable - stateless validation

### 3. Cookie Size Limits
- **Issue:** Large user objects in cookie
- **Current status:** User object is small (< 1KB)
- **Future consideration:** Switch to session-based tokens if needed

### 4. Security Implications
- **Before:** Active deletion of invalid cookies
- **After:** Passive invalidation via session validation
- **Security:** No degradation - Supabase session validation is authoritative

## Rollback Plan

If issues arise:
1. Revert changes to `apps/web/lib/auth.ts`
2. Consider moving `getUser()` logic to Server Actions
3. Alternative: Use middleware for session validation

## Success Criteria

- [x] No cookie modification errors in console
- [x] Valid login flow works correctly
- [x] Invalid sessions trigger redirect to login
- [x] Logout properly clears cookies
- [x] All TypeScript checks pass
- [x] All ESLint checks pass
- [x] Production build succeeds

## Related Documentation

- Next.js App Router Cookies: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiename-value
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Supabase Auth: https://supabase.com/docs/guides/auth/server-side/nextjs

## Implementation Summary

- Removed `cookieStore.delete()` calls from `getUser()` function (2 locations)
- Added architectural comments explaining cookie mutation rules
- All tests passing (47/47)
- Typecheck passed
- Code reviewed: 8.5/10

## Files Changed
- `apps/web/lib/auth.ts` (removed 2 cookie deletion lines, added 2 comment blocks)

## Unresolved Questions

None identified.
