# Code Review Report: Web Auth Performance Fixes + Security Tests

**Date**: 2026-01-23
**Reviewer**: Code Reviewer Agent
**Project**: School Management System - Web App
**Focus**: Authentication security tests & performance fixes

---

## Executive Summary

**Score**: 7/10

Comprehensive security testing infrastructure with excellent test coverage (50/50 tests passing). Performance improvements show attention to UX. However, **CRITICAL security vulnerabilities** exist in mock auth implementation, and TypeScript violations prevent production deployment.

---

## Scope

### Files Reviewed
- `apps/web/app/layout.tsx` - Font loading optimization
- `apps/web/next.config.js` - Config cleanup
- `apps/web/vitest.config.ts` - Test config
- `apps/web/vitest.setup.ts` - Test setup
- `apps/web/lib/__tests__/auth.*.test.ts` - Security tests (6 files, 34 tests)
- `apps/web/__tests__/middleware.flow.test.ts` - Flow tests (9 tests)
- `apps/web/app/(auth)/login/__tests__/page.flow.test.tsx` - UI tests (7 tests)
- `apps/web/lib/auth.ts` - Auth implementation
- `apps/web/middleware.ts` - Route protection
- `apps/web/package.json` - Dependencies

### Lines Analyzed
- Production code: ~190 lines
- Test code: ~680 lines
- Total: ~870 lines

---

## Critical Issues

### 1. **Mock Auth Stores Unsensitized User Input** (SECURITY)

**Location**: `lib/auth.ts:111-117`

```typescript
cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: AUTH_COOKIE_MAX_AGE,
  path: '/',
})
```

**Problem**: Tests confirm XSS payloads stored unsanitized:
- Script tags: `<script>alert("xss")</script>`
- IMG onerror: `<img src=x onerror=alert(1)>`
- JavaScript protocol: `javascript:alert(1)`

**Impact**:
- While `httpOnly` cookie prevents JS access, the data is stored **before** sanitization
- Any logging/debugging could expose malicious content
- Real auth implementation **MUST** sanitize at input boundary

**Evidence**: `lib/__tests__/auth.xss.test.ts:16-31` explicitly tests for unsanitized storage

**Fix Required**:
```typescript
import DOMPurify from 'dompurify'

// Sanitize identifier before processing
const sanitizedIdentifier = DOMPurify.sanitize(loginIdentifier.trim())
```

---

### 2. **TypeScript Violation: NODE_ENV Readonly** (BUILD BLOCKER)

**Location**: `lib/__tests__/auth.csrf.test.ts:44,57`

```typescript
process.env.NODE_ENV = 'production'  // ❌ TS2540: Cannot assign to read-only property
```

**Impact**: Blocks production deployment (`npm run typecheck` fails)

**Fix**:
```typescript
import { setConfig, getConfig } from '@t3-oss/env-nextjs'

// Use test-utils pattern
const mockEnv = (env: 'development' | 'production') => {
  vi.stubGlobal('process', { env: { NODE_ENV: env } })
}
```

---

### 3. **Exposed Supabase Credentials in .env.local** (SECURITY)

**Location**: `.env.local` (gitignored but contains real URL)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://lshmmoenfeodsrthsevf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Problems**:
1. `.env.local` exists (should use `.env.local.example` only)
2. Example file contains real production URL
3. No rotation strategy if compromised

**Fix**:
1. Delete `.env.local` from filesystem
2. Update example with placeholder: `https://your-project.supabase.co`
3. Add to `README.md`: env setup instructions

---

## High Priority Findings

### 4. **SQL Injection Tests Document Vulnerability** (SECURITY)

**Location**: `lib/__tests__/auth.sql-injection.test.ts:16-56`

Tests prove current implementation accepts:
- `' OR '1'='1` payloads
- `'; DROP TABLE users; --` in passwords
- `UNION SELECT * FROM users`

**Current Behavior**: Mock auth treats `"TC001' OR '1'='1"` as teacher code (starts with "TC")

**Real Auth Must**:
```typescript
// Validate code format BEFORE database lookup
const CODE_REGEX = /^[A-Z]{2}\d{3,6}$/  // AD001, TC123, ST2024001
if (!CODE_REGEX.test(identifier)) {
  throw new Error('Invalid code format')
}
```

---

### 5. **No Rate Limiting Implementation** (SECURITY)

**Location**: `lib/__tests__/auth.rate-limit.test.ts:3-18`

Tests are **placeholders only**:
```typescript
it('REQUIREMENT: Implement login attempt rate limiting (5 attempts per minute)', () => {
  // TODO: Add rate limiting middleware
  expect(true).toBe(true)
})
```

