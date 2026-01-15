import { NotificationManagement } from '@/components/admin/notifications/NotificationManagement'
import { Bell, Send } from 'lucide-react'

export default async function NotificationsPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Thông báo</h1>
          <p className="text-sm text-slate-500">
            Gửi và quản lý thông báo hệ thống
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#0369a1]">
          <Send className="h-4 w-4" />
          Thông báo mới
        </button>
      </div>

      {/* Notification Management */}
      <NotificationManagement />
    </div>
  )
}
