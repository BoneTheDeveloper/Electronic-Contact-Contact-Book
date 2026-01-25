/**
 * Teacher Classes API
 * GET /api/teacher/classes
 * Returns all classes assigned to the current teacher (both homeroom and subject teacher)
 */

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getTeacherClasses } from '@/lib/services/teacher-assignment-service'
import type { TeacherClass } from '@/lib/types'

/**
 * GET /api/teacher/classes
 * Returns classes where current teacher is either:
 * - Homeroom teacher (GVCN)
 * - Subject teacher (GVBM)
 */
export async function GET() {
  try {
    const user = await requireAuth()

    if (user.role !== 'teacher') {
      return NextResponse.json({
        success: false,
        message: 'Chỉ giáo viên mới có thể truy cập'
      }, { status: 403 })
    }

    const classes = await getTeacherClasses(user.id)

    // Filter for middle school grades (6-9)
    const validClasses = classes.filter((c) =>
      ['6', '7', '8', '9'].includes(c.grade)
    )

    return NextResponse.json({
      success: true,
      data: validClasses,
    })
  } catch (error: any) {
    console.error('Error fetching teacher classes:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Không thể tải danh sách lớp'
    }, { status: 500 })
  }
}
