# Phase 05: Payment Screens

**Status:** Pending
**Priority:** Medium
**Dependencies:** Phase 01, Phase 02

## Overview

Implement payment overview and payment detail screens. Students can view their invoices, payment status, and initiate payments.

## Context Links

- [Payment Overview Wireframe](../../../docs/wireframe/Mobile/student/payment-overview.html)
- [Payment Detail Wireframe](../../../docs/wireframe/Mobile/student/payment-detail.html)
- [Design Guidelines](../../../docs/mobile_function/web-student-portal-design.md#5-payment-screens)

## Key Insights

1. Two screens: Overview list and Detail view
2. Payment status: unpaid, partial, paid
3. Full/partial payment option
4. Dark gradient card for total debt

## Requirements

### Payment Overview (`/student/payments`)
- Student info card
- Total debt summary (dark gradient card)
- Invoice list with status badges
- Filter tabs (All, Unpaid, Partial, Paid)

### Payment Detail (`/student/payments/[id]`)
- Invoice header info
- Fee items breakdown
- Payment type selection (Full | Partial)
- Partial amount input
- Payment button

## Implementation Steps

### Step 1: Payment Overview Page

**Data Structure:**
```tsx
interface Invoice {
  id: string;
  invoiceNumber: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  status: 'unpaid' | 'partial' | 'paid';
  dueDate: Date;
  paymentDate?: Date;
  feeItems: FeeItem[];
}
```

**Components:**
1. `StudentInfoCard` - Avatar, name, class, MHS
2. `TotalDebtCard` - Dark gradient, large amount
3. `InvoiceCard` - Individual invoice with status
4. `FilterTabs` - All/Unpaid/Partial/Paid

**Status Badges:**
- Unpaid: red-100 bg, red-600 text
- Partial: orange-100 bg, orange-600 text
- Paid: green-100 bg, green-600 text

### Step 2: Payment Detail Page

**Data Structure:**
```tsx
interface FeeItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'required' | 'optional';
}

interface DiscountItem {
  id: string;
  name: string;
  amount: number;  // Negative value
  description: string;
}
```

**Components:**
1. `InvoiceInfoCard` - Invoice details
2. `FeeItemsList` - Read-only fee breakdown
3. `PaymentTypeSelector` - Full | Partial radio
4. `PartialPaymentInput` - Amount field with validation
5. `PaymentSummary` - Total, proceed button
6. `NoteCard` - Payment instructions

**Payment Flow:**
1. Select payment type (Full/Partial)
2. If Partial: enter amount, show remaining
3. Validate amount (min, max)
4. Click "Tiếp tục thanh toán"
5. Redirect to payment method

## Related Code Files

- `apps/web/app/admin/payments/page.tsx` - Admin payments reference
- `apps/web/lib/supabase/queries.ts` - Payment queries

## Todo List

### Overview
- [ ] Create payments page structure
- [ ] Build StudentInfoCard component
- [ ] Build TotalDebtCard component
- [ ] Build InvoiceCard with status badges
- [ ] Build FilterTabs component
- [ ] Add click handler to navigate to detail
- [ ] Implement payment fetch from API
- [ ] Add loading/empty states

### Detail
- [ ] Create dynamic route page [id]
- [ ] Build InvoiceInfoCard component
- [ ] Build FeeItemsList component
- [ ] Build PaymentTypeSelector (radio)
- [ ] Build PartialPaymentInput
- [ ] Build PaymentSummary with total
- [ ] Add validation for partial amount
- [ ] Add payment button handler

### Testing
- [ ] Test unpaid invoice display
- [ ] Test partial payment flow
- [ ] Test paid invoice display
- [ ] Test amount validation
- [ ] Test navigation between screens

## Success Criteria

- [ ] Overview shows all invoices correctly
- [ ] Status badges display correctly
- [ ] Click invoice → Navigate to detail
- [ ] Detail shows correct invoice data
- [ ] Payment type selection works
- [ ] Partial payment input validates correctly
- [ ] Payment button enables when valid
- [ ] No TypeScript errors

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Invalid invoice ID | Medium | Show 404 state |
| Payment amount errors | High | Server-side validation |
| Concurrent payments | Low | Lock invoice on payment start |

## Security Considerations

1. Students can only view their own invoices
2. Payment amounts validated server-side
3. Payment integration uses secure tokens
4. No direct payment processing (external gateway)

## Next Steps

Once this phase is complete, proceed to [Phase 06: Communication Screens](phase-06-communication-screens.md)
