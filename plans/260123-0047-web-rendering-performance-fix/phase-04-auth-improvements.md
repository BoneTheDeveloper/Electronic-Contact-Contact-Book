# Phase 04: Auth Improvements

**Date**: 2026-01-23
**Priority**: P2
**Status**: pending
**Effort**: 45m

---

## Context Links

- **Related Files**:
  - `apps/web/lib/auth.ts` - Auth functions
  - `apps/web/app/(auth)/login/page.tsx` - Login page
  - `apps/web/app/(auth)/layout.tsx` - Auth layout

---

## Overview

Improve authentication error handling and add graceful redirects on auth failures.

## Key Insights

From code review:
- `requireAuth()` just redirects to `/login` with no context
- `login()` throws generic errors
- No distinction between auth failure types
- No session expiration handling

## Requirements

1. Add context to auth failures (why did it fail?)
2. Graceful redirect with error messages
3. Handle session expiration
4. Better error messages in login UI

## Implementation Steps

### Step 1: Update Auth Types

**File**: `apps/web/lib/auth.ts`

Add error types:

```typescript
export type AuthError =
  | { type: 'no_session'; message: 'Phiên đăng nhập đã hết hạn' }
  | { type: 'invalid_credentials'; message: 'Thông tin đăng nhập không chính xác' }
  | { type: 'access_denied'; message: 'Bạn không có quyền truy cập' }
  | { type: 'unknown'; message: 'Đã xảy ra lỗi. Vui lòng thử lại.' }

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: AuthError }
```

### Step 2: Update requireAuth with Context

**File**: `apps/web/lib/auth.ts`

```typescript
/**
 * Require authentication - redirect to login if not authenticated
 * Includes context about where user was trying to go
 */
export async function requireAuth(
  redirectTo?: string
): Promise<User> {
  const user = await getUser()

  if (!user) {
    // Encode current path for redirect after login
    const currentPath = redirectTo || new URL(
      // @ts-ignore - available in Next.js
      request?.url || window?.location?.href || '/admin/dashboard'
    ).pathname

    redirect(`/login?redirect=${encodeURIComponent(currentPath)}&reason=no_session`)
  }

  return user
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(
  requiredRole: UserRole,
  redirectTo?: string
): Promise<User> {
  const user = await requireAuth(redirectTo)

  if (user.role !== requiredRole) {
    const currentPath = redirectTo || '/admin/dashboard'
    redirect(`/login?redirect=${encodeURIComponent(currentPath)}&reason=access_denied`)
  }

  return user
}
```

### Step 3: Update Login with Error Display

**File**: `apps/web/app/(auth)/login/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthBrandingPanel } from '@/components/auth-branding-panel'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  const redirect = searchParams.get('redirect')

  const [role, setRole] = useState<'teacher' | 'admin'>('teacher')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Show error based on reason parameter
  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case 'no_session':
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      case 'access_denied':
        return 'Bạn không có quyền truy cập trang này.'
      case 'logout':
        return 'Bạn đã đăng xuất thành công.'
      default:
        return null
    }
  }

  const displayError = error || getErrorMessage(reason)

  // ... rest of component ...

  return (
    <>
      <AuthBrandingPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Error message */}
          {displayError && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{displayError}</p>
            </div>
          )}

          {/* ... rest of form ... */}

          {/* Add redirect input */}
          <input type="hidden" name="redirect" value={redirect || ''} />
        </div>
      </div>
    </>
  )
}
```

### Step 4: Update Login Server Action

**File**: `apps/web/lib/auth.ts`

```typescript
/**
 * Login with identifier and password
 */
export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const redirect = formData.get('redirect') as string

  if (!identifier || !password) {
    // Return error instead of throwing (better UX)
    const url = new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    url.searchParams.set('error', 'invalid_credentials')
    if (redirect) url.searchParams.set('redirect', redirect)
    redirect(url.toString())
  }

  // ... rest of login logic ...

  // Use redirect path if provided
  const redirectPath = redirect || redirectMap[user.role]
  redirect(redirectPath)
}
```

### Step 5: Add Logout with Reason

**File**: `apps/web/lib/auth.ts`

```typescript
/**
 * Logout and clear session
 */
export async function logout(redirectTo?: string) {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)

  // Add reason parameter to show logout message
  const url = new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  url.searchParams.set('reason', 'logout')
  if (redirectTo) {
    url.searchParams.set('redirect', redirectTo)
  }

  redirect(url.toString())
}
```

### Step 6: Create Auth Error Component

**File**: `apps/web/components/auth-error-message.tsx`

```tsx
interface AuthErrorMessageProps {
  reason?: string | null
  message?: string | null
}

export function AuthErrorMessage({ reason, message }: AuthErrorMessageProps) {
  if (!reason && !message) return null

  const getErrorConfig = () => {
    switch (reason) {
      case 'no_session':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: '⏰',
        }
      case 'access_denied':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: '🔒',
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'ℹ️',
        }
    }
  }

  const config = getErrorConfig()
  const displayMessage = message || getErrorMessage(reason)

  return (
    <div className={`mb-6 rounded-lg ${config.bg} border ${config.border} p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{config.icon}</span>
        <p className={`text-sm ${config.text} flex-1`}>{displayMessage}</p>
      </div>
    </div>
  )
}

function getErrorMessage(reason: string | null | undefined): string {
  switch (reason) {
    case 'no_session':
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    case 'access_denied':
      return 'Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản phù hợp.'
    case 'logout':
      return 'Bạn đã đăng xuất thành công.'
    default:
      return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
}
```

## Todo List

- [ ] Update `apps/web/lib/auth.ts` with error types
- [ ] Update `requireAuth()` with redirect context
- [ ] Update `apps/web/app/(auth)/login/page.tsx` with error display
- [ ] Create `apps/web/components/auth-error-message.tsx`
- [ ] Test auth failure scenarios
- [ ] Test session expiration
- [ ] Verify redirect after login works

## Success Criteria

- [ ] Auth failures show helpful messages
- [ ] Redirect after login works
- [ ] Session expiration handled gracefully
- [ ] Access denied shows appropriate message

## Risk Assessment

- **Risk**: Low (only adds better UX)
- **Impact**: High (better user experience)
- **Testing**: Manual auth flow testing

---

**Next Phase**: [Phase 05 - Database Validation](./phase-05-database-validation.md)
