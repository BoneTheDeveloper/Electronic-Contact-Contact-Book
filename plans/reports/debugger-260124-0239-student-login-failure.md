# Student Login Failure - Root Cause Analysis

**Date:** 2026-01-24
**Issue:** Student code `ST2024001` fails login with error: "No user found for identifier: ST2024001"
**Status:** ROOT CAUSE IDENTIFIED

---

## Executive Summary

Student login fails because **ST2024001 does not exist in the database**. The authentication logic is correct, but the test user was created with email `student@school.edu` (UUID: `ed86ea13-b68f-423a-af3f-6cc43e66f1f7`) which has **NO corresponding record in the `students` table**.

**Root Cause:** The profile exists but has no `students` table record with `student_code = 'ST2024001'`.

---

## Technical Analysis

### 1. IDENTIFIER_LOOKUP Logic (CORRECT)

**Location:** `C:\Project\electric_contact_book\apps\mobile\src\stores\auth.ts` (Lines 44-97)

The authentication flow:
1. **Student Code Check (Lines 49-62):** Queries `students` table using explicit FK `students_id_fkey`
2. **Phone Check (Lines 64-78):** Queries `profiles` table for parent phone
3. **Email Check (Lines 80-93):** Queries `profiles` table for email

```typescript
// 1. Check student_code
if (normalizedId.startsWith('ST')) {
  const { data, error } = await supabase
    .from('students')
    .select('student_code, profiles!students_id_fkey(email)')
    .eq('student_code', normalizedId)
    .maybeSingle();
}
```

**This query is CORRECT.** It uses the explicit foreign key `students_id_fkey` to join with profiles and retrieve the email.

### 2. Database Structure

**Schema:** `supabase/migrations/20260122194500_core_schema.sql`

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_code TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  address TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  guardian_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Relationships:**
- `students.id` → `profiles.id` (PRIMARY FK, student's own profile)
- `students.guardian_id` → `profiles.id` (SECONDARY FK, guardian's profile)

### 3. Data Verification

**Query Results:**

```sql
-- Check if ST2024001 exists in students table
SELECT id, student_code FROM students WHERE student_code = 'ST2024001';
-- Result: EMPTY (no rows)

-- Check the test user's profile
SELECT id, email, role FROM profiles WHERE email = 'student@school.edu';
-- Result: FOUND - id=ed86ea13-b68f-423a-af3f-6cc43e66f1f7, role='student'

-- Check if this profile has a students record
SELECT * FROM students WHERE id = 'ed86ea13-b68f-423a-af3f-6cc43e66f1f7';
-- Result: EMPTY (no students record for this profile)
```

**Existing Students in Database:**
- Student codes follow pattern: `202660001`, `202660002`, ..., `ST2024...`
- Test student `ST2024001` was **NEVER created in the students table**

---

## Root Cause

**The test user `student@school.edu` was created ONLY in the `profiles` table, NOT in the `students` table.**

When the identifier lookup runs:
1. Input: `ST2024001`
2. Query: `SELECT student_code, profiles!students_id_fkey(email) FROM students WHERE student_code = 'ST2024001'`
3. Result: **NO ROWS RETURNED** (because no student record with this code exists)
4. Falls through to phone check → fails
5. Falls through to email check → would succeed with `student@school.edu`
6. But student is trying to login with **code**, not email

---

## Why ST2024001 Lookup Fails

| Step | Check | Query | Result | Reason |
|------|-------|-------|--------|--------|
| 1 | Student code | `students` table via `students_id_fkey` | **EMPTY** | No `students` record with `student_code='ST2024001'` |
| 2 | Phone | `profiles` table for phone | EMPTY | Input is not a phone number |
| 3 | Email | `profiles` table for email | **FOUND** | But requires input format `student@school.edu` |

**The code works correctly. The problem is missing data.**

---

## Evidence

### Actual Student Records in Database

Sample of existing student codes:
- `202660001` → email: `202660001@school.edu`
- `202660002` → email: `202660002@school.edu`
- `ST2024...` series exists

### Test User Creation Issue

The test user `student@school.edu` was created with:
- ✅ `profiles` record: `id=ed86ea13-b68f-423a-af3f-6cc43e66f1f7`
- ❌ `students` record: **MISSING**

This breaks the invariant: *Every student profile MUST have a corresponding `students` table record.*

---

## Solution

### Option 1: Create Missing Student Record (RECOMMENDED)

```sql
INSERT INTO students (id, student_code, enrollment_date)
VALUES (
  'ed86ea13-b68f-423a-af3f-6cc43e66f1f7',
  'ST2024001',
  CURRENT_DATE
);
```

**Why:** This is the correct fix. The user should be able to login with their student code.

### Option 2: Use Email Login (WORKAROUND)

Login with: `student@school.edu` / `Test123456`

**Why:** The email exists in profiles, so email login will work. But this defeats the purpose of student code login.

### Option 3: Fix User Creation Process (PREVENTION)

Ensure future student creation ALWAYS creates both:
1. `profiles` record (via Supabase Auth trigger)
2. `students` record with `student_code`

---

## Code Locations

| File | Lines | Description |
|------|-------|-------------|
| `apps/mobile/src/stores/auth.ts` | 44-97 | `findUserEmailByIdentifier()` - CORRECT |
| `apps/mobile/src/stores/auth.ts` | 49-62 | Student code lookup logic |
| `supabase/migrations/20260122194500_core_schema.sql` | 81-91 | `students` table definition |
| `supabase/migrations/20260122194500_core_schema.sql` | 82 | `students.id` FK to `profiles.id` |

---

## Testing Verification

### Test Case 1: Student Code Login (CURRENTLY FAILS)

```bash
Input: ST2024001 / Test123456
Expected: SUCCESS (after fix)
Actual: FAILURE - "No user found for identifier: ST2024001"
```

### Test Case 2: Email Login (CURRENTLY WORKS)

```bash
Input: student@school.edu / Test123456
Expected: SUCCESS
Actual: SUCCESS
```

### Test Case 3: Existing Student Login (SHOULD WORK)

```bash
Input: 202660001 / <password>
Expected: SUCCESS
Actual: Unknown (need to verify password setup)
```

---

## Unresolved Questions

1. **User Creation Process:** Where was `student@school.edu` created? Why wasn't a `students` record created?
   - Likely created via Supabase Auth directly
   - Need to check if there's a trigger or manual seed script

2. **Student Code Format:** Why do some students use `202660001` and others `ST2024...`?
   - Need to verify expected student code format
   - May be a data migration issue

3. **Password Setup:** Does `ST2024001` / `Test123456` match any actual user?
   - Current test user uses `student@school.edu` in Supabase Auth
   - Need to verify which identifier maps to which auth user

---

## Recommendations

### Immediate Actions

1. ✅ **Create missing student record** for the test user
2. ✅ **Verify login works** with both code and email
3. ✅ **Document student creation process** to prevent recurrence

### Long-term Fixes

1. Add database constraint or trigger to ensure every `profiles` record with `role='student'` has a corresponding `students` record
2. Update user signup/creation flow to atomically create both records
3. Add admin tools to manage student codes and profile linkage

---

## Conclusion

**The authentication code is CORRECT.** The issue is **MISSING DATA**: the test user `student@school.edu` exists in `profiles` but has NO corresponding `students` record with `student_code='ST2024001'`.

**Fix:** Insert the missing `students` record to link the profile to the student code.
