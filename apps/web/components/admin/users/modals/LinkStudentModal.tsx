'use client'

import { useState, useEffect } from 'react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { Search, UserPlus, Link2, Phone, Mail, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Student {
  id: string
  code: string
  name: string
  classId?: string
  grade?: string
}

interface LinkStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  parent: {
    id: string
    name: string
    code: string
  }
}

type Relationship = 'father' | 'mother' | 'guardian'

const relationshipLabels: Record<Relationship, string> = {
  father: 'Bố',
  mother: 'Mẹ',
  guardian: 'Người giám hộ',
}

export function LinkStudentModal({ isOpen, onClose, onSuccess, parent }: LinkStudentModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [relationship, setRelationship] = useState<Relationship>('father')
  const [isPrimary, setIsPrimary] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  // Debounced search for students
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(`/api/student-guardians?search=${encodeURIComponent(searchQuery)}&type=students`)
        const result = await response.json()

        if (result.success) {
          setSearchResults(result.data)
        } else {
          console.error('[LinkStudentModal] Search failed:', result.error)
          setSearchResults([])
        }
      } catch (error) {
        console.error('[LinkStudentModal] Search failed:', error)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleLink = async () => {
    if (!selectedStudent) {
      alert('Vui lòng chọn học sinh để liên kết')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/student-guardians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          parentId: parent.id,
          relationship,
          isPrimary,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Đã liên kết ${parent.name} với ${selectedStudent.name}`)
        onSuccess?.()
        handleClose()
      } else {
        alert(result.error || 'Liên kết thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('[LinkStudentModal] Link failed:', error)
      alert('Liên kết thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedStudent(null)
    setRelationship('father')
    setIsPrimary(false)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Liên kết học sinh"
      size="lg"
      primaryAction={{
        label: 'Liên kết',
        onClick: handleLink,
        disabled: !selectedStudent || loading,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6">
        {/* Parent Info */}
        <div className="rounded-lg bg-teal-50 border border-teal-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-teal-500 to-teal-600 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-teal-600">
                {parent.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Phụ huynh</p>
              <p className="text-sm font-bold text-slate-900">{parent.name}</p>
              <p className="text-xs text-slate-500">Mã: {parent.code}</p>
            </div>
          </div>
        </div>

        {/* Student Search */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Tìm kiếm học sinh <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mã học sinh, lớp..."
              className={cn(
                'w-full rounded-lg border border-slate-300 py-3 pl-12 pr-4 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-[#0284C7]',
                searching && 'animate-pulse'
              )}
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="rounded-lg border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
              {searchResults.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-slate-100 last:border-b-0',
                    selectedStudent?.id === student.id
                      ? 'bg-blue-50 border-l-4 border-l-[#0284C7]'
                      : 'bg-white hover:bg-slate-50'
                  )}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-orange-600">
                      {student.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{student.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">{student.code}</span>
                      {student.classId && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            Lớp {student.classId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedStudent?.id === student.id && (
                    <UserPlus className="h-5 w-5 text-[#0284C7]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !searching && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">Không tìm thấy học sinh nào</p>
              <p className="text-xs text-slate-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        {/* Relationship Selection */}
        {selectedStudent && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Link2 className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-bold text-orange-800">Học sinh đã chọn</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-bold text-orange-600">
                    {selectedStudent.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{selectedStudent.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{selectedStudent.code}</span>
                    {selectedStudent.classId && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Lớp {selectedStudent.classId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mối quan hệ <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(relationshipLabels) as Relationship[]).map(rel => (
                    <button
                      key={rel}
                      onClick={() => setRelationship(rel)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                        relationship === rel
                          ? 'bg-[#0284C7] text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      )}
                    >
                      {relationshipLabels[rel]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={e => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <span className="text-sm text-slate-700">Đặt làm liên hệ chính</span>
                </label>
                <p className="text-xs text-slate-500">
                  Thông báo sẽ được gửi ưu tiên đến liên hệ chính
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
