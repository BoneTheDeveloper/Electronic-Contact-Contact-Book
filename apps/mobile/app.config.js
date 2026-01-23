/**
 * Expo Configuration
 *
 * Project uses native android/ folder, so native properties (orientation, ios, android, plugins)
 * are managed directly in the native project files, not synced from Expo config.
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lshmmoenfeodsrthsevf.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaG1tb2VuZmVvZHNydGhzZXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwODIyNDMsImV4cCI6MjA4NDY1ODI0M30.t0oJez_q2nDLQrZaHK54XO6Q__Ct0DwfXz4fg4Jda_A';

export default {
  name: 'EContact School',
  slug: 'econtact-school',
  version: '1.0.0',
  assetBundlePatterns: ['**/*'],
  jsEngine: 'hermes',
  experiments: {
    typedRoutes: false,
  },
  extra: {
    eas: {
      projectId: '34d17c6d-8e17-4a4c-a2d7-f38d943667f3',
    },
    EXPO_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
  },
};
