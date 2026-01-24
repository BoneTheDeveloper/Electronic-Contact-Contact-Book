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

// Mock Supabase client
const createQueryBuilder = () => ({
  eq: vi.fn(function() {
    // After first eq, return an object that has eq and single
    return {
      eq: vi.fn(() => createQueryBuilder()),
      single: vi.fn(() => ({ data: null, error: { code: 'PGRST116' } }))
    }
  }),
  single: vi.fn(() => ({ data: null, error: { code: 'PGRST116' } }))
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => createQueryBuilder())
    })),
    auth: {
      signInWithPassword: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null
      }))
    }
  }))
}))

describe('login - Input Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookies.set.mockReturnValue(undefined)
  })

  it('should reject empty identifier', async () => {
    const formData = new FormData()
    formData.set('identifier', '')
    formData.set('password', 'password123')

    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should reject empty password', async () => {
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', '')

    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  // Note: With real Supabase auth, valid codes require actual database records
  // These tests document expected behavior with real auth

  it('should reject invalid identifier format (special chars)', async () => {
    const formData = new FormData()
    formData.set('identifier', "TC001' OR '1'='1")
    formData.set('password', 'any')

    // New auth validates code format and rejects special chars
    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should reject identifier with XSS attempts', async () => {
    const formData = new FormData()
    formData.set('identifier', '<script>alert("xss")</script>')
    formData.set('password', 'any')

    // Sanitization removes script tags, then validation fails format check
    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should accept valid email format', async () => {
    const formData = new FormData()
    formData.set('identifier', 'admin@school.edu')
    formData.set('password', 'any')

    // With real Supabase, this will fail if user doesn't exist
    // But email format validation should pass
    const result = await login(formData as unknown as FormData)
    // Either returns error object or redirects (throws)
    if (result && typeof result === 'object' && 'error' in result) {
      // Should NOT be format error (email is valid format)
      expect(result.error).not.toContain('Invalid identifier format')
    }
  })
})
