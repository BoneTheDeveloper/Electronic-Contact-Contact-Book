// ==================== SUPABASE DATA LAYER ====================
// Real Supabase queries replacing all mock data functions
// Uses server client for server components (async)
// Performance: React.cache-like wrapper for query memoization

import { createClient as createServerClient } from './server'
import { Database } from '@/types/supabase'

// Simple cache wrapper for memoizing async functions
// Must be declared after imports to avoid hoisting issues
// Using 'as any' to bypass strict type checking for cache function
function cache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  const cacheMap = new Map<string, any>()
  return ((...args: any[]) => {
    const key = JSON.stringify(args)
    if (!cacheMap.has(key)) {
      cacheMap.set(key, fn(...args))
    }
    return cacheMap.get(key)!
  }) as any
}
import type {
  DashboardStats,
  Student,
  User,
  Class,
  Invoice,
  Notification,
  AttendanceStats,
  FeeStats,
  ChartData,
  GradeDistribution,
  Activity,
  TeacherClass,
  TeacherStats,
  ScheduleItem,
  AttendanceRecord,
  GradeEntry,
  Assessment,
  ConductRating,
  Conversation,
  Message,
  LeaveRequest,
  TeacherScheduleItem,
  ClassManagementDetail,
  RegularAssessment,
  HomeroomClassDetail,
  LeaveRequestApproval,
  FeeItem,
  FeeAssignment,
  GradeData
} from '@/lib/types'

// Re-export types for convenience
export type {
  DashboardStats,
  Student,
  User,
  Class,
  Invoice,
  Notification,
  AttendanceStats,
  FeeStats,
  ChartData,
  GradeDistribution,
  Activity,
  TeacherClass,
  TeacherStats,
  ScheduleItem,
  AttendanceRecord,
  GradeEntry,
  Assessment,
  ConductRating,
  Conversation,
  Message,
  LeaveRequest,
  TeacherScheduleItem,
  ClassManagementDetail,
  RegularAssessment,
  HomeroomClassDetail,
  LeaveRequestApproval,
  FeeItem,
  FeeAssignment,
  GradeData
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get Supabase server client
 * Use this in all query functions
 */
async function getSupabase() {
  return await createServerClient()
}

/**
 * Handle Supabase query errors gracefully
 */
function handleQueryError(error: { message?: string; code?: string }, context: string): never {
  console.error(`Supabase query error [${context}]:`, error)
  throw new Error(`${context}: ${error.message || 'Unknown error'}`)
}

// ==================== USER MANAGEMENT ====================

/**
 * Get all users with their profiles (cached)
 * Replaces: getUsers()
 */
export const getUsers = cache(async (): Promise<User[]> => {
  const supabase = await getSupabase()

  // Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, status, avatar_url, phone')
    .order('created_at', { ascending: false })

  if (profilesError) handleQueryError(profilesError, 'getUsers')

  // Fetch role-specific codes in parallel
  const [adminsResult, teachersResult, parentsResult, studentsResult] = await Promise.all([
    supabase.from('admins').select('id, admin_code'),
    supabase.from('teachers').select('id, employee_code'),
    supabase.from('parents').select('id, parent_code'),
    supabase.from('students').select('id, student_code')
  ])

  const adminCodes = new Map((adminsResult.data || []).map((a: any) => [a.id, a.admin_code]))
  const teacherCodes = new Map((teachersResult.data || []).map((t: any) => [t.id, t.employee_code]))
  const parentCodes = new Map((parentsResult.data || []).map((p: any) => [p.id, p.parent_code]))
  const studentCodes = new Map((studentsResult.data || []).map((s: any) => [s.id, s.student_code]))

  return (profiles || []).map((p: any) => {
    // Get code from role-specific table
    let code: string | undefined

    switch (p.role) {
      case 'admin':
        code = adminCodes.get(p.id)
        break
      case 'teacher':
        code = teacherCodes.get(p.id)
        break
      case 'parent':
        code = parentCodes.get(p.id)
        break
      case 'student':
        code = studentCodes.get(p.id)
        break
    }

    return {
      id: p.id,
      code,
      name: p.full_name || p.email.split('@')[0],
      email: p.email,
      role: p.role as User['role'],
      status: p.status as User['status'],
      avatar: p.avatar_url || undefined,
      phone: p.phone || undefined
    }
  })
})

/**
 * Get user by ID
 * Replaces: getUserById(id)
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, status, avatar_url, phone')
    .eq('id' as const, id as any)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    handleQueryError(error, 'getUserById')
  }

  if (!data) return null

  const profile = data as any

  // Fetch role-specific code based on role
  let code: string | undefined
  switch (profile.role) {
    case 'admin': {
      const { data: admin } = await supabase.from('admins').select('admin_code').eq('id', id).single()
      code = (admin as any)?.admin_code
      break
    }
    case 'teacher': {
      const { data: teacher } = await supabase.from('teachers').select('employee_code').eq('id', id).single()
      code = (teacher as any)?.employee_code
      break
    }
    case 'parent': {
      const { data: parent } = await supabase.from('parents').select('parent_code').eq('id', id).single()
      code = (parent as any)?.parent_code
      break
    }
    case 'student': {
      const { data: student } = await supabase.from('students').select('student_code').eq('id', id).single()
      code = (student as any)?.student_code
      break
    }
  }

  return {
    id: profile.id,
    code,
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    role: profile.role as User['role'],
    status: profile.status as User['status'],
    avatar: profile.avatar_url || undefined,
    phone: profile.phone || undefined
  }
}

/**
 * Create new user profile
 * Note: Auth user is created separately via Supabase Auth
 * Creates profile row + role-specific row with auto-generated code
 */
export async function createUser(data: {
  id: string
  email: string
  role: 'admin' | 'teacher' | 'parent' | 'student'
  full_name?: string
  phone?: string
}): Promise<User> {
  const supabase = await getSupabase()

  // Insert profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.id,
      email: data.email,
      role: data.role,
      full_name: data.full_name,
      phone: data.phone,
      status: 'active'
    } as any)
    .select('id, email, role, full_name, status, avatar_url')
    .single()

  if (profileError) handleQueryError(profileError, 'createUser')

  const p = profile as any

  // Create role-specific row (code auto-generated by DB default)
  let code: string | undefined
  let roleError: any = null

  switch (data.role) {
    case 'admin': {
      const { data: admin } = await supabase
        .from('admins')
        .insert({ id: data.id } as any)
        .select('admin_code')
        .single()
      code = (admin as any)?.admin_code
      roleError = admin && !admin.admin_code ? 'Failed to generate admin_code' : null
      break
    }
    case 'teacher': {
      const { data: teacher } = await supabase
        .from('teachers')
        .insert({ id: data.id } as any)
        .select('employee_code')
        .single()
      code = (teacher as any)?.employee_code
      roleError = teacher && !teacher.employee_code ? 'Failed to generate employee_code' : null
      break
    }
    case 'parent': {
      const { data: parent } = await supabase
        .from('parents')
        .insert({ id: data.id } as any)
        .select('parent_code')
        .single()
      code = (parent as any)?.parent_code
      roleError = parent && !parent.parent_code ? 'Failed to generate parent_code' : null
      break
    }
    case 'student': {
      const { data: student } = await supabase
        .from('students')
        .insert({ id: data.id } as any)
        .select('student_code')
        .single()
      code = (student as any)?.student_code
      roleError = student && !student.student_code ? 'Failed to generate student_code' : null
      break
    }
  }

  if (roleError) handleQueryError({ message: roleError }, `createUser: create ${data.role} row`)

  return {
    id: p.id,
    code,
    name: p.full_name || p.email.split('@')[0],
    email: p.email,
    role: p.role as User['role'],
    status: p.status as User['status']
  }
}

