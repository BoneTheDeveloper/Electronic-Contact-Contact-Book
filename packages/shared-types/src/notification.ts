/**
 * Multi-Channel Notification System Types
 * Supports tiered delivery via WebSocket, email, in-app, and push
 */

// Re-export RealtimeChannel type for mobile
export type { RealtimeChannel } from '@supabase/supabase-js';

// Core notification types
export type NotificationPriority = 'low' | 'normal' | 'high' | 'emergency';
export type NotificationCategory = 'announcement' | 'emergency' | 'reminder' | 'system';
export type NotificationChannel = 'websocket' | 'email' | 'in_app' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

/**
 * Input for creating a new notification (admin only)
 */
export interface NotificationCreateInput {
  title: string;
  content: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  targetRole: 'admin' | 'teacher' | 'parent' | 'student' | 'all';
  targetGradeIds?: string[];
  targetClassIds?: string[];
  targetUserIds?: string[];
  scheduledFor?: string; // ISO date string
}

/**
 * Notification recipient mapping
 */
export interface NotificationRecipient {
  id: string;
  notificationId: string;
  recipientId: string;
  role: string;
  createdAt: string;
}

/**
 * Delivery log entry per channel
 */
export interface NotificationLog {
  id: string;
  notificationId: string;
  recipientId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  errorMessage?: string;
  retryCount: number;
  externalId?: string;
  createdAt: string;
}

/**
 * Complete notification with recipients and delivery logs
 */
export interface NotificationWithRecipients {
  id: string;
  senderId: string;
  title: string;
  content: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  scheduledFor?: string;
  expiresAt?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  recipients: NotificationRecipient[];
  logs: NotificationLog[];
}

/**
 * Notification list item (for UI lists)
 */
export interface NotificationListItem {
  id: string;
  title: string;
  content: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
}

/**
 * User notification inbox item
 */
export interface UserNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  sender?: {
    id: string;
    fullName?: string;
  };
}

/**
 * Notification statistics for admin dashboard
 */
export interface NotificationStats {
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  byChannel: {
    websocket: number;
    email: number;
    inApp: number;
    push: number;
  };
}

/**
 * Notification delivery status summary
 */
export interface DeliveryStatus {
  notificationId: string;
  totalRecipients: number;
  delivered: number;
  failed: number;
  pending: number;
  channels: {
    channel: NotificationChannel;
    sent: number;
    delivered: number;
    failed: number;
  }[];
}
