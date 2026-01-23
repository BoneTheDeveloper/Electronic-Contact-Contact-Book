import { NextResponse } from 'next/server'
import { getClasses } from '@/lib/supabase/queries'

export async function GET(request: Request) {
  try {
    const classes = await getClasses()

    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')

    let filteredClasses = classes
    if (grade) {
      filteredClasses = filteredClasses.filter((c: { grade: string | null }) => c.grade === grade)
    }

    return NextResponse.json({
      success: true,
      data: filteredClasses,
      total: filteredClasses.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch classes'
      },
      { status: 500 }
    )
  }
}

// TODO: Implement POST for creating classes
export async function POST(request: Request) {
  return NextResponse.json(
    {
      success: false,
      error: 'Not implemented - use Supabase directly or implement class creation'
    },
    { status: 501 }
  )
}
