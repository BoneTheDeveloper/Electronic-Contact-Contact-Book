/**
 * Student Store
 * Manages student-specific data with real Supabase queries
 * Falls back to mock data if Supabase returns errors or for development
 */

import { create } from 'zustand';
import {
  getStudentProfile,
  getStudentGrades,
  getStudentAttendance,
  getStudentSchedule,
  getStudentComments,
  getStudentInvoices,
  getAnnouncements,
  getNotifications,
  createLeaveRequest,
  getLeaveRequests,
  createGradeAppeal,
} from '../lib/supabase/queries';

interface StudentData {
  id: string;
  name: string;
  studentCode: string;
  classId: string;
  className: string;
  gradeId: string;
  avatarUrl: string | null;
}

interface Grade {
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

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string | null;
  periodId: number | null;
}

interface ScheduleItem {
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

interface StudentComment {
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

interface Invoice {
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

interface Announcement {
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

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  category: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
}

interface LeaveRequest {
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

// ============================================
// MOCK DATA
// ============================================

const MOCK_STUDENT_DATA: StudentData = {
  id: 'student-001',
  name: 'Nguyễn Văn A',
  studentCode: 'HS2024001',
  classId: 'class-10a1',
  className: '10A1',
  gradeId: 'grade-10',
  avatarUrl: null,
};

const MOCK_GRADES: Grade[] = [
  // Toán
  { id: 'g1', subjectId: 'sub-toan', subjectName: 'Toán', assessmentName: 'Kiểm tra 15 phút 1', assessmentType: 'quiz', score: 8.5, maxScore: 10, date: '2025-01-10', semester: '1' },
  { id: 'g2', subjectId: 'sub-toan', subjectName: 'Toán', assessmentName: 'Kiểm tra 15 phút 2', assessmentType: 'quiz', score: 9.0, maxScore: 10, date: '2025-01-20', semester: '1' },
  { id: 'g3', subjectId: 'sub-toan', subjectName: 'Toán', assessmentName: 'Giữa kỳ', assessmentType: 'midterm', score: 8.0, maxScore: 10, date: '2025-01-25', semester: '1' },
  // Ngữ văn
  { id: 'g4', subjectId: 'sub-van', subjectName: 'Ngữ văn', assessmentName: 'Kiểm tra 15 phút 1', assessmentType: 'quiz', score: 7.5, maxScore: 10, date: '2025-01-12', semester: '1' },
  { id: 'g5', subjectId: 'sub-van', subjectName: 'Ngữ văn', assessmentName: 'Kiểm tra 15 phút 2', assessmentType: 'quiz', score: 8.0, maxScore: 10, date: '2025-01-22', semester: '1' },
  { id: 'g6', subjectId: 'sub-van', subjectName: 'Ngữ văn', assessmentName: 'Giữa kỳ', assessmentType: 'midterm', score: 7.0, maxScore: 10, date: '2025-01-26', semester: '1' },
  // Tiếng Anh
  { id: 'g7', subjectId: 'sub-anh', subjectName: 'Tiếng Anh', assessmentName: 'Kiểm tra 15 phút 1', assessmentType: 'quiz', score: 9.0, maxScore: 10, date: '2025-01-08', semester: '1' },
  { id: 'g8', subjectId: 'sub-anh', subjectName: 'Tiếng Anh', assessmentName: 'Kiểm tra 15 phút 2', assessmentType: 'quiz', score: 9.5, maxScore: 10, date: '2025-01-18', semester: '1' },
  { id: 'g9', subjectId: 'sub-anh', subjectName: 'Tiếng Anh', assessmentName: 'Giữa kỳ', assessmentType: 'midterm', score: 8.5, maxScore: 10, date: '2025-01-24', semester: '1' },
  // Vật lý
  { id: 'g10', subjectId: 'sub-ly', subjectName: 'Vật lý', assessmentName: 'Kiểm tra 15 phút 1', assessmentType: 'quiz', score: 7.0, maxScore: 10, date: '2025-01-14', semester: '1' },
  { id: 'g11', subjectId: 'sub-ly', subjectName: 'Vật lý', assessmentName: 'Giữa kỳ', assessmentType: 'midterm', score: 7.5, maxScore: 10, date: '2025-01-27', semester: '1' },
];

// Generate attendance for November 2025
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const statuses: Array<'present' | 'absent' | 'late' | 'excused'> = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'present', 'late', 'absent'];

