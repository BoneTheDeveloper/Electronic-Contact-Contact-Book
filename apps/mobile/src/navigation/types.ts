/**
 * Navigation Type Definitions
 * Centralized type definitions for React Navigation v7
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

// ============================================================================
// Root Stack - Main app navigation
// ============================================================================

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Parent: NavigatorScreenParams<ParentTabParamList>;
  Student: NavigatorScreenParams<StudentTabParamList>;
  Teacher: undefined;
  Admin: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============================================================================
// Auth Stack - Authentication screens
// ============================================================================

export type AuthStackParamList = {
  Login: undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

// ============================================================================
// Parent Tab - Parent user tabs
// ============================================================================

export type ParentTabParamList = {
  ParentHome: NavigatorScreenParams<ParentHomeStackParamList>;
  ParentMessages: NavigatorScreenParams<ParentCommStackParamList>;
  ParentProfile: NavigatorScreenParams<ParentProfileStackParamList>;
};

// Parent Home Stack (includes all screens accessible from Dashboard)
export type ParentHomeStackParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  Grades: undefined;
  Attendance: undefined;
  TeacherFeedback: undefined;
  LeaveRequest: undefined;
  Summary: undefined;
  TeacherDirectory: undefined;
  // News and Payment screens accessible from Dashboard
  News: undefined;
  PaymentOverview: undefined;
  PaymentDetail: { paymentId?: string };
  PaymentMethod: undefined;
  PaymentReceipt: { receiptId?: string };
};

export type ParentHomeStackNavigationProp = NativeStackNavigationProp<ParentHomeStackParamList>;

// Parent Payment Stack (nested in Home)
export type ParentPaymentStackParamList = {
  PaymentOverview: undefined;
  PaymentDetail: { paymentId?: string };
  PaymentMethod: undefined;
  PaymentReceipt: { receiptId?: string };
};

// Parent Comm Stack
export type ParentCommStackParamList = {
  Messages: undefined;
  Notifications: undefined;
  News: undefined;
};

export type ParentCommStackNavigationProp = NativeStackNavigationProp<ParentCommStackParamList>;

// Parent Profile Stack
export type ParentProfileStackParamList = {
  Profile: undefined;
};

// ============================================================================
// Student Tab - Student user tabs
// ============================================================================

export type StudentTabParamList = {
  StudentHome: NavigatorScreenParams<StudentHomeStackParamList>;
  StudentProfile: NavigatorScreenParams<StudentProfileStackParamList>;
};

// Student Home Stack
export type StudentHomeStackParamList = {
  StudentDashboard: undefined;
  StudentSchedule: undefined;
  StudentGrades: undefined;
  StudentAttendance: undefined;
  StudentStudyMaterials: undefined;
  StudentLeaveRequest: undefined;
  StudentTeacherFeedback: undefined;
  StudentNews: undefined;
  StudentSummary: undefined;
  StudentPayment: undefined;
};

export type StudentHomeStackNavigationProp = NativeStackNavigationProp<StudentHomeStackParamList>;

// Student Profile Stack
export type StudentProfileStackParamList = {
  Profile: undefined;
};

// ============================================================================
// Generic Navigation Props
// ============================================================================

export type NavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;
