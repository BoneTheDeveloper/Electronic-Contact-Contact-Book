'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Bell, Send, Trash2, Megaphone, CheckCircle, XCircle, Clock } from 'lucide-react'
import { StatusBadge, PrimaryButton, FormField, FormSelect } from '@/components/admin/shared'
import { subscribeToAllNotifications, subscribeToDeliveryStatus, unsubscribeChannel } from '@/lib/supabase/realtime'
import type {
  NotificationCreateInput,
  NotificationListItem,
  NotificationCategory,
  NotificationPriority,
  DeliveryStatus,
  RealtimeChannel,
} from '@school-management/shared-types'

interface DeliveryStatusData {
  notificationId: string
  total: number
  delivered: number
  failed: number
  pending: number
}

interface NotificationFormData {
  title: string
  content: string
  category: NotificationCategory
  priority: NotificationPriority
  targetRole: 'admin' | 'teacher' | 'parent' | 'student' | 'all'
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

const categoryOptions = [
  { value: 'announcement', label: 'Thông báo' },
  { value: 'emergency', label: 'Khẩn cấp' },
  { value: 'reminder', label: 'Nhắc nhở' },
  { value: 'system', label: 'Hệ thống' },
]

const priorityOptions = [
  { value: 'low', label: 'Thấp' },
  { value: 'normal', label: 'Bình thường' },
  { value: 'high', label: 'Cao' },
  { value: 'emergency', label: 'Khẩn cấp' },
]

const roleOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'parent', label: 'Phụ huynh' },
  { value: 'student', label: 'Học sinh' },
]

