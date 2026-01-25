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

    // Get students
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id, class_id')
      .in('class_id', ['6A', '7B', '8C'])
      .eq('status', 'active')

    const today = new Date()
    let created = 0

    // Create attendance for past 20 days (weekdays only)
    for (let dayOffset = 1; dayOffset <= 20; dayOffset++) {
      const date = new Date(today)
      date.setDate(date.getDate() - dayOffset)
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const dateStr = date.toISOString().split('T')[0]

      for (let period = 1; period <= 5; period++) {
        for (const enrollment of enrollments || []) {
          const rand = Math.random()
          const status = rand < 0.85 ? 'present' : rand < 0.93 ? 'late' : rand < 0.97 ? 'excused' : 'absent'

          await supabase.from('attendance').insert({
            id: crypto.randomUUID(),
            student_id: enrollment.student_id,
            class_id: enrollment.class_id,
            date: dateStr,
            period_id: period,
            status: status,
            recorded_by: teacherId
          }).catch(() => {}) // Skip duplicates
          created++
        }
      }
    }

    return new Response(JSON.stringify({ success: true, attendance: created }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
