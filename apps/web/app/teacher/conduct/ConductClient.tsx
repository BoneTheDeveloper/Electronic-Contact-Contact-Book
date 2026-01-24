'use client'

import { useState, useMemo } from 'react'
import type { ConductRating } from '@/lib/types'
import { DualRatingBadge } from '@/components/teacher/DualRatingBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConductClientProps {
  initialRatings: ConductRating[]
}

export function ConductClient({ initialRatings }: ConductClientProps) {
  const [filters, setFilters] = useState({
    semester: '2' as '1' | '2',
    academicRating: 'all',
    conductRating: 'all',
    search: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredRatings = useMemo(() => {
    return initialRatings.filter((rating: ConductRating) => {
      if (filters.academicRating !== 'all' && rating.academicRating !== filters.academicRating) {
        return false
      }
      if (filters.conductRating !== 'all' && rating.conductRating !== filters.conductRating) {
        return false
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          rating.studentName.toLowerCase().includes(searchLower) ||
          rating.mssv.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [filters, initialRatings])

  const totalPages = Math.ceil(filteredRatings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRatings = filteredRatings.slice(startIndex, startIndex + itemsPerPage)

  const academicSummary = useMemo(() => ({
    excellentPlus: filteredRatings.filter((r: ConductRating) => r.academicRating === 'excellent-plus').length,
    excellent: filteredRatings.filter((r: ConductRating) => r.academicRating === 'excellent').length,
    good: filteredRatings.filter((r: ConductRating) => r.academicRating === 'good').length,
    average: filteredRatings.filter((r: ConductRating) => r.academicRating === 'average').length,
    needsImprovement: filteredRatings.filter((r: ConductRating) => r.academicRating === 'needs-improvement').length,
  }), [filteredRatings])

  const conductSummary = useMemo(() => ({
    good: filteredRatings.filter((r: ConductRating) => r.conductRating === 'good').length,
    fair: filteredRatings.filter((r: ConductRating) => r.conductRating === 'fair').length,
    average: filteredRatings.filter((r: ConductRating) => r.conductRating === 'average').length,
    poor: filteredRatings.filter((r: ConductRating) => r.conductRating === 'poor').length,
  }), [filteredRatings])

  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(-2)
      .toUpperCase()
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-sky-100 text-sky-600',
      'bg-emerald-100 text-emerald-600',
      'bg-violet-100 text-violet-600',
      'bg-amber-100 text-amber-600',
      'bg-rose-100 text-rose-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Học tập & Hạnh kiểm</h1>
        <p className="text-gray-500">Xếp loại học tập và hạnh kiểm học sinh</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value as '1' | '2' })}
            >
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filters.academicRating}
              onChange={(e) => setFilters({ ...filters, academicRating: e.target.value })}
            >
              <option value="all">Tất cả xếp loại học tập</option>
              <option value="excellent-plus">Giỏi xuất sắc</option>
              <option value="excellent">Giỏi</option>
              <option value="good">Khá</option>
              <option value="average">Trung bình</option>
              <option value="needs-improvement">Cần cố gắng</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={filters.conductRating}
              onChange={(e) => setFilters({ ...filters, conductRating: e.target.value })}
            >
              <option value="all">Tất cả xếp loại hạnh kiểm</option>
              <option value="good">Tốt</option>
              <option value="fair">Khá</option>
              <option value="average">Trung bình</option>
              <option value="poor">Yếu</option>
            </select>

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
          </div>
        </CardContent>
      </Card>

      {/* Academic Rating Summary */}
      <div>
        <h3 className="text-lg font-bold mb-4">Xếp loại học tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-green-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{academicSummary.excellentPlus}</div>
              <div className="text-sm text-gray-500">Giỏi xuất sắc (≥9.0)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-blue-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{academicSummary.excellent}</div>
              <div className="text-sm text-gray-500">Giỏi (8.0-8.9)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">{academicSummary.good}</div>
              <div className="text-sm text-gray-500">Khá (6.5-7.9)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-orange-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">{academicSummary.average}</div>
              <div className="text-sm text-gray-500">Trung bình (5.0-6.4)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600">{academicSummary.needsImprovement}</div>
              <div className="text-sm text-gray-500">Cần cố gắng (&lt;5.0)</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conduct Rating Summary */}
      <div>
        <h3 className="text-lg font-bold mb-4">Xếp loại hạnh kiểm</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.good}</div>
              <div className="text-sm text-gray-500">Tốt</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.fair}</div>
              <div className="text-sm text-gray-500">Khá</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.average}</div>
              <div className="text-sm text-gray-500">Trung bình</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.poor}</div>
              <div className="text-sm text-gray-500">Yếu</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Student List with Dual Ratings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách học sinh</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Học tập</TableHead>
                <TableHead>Hạnh kiểm</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRatings.map((rating: ConductRating, index: number) => (
                <TableRow key={rating.studentId}>
                  <TableCell>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm',
                      getAvatarColor(index)
                    )}>
                      {getAvatarInitials(rating.studentName)}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{rating.mssv}</TableCell>
                  <TableCell className="font-bold">{rating.studentName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <DualRatingBadge
                        type="academic"
                        rating={rating.academicRating}
                        score={rating.academicScore}
                        size="sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        rating.conductRating === 'good' ? 'bg-emerald-500' :
                        rating.conductRating === 'fair' ? 'bg-blue-500' :
                        rating.conductRating === 'average' ? 'bg-yellow-500' :
                        'bg-red-500'
                      )}></div>
                      <DualRatingBadge
                        type="conduct"
                        rating={rating.conductRating}
                        size="sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Chi tiết</Button>
                      <Button size="sm" variant="outline">Sửa</Button>
                      <Button size="sm" variant="outline">Liên hệ PH</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            {[...Array(totalPages)].map((_, i: number) => (
              <Button
                key={i}
                size="sm"
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                className={currentPage === i + 1 ? 'bg-sky-600' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
