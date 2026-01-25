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
  avatarUrl: string | null;
}

/**
 * Fetch all children for a given parent from student_guardians junction table
 * Uses a direct SQL query via RPC for reliability with complex joins
 * @param parentId - UUID from parents table
 * @returns Array of child data
 */
export const getParentChildren = async (
  parentId: string
): Promise<ChildData[]> => {
  // Use RPC to call a database function that handles the complex joins
  const { data, error } = await supabase.rpc('get_parent_children', {
    p_parent_id: parentId
  });

  if (error) {
    console.error('[QUERIES] Error fetching children:', error);
    throw new Error(`Failed to load children: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    name: item.full_name || '',
    rollNumber: item.student_code || '',
    classId: item.class_id || '',
    section: '',
    grade: parseInt(item.grade_id || '0', 10),
    studentCode: item.student_code || '',
    isPrimary: item.is_primary || false,
    avatarUrl: item.avatar_url ?? null,
  }));
}

type StudentGuardianData = {
  students?: Array<{
    id: string;
    student_code: string;
    profiles?: Array<{
      full_name: string;
      avatar_url: string | null;
    }>;
    enrollments?: Array<{
      class_id: string;
      classes?: Array<{
        grade_id: string;
      }>;
    }>;
  }>;
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

  const profile = data.profiles?.[0];
  const enrollment = data.enrollments?.[0];
  const classData = enrollment?.classes?.[0];

  return {
    id: data.id,
    studentCode: data.student_code,
    fullName: profile?.full_name || '',
    avatarUrl: profile?.avatar_url,
    classId: enrollment?.class_id || '',
    className: classData?.name || '',
    gradeId: classData?.grade_id || '',
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
 * @param semester - Optional semester filter ('1' or '2')
 * @returns Array of grade entries
 */
export const getStudentGrades = async (
  studentId: string,
  semester?: string
): Promise<GradeEntryData[]> => {
  let query = supabase
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
    .eq('student_id', studentId);

  if (semester) {
    query = query.eq('assessments.semester', semester);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching grades:', error);
    return [];
  }

  return (data || []).map(entry => {
    const assessment = entry.assessments?.[0];
    const subject = assessment?.subjects?.[0];
    return {
      id: entry.id,
      subjectId: subject?.id || '',
      subjectName: subject?.name || '',
      assessmentName: assessment?.name || '',
      assessmentType: assessment?.assessment_type || 'quiz',
      score: entry.score,
      maxScore: assessment?.max_score || 10,
      date: assessment?.date || '',
      semester: assessment?.semester || '1',
    };
  });
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

  return (data || []).map(item => {
    const period = item.periods?.[0];
    const subject = item.subjects?.[0];
    const teacher = item.teachers?.[0];
    return {
      id: item.id,
      dayOfWeek: item.day_of_week,
      periodId: item.period_id,
      periodName: period?.name || '',
      startTime: period?.start_time || '',
      endTime: period?.end_time || '',
      subjectId: subject?.id || '',
      subjectName: subject?.name || '',
      teacherId: item.teachers?.[0]?.id || '',
      room: item.room,
    };
  });
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

  return (data || []).map(item => {
    const teacher = item.teachers?.[0];
    const subject = item.subjects?.[0];
    return {
      id: item.id,
      teacherId: teacher?.id || '',
      teacherName: teacher?.profiles?.[0]?.full_name || '',
      commentType: item.comment_type as 'academic' | 'behavior' | 'achievement' | 'concern',
      title: item.title,
      content: item.content,
      subjectId: item.subject_id,
      subjectName: subject?.name || null,
      createdAt: item.created_at,
    };
  });
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

// ============================================
// NEWS & NOTIFICATIONS QUERIES
// ============================================

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  attachmentUrl: string | null;
  publishedAt: string;
  expiresAt: string | null;
  isPinned: boolean;
}

/**
 * Get announcements targeting students
 * @param targetRole - Role filter (default: 'student')
 * @returns Array of announcements
 */
export const getAnnouncements = async (
  targetRole: string = 'student'
): Promise<AnnouncementData[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .or(`target_role.eq.${targetRole},target_role.eq.all`)
    .gte('expires_at', new Date().toISOString())
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching announcements:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    content: item.content,
    type: item.type,
    category: item.category || 'Nhà trường',
    attachmentUrl: item.attachment_url,
    publishedAt: item.published_at,
    expiresAt: item.expires_at,
    isPinned: item.is_pinned || false,
  }));
};

export interface NotificationData {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
}

/**
 * Get notifications for a specific recipient
 * @param recipientId - User UUID
 * @returns Array of notifications
 */
export const getNotifications = async (
  recipientId: string
): Promise<NotificationData[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      id,
      title,
      content,
      type,
      category,
      created_at,
      notification_recipients!inner(
        is_read,
        read_at
      )
    `)
    .eq('notification_recipients.recipient_id', recipientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching notifications:', error);
    return [];
  }

  return (data || []).map(item => {
    const recipient = item.notification_recipients?.[0];
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
      category: item.category || 'Thông báo',
      createdAt: item.created_at,
      isRead: recipient?.is_read || false,
      readAt: recipient?.read_at,
    };
  });
};

