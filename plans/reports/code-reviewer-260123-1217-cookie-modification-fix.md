# Code Review: Cookie Modification Fix

**Date:** 2026-01-23 12:19
**Reviewer:** Code Reviewer Agent
**Plan:** Cookie Modification Fix
**Files Reviewed:** `apps/web/lib/auth.ts`
**Lines Changed:** ~13 (2 deletions, 11 type annotations added)

---

## Score: 8.5/10

**Rationale:** The fix correctly addresses the Next.js App Router cookie mutation error by removing unauthorized cookie deletions during GET operations. However, the additional type assertions added were outside the stated scope and could be improved.

---

## Critical Issues

**None.** The core fix is correct and safe.

---

## Warnings

### 1. **Scope Creep: Type Assertions Added Without Justification**

The diff shows 11 lines of type assertions added (lines 41, 55, 67, 82, 95, 117) that were **not mentioned** in the change summary:

```typescript
const result = data as { email: string } | null;
if (result?.email) return result.email;
```

**Impact:**
- Violates YAGNI - these assertions aren't fixing the reported error
- `as` casting bypasses TypeScript's type checking without proper validation
- If `data` is not actually the claimed type, runtime errors may occur

**Recommendation:** Either:
1. Remove these assertions if they weren't part of the fix
2. Replace with proper type guards: `if (data && typeof data.email === 'string')`
3. Add `@ts-expect-error` with justification if Supabase types are incorrect

### 2. **Inconsistent Cookie Cleanup Pattern**

The `logout()` function **still** calls `cookieStore.delete(AUTH_COOKIE_NAME)` (line 230):

```typescript
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);  // ← This is allowed
  redirect('/login');
}
```

But `getUser()` cannot delete cookies.

**Potential Confusion:** Future maintainers may not understand why deletion is allowed in one place but not another.

**Recommendation:** Add comment explaining why logout() can delete but getUser() cannot:

```typescript
// NOTE: Cookie deletion allowed here during POST action (logout)
// but NOT in getUser() which is called during GET (page rendering)
cookieStore.delete(AUTH_COOKIE_NAME);
```

---

## Suggestions

### 1. **Document the Next.js App Router Cookie Constraint**

Add JSDoc comment explaining the architectural limitation:

```typescript
/**
 * Get current authenticated user from cookie
 * Validates session with Supabase
 *
 * NOTE: Cannot delete cookies here due to Next.js App Router limitation:
 * - getUser() is called during GET (page rendering)
 * - cookieStore.delete() triggers "Cannot modify cookie..." error
 * - Cleanup happens naturally when session expires
 */
export async function getUser(): Promise<User | null>
```

### 2. **Consider Stale Cookie Cleanup Strategy**

Current behavior lets stale cookies persist until expiration. Consider:

**Option A:** Cleanup on next write (simple, current approach)
**Option B:** Add middleware to detect and clear invalid cookies
**Option C:** Use Supabase session validation only, skip custom cookie

**Current approach is acceptable** but document the trade-off in `ARCHITECTURE.md`.

---

## Security Review

✅ **No new vulnerabilities introduced**

- Cookie remains `httpOnly: true`
- `secure` flag preserved (production-only)
- `sameSite: 'lax'` maintained
- Session validation via Supabase still occurs
- Input sanitization (XSS protection) unchanged

---

## Performance Review

✅ **No performance impact**

- Removed 2 unnecessary cookie operations (minor improvement)
- No new database queries
- Type assertions compile away (zero runtime cost)

---

## Architecture Review

✅ **Follows Next.js App Router patterns correctly**

The fix correctly identifies the architectural constraint:

| Function | When Called | Cookie Mutation |
|----------|-------------|-----------------|
| `getUser()` | GET (page render) | ❌ Not allowed |
| `login()` | POST (form action) | ✅ Allowed |
| `logout()` | POST (form action) | ✅ Allowed |

The error occurred because Next.js App Router forbids cookie mutations during static rendering phase (GET requests).

---

## YAGNI/KISS/DRY Compliance

- ✅ **KISS:** Simple removal of problematic lines
- ✅ **DRY:** No duplication introduced
- ⚠️ **YAGNI:** Type assertions may be unnecessary (see Warning #1)

---

## Test Coverage

✅ **47/47 tests passing**

Relevant tests validate:
- SQL injection protection
- CSRF handling
- Session management
- Error handling
- XSS prevention
- Rate limiting
- Login flows

**Note:** No specific test for the cookie deletion behavior. Consider adding:

```typescript
test('getUser returns null without throwing on expired session', async () => {
  // Mock expired Supabase session
  // Verify cookie.delete() is NOT called
  // Verify null is returned
});
```

---

## Unresolved Questions

1. **Why were type assertions added alongside the cookie fix?** Were they part of the same task or accidentally included?

2. **Should stale cookies be proactively cleaned up?** Current approach leaves invalid cookies until natural expiration. Is this acceptable for security compliance?

3. **Is there a middleware-based cleanup strategy?** Could avoid stale cookies without triggering App Router errors.

---

## Recommended Actions

### Before Merge:
1. ✅ **Core fix is safe** - removing `cookieStore.delete()` calls is correct
2. ⚠️ **Clarify type assertions** - either document necessity or replace with type guards
3. ℹ️ **Add architectural comment** - explain why logout() can delete but getUser() cannot

### After Merge:
1. Add test case verifying no cookie deletion in getUser()
2. Document stale cookie handling in architecture docs
3. Consider middleware-based cleanup if required by security policy

---

## Summary

The core fix is **correct and safe** - removing `cookieStore.delete()` from `getUser()` resolves the Next.js App Router error. The additional type assertions are questionable but not harmful. Tests pass, security is maintained, and the solution follows Next.js patterns.

**Approval:** ✅ Recommended for merge with optional cleanup of type assertions.
