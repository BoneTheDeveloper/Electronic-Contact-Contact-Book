import { NextResponse } from 'next/server'
import { getStudentsByClass } from '@/lib/supabase/queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params
  const classData = await getClassManagementData(classId)

  return NextResponse.json({
    success: true,
    data: classData,
  })
}
