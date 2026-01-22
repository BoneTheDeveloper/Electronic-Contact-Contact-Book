// ==================== DATA CONTRACT EXPORTS ====================
// Grade level contract for middle school (THCS grades 6-9)
export const SUPPORTED_GRADES = ['6', '7', '8', '9']

// Class ID pattern validation for grades 6-9
export const CLASS_ID_PATTERN = /^[6-9][A-Z]\d*$/

// Vietnamese grade labels for display
export const GRADE_LABELS_VN: Record<string, string> = {
  '6': 'Khối 6',
  '7': 'Khối 7',
  '8': 'Khối 8',
  '9': 'Khối 9'
}

// ==================== MOCK DATA TYPES ====================
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
export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    students: 1248,
    parents: 2186,
    teachers: 85,
    attendance: '96.4%',
    feesCollected: '84%',
    revenue: 2847500,
    pendingPayments: 45,
  }
}

// Students data
export async function getStudents(): Promise<Student[]> {
  return [
    { id: '1', name: 'Nguyễn Văn An', grade: '6A', attendance: 95, feesStatus: 'paid' },
    { id: '2', name: 'Trần Thị Bình', grade: '6B', attendance: 98, feesStatus: 'paid' },
    { id: '3', name: 'Lê Văn Cường', grade: '7A', attendance: 92, feesStatus: 'pending' },
    { id: '4', name: 'Phạm Thị Dung', grade: '9A', attendance: 97, feesStatus: 'paid' },
    { id: '5', name: 'Hoàng Văn Em', grade: '8A', attendance: 89, feesStatus: 'overdue' },
    { id: '6', name: 'Ngô Thị Giang', grade: '6A', attendance: 96, feesStatus: 'paid' },
    { id: '7', name: 'Đỗ Văn Hùng', grade: '7A', attendance: 94, feesStatus: 'pending' },
    { id: '8', name: 'Vũ Thị Lan', grade: '7B', attendance: 99, feesStatus: 'paid' },
  ]
}

// Users data
export async function getUsers(): Promise<User[]> {
  return [
    { id: '1', name: 'Admin User', email: 'admin@school.vn', role: 'admin', status: 'active' },
    { id: '2', name: 'Nguyễn Thanh T.', email: 'nguyenthanh@school.vn', role: 'teacher', status: 'active', classId: '6A' },
    { id: '3', name: 'Trần Thị Mai', email: 'tranmai@school.vn', role: 'teacher', status: 'active', classId: '7A' },
    { id: '4', name: 'Lê Văn Nam', email: 'lenam@school.vn', role: 'parent', status: 'active' },
    { id: '5', name: 'Phạm Thị Hoa', email: 'phamhoa@school.vn', role: 'parent', status: 'active' },
    { id: '6', name: 'Nguyễn Văn An', email: 'nguyenan@school.vn', role: 'student', status: 'active', classId: '6A' },
    { id: '7', name: 'Trần Thị Bình', email: 'tranbinh@school.vn', role: 'student', status: 'active', classId: '6B' },
    { id: '8', name: 'Lê Văn Cường', email: 'lecuong@school.vn', role: 'student', status: 'inactive', classId: '7A' },
  ]
}

// Get user by id
export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers()
  return users.find(u => u.id === id) || null
}

// Classes data
export async function getClasses(): Promise<Class[]> {
  return [
    { id: '6A', name: '6A', grade: '6', teacher: 'Nguyễn Thanh T.', studentCount: 35, room: 'A101' },
    { id: '6B', name: '6B', grade: '6', teacher: 'Trần Thị Mai', studentCount: 33, room: 'A102' },
    { id: '7A', name: '7A', grade: '7', teacher: 'Lê Văn Chính', studentCount: 32, room: 'B201' },
    { id: '7B', name: '7B', grade: '7', teacher: 'Phạm Thị Dung', studentCount: 34, room: 'B202' },
    { id: '8A', name: '8A', grade: '8', teacher: 'Hoàng Văn Em', studentCount: 31, room: 'C301' },
    { id: '9A', name: '9A', grade: '9', teacher: 'Ngô Thị Giang', studentCount: 36, room: 'A201' },
  ]
}

// Get class by id
export async function getClassById(id: string): Promise<Class | null> {
  const classes = await getClasses()
  return classes.find(c => c.id === id) || null
}

// Get students by class
export async function getStudentsByClass(classId: string): Promise<Student[]> {
  const allStudents = await getStudents()
  return allStudents.filter(s => s.grade === classId)
}

