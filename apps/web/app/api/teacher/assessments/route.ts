import { NextResponse } from 'next/server'
import { getRegularAssessments } from '@/lib/supabase/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined
  const classId = searchParams.get('classId') || undefined
  const status = searchParams.get('status') as 'evaluated' | 'pending' | 'needs-attention' | undefined

  // Filter assessments based on query params (done client-side for now)
  let assessments = await getRegularAssessments(teacherId)

  if (classId) {
    assessments = assessments.filter((a: any) => a.classId === classId)
  }
  if (status) {
    assessments = assessments.filter((a: any) => a.status === status)
  }

  return NextResponse.json({
    success: true,
    data: assessments,
  })
}
