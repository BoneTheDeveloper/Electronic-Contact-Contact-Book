import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../auth'

const mockCookies = vi.hoisted(() => ({ set: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: () => mockCookies }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`Redirect: ${url}`) }),
}))

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({ data: null, error: { code: 'PGRST116' } }))
            }))
          }))
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

describe('login - Input Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookies.set.mockReturnValue(undefined)
  })

  it('should reject empty identifier', async () => {
    const formData = new FormData()
    formData.set('identifier', '')
    formData.set('password', 'password123')

    await expect(login(formData)).rejects.toThrow('Identifier and password are required')
  })

  it('should reject empty password', async () => {
    const formData = new FormData()
    formData.set('identifier', 'TC001')
    formData.set('password', '')

    await expect(login(formData)).rejects.toThrow('Identifier and password are required')
  })

  // Note: With real Supabase auth, valid codes require actual database records
  // These tests document expected behavior with real auth

  it('should reject invalid identifier format (special chars)', async () => {
    const formData = new FormData()
    formData.set('identifier', "TC001' OR '1'='1")
    formData.set('password', 'any')

    // New auth validates code format and rejects special chars
    await expect(login(formData)).rejects.toThrow('Invalid identifier format')
  })

  it('should reject identifier with XSS attempts', async () => {
    const formData = new FormData()
    formData.set('identifier', '<script>alert("xss")</script>')
    formData.set('password', 'any')

    // Sanitization removes script tags, then validation fails format check
    await expect(login(formData)).rejects.toThrow()
  })

  it('should accept valid email format', async () => {
    const formData = new FormData()
    formData.set('identifier', 'admin@school.edu')
    formData.set('password', 'any')

    // With real Supabase, this will fail if user doesn't exist
    // But email format validation should pass
    try {
      await login(formData)
    } catch (e: any) {
      // Should NOT be format error (email is valid format)
      expect(e.message).not.toContain('Invalid identifier format')
    }
  })
})
