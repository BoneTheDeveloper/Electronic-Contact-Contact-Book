'use client'

/**
 * Grade Entry Form Client Component
 * Client-side component for interactive grade entry with real API integration
 */

import { useState, useEffect } from 'react'
import { Save, Download, Upload, Lock, Unlock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface GradeEntryFormProps {
  classId: string
  className: string
  subjectId: string
  subjectName: string
  schoolYear?: string
  semester?: string
}

interface StudentGrades {
  student_id: string
  student_code: string
  full_name: string
  tx1_score: number | null
  tx2_score: number | null
  tx3_score: number | null
  gk_score: number | null
  ck_score: number | null
  average: number | null
}

interface GradeStatistics {
  excellent: number
  good: number
  average: number
  poor: number
  classAverage: number
}

type GradeField = 'tx1_score' | 'tx2_score' | 'tx3_score' | 'gk_score' | 'ck_score'

export function GradeEntryFormClient({
  classId,
  className,
  subjectId,
  subjectName,
  schoolYear = '2024-2025',
  semester = '2'
}: GradeEntryFormProps) {
  const [students, setStudents] = useState<StudentGrades[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [stats, setStats] = useState<GradeStatistics>({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
    classAverage: 0
  })

  // Fetch grade data on mount
  useEffect(() => {
    fetchGradeData()
  }, [classId, subjectId, schoolYear, semester])

  const fetchGradeData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/teacher/grades/${classId}?subjectId=${subjectId}&schoolYear=${schoolYear}&semester=${semester}`
      )
      const data = await response.json()

      if (data.success) {
        setStudents(data.data.students)
        setIsLocked(data.data.lockStatus.is_locked)
        setStats(data.data.stats)
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể tải dữ liệu điểm' })
      }
    } catch (error) {
      console.error('Error fetching grade data:', error)
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu điểm' })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate average: ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
  const calculateStudentAverage = (student: StudentGrades): string => {
    if (student.average === null) return '--'
    return student.average.toFixed(2)
  }

  // Get color class for average
  const getAverageColor = (avg: string) => {
    if (avg === '--') return 'bg-gray-100 text-gray-400 border border-gray-300'
    const num = parseFloat(avg)
    if (num >= 8.0) return 'bg-green-100 text-green-700 border border-green-300'
    if (num >= 6.5) return 'bg-blue-100 text-blue-700 border border-blue-300'
    if (num >= 5.0) return 'bg-amber-100 text-amber-700 border border-amber-300'
    return 'bg-red-100 text-red-700 border border-red-300'
  }

  const updateGrade = (studentId: string, field: GradeField, value: number | null) => {
    setStudents(prev => prev.map(s => {
      if (s.student_id === studentId) {
        const updated = { ...s, [field]: value }
        // Recalculate average
        const tx1 = updated.tx1_score
        const tx2 = updated.tx2_score
        const tx3 = updated.tx3_score
        const gk = updated.gk_score
        const ck = updated.ck_score

        if (tx1 !== null && tx2 !== null && tx3 !== null && gk !== null && ck !== null) {
          updated.average = ((tx1 + tx2 + tx3) * 1 + gk * 2 + ck * 3) / 8
        } else {
          updated.average = null
        }
        return updated
      }
      return s
    }))
    setHasChanges(true)
  }

  const saveDraft = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/teacher/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          subjectId,
          schoolYear,
          semester,
          entries: buildGradeEntries(),
          action: 'draft'
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Đã lưu nháp thành công' })
        setHasChanges(false)
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể lưu nháp' })
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      setMessage({ type: 'error', text: 'Không thể lưu nháp' })
    } finally {
      setIsSaving(false)
    }
  }

  const lockGrades = async () => {
    if (!confirm('Xác nhận khóa điểm? Sau khi khóa, chỉ Admin mới có thể mở lại. Bạn có chắc chắn?')) {
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/teacher/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          subjectId,
          schoolYear,
          semester,
          entries: buildGradeEntries(),
          action: 'lock'
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Đã khóa điểm thành công' })
        setIsLocked(true)
        setHasChanges(false)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể khóa điểm' })
      }
    } catch (error) {
      console.error('Error locking grades:', error)
      setMessage({ type: 'error', text: 'Không thể khóa điểm' })
    } finally {
      setIsSaving(false)
    }
  }

  const buildGradeEntries = () => {
    // Get assessment IDs from the first student (all students share same assessments)
    // In real implementation, we'd need to fetch assessment IDs
    const entries: Array<{
      student_id: string
      assessment_id: string
      score: number
      status: string
    }> = []
    const assessmentTypes = ['tx1', 'tx2', 'tx3', 'gk', 'ck'] as const

    students.forEach(student => {
      assessmentTypes.forEach(type => {
        const scoreField = `${type}_score` as GradeField
        const score = student[scoreField]
        if (score !== null && score !== undefined) {
          entries.push({
            student_id: student.student_id,
            assessment_id: `${classId}_${subjectId}_${schoolYear}_${semester}_${type}`, // Placeholder - should be real assessment ID
            score,
            status: isLocked ? 'locked' : 'draft'
          })
        }
      })
    })

    return entries
  }

  const downloadTemplate = () => {
    setMessage({ type: 'success', text: 'Đang tải template Excel... (Demo)' })
    setTimeout(() => setMessage(null), 3000)
  }

  const importExcel = () => {
    setMessage({ type: 'success', text: 'Chọn file Excel để import... (Demo)' })
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

  return (
    <div className="space-y-6">
      {/* Filters Info */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-700">Năm học:</span>
            <span className="font-bold text-slate-900">{schoolYear}</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-slate-700">Học kỳ:</span>
            <span className="font-bold text-slate-900">Học kỳ {semester}</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-slate-700">Lớp:</span>
            <span className="font-bold text-slate-900">{className}</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium text-slate-700">Môn:</span>
            <span className="font-bold text-slate-900">{subjectName}</span>
          </div>
          <Badge variant={isLocked ? "destructive" : "default"} className="text-sm px-3 py-1">
            {isLocked ? 'Đã khóa điểm' : 'Chưa khóa điểm'}
          </Badge>
        </div>
      </Card>

      {/* Formula Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">CÔNG THỨC TÍNH ĐIỂM TRUNG BÌNH</h4>
            <p className="text-base text-blue-800 mt-1 font-medium">
              ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
            </p>
            <p className="text-xs text-blue-700 mt-2">
              • TX1, TX2, TX3: Điểm kiểm tra viết (hệ số 1) • GK: Giữa kỳ (hệ số 2) • CK: Cuối kỳ (hệ số 3)
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Class Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border-l-4 border-green-500 bg-white rounded-lg shadow-sm p-4">
          <div className="text-3xl font-bold text-green-600">{stats.excellent}</div>
          <div className="text-xs text-gray-500 mt-1">Giỏi (≥8.0)</div>
        </div>
        <div className="border-l-4 border-blue-500 bg-white rounded-lg shadow-sm p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.good}</div>
          <div className="text-xs text-gray-500 mt-1">Khá (6.5-7.9)</div>
        </div>
        <div className="border-l-4 border-amber-500 bg-white rounded-lg shadow-sm p-4">
          <div className="text-3xl font-bold text-amber-600">{stats.average}</div>
          <div className="text-xs text-gray-500 mt-1">Trung bình (5.0-6.4)</div>
        </div>
        <div className="border-l-4 border-red-500 bg-white rounded-lg shadow-sm p-4">
          <div className="text-3xl font-bold text-red-600">{stats.poor}</div>
          <div className="text-xs text-gray-500 mt-1">Yếu (&lt;5.0)</div>
        </div>
        <div className="border-l-4 border-purple-500 bg-white rounded-lg shadow-sm p-4">
          <div className="text-3xl font-bold text-purple-600">{stats.classAverage > 0 ? stats.classAverage.toFixed(2) : '--'}</div>
          <div className="text-xs text-gray-500 mt-1">Điểm TB lớp</div>
        </div>
      </div>

      {/* Grade Table */}
      {isLoading ? (
        <Card className="p-12 text-center text-gray-500">
          Đang tải dữ liệu...
        </Card>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          Không có học sinh nào trong lớp
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    STT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-wider sticky left-12 bg-gray-50 z-10 min-w-[200px]">
                    Họ và tên
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    TX1
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    TX2
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    TX3
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    GK (x2)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    CK (x3)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider min-w-[100px]">
                    ĐTB
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, index) => {
                  const avg = calculateStudentAverage(student)
                  return (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-bold sticky left-0 bg-white z-10">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm sticky left-12 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
                            {getInitials(student.full_name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.full_name}</p>
                            <p className="text-xs text-gray-500">{student.student_code}</p>
                          </div>
                        </div>
                      </td>
                      {(['tx1_score', 'tx2_score', 'tx3_score', 'gk_score', 'ck_score'] as GradeField[]).map((field) => (
                        <td key={field} className="px-2 py-4 text-center">
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            step={0.25}
                            value={student[field] ?? ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value)
                              if (val === null || (val >= 0 && val <= 10)) {
                                updateGrade(student.student_id, field, val)
                              }
                            }}
                            disabled={isLocked}
                            className={`w-20 text-center font-semibold ${
                              student[field] !== null && student[field] !== undefined
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : ''
                            } ${isLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-4 text-center">
                        <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${getAverageColor(avg)}`}>
                          {avg}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={saveDraft}
          disabled={!hasChanges || isSaving || isLocked}
          className="gap-2"
        >
          Lưu nháp
        </Button>
        <Button variant="outline" onClick={downloadTemplate} className="gap-2">
          <Download className="h-4 w-4" />
          Tải mẫu
        </Button>
        <Button variant="outline" onClick={importExcel} className="gap-2">
          <Upload className="h-4 w-4" />
          Nhập Excel
        </Button>
        <Button
          onClick={lockGrades}
          disabled={!hasChanges || isSaving || isLocked}
          className="gap-2"
        >
          {isSaving ? 'Đang lưu...' : isLocked ? (
            <>
              <Lock className="h-4 w-4" />
              Đã khóa điểm
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Xác nhận & Khóa điểm
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
