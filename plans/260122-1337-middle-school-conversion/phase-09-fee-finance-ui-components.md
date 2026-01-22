# Phase 09: Fee & Finance UI Components

## Context Links
- **Parent Plan:** `plans/260122-1337-middle-school-conversion/plan.md`
- **Wireframe:** `docs/wireframe/Web_app/Admin/payment.html`
- **Phase 08:** `phase-08-fee-finance-api-routes.md` (API data source)
- **Existing:** `apps/web/components/admin/payments/PaymentsManagement.tsx`

## Parallelization Info
- **Execution Wave:** 3 (Can run in parallel with Phase 08)
- **Dependencies:** Phase 08 API routes
- **Dependents:** Phase 10 (Page Integration)
- **Estimated Time:** 2 hours

## Overview
- **Date:** 2026-01-22
- **Description:** Create fee & finance UI components matching wireframe
- **Priority:** P2 (Feature addition)
- **Implementation Status:** completed
- **Review Status**: completed
- **Report:** `plans/reports/fullstack-developer-260122-1510-fee-finance-ui-components.md`

## Key Insights
From wireframe `docs/wireframe/Web_app/Admin/payment.html`:
- **Fee Item Library**: Table with CRUD operations, filter by year/semester
- **Quick Access Card**: Link to Invoice Tracker page
- **4-Step Wizard**:
  1. Select target (Khối 6-9 with checkboxes)
  2. Choose fees + name invoice
  3. Configure timeline (start date, due date, reminders)
  4. Review & approve
- **Add Fee Modal**: Form to create new fee items

## Requirements
Create/update UI components in `apps/web/components/admin/`:
1. **FeeItemsTable** - Fee item library with CRUD
2. **FeeAssignmentWizard** - 4-step fee assignment flow
3. **QuickAccessCard** - Link to invoice tracker
4. **AddFeeModal** - Create new fee item form
5. Update **PaymentsManagement** - Use new components

## Architecture

### Component Hierarchy
```
apps/web/app/admin/payments/page.tsx
├── QuickAccessCard (link to invoice-tracker)
├── FeeItemsTable
│   ├── Filters (Year, Semester)
│   ├── Table (Name, Code, Type, Amount, Actions)
│   └── AddFeeModal
└── FeeAssignmentWizard
    ├── Step 1: Grade/Class Selection
    ├── Step 2: Fee Selection + Invoice Name
    ├── Step 3: Timeline Configuration
    └── Step 4: Review & Approve
```

### Data Flow
```
Component → API Route (Phase 08) → Mock Data (Phase 07)
```

## Related Code Files

### **EXCLUSIVE OWNERSHIP - Phase 09 ONLY**

| File | Lines | Changes | Ownership |
|------|-------|---------|-----------|
| `apps/web/components/admin/payments/FeeItemsTable.tsx` | New | Fee item library | **Phase 09 ONLY** |
| `apps/web/components/admin/payments/FeeAssignmentWizard.tsx` | New | 4-step wizard | **Phase 09 ONLY** |
| `apps/web/components/admin/payments/AddFeeModal.tsx` | New | Create fee form | **Phase 09 ONLY** |
| `apps/web/components/admin/payments/QuickAccessCard.tsx` | New | Invoice tracker link | **Phase 09 ONLY** |
| `apps/web/components/admin/payments/PaymentsManagement.tsx` | Update | Use new components | **Phase 09 ONLY** |

**NO OTHER PHASE modifies these files**

## File Ownership

### **Phase 09 owns:**
- All fee/finance UI component files
- Updates to existing PaymentsManagement component

### **API Dependencies (from Phase 08):**
```typescript
// API calls to Phase 08 endpoints
GET /api/fee-items
POST /api/fee-items
GET /api/fee-assignments
POST /api/fee-assignments
GET /api/payments/stats
```

## Implementation Steps

