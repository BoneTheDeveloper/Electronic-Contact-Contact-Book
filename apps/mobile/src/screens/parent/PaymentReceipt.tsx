/**
 * Payment Receipt Screen
 * Payment confirmation and receipt - Wireframe design
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Icon } from '../../components/ui';
import type { ParentHomeStackParamList } from '../../navigation/types';

interface PaymentReceiptProps {
  navigation?: any;
  route?: RouteProp<ParentHomeStackParamList, 'PaymentReceipt'>;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Phiếu thu PT202501001
const PAYMENT_AMOUNT = 1500000;
const RECEIPT_ID = 'PT202501001';
const TRANSACTION_ID = 'VCP' + Date.now(); // Vietcombank transaction ID format

export const PaymentReceiptScreen: React.FC<PaymentReceiptProps> = ({ navigation, route }) => {
  const { receiptId } = route?.params || {};

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Biên lai thanh toán\nMã: ${RECEIPT_ID}\nSố tiền: ${formatCurrency(PAYMENT_AMOUNT)} ₫\nMã giao dịch: ${TRANSACTION_ID}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    console.log('Download PDF');
  };

  const handleBackHome = () => {
    navigation?.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={styles.headerBackground}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
              <Icon name="chevron-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Biên lai</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Card */}
        <View style={styles.successCard}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Icon name="check" size={32} color="#FFFFFF" />
              </View>
            </View>
          </View>
          <Text style={styles.successTitle}>Thanh toán thành công!</Text>
          <Text style={styles.successAmount}>{formatCurrency(PAYMENT_AMOUNT)} ₫</Text>
          <Text style={styles.successDate}>25/01/2025 • 14:30</Text>
        </View>

        {/* Receipt Details Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Icon name="file-invoice" size={20} color="#0284C7" />
            <Text style={styles.receiptTitle}>Chi tiết biên lai</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã biên lai</Text>
            <Text style={styles.detailValue}>#{RECEIPT_ID}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã giao dịch</Text>
            <View style={styles.detailValueRow}>
              <Text style={styles.detailValue}>{TRANSACTION_ID}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="copy" size={12} color="#0284C7" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Số tiền</Text>
            <Text style={styles.detailValueAmount}>{formatCurrency(PAYMENT_AMOUNT)} ₫</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phương thức</Text>
            <Text style={styles.detailValue}>VietQR - VCB</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nội dung</Text>
            <Text style={styles.detailValue}>{RECEIPT_ID}_HOANGB_9A</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Họ tên</Text>
            <Text style={styles.detailValue}>Hoàng B</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Lớp</Text>
            <Text style={styles.detailValue}>9A</Text>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Icon name="information" size={16} color="#F59E0B" />
            <Text style={styles.noteTitle}>Thông tin</Text>
          </View>
          <Text style={styles.noteText}>
            Biên lai đã được gửi đến email đăng ký. Bạn có thể xem lại biên lai trong mục Lịch sử thanh toán.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Icon name="share-alt" size={18} color="#FFFFFF" />
          <Text style={styles.shareButtonText}>Chia sẻ biên lai</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDownloadPDF}
            activeOpacity={0.7}
          >
            <Icon name="download" size={16} color="#0284C7" />
            <Text style={styles.secondaryButtonText}>Tải PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackHome}
            activeOpacity={0.7}
          >
            <Icon name="home" size={16} color="#64748B" />
            <Text style={[styles.secondaryButtonText, styles.secondaryButtonTextGray]}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    backgroundColor: '#0284C7',
    paddingTop: 0,
    height: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 160,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EFF6FF',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22C55E',
    marginBottom: 4,
  },
  successDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EFF6FF',
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#22C55E',
  },
  copyButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  noteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    lineHeight: 18,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  secondaryButtonTextGray: {
    color: '#64748B',
  },
});
