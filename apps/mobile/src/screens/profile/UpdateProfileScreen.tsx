/**
 * Update Profile Screen
 * Allows users to update their profile information
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
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface UpdateProfileScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const CheckIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke="#4CAF50" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

interface FormData {
  fullName: string;
  phone: string;
  email: string;
}

export const UpdateProfileScreen: React.FC<UpdateProfileScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { setLoading, showNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
  });

  const handleUpdate = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local user state
      useAuthStore.setState({
        user: {
          ...user!,
          name: formData.fullName.trim(),
        },
      });

      showNotification({
        type: 'success',
        message: 'Cập nhật thông tin thành công!',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    editable?: boolean;
  }> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', editable = true }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Cập nhật thông tin
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarPreview, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.avatarPreviewText, { color: colors.primary }]}>
              {(() => {
                const parts = formData.fullName.split(' ').filter(p => p.length > 0);
                if (parts.length === 0) return 'U';
                if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
                const first = (parts[0] || '').charAt(0);
                const last = (parts[parts.length - 1] || '').charAt(0);
                return `${first}${last}`.toUpperCase();
              })()}
            </Text>
          </View>
          <Text style={styles.avatarLabel}>
            Ảnh đại diện
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <InputField
            label="Họ và tên"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Nhập họ và tên của bạn"
          />

          <InputField
            label="Số điện thoại"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={() => {}}
            placeholder="Email"
            keyboardType="email-address"
            editable={false}
          />

          <View style={[styles.infoCard, { backgroundColor: '#E0F2FE' }]}>
            <Text style={[styles.infoCardText, { color: colors.primary }]}>
              ℹ️ Email không thể thay đổi. Vui lòng liên hệ quản trị viên nếu cần cập nhật.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleUpdate}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <CheckIcon />
              <Text style={styles.submitButtonText}>
                Lưu thay đổi
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPreviewText: {
    fontSize: 28,
    fontWeight: '700',
  },
  avatarLabel: {
    color: '#6B7280',
    fontSize: 14,
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
  },
  input: {
    color: '#1F2937',
    fontSize: 16,
    paddingVertical: 12,
    flex: 1,
  },
  infoCard: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  infoCardText: {
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
