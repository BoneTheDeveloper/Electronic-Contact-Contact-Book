/**
 * Supabase client for React Native
 * Uses @supabase/supabase-js with AsyncStorage for persisting sessions
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Declare process.env for Expo environment variables
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL?: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    }
  }

  var process: {
    env: NodeJS.ProcessEnv;
  };
}

// Get environment variables from app.config.js or .env
const supabaseUrl = (process?.env?.EXPO_PUBLIC_SUPABASE_URL as string) || '';
const supabaseAnonKey = (process?.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) || '';

// Debug logging
const log = (tag: string, ...args: unknown[]) => {
  console.log(`[SUPABASE:${tag}]`, ...args);
};

log('CONFIG', 'Initializing Supabase client...');
log('CONFIG', `URL: ${supabaseUrl}`);
log('CONFIG', `Anon Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] URL or Anon Key is missing!');
  console.error('[SUPABASE] Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in app.json');
}

// Create a custom storage adapter for React Native
const customStorageAdapter = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

// Create Supabase client without Database type (not exported from shared-types)
// TODO: Add Database type to shared-types when available
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: customStorageAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      debug: true, // Enable Supabase auth debugging
    },
    global: {
      headers: {
        'X-Client-Info': 'econtact-mobile',
      },
    },
  }
);

log('INIT', 'Supabase client initialized successfully');

export default supabase;
