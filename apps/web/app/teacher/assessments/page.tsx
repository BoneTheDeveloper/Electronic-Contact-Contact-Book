import { getAssessments } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Users, Edit, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AssessmentsPage() {
  const assessments = await getAssessments()

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success'
      case 'graded':
        return 'default'
      case 'draft':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản'
      case 'graded':
        return 'Đã chấm'
      case 'draft':
        return 'Nháp'
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz':
        return '15 phút'
      case 'midterm':
        return 'Giữa kỳ'
      case 'final':
        return 'Cuối kỳ'
      case 'oral':
        return 'Miệng'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá thường xuyên</h1>
          <p className="text-gray-500">Quản lý bài kiểm tra và đánh giá</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo bài kiểm tra mới
        </Button>
      </div>

      {/* Assessments List */}
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{assessment.name}</CardTitle>
                    <Badge variant={getBadgeVariant(assessment.status)}>
                      {getStatusLabel(assessment.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {assessment.className} • {assessment.subject} • {getTypeLabel(assessment.type)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(assessment.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{assessment.maxScore} điểm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {assessment.submittedCount}/{assessment.totalCount} đã nộp
                    </span>
                  </div>
                </div>
                <Link href={`/teacher/assessments/${assessment.id}`}>
                  <Button>Chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assessments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài kiểm tra nào</h3>
            <p className="text-gray-500 mb-4">Tạo bài kiểm tra đầu tiên để bắt đầu</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài kiểm tra mới
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
