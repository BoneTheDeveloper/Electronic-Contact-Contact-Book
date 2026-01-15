/**
 * Payment Detail Screen
 * Single invoice view
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import { getFeesByStudentId } from '../../mock-data';
import { colors } from '../../theme';

interface PaymentDetailProps {
  route: {
    params: {
      feeId: string;
    };
  };
}

export const PaymentDetailScreen: React.FC<PaymentDetailProps> = ({ route }) => {
  const { feeId } = route.params;
  const fees = getFeesByStudentId('2'); // Mock: using student ID 2
  const fee = fees.find(f => f.id === feeId);

  if (!fee) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy thông tin thanh toán</Text>
      </View>
    );
  }

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

  const config = STATUS_CONFIG[fee.status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chi tiết thanh toán</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Fee Card */}
        <Card style={styles.mainCard}>
          <Card.Content>
            <View style={styles.feeHeader}>
              <Text style={styles.feeType}>{FEE_TYPE_LABELS[fee.type]}</Text>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: config.bgColor }]}
                textStyle={[styles.statusChipText, { color: config.color }]}
              >
                {config.label}
              </Chip>
            </View>
            <Text style={styles.feeAmount}>{formatCurrency(fee.amount)}</Text>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã khoản:</Text>
              <Text style={styles.detailValue}>#{fee.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ngày tạo:</Text>
              <Text style={styles.detailValue}>01/01/2026</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hạn chót:</Text>
              <Text style={styles.detailValue}>{formatDate(fee.dueDate)}</Text>
            </View>
            {fee.paidDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngày thanh toán:</Text>
                <Text style={styles.detailValue}>{formatDate(fee.paidDate)}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Student Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Thông tin học sinh</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Họ và tên:</Text>
              <Text style={styles.detailValue}>Nguyễn Hoàng B</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lớp:</Text>
              <Text style={styles.detailValue}>10A</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Năm học:</Text>
              <Text style={styles.detailValue}>2025-2026</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        {fee.status !== 'paid' && (
          <>
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.payButton}
              contentStyle={styles.payButtonContent}
              labelStyle={styles.payButtonLabel}
            >
              Thanh toán ngay
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.methodButton}
              contentStyle={styles.methodButtonContent}
            >
              Chọn phương thức thanh toán
            </Button>
          </>
        )}

        {fee.status === 'paid' && (
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.receiptButton}
            contentStyle={styles.methodButtonContent}
            icon="receipt"
          >
            Xem biên lai
          </Button>
        )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  mainCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  feeAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
  },
  divider: {
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  payButton: {
    marginBottom: 12,
    backgroundColor: colors.primary,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
  payButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  methodButton: {
    marginBottom: 12,
    borderColor: colors.primary,
  },
  methodButtonContent: {
    paddingVertical: 8,
  },
  receiptButton: {
    borderColor: colors.primary,
  },
});
