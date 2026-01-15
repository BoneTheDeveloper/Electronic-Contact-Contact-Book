'use client'

import { useState } from 'react'
import { AttendanceRecord } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, Clock, AlertCircle, Check } from 'lucide-react'
import { AttendanceStatusButton } from './AttendanceStatusButton'

interface AttendanceFormProps {
  students: AttendanceRecord[]
  date?: Date
  classId?: string
}

type AttendanceStatus = 'P' | 'A' | 'L' | 'E'

const statusToLabel: Record<AttendanceStatus, AttendanceRecord['status']> = {
  P: 'present',
  A: 'absent',
  L: 'late',
  E: 'excused',
}

const labelToStatus: Record<AttendanceRecord['status'], AttendanceStatus> = {
  present: 'P',
  absent: 'A',
  late: 'L',
  excused: 'E',
}

export function AttendanceForm({ students, date = new Date(), classId }: AttendanceFormProps) {
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    students.reduce((acc, student) => {
      acc[student.studentId] = labelToStatus[student.status]
      return acc
    }, {} as Record<string, AttendanceStatus>)
  )

  const [notes, setNotes] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
    setHasChanges(true)
  }

  const updateNote = (studentId: string, note: string) => {
    setNotes(prev => ({ ...prev, [studentId]: note }))
    setHasChanges(true)
  }

  const markAllPresent = () => {
    setAttendance(prev =>
      Object.fromEntries(Object.keys(prev).map(id => [id, 'P' as AttendanceStatus]))
    )
    setHasChanges(true)
  }

  const autoFillExcused = () => {
    // Fill E for students with approved leaves (mock logic)
    setAttendance(prev => {
      const updated = { ...prev }
      // Mock: assume first 2 students have approved leaves
      const studentIds = Object.keys(updated)
      if (studentIds.length >= 2) {
        updated[studentIds[0]] = 'E'
        updated[studentIds[1]] = 'E'
      }
      return updated
    })
    setHasChanges(true)
  }

  const saveDraft = () => {
    // Mock save draft
    console.log('Saving draft:', { classId, date, attendance, notes })
    setHasChanges(false)
    alert('Đã lưu nháp thành công!')
  }

  const confirmAttendance = () => {
    // Mock confirm
    console.log('Confirming attendance:', { classId, date, attendance, notes })
    setHasChanges(false)
    alert('Đã xác nhận điểm danh thành công!')
  }

  const summary = {
    P: Object.values(attendance).filter(s => s === 'P').length,
    A: Object.values(attendance).filter(s => s === 'A').length,
    L: Object.values(attendance).filter(s => s === 'L').length,
    E: Object.values(attendance).filter(s => s === 'E').length,
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={markAllPresent} className="gap-2">
          <Check className="h-4 w-4" />
          Điểm danh tất cả có mặt
        </Button>
        <Button variant="outline" onClick={autoFillExcused} className="gap-2">
          <AlertCircle className="h-4 w-4" />
          Tự động điền có phép
        </Button>
      </div>

      {/* Status Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <AttendanceStatusButton status="P" active={false} onClick={() => {}} size="sm" />
            <span className="text-sm text-gray-600">Có mặt</span>
          </div>
          <div className="flex items-center gap-2">
            <AttendanceStatusButton status="A" active={false} onClick={() => {}} size="sm" />
            <span className="text-sm text-gray-600">Vắng mặt</span>
          </div>
          <div className="flex items-center gap-2">
            <AttendanceStatusButton status="L" active={false} onClick={() => {}} size="sm" />
            <span className="text-sm text-gray-600">Muộn</span>
          </div>
          <div className="flex items-center gap-2">
            <AttendanceStatusButton status="E" active={false} onClick={() => {}} size="sm" />
            <span className="text-sm text-gray-600">Có phép</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Có mặt</p>
              <p className="text-2xl font-bold text-green-700">{summary.P}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">Vắng</p>
              <p className="text-2xl font-bold text-red-700">{summary.A}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Trễ</p>
              <p className="text-2xl font-bold text-amber-700">{summary.L}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Vắng có phép</p>
              <p className="text-2xl font-bold text-blue-700">{summary.E}</p>
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
                <TableCell className="font-medium">{student.studentName}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {(['P', 'A', 'L', 'E'] as AttendanceStatus[]).map((status) => (
                      <AttendanceStatusButton
                        key={status}
                        status={status}
                        active={attendance[student.studentId] === status}
                        onClick={() => updateStatus(student.studentId, status)}
                        size="sm"
                      />
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

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={saveDraft} disabled={!hasChanges}>
          Lưu nháp
        </Button>
        <Button onClick={confirmAttendance} disabled={!hasChanges}>
          Xác nhận hoàn thành
        </Button>
      </div>
    </div>
  )
}
