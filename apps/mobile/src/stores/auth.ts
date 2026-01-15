/**
 * Authentication Store
 * Manages user authentication state and operations
 *
 * SECURITY NOTICE: This is MOCK authentication only.
 * Accepts any password for demo purposes.
 * DO NOT use in production without proper backend.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import from shared-types
import type { User, UserRole, Student, Parent, Teacher, Admin } from '@school-management/shared-types';
import { mockUserDatabase } from '@school-management/shared-types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Convert mock user to full User type with required fields
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      // Login action - auto-detects role from email
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // MOCK authentication - accepts any password for demo
          const mockUser = mockUserDatabase[email];

          if (!mockUser) {
            // For demo: create user on-the-fly if not in database
            // Detect role from email domain/prefix
            let detectedRole: UserRole = 'student';
            if (email.includes('admin')) detectedRole = 'admin';
            else if (email.includes('teacher')) detectedRole = 'teacher';
            else if (email.includes('parent')) detectedRole = 'parent';

            // Create demo user with proper type
            let demoUser: User;

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
              demoUser = studentUser;
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
              demoUser = parentUser;
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
              demoUser = teacherUser;
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
              demoUser = adminUser;
            }

            const token = `demo-token-${Date.now()}`;
            set({
              user: demoUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              token,
            });
            return;
          }

          // Convert and set user
          const user = convertMockToUser(email, mockUser);
          const token = `mock-token-${Date.now()}`;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
            token: null,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({
          isLoading: true,
        });

        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Logout failed',
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set loading state
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
