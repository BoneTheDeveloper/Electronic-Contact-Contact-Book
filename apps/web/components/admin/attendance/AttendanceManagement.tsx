'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react'
import { StatCard, DataTable, StatusBadge, FilterBar } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

interface AttendanceRecord {
  id: string
  studentName: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  rate: number
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  stats?: AttendanceStats
  total?: number
}

export function AttendanceManagement() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
    dateRange: '',
  })

  // Use ref to track previous filter values
  const prevFiltersRef = useRef<string>('')

  // Fetch attendance from API
  useEffect(() => {
    const filterString = JSON.stringify(filters)

    // Only fetch if filters actually changed
    if (filterString === prevFiltersRef.current) {
      return
    }

    prevFiltersRef.current = filterString

    const fetchAttendance = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.class) params.append('classId', filters.class)
      if (filters.status) params.append('status', filters.status)

      try {
        const response = await fetch(`/api/attendance?${params}`)
        const result: ApiResponse<AttendanceRecord> = await response.json()
        if (result.success) {
          setAttendance(result.data)
          if (result.stats) {
            setStats(result.stats)
          }
        }
      } catch (error) {
        console.error('Failed to fetch attendance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [filters])

  // Get unique classes - memoized
  const classOptions = useMemo(() => {
    const classes = new Set(attendance.map((a: any) => a.classId))
    return Array.from(classes).map((c: any) => ({ value: c, label: `Lớp ${c}` }))
  }, [attendance])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', class: '', status: '', dateRange: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Status configuration - memoized
  const statusConfig = useMemo(() => ({
    present: { label: 'Có mặt', color: 'success' as const, icon: CheckCircle },
    absent: { label: 'Vắng mặt', color: 'error' as const, icon: XCircle },
    late: { label: 'Đi muộn', color: 'warning' as const, icon: Clock },
    excused: { label: 'Có phép', color: 'info' as const, icon: Clock },
  }), [])

  // Status filter options - memoized
  const statusFilterOptions = useMemo(() => [
    { value: 'present', label: 'Có mặt' },
    { value: 'absent', label: 'Vắng mặt' },
    { value: 'late', label: 'Đi muộn' },
    { value: 'excused', label: 'Có phép' },
  ], [])

  // Memoize filters array for FilterBar
  const filterBarFilters = useMemo(() => [
    {
      key: 'class',
      label: 'Lớp',
      type: 'select' as const,
      options: classOptions,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select' as const,
      options: statusFilterOptions,
    },
  ], [classOptions, statusFilterOptions])

  // Table columns - memoized
  const columns = useMemo<Column<AttendanceRecord>[]>(() => [
    {
      key: 'studentName',
      label: 'Học sinh',
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369a1] text-xs font-bold text-white">
            {row.studentName.split(' ').slice(0, 2).map((n: any) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{row.studentName}</p>
            <p className="text-xs text-slate-400">Mã HS: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'classId',
      label: 'Lớp',
      render: (value) => (
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {value}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Ngày điểm danh',
      render: (value) => (
        <span className="text-sm text-slate-600">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => {
        const config = statusConfig[value as keyof typeof statusConfig]
        return (
          <StatusBadge
            status={config.color}
            label={config.label}
          />
        )
      },
    },
    {
      key: 'notes',
      label: 'Ghi chú',
      render: (value) => value ? (
        <span className="text-xs text-slate-500">{value}</span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
    },
  ], [statusConfig])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng học sinh"
          value={stats.total}
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Có mặt"
          value={stats.present}
          trend={stats.rate}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Vắng mặt"
          value={stats.absent}
          icon={<XCircle className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Đi muộn"
          value={stats.late}
          icon={<Clock className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Attendance Rate Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Tỷ lệ chuyên cần</h3>
          <span className="text-3xl font-black text-[#0284C7]">{stats.rate}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[#0284C7] to-[#0369a1] transition-all duration-500"
            style={{ width: `${stats.rate}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchKey="search"
        searchPlaceholder="Tìm kiếm học sinh..."
        filters={filterBarFilters}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DataTable
          data={attendance}
          columns={columns}
          loading={loading}
          emptyMessage="Không tìm thấy bản ghi điểm danh"
        />
      </div>
    </div>
  )
}
