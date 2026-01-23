'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Users } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

interface GradeData {
  grade: string
  classes: string[]
  students: number
}

interface FeeItem {
  id: string
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

interface FeeAssignmentWizardProps {
  onComplete?: () => void
}

export function FeeAssignmentWizard({ onComplete }: FeeAssignmentWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [invoiceName, setInvoiceName] = useState('')
  const [gradeData, setGradeData] = useState<Record<string, GradeData>>({})
  const [feeItems, setFeeItems] = useState<FeeItem[]>([])

  // Step 3: Timeline configuration state
  const [startDate, setStartDate] = useState('2025-09-01')
  const [dueDate, setDueDate] = useState('2025-10-15')
  const [reminderDays, setReminderDays] = useState(7)
  const [reminderFrequency, setReminderFrequency] = useState<'once' | 'daily' | 'weekly'>('weekly')

  // Step 4: Terms confirmation
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // Fetch grade data
    fetch('/api/grades/data')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setGradeData(result.data)
        } else {
          // Fallback data
          setGradeData({
            '6': { grade: '6', classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
            '7': { grade: '7', classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
            '8': { grade: '8', classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
            '9': { grade: '9', classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
          })
        }
      })
      .catch(() => {
        // Fallback data on error
        setGradeData({
          '6': { grade: '6', classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
          '7': { grade: '7', classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
          '8': { grade: '8', classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
          '9': { grade: '9', classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
        })
      })

    // Fetch fee items
    fetch('/api/fee-items')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setFeeItems(result.data || [])
        }
      })
      .catch(() => {
        // Fallback data
        setFeeItems([
          { id: 'tuition-hk1', name: 'Học phí', code: 'HP-HK1', type: 'mandatory', amount: 2500000, semester: '1', status: 'active' },
          { id: 'insurance', name: 'Bảo hiểm y tế', code: 'BHYT-25', type: 'mandatory', amount: 854000, semester: 'all', status: 'active' },
          { id: 'uniform-hk1', name: 'Tiền đồng phục', code: 'DP-HK1', type: 'voluntary', amount: 850000, semester: '1', status: 'active' },
          { id: 'boarding-hk1', name: 'Tiền ăn bán trú', code: 'BT-HK1', type: 'voluntary', amount: 1200000, semester: '1', status: 'active' }
        ])
      })
  }, [])

  const handleNextStep = () => {
    // Validation
    if (currentStep === 1 && selectedClasses.length === 0) {
      alert('Vui lòng chọn ít nhất một lớp!')
      return
    }
    if (currentStep === 2) {
      if (!invoiceName.trim()) {
        alert('Vui lòng nhập tên phiếu thu!')
        return
      }
      if (selectedFees.length === 0) {
        alert('Vui lòng chọn ít nhất một khoản thu!')
        return
      }
    }

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleGenerateInvoices = async () => {
    if (!termsAccepted) {
      alert('Vui lòng xác nhận điều khoản trước khi xuất phiếu thu!')
      return
    }

    try {
      const response = await fetch('/api/fee-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: invoiceName,
          targetGrades: selectedGrades,
          targetClasses: selectedClasses,
          feeItems: selectedFees,
          startDate,
          dueDate,
          reminderDays,
          reminderFrequency
        })
      })

      if (response.ok) {
        // Reset and show success
        setCurrentStep(1)
        setSelectedClasses([])
        setSelectedGrades([])
        setSelectedFees([])
        setInvoiceName('')
        setStartDate('2025-09-01')
        setDueDate('2025-10-15')
        setReminderDays(7)
        setReminderFrequency('weekly')
        setTermsAccepted(false)
        onComplete?.()
        alert('Đã tạo phiếu thu thành công!')
      }
    } catch (error) {
      console.error('Failed to create fee assignment:', error)
      alert('Có lỗi xảy ra khi tạo phiếu thu!')
    }
  }

  const toggleGrade = (grade: string) => {
    const data = gradeData[grade]
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(selectedGrades.filter(g => g !== grade))
      setSelectedClasses(selectedClasses.filter(c => !data?.classes.includes(c)))
    } else if (data) {
      setSelectedGrades([...selectedGrades, grade])
      setSelectedClasses([...selectedClasses, ...data.classes])
    }
  }

  const toggleFee = (feeId: string) => {
    if (selectedFees.includes(feeId)) {
      setSelectedFees(selectedFees.filter((f: any) => f !== feeId))
    } else {
      setSelectedFees([...selectedFees, feeId])
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const totalAmount = feeItems
    .filter((f: any) => selectedFees.includes(f.id))
    .reduce((sum: any, f: any) => sum + f.amount, 0)

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
            gradeData={gradeData}
            onToggleGrade={toggleGrade}
          />
        )}
        {currentStep === 2 && (
          <Step2FeeSelection
            selectedFees={selectedFees}
            invoiceName={invoiceName}
            feeItems={feeItems}
            onFeesChange={setSelectedFees}
            onNameChange={setInvoiceName}
            onToggleFee={toggleFee}
            totalAmount={totalAmount}
          />
        )}
        {currentStep === 3 && (
          <Step3TimelineConfiguration
            invoiceName={invoiceName}
            selectedClasses={selectedClasses}
            selectedFees={selectedFees}
            feeItems={feeItems}
            totalAmount={totalAmount}
            startDate={startDate}
            dueDate={dueDate}
            reminderDays={reminderDays}
            reminderFrequency={reminderFrequency}
            onStartDateChange={setStartDate}
            onDueDateChange={setDueDate}
            onReminderDaysChange={setReminderDays}
            onReminderFrequencyChange={setReminderFrequency}
          />
        )}
        {currentStep === 4 && (
          <Step4Review
            invoiceName={invoiceName}
            selectedClasses={selectedClasses}
            selectedFees={selectedFees}
            feeItems={feeItems}
            totalAmount={totalAmount}
            startDate={startDate}
            dueDate={dueDate}
            reminderDays={reminderDays}
            reminderFrequency={reminderFrequency}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
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
            {currentStep === 3 ? 'Xem trước' : 'Tiếp theo'}
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
            disabled={!termsAccepted}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-sm hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Phê duyệt & Xuất phiếu
          </button>
        </div>
      )}
    </div>
  )
}