// Invoices data
export async function getInvoices(): Promise<Invoice[]> {
  return [
    { id: 'INV001', studentId: '1', studentName: 'Nguyễn Văn An', amount: 2500000, status: 'paid', dueDate: '2025-09-30', paidDate: '2025-09-25' },
    { id: 'INV002', studentId: '2', studentName: 'Trần Thị Bình', amount: 2500000, status: 'paid', dueDate: '2025-09-30', paidDate: '2025-09-28' },
    { id: 'INV003', studentId: '3', studentName: 'Lê Văn Cường', amount: 2500000, status: 'pending', dueDate: '2025-10-15' },
    { id: 'INV004', studentId: '4', studentName: 'Phạm Thị Dung', amount: 2500000, status: 'paid', dueDate: '2025-09-30', paidDate: '2025-09-20' },
    { id: 'INV005', studentId: '5', studentName: 'Hoàng Văn Em', amount: 2500000, status: 'overdue', dueDate: '2025-09-30' },
    { id: 'INV006', studentId: '6', studentName: 'Ngô Thị Giang', amount: 2500000, status: 'paid', dueDate: '2025-09-30', paidDate: '2025-09-26' },
    { id: 'INV007', studentId: '7', studentName: 'Đỗ Văn Hùng', amount: 2500000, status: 'pending', dueDate: '2025-10-20' },
    { id: 'INV008', studentId: '8', studentName: 'Vũ Thị Lan', amount: 2500000, status: 'paid', dueDate: '2025-09-30', paidDate: '2025-09-22' },
  ]
}

// Notifications data
export async function getNotifications(): Promise<Notification[]> {
  return [
    { id: '1', title: 'Họp phụ huynh', message: 'Họp phụ huynh cuối kỳ sẽ diễn ra vào ngày 20/10/2025', type: 'info', targetRole: 'parent', createdAt: '2025-10-10' },
    { id: '2', title: 'Nghỉ lễ', message: 'Nhà trường đóng cửa từ 30/10 đến 02/11 dịp lễ', type: 'warning', targetRole: 'all', createdAt: '2025-10-08' },
    { id: '3', title: 'Kết quả học kỳ', message: 'Kết quả học kỳ I đã được cập nhật', type: 'success', targetRole: 'student', createdAt: '2025-10-05' },
    { id: '4', title: 'Thông báo thu học phí', message: 'Deadline nộp học phí kỳ II là 15/10/2025', type: 'error', targetRole: 'parent', createdAt: '2025-10-01' },
  ]
}

// Attendance chart data
export async function getAttendanceData(): Promise<ChartData[]> {
  return [
    { name: 'Present', value: 1203 },
    { name: 'Absent', value: 28 },
    { name: 'Late', value: 17 },
  ]
}

// Attendance stats by period
export async function getAttendanceStats(period: 'week' | 'month' | 'semester' = 'week'): Promise<AttendanceStats> {
  const data = {
    week: { excused: 8, unexcused: 4, tardy: 28 },
    month: { excused: 35, unexcused: 18, tardy: 118 },
    semester: { excused: 398, unexcused: 223, tardy: 845 },
  }
  return data[period]
}

// Fees chart data
export async function getFeesData(): Promise<ChartData[]> {
  return [
    { name: 'Paid', value: 1048 },
    { name: 'Pending', value: 155 },
    { name: 'Overdue', value: 45 },
  ]
}

// Fee stats by semester
export async function getFeeStats(semester: '1' | '2' = '1'): Promise<FeeStats> {
  const data = {
    '1': {
      percentage: 84,
      paidAmount: '2.14 tỷ',
      remainingAmount: '980 triệu',
      totalAmount: '3.12 tỷ',
      paidStudents: 856,
      totalStudents: 1248,
    },
    '2': {
      percentage: 76,
      paidAmount: '1.91 tỷ',
      remainingAmount: '1.21 tỷ',
      totalAmount: '3.12 tỷ',
      paidStudents: 765,
      totalStudents: 1248,
    },
  }
  return data[semester]
}

// Revenue by month
export async function getRevenueByMonth(): Promise<ChartData[]> {
  return [
    { name: 'Jan', value: 320000 },
    { name: 'Feb', value: 280000 },
    { name: 'Mar', value: 350000 },
    { name: 'Apr', value: 310000 },
    { name: 'May', value: 380000 },
    { name: 'Jun', value: 420000 },
  ]
}

