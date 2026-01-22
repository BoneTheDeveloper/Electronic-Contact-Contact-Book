import { NextResponse } from 'next/server'
import { getRegularAssessments } from '@/lib/supabase/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined
  const classId = searchParams.get('classId') || undefined
  const status = searchParams.get('status') as 'evaluated' | 'pending' | 'needs-attention' | undefined

  const assessments = await getRegularAssessments(teacherId, { classId, status })

  return NextResponse.json({
    success: true,
    data: assessments,
  })
}
