import { NextResponse } from 'next/server'
import { type Class } from '@/lib/mock-data'

// Mock data - Middle school grades 6-9 (THCS)
const mockClasses: Class[] = [
  { id: '1', name: '6A1', grade: '6', teacher: 'Nguyễn Văn A', studentCount: 30, room: '101' },
  { id: '2', name: '6A2', grade: '6', teacher: 'Trần Thị B', studentCount: 28, room: '102' },
  { id: '3', name: '6A3', grade: '6', teacher: 'Lê Văn C', studentCount: 32, room: '103' },
  { id: '4', name: '7A1', grade: '7', teacher: 'Phạm Thị D', studentCount: 25, room: '201' },
  { id: '5', name: '7A2', grade: '7', teacher: 'Hoàng Văn E', studentCount: 27, room: '202' },
  { id: '6', name: '8A1', grade: '8', teacher: 'Đỗ Thị F', studentCount: 30, room: '301' },
  { id: '7', name: '9A1', grade: '9', teacher: 'Vũ Văn G', studentCount: 26, room: '401' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const grade = searchParams.get('grade')
  const teacher = searchParams.get('teacher')

  let filteredClasses = [...mockClasses]

  if (grade) {
    filteredClasses = filteredClasses.filter(c => c.grade === grade)
  }
  if (teacher) {
    filteredClasses = filteredClasses.filter(c => c.teacher.includes(teacher))
  }

  return NextResponse.json({
    success: true,
    data: filteredClasses,
    total: filteredClasses.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newClass: Class = {
    id: Date.now().toString(),
    ...body,
    studentCount: 0,
  }
  mockClasses.push(newClass)

  return NextResponse.json({
    success: true,
    data: newClass,
    message: 'Lớp học đã được tạo thành công',
  }, { status: 201 })
}
