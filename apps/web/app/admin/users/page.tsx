'use client'

import { useState } from 'react'
import { UsersManagement } from '@/components/admin/users/UsersManagement'
import { Plus, Upload } from 'lucide-react'
import { AddUserModal, ImportExcelModal } from '@/components/admin/users/modals'

export default function UsersPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8 p-8">
      {/* Page Header with Actions */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Người dùng</h1>
          <p className="text-sm text-slate-500">
            Quản lý tài khoản admin, giáo viên, phụ huynh và học sinh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all"
          >
            <Upload className="h-4 w-4" />
            Nhập Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1] flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* User Management Component */}
      <UsersManagement key={refreshTrigger} />

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRefresh}
      />

      <ImportExcelModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleRefresh}
        importType="students"
      />
    </div>
  )
}
