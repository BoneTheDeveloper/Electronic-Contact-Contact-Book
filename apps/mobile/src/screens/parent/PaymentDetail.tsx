/**
 * Payment Detail Screen
 * Single invoice view
 */

import React from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { getFeesByStudentId } from '../../mock-data'
import { colors } from '../../theme'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParentHomeStackParamList } from '../../navigation/types'

type PaymentDetailProps = NativeStackScreenProps<ParentHomeStackParamList, 'PaymentDetail'>

export const PaymentDetailScreen: React.FC<PaymentDetailProps> = ({ route }) => {
  const { paymentId } = route.params
  const fees = getFeesByStudentId('2') // Mock: using student ID 2
  const fee = fees.find(f => f.id === paymentId)

  if (!fee) {
    return (
      <View className="flex-1 bg-slate-50">
        <Text>Không tìm thấy thông tin thanh toán</Text>
      </View>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const FEE_TYPE_LABELS: Record<string, string> = {
    tuition: 'Học phí',
    transport: 'Phí đưa đón',
    library: 'Phí thư viện',
    lab: 'Phí phòng thí nghiệm',
    other: 'Khác',
  }

  const STATUS_CONFIG = {
    pending: { label: 'Chưa thanh toán', color: '#F59E0B', bgColor: '#FEF3C7' },
    paid: { label: 'Đã thanh toán', color: '#10B981', bgColor: '#D1FAE5' },
    overdue: { label: 'Quá hạn', color: '#EF4444', bgColor: '#FEE2E2' },
  }

  const config = STATUS_CONFIG[fee.status]

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-blue-600 pt-15 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Chi tiết thanh toán</Text>
      </View>
      <ScrollView contentContainerClassName="p-4 pb-25">
        {/* Main Fee Card */}
        <View className="mb-4 rounded-2xl bg-white shadow-md">
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">{FEE_TYPE_LABELS[fee.type]}</Text>
              <View
                className="h-7 px-2 rounded-full flex justify-center items-center"
                style={{ backgroundColor: config.bgColor }}
              >
                <Text className="text-xs font-bold uppercase" style={{ color: config.color }}>
                  {config.label}
                </Text>
              </View>
            </View>
            <Text className="text-3xl font-extrabold text-blue-600 mb-5">
              {formatCurrency(fee.amount)}
            </Text>

            <View className="h-px bg-gray-200 mb-4" />

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Mã khoản:</Text>
              <Text className="text-sm text-gray-800 font-semibold">#{fee.id}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Ngày tạo:</Text>
              <Text className="text-sm text-gray-800 font-semibold">01/01/2026</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Hạn chót:</Text>
              <Text className="text-sm text-gray-800 font-semibold">{formatDate(fee.dueDate)}</Text>
            </View>
            {fee.paidDate && (
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-500 font-medium">Ngày thanh toán:</Text>
                <Text className="text-sm text-gray-800 font-semibold">
                  {formatDate(fee.paidDate)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Student Info Card */}
        <View className="mb-4 rounded-xl bg-white border border-gray-100">
          <View className="p-4">
            <Text className="text-base font-bold text-gray-800 mb-3">Thông tin học sinh</Text>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Họ và tên:</Text>
              <Text className="text-sm text-gray-800 font-semibold">Nguyễn Hoàng B</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Lớp:</Text>
              <Text className="text-sm text-gray-800 font-semibold">10A</Text>
            </View>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-500 font-medium">Năm học:</Text>
              <Text className="text-sm text-gray-800 font-semibold">2025-2026</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {fee.status !== 'paid' && (
          <>
            <TouchableOpacity
              onPress={() => {}}
              className="mb-3 bg-blue-600 rounded-xl overflow-hidden"
            >
              <View className="py-2 items-center justify-center">
                <Text className="text-base font-bold text-white">Thanh toán ngay</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              className="mb-3 border-2 border-blue-600 rounded-xl overflow-hidden"
            >
              <View className="py-2 items-center justify-center">
                <Text className="text-base font-semibold text-blue-600">
                  Chọn phương thức thanh toán
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {fee.status === 'paid' && (
          <TouchableOpacity
            onPress={() => {}}
            className="border-2 border-blue-600 rounded-xl overflow-hidden"
          >
            <View className="py-2 items-center justify-center flex-row gap-2">
              <Text className="text-base font-semibold text-blue-600">Xem biên lai</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}
