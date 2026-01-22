/**
 * Security utility functions for input validation and sanitization.
 *
 * IMPORTANT: This is a demo with mock authentication.
 * TODO: Add real authentication and security measures before production.
 */

/**
 * Sanitizes user input to prevent XSS attacks.
 * Strips HTML tags and special characters.
 * For production: Use DOMPurify library for comprehensive sanitization.
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  // Remove HTML tags and special characters
  // Allow alphanumeric, spaces, and common Vietnamese characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining < and >
    .trim()
}

/**
 * Sanitizes search query parameters.
 * Allows alphanumeric, spaces, and Vietnamese characters.
 */
export function sanitizeSearch(search: string): string {
  if (!search) return ''

  // Allow word characters, spaces, and Vietnamese characters (À-ỹ)
  return search.replace(/[^\w\sÀ-ỹà-ỹ]/gi, '').trim()
}

/**
 * Validates password strength.
 * Returns object with isValid flag and error message.
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password: string): {
  isValid: boolean
  error?: string
} {
  if (!password) {
    return { isValid: false, error: 'Mật khẩu không được để trống' }
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất 8 ký tự' }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất một chữ hoa' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất một chữ thường' }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Mật khẩu phải có ít nhất một số' }
  }

  return { isValid: true }
}

/**
 * Validates date range for academic year and semesters.
 * Ensures:
 * - Semester dates are within year dates
 * - Semester 2 starts after Semester 1 ends
 * - No overlapping semesters
 */
export function validateDateRange(data: {
  startDate: string
  endDate: string
  semester1Start: string
  semester1End: string
  semester2Start: string
  semester2End: string
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  const s1Start = new Date(data.semester1Start)
  const s1End = new Date(data.semester1End)
  const s2Start = new Date(data.semester2Start)
  const s2End = new Date(data.semester2End)

  // Check basic date validity
  if (s1Start < start) {
    errors.push('HK1 bắt đầu phải sau ngày bắt đầu năm học')
  }

  if (s1End > end) {
    errors.push('HK1 kết thúc phải trước ngày kết thúc năm học')
  }

  if (s2Start < start) {
    errors.push('HK2 bắt đầu phải sau ngày bắt đầu năm học')
  }

  if (s2End > end) {
    errors.push('HK2 kết thúc phải trước ngày kết thúc năm học')
  }

  // Check semester ordering
  if (s1End >= s2Start) {
    errors.push('HK2 bắt đầu phải sau HK1 kết thúc')
  }

  // Check semester validity
  if (s1Start >= s1End) {
    errors.push('HK1 kết thúc phải sau ngày bắt đầu HK1')
  }

  if (s2Start >= s2End) {
    errors.push('HK2 kết thúc phải sau ngày bắt đầu HK2')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Safe type assertion with fallback.
 * Prevents runtime errors from unsafe type assertions.
 */
export function safeTypeAssert<T>(
  value: unknown,
  fallback: T,
  validator?: (value: unknown) => boolean
): T {
  if (validator) {
    return validator(value) ? (value as T) : fallback
  }

  // Basic check: ensure value is not null/undefined
  return value != null ? (value as T) : fallback
}

/**
 * Mock authentication check for demo purposes.
 *
 * IMPORTANT: This is a DEMO with MOCK authentication.
 * TODO: Replace with real authentication middleware before production.
 *
 * Real implementation should:
 * - Validate JWT token or session
 * - Check user permissions
 * - Verify role-based access
 */
export async function getCurrentUser(request: Request): Promise<{
  user: { id: string; email: string; role: string } | null
  error?: string
}> {
  // TODO: Implement real authentication
  // For demo, always return admin user
  return {
    user: {
      id: 'admin-1',
      email: 'admin@school.edu',
      role: 'admin'
    }
  }

  /* Production implementation:
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return { user: null, error: 'No token provided' }
    }

    const decoded = await verifyJWT(token)
    return { user: decoded }
  } catch (error) {
    return { user: null, error: 'Invalid token' }
  }
  */
}

/**
 * Mock rate limiter for demo purposes.
 *
 * IMPORTANT: Rate limiting is not implemented in this demo.
 * TODO: Add real rate limiting before production (e.g., Redis-based, Upstash).
 *
 * Real implementation should:
 * - Track request count per IP/user
 * - Implement sliding window or token bucket
 * - Return 429 when limit exceeded
 */
export async function checkRateLimit(request: Request, options: {
  windowMs: number
  maxRequests: number
}): Promise<{ allowed: boolean; error?: string }> {
  // TODO: Implement real rate limiting
  // For demo, always allow requests
  return { allowed: true }

  /* Production implementation:
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const key = `rate-limit:${ip}`

  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, Math.ceil(options.windowMs / 1000))
  }

  if (count > options.maxRequests) {
    return {
      allowed: false,
      error: 'Too many requests. Please try again later.'
    }
  }

  return { allowed: true }
  */
}
