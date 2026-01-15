import { UsersManagement } from '@/components/admin/users/UsersManagement'
import { Plus, Download } from 'lucide-react'

export default async function UsersPage() {
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
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Import Excel
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#0369a1]">
            <Plus className="h-4 w-4" strokeWidth={3} />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* User Management Component */}
      <UsersManagement />
    </div>
  )
}
