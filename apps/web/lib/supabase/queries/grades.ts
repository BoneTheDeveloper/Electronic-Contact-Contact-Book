// ==================== GRADE QUERY FUNCTIONS ====================
// Real Supabase queries for grade operations
// Replaces mock data with actual database operations

import { createClient as createServerClient } from '../server'
import type { Database } from '@/types/supabase'

// ==================== TYPES ====================

export interface GradeEntryRecord {
  id: string
  student_id: string
  assessment_id: string
  score: number | null
  status: 'draft' | 'submitted' | 'locked'
  notes: string | null
  graded_by: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
}

export interface StudentGradeInfo {
  student_id: string
  student_code: string
  full_name: string
  tx1_score: number | null
  tx2_score: number | null
  tx3_score: number | null
  gk_score: number | null
  ck_score: number | null
  average: number | null
}

export interface GradeAssessment {
  id: string
  name: string
  assessment_type: 'tx' | 'gk' | 'ck'
  weight: number
  max_score: number
  date: string
}

export interface GradeStatistics {
  excellent: number
  good: number
  average: number
  poor: number
  classAverage: number
}

export interface GradeInput {
  student_id: string
  assessment_id: string
  score: number | null
  notes?: string
  status?: 'draft' | 'submitted' | 'locked'
}

