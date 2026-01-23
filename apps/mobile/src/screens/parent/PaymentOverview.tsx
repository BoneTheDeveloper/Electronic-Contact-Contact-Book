/**
 * Payment Overview Screen
 * Fee summary and invoice list
 */

import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useParentStore } from '../../stores';
import { getFeesByStudentId } from '../../mock-data';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface PaymentOverviewProps {
  navigation?: ParentHomeStackNavigationProp;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#f3f4f6',
    borderWidth: 1,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryTotal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statSuccess: {
    color: colors.success,
  },
  statWarning: {
    color: colors.warning,
  },
  statError: {
    color: colors.error,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  feeCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderColor: '#f3f4f6',
    borderWidth: 1,
    padding: 16,
  },
  feeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feeCardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  feeCardDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  feeCardStatus: {
    height: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  feeCardStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  feeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeCardAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  feeCardDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

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
        onPress={() => (navigation as any).navigate('PaymentDetail', { paymentId: fee.id })}
        activeOpacity={0.7}
        style={styles.feeCard}
      >
        <View style={styles.feeCardHeader}>
          <View>
            <Text style={[styles.feeCardType, { marginBottom: 4 }]}>{FEE_TYPE_LABELS[fee.type] || fee.type}</Text>
            <Text style={styles.feeCardDate}>Hạn chót: {formatDate(fee.dueDate)}</Text>
          </View>
          <View
            style={[styles.feeCardStatus, { backgroundColor: config.bgColor }]}
          >
            <Text
              style={[styles.feeCardStatusText, { color: config.color }]}
            >
              {config.label}
            </Text>
          </View>
        </View>
        <View style={styles.feeCardFooter}>
          <Text style={styles.feeCardAmount}>{formatCurrency(fee.amount)}</Text>
          <Text style={styles.feeCardDetail}>Chi tiết →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Học phí"
        onBack={() => navigation?.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tổng quan học phí</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng cộng:</Text>
            <Text style={styles.summaryTotal}>{formatCurrency(stats.total)}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Đã thanh toán</Text>
              <Text style={[styles.statValue, styles.statSuccess]}>
                {formatCurrency(stats.paid)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Chưa thanh toán</Text>
              <Text style={[styles.statValue, styles.statWarning]}>
                {formatCurrency(stats.pending)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Quá hạn</Text>
              <Text style={[styles.statValue, styles.statError]}>
                {formatCurrency(stats.overdue)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fee List */}
        <Text style={styles.listTitle}>Chi tiết các khoản</Text>
        {fees.map(renderFeeCard)}
      </ScrollView>
    </View>
  );
};