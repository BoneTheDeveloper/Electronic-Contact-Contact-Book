/**
 * Web Authentication Server Actions using Supabase
 *
 * REAL authentication using Supabase Auth + custom code/phone lookup
 *
 * Login identifiers:
 * - Admin: admin_code (AD001) or email
 * - Teacher: employee_code (TC001) or email
 * - Student: student_code (ST2024001) or email
 * - Parent: phone number or email
 */

'use server';

import { cookies, headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@school-management/shared-types';
import { createClient } from '@/lib/supabase/server';

const AUTH_COOKIE_NAME = 'auth';
const SESSION_COOKIE_NAME = 'session_id';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

/**
 * Find user by identifier (code/phone/email)
 * Returns the user's email for Supabase Auth authentication
 */
async function findUserEmailByIdentifier(identifier: string): Promise<string | null> {
  const supabase = await createClient();
  const normalizedId = identifier.trim().toUpperCase();

  // 1. Check admin_code (in admins table)
  if (normalizedId.startsWith('AD')) {
    const { data } = await supabase
      .from('admins')
      .select('profiles!inner(email)')
      .eq('admin_code', normalizedId)
      .single();

    const result = data as { profiles: { email: string } } | null;
    if (result?.profiles?.email) return result.profiles.email;
  }

  // 2. Check employee_code (in teachers table)
  if (normalizedId.startsWith('TC')) {
    const { data } = await supabase
      .from('teachers')
      .select('profiles!inner(email)')
      .eq('employee_code', normalizedId)
      .single();

    const result = data as { profiles: { email: string } } | null;
    if (result?.profiles?.email) return result.profiles.email;
  }

  // 3. Check student_code
  if (normalizedId.startsWith('ST')) {
    const { data } = await supabase
      .from('students')
      .select('profiles!inner(email)')
      .eq('student_code', normalizedId)
      .single();

    const result = data as { profiles: { email: string } } | null;
    if (result?.profiles?.email) return result.profiles.email;
  }

  // 4. Check phone number (for parents)
  const cleanPhone = identifier.replace(/\s/g, '');
  if (/^\d{10,11}$/.test(cleanPhone)) {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('phone', cleanPhone)
      .eq('role', 'parent')
      .eq('status', 'active')
      .single();

    const result = data as { email: string } | null;
    if (result?.email) return result.email;
  }

  // 5. Check email directly
  if (identifier.includes('@')) {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', identifier.toLowerCase())
      .eq('status', 'active')
      .single();

    const result = data as { email: string } | null;
    if (result?.email) return result.email;
  }

  return null;
}

/**
 * Get full user profile from Supabase
 */
async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, status, avatar_url')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  const profile = data as { id: string; email: string; role: string; full_name?: string };

  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.email.split('@')[0],
    role: profile.role as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Generate random session token
 */
function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get user agent from request headers
 */
async function getUserAgent(): Promise<string> {
  const headersList = await nextHeaders();
  return headersList.get('user-agent') || 'Unknown';
}

/**
 * Parse user agent to extract device info
 */
function parseUserAgent(userAgent: string): {
  type: 'web' | 'mobile_ios' | 'mobile_android' | 'desktop'
  id: string
} {
  const ua = userAgent.toLowerCase();

  // Simple device detection
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return { type: 'mobile_ios', id: 'ios-device' };
  }
  if (ua.includes('android')) {
    return { type: 'mobile_android', id: 'android-device' };
  }
  if (ua.includes('mobile')) {
    return { type: 'web', id: 'mobile-web' };
  }

  // Generate simple fingerprint from user agent
  const id = Buffer.from(userAgent).toString('base64').slice(0, 16);

  return { type: 'desktop', id };
}

/**
 * Get client IP address
 */
async function getClientIP(): Promise<string | null> {
  const headersList = await nextHeaders();

  // Check various headers for IP
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]
    || headersList.get('x-real-ip')
    || headersList.get('cf-connecting-ip')
    || null;

  return ip;
}

/**
 * Terminate all active sessions for a user
 */
async function terminateUserSessions(
  userId: string,
  reason: string = 'new_login'
): Promise<void> {
  const supabase = await createClient();

  await supabase.rpc('terminate_user_sessions', {
    p_user_id: userId,
    p_reason: reason
  } as { p_user_id: string; p_reason: string });
}

/**
 * Broadcast session termination via Realtime
 */
async function broadcastSessionTermination(
  userId: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();

  await supabase.channel(`user:${userId}:session`)
    .send({
      type: 'broadcast',
      event: 'session_terminated',
      payload: { reason, timestamp: new Date().toISOString() }
    });
}

/**
 * Sanitize user input to prevent XSS
 * Removes HTML tags and javascript: protocols
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .trim();
}

/**
 * Validate code format (alphanumeric only, max length 20)
 */
function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{1,20}$/.test(code);
}

/**
 * Login state for useFormState
 */
export type LoginState = {
  error?: string;
  success?: boolean;
}

