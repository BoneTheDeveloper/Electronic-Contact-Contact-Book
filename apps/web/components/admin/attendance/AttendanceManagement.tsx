'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { XCircle, Clock } from 'lucide-react'
import { StatCard, DataTable, StatusBadge, FilterBar } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

interface AttendanceRecord extends Record<string, unknown> {
  id: string
  studentCode: string
  studentName: string
  classId: string
  date: string
  status: 'absent' | 'late' | 'excused'
  notes?: string
}

interface AttendanceStats {
  total: number
  absent: number
  late: number
  excused: number
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
    absent: 0,
    late: 0,
    excused: 0,
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
      if (filters.dateRange) {
        const [startDate, endDate] = filters.dateRange.split('..')
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
      }

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
    const classes = new Set(attendance.map((a: AttendanceRecord) => a.classId))
    return Array.from(classes).map((c: string) => ({ value: c, label: `Lớp ${c}` }))
  }, [attendance])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', class: '', status: '', dateRange: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: string | number | string[]) => {
    setFilters(prev => ({ ...prev, [key]: String(value) }))
  }, [])

  // Status configuration - memoized (only showing late, absent, excused)
  const statusConfig = useMemo(() => ({
    absent: { label: 'Vắng mặt', color: 'error' as const, icon: XCircle },
    late: { label: 'Đi muộn', color: 'warning' as const, icon: Clock },
    excused: { label: 'Có phép', color: 'info' as const, icon: Clock },
  }), [])

  // Status filter options - memoized (only showing late, absent, excused)
  const statusFilterOptions = useMemo(() => [
    { value: 'absent', label: 'Vắng mặt' },
    { value: 'late', label: 'Đi muộn' },
    { value: 'excused', label: 'Có phép' },
  ], [])

  // Memoize filters array for FilterBar
  const filterBarFilters = useMemo(() => [
    {
      key: 'dateRange',
      label: 'Khoảng ngày',
      type: 'dateRange' as const,
    },
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
            {row.studentName.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{row.studentName}</p>
            <p className="text-xs text-slate-400">Mã HS: {row.studentCode}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'classId',
      label: 'Lớp',
      render: (value) => (
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {value as React.ReactNode}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Ngày điểm danh',
      render: (value) => (
        <span className="text-sm text-slate-600">{value as React.ReactNode}</span>
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
        <span className="text-xs text-slate-500">{value as React.ReactNode}</span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
    },
  ], [statusConfig])

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Only showing issues: Vắng mặt, Đi muộn, Có phép */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <StatCard
          title="Có phép"
          value={stats.excused}
          icon={<Clock className="h-5 w-5" />}
          color="blue"
        />
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
