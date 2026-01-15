import { NextResponse } from 'next/server'
import { type Class } from '@/lib/mock-data'

// Mock data
const mockClasses: Class[] = [
  { id: '1', name: '10A1', grade: '10', teacher: 'Nguyễn Văn A', studentCount: 30, room: '101' },
  { id: '2', name: '10A2', grade: '10', teacher: 'Trần Thị B', studentCount: 28, room: '102' },
  { id: '3', name: '10A3', grade: '10', teacher: 'Lê Văn C', studentCount: 32, room: '103' },
  { id: '4', name: '11A1', grade: '11', teacher: 'Phạm Thị D', studentCount: 25, room: '201' },
  { id: '5', name: '11A2', grade: '11', teacher: 'Hoàng Văn E', studentCount: 27, room: '202' },
  { id: '6', name: '12A1', grade: '12', teacher: 'Đỗ Thị F', studentCount: 30, room: '301' },
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
