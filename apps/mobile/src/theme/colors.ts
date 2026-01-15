/**
 * Color System for EContact School App
 * Based on design guidelines with #0284C7 as primary color
 */

export const colors = {
  // Primary Brand Colors
  primary: '#0284C7',        // Main brand blue
  primaryLight: '#38BDF8',   // Lighter blue
  primaryDark: '#0369A1',    // Darker blue

  // Secondary Colors
  secondary: '#64748B',      // Slate gray
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',

  // Status Colors
  success: '#4CAF50',        // Green for success/present/paid
  successLight: '#81C784',
  successDark: '#388E3C',

  warning: '#FF9800',        // Orange for warnings/late/pending
  warningLight: '#FFB74D',
  warningDark: '#F57C00',

  error: '#F44336',          // Red for errors/absent/overdue
  errorLight: '#E57373',
  errorDark: '#D32F2F',

  // Neutral Colors (Text Hierarchy)
  textPrimary: '#212121',    // Headings, body text
  textSecondary: '#757575',  // Labels, descriptions
  textDisabled: '#BDBDBD',   // Placeholders, inactive
  textHint: '#9E9E9E',       // Helper text

  // Background Colors
  background: '#FFFFFF',     // Main content
  backgroundSecondary: '#F5F5F5',  // Cards, sections
  backgroundTertiary: '#EEEEEE',   // Dividers

  // Surface Colors
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',

  // Border Colors
  border: '#E0E0E0',
  borderDark: '#BDBDBD',

  // Grade Colors
  gradeA: '#4CAF50',         // 90-100%
  gradeB: '#2196F3',         // 80-89%
  gradeC: '#FF9800',         // 70-79%
  gradeD: '#FF9800',         // 60-69%
  gradeF: '#F44336',         // 0-59%

  // Semantic Colors for Attendance
  attendancePresent: '#4CAF50',
  attendanceAbsent: '#F44336',
  attendanceLate: '#FF9800',
  attendanceExcused: '#2196F3',

  // Semantic Colors for Fees
  feePaid: '#4CAF50',
  feePending: '#FF9800',
  feeOverdue: '#F44336',
};

export type ColorKeys = keyof typeof colors;
