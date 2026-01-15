'use client'

import { useState } from 'react'
import { GradeEntry } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save, Download, Upload, Lock, Unlock, AlertCircle } from 'lucide-react'
import { GradeInputCell } from './GradeInputCell'

interface GradeEntryFormProps {
  students: GradeEntry[]
  subject: string
  classId?: string
}

interface StudentGrades {
  tx1?: number
  tx2?: number
  tx3?: number
  gk?: number
  ck?: number
}

export function GradeEntryForm({ students, subject, classId }: GradeEntryFormProps) {
  const [grades, setGrades] = useState<Record<string, StudentGrades>>(() => {
    const initial: Record<string, StudentGrades> = {}
    students.forEach((student, index) => {
      initial[student.studentId] = {
        tx1: student.oral[0] || student.oral[1] || undefined,
        tx2: student.quiz[0] || undefined,
        tx3: student.oral[2] || student.quiz[1] || undefined,
        gk: student.midterm || undefined,
        ck: student.final || undefined,
      }
    })
    return initial
  })

  const [isLocked, setIsLocked] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Calculate average: ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
  const calculateAverage = (studentId: string): string => {
    const g = grades[studentId]
    if (!g) return '--'

    const tx1 = g.tx1 ?? 0
    const tx2 = g.tx2 ?? 0
    const tx3 = g.tx3 ?? 0
    const gk = g.gk ?? 0
    const ck = g.ck ?? 0

    // Check if any required grades are missing
    if (g.tx1 === undefined || g.tx2 === undefined || g.tx3 === undefined ||
        g.gk === undefined || g.ck === undefined) {
      return '--'
    }

    const avg = ((tx1 + tx2 + tx3) * 1 + gk * 2 + ck * 3) / 8
    return avg.toFixed(2)
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

  // Calculate statistics
  const calculateStatistics = () => {
    const averages = students
      .map(s => calculateAverage(s.studentId))
      .filter(a => a !== '--')
      .map(a => parseFloat(a))

    return {
      excellent: averages.filter(a => a >= 8.0).length,
      good: averages.filter(a => a >= 6.5 && a < 8.0).length,
      average: averages.filter(a => a >= 5.0 && a < 6.5).length,
      poor: averages.filter(a => a < 5.0).length,
      classAverage: averages.length > 0
        ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(2)
        : '--',
    }
  }

  const stats = calculateStatistics()

  const updateGrade = (studentId: string, field: keyof StudentGrades, value: number | undefined) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const saveDraft = () => {
    console.log('Saving draft:', { classId, subject, grades })
    setHasChanges(false)
    alert('Đã lưu nháp thành công!')
  }

  const saveGrades = () => {
    console.log('Saving grades:', { classId, subject, grades })
    setHasChanges(false)
    alert('Đã lưu điểm thành công!')
  }

  const downloadTemplate = () => {
    alert('Tải xuống mẫu Excel...')
  }

  const importExcel = () => {
    alert('Nhập điểm từ Excel...')
  }

  return (
    <div className="space-y-6">
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
          <div className="text-3xl font-bold text-purple-600">{stats.classAverage}</div>
          <div className="text-xs text-gray-500 mt-1">Điểm TB lớp</div>
        </div>
      </div>

      {/* Lock Status */}
      <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-gray-200">
        <Badge variant={isLocked ? "destructive" : "default"} className="text-sm px-3 py-1">
          {isLocked ? 'Đã khóa điểm' : 'Chưa khóa điểm'}
        </Badge>
        <Button
          variant={isLocked ? "outline" : "default"}
          onClick={() => setIsLocked(!isLocked)}
          className="gap-2"
        >
          {isLocked ? (
            <>
              <Unlock className="h-4 w-4" />
              Mở khóa điểm
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Khóa điểm
            </>
          )}
        </Button>
      </div>

      {/* Grade Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                const avg = calculateAverage(student.studentId)
                return (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-bold sticky left-0 bg-white z-10">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold sticky left-12 bg-white z-10">
                      {student.studentName}
                    </td>
                    {(['tx1', 'tx2', 'tx3', 'gk', 'ck'] as const).map((field) => (
                      <td key={field} className="px-2 py-4 text-center">
                        <GradeInputCell
                          value={grades[student.studentId]?.[field]}
                          onChange={(val) => updateGrade(student.studentId, field, val)}
                          disabled={isLocked}
                          locked={isLocked}
                          min={0}
                          max={10}
                          step={0.25}
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={saveDraft} disabled={!hasChanges} className="gap-2">
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
        <Button onClick={saveGrades} disabled={!hasChanges || isLocked} className="gap-2">
          <Save className="h-4 w-4" />
          Lưu điểm
        </Button>
      </div>
    </div>
  )
}
