/**
 * Teacher Class Attendance API
 * GET /api/teacher/attendance/[classId]
 * Returns students and existing attendance for a specific class
 */

import { NextResponse } from 'next/server'
import {
  getClassStudentsForAttendance,
  getClassAttendance,
  getApprovedLeaveRequests
} from '@/lib/supabase/queries/attendance'
import { requireAuth } from '@/lib/auth'

interface RouteContext {
  params: Promise<{ classId: string }>
}

/**
 * GET /api/teacher/attendance/[classId]
 * Query params:
 * - date: string (ISO date format, required)
 * - periodId: number (optional)
 *
 * Returns students and their attendance status for a class
 */
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const user = await requireAuth()

    if (user.role !== 'teacher') {
      return NextResponse.json({
        success: false,
        message: 'Chỉ giáo viên mới có thể truy cập'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const periodId = searchParams.get('periodId')

    if (!date) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu tham số date'
      }, { status: 400 })
    }

    const { classId } = await params

    // Fetch students and existing attendance in parallel
    const [students, existingAttendance, approvedLeaves] = await Promise.all([
      getClassStudentsForAttendance(classId, date),
      getClassAttendance(
        classId,
        date,
        periodId ? parseInt(periodId) : undefined
      ),
      getApprovedLeaveRequests(classId, date)
    ])

    // Create a map of existing attendance
    const attendanceMap = new Map<string, { status: string; notes: string | null }>()
    existingAttendance.forEach((record) => {
      attendanceMap.set(record.student_id, {
        status: record.status,
        notes: record.notes
      })
    })

    // Create a map of approved leaves
    const leaveMap = new Map<string, { reason: string }>()
    approvedLeaves.forEach((leave) => {
      leaveMap.set(leave.student_id, {
        reason: leave.reason
      })
    })

    // Combine student data with attendance status
    const studentsWithAttendance = students.map((student) => {
      const existing = attendanceMap.get(student.student_id)
      const leave = leaveMap.get(student.student_id)

      return {
        id: student.id,
        student_id: student.student_id,
        student_code: student.student_code,
        full_name: student.full_name,
        gender: student.gender,
        status: existing?.status || null,
        notes: existing?.notes || null,
        has_approved_leave: student.has_approved_leave,
        approved_leave_reason: leave?.reason || null
      }
    })

    return NextResponse.json({
      success: true,
      data: studentsWithAttendance
    })
  } catch (error: any) {
    console.error('Error fetching class attendance:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải dữ liệu'
    }, { status: 500 })
  }
}
