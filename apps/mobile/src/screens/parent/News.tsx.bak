/**
 * News Screen
 * School announcements and events
 */

import React from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface NewsScreenProps {
  navigation?: ParentHomeStackNavigationProp;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  newsItem: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  newsItemUnread: {
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  newsContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsContentText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  unreadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
    marginRight: 8,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
});

export const NewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
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
    <View style={styles.container}>
      <ScreenHeader
        title="Tin tức & Sự kiện"
        onBack={() => navigation?.goBack()}
      />
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NEWS.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.newsItem,
              !item.read && styles.newsItemUnread
            ]}
          >
            <View style={styles.newsContent}>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: CATEGORY_COLORS[item.category] }
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: CATEGORY_TEXT_COLORS[item.category] }
                    ]}
                  >
                    {item.category}
                  </Text>
                </View>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsContentText} numberOfLines={3}>
                {item.content}
              </Text>
              {!item.read && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadDot} />
                  <Text style={styles.unreadText}>Chưa đọc</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};