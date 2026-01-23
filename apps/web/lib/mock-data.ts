// @ts-nocheck
// ==================== MOCK DATA ====================
// Temporary mock data functions for components
// TODO: Replace with real Supabase queries

import type {
  Conversation,
  Message,
  TeacherStats,
  ScheduleItem,
  TeacherClass,
  LeaveRequest,
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
  Assessment,
  GradeEntry,
  AttendanceRecord,
  ConductRating,
  TeacherScheduleItem,
  ClassManagementDetail,
  RegularAssessment,
  HomeroomClassDetail,
  LeaveRequestApproval,
  FeeItem,
  FeeAssignment,
  GradeData
} from '@/lib/types'

// ==================== MESSAGES ====================

export async function getConversations(): Promise<Conversation[]> {
  return [
    {
      id: '1',
      parentName: 'Nguyễn Văn A',
      studentName: 'Nguyễn Văn B',
      studentId: 'HS20260001',
      className: '6A1',
      lastMessage: 'Thầy cho em hỏi về bài tập hôm nay ạ...',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      parentName: 'Trần Thị C',
      studentName: 'Trần Văn D',
      studentId: 'HS20260002',
      className: '6A1',
      lastMessage: 'Cảm ơn thầy đã thông báo',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      parentName: 'Lê Văn E',
      studentName: 'Lê Thị F',
      studentId: 'HS20260003',
      className: '6A2',
      lastMessage: 'Con em ốm nên nghỉ học hôm nay ạ...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      unreadCount: 1,
      online: false
    }
  ]
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return [
    {
      id: '1',
      conversationId,
      senderId: 'teacher-1',
      senderName: 'Thầy Nguyễn Văn X',
      content: 'Chào phụ huynh, thầy có gì muốn trao đổi ạ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isFromTeacher: true
    },
    {
      id: '2',
      conversationId,
      senderId: 'parent-1',
      senderName: 'Phụ huynh Nguyễn Văn A',
      content: 'Thầy cho em hỏi về bài tập hôm nay ạ...',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isFromTeacher: false
    }
  ]
}

// Alias for teacher-specific conversations
export async function getTeacherConversations(): Promise<Conversation[]> {
  return getConversations()
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  return getMessages(conversationId)
}

// ==================== TEACHER DATA ====================

export async function getTeacherStats(teacherId?: string): Promise<TeacherStats> {
  return {
    homeroom: 1,
    teaching: 5,
    students: 150,
    pendingAttendance: 2,
    pendingGrades: 3,
    gradeReviewRequests: 1,
    leaveRequests: 2,
    todaySchedule: [
      {
        id: '1',
        period: '1',
        time: '7:30 - 8:15',
        className: '6A1',
        subject: 'Toán',
        room: '101'
      },
      {
        id: '2',
        period: '2',
        time: '8:15 - 9:00',
        className: '6A2',
        subject: 'Toán',
        room: '102'
      }
    ]
  }
}

export async function getTeacherSchedule(
  teacherId?: string,
  date?: string
): Promise<TeacherScheduleItem[]> {
  return [
    {
      period: 1,
      time: '7:30 - 8:15',
      className: '6A1',
      subject: 'Toán',
      room: '101'
    },
    {
      period: 2,
      time: '8:15 - 9:00',
      className: '6A2',
      subject: 'Toán',
      room: '102'
    },
    {
      period: 3,
      time: '9:15 - 10:00',
      className: '7A1',
      subject: 'Toán',
      room: '201'
    }
  ]
}

export async function getTeacherClasses(teacherId?: string): Promise<TeacherClass[]> {
  return [
    {
      id: '6A1',
      name: '6A1',
      subject: 'Toán',
      grade: '6',
      room: '101',
      studentCount: 35,
      schedule: 'Thứ 2-4-6',
      isHomeroom: true
    },
    {
      id: '6A2',
      name: '6A2',
      subject: 'Toán',
      grade: '6',
      room: '102',
      studentCount: 32,
      schedule: 'Thứ 3-5-7',
      isHomeroom: false
    },
    {
      id: '7A1',
      name: '7A1',
      subject: 'Toán',
      grade: '7',
      room: '201',
      studentCount: 30,
      schedule: 'Thứ 2-4-6',
      isHomeroom: false
    }
  ]
}

