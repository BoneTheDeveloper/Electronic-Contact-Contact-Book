import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStats } from '@/lib/supabase/queries'

// GET /api/payments/stats - Get payment statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await getPaymentStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment statistics'
      },
      { status: 500 }
    )
  }
}
