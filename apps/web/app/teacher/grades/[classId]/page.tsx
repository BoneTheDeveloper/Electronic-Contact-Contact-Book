import { notFound } from 'next/navigation'
import { GradeEntryFormClient } from '@/components/teacher/GradeEntryFormClient'
import { Card } from '@/components/ui/card'

interface PageProps {
  params: Promise<{ classId: string }>
  searchParams: Promise<{ subjectId?: string }>
}

export default async function ClassGradesPage({ params, searchParams }: PageProps) {
  // TODO: Get real teacher ID from auth
  const teacherId = 'current-teacher-id'
  const { classId } = await params
  const { subjectId } = await searchParams

  if (!subjectId) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center text-red-500">
          Thiếu mã môn học. Vui lòng chọn môn học từ trang danh sách.
        </Card>
      </div>
    )
  }

  // Get teacher's classes from the service
  const { getTeacherClassesForGrades } = await import('@/lib/services/teacher-assignment-service')
  const classes = await getTeacherClassesForGrades(teacherId)

  // Find the specific class
  const cls = classes.find((c: any) => c.class_id === classId && c.subject_id === subjectId)

  if (!cls) {
    notFound()
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Nhập điểm - {cls.class_name}</h1>
          {cls.is_homeroom && (
            <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
              Lớp chủ nhiệm
            </span>
          )}
        </div>
        <p className="text-gray-500">Môn: {cls.subject_name} • {cls.student_count} học sinh</p>
      </div>

      {/* Grade Entry Form */}
      <GradeEntryFormClient
        classId={classId}
        className={cls?.class_name || cls?.name || classId}
        subjectId={subjectId}
        subjectName={cls?.subject_name || subjectId}
        schoolYear="2024-2025"
        semester="2"
      />
    </div>
  )
}
