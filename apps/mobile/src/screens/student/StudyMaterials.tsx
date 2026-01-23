/**
 * Study Materials Screen
 * Learning resources and documents
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface StudyMaterialsScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  type: 'document' | 'video' | 'link';
  date: string;
}

const MOCK_MATERIALS: MaterialItem[] = [
  { id: '1', title: 'Giáo trình Toán học chương trình mới', subject: 'Toán', type: 'document', date: '2026-01-10' },
  { id: '2', title: 'Video bài giảng Văn học', subject: 'Văn', type: 'video', date: '2026-01-08' },
  { id: '3', title: 'Bài tập tiếng Anh bổ trợ', subject: 'Anh', type: 'link', date: '2026-01-05' },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray500: { color: '#6b7280' },
  textSky600: { color: '#0284c7' },
  text3xl: { fontSize: 28 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text10px: { fontSize: 10 },
  fontSemibold: { fontWeight: '600' },
  flexRow: { flexDirection: 'row' },
  itemsCenter: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  mb1: { marginBottom: 4 },
  mb3: { marginBottom: 12 },
  mr3: { marginRight: 12 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  h6: { height: 24 },
  roundedXl: { borderRadius: 8 },
  roundedFull: { borderRadius: 9999 },
  bgSky100: { backgroundColor: '#e0f2fe' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

const getMaterialIcon = (type: MaterialItem['type']) => {
  switch (type) {
    case 'document': return '📄';
    case 'video': return '🎥';
    case 'link': return '🔗';
  }
};

export const StudentStudyMaterialsScreen: React.FC<StudyMaterialsScreenProps> = ({ navigation }) => {
  const renderMaterialItem = ({ item }: { item: MaterialItem }) => (
    <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
      <View style={[styles.flexRow, styles.itemsCenter]}>
        <Text style={[styles.text3xl, styles.mr3]}>{getMaterialIcon(item.type)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900, styles.mb1]}>{item.title}</Text>
          <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween]}>
            <View style={[styles.bgSky100, styles.h6, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter]}>
              <Text style={[styles.text10px, styles.textSky600, styles.fontSemibold]}>{item.subject}</Text>
            </View>
            <Text style={[styles.textXs, styles.textGray500]}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Tài liệu học tập"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_MATERIALS}
        renderItem={renderMaterialItem}
        keyExtractor={(item: MaterialItem) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
