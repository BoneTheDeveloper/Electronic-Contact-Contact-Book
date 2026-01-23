/**
 * Summary Screen
 * Overall academic performance summary
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useStudentStore } from '../../stores';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface SummaryScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface SummaryItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray500: { color: '#6b7280' },
  textEmerald600: { color: '#059669' },
  textAmber500: { color: '#f59e0b' },
  text2xl: { fontSize: 24 },
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  textExtrabold: { fontWeight: '800' },
  fontBold: { fontWeight: '700' },
  fontSemibold: { fontWeight: '600' },
  flexWrap: { flexWrap: 'wrap' },
  justifyBetween: { justifyContent: 'space-between' },
  itemsCenter: { alignItems: 'center' },
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  w47Percent: { width: '47%' },
  h14: { height: 56 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  textCenter: { textAlign: 'center' },
  bgSky60020: { backgroundColor: 'rgba(2, 132, 199, 0.2)' },
  bgEmerald60020: { backgroundColor: 'rgba(5, 150, 105, 0.2)' },
  bgAmber50020: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  bgViolet50020: { backgroundColor: 'rgba(139, 92, 246, 0.2)' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

export const StudentSummaryScreen: React.FC<SummaryScreenProps> = ({ navigation }) => {
  const { attendancePercentage } = useStudentStore();

  const summaryData: SummaryItem[] = [
    { label: 'Điểm trung bình', value: '8.2', icon: '📚', color: '#0284C7' },
    { label: 'Điểm danh', value: `${attendancePercentage}%`, icon: '✓', color: '#059669' },
    { label: 'Số ngày nghỉ', value: '2', icon: '📅', color: '#F59E0B' },
    { label: 'Xếp loại', value: 'Giỏi', icon: '⭐', color: '#8B5CF6' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case '#0284C7': return styles.bgSky60020;
      case '#059669': return styles.bgEmerald60020;
      case '#F59E0B': return styles.bgAmber50020;
      case '#8B5CF6': return styles.bgViolet50020;
      default: return { backgroundColor: '#e5e7eb' };
    }
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Kết quả tổng hợp"
        onBack={() => navigation?.goBack()}
      />
      <ScrollView contentContainerStyle={[styles.contentContainerP4Pb24]} showsVerticalScrollIndicator={false}>
        <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
          <View style={[styles.flexWrap, styles.justifyBetween]}>
            {summaryData.map((item, index) => (
              <View key={index} style={[styles.w47Percent, { alignItems: 'center', flex: 1 }, styles.mb4]}>
                <View style={[styles.h14, styles.roundedFull, { justifyContent: 'center', alignItems: 'center' }, styles.mb2, getColorClass(item.color)]}>
                  <Text style={styles.text2xl}>{item.icon}</Text>
                </View>
                <Text style={[styles.textExtrabold, styles.textGray900, styles.mb1]}>{item.value}</Text>
                <Text style={[styles.textXs, styles.textGray500, styles.textCenter]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
          <Text style={[styles.textBase, styles.fontBold, styles.textGray900, styles.mb4]}>Chi tiết học tập</Text>
          <View style={[{ flexDirection: 'row' }, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Tổng số bài kiểm tra:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>24</Text>
          </View>
          <View style={[{ flexDirection: 'row' }, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Số bài đạt:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textEmerald600]}>22</Text>
          </View>
          <View style={[{ flexDirection: 'row' }, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Số bài cần cải thiện:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textAmber500]}>2</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
