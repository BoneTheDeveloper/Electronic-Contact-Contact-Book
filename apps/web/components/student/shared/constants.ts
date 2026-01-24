/**
 * Student Portal Constants
 * Colors, icons, and configuration matching mobile wireframes
 */

// Student function icons for dashboard navigation
export const STUDENT_FUNCTIONS = [
  { id: 'schedule', label: 'Thời khóa biểu', icon: 'calendar', color: '#F97316', route: '/student/schedule' },
  { id: 'grades', label: 'Bảng điểm môn học', icon: 'check-circle', color: '#0284C7', route: '/student/grades' },
  { id: 'attendance', label: 'Lịch sử điểm danh', icon: 'account-check', color: '#059669', route: '/student/attendance' },
  { id: 'materials', label: 'Tài liệu học tập', icon: 'book', color: '#F43F5E', route: '/student/materials' },
  { id: 'leave', label: 'Đơn xin nghỉ phép', icon: 'file-document', color: '#F43F5E', route: '/student/leave' },
  { id: 'feedback', label: 'Nhận xét giáo viên', icon: 'message-reply', color: '#9333EA', route: '/student/feedback' },
  { id: 'news', label: 'Tin tức & sự kiện', icon: 'newspaper', color: '#0EA5E9', route: '/student/news' },
  { id: 'summary', label: 'Kết quả tổng hợp', icon: 'chart-pie', color: '#4F46E5', route: '/student/summary' },
  { id: 'payments', label: 'Học phí', icon: 'cash', color: '#F59E0B', route: '/student/payments' },
] as const;

// Subject colors matching wireframes
export const SUBJECT_COLORS: Record<string, { bg: string; text: string; short: string }> = {
  'Toán học': { bg: 'bg-orange-100', text: 'text-orange-500', short: 'Toán' },
  'Toán': { bg: 'bg-orange-100', text: 'text-orange-500', short: 'Toán' },
  'Ngữ văn': { bg: 'bg-purple-100', text: 'text-purple-600', short: 'Văn' },
  'Tiếng Anh': { bg: 'bg-emerald-100', text: 'text-emerald-600', short: 'Anh' },
  'Anh': { bg: 'bg-emerald-100', text: 'text-emerald-600', short: 'Anh' },
  'Vật lý': { bg: 'bg-indigo-100', text: 'text-indigo-600', short: 'Lý' },
  'Hóa học': { bg: 'bg-amber-100', text: 'text-amber-600', short: 'Hóa' },
  'Lịch sử': { bg: 'bg-rose-100', text: 'text-rose-600', short: 'Sử' },
  'Địa lý': { bg: 'bg-cyan-100', text: 'text-cyan-600', short: 'Địa' },
  'Sinh học': { bg: 'bg-green-100', text: 'text-green-600', short: 'Sinh' },
} as const;

// Status colors
export const STATUS_COLORS = {
  present: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Có mặt' },
  absent: { bg: 'bg-red-100', text: 'text-red-600', label: 'Vắng' },
  late: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Muộn' },
  excused: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Có phép' },
  paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã đóng' },
  unpaid: { bg: 'bg-red-100', text: 'text-red-600', label: 'Chưa đóng' },
  partial: { bg: 'bg-orange-100', text: 'text-orange-600', label: 'Một phần' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Đang xử lý' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Đã duyệt' },
  rejected: { bg: 'bg-red-100', text: 'text-red-600', label: 'Từ chối' },
} as const;

// Day names for schedule
export const DAY_NAMES = [
  { value: 1, label: 'T2', name: 'Thứ Hai' },
  { value: 2, label: 'T3', name: 'Thứ Ba' },
  { value: 3, label: 'T4', name: 'Thứ Tư' },
  { value: 4, label: 'T5', name: 'Thứ Năm' },
  { value: 5, label: 'T6', name: 'Thứ Sáu' },
  { value: 6, label: 'T7', name: 'Thứ Bảy' },
  { value: 7, label: 'CN', name: 'Chủ Nhật' },
] as const;

// Grade classification
export const GRADE_CLASSIFICATION = [
  { min: 9, label: 'Xuất sắc', color: 'text-purple-600', bg: 'bg-purple-100' },
  { min: 8, label: 'Giỏi', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { min: 7, label: 'Khá', color: 'text-sky-600', bg: 'bg-sky-100' },
  { min: 5, label: 'Trung bình', color: 'text-amber-600', bg: 'bg-amber-100' },
  { min: 0, label: 'Yếu', color: 'text-red-600', bg: 'bg-red-100' },
] as const;

// Helper functions
export function getSubjectInfo(subjectName: string) {
  return SUBJECT_COLORS[subjectName] || { bg: 'bg-gray-100', text: 'text-gray-600', short: subjectName.slice(0, 3) };
}

export function getGradeClassification(average: number) {
  return GRADE_CLASSIFICATION.find(c => average >= c.min) || GRADE_CLASSIFICATION[4];
}

export function getDayNumber(dayOfWeek: number): number {
  const now = new Date();
  const currentDay = now.getDay() || 7;
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.getDate();
}

export function getInitials(name?: string): string {
  if (!name) return 'SV';
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return 'SV';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return `${first}${last}`.toUpperCase();
}
