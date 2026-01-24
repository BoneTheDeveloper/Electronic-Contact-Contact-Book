'use client'

/**
 * Attendance Form Client Component
 * Client-side component for interactive attendance marking with real API integration
 */

import { useState, useEffect, useActionState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface SubjectTaught {
  subject_id: string
  subject_name: string
  periods: Array<{
    period_id: number
    day_of_week: number
    room: string
  }>
}

interface AttendanceFormClientProps {
  classId: string
  className: string
  isHomeroom: boolean
  subjects: SubjectTaught[]
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | null

interface Student {
  id: string
  student_id: string
  student_code: string
  full_name: string
  gender: 'male' | 'female' | null
  status: AttendanceStatus
  notes: string | null
  has_approved_leave: boolean
  approved_leave_reason: string | null
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
}

interface Period {
  id: number
  name: string
  start_time: string
  end_time: string
}

const statusLabels: Record<string, { label: string; bgColor: string; textColor: string }> = {
  present: { label: 'P', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  absent: { label: 'A', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  late: { label: 'L', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  excused: { label: 'E', bgColor: 'bg-blue-100', textColor: 'text-blue-700' }
}

export function AttendanceFormClient({
  classId,
  className,
  isHomeroom,
  subjects
}: AttendanceFormClientProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch data on mount and when date/period changes
  useEffect(() => {
    fetchData()
  }, [selectedDate, selectedPeriod])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch students with attendance, periods, and stats in parallel
      const [studentsRes, periodsRes, statsRes] = await Promise.all([
        fetch(`/api/teacher/attendance/${classId}?date=${selectedDate}${selectedPeriod ? `&periodId=${selectedPeriod}` : ''}`),
        fetch('/api/periods'),
        fetch(`/api/teacher/attendance?classId=${classId}&date=${selectedDate}${selectedPeriod ? `&periodId=${selectedPeriod}` : ''}`)
      ])

      const [studentsData, periodsData, statsData] = await Promise.all([
        studentsRes.json(),
        periodsRes.json(),
        statsRes.json()
      ])

      if (studentsData.success) {
        setStudents(studentsData.data)
      }

      if (periodsData.success) {
        setPeriods(periodsData.periods || [])
      }

      if (statsData.success && statsData.stats) {
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error)
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu điểm danh' })
    } finally {
      setIsLoading(false)
    }
  }

  // Update status for a student
  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, status } : s
    ))

    // Update stats
    if (status) {
      setStats(prev => ({
        ...prev,
        [status]: prev[status as keyof AttendanceStats] + 1
      }))
    }

    // Clear confirm button disabled state
    document.getElementById('confirmBtn')?.removeAttribute('disabled')
  }

  // Update notes for a student
  const updateStudentNotes = (studentId: string, notes: string) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, notes } : s
    ))
  }

  // Mark all as present
  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: 'present' as const })))
    setStats({
      total: students.length,
      present: students.length,
      absent: 0,
      late: 0,
      excused: 0
    })
    document.getElementById('confirmBtn')?.removeAttribute('disabled')
  }

  // Auto-fill approved leaves
  const autoFillApprovedLeaves = () => {
    let count = 0
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.has_approved_leave && !s.status) {
          count++
          return { ...s, status: 'excused' as const, notes: `Đơn nghỉ phép: ${s.approved_leave_reason || ''}` }
        }
        return s
      })

      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        excused: prevStats.excused + count
      }))

      document.getElementById('confirmBtn')?.removeAttribute('disabled')
      return updated
    })

    if (count > 0) {
      setMessage({ type: 'success', text: `Đã tự động điền ${count} học sinh có đơn nghỉ phép` })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Save attendance
  const saveAttendance = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const records = students
        .filter(s => s.status !== null)
        .map(s => ({
          student_id: s.student_id,
          status: s.status,
          notes: s.notes,
          student_name: s.full_name
        }))

      if (records.length === 0) {
        setMessage({ type: 'error', text: 'Vui lòng đánh dấu điểm danh cho ít nhất một học sinh' })
        setIsSaving(false)
        return
      }

      const response = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          date: selectedDate,
          periodId: selectedPeriod,
          records,
          sendNotifications: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        // Refresh data to get updated stats
        await fetchData()
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể lưu điểm danh' })
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      setMessage({ type: 'error', text: 'Không thể lưu điểm danh' })
    } finally {
      setIsSaving(false)
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày điểm danh</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Period Selection (for subject teachers) */}
            {!isHomeroom && subjects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiết học</label>
                <select
                  value={selectedPeriod || ''}
                  onChange={(e) => setSelectedPeriod(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Cả ngày</option>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>
                      Tiết {p.id} ({p.start_time} - {p.end_time})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Stats Display */}
            <div className="flex items-end gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tổng số</p>
                <p className="font-semibold">{stats.total} học sinh</p>
              </div>
              <div>
                <p className="text-gray-500">Có mặt</p>
                <p className="font-semibold text-green-600">{stats.present}</p>
              </div>
              <div>
                <p className="text-gray-500">Vắng</p>
                <p className="font-semibold text-red-600">{stats.absent}</p>
              </div>
              <div>
                <p className="text-gray-500">Muộn</p>
                <p className="font-semibold text-yellow-600">{stats.late}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={markAllPresent} variant="outline" size="sm">
          Đánh dấu tất cả có mặt
        </Button>
        <Button onClick={autoFillApprovedLeaves} variant="outline" size="sm">
          Tự động điền đơn nghỉ phép
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Students List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Đang tải...
          </CardContent>
        </Card>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Không có học sinh nào trong lớp
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Học sinh</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
                            {getInitials(student.full_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.full_name}</p>
                            <p className="text-xs text-gray-500">{student.student_code}</p>
                            {student.has_approved_leave && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                Đơn nghỉ phép
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStudentStatus(student.id, student.status === status ? null : status as AttendanceStatus)}
                              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                                student.status === status
                                  ? 'ring-2 ring-sky-500 ring-offset-1'
                                  : 'opacity-60 hover:opacity-100'
                              } ${statusLabels[status].bgColor} ${statusLabels[status].textColor}`}
                            >
                              {statusLabels[status].label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={student.notes || ''}
                          onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                          placeholder="Ghi chú..."
                          className="text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {stats.present}/{stats.total} học sinh có mặt
          </div>
          <Button
            id="confirmBtn"
            onClick={saveAttendance}
            disabled={isSaving}
            className="px-6"
          >
            {isSaving ? 'Đang lưu...' : 'Xác nhận hoàn thành'}
          </Button>
        </div>
      )}
    </div>
  )
}
