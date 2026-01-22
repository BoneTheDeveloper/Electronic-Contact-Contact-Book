// @ts-nocheck
// ==================== SUPABASE DATA LAYER ====================
// Real Supabase queries replacing all mock data functions
// Uses server client for server components (async)

import { createClient as createServerClient } from './server'
import { Database } from '@/types/supabase'
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
 * Get all users with their profiles
 * Replaces: getUsers()
 */
export async function getUsers(): Promise<User[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, status, avatar_url')
    .order('created_at', { ascending: false })

  if (error) handleQueryError(error, 'getUsers')

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.full_name || p.email.split('@')[0],
    email: p.email,
    role: p.role as User['role'],
    status: p.status as User['status'],
    avatar: p.avatar_url || undefined
  }))
}

/**
 * Get user by ID
 * Replaces: getUserById(id)
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name, status, avatar_url')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    handleQueryError(error, 'getUserById')
  }

  if (!data) return null

  return {
    id: data.id,
    name: data.full_name || data.email.split('@')[0],
    email: data.email,
    role: data.role as User['role'],
    status: data.status as User['status'],
    avatar: data.avatar_url || undefined
  }
}

/**
 * Create new user profile
 * Note: Auth user is created separately via Supabase Auth
 */
export async function createUser(data: {
  id: string
  email: string
  role: 'admin' | 'teacher' | 'parent' | 'student'
  full_name?: string
  phone?: string
}): Promise<User> {
  const supabase = await getSupabase()

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: data.id,
      email: data.email,
      role: data.role,
      full_name: data.full_name,
      phone: data.phone,
      status: 'active'
    })
    .select('id, email, role, full_name, status, avatar_url')
    .single()

  if (error) handleQueryError(error, 'createUser')

  return {
    id: profile.id,
    name: profile.full_name || profile.email.split('@')[0],
    email: profile.email,
    role: profile.role as User['role'],
    status: profile.status as User['status']
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
    .update(updates)
    .eq('id', id)
    .select('id, email, role, full_name, status, avatar_url')
    .single()

  if (error) handleQueryError(error, 'updateUser')

  return {
    id: data.id,
    name: data.full_name || data.email.split('@')[0],
    email: data.email,
    role: data.role as User['role'],
    status: data.status as User['status'],
    avatar: data.avatar_url || undefined
  }
}

/**
 * Delete user (sets status to inactive)
 */
export async function deleteUser(id: string): Promise<void> {
  const supabase = await getSupabase()

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'inactive' })
    .eq('id', id)

  if (error) handleQueryError(error, 'deleteUser')
}

// ==================== DASHBOARD STATS ====================

/**
 * Get dashboard statistics
 * Replaces: getDashboardStats()
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await getSupabase()

  // Get counts in parallel
  const [studentsResult, parentsResult, teachersResult, invoicesResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('invoices').select('id, status, amount')
  ])

  // Calculate attendance from today's records
  const today = new Date().toISOString().split('T')[0]
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('status')
    .eq('date', today)

  const totalAttendance = attendanceData?.length || 0
  const presentCount = attendanceData?.filter((a) => a.status === 'present').length || 0
  const attendanceRate = totalAttendance > 0
    ? Math.round((presentCount / totalAttendance) * 100)
    : 100

  // Calculate payment stats
  const invoices = invoicesResult.data || []
  const totalAmount = invoices.reduce((sum: number, inv) => sum + inv.total_amount, 0)
  const collectedAmount = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum: number, inv) => sum + inv.paid_amount, 0)
  const pendingCount = invoices.filter((inv) => ['pending', 'partial'].includes(inv.status)).length
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    students: studentsResult.count || 0,
    parents: parentsResult.count || 0,
    teachers: teachersResult.count || 0,
    attendance: `${attendanceRate}%`,
    feesCollected: `${collectionRate}%`,
    revenue: collectedAmount,
    pendingPayments: pendingCount + overdueCount
  }
}

/**
 * Get teacher-specific statistics
 * Replaces: getTeacherStats(teacherId)
 */
