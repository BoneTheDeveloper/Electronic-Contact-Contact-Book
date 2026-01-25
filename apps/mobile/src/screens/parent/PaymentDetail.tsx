/**
 * Payment Detail Screen
 * Invoice detail with fee items breakdown - Wireframe design
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Icon } from '../../components/ui';
import type { ParentHomeStackParamList } from '../../navigation/types';

interface PaymentDetailProps {
  navigation?: any;
  route?: RouteProp<ParentHomeStackParamList, 'PaymentDetail'>;
}

interface FeeItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'required' | 'optional' | 'discount';
}

// Mock fee items data - Phiếu thu PT202501001
const MOCK_FEE_ITEMS: FeeItem[] = [
  {
    id: '1',
    name: 'Học phí tháng 1/2025',
    description: 'Học phí chính khóa',
    amount: 1500000,
    type: 'required',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const TOTAL_AMOUNT = 1500000;
const INVOICE_NUMBER = 'PT202501001';

const FEE_TYPE_CONFIG = {
  required: {
    label: 'Bắt buộc',
    bgColor: '#FEE2E2',
    textColor: '#EF4444',
  },
  optional: {
    label: 'Tự nguyện',
    bgColor: '#DBEAFE',
    textColor: '#0284C7',
  },
  discount: {
    label: 'Ưu đãi',
    bgColor: '#D1FAE5',
    textColor: '#22C55E',
  },
};

export const PaymentDetailScreen: React.FC<PaymentDetailProps> = ({ navigation, route }) => {
  const { paymentId } = route?.params || {};
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');

  // Calculate total based on payment type
  const currentAmount = useMemo(() => {
    if (paymentType === 'full') {
      return TOTAL_AMOUNT;
    }
    const amount = parseInt(partialAmount.replace(/[^\d]/g, '')) || 0;
    return Math.min(amount, TOTAL_AMOUNT);
  }, [paymentType, partialAmount]);

  const remainingAmount = TOTAL_AMOUNT - currentAmount;

  const handlePaymentTypeChange = (type: 'full' | 'partial') => {
    setPaymentType(type);
    if (type === 'full') {
      setPartialAmount('');
    }
  };

  const handlePartialAmountChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, '');
    const amount = parseInt(numericText) || 0;
    if (amount <= TOTAL_AMOUNT) {
      setPartialAmount(numericText);
    } else {
      setPartialAmount(TOTAL_AMOUNT.toString());
    }
  };

  const handleProceed = () => {
    if (paymentType === 'partial' && currentAmount === 0) {
      return;
    }
    navigation?.navigate('PaymentMethod');
  };

  const renderFeeItem = (item: FeeItem) => {
    const isDiscount = item.type === 'discount';
    const config = FEE_TYPE_CONFIG[item.type];

    return (
      <View
        key={item.id}
        style={[
          styles.feeItemCard,
          isDiscount && styles.discountItemCard,
        ]}
      >
        <View style={styles.feeItemHeader}>
          <View style={styles.feeItemHeaderLeft}>
            <View style={styles.feeItemNameContainer}>
              <Text style={styles.feeItemName}>{item.name}</Text>
              {!isDiscount && (
                <View style={[styles.feeTypeBadge, { backgroundColor: config.bgColor }]}>
                  <Text style={[styles.feeTypeBadgeText, { color: config.textColor }]}>
                    {config.label}
                  </Text>
                </View>
              )}
              {isDiscount && (
                <Icon name="star" size={16} color="#22C55E" />
              )}
            </View>
            <Text style={styles.feeItemDescription}>{item.description}</Text>
          </View>
          <View style={styles.feeItemAmountContainer}>
            <Text style={[styles.feeItemAmount, isDiscount && styles.discountAmount]}>
              {isDiscount ? '-' : ''}{formatCurrency(item.amount)} ₫
            </Text>
          </View>
        </View>
      </View>
    );
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
            <Text style={styles.headerTitle}>Chi tiết Phiếu thu</Text>
            <TouchableOpacity style={styles.headerIconButton}>
              <Icon name="dots-horizontal" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Info Card */}
        <View style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={styles.invoiceTitle}>Học phí tháng 1/2025</Text>
              <Text style={styles.invoiceNumber}>#{INVOICE_NUMBER}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Chưa thanh toán</Text>
            </View>
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceDetailItem}>
              <Text style={styles.invoiceDetailLabel}>Hạn thanh toán</Text>
              <Text style={styles.invoiceDetailValue}>25/01/2025</Text>
            </View>
            <View style={styles.invoiceDetailItem}>
              <Text style={styles.invoiceDetailLabel}>Số ngày còn lại</Text>
              <Text style={styles.invoiceDetailValueHighlight}>Hôm nay</Text>
            </View>
          </View>
        </View>

        {/* Fee Items Detail */}
        <Text style={styles.sectionTitle}>Chi tiết khoản thu</Text>
        <View style={styles.feeItemsList}>
          {MOCK_FEE_ITEMS.map(renderFeeItem)}
        </View>

        {/* Note Section */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Icon name="information" size={18} color="#F59E0B" />
            <Text style={styles.noteTitle}>Lưu ý thanh toán</Text>
          </View>
          <Text style={styles.noteText}>
            Vui lòng thanh toán đầy đủ trước hạn để tránh bị tính phí trễ hạn. Sau khi thanh toán, hệ thống sẽ tự động cập nhật trong vòng 5-10 phút.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Payment Panel */}
      <View style={styles.bottomPanel}>
        {/* Payment Type Selection */}
        <View style={styles.paymentTypeSection}>
          <Text style={styles.paymentTypeLabel}>Chọn hình thức thanh toán</Text>
          <View style={styles.paymentTypeOptions}>
            <TouchableOpacity
              style={[
                styles.paymentTypeOption,
                paymentType === 'full' && styles.paymentTypeOptionActive,
              ]}
              onPress={() => handlePaymentTypeChange('full')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentTypeRadioContainer}>
                <View style={[
                  styles.paymentTypeRadio,
                  paymentType === 'full' && styles.paymentTypeRadioActive,
                ]}>
                  {paymentType === 'full' && (
                    <Icon name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[
                  styles.paymentTypeOptionText,
                  paymentType === 'full' && styles.paymentTypeOptionTextActive,
                ]}>
                  Toàn bộ
                </Text>
              </View>
              <Text style={styles.paymentTypeOptionSubtext}>Thanh toán đầy đủ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentTypeOption,
                paymentType === 'partial' && styles.paymentTypeOptionActive,
              ]}
              onPress={() => handlePaymentTypeChange('partial')}
              activeOpacity={0.7}
            >
              <View style={styles.paymentTypeRadioContainer}>
                <View style={[
                  styles.paymentTypeRadio,
                  paymentType === 'partial' && styles.paymentTypeRadioActive,
                ]}>
                  {paymentType === 'partial' && (
                    <Icon name="check" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[
                  styles.paymentTypeOptionText,
                  paymentType === 'partial' && styles.paymentTypeOptionTextActive,
                ]}>
                  Một phần
                </Text>
              </View>
              <Text style={styles.paymentTypeOptionSubtext}>Nhập số tiền</Text>
            </TouchableOpacity>
          </View>

          {/* Partial Payment Input */}
          {paymentType === 'partial' && (
            <View style={styles.partialPaymentSection}>
              <Text style={styles.partialPaymentLabel}>
                Nhập số tiền muốn thanh toán
              </Text>
              <View style={styles.partialPaymentInputContainer}>
                <TextInput
                  style={styles.partialPaymentInput}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={partialAmount}
                  onChangeText={handlePartialAmountChange}
                  keyboardType="numeric"
                />
                <Text style={styles.partialPaymentCurrency}>₫</Text>
              </View>
              <Text style={styles.remainingAmountText}>
                Số tiền còn lại: <Text style={styles.remainingAmountHighlight}>
                  {formatCurrency(remainingAmount)} ₫
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Total Summary */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Tổng tiền cần thanh toán</Text>
          <Text style={styles.totalAmount}>{formatCurrency(currentAmount)} ₫</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            (paymentType === 'partial' && currentAmount === 0) && styles.proceedButtonDisabled,
          ]}
          onPress={handleProceed}
          disabled={paymentType === 'partial' && currentAmount === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.proceedButtonText}>Tiếp tục thanh toán</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
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
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 400,
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FEE2E2',
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    textTransform: 'uppercase',
  },
  invoiceDetails: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  invoiceDetailItem: {
    flex: 1,
  },
  invoiceDetailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  invoiceDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  invoiceDetailValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  feeItemsList: {
    marginBottom: 24,
  },
  feeItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  discountItemCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  feeItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feeItemHeaderLeft: {
    flex: 1,
  },
  feeItemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  feeItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  feeTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  feeTypeBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  feeItemDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  feeItemAmountContainer: {
    alignItems: 'flex-end',
  },
  feeItemAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  discountAmount: {
    color: '#22C55E',
  },
  noteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
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
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  paymentTypeSection: {
    marginBottom: 16,
  },
  paymentTypeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  paymentTypeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  paymentTypeOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  paymentTypeOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0284C7',
  },
  paymentTypeRadioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  paymentTypeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTypeRadioActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  paymentTypeOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  paymentTypeOptionTextActive: {
    color: '#0284C7',
  },
  paymentTypeOptionSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  partialPaymentSection: {
    marginTop: 12,
  },
  partialPaymentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  partialPaymentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  partialPaymentInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  partialPaymentCurrency: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  remainingAmountText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 8,
  },
  remainingAmountHighlight: {
    fontWeight: '700',
    color: '#F97316',
  },
  totalSection: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0284C7',
  },
  proceedButton: {
    flexDirection: 'row',
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  proceedButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
