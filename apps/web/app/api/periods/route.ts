/**
 * Periods API
 * GET /api/periods
 * Returns all school periods
 */

import { NextResponse } from 'next/server'
import { getPeriods } from '@/lib/supabase/queries/attendance'

export async function GET() {
  try {
    const periods = await getPeriods()

    return NextResponse.json({
      success: true,
      periods
    })
  } catch (error: any) {
    console.error('Error fetching periods:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải danh sách tiết học'
    }, { status: 500 })
  }
}
