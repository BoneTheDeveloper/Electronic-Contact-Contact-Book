/**
 * Teacher Feedback Screen
 * Comments and feedback from teachers
 */

import React from 'react';
import { View, ScrollView, FlatList, Text } from 'react-native';
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
      <View
        className="bg-white rounded-2xl mb-4 p-4"
        style={{
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center flex-1">
            <View
              className="rounded-full justify-center items-center"
              style={{ width: 48, height: 48, backgroundColor: '#E0F2FE' }}
            >
              <Text className="text-base font-bold" style={{ color: colors.primary }}>
                {item.teacherAvatar}
              </Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-base font-extrabold text-gray-800">{item.teacherName}</Text>
              <Text className="text-sm text-gray-500 mt-0.5">{item.subject}</Text>
            </View>
          </View>
          <View
            className="rounded-full px-2.5 py-1 self-start"
            style={{ backgroundColor: config.bgColor, minHeight: 28 }}
          >
            <Text
              className="text-[10px] font-extrabold uppercase tracking-wider"
              style={{ color: config.color }}
            >
              {config.label}
            </Text>
          </View>
        </View>
        <View className="h-px bg-gray-200 mb-3" />
        <Text className="text-sm leading-[22px] text-gray-700 mb-3">{item.message}</Text>
        <Text className="text-xs text-gray-400 text-right">{formatDate(item.date)}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View
        className="bg-primary pt-16 px-6 pb-6"
        style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <Text className="text-2xl font-extrabold text-white">Nhận xét giáo viên</Text>
        {selectedChild && (
          <Text className="text-sm text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedback}
        keyExtractor={(item: Feedback) => item.id}
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
