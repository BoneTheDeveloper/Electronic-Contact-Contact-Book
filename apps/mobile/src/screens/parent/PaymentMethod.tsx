/**
 * Payment Method Screen
 * QR code display for bank transfer payment - Wireframe design
 * Real VietQR implementation with properly formatted QR string
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Icon } from '../../components/ui';
import { generateVietQRString, BANK_BINS, type VietQRData } from '../../lib/supabase/vietqr';
import { VietQRLogo, VietQRPattern } from '../../components/payment';
import type { ParentHomeStackParamList } from '../../navigation/types';

interface PaymentMethodProps {
  navigation?: any;
  route?: RouteProp<ParentHomeStackParamList, 'PaymentMethod'>;
}

// Mock VietQR payment data - TODO: Replace with real data from route params or API
const MOCK_VIETQR_DATA: VietQRData = {
  bankBin: BANK_BINS.VCB,
  accountNumber: '001100223344',
  accountName: 'TRUONG THPT HA NOI',
  amount: 1500000,
  transactionId: 'PT202501001',
  template: 'compact2',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const INVOICE_NUMBER = 'PT202501001';

export const PaymentMethodScreen: React.FC<PaymentMethodProps> = ({ navigation, route }) => {
  // TODO: Get payment data from route params or API
  const paymentData = MOCK_VIETQR_DATA;

  // Generate real VietQR string (can be encoded as actual QR code)
  const vietqrString = React.useMemo(() => generateVietQRString(paymentData), []);

  const handleConfirmPayment = () => {
    navigation?.navigate('PaymentReceipt', { receiptId: INVOICE_NUMBER });
  };

  const handleCopyQR = () => {
    // TODO: Implement clipboard functionality with expo-clipboard
    // Install: npx expo install expo-clipboard
    // Usage:
    // import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(vietqrString);
    // Show success toast to user
    console.log('VietQR String:', vietqrString);
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
            <Text style={styles.headerTitle}>Thanh toán</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <View style={styles.vietqrBadge}>
              <Text style={styles.vietqrBadgeText}>VietQR</Text>
            </View>
            <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
          </View>
          <Text style={styles.qrDescription}>
            Sử dụng ứng dụng ngân hàng hỗ trợ VietQR để quét mã
          </Text>

          {/* QR Code Display */}
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCodeWrapper}>
              <VietQRPattern qrString={vietqrString} size={204} cellSize={8} />
              {/* VietQR Logo */}
              <View style={styles.vietqrLogoContainer}>
                <VietQRLogo size={40} />
              </View>
            </View>
          </View>

          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            <Text style={styles.amountLabel}>Số tiền thanh toán</Text>
            <Text style={styles.amountValue}>{formatCurrency(paymentData.amount || 0)} ₫</Text>
          </View>

          <TouchableOpacity style={styles.downloadQrButton} onPress={handleCopyQR}>
            <Icon name="download" size={16} color="#0284C7" />
            <Text style={styles.downloadQrButtonText}>Lưu mã QR</Text>
          </TouchableOpacity>
        </View>

        {/* Bank Info Card */}
        <View style={styles.bankInfoCard}>
          <View style={styles.bankInfoHeader}>
            <Icon name="university" size={20} color="#0284C7" />
            <Text style={styles.bankInfoTitle}>Thông tin chuyển khoản</Text>
          </View>

          <View style={styles.bankInfoRow}>
            <View style={styles.bankInfoIcon}>
              <Text style={styles.bankIconText}>VCB</Text>
            </View>
            <View style={styles.bankInfoContent}>
              <Text style={styles.bankName}>Vietcombank</Text>
              <Text style={styles.bankBranch}>Chi nhánh Hà Nội</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Số tài khoản</Text>
            <View style={styles.bankDetailValueRow}>
              <Text style={styles.bankDetailValue}>{paymentData.accountNumber}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="copy" size={14} color="#0284C7" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Chủ tài khoản</Text>
            <View style={styles.bankDetailValueRow}>
              <Text style={styles.bankDetailValue}>{paymentData.accountName}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="copy" size={14} color="#0284C7" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Số tiền</Text>
            <View style={styles.bankDetailValueRow}>
              <Text style={styles.bankDetailValue}>{formatCurrency(paymentData.amount || 0)} ₫</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="copy" size={14} color="#0284C7" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bankDetailRow}>
            <Text style={styles.bankDetailLabel}>Nội dung CK</Text>
            <View style={styles.bankDetailValueRow}>
              <Text style={styles.bankDetailValue}>{INVOICE_NUMBER}_HOANGB_9A</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Icon name="copy" size={14} color="#0284C7" />
              </TouchableOpacity>
            </View>
          </View>

          {/* VietQR Data String - for testing */}
          <View style={styles.vietqrStringCard}>
            <Text style={styles.vietqrStringLabel}>VietQR Data String (Test):</Text>
            <Text style={styles.vietqrStringValue} selectable>
              {vietqrString}
            </Text>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Icon name="information" size={18} color="#F59E0B" />
            <Text style={styles.noteTitle}>Lưu ý</Text>
          </View>
          <Text style={styles.noteText}>
            • Sau khi thanh toán, hệ thống sẽ tự động cập nhật trong vòng 5-10 phút{'\n'}
            • Vui lòng nhập đúng nội dung chuyển khoản để hệ thống nhận diện{'\n'}
            • Ưu tiên sử dụng VietQR để thanh toán nhanh chóng{'\n'}
            • Liên hệ hotline nếu không nhận được biên lai sau 15 phút{'\n'}
            • Mã QR tuân thủ chuẩn VietQR của NAPAS/EMVCo
          </Text>
        </View>

        {/* QR Implementation Note */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ QR Code Implementation</Text>
          <Text style={styles.infoText}>
            QR string generated with proper VietQR format. To render actual scannable QR code:
            {'\n'}1. Install: npx expo install react-native-qrcode-svg
            {'\n'}2. Import: import QRCode from 'react-native-qrcode-svg'
            {'\n'}3. Use: {'<QRCode value={vietqrString} size={200} />'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
          activeOpacity={0.7}
        >
          <Text style={styles.confirmButtonText}>Đã thanh toán</Text>
        </TouchableOpacity>
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
    paddingBottom: 120,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EFF6FF',
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  vietqrBadge: {
    backgroundColor: '#0056CC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vietqrBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  qrDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 20,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCodeWrapper: {
    width: 220,
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 8,
    borderColor: '#1F2937',
    padding: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vietqrLogoContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  amountDisplay: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#22C55E',
  },
  downloadQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  downloadQrButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284C7',
  },
  bankInfoCard: {
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
  bankInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  bankInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  bankInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EF4444',
  },
  bankInfoContent: {
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  bankBranch: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  bankDetailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  copyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vietqrStringCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  vietqrStringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  vietqrStringValue: {
    fontSize: 9,
    fontWeight: '500',
    color: '#0284C7',
    fontFamily: 'monospace',
  },
  noteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
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
    color: '#92400E',
  },
  noteText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B45309',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1E40AF',
    lineHeight: 16,
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
  confirmButton: {
    backgroundColor: '#22C55E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
