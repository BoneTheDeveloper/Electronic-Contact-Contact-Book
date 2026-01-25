import { AttendanceManagement } from '@/components/admin/attendance/AttendanceManagement'
import { Download } from 'lucide-react'

export default async function AttendancePage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Chuyên cần</h1>
          <p className="text-sm text-slate-500">
            Theo dõi và quản lý điểm danh học sinh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Attendance Management */}
      <AttendanceManagement />
    </div>
  )
}
