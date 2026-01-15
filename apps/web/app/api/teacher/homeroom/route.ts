import { NextResponse } from 'next/server'
import { getHomeroomClassData } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get('classId') || '10A1'

  const homeroomData = await getHomeroomClassData(classId)

  return NextResponse.json({
    success: true,
    data: homeroomData,
  })
}