### **Step 1: Create FeeItemsTable Component** (30 min)
```typescript
// apps/web/components/admin/payments/FeeItemsTable.tsx
'use client'

import { useState, useEffect } from 'react'
import { FileText, Trash2, Edit } from 'lucide-react'
import type { FeeItem } from '@/lib/mock-data'

interface FeeItemsTableProps {
  semester?: string
  year?: string
  onEdit?: (item: FeeItem) => void
}

export function FeeItemsTable({ semester = 'all', year = '2025-2026' }: FeeItemsTableProps) {
  const [items, setItems] = useState<FeeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [semester, year])

  const fetchItems = async () => {
    const params = new URLSearchParams()
    if (semester !== 'all') params.append('semester', semester)

    const res = await fetch(`/api/fee-items?${params}`)
    const data = await res.json()
    setItems(data.data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khoản thu này?')) return

    await fetch(`/api/fee-items/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tên khoản thu
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">
                Mã khoản thu
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">
                Loại
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Số tiền (VNĐ)
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Học kỳ
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0284C7]" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-mono">
                    {item.code}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                    item.type === 'mandatory'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.type === 'mandatory' ? 'Bắt buộc' : 'Tự nguyện'}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm font-bold text-slate-700">
                  {formatCurrency(item.amount)} ₫
                </td>
                <td className="px-8 py-4 text-sm font-medium text-slate-500">
                  {item.semester === 'all' ? 'Cả năm' : `Học kỳ ${item.semester}`}
                </td>
                <td className="px-8 py-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

### **Step 2: Create FeeAssignmentWizard Component** (45 min)
```typescript
// apps/web/components/admin/payments/FeeAssignmentWizard.tsx
'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { GRADE_DATA } from '@/lib/mock-data'

type Step = 1 | 2 | 3 | 4

export function FeeAssignmentWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [invoiceName, setInvoiceName] = useState('')

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1 as Step)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1 as Step)
    }
  }

  const handleGenerateInvoices = async () => {
    const response = await fetch('/api/fee-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: invoiceName,
        targetGrades: selectedGrades,
        targetClasses: selectedClasses,
        feeItems: selectedFees,
        startDate: '2025-09-01',
        dueDate: '2025-10-15',
        reminderDays: 7,
        reminderFrequency: 'weekly'
      })
    })

    if (response.ok) {
      // Reset and show success
      setCurrentStep(1)
      setSelectedClasses([])
      setSelectedFees([])
      setInvoiceName('')
    }
  }

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
      {/* Step Wizard Header */}
      <div className="p-8 border-b border-slate-100">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`flex-1 ${step < 4 ? 'relative' : ''}`}>
              <div className={`flex flex-col items-center ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                  currentStep === step
                    ? 'bg-gradient-to-br from-[#0284C7] to-[#0369a1] text-white shadow-lg'
                    : currentStep > step
                    ? 'bg-green-500 text-white'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                  {step === 1 && 'Chọn đối tượng'}
                  {step === 2 && 'Chọn khoản thu'}
                  {step === 3 && 'Cấu hình thời gian'}
                  {step === 4 && 'Xác nhận'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8">
        {currentStep === 1 && (
          <Step1GradeSelection
            selectedGrades={selectedGrades}
            selectedClasses={selectedClasses}
            onGradesChange={setSelectedGrades}
            onClassesChange={setSelectedClasses}
          />
        )}
        {currentStep === 2 && (
          <Step2FeeSelection
            selectedFees={selectedFees}
            invoiceName={invoiceName}
            onFeesChange={setSelectedFees}
            onNameChange={setInvoiceName}
          />
        )}
        {currentStep === 3 && (
          <Step3TimelineConfiguration />
        )}
        {currentStep === 4 && (
          <Step4Review
            selectedClasses={selectedClasses}
            selectedFees={selectedFees}
            invoiceName={invoiceName}
          />
        )}
      </div>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
          <button
            onClick={handleNextStep}
            className="px-6 py-3 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2"
          >
            Tiếp theo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="px-8 pb-8 flex items-center justify-end gap-3">
          <button
            onClick={handlePrevStep}
            className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
          <button
            onClick={handleGenerateInvoices}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-green-600 hover:to-emerald-600"
          >
            Phê duyệt & Xuất phiếu
          </button>
        </div>
      )}
    </div>
  )
}

