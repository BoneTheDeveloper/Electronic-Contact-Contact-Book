import { getUserById } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { Mail, Shield, Calendar, User } from 'lucide-react'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) {
    notFound()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700'
      case 'teacher':
        return 'bg-blue-100 text-blue-700'
      case 'parent':
        return 'bg-green-100 text-green-700'
      case 'student':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Chi tiết Người dùng</h1>
        <p className="text-slate-500 text-sm">
          Thông tin chi tiết và quản lý tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
              {getInitials(user.name)}
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{user.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-700">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Trạng thái</p>
                <p className="text-sm font-medium text-slate-700">
                  {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </p>
              </div>
            </div>
            {user.classId && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Lớp</p>
                  <p className="text-sm font-medium text-slate-700">{user.classId}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button className="w-full px-4 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1]">
              Chỉnh sửa
            </button>
            <button className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100">
              Khóa tài khoản
            </button>
          </div>
        </div>

        {/* Activity & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Hoạt động gần đây</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Đăng nhập vào hệ thống</p>
                  <p className="text-xs text-slate-400">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Cập nhật thông tin cá nhân</p>
                  <p className="text-xs text-slate-400">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Tài khoản được tạo</p>
                  <p className="text-xs text-slate-400">1 tuần trước</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Cài đặt quyền</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">Quyền xem báo cáo</p>
                  <p className="text-xs text-slate-400">Cho phép xem các báo cáo thống kê</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">Quyền quản lý người dùng</p>
                  <p className="text-xs text-slate-400">Cho phép thêm/sửa/xóa người dùng</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">Quyền gửi thông báo</p>
                  <p className="text-xs text-slate-400">Cho phép gửi thông báo hệ thống</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
