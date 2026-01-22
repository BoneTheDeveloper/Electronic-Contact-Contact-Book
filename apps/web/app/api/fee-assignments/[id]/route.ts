import { NextRequest, NextResponse } from 'next/server'
import { getFeeAssignmentById, FEE_ITEMS } from '@/lib/mock-data'

// GET /api/fee-assignments/[id] - Get a specific fee assignment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const assignment = await getFeeAssignmentById(id)

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: 'Fee assignment not found' },
        { status: 404 }
      )
    }

    // Enrich with fee item details
    const enrichedAssignment = {
      ...assignment,
      feeItemDetails: assignment.feeItems.map(feeId => {
        const fee = FEE_ITEMS.find(f => f.id === feeId)
        return fee || { id: feeId, name: 'Unknown', amount: 0 }
      })
    }

    return NextResponse.json({
      success: true,
      data: enrichedAssignment
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fee assignment'
      },
      { status: 500 }
    )
  }
}

// PUT /api/fee-assignments/[id] - Update a fee assignment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      targetGrades,
      targetClasses,
      feeItems,
      startDate,
      dueDate,
      reminderDays,
      reminderFrequency,
      status
    } = body

    // Verify assignment exists
    const existingAssignment = await getFeeAssignmentById(id)
    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: 'Fee assignment not found' },
        { status: 404 }
      )
    }

    // Validation for status field
    if (status && !['draft', 'published', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status (must be draft, published, or closed)' },
        { status: 400 }
      )
    }

    // Validation for reminder frequency
    if (reminderFrequency && !['once', 'daily', 'weekly'].includes(reminderFrequency)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reminder frequency (must be once, daily, or weekly)' },
        { status: 400 }
      )
    }

    // Mock update - in real implementation, update database
    const updatedAssignment = {
      ...existingAssignment,
      name: name?.trim() || existingAssignment.name,
      targetGrades: targetGrades || existingAssignment.targetGrades,
      targetClasses: targetClasses || existingAssignment.targetClasses,
      feeItems: feeItems || existingAssignment.feeItems,
      startDate: startDate || existingAssignment.startDate,
      dueDate: dueDate || existingAssignment.dueDate,
      reminderDays: reminderDays !== undefined ? Number(reminderDays) : existingAssignment.reminderDays,
      reminderFrequency: reminderFrequency || existingAssignment.reminderFrequency,
      status: status || existingAssignment.status
    }

    // In real implementation, save to database
    return NextResponse.json({
      success: true,
      data: updatedAssignment
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update fee assignment'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/fee-assignments/[id] - Delete a fee assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify assignment exists
    const existingAssignment = await getFeeAssignmentById(id)
    if (!existingAssignment) {
      return NextResponse.json(
        { success: false, error: 'Fee assignment not found' },
        { status: 404 }
      )
    }

    // Check if assignment is published (prevent deletion of published assignments)
    if (existingAssignment.status === 'published') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete published assignment. Please close it first.' },
        { status: 400 }
      )
    }

    // Mock delete - in real implementation, delete from database
    return NextResponse.json({
      success: true,
      message: 'Fee assignment deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete fee assignment'
      },
      { status: 500 }
    )
  }
}
