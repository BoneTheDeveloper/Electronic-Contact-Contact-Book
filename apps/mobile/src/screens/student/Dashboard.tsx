/**
 * Student Dashboard Screen
 * Wireframe-matched design with simplified layout
 * Shows 9 service icons in 3x3 grid for navigation
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';
import { Icon } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const HORIZONTAL_GAP = 16;
const VERTICAL_GAP = 48;
const CONTAINER_PADDING = 24;

interface ServiceIcon {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
}

// Service icons for student (9 features in 3x3 grid)
const STUDENT_SERVICE_ICONS: ServiceIcon[] = [
  { id: '1', label: 'Thời khóa\nbiểu', icon: 'calendar', color: '#F97316', route: 'StudentSchedule' },
  { id: '2', label: 'Bảng điểm\nmôn học', icon: 'check-circle', color: '#0284C7', route: 'StudentGrades' },
  { id: '3', label: 'Lịch sử\nđiểm danh', icon: 'account-check', color: '#059669', route: 'StudentAttendance' },
  { id: '4', label: 'Tài liệu\nhọc tập', icon: 'book', color: '#F43F5E', route: 'StudentStudyMaterials' },
  { id: '5', label: 'Đơn xin\nnghỉ phép', icon: 'file-document', color: '#F43F5E', route: 'StudentLeaveRequest' },
  { id: '6', label: 'Nhận xét\ngiáo viên', icon: 'message-reply', color: '#9333EA', route: 'StudentTeacherFeedback' },
  { id: '7', label: 'Tin tức &\nsự kiện', icon: 'newspaper', color: '#0EA5E9', route: 'StudentNews' },
  { id: '8', label: 'Kết quả\ntổng hợp', icon: 'chart-pie', color: '#4F46E5', route: 'StudentSummary' },
  { id: '9', label: 'Học\nphí', icon: 'cash', color: '#F59E0B', route: 'StudentPayment' },
];

interface DashboardScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

export const StudentDashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { studentData } = useStudentStore();

  const getInitials = (name?: string) => {
    if (!name) return 'SV';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'SV';
    if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
    const first = (parts[0] || '').charAt(0);
    const last = (parts[parts.length - 1] || '').charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const renderServiceIcon = (item: ServiceIcon) => {
    const containerWidth = (width - CONTAINER_PADDING * 2 - HORIZONTAL_GAP * 2) / 3;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.iconContainer, { width: containerWidth, marginBottom: VERTICAL_GAP }]}
        onPress={() => navigation?.navigate(item.route as keyof StudentHomeStackParamList)}
        activeOpacity={0.92}
      >
        <View style={styles.iconBox}>
          <Icon name={item.icon as 'calendar' | 'check-circle' | 'account-check' | 'book' | 'file-document' | 'message-reply' | 'newspaper' | 'chart-pie' | 'cash'} size={32} color={item.color} />
        </View>
        <Text style={styles.iconLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
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
              <Icon name="bell" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Icons Grid - 3x3 layout */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconsGrid}>
          {STUDENT_SERVICE_ICONS.map(renderServiceIcon)}
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
    paddingTop: 64,
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userClass: {
    color: 'rgba(224, 242, 254, 0.9)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 128,
    paddingHorizontal: 24,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
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
});
