# Phase 08: Fee & Finance API Routes

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Phase 07:** `phase-07-fee-finance-data-layer.md` (defines data contract)
- **Wireframe:** `docs/wireframe/Web_app/Admin/payment.html`

## Parallelization Info
- **Execution Wave:** 3 (Can run in parallel with Phase 09)
- **Dependencies:** Phase 07 data contract (fee types, assignments)
- **Dependents:** Phases 09 (Fee UI Components)
- **Estimated Time:** 1 hour

## Overview
- **Date:** 2026-01-22
- **Description:** Create API routes for fee/finance management
- **Priority:** P2 (Feature addition)
- **Implementation Status:** completed
- **Review Status:** pending

## Key Insights
From wireframe analysis:
- **Fee Item Library**: CRUD operations for fee types
- **Fee Assignment Wizard**: 4-step flow (Select → Choose → Configure → Approve)
- **Invoice Tracker**: List invoices, filter by status/class, confirm payments
- **Grade Selection**: Grades 6-9 with class lists

## Requirements
Create API routes in `apps/web/app/api/`:
- `/api/fee-items` - GET (list), POST (create), PUT (update), DELETE (delete)
- `/api/fee-assignments` - GET (list), POST (create wizard flow)
- `/api/fee-assignments/[id]` - GET, PUT, DELETE
- `/api/invoices` - GET (list with filters), POST (confirm payment)
- `/api/invoices/[id]` - GET, PUT
- `/api/payments/stats` - GET (payment statistics)

## Architecture

### API Layer Data Flow
```
mock-data.ts (Phase 07)
    ↓ (reads fee data)
API Routes (Phase 08)
    ↓ /api/fee-items, /api/fee-assignments, /api/invoices
UI Components (Phase 09)
```

### API Endpoints Structure
```
/api/fee-items
    ├── GET /api/fee-items (list all, filter by semester/status)
    ├── POST /api/fee-items (create new fee item)
    ├── PUT /api/fee-items/[id] (update fee item)
    └── DELETE /api/fee-items/[id] (delete fee item)

/api/fee-assignments
    ├── GET /api/fee-assignments (list all assignments)
    ├── POST /api/fee-assignments (create from wizard)
    ├── GET /api/fee-assignments/[id] (get assignment details)
    ├── PUT /api/fee-assignments/[id] (update assignment)
    └── DELETE /api/fee-assignments/[id] (delete assignment)

/api/invoices
    ├── GET /api/invoices (list with filters: status, class, search)
    ├── POST /api/invoices/[id]/confirm (confirm payment)
    └── GET /api/invoices/[id] (get invoice details)

/api/payments/stats
    └── GET /api/payments/stats (payment statistics)
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 08 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/app/api/fee-items/route.ts` | New | CRUD fee items | **Phase 08 ONLY** |
| `apps/web/app/api/fee-items/[id]/route.ts` | New | Update/delete fee items | **Phase 08 ONLY** |
| `apps/web/app/api/fee-assignments/route.ts` | New | List/create assignments | **Phase 08 ONLY** |
| `apps/web/app/api/fee-assignments/[id]/route.ts` | New | Get/update/delete | **Phase 08 ONLY** |
| `apps/web/app/api/invoices/route.ts` | New | List invoices, confirm payment | **Phase 08 ONLY** |
| `apps/web/app/api/invoices/[id]/route.ts` | New | Get/update invoice | **Phase 08 ONLY** |
| `apps/web/app/api/payments/stats/route.ts` | New | Payment statistics | **Phase 08 ONLY** |

**NO OTHER PHASE modifies these files**

## File Ownership

### **Phase 08 owns:**
- All fee-related API route files
- All invoice-related API route files

### **Data Contracts (from Phase 07):**
```typescript
import {
  getFeeItems,
  getFeeItemById,
  getFeeAssignments,
  getFeeAssignmentById,
  createFeeAssignment,
  generateInvoicesFromAssignment,
  getInvoices,
  getPaymentStats,
  GRADE_DATA
} from '@/lib/mock-data'
```

## Implementation Steps

### **Step 1: Create /api/fee-items/route.ts** (15 min)
```typescript
// apps/web/app/api/fee-items/route.ts
import { NextResponse } from 'next/server'
import { getFeeItems, type FeeItem } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const semester = searchParams.get('semester')
  const type = searchParams.get('type')  // 'mandatory' or 'voluntary'

  let items = await getFeeItems()

  // Filter by semester
  if (semester && semester !== 'all') {
    items = items.filter(item => item.semester === semester)
  }

  // Filter by type
  if (type) {
    items = items.filter(item => item.type === type)
  }

  return NextResponse.json({
    success: true,
    data: items
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, code, type, amount, semester } = body

  // Validation
  if (!name || !code || !type || !amount) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Create new fee item (mock - add to FEE_ITEMS array)
  const newItem: FeeItem = {
    id: `fee-${Date.now()}`,
    name,
    code,
    type,
    amount: Number(amount),
    semester: semester || '1',
    status: 'active'
  }

  // In real implementation, add to database
  // For now, just return success
  return NextResponse.json({
    success: true,
    data: newItem
  })
}
```

