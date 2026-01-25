'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Users, Shield, UserCheck, Users2, MoreVertical } from 'lucide-react'
import { StatCard, DataTable, StatusBadge } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import type { User } from '@/lib/types'
import { AddUserModal, UserActionsModal, LinkParentModal, LinkStudentModal, ImportExcelModal } from './modals'

interface UserStats {
  total: number
  admin: number
  teachers: number
  parents: number
  students: number
}

interface ApiResponse<T> {
  success: boolean
  data: T[]
  total?: number
  stats?: Record<string, unknown>
}

interface UsersManagementProps {
  initialUsers: User[]
  initialStats: UserStats
  refreshTrigger?: number
  onAddUser?: () => void
  onImportExcel?: () => void
}

export function UsersManagement({
  initialUsers,
  initialStats,
  refreshTrigger: externalRefreshTrigger = 0,
  onAddUser,
  onImportExcel
}: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [stats, setStats] = useState<UserStats>(initialStats)
  const [loading, setLoading] = useState(false)
  const [internalRefreshTrigger, setInternalRefreshTrigger] = useState(0)

  // Combine external and internal refresh triggers
  useEffect(() => {
    if (externalRefreshTrigger > 0 && externalRefreshTrigger !== internalRefreshTrigger) {
      setInternalRefreshTrigger(externalRefreshTrigger)
      // Refetch data when external trigger changes
      const refetchUsers = async () => {
        setLoading(true)
        try {
          const response = await fetch('/api/users?')
          const result: ApiResponse<User> = await response.json()
          if (result.success) {
            setUsers(result.data)
            const newStats = {
              total: result.data.length,
              admin: result.data.filter((u: User) => u.role === 'admin').length,
              teachers: result.data.filter((u: User) => u.role === 'teacher').length,
              parents: result.data.filter((u: User) => u.role === 'parent').length,
              students: result.data.filter((u: User) => u.role === 'student').length,
            }
            setStats(newStats)
          }
        } catch (error) {
          console.error('Failed to refresh users:', error)
        } finally {
          setLoading(false)
        }
      }
      refetchUsers()
    }
  }, [externalRefreshTrigger, internalRefreshTrigger])

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [showLinkParentModal, setShowLinkParentModal] = useState(false)
  const [showLinkStudentModal, setShowLinkStudentModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock current user (would come from auth context)
  const currentUser = { role: 'admin' as const }

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    grade: '',
    class: '',
  })

  // Grade options (Khối)
  const gradeOptions = useMemo(() => [
    { value: '6', label: 'Khối 6' },
    { value: '7', label: 'Khối 7' },
    { value: '8', label: 'Khối 8' },
    { value: '9', label: 'Khối 9' },
  ], [])

  // Class options filtered by selected grade
  const classOptionsByGrade = useMemo(() => {
    const allClasses: Record<string, Array<{ value: string; label: string }>> = {
      '6': [
        { value: '6A', label: '6A' },
        { value: '6B', label: '6B' },
        { value: '6C', label: '6C' },
        { value: '6D', label: '6D' },
        { value: '6E', label: '6E' },
        { value: '6F', label: '6F' },
      ],
      '7': [
        { value: '7A', label: '7A' },
        { value: '7B', label: '7B' },
        { value: '7C', label: '7C' },
        { value: '7D', label: '7D' },
        { value: '7E', label: '7E' },
      ],
      '8': [
        { value: '8A', label: '8A' },
        { value: '8B', label: '8B' },
        { value: '8C', label: '8C' },
        { value: '8D', label: '8D' },
        { value: '8E', label: '8E' },
      ],
      '9': [
        { value: '9A', label: '9A' },
        { value: '9B', label: '9B' },
        { value: '9C', label: '9C' },
        { value: '9D', label: '9D' },
        { value: '9E', label: '9E' },
      ],
    }
    return filters.grade ? allClasses[filters.grade] || [] : []
  }, [filters.grade])

  // All class options (when no grade selected)
  const allClassOptions = useMemo(() => [
    { value: '6A', label: '6A' }, { value: '6B', label: '6B' }, { value: '6C', label: '6C' },
    { value: '6D', label: '6D' }, { value: '6E', label: '6E' }, { value: '6F', label: '6F' },
    { value: '7A', label: '7A' }, { value: '7B', label: '7B' }, { value: '7C', label: '7C' },
    { value: '7D', label: '7D' }, { value: '7E', label: '7E' },
    { value: '8A', label: '8A' }, { value: '8B', label: '8B' }, { value: '8C', label: '8C' },
    { value: '8D', label: '8D' }, { value: '8E', label: '8E' },
    { value: '9A', label: '9A' }, { value: '9B', label: '9B' }, { value: '9C', label: '9C' },
    { value: '9D', label: '9D' }, { value: '9E', label: '9E' },
  ], [])

  // Dynamic class filter options (filtered by grade if grade is selected, otherwise show all)
  const classFilterOptions = useMemo(() => {
    if (filters.grade) {
      return classOptionsByGrade
    }
    // All classes when no grade filter
    return allClassOptions
  }, [filters.grade, classOptionsByGrade, allClassOptions])

  // Refresh callback pattern
  const handleRefresh = useCallback(() => {
    setInternalRefreshTrigger(prev => prev + 1)
  }, [])

  // Use ref to track previous filter values
  const prevFiltersRef = useRef<string>('')

  // Fetch users from API - only when filters change, skip initial render
  useEffect(() => {
    const filterString = JSON.stringify(filters)

    // Skip initial fetch - we already have server data
    if (prevFiltersRef.current === '') {
      prevFiltersRef.current = filterString
      return
    }

    // Only fetch if filters actually changed
    if (filterString === prevFiltersRef.current) {
      return
    }

    prevFiltersRef.current = filterString

    const fetchUsers = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.role) params.append('role', filters.role)
      if (filters.status) params.append('status', filters.status)
      if (filters.class) params.append('classId', filters.class)

      try {
        const response = await fetch(`/api/users?${params}`)
        const result: ApiResponse<User> = await response.json()
        if (result.success) {
          let filteredUsers = result.data

          // Client-side filtering for grade (shows ONLY students in that grade)
          if (filters.grade) {
            filteredUsers = filteredUsers.filter((u: User) => {
              // Only students have classId - filter by grade
              return u.role === 'student' && u.classId && u.classId.startsWith(filters.grade)
            })
          }

          // If specific class is selected, filter by exact classId
          if (filters.class) {
            filteredUsers = filteredUsers.filter((u: User) => {
              return u.classId === filters.class
            })
          }

          setUsers(filteredUsers)
          // Update stats when data changes (based on filtered users)
          const newStats = {
            total: filteredUsers.length,
            admin: filteredUsers.filter((u: User) => u.role === 'admin').length,
            teachers: filteredUsers.filter((u: User) => u.role === 'teacher').length,
            parents: filteredUsers.filter((u: User) => u.role === 'parent').length,
            students: filteredUsers.filter((u: User) => u.role === 'student').length,
          }
          setStats(newStats)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filters, internalRefreshTrigger])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', role: '', status: '', grade: '', class: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Open user actions modal
  const handleUserActions = useCallback((user: User) => {
    setSelectedUser(user)
    setShowActionsModal(true)
  }, [])

  // Open link parent modal
  const handleLinkParent = useCallback((user: User) => {
    setSelectedUser(user)
    setShowLinkParentModal(true)
  }, [])

  // Open link student modal
  const handleLinkStudent = useCallback((user: User) => {
    setSelectedUser(user)
    setShowLinkStudentModal(true)
  }, [])

  // Handle add user
  const handleAddUserClick = useCallback(() => {
    if (onAddUser) {
      onAddUser()
    } else {
      setShowAddModal(true)
    }
  }, [onAddUser])

  // Handle import excel
  const handleImportExcelClick = useCallback(() => {
    if (onImportExcel) {
      onImportExcel()
    } else {
      setShowImportModal(true)
    }
  }, [onImportExcel])

  // Table columns - memoized
  const columns = useMemo<Column<User>[]>(() => [
    {
      key: 'name',
      label: 'Người dùng',
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#0284C7] to-[#0369a1] p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-[#0284C7]">
              {row.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400 truncate">{row.role === 'parent' ? (row.phone || row.email) : row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'code',
      label: 'Mã người dùng',
      render: (value) => value ? (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-mono font-bold">
          {value as React.ReactNode}
        </span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (value) => {
        const roleConfig: Record<string, { label: string; color: string }> = {
          admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
          teacher: { label: 'Giáo viên', color: 'bg-blue-100 text-blue-700' },
          parent: { label: 'Phụ huynh', color: 'bg-green-100 text-green-700' },
          student: { label: 'Học sinh', color: 'bg-orange-100 text-orange-700' },
        }
        // Safe type assertion with fallback
        const roleKey = String(value ?? '')
        const config = roleConfig[roleKey] ?? { label: roleKey || 'Unknown', color: 'bg-gray-100 text-gray-700' }
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${config.color}`}>
            <Shield className="h-3 w-3" />
            {config.label}
          </span>
        )
      },
    },
    {
      key: 'classId',
      label: 'Lớp / Đơn vị',
      render: (_value, row) => {
        const classInfo = row.classId
        if (!classInfo) {
          return <span className="text-xs text-slate-400">—</span>
        }
        // For students: show "Lớp X", for teachers: show their unit/class
        if (row.role === 'student') {
          return (
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Lớp {classInfo}
            </span>
          )
        }
        if (row.role === 'teacher') {
          return (
            <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {classInfo}
            </span>
          )
        }
        return (
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {classInfo}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value) => (
        <StatusBadge
          status={value === 'active' ? 'success' : 'warning'}
          label={value === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_value, row) => (
        <button
          onClick={() => handleUserActions(row)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Thao tác"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ),
    },
  ], [handleUserActions])

  // Static filter options - memoized
  const roleFilterOptions = useMemo(() => [
    { value: 'admin', label: 'Admin' },
    { value: 'teacher', label: 'Giáo viên' },
    { value: 'parent', label: 'Phụ huynh' },
    { value: 'student', label: 'Học sinh' },
  ], [])

  const statusFilterOptions = useMemo(() => [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
  ], [])

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Tổng người dùng"
          value={stats.total}
          trend={3.2}
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Admin"
          value={stats.admin}
          icon={<Shield className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          title="Giáo viên"
          value={stats.teachers}
          icon={<UserCheck className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Phụ huynh"
          value={stats.parents}
          trend={1.8}
          icon={<Users2 className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Học sinh"
          value={stats.students}
          trend={2.5}
          icon={<Users className="h-5 w-5" />}
          color="orange"
        />
      </div>

      {/* Filters - Buttons removed from here, now in page header */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bộ lọc:</span>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">Tất cả vai trò</option>
            {roleFilterOptions.map((opt: { value: string; label: string }) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            {statusFilterOptions.map((opt: { value: string; label: string }) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Grade Filter (Khối) */}
          <select
            value={filters.grade}
            onChange={(e) => {
              const newGrade = e.target.value
              handleFilterChange('grade', newGrade)
              // Reset class filter if current class is not in the new grade
              if (filters.class && newGrade && !filters.class.startsWith(newGrade)) {
                handleFilterChange('class', '')
              }
            }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">Tất cả khối</option>
            {gradeOptions.map((opt: { value: string; label: string }) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Class Filter (Lớp) - shows all classes or filtered by grade */}
          <select
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option value="">{filters.grade ? 'Tất cả lớp' : 'Tất cả lớp'}</option>
            {classFilterOptions.map((opt: { value: string; label: string }) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Active Filters Display */}
        {(filters.role || filters.status || filters.grade || filters.class) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.role && (
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2">
                {roleFilterOptions.find(o => o.value === filters.role)?.label}
                <button onClick={() => handleFilterChange('role', '')} className="hover:text-blue-800">×</button>
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2">
                {statusFilterOptions.find(o => o.value === filters.status)?.label}
                <button onClick={() => handleFilterChange('status', '')} className="hover:text-blue-800">×</button>
              </span>
            )}
            {filters.grade && (
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold flex items-center gap-2">
                {gradeOptions.find(o => o.value === filters.grade)?.label}
                <button onClick={() => {
                  handleFilterChange('grade', '')
                  handleFilterChange('class', '')
                }} className="hover:text-purple-800">×</button>
              </span>
            )}
            {filters.class && (
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2">
                {classFilterOptions.find(o => o.value === filters.class)?.label}
                <button onClick={() => handleFilterChange('class', '')} className="hover:text-blue-800">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          emptyMessage="Không tìm thấy người dùng"
        />
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRefresh}
      />

      {selectedUser && (
        <>
          <UserActionsModal
            isOpen={showActionsModal}
            onClose={() => {
              setShowActionsModal(false)
              setSelectedUser(null)
            }}
            onSuccess={handleRefresh}
            onLinkParent={() => {
              setShowActionsModal(false)
              setShowLinkParentModal(true)
            }}
            onLinkStudent={() => {
              setShowActionsModal(false)
              setShowLinkStudentModal(true)
            }}
            user={{
              id: selectedUser.id,
              code: selectedUser.code,
              name: selectedUser.name,
              role: selectedUser.role,
              status: selectedUser.status,
              email: selectedUser.email,
              phone: selectedUser.phone,
            }}
            currentUser={currentUser}
          />

          <LinkParentModal
            isOpen={showLinkParentModal}
            onClose={() => {
              setShowLinkParentModal(false)
              setSelectedUser(null)
            }}
            onSuccess={handleRefresh}
            student={{
              id: selectedUser.id,
              name: selectedUser.name,
              code: selectedUser.id, // Using ID as code for now
            }}
          />

          <LinkStudentModal
            isOpen={showLinkStudentModal}
            onClose={() => {
              setShowLinkStudentModal(false)
              setSelectedUser(null)
            }}
            onSuccess={handleRefresh}
            parent={{
              id: selectedUser.id,
              name: selectedUser.name,
              code: selectedUser.id, // Using ID as code for now
            }}
          />
        </>
      )}

      <ImportExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleRefresh}
        importType="students"
      />
    </div>
  )
}
