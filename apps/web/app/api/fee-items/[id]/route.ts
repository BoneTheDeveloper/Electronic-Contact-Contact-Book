import { NextRequest, NextResponse } from 'next/server'
import { getFeeItems } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'
import type { FeeItem } from '@/lib/types'

// Helper function to get fee item by ID
async function getFeeItemById(id: string): Promise<FeeItem | undefined> {
  const items = await getFeeItems()
  return items.find(item => item.id === id)
}

// GET /api/fee-items/[id] - Get a specific fee item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await getFeeItemById(id)

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Fee item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: item
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee item'
      },
      { status: 500 }
    )
  }
}

// PUT /api/fee-items/[id] - Update a fee item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, code, type, amount, semester, status } = body

    // Verify fee item exists
    const existingItem = await getFeeItemById(id)
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Fee item not found' },
        { status: 404 }
      )
    }

    // Validation for type field
    if (type && !['mandatory', 'voluntary'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type (must be mandatory or voluntary)' },
        { status: 400 }
      )
    }

    // Validation for semester field
    if (semester && !['1', '2', 'all'].includes(semester)) {
      return NextResponse.json(
        { success: false, error: 'Invalid semester (must be 1, 2, or all)' },
        { status: 400 }
      )
    }

    // Validation for status field
    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status (must be active or inactive)' },
        { status: 400 }
      )
    }

    // Mock update - in real implementation, update database
    const updatedItem: FeeItem = {
      ...existingItem,
      name: name?.trim() || existingItem.name,
      code: code?.trim().toUpperCase() || existingItem.code,
      type: type || existingItem.type,
      amount: amount !== undefined ? Number(amount) : existingItem.amount,
      semester: semester || existingItem.semester,
      status: status || existingItem.status
    }

    // In real implementation, save to database
    return NextResponse.json({
      success: true,
      data: updatedItem
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update fee item'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/fee-items/[id] - Delete a fee item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify fee item exists
    const existingItem = await getFeeItemById(id)
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Fee item not found' },
        { status: 404 }
      )
    }

    // Mock delete - in real implementation, delete from database
    // Check if fee item is in use before allowing deletion
    // For now, just return success

    return NextResponse.json({
      success: true,
      message: 'Fee item deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete fee item'
      },
      { status: 500 }
    )
  }
}
