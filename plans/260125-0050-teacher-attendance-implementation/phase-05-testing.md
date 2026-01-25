# Phase 05: Testing

**Status:** Pending
**Priority:** Medium
**Dependencies:** Phase 01, Phase 02, Phase 03, Phase 04

## Context

Links: [plan.md](plan.md)

## Overview

Comprehensive testing of the teacher attendance feature including unit tests, integration tests, and end-to-end user testing. Ensures all functionality works correctly across different teacher roles and scenarios.

## Key Insights

1. Need to test both homeroom and subject teacher flows
2. Must verify RLS policies work correctly
3. Need to test notification delivery
4. Performance testing for large classes
5. Edge case testing (empty classes, all absent, etc.)

## Requirements

### Testing Requirements
- [ ] Unit tests for query functions
- [ ] Unit tests for notification service
- [ ] Integration tests for API routes
- [ ] E2E tests for homeroom teacher flow
- [ ] E2E tests for subject teacher flow
- [ ] Notification delivery tests
- [ ] Performance tests
- [ ] RLS policy verification
- [ ] Error handling tests

## Test Scenarios

### Scenario 1: Homeroom Teacher Attendance Flow

**Setup:**
- Teacher is homeroom for class 6A
- Class has 30 students
- 2 students have approved leave requests
- Current date and morning session

**Test Steps:**
1. Login as homeroom teacher
2. Navigate to attendance page
3. Select class 6A
4. Verify all 30 students load
5. Verify 2 students show "Đã duyệt đơn nghỉ" badge
6. Click "Tự động điền đơn nghỉ phép"
7. Verify 2 students auto-filled with "E" status
8. Click "Đánh dấu tất cả có mặt"
9. Verify all students marked "P"
10. Change 3 students to "A", 2 to "L"
11. Add notes for absent students
12. Click "Xác nhận hoàn thành"
13. Verify attendance saved to database
14. Verify 5 notifications sent to guardians

**Expected Results:**
- All 30 students displayed
- Approved leave badges shown correctly
- Auto-fill marks excused students
- Stats update in real-time (30 total, 27 present, 5 absent/late)
- Attendance records saved with correct status
- Notifications sent to guardians of absent/late students

### Scenario 2: Subject Teacher Attendance Flow

**Setup:**
- Teacher teaches Math for classes 7A, 8B, 9C
- Teacher is scheduled for period 3 on Tuesday
- Select class 7A, period 3

**Test Steps:**
1. Login as subject teacher
2. Navigate to attendance page
3. Verify only classes taught by teacher shown (7A, 8B, 9C)
4. Click class 7A
5. Verify period selector shows (not session)
6. Select period 3
7. Verify students load
8. Mark attendance for period 3
9. Confirm attendance

**Expected Results:**
- Only assigned classes displayed
- No "Chủ nhiệm" badge on class cards
- Period selector available (not session)
- Attendance saved with period_id = 3
- No attendance affected for other periods

### Scenario 3: Leave Request Integration

**Setup:**
- Student has approved leave request for today
- Teacher marks attendance

**Test Steps:**
1. Load attendance form
2. Verify student shows "Đã duyệt đơn nghỉ" badge
3. Click "Tự động điền đơn nghỉ phép"
4. Verify student status set to "E"
5. Verify note auto-filled with "Đơn nghỉ phép đã duyệt"
6. Confirm attendance
7. Verify NO notification sent to guardian (excused absence)

**Expected Results:**
- Approved leave requests pre-identified
- Auto-fill works correctly
- Excused absences don't trigger notifications

### Scenario 4: Parent Notification Delivery

**Setup:**
- 3 students marked absent
- Student A: 1 guardian (mother)
- Student B: 2 guardians (mother + father)
- Student C: 1 guardian (father)

**Test Steps:**
1. Mark A, B, C as absent
2. Confirm attendance
3. Check notification_recipients table
4. Verify 4 notifications created (1 for A, 2 for B, 1 for C)
5. Verify notification_logs entries for WebSocket delivery
6. Verify notification category = "emergency"
7. Verify notification priority = "high"

**Expected Results:**
- Correct number of notifications created
- Each guardian receives notification
- Notification content includes student names
- Emergency priority for absent students

### Scenario 5: Concurrent Attendance Editing

**Setup:**
- Two homeroom teachers for same class (rare edge case)

**Test Steps:**
1. Teacher A opens attendance form
2. Teacher B opens attendance form
3. Both mark attendance simultaneously
4. Both confirm

**Expected Results:**
- Last write wins (supabase upsert behavior)
- No data corruption
- Both can complete their operations
- recorded_by reflects last confirmer

