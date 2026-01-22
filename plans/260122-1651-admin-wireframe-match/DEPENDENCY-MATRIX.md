# Dependency Matrix & Conflict Prevention

## Phase Dependencies

| Phase | Depends On | Blocks | Parallel With |
|-------|-----------|--------|---------------|
| 00 (Shared) | None | 01, 02, 03 | None |
| 01 (User) | 00 | 04 | 02, 03 |
| 02 (Academic) | 00 | 04 | 01, 03 |
| 03 (Payment) | 00 | 04 | 01, 02 |
| 04 (Integration) | 01, 02, 03 | None | None |

## File Ownership Matrix (Exclusive)

### Phase 00: Shared Infrastructure
```
apps/web/components/admin/shared/modals/
├── BaseModal.tsx          ✅ P00
├── ModalContext.tsx       ✅ P00
├── ModalProvider.tsx      ✅ P00
└── index.ts               ✅ P00
```

### Phase 01: User Management
```
apps/web/components/admin/users/
├── UsersManagement.tsx    ✅ P01 (modifies)
└── modals/
    ├── AddUserModal.tsx        ✅ P01
    ├── UserActionsModal.tsx    ✅ P01
    ├── LinkParentModal.tsx     ✅ P01
    └── ImportExcelModal.tsx    ✅ P01
```

### Phase 02: Academic Structure
```
apps/web/components/admin/classes/
├── AcademicStructure.tsx  ✅ P02 (modifies)
└── modals/
    ├── AddYearModal.tsx         ✅ P02
    ├── AddClassModal.tsx        ✅ P02
    ├── AddSubjectModal.tsx      ✅ P02
    └── EditClassModal.tsx       ✅ P02
```

### Phase 03: Payment/Invoice
```
apps/web/components/admin/payments/
├── PaymentsManagement.tsx  ✅ P03 (modifies)
├── FeeAssignmentWizard.tsx ✅ P03 (modifies)
└── modals/
    ├── AddFeeItemModal.tsx       ✅ P03
    ├── EditFeeItemModal.tsx      ✅ P03
    ├── PaymentConfirmModal.tsx   ✅ P03
    ├── InvoiceDetailModal.tsx    ✅ P03
    ├── SendReminderModal.tsx     ✅ P03
    └── ExportReportModal.tsx     ✅ P03
```

### Phase 04: Integration
```
apps/web/app/api/
├── users/[id]/route.ts          ✅ P04 (creates)
├── fee-items/route.ts           ✅ P04 (creates)
├── payments/[id]/*/route.ts     ✅ P04 (creates)
└── invoices/export/route.ts     ✅ P04 (creates)

apps/web/components/admin/__tests__/
├── UserManagement.test.tsx       ✅ P04
├── AcademicStructure.test.tsx   ✅ P04
└── PaymentsManagement.test.tsx  ✅ P04
```

## Shared Resources (Read-Only Access)

All phases have **READ-ONLY** access to:
```
apps/web/components/admin/shared/buttons/*
apps/web/components/admin/shared/forms/*
apps/web/components/admin/shared/tables/*
apps/web/components/admin/shared/cards/*
apps/web/lib/mock-data.ts
```

## Conflict Prevention Rules

### 1. File Creation
- ✅ Create files only in your phase's directories
- ❌ NEVER create files in another phase's directories
- ✅ Use `BaseModal` from `shared/modals/BaseModal.tsx`

### 2. File Modification
- ✅ Only modify files owned by your phase
- ❌ NEVER modify files owned by another phase
- ✅ For cross-cutting concerns, add to Phase 00 (shared)

### 3. Import Statements
```typescript
// ✅ Correct: Import from shared
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'

// ❌ Wrong: Don't create own modal
import { MyModal } from './MyModal'
```

### 4. Type Definitions
```typescript
// ✅ Correct: Import from lib/mock-data
import type { User } from '@/lib/mock-data'

// ❌ Wrong: Don't redefine types
interface User { ... }
```

### 5. State Management
- ✅ Use local component state (useState)
- ✅ Use React Query for server state
- ❌ AVOID global context (unless in Phase 00)

### 6. API Routes
- Phases 01-03: Use existing routes, mock if missing
- Phase 04: Create/update all missing routes
- ✅ Flag missing routes with `// TODO: API` comment

### 7. Naming Conventions
```typescript
// Modal components: PascalCase + "Modal" suffix
AddUserModal.tsx
UserActionsModal.tsx

// Test files: PascalCase + ".test.tsx"
UserManagement.test.tsx
```

## Parallel Execution Strategy

### Wave 1: Foundation (Must complete first)
```
Agent 1: Phase 00 (Shared Infrastructure)
Duration: 1.5h
```

### Wave 2: Feature Implementation (Parallel)
```
Agent 1: Phase 01 (User Modals)      | Duration: 4h
Agent 2: Phase 02 (Academic Modals)  | Duration: 4h
Agent 3: Phase 03 (Payment Modals)   | Duration: 4.5h
```

### Wave 3: Integration (Sequential)
```
Agent 1: Phase 04 (Integration & Testing)
Duration: 3h
```

## Communication Protocol

### During Parallel Execution (Phases 01-03)
1. **File conflicts**: Report to planner, don't resolve yourself
2. **Shared issues**: Propose change to Phase 00, implement locally first
3. **API missing**: Mock in component, flag with `// TODO: API`
4. **Blockers**: Immediately report in status update

### Handoff to Phase 04
Each phase 01-03 must provide:
- List of `// TODO: API` flags
- List of mocked responses
- List of known issues
- Test scenarios for their modals

## Validation Checklist

Before marking phase complete:
- [ ] All files created in correct directories
- [ ] No files modified outside phase ownership
- [ ] All imports use shared components
- [ ] All types imported from `lib/mock-data.ts`
- [ ] All `// TODO: API` flags documented
- [ ] All modals open/close without errors
- [ ] All forms validate correctly

## Escalation Path

```
Developer → Planner → Resolution
    ↓
Document in phase report → Track in plan
```

---

**Total Parallelizable Time**: ~6h (with 3 agents)
**Sequential Time**: ~16h (single agent)
