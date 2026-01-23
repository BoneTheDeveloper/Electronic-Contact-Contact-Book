import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ParentResult = {
  id: string
  name: string
  code: string
  phone: string
  email: string
}

type StudentResult = {
  id: string
  name: string
  code: string
  classId: string
  grade: string
  section: string
}

/**
 * GET /api/student-guardians
 * - Search parents (when ?search=...&type=parents)
 * - Search students (when ?search=...&type=students)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'parents' // 'parents' or 'students'

    if (!search || search.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    if (type === 'parents') {
      // Search parents by name, phone, or email
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role')
        .eq('role', 'parent')
        .eq('status', 'active')
        .or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
        .limit(10)

      if (error) {
        console.error('[API] Error searching parents:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      const results: ParentResult[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.full_name,
        code: p.id.slice(0, 10),
        phone: p.phone || '',
        email: p.email,
      }))

      return NextResponse.json({
        success: true,
        data: results,
      })
    } else {
      // Search students by name, student_code, or class
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_code,
          grade,
          section,
          class_id,
          profiles!inner(
            full_name,
            status
          )
        `)
        .eq('profiles.status', 'active')
        .or(`student_code.ilike.%${search}%,profiles.full_name.ilike.%${search}%,class_id.ilike.%${search}%`)
        .limit(10)

      if (error) {
        console.error('[API] Error searching students:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      const results: StudentResult[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.profiles.full_name,
        code: s.student_code,
        classId: s.class_id,
        grade: s.grade,
        section: s.section,
      }))

      return NextResponse.json({
        success: true,
        data: results,
      })
    }
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/student-guardians
 * Create a parent-student link in student_guardians table
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { studentId, parentId, relationship, isPrimary } = body

    // Validate required fields
    if (!studentId || !parentId) {
      return NextResponse.json({
        success: false,
        error: 'studentId and parentId are required'
      }, { status: 400 })
    }

    // Check if link already exists
    const { data: existing } = await supabase
      .from('student_guardians')
      .select('*')
      .eq('student_id', studentId)
      .eq('guardian_id', parentId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Liên kết này đã tồn tại'
      }, { status: 400 })
    }

    // If this is being set as primary, unmark other primary relationships for this student
    if (isPrimary) {
      await supabase
        .from('student_guardians')
        .update({ is_primary: false })
        .eq('student_id', studentId)
    }

    // Create the link
    const { data, error } = await supabase
      .from('student_guardians')
      .insert({
        student_id: studentId,
        guardian_id: parentId,
        is_primary: isPrimary || false,
      })
      .select()
      .single()

    if (error) {
      console.error('[API] Error creating link:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/student-guardians
 * Delete a parent-student link
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const guardianId = searchParams.get('guardianId')

    if (!studentId || !guardianId) {
      return NextResponse.json({
        success: false,
        error: 'studentId and guardianId are required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('student_guardians')
      .delete()
      .eq('student_id', studentId)
      .eq('guardian_id', guardianId)

    if (error) {
      console.error('[API] Error deleting link:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