// Grade distribution
export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  return [
    { grade: 'Giỏi', percentage: 32, color: 'bg-green-500' },
    { grade: 'Khá', percentage: 45, color: 'bg-blue-500' },
    { grade: 'Trung bình', percentage: 18, color: 'bg-orange-500' },
    { grade: 'Yếu', percentage: 5, color: 'bg-red-500' },
  ]
}

// Recent activities
export interface Activity {
  id: string
  user: string
  action: string
  time: string
  note: string
}

export async function getActivities(): Promise<Activity[]> {
  return [
    {
      id: '1',
      user: 'Nguyễn Thanh T. (GVCN)',
      action: 'Phê duyệt đơn nghỉ phép',
      time: '08:42 AM',
      note: 'Học sinh: Lê Văn C. (8B)',
    },
    {
      id: '2',
      user: 'Phạm Quốc D. (Admin)',
      action: 'Cấu hình biểu phí học kỳ mới',
      time: '07:15 AM',
      note: 'Hoàn tất',
    },
    {
      id: '3',
      user: 'Học sinh - Nguyễn An',
      action: 'Gửi yêu cầu hỗ trợ lấy lại mật khẩu',
      time: 'Hôm qua',
      note: 'Đang chờ',
    },
    {
      id: '4',
      user: 'Trần Thị Mai (GVCN)',
      action: 'Điểm danh lớp 7A',
      time: 'Hôm qua',
      note: '32/32 có mặt',
    },
    {
      id: '5',
      user: 'Lê Văn Chính (Admin)',
      action: 'Xác nhận thanh toán học phí',
      time: '2 ngày trước',
      note: '5 học sinh',
    },
  ]
}

// ==================== TEACHER SPECIFIC DATA ====================

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

// Get teacher classes
export async function getTeacherClasses(teacherId: string = '2'): Promise<TeacherClass[]> {
  return [
    {
      id: '6A',
      name: '6A',
      subject: 'Toán',
      grade: '6',
      room: 'A102',
      studentCount: 35,
      schedule: 'Thứ 2-4-6, Tiết 1-3',
      isHomeroom: true,
    },
    {
      id: '7A3',
      name: '7A3',
      subject: 'Toán',
      grade: '7',
      room: 'A205',
      studentCount: 32,
      schedule: 'Thứ 3-5, Tiết 4-5',
      isHomeroom: false,
    },
    {
      id: '8B',
      name: '8B',
      subject: 'Toán',
      grade: '8',
      room: 'B101',
      studentCount: 38,
      schedule: 'Thứ 2-4-6, Tiết 6-7',
      isHomeroom: false,
    },
    {
      id: '9A1',
      name: '9A1',
      subject: 'Toán',
      grade: '9',
      room: 'C201',
      studentCount: 31,
      schedule: 'Thứ 3-5, Tiết 7-9',
      isHomeroom: false,
    },
  ]
}

// Get teacher stats
export async function getTeacherStats(teacherId: string = '2'): Promise<TeacherStats> {
  return {
    homeroom: 1,
    teaching: 5,
    students: 164,
    pendingAttendance: 2,
    pendingGrades: 23,
    gradeReviewRequests: 2,
    leaveRequests: 3,
    todaySchedule: [
      {
        id: '1',
        period: 'Tiết 1-2',
        time: '07:30 - 09:00',
        className: '6A',
        subject: 'Toán học',
        room: 'A102',
      },
      {
        id: '2',
        period: 'Tiết 4',
        time: '10:15 - 11:00',
        className: '7A3',
        subject: 'Toán học',
        room: 'A205',
      },
      {
        id: '3',
        period: 'Tiết 6',
        time: '14:00 - 14:45',
        className: '8B',
        subject: 'Toán học',
        room: 'B101',
      },
    ],
  }
}

// Get students in a class for attendance
export async function getClassStudents(classId: string): Promise<AttendanceRecord[]> {
  const students = [
    { studentId: '1', studentName: 'Nguyễn Văn An', status: 'present' as const },
    { studentId: '2', studentName: 'Trần Thị Bình', status: 'present' as const },
    { studentId: '3', studentName: 'Lê Văn Cường', status: 'absent' as const },
    { studentId: '4', studentName: 'Phạm Thị Dung', status: 'present' as const },
    { studentId: '5', studentName: 'Hoàng Văn Em', status: 'late' as const },
    { studentId: '6', studentName: 'Ngô Thị Giang', status: 'present' as const },
    { studentId: '7', studentName: 'Đỗ Văn Hùng', status: 'excused' as const },
    { studentId: '8', studentName: 'Vũ Thị Lan', status: 'present' as const },
  ]
  return students
}

