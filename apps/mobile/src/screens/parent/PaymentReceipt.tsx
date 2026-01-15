/**
 * Payment Receipt Screen
 * Payment confirmation and receipt
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Share } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { colors } from '../../theme';

interface ReceiptData {
  id: string;
  type: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  studentName: string;
  studentClass: string;
}

const MOCK_RECEIPT: ReceiptData = {
  id: 'REC20260112001',
  type: 'Học phí tháng 1/2026',
  amount: 5000000,
  paymentDate: '2026-01-12',
  paymentMethod: 'Chuyển khoản ngân hàng',
  transactionId: 'TXN20260112123456',
  studentName: 'Nguyễn Hoàng B',
  studentClass: '10A',
};

export const PaymentReceiptScreen: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Biên lai thanh toán\nMã: ${MOCK_RECEIPT.id}\nSố tiền: ${formatCurrency(MOCK_RECEIPT.amount)}\nNgày thanh toán: ${formatDate(MOCK_RECEIPT.paymentDate)}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biên lai thanh toán</Text>
        <Text style={styles.headerSubtitle}>Xác nhận thanh toán thành công</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successSubtitle}>
            {formatCurrency(MOCK_RECEIPT.amount)}
          </Text>
        </View>

        {/* Receipt Card */}
        <Card style={styles.receiptCard}>
          <Card.Content>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Biên lai</Text>
              <Text style={styles.receiptId}>#{MOCK_RECEIPT.id}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Loại khoản:</Text>
                <Text style={styles.detailValue}>{MOCK_RECEIPT.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Số tiền:</Text>
                <Text style={[styles.detailValue, styles.amountValue]}>
                  {formatCurrency(MOCK_RECEIPT.amount)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngày thanh toán:</Text>
                <Text style={styles.detailValue}>{formatDate(MOCK_RECEIPT.paymentDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phương thức:</Text>
                <Text style={styles.detailValue}>{MOCK_RECEIPT.paymentMethod}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mã giao dịch:</Text>
                <Text style={styles.detailValue}>{MOCK_RECEIPT.transactionId}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.receiptSection}>
              <Text style={styles.sectionTitle}>Thông tin học sinh</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Họ và tên:</Text>
                <Text style={styles.detailValue}>{MOCK_RECEIPT.studentName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Lớp:</Text>
                <Text style={styles.detailValue}>{MOCK_RECEIPT.studentClass}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <Button
          mode="contained"
          onPress={handleShare}
          style={styles.shareButton}
          contentStyle={styles.buttonContent}
          icon="share-variant"
        >
          Chia sẻ biên lai
        </Button>
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.downloadButton}
          contentStyle={styles.buttonContent}
          icon="download"
        >
          Tải về PDF
        </Button>
        <Button
          mode="text"
          onPress={() => {}}
          style={styles.homeButton}
          contentStyle={styles.buttonContent}
        >
          Về trang chủ
        </Button>
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
  successIconContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 48,
    color: colors.success,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  receiptCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  receiptId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  receiptSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.primary,
    marginBottom: 12,
  },
  downloadButton: {
    borderColor: colors.primary,
    marginBottom: 12,
  },
  homeButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 10,
  },
});
