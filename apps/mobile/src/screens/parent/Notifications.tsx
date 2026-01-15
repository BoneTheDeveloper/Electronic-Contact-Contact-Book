/**
 * Notifications Screen
 * Alert list and system notifications
 */

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { mockNotifications } from '../../mock-data';
import { colors } from '../../theme';

interface Notification {
  id: string;
  type: 'announcement' | 'homework' | 'exam' | 'fee' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  announcement: 'bell',
  homework: 'book-open-variant',
  exam: 'clipboard-text',
  fee: 'cash',
  general: 'information',
};

const NOTIFICATION_COLORS: Record<string, string> = {
  announcement: '#0284C7',
  homework: '#7C3AED',
  exam: '#DC2626',
  fee: '#D97706',
  general: '#6B7280',
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'fee',
    title: 'Nhắc nhở đóng học phí',
    message: 'Học phí tháng 1 (5,000,000 VND) sẽ đến hạn vào ngày 15/01/2026. Vui lòng đóng khoản học phí đúng hạn.',
    date: '2026-01-12T09:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'exam',
    title: 'Lịch thi giữa kỳ',
    message: 'Lịch thi giữa kỳ 2 sẽ diễn ra từ ngày 15/02/2026. Chi tiết lịch thi đã được đăng tải trên cổng thông tin.',
    date: '2026-01-11T14:30:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'homework',
    title: 'Bài tập về nhà',
    message: 'Bài tập Toán: Bài 45-50 (trang 112-115). Nộp trước ngày 15/01/2026.',
    date: '2026-01-10T16:00:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'announcement',
    title: 'Thông báo nghỉ lễ',
    message: 'Nhà trường thông báo lịch nghỉ Tết Nguyên Đán từ 28/01/2026 đến 05/02/2026.',
    date: '2026-01-09T08:00:00Z',
    read: true,
  },
  {
    id: '5',
    type: 'general',
    title: 'Họp phụ huynh',
    message: 'Nhắc nhở: Họp phụ huynh cuối học kỳ 1 vào ngày 25/01/2026 lúc 18:00.',
    date: '2026-01-08T10:00:00Z',
    read: true,
  },
];

export const NotificationsScreen: React.FC = () => {
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

  const renderNotification = ({ item }: { item: Notification }) => {
    const iconColor = NOTIFICATION_COLORS[item.type];
    const iconName = NOTIFICATION_ICONS[item.type];

    return (
      <Card style={[styles.notificationCard, !item.read && styles.unreadCard]}>
        <Card.Content style={styles.notificationContent}>
          <Avatar.Icon
            size={48}
            icon={iconName as any}
            style={{ backgroundColor: `${iconColor}20` }}
            color={iconColor}
          />
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {item.message}
            </Text>
            <Text style={styles.notificationDate}>{formatDate(item.date)}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <Text style={styles.headerSubtitle}>Cập nhật từ nhà trường</Text>
      </View>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 0,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingRight: 24,
  },
  notificationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  divider: {
    backgroundColor: '#E5E7EB',
    marginLeft: 76,
  },
});
