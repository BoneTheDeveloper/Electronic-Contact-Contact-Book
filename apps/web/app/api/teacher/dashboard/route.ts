import { NextResponse } from 'next/server'
import { getTeacherStats, getGradeReviewRequests, getLeaveRequests, getTeacherSchedule, getRegularAssessments, getTeacherClasses } from '@/lib/mock-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId') || undefined

    // Get classes first to find homeroom class
    const teacherClasses = await getTeacherClasses(teacherId).catch(() => [])
    const homeroomClass = teacherClasses.find((c: any) => c.isHomeroom)
    const homeroomClassId = homeroomClass?.id || '6A1'  // Dynamic fallback to grade 6

    const [stats, gradeReviews, leaveRequests, schedule, assessments, classes] = await Promise.all([
      getTeacherStats(teacherId).catch(() => ({ teaching: 0, homeroom: 'N/A', gradeReviewRequests: 0, leaveRequests: 0, pendingGrades: 0 })),
      getGradeReviewRequests().catch(() => []),
      getLeaveRequests(homeroomClassId).catch(() => []),  // Use dynamic classId
      getTeacherSchedule(teacherId).catch(() => []),
      getRegularAssessments(teacherId).catch(() => []),
      Promise.resolve(teacherClasses),
    ])

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          ...stats,
          homeroomClassId,  // Dynamic class ID (6A1, 7A1, etc.)
        },
        gradeReviews: gradeReviews || [],
        leaveRequests: (leaveRequests || []).filter((r: any) => r.status === 'pending'),
        schedule: schedule || [],
        classes: classes || [],
        assessments: {
          evaluated: (assessments || []).filter((a: any) => a.status === 'evaluated').length,
          pending: (assessments || []).filter((a: any) => a.status === 'pending').length,
          positive: (assessments || []).filter((a: any) => a.rating && a.rating >= 4).length,
          needsAttention: (assessments || []).filter((a: any) => a.status === 'needs-attention').length,
        },
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load dashboard data',
      data: {
        stats: { teaching: 0, homeroom: 'N/A', gradeReviewRequests: 0, leaveRequests: 0, pendingGrades: 0 },
        gradeReviews: [],
        leaveRequests: [],
        classes: [],
        schedule: [],
        assessments: { evaluated: 0, pending: 0, positive: 0, needsAttention: 0 },
      },
    }, { status: 500 })
  }
}
