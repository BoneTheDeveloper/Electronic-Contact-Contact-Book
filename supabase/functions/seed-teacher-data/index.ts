import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers - restrict in production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Student data seeding function for Teacher GV0001
 * SECURITY: Requires service role key or admin authorization
 * IDEMPOTENT: Checks for existing students before creating
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Security check: Verify service role or authorized admin
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Only allow service role key
    if (token !== supabaseServiceKey) {
      // Optionally check if user is admin
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false },
      })

      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Forbidden: Invalid token' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return new Response(
          JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false },
    })

    // Teacher GV0001 ID
    const teacherId = '33b6ed21-c8bc-4a74-8af3-73e93829aff0'

    // Existing parent IDs to use as guardians
    const parentIds = [
      '003e7a7a-cb6a-4950-a367-4054b00563c9',
      '00a9cf9c-07d2-411b-b305-5f37e88b3316',
      '011039b0-1065-45e6-9228-c31d420fa020',
      '015d2b63-a09a-424c-be7b-03e0e0598bc9',
      '01e84050-6efc-4353-bd77-66dba24e1575',
      '0241ba34-491e-4e58-905c-2cbac7309953',
      '02a09d4e-cf4d-4de1-93de-2c4a53a21258',
      '02b7f352-4bc4-4c36-9270-728619a62592',
      '02efb3f2-de61-4e3d-858a-f4709d40feec',
      '03ce768d-4c42-4e05-b2c3-de6a149086f9',
      '61363a34-b945-4951-ae70-6109d47f3a75', // Test parent
    ]

    // Student data: 25 students across 3 classes
    const students = [
      // 6A - 10 students (5 male, 5 female)
      { id: 'a1010001-0000-0000-0000-000000000001', email: 'hs6a001@school.edu', name: 'Nguyễn Văn An', classId: '6A', dob: '2012-03-15', gender: 'male', phone: '0901001001' },
      { id: 'a1010001-0000-0000-0000-000000000002', email: 'hs6a002@school.edu', name: 'Trần Thị Bình', classId: '6A', dob: '2012-05-20', gender: 'female', phone: '0901001002' },
      { id: 'a1010001-0000-0000-0000-000000000003', email: 'hs6a003@school.edu', name: 'Lê Văn Cường', classId: '6A', dob: '2012-07-08', gender: 'male', phone: '0901001003' },
      { id: 'a1010001-0000-0000-0000-000000000004', email: 'hs6a004@school.edu', name: 'Phạm Thị Dung', classId: '6A', dob: '2012-01-12', gender: 'female', phone: '0901001004' },
      { id: 'a1010001-0000-0000-0000-000000000005', email: 'hs6a005@school.edu', name: 'Hoàng Văn Em', classId: '6A', dob: '2012-09-25', gender: 'male', phone: '0901001005' },
      { id: 'a1010001-0000-0000-0000-000000000006', email: 'hs6a006@school.edu', name: 'Võ Thị Gái', classId: '6A', dob: '2012-11-30', gender: 'female', phone: '0901001006' },
      { id: 'a1010001-0000-0000-0000-000000000007', email: 'hs6a007@school.edu', name: 'Ngô Văn Hùng', classId: '6A', dob: '2012-04-18', gender: 'male', phone: '0901001007' },
      { id: 'a1010001-0000-0000-0000-000000000008', email: 'hs6a008@school.edu', name: 'Đặng Thị Lan', classId: '6A', dob: '2012-06-22', gender: 'female', phone: '0901001008' },
      { id: 'a1010001-0000-0000-0000-000000000009', email: 'hs6a009@school.edu', name: 'Dương Văn Minh', classId: '6A', dob: '2012-08-14', gender: 'male', phone: '0901001009' },
      { id: 'a1010001-0000-0000-0000-000000000010', email: 'hs6a010@school.edu', name: 'Bùi Thị Ngọc', classId: '6A', dob: '2012-02-10', gender: 'female', phone: '0901001010' },
      // 7B - 8 students (4 male, 4 female)
      { id: 'a1010001-0000-0000-0000-000000000011', email: 'hs7b001@school.edu', name: 'Vũ Văn Phúc', classId: '7B', dob: '2011-05-12', gender: 'male', phone: '0901002011' },
      { id: 'a1010001-0000-0000-0000-000000000012', email: 'hs7b002@school.edu', name: 'Phan Thị Quỳnh', classId: '7B', dob: '2011-08-23', gender: 'female', phone: '0901002012' },
      { id: 'a1010001-0000-0000-0000-000000000013', email: 'hs7b003@school.edu', name: 'Lý Văn Sang', classId: '7B', dob: '2011-02-17', gender: 'male', phone: '0901002013' },
      { id: 'a1010001-0000-0000-0000-000000000014', email: 'hs7b004@school.edu', name: 'Chu Thị Thảo', classId: '7B', dob: '2011-10-05', gender: 'female', phone: '0901002014' },
      { id: 'a1010001-0000-0000-0000-000000000015', email: 'hs7b005@school.edu', name: 'Trịnh Văn Tùng', classId: '7B', dob: '2011-06-30', gender: 'male', phone: '0901002015' },
      { id: 'a1010001-0000-0000-0000-000000000016', email: 'hs7b006@school.edu', name: 'Kim Thị Uyên', classId: '7B', dob: '2011-12-14', gender: 'female', phone: '0901002016' },
      { id: 'a1010001-0000-0000-0000-000000000017', email: 'hs7b007@school.edu', name: 'Đoàn Văn Vinh', classId: '7B', dob: '2011-04-08', gender: 'male', phone: '0901002017' },
      { id: 'a1010001-0000-0000-0000-000000000018', email: 'hs7b008@school.edu', name: 'Lâm Thị Xuân', classId: '7B', dob: '2011-09-19', gender: 'female', phone: '0901002018' },
      // 8C - 7 students (3 male, 4 female)
      { id: 'a1010001-0000-0000-0000-000000000019', email: 'hs8c001@school.edu', name: 'Đinh Văn Dương', classId: '8C', dob: '2010-07-22', gender: 'male', phone: '0901003019' },
      { id: 'a1010001-0000-0000-0000-000000000020', email: 'hs8c002@school.edu', name: 'Giang Thị Hà', classId: '8C', dob: '2010-11-15', gender: 'female', phone: '0901003020' },
      { id: 'a1010001-0000-0000-0000-000000000021', email: 'hs8c003@school.edu', name: 'Yên Văn Hoàng', classId: '8C', dob: '2010-03-28', gender: 'male', phone: '0901003021' },
      { id: 'a1010001-0000-0000-0000-000000000022', email: 'hs8c004@school.edu', name: 'Kiều Thị Iris', classId: '8C', dob: '2010-06-09', gender: 'female', phone: '0901003022' },
      { id: 'a1010001-0000-0000-0000-000000000023', email: 'hs8c005@school.edu', name: 'La Văn Khôi', classId: '8C', dob: '2010-09-17', gender: 'male', phone: '0901003023' },
      { id: 'a1010001-0000-0000-0000-000000000024', email: 'hs8c006@school.edu', name: 'Mai Thị Lan', classId: '8C', dob: '2010-01-31', gender: 'female', phone: '0901003024' },
      { id: 'a1010001-0000-0000-0000-000000000025', email: 'hs8c007@school.edu', name: 'Mạc Thị Mai', classId: '8C', dob: '2010-05-13', gender: 'female', phone: '0901003025' },
    ]

    const results = {
      created: [],
      skipped: [], // For idempotency
      errors: [],
    }

    // Get existing student IDs to check idempotency
    const { data: existingStudents } = await supabase
      .from('students')
      .select('id')
      .in('id', students.map(s => s.id))

    const existingIds = new Set(existingStudents?.map(s => s.id) || [])

    // Process each student
    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      const parentIndex = i % parentIds.length

      try {
        // IDEMPOTENCY: Skip if student already exists
        if (existingIds.has(student.id)) {
          results.skipped.push(student.email)
          continue
        }

        // 1. Create auth user with admin API
        const { error: userError } = await supabase.auth.admin.createUser({
          id: student.id,
          email: student.email,
          email_confirm: true,
          user_metadata: { full_name: student.name },
          app_metadata: { role: 'student' },
        })

        if (userError) throw new Error(`Auth: ${userError.message}`)

        // 2. Profile is auto-created by trigger, create student record
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: student.id,
            date_of_birth: student.dob,
            gender: student.gender,
          })

        if (studentError) throw new Error(`Student: ${studentError.message}`)

        // 3. Create enrollment
        const { error: enrollmentError } = await supabase
          .from('enrollments')
          .insert({
            student_id: student.id,
            class_id: student.classId,
            academic_year: '2024-2025',
            status: 'active',
          })

        if (enrollmentError) throw new Error(`Enrollment: ${enrollmentError.message}`)

        // 4. Link to guardian
        const { error: guardianError } = await supabase
          .from('student_guardians')
          .insert({
            student_id: student.id,
            guardian_id: parentIds[parentIndex],
            is_primary: true,
          })

        if (guardianError) throw new Error(`Guardian: ${guardianError.message}`)

        results.created.push(student.email)
      } catch (error) {
        results.errors.push({ student: student.email, error: error.message })
      }
    }

    // Update class student counts (calculate actual count)
    const { data: classCounts } = await supabase
      .from('enrollments')
      .select('class_id')
      .in('class_id', ['6A', '7B', '8C'])

    const counts = { '6A': 0, '7B': 0, '8C': 0 }
    classCounts?.forEach(e => { if (counts[e.class_id] !== undefined) counts[e.class_id]++ })

    await supabase.from('classes').update({ current_students: counts['6A'] }).eq('id', '6A')
    await supabase.from('classes').update({ current_students: counts['7B'] }).eq('id', '7B')
    await supabase.from('classes').update({ current_students: counts['8C'] }).eq('id', '8C')

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created ${results.created.length} students, skipped ${results.skipped.length} existing`,
        results,
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
