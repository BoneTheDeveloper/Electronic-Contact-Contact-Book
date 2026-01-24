# Phase 01: Setup & Core Data

**Status:** Pending
**Priority:** High
**Dependencies:** None

## Context

Links: [plan.md](plan.md)

## Overview

Set up the Supabase client for the mobile app and implement core student data loading. This phase establishes the foundation for all subsequent phases.

## Key Insights

1. Supabase database already has all required tables with proper schemas
2. RLS (Row Level Security) is enabled on most tables
3. Need to verify RLS policies allow students to read their own data
4. Mobile app needs direct Supabase client integration

## Requirements

### Functional Requirements
- [ ] Install and configure `@supabase/supabase-js` package
- [ ] Create Supabase client singleton for mobile app
- [ ] Create database query utilities for student data
- [ ] Implement student profile loading from `profiles` + `students` tables
- [ ] Add loading states and error handling
- [ ] Update student store to use real Supabase queries

### Technical Requirements
- Use `@supabase/supabase-js` directly (no API proxy)
- Maintain backward compatibility with existing store interface
- Handle network errors gracefully
- Support offline fallback (keep mock data option)

## Architecture

```
apps/mobile/
├── src/
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client singleton
│   │       ├── queries/
│   │       │   ├── students.ts    # Student profile queries
│   │       │   ├── grades.ts      # Grade queries
│   │       │   ├── attendance.ts  # Attendance queries
│   │       │   └── schedules.ts   # Schedule queries
│   │       └── types.ts           # Shared types
│   └── stores/
│       └── student.ts             # Updated to use Supabase
```

## Related Code Files

- `apps/mobile/package.json` - Add supabase-js dependency
- `apps/mobile/src/stores/student.ts` - Student store (lines 1-319)
- `apps/mobile/src/screens/student/Dashboard.tsx` - Dashboard screen

## Implementation Steps

1. **Install Dependencies**
   ```bash
   cd apps/mobile
   npx expo install @supabase/supabase-js
   ```

2. **Create Supabase Client** (`src/lib/supabase/client.ts`)
   - Initialize Supabase client with environment variables
   - Export singleton instance

3. **Create Database Query Functions** (`src/lib/supabase/queries/students.ts`)
   - `getStudentProfile(studentId)` - Load student profile with class info
   - `getStudentEnrollment(studentId)` - Get current class enrollment
   - Join `profiles`, `students`, `enrollments`, `classes`, `grades` tables

4. **Update Student Store** (`src/stores/student.ts`)
   - Replace `MOCK_STUDENT_DATA` with Supabase query
   - Update `loadStudentData()` to use real query
   - Keep mock data as development fallback

5. **Add Environment Variables**
   - Add `EXPO_PUBLIC_SUPABASE_URL` to `.env`
   - Add `EXPO_PUBLIC_SUPABASE_ANON_KEY` to `.env`

## Todo List

- [ ] Install @supabase/supabase-js package
- [ ] Create Supabase client configuration
- [ ] Create student profile query function
- [ ] Update student store with real data loading
- [ ] Test with real student account
- [ ] Verify RLS policies allow student data access
- [ ] Add error handling for failed queries

## Success Criteria

- [ ] Student profile loads from Supabase with correct name, class, grade
- [ ] Loading states display correctly
- [ ] Errors are caught and displayed to user
- [ ] RLS policies allow student to read their own data
- [ ] Mock data fallback still works for development

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| RLS blocks student data | High | Verify RLS policies before implementation |
| Missing environment variables | Medium | Provide clear setup documentation |
| Network timeouts | Low | Add retry logic and timeout handling |

## Security Considerations

- Ensure anon key has proper RLS policies
- Never expose service_role key in mobile app
- Use student's auth session (JWT) for RLS
- Validate all data from Supabase before using

## Next Steps

After completing this phase:
1. Move to [phase-02-grades-attendance.md](phase-02-grades-attendance.md)
2. Test student data loading with real accounts
3. Document any RLS policy issues found
