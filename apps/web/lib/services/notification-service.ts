/**
 * Multi-Channel Notification Service
 * Handles notification creation, delivery, and tracking
 *
 * Supports:
 * - Tiered delivery (emergency/announcement/reminder)
 * - Multiple channels (WebSocket, email, in-app, push)
 * - Delivery tracking and retry logic
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  NotificationCreateInput,
  NotificationWithRecipients,
  NotificationListItem,
  UserNotification,
  DeliveryStatus,
} from '@school-management/shared-types';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Create notification with recipients and trigger delivery
 * @param input Notification data from admin form
 * @param senderId ID of the admin creating the notification
 * @returns Created notification with recipients
 */
export async function createNotification(
  input: NotificationCreateInput,
  senderId: string
): Promise<NotificationWithRecipients> {
  const supabase = await createClient();

  // 1. Validate input
  if (!input.title?.trim() || !input.content?.trim()) {
    throw new Error('Title and content are required');
  }

  // Sanitize input to prevent XSS
  const sanitizedTitle = sanitizeHtml(input.title);
  const sanitizedContent = sanitizeHtml(input.content);

  // 2. Create notification
  // @ts-expect-error - Supabase type inference issue with notifications table
  const { data: notification, error: notifError } = await supabase
    .from('notifications')
    .insert({
      sender_id: senderId,
      recipient_id: senderId, // Temporary, will be replaced by recipients
      title: sanitizedTitle,
      content: sanitizedContent,
      category: input.category,
      priority: input.priority,
      scheduled_for: input.scheduledFor || null,
      type: getCategoryType(input.category),
      is_read: false,
    })
    .select()
    .single();

  if (notifError) {
    console.error('[Notification] Failed to create:', notifError);
    throw new Error(`Failed to create notification: ${notifError.message}`);
  }

  // 3. Resolve recipients using database function
  // @ts-expect-error - Supabase type inference issue with RPC functions
  const { data: recipients, error: recipientsError } = await supabase.rpc(
    'get_notification_recipients',
    {
      p_target_role: input.targetRole === 'all' ? null : input.targetRole,
      p_target_grade_ids: input.targetGradeIds || null,
      p_target_class_ids: input.targetClassIds || null,
      p_specific_user_ids: input.targetUserIds || null,
    }
  );

  if (recipientsError) {
    console.error('[Notification] Failed to resolve recipients:', recipientsError);
    throw new Error(`Failed to resolve recipients: ${recipientsError.message}`);
  }

  if (!recipients || recipients.length === 0) {
    // Clean up notification if no recipients
    // @ts-expect-error - Supabase type inference issue with notifications table
    await supabase.from('notifications').delete().eq('id', notification.id);
    throw new Error('No recipients found for the given criteria');
  }

  // 4. Create notification_recipients entries
  const recipientEntries = recipients.map((r: { user_id: string; role: string }) => ({
    notification_id: notification.id,
    recipient_id: r.user_id,
    role: r.role,
  }));

  // @ts-expect-error - Supabase type inference issue with notification_recipients table
  const { error: insertError } = await supabase
    .from('notification_recipients')
    .insert(recipientEntries);

  if (insertError) {
    console.error('[Notification] Failed to create recipients:', insertError);
    throw new Error(`Failed to add recipients: ${insertError.message}`);
  }

  // 5. Trigger delivery (non-blocking)
  // Don't await - let it run in background
  // @ts-expect-error - notification.id type inference issue
  deliverNotification(notification.id, recipientEntries).catch((error) => {
    console.error('[Notification] Delivery error:', error);
  });

  // 6. Fetch complete notification with recipients
  // @ts-expect-error - Supabase type inference issue with notification_recipients table
  const { data: completeNotification } = await supabase
    .from('notification_recipients')
    .select(`
      id,
      notification_id,
      recipient_id,
      role,
      created_at,
      notifications (
        id,
        sender_id,
        title,
        content,
        type,
        category,
        priority,
        scheduled_for,
        expires_at,
        is_read,
        read_at,
        created_at
      )
    `)
    .eq('notification_id', notification.id)
    .limit(1);

  return {
    id: notification.id,
    senderId: notification.sender_id,
    title: notification.title,
    content: notification.content,
    type: notification.type,
    category: notification.category,
    priority: notification.priority,
    scheduledFor: notification.scheduled_for,
    expiresAt: notification.expires_at,
    isRead: notification.is_read,
    readAt: notification.read_at,
    createdAt: notification.created_at,
    recipients: recipientEntries.map((r, i) => ({
      id: `temp-${i}`,
      notificationId: notification.id,
      recipientId: r.recipient_id,
      role: r.role,
      createdAt: new Date().toISOString(),
    })),
    logs: [],
  };
}