### Scenario 6: Error Handling

**Test Steps:**
1. Test with invalid classId
2. Test with future date
3. Test with network error during save
4. Test with notification service down
5. Test with malformed attendance data

**Expected Results:**
- Clear error messages displayed
- Graceful degradation (attendance saved, notifications logged)
- No data loss
- User can retry

## Test Cases

### Unit Tests

**File:** `apps/web/lib/__tests__/queries/attendance.test.ts`

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals'
import { createClient } from '@supabase/supabase-js'

describe('Attendance Queries', () => {
  let supabase: any

  beforeEach(() => {
    supabase = createClient(/* test config */)
  })

  describe('getClassAttendance', () => {
    it('should return attendance records for class on date', async () => {
      const results = await getClassAttendance(supabase, 'class-123', '2026-01-25')
      expect(results).toBeInstanceOf(Array)
      expect(results[0]).toHaveProperty('student_id')
      expect(results[0]).toHaveProperty('status')
    })

    it('should filter by period if provided', async () => {
      const results = await getClassAttendance(supabase, 'class-123', '2026-01-25', 3)
      expect(results.every(r => r.period_id === 3)).toBe(true)
    })

    it('should return empty array if no attendance found', async () => {
      const results = await getClassAttendance(supabase, 'nonexistent', '2026-01-25')
      expect(results).toEqual([])
    })
  })

  describe('saveAttendanceRecords', () => {
    it('should save multiple attendance records', async () => {
      const records = [
        { student_id: 's1', class_id: 'c1', date: '2026-01-25', status: 'present', recorded_by: 't1' },
        { student_id: 's2', class_id: 'c1', date: '2026-01-25', status: 'absent', recorded_by: 't1' },
      ]

      await expect(saveAttendanceRecords(supabase, records)).resolves.not.toThrow()
    })

    it('should upsert existing records', async () => {
      // First insert
      const records = [{ student_id: 's1', class_id: 'c1', date: '2026-01-25', period_id: null, status: 'present', recorded_by: 't1' }]
      await saveAttendanceRecords(supabase, records)

      // Update status
      records[0].status = 'absent'
      await saveAttendanceRecords(supabase, records)

      // Verify only one record exists with new status
      const results = await getClassAttendance(supabase, 'c1', '2026-01-25')
      const studentRecord = results.find(r => r.student_id === 's1')
      expect(studentRecord?.status).toBe('absent')
    })
  })

  describe('getAttendanceStats', () => {
    it('should calculate correct statistics', async () => {
      const stats = await getAttendanceStats(supabase, 'class-123', '2026-01-25')

      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('present')
      expect(stats).toHaveProperty('absent')
      expect(stats).toHaveProperty('late')
      expect(stats).toHaveProperty('excused')
      expect(stats.total).toBe(stats.present + stats.absent + stats.late + stats.excused)
    })
  })
})
```

### Unit Tests for Teacher Queries

**File:** `apps/web/lib/__tests__/queries/teachers.test.ts`

```typescript
describe('Teacher Queries', () => {
  describe('getTeacherClasses', () => {
    it('should return homeroom classes', async () => {
      const classes = await getTeacherClasses(supabase, 'teacher-homeroom-id')
      const homeroomClasses = classes.filter(c => c.isHomeroom)

      expect(homeroomClasses.length).toBeGreaterThan(0)
      expect(homeroomClasses[0].isSubject).toBe(false)
    })

    it('should return subject classes from schedule', async () => {
      const classes = await getTeacherClasses(supabase, 'teacher-subject-id')
      const subjectClasses = classes.filter(c => c.isSubject)

      expect(subjectClasses.length).toBeGreaterThan(0)
      expect(subjectClasses[0].subject).toBeDefined()
    })

    it('should merge classes for dual-role teachers', async () => {
      const classes = await getTeacherClasses(supabase, 'teacher-dual-role-id')
      const dualRoleClass = classes.find(c => c.isHomeroom && c.isSubject)

      expect(dualRoleClass).toBeDefined()
    })
  })

  describe('isHomeroomTeacher', () => {
    it('should return true for homeroom teachers', async () => {
      const result = await isHomeroomTeacher(supabase, 'teacher-homeroom-id', 'class-6a')
      expect(result).toBe(true)
    })

    it('should return false for subject teachers', async () => {
      const result = await isHomeroomTeacher(supabase, 'teacher-subject-id', 'class-6a')
      expect(result).toBe(false)
    })
  })
})
```

### Integration Tests

**File:** `apps/web/app/api/__tests__/teacher/attendance.test.ts`

```typescript
import { POST, GET } from '../teacher/attendance/route'

