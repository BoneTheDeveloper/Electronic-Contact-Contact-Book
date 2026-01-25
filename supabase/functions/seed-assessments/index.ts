import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      authHeader.replace('Bearer ', ''),
      { auth: { autoRefreshToken: false } }
    )

    const teacherId = '33b6ed21-c8bc-4a74-8af3-73e93829aff0'

    // Create assessments
    const assessments = []
    const now = new Date()

    for (const [classId, subject] of [['6A', 'toan'], ['7B', 'ly'], ['8C', 'toan']]) {
      for (let i = 1; i <= 5; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - (i * 7))
        assessments.push({
          id: crypto.randomUUID(),
          class_id: classId,
          subject_id: subject,
          teacher_id: teacherId,
          name: i <= 3 ? `15 phút lần ${i}` : i === 4 ? 'Giữa kỳ' : 'Cuối kỳ',
          assessment_type: i <= 3 ? 'quiz' : i === 4 ? 'midterm' : 'final',
          date: date.toISOString().split('T')[0],
          max_score: 10,
          semester: '1',
          school_year: '2024-2025'
        })
      }
    }

    const { error: assessError } = await supabase.from('assessments').insert(assessments)
    if (assessError) throw assessError

    // Get students and create grades
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id, class_id')
      .in('class_id', ['6A', '7B', '8C'])
      .eq('status', 'active')

    const grades = []
    for (const assessment of assessments) {
      const students = enrollments?.filter(e => e.class_id === assessment.class_id) || []
      for (const student of students) {
        const rand = Math.random()
        let score = rand < 0.15 ? 9 + Math.random() : rand < 0.4 ? 7 + Math.random() * 2 : rand < 0.8 ? 5 + Math.random() * 2 : Math.random() * 5
        grades.push({
          id: crypto.randomUUID(),
          assessment_id: assessment.id,
          student_id: student.student_id,
          score: Math.round(score * 10) / 10,
          status: 'graded',
          graded_by: teacherId
        })
      }
    }

    const { error: gradeError } = await supabase.from('grade_entries').insert(grades)
    if (gradeError) throw gradeError

    return new Response(JSON.stringify({ success: true, assessments: assessments.length, grades: grades.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
