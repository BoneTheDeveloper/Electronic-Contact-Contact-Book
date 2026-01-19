/**
 * Screen Testing Checklist
 * Development-only utility to track and validate all screens in the app
 */

export interface ScreenChecklistItem {
  path: string;
  name: string;
  category: 'auth' | 'dashboard' | 'students' | 'teachers' | 'attendance' | 'grades' | 'messages' | 'profile' | 'payments' | 'settings';
  critical: boolean;
  description?: string;
  navigationParams?: Record<string, any>;
}

export interface ScreenTestResult {
  path: string;
  name: string;
  passed: boolean;
  notes: string;
  platform: 'ios' | 'android' | 'both';
  timestamp: Date;
}

/**
 * Complete screen checklist for manual testing
 * 37 screens total across all navigation stacks
 */
export const SCREEN_CHECKLIST: ScreenChecklistItem[] = [
  // ==================== AUTH SCREENS ====================
  {
    path: 'auth/login',
    name: 'Login Screen',
    category: 'auth',
    critical: true,
    description: 'Custom login with role toggle (Giáo viên/Quản trị viên)',
  },
  {
    path: 'auth/forgot-password',
    name: 'Forgot Password',
    category: 'auth',
    critical: false,
    description: 'Multi-step verification flow',
  },

  // ==================== PARENT TAB ====================
  {
    path: 'parent/dashboard',
    name: 'Parent Dashboard',
    category: 'dashboard',
    critical: true,
    description: '9-service icon grid with student overview',
  },
  {
    path: 'parent/schedule',
    name: 'Parent Schedule',
    category: 'dashboard',
    critical: true,
    description: 'Weekly class schedule display',
  },
  {
    path: 'parent/grades',
    name: 'Parent Grades',
    category: 'grades',
    critical: true,
    description: 'Grade summary and detail view',
  },
  {
    path: 'parent/attendance',
    name: 'Parent Attendance',
    category: 'attendance',
    critical: true,
    description: 'Attendance calendar and summary',
  },
  {
    path: 'parent/announcements',
    name: 'Parent Announcements',
    category: 'messages',
    critical: false,
    description: 'School announcements list',
  },
  {
    path: 'parent/messages',
    name: 'Parent Messages',
    category: 'messages',
    critical: false,
    description: 'Teacher-parent messaging',
  },
  {
    path: 'parent/payments',
    name: 'Parent Payments',
    category: 'payments',
    critical: true,
    description: 'Payment history and status',
  },
  {
    path: 'parent/payment-detail',
    name: 'Payment Detail',
    category: 'payments',
    critical: true,
    description: 'Individual payment details',
    navigationParams: { paymentId: 'string' },
  },
  {
    path: 'parent/profile',
    name: 'Parent Profile',
    category: 'profile',
    critical: true,
    description: 'Parent profile settings',
  },

  // ==================== STUDENT TAB ====================
  {
    path: 'student/dashboard',
    name: 'Student Dashboard',
    category: 'dashboard',
    critical: true,
    description: 'Student overview with schedule',
  },
  {
    path: 'student/schedule',
    name: 'Student Schedule',
    category: 'dashboard',
    critical: true,
    description: 'Weekly schedule view',
  },
  {
    path: 'student/grades',
    name: 'Student Grades',
    category: 'grades',
    critical: true,
    description: 'Personal grade view',
  },
  {
    path: 'student/attendance',
    name: 'Student Attendance',
    category: 'attendance',
    critical: true,
    description: 'Attendance record view',
  },
  {
    path: 'student/homework',
    name: 'Student Homework',
    category: 'dashboard',
    critical: false,
    description: 'Homework assignments',
  },
  {
    path: 'student/profile',
    name: 'Student Profile',
    category: 'profile',
    critical: true,
    description: 'Student profile information',
  },

  // ==================== TEACHER SCREENS ====================
  {
    path: 'teacher/dashboard',
    name: 'Teacher Dashboard',
    category: 'dashboard',
    critical: true,
    description: 'Teacher overview with classes',
  },
  {
    path: 'teacher/students',
    name: 'Teacher Student List',
    category: 'students',
    critical: true,
    description: 'Class student management',
  },
  {
    path: 'teacher/student-detail',
    name: 'Teacher Student Detail',
    category: 'students',
    critical: true,
    description: 'Individual student information',
    navigationParams: { studentId: 'string' },
  },
  {
    path: 'teacher/attendance',
    name: 'Teacher Attendance',
    category: 'attendance',
    critical: true,
    description: 'Take attendance for class',
  },
  {
    path: 'teacher/grades',
    name: 'Teacher Grades',
    category: 'grades',
    critical: true,
    description: 'Grade entry and management',
  },
  {
    path: 'teacher/messages',
    name: 'Teacher Messages',
    category: 'messages',
    critical: false,
    description: 'Parent communication',
  },
  {
    path: 'teacher/profile',
    name: 'Teacher Profile',
    category: 'profile',
    critical: true,
    description: 'Teacher profile settings',
  },

  // ==================== ADMIN SCREENS ====================
  {
    path: 'admin/dashboard',
    name: 'Admin Dashboard',
    category: 'dashboard',
    critical: true,
    description: 'School overview and statistics',
  },
  {
    path: 'admin/students',
    name: 'Admin Student Management',
    category: 'students',
    critical: true,
    description: 'Full student directory',
  },
  {
    path: 'admin/student-new',
    name: 'Admin New Student',
    category: 'students',
    critical: true,
    description: 'Create new student record',
  },
  {
    path: 'admin/student-edit',
    name: 'Admin Edit Student',
    category: 'students',
    critical: true,
    description: 'Edit student information',
    navigationParams: { studentId: 'string' },
  },
  {
    path: 'admin/teachers',
    name: 'Admin Teacher Management',
    category: 'teachers',
    critical: true,
    description: 'Teacher directory and management',
  },
  {
    path: 'admin/teacher-new',
    name: 'Admin New Teacher',
    category: 'teachers',
    critical: true,
    description: 'Add new teacher',
  },
  {
    path: 'admin/classes',
    name: 'Admin Class Management',
    category: 'dashboard',
    critical: true,
    description: 'Class assignment and management',
  },
  {
    path: 'admin/attendance',
    name: 'Admin Attendance Overview',
    category: 'attendance',
    critical: false,
    description: 'School-wide attendance reports',
  },
  {
    path: 'admin/grades',
    name: 'Admin Grades Overview',
    category: 'grades',
    critical: false,
    description: 'Grade reports and analytics',
  },
  {
    path: 'admin/announcements',
    name: 'Admin Announcements',
    category: 'messages',
    critical: false,
    description: 'Create and manage announcements',
  },
  {
    path: 'admin/payments',
    name: 'Admin Payments',
    category: 'payments',
    critical: true,
    description: 'Payment management and records',
  },
  {
    path: 'admin/settings',
    name: 'Admin Settings',
    category: 'settings',
    critical: true,
    description: 'System configuration',
  },
  {
    path: 'admin/profile',
    name: 'Admin Profile',
    category: 'profile',
    critical: true,
    description: 'Admin profile settings',
  },
];

