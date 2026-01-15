import { NextResponse } from 'next/server'
import { getTeacherSchedule } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined
  const date = searchParams.get('date') || undefined

  const schedule = await getTeacherSchedule(teacherId, date)

  return NextResponse.json({
    success: true,
    data: schedule,
  })
}