/**
 * Internal login implementation - shared by both public APIs
 */
async function loginImpl(identifier: string, password: string): Promise<LoginState | void> {
  if (!identifier || !password) {
    return { error: 'Vui lòng nhập tài khoản và mật khẩu' };
  }

  // Sanitize input to prevent XSS
  const sanitizedId = sanitizeInput(identifier);

  // Validate code format for security
  if (!isValidCode(sanitizedId) && !sanitizedId.includes('@')) {
    return { error: 'Định dạng tài khoản không hợp lệ' };
  }

  // Find user email from identifier
  const userEmail = await findUserEmailByIdentifier(sanitizedId);

  if (!userEmail) {
    return { error: 'Sai tài khoản hoặc mật khẩu' };
  }

  // Authenticate with Supabase
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: password,
  });

  if (authError || !authData.user) {
    return { error: 'Sai tài khoản hoặc mật khẩu' };
  }

  // Get user profile
  const user = await getUserProfile(authData.user.id);

  if (!user) {
    return { error: 'Không tìm thấy thông tin người dùng' };
  }

  // === Session management ===
  const sessionToken = authData.session?.access_token || generateSessionToken();

  // Get device info
  const userAgent = await getUserAgent();
  const deviceInfo = parseUserAgent(userAgent);
  const ipAddress = await getClientIP();

  // Terminate existing sessions
  await terminateUserSessions(user.id, 'new_login');

  // Broadcast logout to old sessions
  await broadcastSessionTermination(user.id, 'new_login');

  // Create new session
  const { data: newSession, error: sessionError } = await supabase
    .from('user_sessions')
    // @ts-expect-error - user_sessions table exists in DB but not in generated types
    .insert({
      user_id: user.id,
      session_token: sessionToken,
      is_active: true,
      device_type: deviceInfo.type,
      device_id: deviceInfo.id,
      user_agent: userAgent,
      ip_address: ipAddress,
    } as any)
    .select('id')
    .single();

  if (sessionError) {
    console.error('Failed to create session:', sessionError);
    // Continue anyway - auth is valid
  }

  // Set auth cookies
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    priority: 'high',
  });

  cookieStore.set(SESSION_COOKIE_NAME, (newSession as { id: string })?.id || '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    priority: 'high',
  });

  // Role-based redirect
  const redirectMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    parent: '/student/dashboard',
    student: '/student/dashboard',
  };

  redirect(redirectMap[user.role]);
}

/**
 * Login with identifier and password
 * For backward compatibility with tests
 */
export async function login(formData: FormData): Promise<LoginState | void>;

/**
 * Login with identifier and password
 * For useFormState hook
 */
export async function login(prevState: LoginState | null, formData: FormData): Promise<LoginState | void>;

/**
 * Login implementation with overload support
 */
export async function login(arg1: FormData | LoginState | null, arg2?: FormData): Promise<LoginState | void> {
  // Handle useFormState signature: login(prevState, formData)
  if (arg2 instanceof FormData) {
    const formData = arg2;
    const identifier = formData.get('identifier') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    return loginImpl(identifier || email, password);
  }

  // Handle direct/test signature: login(formData)
  if (arg1 instanceof FormData) {
    const formData = arg1;
    const identifier = formData.get('identifier') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    return loginImpl(identifier || email, password);
  }

  // Should not reach here
  return { error: 'Invalid login call' };
}

/**
 * Logout and clear session
 */
export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (authCookie) {
    try {
      const user = JSON.parse(authCookie);

      // Deactivate session in database
      if (sessionId) {
        const supabase = await createClient();
        await supabase
          .from('user_sessions')
          // @ts-expect-error - user_sessions table exists in DB but not in generated types
          .update({
            is_active: false,
            terminated_at: new Date().toISOString(),
            termination_reason: 'manual'
          } as any)
          .eq('id', sessionId);
      }
    } catch {
      // Ignore errors during logout
    }
  }

  // Sign out from Supabase
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear cookies
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(SESSION_COOKIE_NAME);

  redirect('/login');
}

/**
 * Get current authenticated user from cookie
 * Validates session with Supabase
 *
 * NOTE: Cannot delete cookies here - Next.js App Router forbids cookie mutations
 * during GET requests (page rendering). Invalid sessions return null and trigger
 * redirect via requireAuth(). Cookie cleanup happens in logout() Server Action.
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(authCookie.value) as User;

    // Verify session is still valid with Supabase
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // Handle auth errors (invalid/refresh tokens)
    if (error || !session) {
      console.debug('[Auth] Session invalid or error:', error?.message || 'No session')
      // Session expired or error - return null, let requireAuth handle redirect
      return null;
    }

    return user;
  } catch {
    // Invalid cookie format - return null, let requireAuth handle redirect
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(requiredRole: UserRole): Promise<User> {
  const user = await requireAuth();

  if (user.role !== requiredRole) {
    redirect('/login');
  }

  return user;
}
