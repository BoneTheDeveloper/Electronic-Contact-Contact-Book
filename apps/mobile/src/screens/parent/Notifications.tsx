/**
 * Notifications Screen
 * Alert list and system notifications
 */

import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { colors } from '../../theme';

interface Notification {
  id: string;
  type: 'announcement' | 'homework' | 'exam' | 'fee' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const NOTIFICATION_EMOJIS: Record<string, string> = {
  announcement: '🔔',
  homework: '📚',
  exam: '📋',
  fee: '💰',
  general: 'ℹ️',
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
    const iconEmoji = NOTIFICATION_EMOJIS[item.type];

    return (
      <View
        className={`rounded-xl py-3 px-4 ${!item.read ? 'bg-sky-50' : 'bg-white'}`}
      >
        <View className="flex-row items-start pr-6">
          <View
            className="w-12 h-12 rounded-full justify-center items-center"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Text style={{ fontSize: 24 }}>{iconEmoji}</Text>
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-[15px] font-bold text-gray-800 mb-1">{item.title}</Text>
            <Text className="text-[13px] text-gray-500 leading-[18px] mb-1.5" numberOfLines={2}>
              {item.message}
            </Text>
            <Text className="text-[11px] text-gray-400">{formatDate(item.date)}</Text>
          </View>
          {!item.read && (
            <View
              className="w-2 h-2 rounded-full mt-1.5"
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-[60px] px-6 pb-6 rounded-b-[20px]">
        <Text className="text-[24px] font-bold text-white">Thông báo</Text>
        <Text className="text-[14px] text-white/80 mt-1">Cập nhật từ nhà trường</Text>
      </View>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={(item: Notification) => item.id}
        contentContainerClassName="p-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 ml-[76px]" />}
      />
    </View>
  );
};
