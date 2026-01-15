import { getClassById, getStudentsByClass } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { StudentTable } from '@/components/admin/StudentTable'
import { Users, MapPin, GraduationCap, Mail } from 'lucide-react'

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const classData = await getClassById(id)

  if (!classData) {
    notFound()
  }

  const students = await getStudentsByClass(id)

  return (
    <div className="space-y-8 p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {classData.name} - Danh sách học sinh
          </h1>
          <p className="text-slate-500 text-sm">
            Giáo viên: {classData.teacher} • Phòng: {classData.room}
          </p>
        </div>
        <button className="px-5 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1]">
          Thêm học sinh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Class Info Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">{classData.name}</h2>
              <p className="text-xs text-slate-400">Khối {classData.grade}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Sĩ số</p>
                <p className="text-sm font-bold text-slate-800">{classData.studentCount} học sinh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Phòng học</p>
                <p className="text-sm font-bold text-slate-800">{classData.room}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">GVCN</p>
                <p className="text-sm font-bold text-slate-800">{classData.teacher}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <button className="w-full px-4 py-2.5 bg-[#0284C7] text-white rounded-xl font-bold text-sm hover:bg-[#0369a1]">
              Chỉnh sửa lớp
            </button>
            <button className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200">
              Điểm danh nhanh
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="lg:col-span-3">
          <StudentTable students={students} />
        </div>
      </div>
    </div>
  )
}
