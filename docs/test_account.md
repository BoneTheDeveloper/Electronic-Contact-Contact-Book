# Test Accounts

## Overview
Test accounts created in Supabase for development and testing purposes.

## Password
All accounts use the same password:
```
Test123456!
```

## Test Accounts

### 1. Admin Account
| Field | Value |
|-------|-------|
| **Admin Code** | `AD001` |
| **Email** | `admin@school.edu` |
| **Password** | `Test123456!` |
| **Role** | admin |
| **Full Name** | Test Administrator |
| **User ID** | `4de87c83-1513-442a-90e3-afcb465c9499` |
| **Phone** | 0901234567 |
| **Department** | administration |

**Access:** Web Admin Portal
**Login:** Use `AD001` or `admin@school.edu`

---

### 2. Teacher Account
| Field | Value |
|-------|-------|
| **Employee Code** | `GV0001` |
| **Email** | `gv001@econtact.vn` |
| **Password** | `Test123456!` |
| **Role** | teacher |
| **Full Name** | Test Teacher |
| **User ID** | `56235c80-4fb8-454b-a5f5-9279cdda5822` |
| **Subject** | Toán, Lý |
| **Phone** | 0901234568 |

**Access:** Web Teacher Portal
**Login:** Use `GV0001` or `gv001@econtact.vn`

---

### 3. Parent Account
| Field | Value |
|-------|-------|
| **Phone Number** | `0852763387` |
| **Email** | `catus2k4@gmail.com` |
| **Password** | `Test123456!` |
| **Role** | parent |
| **Full Name** | Test Parent |
| **User ID** | `61363a34-b945-4951-ae70-6109d47f3a75` |

**Access:** Mobile App (Parent Portal)
**Login:** Use `0852763387` or `catus2k4@gmail.com`

**Linked Children:**
| Student Name | Student Code | Class | Primary |
|--------------|--------------|-------|---------|
| Đỗ Thị Bình | 202690906 | 9A | Yes |
| Lê Thị Lan | 202690804 | 6B | No |
| Phan Thị Bình | 202670337 | 6B | No |
| Test Student | ST2024001 | - | Yes |

---

### 4. Student Account (Not Enrolled - Use linked children above)
| Field | Value |
|-------|-------|
| **Student Code** | `ST2024001` |
| **Email** | `student@school.edu` |
| **Password** | `Test123456!` |
| **Role** | student |
| **Full Name** | Test Student |
| **User ID** | `ba965c37-23ef-407e-8afa-852ca0e151a0` |
| **Date of Birth** | 2010-05-15 |
| **Gender** | male |
| **Guardian** | parent@school.edu |
| **Phone** | 0901234570 |

**Access:** Mobile App (Student Portal)
**Login:** Use `ST2024001` or `student@school.edu`

---

## Login URLs

### Web App
- **Admin/Teacher Portal:** http://localhost:3000
- Login with admin or teacher credentials

### Mobile App
- **Parent/Student Portal:** Run `npx expo start` in `apps/mobile/`
- Login with parent or student credentials

---

## Login Identifiers

Each role can login with specific identifiers:

| Role | Primary Identifier | Alternative |
|------|-------------------|-------------|
| Admin | `AD001` (admin_code) | email |
| Teacher | `GV0001` (employee_code) | email |
| Student | `ST2024001` (student_code) | email |
| Parent | `0852763387` (phone) | email |

## Notes

- These are test accounts for development purposes only
- Email confirmation is already completed for all accounts
- Password is hashed using bcrypt in auth.users table
- Each role has appropriate access:
  - **Admin:** Full system access, user management
  - **Teacher:** Class management, attendance, grades
  - **Parent:** View child's grades, attendance, payments
  - **Student:** View own grades, attendance, schedule

---

## Database References

- `auth.users` - Authentication records
- `profiles` - Common profile data
- `admins` - Admin-specific data (admin_code)
- `teachers` - Teacher-specific data (employee_code)
- `parents` - Parent-specific data
- `students` - Student-specific data (student_code)

---

---

## Phase 01: Student Data Seeding (2026-01-25)

### Overview
Successfully seeded 25 test students for teacher GV0001 across three classes for development and testing purposes.

### Edge Function Location
- **Function:** `seed-teacher-data`
- **Path:** `supabase/functions/seed-teacher-data/index.ts`
- **Migration Backup:** `supabase/migrations/20260125030300_seed_teacher_gv0001_students.sql`

### Seeded Students
| Class | Count | Distribution |
|-------|-------|--------------|
| 6A | 10 students | 5 male, 5 female |
| 7B | 8 students | 4 male, 4 female |
| 8C | 7 students | 3 male, 4 female |

### Student Details
All students follow naming conventions:
- **Email format:** `hs{class}{number}@school.edu` (e.g., `hs6a001@school.edu`)
- **Student codes:** Unique IDs following pattern `a1010001-0000-0000-0000-000000000001`
- **Age range:** 10-12 years old (born 2010-2012)
- **Gender:** Balanced male/female distribution per class

### Parent Linkage
Each student is linked to one of 11 existing parent accounts (including the test parent) as their primary guardian.

### Security Features
- **Idempotent:** Checks for existing students before creating new ones
- **Secure:** Requires service role key or admin authorization
- **Backup:** Full SQL migration file created as backup

---

Created: 2025-01-22
Updated: 2026-01-25
Project: School Management System
