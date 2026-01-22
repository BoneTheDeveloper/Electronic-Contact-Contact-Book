# Phase 04: Integration & Testing

**Parent Plan**: [plan.md](../plan.md)
**Dependencies**: Phase 01, Phase 02, Phase 03
**Parallelizable**: No (sequential validation)

## Context Links
- Test Docs: `../.claude/workflows/development-rules.md`
- API Routes: `apps/web/app/api/`

## Parallelization Info

| Aspect | Details |
|--------|---------|
| **Can Run Parallel With** | None (must wait for all feature phases) |
| **Must Wait For** | Phase 01, 02, 03 |
| **Blocks** | None (final phase) |
| **Conflicts With** | None (integration only) |

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-22 |
| Description | End-to-end integration testing, cross-feature validation, API route updates |
| Priority | P1 |
| Implementation Status | pending |
| Review Status | pending |

## Key Insights

1. **API routes may be missing** - create mock implementations if needed
2. **Cross-feature workflows**: User → Class assignment, Fee → Invoice generation
3. **State sync**: Modals should refresh parent data after save
4. **Design tokens**: Ensure #0284C7 consistency

## Requirements

### 1. Integration Testing
- Test all modal open/close flows
- Test form validation
- Test API integration (or mock responses)
- Test error handling

### 2. Cross-Feature Validation
- User-Teacher assignment to classes
- Fee Items used in Fee Assignment Wizard
- Invoice status updates reflect in tracker

### 3. API Route Updates
- Create missing API routes
- Add proper error handling
- Add request validation

### 4. Data Consistency
- Middle school grades (6-9) consistency
- Role-based access control
- Currency formatting (VND)

## Architecture

```
Integration Points:
├── User Management ──────┐
├── Academic Structure ───┼──→ Shared State (React Query / Context)
├── Payment/Invoice ──────┘
└── API Routes ────────────→ Backend
```

## Related Code Files (Exclusive Ownership)

### API Routes to Create/Update
```
apps/web/app/api/
├── users/
│   ├── route.ts                 # GET (existing), POST (ADD)
│   └── [id]/
│       └── route.ts             # PUT (ADD), DELETE (ADD)
├── classes/
│   └── route.ts                 # GET (existing), POST (ADD)
├── fee-items/
│   └── route.ts                 # GET, POST, PUT, DELETE (ADD)
├── payments/
│   ├── [id]/
│   │   ├── confirm/
│   │   │   └── route.ts         # POST (ADD)
│   │   └── reminder/
│   │       └── route.ts         # POST (ADD)
└── invoices/
    ├── export/
    │   └── route.ts             # POST (ADD)
    └── [id]/
        └── route.ts             # GET (ADD)
```

### Test Files to Create
```
apps/web/components/admin/__tests__/
├── UserManagement.test.tsx
├── AcademicStructure.test.tsx
└── PaymentsManagement.test.tsx
```

## File Ownership

| File | Owner | Phase |
|------|-------|-------|
| API route files (above) | Phase 04 | 04 (creates/updates) |
| Test files | Phase 04 | 04 (only) |
| Component files | Phase 01-03 | 04 (no modify - test only) |

## Implementation Steps

1. **Create Missing API Routes** (60min)
   - Create `POST /api/users` with validation
   - Create `PUT /api/users/:id` with validation
   - Create `DELETE /api/users/:id`
   - Create `POST /api/fee-items`
   - Create `PUT /api/fee-items/:id`
   - Create `DELETE /api/fee-items/:id`
   - Create `POST /api/payments/:id/confirm`
   - Create `POST /api/payments/:id/reminder`
   - Create `GET /api/invoices/:id`
   - Create `POST /api/invoices/export`

2. **Update Existing API Routes** (30min)
   - Add error handling to `GET /api/users`
   - Add error handling to `GET /api/classes`
   - Add error handling to `GET /api/fee-items`

3. **Create Integration Tests** (45min)
   - Test User Management modal flows
   - Test Academic Structure modal flows
   - Test Payment modal flows
   - Test cross-feature workflows

4. **Validate Design Consistency** (20min)
   - Check #0284C7 usage
   - Check rounded-xl/rounded-2xl consistency
   - Check font weights (font-black, font-bold)
   - Check spacing (p-6, p-8 patterns)

5. **Test Middle School Data** (15min)
   - Verify grades 6-9 only
   - Verify class names (6A, 6B, etc.)
   - Verify subject list for middle school

6. **Performance Check** (10min)
   - Check for unnecessary re-renders
   - Verify memo usage where needed
   - Check for memory leaks (event listeners)

## Todo List

- [ ] Create POST /api/users route
- [ ] Create PUT /api/users/:id route
- [ ] Create DELETE /api/users/:id route
- [ ] Create POST /api/fee-items route
- [ ] Create PUT /api/fee-items/:id route
- [ ] Create DELETE /api/fee-items/:id route
- [ ] Create POST /api/payments/:id/confirm route
- [ ] Create POST /api/payments/:id/reminder route
- [ ] Create GET /api/invoices/:id route
- [ ] Create POST /api/invoices/export route
- [ ] Create UserManagement.test.tsx
- [ ] Create AcademicStructure.test.tsx
- [ ] Create PaymentsManagement.test.tsx
- [ ] Validate design token consistency
- [ ] Verify middle school data (grades 6-9)
- [ ] Check performance

## Success Criteria

1. All API routes return proper JSON responses
2. All modals open/close without errors
3. All forms validate correctly
4. Cross-feature workflows work (User→Class, Fee→Invoice)
5. Design tokens consistent (#0284C7, spacing, typography)
6. Middle school data correct (grades 6-9)
7. No console errors
8. Tests pass

## Conflict Prevention

- **Do not modify** component files from Phases 01-03
- Only **create** new API routes
- Only **create** test files
- Report integration issues in report (don't fix without flagging)

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| API route conflicts | Check existing routes before creating |
| Mock data inconsistencies | Use single source of truth in `lib/mock-data.ts` |
| Test flakiness | Use deterministic test data |
| Performance regression | Compare before/after render times |

## Security Considerations

- Add input validation to all API routes
- Add rate limiting to mutation endpoints
- Add CSRF protection to state-changing operations
- Sanitize all user inputs
- Log all mutations for audit

## API Route Templates

### POST /api/users
```typescript
// Body: { name, role, email, phone, grade?, classId?, ... }
// Response: { success: true, data: User }
```

### PUT /api/users/:id
```typescript
// Body: { name, email, phone, ... }
// Response: { success: true, data: User }
```

### DELETE /api/users/:id
```typescript
// Response: { success: true }
```

### POST /api/fee-items
```typescript
// Body: { name, code, type, amount, semester }
// Response: { success: true, data: FeeItem }
```

### POST /api/payments/:id/confirm
```typescript
// Body: { amount, note? }
// Response: { success: true, data: Payment }
```

### POST /api/invoices/export
```typescript
// Body: { format, startDate, endDate, include[] }
// Response: File download (application/pdf, text/csv, etc.)
```

## Next Steps

After Phase 04 completes:
1. All admin modals fully functional
2. API routes complete
3. Tests passing
4. Ready for production deployment

---

**Estimated Effort**: 3 hours
**Parallelizable**: No (must wait for Phases 01-03)
