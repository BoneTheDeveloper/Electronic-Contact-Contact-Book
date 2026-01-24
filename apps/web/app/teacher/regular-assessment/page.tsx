'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { StudentAssessmentCard, RegularAssessment } from '@/components/teacher/StudentAssessmentCard'
import { CheckCircle, Clock, AlertCircle, TrendingUp, Search } from 'lucide-react'

export default function RegularAssessmentPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [assessments, setAssessments] = useState<RegularAssessment[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch assessments on mount
  useEffect(() => {
    async function fetchAssessments() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedClass !== 'all') params.append('classId', selectedClass)
        if (selectedStatus !== 'all') params.append('status', selectedStatus)

        const res = await fetch(`/api/teacher/assessments?${params.toString()}`)
        const json = await res.json()
        setAssessments(json.data)
      } catch (error) {
        console.error('Failed to fetch assessments:', error)
        setAssessments([])
      } finally {
        setLoading(false)
      }
    }
    fetchAssessments()
  }, [selectedClass, selectedStatus])

  // Filter by search query
  const filteredAssessments = assessments.filter((assessment: RegularAssessment) =>
    assessment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.className.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate stats
  const evaluatedCount = assessments.filter((a: RegularAssessment) => a.status === 'evaluated').length
  const pendingCount = assessments.filter((a: RegularAssessment) => a.status === 'pending').length
  const positiveCount = assessments.filter((a: RegularAssessment) => a.rating && a.rating >= 4).length
  const needsAttentionCount = assessments.filter((a: RegularAssessment) => a.status === 'needs-attention').length

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      </div>
    )
  }

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
              <option value="6A">6A</option>
              <option value="7A">7A</option>
              <option value="8A">8A</option>
              <option value="9A">9A</option>
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
