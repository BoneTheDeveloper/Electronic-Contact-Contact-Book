import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../auth'

interface MockCookies {
  set: ReturnType<typeof vi.fn>
}

const mockCookies = vi.hoisted(() => ({ set: vi.fn() }))
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
    }))
  }
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}))

describe('login - CSRF Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookies.set.mockReturnValue(undefined)
  })

  it('should set httpOnly cookie (prevents XSS token theft)', async () => {
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', 'any')

    try {
      await login(null, formData as unknown as FormData)
    } catch {
      const cookieOptions = mockCookies.set.mock.calls[0]?.[2]
      expect(cookieOptions?.httpOnly).toBe(true)
    }
  })

  it('should set sameSite=lax (CSRF protection)', async () => {
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', 'any')

    try {
      await login(null, formData as unknown as FormData)
    } catch {
      const cookieOptions = mockCookies.set.mock.calls[0]?.[2]
      expect(cookieOptions?.sameSite).toBe('lax')
    }
  })

  it('should set secure flag in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')

    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', 'any')

    try {
      await login(null, formData as unknown as FormData)
    } catch {
      const cookieOptions = mockCookies.set.mock.calls[0]?.[2]
      expect(cookieOptions?.secure).toBe(true)
    }

    vi.unstubAllEnvs()
  })
})