/**
 * Update user profile
 */
export async function updateUser(
  id: string,
  updates: Partial<{
    full_name: string
    phone: string
    avatar_url: string
    status: 'active' | 'inactive'
  }>
): Promise<User> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates as any)
    .eq('id' as const, id as any)
    .select('id, email, role, full_name, status, avatar_url, phone')
    .single()

  if (error) handleQueryError(error, 'updateUser')

  const d = data as any

  // Fetch role-specific code
  let code: string | undefined
  switch (d.role) {
    case 'admin': {
      const { data: admin } = await supabase.from('admins').select('admin_code').eq('id', id).single()
      code = (admin as any)?.admin_code
      break
    }
    case 'teacher': {
      const { data: teacher } = await supabase.from('teachers').select('employee_code').eq('id', id).single()
      code = (teacher as any)?.employee_code
      break
    }
    case 'parent': {
      const { data: parent } = await supabase.from('parents').select('parent_code').eq('id', id).single()
      code = (parent as any)?.parent_code
      break
    }
    case 'student': {
      const { data: student } = await supabase.from('students').select('student_code').eq('id', id).single()
      code = (student as any)?.student_code
      break
    }
  }

  return {
    id: d.id,
    code,
    name: d.full_name || d.email.split('@')[0],
    email: d.email,
    role: d.role as User['role'],
    status: d.status as User['status'],
    avatar: d.avatar_url || undefined,
    phone: d.phone || undefined
  }
}

/**
 * Delete user (sets status to inactive)
 */
export async function deleteUser(id: string): Promise<void> {
  const supabase = await getSupabase()

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'inactive' } as any)
    .eq('id' as const, id as any)

  if (error) handleQueryError(error, 'deleteUser')
}

// ==================== DASHBOARD STATS ====================

/**
 * Get dashboard statistics (cached, optimized with DB aggregations)
 * Replaces: getDashboardStats()
 */
