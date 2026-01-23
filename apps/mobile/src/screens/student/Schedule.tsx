/**
 * Schedule Screen
 * Student class schedule display
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useStudentStore } from '../../stores';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface ScheduleScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface ScheduleDay {
  date: string;
  dayName: string;
  periods: Period[];
}

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

const MOCK_SCHEDULE: ScheduleDay[] = [
  {
    date: '2026-01-13',
    dayName: 'Thứ Hai',
    periods: [
      { time: '07:00 - 07:45', subject: 'Toán', teacher: 'Thầy Nguyễn Văn A', room: 'Phòng 101' },
      { time: '07:50 - 08:35', subject: 'Văn', teacher: 'Cô Trần Thị B', room: 'Phòng 101' },
      { time: '08:40 - 09:25', subject: 'Anh', teacher: 'Cô Lê Thị C', room: 'Phòng Lab 1' },
      { time: '09:40 - 10:25', subject: 'Lý', teacher: 'Thầy Phạm Văn D', room: 'Phòng Lab 2' },
      { time: '10:30 - 11:15', subject: 'Hóa', teacher: 'Cô Hoàng Thị E', room: 'Phòng Lab 2' },
    ],
  },
  {
    date: '2026-01-14',
    dayName: 'Thứ Ba',
    periods: [
      { time: '07:00 - 07:45', subject: 'Sinh', teacher: 'Cô Ngô Thị F', room: 'Phòng Lab 3' },
      { time: '07:50 - 08:35', subject: 'Sử', teacher: 'Thầy Đỗ Văn G', room: 'Phòng 102' },
      { time: '08:40 - 09:25', subject: 'Địa', teacher: 'Cô Vũ Thị H', room: 'Phòng 102' },
      { time: '09:40 - 10:25', subject: 'GDCD', teacher: 'Thầy Lê Văn I', room: 'Phòng 103' },
      { time: '10:30 - 11:15', subject: 'TD', teacher: 'Cô Nguyễn Thị K', room: 'Sân trường' },
    ],
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
  textXs: { fontSize: 12 },
  text10px: { fontSize: 10 },
  textLg: { fontSize: 18 },
  text2xl: { fontSize: 24 },
  fontBold: { fontWeight: '700' },
  fontSemibold: { fontWeight: '600' },
  fontMedium: { fontWeight: '500' },
  flexRow: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  itemsCenter: { alignItems: 'center' },
  gap1: { gap: 4 },
  gap3: { gap: 12 },
  mb2: { marginBottom: 8 },
  mb4: { marginBottom: 16 },
  mt1: { marginTop: 4 },
  ml3: { marginLeft: 12 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  pb6: { paddingBottom: 24 },
  w24: { width: 96 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  selfStart: { alignSelf: 'flex-start' },
  bgSky100: { backgroundColor: '#e0f2fe' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

export const StudentScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { studentData } = useStudentStore();

  const renderPeriod = (period: Period, index: number) => (
    <View key={index} style={styles.flexRow}>
      <View style={styles.w24}>
        <Text style={[styles.textXs, styles.textGray500, styles.fontMedium]}>{period.time}</Text>
      </View>
      <View style={[{ flex: 1 }, styles.gap1]}>
        <Text style={[styles.textBase, styles.fontSemibold, styles.textGray900]}>{period.subject}</Text>
        <Text style={[styles.textXs, styles.textGray500]}>{period.teacher}</Text>
        <View style={[styles.selfStart, styles.bgSky100, styles.px2, { height: 24, alignItems: 'center', justifyContent: 'center' }, styles.roundedFull]}>
          <Text style={[styles.text10px, styles.textSky600, styles.fontSemibold]}>{period.room}</Text>
        </View>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
      <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb4, { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }]}>
        <Text style={[styles.textLg, styles.fontBold, styles.textGray900]}>{item.dayName}</Text>
        <Text style={[styles.textXs, styles.textGray500]}>{item.date}</Text>
      </View>
      <View style={styles.gap3}>
        {item.periods.map((period, index) => renderPeriod(period, index))}
      </View>
    </View>
  );

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Thời khóa biểu"
        onBack={() => navigation?.goBack()}
      />
      {studentData && (
        <View style={[styles.px4, styles.py3, styles.bgWhite, { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }]}>
          <Text style={[styles.textXs, styles.textGray500]}>
            Lớp {studentData.grade}{studentData.section}
          </Text>
        </View>
      )}
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item: ScheduleDay) => item.date}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
