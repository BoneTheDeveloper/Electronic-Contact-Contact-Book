import { NextResponse } from 'next/server'
import { type Invoice } from '@/lib/mock-data'

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    studentId: '1',
    studentName: 'Nguyễn Văn An',
    amount: 5000000,
    status: 'paid',
    dueDate: '15/01/2026',
    paidDate: '10/01/2026',
  },
  {
    id: 'INV-002',
    studentId: '2',
    studentName: 'Trần Thị Bình',
    amount: 5000000,
    status: 'paid',
    dueDate: '15/01/2026',
    paidDate: '12/01/2026',
  },
  {
    id: 'INV-003',
    studentId: '3',
    studentName: 'Lê Văn Cường',
    amount: 5000000,
    status: 'pending',
    dueDate: '20/01/2026',
  },
  {
    id: 'INV-004',
    studentId: '4',
    studentName: 'Phạm Thị Dung',
    amount: 5000000,
    status: 'overdue',
    dueDate: '10/01/2026',
  },
  {
    id: 'INV-005',
    studentId: '5',
    studentName: 'Hoàng Văn Em',
    amount: 5000000,
    status: 'paid',
    dueDate: '15/01/2026',
    paidDate: '08/01/2026',
  },
  {
    id: 'INV-006',
    studentId: '6',
    studentName: 'Đỗ Thị Gái',
    amount: 5000000,
    status: 'pending',
    dueDate: '25/01/2026',
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let filteredInvoices = [...mockInvoices]

  if (status) {
    filteredInvoices = filteredInvoices.filter(i => i.status === status)
  }
  if (search) {
    filteredInvoices = filteredInvoices.filter(i =>
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Calculate statistics
  const totalAmount = filteredInvoices.reduce((sum, i) => sum + i.amount, 0)
  const collectedAmount = filteredInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0)
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  const stats = {
    totalAmount,
    collectedAmount,
    pendingCount: filteredInvoices.filter(i => i.status === 'pending').length,
    overdueCount: filteredInvoices.filter(i => i.status === 'overdue').length,
    collectionRate,
  }

  return NextResponse.json({
    success: true,
    data: filteredInvoices,
    stats,
    total: filteredInvoices.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newInvoice: Invoice = {
    id: `INV-${Date.now().toString().slice(-6)}`,
    ...body,
    status: 'pending',
  }
  mockInvoices.push(newInvoice)

  return NextResponse.json({
    success: true,
    data: newInvoice,
    message: 'Hóa đơn đã được tạo thành công',
  }, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body

  const index = mockInvoices.findIndex(i => i.id === id)
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: 'Không tìm thấy hóa đơn',
    }, { status: 404 })
  }

  mockInvoices[index] = { ...mockInvoices[index], ...updates }

  return NextResponse.json({
    success: true,
    data: mockInvoices[index],
    message: 'Cập nhật hóa đơn thành công',
  })
}
