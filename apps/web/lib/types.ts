// ==================== SHARED TYPES ====================
// Common types used across the application
// These were previously in mock-data.ts

export interface DashboardStats {
  students: number
  parents: number
  teachers: number
  attendance: string
  feesCollected: string
  revenue: number
  pendingPayments: number
}

export interface Student {
  id: string
  name: string
  grade: string
  attendance: number
  feesStatus: 'paid' | 'pending' | 'overdue'
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'parent' | 'student'
  status: 'active' | 'inactive'
  avatar?: string
  classId?: string
}

export interface Class {
  id: string
  name: string
  grade: string
  teacher: string
  studentCount: number
  room: string
}

export interface Invoice {
  id: string
  studentId: string
  studentName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidDate?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  targetRole: 'all' | 'teacher' | 'parent' | 'student'
  createdAt: string
}

export interface AttendanceStats {
  excused: number
  unexcused: number
  tardy: number
}

export interface FeeStats {
  percentage: number
  paidAmount: string
  remainingAmount: string
  totalAmount: string
  paidStudents: number
  totalStudents: number
}

export interface ChartData {
  name: string
  value: number
}

export interface GradeDistribution {
  grade: string
  percentage: number
  color: string
}

// Dashboard stats
export interface Activity {
  id: string
  user: string
  action: string
  time: string
  note: string
}

// ==================== TEACHER SPECIFIC TYPES ====================

export interface TeacherClass {
  id: string
  name: string
  subject: string
  grade: string
  room: string
  studentCount: number
  schedule: string
  isHomeroom: boolean
}

export interface TeacherStats {
  homeroom: number
  teaching: number
  students: number
  pendingAttendance: number
  pendingGrades: number
  gradeReviewRequests: number
  leaveRequests: number
  todaySchedule: ScheduleItem[]
}

export interface ScheduleItem {
  id: string
  period: string
  time: string
  className: string
  subject: string
  room: string
}

export interface AttendanceRecord {
  studentId: string
  studentName: string
  status: 'present' | 'absent' | 'late' | 'excused'
  note?: string
}

export interface GradeEntry {
  studentId: string
  studentName: string
  oral: number[]
  quiz: number[]
  midterm: number
  final: number
}

export interface Assessment {
  id: string
  classId: string
  className: string
  subject: string
  type: 'quiz' | 'midterm' | 'final' | 'oral'
  name: string
  date: string
  maxScore: number
  submittedCount: number
  totalCount: number
  status: 'draft' | 'published' | 'graded'
}

export interface ConductRating {
  studentId: string
  studentName: string
  mssv: string
  academicRating: 'excellent-plus' | 'excellent' | 'good' | 'average' | 'needs-improvement'
  academicScore?: number
  conductRating: 'good' | 'fair' | 'average' | 'poor'
  semester: '1' | '2'
  notes?: string
}

export interface Conversation {
  id: string
  parentName: string
  studentName: string
  studentId: string
  className: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  online: boolean
  avatar?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isFromTeacher: boolean
}

export interface LeaveRequest {
  id: string
  studentId: string
  studentName: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
}

// ==================== NEW DATA FUNCTIONS TYPES ====================

export interface TeacherScheduleItem {
  period: number
  time: string
  className: string
  subject: string
  room: string
  date?: string
}

export interface ClassManagementDetail {
  classId: string
  className: string
  subject: string
  grade: string
  room: string
  schedule: TeacherScheduleItem[]
  students: {
    id: string
    name: string
    code: string
    email?: string
    phone?: string
    status: 'active' | 'withdrawn'
  }[]
}

export interface RegularAssessment {
  studentId: string
  studentName: string
  classId: string
  className: string
  subject: string
  status: 'evaluated' | 'pending' | 'needs-attention'
  comment?: {
    category: string
    content: string
  }
  rating?: number
  createdAt: string
}

export interface HomeroomClassDetail {
  classId: string
  className: string
  grade: string
  room: string
  studentCount: number
  maleCount: number
  femaleCount: number
  classMonitor?: string
  students: {
    id: string
    name: string
    code: string
    dob: string
    parentName: string
    parentPhone: string
    address: string
  }[]
}

export interface LeaveRequestApproval {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
  parentContact?: string
}

// ==================== FEE & FINANCE TYPES ====================

export interface FeeItem {
  id: string
  name: string
  code: string
  type: 'mandatory' | 'voluntary'
  amount: number
  semester: '1' | '2' | 'all'
  status: 'active' | 'inactive'
}

export interface FeeAssignment {
  id: string
  name: string
  targetGrades: string[]
  targetClasses: string[]
  feeItems: string[]
  startDate: string
  dueDate: string
  reminderDays: number
  reminderFrequency: 'once' | 'daily' | 'weekly'
  totalStudents: number
  totalAmount: number
  status: 'draft' | 'published' | 'closed'
  createdAt: string
}

export interface GradeData {
  grade: string
  classes: string[]
  students: number
}
