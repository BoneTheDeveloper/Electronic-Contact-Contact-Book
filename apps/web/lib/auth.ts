/**
 * Web Authentication Server Actions
 *
 * SECURITY NOTICE: This is MOCK authentication only.
 * Accepts any password for demo purposes.
 * DO NOT use in production without proper backend.
 *
 * Role is auto-detected from email address:
 * - admin@... → admin
 * - teacher@... → teacher
 * - parent@... → parent
 * - student@... → student
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, UserRole, Student, Parent, Teacher, Admin } from '@school-management/shared-types';
import { mockUserDatabase } from '@school-management/shared-types';

const AUTH_COOKIE_NAME = 'auth';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

// Convert mock user to full User type
const convertMockToUser = (email: string, mockUser: typeof mockUserDatabase[string]): User => {
  if (mockUser.role === 'student') {
    const student: Student = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: 'student',
      avatar: mockUser.avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
      rollNumber: `STU${mockUser.id}`,
      classId: 'CLASS10A',
      section: 'A',
      dateOfBirth: new Date('2009-01-01'),
      parentIds: ['1'],
    };
    return student;
  } else if (mockUser.role === 'parent') {
    const parent: Parent = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: 'parent',
      avatar: mockUser.avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: '+84 123 456 789',
      address: '123 Main St',
      childrenIds: ['2'],
    };
    return parent;
  } else if (mockUser.role === 'teacher') {
    const teacher: Teacher = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: 'teacher',
      avatar: mockUser.avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
      employeeId: `EMP${mockUser.id}`,
      subjects: ['Mathematics', 'Physics'],
      phone: '+84 123 456 789',
    };
    return teacher;
  } else {
    const admin: Admin = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: 'admin',
      avatar: mockUser.avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: ['all'],
    };
    return admin;
  }
};

// Detect role from email
const detectRoleFromEmail = (email: string): UserRole => {
  const lowerEmail = email.toLowerCase();
  if (lowerEmail.includes('admin')) return 'admin';
  if (lowerEmail.includes('teacher')) return 'teacher';
  if (lowerEmail.includes('parent')) return 'parent';
  return 'student';
};

/**
 * Login with email and password (any password accepted)
 *
 * Role can be:
 * 1. Provided via role field from login form toggle
 * 2. Auto-detected from email address (fallback)
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const roleFromForm = formData.get('role') as 'teacher' | 'admin' | null;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // MOCK authentication - accepts any password
  const mockUser = mockUserDatabase[email];

  let user: User;

  if (!mockUser) {
    // Use role from form toggle, or fall back to email detection
    const detectedRole = roleFromForm || detectRoleFromEmail(email);

    // Create properly typed demo user
    if (detectedRole === 'student') {
      const studentUser: Student = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'student',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        rollNumber: 'DEMO001',
        classId: 'DEMO',
        section: 'A',
        dateOfBirth: new Date(),
        parentIds: [],
      };
      user = studentUser;
    } else if (detectedRole === 'parent') {
      const parentUser: Parent = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'parent',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '',
        address: '',
        childrenIds: [],
      };
      user = parentUser;
    } else if (detectedRole === 'teacher') {
      const teacherUser: Teacher = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'teacher',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        employeeId: 'DEMO_EMP',
        subjects: [],
        phone: '',
      };
      user = teacherUser;
    } else {
      const adminUser: Admin = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'admin',
        avatar: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        permissions: ['all'],
      };
      user = adminUser;
    }
  } else {
    user = convertMockToUser(email, mockUser);
  }

  // Set auth cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
  });

  // Role-based redirect
  const redirectMap: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    parent: '/parent/dashboard',
    student: '/student/dashboard',
  };

  redirect(redirectMap[user.role]);
}

/**
 * Logout and clear session
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/login');
}

/**
 * Get current authenticated user from cookie
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(authCookie.value) as User;
  } catch {
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
