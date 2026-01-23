/**
 * Profile Screen (Shared)
 * Main profile screen for both parent and student users
 * Shows user info, settings, and navigation to profile functions
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores';
import { useUIStore } from '../../stores';
import { colors } from '../../theme';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ProfileScreenProps {
  navigation?: NativeStackNavigationProp<any>;
}

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  color: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    icon: 'user',
    title: 'Cập nhật thông tin',
    description: 'Chỉnh sửa hồ sơ cá nhân',
    route: 'UpdateProfile',
    color: '#0284C7',
  },
  {
    id: '2',
    icon: 'lock',
    title: 'Đổi mật khẩu',
    description: 'Thay đổi mật khẩu đăng nhập',
    route: 'ChangePassword',
    color: '#F59E0B',
  },
  {
    id: '3',
    icon: 'fingerprint',
    title: 'Xác thực sinh trắc học',
    description: 'Bật/tắt đăng nhập bằng vân tay',
    route: 'BiometricAuth',
    color: '#8B5CF6',
  },
  {
    id: '4',
    icon: 'help',
    title: 'Câu hỏi thường gặp',
    description: 'Xem câu hỏi và trả lời',
    route: 'FAQ',
    color: '#10B981',
  },
  {
    id: '5',
    icon: 'support',
    title: 'Hỗ trợ',
    description: 'Liên hệ hỗ trợ kỹ thuật',
    route: 'Support',
    color: '#EF4444',
  },
];

const UserIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LockIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FingerprintIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 6-6 6 6 0 0 1 6 6c0 1-1 2-2 2s-2-1-2-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2c0 4 2 7 4 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 20c1-2 3-4 4-5s3-2 4-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const HelpIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="17" r="1" fill={color}/>
  </Svg>
);

const SupportIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LogoutIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Polyline points="16 17 21 12 16 7" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="21" y1="12" x2="9" y2="12" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const RightArrowIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const { isBiometricEnabled } = useUIStore();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
    const first = (parts[0] || '').charAt(0);
    const last = (parts[parts.length - 1] || '').charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const getIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'user': return <UserIcon color={color} />;
      case 'lock': return <LockIcon color={color} />;
      case 'fingerprint': return <FingerprintIcon color={color} />;
      case 'help': return <HelpIcon color={color} />;
      case 'support': return <SupportIcon color={color} />;
      default: return <UserIcon color={color} />;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'parent': return 'Phụ huynh';
      case 'student': return 'Học sinh';
      case 'teacher': return 'Giáo viên';
      case 'admin': return 'Quản trị viên';
      default: return role || 'Người dùng';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerLabel}>
          Cá nhân
        </Text>
        <Text style={styles.headerTitle}>
          {user?.name || 'Người dùng'}
        </Text>
        <Text style={styles.headerEmail}>
          {user?.email}
        </Text>
        <View style={styles.roleBadgeContainer}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {getRoleLabel(user?.role)}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardInner}>
            <View style={[styles.avatar, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>
                {getInitials(user?.name)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name}
              </Text>
              <Text style={styles.profileRole}>
                {getRoleLabel(user?.role)}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index !== MENU_ITEMS.length - 1 ? styles.menuItemBorder : {}]}
              onPress={() => navigation?.navigate(item.route as never)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                {getIcon(item.icon, item.color)}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>
                <Text style={styles.menuDescription}>
                  {item.description}
                </Text>
              </View>
              <RightArrowIcon />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogoutIcon />
          <Text style={styles.logoutText}>
            Đăng xuất
          </Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            Phiên bản 1.0.0
          </Text>
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
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  headerEmail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  roleBadgeContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
  },
  profileRole: {
    color: '#6B7280',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  menuDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
