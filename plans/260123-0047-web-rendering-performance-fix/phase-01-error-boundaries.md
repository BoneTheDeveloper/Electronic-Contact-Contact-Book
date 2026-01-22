# Phase 01: Error Boundaries

**Date**: 2026-01-23
**Priority**: P1
**Status**: pending
**Effort**: 30m

---

## Context Links

- **Related Files**:
  - `apps/web/app/layout.tsx` - Root layout
  - `apps/web/app/(auth)/layout.tsx` - Auth layout
  - Next.js Error Boundaries Docs

---

## Overview

Add error boundaries to catch runtime errors and display fallback UI instead of crashing the entire app.

## Key Insights

From debugger report:
- No error handling for component failures
- Single component error crashes entire page
- Auth pages need specific error UI

## Requirements

1. Create root error boundary at `apps/web/app/error.tsx`
2. Create global error boundary at `apps/web/app/global-error.tsx`
3. Create auth-specific error boundary
4. Add user-friendly error messages

## Implementation Steps

### Step 1: Create Root Error Boundary

**File**: `apps/web/app/error.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Đã xảy ra lỗi
        </h1>
        <p className="text-gray-500">
          Một lỗi bất ngờ đã xảy ra. Vui lòng thử lại.
        </p>
        {error.message && (
          <div className="rounded-lg bg-gray-50 p-4 text-left">
            <code className="text-sm text-gray-600">{error.message}</code>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Về trang chủ
          </Button>
          <Button onClick={reset}>
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Step 2: Create Global Error Boundary

**File**: `apps/web/app/global-error.tsx`

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-8 bg-gray-50">
          <div className="max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lỗi hệ thống nghiêm trọng
            </h1>
            <p className="text-gray-600">
              Không thể tải ứng dụng. Vui lòng liên hệ quản trị viên.
            </p>
            <Button onClick={reset} size="lg">
              Tải lại trang
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### Step 3: Update Root Layout for Auth Errors

**File**: `apps/web/app/layout.tsx`

Add try-catch wrapper for children:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'School Management System - Admin & Teacher Portals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Step 4: Create Auth Error Component

**File**: `apps/web/components/auth-error.tsx`

```tsx
'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export function AuthError({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-50 p-4">
            <AlertCircle className="h-12 w-12 text-amber-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lỗi đăng nhập
        </h1>
        <p className="text-gray-500">
          {message || 'Không thể xác thực. Vui lòng thử lại.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login">
            <Button variant="outline">
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

## Todo List

- [ ] Create `apps/web/app/error.tsx`
- [ ] Create `apps/web/app/global-error.tsx`
- [ ] Create `apps/web/components/auth-error.tsx`
- [ ] Test error boundary by throwing error in component
- [ ] Verify error UI displays correctly
- [ ] Add error logging service (optional)

## Success Criteria

- [ ] Error boundaries catch runtime errors
- [ ] Fallback UI displays with user-friendly messages
- [ ] Reset button works to retry
- [ ] Auth errors show specific UI
- [ ] No white screen of death

## Risk Assessment

- **Risk**: Low (only adds error handling)
- **Impact**: Positive (better UX)
- **Testing**: Manual error triggering

---

**Next Phase**: [Phase 02 - Suspense & Loading](./phase-02-suspense-loading.md)
