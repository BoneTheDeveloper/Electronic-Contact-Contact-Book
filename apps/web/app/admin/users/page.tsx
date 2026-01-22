import { UsersManagement } from '@/components/admin/users/UsersManagement'

export default async function UsersPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Người dùng</h1>
        <p className="text-sm text-slate-500">
          Quản lý tài khoản admin, giáo viên, phụ huynh và học sinh
        </p>
      </div>

      {/* User Management Component */}
      <UsersManagement />
    </div>
  )
}
