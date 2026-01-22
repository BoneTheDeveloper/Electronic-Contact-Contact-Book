# Phase 03: Payment/Invoice Modals

**Parent Plan**: [plan.md](../plan.md)
**Dependencies**: [Phase 00](phase-00-shared-infrastructure.md)
**Parallel With**: Phase 01, Phase 02

## Context Links
- Wireframe: `docs/wireframe/Web_app.Admin/payment.html`
- Research: `../research/researcher-payment-invoice-report.md`
- Implementation: `apps/web/components/admin/payments/PaymentsManagement.tsx`

## Parallelization Info

| Aspect | Details |
|--------|---------|
| **Can Run Parallel With** | Phase 01 (User), Phase 02 (Academic) |
| **Must Wait For** | Phase 00 (Shared Infrastructure) |
| **Blocks** | None (independent feature) |
| **Conflicts With** | None (separate files) |

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-22 |
| Description | Implement 6 modals: Fee Item Add/Edit, Payment Confirm, Invoice Detail, Send Reminder, Export Report |
| Priority | P1 |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

1. **Fee Items Table** needs Add/Edit modals with type (mandatory/voluntary)
2. **FeeAssignmentWizard** needs Step 3 timeline + Step 4 review improvements
3. **Invoice Tracker** needs Confirm Payment, Send Reminder, Invoice Detail, Export modals
4. Wireframe shows **step wizard visual** not fully implemented

## Requirements

### 1. AddFeeItemModal (Fee Items Tab)
- Fields: name, code (auto-generated), type (mandatory/voluntary), amount, semester
- Validation: code uniqueness, amount positive
- Wire up to `POST /api/fee-items`

### 2. EditFeeItemModal (Fee Items Table)
- Pre-populate existing fee item data
- Same fields as AddFeeItemModal
- Wire up to `PUT /api/fee-items/:id`

### 3. PaymentConfirmModal (Invoice Tracker)
- Display invoice summary
- Input amount for partial payments
- Show remaining balance
- Confirm action with API call to `POST /api/payments/:id/confirm`

### 4. InvoiceDetailModal (Invoice Tracker)
- Full invoice breakdown
- Payment history timeline
- Student information
- Fee item list with amounts
- Wire up to `GET /api/invoices/:id`

### 5. SendReminderModal (Invoice Tracker)
- Reminder template selection
- Custom message input
- Send date selection
- Recipient preview
- Wire up to `POST /api/payments/:id/reminder`

### 6. ExportReportModal (Invoice Tracker)
- Format selection (PDF, Excel, CSV)
- Date range picker
- Include/exclude options
- Generate/download functionality
- Wire up to `POST /api/invoices/export`

### 7. FeeAssignmentWizard Improvements
- **Step 3**: Add date picker integration with live data preview
- **Step 4**: Add live data population, terms confirmation checkbox

## Architecture

```
payments/
├── modals/
│   ├── AddFeeItemModal.tsx       # Add new fee item
│   ├── EditFeeItemModal.tsx      # Edit existing fee item
│   ├── PaymentConfirmModal.tsx   # Confirm payment with amount
│   ├── InvoiceDetailModal.tsx    # View invoice details
│   ├── SendReminderModal.tsx     # Send payment reminder
│   └── ExportReportModal.tsx     # Export invoices
├── FeeAssignmentWizard.tsx       # UPDATE: Step 3 & 4 improvements
└── PaymentsManagement.tsx        # UPDATE: Modal triggers
```

## Related Code Files (Exclusive Ownership)

### Files to Modify
```
apps/web/components/admin/payments/
├── PaymentsManagement.tsx        # ADD: Modal triggers, action buttons
└── FeeAssignmentWizard.tsx       # UPDATE: Step 3 timeline, Step 4 review
```

### Files to Create (Phase 03 only)
```
apps/web/components/admin/payments/modals/
├── AddFeeItemModal.tsx
├── EditFeeItemModal.tsx
├── PaymentConfirmModal.tsx
├── InvoiceDetailModal.tsx
├── SendReminderModal.tsx
└── ExportReportModal.tsx
```

### Files to Read (Not Modify)
- `apps/web/lib/mock-data.ts` (Invoice type definitions)
- `apps/web/components/admin/shared/*` (BaseModal, buttons, forms)

## File Ownership

| File | Owner | Phase |
|------|-------|-------|
| `payments/modals/AddFeeItemModal.tsx` | Phase 03 | 03 (only) |
| `payments/modals/EditFeeItemModal.tsx` | Phase 03 | 03 (only) |
| `payments/modals/PaymentConfirmModal.tsx` | Phase 03 | 03 (only) |
| `payments/modals/InvoiceDetailModal.tsx` | Phase 03 | 03 (only) |
| `payments/modals/SendReminderModal.tsx` | Phase 03 | 03 (only) |
| `payments/modals/ExportReportModal.tsx` | Phase 03 | 03 (only) |
| `payments/PaymentsManagement.tsx` | Phase 03 | 03 (modifies only) |
| `payments/FeeAssignmentWizard.tsx` | Phase 03 | 03 (modifies only) |

