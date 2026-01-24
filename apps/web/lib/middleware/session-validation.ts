/**
 * Session Validation Middleware
 * Validates user sessions on each request
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@school-management/shared-types'
import type { Database } from '@/types/supabase'

interface SessionValidationResult {
  valid: boolean
  reason?: 'no_session' | 'session_not_found' | 'invalid_cookie'
  session?: Database['public']['Tables']['user_sessions']['Row']
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
      .eq('id' as const, sessionId as any)
      .eq('user_id' as const, user.id as any)
      .eq('is_active' as const, true as any)
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
        .update({ last_active: new Date().toISOString() } as any)
        .eq('id' as const, sessionId as any);
      lastActiveUpdateCache.set(sessionId, now);
    }

    return { valid: true, session: session as any, user }

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
