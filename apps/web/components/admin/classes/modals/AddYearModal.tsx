'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { BaseModal, BaseModalProps } from '@/components/admin/shared/modals/BaseModal'
import { validateDateRange } from '@/lib/security-utils'

export interface AddYearModalProps extends Omit<BaseModalProps, 'title' | 'children'> {
  onSuccess?: () => void
}

export interface YearFormData {
  name: string
  startDate: string
  endDate: string
  semester1Start: string
  semester1End: string
  semester2Start: string
  semester2End: string
  isCurrent: boolean
}

export function AddYearModal({ isOpen, onClose, onSuccess }: AddYearModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<YearFormData>({
    name: '',
    startDate: '',
    endDate: '',
    semester1Start: '',
    semester1End: '',
    semester2Start: '',
    semester2End: '',
    isCurrent: false,
  })

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError('Vui lòng điền đầy đủ thông tin năm học')
      return
    }

    if (!formData.semester1Start || !formData.semester1End ||
        !formData.semester2Start || !formData.semester2End) {
      setError('Vui lòng điền đầy đủ thông tin học kỳ')
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    // Comprehensive date validation
    const dateValidation = validateDateRange(formData)
    if (!dateValidation.isValid) {
      setError(dateValidation.errors[0]) // Show first error
      return
    }

    setLoading(true)

    try {
      // TODO: API - POST /api/years
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Creating year:', formData)

      onSuccess?.()
      onClose()
      // Reset form
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        semester1Start: '',
        semester1End: '',
        semester2Start: '',
        semester2End: '',
        isCurrent: false,
      })
      setError('')
    } catch (error) {
      console.error('Failed to create year:', error)
      setError('Không thể tạo năm học. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Năm Học Mới"
      size="lg"
      primaryAction={{
        label: 'Tạo Năm Học',
        onClick: handleSubmit,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Year Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tên Năm Học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: 2025-2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
        </div>

        {/* Year Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày Bắt Đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ngày Kết Thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
        </div>

        {/* Current Year Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isCurrent"
            checked={formData.isCurrent}
            onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
          />
          <label htmlFor="isCurrent" className="text-sm font-semibold text-slate-700">
            Đặt làm năm học hiện tại
          </label>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Cấu Hình Học Kỳ
          </h3>
        </div>

        {/* Semester 1 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Học Kỳ I</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                value={formData.semester1Start}
                onChange={(e) => setFormData({ ...formData, semester1Start: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0284C7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                value={formData.semester1End}
                onChange={(e) => setFormData({ ...formData, semester1End: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0284C7] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Semester 2 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Học Kỳ II</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                value={formData.semester2Start}
                onChange={(e) => setFormData({ ...formData, semester2Start: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0284C7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                value={formData.semester2End}
                onChange={(e) => setFormData({ ...formData, semester2End: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0284C7] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