## Implementation Steps

1. **Create `payments/modals/` directory** (2min)

2. **Implement AddFeeItemModal** (35min)
   - Create name + code + type + amount + semester inputs
   - Auto-generate code: `[PREFIX]-HK[1/2]` format
   - Add form validation
   - Wire up to `POST /api/fee-items`

3. **Implement EditFeeItemModal** (30min)
   - Pre-populate from props
   - Same fields + validation
   - Wire up to `PUT /api/fee-items/:id`

4. **Implement PaymentConfirmModal** (40min)
   - Display invoice summary (from props)
   - Add amount input for partial payment
   - Calculate remaining balance
   - Wire up to `POST /api/payments/:id/confirm`

5. **Implement InvoiceDetailModal** (45min)
   - Display full invoice info (from props or fetch)
   - Create payment history timeline component
   - Show student info + fee items
   - Wire up to `GET /api/invoices/:id`

6. **Implement SendReminderModal** (35min)
   - Create template dropdown
   - Add custom message textarea
   - Add send date picker
   - Show recipient preview
   - Wire up to `POST /api/payments/:id/reminder`

7. **Implement ExportReportModal** (30min)
   - Create format radio buttons (PDF/Excel/CSV)
   - Add date range picker
   - Add include/exclude checkboxes
   - Implement generate/download button
   - Wire up to `POST /api/invoices/export`

8. **Update PaymentsManagement.tsx** (30min)
   - Add "Add Fee Item" button → open AddFeeItemModal
   - Add edit button on fee items → open EditFeeItemModal
   - Add "Confirm Payment" button → open PaymentConfirmModal
   - Add "View Invoice" button → open InvoiceDetailModal
   - Add "Send Reminder" button → open SendReminderModal
   - Add "Export" button → open ExportReportModal

9. **Update FeeAssignmentWizard.tsx** (45min)
   - **Step 3**: Add live date picker + summary preview
   - **Step 4**: Add terms confirmation checkbox
   - **Step 4**: Add live data population from wizard state
   - Improve visual step indicators

## Todo List

- [ ] Create `payments/modals/` directory
- [ ] Implement AddFeeItemModal
- [ ] Implement EditFeeItemModal
- [ ] Implement PaymentConfirmModal
- [ ] Implement InvoiceDetailModal with timeline
- [ ] Implement SendReminderModal
- [ ] Implement ExportReportModal
- [ ] Update PaymentsManagement.tsx with triggers
- [ ] Update FeeAssignmentWizard.tsx Step 3 & 4
- [ ] Test all modals open/close correctly
- [ ] Test form validation
- [ ] Test API calls (or mock responses)

## Success Criteria

1. AddFeeItemModal validates code uniqueness
2. PaymentConfirmModal calculates balance correctly
3. InvoiceDetailModal shows payment timeline
4. SendReminderModal previews recipient
5. ExportReportModal downloads file
6. FeeAssignmentWizard Step 3/4 show live data
7. No console errors during modal flow

## Conflict Prevention

- **No other phases** create files in `payments/modals/`
- **No other phases** modify `PaymentsManagement.tsx` or `FeeAssignmentWizard.tsx`
- Use `BaseModal` from Phase 00
- Import types from `lib/mock-data.ts`

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| API routes missing | Mock responses in component |
| File download not working | Use `blob` response type |
| Timeline visualization complex | Use simple list with status badges |
| Date picker state sync | Use controlled inputs + state object |

## Security Considerations

- Validate amount inputs (positive numbers)
- Sanitize reminder message input
- Restrict export date range (max 1 year)
- Rate limit reminder sends (1 per hour per invoice)

## API Integration Points

```
POST   /api/fee-items              # Create fee item
PUT    /api/fee-items/:id          # Update fee item
DELETE /api/fee-items/:id          # Delete fee item
POST   /api/payments/:id/confirm   # Confirm payment
GET    /api/invoices/:id           # Get invoice details
POST   /api/payments/:id/reminder  # Send reminder
POST   /api/invoices/export        # Export report (returns file)
```

## Next Steps

After Phase 03 completes:
1. PaymentsManagement.tsx has full modal triggers
2. FeeAssignmentWizard has complete Step 3/4
3. Phase 04 validates payment workflows end-to-end

---

**Estimated Effort**: 4.5 hours
**Parallelizable**: Yes (with Phase 01, 02)
