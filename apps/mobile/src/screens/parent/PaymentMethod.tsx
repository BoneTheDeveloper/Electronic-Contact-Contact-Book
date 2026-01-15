/**
 * Payment Method Screen
 * Payment options selection
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, RadioButton, Button } from 'react-native-paper';
import { colors } from '../../theme';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fee: number;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán qua Internet Banking hoặc ứng dụng ngân hàng',
    icon: 'bank',
    fee: 0,
  },
  {
    id: 'qr_code',
    name: 'Quét mã QR',
    description: 'Quét mã QR để thanh toán bằng ví điện tử hoặc app ngân hàng',
    icon: 'qrcode',
    fee: 0,
  },
  {
    id: 'wallet',
    name: 'Ví điện tử (MoMo/ZaloPay)',
    description: 'Thanh toán nhanh qua ví điện tử',
    icon: 'wallet',
    fee: 5000,
  },
  {
    id: 'cash',
    name: 'Tiền mặt tại văn phòng',
    description: 'Thanh toán trực tiếp tại văn phòng trường',
    icon: 'cash',
    fee: 0,
  },
];

export const PaymentMethodScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const selectedMethodData = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <Text style={styles.headerSubtitle}>Chọn cách thức thanh toán phù hợp</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Chọn phương thức</Text>

        {PAYMENT_METHODS.map((method) => (
          <Card
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.selectedCard]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Card.Content style={styles.methodContent}>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
                {method.fee > 0 && (
                  <Text style={styles.methodFee}>Phí dịch vụ: {formatCurrency(method.fee)}</Text>
                )}
              </View>
              <RadioButton
                value={method.id}
                status={selectedMethod === method.id ? 'checked' : 'unchecked'}
                onPress={() => setSelectedMethod(method.id)}
                color={colors.primary}
              />
            </Card.Content>
          </Card>
        ))}

        {/* Fee Summary */}
        {selectedMethodData && selectedMethodData.fee > 0 && (
          <Card style={styles.feeCard}>
            <Card.Content>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Số tiền thanh toán:</Text>
                <Text style={styles.feeValue}>5,000,000 VND</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Phí dịch vụ:</Text>
                <Text style={styles.feeValue}>{formatCurrency(selectedMethodData.fee)}</Text>
              </View>
              <View style={[styles.feeRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(5000000 + selectedMethodData.fee)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.continueButton}
          contentStyle={styles.continueButtonContent}
          labelStyle={styles.continueButtonLabel}
        >
          Tiếp tục
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  methodCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  methodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginRight: 12,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  methodFee: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '600',
  },
  feeCard: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  continueButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
  },
  continueButtonContent: {
    paddingVertical: 10,
  },
  continueButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