// Get grade entry sheet
export async function getGradeEntrySheet(classId: string, subject: string = 'Toán'): Promise<{ students: GradeEntry[]; subject: string }> {
  return {
    subject,
    students: [
      {
        studentId: '1',
        studentName: 'Nguyễn Văn An',
        oral: [8, 9, 7],
        quiz: [7.5, 8],
        midterm: 8,
        final: 0,
      },
      {
        studentId: '2',
        studentName: 'Trần Thị Bình',
        oral: [9, 9, 8],
        quiz: [8.5, 9],
        midterm: 9,
        final: 0,
      },
      {
        studentId: '3',
        studentName: 'Lê Văn Cường',
        oral: [6, 7, 6],
        quiz: [6.5, 7],
        midterm: 7,
        final: 0,
      },
      {
        studentId: '4',
        studentName: 'Phạm Thị Dung',
        oral: [8, 8, 8],
        quiz: [8, 8.5],
        midterm: 8.5,
        final: 0,
      },
      {
        studentId: '5',
        studentName: 'Hoàng Văn Em',
        oral: [5, 6, 5],
        quiz: [6, 5.5],
        midterm: 6,
        final: 0,
      },
    ],
  }
}

// Get assessments
export async function getAssessments(teacherId: string = '2'): Promise<Assessment[]> {
  return [
    {
      id: '1',
      classId: '6A',
      className: '6A',
      subject: 'Toán',
      type: 'quiz',
      name: 'Kiểm tra 15 phút số 3',
      date: '2026-01-15',
      maxScore: 10,
      submittedCount: 35,
      totalCount: 35,
      status: 'graded',
    },
    {
      id: '2',
      classId: '7A3',
      className: '7A3',
      subject: 'Toán',
      type: 'midterm',
      name: 'Giữa kỳ I',
      date: '2026-01-20',
      maxScore: 10,
      submittedCount: 30,
      totalCount: 32,
      status: 'published',
    },
    {
      id: '3',
      classId: '8B',
      className: '8B',
      subject: 'Toán',
      type: 'oral',
      name: 'Điểm miệng Tuần 4',
      date: '2026-01-18',
      maxScore: 10,
      submittedCount: 38,
      totalCount: 38,
      status: 'graded',
    },
  ]
}

// Get conduct ratings
export async function getConductRatings(classId: string, semester: '1' | '2' = '2'): Promise<ConductRating[]> {
  return [
    {
      studentId: '1',
      studentName: 'Trần Hoàng',
      mssv: 'HS001',
      academicRating: 'excellent-plus',
      academicScore: 9.2,
      conductRating: 'good',
      semester: '2',
      notes: 'Học tập tốt, ngoan ngoãn',
    },
    {
      studentId: '2',
      studentName: 'Nguyễn Minh Anh',
      mssv: 'HS002',
      academicRating: 'excellent',
      academicScore: 8.5,
      conductRating: 'good',
      semester: '2',
      notes: 'Tiến bộ tốt',
    },
    {
      studentId: '3',
      studentName: 'Lê Quang Nam',
      mssv: 'HS003',
      academicRating: 'good',
      academicScore: 7.2,
      conductRating: 'fair',
      semester: '2',
      notes: 'Cần cố gắng hơn',
    },
    {
      studentId: '4',
      studentName: 'Phạm Thị Lan',
      mssv: 'HS004',
      academicRating: 'average',
      academicScore: 5.8,
      conductRating: 'average',
      semester: '2',
      notes: 'Cần chú ý hơn',
    },
    {
      studentId: '5',
      studentName: 'Đỗ Văn Hùng',
      mssv: 'HS005',
      academicRating: 'needs-improvement',
      academicScore: 4.5,
      conductRating: 'poor',
      semester: '2',
      notes: 'Cần gặp phụ huynh',
    },
  ]
}

