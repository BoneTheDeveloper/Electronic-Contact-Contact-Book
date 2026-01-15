/**
 * Payment Overview Screen
 * Fee summary and invoice list
 */

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
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
      >
        <Card style={styles.feeCard}>
          <Card.Content>
            <View style={styles.feeHeader}>
              <View>
                <Text style={styles.feeType}>{FEE_TYPE_LABELS[fee.type] || fee.type}</Text>
                <Text style={styles.feeDate}>Hạn chót: {formatDate(fee.dueDate)}</Text>
              </View>
              <Chip
                mode="flat"
                compact
                style={[styles.statusChip, { backgroundColor: config.bgColor }]}
                textStyle={[styles.statusChipText, { color: config.color }]}
              >
                {config.label}
              </Chip>
            </View>
            <View style={styles.feeAmountRow}>
              <Text style={styles.feeAmount}>{formatCurrency(fee.amount)}</Text>
              <Text style={styles.viewDetails}>Chi tiết →</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Học phí</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Tổng quan học phí</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng cộng:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(stats.total)}</Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Đã thanh toán</Text>
                <Text style={[styles.summaryItemValue, { color: colors.success }]}>
                  {formatCurrency(stats.paid)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Chưa thanh toán</Text>
                <Text style={[styles.summaryItemValue, { color: colors.warning }]}>
                  {formatCurrency(stats.pending)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Quá hạn</Text>
                <Text style={[styles.summaryItemValue, { color: colors.error }]}>
                  {formatCurrency(stats.overdue)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Fee List */}
        <Text style={styles.sectionTitle}>Chi tiết các khoản</Text>
        {fees.map(renderFeeCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  feeCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feeType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  feeDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusChip: {
    height: 26,
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  feeAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  viewDetails: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
