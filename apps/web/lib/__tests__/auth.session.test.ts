import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, getUser, requireAuth, requireRole } from '../auth'
import type { UserRole } from '@school-management/shared-types'

interface MockCookies {
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

const mockCookies = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('next/headers', () => ({ cookies: () => mockCookies }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`Redirect: ${url}`) }),
}))

// Create flexible mock that handles different query patterns
const createQueryBuilder = () => ({
  select: vi.fn(() => createQueryBuilder()),
  eq: vi.fn(() => createQueryBuilder()),
  single: vi.fn(() => ({ data: { email: 'test@school.edu' }, error: null }))
})

const mockSupabaseClient = {
  from: vi.fn(() => createQueryBuilder()),
  auth: {
    signInWithPassword: vi.fn(() => Promise.resolve({
      data: { user: { id: 'test-user-id' } },
      error: null
    })),
    getSession: vi.fn(() => Promise.resolve({
      data: { session: { user: { id: 'test-user-id' } } }
    })),
    signOut: vi.fn(() => Promise.resolve({ error: null }))
  }
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}))

describe('Session Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should set cookie with 1 week max age', async () => {
    mockCookies.set.mockReturnValue(undefined)
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', 'any')

    try {
      await login(null, formData as unknown as FormData)
    } catch {
      const cookieOptions = mockCookies.set.mock.calls[0]?.[2]
      expect(cookieOptions?.maxAge).toBe(60 * 60 * 24 * 7) // 1 week
    }
  })

  it('should set cookie path to root', async () => {
    mockCookies.set.mockReturnValue(undefined)
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', 'any')

    try {
      await login(null, formData as unknown as FormData)
    } catch {
      const cookieOptions = mockCookies.set.mock.calls[0]?.[2]
      expect(cookieOptions?.path).toBe('/')
    }
  })

  it('requireAuth should redirect with default message', async () => {
    mockCookies.get.mockReturnValue(undefined)

    await expect(requireAuth()).rejects.toThrow('Redirect: /login')
  })

  it('requireAuth should redirect to clean login URL', async () => {
    mockCookies.get.mockReturnValue(undefined)

    await expect(requireAuth()).rejects.toThrow('Redirect: /login')
  })

  it('requireRole should reject unauthorized roles', async () => {
    mockCookies.get.mockReturnValue({
      value: JSON.stringify({ id: '1', role: 'teacher', email: 'test@school.edu', name: 'Test Teacher', createdAt: new Date(), updatedAt: new Date() })
    })

    await expect(requireRole('admin' as UserRole)).rejects.toThrow('Redirect: /login')
  })

  it('requireRole should accept matching role', async () => {
    mockCookies.get.mockReturnValue({
      value: JSON.stringify({ id: '1', role: 'admin', email: 'test@school.edu', name: 'Test Admin', createdAt: new Date(), updatedAt: new Date() })
    })

    const user = await requireRole('admin' as UserRole)
    expect(user?.role).toBe('admin')
  })
})
