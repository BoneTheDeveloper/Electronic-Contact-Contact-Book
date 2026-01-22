/**
 * Payment Method Screen
 * Payment options selection
 */

import React, { useState } from 'react';
import { View, ScrollView, Pressable, TouchableOpacity, Text } from 'react-native';

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
    <View className="flex-1 bg-slate-50">
      <View className="bg-primary pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Phương thức thanh toán</Text>
        <Text className="text-sm text-white/80 mt-1">Chọn cách thức thanh toán phù hợp</Text>
      </View>
      <ScrollView contentContainerClassName="p-4 pb-24">
        <Text className="text-base font-bold text-gray-800 mb-3 mt-2">Chọn phương thức</Text>

        {PAYMENT_METHODS.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => setSelectedMethod(method.id)}
            className={`mb-3 rounded-xl bg-white border-2 ${
              selectedMethod === method.id ? 'border-primary bg-sky-50' : 'border-transparent'
            }`}
          >
            <View className="flex-row justify-between items-center p-4">
              <View className="flex-1 mr-3">
                <Text className="text-base font-bold text-gray-800 mb-1">{method.name}</Text>
                <Text className="text-xs text-gray-500 leading-4 mb-1">{method.description}</Text>
                {method.fee > 0 && (
                  <Text className="text-xs text-warning font-semibold">Phí dịch vụ: {formatCurrency(method.fee)}</Text>
                )}
              </View>
              <View className={`w-6 h-6 rounded-full border-2 ${
                selectedMethod === method.id ? 'border-primary bg-primary' : 'border-gray-300'
              } items-center justify-center`}>
                {selectedMethod === method.id && (
                  <View className="w-3 h-3 rounded-full bg-white" />
                )}
              </View>
            </View>
          </Pressable>
        ))}

        {/* Fee Summary */}
        {selectedMethodData && selectedMethodData.fee > 0 && (
          <View className="mt-4 mb-4 rounded-xl bg-white p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-500">Số tiền thanh toán:</Text>
              <Text className="text-sm font-semibold text-gray-800">5,000,000 VND</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-500">Phí dịch vụ:</Text>
              <Text className="text-sm font-semibold text-gray-800">{formatCurrency(selectedMethodData.fee)}</Text>
            </View>
            <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
              <Text className="text-base font-bold text-gray-800">Tổng cộng:</Text>
              <Text className="text-lg font-extrabold text-primary">
                {formatCurrency(5000000 + selectedMethodData.fee)}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {}}
          className="mt-2 bg-primary py-2.5 rounded-lg items-center"
        >
          <Text className="text-base font-bold text-white">Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
