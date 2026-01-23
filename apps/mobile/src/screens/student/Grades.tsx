/**
 * Grades Screen
 * Student grades display by subject
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface GradesScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface GradeItem {
  id: string;
  subject: string;
  grades: { score: number; maxScore: number; type: string }[];
  average: number;
}

const MOCK_GRADES: GradeItem[] = [
  {
    id: '1',
    subject: 'Toán học',
    grades: [
      { score: 8.5, maxScore: 10, type: 'Giữa kỳ' },
      { score: 9, maxScore: 10, type: 'Điểm thành phần' },
      { score: 7.5, maxScore: 10, type: 'Bài tập' },
    ],
    average: 8.33,
  },
  {
    id: '2',
    subject: 'Ngữ văn',
    grades: [
      { score: 7, maxScore: 10, type: 'Giữa kỳ' },
      { score: 8, maxScore: 10, type: 'Điểm thành phần' },
      { score: 7.5, maxScore: 10, type: 'Bài tập' },
    ],
    average: 7.5,
  },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray600: { color: '#4b5563' },
  textGray500: { color: '#6b7280' },
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  fontBold: { fontWeight: '700' },
  fontSemibold: { fontWeight: '600' },
  flexRow: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  itemsCenter: { alignItems: 'center' },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  px3: { paddingLeft: 12, paddingRight: 12 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py1: { paddingTop: 4, paddingBottom: 4 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgRed100: { backgroundColor: '#fee2e2' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

export const StudentGradesScreen: React.FC<GradesScreenProps> = ({ navigation }) => {
  const renderGradeItem = ({ item }: { item: GradeItem }) => {
    const bgColor = item.average >= 8 ? styles.bgGreen100 : item.average >= 6.5 ? styles.bgAmber100 : styles.bgRed100;
    const textColor = styles.textGray600;

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
          <Text style={[styles.textBase, styles.fontBold, styles.textGray900]}>{item.subject}</Text>
          <View style={[styles.px3, styles.py1, styles.roundedFull, bgColor]}>
            <Text style={[styles.textBase, styles.fontBold, textColor]}>{item.average.toFixed(1)}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 12 }} />
        {item.grades.map((grade, index) => (
          <View key={index} style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb2]}>
            <Text style={[styles.textSm, styles.textGray500]}>{grade.type}</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{grade.score}/{grade.maxScore}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Bảng điểm môn học"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_GRADES}
        renderItem={renderGradeItem}
        keyExtractor={(item: GradeItem) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