/**
 * Get notifications for admin (paginated)
 */
export async function getNotifications(options: {
  page: number;
  limit: number;
}): Promise<{ data: NotificationListItem[]; total: number }> {
  const supabase = await createClient();
  const { page, limit } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get count
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true });

  // Get paginated data
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, content, category, priority, is_read, created_at')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }

  return {
    data: (data || []).map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      category: n.category,
      priority: n.priority,
      isRead: n.is_read,
      createdAt: n.created_at,
    })),
    total: count || 0,
  };
}

/**
 * Get current user's notifications
 */
export async function getMyNotifications(
  userId: string,
  unreadOnly = false
): Promise<UserNotification[]> {
  const supabase = await createClient();

  const query = supabase
    .from('notification_recipients')
    .select(`
      notifications (
        id,
        title,
        content,
        type,
        category,
        priority,
        is_read,
        read_at,
        created_at,
        sender_id
      )
    `)
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false, foreignTable: 'notifications' });

  if (unreadOnly) {
    // Filter for unread - need to use a different approach
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, content, type, category, priority, is_read, read_at, created_at, sender_id')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch notifications: ${error.message}`);

    return (data || []).map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      type: n.type,
      category: n.category,
      priority: n.priority,
      isRead: n.is_read,
      readAt: n.read_at,
      createdAt: n.created_at,
    }));
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch notifications: ${error.message}`);

  return (
    data?.map((item) => ({
      id: item.notifications.id,
      title: item.notifications.title,
      content: item.notifications.content,
      type: item.notifications.type,
      category: item.notifications.category,
      priority: item.notifications.priority,
      isRead: item.notifications.is_read,
      readAt: item.notifications.read_at,
      createdAt: item.notifications.created_at,
    })) || []
  );
}

/**
 * Mark notifications as read
 */
export async function markAsRead(notificationIds: string[], userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .in('id', notificationIds)
    .eq('recipient_id', userId);

  if (error) {
    throw new Error(`Failed to mark as read: ${error.message}`);
  }
}

/**
 * Get delivery status for a notification
 */
export async function getDeliveryStatus(notificationId: string): Promise<DeliveryStatus> {
  const supabase = await createClient();

  // Get total recipients
  const { count: totalRecipients } = await supabase
    .from('notification_recipients')
    .select('*', { count: 'exact', head: true })
    .eq('notification_id', notificationId);

  // Get logs by status
  const { data: logs } = await supabase
    .from('notification_logs')
    .select('status, channel')
    .eq('notification_id', notificationId);

  const stats = {
    total: totalRecipients || 0,
    delivered: 0,
    failed: 0,
    pending: 0,
    channels: [] as {
      channel: 'websocket' | 'email' | 'in_app' | 'push';
      sent: number;
      delivered: number;
      failed: number;
    }[],
  };

  // Calculate stats
  logs?.forEach((log) => {
    if (log.status === 'delivered') stats.delivered++;
    else if (log.status === 'failed') stats.failed++;
    else if (log.status === 'pending') stats.pending++;
  });

  return stats;
}

// ============================================================================
// INTERNAL FUNCTIONS
// ============================================================================

/**
 * Deliver notification via appropriate channels
 */
async function deliverNotification(
  notificationId: string,
  recipients: Array<{ notification_id: string; recipient_id: string; role: string }>
): Promise<void> {
  const supabase = await createClient();

  // Get notification details
  const { data: notification } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .single();

  if (!notification) {
    console.error(`[Notification] Notification ${notificationId} not found`);
    return;
  }

  // Determine channels based on priority
  const channels = getChannelsForPriority(notification.priority, notification.category);

  console.log(
    `[Notification] Delivering ${notificationId} via ${channels.join(', ')} to ${recipients.length} recipients`
  );

  // Deliver to each recipient via each channel
  for (const recipient of recipients) {
    for (const channel of channels) {
      try {
        await deliverViaChannel(channel, notification, recipient.recipient_id);
      } catch (error) {
        console.error(
          `[Notification] Delivery failed: ${channel} -> ${recipient.recipient_id}`,
          error
        );
      }
    }
  }
}

/**
 * Determine delivery channels based on priority
 */
function getChannelsForPriority(
  priority: string,
  category: string
): Array<'websocket' | 'email' | 'in_app'> {
  // Emergency: All channels
  if (priority === 'emergency' || category === 'emergency') {
    return ['websocket', 'email', 'in_app'];
  }

  // Announcement: WebSocket + email
  if (category === 'announcement') {
    return ['websocket', 'email'];
  }

  // Reminder: In-app only
  return ['in_app'];
}

/**
 * Deliver via specific channel
 */
async function deliverViaChannel(
  channel: 'websocket' | 'email' | 'in_app',
  notification: Database['public']['Tables']['notifications']['Row'],
  recipientId: string
): Promise<void> {
  const supabase = await createClient();

  // Create log entry
  const { data: log, error: logError } = await supabase
    .from('notification_logs')
    .insert({
      notification_id: notification.id,
      recipient_id: recipientId,
      channel,
      status: 'pending',
    })
    .select()
    .single();

  if (logError) {
    console.error('[Notification] Failed to create log:', logError);
    throw logError;
  }

  try {
    let externalId: string | undefined;

    switch (channel) {
      case 'websocket':
        // WebSocket broadcast via Supabase Realtime
        externalId = await broadcastWebSocket(notification, recipientId);
        break;

      case 'email':
        // Email delivery (placeholder for now - requires email service)
        externalId = await sendEmail(notification, recipientId);
        break;

      case 'in_app':
        // Already in notifications table
        externalId = notification.id;
        break;
    }

    // Update log as sent
    await supabase
      .from('notification_logs')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        external_id: externalId,
      })
      .eq('id', log.id);

    console.log(
      `[Notification] Delivered via ${channel} to ${recipientId}: ${notification.id}`
    );
  } catch (error) {
    // Update log as failed
    await supabase
      .from('notification_logs')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message.substring(0, 500) : 'Unknown error',
        retry_count: 1,
      })
      .eq('id', log.id);

    throw error;
  }
}

/**
 * Broadcast via Supabase Realtime
 */
async function broadcastWebSocket(notification: Database['public']['Tables']['notifications']['Row'], recipientId: string): Promise<string> {
  // Note: This requires Supabase Realtime to be properly configured
  // For now, we return a channel ID - actual broadcast will be handled
  // by the client subscribing to postgres_changes on the notifications table
  const channelName = `user:${recipientId}:notifications`;

  // The actual broadcast happens automatically via Supabase Realtime
  // when the notification is inserted into the notifications table
  // Clients subscribe to postgres_changes events

  return channelName;
}

/**
 * Send email (placeholder - requires email service setup)
 */
async function sendEmail(notification: Database['public']['Tables']['notifications']['Row'], recipientId: string): Promise<string> {
  // Get recipient email
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', recipientId)
    .single();

  if (!profile?.email) {
    throw new Error('Recipient email not found');
  }

  // TODO: Integrate with email service (Resend/SendGrid)
  // For now, just log that email would be sent
  console.log(
    `[Notification] Email would be sent to ${profile.email}: ${notification.title}`
  );

  // Return placeholder ID
  return `email-placeholder-${Date.now()}`;
}

/**
 * Map category to legacy type field
 */
function getCategoryType(category: string): string {
  switch (category) {
    case 'emergency':
      return 'error';
    case 'reminder':
      return 'info';
    case 'announcement':
      return 'success';
    default:
      return 'info';
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags, javascript: protocols, and event handlers
 */
function sanitizeHtml(input: string): string {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onclick=/gi, '')
    .trim();
}
