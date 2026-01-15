import { notFound } from 'next/navigation'
import { getTeacherClasses, getGradeEntrySheet } from '@/lib/mock-data'
import { GradeEntryForm } from '@/components/teacher/GradeEntryForm'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'

interface PageProps {
  params: Promise<{ classId: string }>
}

export default async function ClassGradesPage({ params }: PageProps) {
  const { classId } = await params
  const classes = await getTeacherClasses()
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

      {/* Grade Info Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">Hướng dẫn nhập điểm</h4>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Nhập điểm từ 0 đến 10 cho từng cột điểm</li>
                <li>• Điểm miệng và điểm 15 phút có thể nhập nhiều lần</li>
                <li>• Điểm trùng 0 sẽ được coi là chưa có điểm</li>
                <li>• Hệ số: Miệng (1), 15 phút (2), Giữa kỳ (3), Cuối kỳ (4)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Form */}
      <GradeEntryForm students={students} subject={subject} classId={classId} />
    </div>
  )
}