export async function getLeaveRequests(
  classId?: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequest[]> {
  return [
    {
      id: '1',
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      startDate: '2026-01-25',
      endDate: '2026-01-26',
      reason: 'Con bị ốm sốt',
      status: 'pending',
      submittedDate: '2026-01-23'
    },
    {
      id: '2',
      studentId: 'HS20260003',
      studentName: 'Lê Thị F',
      startDate: '2026-01-24',
      endDate: '2026-01-24',
      reason: 'Đi việc gia đình',
      status: 'approved',
      submittedDate: '2026-01-22'
    }
  ]
}

export async function getAssessments(teacherId?: string): Promise<Assessment[]> {
  return [
    {
      id: '1',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      type: 'quiz',
      name: 'Kiểm tra 15 phút số 1',
      date: '2026-01-20',
      maxScore: 10,
      submittedCount: 33,
      totalCount: 35,
      status: 'published'
    },
    {
      id: '2',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      type: 'midterm',
      name: 'Giữa kỳ 1',
      date: '2026-01-15',
      maxScore: 10,
      submittedCount: 35,
      totalCount: 35,
      status: 'graded'
    }
  ]
}

// ==================== DASHBOARD ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    students: 450,
    parents: 420,
    teachers: 25,
    attendance: '95%',
    feesCollected: '85%',
    revenue: 2500000000,
    pendingPayments: 45
  }
}

export async function getStudents(): Promise<Student[]> {
  return [
    {
      id: 'HS20260001',
      name: 'Nguyễn Văn B',
      grade: '6A1',
      attendance: 95,
      feesStatus: 'paid'
    },
    {
      id: 'HS20260002',
      name: 'Trần Văn D',
      grade: '6A1',
      attendance: 90,
      feesStatus: 'pending'
    },
    {
      id: 'HS20260003',
      name: 'Lê Thị F',
      grade: '6A2',
      attendance: 98,
      feesStatus: 'paid'
    }
  ]
}

export async function getClasses(): Promise<Class[]> {
  return [
    {
      id: '6A1',
      name: '6A1',
      grade: '6',
      teacher: 'Thầy Nguyễn Văn X',
      studentCount: 35,
      room: '101'
    },
    {
      id: '6A2',
      name: '6A2',
      grade: '6',
      teacher: 'Cô Trần Thị Y',
      studentCount: 32,
      room: '102'
    }
  ]
}

export async function getInvoices(): Promise<Invoice[]> {
  return [
    {
      id: 'INV001',
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      amount: 1500000,
      status: 'paid',
      dueDate: '2026-01-15',
      paidDate: '2026-01-10'
    },
    {
      id: 'INV002',
      studentId: 'HS20260002',
      studentName: 'Trần Văn D',
      amount: 1500000,
      status: 'pending',
      dueDate: '2026-01-20'
    }
  ]
}

export async function getNotifications(): Promise<Notification[]> {
  return [
    {
      id: '1',
      title: 'Họp phụ huynh',
      message: 'Họp phụ huynh cuối kỳ vào ngày 25/01/2026',
      type: 'info',
      targetRole: 'all',
      createdAt: '2026-01-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Nhắc nộp học phí',
      message: 'Nhắc nhở các phụ huynh chưa nộp học phí',
      type: 'warning',
      targetRole: 'parent',
      createdAt: '2026-01-19T14:00:00Z'
    }
  ]
}

// ==================== OTHER DATA ====================

export async function getAttendanceStats(
  period: 'week' | 'month' | 'semester' = 'week'
): Promise<AttendanceStats> {
  return {
    excused: 5,
    unexcused: 2,
    tardy: 8
  }
}

export async function getFeeStats(semester: '1' | '2' = '1'): Promise<FeeStats> {
  return {
    percentage: 85,
    paidAmount: '2.125.000.000đ',
    remainingAmount: '375.000.000đ',
    totalAmount: '2.500.000.000đ',
    paidStudents: 380,
    totalStudents: 450
  }
}

