'use client'

import { useState, useEffect } from 'react'
import { getRegularAssessments, type RegularAssessment } from '@/lib/mock-data'
import { StudentAssessmentCard } from '@/components/teacher/StudentAssessmentCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AssessmentsPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<RegularAssessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<RegularAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    classId: '',
    subject: '',
    status: 'all' as 'all' | 'evaluated' | 'pending' | 'needs-attention',
    search: '',
  })

  useEffect(() => {
    async function loadData() {
      const data = await getRegularAssessments()
      setAssessments(data)
      setFilteredAssessments(data)
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = assessments

    if (filters.status !== 'all') {
      filtered = filtered.filter(a => a.status === filters.status)
    }

    if (filters.search) {
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.className.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredAssessments(filtered)
  }, [filters, assessments])

  const summary = {
    evaluated: assessments.filter(a => a.status === 'evaluated').length,
    pending: assessments.filter(a => a.status === 'pending').length,
    positive: assessments.filter(a => a.rating && a.rating >= 4).length,
    needsAttention: assessments.filter(a => a.status === 'needs-attention').length,
  }

  const handleEvaluate = (studentId: string) => {
    router.push(`/teacher/assessments/evaluate/${studentId}`)
  }

  const handleEdit = (studentId: string) => {
    router.push(`/teacher/assessments/evaluate/${studentId}`)
  }

  const handleContactParent = (studentId: string) => {
    router.push(`/teacher/messages?student=${studentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá thường xuyên</h1>
        <p className="text-gray-500">Đánh giá và theo dõi tiến độ học sinh</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="evaluated">Đã đánh giá</option>
              <option value="pending">Chưa đánh giá</option>
              <option value="needs-attention">Cần chú ý</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã đánh giá</p>
                <p className="text-2xl font-bold text-green-600">{summary.evaluated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chưa đánh giá</p>
                <p className="text-2xl font-bold text-amber-600">{summary.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500 bg-gradient-to-r from-sky-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tiến bộ tốt</p>
                <p className="text-2xl font-bold text-sky-600">{summary.positive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cần chú ý</p>
                <p className="text-2xl font-bold text-red-600">{summary.needsAttention}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Assessment Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Danh sách học sinh</h2>
          <Badge variant="outline">{filteredAssessments.length} học sinh</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssessments.map((assessment) => (
            <StudentAssessmentCard
              key={assessment.studentId}
              assessment={assessment}
              onEvaluate={handleEvaluate}
              onEdit={handleEdit}
              onContactParent={handleContactParent}
            />
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Không tìm thấy kết quả nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