/**
 * Get screens by category
 */
export const getScreensByCategory = (category: ScreenChecklistItem['category']): ScreenChecklistItem[] => {
  return SCREEN_CHECKLIST.filter((screen) => screen.category === category);
};

/**
 * Get critical screens only
 */
export const getCriticalScreens = (): ScreenChecklistItem[] => {
  return SCREEN_CHECKLIST.filter((screen) => screen.critical);
};

/**
 * Get total screen count
 */
export const getTotalScreenCount = (): number => {
  return SCREEN_CHECKLIST.length;
};

/**
 * Get critical screen count
 */
export const getCriticalScreenCount = (): number => {
  return SCREEN_CHECKLIST.filter((screen) => screen.critical).length;
};

/**
 * Print checklist to console (for development reference)
 */
export const printChecklist = (): void => {
  if (__DEV__) {
    console.log('=== Screen Testing Checklist ===');
    console.log(`Total Screens: ${getTotalScreenCount()}`);
    console.log(`Critical Screens: ${getCriticalScreenCount()}`);
    console.log('');

    const categories = Array.from(new Set(SCREEN_CHECKLIST.map((s) => s.category)));
    categories.forEach((category) => {
      const screens = getScreensByCategory(category as ScreenChecklistItem['category']);
      console.log(`[${category.toUpperCase()}] ${screens.length} screens`);
      screens.forEach((screen) => {
        const critical = screen.critical ? ' 🔴 CRITICAL' : ' ⚪';
        console.log(`  ${critical} ${screen.name} (${screen.path})`);
      });
      console.log('');
    });

    console.log('================================');
  }
};

/**
 * Validate screen count matches expected
 */
export const validateScreenCount = (): boolean => {
  const expectedCount = 37;
  const actualCount = getTotalScreenCount();

  if (__DEV__ && actualCount !== expectedCount) {
    console.warn(
      `Screen count mismatch! Expected ${expectedCount}, found ${actualCount}`
    );
  }

  return actualCount === expectedCount;
};