// Step 1: Grade Selection
function Step1GradeSelection({ selectedGrades, selectedClasses, gradeData, onToggleGrade }: any) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Chọn theo Khối</h3>
        <div className="space-y-2">
          {Object.keys(gradeData).map(grade => (
            <label key={grade} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={selectedGrades.includes(grade)}
                onChange={() => onToggleGrade(grade)}
                className="w-5 h-5 rounded border-slate-300"
              />
              <span className="text-sm font-bold text-slate-700">Khối {grade}</span>
              <span className="text-xs text-slate-400 ml-auto">
                {gradeData[grade]?.classes.length || 0} lớp • {gradeData[grade]?.students || 0} học sinh
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
              {selectedClasses.map((cls: string) => (
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

// Step 2: Fee Selection
function Step2FeeSelection({ selectedFees, invoiceName, feeItems, onNameChange, onToggleFee, totalAmount }: any) {
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
        {feeItems.map((fee: FeeItem) => (
          <label key={fee.id} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200">
            <input
              type="checkbox"
              checked={selectedFees.includes(fee.id)}
              onChange={() => onToggleFee(fee.id)}
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

// Step 3: Timeline Configuration
function Step3TimelineConfiguration({
  invoiceName,
  selectedClasses,
  selectedFees,
  feeItems,
  totalAmount,
  startDate,
  dueDate,
  reminderDays,
  reminderFrequency,
  onStartDateChange,
  onDueDateChange,
  onReminderDaysChange,
  onReminderFrequencyChange,
}: any) {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount)

  // Calculate total students (assuming 40 students per class)
  const totalStudents = selectedClasses.length * 40
  const grandTotal = totalAmount * totalStudents

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Thời gian áp dụng</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ngày hết hạn</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Cài đặt nhắc nhở</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nhắc trước hạn (ngày)</label>
              <select
                value={reminderDays}
                onChange={(e) => onReminderDaysChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              >
                <option value="3">3 ngày trước</option>
                <option value="5">5 ngày trước</option>
                <option value="7">7 ngày trước</option>
                <option value="10">10 ngày trước</option>
                <option value="14">14 ngày trước</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tần suất nhắc</label>
              <select
                value={reminderFrequency}
                onChange={(e) => onReminderFrequencyChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
              >
                <option value="once">Nhắc 1 lần</option>
                <option value="daily">Hàng ngày</option>
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
            <span className="text-lg font-black text-blue-300">{invoiceName || 'Chưa đặt tên'}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Số lớp</span>
            <span className="text-lg font-black">{selectedClasses.length}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Số học sinh</span>
            <span className="text-lg font-black">{totalStudents}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Số khoản thu</span>
            <span className="text-lg font-black">{selectedFees.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Tổng tiền</span>
            <span className="text-xl font-black text-green-400">{formatCurrency(grandTotal)} ₫</span>
          </div>
        </div>

        {/* Date Range Summary */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Thời gian thu</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-white/10 rounded-lg">{new Date(startDate).toLocaleDateString('vi-VN')}</span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg">{new Date(dueDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 4: Review
function Step4Review({
  invoiceName,
  selectedClasses,
  selectedFees,
  feeItems,
  totalAmount,
  startDate,
  dueDate,
  reminderDays,
  reminderFrequency,
  termsAccepted,
  onTermsChange,
}: any) {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount)

  // Calculate total students (assuming 40 students per class)
  const totalStudents = selectedClasses.length * 40
  const grandTotal = totalAmount * totalStudents

  // Get selected fee items details
  const selectedFeeItems = feeItems.filter((f: FeeItem) => selectedFees.includes(f.id))

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

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Số lớp</p>
          <p className="text-xl font-black">{selectedClasses.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-purple-100 uppercase tracking-wider">Học sinh</p>
          <p className="text-xl font-black">{totalStudents}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">Khoản thu</p>
          <p className="text-xl font-black">{selectedFees.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-4 text-white text-center">
          <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Tổng tiền</p>
          <p className="text-sm font-black">{formatCurrency(grandTotal)} ₫</p>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Timeline */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Thời gian thu</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Ngày bắt đầu</span>
              <span className="text-xs font-bold text-slate-800">{new Date(startDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Ngày hết hạn</span>
              <span className="text-xs font-bold text-slate-800">{new Date(dueDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Nhắc trước hạn</span>
              <span className="text-xs font-bold text-slate-800">{reminderDays} ngày</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-500">Tần suất nhắc</span>
              <span className="text-xs font-bold text-slate-800">
                {reminderFrequency === 'once' ? '1 lần' : reminderFrequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Items List */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Danh sách khoản thu</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFeeItems.map((item: FeeItem, index: number) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.code}</p>
                </div>
                <span className="font-bold text-slate-800">{formatCurrency(item.amount)} ₫</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Classes Preview */}
      <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lớp được chọn ({selectedClasses.length})</p>
        <div className="flex flex-wrap gap-2">
          {selectedClasses.map((cls: string) => (
            <span key={cls} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black rounded-lg">
              {cls}
            </span>
          ))}
        </div>
      </div>

      {/* Terms Confirmation */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Xác nhận điều khoản xuất phiếu thu</p>
            <p className="text-xs text-amber-700 mt-1">
              Tôi xác nhận rằng thông tin trên là chính xác và đồng ý xuất phiếu thu cho {totalStudents} học sinh với tổng số tiền {formatCurrency(grandTotal)} ₫.
              Hệ thống sẽ tự động tạo hóa đơn cho từng học sinh và gửi nhắc nhở theo lịch đã cấu hình.
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
