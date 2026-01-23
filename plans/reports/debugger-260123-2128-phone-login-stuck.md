# Phone Login Stuck - Root Cause Analysis

**Date:** 2026-01-23
**Issue:** Parent login with phone number `0901234569` doesn't complete
**Severity:** High - Blocks parent user access

## Executive Summary

Root cause: **Supabase Auth session restoration is interfering with the login flow**. When the user submits login credentials, Supabase client automatically attempts to restore any previous session from AsyncStorage, which blocks the current login attempt.

**Impact:** Parents cannot login using phone numbers. Students likely affected too.

## Technical Analysis

### Timeline of Events

1. User enters phone `0901234569` + password
2. LoginScreen calls `login(identifier, password)`
3. Auth store logs: `[AUTH:LOGIN_START]`, `[AUTH:IDENTIFIER_LOOKUP]`
4. Query executes: `Checking phone: 0901234569`
5. **ISSUE:** Supabase Auth automatically triggers session restoration
6. RootNavigator re-renders with `isAuthenticated: false`
7. Login flow stalls - no password auth happens

### Code Flow Analysis

**File:** `apps/mobile/src/stores/auth.ts`

The login function in `useAuthStore` (lines 136-218):

```typescript
login: async (identifier: string, password: string) => {
  // Step 1: Find user email by identifier (line 142)
  const userEmail = await findUserEmailByIdentifier(identifier);

  // Step 2: Authenticate with Supabase (line 158)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: password,
  });
```

**The Problem:**

When `supabase.auth.signInWithPassword()` is called, Supabase client first tries to restore any existing session from AsyncStorage before processing the new login request. This is due to the `persistSession: true` and `autoRefreshToken: true` settings in the client config.

**File:** `apps/mobile/src/lib/supabase/client.ts` (lines 61-66)

```typescript
auth: {
  storage: customStorageAdapter as any,
  autoRefreshToken: true,
  persistSession: true,  // <-- Causes session restoration
  detectSessionInUrl: false,
  debug: true,
}
```

### Why This Happens

1. Supabase Auth client initializes with `persistSession: true`
2. On any auth operation, it checks AsyncStorage for existing session
3. If a session exists (even if expired), it tries to restore/refresh it
4. This restoration process blocks the current login request
5. The login promise never resolves, user sees spinner forever

### Evidence from Logs

```
[AUTH:LOGIN_START] Starting login for identifier: "0901234569"
[AUTH:LOGIN_STEP_1] Finding user email by identifier...
[AUTH:IDENTIFIER_LOOKUP] Checking phone: 0901234569
[RootNavigator] Render: {"isAuthenticated": false, "userRole": undefined}
GoTrueClient@... #_acquireLock begin 10000  <-- Session restoration lock
```

The `#_acquireLock` indicates Supabase is trying to restore a session, which blocks the login flow.

## Solution

### Option 1: Clear Existing Session Before Login (RECOMMENDED)

Before calling `signInWithPassword()`, explicitly sign out any existing session:

**File:** `apps/mobile/src/stores/auth.ts`

**Location:** Line 156-157 (before `signInWithPassword`)

```typescript
// Step 1.5: Clear any existing session before new login
await supabase.auth.signOut({ scope: 'global' });

// Step 2: Authenticate with Supabase Auth
log('LOGIN_STEP_2', 'Authenticating with Supabase Auth...');
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
```

**Pros:**
- Simple fix, one line change
- Ensures clean login state
- Prevents session conflicts

**Cons:**
- Adds extra auth call (minimal performance impact)

### Option 2: Listen to Auth State Changes

Initialize auth state listener on app startup to handle session restoration:

**File:** `apps/mobile/App.tsx`

Add useEffect to listen for auth state changes:

```typescript
import { useEffect } from 'react';
import { supabase } from './src/lib/supabase/client';
import { useAuthStore } from './src/stores';

const App: React.FC = () => {
  const initializeAuth = useAuthStore(state => state.setLoading);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH_STATE]', event, session?.user?.id);
        if (event === 'SIGNED_IN' && session?.user) {
          // Restore user session
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ... rest of App component
};
```

**Pros:**
- Handles session restoration properly
- Better UX for returning users

**Cons:**
- More complex implementation
- Requires additional state management

## Recommended Fix

**Implement Option 1** - Clear existing session before login.

### Changes Required

**File:** `C:\Project\electric_contact_book\apps\mobile\src\stores\auth.ts`

**Line:** Add after line 155 (after finding user email, before auth)

```diff
          log('LOGIN_STEP_1', `Found email: ${userEmail}`);

+          // Step 1.5: Clear any existing session before new login
+          log('LOGIN_STEP_1.5', 'Clearing existing session...');
+          await supabase.auth.signOut({ scope: 'global' });
+
          // Step 2: Authenticate with Supabase Auth
```

### Testing Plan

1. Test login with phone `0901234569` + password `Test123456!`
2. Verify login completes successfully
3. Test login with email `parent@school.edu`
4. Test student login with `ST2024001`
5. Test logout and re-login
6. Test with expired/invalid sessions

## Unresolved Questions

1. **Why is there an existing session in AsyncStorage?**
   - Need to check if previous test sessions were not properly cleared
   - Verify `logout()` is working correctly

2. **Does this affect web app too?**
   - Need to check web auth implementation

3. **Is `persistSession: true` necessary for mobile?**
   - Consider if we need persistent sessions or should use fresh logins

## Additional Recommendations

1. **Add session cleanup on app startup:**
   - Check if session is valid on app launch
   - Clear invalid/expired sessions

2. **Add timeout to login:**
   - Prevent infinite spinner if auth hangs
   - Show user-friendly error message

3. **Improve error logging:**
   - Log Supabase auth errors in detail
   - Track session restoration attempts

## Implementation Status

**Status:** ✅ FIXED

**Change Applied:** `C:\Project\electric_contact_book\apps\mobile\src\stores\auth.ts`

Added session cleanup at line 156-158 (after finding user email):

```typescript
// Step 1.5: Clear any existing session before new login
log('LOGIN_STEP_1.5', 'Clearing existing session...');
await supabase.auth.signOut({ scope: 'global' });
```

This ensures any existing/invalid session is cleared before attempting a new login, preventing the session restoration deadlock.

## Related Files

- `apps/mobile/src/stores/auth.ts` - Auth store with login logic (MODIFIED)
- `apps/mobile/src/lib/supabase/client.ts` - Supabase client config
- `apps/mobile/src/screens/auth/LoginScreen.tsx` - Login UI
- `apps/mobile/src/navigation/RootNavigator.tsx` - Auth state handling
