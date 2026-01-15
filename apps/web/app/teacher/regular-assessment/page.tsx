'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StudentAssessmentCard, RegularAssessment } from '@/components/teacher/StudentAssessmentCard'
import { getRegularAssessments } from '@/lib/mock-data'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Search } from 'lucide-react'

export default function RegularAssessmentPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app, load server-side
  const mockAssessments: RegularAssessment[] = [
    {
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Tiến bộ học tập', content: 'Có tiến bộ tốt trong giải toán' },
      rating: 4,
      createdAt: '2026-01-14',
    },
    {
      studentId: '2',
      studentName: 'Trần Thị Bình',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Đóng góp lớp', content: 'Học sinh tích cực, giúp đỡ bạn bè' },
      rating: 5,
      createdAt: '2026-01-14',
    },
    {
      studentId: '3',
      studentName: 'Lê Văn Cường',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'pending',
      createdAt: '2026-01-14',
    },
    {
      studentId: '4',
      studentName: 'Phạm Thị Dung',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'needs-attention',
      comment: { category: 'Cần cải thiện', content: 'Cần chú ý hơn trong lớp, làm bài tập chưa đầy đủ' },
      rating: 2,
      createdAt: '2026-01-13',
    },
    {
      studentId: '5',
      studentName: 'Ngô Thị Giang',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Tiến bộ học tập', content: 'Nắm bắt kiến thức tốt, làm bài tập cẩn thận' },
      rating: 5,
      createdAt: '2026-01-14',
    },
    {
      studentId: '6',
      studentName: 'Đỗ Văn Hùng',
      classId: '10A1',
      className: '10A1',
      subject: 'Toán',
      status: 'pending',
      createdAt: '2026-01-14',
    },
  ]

  const filteredAssessments = mockAssessments.filter((assessment) => {
    const matchesClass = selectedClass === 'all' || assessment.classId === selectedClass
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus
    const matchesSearch =
      searchQuery === '' ||
      assessment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesClass && matchesStatus && matchesSearch
  })

  const evaluatedCount = mockAssessments.filter((a) => a.status === 'evaluated').length
  const pendingCount = mockAssessments.filter((a) => a.status === 'pending').length
  const positiveCount = mockAssessments.filter((a) => a.rating && a.rating >= 4).length
  const needsAttentionCount = mockAssessments.filter((a) => a.status === 'needs-attention').length

  const handleEvaluate = (studentId: string) => {
    console.log('Evaluate student:', studentId)
    // TODO: Open evaluation modal
  }

  const handleEdit = (studentId: string) => {
    console.log('Edit assessment:', studentId)
    // TODO: Open edit modal
  }

  const handleContactParent = (studentId: string) => {
    console.log('Contact parent:', studentId)
    // TODO: Open contact modal or redirect to messages
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá nhận xét</h1>
        <p className="text-gray-500">Nhận xét học tập của học sinh</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <select
              className="px-3 py-2 border rounded-lg text-sm bg-white"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Tất cả các lớp</option>
              <option value="10A1">10A1</option>
              <option value="9A3">9A3</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg text-sm bg-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="evaluated">Đã đánh giá</option>
              <option value="pending">Chưa đánh giá</option>
              <option value="needs-attention">Cần lưu ý</option>
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-green-600">{evaluatedCount}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Đã đánh giá</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Chưa đánh giá</div>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-blue-600">{positiveCount}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Tiếp tục cố gắng</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-red-600">{needsAttentionCount}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Cần lưu ý</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-gray-400">Không có học sinh nào phù hợp với bộ lọc</div>
            </CardContent>
          </Card>
        ) : (
          filteredAssessments.map((assessment) => (
            <StudentAssessmentCard
              key={assessment.studentId}
              assessment={assessment}
              onEvaluate={handleEvaluate}
              onEdit={handleEdit}
              onContactParent={handleContactParent}
            />
          ))
        )}
      </div>
    </div>
  )
}