**Missing**:
- No brute-force protection
- No IP-based blocking
- No CAPTCHA integration

**Recommendation**: Use Upstash Redis for rate limiting

---

### 6. **Cookie Security: Missing Priority/SameSite Strict** (SECURITY)

**Location**: `lib/auth.ts:111-117`

```typescript
cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',  // ❌ Should be 'strict' for auth cookies
  // ❌ Missing 'priority: high'
  maxAge: AUTH_COOKIE_MAX_AGE,
  path: '/',
})
```

**Issues**:
- `sameSite: 'lax'` allows CSRF on GET requests
- No `priority: high` (cookie may be evicted under pressure)

**Fix**:
```typescript
{
  httpOnly: true,
  secure: true,  // Always true in production
  sameSite: 'strict',
  priority: 'high',
  maxAge: AUTH_COOKIE_MAX_AGE,
  path: '/',
}
```

---

### 7. **Password Strength Validation Missing** (SECURITY)

**Location**: `lib/auth.ts:80-89`

```typescript
export async function login(formData: FormData) {
  const password = formData.get('password') as string
  // ❌ No password strength check
  if (!loginIdentifier || !password) {
    throw new Error('Identifier and password are required')
  }
}
```

**Missing Requirements**:
- Minimum length (8+ chars)
- Complexity rules (uppercase, number, special)
- Common password blacklist

**Fix**:
```typescript
import { z } from 'zod'

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain number')

const validatedPassword = passwordSchema.parse(password)
```

---

## Medium Priority Improvements

### 8. **Font Loading Strategy Incomplete** (PERFORMANCE)

**Location**: `app/layout.tsx:5-8`

```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // ✅ Good for FCP
  // ❌ Missing preload strategy
})
```

**Improvements**:
```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,  // Preload critical font
  variable: '--font-inter',  // Enable CSS variable usage
  adjustFontFallback: true,  // Minimize CLS
})
```

**Impact**: Minor - current implementation avoids FCP block

---

### 9. **Test Warnings: requestSubmit() Not Implemented**

**Output**: `Not implemented: HTMLFormElement's requestSubmit() method`

**Location**: `app/(auth)/login/__tests__/page.flow.test.tsx:74,102,122`

**Impact**: Tests pass but use workaround (mocked redirect)

**Fix**: Upgrade jsdom or use fireEvent.submit() instead

---

### 10. **Mock Tests Don't Validate Real Security**

**Problem**: All 50 tests pass against **mock** implementation

**Gap**: Tests prove mock behavior, not real auth security

**Missing**:
- Integration tests with Supabase Auth
- End-to-end tests with Playwright
- Penetration testing results

---

## Low Priority Suggestions

### 11. **Vitest Config: Missing Coverage Reporting**

**Location**: `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // ❌ Missing coverage config
  },
})
```

**Add**:
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
  exclude: ['node_modules/', '__tests__/'],
}
```

---

### 12. **Middleware Inefficient String Parsing**

**Location**: `middleware.ts:18-30`

```typescript
function getUserFromCookie(request: NextRequest): User | null {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)
  if (!authCookie?.value) return null

  try {
    return JSON.parse(authCookie.value) as User
  } catch {
    return null  // ❌ Silent failure - no logging
  }
}
```

**Improvements**:
- Add error logging
- Validate parsed User structure
- Add type guard

---

## Positive Observations

### ✅ **Excellent Test Structure**
- Clear separation: security vs. flow tests
- Comprehensive coverage: 50 tests across 9 files
- Good naming: `auth.security.test.ts`, `auth.xss.test.ts`
- Well-documented: `TESTING.md` explains all test categories

### ✅ **Performance Fix Applied Correctly**
- `display: 'swap'` prevents FCP block
- Comment explains deprecated config removal
- No breaking changes to existing code

### ✅ **Security Tests Well-Designed**
- Test actual attack vectors: SQL injection, XSS, CSRF
- Cookie security flags validated: `httpOnly`, `sameSite`, `secure`
- Error handling tested: null values, malformed data

### ✅ **YAGNI/KISS Principles Followed**
- No over-engineering in mock auth
- Simple, direct test assertions
- Minimal dependencies (Vitest + jsdom)

---

## Recommended Actions (Priority Order)

### **Before Production Deployment**

1. **[CRITICAL]** Fix TypeScript violations in `auth.csrf.test.ts`
   ```bash
   npm run typecheck  # Must pass
   ```

2. **[CRITICAL]** Remove `.env.local` file, update example with placeholders

3. **[CRITICAL]** Add input sanitization to `lib/auth.ts`
   - Install: `pnpm add dompurify @types/dompurify`
   - Sanitize `identifier` before processing

4. **[HIGH]** Implement password strength validation
   - Add Zod schema for password
   - Reject weak passwords in `login()`

5. **[HIGH]** Upgrade cookie security
   - Change `sameSite` to `'strict'`
   - Add `priority: 'high'`

### **Before Next Release**

6. **[HIGH]** Add rate limiting
   - Use Upstash Redis or similar
   - Implement: 5 attempts/minute, IP blocking

7. **[HIGH]** Add code format validation
   - Regex check for `AD###`, `TC###`, `ST#######`
   - Reject malformed codes before DB lookup

