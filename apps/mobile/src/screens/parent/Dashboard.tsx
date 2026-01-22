/**
 * Parent Dashboard Screen
 * Main screen with 9 service icons, header greeting, child selector
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
import { useAuthStore } from '../../stores';
import { useParentStore } from '../../stores';
import type { ParentHomeStackNavigationProp, ParentHomeStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const HORIZONTAL_GAP = 16; // gap-x-4 in wireframe
const VERTICAL_GAP = 40;    // gap-y-10 in wireframe
const CONTAINER_PADDING = 24; // paddingHorizontal from scrollContent

// Valid routes from Dashboard - all in HomeStack after navigation fix
type DashboardRoute = keyof ParentHomeStackParamList;

interface ServiceIcon {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: DashboardRoute;
}

const SERVICE_ICONS: ServiceIcon[] = [
  { id: '1', label: 'Thời khóa\nbiểu', icon: 'calendar', color: '#F97316', route: 'Schedule' },
  { id: '2', label: 'Bảng điểm\nmôn học', icon: 'check-circle', color: '#0284C7', route: 'Grades' },
  { id: '3', label: 'Lịch sử\nđiểm danh', icon: 'account-check', color: '#059669', route: 'Attendance' },
  { id: '4', label: 'Đơn xin\nnghỉ phép', icon: 'file-document', color: '#F43F5E', route: 'LeaveRequest' },
  { id: '5', label: 'Nhận xét\ngiáo viên', icon: 'message-reply', color: '#9333EA', route: 'TeacherFeedback' },
  { id: '6', label: 'Tin tức &\nsự kiện', icon: 'newspaper', color: '#0EA5E9', route: 'News' },
  { id: '7', label: 'Kết quả\ntổng hợp', icon: 'chart-pie', color: '#4F46E5', route: 'Summary' },
  { id: '8', label: 'Danh bạ\ngiáo viên', icon: 'account-group', color: '#0891B2', route: 'TeacherDirectory' },
  { id: '9', label: 'Học\nphí', icon: 'cash', color: '#F59E0B', route: 'PaymentOverview' },
];

interface DashboardScreenProps {
  navigation: ParentHomeStackNavigationProp;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { children, selectedChildId } = useParentStore();

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const renderServiceIcon = (item: ServiceIcon) => {
    const containerWidth = (width - CONTAINER_PADDING * 2 - HORIZONTAL_GAP * 2) / 3;

    const handlePress = () => {
      navigation.navigate(item.route as any);
    };

    return (
      <TouchableOpacity
        key={item.id}
        className="items-center"
        style={{ width: containerWidth, marginBottom: VERTICAL_GAP, paddingHorizontal: HORIZONTAL_GAP / 2 }}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View
          className="rounded-custom-28 bg-white justify-center items-center border border-gray-200"
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderColor: item.color,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            className="rounded-full justify-center items-center"
            style={{
              width: 32,
              height: 32,
              backgroundColor: `${item.color}20`,
            }}
          >
            <Text className="text-primary" style={{ fontSize: 20, color: item.color }}>
              {item.icon === 'calendar' && '📅'}
              {item.icon === 'check-circle' && '✓'}
              {item.icon === 'account-check' && '✓'}
              {item.icon === 'file-document' && '📄'}
              {item.icon === 'message-reply' && '💬'}
              {item.icon === 'newspaper' && '📰'}
              {item.icon === 'chart-pie' && '📊'}
              {item.icon === 'account-group' && '👥'}
              {item.icon === 'cash' && '💰'}
            </Text>
          </View>
        </View>
        <Text className="text-gray-600 text-xs font-extrabold text-center uppercase mt-3 leading-tight tracking-wider">
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with gradient background */}
      <View
        className="bg-primary pt-16 px-6 pb-6"
        style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              Xin chào,
            </Text>
            <Text className="text-white text-xl font-extrabold mt-1">
              {user?.name || 'Phụ huynh'}
            </Text>
          </View>
          <TouchableOpacity className="relative">
            <View
              className="rounded-full justify-center items-center"
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
              }}
            >
              <Text className="text-white text-xl">🔔</Text>
            </View>
            <View
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-error border-2 border-white justify-center items-center"
            >
              <Text className="text-error text-[9px] font-extrabold text-white">5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Child Selector Card */}
        {selectedChild && (
          <View
            className="rounded-3xl bg-white p-3 flex-row items-center"
            style={{
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <View
              className="rounded-full justify-center items-center bg-light-blue"
              style={{ width: 44, height: 44 }}
            >
              <Text className="text-primary text-base font-bold" style={{ color: '#0284C7' }}>
                {getInitials(selectedChild.name)}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
                Đang theo dõi
              </Text>
              <Text className="text-gray-800 text-sm font-bold mt-0.5">
                {selectedChild.name} • {selectedChild.grade}
                {selectedChild.section}
              </Text>
            </View>
            <View
              className="rounded-full justify-center items-center bg-transparent"
              style={{ width: 28, height: 28 }}
            >
              <Text className="text-gray-600 text-lg">▼</Text>
            </View>
          </View>
        )}
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-10 pb-24 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex-row flex-wrap -mx-2 mb-8"
          style={{ marginLeft: -HORIZONTAL_GAP / 2, marginRight: -HORIZONTAL_GAP / 2 }}
        >
          {SERVICE_ICONS.map(renderServiceIcon)}
        </View>

        {/* News Preview Section */}
        <View className="mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 text-base font-bold">Thông báo mới</Text>
            <TouchableOpacity onPress={() => navigation.navigate('News')}>
              <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          <View className="rounded-2xl bg-white border border-gray-100 p-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="bg-light-blue px-2 py-0.5 rounded-full">
                <Text className="text-primary text-[8px] font-extrabold uppercase tracking-wider">
                  Nhà trường
                </Text>
              </View>
              <Text className="text-gray-400 text-[9px] font-medium">10 phút trước</Text>
            </View>
            <Text className="text-gray-800 text-sm font-semibold leading-5" numberOfLines={2}>
              Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};