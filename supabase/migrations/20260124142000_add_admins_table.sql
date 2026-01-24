-- Migration: Admins Table
-- Created: 2026-01-24
-- Description: Add admins table for administrator-specific data
-- This table extends the profiles table with admin-specific information

-- ============================================
-- ADMINS TABLE
-- ============================================
-- Admin-specific data extending profiles table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  admin_code TEXT UNIQUE NOT NULL, -- Unique admin code for login (e.g., AD001, AD002)
  department TEXT DEFAULT 'administration', -- Department the admin belongs to
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin code lookup
CREATE INDEX idx_admins_code ON admins(admin_code);
CREATE INDEX idx_admins_department ON admins(department);

-- Trigger for updated_at
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================
-- Note: RLS is disabled for admins table (rls_enabled: false)
-- This allows service role to manage admin records without restrictions
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
-- Authenticated users can read admin data (for displaying admin info)
GRANT SELECT ON admins TO authenticated;

-- Service role has full access
GRANT ALL ON admins TO service_role;
