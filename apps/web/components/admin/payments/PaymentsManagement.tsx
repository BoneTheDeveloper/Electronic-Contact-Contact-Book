'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { DollarSign, TrendingUp, AlertCircle, FileText, Plus, Download } from 'lucide-react'
import { StatCard, DataTable, StatusBadge, FilterBar } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import { FeeItemsTable } from './FeeItemsTable'
import { FeeAssignmentWizard } from './FeeAssignmentWizard'
import { QuickAccessCard } from './QuickAccessCard'
import { AddFeeItemModal } from './modals/AddFeeItemModal'
import { EditFeeItemModal } from './modals/EditFeeItemModal'
import { PaymentConfirmModal } from './modals/PaymentConfirmModal'
import { InvoiceDetailModal } from './modals/InvoiceDetailModal'
import { SendReminderModal } from './modals/SendReminderModal'
import { ExportReportModal } from './modals/ExportReportModal'

interface Invoice {
  id: string
  studentId: string
  studentName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
}

interface PaymentStats {
  totalAmount: number
  collectedAmount: number
  pendingCount: number
  overdueCount: number
  collectionRate: number
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  stats?: PaymentStats
  total?: number
}

interface FeeItem {
  id: string
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

export function PaymentsManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalAmount: 0,
    collectedAmount: 0,
    pendingCount: 0,
    overdueCount: 0,
    collectionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    class: '',
  })
  const [activeTab, setActiveTab] = useState<'fees' | 'assignment' | 'invoices'>('fees')
  const [refreshKey, setRefreshKey] = useState(0)

  // Modal states
  const [addFeeItemModalOpen, setAddFeeItemModalOpen] = useState(false)
  const [editFeeItemModalOpen, setEditFeeItemModalOpen] = useState(false)
  const [selectedFeeItem, setSelectedFeeItem] = useState<FeeItem | null>(null)
  const [paymentConfirmModalOpen, setPaymentConfirmModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [sendReminderModalOpen, setSendReminderModalOpen] = useState(false)
  const [exportReportModalOpen, setExportReportModalOpen] = useState(false)

  // Current user (mock - should come from auth context)
  const currentUser = { role: 'admin', id: 'admin@school.edu', name: 'Admin User' }

  // Use ref to track previous filter values
  const prevFiltersRef = useRef<string>('')

  // Fetch invoices from API
  useEffect(() => {
    const filterString = JSON.stringify(filters)

    // Only fetch if filters actually changed
    if (filterString === prevFiltersRef.current) {
      return
    }

    prevFiltersRef.current = filterString

    const fetchInvoices = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)

      try {
        const response = await fetch(`/api/payments?${params}`)
        const result: ApiResponse<Invoice> = await response.json()
        if (result.success) {
          setInvoices(result.data)
          if (result.stats) {
            setStats(result.stats)
          }
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [filters])

  // Get unique classes from student names (simplified) - memoized
  const classOptions = useMemo(() => [
    { value: '10A1', label: 'Lớp 10A1' },
    { value: '10A2', label: 'Lớp 10A2' },
    { value: '10A3', label: 'Lớp 10A3' },
  ], [])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', status: '', class: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Format currency function - memoized
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }, [])

  // Table columns - memoized
  const columns = useMemo<Column<Invoice>[]>(() => [
    {
      key: 'studentName',
      label: 'Học sinh',
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369a1] text-xs font-bold text-white">
            {row.studentName.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{row.studentName}</p>
            <p className="text-xs text-slate-400">Mã HS: {row.studentId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Số tiền',
      render: (value) => (
        <span className="text-sm font-bold text-slate-800">
          {formatCurrency(value)} đ
        </span>
      ),
    },
    {
      key: 'dueDate',
      label: 'Hạn thanh toán',
      render: (value) => (
        <span className="text-sm text-slate-600">{value}</span>
      ),
    },
    {
      key: 'paidDate',
      label: 'Ngày thanh toán',
      render: (value) => value ? (
        <span className="text-sm text-slate-600">{value}</span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const statusConfig = {
          paid: { label: 'Đã thanh toán', status: 'success' as const },
          pending: { label: 'Chờ thanh toán', status: 'warning' as const },
          overdue: { label: 'Quá hạn', status: 'error' as const },
        }
        const config = statusConfig[value as keyof typeof statusConfig]
        return <StatusBadge status={config.status} label={config.label} />
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_value, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedInvoiceId(row.id)
              setInvoiceDetailModalOpen(true)
            }}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="Xem chi tiết"
          >
            <FileText className="h-4 w-4" />
          </button>
          {row.status !== 'paid' && (
            <button
              onClick={() => {
                setSelectedInvoice(row)
                setPaymentConfirmModalOpen(true)
              }}
              className="rounded-lg p-2 text-green-500 transition-colors hover:bg-green-50 hover:text-green-600"
              title="Xác nhận thanh toán"
            >
              <DollarSign className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ], [formatCurrency])

  // Status filter options - memoized
  const statusFilterOptions = useMemo(() => [
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'overdue', label: 'Quá hạn' },
  ], [])

  // Memoize filters array for FilterBar
  const filterBarFilters = useMemo(() => [
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: statusFilterOptions,
    },
    {
      key: 'class',
      label: 'Lớp',
      type: 'select' as const,
      options: classOptions,
    },
  ], [classOptions, statusFilterOptions])

  return (
    <div className="space-y-6">
      {/* Quick Access to Invoice Tracker */}
      <QuickAccessCard />

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'fees'
              ? 'bg-white text-[#0284C7] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Danh mục Khoản thu
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'assignment'
              ? 'bg-white text-[#0284C7] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Thiết lập Đợt thu
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'invoices'
              ? 'bg-white text-[#0284C7] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Theo dõi Hóa đơn
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'fees' && (
        <div>
          {/* Section Header */}
          <div className="mb-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                  <FileText className="w-6 h-6 text-[#0284C7]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Quản lý Danh mục Khoản thu</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Fee Item Library</p>
                </div>
              </div>
              <button
                onClick={() => setAddFeeItemModalOpen(true)}
                className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
              >
                <Plus className="w-4 h-4" />
                Thêm khoản thu mới
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-4 py-2 outline-none">
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-4 py-2 outline-none">
              <option value="all">Tất cả học kỳ</option>
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
            </select>
          </div>
          <FeeItemsTable key={refreshKey} />
        </div>
      )}

      {activeTab === 'assignment' && (
        <div>
          {/* Section Header */}
          <div className="mb-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Thiết lập Đợt thu và Áp dụng</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Fee Assignment - Tạo phiếu thu hàng loạt</p>
              </div>
            </div>
          </div>
          <FeeAssignmentWizard onComplete={() => setRefreshKey(k => k + 1)} />
        </div>
      )}

      {activeTab === 'invoices' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title="Tổng học phí"
              value={`${formatCurrency(stats.totalAmount)} đ`}
              icon={<DollarSign className="h-5 w-5" />}
              color="blue"
            />
            <StatCard
              title="Đã thu"
              value={`${formatCurrency(stats.collectedAmount)} đ`}
              trend={stats.collectionRate}
              icon={<TrendingUp className="h-5 w-5" />}
              color="green"
            />
            <StatCard
              title="Chờ thu"
              value={stats.pendingCount}
              icon={<AlertCircle className="h-5 w-5" />}
              color="orange"
            />
            <StatCard
              title="Quá hạn"
              value={stats.overdueCount}
              icon={<AlertCircle className="h-5 w-5" />}
              color="red"
            />
          </div>

          {/* Collection Rate */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Tỷ lệ thu học phí</h3>
              <span className="text-3xl font-black text-[#0284C7]">{stats.collectionRate}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-[#0284C7] to-[#0369a1] transition-all duration-500"
                style={{ width: `${stats.collectionRate}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {formatCurrency(stats.collectedAmount)} đ / {formatCurrency(stats.totalAmount)} đ
            </div>
          </div>

          {/* Filters */}
          <FilterBar
            searchKey="search"
            searchPlaceholder="Tìm kiếm học sinh hoặc mã hóa đơn..."
            filters={filterBarFilters}
            values={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          {/* Invoice Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Theo dõi Học phí</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {invoices.length} hóa đơn
                </span>
                <button
                  onClick={() => setExportReportModalOpen(true)}
                  className="px-4 py-2 bg-[#0284C7] text-white rounded-lg font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2 transition-all"
                  title="Xuất báo cáo"
                >
                  <Download className="w-4 h-4" />
                  Xuất báo cáo
                </button>
              </div>
            </div>
            <DataTable
              data={invoices}
              columns={columns}
              loading={loading}
              emptyMessage="Không tìm thấy hóa đơn"
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <AddFeeItemModal
        isOpen={addFeeItemModalOpen}
        onClose={() => setAddFeeItemModalOpen(false)}
        onSuccess={() => {
          setAddFeeItemModalOpen(false)
          setRefreshKey(k => k + 1)
        }}
      />

      {selectedFeeItem && (
        <EditFeeItemModal
          isOpen={editFeeItemModalOpen}
          onClose={() => {
            setEditFeeItemModalOpen(false)
            setSelectedFeeItem(null)
          }}
          onSuccess={() => {
            setEditFeeItemModalOpen(false)
            setSelectedFeeItem(null)
            setRefreshKey(k => k + 1)
          }}
          feeItem={selectedFeeItem}
        />
      )}

      {selectedInvoice && (
        <PaymentConfirmModal
          isOpen={paymentConfirmModalOpen}
          onClose={() => {
            setPaymentConfirmModalOpen(false)
            setSelectedInvoice(null)
          }}
          onSuccess={() => {
            setPaymentConfirmModalOpen(false)
            setSelectedInvoice(null)
            setRefreshKey(k => k + 1)
          }}
          invoice={selectedInvoice}
          currentUser={currentUser}
        />
      )}

      <InvoiceDetailModal
        isOpen={invoiceDetailModalOpen}
        onClose={() => {
          setInvoiceDetailModalOpen(false)
          setSelectedInvoiceId('')
        }}
        invoiceId={selectedInvoiceId}
      />

      <SendReminderModal
        isOpen={sendReminderModalOpen}
        onClose={() => setSendReminderModalOpen(false)}
        onSuccess={() => {
          setSendReminderModalOpen(false)
          setRefreshKey(k => k + 1)
        }}
        recipients={invoices
          .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
          .map(inv => ({
            studentName: inv.studentName,
            parentEmail: `parent_${inv.studentId}@example.com`,
            parentPhone: '09xxxxxxxx',
            amount: inv.amount,
            dueDate: inv.dueDate,
          }))}
        currentUser={currentUser}
      />

      <ExportReportModal
        isOpen={exportReportModalOpen}
        onClose={() => setExportReportModalOpen(false)}
        onSuccess={() => {
          setExportReportModalOpen(false)
        }}
      />
    </div>
  )
}
