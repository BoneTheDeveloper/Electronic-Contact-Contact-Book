import { NextResponse } from 'next/server'
import { getRegularAssessments } from '@/lib/supabase/queries'
import type { RegularAssessment } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined
  const classId = searchParams.get('classId') || undefined
  const status = searchParams.get('status') as 'evaluated' | 'pending' | 'needs-attention' | undefined

  // Filter assessments based on query params (done client-side for now)
  let assessments: RegularAssessment[] = await getRegularAssessments(teacherId) as any

  if (classId) {
    assessments = assessments.filter((a: RegularAssessment) => a.classId === classId)
  }
  if (status) {
    assessments = assessments.filter((a: RegularAssessment) => a.status === status)
  }

  return NextResponse.json({
    success: true,
    data: assessments,
  })
}
