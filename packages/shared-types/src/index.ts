// User & Role Types
export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Student Types
export interface Student extends User {
  role: 'student';
  rollNumber: string;
  classId: string;
  section: string;
  dateOfBirth: Date;
  parentIds: string[];
}

export interface Parent extends User {
  role: 'parent';
  phone: string;
  address: string;
  childrenIds: string[];
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  subjects: string[];
  phone: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Academic Types
export interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  teacherId: string;
  studentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  examType: 'midterm' | 'final' | 'quiz' | 'assignment';
  score: number;
  maxScore: number;
  date: Date;
  remarks?: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

// Notification Types (legacy - use notification.ts for new multi-channel system)
export type NotificationType = 'announcement' | 'homework' | 'exam' | 'fee' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientRole: UserRole;
  recipientIds: string[];
  createdAt: Date;
  read: boolean;
}

// Multi-Channel Notification System
export * from './notification';

// Fee Types
export interface Fee {
  id: string;
  studentId: string;
  type: 'tuition' | 'transport' | 'library' | 'lab' | 'other';
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: Date;
  remarks?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  user: User;
  token: string;
  refreshToken: string;
}

// Auth State for stores
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock User Data for authentication
export interface MockUserData {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export const mockUserDatabase: Record<string, MockUserData> = {
  'parent@school.edu': {
    id: '1',
    email: 'parent@school.edu',
    name: 'Nguyen Van A',
    role: 'parent',
    avatar: undefined,
  },
  'student@school.edu': {
    id: '2',
    email: 'student@school.edu',
    name: 'Nguyen Van B',
    role: 'student',
    avatar: undefined,
  },
  'teacher@school.edu': {
    id: '3',
    email: 'teacher@school.edu',
    name: 'Teacher A',
    role: 'teacher',
    avatar: undefined,
  },
  'admin@school.edu': {
    id: '4',
    email: 'admin@school.edu',
    name: 'Admin User',
    role: 'admin',
    avatar: undefined,
  },
};
