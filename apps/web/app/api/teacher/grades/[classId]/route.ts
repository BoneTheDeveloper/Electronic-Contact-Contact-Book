/**
 * Teacher Grade Entry API
 * GET /api/teacher/grades/[classId] - Get students with grades for a class
 */

import { NextResponse } from 'next/server'
import { getStudentGradesForClass, getGradeLockStatus, calculateGradeStatistics, getOrCreateClassAssessments } from '@/lib/supabase/queries'

interface RouteContext {
  params: Promise<{ classId: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { classId } = await context.params
    const { searchParams } = new URL(request.url)

    const subjectId = searchParams.get('subjectId') || ''
    const schoolYear = searchParams.get('schoolYear') || '2024-2025'
    const semester = searchParams.get('semester') || '2'

    if (!subjectId) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu mã môn học'
      }, { status: 400 })
    }

    // TODO: Get real teacher ID from auth
    const teacherId = 'current-teacher-id'

    // Ensure assessments exist for this class/subject/semester
    await getOrCreateClassAssessments(classId, subjectId, schoolYear, semester, teacherId)

    // Get students with their grades
    const students = await getStudentGradesForClass(classId, subjectId, schoolYear, semester)

    // Get lock status
    const lockStatus = await getGradeLockStatus(classId, subjectId, schoolYear, semester)

    // Get statistics
    const stats = await calculateGradeStatistics(classId, subjectId, schoolYear, semester)

    return NextResponse.json({
      success: true,
      data: {
        students,
        lockStatus,
        stats,
        schoolYear,
        semester
      }
    })
  } catch (error: any) {
    console.error('Error fetching grade entries:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải dữ liệu điểm'
    }, { status: 500 })
  }
}
