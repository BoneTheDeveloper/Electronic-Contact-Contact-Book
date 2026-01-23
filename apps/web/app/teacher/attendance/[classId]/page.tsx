import { notFound } from 'next/navigation'
import { getClassStudents, getTeacherClasses } from '@/lib/supabase/queries'
import { AttendanceForm } from '@/components/teacher/AttendanceForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface PageProps {
  params: Promise<{ classId: string }>
}

export default async function ClassAttendancePage({ params }: PageProps) {
  const { classId } = await params
  const classes = await getTeacherClasses('current-teacher-id')
  const cls = classes.find(c => c.id === classId)
  const students = await getClassStudents(classId)

  if (!cls) {
    notFound()
  }

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Điểm danh - {cls.name}</h1>
            {cls.isHomeroom && (
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                Lớp chủ nhiệm
              </span>
            )}
          </div>
          <p className="text-gray-500">Môn: {cls.subject} • Phòng: {cls.room}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">{today}</span>
        </div>
      </div>

      {/* Class Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Sĩ số</p>
              <p className="font-semibold text-gray-900">{cls.studentCount} học sinh</p>
            </div>
            <div>
              <p className="text-gray-500">Lịch học</p>
              <p className="font-semibold text-gray-900">{cls.schedule}</p>
            </div>
            <div>
              <p className="text-gray-500">Phòng học</p>
              <p className="font-semibold text-gray-900">{cls.room}</p>
            </div>
            <div>
              <p className="text-gray-500">Vắng hôm nay</p>
              <p className="font-semibold text-red-600">
                {students.filter((s: any) => s.status !== 'present').length} học sinh
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Form */}
      <AttendanceForm students={students} classId={classId} />
    </div>
  )
}