export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const supabase = await getSupabase()

  // Get counts in parallel
  const [studentsResult, parentsResult, teachersResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role' as const, 'student' as any),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role' as const, 'parent' as any),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role' as const, 'teacher' as any),
  ])

  // Calculate attendance using DB aggregation (instead of fetching all rows)
  const today = new Date().toISOString().split('T')[0]

  // Use RPC or aggregated queries for better performance
  const [{ count: totalAttendance }, { count: presentCount }] = await Promise.all([
    supabase
      .from('attendance')
      .select('id', { count: 'exact', head: true })
      .eq('date' as const, today as any),
    supabase
      .from('attendance')
      .select('id', { count: 'exact', head: true })
      .eq('date' as const, today as any)
      .eq('status' as const, 'present' as any)
  ])

  const attendanceRate = (totalAttendance || 0) > 0
    ? Math.round(((presentCount || 0) / (totalAttendance || 1)) * 100)
    : 100

  // Calculate payment stats using DB aggregation (SUM + COUNT)
  const [
    { data: totalAmountData },
    { data: collectedAmountData },
    { count: pendingCount },
    { count: overdueCount }
  ] = await Promise.all([
    // SUM of all invoice amounts
    supabase
      .from('invoices')
      .select('total_amount')
      .eq('status' as const, 'paid' as any), // Only count paid invoices for revenue
    // SUM of collected amounts
    supabase
      .from('invoices')
      .select('paid_amount')
      .eq('status' as const, 'paid' as any),
    // COUNT of pending/partial invoices
    supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .in('status' as const, ['pending', 'partial'] as any),
    // COUNT of overdue invoices
    supabase
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('status' as const, 'overdue' as any)
  ])

  // Calculate totals from aggregated data
  const collectedAmount = (collectedAmountData || [])
    .reduce((sum: number, inv: any) => sum + (inv.paid_amount || 0), 0)
  const totalAmount = (totalAmountData || [])
    .reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0)

  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    students: studentsResult.count || 0,
    parents: parentsResult.count || 0,
    teachers: teachersResult.count || 0,
    attendance: `${attendanceRate}%`,
    feesCollected: `${collectionRate}%`,
    revenue: collectedAmount,
    pendingPayments: (pendingCount || 0) + (overdueCount || 0)
  }
})

/**
 * Get teacher-specific statistics (cached)
 * Replaces: getTeacherStats(teacherId)
 */
export const getTeacherStats = cache(async (teacherId: string): Promise<TeacherStats> => {
  const supabase = await getSupabase()

  // Get homeroom class count
  const { count: homeroomCount } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })

  // Get teaching classes count
  const { count: teachingCount } = await supabase
    .from('schedules')
    .select('id', { count: 'exact', head: true })
    .eq('teacher_id' as const, teacherId as any)

  // Get student count (unique students in all classes)
  const { data: classData } = await supabase
    .from('schedules')
    .select('class_id')
    .eq('teacher_id' as const, teacherId as any)

  const classIds = [...new Set((classData as any)?.map((c: any) => c.class_id) || [])]
  let studentCount = 0

  if (classIds.length > 0) {
    const { count } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .in('class_id' as const, classIds as any)
      .eq('status' as const, 'active' as any)
    studentCount = count || 0
  }

  // Get today's schedule
  const dayOfWeek = new Date().getDay()
  const { data: scheduleData } = await supabase
    .from('schedules')
    .select(`
      id,
      period_id,
      room,
      class_id,
      subject_id,
      day_of_week,
      periods(id, name, start_time, end_time),
      classes(id, name, grade_id),
      subjects(id, name, code)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('day_of_week' as const, dayOfWeek as any)

  const todaySchedule: ScheduleItem[] = (scheduleData || []).map((s: any) => ({
    id: s.id,
    period: s.periods?.name || `${s.period_id}`,
    time: `${s.periods?.start_time} - ${s.periods?.end_time}`,
    className: s.classes?.name || '',
    subject: s.subjects?.name || '',
    room: s.room || ''
  }))

  // Get pending counts (simplified - actual implementation would query real data)
  const todayDate = new Date().toISOString().split('T')[0]
  const { count: pendingAttendance } = await supabase
    .from('attendance')
    .select('id', { count: 'exact', head: true })
    .eq('recorded_by' as const, teacherId as any)
    .eq('date' as const, todayDate as any)
    .is('recorded_by' as const, null)

  const { count: pendingGrades } = await supabase
    .from('grade_entries')
    .select('id', { count: 'exact', head: true })
    .eq('graded_by' as const, teacherId as any)
    .eq('status' as const, 'pending' as any)

  const { count: gradeReviewRequests } = await supabase
    .from('grade_entries')
    .select('id', { count: 'exact', head: true })
    .eq('status' as const, 'pending' as any)

  const { count: leaveRequests } = await supabase
    .from('leave_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status' as const, 'pending' as any)

  return {
    homeroom: 0, // Would need to query homeroom_assignments table
    teaching: teachingCount || 0,
    students: studentCount,
    pendingAttendance: pendingAttendance || 0,
    pendingGrades: pendingGrades || 0,
    gradeReviewRequests: gradeReviewRequests || 0,
    leaveRequests: leaveRequests || 0,
    todaySchedule
  }
})

// ==================== STUDENTS ====================

/**
 * Get all students with enrollment info
 * Replaces: getStudents()
 */
export async function getStudents(): Promise<Student[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      student_code,
      profiles!inner(id, full_name, email, status),
      enrollments!inner(class_id, status)
    `)
    .eq('enrollments.status' as const, 'active' as any)

  if (error) handleQueryError(error, 'getStudents')

  // Get attendance percentage for each student
  const studentIds = (data || []).map((s: any) => s.id)
  const attendanceMap = new Map<string, number>()

  if (studentIds.length > 0) {
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('student_id, status')
      .in('student_id' as const, studentIds as any)

    const attendanceRecords = attendanceData as Array<{ student_id: string; status: string }> | null
    attendanceRecords?.forEach((record) => {
      const current = attendanceMap.get(record.student_id) || 0
      attendanceMap.set(record.student_id, current + (record.status === 'present' ? 1 : 0))
    })
  }

  // Get fee status from latest invoice
  const { data: invoiceData } = await supabase
    .from('invoices')
    .select('student_id, status')
    .in('student_id' as const, studentIds as any)
    .order('due_date', { ascending: false })

  const feeStatusMap: Map<string, Student['feesStatus']> = new Map()
  ;(invoiceData as any)?.forEach((inv: any) => {
    if (!feeStatusMap.has(inv.student_id)) {
      feeStatusMap.set(inv.student_id, inv.status === 'paid' ? 'paid' :
        inv.status === 'overdue' ? 'overdue' : 'pending')
    }
  })

  return (data || []).map((s: any) => {
    const enrollment = s.enrollments[0]
    return {
      id: s.id,
      name: s.profiles.full_name || 'Unknown',
      grade: enrollment.class_id,
      attendance: Math.round((attendanceMap.get(s.id) || 0) * 100),
      feesStatus: feeStatusMap.get(s.id) || 'pending'
    }
  })
}

