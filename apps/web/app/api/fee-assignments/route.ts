import { NextRequest, NextResponse } from 'next/server'
import { getFeeAssignments, createFeeAssignment, FEE_ITEMS } from '@/lib/mock-data'

// GET /api/fee-assignments - List all fee assignments
export async function GET(request: NextRequest) {
  try {
    const assignments = await getFeeAssignments()

    // Enrich assignments with fee item details
    const enrichedAssignments = assignments.map(assignment => ({
      ...assignment,
      feeItemDetails: assignment.feeItems.map(feeId => {
        const fee = FEE_ITEMS.find(f => f.id === feeId)
        return fee || { id: feeId, name: 'Unknown', amount: 0 }
      })
    }))

    return NextResponse.json({
      success: true,
      data: enrichedAssignments
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee assignments'
      },
      { status: 500 }
    )
  }
}

// POST /api/fee-assignments - Create a new fee assignment (wizard flow)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      targetGrades,
      targetClasses,
      feeItems,
      startDate,
      dueDate,
      reminderDays,
      reminderFrequency
    } = body

    // Validation - Required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing assignment name' },
        { status: 400 }
      )
    }

    if (!targetClasses || !Array.isArray(targetClasses) || targetClasses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing target classes (must be a non-empty array)' },
        { status: 400 }
      )
    }

    if (!feeItems || !Array.isArray(feeItems) || feeItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing fee items (must be a non-empty array)' },
        { status: 400 }
      )
    }

    // Validate fee items exist
    const validFeeItems = feeItems.filter((id: string) => FEE_ITEMS.some(f => f.id === id))
    if (validFeeItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fee items provided' },
        { status: 400 }
      )
    }

    // Validate dates
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { success: false, error: 'Invalid start date format' },
        { status: 400 }
      )
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
      return NextResponse.json(
        { success: false, error: 'Invalid due date format' },
        { status: 400 }
      )
    }

    // Validate reminder frequency
    if (reminderFrequency && !['once', 'daily', 'weekly'].includes(reminderFrequency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reminder frequency (must be once, daily, or weekly)' },
        { status: 400 }
      )
    }

    // Create assignment
    const assignment = await createFeeAssignment({
      name: name.trim(),
      targetGrades: targetGrades || [],
      targetClasses,
      feeItems: validFeeItems,
      startDate: startDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || '',
      reminderDays: reminderDays || 7,
      reminderFrequency: reminderFrequency || 'weekly',
      status: 'draft'
    })

    return NextResponse.json({
      success: true,
      data: assignment
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create fee assignment'
      },
      { status: 500 }
    )
  }
}
