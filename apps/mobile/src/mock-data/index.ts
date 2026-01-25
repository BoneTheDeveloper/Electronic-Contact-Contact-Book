/**
 * Mock Data Loader
 * Provides mock data for development and testing
 */

export interface MockStudent {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
  dateOfBirth: string;
  parentIds: string[];
}

export interface MockGrade {
  id: string;
  studentId: string;
  subjectId: string;
  subject: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment';
  score: number;
  maxScore: number;
  date: string;
  remarks?: string;
}

export interface MockAttendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface MockFee {
  id: string;
  studentId: string;
  type: 'tuition' | 'transport' | 'library' | 'lab' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  remarks?: string;
}

export interface MockClass {
  id: string;
  name: string;
  grade: number;
  section: string;
  teacherId: string;
  studentIds: string[];
}

export interface MockTeacher {
  id: string;
  name: string;
  employeeId: string;
  subjects: string[];
  email: string;
  phone: string;
  type: 'homeroom' | 'subject';
  classes?: string[];
  avatarColor?: string;
  status?: 'online' | 'offline';
}

export interface MockNotification {
  id: string;
  type: 'announcement' | 'homework' | 'exam' | 'fee' | 'general';
  title: string;
  message: string;
  recipientRole: string;
  recipientIds: string[];
  createdAt: string;
  read: boolean;
}

// Mock Students Data
export const mockStudents: MockStudent[] = [
  {
    id: '2',
    name: 'Nguyen Van B',
    rollNumber: 'STU001',
    classId: 'CLASS9A',
    section: 'A',
    grade: 9,
    dateOfBirth: '2010-05-15',
    parentIds: ['1'],
  },
  {
    id: '5',
    name: 'Nguyen Thi C',
    rollNumber: 'STU002',
    classId: 'CLASS8B',
    section: 'B',
    grade: 8,
    dateOfBirth: '2011-08-22',
    parentIds: ['1'],
  },
];

// Mock Grades Data
export const mockGrades: MockGrade[] = [
  {
    id: '1',
    studentId: '2',
    subjectId: 'SUBJ001',
    subject: 'Mathematics',
    examType: 'midterm',
    score: 85,
    maxScore: 100,
    date: '2026-01-10',
    remarks: 'Good performance',
  },
  {
    id: '2',
    studentId: '2',
    subjectId: 'SUBJ002',
    subject: 'Physics',
    examType: 'midterm',
    score: 78,
    maxScore: 100,
    date: '2026-01-10',
  },
  {
    id: '3',
    studentId: '2',
    subjectId: 'SUBJ003',
    subject: 'Chemistry',
    examType: 'midterm',
    score: 92,
    maxScore: 100,
    date: '2026-01-10',
    remarks: 'Excellent',
  },
  {
    id: '4',
    studentId: '2',
    subjectId: 'SUBJ004',
    subject: 'English',
    examType: 'midterm',
    score: 88,
    maxScore: 100,
    date: '2026-01-10',
  },
  {
    id: '5',
    studentId: '2',
    subjectId: 'SUBJ005',
    subject: 'Literature',
    examType: 'midterm',
    score: 90,
    maxScore: 100,
    date: '2026-01-10',
  },
];

// Mock Attendance Data
export const mockAttendance: MockAttendance[] = [
  { id: '1', studentId: '2', date: '2026-01-12', status: 'present' },
  { id: '2', studentId: '2', date: '2026-01-11', status: 'present' },
  { id: '3', studentId: '2', date: '2026-01-10', status: 'present' },
  { id: '4', studentId: '2', date: '2026-01-09', status: 'late', remarks: 'Traffic' },
  { id: '5', studentId: '2', date: '2026-01-08', status: 'present' },
  { id: '6', studentId: '2', date: '2026-01-07', status: 'absent', remarks: 'Sick leave' },
  { id: '7', studentId: '2', date: '2026-01-06', status: 'present' },
  { id: '8', studentId: '2', date: '2026-01-05', status: 'present' },
  { id: '9', studentId: '2', date: '2026-01-04', status: 'present' },
  { id: '10', studentId: '2', date: '2026-01-03', status: 'present' },
];

// Mock Fees Data
export const mockFees: MockFee[] = [
  {
    id: '1',
    studentId: '2',
    type: 'tuition',
    amount: 5000000,
    dueDate: '2026-01-15',
    status: 'pending',
  },
  {
    id: '2',
    studentId: '2',
    type: 'transport',
    amount: 500000,
    dueDate: '2026-01-10',
    status: 'paid',
    paidDate: '2026-01-08',
  },
  {
    id: '3',
    studentId: '2',
    type: 'library',
    amount: 200000,
    dueDate: '2025-12-01',
    status: 'overdue',
  },
  {
    id: '4',
    studentId: '5',
    type: 'tuition',
    amount: 4500000,
    dueDate: '2026-01-20',
    status: 'pending',
  },
];

// Mock Classes Data
export const mockClasses: MockClass[] = [
  {
    id: 'CLASS9A',
    name: 'Class 9A',
    grade: 9,
    section: 'A',
    teacherId: 'TEACHER001',
    studentIds: ['2'],
  },
  {
    id: 'CLASS8B',
    name: 'Class 8B',
    grade: 8,
    section: 'B',
    teacherId: 'TEACHER002',
    studentIds: ['5'],
  },
  {
    id: 'CLASS7A',
    name: 'Class 7A',
    grade: 7,
    section: 'A',
    teacherId: 'TEACHER001',
    studentIds: [],
  },
  {
    id: 'CLASS6A',
    name: 'Class 6A',
    grade: 6,
    section: 'A',
    teacherId: 'TEACHER002',
    studentIds: [],
  },
];

