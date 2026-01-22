/**
 * Payment Overview Screen
 * Fee summary and invoice list
 */

import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useParentStore } from '../../stores';
import { getFeesByStudentId } from '../../mock-data';
import { colors } from '../../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Fee {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

const FEE_TYPE_LABELS: Record<string, string> = {
  tuition: 'Học phí',
  transport: 'Phí đưa đón',
  library: 'Phí thư viện',
  lab: 'Phí phòng thí nghiệm',
  other: 'Khác',
};

const STATUS_CONFIG = {
  pending: { label: 'Chưa thanh toán', color: '#F59E0B', bgColor: '#FEF3C7' },
  paid: { label: 'Đã thanh toán', color: '#10B981', bgColor: '#D1FAE5' },
  overdue: { label: 'Quá hạn', color: '#EF4444', bgColor: '#FEE2E2' },
};

interface PaymentOverviewProps {
  navigation: NativeStackNavigationProp<any>;
}

export const PaymentOverviewScreen: React.FC<PaymentOverviewProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const fees = selectedChild ? getFeesByStudentId(selectedChild.id) : [];

  const stats = useMemo(() => {
    const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paid = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const pending = fees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
    const overdue = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);
    return { total, paid, pending, overdue };
  }, [fees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderFeeCard = (fee: Fee) => {
    const config = STATUS_CONFIG[fee.status];
    return (
      <TouchableOpacity
        key={fee.id}
        onPress={() => (navigation as any).navigate('PaymentDetail', { feeId: fee.id })}
        activeOpacity={0.7}
        className="mb-3 rounded-xl bg-white border border-gray-100 p-4"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-base font-bold text-gray-800 mb-1">{FEE_TYPE_LABELS[fee.type] || fee.type}</Text>
            <Text className="text-xs text-gray-500">Hạn chót: {formatDate(fee.dueDate)}</Text>
          </View>
          <View
            className="h-6 px-2 py-1 rounded-full"
            style={{ backgroundColor: config.bgColor }}
          >
            <Text
              className="text-[10px] font-bold uppercase"
              style={{ color: config.color }}
            >
              {config.label}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-extrabold text-primary">{formatCurrency(fee.amount)}</Text>
          <Text className="text-sm text-primary font-semibold">Chi tiết →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className="pt-[60px] px-6 pb-6 rounded-b-[20px]"
        style={{ backgroundColor: colors.primary }}
      >
        <Text className="text-2xl font-bold text-white">Học phí</Text>
        {selectedChild && (
          <Text className="text-sm text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerClassName="p-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View className="mb-6 rounded-2xl bg-white shadow-md border border-gray-100 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Tổng quan học phí</Text>
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
            <Text className="text-base font-semibold text-gray-800">Tổng cộng:</Text>
            <Text className="text-xl font-extrabold text-primary">{formatCurrency(stats.total)}</Text>
          </View>
          <View className="flex-row mt-2">
            <View className="flex-1 items-center">
              <Text className="text-[11px] text-gray-500 mb-1">Đã thanh toán</Text>
              <Text className="text-sm font-bold text-success">
                {formatCurrency(stats.paid)}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[11px] text-gray-500 mb-1">Chưa thanh toán</Text>
              <Text className="text-sm font-bold text-warning">
                {formatCurrency(stats.pending)}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[11px] text-gray-500 mb-1">Quá hạn</Text>
              <Text className="text-sm font-bold text-error">
                {formatCurrency(stats.overdue)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fee List */}
        <Text className="text-lg font-bold text-gray-800 mb-3 mt-2">Chi tiết các khoản</Text>
        {fees.map(renderFeeCard)}
      </ScrollView>
    </View>
  );
};