/**
 * Client-side Auth Utilities
 *
 * Handles auth state changes and errors on the browser side.
 * Use this in client components to detect auth failures and redirect to login.
 */

'use client';

import { createClient } from './client';
import type { AuthError } from '@supabase/supabase-js';

let authListenersInitialized = false;
let redirecting = false;

/**
 * Setup auth error handling listeners
 * Should be called once on app initialization (e.g., in root layout or a provider)
 */
export function setupAuthListeners() {
  if (authListenersInitialized || typeof window === 'undefined') {
    return;
  }

  const supabase = createClient();

  // Track number of consecutive refresh errors
  let refreshErrorCount = 0;
  const MAX_REFRESH_ERRORS = 2; // Reduced to fail faster

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.debug('[Auth] State change:', event, session ? 'has session' : 'no session');

      switch (event) {
        case 'INITIAL_SESSION':
          // Initial session loaded - check if valid
          if (!session) {
            console.warn('[Auth] No initial session, redirecting to login');
            redirectToLogin();
          }
          break;

        case 'SIGNED_IN':
          // User signed in - reset error counter
          refreshErrorCount = 0;
          redirecting = false;
          break;

        case 'SIGNED_OUT':
          // User signed out - redirect to login
          console.debug('[Auth] User signed out, redirecting to login');
          redirectToLogin();
          break;

        // @ts-expect-error - USER_DELETED is a valid Supabase auth event but not in type definitions
        case 'USER_DELETED':
          // User was deleted - redirect to login
          console.debug('[Auth] User deleted, redirecting to login');
          redirectToLogin();
          break;

        case 'TOKEN_REFRESHED':
          // Token was refreshed successfully - reset error counter
          if (session) {
            refreshErrorCount = 0;
          } else {
            // Token refresh failed - session is null
            refreshErrorCount++;
            console.warn(`[Auth] Token refresh failed (${refreshErrorCount}/${MAX_REFRESH_ERRORS})`);

            if (refreshErrorCount >= MAX_REFRESH_ERRORS) {
              console.error('[Auth] Too many refresh failures, redirecting to login');
              redirectToLogin();
            }
          }
          break;

        default:
          break;
      }
    }
  );

  // Override console.error to catch auth errors globally
  const originalError = console.error;
  console.error = function (...args) {
    // Call original first
    originalError.apply(console, args);

    // Prevent infinite redirect loop
    if (redirecting) return;

    // Check if this is a Supabase auth error
    const firstArg = args[0];
    if (isRefreshTokenError(firstArg)) {
      console.error('[Auth] Critical auth error detected, redirecting to login');
      redirectToLogin();
    }
  };

  // Also check session validity immediately
  checkSessionValidity().then(isValid => {
    if (!isValid && !redirecting) {
      console.warn('[Auth] Initial session check failed, redirecting to login');
      redirectToLogin();
    }
  });

  authListenersInitialized = true;

  // Return cleanup function
  return () => {
    subscription.unsubscribe();
    authListenersInitialized = false;
    console.error = originalError;
  };
}

/**
 * Check if an error is a refresh token error
 */
function isRefreshTokenError(error: unknown): boolean {
  if (!error) return false;

  // Check for AuthError object with code
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    return (
      code === 'refresh_token_not_found' ||
      code === 'invalid_refresh_token' ||
      code === 'session_not_found'
    );
  }

  // Check for error message string
  if (typeof error === 'string') {
    return error.includes('refresh_token_not_found') ||
           error.includes('Invalid Refresh Token');
  }

  return false;
}

/**
 * Redirect to login page with current URL as return destination
 */
function redirectToLogin() {
  if (redirecting) return;
  redirecting = true;

  const currentPath = window.location.pathname + window.location.search;
  const loginUrl = currentPath === '/login'
    ? '/login'
    : `/login?redirect=${encodeURIComponent(currentPath)}`;

  // Avoid infinite redirect loops
  if (window.location.pathname !== '/login') {
    console.log('[Auth] Redirecting to login:', loginUrl);
    window.location.href = loginUrl;
  }
}

/**
 * Check if current session is valid
 * Returns true if session exists and is valid, false otherwise
 */
export async function checkSessionValidity(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.debug('[Auth] Session invalid:', error?.message || 'No session');
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Auth] Error checking session:', err);
    return false;
  }
}

/**
 * Handle auth errors from API calls
 * Use this in try/catch blocks when making authenticated requests
 */
export function handleAuthError(error: unknown): boolean {
  // Returns true if error was an auth error that should trigger redirect
  if (!error || redirecting) return false;

  const authError = error as AuthError;

  if (
    authError?.status === 400 &&
    (authError?.code === 'refresh_token_not_found' ||
     authError?.code === 'invalid_refresh_token' ||
     authError?.code === 'session_not_found')
  ) {
    console.error('[Auth] Auth error detected, redirecting to login:', authError.message);
    redirectToLogin();
    return true;
  }

  return false;
}