/**
 * Mark notification as read
 * @param notificationId - Notification UUID
 * @param recipientId - Recipient UUID
 */
export const markNotificationRead = async (
  notificationId: string,
  recipientId: string
): Promise<void> => {
  const { error } = await supabase
    .from('notification_recipients')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('notification_id', notificationId)
    .eq('recipient_id', recipientId);

  if (error) {
    console.error('[QUERIES] Error marking notification as read:', error);
    throw error;
  }
};

// ============================================
// LEAVE REQUESTS & APPEALS MUTATIONS
// ============================================

export interface LeaveRequestData {
  id: string;
  studentId: string;
  classId: string;
  requestType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateLeaveRequestInput {
  studentId: string;
  classId: string;
  requestType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

/**
 * Create a new leave request
 * @param data - Leave request data
 * @returns Created leave request
 */
export const createLeaveRequest = async (
  data: CreateLeaveRequestInput
): Promise<LeaveRequestData> => {
  const { data: result, error } = await supabase
    .from('leave_requests')
    .insert({
      student_id: data.studentId,
      class_id: data.classId,
      request_type: data.requestType,
      start_date: data.startDate,
      end_date: data.endDate,
      reason: data.reason,
      status: 'pending',
      created_by: data.studentId,
    })
    .select()
    .single();

  if (error) {
    console.error('[QUERIES] Error creating leave request:', error);
    throw error;
  }

  return {
    id: result.id,
    studentId: result.student_id,
    classId: result.class_id,
    requestType: result.request_type,
    startDate: result.start_date,
    endDate: result.end_date,
    reason: result.reason,
    status: result.status as 'pending' | 'approved' | 'rejected',
    createdAt: result.created_at,
  };
};

/**
 * Get leave requests for a student
 * @param studentId - Student UUID
 * @returns Array of leave requests
 */
export const getLeaveRequests = async (
  studentId: string
): Promise<LeaveRequestData[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[QUERIES] Error fetching leave requests:', error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    studentId: item.student_id,
    classId: item.class_id,
    requestType: item.request_type,
    startDate: item.start_date,
    endDate: item.end_date,
    reason: item.reason,
    status: item.status as 'pending' | 'approved' | 'rejected',
    createdAt: item.created_at,
  }));
};

export interface GradeAppealData {
  id: string;
  gradeEntryId: string;
  studentId: string;
  reason: string;
  detail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CreateGradeAppealInput {
  gradeEntryId: string;
  studentId: string;
  reason: string;
  detail: string;
}

/**
 * Create a grade appeal
 * @param data - Appeal data
 * @returns Created appeal
 */
export const createGradeAppeal = async (
  data: CreateGradeAppealInput
): Promise<GradeAppealData> => {
  const { data: result, error } = await supabase
    .from('grade_appeals')
    .insert({
      grade_entry_id: data.gradeEntryId,
      student_id: data.studentId,
      reason: data.reason,
      detail: data.detail,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[QUERIES] Error creating grade appeal:', error);
    throw error;
  }

  return {
    id: result.id,
    gradeEntryId: result.grade_entry_id,
    studentId: result.student_id,
    reason: result.reason,
    detail: result.detail,
    status: result.status as 'pending' | 'approved' | 'rejected',
    createdAt: result.created_at,
  };
};