export async function getAttendanceData(): Promise<ChartData[]> {
  return [
    { name: 'Có mặt', value: 95 },
    { name: 'Vắng mặt', value: 3 },
    { name: 'Muộn', value: 2 }
  ]
}

export async function getFeesData(): Promise<ChartData[]> {
  return [
    { name: 'Đã đóng', value: 380 },
    { name: 'Chưa đóng', value: 45 },
    { name: 'Quá hạn', value: 25 }
  ]
}

export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  return [
    { grade: 'Giỏi', percentage: 32, color: 'bg-green-500' },
    { grade: 'Khá', percentage: 45, color: 'bg-blue-500' },
    { grade: 'Trung bình', percentage: 18, color: 'bg-orange-500' },
    { grade: 'Yếu', percentage: 5, color: 'bg-red-500' }
  ]
}

export async function getActivities(): Promise<Activity[]> {
  return [
    {
      id: '1',
      user: 'Admin',
      action: 'Đã thêm học sinh mới',
      time: '5 phút trước',
      note: 'Thêm Nguyễn Văn B vào lớp 6A1'
    },
    {
      id: '2',
      user: 'Thầy Nguyễn X',
      action: 'Đã điểm danh',
      time: '1 giờ trước',
      note: 'Điểm danh lớp 6A1'
    }
  ]
}

export async function getGradeEntrySheet(
  classId: string,
  subject?: string
): Promise<{ students: GradeEntry[]; subject: string }> {
  return {
    subject: subject || 'Toán',
    students: [
      {
        studentId: 'HS20260001',
        studentName: 'Nguyễn Văn B',
        oral: [8, 9],
        quiz: [7, 8],
        midterm: 8,
        final: 0
      },
      {
        studentId: 'HS20260002',
        studentName: 'Trần Văn D',
        oral: [7, 8],
        quiz: [7, 7],
        midterm: 7,
        final: 0
      }
    ]
  }
}

export async function getClassStudents(classId: string): Promise<AttendanceRecord[]> {
  return [
    {
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      status: 'present'
    },
    {
      studentId: 'HS20260002',
      studentName: 'Trần Văn D',
      status: 'present'
    }
  ]
}

export async function getFeeItems(filters?: {
  semester?: string
  type?: 'mandatory' | 'voluntary'
}): Promise<FeeItem[]> {
  return [
    {
      id: 'FI001',
      name: 'Học phí',
      code: 'HP',
      type: 'mandatory',
      amount: 1500000,
      semester: '1',
      status: 'active'
    },
    {
      id: 'FI002',
      name: 'Tiền ăn bán trú',
      code: 'BT',
      type: 'voluntary',
      amount: 800000,
      semester: '1',
      status: 'active'
    }
  ]
}

export async function getFeeAssignments(): Promise<FeeAssignment[]> {
  return [
    {
      id: 'FA001',
      name: 'Đóng học phí HK1',
      targetGrades: ['6', '7', '8', '9'],
      targetClasses: [],
      feeItems: ['FI001'],
      startDate: '2026-01-01',
      dueDate: '2026-01-30',
      reminderDays: 7,
      reminderFrequency: 'weekly',
      totalStudents: 450,
      totalAmount: 675000000,
      status: 'published',
      createdAt: '2025-12-20'
    }
  ]
}

export async function getGradeData(): Promise<GradeData[]> {
  return [
    { grade: '6', classes: ['6A1', '6A2', '6A3'], students: 120 },
    { grade: '7', classes: ['7A1', '7A2', '7A3'], students: 115 },
    { grade: '8', classes: ['8A1', '8A2'], students: 110 },
    { grade: '9', classes: ['9A1', '9A2'], students: 105 }
  ]
}

// ==================== ADDITIONAL MISSING EXPORTS ====================

export async function getRegularAssessments(teacherId?: string): Promise<RegularAssessment[]> {
  return [
    {
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Học tập', content: 'Học tốt, cần chú ý phép tính' },
      rating: 4,
      createdAt: '2026-01-20T10:00:00Z'
    },
    {
      studentId: 'HS20260002',
      studentName: 'Trần Văn D',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'pending',
      createdAt: '2026-01-20T10:00:00Z'
    }
  ]
}

