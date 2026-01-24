/**
 * Supabase Realtime Subscription Helpers
 * Client-side utilities for subscribing to notification updates
 */

import { createClient } from './client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Notification types from database
type Notification = Database['public']['Tables']['notifications']['Row'];
type NotificationRecipient = Database['public']['Tables']['notification_recipients']['Row'];

/**
 * Subscribe to user's notification channel via Realtime
 * @param userId Current user's ID
 * @param callback Function to call when new notification arrives
 * @returns RealtimeChannel (call .unsubscribe() to cleanup)
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: {
    id: string;
    title: string;
    content: string;
    category: string;
    priority: string;
    created_at: string;
  }) => void
): RealtimeChannel {
  const supabase = createClient();
  const channelName = `user:${userId}:notifications`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload: RealtimePostgresChangesPayload<Notification>) => {
        const newNotification = payload.new;
        callback({
          id: newNotification.id,
          title: newNotification.title,
          content: newNotification.content,
          category: newNotification.category || 'announcement',
          priority: newNotification.priority || 'normal',
          created_at: newNotification.created_at,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error('[Realtime] Failed to subscribe to notifications');
      } else if (status === 'SUBSCRIBED') {
        console.log('[Realtime] Subscribed to notifications for user:', userId);
      }
    });

  return channel;
}

/**
 * Subscribe to notification read status updates
 * @param userId Current user's ID
 * @param callback Function to call when notification status changes
 * @returns RealtimeChannel (call .unsubscribe() to cleanup)
 */
export function subscribeToNotificationUpdates(
  userId: string,
  callback: (payload: {
    id: string;
    isRead: boolean;
    readAt: string | null;
  }) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`notifications_updates_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${userId}`,
      },
      (payload: RealtimePostgresChangesPayload<Notification>) => {
        callback({
          id: payload.new.id,
          isRead: payload.new.is_read,
          readAt: payload.new.read_at,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error('[Realtime] Failed to subscribe to notification updates');
      }
    });

  return channel;
}

/**
 * Subscribe to all notification changes for admin
 * @param callback Function to call when any notification changes
 * @returns RealtimeChannel (call .unsubscribe() to cleanup)
 */
export function subscribeToAllNotifications(
  callback: (payload: {
    event: 'INSERT' | 'UPDATE' | 'DELETE';
    notification?: Notification;
    oldNotification?: Notification;
  }) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel('all_notifications_admin')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
      },
      (payload: RealtimePostgresChangesPayload<Notification>) => {
        callback({
          event: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          notification: payload.new,
          oldNotification: payload.old,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error('[Realtime] Failed to subscribe to all notifications');
      }
    });

  return channel;
}

/**
 * Subscribe to delivery status updates for a specific notification
 * @param notificationId Notification ID to track
 * @param callback Function to call when delivery status changes
 * @returns RealtimeChannel (call .unsubscribe() to cleanup)
 */
export function subscribeToDeliveryStatus(
  notificationId: string,
  callback: (status: {
    channel: string;
    status: string;
    recipientId: string;
  }) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`delivery_status_${notificationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notification_logs',
        filter: `notification_id=eq.${notificationId}`,
      },
      (payload: RealtimePostgresChangesPayload<Database['public']['Tables']['notification_logs']['Row']>) => {
        callback({
          channel: payload.new.channel,
          status: payload.new.status,
          recipientId: payload.new.recipient_id,
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error('[Realtime] Failed to subscribe to delivery status');
      }
    });

  return channel;
}

/**
 * Unsubscribe from a realtime channel
 * @param channel The channel to unsubscribe from
 */
export function unsubscribeChannel(channel: RealtimeChannel): void {
  const supabase = createClient();
  supabase.removeChannel(channel);
}

/**
 * React hook for subscribing to user notifications
 * @param userId Current user's ID
 * @param onNewNotification Callback for new notifications
 * @returns Cleanup function
 */
export function useNotificationSubscription(
  userId: string | undefined,
  onNewNotification: (notification: {
    id: string;
    title: string;
    content: string;
    category: string;
    priority: string;
    created_at: string;
  }) => void
): () => void {
  if (!userId) {
    return () => {};
  }

  const channel = subscribeToNotifications(userId, onNewNotification);

  // Return cleanup function
  return () => {
    channel.unsubscribe();
  };
}