// Get teacher conversations
export async function getTeacherConversations(teacherId: string = '2'): Promise<Conversation[]> {
  return [
    {
      id: '1',
      parentName: 'Nguyễn Văn An',
      studentName: 'Nguyễn Văn An',
      studentId: 'HS001',
      className: '6A1',
      lastMessage: 'Thưa thầy, em có thể xin lịch hẹn gặp không ạ?',
      timestamp: '10 phút trước',
      unreadCount: 2,
      online: true,
    },
    {
      id: '2',
      parentName: 'Trần Thị Bình',
      studentName: 'Trần Thị Bình',
      studentId: 'HS002',
      className: '6A1',
      lastMessage: 'Cảm ơn thầy đã thông báo',
      timestamp: '2 giờ trước',
      unreadCount: 0,
      online: false,
    },
    {
      id: '3',
      parentName: 'Lê Văn Cường',
      studentName: 'Lê Văn Cường',
      studentId: 'HS003',
      className: '6A1',
      lastMessage: 'Con đã nộp bài tập chưa thầy?',
      timestamp: 'Hôm qua',
      unreadCount: 1,
      online: true,
    },
  ]
}

// Get messages in conversation
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  return [
    {
      id: '1',
      conversationId,
      senderId: 'p1',
      senderName: 'Phụ huynh Nguyễn Văn An',
      content: 'Thưa thầy, em có thể xin lịch hẹn gặp không ạ?',
      timestamp: '09:30',
      isFromTeacher: false,
    },
    {
      id: '2',
      conversationId,
      senderId: '2',
      senderName: 'Thầy Nguyễn Thanh T.',
      content: 'Chào cha mẹ, thầy có thể gặp vào chiều thứ 5 tuần sau được không?',
      timestamp: '09:45',
      isFromTeacher: true,
    },
    {
      id: '3',
      conversationId,
      senderId: 'p1',
      senderName: 'Phụ huynh Nguyễn Văn An',
      content: 'Dạ được ạ, 14h được không thầy?',
      timestamp: '10:00',
      isFromTeacher: false,
    },
  ]
}

// Get grade review requests
export async function getGradeReviewRequests(teacherId: string = '2'): Promise<any[]> {
  return [
    {
      id: '1',
      studentId: '1',
      studentName: 'Nguyễn An',
      classId: '6A',
      className: '6A1',
      assessmentType: 'final',
      currentScore: 4.5,
      reason: 'Em nghĩ bài làm đúng hơn điểm nhận được',
      requestDate: '2026-01-10',
      status: 'pending',
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Trần Huy',
      classId: '7A3',
      className: '7A3',
      assessmentType: 'quiz',
      currentScore: 7.0,
      reason: 'Thầy điểm nhầm bài câu 3',
      requestDate: '2026-01-11',
      status: 'pending',
    },
  ]
}

// Get leave requests (for homeroom teacher)
export async function getLeaveRequests(classId: string, status?: 'pending' | 'approved' | 'rejected'): Promise<LeaveRequest[]> {
  const requests: LeaveRequest[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'Lê Văn C.',
      startDate: '2026-05-20',
      endDate: '2026-05-22',
      reason: 'Ốm, sốt xuất huyết',
      status: 'pending',
      submittedDate: '2026-05-18',
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Phạm Minh M.',
      startDate: '2026-05-21',
      endDate: '2026-05-21',
      reason: 'Việc gia đình',
      status: 'pending',
      submittedDate: '2026-05-19',
    },
  ]

  if (status) {
    return requests.filter(r => r.status === status)
  }
  return requests
}

// ==================== NEW DATA FUNCTIONS FOR PHASE 01 ====================

// Teaching Schedule Interface
export interface TeacherScheduleItem {
  period: number
  time: string
  className: string
  subject: string
  room: string
  date?: string
}

// Class Management Interface
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

// Regular Assessment Interface
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
  rating?: number // 1-5 stars
  createdAt: string
}

// Homeroom Class Interface
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

// Leave Approval Interface
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

// ==================== FEE & FINANCE DATA TYPES (Phase 07) ====================

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

// Get Teacher Schedule
export async function getTeacherSchedule(
  teacherId?: string,
  date?: string
): Promise<TeacherScheduleItem[]> {
  return [
    { period: 1, time: '07:30 - 08:15', className: '6A1', subject: 'Toán', room: 'P.101' },
    { period: 2, time: '08:20 - 09:05', className: '7A3', subject: 'Toán', room: 'P.201' },
    { period: 3, time: '09:15 - 10:00', className: '6A1', subject: 'Toán', room: 'P.101' },
    { period: 4, time: '10:10 - 10:55', className: '8A2', subject: 'Toán', room: 'P.302' },
    { period: 5, time: '11:00 - 11:45', className: '7A3', subject: 'Toán', room: 'P.201' },
  ]
}

