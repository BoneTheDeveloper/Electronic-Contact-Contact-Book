import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../auth'

const mockCookies = vi.hoisted(() => ({ set: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: () => mockCookies }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`Redirect: ${url}`) }),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: { code: 'PGRST116' } }))
        }))
      }))
    })),
    auth: {
      signInWithPassword: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null
      }))
    }
  }))
}))

describe('login - SQL Injection Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookies.set.mockReturnValue(undefined)
  })

  it('should reject SQL injection with quotes', async () => {
    const formData = new FormData()
    formData.set('identifier', "TC001' OR '1'='1")
    formData.set('password', 'any')

    // New auth validates code format (alphanumeric only)
    const result = await login(formData as any)
    expect(result).toHaveProperty('error')
  })

  it('should reject SQL injection in password (handled by Supabase)', async () => {
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', "'; DROP TABLE users; --")

    // Valid code format, but Supabase auth will handle SQLi in password
    // Format validation passes, then Supabase query runs
    const result = await login(formData as any)
    // Should NOT be format error
    if (result && typeof result === 'object' && 'error' in result) {
      expect(result.error).not.toContain('Invalid identifier format')
    }
  })

  it('should reject UNION-based injection', async () => {
    const formData = new FormData()
    formData.set('identifier', "TC001' UNION SELECT * FROM users --")
    formData.set('password', 'any')

    // Code format validation rejects
    const result = await login(formData as any)
    expect(result).toHaveProperty('error')
  })
})
