'use client'

import { useState } from 'react'
import { X, Lock, RotateCcw, Edit, Smartphone, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserActionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  user: {
    id: string
    name: string
    role: string
    status: string
    email?: string
    phone?: string
  }
  currentUser?: {
    role: string
  }
}

export function UserActionsModal({ isOpen, onClose, onSuccess, user, currentUser }: UserActionsModalProps) {
  const [loading, setLoading] = useState(false)

  // Permission check: only admins can access sensitive actions
  const canPerformAction = currentUser?.role === 'admin'

  const getInitials = (name: string) => {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  }

  const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
      admin: 'bg-red-100 text-red-600',
      teacher: 'bg-purple-100 text-purple-600',
      parent: 'bg-teal-100 text-teal-600',
      student: 'bg-blue-100 text-blue-600',
    }
    return classes[role] || 'bg-slate-100 text-slate-600'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      teacher: 'Giáo viên',
      parent: 'Phụ huynh',
      student: 'Học sinh',
    }
    return labels[role] || role
  }

  const handleResetPassword = async () => {
    if (!canPerformAction) {
      alert('Bạn không có quyền thực hiện hành động này')
      return
    }

    setLoading(true)
    try {
      console.log('[UserActionsModal] Reset password for user:', user.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Đã gửi mật khẩu mới cho ${user.name} qua SMS/Email`)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('[UserActionsModal] Reset password failed:', error)
      alert('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleLock = async () => {
    if (!canPerformAction) {
      alert('Bạn không có quyền thực hiện hành động này')
      return
    }

    setLoading(true)
    try {
      const newStatus = user.status === 'active' ? 'locked' : 'active'
      console.log('[UserActionsModal] Toggle user status:', user.id, newStatus)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`${user.name} đã được ${newStatus === 'active' ? 'mở khóa' : 'khóa'}`)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('[UserActionsModal] Toggle lock failed:', error)
      alert('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageDevices = () => {
    alert('Tính năng quản lý thiết bị đang phát triển')
  }

  const handleEdit = () => {
    alert('Tính năng sửa người dùng sẽ có ở modal riêng')
  }

  const handleLinkParent = () => {
    // Close this modal and let parent open LinkParentModal
    onClose()
    // The parent component should handle opening LinkParentModal
    if (onSuccess) onSuccess()
  }

  const handleDelete = async () => {
    if (!canPerformAction) {
      alert('Bạn không có quyền thực hiện hành động này')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`)) {
      return
    }

    setLoading(true)
    try {
      console.log('[UserActionsModal] Delete user:', user.id)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Đã xóa người dùng ${user.name}`)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('[UserActionsModal] Delete failed:', error)
      alert('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Modal */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800">Thao tác tài khoản</h3>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
              Quản lý bảo mật & truy cập
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-xl font-black',
              getRoleBadgeClass(user.role)
            )}>
              {getInitials(user.name)}
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">{user.name}</h4>
              <p className="text-sm font-medium text-slate-500">{user.id}</p>
              <span className={cn(
                'inline-block mt-1 px-3 py-1 text-xs font-bold rounded-lg',
                getRoleBadgeClass(user.role)
              )}>
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Reset Password */}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">Reset mật khẩu</p>
                <p className="text-xs text-slate-400">Gửi mật khẩu mới qua SMS/Email</p>
              </div>
            </button>

            {/* Lock/Unlock Account */}
            <button
              onClick={handleToggleLock}
              disabled={loading}
              className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">
                  {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                </p>
                <p className="text-xs text-slate-400">
                  {user.status === 'active' ? 'Tạm dừng quyền truy cập' : 'Khôi phục quyền truy cập'}
                </p>
              </div>
            </button>

            {/* Manage Devices */}
            <button
              onClick={handleManageDevices}
              className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">Thiết bị tin cậy</p>
                <p className="text-xs text-slate-400">Quản lý danh sách thiết bị</p>
              </div>
            </button>

            {/* Edit User */}
            <button
              onClick={handleEdit}
              className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Edit className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-800">Chỉnh sửa thông tin</p>
                <p className="text-xs text-slate-400">Cập nhật thông tin cá nhân</p>
              </div>
            </button>

            {/* Link Parent - only show for students */}
            {user.role === 'student' && (
              <button
                onClick={handleLinkParent}
                className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:bg-slate-50 transition-all"
              >
                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800">Liên kết Phụ huynh</p>
                  <p className="text-xs text-slate-400">Gán phụ huynh cho học sinh</p>
                </div>
              </button>
            )}
          </div>

          {/* Delete Action */}
          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-4 hover:bg-red-100 transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-red-600">Xóa người dùng</p>
                <p className="text-xs text-red-400">Hành động này không thể hoàn tác</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add slide-in animation to global styles */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
