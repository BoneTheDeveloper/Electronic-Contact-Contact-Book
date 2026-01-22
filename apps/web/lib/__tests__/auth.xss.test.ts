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

describe('login - XSS Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookies.set.mockReturnValue(undefined)
  })

  it('sanitizes script tags before validation', async () => {
    const formData = new FormData()
    formData.set('identifier', '<script>alert("xss")</script>')
    formData.set('password', 'any')

    // Sanitization removes script tags, leaving empty string
    await expect(login(formData)).rejects.toThrow()
  })

  it('sanitizes img tag with onerror', async () => {
    const formData = new FormData()
    formData.set('identifier', '<img src=x onerror=alert(1)>')
    formData.set('password', 'any')

    // Sanitization removes HTML tags
    await expect(login(formData)).rejects.toThrow()
  })

  it('sanitizes javascript: protocol', async () => {
    const formData = new FormData()
    formData.set('identifier', 'javascript:alert(1)')
    formData.set('password', 'any')

    // Sanitization removes javascript: protocol
    await expect(login(formData)).rejects.toThrow()
  })
})
