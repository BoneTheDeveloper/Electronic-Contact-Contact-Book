import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, sanitizeInput, checkRateLimit } from '@/lib/security-utils'

// Payment interface
interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
  method?: string
  note?: string
}

// Mock payment data (in real app, fetch from database)
const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    studentId: '1',
    studentName: 'Nguyễn Văn An',
    amount: 2500000,
    status: 'pending',
    dueDate: '2025-10-15'
  },
  {
    id: 'PAY-002',
    studentId: '2',
    studentName: 'Trần Thị Bình',
    amount: 2500000,
    status: 'paid',
    dueDate: '2025-10-15',
    paidDate: '2025-10-12',
    method: 'transfer'
  },
  {
    id: 'PAY-003',
    studentId: '3',
    studentName: 'Lê Văn Cường',
    amount: 2500000,
    status: 'overdue',
    dueDate: '2025-09-30'
  }
]

// POST /api/payments/[id]/confirm - Confirm payment receipt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // TODO: Add real authentication middleware before production
  // const { user } = await getCurrentUser(request)
  // if (!user || user.role !== 'admin') {
  //   return NextResponse.json(
  //     { success: false, error: 'Unauthorized' },
  //     { status: 401 }
  //   )
  // }

  // TODO: Add real rate limiting before production
  // const rateLimit = await checkRateLimit(request, { windowMs: 60000, maxRequests: 10 })
  // if (!rateLimit.allowed) {
  //   return NextResponse.json(
  //     { error: rateLimit.error },
  //     { status: 429 }
  //   )
  // }

  try {
    const { id } = await params
    const body = await request.json()
    const { amount, note, method = 'cash' } = body

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing amount' },
        { status: 400 }
      )
    }

    // Validate method
    if (!['cash', 'transfer', 'card'].includes(method)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Find payment
    const paymentIndex = mockPayments.findIndex(p => p.id === id)
    if (paymentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    const payment = mockPayments[paymentIndex]

    // Check if already paid
    if (payment.status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment already confirmed' },
        { status: 400 }
      )
    }

    // Update payment status
    const updatedPayment: Payment = {
      ...payment,
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
      amount: amount || payment.amount,
      method,
      note: note ? sanitizeInput(note) : ''
    }

    mockPayments[paymentIndex] = updatedPayment

    // TODO: Real API - Save to database and update invoice status

    return NextResponse.json({
      success: true,
      data: updatedPayment,
      message: 'Xác nhận thanh toán thành công'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm payment'
      },
      { status: 500 }
    )
  }
}