8. **[MEDIUM]** Add test coverage reporting
   - Configure Vitest coverage
   - Set minimum coverage threshold (80%)

9. **[MEDIUM]** Upgrade font loading strategy
   - Add `preload: true`
   - Add `variable: '--font-inter'`

### **Future Improvements**

10. **[LOW]** Add integration tests with Supabase
11. **[LOW]** Add E2E tests with Playwright
12. **[LOW]** Add security audit by third party

---

## YAGNI/KISS/DRY Assessment

### ✅ **YAGNI Compliant**
- No premature optimization
- Tests focus on current mock implementation
- No unnecessary abstractions

### ✅ **KISS Compliant**
- Simple test structure
- Direct, readable assertions
- Minimal mocking complexity

### ⚠️ **DRY Violation**
**Location**: Mock setup repeated in 6 test files

```typescript
// Repeated in every auth test file
const mockCookies = vi.hoisted(() => ({ set: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: () => mockCookies }))
```

**Fix**: Create `lib/__tests__/mocks/setup.ts`:
```typescript
export const setupAuthMocks = () => {
  const mockCookies = vi.hoisted(() => ({ set: vi.fn() }))
  vi.mock('next/headers', () => ({ cookies: () => mockCookies }))
  return { mockCookies }
}
```

---

## Test Results Analysis

```
Test Files  9 passed (9)
Tests      50 passed (50)
Duration   32.15s
```

**All Tests Pass** ✅ but:
- 4s per test slow (page.flow tests)
- requestSubmit() warnings (4 occurrences)
- Mock implementation only

**Performance**: Acceptable for security tests, slow for UI tests

---

## Security Checklist

- [ ] Input sanitization (**MISSING**)
- [ ] SQL injection protection (mock only, **NOT IMPLEMENTED**)
- [ ] XSS protection (mock only, **NOT IMPLEMENTED**)
- [ ] CSRF protection (partial - `sameSite: 'lax'` not strict)
- [ ] Rate limiting (placeholder only, **NOT IMPLEMENTED**)
- [ ] Password strength validation (**MISSING**)
- [ ] Secure cookie flags (partial - missing `priority`)
- [ ] Environment variable security (exposed URL in example)

**Status**: ❌ **NOT PRODUCTION READY**

---

## Performance Checklist

- [x] Font loading optimization (`display: 'swap'`)
- [ ] Font preloading strategy
- [ ] Image optimization
- [ ] Code splitting
- [ ] Bundle size monitoring

**Status**: ⚠️ **PARTIALLY COMPLETE**

---

## Code Quality Checklist

- [ ] TypeScript strict mode compliance (2 violations)
- [x] Test coverage (50 tests, good coverage)
- [ ] Linting (not run in review)
- [ ] Build success (failed with EPERM - file lock)
- [x] Readability (excellent)
- [x] Maintainability (excellent)

**Status**: ⚠️ **NEEDS ATTENTION**

---

## Unresolved Questions

1. **Why is real Supabase URL in `.env.local.example`?**
   - Should be placeholder URL
   - Security risk if project is public

2. **What is timeline for real auth implementation?**
   - Mock auth has known vulnerabilities
   - Tests document what must be implemented

3. **Are there pen test results available?**
   - Tests identify attack vectors
   - Need validation against real threats

4. **Should rate limiting use Upstash or alternative?**
   - Placeholder test mentions Redis
   - Decision needed for implementation

5. **Why is `eslint.ignoreDuringBuilds: true` in config?**
   - May hide code quality issues
   - Should fix lint errors instead

---

## Conclusion

**Strengths**:
- Excellent test infrastructure with comprehensive security coverage
- Performance fix (font loading) well-implemented
- Clear documentation and test structure

**Weaknesses**:
- **CRITICAL**: Mock auth stores unsanitized XSS payloads
- **CRITICAL**: TypeScript violations block deployment
- **HIGH**: No rate limiting or password validation
- **HIGH**: Exposed Supabase credentials in example file

**Verdict**: **7/10** - Great testing foundation, but security implementation must match test standards before production use.

---

**Next Steps**: Address Critical and High priority issues before deployment.
