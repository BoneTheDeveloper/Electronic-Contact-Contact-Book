/**
 * User Sessions API
 * GET /api/user/sessions - Get user's active sessions
 * DELETE /api/user/sessions - Terminate specific session
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

interface Session {
  id: string
  user_id: string
  session_token: string
  is_active: boolean
  last_active: string
  created_at: string
  device_type?: 'web' | 'mobile_ios' | 'mobile_android' | 'desktop'
  device_id?: string
  user_agent?: string
  ip_address?: string
  terminated_at?: string
  termination_reason?: 'new_login' | 'timeout' | 'manual' | 'admin'
}

// GET /api/user/sessions - Get user's active sessions
export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: sessions, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch sessions'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: sessions as Session[]
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication required'
    const errorStatus = (error as { status?: number }).status || 401
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: errorStatus })
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
    const { error: updateError } = await supabase
      .from('user_sessions')
      // @ts-expect-error - user_sessions table exists in DB but not in generated types
      .update({
        is_active: false,
        terminated_at: new Date().toISOString(),
        termination_reason: 'manual'
      })
      .eq('id', sessionId);

    if (updateError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to terminate session'
      }, { status: 500 })
    }

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication required'
    const errorStatus = (error as { status?: number }).status || 401
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: errorStatus })
  }
}
