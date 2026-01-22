/**
 * Student Dashboard Screen
 * Updated with service icon grid matching wireframe design
 * Shows 9 service icons for navigation
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
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
        className="items-center mb-6"
        style={{ width: containerWidth }}
        onPress={() => navigation.navigate(item.route as never)}
        activeOpacity={0.7}
      >
        <View
          className="w-20 h-20 rounded-[28px] bg-white justify-center items-center border border-gray-200 shadow-sm"
          style={{ borderColor: item.color, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
        >
          <View className="w-8 h-8 rounded-full justify-center items-center" style={{ backgroundColor: `${item.color}20` }}>
            <Text className="text-xs" style={{ color: item.color, fontWeight: '800' }}>
              {item.icon === 'calendar' ? '📅' :
               item.icon === 'check-circle' ? '✓' :
               item.icon === 'account-check' ? '✓' :
               item.icon === 'book-open-variant' ? '📖' :
               item.icon === 'file-document' ? '📄' :
               item.icon === 'message-reply' ? '💬' :
               item.icon === 'newspaper' ? '📰' :
               item.icon === 'chart-pie' ? '📊' : '💰'}
            </Text>
          </View>
        </View>
        <Text className="text-[10px] font-extrabold text-gray-600 text-center uppercase mt-3 leading-[14px] tracking-wider">
          {item.label}
        </Text>
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
    <View className="flex-1 bg-slate-50">
      {/* Header with gradient background */}
      <View
        className="pt-15 px-6 pb-6"
        style={{ backgroundColor: colors.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View
              className="w-14 h-14 rounded-full justify-center items-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-white text-xl font-bold">
                {getInitials(studentData?.name || user?.name)}
              </Text>
            </View>
            <View className="ml-4">
              <Text className="text-xs text-white/80 font-semibold">Xin chào,</Text>
              <Text className="text-xl text-white font-extrabold mt-1">{studentData?.name || user?.name}</Text>
              {studentData && (
                <Text className="text-xs text-white/70 mt-0.5">
                  Lớp {studentData.grade}{studentData.section}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity className="relative">
            <View
              className="w-10 h-10 rounded-full justify-center items-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Text className="text-white text-lg">🔔</Text>
            </View>
            <View
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full justify-center items-center border-2 border-white"
              style={{ backgroundColor: '#EF4444' }}
            >
              <Text className="text-[9px] font-extrabold text-white">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-10 pb-25 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between mb-8">
          {STUDENT_SERVICE_ICONS.map(renderServiceIcon)}
        </View>

        {/* Quick Stats Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-800 mb-4">Tổng quan</Text>
          <View className="flex-row justify-between">
            <View
              className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 shadow-sm"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
            >
              <Text className="text-2xl font-extrabold text-gray-800">
                {grades.length > 0
                  ? (grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length).toFixed(1)
                  : '-'}
              </Text>
              <Text className="text-xs font-semibold text-gray-600 mt-1">Điểm TB</Text>
            </View>
            <View
              className="flex-1 bg-white rounded-2xl p-4 items-center mx-1 shadow-sm"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
            >
              <Text className="text-2xl font-extrabold text-gray-800">{attendancePercentage}%</Text>
              <Text className="text-xs font-semibold text-gray-600 mt-1">Đi học</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Assignments Section */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-gray-800">Bài tập sắp tới</Text>
            <TouchableOpacity onPress={() => navigation.navigate('StudentGrades' as never)}>
              <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.primary }}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className="bg-white rounded-2xl p-4 shadow-sm"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}
          >
            {MOCK_ASSIGNMENTS.map((assignment, index) => (
              <View
                key={assignment.id}
                className="border-b border-gray-100 py-3"
                style={index === MOCK_ASSIGNMENTS.length - 1 ? { borderBottomWidth: 0 } : {}}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <View className="bg-blue-100 px-2.5 py-1 rounded-lg">
                    <Text className="text-[11px] font-bold uppercase" style={{ color: colors.primary }}>
                      {assignment.subject}
                    </Text>
                  </View>
                  <View
                    className="px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: `${getPriorityColor(assignment.priority)}20` }}
                  >
                    <Text
                      className="text-[10px] font-bold uppercase"
                      style={{ color: getPriorityColor(assignment.priority) }}
                    >
                      {getPriorityLabel(assignment.priority)}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-semibold text-gray-800 mb-1">{assignment.title}</Text>
                <Text className="text-xs text-gray-600">Hạn: {formatDate(assignment.dueDate)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
