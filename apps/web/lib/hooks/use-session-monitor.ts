/**
 * Session Monitor Hook
 * Monitor session for termination events via Supabase Realtime
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@school-management/shared-types'

interface SessionTerminationPayload {
  reason: string
  timestamp: string
}

/**
 * Monitor session for termination events
 * Call this in root layout or dashboard components
 */
export function useSessionMonitor(userId: string) {
  const router = useRouter()
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!userId) return

    // Clean up any existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`user:${userId}:session`)
      // @ts-expect-error - Supabase realtime channel type
      .on('broadcast', { event: 'session_terminated' }, (payload: { payload?: SessionTerminationPayload }) => {
        const { reason } = payload.payload || {}

        // Show appropriate message
        const messages: Record<string, string> = {
          new_login: 'Tài khoản của bạn đã đăng nhập ở thiết bị khác',
          timeout: 'Phiên làm việc đã hết hạn',
          manual: 'Phiên làm việc đã bị kết thúc',
          admin: 'Phiên làm việc đã bị Administrator kết thúc',
        }

        const message = messages[reason || ''] || 'Phiên làm việc đã kết thúc'

        // Show toast notification using native alert for now
        // TODO: Replace with toast library when available
        alert(message)

        // Clear auth cookies
        document.cookie = 'auth=; path=/; max-age=0'
        document.cookie = 'session_id=; path=/; max-age=0'

        // Redirect to login after delay
        setTimeout(() => {
          router.push(`/login?reason=${reason || 'session_terminated'}`)
        }, 1000)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId, router, supabase])
}
