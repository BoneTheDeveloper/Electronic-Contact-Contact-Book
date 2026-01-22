/**
 * Supabase client for React Native
 * Uses @supabase/supabase-js with AsyncStorage for persisting sessions
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@school-management/shared-types';

// Get environment variables from app.config.js or .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging
const DEBUG = true;
const log = (tag: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[SUPABASE:${tag}]`, ...args);
  }
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
    log('STORAGE', `Getting item: ${key}`);
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    log('STORAGE', `Setting item: ${key} = ${value?.substring(0, 50)}...`);
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    log('STORAGE', `Removing item: ${key}`);
    return AsyncStorage.removeItem(key);
  },
};

// Create Supabase client with AsyncStorage adapter
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: customStorageAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      debug: DEBUG, // Enable Supabase auth debugging
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
