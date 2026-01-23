/**
 * Change Password Screen
 * Allows users to change their password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAuthStore } from '../../stores';
import { useUIStore } from '../../stores';
import { colors } from '../../theme';
import { supabase } from '../../lib/supabase/client';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ChangePasswordScreenProps {
  navigation?: NativeStackNavigationProp<any>;
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={visible ? colors.primary : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="12" r="3" stroke={visible ? colors.primary : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleChangePassword = async () => {
    // Validation
    if (!formData.currentPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!formData.newPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (!isValidPassword(formData.newPassword)) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setIsLoading(true);

    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: formData.currentPassword,
      });

      if (signInError) {
        Alert.alert('Lỗi', 'Mật khẩu hiện tại không đúng');
        setIsLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) throw updateError;

      showNotification({
        type: 'success',
        message: 'Đổi mật khẩu thành công!',
      });

      // Clear form and go back
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      navigation?.goBack();
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordField: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    showPassword: boolean;
    onTogglePassword: () => void;
  }> = ({ label, value, onChangeText, placeholder, showPassword, onTogglePassword }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={onTogglePassword} style={styles.eyeButton}>
          {showPassword ? <EyeIcon visible /> : <EyeOffIcon />}
        </TouchableOpacity>
      </View>
    </View>
  );

  const getPasswordStrength = () => {
    const password = formData.newPassword;
    if (password.length === 0) return { label: '', color: 'transparent' };
    if (password.length < 6) return { label: 'Yếu', color: '#EF4444' };
    if (password.length < 10) return { label: 'Trung bình', color: '#F59E0B' };
    return { label: 'Mạnh', color: '#4CAF50' };
  };

  const strength = getPasswordStrength();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Đổi mật khẩu
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: '#E0F2FE' }]}>
          <Text style={[styles.infoCardText, { color: colors.primary }]}>
            🔒 Mật khẩu phải có ít nhất 6 ký tự để bảo mật tài khoản của bạn.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <PasswordField
            label="Mật khẩu hiện tại"
            value={formData.currentPassword}
            onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
            placeholder="Nhập mật khẩu hiện tại"
            showPassword={showPasswords.current}
            onTogglePassword={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          />

          <PasswordField
            label="Mật khẩu mới"
            value={formData.newPassword}
            onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
            placeholder="Nhập mật khẩu mới"
            showPassword={showPasswords.new}
            onTogglePassword={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          />

          {/* Password Strength Indicator */}
          {formData.newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthHeader}>
                <Text style={styles.strengthLabel}>Độ mạnh mật khẩu</Text>
                <Text style={[styles.strengthValue, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: formData.newPassword.length < 6 ? '33%' : formData.newPassword.length < 10 ? '66%' : '100%',
                      backgroundColor: strength.color,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          <PasswordField
            label="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            placeholder="Nhập lại mật khẩu mới"
            showPassword={showPasswords.confirm}
            onTogglePassword={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          />

          {/* Password Match Indicator */}
          {formData.confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              {formData.newPassword === formData.confirmPassword ? (
                <View style={styles.matchRow}>
                  <View style={styles.matchIconMatch}>
                    <Text style={styles.matchIconText}>✓</Text>
                  </View>
                  <Text style={styles.matchTextMatch}>Mật khẩu khớp</Text>
                </View>
              ) : (
                <View style={styles.matchRow}>
                  <View style={styles.matchIconMismatch}>
                    <Text style={styles.matchIconText}>✕</Text>
                  </View>
                  <Text style={styles.matchTextMismatch}>Mật khẩu không khớp</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleChangePassword}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <CheckIcon />
              <Text style={styles.submitButtonText}>
                Đổi mật khẩu
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoCardText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#1F2937',
    fontSize: 16,
    paddingVertical: 12,
    flex: 1,
  },
  eyeButton: {
    padding: 8,
  },
  strengthContainer: {
    marginBottom: 16,
  },
  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  strengthLabel: {
    color: '#6B7280',
    fontSize: 12,
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  strengthBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchIconMatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchIconMismatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchIconText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  matchTextMatch: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  matchTextMismatch: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
