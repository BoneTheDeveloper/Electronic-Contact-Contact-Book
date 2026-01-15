'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { TrendingUp, Award, BarChart3 } from 'lucide-react'
import { StatCard, DataTable, FilterBar } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'

interface GradeRecord {
  id: string
  studentName: string
  classId: string
  subject: string
  midterm: number
  final: number
  average: number
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'F'
}

interface GradeStats {
  totalStudents: number
  averageScore: number
  gradeA: number
  gradeB: number
  gradeC: number
  gradeD: number
  gradeF: number
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  stats?: GradeStats
  total?: number
}

export function GradesManagement() {
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [stats, setStats] = useState<GradeStats>({
    totalStudents: 0,
    averageScore: 0,
    gradeA: 0,
    gradeB: 0,
    gradeC: 0,
    gradeD: 0,
    gradeF: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    subject: '',
    letterGrade: '',
  })

  // Use ref to track previous filter values
  const prevFiltersRef = useRef<string>('')

  // Fetch grades from API
  useEffect(() => {
    const filterString = JSON.stringify(filters)

    // Only fetch if filters actually changed
    if (filterString === prevFiltersRef.current) {
      return
    }

    prevFiltersRef.current = filterString

    const fetchGrades = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.class) params.append('classId', filters.class)
      if (filters.subject) params.append('subject', filters.subject)
      if (filters.letterGrade) params.append('letterGrade', filters.letterGrade)

      try {
        const response = await fetch(`/api/grades?${params}`)
        const result: ApiResponse<GradeRecord> = await response.json()
        if (result.success) {
          setGrades(result.data)
          if (result.stats) {
            setStats(result.stats)
          }
        }
      } catch (error) {
        console.error('Failed to fetch grades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [filters])

  // Get unique values - memoized
  const classOptions = useMemo(() => {
    const classes = new Set(grades.map(g => g.classId))
    return Array.from(classes).map(c => ({ value: c, label: `Lớp ${c}` }))
  }, [grades])

  const subjectOptions = useMemo(() => {
    const subjects = new Set(grades.map(g => g.subject))
    return Array.from(subjects).map(s => ({ value: s, label: s }))
  }, [grades])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', class: '', subject: '', letterGrade: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Grade letter badge function - memoized
  const getGradeBadge = useCallback((letterGrade: string) => {
    const config = {
      A: 'bg-green-100 text-green-700 border-green-200',
      B: 'bg-blue-100 text-blue-700 border-blue-200',
      C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      D: 'bg-orange-100 text-orange-700 border-orange-200',
      F: 'bg-red-100 text-red-700 border-red-200',
    }
    return (
      <span className={`inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-black ${config[letterGrade as keyof typeof config]}`}>
        {letterGrade}
      </span>
    )
  }, [])

  // Table columns - memoized
  const columns = useMemo<Column<GradeRecord>[]>(() => [
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
      key: 'subject',
      label: 'Môn học',
      render: (value) => (
        <span className="text-sm font-medium text-slate-700">{value}</span>
      ),
    },
    {
      key: 'midterm',
      label: 'Giữa kỳ',
      render: (value) => (
        <span className="rounded-lg bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'final',
      label: 'Cuối kỳ',
      render: (value) => (
        <span className="rounded-lg bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'average',
      label: 'Trung bình',
      render: (value) => (
        <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'letterGrade',
      label: 'Điểm chữ',
      render: (value) => getGradeBadge(value),
    },
  ], [getGradeBadge])

  // Grade distribution data - memoized
  const gradeDistribution = useMemo(() => [
    { label: 'A', count: stats.gradeA, percentage: stats.totalStudents > 0 ? (stats.gradeA / stats.totalStudents) * 100 : 0 },
    { label: 'B', count: stats.gradeB, percentage: stats.totalStudents > 0 ? (stats.gradeB / stats.totalStudents) * 100 : 0 },
    { label: 'C', count: stats.gradeC, percentage: stats.totalStudents > 0 ? (stats.gradeC / stats.totalStudents) * 100 : 0 },
    { label: 'D', count: stats.gradeD, percentage: stats.totalStudents > 0 ? (stats.gradeD / stats.totalStudents) * 100 : 0 },
    { label: 'F', count: stats.gradeF, percentage: stats.totalStudents > 0 ? (stats.gradeF / stats.totalStudents) * 100 : 0 },
  ], [stats])

  // Letter grade filter options - memoized
  const letterGradeOptions = useMemo(() => [
    { value: 'A', label: 'A (Xuất sắc)' },
    { value: 'B', label: 'B (Giỏi)' },
    { value: 'C', label: 'C (Khá)' },
    { value: 'D', label: 'D (Trung bình)' },
    { value: 'F', label: 'F (Kém)' },
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
      key: 'subject',
      label: 'Môn học',
      type: 'select' as const,
      options: subjectOptions,
    },
    {
      key: 'letterGrade',
      label: 'Điểm chữ',
      type: 'select' as const,
      options: letterGradeOptions,
    },
  ], [classOptions, letterGradeOptions, subjectOptions])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng học sinh"
          value={stats.totalStudents}
          icon={<Award className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Điểm trung bình"
          value={stats.averageScore.toFixed(1)}
          trend={2.5}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Điểm A"
          value={`${stats.gradeA} (${Math.round(stats.totalStudents > 0 ? (stats.gradeA / stats.totalStudents) * 100 : 0)}%)`}
          icon={<BarChart3 className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Grade Distribution */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Phân bố điểm số</h3>
        <div className="space-y-3">
          {gradeDistribution.map((grade) => (
            <div key={grade.label} className="flex items-center gap-4">
              <span className="w-8 text-center text-xs font-black text-slate-600">{grade.label}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    grade.label === 'A' ? 'bg-green-500' :
                    grade.label === 'B' ? 'bg-blue-500' :
                    grade.label === 'C' ? 'bg-yellow-500' :
                    grade.label === 'D' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${grade.percentage}%` }}
                />
              </div>
              <span className="w-20 text-right text-xs font-semibold text-slate-600">
                {grade.count} HS ({grade.percentage.toFixed(0)}%)
              </span>
            </div>
          ))}
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
          data={grades}
          columns={columns}
          loading={loading}
          emptyMessage="Không tìm thấy bản ghi điểm số"
        />
      </div>
    </div>
  )
}
