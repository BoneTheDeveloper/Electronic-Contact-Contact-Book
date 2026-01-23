/**
 * News Screen
 * School news and announcements for students
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface NewsScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'school' | 'class' | 'activity';
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026',
    content: 'Nhà trường thông báo về lịch nghỉ Tết Nguyên Đán từ ngày 08/02/2026 đến 14/02/2026...',
    date: '2026-01-13',
    category: 'school',
  },
  {
    id: '2',
    title: 'Lịch thi cuối kỳ',
    content: 'Lịch thi cuối kỳ học kỳ I sẽ diễn ra từ ngày 25/01/2026...',
    date: '2026-01-10',
    category: 'class',
  },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray500: { color: '#6b7280' },
  textSky600: { color: '#0284c7' },
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text10px: { fontSize: 10 },
  text11px: { fontSize: 11 },
  fontBold: { fontWeight: '700' },
  flexRow: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  itemsCenter: { alignItems: 'center' },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  h6: { height: 24 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  bgSky100: { backgroundColor: '#e0f2fe' },
  leadingSnug: { lineHeight: 20 },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

const getCategoryConfig = (category: NewsItem['category']) => {
  switch (category) {
    case 'school': return { label: 'Nhà trường', bgClass: styles.bgSky100 };
    case 'class': return { label: 'Lớp học', bgClass: styles.bgSky100 };
    case 'activity': return { label: 'Hoạt động', bgClass: styles.bgSky100 };
  }
};

export const StudentNewsScreen: React.FC<NewsScreenProps> = ({ navigation }) => {
  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const config = getCategoryConfig(item.category);

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
          <View style={[styles.h6, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text10px, styles.fontBold, { textTransform: 'uppercase' }, styles.textSky600]}>{config.label}</Text>
          </View>
          <Text style={[styles.text11px, styles.textGray500]}>{item.date}</Text>
        </View>
        <Text style={[styles.textBase, styles.fontBold, styles.textGray900, styles.mb2]}>{item.title}</Text>
        <Text style={[styles.textSm, styles.textGray500, styles.leadingSnug]} numberOfLines={2}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Tin tức & sự kiện"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_NEWS}
        renderItem={renderNewsItem}
        keyExtractor={(item: NewsItem) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