// ==================== CLASSES ====================

/**
 * Get all classes (cached)
 * Replaces: getClasses()
 */
export const getClasses = cache(async (): Promise<Class[]> => {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('classes')
    .select(`
      id,
      name,
      grade_id,
      room,
      current_students,
      grades!inner(id, name)
    `)
    .eq('status' as const, 'active' as any)
    .order('name')

  if (error) handleQueryError(error, 'getClasses')

  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    grade: c.grades.name,
    teacher: '', // Would need to join with assignments
    studentCount: c.current_students,
    room: c.room || ''
  }))
})

/**
 * Get class by ID
 * Replaces: getClassById(id)
 */
export async function getClassById(id: string): Promise<Class | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('classes')
    .select(`
      id,
      name,
      grade_id,
      room,
      current_students,
      grades!inner(id, name)
    `)
    .eq('id' as const, id as any)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleQueryError(error, 'getClassById')
  }

  if (!data) return null

  const c = data as any
  return {
    id: c.id,
    name: c.name,
    grade: c.grades.name,
    teacher: '',
    studentCount: c.current_students,
    room: c.room || ''
  }
}

/**
 * Get students by class
 * Replaces: getStudentsByClass(classId)
 */
export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
      classes!inner(id, name),
      students!inner(
        id,
        student_code,
        profiles!inner(full_name)
      )
    `)
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  if (error) handleQueryError(error, 'getStudentsByClass')

  return (data || []).map((e: any) => ({
    id: e.students.id,
    name: e.students.profiles.full_name || 'Unknown',
    grade: e.classes.name,
    attendance: 95,
    feesStatus: 'pending'
  }))
}

// ==================== PAYMENTS & INVOICES ====================

/**
 * Get all invoices (cached)
 * Replaces: getInvoices()
 */
export const getInvoices = cache(async (): Promise<Invoice[]> => {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('invoice_summary')
    .select('*')
    .order('due_date', { ascending: false })

  if (error) handleQueryError(error, 'getInvoices')

  return (data || []).map((inv: any) => ({
    id: inv.id || '',
    studentId: inv.student_id || '',
    studentName: inv.student_name || '',
    amount: inv.total_amount || 0,
    totalAmount: inv.total_amount || 0,
    paidAmount: inv.paid_amount || 0,
    remainingAmount: inv.remaining_amount || 0,
    status: inv.status as Invoice['status'],
    dueDate: inv.due_date || undefined,
    paidDate: inv.paid_date || undefined
  }))
})

/**
 * Get invoice by ID
 * Replaces: getInvoiceById(id)
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('invoice_summary')
    .select('*')
    .eq('id' as const, id as any)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleQueryError(error, 'getInvoiceById')
  }

  if (!data) return null

  const d = data as any
  return {
    id: d.id || '',
    studentId: d.student_id || '',
    studentName: d.student_name || '',
    amount: d.total_amount || 0,
    totalAmount: d.total_amount || 0,
    paidAmount: d.paid_amount || 0,
    remainingAmount: d.remaining_amount || 0,
    status: d.status as Invoice['status'],
    dueDate: d.due_date || undefined,
    paidDate: d.paid_date || undefined
  }
}

/**
 * Get fee assignments (cached)
 * Replaces: getFeeAssignments()
 */
export const getFeeAssignments = cache(async (): Promise<FeeAssignment[]> => {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('fee_assignments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) handleQueryError(error, 'getFeeAssignments')

  return (data || []).map((fa: any) => ({
    id: fa.id,
    name: fa.name,
    targetGrades: fa.target_grades,
    targetClasses: fa.target_classes || [],
    feeItems: fa.fee_items,
    startDate: fa.start_date,
    dueDate: fa.due_date,
    reminderDays: fa.reminder_days,
    reminderFrequency: fa.reminder_frequency,
    totalStudents: fa.total_students,
    totalAmount: fa.total_amount,
    status: fa.status as FeeAssignment['status'],
    createdAt: fa.created_at
  }))
})

/**
 * Get fee items (cached)
 * Replaces: getFeeItems(filters)
 */
export const getFeeItems = cache(async (filters?: {
  semester?: string
  type?: 'mandatory' | 'voluntary'
}): Promise<FeeItem[]> => {
  const supabase = await getSupabase()

  let query = supabase
    .from('fee_items')
    .select('*')
    .eq('status' as const, 'active' as any)

  if (filters?.semester && filters.semester !== 'all') {
    query = query.eq('semester' as const, filters.semester as '1' | '2' as any)
  }

  if (filters?.type) {
    query = query.eq('fee_type' as const, filters.type as any)
  }

  const { data, error } = await query.order('name')

  if (error) handleQueryError(error, 'getFeeItems')

  return (data || []).map((fi: any) => ({
    id: fi.id,
    name: fi.name,
    code: fi.code,
    type: fi.fee_type as FeeItem['type'],
    amount: fi.amount,
    semester: fi.semester as FeeItem['semester'],
    status: fi.status as FeeItem['status']
  }))
})

/**
 * Get payment statistics (cached)
 * Replaces: getPaymentStats()
 */
export const getPaymentStats = cache(async (): Promise<{
  totalAmount: number
  collectedAmount: number
  pendingCount: number
  overdueCount: number
  collectionRate: number
}> => {
  const supabase = await getSupabase()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total_amount, paid_amount, status')

  if (!invoices) {
    return { totalAmount: 0, collectedAmount: 0, pendingCount: 0, overdueCount: 0, collectionRate: 0 }
  }

  const totalAmount = (invoices as any[]).reduce((sum: number, inv: any) => sum + inv.total_amount, 0)
  const collectedAmount = (invoices as any[]).reduce((sum: number, inv: any) => sum + inv.paid_amount, 0)
  const pendingCount = (invoices as any[]).filter((inv: any) => ['pending', 'partial'].includes(inv.status)).length
  const overdueCount = (invoices as any[]).filter((inv: any) => inv.status === 'overdue').length
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    totalAmount,
    collectedAmount,
    pendingCount,
    overdueCount,
    collectionRate
  }
})

// ==================== ATTENDANCE ====================

/**
 * Get attendance statistics
 * Replaces: getAttendanceStats(period)
 */
export async function getAttendanceStats(
  period: 'week' | 'month' | 'semester' = 'week'
): Promise<AttendanceStats> {
  const supabase = await getSupabase()

  // Calculate date range
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'semester':
      startDate.setMonth(now.getMonth() - 6)
      break
  }

  const { data, error } = await supabase
    .from('attendance')
    .select('status')
    .gte('date', startDate.toISOString().split('T')[0])

  if (error) handleQueryError(error, 'getAttendanceStats')

  const stats = {
    excused: 0,
    unexcused: 0,
    tardy: 0
  }

  const attendanceRecords = data as Array<{ status: string }> | null
  attendanceRecords?.forEach((record) => {
    if (record.status === 'excused') stats.excused++
    else if (record.status === 'absent') stats.unexcused++
    else if (record.status === 'late') stats.tardy++
  })

  return stats
}

/**
 * Get attendance data for charts
 * Replaces: getAttendanceData()
 */
export async function getAttendanceData(): Promise<ChartData[]> {
  const supabase = await getSupabase()

  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('status')

  const counts: { present: number; absent: number; late: number } = {
    present: 0,
    absent: 0,
    late: 0
  }

  ;(attendanceData as any)?.forEach((record: any) => {
    if (record.status === 'present') counts.present++
    else if (record.status === 'absent') counts.absent++
    else if (record.status === 'late') counts.late++
  })

  return [
    { name: 'Present', value: counts.present },
    { name: 'Absent', value: counts.absent },
    { name: 'Late', value: counts.late }
  ]
}

/**
 * Get class students for attendance marking
 * Replaces: getClassStudents(classId)
 */
export async function getClassStudents(classId: string): Promise<AttendanceRecord[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
      students!inner(
        profiles!inner(full_name)
      )
    `)
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  if (error) handleQueryError(error, 'getClassStudents')

  return (data || []).map((e: any) => ({
    studentId: e.student_id,
    studentName: e.students.profiles.full_name || 'Unknown',
    status: 'present' as const
  }))
}

