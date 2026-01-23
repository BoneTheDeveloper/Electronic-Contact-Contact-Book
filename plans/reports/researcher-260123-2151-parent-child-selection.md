# Parent-Child Selection Research Report

## Current Database Schema Analysis

### Parent-Student Relationship Structure

1. **Existing Tables:**
   - `profiles`: Contains user data with roles (parent, student, teacher, admin)
   - `parents`: Parent-specific data extending profiles
   - `students`: Student-specific data with `guardian_id` field
   - `student_guardians`: Junction table for multi-parent relationships (empty - 0 rows)

2. **Current Relationships:**
   - Simple parent-student link via `students.guardian_id` (single guardian)
   - `student_guardians` table exists but unused
   - No support for multiple guardians per student

### Key Findings

1. **Database Schema:**
   - Supports basic parent-child relationships
   - `student_guardians` table ready for multi-guardian support
   - Currently using `guardian_id` in students table for single guardian

2. **API Implementation:**
   - No existing API queries for fetching parent's children
   - Web app queries.ts focuses on admin/teacher data
   - Mobile app using mock data in parent store

3. **Mobile App Structure:**
   - ChildSelectionScreen component exists and functional
   - Parent store has mock children data structure
   - Navigation includes child selection in home stack

4. **Auth Store:**
   - Parent login via phone/email lookup
   - Profile retrieval works correctly
   - No parent-specific data loading post-auth

## Current Implementation Status

### ✅ Existing Components
- ChildSelectionScreen (UI complete)
- Parent navigation structure
- Mock data structure in parent store

### ❌ Missing Implementation
- Real API queries to fetch parent's children
- Database population of student_guardians
- Integration of selection with auth flow
- Child context switching throughout app

### 🔧 Issues Identified
1. **Database:** student_guardians empty, no sample data
2. **API:** No routes to fetch parent's children
3. **Mobile:** Using mock data instead of real queries
4. **Integration:** No child selection persistence

## Recommended Implementation Plan

### 1. Database Schema Updates

Option A: Keep simple approach (using existing guardian_id)
```sql
-- Update students table to support multiple guardians
ALTER TABLE students ADD COLUMN parent_ids UUID[];

-- Or populate student_guardians with sample data
INSERT INTO student_guardians (student_id, guardian_id, is_primary)
VALUES
  ('student-id-1', 'parent-id-1', true),
  ('student-id-2', 'parent-id-1', false);
```

Option B: Use junction table exclusively
```sql
-- Create migration to populate student_guardians
-- Move existing guardian_id relationships to junction table
```

### 2. API Queries Implementation

```typescript
// Mobile app - Real query to fetch parent's children
export const getParentChildren = async (parentId: string): Promise<ChildData[]> => {
  const { data, error } = await supabase
    .from('student_guardians')
    .select(`
      student_id,
      is_primary,
      students!inner(
        id,
        student_code,
        profiles!inner(
          full_name,
          avatar_url
        )
      )
    `)
    .eq('guardian_id', parentId)
    .eq('students.profiles.status', 'active');

  if (error) throw error;

  return data.map(item => ({
    id: item.students.id,
    name: item.students.profiles.full_name,
    studentCode: item.students.student_code,
    isPrimary: item.is_primary,
    // ... other fields
  }));
};
```

### 3. Mobile Store Integration

```typescript
// Update auth store to load children after login
// Update parent store to use real API
// Add child selection persistence
```

### 4. Navigation Flow

1. Parent login → Load children → Store selected child
2. Dashboard shows data for selected child
3. Child selection accessible via header/profile
4. All parent screens filter by selected child

### 5. Quick Implementation Steps

1. **Populate sample data in student_guardians**
2. **Create API query function for mobile**
3. **Replace mock data in parent store**
4. **Add child selection to auth flow**
5. **Update dashboard to use selected child**

## Unresolved Questions

1. Should we support multiple parents per student or focus on single guardian?
2. How to handle primary vs secondary guardian permissions?
3. Should child selection persist across app sessions?
4. Need to decide between guardian_id vs student_guardians approach