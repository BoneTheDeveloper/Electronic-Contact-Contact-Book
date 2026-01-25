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

    // Create leave requests for 6A students
    const { data: students6A } = await supabase
      .from('students')
      .select('id')
      .in('id', enrollments?.filter(e => e.class_id === '6A').map(e => e.student_id) || [])
      .limit(9)

    const leaveRequests = [
      { student_id: students6A?.[0]?.id, class_id: '6A', request_type: 'sick', start_date: '2025-01-20', end_date: '2025-01-22', reason: 'Sốt xuất huyết', status: 'approved', created_by: students6A?.[0]?.id },
      { student_id: students6A?.[1]?.id, class_id: '6A', request_type: 'sick', start_date: '2025-01-18', end_date: '2025-01-19', reason: 'Cảm cúm', status: 'approved', created_by: students6A?.[1]?.id },
      { student_id: students6A?.[2]?.id, class_id: '6A', request_type: 'sick', start_date: '2025-01-15', end_date: '2025-01-16', reason: 'Sore throat', status: 'approved', created_by: students6A?.[2]?.id },
      { student_id: students6A?.[3]?.id, class_id: '6A', request_type: 'sick', start_date: '2025-01-24', end_date: '2025-01-24', reason: 'Đau bụng', status: 'pending', created_by: students6A?.[3]?.id },
      { student_id: students6A?.[4]?.id, class_id: '6A', request_type: 'family', start_date: '2025-01-10', end_date: '2025-01-12', reason: 'Đi đám tang', status: 'approved', created_by: students6A?.[4]?.id },
      { student_id: students6A?.[5]?.id, class_id: '6A', request_type: 'personal', start_date: '2025-01-08', end_date: '2025-01-08', reason: 'Việc riêng', status: 'rejected', created_by: students6A?.[5]?.id },
      { student_id: students6A?.[6]?.id, class_id: '6A', request_type: 'personal', start_date: '2025-01-23', end_date: '2025-01-23', reason: 'Đi khám bác sĩ', status: 'pending', created_by: students6A?.[6]?.id },
      { student_id: students6A?.[7]?.id, class_id: '6A', request_type: 'sick', start_date: '2025-01-22', end_date: '2025-01-23', reason: 'Dị ứng', status: 'pending', created_by: students6A?.[7]?.id },
      { student_id: students6A?.[8]?.id, class_id: '6A', request_type: 'family', start_date: '2025-01-05', end_date: '2025-01-07', reason: 'Về quê', status: 'approved', created_by: students6A?.[8]?.id },
    ].filter(lr => lr.student_id)

    const { error } = await supabase.from('leave_requests').insert(leaveRequests)
    if (error) throw error

    return new Response(JSON.stringify({ success: true, leaveRequests: leaveRequests.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
