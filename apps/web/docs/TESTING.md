# Authentication Testing Guide

## Test Coverage

### Security Tests
- Input validation (email format, password requirements)
- SQL injection prevention
- XSS protection
- CSRF protection
- Session management

### Flow Tests
- Login success/failure paths
- Role-based redirects
- Password visibility toggle
- Middleware route protection

## Running Tests

```bash
# All tests (watch mode)
pnpm test

# UI mode
pnpm test:ui

# Single run
pnpm test:run
```

## Test Files

| File | Purpose |
|------|---------|
| `lib/__tests__/auth.security.test.ts` | Input validation, SQL injection, XSS |
| `lib/__tests__/auth.csrf.test.ts` | CSRF protection, cookie security |
| `lib/__tests__/auth.session.test.ts` | Session management, cookie lifecycle |
| `app/(auth)/login/__tests__/page.flow.test.tsx` | Login UI interactions |
| `__tests__/middleware.flow.test.ts` | Route protection, redirects |

## Test Structure

### Security Audit Tests

#### Input Validation (`auth.security.test.ts`)
- Empty identifier rejection
- Empty password rejection
- Valid admin code format
- Valid teacher code format
- Valid student code format
- Valid phone number (parent)
- Valid email format
- Case-insensitive code normalization
- Whitespace trimming

#### SQL Injection Prevention (`auth.sql-injection.test.ts`)
- Single quote escaping
- SQL injection in password
- UNION-based injection sanitization

#### XSS Protection (`auth.xss.test.ts`)
- Script tag escaping
- IMG tag with onerror
- JavaScript protocol sanitization

#### CSRF Protection (`auth.csrf.test.ts`)
- httpOnly cookie flag
- sameSite=lax setting
- secure flag in production

#### Error Handling (`auth.error-handling.test.ts`)
- Missing identifier handling
- Null FormData values
- Malformed identifier handling
- Corrupted cookie JSON
- Empty cookie value

#### Rate Limiting (`auth.rate-limit.test.ts`)
- Design requirements for future implementation
- 5 attempts per minute
- IP-based blocking
- CAPTCHA after 3 failed attempts

#### Session Management (`auth.session.test.ts`)
- Cookie max age (1 week)
- Cookie path (/)
- requireAuth redirect behavior
- requireAuth custom error message
- requireRole rejection
- requireRole acceptance

### Flow Tests

#### Login Page (`page.flow.test.tsx`)
- Password visibility toggle
- Teacher/admin role switching
- Empty identifier validation
- Empty password validation
- Valid teacher credentials submission
- Valid admin credentials submission
- Email format acceptance

#### Middleware (`middleware.flow.test.ts`)
- Root redirect to login (unauthenticated)
- Root redirect to role dashboard (authenticated)
- Authenticated users redirect away from login
- Admin route protection
- Teacher route protection
- Non-admin blocking from admin routes
- Non-teacher blocking from teacher routes
- Authenticated user access to role routes
- Corrupted cookie handling

## Notes

- Tests use Vitest with jsdom environment
- Next.js `cookies()` and `redirect()` are mocked
- All auth functions are tested with mock data
- Real Supabase integration tests will be added later

## Future Improvements

1. Add E2E tests with Playwright
2. Integrate Supabase Auth tests
3. Add rate limiting implementation tests
4. Add API route tests for authentication
