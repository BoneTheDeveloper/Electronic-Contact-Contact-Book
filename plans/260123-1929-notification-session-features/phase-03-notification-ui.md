---
title: "Phase 03: Notification UI"
description: "In-app notification inbox and admin notification composer"
status: completed
priority: P1
effort: 4h
tags: [ui, react, nextjs, realtime, notifications, admin]
---

## Context

**Existing**: `apps/web/components/admin/notifications/NotificationManagement.tsx` (mock data)

**Target**: Real Supabase-backed UI with:
- Real-time notification inbox for users
- Admin notification composer with recipient targeting
- Live delivery status tracking
- Read/unread management

## Overview

Build two main UI components:
1. **Admin Notification Composer**: Create and send notifications
2. **User Notification Inbox**: View and manage received notifications

## Requirements

- Admin: Create notification with target selection
- Admin: View delivery status per channel
- Users: Real-time notification list
- Users: Mark as read/unread
- Users: Filter by type/status
- Real-time updates via WebSocket

## Architecture

```
Admin Dashboard
  └─ NotificationManagement (existing, upgrade)
      ├─ NotificationComposer (new)
      │   ├─ TargetSelector (role/grade/class)
      │   ├─ ChannelPreview
      │   └─ SchedulePicker
      └─ DeliveryStatus (new)
          └─ ChannelStatusIndicator

User Dashboard
  └─ NotificationInbox (new)
      ├─ NotificationList
      │   ├─ NotificationCard
      │   └─ FilterBar
      ├─ RealtimeBadge (unread count)
      └─ MarkAllReadButton
```

## Implementation Steps

### Step 1: Update NotificationManagement Component

