import { NextRequest, NextResponse } from 'next/server'
import { getFeeItems, type FeeItem } from '@/lib/mock-data'

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

// POST /api/fee-items - Create a new fee item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, type, amount, semester } = body

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing name' },
        { status: 400 }
      )
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing code' },
        { status: 400 }
      )
    }

    if (!type || !['mandatory', 'voluntary'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing type (must be mandatory or voluntary)' },
        { status: 400 }
      )
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing amount (must be a positive number)' },
        { status: 400 }
      )
    }

    if (!semester || !['1', '2', 'all'].includes(semester)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing semester (must be 1, 2, or all)' },
        { status: 400 }
      )
    }

    // Create new fee item (mock - in production would save to database)
    const newItem: FeeItem = {
      id: `fee-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type,
      amount: Number(amount),
      semester,
      status: 'active'
    }

    // In real implementation, add to database
    // For now, just return success with the created item
    return NextResponse.json({
      success: true,
      data: newItem
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create fee item'
      },
      { status: 500 }
    )
  }
}
