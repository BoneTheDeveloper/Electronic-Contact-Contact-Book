# Phase 04: Leave Requests & Appeals

**Status:** Pending
**Priority:** Medium
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md) | [phase-01-setup-core-data.md](phase-01-setup-core-data.md)

## Overview

Implement CREATE and UPDATE operations for leave requests and grade appeals. This is the first phase involving POST/PUT mutations to Supabase.

## Key Insights

1. Leave requests require INSERT to `leave_requests` table
2. Grade appeals can be stored in `leave_requests` or separate table
3. Need to handle file uploads for leave request attachments
4. Existing UI has complete forms for both features

## Requirements

### Functional Requirements
- [ ] Create new leave requests in Supabase
- [ ] Load leave request history
- [ ] Update pending leave requests (edit)
- [ ] Create grade appeals
- [ ] Upload attachment files (optional)

### Technical Requirements
- Implement POST mutations
- Handle file upload to Supabase Storage
- Implement optimistic UI updates
- Handle network errors for mutations

## Architecture

**Leave Request Flow:**
```
UI Form → Validate → POST to leave_requests → Update Store → Refresh List
```

**Grade Appeal Flow:**
```
UI Form → Validate → POST to grade_appeals → Show Success Message
```

## Related Code Files

- `apps/mobile/src/screens/student/LeaveRequest.tsx` - Leave request screen (lines 1-1187)
- `apps/mobile/src/screens/student/Grades.tsx` - Grade appeal modal (lines 384-510)

## Implementation Steps

### Leave Requests

1. **Create Leave Request Mutations** (`src/lib/supabase/mutations/leave-requests.ts`)
   ```typescript
   export async function createLeaveRequest(
     studentId: string,
     data: LeaveRequestInput
   ): Promise<LeaveRequest>

   export async function updateLeaveRequest(
     requestId: string,
     data: Partial<LeaveRequestInput>
   ): Promise<LeaveRequest>

   export async function getLeaveRequests(
     studentId: string
   ): Promise<LeaveRequest[]>
   ```

2. **Update Student Store**
   - Add `createLeaveRequest()` action
   - Add `updateLeaveRequest()` action
   - Add `loadLeaveRequests()` action
   - Handle loading/error states

3. **Update Leave Request Screen**
   - Wire up form submit to store action
   - Handle success/error responses
   - Refresh list after create/update

### Grade Appeals

1. **Create Appeal Mutations** (`src/lib/supabase/mutations/appeals.ts`)
   ```typescript
   export async function createGradeAppeal(
     studentId: string,
     gradeEntryId: string,
     reason: string,
     detail: string
   ): Promise<Appeal>
   ```

2. **Update Grades Screen**
   - Wire up appeal form submit
   - Show success message
   - Update local state

## Todo List

- [ ] Create leave request mutations
- [ ] Create grade appeal mutations
- [ ] Update student store with mutations
- [ ] Wire up leave request form
- [ ] Wire up grade appeal form
- [ ] Add error handling for mutations
- [ ] Test creating leave requests
- [ ] Test creating appeals

## Success Criteria

- [ ] Can create new leave request
- [ ] Leave request saves to Supabase
- [ ] Can edit pending leave requests
- [ ] Can create grade appeal
- [ ] Grade appeal saves to Supabase
- [ ] Success messages display correctly
- [ ] Errors are caught and displayed
- [ ] Lists refresh after mutations

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| File upload fails | Medium | Allow requests without files, retry logic |
| Duplicate requests | Low | Add debouncing on submit button |
| RLS blocks mutations | High | Verify RLS policies allow inserts |

## Database Mutations

**Create Leave Request:**
```sql
INSERT INTO leave_requests (
  student_id,
  class_id,
  request_type,
  start_date,
  end_date,
  reason,
  status,
  created_by
) VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
```

**Create Grade Appeal:**
```sql
-- Option 1: Use leave_requests table with special type
INSERT INTO leave_requests (
  student_id,
  request_type,
  reason,
  status
) VALUES ($1, 'appeal', $2, 'pending')

-- Option 2: Create separate grade_appeals table
INSERT INTO grade_appeals (
  grade_entry_id,
  student_id,
  reason,
  detail,
  status
) VALUES ($1, $2, $3, $4, 'pending')
```

## Next Steps

After completing this phase:
1. Move to [phase-05-news-notifications.md](phase-05-news-notifications.md)
2. Students can now create data, not just read
3. Test full CRUD flow

## Unresolved Questions

- Should grade appeals use existing `leave_requests` table or new table?
- How to handle file uploads to Supabase Storage?
