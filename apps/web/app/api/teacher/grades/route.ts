/**
 * Teacher Grades API
 * GET /api/teacher/grades - Get teacher's classes for grade entry
 * POST /api/teacher/grades - Save grade entries
 */

import { NextResponse } from 'next/server'
import { getTeacherClasses } from '@/lib/supabase/queries'
import { saveGradeEntries, lockGrades, calculateGradeStatistics } from '@/lib/supabase/queries/grades'

export async function GET(request: Request) {
  try {
    // TODO: Get real teacher ID from auth
    const teacherId = 'current-teacher-id'

    const classes = await getTeacherClasses(teacherId)

    return NextResponse.json({
      success: true,
      classes
    })
  } catch (error: any) {
    console.error('Error fetching teacher classes:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải danh sách lớp'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { classId, subjectId, schoolYear, semester, entries, action } = body

    // TODO: Get real teacher ID from auth
    const teacherId = 'current-teacher-id'

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không có dữ liệu điểm để lưu'
      }, { status: 400 })
    }

    // Validate grade values
    for (const entry of entries) {
      if (entry.score !== null && (entry.score < 0 || entry.score > 10)) {
        return NextResponse.json({
          success: false,
          message: 'Điểm phải từ 0 đến 10'
        }, { status: 400 })
      }
    }

    // Save grade entries
    await saveGradeEntries(entries, teacherId)

    // Lock grades if requested
    if (action === 'lock') {
      await lockGrades(classId, subjectId, schoolYear, semester, teacherId)
    }

    // Calculate updated statistics
    const stats = await calculateGradeStatistics(classId, subjectId, schoolYear, semester)

    return NextResponse.json({
      success: true,
      message: action === 'lock' ? 'Đã khóa điểm thành công' : 'Đã lưu điểm thành công',
      stats
    })
  } catch (error: any) {
    console.error('Error saving grades:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể lưu điểm'
    }, { status: 500 })
  }
}