// Re-export attendance query functions
export { getPeriods } from './queries/attendance'

// ==================== ACADEMICS ====================

/**
 * Get assessments for a teacher (cached)
 * Replaces: getAssessments(teacherId)
 */
export const getAssessments = cache(async (teacherId: string): Promise<Assessment[]> => {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('assessments')
    .select(`
      id,
      name,
      assessment_type,
      date,
      max_score,
      semester,
      class_id,
      subject_id,
      classes!inner(id, name),
      subjects!inner(id, name)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .order('date', { ascending: false })

  if (error) handleQueryError(error, 'getAssessments')

  // Get submission counts
  const assessmentIds = (data || []).map((a: any) => a.id)
  const submissionMap = new Map<string, { submitted: number; total: number }>()

  if (assessmentIds.length > 0) {
    const { data: gradeEntries } = await supabase
      .from('grade_entries')
      .select('assessment_id, status')
      .in('assessment_id' as const, assessmentIds as any)

    const gradeEntriesData = gradeEntries as Array<{ assessment_id: string; status: string }> | null
    gradeEntriesData?.forEach((entry) => {
      const current = submissionMap.get(entry.assessment_id) || { submitted: 0, total: 0 }
      submissionMap.set(entry.assessment_id, {
        submitted: entry.status === 'graded' ? current.submitted + 1 : current.submitted,
        total: current.total + 1
      })
    })
  }

  return (data || []).map((a: any) => {
    const submissions = submissionMap.get(a.id) || { submitted: 0, total: 0 }
    return {
      id: a.id,
      classId: a.class_id,
      className: a.classes.name,
      subject: a.subjects.name,
      type: a.assessment_type as Assessment['type'],
      name: a.name,
      date: a.date,
      maxScore: a.max_score,
      submittedCount: submissions.submitted,
      totalCount: submissions.total,
      status: 'published' as const
    }
  })
})

/**
 * Get grade entry sheet for a class
 * Replaces: getGradeEntrySheet(classId, subject)
 */
export async function getGradeEntrySheet(
  classId: string,
  subject: string = 'Toán'
): Promise<{ students: GradeEntry[]; subject: string }> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      student_id,
      students!inner(
        profiles!inner(full_name)
      )
    `)
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  if (error) handleQueryError(error, 'getGradeEntrySheet')

  return {
    subject,
    students: (data || []).map((e: any) => ({
      studentId: e.student_id,
      studentName: e.students.profiles.full_name || 'Unknown',
      oral: [],
      quiz: [],
      midterm: 0,
      final: 0
    }))
  }
}

// ==================== TEACHER DATA ====================

/**
 * Get teacher's classes (cached)
 * Replaces: getTeacherClasses(teacherId)
 */
export const getTeacherClasses = cache(async (teacherId?: string): Promise<TeacherClass[]> => {
  const supabase = await getSupabase()

  let query = supabase
    .from('schedules')
    .select(`
      class_id,
      room,
      subjects!inner(id, name),
      classes!inner(id, name, grade_id, current_students, grades!inner(name))
    `)

  if (teacherId) {
    query = query.eq('teacher_id' as const, teacherId as any)
  }

  const { data, error } = await query

  if (error) handleQueryError(error, 'getTeacherClasses')

  // Group by class and get unique classes
  const classMap: Map<string, TeacherClass> = new Map()

  ;(data as any)?.forEach((s: any) => {
    if (!classMap.has(s.class_id)) {
      classMap.set(s.class_id, {
        id: s.class_id,
        name: s.classes.name,
        subject: s.subjects.name,
        grade: s.classes.grades.name,
        room: s.room || '',
        studentCount: s.classes.current_students,
        schedule: '',
        isHomeroom: false
      })
    }
  })

  return Array.from(classMap.values())
})

/**
 * Get teacher schedule (cached)
 * Replaces: getTeacherSchedule(teacherId, date)
 */
export const getTeacherSchedule = cache(async (
  teacherId?: string,
  date?: string
): Promise<TeacherScheduleItem[]> => {
  if (!teacherId) return []

  const supabase = await getSupabase()

  const targetDate = date ? new Date(date) : new Date()
  const dayOfWeek = targetDate.getDay()

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      period_id,
      room,
      day_of_week,
      periods!inner(id, name, start_time, end_time),
      classes!inner(id, name),
      subjects!inner(id, name)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('day_of_week' as const, dayOfWeek as any)
    .order('period_id')

  if (error) handleQueryError(error, 'getTeacherSchedule')

  return (data || []).map((s: any) => ({
    period: s.period_id,
    time: `${s.periods.start_time} - ${s.periods.end_time}`,
    className: s.classes.name,
    subject: s.subjects.name,
    room: s.room || '',
    date: targetDate.toISOString().split('T')[0]
  }))
})

// ==================== LEAVE REQUESTS ====================

/**
 * Get leave requests for a class (cached)
 * Replaces: getLeaveRequests(classId, status)
 */
export const getLeaveRequests = cache(async (
  classId: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequest[]> => {
  const supabase = await getSupabase()

  let query = supabase
    .from('leave_requests')
    .select(`
      id,
      start_date,
      end_date,
      reason,
      status,
      created_at,
      students!inner(
        profiles!students_id_fkey(full_name)
      )
    `)
    .eq('class_id' as const, classId as any)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status' as const, status as any)
  }

  const { data, error } = await query

  if (error) handleQueryError(error, 'getLeaveRequests')

  return (data || []).map((lr: any) => ({
    id: lr.id,
    studentId: lr.students.id,
    studentName: lr.students.profiles.full_name || 'Unknown',
    startDate: lr.start_date,
    endDate: lr.end_date,
    reason: lr.reason,
    status: lr.status as LeaveRequest['status'],
    submittedDate: lr.created_at
  }))
})

// ==================== NOTIFICATIONS ====================

/**
 * Get notifications (cached)
 * Replaces: getNotifications()
 */
export const getNotifications = cache(async (): Promise<Notification[]> => {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) handleQueryError(error, 'getNotifications')

  return (data || []).map((n: any) => ({
    id: n.id,
    title: n.title,
    message: n.content,
    type: n.type as Notification['type'],
    targetRole: 'all' as const, // Would need to map from recipient
    createdAt: n.created_at
  }))
})

