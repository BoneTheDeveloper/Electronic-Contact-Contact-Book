import { NextResponse } from 'next/server'
import { getUsers, createUser } from '@/lib/supabase/queries'
import { getCurrentUser, sanitizeSearch, sanitizeInput, checkRateLimit } from '@/lib/security-utils'

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

  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let users = await getUsers()

    interface UserFilter {
      role: string
      status: string
      name: string
      email: string
    }

    // Client-side filtering since Supabase queries don't support these filters yet
    if (role) {
      users = users.filter((u: UserFilter) => u.role === role)
    }
    if (status) {
      users = users.filter((u: UserFilter) => u.status === status)
    }
    if (search) {
      const sanitized = sanitizeSearch(search)
      users = users.filter((u: UserFilter) =>
        u.name.toLowerCase().includes(sanitized.toLowerCase()) ||
        u.email.toLowerCase().includes(sanitized.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      },
      { status: 500 }
    )
  }
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

  try {
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

    // Create user using Supabase
    const newUser = await createUser({
      id: Date.now().toString(), // In production, this comes from Supabase Auth
      email: sanitizedEmail,
      role: body.role || 'student',
      full_name: sanitizedName,
      phone: body.phone
    })

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Người dùng đã được tạo thành công',
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      },
      { status: 500 }
    )
  }
}
