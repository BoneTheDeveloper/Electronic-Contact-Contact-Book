'use client'

import { useState, useEffect } from 'react'
import { Users, GraduationCap, AlertTriangle } from 'lucide-react'
import { BaseModal, BaseModalProps } from '@/components/admin/shared/modals/BaseModal'
import { SUPPORTED_GRADES } from '@/lib/constants'
import type { Class } from '@/lib/types'
import type { MockClass } from '@/lib/mock-data'

export interface EditClassModalProps extends Omit<BaseModalProps, 'title' | 'children'> {
  classData: MockClass | null
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

export function EditClassModal({ isOpen, onClose, classData, onSuccess }: EditClassModalProps) {
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    grade: '6',
    room: '',
    maxStudents: 40,
    homeroomTeacher: '',
  })

  // Populate form when classData changes
  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        grade: classData.grade,
        room: classData.room,
        maxStudents: 40, // Default, would come from API
        homeroomTeacher: classData.teacher,
      })
    }
  }, [classData, isOpen])

  // Fetch teachers for dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // TODO: API - GET /api/teachers?active=true
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
    if (!classData) return

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

    // Capacity warning
    if (formData.maxStudents < classData.studentCount) {
      const confirm = window.confirm(
        `Cảnh báo: Sĩ số tối đa (${formData.maxStudents}) nhỏ hơn số học sinh hiện tại (${classData.studentCount}).\n\n` +
        `Bạn có chắc muốn tiếp tục?`
      )
      if (!confirm) return
    }

    setLoading(true)

    try {
      // TODO: API - PUT /api/classes/:id
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Updating class:', classData.id, formData)

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to update class:', error)
      alert('Không thể cập nhật lớp học. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const capacityPercentage = (formData.maxStudents / 50) * 100
  const currentStudentCount = classData?.studentCount || 0
  const currentUsage = (currentStudentCount / formData.maxStudents) * 100
  const isOverCapacity = currentStudentCount > formData.maxStudents

  const capacityColor = isOverCapacity ? 'bg-red-500' :
                       currentUsage > 80 ? 'bg-yellow-500' : 'bg-[#0284C7]'

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cập Nhật Lớp ${classData?.name || ''}`}
      size="lg"
      primaryAction={{
        label: 'Lưu Thay Đổi',
        onClick: handleSubmit,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        {/* Current Students Display */}
        {classData && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-blue-900">Sĩ Số Hiện Tại</h4>
                <p className="text-2xl font-black text-[#0284C7]">{classData.studentCount}</p>
              </div>
              <Users className="h-8 w-8 text-[#0284C7]" />
            </div>
          </div>
        )}

        {/* Capacity Warning */}
        {isOverCapacity && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">Cảnh Báo Vượt Sĩ Số</h4>
              <p className="text-xs text-red-800 mt-1">
                Lớp hiện có {currentStudentCount} học sinh, nhưng sĩ số tối đa chỉ còn {formData.maxStudents}.
              </p>
            </div>
          </div>
        )}

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

          <div className="mt-3 space-y-2">
            {/* Max Capacity Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Dung lượng tối đa</span>
                <span>{Math.round(capacityPercentage)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-slate-400 transition-all duration-300"
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
            </div>

            {/* Current Usage Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Đang sử dụng ({currentStudentCount}/{formData.maxStudents})</span>
                <span className={isOverCapacity ? 'text-red-600 font-bold' : ''}>
                  {Math.round(currentUsage)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full ${capacityColor} transition-all duration-300`}
                  style={{ width: `${Math.min(currentUsage, 100)}%` }}
                />
              </div>
            </div>

            {isOverCapacity && (
              <p className="text-xs text-red-600 font-semibold">
                ⚠️ Vượt quá sĩ số cho phép
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