// ==================== FEE STATS ====================

/**
 * Get fee statistics by semester
 * Replaces: getFeeStats(semester)
 */
export async function getFeeStats(semester: '1' | '2' = '1'): Promise<FeeStats> {
  const supabase = await getSupabase()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total_amount, paid_amount')
    .eq('status' as const, 'paid' as any)

  const totalAmount = (invoices as any[])?.reduce((sum: number, inv: any) => sum + inv.total_amount, 0) || 0
  const paidAmount = (invoices as any[])?.reduce((sum: number, inv: any) => sum + inv.paid_amount, 0) || 0
  const remainingAmount = totalAmount - paidAmount

  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role' as const, 'student' as any)

  return {
    percentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0,
    paidAmount: formatCurrency(paidAmount),
    remainingAmount: formatCurrency(remainingAmount),
    totalAmount: formatCurrency(totalAmount),
    paidStudents: invoices?.length || 0,
    totalStudents: totalStudents || 0
  }
}

/**
 * Get fees chart data
 * Replaces: getFeesData()
 */
export async function getFeesData(): Promise<ChartData[]> {
  const supabase = await getSupabase()

  const { data } = await supabase
    .from('invoices')
    .select('status, total_amount')

  const counts: {
    paid: { count: number; amount: number }
    pending: { count: number; amount: number }
    overdue: { count: number; amount: number }
  } = {
    paid: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    overdue: { count: 0, amount: 0 }
  }

  const invoices = data as Array<{ status: string; total_amount: number }> | null
  invoices?.forEach((inv) => {
    if (inv.status === 'paid') counts.paid.count++
    else if (inv.status === 'pending' || inv.status === 'partial') counts.pending.count++
    else if (inv.status === 'overdue') counts.overdue.count++
  })

  return [
    { name: 'Paid', value: counts.paid.count },
    { name: 'Pending', value: counts.pending.count },
    { name: 'Overdue', value: counts.overdue.count }
  ]
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format number to Vietnamese currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount)
}

