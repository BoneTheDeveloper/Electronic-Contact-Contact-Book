import { getTeacherClasses, getConductRatings } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function ConductPage() {
  const classes = await getTeacherClasses()
  const homeroomClass = classes.find(c => c.isHomeroom)

  if (!homeroomClass) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Học tập & Hạnh kiểm</h1>
          <p className="text-gray-500">Bạn chưa được phân công lớp chủ nhiệm</p>
        </div>
      </div>
    )
  }

  const ratings = await getConductRatings(homeroomClass.id, '2')

  const getAcademicBadge = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return <Badge variant="success">Giỏi xuất sắc</Badge>
      case 'good':
        return <Badge variant="default">Giỏi</Badge>
      case 'fair':
        return <Badge variant="warning">Khá</Badge>
      case 'poor':
        return <Badge variant="destructive">Cần cố gắng</Badge>
    }
  }

  const getConductBadge = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return <Badge variant="success">Tốt</Badge>
      case 'good':
        return <Badge variant="default">Khá</Badge>
      case 'fair':
        return <Badge variant="warning">Trung bình</Badge>
      case 'poor':
        return <Badge variant="destructive">Yếu</Badge>
    }
  }

  // Calculate summary
  const summary = {
    excellent: ratings.filter(r => r.academicRating === 'excellent').length,
    good: ratings.filter(r => r.academicRating === 'good').length,
    fair: ratings.filter(r => r.academicRating === 'fair').length,
    poor: ratings.filter(r => r.academicRating === 'poor').length,
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Học tập & Hạnh kiểm</h1>
        <p className="text-gray-500">Lớp chủ nhiệm: {homeroomClass.name} • Học kỳ II</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giỏi xuất sắc</p>
                <p className="text-2xl font-bold text-green-600">{summary.excellent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giỏi</p>
                <p className="text-2xl font-bold text-blue-600">{summary.good}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Khá</p>
                <p className="text-2xl font-bold text-amber-600">{summary.fair}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Award className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cần cố gắng</p>
                <p className="text-2xl font-bold text-red-600">{summary.poor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conduct Ratings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách xếp loại</CardTitle>
            <Button variant="outline">Xuất báo cáo</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Học tập</TableHead>
                <TableHead>Hạnh kiểm</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((rating, index) => (
                <TableRow key={rating.studentId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{rating.studentName}</TableCell>
                  <TableCell>{getAcademicBadge(rating.academicRating)}</TableCell>
                  <TableCell>{getConductBadge(rating.conductRating)}</TableCell>
                  <TableCell className="max-w-xs truncate">{rating.notes || '-'}</TableCell>
                  <TableCell>
                    <Link href={`/teacher/conduct/${rating.studentId}`}>
                      <Button variant="ghost" size="sm">Chi tiết</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
