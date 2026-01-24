import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'
import type { User } from '@school-management/shared-types'

interface MockRequest {
  nextUrl: { pathname: string }
  cookies: {
    get: ReturnType<typeof vi.fn>
  }
  url: string
}

describe('Middleware - Flow Tests', () => {
  const createMockRequest = (pathname: string, user: User | null = null): MockRequest => ({
    nextUrl: { pathname },
    cookies: {
      get: vi.fn((name: string) => {
        if (name === 'auth' && user) {
          return { value: JSON.stringify(user) }
        }
        return undefined
      }),
    },
    url: 'http://localhost:3000',
  })

  it('should redirect root to login for unauthenticated users', () => {
    const request = createMockRequest('/')
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/login')
  })

  it('should redirect authenticated root to role dashboard', () => {
    const request = createMockRequest('/', { role: 'teacher' } as User)
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/teacher/dashboard')
  })

  it('should redirect authenticated users away from login page', () => {
    const request = createMockRequest('/login', { role: 'admin' } as User)
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/admin/dashboard')
  })

  it('should protect admin routes from unauthenticated users', () => {
    const request = createMockRequest('/admin/dashboard')
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/login')
    expect(response.headers.get('location')).toContain('redirect=%2Fadmin%2Fdashboard')
  })

  it('should protect teacher routes from unauthenticated users', () => {
    const request = createMockRequest('/teacher/schedule')
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/login')
  })

  it('should block non-admin users from admin routes', () => {
    const request = createMockRequest('/admin/dashboard', { role: 'teacher' } as User)
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/teacher/dashboard')
  })

  it('should block non-teacher users from teacher routes', () => {
    const request = createMockRequest('/teacher/schedule', { role: 'admin' } as User)
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/admin/dashboard')
  })

  it('should allow authenticated users to access their role routes', () => {
    const request = createMockRequest('/teacher/schedule', { role: 'teacher' } as User)
    const response = middleware(request as unknown as NextRequest)

    // Should proceed without redirect
    expect(response.headers.get('location')).toBeNull()
  })

  it('should handle corrupted auth cookie gracefully', () => {
    const request: MockRequest = {
      nextUrl: { pathname: '/admin/dashboard' },
      cookies: {
        get: vi.fn(() => ({ value: 'invalid-json' })),
      },
      url: 'http://localhost:3000',
    }
    const response = middleware(request as unknown as NextRequest)

    expect(response.headers.get('location')).toContain('/login')
  })
})