describe('Attendance API', () => {
  it('GET should return attendance for class', async () => {
    const request = new Request(
      'http://localhost:3000/api/teacher/attendance?classId=class-123&date=2026-01-25'
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('stats')
  })

  it('POST should save attendance records', async () => {
    const request = new Request('http://localhost:3000/api/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify({
        classId: 'class-123',
        date: '2026-01-25',
        records: [
          { studentId: 's1', status: 'present' },
          { studentId: 's2', status: 'absent' },
        ],
        teacherId: 'teacher-123',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('POST should return 400 for invalid data', async () => {
    const request = new Request('http://localhost:3000/api/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })
})
```

## Performance Tests

### Large Class Performance

**Test:**
- Load attendance for class with 100 students
- Mark all students as present
- Measure render time and interaction latency

**Benchmarks:**
- Initial render: < 1s
- Status button click: < 50ms
- Mark all present: < 500ms
- Save attendance: < 1s

### Query Performance

**Test:**
- Measure database query times
- Test with varying class sizes
- Verify index usage

**Benchmarks:**
- getClassAttendance: < 100ms for 100 students
- getTeacherClasses: < 50ms
- saveAttendanceRecords: < 200ms for 100 records

## RLS Policy Verification

### Test Access Controls

1. **Teacher can view own classes:**
   ```sql
   -- Should return rows
   SELECT * FROM class_teachers WHERE teacher_id = 'test-teacher-id';
   ```

2. **Teacher cannot view other teachers' classes:**
   ```sql
   -- Should return 0 rows with RLS
   SELECT * FROM class_teachers WHERE teacher_id = 'other-teacher-id';
   ```

3. **Teacher can manage attendance for assigned classes:**
   ```sql
   -- Should succeed
   INSERT INTO attendance (...) VALUES (...);
   ```

4. **Teacher cannot modify attendance for unassigned classes:**
   ```sql
   -- Should fail with RLS
   INSERT INTO attendance (class_id, ...) VALUES ('other-class', ...);
   ```

## Manual Testing Checklist

### Homeroom Teacher
- [ ] Login as homeroom teacher
- [ ] View class list
- [ ] Select class
- [ ] View all students
- [ ] Mark attendance
- [ ] Use auto-fill for approved leaves
- [ ] Save draft
- [ ] Confirm attendance
- [ ] Verify notifications sent

### Subject Teacher
- [ ] Login as subject teacher
- [ ] View assigned classes only
- [ ] Select period
- [ ] Mark attendance for period
- [ ] Verify period-specific records saved

### Edge Cases
- [ ] Empty class (0 students)
- [ ] All students absent
- [ ] All students have approved leaves
- [ ] Concurrent attendance edits
- [ ] Network error during save
- [ ] Notification service unavailable
- [ ] Invalid date format
- [ ] Past/future dates

## Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces status changes
- [ ] Color contrast meets WCAG AA
- [ ] Status buttons have accessible labels
- [ ] Form validation messages are accessible

## Todo List

### Unit Tests
- [ ] Write attendance query tests
- [ ] Write teacher query tests
- [ ] Write notification service tests
- [ ] Write attendance service tests
- [ ] Achieve >80% code coverage

### Integration Tests
- [ ] Test attendance API routes
- [ ] Test confirm API route
- [ ] Test notification creation
- [ ] Test RLS policies

### E2E Tests
- [ ] Homeroom teacher flow
- [ ] Subject teacher flow
- [ ] Leave request integration
- [ ] Notification delivery

### Performance Tests
- [ ] Large class rendering
- [ ] Query performance
- [ ] Bulk operations

### Manual Tests
- [ ] All scenarios from test scenarios
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Accessibility testing

## Success Criteria

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] E2E tests cover critical paths
- [ ] Performance benchmarks met
- [ ] RLS policies verified
- [ ] Manual testing completed
- [ ] No critical bugs found
- [ ] Code coverage > 80%

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test data not representative | Medium | Use realistic data from production-like environment |
| Flaky tests | Low | Isolate tests, use transactions |
| RLS policies too restrictive | High | Test with real teacher accounts early |
| Performance issues discovered late | Medium | Run performance tests early in Phase 01 |

## Next Steps

After completing this phase:
1. Review test results
2. Fix any critical bugs
3. Document known issues
4. Deploy to staging for user acceptance testing

## Unresolved Questions

1. What's the maximum class size to support?
2. Should we add automated regression tests?
3. How often to run performance tests?
4. What's the acceptable notification delivery delay?
