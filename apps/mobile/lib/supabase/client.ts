/**
 * Supabase Client for React Native
 *
 * Environment variables are loaded from app.config.js extra.eas.env
 * or from .env file during development
 */

import { createClient } from '@supabase/supabase-js'

// These will be replaced by app.config.js during build
// For local development, you can also use .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in app.config.js or .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: globalThis.localStorage, // Use AsyncStorage if needed
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
