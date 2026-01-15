import { NextResponse } from 'next/server'
import { getTeacherClasses } from '@/lib/mock-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined

  const classes = await getTeacherClasses(teacherId)

  return NextResponse.json({
    success: true,
    data: classes,
  })
}
