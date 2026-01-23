/**
 * Payment Screen
 * Student fee payment information
 */

import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface PaymentScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface PaymentItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const MOCK_PAYMENTS: PaymentItem[] = [
  { id: '1', title: 'Học phí tháng 1', amount: 1500000, dueDate: '2026-01-05', status: 'paid' },
  { id: '2', title: 'Học phí tháng 2', amount: 1500000, dueDate: '2026-02-05', status: 'pending' },
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
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text10px: { fontSize: 10 },
  textLg: { fontSize: 18 },
  textExtrabold: { fontWeight: '800' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  flexRow: { flexDirection: 'row' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsCenter: { alignItems: 'center' },
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mt2: { marginTop: 8 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  h7: { height: 28 },
  rounded2xl: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgRed100: { backgroundColor: '#fee2e2' },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
});

const getPaymentStatusConfig = (status: PaymentItem['status']) => {
  switch (status) {
    case 'paid': return { label: 'Đã thanh toán', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
    case 'pending': return { label: 'Chờ thanh toán', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
    case 'overdue': return { label: 'Quá hạn', bgClass: styles.bgRed100, textClass: styles.textGray600 };
  }
};

export const StudentPaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
    const config = getPaymentStatusConfig(item.status);

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsStart, styles.mb2]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textBase, styles.fontSemibold, styles.textGray900, styles.mb1]}>{item.title}</Text>
            <Text style={[styles.textXs, styles.textGray500]}>Hạn: {item.dueDate}</Text>
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text10px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
        <Text style={[styles.textLg, styles.textExtrabold, styles.textSky600, styles.mt2]}>{formatCurrency(item.amount)}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <ScreenHeader
        title="Học phí"
        onBack={() => navigation?.goBack()}
      />
      <FlatList
        data={MOCK_PAYMENTS}
        renderItem={renderPaymentItem}
        keyExtractor={(item: PaymentItem) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
