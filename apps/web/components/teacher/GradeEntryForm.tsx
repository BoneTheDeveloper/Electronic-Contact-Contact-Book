'use client'

import { useState } from 'react'
import { GradeEntry } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, AlertCircle } from 'lucide-react'

interface GradeEntryFormProps {
  students: GradeEntry[]
  subject: string
  classId?: string
}

export function GradeEntryForm({ students, subject, classId }: GradeEntryFormProps) {
  const [grades, setGrades] = useState<Record<string, GradeEntry>>(
    students.reduce((acc, student) => {
      acc[student.studentId] = { ...student }
      return acc
    }, {} as Record<string, GradeEntry>)
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateScore = (
    studentId: string,
    type: 'oral' | 'quiz' | 'midterm' | 'final',
    value: string,
    index?: number
  ) => {
    const numValue = parseFloat(value)
    const student = grades[studentId]

    if (type === 'oral' && typeof index !== 'undefined') {
      const newOral = [...student.oral]
      newOral[index] = isNaN(numValue) ? 0 : numValue
      setGrades(prev => ({
        ...prev,
        [studentId]: { ...student, oral: newOral },
      }))
    } else if (type === 'quiz' && typeof index !== 'undefined') {
      const newQuiz = [...student.quiz]
      newQuiz[index] = isNaN(numValue) ? 0 : numValue
      setGrades(prev => ({
        ...prev,
        [studentId]: { ...student, quiz: newQuiz },
      }))
    } else if (type === 'midterm') {
      setGrades(prev => ({
        ...prev,
        [studentId]: { ...student, midterm: isNaN(numValue) ? 0 : numValue },
      }))
    } else if (type === 'final') {
      setGrades(prev => ({
        ...prev,
        [studentId]: { ...student, final: isNaN(numValue) ? 0 : numValue },
      }))
    }

    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${studentId}-${type}`]
      return newErrors
    })
  }

  const addOralScore = (studentId: string) => {
    const student = grades[studentId]
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...student, oral: [...student.oral, 0] },
    }))
  }

  const addQuizScore = (studentId: string) => {
    const student = grades[studentId]
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...student, quiz: [...student.quiz, 0] },
    }))
  }

  const validateScore = (value: number): boolean => {
    return value >= 0 && value <= 10
  }

  const calculateAverage = (studentId: string): number => {
    const student = grades[studentId]
    const oralAvg = student.oral.length > 0 ? student.oral.reduce((a, b) => a + b, 0) / student.oral.length : 0
    const quizAvg = student.quiz.length > 0 ? student.quiz.reduce((a, b) => a + b, 0) / student.quiz.length : 0
    const avg = (oralAvg + quizAvg * 2 + student.midterm * 3 + student.final * 4) / 10
    return Math.round(avg * 100) / 100
  }

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    // Validate all scores
    Object.entries(grades).forEach(([studentId, student]) => {
      student.oral.forEach((score, index) => {
        if (!validateScore(score)) {
          newErrors[`${studentId}-oral-${index}`] = 'Điểm phải từ 0-10'
        }
      })
      student.quiz.forEach((score, index) => {
        if (!validateScore(score)) {
          newErrors[`${studentId}-quiz-${index}`] = 'Điểm phải từ 0-10'
        }
      })
      if (!validateScore(student.midterm)) {
        newErrors[`${studentId}-midterm`] = 'Điểm phải từ 0-10'
      }
      if (!validateScore(student.final)) {
        newErrors[`${studentId}-final`] = 'Điểm phải từ 0-10'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert('Vui lòng kiểm tra lại các điểm nhập!')
      return
    }

    // Mock save - in real app, would call API
    console.log('Saving grades:', { classId, subject, grades })
    alert('Đã lưu điểm thành công!')
  }

  const getGradeBadge = (avg: number) => {
    if (avg >= 9) return <Badge variant="success">Giỏi</Badge>
    if (avg >= 7) return <Badge variant="default">Khá</Badge>
    if (avg >= 5) return <Badge variant="warning">Trung bình</Badge>
    return <Badge variant="destructive">Yếu</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Thang điểm 10</h4>
            <p className="text-sm text-blue-700 mt-1">
              • Điểm miệng: hệ số 1 • Điểm 15 phút: hệ số 2 • Điểm giữa kỳ: hệ số 3 • Điểm cuối kỳ: hệ số 4
            </p>
          </div>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">STT</TableHead>
              <TableHead className="min-w-[200px]">Họ và tên</TableHead>
              <TableHead>Điểm miệng</TableHead>
              <TableHead>Điểm 15 phút</TableHead>
              <TableHead>Điểm giữa kỳ</TableHead>
              <TableHead>Điểm cuối kỳ</TableHead>
              <TableHead>Trung bình</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              const avg = calculateAverage(student.studentId)
              return (
                <TableRow key={student.studentId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {grades[student.studentId].oral.map((score, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={score === 0 ? '' : score}
                            onChange={(e) => updateScore(student.studentId, 'oral', e.target.value, i)}
                            className="w-20"
                          />
                          {errors[`${student.studentId}-oral-${i}`] && (
                            <span className="text-xs text-red-500">
                              {errors[`${student.studentId}-oral-${i}`]}
                            </span>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addOralScore(student.studentId)}
                        type="button"
                      >
                        + Thêm
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {grades[student.studentId].quiz.map((score, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            value={score === 0 ? '' : score}
                            onChange={(e) => updateScore(student.studentId, 'quiz', e.target.value, i)}
                            className="w-20"
                          />
                          {errors[`${student.studentId}-quiz-${i}`] && (
                            <span className="text-xs text-red-500">
                              {errors[`${student.studentId}-quiz-${i}`]}
                            </span>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addQuizScore(student.studentId)}
                        type="button"
                      >
                        + Thêm
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={grades[student.studentId].midterm === 0 ? '' : grades[student.studentId].midterm}
                      onChange={(e) => updateScore(student.studentId, 'midterm', e.target.value)}
                      className="w-20"
                    />
                    {errors[`${student.studentId}-midterm`] && (
                      <span className="text-xs text-red-500 block">
                        {errors[`${student.studentId}-midterm`]}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={grades[student.studentId].final === 0 ? '' : grades[student.studentId].final}
                      onChange={(e) => updateScore(student.studentId, 'final', e.target.value)}
                      className="w-20"
                    />
                    {errors[`${student.studentId}-final`] && (
                      <span className="text-xs text-red-500 block">
                        {errors[`${student.studentId}-final`]}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-lg font-bold">{avg > 0 ? avg.toFixed(2) : '-'}</p>
                      {avg > 0 && getGradeBadge(avg)}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button">
          Hủy
        </Button>
        <Button onClick={handleSubmit} type="button">
          <Save className="h-4 w-4 mr-2" />
          Lưu điểm
        </Button>
      </div>
    </div>
  )
}
