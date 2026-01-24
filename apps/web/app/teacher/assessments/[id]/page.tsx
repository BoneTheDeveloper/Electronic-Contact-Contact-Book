import { notFound } from 'next/navigation'
import { getAssessments } from '@/lib/supabase/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Assessment } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AssessmentDetailPage({ params }: PageProps) {
  const { id } = await params
  // TODO: Get real teacher ID from auth
  const assessments = await getAssessments('current-teacher-id') as Assessment[]
  const assessment = assessments.find((a: Assessment) => a.id === id)

  if (!assessment) {
    notFound()
  }

  return (
    <div className="space-y-6 p-8">
      {/* Back Button */}
      <Link href="/teacher/assessments">
        <Button variant="ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </Link>

      {/* Assessment Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{assessment.name}</h1>
            <Badge variant={assessment.status === 'published' ? 'success' : 'secondary'}>
              {assessment.status === 'published' ? 'Đã xuất bản' : assessment.status === 'graded' ? 'Đã chấm' : 'Nháp'}
            </Badge>
          </div>
          <p className="text-gray-500">
            {assessment.className} • {assessment.subject}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Assessment Details */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Ngày thi</p>
              <p className="font-semibold">{new Date(assessment.date).toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm tối đa</p>
              <p className="font-semibold">{assessment.maxScore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loại</p>
              <p className="font-semibold">
                {assessment.type === 'quiz' ? '15 phút' : assessment.type === 'midterm' ? 'Giữa kỳ' : assessment.type === 'final' ? 'Cuối kỳ' : 'Miệng'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Tiến độ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Đã nộp</p>
              <p className="font-semibold">{assessment.submittedCount}/{assessment.totalCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tỷ lệ</p>
              <p className="font-semibold">
                {Math.round((assessment.submittedCount / assessment.totalCount) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chưa nộp</p>
              <p className="font-semibold text-amber-600">{assessment.totalCount - assessment.submittedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Hành động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Xem danh sách nộp</Button>
            <Button variant="outline" className="w-full">Nhập điểm</Button>
            <Button variant="outline" className="w-full">Xuất báo cáo</Button>
          </CardContent>
        </Card>
      </div>

      {/* Students List Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Tính năng đang phát triển...</p>
        </CardContent>
      </Card>
    </div>
  )
}
