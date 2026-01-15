import { NextResponse } from 'next/server'
import { type User } from '@/lib/mock-data'

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@econtact.vn', role: 'admin', status: 'active' },
  { id: '2', name: 'Nguyễn Văn A', email: 'gv001@econtact.vn', role: 'teacher', status: 'active', classId: '10A1' },
  { id: '3', name: 'Trần Thị B', email: 'gv002@econtact.vn', role: 'teacher', status: 'active', classId: '10A2' },
  { id: '4', name: 'Lê Văn C', email: 'ph001@econtact.vn', role: 'parent', status: 'active', classId: '10A1' },
  { id: '5', name: 'Phạm Thị D', email: 'ph002@econtact.vn', role: 'parent', status: 'inactive', classId: '10A2' },
  { id: '6', name: 'Hoàng Văn E', email: 'hs001@econtact.vn', role: 'student', status: 'active', classId: '10A1' },
  { id: '7', name: 'Đỗ Thị F', email: 'hs002@econtact.vn', role: 'student', status: 'active', classId: '10A2' },
  { id: '8', name: 'Vũ Văn G', email: 'hs003@econtact.vn', role: 'student', status: 'active', classId: '10A3' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const classId = searchParams.get('classId')

  let filteredUsers = [...mockUsers]

  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role)
  }
  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status)
  }
  if (classId) {
    filteredUsers = filteredUsers.filter(u => u.classId === classId)
  }
  if (search) {
    filteredUsers = filteredUsers.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredUsers,
    total: filteredUsers.length,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newUser: User = {
    id: Date.now().toString(),
    ...body,
    status: 'active',
  }
  mockUsers.push(newUser)

  return NextResponse.json({
    success: true,
    data: newUser,
    message: 'Người dùng đã được tạo thành công',
  }, { status: 201 })
}