// Get Class Management Data
export async function getClassManagementData(
  classId: string
): Promise<ClassManagementDetail> {
  const schedule = await getTeacherSchedule()

  return {
    classId,
    className: '6A1',
    subject: 'Toán',
    grade: '6',
    room: 'P.101',
    schedule,
    students: [
      { id: '1', name: 'Nguyễn Văn An', code: 'HV001', email: 'an.nv@school.edu', phone: '0901234567', status: 'active' },
      { id: '2', name: 'Trần Thị Bình', code: 'HV002', email: 'binh.tt@school.edu', phone: '0901234568', status: 'active' },
      { id: '3', name: 'Lê Văn Cường', code: 'HV003', email: 'cuong.lv@school.edu', phone: '0901234569', status: 'active' },
      { id: '4', name: 'Phạm Thị Dung', code: 'HV004', email: 'dung.pt@school.edu', phone: '0901234570', status: 'active' },
      { id: '5', name: 'Hoàng Văn Em', code: 'HV005', phone: '0901234571', status: 'withdrawn' },
      { id: '6', name: 'Ngô Thị Giang', code: 'HV006', email: 'giang.nt@school.edu', phone: '0901234572', status: 'active' },
      { id: '7', name: 'Đỗ Văn Hùng', code: 'HV007', email: 'hung.dv@school.edu', phone: '0901234573', status: 'active' },
      { id: '8', name: 'Vũ Thị Lan', code: 'HV008', email: 'lan.vt@school.edu', phone: '0901234574', status: 'active' },
      { id: '9', name: 'Đinh Văn Minh', code: 'HV009', email: 'minh.dv@school.edu', phone: '0901234575', status: 'active' },
      { id: '10', name: 'Bùi Thị Nga', code: 'HV010', email: 'nga.bt@school.edu', phone: '0901234576', status: 'active' },
    ],
  }
}

// Get Regular Assessments
export async function getRegularAssessments(
  teacherId?: string,
  filters?: {
    classId?: string
    status?: 'evaluated' | 'pending' | 'needs-attention'
  }
): Promise<RegularAssessment[]> {
  const assessments: RegularAssessment[] = [
    {
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Tiến bộ học tập', content: 'Có tiến bộ tốt trong giải toán' },
      rating: 4,
      createdAt: '2026-01-14',
    },
    {
      studentId: '2',
      studentName: 'Trần Thị Bình',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Đóng góp lớp', content: 'Học sinh tích cực, giúp đỡ bạn bè' },
      rating: 5,
      createdAt: '2026-01-14',
    },
    {
      studentId: '3',
      studentName: 'Lê Văn Cường',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'pending',
      createdAt: '2026-01-14',
    },
    {
      studentId: '4',
      studentName: 'Phạm Thị Dung',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'needs-attention',
      comment: { category: 'Cần cải thiện', content: 'Cần chú ý hơn trong lớp, làm bài tập chưa đầy đủ' },
      rating: 2,
      createdAt: '2026-01-13',
    },
    {
      studentId: '5',
      studentName: 'Ngô Thị Giang',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'evaluated',
      comment: { category: 'Tiến bộ học tập', content: 'Nắm bắt kiến thức tốt, làm bài tập cẩn thận' },
      rating: 5,
      createdAt: '2026-01-14',
    },
    {
      studentId: '6',
      studentName: 'Đỗ Văn Hùng',
      classId: '6A1',
      className: '6A1',
      subject: 'Toán',
      status: 'pending',
      createdAt: '2026-01-14',
    },
  ]

  if (filters?.status) {
    return assessments.filter(a => a.status === filters.status)
  }

  if (filters?.classId) {
    return assessments.filter(a => a.classId === filters.classId)
  }

  return assessments
}

