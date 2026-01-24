/**
 * Notifications Screen
 * Real-time notifications from Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/stores/auth';
import { mockNotifications } from '../../mock-data';
import { colors } from '../../theme';
import type { ParentCommStackNavigationProp } from '../../navigation/types';
import type {
  NotificationCategory,
  NotificationPriority,
  UserNotification,
} from '@school-management/shared-types';

// Type for database notification
interface DatabaseNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender_id: string;
}

const NOTIFICATION_EMOJIS: Record<NotificationCategory, string> = {
  announcement: '🔔',
  emergency: '🚨',
  reminder: '📋',
  system: '⚙️',
};

const NOTIFICATION_COLORS: Record<NotificationCategory, string> = {
  announcement: '#0284C7',
  emergency: '#DC2626',
  reminder: '#7C3AED',
  system: '#6B7280',
};

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: '#9CA3AF',
  normal: '#0284C7',
  high: '#F59E0B',
  emergency: '#DC2626',
};

interface NotificationsScreenProps {
  navigation?: ParentCommStackNavigationProp;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<DatabaseNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<DatabaseNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const notificationsData = (mockData as DatabaseNotification[]) || []
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error('[Notifications] Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      try {
        const { error } = await supabase
          .from('notifications')
          .update({
            is_read: true,
            read_at: new Date().toISOString(),
          })
          .eq('id', notificationId)
          .eq('recipient_id', user.id);

        if (error) throw error;

        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error('[Notifications] Mark as read error:', error);
      }
    },
    [user?.id]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    // Use functional state update to avoid dependency on notifications
    setNotifications((currentNotifications) => {
      const unreadIds = currentNotifications.filter((n) => !n.is_read).map((n) => n.id);
      if (unreadIds.length === 0) return currentNotifications;

      // Execute async update outside of state setter
      setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('notifications')
            .update({
              is_read: true,
              read_at: new Date().toISOString(),
            })
            .in('id', unreadIds)
            .eq('recipient_id', user.id);

          if (error) throw error;

          // Update count after successful update
          setUnreadCount(0);
        } catch (error) {
          console.error('[Notifications] Mark all as read error:', error);
        }
      }, 0);

      // Optimistic update
      return currentNotifications.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }));
    });
  }, [user?.id]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`user_notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as DatabaseNotification;
          setNotifications((prev) => {
            // Avoid duplicates
            if (prev.some((n) => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev];
          });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as DatabaseNotification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Notifications] Subscribed to real-time updates');
        } else if (status === 'SUBSCRIPTION_ERROR') {
          console.error('[Notifications] Subscription error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Initial fetch and filter effect
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Update filtered notifications when filter or notifications change
  useEffect(() => {
    if (filter === 'unread') {
      setFilteredNotifications(notifications.filter((n) => !n.is_read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [filter, notifications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getCategoryLabel = (category: NotificationCategory): string => {
    const labels: Record<NotificationCategory, string> = {
      announcement: 'Thông báo',
      emergency: 'Khẩn cấp',
      reminder: 'Nhắc nhở',
      system: 'Hệ thống',
    };
    return labels[category] || category;
  };

  const getPriorityLabel = (priority: NotificationPriority): string => {
    const labels: Record<NotificationPriority, string> = {
      low: 'Thấp',
      normal: 'Bình thường',
      high: 'Cao',
      emergency: 'Khẩn cấp',
    };
    return labels[priority] || priority;
  };

  const renderNotification = ({ item }: { item: DatabaseNotification }) => {
    const iconColor = NOTIFICATION_COLORS[item.category];
    const iconEmoji = NOTIFICATION_EMOJIS[item.category];
    const priorityColor = PRIORITY_COLORS[item.priority];

    return (
      <TouchableOpacity
        className={`rounded-xl py-3 px-4 ${!item.is_read ? 'bg-sky-50' : 'bg-white'}`}
        onPress={() => !item.is_read && markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-start pr-6">
          <View
            className="w-12 h-12 rounded-full justify-center items-center"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Text style={{ fontSize: 24 }}>{iconEmoji}</Text>
          </View>
          <View className="flex-1 ml-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[15px] font-bold text-gray-800 flex-1" numberOfLines={1}>
                {item.title}
              </Text>
              {!item.is_read && (
                <View className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: colors.primary }} />
              )}
            </View>
            <View className="flex-row items-center gap-2 mb-1.5">
              <Text
                className="text-[10px] px-2 py-0.5 rounded font-medium"
                style={{ backgroundColor: `${iconColor}20`, color: iconColor }}
              >
                {getCategoryLabel(item.category)}
              </Text>
              {item.priority !== 'normal' && (
                <Text
                  className="text-[10px] px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}
                >
                  {getPriorityLabel(item.priority)}
                </Text>
              )}
            </View>
            <Text className="text-[13px] text-gray-500 leading-[18px] mb-1" numberOfLines={2}>
              {item.content}
            </Text>
            <Text className="text-[11px] text-gray-400">{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className="bg-sky-600 pt-[60px] px-6 pb-6 rounded-b-[20px]">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[24px] font-bold text-white">Thông báo</Text>
          <Text className="text-[14px] text-white/80 mt-1">Cập nhật từ nhà trường</Text>
        </View>
        {unreadCount > 0 && (
          <View className="bg-red-500 rounded-full px-3 py-1">
            <Text className="text-white text-sm font-bold">{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Filter buttons */}
      <View className="flex-row gap-2 mt-4">
        <TouchableOpacity
          className={`flex-1 py-2 px-4 rounded-lg ${filter === 'all' ? 'bg-white' : 'bg-white/20'}`}
          onPress={() => setFilter('all')}
        >
          <Text
            className={`text-center text-sm font-medium ${filter === 'all' ? 'text-sky-600' : 'text-white'}`}
          >
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 px-4 rounded-lg ${filter === 'unread' ? 'bg-white' : 'bg-white/20'}`}
          onPress={() => setFilter('unread')}
        >
          <Text
            className={`text-center text-sm font-medium ${filter === 'unread' ? 'text-sky-600' : 'text-white'}`}
          >
            Chưa đọc
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-6xl mb-4">🔔</Text>
      <Text className="text-gray-500 text-center">
        {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {renderHeader()}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item: DatabaseNotification) => item.id}
        contentContainerClassName="p-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 ml-[76px]" />}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} tintColor={colors.primary} />
        }
      />

      {/* Mark all as read button */}
      {unreadCount > 0 && filter === 'all' && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-sky-600 rounded-full w-14 h-14 justify-center items-center shadow-lg"
          onPress={markAllAsRead}
        >
          <Text className="text-white text-xl">✓✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
