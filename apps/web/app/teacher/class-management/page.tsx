'use client'

import { useState } from 'react'
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
import { getTeacherClasses, getClassManagementData } from '@/lib/mock-data'
import { Users, Mail, Phone, Search, Download } from 'lucide-react'

export default function ClassManagementPage() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app, these would be loaded server-side
  const classes = [
    { id: '10A1', name: '10A1', subject: 'Toán', studentCount: 35 },
    { id: '9A3', name: '9A3', subject: 'Toán', studentCount: 32 },
    { id: '8B', name: '8B', subject: 'Toán', studentCount: 38 },
  ]

  const mockStudents = [
    { id: '1', name: 'Nguyễn Văn An', code: 'HV001', email: 'an.nv@school.edu', phone: '0901234567', status: 'active' },
    { id: '2', name: 'Trần Thị Bình', code: 'HV002', email: 'binh.tt@school.edu', phone: '0901234568', status: 'active' },
    { id: '3', name: 'Lê Văn Cường', code: 'HV003', email: 'cuong.lv@school.edu', phone: '0901234569', status: 'active' },
    { id: '4', name: 'Phạm Thị Dung', code: 'HV004', email: 'dung.pt@school.edu', phone: '0901234570', status: 'active' },
    { id: '5', name: 'Hoàng Văn Em', code: 'HV005', phone: '0901234571', status: 'withdrawn' },
    { id: '6', name: 'Ngô Thị Giang', code: 'HV006', email: 'giang.nt@school.edu', phone: '0901234572', status: 'active' },
  ]

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedClass = classes.find((c) => c.id === selectedClassId)

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp dạy</h1>
        <p className="text-gray-500">Quản lý danh sách học sinh các lớp giảng dạy</p>
      </div>

      {/* Class Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card
            key={cls.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedClassId === cls.id
                ? 'ring-2 ring-sky-500 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedClassId(cls.id)}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-black text-sky-600 mb-1">
                  {cls.name}
                </div>
                <div className="text-sm text-gray-600 font-medium mb-2">
                  {cls.subject}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{cls.studentCount} học sinh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student List */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Danh sách học sinh - {selectedClass.name}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Môn: {selectedClass.subject}
                </p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">MSSV</TableHead>
                    <TableHead className="font-bold">Họ và tên</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">SĐT</TableHead>
                    <TableHead className="font-bold">Trạng thái</TableHead>
                    <TableHead className="font-bold text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
                        <TableCell>
                          {student.email ? (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.phone ? (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              {student.phone}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === 'active' ? 'default' : 'secondary'}
                            className={
                              student.status === 'active'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600'
                            }
                          >
                            {student.status === 'active' ? 'Đang học' : 'Đã nghỉ'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              Chi tiết
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs">
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
      )}
    </div>
  )
}
