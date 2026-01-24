import { NextRequest, NextResponse } from 'next/server'
import { getFeeAssignments, getFeeItems } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server'
import type { FeeAssignment } from '@/lib/types'
import type { Database } from '@/types/supabase'

// Type alias for fee_assignments insert to avoid TypeScript tuple interpretation
type FeeAssignmentsInsert = Database['public']['Tables']['fee_assignments']['Insert']
type FeeAssignmentsRow = Database['public']['Tables']['fee_assignments']['Row']

// GET /api/fee-assignments - List all fee assignments
export async function GET(request: NextRequest) {
  try {
    const assignments = await getFeeAssignments()
    const feeItems = await getFeeItems()

    // Enrich assignments with fee item details
    const enrichedAssignments = assignments.map((assignment: FeeAssignment) => ({
      ...assignment,
      feeItemDetails: assignment.feeItems.map((feeId: string) => {
        const fee = feeItems.find((f: { id: string }) => f.id === feeId)
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
    const allFeeItems = await getFeeItems()
    const validFeeItems = feeItems.filter((id: string) => allFeeItems.some((f: { id: string }) => f.id === id))
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

    // Calculate total students and amount
    const totalStudents = targetClasses.length * 35 // Average 35 students per class
    const feeItemsTotal = allFeeItems
      .filter((f: { id: string }) => validFeeItems.includes(f.id))
      .reduce((sum: number, f: { amount: number }) => sum + f.amount, 0)
    const totalAmount = feeItemsTotal * totalStudents

    // Insert into Supabase
    const supabase = await createClient()

    // Validate due_date is provided (NOT NULL column)
    const finalDueDate: string = dueDate || startDate || new Date().toISOString().split('T')[0]
    if (!finalDueDate) {
      return NextResponse.json(
        { success: false, error: 'Due date is required' },
        { status: 400 }
      )
    }

    const startDateValue: string = startDate || new Date().toISOString().split('T')[0]

    // Build insert object matching Supabase Insert type
    const insertData: FeeAssignmentsInsert = {
      id: crypto.randomUUID(),
      name: name.trim(),
      target_grades: (targetGrades?.length ? targetGrades : null),
      target_classes: targetClasses,
      fee_items: validFeeItems,
      start_date: startDateValue,
      due_date: finalDueDate,
    }

    const { data, error } = await supabase
      .from('fee_assignments' as const)
      .insert(insertData as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
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