export async function getConductRatings(teacherId?: string): Promise<ConductRating[]> {
  return [
    {
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      mssv: 'HS20260001',
      academicRating: 'good',
      academicScore: 85,
      conductRating: 'good',
      semester: '1',
      notes: 'Học tập tốt, kỷ luật tốt'
    },
    {
      studentId: 'HS20260002',
      studentName: 'Trần Văn D',
      mssv: 'HS20260002',
      academicRating: 'average',
      academicScore: 72,
      conductRating: 'fair',
      semester: '1',
      notes: 'Cần cố gắng hơn nữa'
    }
  ]
}

export async function getGradeReviewRequests(teacherId?: string): Promise<Array<{
  id: string
  studentName?: string
  className?: string
  assessmentType?: string
  currentScore?: number
  reason?: string
  status?: string
}>> {
  return [
    {
      id: '1',
      studentName: 'Trần Văn D',
      className: '6A1',
      assessmentType: 'quiz',
      currentScore: 7,
      reason: 'Em làm sai do nhầm đề',
      status: 'pending'
    }
  ]
}

export async function getClassManagementData(classId: string): Promise<ClassManagementDetail> {
  return {
    classId,
    className: '6A1',
    subject: 'Toán',
    grade: '6',
    room: '101',
    schedule: await getTeacherSchedule(),
    students: [
      {
        id: 'HS20260001',
        name: 'Nguyễn Văn B',
        code: 'HS20260001',
        email: 'hs001@school.edu',
        phone: '0901234567',
        status: 'active'
      },
      {
        id: 'HS20260002',
        name: 'Trần Văn D',
        code: 'HS20260002',
        email: 'hs002@school.edu',
        phone: '0901234568',
        status: 'active'
      }
    ]
  }
}

export async function getHomeroomClassData(classId: string): Promise<HomeroomClassDetail> {
  return {
    classId,
    className: '6A1',
    grade: '6',
    room: '101',
    studentCount: 35,
    maleCount: 18,
    femaleCount: 17,
    classMonitor: 'Nguyễn Văn B',
    students: [
      {
        id: 'HS20260001',
        name: 'Nguyễn Văn B',
        code: 'HS20260001',
        dob: '2013-05-15',
        parentName: 'Nguyễn Văn A',
        parentPhone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      {
        id: 'HS20260003',
        name: 'Lê Thị F',
        code: 'HS20260003',
        dob: '2013-08-20',
        parentName: 'Lê Văn E',
        parentPhone: '0901234569',
        address: '456 Đường XYZ, Quận 2, TP.HCM'
      }
    ]
  }
}

export async function getLeaveApprovalRequests(): Promise<LeaveRequestApproval[]> {
  return [
    {
      id: '1',
      studentId: 'HS20260001',
      studentName: 'Nguyễn Văn B',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-25',
      endDate: '2026-01-26',
      reason: 'Con bị ốm sốt',
      status: 'pending',
      submittedDate: '2026-01-23',
      parentContact: '0901234567'
    }
  ]
}

// Mock class type for admin components
export interface MockClass {
  id: string
  name: string
  grade: string
  room: string
  teacher: string
  studentCount: number
  status: 'active' | 'inactive'
}

export const MockClass = {
  create: (data: Omit<MockClass, 'id'>): MockClass => ({
    id: `CLASS-${Date.now()}`,
    ...data
  }),

  getAll: async (): Promise<MockClass[]> => [
    {
      id: '6A1',
      name: '6A1',
      grade: '6',
      room: '101',
      teacher: 'Thầy Nguyễn Văn X',
      studentCount: 35,
      status: 'active'
    },
    {
      id: '6A2',
      name: '6A2',
      grade: '6',
      room: '102',
      teacher: 'Cô Trần Thị Y',
      studentCount: 32,
      status: 'active'
    },
    {
      id: '7A1',
      name: '7A1',
      grade: '7',
      room: '201',
      teacher: 'Thầy Lê Văn Z',
      studentCount: 30,
      status: 'active'
    }
  ],

  getById: async (id: string): Promise<MockClass | null> => {
    const classes = await MockClass.getAll()
    return classes.find(c => c.id === id) || null
  }
}
