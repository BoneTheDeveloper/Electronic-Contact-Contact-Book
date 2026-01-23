'use client'

import { useState, useEffect } from 'react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton, SecondaryButton } from '@/components/admin/shared'
import { Search, UserPlus, Link2, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Parent {
  id: string
  code: string
  name: string
  phone: string
  email?: string
}

interface LinkParentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  student: {
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

export function LinkParentModal({ isOpen, onClose, onSuccess, student }: LinkParentModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Parent[]>([])
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [relationship, setRelationship] = useState<Relationship>('father')
  const [isPrimary, setIsPrimary] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  // Debounced search for parents
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(`/api/student-guardians?search=${encodeURIComponent(searchQuery)}&type=parents`)
        const result = await response.json()

        if (result.success) {
          setSearchResults(result.data)
        } else {
          console.error('[LinkParentModal] Search failed:', result.error)
          setSearchResults([])
        }
      } catch (error) {
        console.error('[LinkParentModal] Search failed:', error)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleLink = async () => {
    if (!selectedParent) {
      alert('Vui lòng chọn phụ huynh để liên kết')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/student-guardians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          parentId: selectedParent.id,
          relationship,
          isPrimary,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Đã liên kết ${selectedParent.name} với ${student.name}`)
        onSuccess?.()
        handleClose()
      } else {
        alert(result.error || 'Liên kết thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('[LinkParentModal] Link failed:', error)
      alert('Liên kết thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedParent(null)
    setRelationship('father')
    setIsPrimary(false)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Liên kết phụ huynh"
      size="lg"
      primaryAction={{
        label: 'Liên kết',
        onClick: handleLink,
        disabled: !selectedParent || loading,
        loading,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-6">
        {/* Student Info */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369a1] p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-[#0284C7]">
                {student.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Học sinh</p>
              <p className="text-sm font-bold text-slate-900">{student.name}</p>
              <p className="text-xs text-slate-500">Mã: {student.code}</p>
            </div>
          </div>
        </div>

        {/* Parent Search */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Tìm kiếm phụ huynh <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, số điện thoại, mã phụ huynh..."
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
              {searchResults.map(parent => (
                <button
                  key={parent.id}
                  onClick={() => setSelectedParent(parent)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-slate-100 last:border-b-0',
                    selectedParent?.id === parent.id
                      ? 'bg-blue-50 border-l-4 border-l-[#0284C7]'
                      : 'bg-white hover:bg-slate-50'
                  )}
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-600 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-green-600">
                      {parent.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{parent.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">{parent.code}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {parent.phone}
                      </span>
                    </div>
                  </div>
                  {selectedParent?.id === parent.id && (
                    <UserPlus className="h-5 w-5 text-[#0284C7]" />
                  )}
                </button>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !searching && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">Không tìm thấy phụ huynh nào</p>
              <p className="text-xs text-slate-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>

        {/* Relationship Selection */}
        {selectedParent && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Link2 className="h-5 w-5 text-green-600" />
                <p className="text-sm font-bold text-green-800">Phụ huynh đã chọn</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-green-600 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-bold text-green-600">
                    {selectedParent.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{selectedParent.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{selectedParent.code}</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedParent.phone}
                    </span>
                    {selectedParent.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedParent.email}
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
                  Thông báo sẽ được gửi优先 đến liên hệ chính
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
