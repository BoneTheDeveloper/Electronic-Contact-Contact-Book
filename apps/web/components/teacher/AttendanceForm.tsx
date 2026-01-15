'use client'

import { useState } from 'react'
import { AttendanceRecord } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface AttendanceFormProps {
  students: AttendanceRecord[]
  date?: Date
  classId?: string
}

export function AttendanceForm({ students, date = new Date(), classId }: AttendanceFormProps) {
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord['status']>>(
    students.reduce((acc, student) => {
      acc[student.studentId] = student.status
      return acc
    }, {} as Record<string, AttendanceRecord['status']>)
  )

  const [notes, setNotes] = useState<Record<string, string>>({})

  const updateStatus = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const updateNote = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }))
  }

  const handleSubmit = async () => {
    // Mock save - in real app, would call API
    console.log('Saving attendance:', { classId, date, attendance, notes })
    alert('Đã lưu điểm danh thành công!')
  }

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'late':
        return 'bg-amber-100 text-amber-700 border-amber-300'
      case 'excused':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusLabel = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'Có mặt'
      case 'absent':
        return 'Vắng'
      case 'late':
        return 'Trễ'
      case 'excused':
        return 'Vắng có phép'
      default:
        return status
    }
  }

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4" />
      case 'absent':
        return <XCircle className="h-4 w-4" />
      case 'late':
        return <Clock className="h-4 w-4" />
      case 'excused':
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const summary = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    excused: Object.values(attendance).filter(s => s === 'excused').length,
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Có mặt</p>
              <p className="text-2xl font-bold text-green-700">{summary.present}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">Vắng</p>
              <p className="text-2xl font-bold text-red-700">{summary.absent}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Trễ</p>
              <p className="text-2xl font-bold text-amber-700">{summary.late}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Vắng có phép</p>
              <p className="text-2xl font-bold text-blue-700">{summary.excused}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">STT</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student.studentId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(student.studentId, status)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                          attendance[student.studentId] === status
                            ? getStatusColor(status)
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {getStatusIcon(status)}
                        <span className="text-xs font-medium">{getStatusLabel(status)}</span>
                      </button>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Ghi chú..."
                    value={notes[student.studentId] || ''}
                    onChange={(e) => updateNote(student.studentId, e.target.value)}
                    className="max-w-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button">
          Hủy
        </Button>
        <Button onClick={handleSubmit} type="button">
          Lưu điểm danh
        </Button>
      </div>
    </div>
  )
}