export interface GradeLockStatus {
  is_locked: boolean
  locked_by: string | null
  locked_at: string | null
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

/**
 * Calculate weighted average: ĐTB = (TX1 + TX2 + TX3) × 1 + GK × 2 + CK × 3 ÷ 8
 */
export function calculateAverage(
  tx1: number | null,
  tx2: number | null,
  tx3: number | null,
  gk: number | null,
  ck: number | null
): number | null {
  const values = [tx1, tx2, tx3, gk, ck]
  if (values.some(v => v === null || v === undefined)) {
    return null
  }

  const weights = [1, 1, 1, 2, 3]
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  const weightedSum = values.reduce((sum: number, val, i) => {
    return sum + ((val || 0) * weights[i])
  }, 0)

  return weightedSum / totalWeight
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get students with their grades for a class, subject, and semester
 */
export async function getStudentGradesForClass(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
): Promise<StudentGradeInfo[]> {
  const supabase = await getSupabase()

  // Get enrolled students
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('student_id, students!inner(id, student_code, profiles!inner(full_name))')
    .eq('class_id' as const, classId as any)
    .eq('status' as const, 'active' as any)

  if (enrollmentsError) handleQueryError(enrollmentsError, 'getStudentGradesForClass')

  if (!enrollments || enrollments.length === 0) {
    return []
  }

  const studentIds = enrollments.map((e: any) => e.student_id)

  // Get assessments for this class/subject/semester
  const { data: assessments, error: assessmentsError } = await supabase
    .from('assessments')
    .select('id, name, assessment_type, weight')
    .eq('class_id' as const, classId as any)
    .eq('subject_id' as const, subjectId as any)
    .eq('school_year' as const, schoolYear as any)
    .eq('semester' as const, semester as any)
    .order('date', { ascending: true })

  if (assessmentsError) handleQueryError(assessmentsError, 'getStudentGradesForClass')

  // Group assessments by type
  const txAssessments = assessments?.filter((a: any) => a.assessment_type === 'tx') || []
  const gkAssessment = assessments?.find((a: any) => a.assessment_type === 'gk')
  const ckAssessment = assessments?.find((a: any) => a.assessment_type === 'ck')

  // Get all grade entries for these students and assessments
  const assessmentIds = [
    ...txAssessments.map((a: any) => a.id),
    gkAssessment?.id,
    ckAssessment?.id
  ].filter(Boolean)

  let gradeMap = new Map<string, any>() // student_id -> { assessment_id -> score }

  if (assessmentIds.length > 0) {
    const { data: gradeEntries } = await supabase
      .from('grade_entries')
      .select('student_id, assessment_id, score')
      .in('student_id' as const, studentIds as any)
      .in('assessment_id' as const, assessmentIds as any)

    gradeEntries?.forEach((entry: any) => {
      if (!gradeMap.has(entry.student_id)) {
        gradeMap.set(entry.student_id, new Map())
      }
      gradeMap.get(entry.student_id).set(entry.assessment_id, entry.score)
    })
  }

  // Build result with TX1, TX2, TX3, GK, CK scores
  return enrollments.map((e: any) => {
    const studentGrades = gradeMap.get(e.student_id) || new Map()
    const tx1 = txAssessments[0] ? studentGrades.get(txAssessments[0].id) : null
    const tx2 = txAssessments[1] ? studentGrades.get(txAssessments[1].id) : null
    const tx3 = txAssessments[2] ? studentGrades.get(txAssessments[2].id) : null
    const gk = gkAssessment ? studentGrades.get(gkAssessment.id) : null
    const ck = ckAssessment ? studentGrades.get(ckAssessment.id) : null

    const average = calculateAverage(tx1, tx2, tx3, gk, ck)

    return {
      student_id: e.students.id,
      student_code: e.students.student_code,
      full_name: e.students.profiles.full_name || 'Unknown',
      tx1_score: tx1,
      tx2_score: tx2,
      tx3_score: tx3,
      gk_score: gk,
      ck_score: ck,
      average
    }
  }).sort((a, b) => a.student_code.localeCompare(b.student_code))
}

/**
 * Get or create assessments for a class (TX1, TX2, TX3, GK, CK)
 */
export async function getOrCreateClassAssessments(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
): Promise<Record<string, string>> {
  const supabase = await getSupabase()

  // Check if assessments exist
  const { data: existing, error: checkError } = await supabase
    .from('assessments')
    .select('id, assessment_type')
    .eq('class_id' as const, classId as any)
    .eq('subject_id' as const, subjectId as any)
    .eq('school_year' as const, schoolYear as any)
    .eq('semester' as const, semester as any)

  if (checkError) handleQueryError(checkError, 'getOrCreateClassAssessments')

  const assessmentMap = new Map((existing || []).map((a: any) => [a.assessment_type, a.id]))

  const types = ['tx1', 'tx2', 'tx3', 'gk', 'ck'] as const
  const weights = { tx1: 1, tx2: 1, tx3: 1, gk: 2, ck: 3 }
  const names = { tx1: 'Kiểm tra viết 1', tx2: 'Kiểm tra viết 2', tx3: 'Kiểm tra viết 3', gk: 'Giữa kỳ', ck: 'Cuối kỳ' }

  const result: Record<string, string> = {}

  for (const type of types) {
    if (assessmentMap.has(type)) {
      result[type] = assessmentMap.get(type)!
    } else {
      // Create new assessment
      const { data: newAssessment, error: createError } = await supabase
        .from('assessments')
        .insert({
          id: crypto.randomUUID(),
          class_id: classId,
          subject_id: subjectId,
          teacher_id: teacherId,
          name: names[type],
          assessment_type: type,
          weight: weights[type],
          max_score: 10,
          date: new Date().toISOString().split('T')[0],
          school_year: schoolYear,
          semester: semester
        } as any)
        .select('id')
        .single()

      if (createError) handleQueryError(createError, `createAssessment_${type}`)
      result[type] = (newAssessment as any).id
    }
  }

  return result
}

/**
 * Save or update grade entries
 */
export async function saveGradeEntries(
  entries: GradeInput[],
  teacherId: string
): Promise<void> {
  const supabase = await getSupabase()

  const now = new Date().toISOString()

  const records = entries.map(entry => ({
    id: crypto.randomUUID(),
    student_id: entry.student_id,
    assessment_id: entry.assessment_id,
    score: entry.score,
    notes: entry.notes || null,
    status: entry.status || 'draft',
    graded_by: teacherId,
    graded_at: now
  } as any))

  const { error } = await supabase
    .from('grade_entries')
    .upsert(records, {
      onConflict: 'student_id,assessment_id'
    })

  if (error) handleQueryError(error, 'saveGradeEntries')
}

/**
 * Get grade lock status for a class/subject/semester
 */
export async function getGradeLockStatus(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
): Promise<GradeLockStatus> {
  const supabase = await getSupabase()

  // Check if any grade entries are locked for this combination
  const { data, error } = await supabase
    .from('grade_entries')
    .select('status, graded_by, graded_at')
    .eq('assessments.class_id' as const, classId as any)
    .eq('assessments.subject_id' as const, subjectId as any)
    .eq('assessments.school_year' as const, schoolYear as any)
    .eq('assessments.semester' as const, semester as any)
    .eq('status' as const, 'locked' as any)
    .limit(1)

  if (error) handleQueryError(error, 'getGradeLockStatus')

  if (data && data.length > 0) {
    return {
      is_locked: true,
      locked_by: data[0].graded_by,
      locked_at: data[0].graded_at
    }
  }

  return {
    is_locked: false,
    locked_by: null,
    locked_at: null
  }
}

/**
 * Lock grades for a class/subject/semester
 */
export async function lockGrades(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string,
  teacherId: string
): Promise<void> {
  const supabase = await getSupabase()

  const { error } = await supabase
    .from('grade_entries')
    .update({
      status: 'locked',
      graded_by: teacherId,
      graded_at: new Date().toISOString()
    } as any)
    .eq('assessments.class_id' as const, classId as any)
    .eq('assessments.subject_id' as const, subjectId as any)
    .eq('assessments.school_year' as const, schoolYear as any)
    .eq('assessments.semester' as const, semester as any)
    .neq('status' as const, 'locked' as any)

  if (error) handleQueryError(error, 'lockGrades')
}

/**
 * Calculate grade statistics for a class
 */
export async function calculateGradeStatistics(
  classId: string,
  subjectId: string,
  schoolYear: string,
  semester: string
): Promise<GradeStatistics> {
  const grades = await getStudentGradesForClass(classId, subjectId, schoolYear, semester)

  const averages = grades
    .map(g => g.average)
    .filter((a): a is number => a !== null)

  if (averages.length === 0) {
    return {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
      classAverage: 0
    }
  }

  const excellent = averages.filter(a => a >= 8.0).length
  const good = averages.filter(a => a >= 6.5 && a < 8.0).length
  const avg = averages.filter(a => a >= 5.0 && a < 6.5).length
  const poor = averages.filter(a => a < 5.0).length
  const classAverage = averages.reduce((a, b) => a + b, 0) / averages.length

  return {
    excellent,
    good,
    average: avg,
    poor,
    classAverage
  }
}
