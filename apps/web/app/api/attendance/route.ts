import { NextResponse } from 'next/server'

interface AttendanceRecord {
  id: string
  studentName: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

// Mock data
const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentName: 'Nguyễn Văn An', classId: '10A1', date: '15/01/2026', status: 'present' },
  { id: '2', studentName: 'Trần Thị Bình', classId: '10A1', date: '15/01/2026', status: 'present' },
  { id: '3', studentName: 'Lê Văn Cường', classId: '10A1', date: '15/01/2026', status: 'late', notes: 'Đi muộn 15 phút' },
  { id: '4', studentName: 'Phạm Thị Dung', classId: '10A1', date: '15/01/2026', status: 'absent', notes: 'Ốm đau' },
  { id: '5', studentName: 'Hoàng Văn Em', classId: '10A2', date: '15/01/2026', status: 'present' },
  { id: '6', studentName: 'Đỗ Thị Gái', classId: '10A2', date: '15/01/2026', status: 'excused', notes: 'Có phép gia đình' },
  { id: '7', studentName: 'Vũ Văn Hùng', classId: '10A2', date: '15/01/2026', status: 'present' },
  { id: '8', studentName: 'Ngô Thị Hoa', classId: '10A3', date: '15/01/2026', status: 'present' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const status = searchParams.get('status')
  const date = searchParams.get('date')
  const search = searchParams.get('search')

  let filteredAttendance = [...mockAttendance]

  if (classId) {
    filteredAttendance = filteredAttendance.filter(a => a.classId === classId)
  }
  if (status) {
    filteredAttendance = filteredAttendance.filter(a => a.status === status)
  }
  if (search) {
    filteredAttendance = filteredAttendance.filter(a =>
      a.studentName.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Calculate statistics
  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter(a => a.status === 'present').length,
    absent: filteredAttendance.filter(a => a.status === 'absent').length,
    late: filteredAttendance.filter(a => a.status === 'late').length,
    excused: filteredAttendance.filter(a => a.status === 'excused').length,
    rate: filteredAttendance.length > 0
      ? Math.round((filteredAttendance.filter(a => a.status === 'present').length / filteredAttendance.length) * 100)
      : 0,
  }

  return NextResponse.json({
    success: true,
    data: filteredAttendance,
    stats,
    total: filteredAttendance.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newRecord: AttendanceRecord = {
    id: Date.now().toString(),
    ...body,
  }
  mockAttendance.push(newRecord)

  return NextResponse.json({
    success: true,
    data: newRecord,
    message: 'Điểm danh đã được ghi nhận',
  }, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body

  const index = mockAttendance.findIndex(a => a.id === id)
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: 'Không tìm thấy bản ghi điểm danh',
    }, { status: 404 })
  }

  mockAttendance[index] = { ...mockAttendance[index], ...updates }

  return NextResponse.json({
    success: true,
    data: mockAttendance[index],
    message: 'Cập nhật điểm danh thành công',
  })
}
