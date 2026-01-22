/**
 * News Screen
 * School announcements and events
 */

import React from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { colors } from '../../theme';

interface NewsItem {
  id: string;
  type: 'announcement' | 'event' | 'general';
  category: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    type: 'announcement',
    category: 'Nhà trường',
    title: 'Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026',
    content: 'Nhà trường thông báo lịch nghỉ Tết Nguyên Đán từ ngày 28/01/2026 đến hết 05/02/2026. Học sinh tự ôn bài trong dịp nghỉ lễ.',
    date: '2026-01-12T08:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'event',
    category: 'Sự kiện',
    title: 'Hội thao thể thao học sinh 2026',
    content: 'Nhà trường tổ chức hội thao thể thao vào ngày 20/01/2026 tại sân trường. Đăng ký tham gia tại văn phòng Đoàn trường.',
    date: '2026-01-10T14:30:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'general',
    category: 'Học tập',
    title: 'Lịch thi giữa kỳ 2',
    content: 'Lịch thi giữa kỳ 2 sẽ diễn ra từ ngày 15/02/2026 đến 20/02/2026. Học sinh cần xem lịch thi cụ thể tại bảng thông tin lớp.',
    date: '2026-01-09T09:00:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'announcement',
    category: 'Nhà trường',
    title: 'Thông báo về họp phụ huynh',
    content: 'Họp phụ huynh cuối học kỳ 1 sẽ được tổ chức vào ngày 25/01/2026 lúc 18:00 tại hội trường trường.',
    date: '2026-01-08T10:00:00Z',
    read: true,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Nhà trường': '#DBEAFE',
  'Sự kiện': '#FEF3C7',
  'Học tập': '#E0E7FF',
  'Cộng đồng': '#FCE7F3',
};

const CATEGORY_TEXT_COLORS: Record<string, string> = {
  'Nhà trường': colors.primary,
  'Sự kiện': '#D97706',
  'Học tập': '#6366F1',
  'Cộng đồng': '#DB2777',
};

export const NewsScreen: React.FC = () => {
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

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-[#0284C7] pt-[60px] px-6 pb-6 rounded-b-[20px]">
        <Text className="text-[24px] font-bold text-white">Tin tức & Sự kiện</Text>
        <Text className="text-[14px] text-white/80 mt-1">Cập nhật thông tin từ nhà trường</Text>
      </View>
      <ScrollView
        className="px-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NEWS.map((item) => (
          <Pressable
            key={item.id}
            className={`mb-4 rounded-[16px] bg-white shadow-md ${
              !item.read ? 'border-2 border-[#0284C7]' : ''
            }`}
          >
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-3">
                <View
                  className="h-[26px] px-2 rounded-md justify-center items-center"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                >
                  <Text
                    className="text-[10px] font-bold uppercase"
                    style={{ color: CATEGORY_TEXT_COLORS[item.category] }}
                  >
                    {item.category}
                  </Text>
                </View>
                <Text className="text-[11px] text-gray-400 font-medium">{formatDate(item.date)}</Text>
              </View>
              <Text className="text-[16px] font-bold text-gray-800 mb-2 leading-[22px]" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] mb-2" numberOfLines={3}>
                {item.content}
              </Text>
              {!item.read && (
                <View className="flex-row items-center mt-2">
                  <View className="w-[6px] h-[6px] rounded-full bg-[#0284C7] mr-2" />
                  <Text className="text-[11px] font-semibold text-[#0284C7]">Chưa đọc</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};