export async function getTeacherStats(teacherId: string): Promise<TeacherStats> {
  const supabase = await getSupabase()

  // Get homeroom class count
  const { count: homeroomCount } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })

  // Get teaching classes count
  const { count: teachingCount } = await supabase
    .from('schedules')
    .select('id', { count: 'exact', head: true })
    .eq('teacher_id', teacherId)

  // Get student count (unique students in all classes)
  const { data: classData } = await supabase
    .from('schedules')
    .select('class_id')
    .eq('teacher_id', teacherId)

  const classIds = [...new Set(classData?.map((c) => c.class_id) || [])]
  let studentCount = 0

  if (classIds.length > 0) {
    const { count } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .in('class_id', classIds)
      .eq('status', 'active')
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
    .eq('teacher_id', teacherId)
    .eq('day_of_week', dayOfWeek)

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
    .eq('recorded_by', teacherId)
    .eq('date', todayDate)
    .is('recorded_by', null)

  const { count: pendingGrades } = await supabase
    .from('grade_entries')
    .select('id', { count: 'exact', head: true })
    .eq('graded_by', teacherId)
    .eq('status', 'pending')

  const { count: gradeReviewRequests } = await supabase
    .from('grade_entries')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: leaveRequests } = await supabase
    .from('leave_requests')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

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
}

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
    .eq('enrollments.status', 'active')

  if (error) handleQueryError(error, 'getStudents')

  // Get attendance percentage for each student
  const studentIds = (data || []).map((s: any) => s.id)
  const attendanceMap = new Map<string, number>()

  if (studentIds.length > 0) {
    const { data: attendanceData } = await supabase
      .from('attendance')
      .select('student_id, status')
      .in('student_id', studentIds)

    attendanceData?.forEach((record) => {
      const current = attendanceMap.get(record.student_id) || 0
      attendanceMap.set(record.student_id, current + (record.status === 'present' ? 1 : 0))
    })
  }

  // Get fee status from latest invoice
  const { data: invoiceData } = await supabase
    .from('invoices')
    .select('student_id, status')
    .in('student_id', studentIds)
    .order('due_date', { ascending: false })

  const feeStatusMap = new Map<string, Student['feesStatus']>()
  invoiceData?.forEach((inv) => {
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
 * Get all classes
 * Replaces: getClasses()
 */
export async function getClasses(): Promise<Class[]> {
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
    .eq('status', 'active')
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
}

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
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleQueryError(error, 'getClassById')
  }

  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    grade: data.grades.name,
    teacher: '',
    studentCount: data.current_students,
    room: data.room || ''
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
    .eq('class_id', classId)
    .eq('status', 'active')

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
 * Get all invoices
 * Replaces: getInvoices()
 */
export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('invoice_summary')
    .select('*')
    .order('due_date', { ascending: false })

  if (error) handleQueryError(error, 'getInvoices')

  return (data || []).map((inv) => ({
    id: inv.id,
    studentId: inv.student_id,
    studentName: inv.student_name,
    amount: inv.total_amount,
    status: inv.status as Invoice['status'],
    dueDate: inv.due_date,
    paidDate: inv.paid_date || undefined
  }))
}

/**
 * Get invoice by ID
 * Replaces: getInvoiceById(id)
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('invoice_summary')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    handleQueryError(error, 'getInvoiceById')
  }

  if (!data) return null

  return {
    id: data.id,
    studentId: data.student_id,
    studentName: data.student_name,
    amount: data.total_amount,
    status: data.status as Invoice['status'],
    dueDate: data.due_date,
    paidDate: data.paid_date || undefined
  }
}

/**
 * Get fee assignments
 * Replaces: getFeeAssignments()
 */
