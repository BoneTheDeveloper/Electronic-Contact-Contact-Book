/**
 * Payment Receipt Screen
 * Payment confirmation and receipt
 */

import React from 'react';
import { View, ScrollView, Share, TouchableOpacity, Text } from 'react-native';
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
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-[#0284C7] pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Biên lai thanh toán</Text>
        <Text className="text-sm text-white/80 mt-1">Xác nhận thanh toán thành công</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-24">
        {/* Success Icon */}
        <View className="items-center py-8">
          <View className="w-20 h-20 rounded-full bg-green-100 justify-center items-center mb-4">
            <Text className="text-5xl text-green-600 font-bold">✓</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Thanh toán thành công!</Text>
          <Text className="text-2xl font-extrabold text-[#0284C7]">
            {formatCurrency(MOCK_RECEIPT.amount)}
          </Text>
        </View>

        {/* Receipt Card */}
        <View className="mb-4 rounded-2xl bg-white shadow-sm border border-gray-200">
          <View className="p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Biên lai</Text>
              <Text className="text-sm text-gray-500 font-medium">#{MOCK_RECEIPT.id}</Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 my-4" />

            {/* Payment Info */}
            <View className="mb-2">
              <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Thông tin thanh toán
              </Text>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Loại khoản:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {MOCK_RECEIPT.type}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Số tiền:</Text>
                <Text className="text-base font-extrabold text-[#0284C7] text-right flex-1 ml-4">
                  {formatCurrency(MOCK_RECEIPT.amount)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Ngày thanh toán:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {formatDate(MOCK_RECEIPT.paymentDate)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Phương thức:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {MOCK_RECEIPT.paymentMethod}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Mã giao dịch:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {MOCK_RECEIPT.transactionId}
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-200 my-4" />

            {/* Student Info */}
            <View className="mb-2">
              <Text className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                Thông tin học sinh
              </Text>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Họ và tên:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {MOCK_RECEIPT.studentName}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Lớp:</Text>
                <Text className="text-sm text-gray-800 font-semibold text-right flex-1 ml-4">
                  {MOCK_RECEIPT.studentClass}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleShare}
          className="bg-[#0284C7] rounded-xl py-3 mb-3 items-center"
        >
          <Text className="text-white font-semibold">Chia sẻ biên lai</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          className="border-2 border-[#0284C7] rounded-xl py-3 mb-3 items-center bg-transparent"
        >
          <Text className="text-[#0284C7] font-semibold">Tải về PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {}}
          className="rounded-xl py-3 mt-2 items-center"
        >
          <Text className="text-gray-600 font-medium">Về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
