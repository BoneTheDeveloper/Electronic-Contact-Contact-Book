import { NextRequest, NextResponse } from 'next/server'
import { getFeeItems, type FeeItem } from '@/lib/supabase/queries'

// GET /api/fee-items - List all fee items with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const semester = searchParams.get('semester')
  const type = searchParams.get('type') // 'mandatory' or 'voluntary'

  try {
    const items = await getFeeItems({
      semester: semester || undefined,
      type: (type as 'mandatory' | 'voluntary') || undefined
    })

    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee items'
      },
      { status: 500 }
    )
  }
}

// POST /api/fee-items - Create a new fee item (TODO: Not implemented in Supabase queries yet)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Not implemented - use Supabase directly or implement fee item creation'
    },
    { status: 501 }
  )
}
