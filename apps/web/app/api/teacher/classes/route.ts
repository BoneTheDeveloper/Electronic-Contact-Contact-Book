import { NextResponse } from 'next/server'
import { getTeacherClasses } from '@/lib/supabase/queries'
import type { TeacherClass } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacherId') || undefined

  const classes: TeacherClass[] = await getTeacherClasses(teacherId) as any

  // Validate that all classes are for grades 6-9 (middle school)
  const validClasses = classes.filter((c: TeacherClass) =>
    ['6', '7', '8', '9'].includes(c.grade)
  )

  return NextResponse.json({
    success: true,
    data: validClasses,
  })
}
