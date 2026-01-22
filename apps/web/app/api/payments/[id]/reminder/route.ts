import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkRateLimit } from '@/lib/security-utils'

// Payment interface
interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
  parentEmail?: string
  parentPhone?: string
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    studentId: '1',
    studentName: 'Nguyễn Văn An',
    amount: 2500000,
    status: 'pending',
    dueDate: '2025-10-15',
    parentEmail: 'parent1@school.vn',
    parentPhone: '0901234567'
  },
  {
    id: 'PAY-002',
    studentId: '2',
    studentName: 'Trần Thị Bình',
    amount: 2500000,
    status: 'paid',
    dueDate: '2025-10-15',
    paidDate: '2025-10-12'
  },
  {
    id: 'PAY-003',
    studentId: '3',
    studentName: 'Lê Văn Cường',
    amount: 2500000,
    status: 'overdue',
    dueDate: '2025-09-30',
    parentEmail: 'parent3@school.vn',
    parentPhone: '0909876543'
  }
]

// POST /api/payments/[id]/reminder - Send payment reminder
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
    const { method = 'email' } = body // 'email', 'sms', or 'both'

    // Validate method
    if (!['email', 'sms', 'both'].includes(method)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reminder method (must be email, sms, or both)' },
        { status: 400 }
      )
    }

    // Find payment
    const payment = mockPayments.find(p => p.id === id)
    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Check if already paid
    if (payment.status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment already paid, no reminder needed' },
        { status: 400 }
      )
    }

    // Prepare reminder details
    const reminderDetails = {
      paymentId: payment.id,
      studentName: payment.studentName,
      amount: payment.amount,
      dueDate: payment.dueDate,
      status: payment.status,
      method,
      sentAt: new Date().toISOString()
    }

    // TODO: Real API - Send actual email/SMS
    // Email template would include:
    // - Student name
    // - Amount due
    // - Due date
    // - Payment methods
    // - Contact info

    // TODO: Real API - Log reminder in database
    const reminderLog = {
      id: `reminder-${Date.now()}`,
      ...reminderDetails,
      // In production, store parent contact info securely
      recipientEmail: method === 'email' || method === 'both' ? payment.parentEmail : undefined,
      recipientPhone: method === 'sms' || method === 'both' ? payment.parentPhone : undefined
    }

    return NextResponse.json({
      success: true,
      data: reminderLog,
      message: method === 'both'
        ? 'Đã gửi nhắc nhở qua email và SMS'
        : method === 'email'
        ? 'Đã gửi nhắc nhở qua email'
        : 'Đã gửi nhắc nhở qua SMS'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reminder'
      },
      { status: 500 }
    )
  }
}
