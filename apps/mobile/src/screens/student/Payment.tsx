/**
 * Payment Screen
 * Student fee payment information
 * Uses real Supabase data via student store
 */

import React, { useMemo, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface PaymentScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface Fee {
  id: string;
  invoiceNumber: string;
  name: string;
  amount: number;
  paidAmount: number;
  totalAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  paidDate?: string;
}

const STATUS_CONFIG = {
  pending: { label: 'Chưa thanh toán', color: '#F59E0B', bgColor: '#FEF3C7' },
  partial: { label: 'Thanh toán 1 phần', color: '#3B82F6', bgColor: '#DBEAFE' },
  paid: { label: 'Đã thanh toán', color: '#10B981', bgColor: '#D1FAE5' },
  overdue: { label: 'Quá hạn', color: '#EF4444', bgColor: '#FEE2E2' },
  cancelled: { label: 'Đã hủy', color: '#6B7280', bgColor: '#E5E7EB' },
};

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

export const StudentPaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { invoices, isLoading, loadInvoices } = useStudentStore();

  // Load invoices when student ID changes
  useEffect(() => {
    if (user?.id && user?.role === 'student') {
      loadInvoices(user.id);
    }
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pending = invoices
      .filter(f => f.status === 'pending')
      .reduce((sum, inv) => sum + inv.remainingAmount, 0);
    const overdue = invoices
      .filter(f => f.status === 'overdue')
      .reduce((sum, inv) => sum + inv.remainingAmount, 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

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

  const renderFeeCard = (invoice: Fee) => {
    const config = STATUS_CONFIG[invoice.status];
    return (
      <TouchableOpacity
        key={invoice.id}
        onPress={() => {}}
        activeOpacity={0.7}
        style={styles.feeCard}
      >
        <View style={styles.feeCardHeader}>
          <View>
            <Text style={[styles.feeCardType, { marginBottom: 4 }]}>{invoice.name}</Text>
            <Text style={styles.feeCardDate}>Hạn chót: {formatDate(invoice.dueDate)}</Text>
            {invoice.invoiceNumber && (
              <Text style={styles.feeCardDate}>Mã: {invoice.invoiceNumber}</Text>
            )}
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
          <Text style={styles.feeCardAmount}>{formatCurrency(invoice.totalAmount)}</Text>
          <Text style={styles.feeCardDetail}>Chi tiết →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoading && invoices.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Học phí"
          onBack={() => navigation?.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, fontSize: 14, color: '#6b7280' }}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

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
        {invoices.map(renderFeeCard)}

        {/* Empty state */}
        {invoices.length === 0 && !isLoading && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#9ca3af' }}>Chưa có dữ liệu học phí</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
