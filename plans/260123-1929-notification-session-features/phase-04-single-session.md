---
title: "Phase 04: Single Session Management"
description: "Enforce single active session per account with graceful termination"
status: pending
priority: P1
effort: 5h
tags: [security, session, auth, middleware, realtime, supabase]
---

## Context

**Existing**: Cookie-based auth (`apps/web/lib/auth.ts`)
- No session tracking
- Multiple logins allowed
- No device management

**Target**: Single active session per user with:
- Device tracking
- Graceful old session termination
- Real-time logout broadcasts
- Admin session override capability

## Overview

Implement single-session-per-account enforcement:
1. **Session creation** on login
2. **Session validation** middleware
3. **Old session termination** on new login
4. **Real-time logout** via Supabase Realtime
5. **Device management** UI (optional)

## Requirements

- New login invalidates existing session
- User receives "logged out elsewhere" message
- Admin can force-logout any user
- Session persists across browser refresh
- Mobile app handles session termination
- Device info logged for security audit

## Architecture

```
Login Flow:
  1. User submits credentials
  2. Supabase Auth validates → returns session token
  3. Terminate existing sessions (DB function)
  4. Create new user_sessions record
  5. Broadcast logout to old session via Realtime
  6. Set auth cookie

Middleware:
  1. Check cookie validity
  2. Verify session exists in user_sessions
  3. Check is_active = true
  4. Update last_active timestamp
  5. Redirect if invalid

Logout Broadcast:
  1. Old client receives real-time event
  2. Show "logged out elsewhere" toast
  3. Clear local state
  4. Redirect to login
```

## Implementation Steps

### Step 1: Update Auth Login Function

**File**: `apps/web/lib/auth.ts`

```typescript
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const AUTH_COOKIE_NAME = 'auth'
const SESSION_COOKIE_NAME = 'session_id'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 1 week

/**
 * Extended login with session tracking
 */
async function loginImpl(identifier: string, password: string) {
  // ... existing validation code ...

  // Authenticate with Supabase
  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: password,
  })

  if (authError || !authData.user) {
    return { error: 'Sai tài khoản hoặc mật khẩu' }
  }

  // Get user profile
  const user = await getUserProfile(authData.user.id)
  if (!user) {
    return { error: 'Không tìm thấy thông tin người dùng' }
  }

  // === NEW: Session management ===
  const sessionToken = authData.session?.access_token || generateSessionToken()

  // Get device info
  const userAgent = await getUserAgent()
  const deviceInfo = parseUserAgent(userAgent)
  const ipAddress = await getClientIP()

  // Terminate existing sessions
  await terminateUserSessions(user.id, 'new_login')

  // Create new session
  const { data: newSession, error: sessionError } = await supabase
    .from('user_sessions')
    .insert({
      user_id: user.id,
      session_token: sessionToken,
      is_active: true,
      device_type: deviceInfo.type,
      device_id: deviceInfo.id,
      user_agent: userAgent,
      ip_address: ipAddress,
    })
    .select('id')
    .single()

  if (sessionError) {
    console.error('Failed to create session:', sessionError)
    // Continue anyway - auth is valid
  }

  // Broadcast logout to old sessions
  await broadcastSessionTermination(user.id, 'new_login')

  // Set auth cookies
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    priority: 'high',
  })

  cookieStore.set(SESSION_COOKIE_NAME, newSession?.id || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    priority: 'high',
  })

  // Role-based redirect
  const redirectMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    parent: '/student/dashboard',
    student: '/student/dashboard',
  }

  redirect(redirectMap[user.role])
}

/**
 * Terminate all active sessions for a user
 */
async function terminateUserSessions(
  userId: string,
  reason: string = 'manual'
): Promise<void> {
  const supabase = await createClient()

  await supabase.rpc('terminate_user_sessions', {
    p_user_id: userId,
    p_reason: reason
  })
}

/**
 * Broadcast session termination via Realtime
 */
async function broadcastSessionTermination(
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient()

  await supabase.channel(`user:${userId}:session`)
    .send({
      type: 'broadcast',
      event: 'session_terminated',
      payload: { reason, timestamp: new Date().toISOString() }
    })
}

/**
 * Generate random session token
 */
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Get user agent from request headers
 */
async function getUserAgent(): Promise<string> {
  const headers = await headers()
  return headers.get('user-agent') || 'Unknown'
}

/**
 * Parse user agent to extract device info
 */
function parseUserAgent(userAgent: string): {
  type: 'web' | 'mobile_ios' | 'mobile_android' | 'desktop'
  id: string
} {
  const ua = userAgent.toLowerCase()

  // Simple device detection
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return { type: 'mobile_ios', id: 'ios-device' }
  }
  if (ua.includes('android')) {
    return { type: 'mobile_android', id: 'android-device' }
  }
  if (ua.includes('mobile')) {
    return { type: 'web', id: 'mobile-web' }
  }

  // Generate simple fingerprint from user agent
  const id = Buffer.from(userAgent).toString('base64').slice(0, 16)

  return { type: 'desktop', id }
}

/**
 * Get client IP address
 */
async function getClientIP(): Promise<string | null> {
  const headers = await headers()

  // Check various headers for IP
  const ip = headers.get('x-forwarded-for')?.split(',')[0]
    || headers.get('x-real-ip')
    || headers.get('cf-connecting-ip')
    || null

  return ip
}
```

