import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function GradesListPage() {
  // TODO: Get real teacher ID from auth
  const teacherId = 'current-teacher-id'

  // Get teacher's classes for grade entry from the service
  const { getTeacherClassesForGrades } = await import('@/lib/services/teacher-assignment-service')
  const classes = await getTeacherClassesForGrades(teacherId)

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nhập điểm số</h1>
        <p className="text-gray-500">Chọn lớp để nhập và quản lý điểm</p>
      </div>

      {/* Classes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls: any) => (
          <Link key={`${cls.class_id}-${cls.subject_id}`} href={`/teacher/grades/${cls.class_id}?subjectId=${cls.subject_id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{cls.class_name || cls.name}</CardTitle>
                    <p className="text-sm text-gray-600">Môn: {cls.subject_name}</p>
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Thang điểm 10</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Điểm trung bình: 7.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {classes.length === 0 && (
        <Card className="p-12 text-center text-gray-500">
          Chưa có lớp học nào được phân công
        </Card>
      )}
    </div>
  )
}
