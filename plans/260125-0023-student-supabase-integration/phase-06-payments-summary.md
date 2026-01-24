# Phase 06: Payments & Summary

**Status:** Pending
**Priority:** Medium
**Dependencies:** Phase 01

## Context

Links: [plan.md](plan.md) | [phase-01-setup-core-data.md](phase-01-setup-core-data.md)

## Overview

Implement payment/invoice loading and academic summary screens. These are lower priority but complete the full student experience.

## Key Insights

1. Payments come from `invoices` and `payment_transactions` tables
2. Summary screen aggregates data from grades, attendance, comments
3. Need to calculate summary statistics
4. Payment status tracking is important

## Requirements

### Functional Requirements
- [ ] Load invoices/payments from Supabase
- [ ] Display payment status correctly
- [ ] Load teacher comments for summary
- [ ] Calculate summary statistics
- [ ] Show academic performance overview

### Technical Requirements
- Aggregate data from multiple tables
- Calculate averages and percentages
- Handle missing data gracefully

## Architecture

**Payments Query:**
```
invoices
  → payment_transactions (payment history)
```

**Summary Data:**
```
grades → calculate averages
attendance → calculate percentage
student_comments → load recent comments
```

## Related Code Files

- `apps/mobile/src/screens/student/Payment.tsx` - Payment screen
- `apps/mobile/src/screens/student/Summary.tsx` - Summary screen
- `apps/mobile/src/screens/student/TeacherFeedback.tsx` - Comments screen

## Implementation Steps

### Payments

1. **Create Payment Queries** (`src/lib/supabase/queries/payments.ts`)
   ```typescript
   export async function getStudentInvoices(
     studentId: string
   ): Promise<Invoice[]>

   export async function getPaymentHistory(
     invoiceId: string
   ): Promise<PaymentTransaction[]>
   ```

2. **Update Student Store**
   - Replace `MOCK_INVOICES` in `loadInvoices()`

3. **Update Payment Screen**
   - Display invoice list
   - Show payment status
   - Calculate totals

### Summary & Comments

1. **Create Summary Queries** (`src/lib/supabase/queries/summary.ts`)
   ```typescript
   export async function getStudentSummary(
     studentId: string
   ): Promise<StudentSummary>

   export async function getStudentComments(
     studentId: string
   ): Promise<StudentComment[]>
   ```

2. **Update Summary Screen**
   - Calculate overall GPA
   - Show attendance summary
   - Display recent comments

3. **Update Comments Screen**
   - Load teacher comments
   - Filter by comment type
   - Show subject context

## Todo List

- [ ] Create payment queries
- [ ] Create summary queries
- [ ] Create comments queries
- [ ] Update payment screen
- [ ] Update summary screen
- [ ] Update comments screen
- [ ] Test all screens with real data

## Success Criteria

- [ ] Payment screen shows real invoices
- [ ] Payment status displays correctly
- [ ] Summary calculates GPA correctly
- [ ] Attendance percentage accurate
- [ ] Teacher comments load and display
- [ ] All screens handle empty data

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex summary calculation | Medium | Test with various data scenarios |
| Missing payment history | Low | Show pending status |
| No comments from teachers | Low | Show empty state |

## Database Queries

**Invoices Query:**
```sql
SELECT
  id,
  invoice_number,
  name,
  description,
  amount,
  discount_amount,
  total_amount,
  paid_amount,
  status,
  issue_date,
  due_date,
  paid_date
FROM invoices
WHERE student_id = $1
ORDER BY issue_date DESC
```

**Comments Query:**
```sql
SELECT
  sc.id,
  sc.comment_type,
  sc.title,
  sc.content,
  sc.created_at,
  sub.name as subject_name,
  sub.code as subject_code,
  prof.full_name as teacher_name
FROM student_comments sc
LEFT JOIN subjects sub ON sc.subject_id = sub.id
JOIN teachers t ON sc.teacher_id = t.id
JOIN profiles prof ON t.id = prof.id
WHERE sc.student_id = $1
ORDER BY sc.created_at DESC
```

## Summary Statistics Calculation

```typescript
// Calculate from existing grades and attendance data
const summary = {
  overallGPA: calculateGPA(grades),
  attendanceRate: calculateAttendancePercentage(attendance),
  totalSubjects: countUniqueSubjects(grades),
  recentComments: comments.slice(0, 5)
}
```

## Next Steps

After completing this phase:
1. All 9 student screens use real Supabase data
2. Full testing of student experience
3. Document any issues found
4. Consider performance optimizations

## Final Checklist

- [ ] All student screens use real data
- [ ] Loading states work everywhere
- [ ] Error handling is comprehensive
- [ ] RLS policies allow student access
- [ ] Performance is acceptable
- [ ] Offline fallback works (optional)
