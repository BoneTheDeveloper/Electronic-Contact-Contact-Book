/**
 * Parent Dashboard Screen
 * Main screen with 9 service icons, header greeting, child selector
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores';
import { useParentStore } from '../../stores';
import type { ParentHomeStackNavigationProp, ParentHomeStackParamList } from '../../navigation/types';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const HORIZONTAL_GAP = 16;
const VERTICAL_GAP = 40;
const CONTAINER_PADDING = 24;

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
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'U';
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
      'file-document': '📄',
      'message-reply': '💬',
      'newspaper': '📰',
      'chart-pie': '📊',
      'account-group': '👥',
      'cash': '💰',
    };
    return iconMap[icon] || '•';
  };

  const renderServiceIcon = (item: ServiceIcon) => {
    const containerWidth = (width - CONTAINER_PADDING * 2 - HORIZONTAL_GAP * 2) / 3;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.iconContainer, { width: containerWidth, marginBottom: VERTICAL_GAP, paddingHorizontal: HORIZONTAL_GAP / 2 }]}
        onPress={() => navigation.navigate(item.route as any)}
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

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>{user?.name || 'Phụ huynh'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationEmoji}>🔔</Text>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Child Selector Card */}
        {selectedChild && (
          <TouchableOpacity
            style={styles.childCard}
            onPress={() => navigation.navigate('ChildSelection')}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { backgroundColor: '#E0F2FE' }]}>
              <Text style={[styles.avatarText, { color: '#0284C7' }]}>
                {getInitials(selectedChild.name)}
              </Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childLabel}>Đang theo dõi</Text>
              <Text style={styles.childName}>
                {selectedChild.name} • {selectedChild.grade}
                {selectedChild.section}
              </Text>
            </View>
            <View style={styles.dropdownIcon}>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.iconsGrid,
            { marginLeft: -HORIZONTAL_GAP / 2, marginRight: -HORIZONTAL_GAP / 2 },
          ]}
        >
          {SERVICE_ICONS.map(renderServiceIcon)}
        </View>

        {/* News Preview Section */}
        <View style={styles.newsSection}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>Thông báo mới</Text>
            <TouchableOpacity onPress={() => navigation.navigate('News')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.newsCard}>
            <View style={styles.newsMeta}>
              <View style={[styles.newsTag, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.newsTagText, { color: '#0284C7' }]}>Nhà trường</Text>
              </View>
              <Text style={styles.newsTime}>10 phút trước</Text>
            </View>
            <Text style={styles.newsText} numberOfLines={2}>
              Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026...
            </Text>
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
    marginBottom: 24,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
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
    fontSize: 20,
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
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  childName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  dropdownIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownArrow: {
    color: '#6B7280',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 40,
    paddingBottom: 96,
    paddingHorizontal: 24,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontSize: 20,
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
  newsSection: {
    marginTop: 8,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  newsTagText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsTime: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  newsText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
