/**
 * Session Validation Middleware
 * Validates user sessions on each request
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@school-management/shared-types'

interface SessionValidationResult {
  valid: boolean
  reason?: 'no_session' | 'session_not_found' | 'invalid_cookie'
  session?: any
  user?: User
}

// Cache for last_active updates to prevent DB write spam
const lastActiveUpdateCache = new Map<string, number>();
const LAST_ACTIVE_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Validate session middleware
 * Use in route handlers or as Next.js middleware
 */
export async function validateSession(request: NextRequest): Promise<SessionValidationResult> {
  const sessionId = request.cookies.get('session_id')?.value
  const authCookie = request.cookies.get('auth')?.value

  if (!sessionId || !authCookie) {
    return { valid: false, reason: 'no_session' }
  }

  try {
    const user = JSON.parse(authCookie) as User
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

    // Update last_active only if throttled (5 minute intervals)
    const now = Date.now();
    const lastUpdate = lastActiveUpdateCache.get(sessionId) || 0;

    if (now - lastUpdate > LAST_ACTIVE_THROTTLE_MS) {
      await supabase
        .from('user_sessions')
        // @ts-expect-error - user_sessions table exists in DB but not in generated types
        .update({ last_active: new Date().toISOString() })
        .eq('id', sessionId);
      lastActiveUpdateCache.set(sessionId, now);
    }

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
    loginUrl.searchParams.set('reason', validation.reason || 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  return validation
}
