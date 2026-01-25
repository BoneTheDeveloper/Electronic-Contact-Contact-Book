'use client'

/**
 * Attendance Form Client Component
 * Client-side component for interactive attendance marking with real API integration
 * Matches wireframe design at docs/wireframe/Web_app/Teacher/attendance.html
 */

import { useState, useEffect } from 'react'
import { Calendar, Clock, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
type SessionType = 'morning' | 'afternoon'
type AttendanceCompletionStatus = 'pending' | 'completed'

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

// Status labels matching wireframe design
const statusLabels: Record<string, { label: string; bgColor: string; textColor: string; selectedBg: string; selectedText: string }> = {
  present: { label: 'P', bgColor: 'bg-green-100', textColor: 'text-green-700', selectedBg: 'bg-green-600', selectedText: 'text-white' },
  absent: { label: 'A', bgColor: 'bg-red-100', textColor: 'text-red-700', selectedBg: 'bg-red-600', selectedText: 'text-white' },
  late: { label: 'L', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', selectedBg: 'bg-yellow-600', selectedText: 'text-white' },
  excused: { label: 'E', bgColor: 'bg-blue-100', textColor: 'text-blue-700', selectedBg: 'bg-blue-600', selectedText: 'text-white' }
}

export function AttendanceFormClient({
  classId,
  className,
  isHomeroom,
  subjects
}: AttendanceFormClientProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [selectedSession, setSelectedSession] = useState<SessionType>('morning')
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  })
  const [completionStatus, setCompletionStatus] = useState<AttendanceCompletionStatus>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize session based on current time
  useEffect(() => {
    const hour = new Date().getHours()
    setSelectedSession(hour < 12 ? 'morning' : 'afternoon')
  }, [])

  // Fetch data on mount and when date/period/session changes
  useEffect(() => {
    fetchData()
  }, [selectedDate, selectedPeriod, selectedSession])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // For homeroom teachers, use session; for subject teachers, use period
      const queryParams = new URLSearchParams({
        classId,
        date: selectedDate,
        ...(isHomeroom ? { session: selectedSession } : selectedPeriod ? { periodId: selectedPeriod.toString() } : {})
      })

      const [studentsRes, periodsRes, statsRes] = await Promise.all([
        fetch(`/api/teacher/attendance/${classId}?${queryParams.toString()}`),
        fetch('/api/periods'),
        fetch(`/api/teacher/attendance?${queryParams.toString()}`)
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
        // Check if attendance is completed
        const isCompleted = statsData.stats.total > 0 &&
          statsData.stats.present + statsData.stats.absent + statsData.stats.late + statsData.stats.excused > 0
        setCompletionStatus(isCompleted ? 'completed' : 'pending')
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
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        // If toggling off, clear the status
        if (s.status === status) {
          return { ...s, status: null }
        }
        return { ...s, status }
      }
      return s
    }))

    // Recalculate stats
    setStudents(prev => {
      const newStats = calculateStats(prev.map(s =>
        s.id === studentId ? { ...s, status: s.status === status ? null : status } : s
      ))
      setStats(newStats)
      return prev
    })
  }

  // Calculate stats from students array
  const calculateStats = (studentList: Student[]): AttendanceStats => {
    const stats: AttendanceStats = {
      total: studentList.length,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    }

    studentList.forEach(s => {
      if (s.status) {
        stats[s.status]++
      }
    })

    return stats
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
    setCompletionStatus('pending')
    showToast('Đã đánh dấu tất cả học sinh có mặt')
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

      const newStats = calculateStats(updated)
      setStats(newStats)
      return updated
    })

    if (count > 0) {
      showToast(`Đã tự động điền ${count} học sinh có đơn nghỉ phép`)
    } else {
      showToast('Không có học sinh nào có đơn nghỉ phép')
    }
  }

  // Save draft
  const saveDraft = async () => {
    const hasChanges = students.some(s => s.status !== null || s.notes)
    if (!hasChanges) {
      showToast('Chưa có dữ liệu điểm danh để lưu')
      return
    }

    // Mock save - update last saved time
    const now = new Date()
    const timeStr = now.toLocaleString('vi-VN')
    setLastSaved(timeStr)
    showToast('Đã lưu nháp thành công')
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
          periodId: isHomeroom ? null : selectedPeriod,
          session: isHomeroom ? selectedSession : null,
          records,
          sendNotifications: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setCompletionStatus('completed')
        const absentCount = records.filter(r => r.status === 'absent' || r.status === 'late').length
        showToast(absentCount > 0
          ? `Đã xác nhận. Đã gửi thông báo đến ${absentCount} phụ huynh.`
          : 'Đã xác nhận hoàn thành điểm danh')
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

  // Show toast message
  const showToast = (text: string) => {
    setMessage({ type: 'success', text })
    setTimeout(() => setMessage(null), 3000)
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

  // Check if any student has status
  const hasAttendanceData = students.some(s => s.status !== null)

  return (
    <div className="space-y-6">
      {/* Filters Card - Matching wireframe rounded-[32px] design */}
      <Card className="rounded-3xl border-slate-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Selection - Display only (already selected) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lớp học</label>
              <Input
                value={className}
                disabled
                className="bg-slate-50 border-slate-200 font-bold text-slate-900"
              />
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ngày điểm danh</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="bg-slate-50 border-slate-200 font-bold"
              />
            </div>

            {/* Session Selection (for homeroom) or Period Selection (for subject teachers) */}
            {isHomeroom ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Buổi</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value as SessionType)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-sky-100 outline-none"
                >
                  <option value="morning">Buổi Sáng</option>
                  <option value="afternoon">Buổi Chiều</option>
                </select>
              </div>
            ) : subjects.length > 0 ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tiết học</label>
                <select
                  value={selectedPeriod || ''}
                  onChange={(e) => setSelectedPeriod(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-sky-100 outline-none"
                >
                  <option value="">Tất cả</option>
                  {periods.map(p => (
                    <option key={p.id} value={p.id}>
                      Tiết {p.id} ({p.start_time} - {p.end_time})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table - Matching wireframe rounded-[32px] design */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-slate-800 tracking-tight">Danh sách học sinh</CardTitle>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                <span>{stats.total}</span> học sinh • <span className="text-green-600">{stats.present}</span> có mặt • <span className="text-red-600">{stats.absent}</span> vắng
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={markAllPresent}
                variant="outline"
                size="sm"
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-bold text-xs"
              >
                <Check className="w-4 h-4 mr-2" />
                Đánh dấu tất cả có mặt
              </Button>
              <Button
                onClick={autoFillApprovedLeaves}
                variant="outline"
                size="sm"
                className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 font-bold text-xs"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Tự động điền đơn nghỉ phép
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Status Legend */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-6 text-xs">
          <span className="font-black text-slate-400 uppercase tracking-wider">Chú thích:</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">P</span>
            <span className="text-slate-600">Có mặt</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">A</span>
            <span className="text-slate-600">Vắng không phép</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">L</span>
            <span className="text-slate-600">Muộn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">E</span>
            <span className="text-slate-600">Vắng có phép</span>
          </div>
        </div>

        {/* Table or Loading/Empty State */}
        {isLoading ? (
          <CardContent className="py-12 text-center text-slate-500 font-bold">
            Đang tải dữ liệu...
          </CardContent>
        ) : students.length === 0 ? (
          <CardContent className="py-12 text-center text-slate-500">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-bold">Không có học sinh nào trong lớp</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-20">STT</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ và tên</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">Trạng thái</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-600 text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {getInitials(student.full_name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.full_name}</p>
                          <p className="text-xs text-slate-400">{student.student_code}</p>
                          {student.has_approved_leave && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded">
                              Đơn nghỉ phép
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => {
                          const isSelected = student.status === status
                          const labelConfig = statusLabels[status]
                          return (
                            <button
                              key={status}
                              onClick={() => updateStudentStatus(student.id, status as AttendanceStatus)}
                              className={`
                                status-btn w-10 h-10 rounded-lg font-bold text-sm transition-all
                                ${isSelected
                                  ? `${labelConfig.selectedBg} ${labelConfig.selectedText} scale-110 shadow-lg`
                                  : `${labelConfig.bgColor} ${labelConfig.textColor} hover:scale-105`
                                }
                              `}
                            >
                              {labelConfig.label}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        value={student.notes || ''}
                        onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                        placeholder="Ghi chú..."
                        className="text-sm bg-slate-50 border-slate-200 focus:ring-2 focus:ring-sky-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Message Toast */}
      {message && (
        <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-2xl shadow-2xl font-bold z-50 transition-all ${
          message.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      {students.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              onClick={saveDraft}
              variant="outline"
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu nháp
            </Button>
            <Button
              onClick={saveAttendance}
              disabled={!hasAttendanceData || isSaving}
              className="bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-bold text-sm px-6"
            >
              {isSaving ? (
                <>Đang lưu...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Xác nhận hoàn thành
                </>
              )}
            </Button>
          </div>
          {lastSaved && (
            <div className="text-xs text-slate-400">
              Lưu lần cuối: <span>{lastSaved}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
