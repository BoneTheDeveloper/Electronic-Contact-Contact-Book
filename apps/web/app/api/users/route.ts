import { NextResponse } from 'next/server'
import { type User } from '@/lib/mock-data'
import { getCurrentUser, sanitizeSearch, sanitizeInput, checkRateLimit } from '@/lib/security-utils'

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
  // TODO: Add real authentication middleware before production
  // const { user } = await getCurrentUser(request)
  // if (!user || user.role !== 'admin') {
  //   return NextResponse.json(
  //     { success: false, error: 'Unauthorized' },
  //     { status: 401 }
  //   )
  // }

  // TODO: Add real rate limiting before production
  // const rateLimit = await checkRateLimit(request, { windowMs: 60000, maxRequests: 100 })
  // if (!rateLimit.allowed) {
  //   return NextResponse.json(
  //     { error: rateLimit.error },
  //     { status: 429 }
  //   )
  // }

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
    // Sanitize search input to prevent injection attacks
    const sanitized = sanitizeSearch(search)
    filteredUsers = filteredUsers.filter(u =>
      u.name.toLowerCase().includes(sanitized.toLowerCase()) ||
      u.email.toLowerCase().includes(sanitized.toLowerCase())
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredUsers,
    total: filteredUsers.length,
  })
}

export async function POST(request: Request) {
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

  const body = await request.json()

  // Sanitize user input
  const sanitizedName = sanitizeInput(body.name || '')
  const sanitizedEmail = sanitizeInput(body.email || '')

  if (!sanitizedName || !sanitizedEmail) {
    return NextResponse.json(
      { success: false, error: 'Tên và email không được để trống' },
      { status: 400 }
    )
  }

  const newUser: User = {
    id: Date.now().toString(),
    ...body,
    name: sanitizedName,
    email: sanitizedEmail,
    status: 'active',
  }
  mockUsers.push(newUser)

  return NextResponse.json({
    success: true,
    data: newUser,
    message: 'Người dùng đã được tạo thành công',
  }, { status: 201 })
}
