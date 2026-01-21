/**
 * Next.js Middleware
 * Protects routes and handles authentication redirects
 *
 * SECURITY NOTICE: This works with MOCK authentication.
 * For production, implement proper JWT/session validation.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { User, UserRole } from '@school-management/shared-types'

const AUTH_COOKIE_NAME = 'auth'

/**
 * Parse user from auth cookie
 */
function getUserFromCookie(request: NextRequest): User | null {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)

  if (!authCookie?.value) {
    return null
  }

  try {
    return JSON.parse(authCookie.value) as User
  } catch {
    return null
  }
}

/**
 * Role-based redirect mapping
 */
const getRedirectForRole = (role: UserRole): string => {
  const redirectMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher-temp/dashboard',
    parent: '/parent/dashboard',
    student: '/student/dashboard',
  }
  return redirectMap[role]
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const user = getUserFromCookie(request)

  // Explicitly redirect root to login
  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL(getRedirectForRole(user.role), request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Define route patterns
  const isAuthPage = pathname === '/login' || pathname.startsWith('/login')
  const isAdminRoute = pathname.startsWith('/admin')
  const isTeacherRoute = pathname.startsWith('/teacher')
  const isParentRoute = pathname.startsWith('/parent')
  const isStudentRoute = pathname.startsWith('/student')
  const isProtectedRoute = isAdminRoute || isTeacherRoute || isParentRoute || isStudentRoute

  // 1. Redirect authenticated users away from login page
  if (user && isAuthPage) {
    const redirectUrl = getRedirectForRole(user.role)
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // 2. Protect authenticated routes
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. Role-based access control
  if (user && isProtectedRoute) {
    // Check if user has access to the requested route
    if (isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL(getRedirectForRole(user.role), request.url))
    }
    if (isTeacherRoute && user.role !== 'teacher') {
      return NextResponse.redirect(new URL(getRedirectForRole(user.role), request.url))
    }
    if (isParentRoute && user.role !== 'parent') {
      return NextResponse.redirect(new URL(getRedirectForRole(user.role), request.url))
    }
    if (isStudentRoute && user.role !== 'student') {
      return NextResponse.redirect(new URL(getRedirectForRole(user.role), request.url))
    }
  }

  // 4. Allow request to proceed
  return NextResponse.next()
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
