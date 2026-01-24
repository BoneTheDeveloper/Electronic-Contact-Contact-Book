import { NextResponse } from 'next/server'
import { getTeacherStats, getLeaveRequests, getTeacherSchedule, getRegularAssessments, getTeacherClasses, getGradeReviewRequests } from '@/lib/supabase/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId') || undefined

    interface TeacherClass {
      id: string
      isHomeroom?: boolean
    }

    // Get classes first to find homeroom class
    const teacherClasses = await getTeacherClasses(teacherId).catch(() => [])
    const homeroomClass = teacherClasses.find((c: TeacherClass) => c.isHomeroom)
    const homeroomClassId = homeroomClass?.id || '6A1'  // Dynamic fallback to grade 6

    const [stats, gradeReviews, leaveRequests, schedule, assessments, classes] = await Promise.all([
      getTeacherStats(teacherId || '').catch(() => ({ teaching: 0, homeroom: 0, students: 0, pendingAttendance: 0, pendingGrades: 0, gradeReviewRequests: 0, leaveRequests: 0, todaySchedule: [] })),
      getGradeReviewRequests(teacherId || '').catch(() => []),
      getLeaveRequests(homeroomClassId).catch(() => []),  // Use dynamic classId
      getTeacherSchedule(teacherId || '').catch(() => []),
      getRegularAssessments(teacherId || '').catch(() => []),
      Promise.resolve(teacherClasses),
    ])

    interface LeaveRequest {
      status: string
    }

    interface Assessment {
      status: string
      rating?: number
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...stats,
          homeroomClassId,  // Dynamic class ID (6A1, 7A1, etc.)
        },
        gradeReviews: gradeReviews || [],
        leaveRequests: (leaveRequests || []).filter((r: LeaveRequest) => r.status === 'pending'),
        schedule: schedule || [],
        classes: classes || [],
        assessments: {
          evaluated: (assessments || []).filter((a: Assessment) => a.status === 'evaluated').length,
          pending: (assessments || []).filter((a: Assessment) => a.status === 'pending').length,
          positive: (assessments || []).filter((a: Assessment) => a.rating && a.rating >= 4).length,
          needsAttention: (assessments || []).filter((a: Assessment) => a.status === 'needs-attention').length,
        },
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load dashboard data',
      data: {
        stats: { teaching: 0, homeroom: 0, students: 0, pendingAttendance: 0, pendingGrades: 0, gradeReviewRequests: 0, leaveRequests: 0, todaySchedule: [] },
        gradeReviews: [],
        leaveRequests: [],
        classes: [],
        schedule: [],
        assessments: { evaluated: 0, pending: 0, positive: 0, needsAttention: 0 },
      },
    }, { status: 500 })
  }
}
