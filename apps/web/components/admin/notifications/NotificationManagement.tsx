'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Bell, Send, Trash2, Megaphone } from 'lucide-react'
import { StatusBadge, PrimaryButton, FormField, FormSelect } from '@/components/admin/shared'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  targetRole: 'all' | 'teacher' | 'parent' | 'student'
  createdAt: string
}

interface NotificationFormData {
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  targetRole: 'all' | 'teacher' | 'parent' | 'student'
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  total?: number
  message?: string
}

const typeOptions = [
  { value: 'info', label: 'Thông tin' },
  { value: 'warning', label: 'Cảnh báo' },
  { value: 'success', label: 'Thành công' },
  { value: 'error', label: 'Quan trọng' },
]

const roleOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'parent', label: 'Phụ huynh' },
  { value: 'student', label: 'Học sinh' },
]

export function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        const result: ApiResponse<Notification> = await response.json()
        if (result.success) {
          setNotifications(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  const form = useForm<NotificationFormData>({
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      targetRole: 'all',
    },
  })

  // Handle submit - memoized
  const handleSubmit = useCallback(async (data: NotificationFormData) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result: ApiResponse<Notification> = await response.json()
      if (result.success) {
        setNotifications([result.data[0], ...notifications])
        form.reset()
      }
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  }, [notifications, form])

  // Handle delete - memoized
  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        setNotifications(notifications.filter((n) => n.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [notifications])

  // Status mapper - memoized
  const getStatusForType = useCallback((type: Notification['type']) => {
    const statusMap = {
      info: 'info' as const,
      warning: 'warning' as const,
      success: 'success' as const,
      error: 'error' as const,
    }
    return statusMap[type]
  }, [])

  // Role text mapper - memoized
  const getRoleText = useCallback((role: Notification['targetRole']) => {
    const roleMap = {
      all: 'Tất cả',
      teacher: 'Giáo viên',
      parent: 'Phụ huynh',
      student: 'Học sinh',
    }
    return roleMap[role]
  }, [])

  // Type label mapper - memoized
  const getTypeLabel = useCallback((type: Notification['type']) => {
    const labelMap = {
      info: 'Thông tin',
      warning: 'Cảnh báo',
      success: 'Thành công',
      error: 'Quan trọng',
    }
    return labelMap[type]
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Create Notification Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2">
            <Megaphone className="h-5 w-5 text-[#0284C7]" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Tạo thông báo mới</h2>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            name="title"
            label="Tiêu đề"
            placeholder="Nhập tiêu đề thông báo"
            required
          />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Nội dung <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              {...form.register('message', { required: true })}
              className="h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              placeholder="Nhập nội dung thông báo"
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="type"
              label="Loại thông báo"
              options={typeOptions}
              required
            />
            <FormSelect
              name="targetRole"
              label="Đối tượng"
              options={roleOptions}
              required
            />
          </div>

          <PrimaryButton type="submit" fullWidth>
            <Send className="mr-2 h-4 w-4" />
            Gửi thông báo
          </PrimaryButton>
        </form>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2">
              <Bell className="h-5 w-5 text-[#0284C7]" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Danh sách thông báo</h2>
          </div>
          <span className="text-sm text-slate-500">{notifications.length} thông báo</span>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="mb-4 h-12 w-12 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">Chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-[#0284C7] hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={getStatusForType(notification.type)}
                        label={getTypeLabel(notification.type)}
                      />
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {getRoleText(notification.targetRole)}
                      </span>
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-slate-800">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-[10px] text-slate-400">
                  {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
