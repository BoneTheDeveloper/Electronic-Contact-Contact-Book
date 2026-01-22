import { NextResponse } from 'next/server'
import type { Notification } from '@/lib/types'

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Họp phụ huynh',
    message: 'Họp phụ huynh cuối kỳ sẽ diễn ra vào ngày 20/10/2025',
    type: 'info',
    targetRole: 'parent',
    createdAt: '2025-10-10',
  },
  {
    id: '2',
    title: 'Nghỉ lễ',
    message: 'Nhà trường đóng cửa từ 30/10 đến 02/11 dịp lễ',
    type: 'warning',
    targetRole: 'all',
    createdAt: '2025-10-08',
  },
  {
    id: '3',
    title: 'Kết quả học kỳ',
    message: 'Kết quả học kỳ I đã được cập nhật',
    type: 'success',
    targetRole: 'student',
    createdAt: '2025-10-05',
  },
  {
    id: '4',
    title: 'Thông báo thu học phí',
    message: 'Deadline nộp học phí kỳ II là 15/10/2025',
    type: 'error',
    targetRole: 'parent',
    createdAt: '2025-10-01',
  },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockNotifications,
    total: mockNotifications.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newNotification: Notification = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString().split('T')[0],
  }
  mockNotifications.push(newNotification)

  return NextResponse.json({
    success: true,
    data: newNotification,
    message: 'Thông báo đã được gửi thành công',
  }, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({
      success: false,
      message: 'Thiếu ID thông báo',
    }, { status: 400 })
  }

  const index = mockNotifications.findIndex(n => n.id === id)
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: 'Không tìm thấy thông báo',
    }, { status: 404 })
  }

  mockNotifications.splice(index, 1)

  return NextResponse.json({
    success: true,
    message: 'Thông báo đã được xóa thành công',
  })
}