export async function getFeeAssignments(): Promise<FeeAssignment[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('fee_assignments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) handleQueryError(error, 'getFeeAssignments')

  return (data || []).map((fa) => ({
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
}

/**
 * Get fee items
 * Replaces: getFeeItems(filters)
 */
export async function getFeeItems(filters?: {
  semester?: string
  type?: 'mandatory' | 'voluntary'
}): Promise<FeeItem[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('fee_items')
    .select('*')
    .eq('status', 'active')

  if (filters?.semester && filters.semester !== 'all') {
    query = query.eq('semester', filters.semester as '1' | '2')
  }

  if (filters?.type) {
    query = query.eq('fee_type', filters.type)
  }

  const { data, error } = await query.order('name')

  if (error) handleQueryError(error, 'getFeeItems')

  return (data || []).map((fi) => ({
    id: fi.id,
    name: fi.name,
    code: fi.code,
    type: fi.fee_type as FeeItem['type'],
    amount: fi.amount,
    semester: fi.semester as FeeItem['semester'],
    status: fi.status as FeeItem['status']
  }))
}

/**
 * Get payment statistics
 * Replaces: getPaymentStats()
 */
export async function getPaymentStats(): Promise<{
  totalAmount: number
  collectedAmount: number
  pendingCount: number
  overdueCount: number
  collectionRate: number
}> {
  const supabase = await getSupabase()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total_amount, paid_amount, status')

  if (!invoices) {
    return { totalAmount: 0, collectedAmount: 0, pendingCount: 0, overdueCount: 0, collectionRate: 0 }
  }

  const totalAmount = invoices.reduce((sum: number, inv) => sum + inv.total_amount, 0)
  const collectedAmount = invoices.reduce((sum: number, inv) => sum + inv.paid_amount, 0)
  const pendingCount = invoices.filter((inv) => ['pending', 'partial'].includes(inv.status)).length
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    totalAmount,
    collectedAmount,
    pendingCount,
    overdueCount,
    collectionRate
  }
}

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
  let startDate = new Date()

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

  data?.forEach((record) => {
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

  const { data } = await supabase
    .from('attendance')
    .select('status')

  const counts = {
    present: 0,
    absent: 0,
    late: 0
  }

  data?.forEach((record) => {
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
    .eq('class_id', classId)
    .eq('status', 'active')

  if (error) handleQueryError(error, 'getClassStudents')

  return (data || []).map((e: any) => ({
    studentId: e.student_id,
    studentName: e.students.profiles.full_name || 'Unknown',
    status: 'present' as const
  }))
}

// ==================== ACADEMICS ====================

/**
 * Get assessments for a teacher
 * Replaces: getAssessments(teacherId)
 */
export async function getAssessments(teacherId: string): Promise<Assessment[]> {
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
    .eq('teacher_id', teacherId)
    .order('date', { ascending: false })

  if (error) handleQueryError(error, 'getAssessments')

  // Get submission counts
  const assessmentIds = (data || []).map((a) => a.id)
  const submissionMap = new Map<string, { submitted: number; total: number }>()

  if (assessmentIds.length > 0) {
    const { data: gradeEntries } = await supabase
      .from('grade_entries')
      .select('assessment_id, status')
      .in('assessment_id', assessmentIds)

    gradeEntries?.forEach((entry) => {
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
}

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
    .eq('class_id', classId)
    .eq('status', 'active')

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
 * Get teacher's classes
 * Replaces: getTeacherClasses(teacherId)
 */
export async function getTeacherClasses(teacherId?: string): Promise<TeacherClass[]> {
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
    query = query.eq('teacher_id', teacherId)
  }

  const { data, error } = await query

  if (error) handleQueryError(error, 'getTeacherClasses')

  // Group by class and get unique classes
  const classMap = new Map<string, TeacherClass>()

  data?.forEach((s: any) => {
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
}

/**
 * Get teacher schedule
 * Replaces: getTeacherSchedule(teacherId, date)
 */
export async function getTeacherSchedule(
  teacherId?: string,
  date?: string
): Promise<TeacherScheduleItem[]> {
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
    .eq('teacher_id', teacherId)
    .eq('day_of_week', dayOfWeek)
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
}

// ==================== LEAVE REQUESTS ====================

/**
 * Get leave requests for a class
 * Replaces: getLeaveRequests(classId, status)
 */
export async function getLeaveRequests(
  classId: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequest[]> {
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
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
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
}

// ==================== NOTIFICATIONS ====================

/**
 * Get notifications
 * Replaces: getNotifications()
 */
export async function getNotifications(): Promise<Notification[]> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) handleQueryError(error, 'getNotifications')

  return (data || []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.content,
    type: n.type as Notification['type'],
    targetRole: 'all' as const, // Would need to map from recipient
    createdAt: n.created_at
  }))
}

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
    .eq('status', 'paid')

  const totalAmount = invoices?.reduce((sum: number, inv) => sum + inv.total_amount, 0) || 0
  const paidAmount = invoices?.reduce((sum: number, inv) => sum + inv.paid_amount, 0) || 0
  const remainingAmount = totalAmount - paidAmount

  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'student')

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

  const counts = {
    paid: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    overdue: { count: 0, amount: 0 }
  }

  data?.forEach((inv) => {
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
