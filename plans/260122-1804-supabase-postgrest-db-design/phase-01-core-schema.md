# Phase 01 - Core Schema

**Date**: 2026-01-22 | **Priority**: High | **Status**: Draft

## Overview

Core user and authentication schema using Supabase Auth with unified user table.

## Context

Based on mock data structures:
- 4 user roles: `admin`, `teacher`, `parent`, `student`
- Web app: admin/teacher access
- Mobile app: parent/student access
- Mock auth accepts any password

## Key Insights

1. **Unified auth** simpler than role-specific tables
2. **Supabase auth.users** for login only
3. **profiles table** extends auth with app data
4. **Role-specific tables** for extended attributes

## Schema Design

### 1. Auth (Supabase Managed)

```sql
-- auth.users (managed by Supabase)
-- id: UUID (primary key)
-- email: text (unique)
-- encrypted_password: text
-- email_confirmed_at: timestamp
-- created_at: timestamp
-- updated_at: timestamp
-- raw_user_meta_data: jsonb
```

### 2. Profiles (extends auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'student')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### 3. Students

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL, -- e.g., HS001
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  guardian_id UUID REFERENCES profiles(id), -- Link to parent profile
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_guardian ON students(guardian_id);
```

### 4. Teachers

```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_code TEXT UNIQUE NOT NULL, -- e.g., GV20260001
  subject TEXT, -- e.g., 'Toán', 'Ngữ văn', 'Tiếng Anh'
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_teachers_code ON teachers(employee_code);
```

### 5. Parents

```sql
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent', -- e.g., 'father', 'mother', 'guardian'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Student-Parent Relationships

```sql
-- Many-to-many: student can have multiple parents/guardians
CREATE TABLE student_guardians (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_student ON student_guardians(student_id);
CREATE INDEX idx_student_guardians_guardian ON student_guardians(guardian_id);
```

### 7. Admin User (Seeded)

```sql
-- Note: Admin account created via Supabase dashboard or seed script
-- Admin uses email/password login managed by Supabase Auth
-- No extra table needed - admin info stored in profiles table only
```

## Helper Functions

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## API Endpoints (PostgREST)

```
GET    /profiles                 -- List all profiles
GET    /profiles?id=eq.{uuid}    -- Get profile by ID
PATCH  /profiles?id=eq.{uuid}    -- Update own profile
GET    /students                 -- List students
GET    /teachers                 -- List teachers
GET    /parents                  -- List parents
GET    /student_guardians        -- List guardian relationships
```

## Requirements Met

- [x] Unified authentication
- [x] Role-based user types
- [x] Student-parent relationships
- [x] Profile management
- [x] RLS for security

## Next Steps

Review Phase 02 for academic structure (grades, classes, subjects).
