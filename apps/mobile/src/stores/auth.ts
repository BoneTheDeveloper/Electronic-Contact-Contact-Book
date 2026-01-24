/**
 * Authentication Store
 * Manages user authentication state and operations
 *
 * REAL authentication using Supabase Auth + custom code/phone lookup
 *
 * Login identifiers:
 * - Parent: phone number or email
 * - Student: student_code (ST2024001) or email
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import from shared-types
import type { User, UserRole } from '@school-management/shared-types';
import { supabase } from '@/lib/supabase/client';

// Debug logger
const log = (tag: string, ...args: unknown[]) => {
  console.log(`[AUTH:${tag}]`, ...args);
};

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Find user's email by identifier (code/phone/email)
 * Used to map custom identifiers to Supabase Auth email
 */
async function findUserEmailByIdentifier(identifier: string): Promise<string | null> {
  const normalizedId = identifier.trim().toUpperCase();

  log('IDENTIFIER_LOOKUP', `Looking up identifier: "${identifier}" (normalized: "${normalizedId}")`);

  // 1. Check student_code
  if (normalizedId.startsWith('ST')) {
    log('IDENTIFIER_LOOKUP', 'Checking student_code...');
    const { data, error } = await supabase
      .from('students')
      .select('student_code, profiles!students_id_fkey(email)')
      .eq('student_code', normalizedId)
      .maybeSingle();

    log('IDENTIFIER_LOOKUP', 'Student lookup result:', JSON.stringify({ data, error }, null, 2));

    // Handle both nested (profiles.email) and flattened (email) response structures
    type StudentData = {
      profiles?: { email: string };
      email?: string;
    };
    const email = (data as StudentData | null)?.profiles?.email || (data as StudentData | null)?.email;
    if (email) return email;
  }

  // 2. Check phone number (for parents)
  const cleanPhone = identifier.replace(/\s/g, '');
  if (/^\d{10,11}$/.test(cleanPhone)) {
    log('IDENTIFIER_LOOKUP', `Checking phone: ${cleanPhone}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('phone', cleanPhone)
      .eq('role', 'parent')
      .eq('status', 'active')
      .maybeSingle();

    log('IDENTIFIER_LOOKUP', 'Phone lookup result:', { data, error });
    if (data?.email) return data.email;
  }

  // 3. Check email directly (for both students and parents)
  if (identifier.includes('@')) {
    log('IDENTIFIER_LOOKUP', `Checking email: ${identifier.toLowerCase()}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('email', identifier.toLowerCase())
      .eq('status', 'active')
      .in('role', ['student', 'parent'])
      .maybeSingle();

    log('IDENTIFIER_LOOKUP', 'Email lookup result:', { data, error });
    if (data?.email) return data.email;
  }

  log('IDENTIFIER_LOOKUP', 'No user found for identifier:', identifier);
  return null;
}

/**
 * Get full user profile from Supabase
 */
async function getUserProfile(userId: string): Promise<User | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, phone, avatar_url, status, created_at, updated_at')
    .eq('id', userId)
    .eq('status', 'active')
    .single();

  if (!profile) return null;

  // Convert to User type
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.email.split('@')[0],
    role: profile.role as UserRole,
    avatar: profile.avatar_url || undefined,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      // Login action - REAL authentication with Supabase
      login: async (identifier: string, password: string) => {
        log('LOGIN_START', `Starting login for identifier: "${identifier}"`);
        set({ isLoading: true, error: null });

        try {
          // Step 1: Find user's email by identifier
          log('LOGIN_STEP_1', 'Finding user email by identifier...');
          const userEmail = await findUserEmailByIdentifier(identifier);

          if (!userEmail) {
            log('LOGIN_ERROR', 'User not found or inactive');
            set({
              isLoading: false,
              error: 'User not found or inactive',
            });
            throw new Error('User not found or inactive');
          }

          log('LOGIN_STEP_1', `Found email: ${userEmail}`);

          // Step 1.5: Clear any existing session before new login
          log('LOGIN_STEP_1.5', 'Clearing existing session...');
          await supabase.auth.signOut({ scope: 'global' });

          // Step 2: Authenticate with Supabase Auth
          log('LOGIN_STEP_2', 'Authenticating with Supabase Auth...');
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: password,
          });

          log('LOGIN_STEP_2', 'Auth result:', { authData, authError });

          if (authError || !authData.user) {
            log('LOGIN_ERROR', 'Auth failed:', authError);
            set({
              isLoading: false,
              error: authError?.message || 'Invalid password',
            });
            throw new Error(authError?.message || 'Invalid password');
          }

          log('LOGIN_STEP_2', `Auth successful for user ID: ${authData.user.id}`);

          // Step 3: Get full user profile
          log('LOGIN_STEP_3', 'Fetching user profile...');
          const user = await getUserProfile(authData.user.id);

          if (!user) {
            log('LOGIN_ERROR', 'Profile not found');
            set({
              isLoading: false,
              error: 'Profile not found',
            });
            throw new Error('Profile not found');
          }

          log('LOGIN_STEP_3', 'User profile:', user);

          // Step 4: Get session token
          log('LOGIN_STEP_4', 'Getting session token...');
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token || null;

          log('LOGIN_STEP_4', `Session token: ${token ? 'present' : 'missing'}`);

          // Step 5: Update state
          log('LOGIN_SUCCESS', `Login successful for ${user.role}:`, user.name);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            token,
          });
        } catch (error) {
          log('LOGIN_CATCH', 'Login error caught:', error);
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
          // Sign out from Supabase Auth
          await supabase.auth.signOut();

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

      // Logout action
      logout: async () => {
        set({
          isLoading: true,
        });

        try {
          // Sign out from Supabase Auth
          await supabase.auth.signOut();

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
