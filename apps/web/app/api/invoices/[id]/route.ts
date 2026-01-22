import { NextRequest, NextResponse } from 'next/server'
import { getInvoices, type Invoice } from '@/lib/mock-data'

// GET /api/invoices/[id] - Get a specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invoices = await getInvoices()
    const invoice = invoices.find((inv: Invoice) => inv.id === id)

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoice'
      },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice (e.g., confirm payment)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, paidDate, notes } = body

    // Verify invoice exists
    const invoices = await getInvoices()
    const existingInvoice = invoices.find((inv: Invoice) => inv.id === id)

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Validation for status field
    if (status && !['paid', 'pending', 'overdue'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status (must be paid, pending, or overdue)' },
        { status: 400 }
      )
    }

    // If marking as paid, require paidDate
    if (status === 'paid' && !paidDate) {
      return NextResponse.json(
        { success: false, error: 'paidDate is required when marking invoice as paid' },
        { status: 400 }
      )
    }

    // Mock update - in real implementation, update database
    const updatedInvoice: Invoice = {
      ...existingInvoice,
      status: status || existingInvoice.status,
      paidDate: status === 'paid' ? (paidDate || new Date().toISOString().split('T')[0]) : existingInvoice.paidDate
    }

    // In real implementation, save to database and log payment confirmation
    return NextResponse.json({
      success: true,
      data: updatedInvoice,
      message: status === 'paid' ? 'Payment confirmed successfully' : 'Invoice updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update invoice'
      },
      { status: 500 }
    )
  }
}
