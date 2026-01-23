'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, Check, CheckCheck, Filter } from 'lucide-react'
import { subscribeToNotifications } from '@/lib/supabase/realtime'
import type { UserNotification, NotificationCategory } from '@school-management/shared-types'

interface NotificationInboxProps {
  userId: string
}

export function NotificationInbox({ userId }: NotificationInboxProps) {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time updates
    const channel = subscribeToNotifications(userId, (notification) => {
      setNotifications((prev) => {
        // Avoid duplicates
        if (prev.some((n) => n.id === notification.id)) return prev
        // Add new notification with proper type
        const newItem: UserNotification = {
          id: notification.id,
          title: notification.title,
          content: notification.content,
          type: 'general',
          category: notification.category as any,
          priority: notification.priority as any,
          isRead: false,
          createdAt: notification.created_at,
        }
        return [newItem, ...prev]
      })
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  // Refetch when filter changes
  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/my?unreadOnly=${filter === 'unread'}`)
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data || [])
        setUnreadCount(
          (result.data || []).filter((n: UserNotification) => !n.isRead).length
        )
      }
    } catch (error) {
      console.error('[NotificationInbox] Failed to fetch:', error)
    }
  }

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await fetch('/api/notifications/my', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationIds: [notificationId] }),
        })

        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error('[NotificationInbox] Failed to mark as read:', error)
      }
    },
    []
  )

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)

    if (unreadIds.length === 0) return

    try {
      await fetch('/api/notifications/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds }),
      })

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('[NotificationInbox] Failed to mark all as read:', error)
    }
  }, [notifications])

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-5 w-5 text-[#0284C7]" />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h2 className="font-bold text-slate-800">Thông báo</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            title={filter === 'all' ? 'Chỉ chưa đọc' : 'Tất cả'}
          >
            <Filter className="h-4 w-4" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              <CheckCheck className="h-4 w-4" />
              Đọc tất cả
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">
              {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: UserNotification
  onMarkAsRead: () => void
}) {
  const isEmergency = notification.category === 'emergency' || notification.priority === 'emergency'

  return (
    <div
      className={`flex gap-3 p-4 transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
    >
      <div
        className={`mt-1 flex-shrink-0 rounded-full p-2 ${
          isEmergency
            ? 'bg-red-100'
            : notification.priority === 'high'
              ? 'bg-orange-100'
              : 'bg-blue-100'
        }`}
      >
        <Bell
          className={`h-4 w-4 ${
            isEmergency
              ? 'text-red-600'
              : notification.priority === 'high'
                ? 'text-orange-600'
                : 'text-blue-600'
          }`}
        />
      </div>

      <div className="flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
            {notification.title}
          </h3>
          {!notification.isRead && (
            <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
              Mới
            </span>
          )}
        </div>
        <p className={`text-sm ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
          {notification.content}
        </p>
        <p className="mt-2 text-[10px] text-slate-400">
          {new Date(notification.createdAt).toLocaleString('vi-VN')}
        </p>
      </div>

      {!notification.isRead && (
        <button
          onClick={onMarkAsRead}
          className="flex-shrink-0 self-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
          title="Đánh dấu đã đọc"
        >
          <Check className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Export a badge component for showing unread count in navigation
export function NotificationBadge({ userId }: { userId: string }) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch initial count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications/my?unreadOnly=true')
        const result = await response.json()
        if (result.success) {
          setUnreadCount(result.data?.length || 0)
        }
      } catch (error) {
        console.error('[NotificationBadge] Failed to fetch unread count:', error)
      }
    }

    fetchUnreadCount()

    // Subscribe to new notifications
    const channel = subscribeToNotifications(userId, () => {
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-slate-600" />
      {unreadCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  )
}
