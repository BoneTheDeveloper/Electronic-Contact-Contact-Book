'use client'

import { useState, useEffect } from 'react'
import { Users, GraduationCap } from 'lucide-react'
import { BaseModal, BaseModalProps } from '@/components/admin/shared/modals/BaseModal'
import { SUPPORTED_GRADES } from '@/lib/mock-data'

export interface AddClassModalProps extends Omit<BaseModalProps, 'title' | 'children'> {
  onSuccess?: () => void
}

export interface ClassFormData {
  name: string
  grade: string
  room: string
  maxStudents: number
  homeroomTeacher: string
}

interface Teacher {
  id: string
  name: string
  subject?: string
}

export function AddClassModal({ isOpen, onClose, onSuccess }: AddClassModalProps) {
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    grade: '6',
    room: '',
    maxStudents: 40,
    homeroomTeacher: '',
  })

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // TODO: API - GET /api/teachers?active=true
        // Mock data for now
        const mockTeachers: Teacher[] = [
          { id: '1', name: 'Nguyễn Thanh T.' },
          { id: '2', name: 'Trần Thị Mai' },
          { id: '3', name: 'Lê Văn Chính' },
          { id: '4', name: 'Phạm Thị Dung' },
          { id: '5', name: 'Hoàng Văn Em' },
        ]
        setTeachers(mockTeachers)
      } catch (error) {
        console.error('Failed to fetch teachers:', error)
      }
    }

    if (isOpen) {
      fetchTeachers()
    }
  }, [isOpen])

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.grade || !formData.room) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (!formData.homeroomTeacher) {
      alert('Vui lòng chọn giáo viên chủ nhiệm')
      return
    }

    if (formData.maxStudents < 10 || formData.maxStudents > 50) {
      alert('Sĩ số tối đa phải từ 10 đến 50 học sinh')
      return
    }

    setLoading(true)

    try {
      // TODO: API - POST /api/classes
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Creating class:', formData)

      onSuccess?.()
      onClose()
      // Reset form
      setFormData({
        name: '',
        grade: '6',
        room: '',
        maxStudents: 40,
        homeroomTeacher: '',
      })
    } catch (error) {
      console.error('Failed to create class:', error)
      alert('Không thể tạo lớp học. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const capacityPercentage = (formData.maxStudents / 50) * 100
  const capacityColor = capacityPercentage > 80 ? 'bg-red-500' :
                       capacityPercentage > 60 ? 'bg-yellow-500' : 'bg-[#0284C7]'

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Lớp Học Mới"
      size="lg"
      primaryAction={{
        label: 'Tạo Lớp',
        onClick: handleSubmit,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        {/* Class Name and Grade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tên Lớp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 6A, 7B1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            />
            <p className="mt-1 text-xs text-slate-500">Theo định dạng: Khối + Tên lớp (6A, 7B1...)</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Khối <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
            >
              {SUPPORTED_GRADES.map(grade => (
                <option key={grade} value={grade}>Khối {grade}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Room */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Phòng Học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ví dụ: A101, P.201"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value.toUpperCase() })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
          />
        </div>

        {/* Homeroom Teacher */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Giáo Viên Chủ Nhiệm <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              value={formData.homeroomTeacher}
              onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 appearance-none bg-white"
            >
              <option value="">Chọn giáo viên chủ nhiệm</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
              ))}
            </select>
          </div>
          {teachers.length === 0 && (
            <p className="mt-1 text-xs text-slate-500">Đang tải danh sách giáo viên...</p>
          )}
        </div>

        {/* Max Students with Progress Bar */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Users className="h-4 w-4" />
              Sĩ Số Tối Đa
            </label>
            <span className="text-lg font-bold text-[#0284C7]">{formData.maxStudents}</span>
          </div>

          <input
            type="range"
            min="10"
            max="50"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
          />

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Dung lượng lớp</span>
              <span>{Math.round(capacityPercentage)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full ${capacityColor} transition-all duration-300`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Khuyến nghị: 35-40 học sinh/lớp
            </p>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
