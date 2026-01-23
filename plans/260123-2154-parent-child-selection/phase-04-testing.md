---
title: "Phase 4: Testing & Validation"
description: "Test parent-child selection end-to-end and validate implementation"
status: pending
priority: P1
effort: 1.5h
branch: master
tags: [testing, validation, mobile, manual-testing]
created: 2026-01-23
---

## Overview

Comprehensive testing of parent-child selection functionality across all parent screens and scenarios.

**Context Links:**
- UI Integration: [Phase 3](./phase-03-ui-integration.md)
- Test Parent: Phone `0901234569`
- Test Children: 2-3 students from Phase 1

## Test Environment

### Prerequisites
- Mobile app running (dev build or simulator)
- Test parent account created (0901234569)
- Database populated with 2-3 children (Phase 1)
- API queries implemented (Phase 2)
- UI integrated (Phase 3)

### Test Data
```yaml
Parent:
  phone: "0901234569"
  password: "any" (mock auth)

Children:
  - name: "Nguyen Van B"
    grade: 10
    section: "A"
    is_primary: true

  - name: "Nguyen Thi C"
    grade: 8
    section: "B"
    is_primary: false
```

## Test Cases

### TC1: Parent Login & Initial Load (15 min)

**Steps:**
1. Launch mobile app
2. Enter parent phone: `0901234569`
3. Enter any password
4. Tap login

**Expected Results:**
- [ ] Login succeeds
- [ ] Loading indicator shows briefly
- [ ] Dashboard displays primary child (Nguyen Van B)
- [ ] Child card shows correct name, grade, section
- [ ] 9 service icons display correctly

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC2: Child Selection Screen (15 min)

**Steps:**
1. From dashboard, tap child card
2. Child selection screen opens

**Expected Results:**
- [ ] Screen shows all 2-3 children from DB
- [ ] Primary child has checkmark or highlighted
- [ ] Each child shows: name, class, student code
- [ ] Back button works

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC3: Child Switching (20 min)

**Steps:**
1. From child selection screen
2. Tap different child (not primary)
3. Tap "Xác nhận" (Confirm)
4. Navigate back to dashboard

**Expected Results:**
- [ ] Selected child highlights blue
- [ ] Checkmark appears on selected child
- [ ] Screen navigates back to dashboard
- [ ] Dashboard child card updates to new child
- [ ] Child card shows new child's name/grade

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC4: Persistence Across Sessions (20 min)

**Steps:**
1. Select secondary child
2. Kill app (swipe away/close completely)
3. Relaunch app
4. Login again with same parent

**Expected Results:**
- [ ] App opens to dashboard
- [ ] Dashboard shows same child as before (secondary)
- [ ] No reset to primary child

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC5: Grades Screen (10 min)

**Steps:**
1. Select child A
2. Navigate to Grades (Bảng điểm)
3. Note grades shown
4. Go back, switch to child B
5. Navigate to Grades again

**Expected Results:**
- [ ] Grades screen shows data for selected child
- [ ] Switching child updates grades data
- [ ] Child name appears in header or screen

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC6: Attendance Screen (10 min)

**Steps:**
1. With child A selected
2. Navigate to Attendance (Lịch sử điểm danh)
3. Note attendance data
4. Switch to child B
5. Check attendance again

**Expected Results:**
- [ ] Attendance shows for selected child
- [ ] Data updates when child changes
- [ ] Student info visible on screen

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC7: Schedule Screen (10 min)

**Steps:**
1. Navigate to Schedule (Thời khóa biểu)
2. Verify schedule for selected child
3. Switch child
4. Verify schedule updates

**Expected Results:**
- [ ] Schedule displays for selected child
- [ ] Switching child refreshes schedule

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC8: Payment Overview (10 min)

**Steps:**
1. Navigate to Payment (Học phí)
2. Verify fee data for selected child

**Expected Results:**
- [ ] Payment overview shows for selected child
- [ ] Child name visible

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC9: Empty State - No Children (10 min)

**Setup:** Temporarily remove parent's children from DB or use parent with no children

**Steps:**
1. Login as parent with no children
2. Navigate to dashboard

**Expected Results:**
- [ ] Empty state message displays
- [ ] Helpful error: "No children found. Please contact administration."
- [ ] App doesn't crash

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC10: Error Handling (10 min)

**Setup:** Turn off network or break Supabase connection

**Steps:**
1. Open app
2. Login as parent
3. Observe behavior

**Expected Results:**
- [ ] Error message displays
- [ ] Helpful text: "Failed to load children. Please check your connection."
- [ ] App doesn't crash
- [ ] Retry option available (implicit via login again)

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC11: Single Child Edge Case (10 min)

**Setup:** Parent with only one child

**Steps:**
1. Login as parent with 1 child
2. Check dashboard behavior

**Expected Results:**
- [ ] Dashboard shows the only child
- [ ] Child card still tappable
- [ ] Selection screen shows 1 child
- [ ] No crashes or errors

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

### TC12: Type Safety (5 min)

**Steps:**
1. Run TypeScript compiler
2. Check for type errors

**Expected Results:**
- [ ] `npm run typecheck` passes
- [ ] No type errors in parent store
- [ ] No type errors in queries
- [ ] No type errors in screens

**Actual Results:** ____________________

**Status:** ☐ Pass ☐ Fail

---

## Performance Testing (Optional)

### Load Time
- [ ] Children load in < 2 seconds
- [ ] Dashboard renders in < 1 second after data load
- [ ] Child switching instant (< 500ms)

### Memory
- [ ] No memory leaks when switching children
- [ ] AsyncStorage operations don't block UI

## Bug Tracking

| Bug ID | Description | Severity | Status |
|--------|-------------|----------|--------|
| BUG-1 | | | |
| BUG-2 | | | |
| BUG-3 | | | |

## Regression Testing

Ensure existing functionality still works:
- [ ] Student login works
- [ ] Teacher login works
- [ ] Admin web portal works
- [ ] Other parent screens (Messages, News, etc.) work

## Sign-off

**Tester:** ____________________
**Date:** ____________________
**Build Version:** ____________________

**Overall Status:** ☐ Pass ☐ Fail ☐ Pass with Minor Issues

**Comments:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

## Success Criteria

- [ ] All 12 test cases pass
- [ ] No critical bugs (severity 1)
- [ ] No more than 2 minor bugs (severity 3)
- [ ] Type safety verified
- [ ] Performance acceptable

## Deliverables

1. Completed test case document (this file)
2. Bug report (if any bugs found)
3. Screenshots/videos of test execution
4. Performance metrics (if collected)

## Next Steps

If all tests pass:
- Create pull request
- Update documentation
- Mark implementation complete

If tests fail:
- Document bugs
- Fix issues
- Re-test
