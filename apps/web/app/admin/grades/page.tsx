import { GradesManagement } from '@/components/admin/grades/GradesManagement'
import { Edit, Download } from 'lucide-react'

export default async function GradesPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Quản lý Điểm số</h1>
          <p className="text-sm text-slate-500">
            Nhập và quản lý điểm số học sinh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#0369a1]">
            <Edit className="h-4 w-4" />
            Nhập điểm
          </button>
        </div>
      </div>

      {/* Grades Management */}
      <GradesManagement />
    </div>
  )
}
