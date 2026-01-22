import { notFound } from 'next/navigation'
import { getTeacherClasses, getGradeEntrySheet } from '@/lib/supabase/queries'
import { GradeEntryForm } from '@/components/teacher/GradeEntryForm'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'

interface PageProps {
  params: Promise<{ classId: string }>
}

export default async function ClassGradesPage({ params }: PageProps) {
  const { classId } = await params
  const classes = await getTeacherClasses('current-teacher-id')
  const cls = classes.find(c => c.id === classId)
  const { students, subject } = await getGradeEntrySheet(classId)

  if (!cls) {
    notFound()
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Nhập điểm - {cls.name}</h1>
            {cls.isHomeroom && (
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full">
                Lớp chủ nhiệm
              </span>
            )}
          </div>
          <p className="text-gray-500">Môn: {subject} • {cls.studentCount} học sinh</p>
        </div>
      </div>

      {/* Grade Info Card - Remove this as it's now handled in the component */}

      {/* Grade Entry Form */}
      <GradeEntryForm students={students} subject={subject} classId={classId} />
    </div>
  )
}
