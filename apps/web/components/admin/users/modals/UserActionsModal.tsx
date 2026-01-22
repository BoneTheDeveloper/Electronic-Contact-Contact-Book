'use client'

import { useState } from 'react'
import { BaseModal } from '@/components/admin/shared/modals/BaseModal'
import { PrimaryButton, SecondaryButton } from '@/components/admin/shared'
import { Lock, Unlock, RotateCcw, Edit, Link, Trash2, ShieldCheck } from 'lucide-react'
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

type Action = 'resetPassword' | 'lockUnlock' | 'edit' | 'linkParent' | 'delete' | null

export function UserActionsModal({ isOpen, onClose, onSuccess, user, currentUser }: UserActionsModalProps) {
  const [selectedAction, setSelectedAction] = useState<Action>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Permission check: only admins can access sensitive actions
  const canPerformAction = currentUser?.role === 'admin'

  const handleClose = () => {
    setSelectedAction(null)
    setConfirmDelete(false)
    onClose()
  }

  const handleAction = async () => {
    if (!canPerformAction) {
      alert('Bạn không có quyền thực hiện hành động này')
      return
    }

    setLoading(true)

    try {
      switch (selectedAction) {
        case 'resetPassword':
          // TODO: API - POST /api/users/:id/reset-password
          console.log('[UserActionsModal] Reset password for user:', user.id)
          await new Promise(resolve => setTimeout(resolve, 1000))
          alert(`Đã gửi mật khẩu mới cho ${user.name} qua SMS/Email`)
          break

        case 'lockUnlock':
          // TODO: API - PUT /api/users/:id/lock
          const newStatus = user.status === 'active' ? 'locked' : 'active'
          console.log('[UserActionsModal] Toggle user status:', user.id, newStatus)
          await new Promise(resolve => setTimeout(resolve, 1000))
          alert(`${user.name} đã được ${newStatus === 'active' ? 'mở khóa' : 'khóa'}`)
          break

        case 'edit':
          // Would open EditUserModal (not in this phase)
          console.log('[UserActionsModal] Edit user:', user.id)
          alert('Tính năng sửa người dùng sẽ có ở modal riêng')
          break

        case 'linkParent':
          // Would open LinkParentModal
          console.log('[UserActionsModal] Link parent for student:', user.id)
          handleClose()
          // Parent component should handle opening LinkParentModal
          return

        case 'delete':
          if (!confirmDelete) {
            setConfirmDelete(true)
            setLoading(false)
            return
          }
          // TODO: API - DELETE /api/users/:id
          console.log('[UserActionsModal] Delete user:', user.id)
          await new Promise(resolve => setTimeout(resolve, 1000))
          alert(`Đã xóa người dùng ${user.name}`)
          break
      }

      onSuccess?.()
      handleClose()
    } catch (error) {
      console.error('[UserActionsModal] Action failed:', error)
      alert('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const actions = [
    {
      key: 'resetPassword' as Action,
      label: 'Đặt lại mật khẩu',
      icon: RotateCcw,
      description: 'Gửi mật khẩu mới qua SMS/Email',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      key: 'lockUnlock' as Action,
      label: user.status === 'active' ? 'Khóa tài khoản' : 'Mở tài khoản',
      icon: user.status === 'active' ? Lock : Unlock,
      description: user.status === 'active' ? 'Người dùng không thể đăng nhập' : 'Cho phép đăng nhập lại',
      color: user.status === 'active' ? 'text-orange-600' : 'text-green-600',
      bgColor: user.status === 'active' ? 'bg-orange-50' : 'bg-green-50',
      borderColor: user.status === 'active' ? 'border-orange-200' : 'border-green-200',
    },
    {
      key: 'edit' as Action,
      label: 'Sửa thông tin',
      icon: Edit,
      description: 'Cập nhật thông tin người dùng',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      key: 'linkParent' as Action,
      label: 'Liên kết phụ huynh',
      icon: Link,
      description: 'Liên kết với tài khoản phụ huynh',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      showFor: ['student'],
    },
    {
      key: 'delete' as Action,
      label: 'Xóa người dùng',
      icon: Trash2,
      description: 'Xóa vĩnh viễn tài khoản',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      warning: true,
    },
  ]

  const filteredActions = actions.filter(action => {
    if (!canPerformAction && action.key !== 'edit') return false
    if (action.showFor && !action.showFor.includes(user.role as string)) return false
    return true
  })

  const selectedActionConfig = actions.find(a => a.key === selectedAction)

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        selectedAction
          ? (selectedActionConfig?.label ?? 'Thao tác')
          : `Thao tác: ${user.name}`
      }
      size={selectedAction ? 'md' : 'lg'}
      primaryAction={
        selectedAction
          ? {
              label: confirmDelete ? 'Xác nhận xóa' : 'Thực hiện',
              onClick: handleAction,
              disabled: loading,
              loading,
            }
          : undefined
      }
      secondaryAction={
        selectedAction
          ? {
              label: 'Quay lại',
              onClick: () => {
                setSelectedAction(null)
                setConfirmDelete(false)
              },
            }
          : {
              label: 'Đóng',
              onClick: handleClose,
            }
      }
    >
      {!canPerformAction && (
        <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-800">Chỉ Admin mới có quyền thực hiện thao tác này</p>
              <p className="text-xs text-yellow-700 mt-1">Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.</p>
            </div>
          </div>
        </div>
      )}

      {!selectedAction ? (
        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369a1] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-bold text-[#0284C7]">
                  {user.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email || user.phone}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase',
                  user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                )}>
                  {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.key}
                  onClick={() => setSelectedAction(action.key)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all',
                    action.bgColor, action.borderColor,
                    'hover:shadow-md hover:scale-[1.02]'
                  )}
                >
                  <div className={cn('rounded-lg p-2', action.bgColor)}>
                    <Icon className={cn('h-5 w-5', action.color)} />
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-sm font-bold', action.color)}>{action.label}</p>
                    <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedAction === 'delete' && confirmDelete ? (
            <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4">
              <p className="text-sm font-bold text-red-800 mb-2">Cảnh báo: Hành động này không thể hoàn tác!</p>
              <p className="text-xs text-red-700">
                Bạn đang xóa người dùng <strong>{user.name}</strong>. Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.
              </p>
              <p className="text-xs text-red-700 mt-2">Nhấn "Xác nhận xóa" để tiếp tục.</p>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                {selectedActionConfig && <selectedActionConfig.icon className={cn('h-6 w-6', selectedActionConfig.color)} />}
                <p className="text-base font-bold text-slate-900">{selectedActionConfig?.label}</p>
              </div>
              <p className="text-sm text-slate-600">{selectedActionConfig?.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">Người dùng: <span className="font-semibold text-slate-700">{user.name}</span></p>
                <p className="text-xs text-slate-500">ID: <span className="font-mono text-slate-700">{user.id}</span></p>
              </div>
            </div>
          )}
        </div>
      )}
    </BaseModal>
  )
}
