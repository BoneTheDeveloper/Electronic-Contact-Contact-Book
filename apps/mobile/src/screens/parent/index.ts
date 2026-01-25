/**
 * Parent Screens Index
 * Exports all parent screens
 * Note: Using student screens implementations with mock data for now
 */

export { DashboardScreen } from './Dashboard';
export { ChildSelectionScreen } from './ChildSelection';

// Re-export student screens for parent use (with mock data)
// Note: StudyMaterials is a student-only feature
export {
  ScheduleScreen,
  GradesScreen,
  AttendanceScreen,
  LeaveRequestScreen,
  TeacherFeedbackScreen,
  NewsScreen,
  SummaryScreen,
} from '../student';

// Parent-specific screens
export { MessagesScreen } from './Messages';
export { NotificationsScreen } from './Notifications';
export { TeacherDirectoryScreen } from './TeacherDirectory';
export { PaymentOverviewScreen } from './PaymentOverview';
export { PaymentDetailScreen } from './PaymentDetail';
export { PaymentMethodScreen } from './PaymentMethod';
export { PaymentReceiptScreen } from './PaymentReceipt';
export { ChatDetailScreen } from './ChatDetail';