// Sub-components for each step
function Step1GradeSelection({ selectedGrades, selectedClasses, onGradesChange, onClassesChange }: any) {
  const toggleGrade = (grade: string) => {
    const gradeData = GRADE_DATA[grade]
    if (selectedGrades.includes(grade)) {
      onGradesChange(selectedGrades.filter(g => g !== grade))
      onClassesChange(selectedClasses.filter(c => !gradeData.classes.includes(c)))
    } else {
      onGradesChange([...selectedGrades, grade])
      onClassesChange([...selectedClasses, ...gradeData.classes])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Chọn theo Khối</h3>
        <div className="space-y-2">
          {Object.keys(GRADE_DATA).map(grade => (
            <label key={grade} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={selectedGrades.includes(grade)}
                onChange={() => toggleGrade(grade)}
                className="w-5 h-5 rounded border-slate-300"
              />
              <span className="text-sm font-bold text-slate-700">Khối {grade}</span>
              <span className="text-xs text-slate-400 ml-auto">
                {GRADE_DATA[grade].classes.length} lớp • {GRADE_DATA[grade].students} học sinh
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Lớp đã chọn</h3>
        <div className="min-h-[200px] p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          {selectedClasses.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Chưa chọn lớp nào</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedClasses.map(cls => (
                <span key={cls} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-lg">
                  {cls}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Step2FeeSelection({ selectedFees, invoiceName, onFeesChange, onNameChange }: any) {
  const fees = [
    { id: 'tuition-hk1', name: 'Học phí', code: 'HP-HK1', type: 'mandatory', amount: 2500000 },
    { id: 'insurance', name: 'Bảo hiểm y tế', code: 'BHYT-25', type: 'mandatory', amount: 854000 },
    { id: 'uniform-hk1', name: 'Tiền đồng phục', code: 'DP-HK1', type: 'voluntary', amount: 850000 },
    { id: 'boarding-hk1', name: 'Tiền ăn bán trú', code: 'BT-HK1', type: 'voluntary', amount: 1200000 },
  ]

  const toggleFee = (feeId: string) => {
    if (selectedFees.includes(feeId)) {
      onFeesChange(selectedFees.filter(f => f !== feeId))
    } else {
      onFeesChange([...selectedFees, feeId])
    }
  }

  const totalAmount = fees
    .filter(f => selectedFees.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0)

  return (
    <div>
      <div className="mb-6">
        <label className="text-sm font-bold text-slate-700 mb-2 block">Tên phiếu thu</label>
        <input
          type="text"
          value={invoiceName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ví dụ: Học phí HK1 - 2025"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {fees.map(fee => (
          <label key={fee.id} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200">
            <input
              type="checkbox"
              checked={selectedFees.includes(fee.id)}
              onChange={() => toggleFee(fee.id)}
              className="w-5 h-5 mt-1 rounded border-slate-300"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded font-mono">{fee.code}</span>
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${fee.type === 'mandatory' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {fee.type === 'mandatory' ? 'Bắt buộc' : 'Tự nguyện'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{fee.name}</h4>
              <p className="text-xs text-slate-500">{new Intl.NumberFormat('vi-VN').format(fee.amount)} ₫</p>
            </div>
          </label>
        ))}
      </div>

      <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng tiền thu dự kiến</p>
            <p className="text-2xl font-black text-[#0284C7]">{new Intl.NumberFormat('vi-VN').format(totalAmount)} ₫</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Số khoản thu</p>
            <p className="text-2xl font-black text-slate-800">{selectedFees.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step3TimelineConfiguration() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Thời gian áp dụng</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ngày bắt đầu</label>
              <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="2025-09-01" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ngày hết hạn</label>
              <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="2025-10-15" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Cài đặt nhắc nhở</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nhắc trước hạn (ngày)</label>
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none">
                <option value="3">3 ngày trước</option>
                <option value="5">5 ngày trước</option>
                <option value="7" selected>7 ngày trước</option>
                <option value="10">10 ngày trước</option>
                <option value="14">14 ngày trước</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tần suất nhắc</label>
              <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none">
                <option value="once">Nhắc 1 lần</option>
                <option value="daily" selected>Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white">
        <h3 className="text-sm font-bold mb-6">Thông tin đợt thu</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Tên phiếu thu</span>
            <span className="text-lg font-black text-blue-300">Học phí HK1 - 2025</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Số lớp</span>
            <span className="text-lg font-black">6</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Số học sinh</span>
            <span className="text-lg font-black">240</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Tổng tiền</span>
            <span className="text-xl font-black text-green-400">600,000,000 ₫</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step4Review({ selectedClasses, selectedFees, invoiceName }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-black text-slate-800">Xác nhận & Phê duyệt</h3>
          <p className="text-xs text-slate-500 mt-0.5">Kiểm tra lại thông tin trước khi xuất phiếu thu</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Tên phiếu thu</p>
          <p className="text-sm font-black text-[#0284C7]">{invoiceName || 'Chưa đặt tên'}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Số lớp</p>
          <p className="text-xl font-black">{selectedClasses.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-purple-100 uppercase tracking-wider">Học sinh</p>
          <p className="text-xl font-black">{selectedClasses.length * 40}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">Khoản thu</p>
          <p className="text-xl font-black">{selectedFees.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Tổng tiền</p>
          <p className="text-sm font-black">5,404,000 ₫</p>
        </div>
      </div>
    </div>
  )
}
```

### **Step 3: Create QuickAccessCard Component** (15 min)
```typescript
// apps/web/components/admin/payments/QuickAccessCard.tsx
import Link from 'next/link'

export function QuickAccessCard() {
  return (
    <Link href="/admin/payments/invoice-tracker">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white rounded-3xl shadow-lg">
              <FileText className="w-12 h-12 text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Quản lý Hóa đơn & Theo dõi Công nợ</h3>
              <p className="text-slate-500 text-sm font-bold mt-2">Xem công nợ, xác nhận thanh toán, gửi nhắc nhở</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">24 hóa đơn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">8 chờ đóng</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-bold text-slate-600">16 đã hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-white rounded-xl shadow-sm">
            <span className="text-sm font-bold text-purple-600">Mở Quản lý</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### **Step 4: Update PaymentsManagement Component** (30 min)
```typescript
// Update apps/web/components/admin/payments/PaymentsManagement.tsx

import { FeeItemsTable } from './FeeItemsTable'
import { FeeAssignmentWizard } from './FeeAssignmentWizard'
import { QuickAccessCard } from './QuickAccessCard'
import { useState } from 'react'

export function PaymentsManagement() {
  const [activeTab, setActiveTab] = useState<'fees' | 'assignment'>('fees')
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      {/* Quick Access to Invoice Tracker */}
      <QuickAccessCard />

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'fees'
              ? 'bg-white text-[#0284C7] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Danh mục Khoản thu
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'assignment'
              ? 'bg-white text-[#0284C7] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Thiết lập Đợt thu
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'fees' && (
        <div>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-4 py-2 outline-none">
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-4 py-2 outline-none">
              <option value="all">Tất cả học kỳ</option>
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
            </select>
          </div>
          <FeeItemsTable key={refreshKey} />
        </div>
      )}

      {activeTab === 'assignment' && (
        <FeeAssignmentWizard onComplete={() => setRefreshKey(k => k + 1)} />
      )}
    </div>
  )
}
```

## Todo List
- [ ] Create FeeItemsTable component
- [ ] Create FeeAssignmentWizard component with 4 steps
- [ ] Create QuickAccessCard component
- [ ] Create AddFeeModal component (optional, can use inline)
- [ ] Update PaymentsManagement to use new components
- [ ] Test component interactions
- [ ] Verify wireframe match

## Success Criteria
- [ ] Fee items table displays all fee types correctly
- [ ] Grade selection matches wireframe (Khối 6-9 with classes)
- [ ] Fee selection shows correct amounts
- [ ] Wizard navigation works (steps 1-4)
- [ ] Quick access card links to invoice tracker
- [ ] All styling matches wireframe design

## Conflict Prevention

### **How Phase 09 Avoids Conflicts:**
1. **New component files** - Only creates new files
2. **Updates existing PaymentsManagement** - Controlled update
3. **No shared files with other phases** - Exclusive ownership

### **Component Contract Guarantees:**
```typescript
// Phase 09 provides these components:
export function FeeItemsTable({ semester, year }: Props)
export function FeeAssignmentWizard()
export function QuickAccessCard()
// Updated: PaymentsManagement now uses these components
```

### **Integration with Other Phases:**
- **Phase 08 (API):** Reads API, doesn't modify
- **Phase 10 (Pages):** Consumes these components

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Wizard state complexity | Medium | Medium | Use React hooks properly |
| Styling mismatch | Low | Medium | Copy exact styles from wireframe |
| Fee calculation errors | Low | High | Verify with Phase 07 data |
| Component integration issues | Low | Low | Test in PaymentsManagement first |

## Security Considerations
- Add authentication to fee management operations
- Role-based access control (admin only)
- Audit trail for fee assignments
- Confirm payment requires admin verification

## Next Steps
1. Complete all implementation steps
2. Test component rendering
3. Verify wireframe match
4. Mark phase complete for Phase 10
