/**
 * Teacher Feedback Screen
 * Comments and feedback from teachers
 */

import React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Avatar, Divider, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';

interface Feedback {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  message: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'concern';
}

const MOCK_FEEDBACK: Feedback[] = [
  {
    id: '1',
    teacherName: 'Cô Trần Thị B',
    teacherAvatar: 'TB',
    subject: 'Ngữ văn',
    message: 'Học sinh có tiến bộ tốt trong môn văn. Bài viết có cấu trúc rõ ràng và vốn từ vựng phong phú. Cần chú ý进一步提高 cách diễn đạt.',
    date: '2026-01-12',
    sentiment: 'positive',
  },
  {
    id: '2',
    teacherName: 'Thầy Nguyễn Văn A',
    teacherAvatar: 'NA',
    subject: 'Toán học',
    message: 'Làm bài tập đầy đủ và chính xác. Có khả năng tư duy logic tốt. Nên luyện thêm các bài toán nâng cao để phát triển kỹ năng giải quyết vấn đề.',
    date: '2026-01-10',
    sentiment: 'positive',
  },
  {
    id: '3',
    teacherName: 'Cô Lê Thị C',
    teacherAvatar: 'LC',
    subject: 'Tiếng Anh',
    message: 'Nghe và nói khá tốt, nhưng cần cải thiện phần ngữ pháp. Hãy dành thêm thời gian để thực hành các cấu trúc câu phức tạp.',
    date: '2026-01-08',
    sentiment: 'neutral',
  },
  {
    id: '4',
    teacherName: 'Thầy Phạm Văn D',
    teacherAvatar: 'PD',
    subject: 'Vật lý',
    message: 'Chú ý tập trung hơn trong giờ học. Đã có 2 lần đi học trễ trong tháng này. Vui lòng đến lớp đúng giờ.',
    date: '2026-01-05',
    sentiment: 'concern',
  },
];

const SENTIMENT_CONFIG = {
  positive: { label: 'Tích cực', color: colors.success, bgColor: '#DCFCE7', icon: 'thumb-up' },
  neutral: { label: 'Cần cải thiện', color: colors.warning, bgColor: '#FEF3C7', icon: 'minus' },
  concern: { label: 'Cần lưu ý', color: colors.error, bgColor: '#FEE2E2', icon: 'alert' },
};

export const TeacherFeedbackScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderFeedback = ({ item }: { item: Feedback }) => {
    const config = SENTIMENT_CONFIG[item.sentiment];
    return (
      <Card style={styles.feedbackCard}>
        <Card.Content>
          <View style={styles.feedbackHeader}>
            <View style={styles.teacherInfo}>
              <Avatar.Text
                size={48}
                label={item.teacherAvatar}
                style={{ backgroundColor: '#E0F2FE' }}
                labelStyle={{ color: colors.primary }}
              />
              <View style={styles.teacherDetails}>
                <Text style={styles.teacherName}>{item.teacherName}</Text>
                <Text style={styles.subject}>{item.subject}</Text>
              </View>
            </View>
            <Chip
              mode="flat"
              compact
              style={[styles.sentimentChip, { backgroundColor: config.bgColor }]}
              textStyle={[styles.sentimentChipText, { color: config.color }]}
              icon={config.icon as any}
            >
              {config.label}
            </Chip>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhận xét giáo viên</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedback}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teacherDetails: {
    marginLeft: 12,
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  subject: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  sentimentChip: {
    height: 28,
  },
  sentimentChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
});
