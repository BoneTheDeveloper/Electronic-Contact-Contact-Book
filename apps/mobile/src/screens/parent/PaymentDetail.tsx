/**
 * Payment Detail Screen
 * Single invoice view
 */

import React from 'react'
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { getFeesByStudentId } from '../../mock-data'
import { colors } from '../../theme'
import { ScreenHeader } from '../../components/ui'
import { useParentStore } from '../../stores'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { ParentHomeStackParamList } from '../../navigation/types'

type PaymentDetailProps = NativeStackScreenProps<ParentHomeStackParamList, 'PaymentDetail'>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  feeCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feeCardInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feeTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  valueText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  studentCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  studentCardInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  studentCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  primaryButton: {
    marginBottom: 12,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondaryButton: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  receiptButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptButtonInner: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  receiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
})

export const PaymentDetailScreen: React.FC<PaymentDetailProps> = ({ route, navigation }) => {
  const { paymentId } = route.params
  const { children, selectedChildId } = useParentStore()

  // Use selected child or fall back to first child
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0]
  const studentId = selectedChild?.id || '2' // Fallback to '2' for mock data compatibility

  const fees = getFeesByStudentId(studentId)
  const fee = fees.find(f => f.id === paymentId)

  if (!fee) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chi tiết thanh toán" onBack={() => navigation?.goBack()} />
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
    <View style={styles.container}>
      <ScreenHeader
        title="Chi tiết thanh toán"
        onBack={() => navigation?.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Fee Card */}
        <View style={styles.feeCard}>
          <View style={styles.feeCardInner}>
            <View style={styles.rowContainer}>
              <Text style={styles.feeTypeText}>{FEE_TYPE_LABELS[fee.type]}</Text>
              <View
                style={[styles.statusBadge, { backgroundColor: config.bgColor }]}
              >
                <Text style={[styles.statusText, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>
            <Text style={styles.amountText}>
              {formatCurrency(fee.amount)}
            </Text>

            <View style={styles.divider} />

            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Mã khoản:</Text>
              <Text style={styles.valueText}>#{fee.id}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Ngày tạo:</Text>
              <Text style={styles.valueText}>01/01/2026</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Hạn chót:</Text>
              <Text style={styles.valueText}>{formatDate(fee.dueDate)}</Text>
            </View>
            {fee.paidDate && (
              <View style={styles.rowContainer}>
                <Text style={styles.labelText}>Ngày thanh toán:</Text>
                <Text style={styles.valueText}>
                  {formatDate(fee.paidDate)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Student Info Card */}
        <View style={styles.studentCard}>
          <View style={styles.studentCardInner}>
            <Text style={styles.studentCardTitle}>Thông tin học sinh</Text>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Họ và tên:</Text>
              <Text style={styles.valueText}>Nguyễn Hoàng B</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Lớp:</Text>
              <Text style={styles.valueText}>10A</Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.labelText}>Năm học:</Text>
              <Text style={styles.valueText}>2025-2026</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {fee.status !== 'paid' && (
          <>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.primaryButton}
            >
              <View style={styles.primaryButtonInner}>
                <Text style={styles.primaryButtonText}>Thanh toán ngay</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.secondaryButton}
            >
              <View style={styles.secondaryButtonInner}>
                <Text style={styles.secondaryButtonText}>
                  Chọn phương thức thanh toán
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {fee.status === 'paid' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('PaymentReceipt', { receiptId: fee.id })}
            style={styles.receiptButton}
          >
            <View style={styles.receiptButtonInner}>
              <Text style={styles.receiptButtonText}>Xem biên lai</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}
