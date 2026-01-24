import { getTeacherClasses } from '@/lib/services/teacher-assignment-service'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AttendanceListPage() {
  const user = await requireAuth()
  const classes = await getTeacherClasses(user.id)

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Điểm danh</h1>
        <p className="text-gray-500">Chọn lớp để điểm danh</p>
      </div>

      {/* Classes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Link key={cls.id} href={`/teacher/attendance/${cls.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-sky-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{cls.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Khối: {cls.grade}
                      {cls.subjects && cls.subjects.length > 0 && (
                        <span> • Môn: {cls.subjects.join(', ')}</span>
                      )}
                    </p>
                  </div>
                  {cls.is_homeroom && (
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                      Chủ nhiệm
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{cls.student_count} học sinh</span>
                  </div>
                  {cls.schedule_days && cls.schedule_days.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Thứ {cls.schedule_days.sort().join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Phòng {cls.room}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Chưa có lớp được phân công</p>
        </div>
      )}
    </div>
  )
}
