'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, User, UserCircle, Phone, MessageSquare, Search, MapPin } from 'lucide-react'

interface Student {
  id: string
  name: string
  code: string
  dob: string
  parentName: string
  parentPhone: string
  address: string
}

interface HomeroomData {
  classId: string
  className: string
  grade: string
  room: string
  studentCount: number
  maleCount: number
  femaleCount: number
  classMonitor: string
  students: Student[]
}

export default function HomeroomPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [homeroomData, setHomeroomData] = useState<HomeroomData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch homeroom data on mount
  useEffect(() => {
    async function fetchHomeroomData() {
      setLoading(true)
      try {
        const res = await fetch('/api/teacher/homeroom')
        const json = await res.json()
        setHomeroomData(json.data)
      } catch (error) {
        console.error('Failed to fetch homeroom data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeroomData()
  }, [])

  const students = homeroomData?.students || []
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp chủ nhiệm</h1>
        <p className="text-gray-500">{homeroomData?.className} • Phòng {homeroomData?.room}</p>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-sky-600">
                  {homeroomData?.studentCount}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Tổng số</div>
              </div>
              <Users className="h-8 w-8 text-sky-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-blue-600">
                  {homeroomData?.maleCount}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Nam</div>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-pink-600">
                  {homeroomData?.femaleCount || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Nữ</div>
              </div>
              <UserCircle className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-black text-purple-600">
                  {homeroomData?.classMonitor || '-'}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Lớp trưởng</div>
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                LTC
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">MSSV</TableHead>
                  <TableHead className="font-bold">Họ và tên</TableHead>
                  <TableHead className="font-bold">Ngày sinh</TableHead>
                  <TableHead className="font-bold">Phụ huynh</TableHead>
                  <TableHead className="font-bold">SĐT PH</TableHead>
                  <TableHead className="font-bold">Địa chỉ</TableHead>
                  <TableHead className="font-bold text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Không tìm thấy học sinh nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs">
                        {student.code}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(student.dob).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {student.parentName}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Phone className="h-3 w-3" />
                          {student.parentPhone}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{student.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            Gọi
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 text-xs">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Nhắn tin
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
