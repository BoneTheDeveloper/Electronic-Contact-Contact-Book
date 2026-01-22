import { NextResponse } from 'next/server'

interface GradeRecord {
  id: string
  studentName: string
  classId: string
  subject: string
  midterm: number
  final: number
  average: number
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'
}

// Mock data - Middle school grades 6-9 (THCS)
const mockGrades: GradeRecord[] = [
  { id: '1', studentName: 'Nguyễn Văn An', classId: '6A1', subject: 'Toán', midterm: 8.5, final: 9.0, average: 8.8, letterGrade: 'A' },
  { id: '2', studentName: 'Trần Thị Bình', classId: '6A1', subject: 'Toán', midterm: 7.5, final: 8.0, average: 7.8, letterGrade: 'B' },
  { id: '3', studentName: 'Lê Văn Cường', classId: '6A1', subject: 'Toán', midterm: 6.5, final: 7.0, average: 6.8, letterGrade: 'C' },
  { id: '4', studentName: 'Phạm Thị Dung', classId: '6A1', subject: 'Toán', midterm: 5.5, final: 6.0, average: 5.8, letterGrade: 'C' },
  { id: '5', studentName: 'Hoàng Văn Em', classId: '6A2', subject: 'Toán', midterm: 9.0, final: 9.5, average: 9.3, letterGrade: 'A' },
  { id: '6', studentName: 'Đỗ Thị Gái', classId: '6A2', subject: 'Toán', midterm: 8.0, final: 8.5, average: 8.3, letterGrade: 'A' },
  { id: '7', studentName: 'Vũ Văn Hùng', classId: '6A2', subject: 'Toán', midterm: 4.5, final: 5.0, average: 4.8, letterGrade: 'D' },
  { id: '8', studentName: 'Ngô Thị Hoa', classId: '6A3', subject: 'Toán', midterm: 3.5, final: 4.0, average: 3.8, letterGrade: 'F' },
  { id: '9', studentName: 'Nguyễn Văn An', classId: '6A1', subject: 'Văn', midterm: 7.0, final: 7.5, average: 7.3, letterGrade: 'B' },
  { id: '10', studentName: 'Trần Thị Bình', classId: '6A1', subject: 'Văn', midterm: 8.0, final: 8.5, average: 8.3, letterGrade: 'A' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId')
  const subject = searchParams.get('subject')
  const letterGrade = searchParams.get('letterGrade')
  const search = searchParams.get('search')

  let filteredGrades = [...mockGrades]

  if (classId) {
    filteredGrades = filteredGrades.filter(g => g.classId === classId)
  }
  if (subject) {
    filteredGrades = filteredGrades.filter(g => g.subject === subject)
  }
  if (letterGrade) {
    filteredGrades = filteredGrades.filter(g => g.letterGrade === letterGrade)
  }
  if (search) {
    filteredGrades = filteredGrades.filter(g =>
      g.studentName.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Calculate statistics
  const stats = {
    totalStudents: filteredGrades.length,
    averageScore: filteredGrades.reduce((sum, g) => sum + g.average, 0) / filteredGrades.length || 0,
    gradeA: filteredGrades.filter(g => g.letterGrade === 'A').length,
    gradeB: filteredGrades.filter(g => g.letterGrade === 'B').length,
    gradeC: filteredGrades.filter(g => g.letterGrade === 'C').length,
    gradeD: filteredGrades.filter(g => g.letterGrade === 'D').length,
    gradeF: filteredGrades.filter(g => g.letterGrade === 'F').length,
  }

  return NextResponse.json({
    success: true,
    data: filteredGrades,
    stats,
    total: filteredGrades.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Validate classId is for grades 6-9
  if (body.classId) {
    const gradeMatch = body.classId.match(/^(\d+)/)
    if (gradeMatch) {
      const grade = gradeMatch[1]
      if (!['6', '7', '8', '9'].includes(grade)) {
        return NextResponse.json({
          success: false,
          message: 'Khối lớp không hợp lệ (chỉ hỗ trợ lớp 6-9)',
        }, { status: 400 })
      }
    }
  }

  // Calculate average and letter grade
  const average = (body.midterm + body.final) / 2
  let letterGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'
  if (average >= 9) letterGrade = 'A'
  else if (average >= 8) letterGrade = 'B'
  else if (average >= 7) letterGrade = 'C'
  else if (average >= 5) letterGrade = 'D'

  const newGrade: GradeRecord = {
    id: Date.now().toString(),
    ...body,
    average,
    letterGrade,
  }
  mockGrades.push(newGrade)

  return NextResponse.json({
    success: true,
    data: newGrade,
    message: 'Điểm số đã được ghi nhận',
  }, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, midterm, final, ...updates } = body

  const index = mockGrades.findIndex(g => g.id === id)
  if (index === -1) {
    return NextResponse.json({
      success: false,
      message: 'Không tìm thấy bản ghi điểm số',
    }, { status: 404 })
  }

  // Recalculate average and letter grade
  const avg = ((midterm ?? mockGrades[index].midterm) + (final ?? mockGrades[index].final)) / 2
  let letterGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'
  if (avg >= 9) letterGrade = 'A'
  else if (avg >= 8) letterGrade = 'B'
  else if (avg >= 7) letterGrade = 'C'
  else if (avg >= 5) letterGrade = 'D'

  mockGrades[index] = {
    ...mockGrades[index],
    ...updates,
    ...(midterm !== undefined && { midterm }),
    ...(final !== undefined && { final }),
    average: avg,
    letterGrade,
  }

  return NextResponse.json({
    success: true,
    data: mockGrades[index],
    message: 'Cập nhật điểm số thành công',
  })
}