### **Step 2: Create /api/fee-items/[id]/route.ts** (10 min)
```typescript
// apps/web/app/api/fee-items/[id]/route.ts
import { NextResponse } from 'next/server'
import { getFeeItemById } from '@/lib/mock-data'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = await getFeeItemById(params.id)

  if (!item) {
    return NextResponse.json(
      { success: false, error: 'Fee item not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: item
  })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  // Mock update - in real implementation, update database
  return NextResponse.json({
    success: true,
    data: { ...body, id: params.id }
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock delete - in real implementation, delete from database
  return NextResponse.json({
    success: true,
    message: 'Fee item deleted'
  })
}
```

### **Step 3: Create /api/fee-assignments/route.ts** (15 min)
```typescript
// apps/web/app/api/fee-assignments/route.ts
import { NextResponse } from 'next/server'
import { getFeeAssignments, createFeeAssignment } from '@/lib/mock-data'

export async function GET(request: Request) {
  const assignments = await getFeeAssignments()

  return NextResponse.json({
    success: true,
    data: assignments
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    name,
    targetGrades,
    targetClasses,
    feeItems,
    startDate,
    dueDate,
    reminderDays,
    reminderFrequency
  } = body

  // Validation
  if (!name || !targetClasses?.length || !feeItems?.length) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    const assignment = await createFeeAssignment({
      name,
      targetGrades: targetGrades || [],
      targetClasses,
      feeItems,
      startDate,
      dueDate,
      reminderDays: reminderDays || 7,
      reminderFrequency: reminderFrequency || 'weekly',
      status: 'draft'
    })

    return NextResponse.json({
      success: true,
      data: assignment
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}
```

### **Step 4: Create /api/invoices/route.ts** (15 min)
```typescript
// apps/web/app/api/invoices/route.ts
import { NextResponse } from 'next/server'
import { getInvoices, getPaymentStats, type Invoice } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const classId = searchParams.get('class')
  const search = searchParams.get('search')

  let invoices = await getInvoices()

  // Filter by status
  if (status) {
    invoices = invoices.filter((inv: Invoice) => inv.status === status)
  }

  // Filter by class
  if (classId) {
    // In real implementation, join with students table
    // invoices = invoices.filter(inv => inv.studentGrade === classId)
  }

  // Search by student name or invoice ID
  if (search) {
    invoices = invoices.filter((inv: Invoice) =>
      inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Get stats
  const stats = await getPaymentStats()

  return NextResponse.json({
    success: true,
    data: invoices,
    stats,
    total: invoices.length
  })
}
```

### **Step 5: Create /api/payments/stats/route.ts** (5 min)
```typescript
// apps/web/app/api/payments/stats/route.ts
import { NextResponse } from 'next/server'
import { getPaymentStats } from '@/lib/mock-data'

export async function GET() {
  const stats = await getPaymentStats()

  return NextResponse.json({
    success: true,
    data: stats
  })
}
```

### **Step 6: Add Grade Data API** (optional) (10 min)
```typescript
// apps/web/app/api/grades/data/route.ts
import { NextResponse } from 'next/server'
import { GRADE_DATA } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: GRADE_DATA
  })
}
```

## Todo List
- [ ] Create `/api/fee-items/route.ts` - GET, POST
- [ ] Create `/api/fee-items/[id]/route.ts` - GET, PUT, DELETE
- [ ] Create `/api/fee-assignments/route.ts` - GET, POST
- [ ] Create `/api/fee-assignments/[id]/route.ts` - GET, PUT, DELETE
- [ ] Create `/api/invoices/route.ts` - GET with filters
- [ ] Create `/api/invoices/[id]/route.ts` - GET, PUT (confirm payment)
- [ ] Create `/api/payments/stats/route.ts` - GET statistics
- [ ] Test all API endpoints
- [ ] Verify responses match wireframe data

## Success Criteria
- [ ] All fee item CRUD operations work
- [ ] Fee assignment creation generates correct invoice counts
- [ ] Invoice filtering works (status, class, search)
- [ ] Payment stats calculate correctly
- [ ] API responses match data contract from Phase 07
- [ ] All endpoints return proper error codes

## Conflict Prevention

### **How Phase 08 Avoids Conflicts:**
1. **New files only** - All API route files are new
2. **No modifications to existing routes** - Doesn't touch `/api/classes`, `/api/grades`, etc.
3. **Read-only from Phase 07** - Only reads fee data, doesn't modify

### **API Contract Guarantees:**
```typescript
// Phase 08 guarantees stable API responses:
GET /api/fee-items → { success: true, data: FeeItem[] }
GET /api/fee-assignments → { success: true, data: FeeAssignment[] }
GET /api/invoices → { success: true, data: Invoice[], stats, total }
GET /api/payments/stats → { success: true, data: PaymentStats }
```

### **Integration with Other Phases:**
- **Phase 09 (Fee UI):** Reads API, doesn't modify routes
- **Phase 07 (Data):** Data source, not modified by API

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API contract mismatch | Low | High | Match Phase 07 data types exactly |
| Missing validation | Medium | Medium | Add input validation for all POST/PUT |
| Invoice filtering errors | Low | Medium | Test filter combinations |
| Stats calculation errors | Low | High | Verify math in Phase 07 first |

## Security Considerations
- Add authentication checks to all routes
- Validate user permissions for fee management
- Add rate limiting for invoice confirmation
- Audit log for payment confirmations

## Next Steps
1. Complete all implementation steps
2. Test API endpoints with curl/Postman
3. Verify responses contain correct data
4. Mark phase complete for Phase 09 to consume
