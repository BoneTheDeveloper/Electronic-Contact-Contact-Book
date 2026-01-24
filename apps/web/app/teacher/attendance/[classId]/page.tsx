import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getTeacherClasses, getTeacherClassDetail } from '@/lib/services/teacher-assignment-service'
import { AttendanceFormClient } from '@/components/teacher/AttendanceFormClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

interface PageProps {
  params: Promise<{ classId: string }>
}

export default async function ClassAttendancePage({ params }: PageProps) {
  const user = await requireAuth()
  const { classId } = await params

  const classes = await getTeacherClasses(user.id)
  const cls = classes.find((c) => c.id === classId)
  const classDetail = await getTeacherClassDetail(user.id, classId)

  if (!cls || !classDetail) {
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
            <h1 className="text-2xl font-bold text-gray-900">Điểm danh - {classDetail.class_name}</h1>
            {classDetail.is_homeroom && (
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                Lớp chủ nhiệm
              </span>
            )}
          </div>
          <p className="text-gray-500">
            Khối: {classDetail.grade} • Phòng: {classDetail.room}
            {classDetail.subjects_taught.length > 0 && (
              <span> • Môn: {classDetail.subjects_taught.map(s => s.subject_name).join(', ')}</span>
            )}
          </p>
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
              <p className="font-semibold text-gray-900">{classDetail.student_count} học sinh</p>
            </div>
            <div>
              <p className="text-gray-500">Khối</p>
              <p className="font-semibold text-gray-900">{classDetail.grade}</p>
            </div>
            <div>
              <p className="text-gray-500">Phòng học</p>
              <p className="font-semibold text-gray-900">{classDetail.room}</p>
            </div>
            <div>
              <p className="text-gray-500">Số môn dạy</p>
              <p className="font-semibold text-gray-900">{classDetail.subjects_taught.length} môn</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Form - Client Component */}
      <AttendanceFormClient
        classId={classId}
        className={classDetail.class_name}
        isHomeroom={classDetail.is_homeroom}
        subjects={classDetail.subjects_taught}
      />
    </div>
  )
}
