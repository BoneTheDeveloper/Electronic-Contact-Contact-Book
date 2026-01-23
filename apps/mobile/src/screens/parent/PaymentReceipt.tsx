/**
 * Payment Receipt Screen
 * Payment confirmation and receipt
 */

import React from 'react';
import { View, ScrollView, Share, TouchableOpacity, Text, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0284C7',
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0284C7',
  },
  receiptCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  receiptContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  receiptId: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.05,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  valueAmount: {
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '800',
  },
  shareButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pdfButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderColor: '#0284C7',
    borderWidth: 2,
  },
  pdfButtonText: {
    color: '#0284C7',
    fontWeight: '600',
  },
  homeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
});

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biên lai thanh toán</Text>
        <Text style={styles.headerSubtitle}>Xác nhận thanh toán thành công</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successAmount}>
            {formatCurrency(MOCK_RECEIPT.amount)}
          </Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptContent}>
            {/* Header */}
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptTitle}>Biên lai</Text>
              <Text style={styles.receiptId}>#{MOCK_RECEIPT.id}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Payment Info */}
            <View>
              <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Loại khoản:</Text>
                <Text style={styles.value}>
                  {MOCK_RECEIPT.type}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Số tiền:</Text>
                <Text style={[styles.value, styles.valueAmount]}>
                  {formatCurrency(MOCK_RECEIPT.amount)}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Ngày thanh toán:</Text>
                <Text style={styles.value}>
                  {formatDate(MOCK_RECEIPT.paymentDate)}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Phương thức:</Text>
                <Text style={styles.value}>
                  {MOCK_RECEIPT.paymentMethod}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Mã giao dịch:</Text>
                <Text style={styles.value}>
                  {MOCK_RECEIPT.transactionId}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Student Info */}
            <View>
              <Text style={styles.sectionTitle}>Thông tin học sinh</Text>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Họ và tên:</Text>
                <Text style={styles.value}>
                  {MOCK_RECEIPT.studentName}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.label}>Lớp:</Text>
                <Text style={styles.value}>
                  {MOCK_RECEIPT.studentClass}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleShare}
          style={styles.shareButton}
        >
          <Text style={styles.shareButtonText}>Chia sẻ biên lai</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          style={styles.pdfButton}
        >
          <Text style={styles.pdfButtonText}>Tải về PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
