/**
 * Supabase Queries
 * Reusable database queries for the mobile app
 */

import { supabase } from './client';

export interface ChildData {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
  studentCode: string;
  isPrimary?: boolean;
  avatarUrl?: string;
}

/**
 * Fetch all children for a given parent from student_guardians junction table
 * @param parentId - UUID from parents table
 * @returns Array of child data
 */
export const getParentChildren = async (
  parentId: string
): Promise<ChildData[]> => {
  const { data, error } = await supabase
    .from('student_guardians')
    .select(`
      student_id,
      is_primary,
      students!inner(
        id,
        student_code,
        profiles!students_id_fkey(
          full_name,
          avatar_url,
          status
        ),
        enrollments!inner(
          class_id,
          status,
          classes!inner(
            name,
            grade_id
          )
        )
      )
    `)
    .eq('guardian_id', parentId)
    .eq('students.profiles!students_id_fkey.status', 'active')
    .eq('students.enrollments.status', 'active');

  if (error) {
    console.error('[QUERIES] Error fetching children:', error);
    throw new Error(`Failed to load children: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group by student (in case multiple enrollments exist, get the active one)
  const uniqueChildren = new Map<string, StudentGuardianData>();

  for (const item of data) {
    const studentId = item.students.id;
    if (!uniqueChildren.has(studentId)) {
      uniqueChildren.set(studentId, item);
    }
  }

  return Array.from(uniqueChildren.values()).map((item) => ({
    id: item.students.id,
    name: item.students.full_name,
    rollNumber: item.students.student_code,
    classId: item.students.enrollments?.[0]?.class_id || '',
    section: '',
    grade: parseInt(item.students.enrollments?.[0]?.classes?.grade_id || '0', 10),
    studentCode: item.students.student_code,
    isPrimary: item.is_primary,
    avatarUrl: item.students.avatar_url,
  }));
}

type StudentGuardianData = {
  students: {
    id: string;
    student_code: string;
    full_name: string;
    avatar_url: string | null;
    enrollments?: Array<{
      class_id: string;
      classes?: {
        grade_id: string;
      };
    }>;
  };
  is_primary: boolean;
};

/**
 * Get parent ID from profile phone number
 * @param phone - Parent phone number
 * @returns Parent UUID or null
 */
export const getParentIdByPhone = async (
  phone: string
): Promise<string | null> => {
  // First get profile ID from phone, then get parent record
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone', phone)
    .eq('role', 'parent')
    .single();

  if (profileError || !profile) {
    console.error('[QUERIES] Error finding parent profile:', profileError);
    return null;
  }

  // Profile ID is same as parent ID in our schema
  return profile.id;
};

// ============================================
// STUDENT DATA QUERIES
// ============================================

export interface StudentProfileData {
  id: string;
  studentCode: string;
  fullName: string;
  avatarUrl: string | null;
  classId: string;
  className: string;
  gradeId: string;
}

/**
 * Get student profile with class info
 * @param studentId - Student UUID
 * @returns Student profile data or null
 */
export const getStudentProfile = async (
  studentId: string
): Promise<StudentProfileData | null> => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      student_code,
      profiles!students_id_fkey(
        full_name,
        avatar_url
      ),
      enrollments!inner(
        class_id,
        status,
        classes!inner(
          name,
          grade_id
        )
      )
    `)
    .eq('id', studentId)
    .eq('enrollments.status', 'active')
    .single();

  if (error) {
    console.error('[QUERIES] Error fetching student profile:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    studentCode: data.student_code,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    classId: data.enrollments?.[0]?.class_id || '',
    className: data.enrollments?.[0]?.classes?.name || '',
    gradeId: data.enrollments?.[0]?.classes?.grade_id || '',
  };
};

export interface GradeEntryData {
  id: string;
  subjectId: string;
  subjectName: string;
  assessmentName: string;
  assessmentType: string;
  score: number | null;
  maxScore: number;
  date: string;
  semester: string;
}

/**
 * Get student grades with subject info
 * @param studentId - Student UUID
 * @returns Array of grade entries
 */
export const getStudentGrades = async (
  studentId: string
): Promise<GradeEntryData[]> => {
  const { data, error } = await supabase
    .from('grade_entries')
    .select(`
      id,
      score,
      assessments!inner(
        id,
        name,
        assessment_type,
        date,
        max_score,
        semester,
        subjects!inner(
          id,
          name
        )
      )
    `)
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching grades:', error);
    return [];
  }

  return (data || []).map(entry => ({
    id: entry.id,
    subjectId: entry.assessments.subjects.id,
    subjectName: entry.assessments.subjects.name,
    assessmentName: entry.assessments.name,
    assessmentType: entry.assessments.assessment_type || 'quiz',
    score: entry.score,
    maxScore: entry.assessments.max_score,
    date: entry.assessments.date,
    semester: entry.assessments.semester || '1',
  }));
};

export interface AttendanceRecordData {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string | null;
  periodId: number | null;
}

/**
 * Get student attendance records
 * @param studentId - Student UUID
 * @param monthFilter - Optional month filter (YYYY-MM format)
 * @returns Array of attendance records
 */
export const getStudentAttendance = async (
  studentId: string,
  monthFilter?: string
): Promise<AttendanceRecordData[]> => {
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (monthFilter) {
    query = query.like('date', `${monthFilter}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[QUERIES] Error fetching attendance:', error);
    return [];
  }

  return (data || []).map(record => ({
    id: record.id,
    date: record.date,
    status: record.status as 'present' | 'absent' | 'late' | 'excused',
    notes: record.notes,
    periodId: record.period_id,
  }));
};

export interface ScheduleItemData {
  id: string;
  dayOfWeek: number;
  periodId: number;
  periodName: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  room: string | null;
}

/**
 * Get student class schedule
 * @param classId - Class ID (from student enrollment)
 * @param semester - Semester filter ('1' or '2')
 * @returns Array of schedule items
 */
export const getStudentSchedule = async (
  classId: string,
  semester: string = '1'
): Promise<ScheduleItemData[]> => {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      id,
      day_of_week,
      period_id,
      room,
      subjects!inner(
        id,
        name
      ),
      periods!inner(
        id,
        name,
        start_time,
        end_time
      ),
      teachers!inner(
        id,
        profiles!teachers_id_fkey(
          full_name
        )
      )
    `)
    .eq('class_id', classId )
    .eq('semester', semester )
    .order('day_of_week')
    .order('period_id');

  if (error) {
    console.error('[QUERIES] Error fetching schedule:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    dayOfWeek: item.day_of_week,
    periodId: item.period_id,
    periodName: item.periods?.name || '',
    startTime: item.periods?.start_time || '',
    endTime: item.periods?.end_time || '',
    subjectId: item.subjects?.id || '',
    subjectName: item.subjects?.name || '',
    teacherId: item.teacher_id,
    room: item.room,
  }));
};

export interface StudentCommentData {
  id: string;
  teacherId: string;
  teacherName: string;
  commentType: 'academic' | 'behavior' | 'achievement' | 'concern';
  title: string | null;
  content: string;
  subjectId: string | null;
  subjectName: string | null;
  createdAt: string;
}

/**
 * Get student comments/feedback from teachers
 * @param studentId - Student UUID
 * @returns Array of student comments
 */
export const getStudentComments = async (
  studentId: string
): Promise<StudentCommentData[]> => {
  const { data, error } = await supabase
    .from('student_comments')
    .select(`
      id,
      comment_type,
      title,
      content,
      subject_id,
      created_at,
      teachers!inner(
        id,
        profiles!teachers_id_fkey(
          full_name
        )
      ),
      subjects(
        name
      )
    `)
    .eq('student_id', studentId)
    .eq('is_private', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching comments:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    teacherId: item.teachers.id,
    teacherName: item.teachers.full_name,
    commentType: item.comment_type as 'academic' | 'behavior' | 'achievement' | 'concern',
    title: item.title,
    content: item.content,
    subjectId: item.subject_id,
    subjectName: item.subjects?.name || null,
    createdAt: item.created_at,
  }));
};

// ============================================
// PAYMENT/INVOICE QUERIES
// ============================================

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  name: string;
  description: string | null;
  amount: number;
  paidAmount: number;
  totalAmount: number;
  remainingAmount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
}

/**
 * Get student invoices/payments
 * @param studentId - Student UUID
 * @returns Array of invoice data
 */
export const getStudentInvoices = async (
  studentId: string
): Promise<InvoiceData[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('[QUERIES] Error fetching invoices:', error);
    return [];
  }

  return (data || []).map(invoice => ({
    id: invoice.id,
    invoiceNumber: invoice.invoice_number || '',
    name: invoice.name,
    description: invoice.description,
    amount: Number(invoice.amount),
    paidAmount: Number(invoice.paid_amount || 0),
    totalAmount: Number(invoice.total_amount || invoice.amount),
    remainingAmount: Number((invoice.total_amount || invoice.amount) - (invoice.paid_amount || 0)),
    status: invoice.status as 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled',
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date,
    paidDate: invoice.paid_date,
  }));
};
