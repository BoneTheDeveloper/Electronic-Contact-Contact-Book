import { NextRequest, NextResponse } from 'next/server'
import { getUserById, type User } from '@/lib/mock-data'
import { getCurrentUser, sanitizeInput, checkRateLimit } from '@/lib/security-utils'

// GET /api/users/[id] - Get a specific user
export async function GET(
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

  try {
    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
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
    const { name, email, role, status, classId, avatar } = body

    // Verify user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Validation for role field
    if (role && !['admin', 'teacher', 'parent', 'student'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role (must be admin, teacher, parent, or student)' },
        { status: 400 }
      )
    }

    // Validation for status field
    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status (must be active or inactive)' },
        { status: 400 }
      )
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Mock update - in real implementation, update database
    const updatedUser: User = {
      ...existingUser,
      name: name ? sanitizeInput(name.trim()) : existingUser.name,
      email: email ? sanitizeInput(email.trim()) : existingUser.email,
      role: role || existingUser.role,
      status: status || existingUser.status,
      classId: classId !== undefined ? classId : existingUser.classId,
      avatar: avatar || existingUser.avatar
    }

    // TODO: Real API - Save to database
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Cập nhật người dùng thành công'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
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

  try {
    const { id } = await params

    // Verify user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Mock delete - in real implementation, delete from database
    // Check if user has associated records before allowing deletion
    // For now, just return success

    // TODO: Real API - Delete from database
    return NextResponse.json({
      success: true,
      message: 'Xóa người dùng thành công'
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      },
      { status: 500 }
    )
  }
}
