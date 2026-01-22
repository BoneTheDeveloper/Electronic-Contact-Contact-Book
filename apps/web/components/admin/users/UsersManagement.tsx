'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Users, Shield, UserCheck, Users2, Plus, Upload, MoreVertical } from 'lucide-react'
import { StatCard, DataTable, StatusBadge, FilterBar, PrimaryButton } from '@/components/admin/shared'
import type { Column } from '@/components/admin/shared'
import type { User } from '@/lib/mock-data'
import { AddUserModal, UserActionsModal, LinkParentModal, ImportExcelModal } from './modals'

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
  stats?: any
}

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [showLinkParentModal, setShowLinkParentModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock current user (would come from auth context)
  const currentUser = { role: 'admin' as const }

  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    class: '',
  })

  // Refresh callback pattern
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // Use ref to track previous filter values
  const prevFiltersRef = useRef<string>('')

  // Fetch users from API
  useEffect(() => {
    const filterString = JSON.stringify(filters)

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
          setUsers(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [filters, refreshTrigger])

  // Calculate statistics - memoized
  const stats = useMemo((): UserStats => {
    return {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      parents: users.filter(u => u.role === 'parent').length,
      students: users.filter(u => u.role === 'student').length,
    }
  }, [users])

  // Get unique classes - memoized
  const classOptions = useMemo(() => {
    return users
      .map(u => u.classId)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(c => ({ value: c as string, label: `Lớp ${c}` }))
  }, [users])

  // Clear filters - memoized
  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', role: '', status: '', class: '' })
  }, [])

  // Handle filter change - memoized
  const handleFilterChange = useCallback((key: string, value: any) => {
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
          <div>
            <p className="text-sm font-bold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
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
        const config = roleConfig[value ?? ''] ?? { label: value ?? 'Unknown', color: 'bg-gray-100 text-gray-700' }
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
      render: (value) => value ? (
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Lớp {value}
        </span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
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
      key: 'lastLogin',
      label: 'Đăng nhập cuối',
      render: () => <span className="text-xs text-slate-500">2 giờ trước</span>,
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

  // Memoize filters array for FilterBar
  const filterBarFilters = useMemo(() => [
    {
      key: 'role',
      label: 'Vai trò',
      type: 'select' as const,
      options: roleFilterOptions,
    },
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
  ], [classOptions, roleFilterOptions, statusFilterOptions])

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <PrimaryButton
          onClick={() => setShowImportModal(true)}
          size="small"
          className="!bg-white !text-[#0284C7] border-2 border-[#0284C7] hover:!bg-slate-50"
        >
          <Upload className="mr-2 h-4 w-4" />
          Nhập Excel
        </PrimaryButton>
        <PrimaryButton
          onClick={() => setShowAddModal(true)}
          size="small"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </PrimaryButton>
      </div>

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

      {/* Filters */}
      <FilterBar
        searchKey="search"
        searchPlaceholder="Tìm kiếm người dùng..."
        filters={filterBarFilters}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

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
            user={{
              id: selectedUser.id,
              name: selectedUser.name,
              role: selectedUser.role,
              status: selectedUser.status,
              email: selectedUser.email,
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
