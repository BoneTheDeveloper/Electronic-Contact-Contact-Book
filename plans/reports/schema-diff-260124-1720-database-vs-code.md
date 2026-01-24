# Database Schema Diff: Migrations vs Code Expectations

**Date:** 2026-01-24
**Project:** School Management System
**Analysis:** Production database schema vs code expectations

---

## Executive Summary

The production database schema differs significantly from what the code expects. TypeScript errors indicate columns that don't exist per the migration files, suggesting either:

1. **Production DB was created with different schema** than migrations
2. **Migrations were never applied to production**
3. **Code was written against a different schema version**

---

## Critical Schema Mismatches

### 1. `students` Table

| Expected by Code | Migration Schema | Status |
|------------------|------------------|--------|
| `id` | `id UUID PRIMARY KEY` | ✅ Match |
| `student_code` | `student_code TEXT UNIQUE` | ✅ Match |
| `grade` | ❌ **NOT IN MIGRATION** | ⚠️ Missing |
| `section` | ❌ **NOT IN MIGRATION** | ⚠️ Missing |
| `class_id` | ❌ **NOT IN MIGRATION** | ⚠️ Missing |
| `date_of_birth` | `date_of_birth DATE` | ✅ Match |
| `gender` | `gender TEXT` | ✅ Match |
| `address` | `address TEXT` | ✅ Match |
| `enrollment_date` | `enrollment_date DATE` | ✅ Match |
| `guardian_id` | `guardian_id UUID REFERENCES profiles` | ✅ Match |

**How to get grade/class from migration schema:**
```sql
-- Correct query per migrations
students
  -> enrollments (student_id, class_id)
    -> classes (id, grade_id)
      -> grades (id, name)
```

### 2. `profiles` Table

| Expected by Code | Migration Schema | Status |
|------------------|------------------|--------|
| `id` | `id UUID PRIMARY KEY` | ✅ Match |
| `email` | `email TEXT NOT NULL` | ✅ Match |
| `role` | `role TEXT NOT NULL` | ✅ Match |
| `full_name` | `full_name TEXT` | ✅ Match |
| `student_id` | ❌ **NOT IN MIGRATION** | ⚠️ Missing |
| `phone` | `phone TEXT` | ✅ Match |
| `avatar_url` | `avatar_url TEXT` | ✅ Match |
| `status` | `status TEXT DEFAULT 'active'` | ✅ Match |

**Relationship per migration:**
- `students.id REFERENCES profiles(id)` - NOT a column on profiles

---

## Affected Code Locations

### Files Expecting `students.grade`
```
apps/web/app/api/student-guardians/route.ts:82 - .select(`grade`)
apps/web/app/api/student-guardians/route.ts:115 - grade: s.grade
apps/web/app/student/dashboard/page.tsx:31 - Property 'grade'
apps/mobile/src/lib/supabase/queries.ts:80 - grade: parseInt(...)
```

### Files Expecting `students.class_id`
```
apps/web/app/api/student-guardians/route.ts:84 - .select(`class_id`)
apps/web/app/api/student-guardians/route.ts:114 - classId: s.class_id
```

### Files Expecting `students.section`
```
apps/web/app/api/student-guardians/route.ts:83 - .select(`section`)
apps/web/app/api/student-guardians/route.ts:116 - section: s.section
apps/mobile/src/lib/supabase/queries.ts:79 - section: ''
```

### Files Expecting `profiles.student_id`
```
apps/web/app/student/layout.tsx:50,57,62 - Property 'student_id'
```

---

## Root Cause Analysis

### Evidence from TypeScript Errors

```
error TS2339: Property 'grade' does not exist on type 'SelectQueryError<"column 'grade' does not exist on 'students'.">'
```

This indicates the **production database** (via project ID) confirms:
- `grade` column does NOT exist on `students` table
- `student_id` column does NOT exist on `profiles` table

### Conclusion

**The codebase was written against an older/different database schema.**

The migrations in `supabase/migrations/` represent the current intended schema, but the code expects a denormalized schema where:
- Students have `grade`, `section`, `class_id` directly
- Profiles have `student_id` column

---

## Resolution Options

### Option A: Update Database (Add columns to production)

**Pros:**
- Code works as-is
- Minimal code changes

**Cons:**
- Denormalized schema (data duplication)
- Need migration to add columns
- May break other assumptions

**Migration needed:**
```sql
ALTER TABLE students ADD COLUMN grade TEXT;
ALTER TABLE students ADD COLUMN section TEXT;
ALTER TABLE students ADD COLUMN class_id TEXT;
ALTER TABLE profiles ADD COLUMN student_id UUID;
```

### Option B: Update Code (Match migrations)

**Pros:**
- Follows intended normalized schema
- Better data integrity
- No DB changes needed

**Cons:**
- Many query updates required
- Need to join through `enrollments`

**Code changes:**
```typescript
// OLD (denormalized)
.select(`id, student_code, grade, class_id`)

// NEW (normalized per migrations)
.select(`
  id,
  student_code,
  enrollments!inner(
    class_id,
    classes!inner(
      grade_id,
      grades!inner(name)
    )
  )
`)
```

---

## Recommendation

**Option B: Update code to match migrations**

The migration schema is properly designed with:
- Normalized data structure
- Proper foreign key relationships
- Students can have multiple enrollments over time

The code should query via the `enrollments` junction table.

---

## Next Steps

1. **Choose approach** (A or B)
2. **If B**: Update queries to use proper joins
3. **Regenerate types** after changes
4. **Verify** all TypeScript errors resolved

---

## Unresolved Questions

1. Why does production DB not match migrations?
2. Were migrations ever applied to production?
3. Is there a separate production migration branch?