**File**: `apps/web/components/admin/notifications/NotificationManagement.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Bell, Send, Trash2, Megaphone, CheckCircle, XCircle, Clock } from 'lucide-react'
import { StatusBadge, PrimaryButton, FormField, FormSelect } from '@/components/admin/shared'
import { subscribeToNotifications } from '@/lib/supabase/realtime'
import type { NotificationWithRecipients } from '@school-management/shared-types'

interface NotificationFormData {
  title: string
  content: string
  category: 'announcement' | 'emergency' | 'reminder'
  priority: 'low' | 'normal' | 'high' | 'emergency'
  targetRole: 'all' | 'teacher' | 'parent' | 'student'
  targetGradeIds?: string[]
  targetClassIds?: string[]
  scheduledFor?: string
}

export function NotificationManagement() {
  const [notifications, setNotifications] = useState<NotificationWithRecipients[]>([])
  const [isSending, setIsSending] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState<Record<string, any>>({})

  const form = useForm<NotificationFormData>({
    defaultValues: {
      title: '',
      content: '',
      category: 'announcement',
      priority: 'normal',
      targetRole: 'all',
    },
  })

  // Fetch notifications
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = subscribeToNotifications('admin', (notification) => {
      // Update delivery status in real-time
      setDeliveryStatus(prev => ({
        ...prev,
        [notification.notification_id]: notification
      }))
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const handleSubmit = async (data: NotificationFormData) => {
    setIsSending(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        setNotifications([result.data, ...notifications])
        form.reset()
      }
    } catch (error) {
      console.error('Failed to create notification:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setNotifications(notifications.filter((n) => n.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getDeliveryStatus = (notificationId: string) => {
    return deliveryStatus[notificationId]
  }

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
        getDeliveryStatus={getDeliveryStatus}
      />
    </div>
  )
}

// Notification Composer Component
function NotificationComposer({
  form,
  onSubmit,
  isSending
}: {
  form: ReturnType<typeof useForm<NotificationFormData>>
  onSubmit: (data: NotificationFormData) => void
  isSending: boolean
}) {
  const category = form.watch('category')
  const priority = form.watch('priority')
  const targetRole = form.watch('targetRole')

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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="category"
            label="Loại thông báo"
            options={[
              { value: 'announcement', label: 'Thông báo' },
              { value: 'emergency', label: 'Khẩn cấp' },
              { value: 'reminder', label: 'Nhắc nhở' },
            ]}
            required
          />
          <FormSelect
            name="priority"
            label="Mức độ ưu tiên"
            options={[
              { value: 'low', label: 'Thấp' },
              { value: 'normal', label: 'Bình thường' },
              { value: 'high', label: 'Cao' },
              { value: 'emergency', label: 'Khẩn cấp' },
            ]}
            required
          />
        </div>

        <FormSelect
          name="targetRole"
          label="Đối tượng"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'teacher', label: 'Giáo viên' },
            { value: 'parent', label: 'Phụ huynh' },
            { value: 'student', label: 'Học sinh' },
          ]}
          required
        />

        {/* Delivery Preview */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="mb-2 text-xs font-medium text-slate-700">
            Kênh gửi dự kiến:
          </p>
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
    </div>
  )
}

// Notification List Component
function NotificationList({
  notifications,
  onDelete,
  getDeliveryStatus
}: {
  notifications: NotificationWithRecipients[]
  onDelete: (id: string) => void
  getDeliveryStatus: (id: string) => any
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
              deliveryStatus={getDeliveryStatus(notification.id)}
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
  deliveryStatus,
  onDelete
}: {
  notification: NotificationWithRecipients
  deliveryStatus?: any
  onDelete: () => void
}) {
  const recipientCount = notification.recipients?.length || 0

  return (
    <div className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-[#0284C7] hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={notification.category}
              label={notification.category === 'emergency' ? 'Khẩn cấp' :
                     notification.category === 'reminder' ? 'Nhắc nhở' : 'Thông báo'}
            />
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {notification.recipients?.length || 0} người nhận
            </span>
          </div>
          <h3 className="mb-1 text-sm font-bold text-slate-800">
            {notification.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">{notification.content}</p>

          {/* Delivery Status */}
          {deliveryStatus && (
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

// Delivery Status Indicator
function DeliveryStatusIndicator({ status }: { status: any }) {
  const stats = useMemo(() => {
    if (!status?.logs) return null

    const logs = status.logs
    const sent = logs.filter((l: any) => l.status === 'sent').length
    const failed = logs.filter((l: any) => l.status === 'failed').length
    const pending = logs.filter((l: any) => l.status === 'pending').length

    return { sent, failed, pending, total: logs.length }
  }, [status])

  if (!stats) return null

  return (
    <div className="mt-2 flex items-center gap-3 text-[10px]">
      {stats.sent > 0 && (
        <span className="flex items-center gap-1 text-green-600">
          <CheckCircle className="h-3 w-3" />
          {stats.sent} đã gửi
        </span>
      )}
      {stats.pending > 0 && (
        <span className="flex items-center gap-1 text-orange-600">
          <Clock className="h-3 w-3" />
          {stats.pending} đang chờ
        </span>
      )}
      {stats.failed > 0 && (
        <span className="flex items-center gap-1 text-red-600">
          <XCircle className="h-3 w-3" />
          {stats.failed} thất bại
        </span>
      )}
    </div>
  )
}
```

### Step 2: Create User Notification Inbox