  for (let day = 1; day <= 30; day++) {
    const date = `2025-11-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(date).getDay();

    // Skip Sundays (day 0)
    if (dayOfWeek !== 0) {
      records.push({
        id: `att-${day}`,
        date,
        status: statuses[Math.floor(Math.random() * statuses.length)]!,
        notes: null,
        periodId: 1,
      });
    }
  }
  return records;
};

const MOCK_SCHEDULE: ScheduleItem[] = [
  // Monday (day 2)
  { id: 'sch1', dayOfWeek: 2, periodId: 1, periodName: 'Tiết 1', startTime: '07:00', endTime: '07:45', subjectId: 'sub-toan', subjectName: 'Toán', teacherId: 't1', room: '101' },
  { id: 'sch2', dayOfWeek: 2, periodId: 2, periodName: 'Tiết 2', startTime: '07:50', endTime: '08:35', subjectId: 'sub-van', subjectName: 'Ngữ văn', teacherId: 't2', room: '102' },
  { id: 'sch3', dayOfWeek: 2, periodId: 3, periodName: 'Tiết 3', startTime: '08:40', endTime: '09:25', subjectId: 'sub-anh', subjectName: 'Tiếng Anh', teacherId: 't3', room: '103' },
  { id: 'sch4', dayOfWeek: 2, periodId: 4, periodName: 'Tiết 4', startTime: '09:35', endTime: '10:20', subjectId: 'sub-ly', subjectName: 'Vật lý', teacherId: 't4', room: '104' },
  // Tuesday (day 3)
  { id: 'sch5', dayOfWeek: 3, periodId: 1, periodName: 'Tiết 1', startTime: '07:00', endTime: '07:45', subjectId: 'sub-hoa', subjectName: 'Hóa học', teacherId: 't5', room: '201' },
  { id: 'sch6', dayOfWeek: 3, periodId: 2, periodName: 'Tiết 2', startTime: '07:50', endTime: '08:35', subjectId: 'sub-sinh', subjectName: 'Sinh học', teacherId: 't6', room: '202' },
  { id: 'sch7', dayOfWeek: 3, periodId: 3, periodName: 'Tiết 3', startTime: '08:40', endTime: '09:25', subjectId: 'sub-su', subjectName: 'Lịch sử', teacherId: 't7', room: '203' },
  { id: 'sch8', dayOfWeek: 3, periodId: 4, periodName: 'Tiết 4', startTime: '09:35', endTime: '10:20', subjectId: 'sub-dia', subjectName: 'Địa lý', teacherId: 't8', room: '204' },
];

const MOCK_COMMENTS: StudentComment[] = [
  {
    id: 'c1',
    teacherId: 't1',
    teacherName: 'Nguyễn Thị B',
    commentType: 'achievement',
    title: 'Thành tích tốt',
    content: 'Học sinh có tiến bộ tốt trong môn Toán, làm bài tập đầy đủ và chính xác.',
    subjectId: 'sub-toan',
    subjectName: 'Toán',
    createdAt: '2025-01-20T10:30:00Z',
  },
  {
    id: 'c2',
    teacherId: 't3',
    teacherName: 'Trần Văn C',
    commentType: 'academic',
    title: 'Cần cải thiện',
    content: 'Cần luyện tập thêm từ vựng và ngữ pháp cơ bản.',
    subjectId: 'sub-anh',
    subjectName: 'Tiếng Anh',
    createdAt: '2025-01-18T14:15:00Z',
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'HP2025-001',
    name: 'Học phí tháng 11/2025',
    description: 'Học phí Tháng 11 năm 2025',
    amount: 1500000,
    paidAmount: 1500000,
    totalAmount: 1500000,
    remainingAmount: 0,
    status: 'paid',
    issueDate: '2025-11-01',
    dueDate: '2025-11-10',
    paidDate: '2025-11-05',
  },
  {
    id: 'inv2',
    invoiceNumber: 'HP2025-002',
    name: 'Học phí tháng 12/2025',
    description: 'Học phí Tháng 12 năm 2025',
    amount: 1500000,
    paidAmount: 0,
    totalAmount: 1500000,
    remainingAmount: 1500000,
    status: 'pending',
    issueDate: '2025-12-01',
    dueDate: '2025-12-10',
    paidDate: null,
  },
  {
    id: 'inv3',
    invoiceNumber: 'HP2025-003',
    name: 'Học phí tháng 01/2026',
    description: 'Học phí Tháng 1 năm 2026',
    amount: 1500000,
    paidAmount: 500000,
    totalAmount: 1500000,
    remainingAmount: 1000000,
    status: 'partial',
    issueDate: '2026-01-01',
    dueDate: '2026-01-10',
    paidDate: null,
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Thông báo nghỉ Tết Nguyên Đán 2026',
    content: 'Trường sẽ nghỉ từ 20/01 đến 02/02/2026...',
    type: 'event',
    category: 'Nhà trường',
    attachmentUrl: null,
    publishedAt: '2026-01-20T00:00:00Z',
    expiresAt: '2026-02-05T00:00:00Z',
    isPinned: true,
  },
  {
    id: 'ann2',
    title: 'Lịch họp phụ huynh cuối kỳ I',
    content: 'Thời gian: 15/01/2026 lúc 18:00...',
    type: 'meeting',
    category: 'Lớp học',
    attachmentUrl: null,
    publishedAt: '2026-01-15T00:00:00Z',
    expiresAt: '2026-01-20T00:00:00Z',
    isPinned: false,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    title: 'Điểm kiểm tra 15 phút Toán',
    content: 'Điểm của bạn đã được cập nhật',
    type: 'grade',
    category: 'Học tập',
    createdAt: '2026-01-20T10:30:00Z',
    isRead: false,
    readAt: null,
  },
];

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    studentId: 'student-001',
    classId: 'class-10a1',
    requestType: 'leave',
    startDate: '2026-01-20',
    endDate: '2026-01-20',
    reason: 'Đi gia đình',
    status: 'approved',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'lr2',
    studentId: 'student-001',
    classId: 'class-10a1',
    requestType: 'leave',
    startDate: '2026-01-10',
    endDate: '2026-01-11',
    reason: 'Ốm đau',
    status: 'pending',
    createdAt: '2026-01-09T00:00:00Z',
  },
];

// ============================================
// STORE INTERFACE
// ============================================

interface StudentState {
  // State
  studentData: StudentData | null;
  grades: Grade[];
  attendance: AttendanceRecord[];
  attendancePercentage: number;
  schedule: ScheduleItem[];
  comments: StudentComment[];
  invoices: Invoice[];
  announcements: Announcement[];
  notifications: Notification[];
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadStudentData: (studentId: string) => Promise<void>;
  loadGrades: (studentId: string, semester?: string) => Promise<void>;
  loadAttendance: (studentId: string, monthFilter?: string) => Promise<void>;
  loadSchedule: (classId: string, semester?: string) => Promise<void>;
  loadComments: (studentId: string) => Promise<void>;
  loadInvoices: (studentId: string) => Promise<void>;
  loadAnnouncements: () => Promise<void>;
  loadNotifications: (recipientId: string) => Promise<void>;
  loadLeaveRequests: (studentId: string) => Promise<void>;
  createLeaveRequest: (data: {
    studentId: string;
    classId: string;
    requestType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<LeaveRequest | null>;
  createGradeAppeal: (data: {
    gradeEntryId: string;
    studentId: string;
    reason: string;
    detail: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  // Initial state
  studentData: null,
  grades: [],
  attendance: [],
  attendancePercentage: 0,
  schedule: [],
  comments: [],
  invoices: [],
  announcements: [],
  notifications: [],
  leaveRequests: [],
  isLoading: false,
  error: null,

  // Load student profile data
  loadStudentData: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      const profile = await getStudentProfile(studentId);
      if (profile) {
        set({
          studentData: {
            id: profile.id,
            name: profile.fullName,
            studentCode: profile.studentCode,
            classId: profile.classId,
            className: profile.className,
            gradeId: profile.gradeId,
            avatarUrl: profile.avatarUrl,
          },
          isLoading: false,
        });
      } else {
        console.warn('[StudentStore] Profile not found, using mock data');
        set({ studentData: MOCK_STUDENT_DATA, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading student data:', err);
      set({ studentData: MOCK_STUDENT_DATA, isLoading: false, error: (err as Error).message });
    }
  },

  // Load grades
  loadGrades: async (studentId: string, semester?: string) => {
    set({ isLoading: true, error: null });

    try {
      const grades = await getStudentGrades(studentId, semester);
      if (grades.length > 0) {
        set({ grades, isLoading: false });
      } else {
        console.warn('[StudentStore] No grades found, using mock data');
        set({ grades: MOCK_GRADES, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading grades:', err);
      set({ grades: MOCK_GRADES, isLoading: false, error: (err as Error).message });
    }
  },

  // Load attendance
  loadAttendance: async (studentId: string, monthFilter?: string) => {
    set({ isLoading: true, error: null });

    try {
      const attendance = await getStudentAttendance(studentId, monthFilter);
      if (attendance.length > 0) {
        const presentDays = attendance.filter(
          (record) => (record.status === 'present' || record.status === 'late' || record.status === 'excused') && record.status !== undefined
        ).length;
        const percentage = attendance.length > 0 ? (presentDays / attendance.length) * 100 : 0;
        set({ attendance, attendancePercentage: percentage, isLoading: false });
      } else {
        console.warn('[StudentStore] No attendance found, using mock data');
        const mockAttendance = generateMockAttendance();
        const presentDays = mockAttendance.filter(
          (record) => (record.status === 'present' || record.status === 'late' || record.status === 'excused') && record.status !== undefined
        ).filter(record => record.status !== undefined).length;
        const percentage = mockAttendance.length > 0 ? (presentDays / mockAttendance.length) * 100 : 0;
        set({ attendance: mockAttendance, attendancePercentage: percentage, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading attendance:', err);
      const mockAttendance = generateMockAttendance();
      const presentDays = mockAttendance.filter(
        (record) => (record.status === 'present' || record.status === 'late' || record.status === 'excused') && record.status !== undefined
      ).length;
      const percentage = mockAttendance.length > 0 ? (presentDays / mockAttendance.length) * 100 : 0;
      set({ attendance: mockAttendance, attendancePercentage: percentage, isLoading: false, error: (err as Error).message });
    }
  },

  // Load schedule
  loadSchedule: async (classId: string, semester: string = '1') => {
    set({ isLoading: true, error: null });

    try {
      const schedule = await getStudentSchedule(classId, semester);
      if (schedule.length > 0) {
        set({ schedule, isLoading: false });
      } else {
        console.warn('[StudentStore] No schedule found, using mock data');
        set({ schedule: MOCK_SCHEDULE, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading schedule:', err);
      set({ schedule: MOCK_SCHEDULE, isLoading: false, error: (err as Error).message });
    }
  },

  // Load teacher comments
  loadComments: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      const comments = await getStudentComments(studentId);
      set({ comments, isLoading: false });
    } catch (err) {
      console.error('[StudentStore] Error loading comments:', err);
      set({ comments: MOCK_COMMENTS, isLoading: false, error: (err as Error).message });
    }
  },

  // Load invoices/payments
  loadInvoices: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      const invoices = await getStudentInvoices(studentId);
      if (invoices.length > 0) {
        set({ invoices, isLoading: false });
      } else {
        console.warn('[StudentStore] No invoices found, using mock data');
        set({ invoices: MOCK_INVOICES, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading invoices:', err);
      set({ invoices: MOCK_INVOICES, isLoading: false, error: (err as Error).message });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Load announcements
  loadAnnouncements: async () => {
    set({ isLoading: true, error: null });

    try {
      const announcements = await getAnnouncements('student');
      if (announcements.length > 0) {
        set({ announcements, isLoading: false });
      } else {
        console.warn('[StudentStore] No announcements found, using mock data');
        set({ announcements: MOCK_ANNOUNCEMENTS, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading announcements:', err);
      set({ announcements: MOCK_ANNOUNCEMENTS, isLoading: false, error: (err as Error).message });
    }
  },

  // Load notifications
  loadNotifications: async (recipientId: string) => {
    set({ isLoading: true, error: null });

    try {
      const notifications = await getNotifications(recipientId);
      set({ notifications, isLoading: false });
    } catch (err) {
      console.error('[StudentStore] Error loading notifications:', err);
      set({ notifications: MOCK_NOTIFICATIONS, isLoading: false, error: (err as Error).message });
    }
  },

  // Load leave requests
  loadLeaveRequests: async (studentId: string) => {
    set({ isLoading: true, error: null });

    try {
      const leaveRequests = await getLeaveRequests(studentId);
      if (leaveRequests.length > 0) {
        set({ leaveRequests, isLoading: false });
      } else {
        console.warn('[StudentStore] No leave requests found, using mock data');
        set({ leaveRequests: MOCK_LEAVE_REQUESTS, isLoading: false });
      }
    } catch (err) {
      console.error('[StudentStore] Error loading leave requests:', err);
      set({ leaveRequests: MOCK_LEAVE_REQUESTS, isLoading: false, error: (err as Error).message });
    }
  },

  // Create leave request
  createLeaveRequest: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createLeaveRequest(data);
      // Refresh leave requests list
      await getLeaveRequests(data.studentId).then(requests => {
        set({ leaveRequests: requests, isLoading: false });
      });
      return result;
    } catch (err) {
      console.error('[StudentStore] Error creating leave request:', err);
      set({ isLoading: false, error: (err as Error).message });
      return null;
    }
  },

  // Create grade appeal
  createGradeAppeal: async (data) => {
    set({ isLoading: true, error: null });

    try {
      await createGradeAppeal(data);
      set({ isLoading: false });
    } catch (err) {
      console.error('[StudentStore] Error creating grade appeal:', err);
      set({ isLoading: false, error: (err as Error).message });
      throw err;
    }
  },
}));
