import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false },
    })

    const teacherId = '33b6ed21-c8bc-4a74-8af3-73e93829aff0'

    // Get all students for this teacher's classes
    const { data: studentData } = await supabase
      .from('enrollments')
      .select('student_id, class_id')
      .in('class_id', ['6A', '7B', '8C'])
      .eq('status', 'active')

    const studentsByClass: Record<string, string[]> = { '6A': [], '7B': [], '8C': [] }
    studentData?.forEach(e => {
      if (studentsByClass[e.class_id]) {
        studentsByClass[e.class_id].push(e.student_id)
      }
    })

    const results = {
      assessments: 0,
      grades: 0,
      attendance: 0,
      leaveRequests: 0,
    }

    const now = new Date()
    const assessments: any[] = []

    // 6A - Toan (5 assessments)
    for (let i = 1; i <= 5; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (i * 7))
      assessments.push({
        id: crypto.randomUUID(),
        class_id: '6A',
        subject_id: 'toan',
        teacher_id: teacherId,
        name: i <= 3 ? `15 phút lần ${i}` : i === 4 ? 'Giữa kỳ' : 'Cuối kỳ',
        assessment_type: i <= 3 ? 'quiz' : i === 4 ? 'midterm' : 'final',
        date: date.toISOString().split('T')[0],
        max_score: 10,
        semester: '1',
        school_year: '2024-2025'
      })
    }

    // 7B - Ly (5 assessments)
    for (let i = 1; i <= 5; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (i * 7))
      assessments.push({
        id: crypto.randomUUID(),
        class_id: '7B',
        subject_id: 'ly',
        teacher_id: teacherId,
        name: i <= 3 ? `15 phút lần ${i}` : i === 4 ? 'Giữa kỳ' : 'Cuối kỳ',
        assessment_type: i <= 3 ? 'quiz' : i === 4 ? 'midterm' : 'final',
        date: date.toISOString().split('T')[0],
        max_score: 10,
        semester: '1',
        school_year: '2024-2025'
      })
    }

    // 8C - Toan (5 assessments)
    for (let i = 1; i <= 5; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (i * 7))
      assessments.push({
        id: crypto.randomUUID(),
        class_id: '8C',
        subject_id: 'toan',
        teacher_id: teacherId,
        name: i <= 3 ? `15 phút lần ${i}` : i === 4 ? 'Giữa kỳ' : 'Cuối kỳ',
        assessment_type: i <= 3 ? 'quiz' : i === 4 ? 'midterm' : 'final',
        date: date.toISOString().split('T')[0],
        max_score: 10,
        semester: '1',
        school_year: '2024-2025'
      })
    }

    const { error: assessError } = await supabase.from('assessments').insert(assessments)
    if (assessError) throw new Error(`Assessments: ${assessError.message}`)
    results.assessments = assessments.length

    // CREATE GRADES
    const gradeEntries: any[] = []
    for (const assessment of assessments) {
      const students = studentsByClass[assessment.class_id] || []
      for (const studentId of students) {
        const rand = Math.random()
        let score = 5
        if (rand < 0.15) score = 9 + Math.random()
        else if (rand < 0.40) score = 7 + Math.random() * 2
        else if (rand < 0.80) score = 5 + Math.random() * 2
        else score = Math.random() * 5

        gradeEntries.push({
          id: crypto.randomUUID(),
          assessment_id: assessment.id,
          student_id: studentId,
          score: Math.round(score * 10) / 10,
          status: 'graded',
          graded_by: teacherId,
          graded_at: new Date().toISOString()
        })
      }
    }

    const { error: gradeError } = await supabase.from('grade_entries').insert(gradeEntries)
    if (gradeError) throw new Error(`Grades: ${gradeError.message}`)
    results.grades = gradeEntries.length

    // CREATE ATTENDANCE (past 30 days, weekdays only)
    const today = new Date()

    for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
      const date = new Date(today)
      date.setDate(date.getDate() - dayOffset)
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dateStr = date.toISOString().split('T')[0]

      for (let period = 1; period <= 5; period++) {
        for (const [classId, students] of Object.entries(studentsByClass)) {
          for (const studentId of students) {
            const rand = Math.random()
            let status = 'present'
            if (rand < 0.03) status = 'absent'
            else if (rand < 0.10) status = 'late'
            else if (rand < 0.13) status = 'excused'

            await supabase.from('attendance').insert({
              id: crypto.randomUUID(),
              student_id: studentId,
              class_id: classId,
              date: dateStr,
              period_id: period,
              status: status,
              recorded_by: teacherId
            }).catch(() => {}) // Ignore duplicates
          }
        }
      }
    }

    // Count attendance
    const { count: attCount } = await supabase
      .from('attendance')
      .select('id', { count: 'exact', head: true })
      .eq('recorded_by', teacherId)
    results.attendance = attCount || 0

    // CREATE LEAVE REQUESTS (for 6A only)
    const leaveReasons = [
      { type: 'sick', reason: 'Sốt xuất huyết', status: 'approved' },
      { type: 'sick', reason: 'Cảm cúm', status: 'approved' },
      { type: 'sick', reason: 'Sore throat', status: 'approved' },
      { type: 'sick', reason: 'Đau bụng', status: 'pending' },
      { type: 'family', reason: 'Đi đám tang', status: 'approved' },
      { type: 'personal', reason: 'Việc riêng', status: 'rejected' },
      { type: 'personal', reason: 'Đi khám bác sĩ', status: 'pending' },
      { type: 'sick', reason: 'Dị ứng', status: 'pending' },
      { type: 'family', reason: 'Về quê', status: 'approved' },
    ]

    const students6A = studentsByClass['6A'] || []
    for (let i = 0; i < Math.min(leaveReasons.length, students6A.length); i++) {
      const lr = leaveReasons[i]
      const date = new Date()
      date.setDate(date.getDate() - (i * 3) + 5)

      await supabase.from('leave_requests').insert({
        id: crypto.randomUUID(),
        student_id: students6A[i],
        class_id: '6A',
        request_type: lr.type,
        start_date: date.toISOString().split('T')[0],
        end_date: date.toISOString().split('T')[0],
        reason: lr.reason,
        status: lr.status,
        created_by: students6A[i]
      }).catch(() => {}) // Ignore duplicates
    }

    const { count: lrCount } = await supabase
      .from('leave_requests')
      .select('id', { count: 'exact', head: true })
      .eq('class_id', '6A')
    results.leaveRequests = lrCount || 0

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data seeding complete',
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