**File**: `apps/web/components/notifications/NotificationInbox.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, CheckCheck, Filter, Trash2 } from 'lucide-react'
import { subscribeToNotifications } from '@/lib/supabase/realtime'
import type { NotificationWithRecipients } from '@school-management/shared-types'

interface NotificationInboxProps {
  userId: string
}

export function NotificationInbox({ userId }: NotificationInboxProps) {
  const [notifications, setNotifications] = useState<NotificationWithRecipients[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time updates
    const channel = subscribeToNotifications(userId, (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => channel.unsubscribe()
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications/my?unreadOnly=${filter === 'unread'}`)
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.data.filter((n: any) => !n.isRead).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => !n.isRead)
      .map(n => n.id)

    if (unreadIds.length === 0) return

    try {
      await fetch('/api/notifications/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds }),
      })

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
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
                {unreadCount}
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
  onMarkAsRead
}: {
  notification: NotificationWithRecipients
  onMarkAsRead: () => void
}) {
  const isEmergency = notification.category === 'emergency' || notification.priority === 'emergency'

  return (
    <div
      className={`flex gap-3 p-4 transition-colors hover:bg-slate-50 ${
        !notification.isRead ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className={`mt-1 flex-shrink-0 rounded-full p-2 ${
        isEmergency ? 'bg-red-100' :
        notification.priority === 'high' ? 'bg-orange-100' :
        'bg-blue-100'
      }`}>
        <Bell className={`h-4 w-4 ${
          isEmergency ? 'text-red-600' :
          notification.priority === 'high' ? 'text-orange-600' :
          'text-blue-600'
        }`} />
      </div>

      <div className="flex-1">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className={`text-sm font-semibold ${
            !notification.isRead ? 'text-slate-900' : 'text-slate-600'
          }`}>
            {notification.title}
          </h3>
          {!notification.isRead && (
            <span className="flex-shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white">
              Mới
            </span>
          )}
        </div>
        <p className={`text-sm ${
          !notification.isRead ? 'text-slate-700' : 'text-slate-500'
        }`}>
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
```

### Step 3: Create Mobile Notification Inbox

**File**: `apps/mobile/src/screens/notifications/NotificationInboxScreen.tsx`

```typescript
import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { Bell, Check, Filter as FilterIcon } from 'lucide-react-native'
import { Text, Card, Badge, useTheme } from 'react-native-paper'
import { createClient } from '@school-management/shared-services/supabase'
import type { Notification } from '@school-management/shared-types'

export function NotificationInboxScreen() {
  const theme = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [unreadCount, setUnreadCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('user_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Bell size={24} color={theme.colors.primary} />
          <Text variant="titleMedium">Thông báo</Text>
          {unreadCount > 0 && (
            <Badge>{unreadCount}</Badge>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          style={{ padding: 8 }}
        >
          <FilterIcon size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />
        }
        style={{ flex: 1 }}
      >
        {filteredNotifications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Bell size={48} color={theme.colors.outline} />
            <Text style={{ marginTop: 16, color: theme.colors.outline }}>
              {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={() => markAsRead(notification.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  )
}

function NotificationCard({
  notification,
  onPress
}: {
  notification: Notification
  onPress: () => void
}) {
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ margin: 8, marginHorizontal: 16, backgroundColor: !notification.is_read ? theme.colors.primaryContainer : undefined }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: notification.priority === 'emergency'
                ? theme.colors.errorContainer
                : theme.colors.primaryContainer
            }}>
              <Bell
                size={20}
                color={notification.priority === 'emergency'
                  ? theme.colors.error
                  : theme.colors.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text variant="titleSmall" style={{ flex: 1 }}>
                  {notification.title}
                </Text>
                {!notification.is_read && (
                  <Badge size={16}>Mới</Badge>
                )}
              </View>
              <Text variant="bodyMedium" style={{ marginTop: 4, color: theme.colors.onSurfaceVariant }}>
                {notification.content}
              </Text>
              <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.outline }}>
                {new Date(notification.created_at).toLocaleString('vi-VN')}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}
```

## Todo List

- [ ] Update `NotificationManagement` component with real API
- [ ] Create `NotificationComposer` component
- [ ] Create `NotificationList` component
- [ ] Add `DeliveryStatusIndicator` component
- [ ] Create `NotificationInbox` component
- [ ] Add real-time subscription hooks
- [ ] Create mobile `NotificationInboxScreen`
- [ ] Test real-time updates
- [ ] Add loading states
- [ ] Add error handling

## Success Criteria

- [ ] Admin can create notifications
- [ ] Admin sees delivery status in real-time
- [ ] Users receive notifications in real-time
- [ ] Unread badge updates live
- [ ] Mark as read functionality works
- [ ] Filter by unread works
- [ ] Mobile UI matches design system

## Security Considerations

1. **Server Components**: Use server components for initial data fetch
2. **Row Level Security**: Supabase RLS ensures users only see their notifications
3. **XSS Prevention**: Sanitize notification content before rendering
4. **CSRF Protection**: Use Next.js CSRF tokens for mutations

## Performance Optimizations

1. **Infinite Scroll**: Load notifications in batches
2. **Debounce**: Debounce search/filter inputs
3. **Realtime Optimization**: Use selective subscriptions
4. **Image Optimization**: Next.js Image for avatars

## Next Steps

After completing this phase:
- Proceed to [Phase 04: Single Session](./phase-04-single-session.md)
- Implement session tracking
- Add middleware for session validation

## Unresolved Questions

1. Notification retention period - auto-delete after 30 days?
2. Push notification integration with Firebase/APN?
3. Email notification preferences per user?
4. Notification grouping for similar notifications?