export function NotificationManagement() {
  const [notifications, setNotifications] = useState<NotificationListItem[]>([])
  const [isSending, setIsSending] = useState(false)
  const [deliveryStatuses, setDeliveryStatuses] = useState<Record<string, DeliveryStatusData>>({})

  // Track active delivery status channels to prevent memory leaks
  const deliveryChannelsRef = useRef<Map<string, RealtimeChannel>>(new Map())

  const form = useForm<NotificationFormData>({
    defaultValues: {
      title: '',
      content: '',
      category: 'announcement',
      priority: 'normal',
      targetRole: 'all',
    },
  })

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Subscribe to all notification changes (admin view)
  useEffect(() => {
    const channel = subscribeToAllNotifications(({ event, notification }) => {
      if (event === 'INSERT' && notification) {
        // Add new notification to list
        setNotifications((prev) => {
          const newItem: NotificationListItem = {
            id: notification.id,
            title: notification.title,
            content: notification.content,
            category: (notification.category || 'announcement') as NotificationCategory,
            priority: (notification.priority || 'normal') as NotificationPriority,
            isRead: notification.is_read ?? false,
            createdAt: notification.created_at ?? new Date().toISOString(),
          }
          return [newItem, ...prev]
        })

        // Subscribe to delivery status for new notification
        subscribeToNotificationDelivery(notification.id)
      } else if (event === 'DELETE') {
        // Remove deleted notification
        setNotifications((prev) => prev.filter((n) => n.id !== notification?.id))
        // Clean up delivery status
        setDeliveryStatuses((prev) => {
          const updated = { ...prev }
          delete updated[notification?.id || '']
          return updated
        })
        // Clean up delivery channel
        const deliveryChannel = deliveryChannelsRef.current.get(notification?.id || '')
        if (deliveryChannel) {
          unsubscribeChannel(deliveryChannel)
          deliveryChannelsRef.current.delete(notification?.id || '')
        }
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  // Subscribe to delivery status updates for existing notifications
  // Fixed: Properly cleanup previous subscriptions before creating new ones
  useEffect(() => {
    // Cleanup all existing delivery channels
    deliveryChannelsRef.current.forEach((channel) => {
      unsubscribeChannel(channel)
    })
    deliveryChannelsRef.current.clear()

    // Subscribe to notifications with limit to prevent memory issues
    const notificationsToTrack = notifications.slice(0, 20) // Max 20 concurrent subscriptions

    notificationsToTrack.forEach((notification) => {
      // Skip if already subscribed (defensive check)
      if (deliveryChannelsRef.current.has(notification.id)) return

      subscribeToNotificationDelivery(notification.id)
    })

    // Cleanup on unmount
    return () => {
      deliveryChannelsRef.current.forEach((channel) => {
        unsubscribeChannel(channel)
      })
      deliveryChannelsRef.current.clear()
    }
  }, [notifications])

  const subscribeToNotificationDelivery = (notificationId: string) => {
    // Skip if already subscribed
    if (deliveryChannelsRef.current.has(notificationId)) {
      return
    }

    const channel = subscribeToDeliveryStatus(notificationId, (status) => {
      setDeliveryStatuses((prev) => {
        const current = prev[notificationId] || {
          notificationId,
          total: 0,
          delivered: 0,
          failed: 0,
          pending: 0,
        }

        // Update based on status
        let updated: DeliveryStatusData
        if (status.status === 'sent' || status.status === 'delivered') {
          updated = {
            ...current,
            total: current.total + 1,
            delivered: current.delivered + 1,
          }
        } else if (status.status === 'failed') {
          updated = {
            ...current,
            total: current.total + 1,
            failed: current.failed + 1,
          }
        } else if (status.status === 'pending') {
          updated = {
            ...current,
            total: current.total + 1,
            pending: current.pending + 1,
          }
        } else {
          updated = current
        }

        return {
          ...prev,
          [notificationId]: updated,
        }
      })
    })

    // Store channel reference for cleanup
    deliveryChannelsRef.current.set(notificationId, channel)
  }

  const fetchNotifications = async () => {
    try {
      // Add pagination limit to prevent unbounded state growth
      const response = await fetch('/api/notifications?page=1&limit=50')
      const result: ApiResponse<{ data: NotificationListItem[]; total: number }> =
        await response.json()
      if (result.success && result.data) {
        setNotifications(result.data.data || [])
      }
    } catch (error) {
      console.error('[NotificationManagement] Failed to fetch:', error)
    }
  }

  const handleSubmit = useCallback(
    async (data: NotificationFormData) => {
      setIsSending(true)
      try {
        const payload: NotificationCreateInput = {
          title: data.title,
          content: data.content,
          category: data.category,
          priority: data.priority,
          targetRole: data.targetRole,
        }

        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const result: ApiResponse<NotificationListItem> = await response.json()
        if (result.success && result.data) {
          setNotifications((prev) => [result.data!, ...prev])
          form.reset()
        }
      } catch (error) {
        console.error('[NotificationManagement] Failed to create:', error)
      } finally {
        setIsSending(false)
      }
    },
    [form]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      } catch (error) {
        console.error('[NotificationManagement] Failed to delete:', error)
      }
    },
    []
  )

  const getCategoryLabel = useCallback((category: NotificationCategory) => {
    const labels: Record<NotificationCategory, string> = {
      announcement: 'Thông báo',
      emergency: 'Khẩn cấp',
      reminder: 'Nhắc nhở',
      system: 'Hệ thống',
    }
    return labels[category] || category
  }, [])

  const getStatusForCategory = useCallback((category: NotificationCategory) => {
    const statusMap: Record<NotificationCategory, 'info' | 'warning' | 'success' | 'error'> = {
      announcement: 'info',
      emergency: 'error',
      reminder: 'warning',
      system: 'success',
    }
    return statusMap[category] || 'info'
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Create Notification Form */}
      <NotificationComposer
        form={form}
        onSubmit={handleSubmit}
        isSending={isSending}
      />

      {/* Notifications List */}
      <NotificationList
        notifications={notifications}
        onDelete={handleDelete}
        getCategoryLabel={getCategoryLabel}
        getStatusForCategory={getStatusForCategory}
        deliveryStatuses={deliveryStatuses}
      />
    </div>
  )
}

// Notification Composer Component
function NotificationComposer({
  form,
  onSubmit,
  isSending,
}: {
  form: ReturnType<typeof useForm<NotificationFormData>>
  onSubmit: (data: NotificationFormData) => void
  isSending: boolean
}) {
  const category = form.watch('category')
  const priority = form.watch('priority')

  // Calculate expected channels
  const expectedChannels = useMemo(() => {
    if (priority === 'emergency' || category === 'emergency') {
      return ['WebSocket', 'Email', 'In-App']
    }
    if (category === 'announcement') {
      return ['WebSocket', 'Email']
    }
    return ['In-App']
  }, [category, priority])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2">
          <Megaphone className="h-5 w-5 text-[#0284C7]" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Tạo thông báo mới</h2>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {...form.register('content', { required: true })}
              className="h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-colors focus:border-[#0284C7] focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
              placeholder="Nhập nội dung thông báo"
            />
            {form.formState.errors.content && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="category"
              label="Loại thông báo"
              options={categoryOptions}
              required
            />
            <FormSelect
              name="priority"
              label="Mức độ ưu tiên"
              options={priorityOptions}
              required
            />
          </div>

          <FormSelect
            name="targetRole"
            label="Đối tượng"
            options={roleOptions}
            required
          />

          {/* Delivery Preview */}
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="mb-2 text-xs font-medium text-slate-700">Kênh gửi dự kiến:</p>
            <div className="flex flex-wrap gap-2">
              {expectedChannels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>

          <PrimaryButton type="submit" fullWidth disabled={isSending}>
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Đang gửi...' : 'Gửi thông báo'}
          </PrimaryButton>
        </form>
      </FormProvider>
    </div>
  )
}

// Notification List Component
function NotificationList({
  notifications,
  onDelete,
  getCategoryLabel,
  getStatusForCategory,
  deliveryStatuses,
}: {
  notifications: NotificationListItem[]
  onDelete: (id: string) => void
  getCategoryLabel: (category: NotificationCategory) => string
  getStatusForCategory: (category: NotificationCategory) => 'info' | 'warning' | 'success' | 'error'
  deliveryStatuses: Record<string, DeliveryStatusData>
}) {
  return (
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
            <NotificationCard
              key={notification.id}
              notification={notification}
              getCategoryLabel={getCategoryLabel}
              getStatusForCategory={getStatusForCategory}
              deliveryStatus={deliveryStatuses[notification.id]}
              onDelete={() => onDelete(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Individual Notification Card
function NotificationCard({
  notification,
  getCategoryLabel,
  getStatusForCategory,
  deliveryStatus,
  onDelete,
}: {
  notification: NotificationListItem
  getCategoryLabel: (category: NotificationCategory) => string
  getStatusForCategory: (category: NotificationCategory) => 'info' | 'warning' | 'success' | 'error'
  deliveryStatus?: DeliveryStatusData
  onDelete: () => void
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-[#0284C7] hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={getStatusForCategory(notification.category)}
              label={getCategoryLabel(notification.category)}
            />
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                notification.priority === 'emergency'
                  ? 'bg-red-100 text-red-700'
                  : notification.priority === 'high'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-200 text-slate-600'
              }`}
            >
              {notification.priority === 'emergency'
                ? 'Khẩn cấp'
                : notification.priority === 'high'
                  ? 'Cao'
                  : notification.priority === 'low'
                    ? 'Thấp'
                    : 'Bình thường'}
            </span>
          </div>
          <h3 className="mb-1 text-sm font-bold text-slate-800">{notification.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2">{notification.content}</p>

          {/* Delivery Status Indicator */}
          {deliveryStatus && deliveryStatus.total > 0 && (
            <DeliveryStatusIndicator status={deliveryStatus} />
          )}
        </div>
        <button
          onClick={onDelete}
          className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-[10px] text-slate-400">
        {new Date(notification.createdAt).toLocaleString('vi-VN')}
      </p>
    </div>
  )
}

// Delivery Status Indicator Component
function DeliveryStatusIndicator({ status }: { status: DeliveryStatusData }) {
  const { total, delivered, failed, pending } = status
  const progress = total > 0 ? (delivered / total) * 100 : 0

  return (
    <div className="mt-3 space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-600 font-medium">
          {delivered}/{total}
        </span>
      </div>

      {/* Status breakdown */}
      <div className="flex items-center gap-3 text-[10px]">
        {delivered > 0 && (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            {delivered} đã gửi
          </span>
        )}
        {pending > 0 && (
          <span className="flex items-center gap-1 text-orange-600">
            <Clock className="h-3 w-3" />
            {pending} đang chờ
          </span>
        )}
        {failed > 0 && (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="h-3 w-3" />
            {failed} thất bại
          </span>
        )}
      </div>
    </div>
  )
}
