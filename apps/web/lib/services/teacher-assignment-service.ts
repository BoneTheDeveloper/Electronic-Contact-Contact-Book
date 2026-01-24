/**
 * Teacher Assignment Service
 * Logic to get classes assigned to a teacher (both homeroom and subject teacher roles)
 */

import { createClient } from '@/lib/supabase/server'

export interface TeacherClass {
  id: string
  name: string
  grade: string
  grade_id: string
  room: string
  student_count: number
  is_homeroom: boolean
  subjects?: string[]
  schedule_days?: number[]
  // For grade entry - include subject details
  class_id?: string
  class_name?: string
  subject_id?: string
  subject_name?: string
}

export interface TeacherClassDetail {
  class_id: string
  class_name: string
  grade: string
  grade_id: string
  room: string
  student_count: number
  is_homeroom: boolean
  subjects_taught: Array<{
    subject_id: string
    subject_name: string
    periods: Array<{
      period_id: number
      day_of_week: number
      room: string
    }>
  }>
}

/**
 * Get all classes assigned to a teacher
 * Combines homeroom (GVCN) and subject teacher (GVBM) assignments
 */
export async function getTeacherClasses(teacherId: string): Promise<TeacherClass[]> {
  const supabase = await createClient()

  // Get homeroom assignments
  const { data: homeroomData, error: homeroomError } = await supabase
    .from('class_teachers')
    .select(`
      class_id,
      is_primary,
      classes!inner(
        id,
        name,
        grade_id,
        room,
        current_students,
        grades!inner(name)
      )
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('academic_year' as const, '2024-2025' as any)

  if (homeroomError) {
    console.error('Error fetching homeroom classes:', homeroomError)
  }

  // Get subject teacher assignments via schedules
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .select(`
      class_id,
      room,
      subject_id,
      day_of_week,
      period_id,
      classes!inner(
        id,
        name,
        grade_id,
        current_students,
        grades!inner(name)
      ),
      subjects!inner(id, name)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('school_year' as const, '2024-2025' as any)

  if (scheduleError) {
    console.error('Error fetching schedule classes:', scheduleError)
  }

  const classMap = new Map<string, TeacherClass>()

  // Add homeroom classes
  ;(homeroomData || []).forEach((assignment: any) => {
    const cls = assignment.classes
    classMap.set(cls.id, {
      id: cls.id,
      name: cls.name,
      grade: cls.grades.name,
      grade_id: cls.grade_id,
      room: assignment.room || cls.room,
      student_count: cls.current_students,
      is_homeroom: true,
      subjects: [],
      schedule_days: []
    })
  })

  // Add subject teacher classes
  const subjectClassesMap = new Map<string, { subjects: Set<string>; days: Set<number> }>()
  ;(scheduleData || []).forEach((schedule: any) => {
    const cls = schedule.classes
    const classKey = cls.id

    if (!subjectClassesMap.has(classKey)) {
      subjectClassesMap.set(classKey, {
        subjects: new Set(),
        days: new Set()
      })
    }

    const info = subjectClassesMap.get(classKey)!
    info.subjects.add(schedule.subjects.name)
    info.days.add(schedule.day_of_week)

    // Only add class if not already a homeroom class
    if (!classMap.has(cls.id)) {
      classMap.set(cls.id, {
        id: cls.id,
        name: cls.name,
        grade: cls.grades.name,
        grade_id: cls.grade_id,
        room: schedule.room || cls.room,
        student_count: cls.current_students,
        is_homeroom: false,
        subjects: [],
        schedule_days: []
      })
    }
  })

  // Update subject info for non-homeroom classes
  subjectClassesMap.forEach((info, classId) => {
    const classData = classMap.get(classId)
    if (classData && !classData.is_homeroom) {
      classData.subjects = Array.from(info.subjects)
      classData.schedule_days = Array.from(info.days)
    }
  })

  return Array.from(classMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get detailed class information with subjects taught
 */
export async function getTeacherClassDetail(
  teacherId: string,
  classId: string
): Promise<TeacherClassDetail | null> {
  const supabase = await createClient()

  // Check if teacher is homeroom for this class
  const { data: homeroomData } = await supabase
    .from('class_teachers')
    .select('is_primary')
    .eq('teacher_id' as const, teacherId as any)
    .eq('class_id' as const, classId as any)
    .single()

  const isHomeroom = !!homeroomData

  // Get class info
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id, name, grade_id, room, current_students, grades!inner(name)')
    .eq('id' as const, classId as any)
    .single()

  if (classError || !classData) {
    return null
  }

  // Get subjects taught by this teacher for this class
  const { data: scheduleData } = await supabase
    .from('schedules')
    .select(`
      subject_id,
      period_id,
      day_of_week,
      room,
      subjects!inner(id, name)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('class_id' as const, classId as any)
    .eq('school_year' as const, '2024-2025' as any)

  // Group by subject
  const subjectsMap = new Map<string, {
    subject_id: string
    subject_name: string
    periods: Array<{ period_id: number; day_of_week: number; room: string }>
  }>()

  ;(scheduleData || []).forEach((s: any) => {
    const key = s.subject_id
    if (!subjectsMap.has(key)) {
      subjectsMap.set(key, {
        subject_id: s.subject_id,
        subject_name: s.subjects.name,
        periods: []
      })
    }
    subjectsMap.get(key)!.periods.push({
      period_id: s.period_id,
      day_of_week: s.day_of_week,
      room: s.room
    })
  })

  return {
    class_id: classData.id,
    class_name: classData.name,
    grade: (classData as any).grades.name,
    grade_id: classData.grade_id,
    room: classData.room || '',
    student_count: classData.current_students || 0,
    is_homeroom: isHomeroom,
    subjects_taught: Array.from(subjectsMap.values())
  }
}

/**
 * Check if teacher can take attendance for a specific class/period
 * Returns true if:
 * - Teacher is homeroom for the class (any period)
 * - Teacher is scheduled to teach that class/period
 */
export async function canTeacherTakeAttendance(
  teacherId: string,
  classId: string,
  periodId?: number,
  date?: string
): Promise<{ can: boolean; reason?: string }> {
  const supabase = await createClient()

  // Check homeroom status
  const { data: homeroomData } = await supabase
    .from('class_teachers')
    .select('id')
    .eq('teacher_id' as const, teacherId as any)
    .eq('class_id' as const, classId as any)
    .single()

  if (homeroomData) {
    return { can: true }
  }

  // For subject teachers, check schedule if period is provided
  if (periodId && date) {
    const dayOfWeek = new Date(date).getDay()

    const { data: scheduleData } = await supabase
      .from('schedules')
      .select('id')
      .eq('teacher_id' as const, teacherId as any)
      .eq('class_id' as const, classId as any)
      .eq('period_id' as const, periodId as any)
      .eq('day_of_week' as const, dayOfWeek as any)
      .single()

    if (scheduleData) {
      return { can: true }
    }

    return {
      can: false,
      reason: 'Giáo viên không được phân công dạy tiết này'
    }
  }

  // If no period specified, allow for viewing (but not saving)
  return { can: true }
}

/**
 * Get classes for grade entry - returns each class-subject combination
 * This is different from getTeacherClasses which returns unique classes
 */
export async function getTeacherClassesForGrades(teacherId: string): Promise<TeacherClass[]> {
  const supabase = await createClient()

  const result: TeacherClass[] = []

  // Get subject teacher assignments via schedules
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .select(`
      class_id,
      subject_id,
      classes!inner(
        id,
        name,
        grade_id,
        current_students,
        grades!inner(name)
      ),
      subjects!inner(id, name)
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('school_year' as const, '2024-2025' as any)

  if (scheduleError) {
    console.error('Error fetching schedule classes:', scheduleError)
  }

  // Create unique class-subject combinations
  const subjectClassMap = new Map<string, TeacherClass>()

  ;(scheduleData || []).forEach((schedule: any) => {
    const cls = schedule.classes
    const subject = schedule.subjects
    const key = `${cls.id}_${subject.id}`

    if (!subjectClassMap.has(key)) {
      subjectClassMap.set(key, {
        id: key,
        class_id: cls.id,
        class_name: cls.name,
        subject_id: subject.id,
        subject_name: subject.name,
        name: cls.name,
        grade: cls.grades.name,
        grade_id: cls.grade_id,
        room: '',
        student_count: cls.current_students || 0,
        is_homeroom: false,
        subjects: [subject.name],
        schedule_days: []
      })
    }
  })

  result.push(...Array.from(subjectClassMap.values()))

  // Get homeroom classes - for homeroom teachers, they can enter grades for all subjects
  const { data: homeroomData } = await supabase
    .from('class_teachers')
    .select(`
      class_id,
      classes!inner(
        id,
        name,
        grade_id,
        current_students,
        grades!inner(name)
      )
    `)
    .eq('teacher_id' as const, teacherId as any)
    .eq('academic_year' as const, '2024-2025' as any)

  // For homeroom teachers, add their class with a special entry
  ;(homeroomData || []).forEach((assignment: any) => {
    const cls = assignment.classes
    result.push({
      id: `homeroom_${cls.id}`,
      class_id: cls.id,
      class_name: cls.name,
      subject_id: 'homeroom',
      subject_name: 'Tất cả môn',
      name: cls.name,
      grade: cls.grades.name,
      grade_id: cls.grade_id,
      room: '',
      student_count: cls.current_students || 0,
      is_homeroom: true,
      subjects: ['Tất cả môn'],
      schedule_days: []
    })
  })

  return result.sort((a, b) => a.class_name!.localeCompare(b.class_name!))
}
