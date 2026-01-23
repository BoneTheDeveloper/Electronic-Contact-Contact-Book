# Cookie Modification Fix Documentation

## Overview

This document describes the cookie modification fix implemented to resolve Next.js App Router cookie mutation errors in the School Management System.

## Problem Statement

Next.js App Router has strict restrictions on cookie operations during GET requests (page rendering). The previous implementation of the `getUser()` function in `apps/web/lib/auth.ts` included `cookieStore.delete()` calls, which violated these restrictions and caused runtime errors.

## Root Cause Analysis

### Issue Details
- **Error**: Next.js App Router forbids cookie mutations during GET requests
- **Location**: `apps/web/lib/auth.ts` - `getUser()` function
- **Violation**: `cookieStore.delete()` operations in GET request context
- **Impact**: Authentication flow failures, page rendering errors

### Technical Context
In Next.js App Router:
- GET requests = page rendering
- POST requests = Server Actions
- Route Handlers = Special endpoints for specific operations

Cookie mutations are only allowed in:
1. Server Actions (POST requests)
2. Route Handlers (specialized endpoints)
3. Not in regular GET request handlers

## Solution Implementation

### Changes Made

#### File: `apps/web/lib/auth.ts`

1. **Removed `cookieStore.delete()` calls** from `getUser()` function (2 locations)
2. **Added architectural comments** explaining cookie mutation rules
3. **Updated session management** to handle invalid sessions gracefully

#### Code Changes
```typescript
// Before (problematic)
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    cookieStore.delete('supabase.auth.token');
    return null;
  }

  return user;
};

// After (fixed)
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    // Note: Cannot delete cookies in GET requests with App Router
    // Cookie deletion is only allowed in Server Actions or Route Handlers
    // Invalid sessions will return null and redirect via requireAuth()
    return null;
  }

  return user;
};
```

### Session Management Flow

1. **Valid Session**: `getUser()` returns user object
2. **Invalid Session**: `getUser()` returns null
3. **Route Protection**: `requireAuth()` detects null and redirects to login
4. **Cookie Cleanup**: Handled separately in logout action (Server Action)

## Cookie Management Rules

### When to Modify Cookies
✅ **Allowed**:
- Server Actions (POST requests)
- Route Handlers
- API routes with specific purposes

❌ **Not Allowed**:
- Page components (GET requests)
- Layout components
- Server components during render

### Best Practices
1. **Separate cookie operations** from data fetching
2. **Use Server Actions** for logout and cookie cleanup
3. **Handle invalid sessions** gracefully in `getUser()`
4. **Document cookie restrictions** in auth utilities

## Testing Strategy

### Test Cases
1. **Normal Flow**: Valid user session
2. **Error Flow**: Invalid/expired session
3. **Page Rendering**: No cookie mutations during GET requests
4. **Logout**: Cookie cleanup via Server Action

### Verification Steps
1. Test login functionality
2. Test page rendering with valid session
3. Test session expiration handling
4. Test logout functionality
5. Verify no cookie-related errors in console

## Rollout Plan

### Phase 1: Development ✅
- Implement fix in development environment
- Run all existing tests
- Verify authentication flow works correctly

### Phase 2: Staging
- Deploy to staging environment
- Conduct user acceptance testing
- Monitor for any cookie-related errors

### Phase 3: Production
- Deploy to production
- Monitor application health
- Be prepared for rollback if issues occur

## Monitoring & Maintenance

### Metrics to Track
- Authentication success rate
- Session error rate
- Page load performance
- Console errors related to cookies

### Maintenance Notes
- Keep cookie documentation updated
- Follow Next.js App Router best practices
- Monitor for future Next.js version changes

## Related Documentation

- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Project Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)

## Change History

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2026-01-23 | 1.0.0 | Initial implementation of cookie modification fix | Development Team |

## Known Limitations

1. **Cookie cleanup** must happen in Server Actions, not during regular page loads
2. **Session invalidation** requires user interaction (logout button)
3. **No automatic cookie cleanup** on session expiration during GET requests

## Future Considerations

1. **Investigate** alternative session management strategies
2. **Consider** using cookies for less critical data
3. **Evaluate** moving to token-based storage for better flexibility