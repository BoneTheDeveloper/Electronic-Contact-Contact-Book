'use client'

import { useState, useEffect } from 'react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton } from '@/components/admin/shared/buttons/primary-button'
import { SecondaryButton } from '@/components/admin/shared/buttons/secondary-button'

export interface FeeItemFormData {
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: string
  semester: '1' | '2' | 'all'
}

interface AddFeeItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  existingCodes?: string[]
}

export function AddFeeItemModal({
  isOpen,
  onClose,
  onSuccess,
  existingCodes = [],
}: AddFeeItemModalProps) {
  const [formData, setFormData] = useState<FeeItemFormData>({
    name: '',
    code: '',
    type: 'mandatory',
    amount: '',
    semester: '1',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FeeItemFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-generate code based on name
  useEffect(() => {
    if (formData.name && !formData.code) {
      const words = formData.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .filter((w: any) => w.length > 0)

      if (words.length >= 2) {
        const code = words
          .slice(0, 2)
          .map((w: any) => w.substring(0, 2).toUpperCase())
          .join('')
        const semester = formData.semester === 'all' ? '' : `-HK${formData.semester}`
        setFormData(prev => ({ ...prev, code: `${code}${semester}` }))
      }
    }
  }, [formData.name, formData.semester])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FeeItemFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên khoản thu'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Mã khoản thu không được để trống'
    } else if (existingCodes.includes(formData.code)) {
      newErrors.code = 'Mã khoản thu đã tồn tại'
    }

    if (!formData.amount) {
      newErrors.amount = 'Vui lòng nhập số tiền'
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // TODO: API call to POST /api/fee-items
      const response = await fetch('/api/fee-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          type: formData.type,
          amount: Number(formData.amount),
          semester: formData.semester,
          status: 'active',
        }),
      })

      if (response.ok) {
        onSuccess?.()
        handleClose()
      } else {
        const error = await response.json()
        alert(error.message || 'Có lỗi xảy ra khi tạo khoản thu')
      }
    } catch (error) {
      console.error('Failed to create fee item:', error)
      // Mock success for demo
      onSuccess?.()
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      type: 'mandatory',
      amount: '',
      semester: '1',
    })
    setErrors({})
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Thêm Khoản Thu Mới"
      size="lg"
      primaryAction={{
        label: 'Tạo Khoản Thu',
        onClick: handleSubmit,
        disabled: isSubmitting,
        loading: isSubmitting,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Tên Khoản Thu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Học phí, Tiền ăn bán trú"
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-colors ${
              errors.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-200 focus:border-[#0284C7]'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Code */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Mã Khoản Thu <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="Ví dụ: HP-HK1"
            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-mono font-bold outline-none transition-colors ${
              errors.code
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-200 focus:border-[#0284C7]'
            }`}
          />
          {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
          {!errors.code && (
            <p className="text-xs text-slate-400 mt-1">Mã sẽ tự động tạo từ tên khoản thu</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Loại Khoản Thu <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.type === 'mandatory'
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 bg-slate-50 hover:border-red-200'
              }`}
            >
              <input
                type="radio"
                name="type"
                value="mandatory"
                checked={formData.type === 'mandatory'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mandatory' | 'voluntary' })}
                className="w-4 h-4 text-red-500"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">Bắt Buộc</p>
                <p className="text-xs text-slate-500">Học phí, bảo hiểm...</p>
              </div>
            </label>
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.type === 'voluntary'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-200'
              }`}
            >
              <input
                type="radio"
                name="type"
                value="voluntary"
                checked={formData.type === 'voluntary'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'mandatory' | 'voluntary' })}
                className="w-4 h-4 text-blue-500"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">Tự Nguyện</p>
                <p className="text-xs text-slate-500">Đồng phục, ăn bán trú...</p>
              </div>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Số Tiền (VNĐ) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="2500000"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-colors pr-16 ${
                errors.amount
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#0284C7]'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              đ
            </span>
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>

        {/* Semester */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Học Kỳ <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value as '1' | '2' | 'all' })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#0284C7]"
          >
            <option value="1">Học Kỳ 1</option>
            <option value="2">Học Kỳ 2</option>
            <option value="all">Cả Năm</option>
          </select>
        </div>
      </div>
    </BaseModal>
  )
}
