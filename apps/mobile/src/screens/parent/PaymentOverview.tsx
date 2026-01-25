/**
 * Payment Overview Screen
 * Fee summary and invoice list - Wireframe design
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useParentStore } from '../../stores';
import { Icon } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface PaymentOverviewProps {
  navigation?: ParentHomeStackNavigationProp;
}

interface Invoice {
  id: string;
  title: string;
  invoiceNumber: string;
  amount: number;
  paidAmount?: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'completed';
}

// Mock invoice data - Phiếu thu
const MOCK_INVOICES: Invoice[] = [
  {
    id: 'PT202501001',
    title: 'Học phí tháng 1/2025',
    invoiceNumber: 'PT202501001',
    amount: 1500000,
    dueDate: '25/01/2025',
    status: 'unpaid',
  },
  {
    id: 'PT202501002',
    title: 'Tiền ăn trưa',
    invoiceNumber: 'PT202501002',
    amount: 450000,
    paidAmount: 200000,
    dueDate: '25/01/2025',
    status: 'partial',
  },
  {
    id: 'PT202412005',
    title: 'Học phí tháng 12/2024',
    invoiceNumber: 'PT202412005',
    amount: 1500000,
    dueDate: '15/12/2024',
    status: 'completed',
    paidDate: '14/12/2024',
  },
];

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return 'HB';
  if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
  const first = (parts[0] || '').charAt(0);
  const last = (parts[parts.length - 1] || '').charAt(0);
  return `${first}${last}`.toUpperCase();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const STATUS_CONFIG = {
  unpaid: {
    label: 'Chưa thanh toán',
    bgColor: '#FEE2E2',
    textColor: '#EF4444',
    icon: 'credit-card',
    iconBg: '#FEE2E2',
    iconColor: '#EF4444',
  },
  partial: {
    label: 'Thanh toán một phần',
    bgColor: '#FFEDD5',
    textColor: '#F97316',
    icon: 'credit-card',
    iconBg: '#FFEDD5',
    iconColor: '#F97316',
  },
  completed: {
    label: 'Đã hoàn thành',
    bgColor: '#D1FAE5',
    textColor: '#22C55E',
    icon: 'check-circle',
    iconBg: '#D1FAE5',
    iconColor: '#22C55E',
  },
};

export const PaymentOverviewScreen: React.FC<PaymentOverviewProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
  const [filter, setFilter] = useState<'all' | 'unpaid'>('all');

  // Calculate total debt
  const totalDebt = useMemo(() => {
    return MOCK_INVOICES.reduce((sum, invoice) => {
      const remaining = invoice.paidAmount
        ? invoice.amount - invoice.paidAmount
        : invoice.status !== 'completed'
        ? invoice.amount
        : 0;
      return sum + remaining;
    }, 0);
  }, []);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    if (filter === 'unpaid') {
      return MOCK_INVOICES.filter(inv => inv.status !== 'completed');
    }
    return MOCK_INVOICES;
  }, [filter]);

  const renderInvoiceCard = (invoice: Invoice) => {
    const config = STATUS_CONFIG[invoice.status];

    return (
      <TouchableOpacity
        key={invoice.id}
        style={styles.invoiceCard}
        onPress={() => navigation?.navigate('PaymentDetail', { paymentId: invoice.id })}
        activeOpacity={0.7}
      >
        <View style={styles.invoiceHeader}>
          <View style={styles.invoiceHeaderLeft}>
            <View style={[styles.invoiceIcon, { backgroundColor: config.iconBg }]}>
              <Icon name={config.icon as any} size={24} color={config.iconColor} />
            </View>
            <View>
              <Text style={styles.invoiceTitle}>{invoice.title}</Text>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
            <Text style={[styles.statusText, { color: config.textColor }]}>
              {config.label}
            </Text>
          </View>
        </View>

        <View style={styles.invoiceFooter}>
          {invoice.status === 'partial' && invoice.paidAmount ? (
            <>
              <View>
                <Text style={styles.invoiceLabel}>Đã thanh toán</Text>
                <Text style={styles.invoiceAmountPaid}>
                  {formatCurrency(invoice.paidAmount)} / {formatCurrency(invoice.amount)} ₫
                </Text>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceLabel}>Còn lại</Text>
                <Text style={styles.invoiceRemaining}>
                  {formatCurrency(invoice.amount - invoice.paidAmount)} ₫
                </Text>
              </View>
            </>
          ) : (
            <>
              <View>
                <Text style={styles.invoiceLabel}>Số tiền</Text>
                <Text style={styles.invoiceAmount}>{formatCurrency(invoice.amount)} ₫</Text>
              </View>
              {invoice.status === 'unpaid' && (
                <View style={styles.invoiceRight}>
                  <Text style={styles.invoiceLabel}>Hạn thanh toán</Text>
                  <Text style={styles.invoiceDueDate}>{invoice.dueDate}</Text>
                </View>
              )}
              {invoice.status === 'completed' && (
                <View style={styles.invoiceRight}>
                  <Text style={styles.invoiceLabel}>Ngày thanh toán</Text>
                  <Text style={styles.invoicePaidDate}>{(invoice as any).paidDate}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {invoice.status === 'partial' && invoice.paidAmount && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(invoice.paidAmount / invoice.amount) * 100}%` },
              ]}
            />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.payButton,
            invoice.status === 'completed' && styles.viewReceiptButton,
          ]}
          onPress={() => navigation?.navigate('PaymentDetail', { paymentId: invoice.id })}
        >
          <Text style={[styles.payButtonText, invoice.status === 'completed' && styles.viewReceiptButtonText]}>
            {invoice.status === 'unpaid' && 'Đóng tiền ngay'}
            {invoice.status === 'partial' && 'Tiếp tục thanh toán'}
            {invoice.status === 'completed' && 'Xem biên lai'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Học phí</Text>
            <View style={styles.headerPlaceholder} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Debt Card */}
        <View style={styles.debtCard}>
          <View style={styles.debtHeader}>
            <View style={styles.debtIconContainer}>
              <Icon name="cash" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.debtLabel}>TỔNG DƯ NỢ</Text>
          </View>
          <Text style={styles.debtAmount}>{formatCurrency(totalDebt)} ₫</Text>
          <Text style={styles.debtNote}>Cần thanh toán trong tháng này</Text>
        </View>

        {/* Invoice List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Phiếu thu</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'unpaid' && styles.filterButtonActive]}
              onPress={() => setFilter('unpaid')}
            >
              <Text style={[styles.filterButtonText, filter === 'unpaid' && styles.filterButtonTextActive]}>
                Chưa đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invoice Cards */}
        {filteredInvoices.map(renderInvoiceCard)}
      </ScrollView>
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
    paddingBottom: 96,
  },
  studentCard: {
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
  studentAvatarContainer: {
    marginRight: 16,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#60A5FA',
  },
  studentAvatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  studentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentClass: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  studentSeparator: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  studentId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  debtCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  debtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  debtIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  debtAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  debtNote: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: '#EFF6FF',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterButtonTextActive: {
    color: '#0284C7',
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  invoiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceTitle: {
    fontSize: 14,
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
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginBottom: 16,
  },
  invoiceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  invoiceAmountPaid: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22C55E',
  },
  invoiceRemaining: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceDueDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  invoicePaidDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FB923C',
    borderRadius: 100,
  },
  payButton: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewReceiptButton: {
    backgroundColor: '#F1F5F9',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewReceiptButtonText: {
    color: '#64748B',
  },
});
