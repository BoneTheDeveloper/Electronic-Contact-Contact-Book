# Debug Report: Next.js App Router Cookie Modification Error

**Date:** 2026-01-23
**Issue ID:** debugger-260123-1209-nextjs-cookie-modification-error
**Status:** Root Cause Confirmed

---

## Executive Summary

**Root Cause:** Confirmed. `getUser()` function in `apps/web/lib/auth.ts` calls `cookieStore.delete()` at lines 256 and 263, which violates Next.js App Router's constraint that cookies can only be modified in Server Actions or Route Handlers.

**Impact:** All Server Components (Layouts, Pages) calling `requireAuth()` or `getUser()` will crash with this error.

**Severity:** High - Authentication flow completely broken for admin/teacher layouts and pages.

**Recommended Fix:** Remove cookie deletion from `getUser()`, return null for invalid sessions, and handle cleanup via a separate Server Action or rely on Supabase's built-in session management.

---

## Technical Analysis

### Error Timeline & Evidence

**Error Message:**
```
Error: Cookies can only be modified in a Server Action or Route Handler.
at getUser (lib\auth.ts:263:23)
at async requireAuth (lib\auth.ts:273:16)
at async TeacherLayout (app\teacher\layout.tsx:10:16)
```

**Problematic Code Location:** `apps/web/lib/auth.ts:239-266`

```typescript
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(authCookie.value) as User;

    // Verify session is still valid with Supabase
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // ❌ LINE 256: Cookie deletion in Server Component context
      cookieStore.delete(AUTH_COOKIE_NAME);
      return null;
    }

    return user;
  } catch {
    // ❌ LINE 263: Cookie deletion in Server Component context
    cookieStore.delete(AUTH_COOKIE_NAME);
    return null;
  }
}
```

**Note:** The file has `'use server'` directive at line 13, but this doesn't make Server Components work like Server Actions. The directive only affects the module's functions when called from Server Actions.

---

## Affected Files Analysis

### Files Calling `requireAuth()` or `getUser()` from Server Components:

| File | Type | Line | Function | Impact |
|------|------|------|----------|--------|
| `apps/web/app/teacher/layout.tsx` | Layout | 10 | `requireAuth()` | ❌ Crashes on teacher pages |
| `apps/web/app/admin/layout.tsx` | Layout | 10 | `requireAuth()` | ❌ Crashes on admin pages |
| `apps/web/app/teacher/dashboard/page.tsx` | Page | 81 (via `fetchDashboardData`) | `requireAuth()` | ❌ Crashes on dashboard |
| `apps/web/app/teacher/conduct/page.tsx` | Page | 8 | `requireAuth()` | ❌ Crashes on conduct page |

### Safe Usage (Route Handler):

| File | Type | Status |
|------|------|--------|
| `apps/web/app/api/auth/user/route.ts` | API Route | ✅ Works (Route Handlers can modify cookies) |

---

## Root Cause Deep Dive

### Next.js App Router Cookie Rules

1. **Server Components:** ❌ Cannot modify cookies (read-only)
2. **Server Actions:** ✅ Can modify cookies
3. **Route Handlers:** ✅ Can modify cookies
4. **Middleware:** ✅ Can modify cookies

### Why This Happens

The `getUser()` function is called from Server Components (Layouts/Pages), which execute during rendering. When `cookieStore.delete()` is invoked, Next.js throws because cookie mutations are only allowed in:
- Server Actions (form submissions, button clicks)
- Route Handlers (API endpoints)

### The Design Flaw

The current implementation tries to "cleanup" invalid cookies during read operations, which is an anti-pattern in Next.js App Router. Cookie cleanup should happen:
1. During logout (Server Action) ✅ Already implemented
2. Via Supabase's built-in session management ✅ Already handled
3. Explicit cleanup endpoint (optional)

---

## Recommended Solutions

### Option 1: Remove Cookie Deletion (Recommended)

**Change:** Remove `cookieStore.delete()` calls from `getUser()`, return null for invalid sessions.

**Pros:**
- Simplest fix
- No breaking changes to API
- Supabase already manages session lifecycle
- Stale cookies are harmless (just return null)

**Code Change:**
```typescript
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(authCookie.value) as User;

    // Verify session with Supabase
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Just return null without deleting cookie
    if (!session) {
      return null;
    }

    return user;
  } catch {
    // Just return null without deleting cookie
    return null;
  }
}
```

**Why This Works:**
- Invalid cookies will just cause `requireAuth()` to redirect to login
- Supabase session validation catches real auth issues
- No cookie mutation in Server Components
- Logout Server Action already handles proper cleanup

### Option 2: Migrate to Supabase Middleware (Alternative)

**Change:** Use Next.js middleware for auth checks instead of Layout components.

**Pros:**
- Cleaner separation of concerns
- Middleware can modify cookies
- More performant (runs before render)

**Cons:**
- More complex architecture change
- Requires refactoring all layouts
- Overkill for this specific issue

### Option 3: Auth Wrapper Component (Not Recommended)

**Change:** Create a Client Component wrapper that calls a Server Action to cleanup.

**Pros:**
- Technically works around the limitation

**Cons:**
- Adds unnecessary complexity
- Client-server roundtrip
- Still violates architectural principles

---

## Additional Considerations

### Security Implications

**Current Design:** The custom `auth` cookie duplicates Supabase's session management.

**Observation:** Supabase already handles session validation via `getSession()`. The custom cookie is redundant for security purposes.

**Recommendation:** Consider removing the custom auth cookie entirely and relying on Supabase's built-in session management. This would simplify the codebase and eliminate the cookie mutation issue.

### Edge Cases to Test

1. **Expired Supabase session:** Should redirect to login ✅ (covered)
2. **Malformed custom cookie:** Should redirect to login ✅ (covered)
3. **Missing custom cookie:** Should redirect to login ✅ (covered)
4. **Concurrent requests:** Race conditions not an issue (no mutation)

### Testing Requirements

After fix, test:
- [ ] Teacher layout renders without error
- [ ] Admin layout renders without error
- [ ] Teacher dashboard loads
- [ ] Teacher conduct page loads
- [ ] Logout still clears cookies (Server Action)
- [ ] Login flow works end-to-end

---

## Implementation Priority

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **P0** | Remove `cookieStore.delete()` from `getUser()` | 5 min | Unblocks all auth flows |
| **P1** | Test all affected pages/layouts | 15 min | Verify fix |
| **P2** | Consider removing custom auth cookie (future refactor) | 2-4 hours | Simplify architecture |

---

## Unresolved Questions

1. **Why was a custom auth cookie added on top of Supabase?**
   - Supabase has built-in session management
   - Custom cookie adds complexity without clear security benefit
   - May be legacy code from before Supabase integration

2. **Are there other places where cookies are modified in Server Components?**
   - Only `getUser()` function identified
   - `login()` and `logout()` are Server Actions ✅

3. **Should we migrate to middleware-based auth?**
   - Not required for this fix
   - Worth considering for future architecture improvements

---

## Conclusion

**Root Cause:** Confirmed - `cookieStore.delete()` in `getUser()` called from Server Components.

**Fix:** Remove cookie deletion logic, return null for invalid sessions. Leverage Supabase's session validation.

**Risk:** Low - Stale cookies are harmless and will be cleared on next logout.

**Next Step:** Implement Option 1 (5-minute fix) and test affected pages.