// Get Homeroom Class Data
export async function getHomeroomClassData(
  classId: string
): Promise<HomeroomClassDetail> {
  return {
    classId: '6A1',
    className: '6A1',
    grade: '6',
    room: 'P.101',
    studentCount: 45,
    maleCount: 23,
    femaleCount: 22,
    classMonitor: 'Nguyễn Văn An',
    students: [
      {
        id: '1',
        name: 'Nguyễn Văn An',
        code: 'HS001',
        dob: '2012-05-15',
        parentName: 'Nguyễn Văn X',
        parentPhone: '0901234567',
        address: '123 Đường A, Quận B, TP HCM',
      },
      {
        id: '2',
        name: 'Trần Thị Bình',
        code: 'HS002',
        dob: '2012-08-20',
        parentName: 'Trần Thị Y',
        parentPhone: '0901234568',
        address: '456 Đường B, Quận C, TP HCM',
      },
      {
        id: '3',
        name: 'Lê Văn Cường',
        code: 'HS003',
        dob: '2012-03-10',
        parentName: 'Lê Văn Z',
        parentPhone: '0901234569',
        address: '789 Đường C, Quận D, TP HCM',
      },
      {
        id: '4',
        name: 'Phạm Thị Dung',
        code: 'HS004',
        dob: '2012-12-25',
        parentName: 'Phạm Văn T',
        parentPhone: '0901234570',
        address: '321 Đường D, Quận E, TP HCM',
      },
      {
        id: '5',
        name: 'Hoàng Văn Em',
        code: 'HS005',
        dob: '2012-07-08',
        parentName: 'Hoàng Thị V',
        parentPhone: '0901234571',
        address: '654 Đường E, Quận A, TP HCM',
      },
    ],
  }
}

// Get Leave Approval Requests
export async function getLeaveApprovalRequests(
  classId: string,
  status?: 'pending' | 'approved' | 'rejected'
): Promise<LeaveRequestApproval[]> {
  const requests: LeaveRequestApproval[] = [
    {
      id: 'LR001',
      studentId: '1',
      studentName: 'Nguyễn Văn An',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
      reason: 'Đi cùng gia đình công tác',
      status: 'pending',
      submittedDate: '2026-01-15',
      parentContact: '0901234567',
    },
    {
      id: 'LR002',
      studentId: '2',
      studentName: 'Trần Thị Bình',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-18',
      endDate: '2026-01-18',
      reason: 'Đi khám bệnh định kỳ',
      status: 'pending',
      submittedDate: '2026-01-17',
      parentContact: '0901234568',
    },
    {
      id: 'LR003',
      studentId: '3',
      studentName: 'Lê Văn Cường',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-16',
      endDate: '2026-01-17',
      reason: 'Ốm, sốt',
      status: 'pending',
      submittedDate: '2026-01-15',
      parentContact: '0901234569',
    },
    {
      id: 'LR004',
      studentId: '4',
      studentName: 'Phạm Thị Dung',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      reason: 'Việc gia đình',
      status: 'approved',
      submittedDate: '2026-01-09',
      parentContact: '0901234570',
    },
    {
      id: 'LR005',
      studentId: '5',
      studentName: 'Hoàng Văn Em',
      classId: '6A1',
      className: '6A1',
      startDate: '2026-01-08',
      endDate: '2026-01-08',
      reason: 'Lý do không hợp lý',
      status: 'rejected',
      submittedDate: '2026-01-07',
      parentContact: '0901234571',
    },
  ]

  if (status) {
    return requests.filter(r => r.status === status)
  }

  return requests
}

// ==================== FEE & FINANCE DATA (Phase 07) ====================

// Fee items matching wireframe specifications
export const FEE_ITEMS: FeeItem[] = [
  {
    id: 'tuition-hk1',
    name: 'Học phí',
    code: 'HP-HK1',
    type: 'mandatory',
    amount: 2500000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'insurance',
    name: 'Bảo hiểm y tế',
    code: 'BHYT-25',
    type: 'mandatory',
    amount: 854000,
    semester: 'all',
    status: 'active'
  },
  {
    id: 'uniform-hk1',
    name: 'Tiền đồng phục',
    code: 'DP-HK1',
    type: 'voluntary',
    amount: 850000,
    semester: '1',
    status: 'active'
  },
  {
    id: 'boarding-hk1',
    name: 'Tiền ăn bán trú',
    code: 'BT-HK1',
    type: 'voluntary',
    amount: 1200000,
    semester: '1',
    status: 'active'
  }
]

// Grade data for middle school (grades 6-9 with 6 classes each)
export const GRADE_DATA: Record<string, GradeData> = {
  '6': { grade: '6', classes: ['6A', '6B', '6C', '6D', '6E', '6F'], students: 180 },
  '7': { grade: '7', classes: ['7A', '7B', '7C', '7D', '7E', '7F'], students: 195 },
  '8': { grade: '8', classes: ['8A', '8B', '8C', '8D', '8E', '8F'], students: 188 },
  '9': { grade: '9', classes: ['9A', '9B', '9C', '9D', '9E', '9F'], students: 175 }
}

