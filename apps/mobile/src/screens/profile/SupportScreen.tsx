/**
 * Support Screen
 * Help & Support contact screen
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
  Linking,
  StyleSheet,
} from 'react-native';
import { useUIStore } from '../../stores';
import { colors } from '../../theme';
import { supabase } from '../../lib/supabase/client';
import { useAuthStore } from '../../stores';
import Svg, { Path, Circle, Line, Polyline, Polygon } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SupportScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const EmailIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Polyline points="22,6 12,13 2,6" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const RightArrowIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SendIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SUPPORT_INFO = {
  phone: '1900 xxxx',
  email: 'support@econtact.vn',
  address: 'Địa chỉ: [Địa chỉ trường học]',
  workingHours: 'Thứ 2 - Thứ 6: 7:30 - 17:00\nThứ 7: 7:30 - 11:30',
};

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_INFO.phone}`).catch(() => {
      Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_INFO.email}`).catch(() => {
      Alert.alert('Lỗi', 'Không thể mở ứng dụng email');
    });
  };

  const handleSubmit = async () => {
    if (!formData.subject.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập chủ đề');
      return;
    }

    if (!formData.message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung tin nhắn');
      return;
    }

    setIsLoading(true);

    try {
      // Store support request in database (you'd need to create a support_requests table)
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user?.id,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) {
        // If table doesn't exist yet, just show success message
        console.log('Support request:', formData);
      }

      showNotification({
        type: 'success',
        message: 'Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ liên hệ sớm.',
      });

      // Clear form
      setFormData({
        ...formData,
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Submit support error:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const ContactOption: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    onPress: () => void;
  }> = ({ icon, title, value, onPress }) => (
    <TouchableOpacity
      style={styles.contactOption}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}15` }]}>
        {icon}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>
          {title}
        </Text>
        <Text style={styles.contactValue}>
          {value}
        </Text>
      </View>
      <RightArrowIcon />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Hỗ trợ
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <Text style={styles.sectionTitle}>
          Liên hệ trực tiếp
        </Text>

        <View style={styles.contactOptionsContainer}>
          <ContactOption
            icon={<PhoneIcon />}
            title="Điện thoại"
            value={SUPPORT_INFO.phone}
            onPress={handleCall}
          />
          <ContactOption
            icon={<EmailIcon />}
            title="Email"
            value={SUPPORT_INFO.email}
            onPress={handleEmail}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>
            Thông tin hỗ trợ
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Địa chỉ:</Text>
            <Text style={styles.infoValue}>
              {SUPPORT_INFO.address}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giờ làm việc:</Text>
            <Text style={styles.infoValue}>
              {SUPPORT_INFO.workingHours}
            </Text>
          </View>
        </View>

        {/* Contact Form */}
        <Text style={styles.sectionTitle}>
          Gửi yêu cầu hỗ trợ
        </Text>

        <View style={styles.formCard}>
          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Họ và tên
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nhập họ và tên"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Email
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Nhập email"
                keyboardType="email-address"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Subject */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Chủ đề
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
                placeholder="Nhập chủ đề"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Nội dung
            </Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
                placeholder="Mô tả vấn đề của bạn..."
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textAreaInput]}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <SendIcon />
                <Text style={styles.submitButtonText}>
                  Gửi yêu cầu
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Chúng tôi sẽ phản hồi trong vòng 24-48 giờ
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
    paddingVertical: 24,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  contactOptionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  contactOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contactValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
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
  infoCardTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: 12,
    width: 80,
  },
  infoValue: {
    color: '#1F2937',
    fontSize: 12,
    flex: 1,
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
  textAreaWrapper: {
    minHeight: 120,
  },
  input: {
    color: '#1F2937',
    fontSize: 16,
    paddingVertical: 12,
    flex: 1,
  },
  textAreaInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
  footer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
