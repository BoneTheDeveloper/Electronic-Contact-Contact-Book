/**
 * Parent Dashboard Screen
 * Main screen with 9 service icons, header greeting, child selector
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, Avatar, Card } from 'react-native-paper';
import { useAuthStore } from '../../stores';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';
import type { ParentHomeStackNavigationProp, ParentHomeStackParamList, ParentTabParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const ICON_SIZE = 80;
const GAP = 16;

// Valid routes from Dashboard: HomeStack routes + tab navigation routes
type DashboardRoute = keyof ParentHomeStackParamList | 'News' | 'PaymentOverview';

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
    const containerWidth = (width - 32 - GAP * 2) / 3;
    const handlePress = () => {
      // Navigate to route - works for both HomeStack routes and tab routes
      navigation.navigate(item.route as keyof ParentHomeStackParamList);
    };
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.iconContainer, { width: containerWidth }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrapper, { borderColor: item.color }]}>
          <Avatar.Icon size={32} icon={item.icon} style={{ backgroundColor: `${item.color}20` }} />
        </View>
        <Text style={styles.iconLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingLabel}>Xin chào,</Text>
            <Text style={styles.userName}>{user?.name || 'Phụ huynh'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBell}>
            <Avatar.Icon size={40} icon="bell" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#FFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Child Selector Card */}
        {selectedChild && (
          <Card style={styles.childCard}>
            <Card.Content style={styles.childCardContent}>
              <Avatar.Text
                size={44}
                label={getInitials(selectedChild.name)}
                style={{ backgroundColor: '#E0F2FE' }}
                labelStyle={{ color: '#0284C7' }}
              />
              <View style={styles.childInfo}>
                <Text style={styles.childLabel}>Đang theo dõi</Text>
                <Text style={styles.childName}>
                  {selectedChild.name} • {selectedChild.grade}{selectedChild.section}
                </Text>
              </View>
              <Avatar.Icon size={28} icon="chevron-down" style={{ backgroundColor: 'transparent' }} />
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Service Icons Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconsGrid}>
          {SERVICE_ICONS.map(renderServiceIcon)}
        </View>

        {/* News Preview Section */}
        <View style={styles.newsSection}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsTitle}>Thông báo mới</Text>
            <TouchableOpacity onPress={() => navigation.navigate('News' as never)}>
              <Text style={styles.newsSeeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.newsCard}>
            <Card.Content>
              <View style={styles.newsMeta}>
                <View style={styles.newsTag}>
                  <Text style={styles.newsTagText}>Nhà trường</Text>
                </View>
                <Text style={styles.newsTime}>10 phút trước</Text>
              </View>
              <Text style={styles.newsHeadline} numberOfLines={2}>
                Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026...
              </Text>
            </Card.Content>
          </Card>
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
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 4,
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
  childCard: {
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  childCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  childName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    marginTop: 2,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  newsSeeAll: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  newsTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newsTime: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  newsHeadline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
});
