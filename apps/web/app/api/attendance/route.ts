import { NextResponse } from 'next/server'

interface AttendanceRecord {
  id: string
  studentCode: string
  studentName: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

// Mock data - using REAL student codes, names, and classes from Supabase database
// Only showing: Đi muộn (late), Vắng mặt (absent), Có phép (excused)
const mockAttendance: AttendanceRecord[] = [
  // Khối 6A - Đi muộn (real students from DB)
  { id: '1', studentCode: 'ST20260575', studentName: 'Nguyễn Văn An', classId: '6A', date: '25/01/2026', status: 'late', notes: 'Đi muộn 10 phút' },
  { id: '2', studentCode: 'ST20260576', studentName: 'Trần Thị Bình', classId: '6A', date: '25/01/2026', status: 'late', notes: 'Kẹt xe' },
  { id: '3', studentCode: 'ST20260577', studentName: 'Lê Văn Cường', classId: '6A', date: '25/01/2026', status: 'late', notes: 'Đi muộn 15 phút' },
  { id: '4', studentCode: 'ST20260578', studentName: 'Phạm Thị Dung', classId: '6A', date: '25/01/2026', status: 'late', notes: 'Xe hỏng' },

  // Khối 6A - Vắng mặt
  { id: '5', studentCode: 'ST20260579', studentName: 'Hoàng Văn Em', classId: '6A', date: '25/01/2026', status: 'absent', notes: 'Không có lý do' },
  { id: '6', studentCode: 'ST20260580', studentName: 'Võ Thị Gái', classId: '6A', date: '25/01/2026', status: 'absent', notes: 'Ốm đau' },
  { id: '7', studentCode: 'ST20260581', studentName: 'Ngô Văn Hùng', classId: '6A', date: '25/01/2026', status: 'absent', notes: 'Việc gia đình' },

  // Khối 6A - Có phép
  { id: '8', studentCode: 'ST20260582', studentName: 'Đặng Thị Lan', classId: '6A', date: '25/01/2026', status: 'excused', notes: 'Có phép gia đình' },
  { id: '9', studentCode: 'ST20260583', studentName: 'Dương Văn Minh', classId: '6A', date: '25/01/2026', status: 'excused', notes: 'Đi lễ' },

  // Khối 7B - Real students from DB
  { id: '10', studentCode: 'ST20260007', studentName: 'Nguyễn Thị Gái', classId: '7B', date: '25/01/2026', status: 'late', notes: 'Đi muộn 5 phút' },
  { id: '11', studentCode: 'ST20260012', studentName: 'Dương Văn Thành', classId: '7B', date: '25/01/2026', status: 'absent', notes: 'Không lý do' },
  { id: '12', studentCode: 'ST20260017', studentName: 'Trần Thị Lan', classId: '7B', date: '25/01/2026', status: 'excused', notes: 'Có phép' },
  { id: '13', studentCode: 'ST20260022', studentName: 'Vũ Thị Bình', classId: '7B', date: '25/01/2026', status: 'late', notes: 'Đi muộn 20 phút' },
  { id: '14', studentCode: 'ST20260027', studentName: 'Nguyễn Văn Em', classId: '7B', date: '25/01/2026', status: 'absent', notes: 'Ốm' },

  // Khối 8C - Real students from DB
  { id: '15', studentCode: 'ST20260008', studentName: 'Phan Thị Lan', classId: '8C', date: '25/01/2026', status: 'excused', notes: 'Đi đám tang' },
  { id: '16', studentCode: 'ST20260013', studentName: 'Vũ Thị Sương', classId: '8C', date: '25/01/2026', status: 'late', notes: 'Kẹt xe' },
  { id: '17', studentCode: 'ST20260018', studentName: 'Dương Thị Bình', classId: '8C', date: '25/01/2026', status: 'absent', notes: 'Không có phép' },
  { id: '18', studentCode: 'ST20260023', studentName: 'Hồ Thị Bình', classId: '8C', date: '25/01/2026', status: 'excused', notes: 'Việc gia đình' },
  { id: '19', studentCode: 'ST20260028', studentName: 'Dương Vân Rạng', classId: '8C', date: '25/01/2026', status: 'late', notes: 'Đi muộn 12 phút' },

  // Khối 9A - Real students from DB
  { id: '20', studentCode: 'ST20260001', studentName: 'Đỗ Thị Bình', classId: '9A', date: '25/01/2026', status: 'absent', notes: 'Không lý do' },
  { id: '21', studentCode: 'ST20260004', studentName: 'Hồ Văn Em', classId: '9A', date: '25/01/2026', status: 'excused', notes: 'Có phép' },
  { id: '22', studentCode: 'ST20260009', studentName: 'Đỗ Văn Cường', classId: '9A', date: '25/01/2026', status: 'late', notes: 'Đi muộn 8 phút' },
  { id: '23', studentCode: 'ST20260014', studentName: 'Dương Thị Gái', classId: '9A', date: '25/01/2026', status: 'absent', notes: 'Ốm đau' },
  { id: '24', studentCode: 'ST20260019', studentName: 'Trần Vân Rạng', classId: '9A', date: '25/01/2026', status: 'excused', notes: 'Đi khám bệnh' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const status = searchParams.get('status')
  const date = searchParams.get('date')
  const search = searchParams.get('search')

  let filteredAttendance = [...mockAttendance]

  if (classId) {
    filteredAttendance = filteredAttendance.filter((a: AttendanceRecord) => a.classId === classId)
  }
  if (status) {
    filteredAttendance = filteredAttendance.filter((a: AttendanceRecord) => a.status === status)
  }
  if (search) {
    filteredAttendance = filteredAttendance.filter((a: AttendanceRecord) =>
      a.studentName.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Calculate statistics (only issues: absent, late, excused)
  const stats = {
    total: filteredAttendance.length,
    absent: filteredAttendance.filter((a: AttendanceRecord) => a.status === 'absent').length,
    late: filteredAttendance.filter((a: AttendanceRecord) => a.status === 'late').length,
    excused: filteredAttendance.filter((a: AttendanceRecord) => a.status === 'excused').length,
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

interface AttendanceUpdate {
  id: string
  studentName?: string
  classId?: string
  date?: string
  status?: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export async function PATCH(request: Request) {
  const body = await request.json() as AttendanceUpdate
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
