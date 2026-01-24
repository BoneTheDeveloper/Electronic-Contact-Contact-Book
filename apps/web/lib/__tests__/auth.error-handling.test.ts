import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, getUser, logout } from '../auth'

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

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => ({ data: { email: 'test@school.edu' }, error: null }))
            }))
          }))
        }))
      }))
    })),
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
  }))
}))

describe('login - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle missing identifier gracefully', async () => {
    const formData = new FormData()
    formData.set('password', 'test123')

    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should handle null FormData values', async () => {
    const formData = new FormData()
    formData.set('identifier', null as unknown as string)
    formData.set('password', null as unknown as string)

    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should handle whitespace-only identifier', async () => {
    const formData = new FormData()
    formData.set('identifier', '   ')
    formData.set('password', 'test')

    // Whitespace gets trimmed to empty by sanitizeInput
    // Empty string fails format validation (needs 1-20 alphanumeric chars)
    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })

  it('should handle invalid code format', async () => {
    const formData = new FormData()
    formData.set('identifier', "TC001' OR '1'='1")
    formData.set('password', 'test')

    // Should fail format validation (special chars like quotes)
    const result = await login(formData as unknown as FormData)
    expect(result).toHaveProperty('error')
  })
})

describe('getUser - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null when no cookie exists', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const user = await getUser()
    expect(user).toBeNull()
  })

  it('should handle corrupted cookie JSON', async () => {
    mockCookies.get.mockReturnValue({ value: 'invalid-json' })

    const user = await getUser()
    expect(user).toBeNull()
  })

  it('should handle empty cookie value', async () => {
    mockCookies.get.mockReturnValue({ value: '' })

    const user = await getUser()
    expect(user).toBeNull()
  })
})

describe('logout - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should always redirect even if cookie missing', async () => {
    mockCookies.delete.mockReturnValue(undefined)

    await expect(logout()).rejects.toThrow('Redirect: /login')
    expect(mockCookies.delete).toHaveBeenCalledWith('auth')
  })
})
