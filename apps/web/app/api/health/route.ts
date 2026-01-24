import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type Profiles = Database['public']['Tables']['profiles']['Row']

export async function GET() {
  try {
    const supabase = createClient()

    // Simple health check - try to query a known table
    const client = await supabase
    const { error } = await client
      .from('profiles' as const)
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'disconnected',
          error: error.message,
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
