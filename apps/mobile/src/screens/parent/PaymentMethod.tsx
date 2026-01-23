/**
 * Payment Method Screen
 * Payment options selection
 */

import React, { useState } from 'react';
import { View, ScrollView, Pressable, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface PaymentMethodProps {
  navigation?: ParentHomeStackNavigationProp;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // bg-slate-50
  },
  scrollContent: {
    paddingHorizontal: 16, // p-4
    paddingBottom: 96, // pb-24
  },
  sectionTitle: {
    fontSize: 16, // text-base
    fontWeight: 'bold', // font-bold
    color: '#1f2937', // text-gray-800
    marginBottom: 12, // mb-3
    marginTop: 8, // mt-2
  },
  paymentMethodCard: {
    marginBottom: 12, // mb-3
    borderRadius: 12, // rounded-xl
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'transparent', // border-transparent
  },
  paymentMethodCardSelected: {
    borderColor: '#3b82f6', // border-primary
    backgroundColor: '#e0f2fe', // bg-sky-50
  },
  paymentMethodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16, // p-4
  },
  paymentMethodLeft: {
    flex: 1,
    marginRight: 12, // mr-3
  },
  paymentMethodName: {
    fontSize: 16, // text-base
    fontWeight: 'bold', // font-bold
    color: '#1f2937', // text-gray-800
    marginBottom: 4, // mb-1
  },
  paymentMethodDescription: {
    fontSize: 12, // text-xs
    color: '#6b7280', // text-gray-500
    lineHeight: 16, // leading-4
    marginBottom: 4, // mb-1
  },
  paymentMethodFee: {
    fontSize: 12, // text-xs
    color: '#f59e0b', // text-warning
    fontWeight: '600', // font-semibold
  },
  radioButtonContainer: {
    width: 24, // w-6
    height: 24, // h-6
    borderRadius: 12, // rounded-full
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonBorder: {
    borderColor: '#d1d5db', // border-gray-300
  },
  radioButtonSelected: {
    borderColor: '#3b82f6', // border-primary
    backgroundColor: '#3b82f6', // bg-primary
  },
  radioButtonDot: {
    width: 12, // w-3
    height: 12, // h-3
    borderRadius: 6, // rounded-full
    backgroundColor: 'white',
  },
  feeSummaryContainer: {
    marginTop: 16, // mt-4
    marginBottom: 16, // mb-4
    borderRadius: 12, // rounded-xl
    backgroundColor: 'white',
    padding: 16, // p-4
  },
  feeSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // mb-2
  },
  feeSummaryLabel: {
    fontSize: 14, // text-sm
    color: '#6b7280', // text-gray-500
  },
  feeSummaryAmount: {
    fontSize: 14, // text-sm
    fontWeight: '600', // font-semibold
    color: '#1f2937', // text-gray-800
  },
  feeSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8, // pt-2
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb', // border-gray-200
  },
  feeSummaryTotalLabel: {
    fontSize: 16, // text-base
    fontWeight: 'bold', // font-bold
    color: '#1f2937', // text-gray-800
  },
  feeSummaryTotalAmount: {
    fontSize: 18, // text-lg
    fontWeight: '900', // font-extrabold
    color: '#3b82f6', // text-primary
  },
  continueButton: {
    marginTop: 8, // mt-2
    backgroundColor: '#3b82f6', // bg-primary
    height: 40, // py-2.5
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16, // text-base
    fontWeight: 'bold', // font-bold
    color: 'white',
  },
});

export const PaymentMethodScreen: React.FC<PaymentMethodProps> = ({ navigation }) => {
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
      <ScreenHeader
        title="Phương thức thanh toán"
        onBack={() => navigation?.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Chọn phương thức</Text>

        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            style={[
              styles.paymentMethodCard,
              selectedMethod === method.id && styles.paymentMethodCardSelected
            ]}
          >
            <View style={styles.paymentMethodContent}>
              <View style={styles.paymentMethodLeft}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                {method.fee > 0 && (
                  <Text style={styles.paymentMethodFee}>Phí dịch vụ: {formatCurrency(method.fee)}</Text>
                )}
              </View>
              <View style={[
                styles.radioButtonContainer,
                selectedMethod === method.id ? styles.radioButtonSelected : styles.radioButtonBorder
              ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonDot} />
                )}
              </View>
            </View>
          </Pressable>
        ))}

        {/* Fee Summary */}
        {selectedMethodData && selectedMethodData.fee > 0 && (
          <View style={styles.feeSummaryContainer}>
            <View style={styles.feeSummaryRow}>
              <Text style={styles.feeSummaryLabel}>Số tiền thanh toán:</Text>
              <Text style={styles.feeSummaryAmount}>5,000,000 VND</Text>
            </View>
            <View style={styles.feeSummaryRow}>
              <Text style={styles.feeSummaryLabel}>Phí dịch vụ:</Text>
              <Text style={styles.feeSummaryAmount}>{formatCurrency(selectedMethodData.fee)}</Text>
            </View>
            <View style={styles.feeSummaryTotal}>
              <Text style={styles.feeSummaryTotalLabel}>Tổng cộng:</Text>
              <Text style={styles.feeSummaryTotalAmount}>
                {formatCurrency(5000000 + selectedMethodData.fee)}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {}}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
