/**
 * Biometric Authentication Screen
 * Allows users to enable/disable biometric authentication
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { useUIStore } from '../../stores';
import { colors } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface BiometricAuthScreenProps {
  navigation?: NativeStackNavigationProp<any>;
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FingerprintIcon = ({ color, size = 48 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 6-6 6 6 0 0 1 6 6c0 1-1 2-2 2s-2-1-2-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2c0 4 2 7 4 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 20c1-2 3-4 4-5s3-2 4-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const FaceIdIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5a2 2 0 0 1 2-2h2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 3h2a2 2 0 0 1 2 2v2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="9" cy="9" r="2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="15" cy="9" r="2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 17c.5-1 2-2 3-2s2.5 1 3 2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UnlockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const BIOMETRIC_STORAGE_KEY = 'biometric_enabled';

export const BiometricAuthScreen: React.FC<BiometricAuthScreenProps> = ({ navigation }) => {
  const { isBiometricEnabled, toggleBiometric } = useUIStore();
  const [isEnabled, setIsEnabled] = useState(isBiometricEnabled);

  useEffect(() => {
    loadBiometricSetting();
  }, []);

  const loadBiometricSetting = async () => {
    try {
      const stored = await AsyncStorage.getItem(BIOMETRIC_STORAGE_KEY);
      if (stored !== null) {
        setIsEnabled(stored === 'true');
      }
    } catch (error) {
      console.error('Failed to load biometric setting:', error);
    }
  };

  const handleToggle = async (value: boolean) => {
    if (value) {
      // Show alert explaining what biometric auth does
      Alert.alert(
        'Bật xác thực sinh trắc học',
        'Bạn có thể sử dụng vân tay hoặc Face ID để đăng nhập nhanh hơn vào lần sau. Tính năng này chỉ hoạt động trên thiết bị của bạn.',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Bật',
            onPress: async () => {
              try {
                await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEY, 'true');
                setIsEnabled(true);
                toggleBiometric();
              } catch (error) {
                Alert.alert('Lỗi', 'Không thể bật xác thực sinh trắc học');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Tắt xác thực sinh trắc học',
        'Bạn sẽ cần nhập mật khẩu để đăng nhập vào lần sau.',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Tắt',
            onPress: async () => {
              try {
                await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEY, 'false');
                setIsEnabled(false);
                toggleBiometric();
              } catch (error) {
                Alert.alert('Lỗi', 'Không thể tắt xác thực sinh trắc học');
              }
            },
          },
        ]
      );
    }
  };

  const biometricType = Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Vân tay';

  const features = [
    {
      icon: <CheckIcon />,
      title: 'Đăng nhập nhanh',
      description: 'Không cần nhập mật khẩu mỗi lần đăng nhập',
    },
    {
      icon: <CheckIcon />,
      title: 'Bảo mật cao',
      description: 'Sử dụng sinh trắc học độc nhất của bạn',
    },
    {
      icon: <CheckIcon />,
      title: 'Tiện lợi',
      description: 'Chỉ cần một chạm để truy cập ứng dụng',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Xác thực sinh trắc học
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
            {Platform.OS === 'ios' ? (
              <FaceIdIcon size={48} />
            ) : (
              <FingerprintIcon color={colors.primary} size={48} />
            )}
          </View>
          <Text style={styles.iconTitle}>
            {biometricType}
          </Text>
          <Text style={styles.iconSubtitle}>
            Bảo mật tài khoản bằng sinh trắc học
          </Text>
        </View>

        {/* Toggle Card */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleContent}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>
                Sử dụng {biometricType}
              </Text>
              <Text style={styles.toggleDescription}>
                Bật để đăng nhập nhanh hơn
              </Text>
            </View>
            <View style={styles.toggleControl}>
              {isEnabled ? <UnlockIcon /> : <LockIcon />}
              <Switch
                value={isEnabled}
                onValueChange={handleToggle}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
                thumbColor={isEnabled ? 'white' : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>
            Lợi ích
          </Text>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureItem, index !== features.length - 1 ? styles.featureItemBorder : {}]}
            >
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  {feature.icon}
                </View>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>
                  {feature.title}
                </Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Security Note */}
        <View style={[styles.securityNote, { backgroundColor: '#FFFBEB' }]}>
          <Text style={styles.securityNoteTitle}>
            🔐 Lưu ý bảo mật
          </Text>
          <Text style={styles.securityNoteText}>
            Dữ liệu sinh trắc học được lưu trữ an toàn trên thiết bị của bạn và không bao giờ được gửi đến máy chủ. Tuy nhiên, bạn vẫn cần nhớ mật khẩu để khôi phục tài khoản khi cần.
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
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '700',
  },
  iconSubtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  toggleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  toggleControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 24,
  },
  featuresTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  featureItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureIconContainer: {
    marginTop: 2,
    marginRight: 12,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  featureDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  securityNote: {
    borderRadius: 12,
    padding: 16,
  },
  securityNoteTitle: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  securityNoteText: {
    color: '#B45309',
    fontSize: 12,
    lineHeight: 18,
  },
});
