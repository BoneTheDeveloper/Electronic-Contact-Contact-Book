// ==================== ATTENDANCE QUERY FUNCTIONS ====================
// Real Supabase queries for attendance operations
// Replaces mock data with actual database operations

import { createClient as createServerClient } from '../server'
import type { Database } from '@/types/supabase'

// ==================== TYPES ====================

export interface AttendanceRecord {
  id: string
  student_id: string
  class_id: string
  date: string
  period_id: number | null
  status: 'present' | 'absent' | 'late' | 'excused'
  notes: string | null
  recorded_by: string
  created_at: string
  updated_at: string
}

export interface AttendanceWithStudent {
  id: string
  student_id: string
  class_id: string
  date: string
  period_id: number | null
  status: 'present' | 'absent' | 'late' | 'excused'
  notes: string | null
  recorded_by: string
  created_at: string
  updated_at: string
  student: {
    id: string
    student_code: string
    full_name: string
  }
}

export interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
}

export interface StudentForAttendance {
  id: string
  student_id: string
  student_code: string
  full_name: string
  gender: 'male' | 'female' | null
  has_approved_leave: boolean
}

export interface AttendanceInput {
  student_id: string
  class_id: string
  date: string
  period_id: number | null
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  recorded_by: string
}

export interface LeaveRequestInfo {
  student_id: string
  reason: string
  start_date: string
  end_date: string
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get Supabase server client
 */
async function getSupabase() {
  return await createServerClient()
}

/**
 * Handle query errors
 */
function handleQueryError(error: { message?: string; code?: string }, context: string): never {
  console.error(`Supabase query error [${context}]:`, error)
  throw new Error(`${context}: ${error.message || 'Unknown error'}`)
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get students in a class for attendance marking
 * Includes approved leave request information
 */
export async function getClassStudentsForAttendance(
  classId: string,
  date: string
): Promise<StudentForAttendance[]> {
  const supabase = await getSupabase()

  // Get enrolled students
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('student_id, students!inner(id, student_code, profiles!inner(full_name, gender))')
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  if (enrollmentsError) handleQueryError(enrollmentsError, 'getClassStudentsForAttendance')

  const studentIds = (enrollments || []).map((e: any) => e.student_id)

  // Get approved leave requests for this date
  let approvedLeaveSet = new Set<string>()
  if (studentIds.length > 0) {
    const { data: leaveRequests } = await supabase
      .from('leave_requests')
      .select('student_id')
      .eq('status' as const, 'approved' as any)
      .lte('start_date' as const, date as any)
      .gte('end_date' as const, date as any)
      .in('student_id' as const, studentIds as any)

    approvedLeaveSet = new Set((leaveRequests || []).map((lr: any) => lr.student_id))
  }

  return (enrollments || []).map((e: any) => ({
    id: e.students.id,
    student_id: e.students.id,
    student_code: e.students.student_code,
    full_name: e.students.profiles.full_name || 'Unknown',
    gender: e.students.profiles.gender,
    has_approved_leave: approvedLeaveSet.has(e.students.id)
  }))
}

/**
 * Get attendance records for a class on a specific date and optional period
 */
export async function getClassAttendance(
  classId: string,
  date: string,
  periodId?: number
): Promise<AttendanceWithStudent[]> {
  const supabase = await getSupabase()

  let query = supabase
    .from('attendance')
    .select(`
      *,
      students!inner(
        id,
        student_code,
        profiles!inner(full_name)
      )
    `)
    .eq('class_id' as const, classId as any)
    .eq('date' as const, date as any)

  if (periodId !== undefined) {
    query = query.eq('period_id' as const, periodId as any)
  }

  const { data, error } = await query.order('students(student_code)')

  if (error) handleQueryError(error, 'getClassAttendance')

  return (data || []).map((record: any) => ({
    id: record.id,
    student_id: record.student_id,
    class_id: record.class_id,
    date: record.date,
    period_id: record.period_id,
    status: record.status,
    notes: record.notes,
    recorded_by: record.recorded_by,
    created_at: record.created_at,
    updated_at: record.updated_at,
    student: {
      id: record.students.id,
      student_code: record.students.student_code,
      full_name: record.students.profiles.full_name || 'Unknown'
    }
  }))
}

/**
 * Bulk save attendance records (upsert for idempotency)
 */
export async function saveAttendanceRecords(records: AttendanceInput[]): Promise<void> {
  const supabase = await getSupabase()

  const { error } = await supabase
    .from('attendance')
    .upsert(records as any[], {
      onConflict: 'student_id,class_id,date,period_id'
    })

  if (error) handleQueryError(error, 'saveAttendanceRecords')
}

/**
 * Get attendance statistics for a class
 */
export async function getAttendanceStats(
  classId: string,
  date: string,
  periodId?: number
): Promise<AttendanceStats> {
  const supabase = await getSupabase()

  let query = supabase
    .from('attendance')
    .select('status')
    .eq('class_id' as const, classId as any)
    .eq('date' as const, date as any)

  if (periodId !== undefined) {
    query = query.eq('period_id' as const, periodId as any)
  }

  const { data, error } = await query

  if (error) handleQueryError(error, 'getAttendanceStats')

  const stats: AttendanceStats = {
    total: data?.length || 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  }

  data?.forEach((record: any) => {
    const status = record.status as keyof AttendanceStats
    if (status in stats) {
      stats[status]++
    }
  })

  return stats
}

/**
 * Get approved leave requests for students in a class on a specific date
 */
export async function getApprovedLeaveRequests(
  classId: string,
  date: string
): Promise<LeaveRequestInfo[]> {
  const supabase = await getSupabase()

  // Get student IDs from enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  const studentIds = (enrollments || []).map((e: any) => e.student_id)

  if (studentIds.length === 0) return []

  // Get approved leave requests
  const { data, error } = await supabase
    .from('leave_requests')
    .select('student_id, reason, start_date, end_date')
    .eq('status' as const, 'approved' as any)
    .lte('start_date' as const, date as any)
    .gte('end_date' as const, date as any)
    .in('student_id' as const, studentIds as any)

  if (error) handleQueryError(error, 'getApprovedLeaveRequests')

  return (data || []).map((lr: any) => ({
    student_id: lr.student_id,
    reason: lr.reason,
    start_date: lr.start_date,
    end_date: lr.end_date
  }))
}

/**
 * Get periods for a class
 */
export async function getPeriods(): Promise<Array<{
  id: number
  name: string
  start_time: string
  end_time: string
}>> {
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from('periods')
    .select('*')
    .order('id')

  if (error) handleQueryError(error, 'getPeriods')

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    start_time: p.start_time,
    end_time: p.end_time
  }))
}

/**
 * Get students marked as absent or late for notification
 */
export async function getAbsentStudents(
  classId: string,
  date: string,
  periodId?: number
): Promise<Array<{ student_id: string; student_name: string; status: string }>> {
  const attendance = await getClassAttendance(classId, date, periodId)

  return attendance
    .filter(a => a.status === 'absent' || a.status === 'late')
    .map(a => ({
      student_id: a.student_id,
      student_name: a.student.full_name,
      status: a.status
    }))
}
