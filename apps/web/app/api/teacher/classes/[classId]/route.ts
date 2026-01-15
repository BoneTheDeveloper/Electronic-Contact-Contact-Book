import { NextResponse } from 'next/server'
import { getClassManagementData } from '@/lib/mock-data'

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
