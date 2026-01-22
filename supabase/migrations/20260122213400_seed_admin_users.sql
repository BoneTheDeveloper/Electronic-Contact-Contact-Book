-- Migration: Seed Admin Users
-- Created: 2026-01-22
-- Description: Create 3 initial admin user accounts

-- NOTE: These users must be created via Supabase Auth first
-- Run this AFTER creating the auth users via:
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
-- 2. Or use Supabase CLI: npx supabase auth admin create --email ... --password ...

-- ============================================
-- INSERT PROFILES FOR ADMIN USERS
-- ============================================
-- The auth.users.id will be different - update these UUIDs after creating auth users

-- Admin 1: Principal/Head Admin
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@school.edu', 'admin', 'Principal Admin', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Admin 2: System Administrator
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000002', 'sysadmin@school.edu', 'admin', 'System Administrator', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- Admin 3: Academic Administrator
INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
  ('00000000-0000-0000-0000-000000000003', 'academic@school.edu', 'admin', 'Academic Administrator', '0123456789', 'active')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  status = EXCLUDED.status;

-- ============================================
-- INSTRUCTIONS FOR CREATING AUTH USERS
-- ============================================
--
-- OPTION 1: Via Supabase Dashboard
-- 1. Go to: https://supabase.com/dashboard/project/lshmmoenfeodsrthsevf/auth/users
-- 2. Click "Add user" → "Create new user" for each admin:
--
--   Admin 1:
--   - Email: admin@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--   - After creating, note the User ID and update the profile above
--
--   Admin 2:
--   - Email: sysadmin@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--
--   Admin 3:
--   - Email: academic@school.edu
--   - Password: (set your secure password)
--   - Auto Confirm User: ✓
--
-- OPTION 2: Via Supabase CLI (update email/password as needed)
-- npx supabase auth admin create \
--   --email admin@school.edu \
--   --password YOUR_SECURE_PASSWORD \
--   --email-confirm
--
-- OPTION 3: Generate real UUIDs and create both auth + profile
-- Run the function below to create 3 admin users with auto-generated UUIDs
-- SELECT create_admin_user('admin@school.edu', 'Principal Admin', '0123456789');
-- SELECT create_admin_user('sysadmin@school.edu', 'System Administrator', '0123456789');
-- SELECT create_admin_user('academic@school.edu', 'Academic Administrator', '0123456789');

-- ============================================
-- HELPER FUNCTION TO CREATE ADMIN USER
-- ============================================
-- This function creates both auth user and profile in one transaction
-- Only use this if you have service_role key access

CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  full_name TEXT,
  phone TEXT DEFAULT '0123456789'
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  new_password TEXT := gen_random_uuid()::text;
BEGIN
  -- Insert into auth.users (requires service_role)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    gen_random_uuid(),
    user_email,
    crypt(new_password, gen_salt('bf')),
    NOW(),
    '{"role": "admin", "full_name": "' || full_name || '"}'
  )
  RETURNING id INTO new_user_id;

  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, role, full_name, phone, status)
  VALUES (
    new_user_id,
    user_email,
    'admin',
    full_name,
    phone,
    'active'
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ALTERNATIVE: Simple insert with existing auth users
-- ============================================
-- If you have already created auth users via dashboard,
-- run this to create their profiles (update IDs accordingly):

-- Get the actual auth user IDs from:
-- SELECT id, email FROM auth.users WHERE email LIKE '%@school.edu';

-- Then insert profiles with those IDs:
-- INSERT INTO profiles (id, email, role, full_name, phone, status) VALUES
--   ('ACTUAL_UUID_FROM_AUTH', 'admin@school.edu', 'admin', 'Principal Admin', '0123456789', 'active')
-- ON CONFLICT (id) DO NOTHING;
