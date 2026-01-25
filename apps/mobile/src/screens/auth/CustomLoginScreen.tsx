/**
 * Custom Login Screen
 * Matches wireframe design with parent/student role tabs
 * Includes forgot password, OTP, and first-login password change flows
 *
 * Uses real OTP verification via Supabase Edge Functions
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';
import { useAuthStore } from '../../stores';
import { colors } from '../../theme';
import type { AuthStackNavigationProp } from '../../navigation/types';
import { sendOTP, verifyOTP } from '../../lib/supabase/otp';

const { width } = Dimensions.get('window');

type ScreenType = 'login' | 'forgotPassword' | 'enterPhone' | 'otp' | 'contactSchool' | 'contactParent' | 'changePassword';

interface LoginScreenProps {
  navigation: AuthStackNavigationProp;
}

const CustomLoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading, clearError } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'student'>('parent');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const [error, setError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      clearError();
      console.log('[LOGIN] Attempting login with:', identifier);

      await login(identifier, password);

      // For student, simulate first login and show change password
      if (selectedRole === 'student') {
        setCurrentScreen('changePassword');
      } else {
        // Navigation handled by RootNavigator
      }
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      setError(errorMsg);

      // Show detailed alert
      Alert.alert(
        'Lỗi đăng nhập',
        errorMsg,
        [
          { text: 'OK', onPress: () => console.log('[LOGIN] Error dismissed') }
        ]
      );
    }
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      setError('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    setSendingOtp(true);
    setError('');

    const result = await sendOTP(phoneNumber, 'reset_password');

    setSendingOtp(false);

    if (result.success) {
      setCurrentScreen('otp');
      startCountdown();
    } else {
      setError(result.error || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
  };

  const startCountdown = () => {
    setCountdown(59);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 số mã OTP');
      return;
    }

    setVerifyingOtp(true);
    setError('');

    const result = await verifyOTP(phoneNumber, otpCode, 'reset_password');

    setVerifyingOtp(false);

    if (result.success) {
      // Store verified phone for password change
      setVerifiedPhone(phoneNumber);
      setCurrentScreen('changePassword');
    } else {
      setError(result.error || 'Mã OTP không đúng. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    // Password changed successfully, navigate to main app
    // The RootNavigator will handle redirection based on auth state
    navigation.navigate('Login');
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length >= 14) return 4;
    if (pwd.length >= 12) return 3;
    if (pwd.length >= 10) return 2;
    if (pwd.length >= 8) return 1;
    return 0;
  };

  const getStrengthColor = (level: number) => {
    switch (level) {
      case 1: return '#F87171';
      case 2: return '#FBBF24';
      case 3: return '#60A5FA';
      case 4: return '#34D399';
      default: return '#E5E7EB';
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    let formatted = cleaned;
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
    }
    if (cleaned.length >= 7) {
      formatted = formatted.slice(0, 8) + ' ' + cleaned.slice(7);
    }
    return formatted;
  };

  const maskPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 6) return phone;
    return cleaned.slice(0, 4) + ' xxxx ' + cleaned.slice(-2);
  };

  // Render Login Screen
  const renderLoginScreen = () => (
    <View style={styles.content}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Svg width={70} height={70} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M2 17L12 22L22 17" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          <Path d="M2 12L12 17L22 12" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.logoTitle}>ECONTACT</Text>
        <View style={styles.logoLine} />
        <Text style={styles.logoSubtitle}>Sổ liên lạc điện tử cấp THCS</Text>
      </View>

      {/* Role Tabs */}
      <View style={styles.roleTabs}>
        <TouchableOpacity
          style={[styles.roleTab, selectedRole === 'parent' && styles.roleTabActive]}
          onPress={() => setSelectedRole('parent')}
        >
          <Text style={[styles.roleTabText, selectedRole === 'parent' && styles.roleTabTextActive]}>
            Phụ huynh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleTab, selectedRole === 'student' && styles.roleTabActive]}
          onPress={() => setSelectedRole('student')}
        >
          <Text style={[styles.roleTabText, selectedRole === 'student' && styles.roleTabTextActive]}>
            Học sinh
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        <View>
          <Text style={styles.inputLabel}>
            {selectedRole === 'parent' ? 'Số điện thoại' : 'Mã học sinh'}
          </Text>
          <TextInput
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            placeholder={selectedRole === 'parent' ? '0901 xxx xxx' : 'NH2026001'}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.inputWithIcon}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputIcon}>
              <Text style={styles.inputIconText}>{showPassword ? '👁️‍🗨️' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setCurrentScreen('forgotPassword')}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading || !identifier || !password}
          style={[
            styles.loginButton,
            (isLoading || !identifier || !password) && styles.loginButtonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Phiên bản 1.0.2 • Project 2 - HUST 2026</Text>
      </View>
    </View>
  );

  // Render Forgot Password Screen
  const renderForgotPasswordScreen = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('login')} style={styles.backButton}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#9CA3AF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Khôi phục</Text>
      <Text style={styles.screenSubtitle}>Chọn phương thức để lấy lại quyền truy cập tài khoản.</Text>

      <View style={styles.optionsContainer}>
        {/* OTP Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setCurrentScreen('enterPhone')}
        >
          <View style={styles.optionIconContainer}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Nhận mã OTP</Text>
            <Text style={styles.optionSubtitle}>Số điện thoại đăng ký</Text>
          </View>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Polyline points="9 18 15 12 9 6" stroke="#DDD" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </TouchableOpacity>

        {/* Contact Parent (Student only) */}
        {selectedRole === 'student' && (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setCurrentScreen('contactParent')}
          >
            <View style={[styles.optionIconContainer, { backgroundColor: '#F5F3FF' }]}>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Circle cx="9" cy="7" r="4" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Line x1="20" y1="8" x2="20" y2="14" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <Line x1="23" y1="11" x2="17" y2="11" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Liên hệ phụ huynh</Text>
              <Text style={styles.optionSubtitle}>Gửi yêu cầu đến phụ huynh</Text>
            </View>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Polyline points="9 18 15 12 9 6" stroke="#DDD" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
        )}

        {/* Contact School */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setCurrentScreen('contactSchool')}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: '#F9FAFB' }]}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Circle cx="9" cy="7" r="4" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Hỗ trợ nhà trường</Text>
            <Text style={styles.optionSubtitle}>Cấp lại mật khẩu trực tiếp</Text>
          </View>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Polyline points="9 18 15 12 9 6" stroke="#DDD" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Enter Phone Screen
  const renderEnterPhoneScreen = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('forgotPassword')} style={styles.backButton}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#9CA3AF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Nhận mã OTP</Text>
      <Text style={styles.screenSubtitle}>Nhập số điện thoại đã đăng ký để nhận mã xác thực.</Text>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Số điện thoại</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
          style={styles.input}
          placeholder="0901 xxx xxx"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSendOTP}
          disabled={sendingOtp}
          style={[styles.loginButton, sendingOtp && styles.loginButtonDisabled]}
        >
          {sendingOtp ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>GỬI MÃ OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render OTP Screen
  const renderOTPScreen = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('enterPhone')} style={styles.backButton}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#9CA3AF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Xác thực</Text>
      <Text style={styles.screenSubtitle}>
        Mã đã được gửi tới <Text style={styles.highlightText}>{maskPhoneNumber(phoneNumber)}</Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            value={digit}
            onChangeText={(text) => {
              const newOtp = [...otp];
              newOtp[index] = text.slice(-1);
              setOtp(newOtp);
              if (text && index < 5) {
                // Focus next input
              }
            }}
            style={styles.otpInput}
            textAlign="center"
            maxLength={1}
            keyboardType="number-pad"
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Chưa nhận được mã? </Text>
        <TouchableOpacity onPress={countdown === 0 ? startCountdown : undefined} disabled={countdown > 0}>
          <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
            Gửi lại ({countdown}s)
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleVerifyOTP}
        disabled={verifyingOtp}
        style={[styles.loginButton, verifyingOtp && styles.loginButtonDisabled]}
      >
        {verifyingOtp ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>XÁC THỰC</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Render Contact School Screen
  const renderContactSchoolScreen = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('forgotPassword')} style={styles.backButton}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#9CA3AF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Liên hệ</Text>
      <Text style={styles.screenSubtitle}>Liên hệ Văn phòng nhà trường để được hỗ trợ.</Text>

      <View style={styles.contactCard}>
        <View style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Circle cx="12" cy="10" r="3" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View>
            <Text style={styles.contactLabel}>Địa chỉ</Text>
            <Text style={styles.contactValue}>Phòng Giáo vụ - Tầng 1, Tòa nhà A1</Text>
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View>
            <Text style={styles.contactLabel}>Hotline</Text>
            <Text style={styles.contactValue}>024 1234 5678</Text>
          </View>
        </View>

        <View style={styles.contactItem}>
          <View style={styles.contactIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Polyline points="12 6 12 12 16 14" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View>
            <Text style={styles.contactLabel}>Giờ làm việc</Text>
            <Text style={styles.contactValue}>08:00 - 17:00 (Thứ 2 - 6)</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          setCurrentScreen('login');
          setError('');
        }}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>GỬI YÊU CẦU</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Contact Parent Screen
  const renderContactParentScreen = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setCurrentScreen('forgotPassword')} style={styles.backButton}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M15 18l-6-6 6-6" stroke="#9CA3AF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Liên hệ phụ huynh</Text>
      <Text style={styles.screenSubtitle}>Gửi yêu cầu đặt lại mật khẩu đến tài khoản phụ huynh.</Text>

      {/* Student Info Card */}
      <View style={styles.studentCard}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>HB</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentLabel}>Học sinh</Text>
          <Text style={styles.studentName}>Nguyễn Hoàng B • Lớp 9A1</Text>
        </View>
      </View>

      <Text style={styles.inputLabel}>Chọn phụ huynh</Text>

      {/* Parent List */}
      <TouchableOpacity style={styles.parentCardSelected}>
        <View style={styles.parentInfo}>
          <View style={styles.parentAvatar}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <Circle cx="12" cy="7" r="4" stroke="#9333EA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
          <View>
            <Text style={styles.parentName}>PH. Nguyễn Văn A</Text>
            <Text style={styles.parentPhone}>0901 xxx xxx</Text>
          </View>
        </View>
        <View style={styles.radioSelected} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentScreen('login');
          setError('');
        }}
        style={[styles.loginButton, { backgroundColor: '#9333EA' }]}
      >
        <Text style={styles.loginButtonText}>GỬI YÊU CẦU</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Change Password Screen
  const renderChangePasswordScreen = () => (
    <View style={styles.content}>
      <Text style={styles.screenTitle}>Đổi mật khẩu</Text>
      <Text style={styles.screenSubtitle}>Đăng nhập lần đầu tiên. Vui lòng đổi mật khẩu để bảo vệ tài khoản của bạn.</Text>

      <View style={styles.form}>
        <Text style={styles.inputLabel}>Mật khẩu mới</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setError('');
            }}
            secureTextEntry={!showNewPassword}
            style={styles.inputWithIcon}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.inputIcon}>
            <Text style={styles.inputIconText}>{showNewPassword ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            secureTextEntry={!showConfirmPassword}
            style={styles.inputWithIcon}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.inputIcon}>
            <Text style={styles.inputIconText}>{showConfirmPassword ? '👁️‍🗨️' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Password Strength Indicator */}
        {newPassword ? (
          <View style={styles.strengthContainer}>
            <Text style={styles.strengthLabel}>Độ mạnh:</Text>
            <View style={styles.strengthBars}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.strengthBar,
                    { backgroundColor: getStrengthColor(getPasswordStrength(newPassword) >= level ? level : 0) },
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.requirementItem}>
          <View style={styles.requirementDot} />
          <Text style={styles.requirementText}>Mật khẩu có ít nhất 8 ký tự</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleChangePassword}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>ĐỔI MẬT KHẨU</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {currentScreen === 'login' && renderLoginScreen()}
          {currentScreen === 'forgotPassword' && renderForgotPasswordScreen()}
          {currentScreen === 'enterPhone' && renderEnterPhoneScreen()}
          {currentScreen === 'otp' && renderOTPScreen()}
          {currentScreen === 'contactSchool' && renderContactSchoolScreen()}
          {currentScreen === 'contactParent' && renderContactParentScreen()}
          {currentScreen === 'changePassword' && renderChangePasswordScreen()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  // Logo Section
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 16,
    letterSpacing: 1,
  },
  logoLine: {
    height: 6,
    width: 40,
    backgroundColor: colors.primary,
    borderRadius: 3,
    marginTop: 8,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 12,
  },
  // Role Tabs
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleTabActive: {
    backgroundColor: colors.primary,
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  // Form
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    marginBottom: 16,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  inputWithIcon: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  inputIconText: {
    fontSize: 20,
  },
  inputContent: {
    fontSize: 16,
    color: '#1F2937',
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonContent: {
    height: 56,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  // Footer
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  // Back Button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  // Screen Title
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 20,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: '700',
  },
  // Options Container
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 24,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // OTP
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 48,
  },
  otpInput: {
    width: 45,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  tpInput: {
    width: 45,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
  },
  otpInputContent: {
    fontSize: 20,
    fontWeight: '700',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  resendLinkDisabled: {
    color: '#9CA3AF',
  },
  // Contact Card
  contactCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  contactIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  contactLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  // Student Card
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9333EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  studentLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A855F7',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  // Parent Card
  parentCardSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  parentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  parentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  parentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  parentPhone: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#9333EA',
  },
  // Password Strength
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginRight: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthBar: {
    width: 32,
    height: 6,
    borderRadius: 3,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
});

export default CustomLoginScreen;