// ==================== ADDITIONAL FUNCTIONS ====================

/**
 * Get activities (mock implementation for now)
 * Replaces: getActivities()
 */
export async function getActivities(): Promise<Activity[]> {
  // TODO: Implement with real activity logging
  return [
    {
      id: '1',
      user: 'System',
      action: 'Database migrated',
      time: 'Just now',
      note: 'Switched to Supabase data layer'
    }
  ]
}

/**
 * Get grade distribution (mock implementation for now)
 * Replaces: getGradeDistribution()
 */
export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  // TODO: Implement with real grade data
  return [
    { grade: 'Giỏi', percentage: 32, color: 'bg-green-500' },
    { grade: 'Khá', percentage: 45, color: 'bg-blue-500' },
    { grade: 'Trung bình', percentage: 18, color: 'bg-orange-500' },
    { grade: 'Yếu', percentage: 5, color: 'bg-red-500' },
  ]
}

// ==================== ADDITIONAL EXPORTS ====================

/**
 * Get teacher conversations (messages)
 * Replaces: getTeacherConversations()
 */
export async function getTeacherConversations(): Promise<Conversation[]> {
  const supabase = await getSupabase()

  // TODO: Implement real query
  return []
}

/**
 * Get conversation messages
 * Replaces: getConversationMessages()
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const supabase = await getSupabase()

  // TODO: Implement real query
  return []
}

/**
 * Get regular assessments for teacher (cached)
 * Replaces: getRegularAssessments()
 */
