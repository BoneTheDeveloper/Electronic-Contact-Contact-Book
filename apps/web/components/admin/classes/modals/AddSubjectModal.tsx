'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { BaseModal, BaseModalProps } from '@/components/admin/shared/modals/BaseModal'

export interface AddSubjectModalProps extends Omit<BaseModalProps, 'title' | 'children'> {
  onSuccess?: () => void
}

export interface SubjectFormData {
  code: string
  name: string
  category: string
  periodsPerWeek: number
  coefficient: number
}

const SUBJECT_CATEGORIES = [
  'Khoa học tự nhiên',
  'Khoa học xã hội',
  'Ngoại ngữ',
  'Kỹ thuật',
  'Năng khiếu',
]

export function AddSubjectModal({ isOpen, onClose, onSuccess }: AddSubjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SubjectFormData>({
    code: '',
    name: '',
    category: 'Khoa học tự nhiên',
    periodsPerWeek: 3,
    coefficient: 2,
  })

  const handleSubmit = async () => {
    // Validation
    if (!formData.code || !formData.name) {
      alert('Vui lòng điền đầy đủ thông tin môn học')
      return
    }

    if (formData.periodsPerWeek < 1 || formData.periodsPerWeek > 10) {
      alert('Số tiết/tuần phải từ 1 đến 10')
      return
    }

    if (formData.coefficient < 1 || formData.coefficient > 5) {
      alert('Hệ số phải từ 1 đến 5')
      return
    }

    setLoading(true)

    try {
      // TODO: API - POST /api/subjects
      // TODO: Validate subject code uniqueness
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Creating subject:', formData)

      onSuccess?.()
      onClose()
      // Reset form
      setFormData({
        code: '',
        name: '',
        category: 'Khoa học tự nhiên',
        periodsPerWeek: 3,
        coefficient: 2,
      })
    } catch (error) {
      console.error('Failed to create subject:', error)
      alert('Không thể tạo môn học. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Môn Học Mới"
      size="lg"
      primaryAction={{
        label: 'Tạo Môn Học',
        onClick: handleSubmit,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        {/* Subject Code and Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mã Môn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: TOAN, VAN, ANH"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 uppercase"
            />
            <p className="mt-1 text-xs text-slate-500">Mã viết tắt, không dấu</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên Môn Học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Toán, Văn học, Tiếng Anh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Danh Mục <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 appearance-none bg-white"
            >
              {SUBJECT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Periods and Coefficient */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Số Tiết/Tuần <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.periodsPerWeek}
              onChange={(e) => setFormData({ ...formData, periodsPerWeek: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
            <p className="mt-1 text-xs text-slate-500">Số tiết học mỗi tuần</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Hệ Số <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.coefficient}
              onChange={(e) => setFormData({ ...formData, coefficient: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
            <p className="mt-1 text-xs text-slate-500">Hệ số đánh giá (1-5)</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Thông Tin
          </h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Mã môn phải duy nhất, không trùng với môn học khác</li>
            <li>• Hệ số ảnh hưởng đến điểm tổng kết</li>
            <li>• Số tiết/tuần dùng để phân công giáo viên</li>
          </ul>
        </div>

        {/* Subject Examples */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Ví Dụ Môn Học Phổ Biến</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { code: 'TOAN', name: 'Toán', cat: 'Khoa học tự nhiên', coef: 3 },
              { code: 'VAN', name: 'Văn học', cat: 'Khoa học xã hội', coef: 2 },
              { code: 'ANH', name: 'Tiếng Anh', cat: 'Ngoại ngữ', coef: 2 },
              { code: 'LY', name: 'Vật lý', cat: 'Khoa học tự nhiên', coef: 2 },
              { code: 'HOA', name: 'Hóa học', cat: 'Khoa học tự nhiên', coef: 2 },
              { code: 'SINH', name: 'Sinh học', cat: 'Khoa học tự nhiên', coef: 2 },
              { code: 'SU', name: 'Lịch sử', cat: 'Khoa học xã hội', coef: 1 },
              { code: 'DIA', name: 'Địa lý', cat: 'Khoa học xã hội', coef: 1 },
            ].map(example => (
              <button
                key={example.code}
                type="button"
                onClick={() => setFormData({
                  code: example.code,
                  name: example.name,
                  category: example.cat,
                  periodsPerWeek: 3,
                  coefficient: example.coef,
                })}
                className="text-left rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs hover:border-[#0284C7] hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-slate-800">{example.code} - {example.name}</div>
                <div className="text-slate-500">HS: {example.coef}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
