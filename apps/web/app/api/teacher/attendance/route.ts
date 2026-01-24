/**
 * Teacher Attendance API Routes
 * Real database integration for attendance operations
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getClassAttendance,
  getAttendanceStats,
  getPeriods,
  getClassStudentsForAttendance,
  getApprovedLeaveRequests,
  saveAttendanceRecords,
  getAbsentStudents
} from '@/lib/supabase/queries/attendance'
import { requireAuth } from '@/lib/auth'
import {
  sendAttendanceNotifications
} from '@/lib/services/attendance-notification-service'

/**
 * GET /api/teacher/attendance
 * Query params:
 * - classId: string (required)
 * - date: string (ISO date format, required)
 * - periodId: number (optional)
 *
 * Returns attendance records for a class on a specific date
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'teacher') {
      return NextResponse.json({
        success: false,
        message: 'Chỉ giáo viên mới có thể truy cập điểm danh'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const date = searchParams.get('date')
    const periodId = searchParams.get('periodId')

    if (!classId || !date) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu tham số bắt buộc: classId, date'
      }, { status: 400 })
    }

    // Fetch data in parallel
    const [attendance, stats, periods] = await Promise.all([
      getClassAttendance(
        classId,
        date,
        periodId ? parseInt(periodId) : undefined
      ),
      getAttendanceStats(
        classId,
        date,
        periodId ? parseInt(periodId) : undefined
      ),
      getPeriods()
    ])

    return NextResponse.json({
      success: true,
      data: attendance,
      stats,
      periods
    })
  } catch (error: any) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải dữ liệu điểm danh'
    }, { status: 500 })
  }
}

/**
 * POST /api/teacher/attendance
 * Body: {
 *   classId: string
 *   date: string
 *   periodId?: number
 *   records: Array<{
 *     student_id: string
 *     status: 'present' | 'absent' | 'late' | 'excused'
 *     notes?: string
 *   }>
 *   sendNotifications?: boolean
 * }
 *
 * Save attendance records for a class and optionally send notifications
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'teacher') {
      return NextResponse.json({
        success: false,
        message: 'Chỉ giáo viên mới có thể lưu điểm danh'
      }, { status: 403 })
    }

    const body = await request.json()
    const { classId, date, periodId, records, sendNotifications = true } = body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Dữ liệu điểm danh không hợp lệ'
      }, { status: 400 })
    }

    if (!classId || !date) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu tham số bắt buộc: classId, date'
      }, { status: 400 })
    }

    // Prepare records for database
    const attendanceRecords = records.map((r: any) => ({
      student_id: r.student_id,
      class_id: classId,
      date,
      period_id: periodId || null,
      status: r.status,
      notes: r.notes || null,
      recorded_by: user.id
    }))

    // Save attendance records
    await saveAttendanceRecords(attendanceRecords)

    // Send notifications for absent/late students if requested
    let notificationResult = { sent: 0, failed: 0 }
    if (sendNotifications) {
      // Find absent and late students
      const absentStudents = records
        .filter((r: any) => r.status === 'absent' || r.status === 'late')
        .map((r: any) => ({
          student_id: r.student_id,
          student_name: r.student_name || '', // Will be resolved in notification service
          status: r.status
        }))

      if (absentStudents.length > 0) {
        // Get student names from database
        const supabase = await createClient()
        const studentIds = absentStudents.map((s: any) => s.student_id)

        const { data: studentsData } = await supabase
          .from('students')
          .select('id, profiles!inner(full_name)')
          .in('id' as const, studentIds as any)

        const studentNamesMap = new Map((studentsData || []).map((s: any) => [s.id, s.profiles.full_name]))

        const enrichedAbsentStudents = absentStudents.map((s: any) => ({
          student_id: s.student_id,
          student_name: studentNamesMap.get(s.student_id) || 'Học sinh',
          status: s.status
        }))

        notificationResult = await sendAttendanceNotifications(
          classId,
          date,
          enrichedAbsentStudents,
          periodId
        )
      }
    }

    // Calculate stats for response
    const stats = await getAttendanceStats(
      classId,
      date,
      periodId
    )

    return NextResponse.json({
      success: true,
      message: notificationResult.sent > 0
        ? `Đã lưu điểm danh và gửi ${notificationResult.sent} thông báo`
        : 'Đã lưu điểm danh thành công',
      stats,
      notifications: notificationResult
    })
  } catch (error: any) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể lưu điểm danh'
    }, { status: 500 })
  }
}