### Step 2: Create Session Middleware

**File**: `apps/web/lib/middleware/session-validation.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Validate session middleware
 * Use in route handlers or as Next.js middleware
 */
export async function validateSession(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value
  const authCookie = request.cookies.get('auth')?.value

  if (!sessionId || !authCookie) {
    return { valid: false, reason: 'no_session' }
  }

  try {
    const user = JSON.parse(authCookie)
    const supabase = await createClient()

    // Check session exists and is active
    const { data: session, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (error || !session) {
      return { valid: false, reason: 'session_not_found' }
    }

    // Update last_active
    await supabase
      .from('user_sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('id', sessionId)

    return { valid: true, session, user }

  } catch {
    return { valid: false, reason: 'invalid_cookie' }
  }
}

/**
 * Redirect to login if session invalid
 */
export async function requireValidSession(request: NextRequest) {
  const validation = await validateSession(request)

  if (!validation.valid) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('reason', validation.reason)
    return NextResponse.redirect(loginUrl)
  }

  return validation
}
```

**File**: `apps/web/middleware.ts` (or add to existing)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateSession } from '@/lib/middleware/session-validation'

export async function middleware(request: NextRequest) {
  // Skip validation for public routes
  const publicPaths = ['/login', '/register', '/forgot-password', '/api/health']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Validate session for protected routes
  const validation = await validateSession(request)

  if (!validation.valid) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    loginUrl.searchParams.set('reason', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### Step 3: Create Client-Side Session Monitor

**File**: `apps/web/lib/hooks/useSessionMonitor.ts`

```typescript
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Monitor session for termination events
 * Call this in root layout or dashboard components
 */
export function useSessionMonitor(userId: string) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`user:${userId}:session`)
      .on('broadcast', { event: 'session_terminated' }, (payload) => {
        const { reason } = payload.payload

        // Show appropriate message
        const messages: Record<string, string> = {
          new_login: 'Tài khoản của bạn đã đăng nhập ở thiết bị khác',
          timeout: 'Phiên làm việc đã hết hạn',
          manual: 'Phiên làm việc đã bị terminating',
          admin: 'Phiên làm việc đã bị Administrator kết thúc',
        }

        const message = messages[reason] || 'Phiên làm việc đã kết thúc'

        // Show toast notification
        toast.error(message, {
          duration: 5000,
          action: {
            label: 'Đăng nhập lại',
            onClick: () => router.push('/login?reason=session_terminated'),
          },
        })

        // Clear auth cookies
        document.cookie = 'auth=; path=/; max-age=0'
        document.cookie = 'session_id=; path=/; max-age=0'

        // Redirect to login after delay
        setTimeout(() => {
          router.push(`/login?reason=${reason}`)
        }, 3000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, router])
}
```

### Step 4: Update Logout Function

**File**: `apps/web/lib/auth.ts` (update existing logout)

```typescript
/**
 * Logout and clear session
 */
export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (authCookie) {
    try {
      const user = JSON.parse(authCookie)

      // Deactivate session in database
      if (sessionId) {
        const supabase = await createClient()
        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            terminated_at: new Date().toISOString(),
            termination_reason: 'manual'
          })
          .eq('id', sessionId)
      }
    } catch {
      // Ignore errors during logout
    }
  }

  // Sign out from Supabase
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear cookies
  cookieStore.delete(AUTH_COOKIE_NAME)
  cookieStore.delete(SESSION_COOKIE_NAME)

  redirect('/login')
}
```

### Step 5: Add Session Management API

**File**: `apps/web/app/api/user/sessions/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

// GET /api/user/sessions - Get user's active sessions
export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active', { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      data: sessions
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: error.status || 500 })
  }
}

// DELETE /api/user/sessions - Terminate specific session
export async function DELETE(request: Request) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        message: 'Session ID required'
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify session belongs to user
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Session not found'
      }, { status: 404 })
    }

    // Terminate session
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        terminated_at: new Date().toISOString(),
        termination_reason: 'manual'
      })
      .eq('id', sessionId)

    // Broadcast termination
    await supabase.channel(`user:${user.id}:session`)
      .send({
        type: 'broadcast',
        event: 'session_terminated',
        payload: { reason: 'manual', timestamp: new Date().toISOString() }
      })

    return NextResponse.json({
      success: true,
      message: 'Session terminated'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: error.status || 500 })
  }
}
```

### Step 6: Mobile App Session Handling

**File**: `apps/mobile/src/services/session-service.ts`

```typescript
import { createClient } from '@school-management/shared-services/supabase'
import * as SecureStore from 'expo-secure-store'
import { Alert } from 'react-native'

const SESSION_KEY = 'user_session_id'
const AUTH_KEY = 'auth_token'

/**
 * Initialize session monitoring
 */
export function initializeSessionMonitor(userId: string) {
  const supabase = createClient()

  const channel = supabase
    .channel(`user:${userId}:session`)
    .on('broadcast', { event: 'session_terminated' }, async (payload) => {
      const { reason } = payload.payload

      // Clear local storage
      await SecureStore.deleteItemAsync(SESSION_KEY)
      await SecureStore.deleteItemAsync(AUTH_KEY)

      // Show alert and redirect to login
      Alert.alert(
        'Phiên làm việc đã kết thúc',
        'Tài khoản của bạn đã đăng nhập ở thiết bị khác. Vui lòng đăng nhập lại.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              // This would use React Navigation
            }
          }
        ]
      )
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}

/**
 * Login with session tracking
 */
export async function loginWithSession(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    // Authenticate
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login failed' }
    }

    // Terminate existing sessions
    await supabase.rpc('terminate_user_sessions', {
      p_user_id: data.user.id,
      p_reason: 'new_login'
    })

    // Create new session
    const deviceInfo = await getDeviceInfo()

    const { data: newSession, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: data.user.id,
        session_token: data.session?.access_token,
        is_active: true,
        device_type: deviceInfo.type,
        device_id: deviceInfo.id,
        user_agent: deviceInfo.userAgent,
      })
      .select('id')
      .single()

    if (newSession) {
      await SecureStore.setItemAsync(SESSION_KEY, newSession.id)
    }

    await SecureStore.setItemAsync(AUTH_KEY, data.session?.access_token || '')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get device info for session tracking
 */
async function getDeviceInfo(): Promise<{
  type: 'mobile_ios' | 'mobile_android'
  id: string
  userAgent: string
}> {
  const Constants = require('expo-constants')
  const Platform = require('react-native').Platform

  return {
    type: Platform.OS === 'ios' ? 'mobile_ios' : 'mobile_android',
    id: Constants.deviceId,
    userAgent: `${Platform.OS} ${Constants.systemVersion}`,
  }
}
```

### Step 7: Add Device Management UI (Optional)

**File**: `apps/web/app/settings/sessions/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Trash2 } from 'lucide-react'
import { PrimaryButton } from '@/components/admin/shared'

interface Session {
  id: string
  device_type: 'web' | 'mobile_ios' | 'mobile_android' | 'desktop'
  is_active: boolean
  last_active: string
  created_at: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions')
      const result = await response.json()
      if (result.success) {
        setSessions(result.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      await fetch(`/api/user/sessions?id=${sessionId}`, {
        method: 'DELETE',
      })
      setSessions(sessions.filter(s => s.id !== sessionId))
    } catch (error) {
      console.error('Failed to terminate session:', error)
    }
  }

  const getDeviceIcon = (type: Session['device_type']) => {
    switch (type) {
      case 'mobile_ios':
      case 'mobile_android':
        return <Smartphone className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getDeviceName = (type: Session['device_type']) => {
    const names = {
      web: 'Trình duyệt web',
      mobile_ios: 'iPhone/iPad',
      mobile_android: 'Android',
      desktop: 'Máy tính',
    }
    return names[type] || type
  }

  if (loading) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Phiên đăng nhập</h1>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                {getDeviceIcon(session.device_type)}
              </div>
              <div>
                <p className="font-medium text-slate-900">
                  {getDeviceName(session.device_type)}
                  {session.is_active && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Hoạt động
                    </span>
                  )}
                </p>
                <p className="text-sm text-slate-500">
                  Hoạt động lần cuối: {new Date(session.last_active).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {session.is_active && (
              <button
                onClick={() => terminateSession(session.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                title="Đăng xuất khỏi thiết bị này"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
        <p>
          <strong>Lưu ý:</strong> Tài khoản của bạn chỉ có thể đăng nhập trên một thiết bị tại một thời điểm.
          Khi bạn đăng nhập ở thiết bị mới, thiết bị cũ sẽ tự động đăng xuất.
        </p>
      </div>
    </div>
  )
}
```

## Todo List

- [ ] Update `loginImpl` function with session tracking
- [ ] Create `terminateUserSessions` function
- [ ] Create `broadcastSessionTermination` function
- [ ] Add device fingerprinting utilities
- [ ] Create session validation middleware
- [ ] Update `logout` function
- [ ] Create `useSessionMonitor` hook
- [ ] Create `/api/user/sessions` endpoint
- [ ] Implement mobile session monitoring
- [ ] Create device management UI
- [ ] Test session termination flow
- [ ] Test real-time logout broadcast

## Success Criteria

- [ ] New login terminates old sessions
- [ ] Old session receives real-time logout
- [ ] User sees "logged out elsewhere" message
- [ ] Middleware validates session on each request
- [ ] Mobile app handles session termination
- [ ] Device info logged correctly
- [ ] Admin can view all sessions (optional)

## Security Considerations

1. **Session Hijacking Prevention**:
   - Bind session to IP address (optional, may break mobile)
   - Validate user-agent on each request
   - Use httpOnly cookies

2. **Race Conditions**:
   - Database-level unique constraint on active sessions
   - Transaction-based session creation

3. **DoS Protection**:
   - Rate limit login attempts
   - Cap session creation rate

4. **PII Protection**:
   - IP addresses stored securely
   - User agents logged for audit only

## Performance Optimizations

1. **Database Indexes**: Ensure indexes on `user_sessions` table
2. **Connection Pooling**: Reuse Supabase connections
3. **Caching**: Cache session validation for 30 seconds
4. **Realtime Optimization**: Unsubscribe on unmount

## Rollback Plan

- Remove session tracking from login flow
- Delete middleware configuration
- Keep `user_sessions` table (can truncate data)
- Remove real-time monitoring hooks

## Next Steps

After completing all phases:
1. Integration testing (notifications + sessions)
2. Load testing for concurrent sessions
3. Security audit of session handling
4. Deploy to staging environment
5. Monitor session creation/termination rates

## Unresolved Questions

1. IP address binding - too strict for mobile networks?
2. Session timeout period - currently no timeout, should we add?
3. Admin session override - should admins be able to terminate user sessions?
4. Notification preferences - respect user's notification settings?
