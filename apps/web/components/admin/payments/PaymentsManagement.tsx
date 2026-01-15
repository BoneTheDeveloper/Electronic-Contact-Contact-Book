'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { DollarSign, TrendingUp, AlertCircle, FileText } from 'lucide-react'
import { StatCard, DataTable, StatusBadge, FilterBar } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

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
      render: () => (
        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <FileText className="h-4 w-4" />
        </button>
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
          <span className="text-sm text-slate-500">
            {invoices.length} hóa đơn
          </span>
        </div>
        <DataTable
          data={invoices}
          columns={columns}
          loading={loading}
          emptyMessage="Không tìm thấy hóa đơn"
        />
      </div>
    </div>
  )
}
