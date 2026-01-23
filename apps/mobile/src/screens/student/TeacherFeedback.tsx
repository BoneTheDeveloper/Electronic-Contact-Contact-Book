/**
 * Teacher Feedback Screen
 * Feedback from teachers about student
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface TeacherFeedbackScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface FeedbackItem {
  id: string;
  teacher: string;
  subject: string;
  content: string;
  date: string;
  type: 'positive' | 'neutral' | 'concern';
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    teacher: 'Cô Trần Thị B',
    subject: 'Ngữ văn',
    content: 'Hoàng B làm bài rất tốt, cần phát huy thêm khả năng viết văn.',
    date: '2026-01-10',
    type: 'positive',
  },
  {
    id: '2',
    teacher: 'Thầy Nguyễn Văn A',
    subject: 'Toán học',
    content: 'Cần chú ý hơn phần giải bài tập về nhà.',
    date: '2026-01-08',
    type: 'neutral',
  },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray700: { color: '#374151' },
  textGray500: { color: '#6b7280' },
  textGray400: { color: '#9ca3af' },
  textSky600: { color: '#0284c7' },
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text11px: { fontSize: 11 },
  fontBold: { fontWeight: '700' },
  fontSemibold: { fontWeight: '600' },
  flexRow: { flexDirection: 'row' },
  flex1Row: { flex: 1, flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsCenter: { alignItems: 'center' },
  mb1: { marginBottom: 4 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  ml3: { marginLeft: 12 },
  px3: { paddingLeft: 12, paddingRight: 12 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  w10: { width: 40 },
  h10: { height: 40 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  roundedXl: { borderRadius: 8 },
  bgSky100: { backgroundColor: '#e0f2fe' },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgRed100: { backgroundColor: '#fee2e2' },
  leadingSnug: { lineHeight: 20 },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

export const StudentTeacherFeedbackScreen: React.FC<TeacherFeedbackScreenProps> = ({ navigation }) => {
  const getFeedbackColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'positive': return styles.bgGreen100;
      case 'neutral': return styles.bgAmber100;
      case 'concern': return styles.bgRed100;
      default: return styles.bgGreen100;
    }
  };

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => {
    const parts = item.teacher.split(' ').filter(p => p.length > 0);
    const initial = parts.length > 0 ? (parts[parts.length - 1] || '').charAt(0) : '?';

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsStart, styles.mb3]}>
          <View style={[styles.flex1Row, styles.itemsCenter, { flex: 1 }]}>
            <View style={[styles.w10, styles.h10, styles.roundedFull, styles.bgSky100, styles.itemsCenter, styles.justifyCenter]}>
              <Text style={[styles.textSky600, styles.fontSemibold]}>{initial}</Text>
            </View>
            <View style={[styles.ml3, { flex: 1 }]}>
              <Text style={[styles.textSm, styles.fontBold, styles.textGray900]}>{item.teacher}</Text>
              <Text style={[styles.textXs, styles.textGray500]}>{item.subject}</Text>
            </View>
          </View>
          <Text style={[styles.text11px, styles.textGray400]}>{item.date}</Text>
        </View>
        <View style={[styles.px3, styles.py3, styles.roundedXl, getFeedbackColor(item.type)]}>
          <Text style={[styles.textSm, styles.textGray700, styles.leadingSnug]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Nhận xét giáo viên"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedbackItem}
        keyExtractor={(item: FeedbackItem) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