// Fee assignments mock data
export const FEE_ASSIGNMENTS: FeeAssignment[] = [
  {
    id: 'fa-001',
    name: 'Học phí HK1 - 2025',
    targetGrades: ['6', '7', '8', '9'],
    targetClasses: ['6A', '6B', '7A', '7B', '8A', '9A'],
    feeItems: ['tuition-hk1', 'insurance'],
    startDate: '2025-09-01',
    dueDate: '2025-10-15',
    reminderDays: 7,
    reminderFrequency: 'weekly',
    totalStudents: 278,
    totalAmount: 695000000,
    status: 'published',
    createdAt: '2025-08-20T00:00:00Z'
  }
]

// Get fee items with optional filters
export async function getFeeItems(filters?: {
  semester?: string
  type?: 'mandatory' | 'voluntary'
}): Promise<FeeItem[]> {
  let items = FEE_ITEMS

  if (filters?.semester && filters.semester !== 'all') {
    items = items.filter(item => item.semester === filters.semester)
  }

  if (filters?.type) {
    items = items.filter(item => item.type === filters.type)
  }

  return items
}

// Get fee item by ID
export async function getFeeItemById(id: string): Promise<FeeItem | undefined> {
  return FEE_ITEMS.find(item => item.id === id)
}

// Get grade data
export async function getGradeData(): Promise<Record<string, GradeData>> {
  return GRADE_DATA
}

// Get classes by grade
export async function getClassesByGrade(grade: string): Promise<string[]> {
  return GRADE_DATA[grade]?.classes || []
}

// Get fee assignments
export async function getFeeAssignments(): Promise<FeeAssignment[]> {
  return FEE_ASSIGNMENTS
}

// Get fee assignment by ID
export async function getFeeAssignmentById(id: string): Promise<FeeAssignment | undefined> {
  return FEE_ASSIGNMENTS.find(assignment => assignment.id === id)
}

// Create fee assignment
export async function createFeeAssignment(
  data: Omit<FeeAssignment, 'id' | 'createdAt' | 'totalStudents' | 'totalAmount'>
): Promise<FeeAssignment> {
  // Estimate students: assume equal distribution across classes in a grade
  const totalStudents = data.targetClasses.reduce((sum, cls) => {
    const grade = cls.charAt(0)
    const gradeData = GRADE_DATA[grade]
    if (!gradeData) return sum
    return sum + (gradeData.students / gradeData.classes.length)
  }, 0)

  // Calculate total amount: sum of fee items * number of students
  const feeItemsTotal = data.feeItems.reduce((sum, feeId) => {
    const fee = FEE_ITEMS.find(f => f.id === feeId)
    return sum + (fee?.amount || 0)
  }, 0)

  const totalAmount = Math.round(feeItemsTotal * totalStudents)

  const newAssignment: FeeAssignment = {
    ...data,
    id: `fa-${Date.now()}`,
    totalStudents: Math.round(totalStudents),
    totalAmount,
    createdAt: new Date().toISOString()
  }

  FEE_ASSIGNMENTS.push(newAssignment)
  return newAssignment
}

// Enhanced getPaymentStats function
export async function getPaymentStats(): Promise<{
  totalAmount: number
  collectedAmount: number
  pendingCount: number
  overdueCount: number
  collectionRate: number
}> {
  const invoices = await getInvoices()

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const collectedAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length
  const collectionRate = totalAmount > 0 ? Math.round((collectedAmount / totalAmount) * 100) : 0

  return {
    totalAmount,
    collectedAmount,
    pendingCount,
    overdueCount,
    collectionRate
  }
}

// Generate invoices from fee assignment
export async function generateInvoicesFromAssignment(assignmentId: string): Promise<Invoice[]> {
  const assignment = await getFeeAssignmentById(assignmentId)
  if (!assignment) return []

  const invoices: Invoice[] = []
  const students = await getStudents()

  for (const cls of assignment.targetClasses) {
    const classStudents = students.filter(s => s.grade === cls)
    const amountPerStudent = assignment.totalAmount / assignment.totalStudents

    for (const student of classStudents) {
      invoices.push({
        id: `inv-${assignment.id}-${student.id}`,
        studentId: student.id,
        studentName: student.name,
        amount: Math.round(amountPerStudent),
        status: 'pending',
        dueDate: assignment.dueDate
      })
    }
  }

  return invoices
}

