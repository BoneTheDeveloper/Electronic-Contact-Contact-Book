/**
 * Attendance Screen
 * Student attendance history
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface AttendanceScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: '2026-01-13', status: 'present' },
  { date: '2026-01-12', status: 'present' },
  { date: '2026-01-11', status: 'late', reason: 'Đi muộn 5 phút' },
  { date: '2026-01-10', status: 'present' },
  { date: '2026-01-09', status: 'absent', reason: 'Nghỉ ốm' },
  { date: '2026-01-08', status: 'present' },
  { date: '2026-01-07', status: 'excused', reason: 'Có phép' },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textGray900: { color: '#111827' },
  textGray600: { color: '#4b5563' },
  textGray500: { color: '#6b7280' },
  textSky600: { color: '#0284c7' },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text11px: { fontSize: 11 },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  flexRow: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  itemsCenter: { alignItems: 'center' },
  mb3: { marginBottom: 12 },
  mt05: { marginTop: 2 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  h7: { height: 28 },
  roundedXl: { borderRadius: 8 },
  roundedFull: { borderRadius: 9999 },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgRed100: { backgroundColor: '#fee2e2' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgSky100: { backgroundColor: '#e0f2fe' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

const getStatusConfig = (status: AttendanceRecord['status']) => {
  switch (status) {
    case 'present': return { label: 'Có mặt', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
    case 'absent': return { label: 'Vắng mặt', bgClass: styles.bgRed100, textClass: styles.textGray600 };
    case 'late': return { label: 'Đi muộn', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
    case 'excused': return { label: 'Có phép', bgClass: styles.bgSky100, textClass: styles.textSky600 };
    default: return { label: status, bgClass: styles.bgGreen100, textClass: styles.textGray600 };
  }
};

export const StudentAttendanceScreen: React.FC<AttendanceScreenProps> = ({ navigation }) => {
  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => {
    const config = getStatusConfig(item.status);

    return (
      <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter]}>
          <View>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{item.date}</Text>
            {item.reason && <Text style={[styles.textXs, styles.textGray500, styles.mt05]}>{item.reason}</Text>}
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text11px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Lịch sử điểm danh"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_ATTENDANCE}
        renderItem={renderAttendanceItem}
        keyExtractor={(item: AttendanceRecord) => item.date}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
