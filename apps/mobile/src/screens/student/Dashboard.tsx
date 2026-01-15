/**
 * Student Dashboard Screen
 * Updated with service icon grid matching wireframe design
 * Shows 9 service icons for navigation
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../stores';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const GAP = 16;

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
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const renderServiceIcon = (item: ServiceIcon) => {
    const containerWidth = (width - 32 - GAP * 2) / 3;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.iconContainer, { width: containerWidth }]}
        onPress={() => navigation.navigate(item.route as never)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrapper, { borderColor: item.color }]}>
          <Avatar.Icon size={32} icon={item.icon} style={{ backgroundColor: `${item.color}20` }} />
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={56}
              label={getInitials(studentData?.name || user?.name)}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              labelStyle={{ color: '#FFFFFF', fontSize: 20 }}
            />
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
          <TouchableOpacity style={styles.notificationBell}>
            <Avatar.Icon size={40} icon="bell" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#FFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.assignmentsContainer}>
            {MOCK_ASSIGNMENTS.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentItem}>
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentSubject}>
                    <Text style={styles.assignmentSubjectText}>{assignment.subject}</Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(assignment.priority)}20` }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(assignment.priority) }]}>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
  },
  greeting: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  userName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 4,
  },
  userClass: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  notificationBell: {
    position: 'relative',
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
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    marginBottom: 24,
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 12,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
  statsSection: {
    marginBottom: 24,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  assignmentsContainer: {
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentSubject: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  assignmentSubjectText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  assignmentDue: {
    fontSize: 12,
    color: '#6B7280',
  },
});
