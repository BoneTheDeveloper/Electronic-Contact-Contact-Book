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
| **Employee Code** | `TC001` |
| **Email** | `teacher@school.edu` |
| **Password** | `Test123456!` |
| **Role** | teacher |
| **Full Name** | Test Teacher |
| **User ID** | `56235c80-4fb8-454b-a5f5-9279cdda5822` |
| **Subject** | Toán |
| **Phone** | 0901234568 |

**Access:** Web Teacher Portal
**Login:** Use `TC001` or `teacher@school.edu`

---

### 3. Parent Account
| Field | Value |
|-------|-------|
| **Phone Number** | `0901234569` |
| **Email** | `parent@school.edu` |
| **Password** | `Test123456!` |
| **Role** | parent |
| **Full Name** | Test Parent |
| **User ID** | `61363a34-b945-4951-ae70-6109d47f3a75` |

**Access:** Mobile App (Parent Portal)
**Login:** Use `0901234569` or `parent@school.edu`

**Linked Children:**
| Student Name | Student Code | Class | Primary |
|--------------|--------------|-------|---------|
| Đỗ Thị Bình | 202690906 | 9A | Yes |
| Lê Thị Lan | 202690804 | 6B | No |
| Phan Thị Bình | 202670337 | 6B | No |

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
| Teacher | `TC001` (employee_code) | email |
| Student | `ST2024001` (student_code) | email |
| Parent | `0901234569` (phone) | email |

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

Created: 2025-01-22
Project: School Management System
