/**
 * Leave Request Screen
 * Student leave request management
 */

import React from 'react';
import { View, FlatList, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface LeaveRequestScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface LeaveRequest {
  id: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: '1',
    date: '2026-01-20',
    reason: 'Đi khám sức khỏe định kỳ',
    status: 'approved',
  },
  {
    id: '2',
    date: '2026-01-25',
    reason: 'Gia đình có việc',
    status: 'pending',
  },
];

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgWhite: { backgroundColor: '#ffffff' },
  bgSky600: { backgroundColor: '#0284c7' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  textWhite: { color: '#ffffff' },
  textGray900: { color: '#111827' },
  textGray600: { color: '#4b5563' },
  textGray500: { color: '#6b7280' },
  textBase: { fontSize: 16 },
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
  mt4: { marginTop: 16 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  h7: { height: 28 },
  roundedXl: { borderRadius: 8 },
  roundedFull: { borderRadius: 9999 },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgRed100: { backgroundColor: '#fee2e2' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

const getStatusConfig = (status: LeaveRequest['status']) => {
  switch (status) {
    case 'approved': return { label: 'Đã duyệt', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
    case 'rejected': return { label: 'Từ chối', bgClass: styles.bgRed100, textClass: styles.textGray600 };
    case 'pending': return { label: 'Chờ duyệt', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
  }
};

export const StudentLeaveRequestScreen: React.FC<LeaveRequestScreenProps> = ({ navigation }) => {
  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const config = getStatusConfig(item.status);

    return (
      <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter]}>
          <View>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{item.date}</Text>
            <Text style={[styles.textXs, styles.textGray500, styles.mt05]}>{item.reason}</Text>
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text11px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleCreateRequest = () => {
    Alert.alert('Tạo đơn mới', 'Tính năng tạo đơn xin nghỉ phép sẽ được triển khai sau.');
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Đơn xin nghỉ phép"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_LEAVE_REQUESTS}
        renderItem={renderLeaveRequest}
        keyExtractor={(item: LeaveRequest) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Pressable onPress={handleCreateRequest} style={[styles.mt4, styles.bgSky600, styles.roundedXl, styles.py3, styles.itemsCenter]}>
            <Text style={[styles.textWhite, styles.fontSemibold, styles.textBase]}>+ Tạo đơn mới</Text>
          </Pressable>
        }
      />
    </View>
  );
};