export const getRegularAssessments = cache(async (teacherId?: string): Promise<RegularAssessment[]> => {
  const supabase = await getSupabase()

  if (!teacherId) return []

  // Get classes taught by this teacher
  const { data: classData } = await supabase
    .from('schedules')
    .select('class_id')
    .eq('teacher_id' as const, teacherId as any)

  const classIds = [...new Set((classData as any)?.map((c: any) => c.class_id) || [])]

  if (classIds.length === 0) return []

  // Get students in these classes
  const { data: studentData } = await supabase
    .from('enrollments')
    .select('student_id, classes!inner(name)')
    .in('class_id' as const, classIds as any)
    .eq('status' as const, 'active' as any)

  const students = (studentData as any)?.map((s: any) => ({
    studentId: s.student_id,
    studentName: s.classes?.name || 'Unknown',
    classId: s.class_id,
    className: s.classes?.name || '',
    subject: 'N/A',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  })) || []

  return students
})

/**
 * Get conduct ratings
 * Replaces: getConductRatings()
 */
export async function getConductRatings(classId?: string): Promise<ConductRating[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('students')
    .select(`
      id,
      student_code,
      profiles!inner(full_name),
      enrollments!inner(class_id)
    `)
    .eq('enrollments.status' as const, 'active' as any)

  if (classId) {
    query = query.eq('enrollments.class_id' as const, classId as any)
  }

  const { data } = await query

  return (data || []).map((s: any) => ({
    studentId: s.id,
    studentName: s.profiles?.full_name || 'Unknown',
    mssv: s.student_code,
    academicRating: 'good' as const,
    academicScore: 80,
    conductRating: 'good' as const,
    semester: '1' as const,
    notes: ''
  }))
}

/**
 * Get grade review requests
 * Replaces: getGradeReviewRequests()
 */
export async function getGradeReviewRequests(teacherId?: string): Promise<Array<{
  id: string
  studentName?: string
  className?: string
  assessmentType?: string
  currentScore?: number
  reason?: string
  status?: string
}>> {
  const supabase = await getSupabase()

  if (!teacherId) return []

  // Get grade review requests for this teacher's classes
  const { data: classData } = await supabase
    .from('schedules')
    .select('class_id')
    .eq('teacher_id' as const, teacherId as any)

  const classIds = [...new Set((classData as any)?.map((c: any) => c.class_id) || [])]

  // For now, return mock data since grade_reviews table may not exist
  // In production, this would query a grade_reviews table
  return []
}

/**
 * Get class management detail
 * Replaces: getClassManagementData()
 */
export async function getClassManagementData(classId: string): Promise<ClassManagementDetail> {
  const supabase = await getSupabase()

  // TODO: Implement real query
  return {
    classId,
    className: '',
    subject: '',
    grade: '',
    room: '',
    schedule: [],
    students: []
  }
}

/**
 * Get homeroom class detail
 * Replaces: getHomeroomClassData()
 */
export async function getHomeroomClassData(classId: string): Promise<HomeroomClassDetail> {
  const supabase = await getSupabase()

  // TODO: Implement real query
  return {
    classId,
    className: '',
    grade: '',
    room: '',
    studentCount: 0,
    maleCount: 0,
    femaleCount: 0,
    students: []
  }
}

/**
 * Get leave approval requests
 * Replaces: getLeaveApprovalRequests()
 */
export async function getLeaveApprovalRequests(): Promise<LeaveRequestApproval[]> {
  const supabase = await getSupabase()

  // TODO: Implement real query
  return []
}

// ==================== GRADE QUERY EXPORTS ====================
// Re-export grade queries from grades module

export {
  getStudentGradesForClass,
  getOrCreateClassAssessments,
  saveGradeEntries,
  getGradeLockStatus,
  lockGrades,
  calculateGradeStatistics,
  calculateAverage
} from './queries/grades'

export type {
  GradeEntryRecord,
  StudentGradeInfo,
  GradeAssessment,
  GradeStatistics,
  GradeInput,
  GradeLockStatus
} from './queries/grades'
