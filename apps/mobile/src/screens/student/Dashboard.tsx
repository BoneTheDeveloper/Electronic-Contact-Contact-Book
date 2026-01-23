/**
 * Student Dashboard Screen
 * Updated with service icon grid matching wireframe design
 * Shows 9 service icons for navigation
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const HORIZONTAL_GAP = 16;
const VERTICAL_GAP = 24;
const CONTAINER_PADDING = 24;

interface ServiceIcon {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
}

// Service icons for student (same as parent, except Study Materials instead of Teacher Directory)
const STUDENT_SERVICE_ICONS: ServiceIcon[] = [
  { id: '1', label: 'Thời khóa\nbiểu', icon: 'calendar', color: '#F97316', route: 'StudentSchedule' },
  { id: '2', label: 'Bảng điểm\nmôn học', icon: 'check-circle', color: '#0284C7', route: 'StudentGrades' },
  { id: '3', label: 'Lịch sử\nđiểm danh', icon: 'account-check', color: '#059669', route: 'StudentAttendance' },
  { id: '4', label: 'Tài liệu\nhọc tập', icon: 'book-open-variant', color: '#F43F5E', route: 'StudentStudyMaterials' },
  { id: '5', label: 'Đơn xin\nnghỉ phép', icon: 'file-document', color: '#F43F5E', route: 'StudentLeaveRequest' },
  { id: '6', label: 'Nhận xét\ngiáo viên', icon: 'message-reply', color: '#9333EA', route: 'StudentTeacherFeedback' },
  { id: '7', label: 'Tin tức &\nsự kiện', icon: 'newspaper', color: '#0EA5E9', route: 'StudentNews' },
  { id: '8', label: 'Kết quả\ntổng hợp', icon: 'chart-pie', color: '#4F46E5', route: 'StudentSummary' },
  { id: '9', label: 'Học\nphí', icon: 'cash', color: '#F59E0B', route: 'StudentPayment' },
];

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    subject: 'Toán',
    title: 'Bài tập chương 5: Bài 45-50',
    dueDate: '2026-01-15',
    priority: 'high',
  },
  {
    id: '2',
    subject: 'Văn',
    title: 'Viết bài văn kể chuyện',
    dueDate: '2026-01-16',
    priority: 'medium',
  },
];

interface DashboardScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const StudentDashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { studentData, grades, attendancePercentage } = useStudentStore();

  const getInitials = (name?: string) => {
    if (!name) return 'SV';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'SV';
    if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
    const first = (parts[0] || '').charAt(0);
    const last = (parts[parts.length - 1] || '').charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const getIconEmoji = (icon: string) => {
    const iconMap: Record<string, string> = {
      'calendar': '📅',
      'check-circle': '✓',
      'account-check': '✓',
      'book-open-variant': '📖',
      'file-document': '📄',
      'message-reply': '💬',
      'newspaper': '📰',
      'chart-pie': '📊',
      'cash': '💰',
    };
    return iconMap[icon] || '•';
  };

  const renderServiceIcon = (item: ServiceIcon) => {
    const containerWidth = (width - CONTAINER_PADDING * 2 - HORIZONTAL_GAP * 2) / 3;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.iconContainer, { width: containerWidth, marginBottom: VERTICAL_GAP }]}
        onPress={() => navigation.navigate(item.route as never)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconBox,
            {
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderColor: item.color,
              backgroundColor: '#FFFFFF',
            },
          ]}
        >
          <View style={[styles.iconInner, { backgroundColor: `${item.color}20` }]}>
            <Text style={[styles.iconEmoji, { color: item.color }]}>
              {getIconEmoji(item.icon)}
            </Text>
          </View>
        </View>
        <Text style={styles.iconLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return `Còn ${diffDays} ngày`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Quan trọng';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thường';
      default: return priority;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(studentData?.name || user?.name)}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.userName}>{studentData?.name || user?.name}</Text>
              {studentData && (
                <Text style={styles.userClass}>
                  Lớp {studentData.grade}{studentData.section}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationEmoji}>🔔</Text>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconsGrid}>
          {STUDENT_SERVICE_ICONS.map(renderServiceIcon)}
        </View>

        {/* Quick Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {grades.length > 0
                  ? (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length).toFixed(1)
                  : '-'}
              </Text>
              <Text style={styles.statLabel}>Điểm TB</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{attendancePercentage}%</Text>
              <Text style={styles.statLabel}>Đi học</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Assignments Section */}
        <View style={styles.assignmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bài tập sắp tới</Text>
            <TouchableOpacity onPress={() => navigation.navigate('StudentGrades' as never)}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.assignmentsCard}>
            {MOCK_ASSIGNMENTS.map((assignment, index) => (
              <View
                key={assignment.id}
                style={[styles.assignmentItem, index === MOCK_ASSIGNMENTS.length - 1 ? styles.assignmentItemLast : {}]}
              >
                <View style={styles.assignmentHeader}>
                  <View style={[styles.subjectTag, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.subjectTagText, { color: colors.primary }]}>
                      {assignment.subject}
                    </Text>
                  </View>
                  <View
                    style={[styles.priorityTag, { backgroundColor: `${getPriorityColor(assignment.priority)}20` }]}
                  >
                    <Text
                      style={[styles.priorityTagText, { color: getPriorityColor(assignment.priority) }]}
                    >
                      {getPriorityLabel(assignment.priority)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentDue}>Hạn: {formatDate(assignment.dueDate)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    marginLeft: 16,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  userClass: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 40,
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 14,
    fontWeight: '800',
  },
  iconLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 12,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    color: '#1F2937',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  assignmentsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assignmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  assignmentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  assignmentItemLast: {
    borderBottomWidth: 0,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectTagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  assignmentTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  assignmentDue: {
    color: '#6B7280',
    fontSize: 12,
  },
});
