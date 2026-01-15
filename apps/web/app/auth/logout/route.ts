/**
 * Route Handler for Logout
 * GET/POST /auth/logout
 *
 * Supports both GET (for browser testing) and POST (for forms)
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const AUTH_COOKIE_NAME = 'auth'

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  redirect('/login')
}

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  redirect('/login')
}

