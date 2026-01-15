import { AcademicStructure } from '@/components/admin/classes/AcademicStructure'
import { Plus, School } from 'lucide-react'

export default async function ClassesPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Học thuật</h1>
          <p className="text-sm text-slate-500">
            Quản lý năm học, khối lớp và môn học
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <School className="h-4 w-4" />
            Import dữ liệu
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-5 py-2.5 font-bold text-sm text-white shadow-lg shadow-blue-100 transition-all hover:bg-[#0369a1]">
            <Plus className="h-4 w-4" strokeWidth={3} />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Academic Structure with Tabs */}
      <AcademicStructure />
    </div>
  )
}
