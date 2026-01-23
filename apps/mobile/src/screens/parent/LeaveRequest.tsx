/**
 * Leave Request Screen
 * Submit absence request form
 */

import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';
import { useParentStore } from '../../stores';
import { ScreenHeader } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface LeaveRequestScreenProps {
  navigation?: ParentHomeStackNavigationProp;
}

interface LeaveRequestForm {
  childId: string;
  reason: string;
  startDate: string;
  endDate: string;
  notes: string;
}

const LEAVE_REASONS = [
  { id: 'sick', label: 'Đau ốm', icon: 'medical-services' },
  { id: 'family', label: 'Việc gia đình', icon: 'home' },
  { id: 'personal', label: 'Cá nhân', icon: 'account' },
  { id: 'other', label: 'Khác', icon: 'dots-horizontal' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  reasonButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  reasonButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  reasonButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#e5e7eb',
  },
  reasonButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reasonButtonTextActive: {
    color: 'white',
  },
  reasonButtonTextInactive: {
    color: '#4b5563',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  dateIcon: {
    fontSize: 24,
    color: '#3b82f6',
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
  },
  notesContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    minHeight: 100,
  },
  notesInput: {
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export const LeaveRequestScreen: React.FC<LeaveRequestScreenProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const [selectedReason, setSelectedReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Validate form
    if (!selectedReason || !startDate || !endDate) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Create leave request (mock)
    const leaveRequest: LeaveRequestForm = {
      childId: selectedChild?.id || '',
      reason: selectedReason,
      startDate,
      endDate,
      notes,
    };

    console.log('Leave request submitted:', leaveRequest);
    Alert.alert('Thành công', 'Đơn xin nghỉ phép đã được gửi thành công!');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Đơn xin nghỉ phép"
        onBack={() => navigation?.goBack()}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Học sinh</Text>
          <Text style={styles.cardTitle}>{selectedChild?.name}</Text>
          <Text style={styles.cardText}>
            Lớp {selectedChild?.grade}{selectedChild?.section}
          </Text>
        </View>

        {/* Reason Selection */}
        <Text style={styles.reasonTitle}>Lý do nghỉ</Text>
        <View style={styles.card}>
          <View style={styles.reasonButtonsContainer}>
            {LEAVE_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                onPress={() => setSelectedReason(reason.id)}
                style={[
                  styles.reasonButton,
                  selectedReason === reason.id ? styles.reasonButtonActive : styles.reasonButtonInactive
                ]}
              >
                <Text
                  style={[
                    styles.reasonButtonText,
                    selectedReason === reason.id ? styles.reasonButtonTextActive : styles.reasonButtonTextInactive
                  ]}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range */}
        <Text style={styles.dateTitle}>Thời gian nghỉ</Text>
        <View style={styles.card}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.dateLabel}>Từ ngày *</Text>
            <View style={styles.dateInputContainer}>
              <RNTextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={styles.dateInput}
              />
              <Text style={styles.dateIcon}>📅</Text>
            </View>
          </View>
          <View>
            <Text style={styles.dateLabel}>Đến ngày *</Text>
            <View style={styles.dateInputContainer}>
              <RNTextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={styles.dateInput}
              />
              <Text style={styles.dateIcon}>📅</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <Text style={styles.notesTitle}>Ghi chú thêm</Text>
        <View style={styles.card}>
          <Text style={styles.notesLabel}>Chi tiết lý do (không bắt buộc)</Text>
          <View style={styles.notesContainer}>
            <RNTextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Nhập chi tiết lý do nghỉ..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              style={styles.notesInput}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Gửi đơn xin nghỉ</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          * Đơn xin nghỉ cần được gửi trước ít nhất 1 ngày
        </Text>
      </ScrollView>
    </View>
  );
};
