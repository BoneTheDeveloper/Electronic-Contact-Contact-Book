/**
 * News Screen
 * School announcements and events
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Chip, Avatar } from 'react-native-paper';
import { mockNotifications } from '../../mock-data';
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin tức & Sự kiện</Text>
        <Text style={styles.headerSubtitle}>Cập nhật thông tin từ nhà trường</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NEWS.map((item) => (
          <Card key={item.id} style={[styles.newsCard, !item.read && styles.unreadCard]}>
            <Card.Content>
              <View style={styles.newsHeader}>
                <Chip
                  mode="flat"
                  compact
                  style={[styles.categoryChip, { backgroundColor: CATEGORY_COLORS[item.category] }]}
                  textStyle={[styles.categoryChipText, { color: CATEGORY_TEXT_COLORS[item.category] }]}
                >
                  {item.category}
                </Chip>
                <Text style={styles.newsDate}>{formatDate(item.date)}</Text>
              </View>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.newsContent} numberOfLines={3}>
                {item.content}
              </Text>
              {!item.read && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadDot} />
                  <Text style={styles.unreadText}>Chưa đọc</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  unreadCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryChip: {
    height: 26,
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  newsDate: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsContent: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});
