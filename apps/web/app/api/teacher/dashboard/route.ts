import { NextResponse } from 'next/server'
import { getTeacherStats, getGradeReviewRequests, getLeaveRequests, getTeacherSchedule, getRegularAssessments } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined

  const stats = await getTeacherStats(teacherId)
  const gradeReviews = await getGradeReviewRequests()
  const leaveRequests = await getLeaveRequests('10A1') // Use default homeroom class
  const schedule = await getTeacherSchedule(teacherId)
  const assessments = await getRegularAssessments(teacherId)

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        ...stats,
        homeroomClassId: '10A1', // Add this for leave requests
      },
      gradeReviews,
      leaveRequests: leaveRequests.filter(r => r.status === 'pending'),
      schedule,
      assessments: {
        evaluated: assessments.filter(a => a.status === 'evaluated').length,
        pending: assessments.filter(a => a.status === 'pending').length,
        positive: assessments.filter(a => a.rating && a.rating >= 4).length,
        needsAttention: assessments.filter(a => a.status === 'needs-attention').length,
      },
    },
  })
}