// Mock Teachers Data
export const mockTeachers: MockTeacher[] = [
  {
    id: 'TEACHER001',
    name: 'Nguyễn Thị Hồng',
    employeeId: 'GV001',
    subjects: ['GVCN'],
    email: 'hong.nguyen@school.edu.vn',
    phone: '0901234567',
    type: 'homeroom',
    classes: ['9A'],
    avatarColor: 'blue',
    status: 'online',
  },
  {
    id: 'TEACHER002',
    name: 'Trần Văn Hùng',
    employeeId: 'GV002',
    subjects: ['Toán'],
    email: 'hung.tran@school.edu.vn',
    phone: '0912345678',
    type: 'subject',
    classes: ['9A', '9B', '9C'],
    avatarColor: 'purple',
    status: 'online',
  },
  {
    id: 'TEACHER003',
    name: 'Lê Thị Khánh',
    employeeId: 'GV003',
    subjects: ['Ngữ văn'],
    email: 'khanh.le@school.edu.vn',
    phone: '0923456789',
    type: 'subject',
    classes: ['9A', '9D'],
    avatarColor: 'amber',
    status: 'offline',
  },
  {
    id: 'TEACHER004',
    name: 'Lê Phượng',
    employeeId: 'GV004',
    subjects: ['Tiếng Anh'],
    email: 'phuong.le@school.edu.vn',
    phone: '0934567890',
    type: 'subject',
    classes: ['9A', '9B'],
    avatarColor: 'pink',
    status: 'online',
  },
  {
    id: 'TEACHER005',
    name: 'Phạm Minh Khang',
    employeeId: 'GV005',
    subjects: ['Vật lý'],
    email: 'khang.pm@school.edu.vn',
    phone: '0945678901',
    type: 'subject',
    classes: ['9A', '9B', '9C', '9D', '9E', '9F'],
    avatarColor: 'green',
    status: 'offline',
  },
  {
    id: 'TEACHER006',
    name: 'Nguyễn Thúy Loan',
    employeeId: 'GV006',
    subjects: ['Hóa học'],
    email: 'loan.nguyen@school.edu.vn',
    phone: '0956789012',
    type: 'subject',
    classes: ['9A', '9B', '9C'],
    avatarColor: 'cyan',
    status: 'offline',
  },
];

// Mock Notifications Data
export const mockNotifications: MockNotification[] = [
  {
    id: '1',
    type: 'announcement',
    title: 'Parent-Teacher Meeting',
    message: 'Reminder: Parent-teacher meeting scheduled for January 20th at 10:00 AM.',
    recipientRole: 'parent',
    recipientIds: ['1'],
    createdAt: '2026-01-12T08:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'general',
    title: 'Student Performance Update',
    message: 'Your child is performing well in Mathematics. Keep up the good work!',
    recipientRole: 'parent',
    recipientIds: ['1'],
    createdAt: '2026-01-10T14:30:00Z',
    read: true,
  },
  {
    id: '3',
    type: 'fee',
    title: 'Fee Payment Reminder',
    message: 'Tuition fee of 5,000,000 VND is due on January 15th.',
    recipientRole: 'parent',
    recipientIds: ['1'],
    createdAt: '2026-01-08T09:00:00Z',
    read: false,
  },
];

/**
 * Load all mock data
 * @returns Object containing all mock data collections
 */
export const loadMockData = () => ({
  students: mockStudents,
  grades: mockGrades,
  attendance: mockAttendance,
  fees: mockFees,
  classes: mockClasses,
  teachers: mockTeachers,
  notifications: mockNotifications,
});

/**
 * Get student by ID
 */
export const getStudentById = (studentId: string): MockStudent | undefined => {
  return mockStudents.find((s) => s.id === studentId);
};

/**
 * Get grades by student ID
 */
export const getGradesByStudentId = (studentId: string): MockGrade[] => {
  return mockGrades.filter((g) => g.studentId === studentId);
};

/**
 * Get attendance by student ID
 */
export const getAttendanceByStudentId = (studentId: string): MockAttendance[] => {
  return mockAttendance.filter((a) => a.studentId === studentId);
};

/**
 * Get fees by student ID
 */
export const getFeesByStudentId = (studentId: string): MockFee[] => {
  return mockFees.filter((f) => f.studentId === studentId);
};

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = (
  attendanceRecords: MockAttendance[]
): number => {
  if (attendanceRecords.length === 0) return 0;

  const presentDays = attendanceRecords.filter(
    (record) => record.status === 'present' || record.status === 'late' || record.status === 'excused'
  ).length;

  return Math.round((presentDays / attendanceRecords.length) * 100);
};

/**
 * Get grade letter from score
 */
export const getGradeLetter = (score: number, maxScore: number): string => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

/**
 * Get grade color based on letter
 */
export const getGradeColor = (letter: string): string => {
  const colors = {
    A: '#4CAF50',
    B: '#2196F3',
    C: '#FF9800',
    D: '#FF9800',
    F: '#F44336',
  };

  return colors[letter as keyof typeof colors] || '#757575';
};
