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

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@school-management/shared-types';
import { createClient } from '@/lib/supabase/server';

const AUTH_COOKIE_NAME = 'auth';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

/**
 * Find user by identifier (code/phone/email)
 * Returns the user's email for Supabase Auth authentication
 */
async function findUserEmailByIdentifier(identifier: string): Promise<string | null> {
  const supabase = await createClient();
  const normalizedId = identifier.trim().toUpperCase();

  // 1. Check admin_code
  if (normalizedId.startsWith('AD')) {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('admin_code', normalizedId)
      .eq('role', 'admin')
      .eq('status', 'active')
      .single();

    const result = data as { email: string } | null;
    if (result?.email) return result.email;
  }

  // 2. Check employee_code (teacher)
  if (normalizedId.startsWith('TC')) {
    const { data } = await supabase
      .from('profiles')
      .select('email')
      .eq('employee_code', normalizedId)
      .eq('role', 'teacher')
      .eq('status', 'active')
      .single();

    const result = data as { email: string } | null;
    if (result?.email) return result.email;
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
 * Login with identifier and password
 */
export async function login(formData: FormData) {
  const identifier = formData.get('identifier') as string;
  const email = formData.get('email') as string; // Legacy support
  const password = formData.get('password') as string;

  const loginIdentifier = identifier || email;

  if (!loginIdentifier || !password) {
    throw new Error('Identifier and password are required');
  }

  // Sanitize input to prevent XSS
  const sanitizedId = sanitizeInput(loginIdentifier);

  // Validate code format for security
  if (!isValidCode(sanitizedId) && !sanitizedId.includes('@')) {
    throw new Error('Invalid identifier format');
  }

  // Find user email from identifier
  const userEmail = await findUserEmailByIdentifier(sanitizedId);

  if (!userEmail) {
    throw new Error('Invalid credentials');
  }

  // Authenticate with Supabase
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: password,
  });

  if (authError || !authData.user) {
    throw new Error('Invalid credentials');
  }

  // Get user profile
  const user = await getUserProfile(authData.user.id);

  if (!user) {
    throw new Error('User profile not found');
  }

  // Set auth cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
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
 * Logout and clear session
 */
export async function logout() {
  const supabase = await createClient();

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Clear auth cookie
  // NOTE: Cookie deletion allowed here during POST (Server Action)
  // but NOT in getUser() during GET (page rendering)
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Session expired - return null, let requireAuth handle redirect
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
 * Includes error message in redirect for better UX
 */
export async function requireAuth(errorMessage?: string): Promise<User> {
  const user = await getUser();

  if (!user) {
    const params = new URLSearchParams();
    if (errorMessage) {
      params.set('error', errorMessage);
    } else {
      params.set('error', 'Please login to continue');
    }
    redirect(`/login?${params.toString()}`);
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
