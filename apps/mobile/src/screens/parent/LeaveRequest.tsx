/**
 * Leave Request Screen
 * Submit absence request form
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, TextInput, Button, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';

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

export const LeaveRequestScreen: React.FC = () => {
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn xin nghỉ phép</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <Card style={styles.studentCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Học sinh</Text>
            <Text style={styles.studentName}>{selectedChild?.name}</Text>
            <Text style={styles.studentClass}>
              Lớp {selectedChild?.grade}{selectedChild?.section}
            </Text>
          </Card.Content>
        </Card>

        {/* Reason Selection */}
        <Text style={styles.sectionTitle}>Lý do nghỉ</Text>
        <Card style={styles.reasonCard}>
          <Card.Content>
            <View style={styles.reasonGrid}>
              {LEAVE_REASONS.map((reason) => (
                <Chip
                  key={reason.id}
                  mode={selectedReason === reason.id ? 'flat' : 'outlined'}
                  selected={selectedReason === reason.id}
                  onPress={() => setSelectedReason(reason.id)}
                  style={[
                    styles.reasonChip,
                    selectedReason === reason.id && styles.reasonChipSelected,
                  ]}
                  textStyle={[
                    styles.reasonChipText,
                    selectedReason === reason.id && styles.reasonChipTextSelected,
                  ]}
                  icon={reason.icon as any}
                >
                  {reason.label}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Date Range */}
        <Text style={styles.sectionTitle}>Thời gian nghỉ</Text>
        <Card style={styles.dateCard}>
          <Card.Content>
            <TextInput
              label="Từ ngày *"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="DD/MM/YYYY"
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              right={<TextInput.Icon icon="calendar" />}
            />
            <TextInput
              label="Đến ngày *"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="DD/MM/YYYY"
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              right={<TextInput.Icon icon="calendar" />}
            />
          </Card.Content>
        </Card>

        {/* Notes */}
        <Text style={styles.sectionTitle}>Ghi chú thêm</Text>
        <Card style={styles.notesCard}>
          <Card.Content>
            <TextInput
              label="Chi tiết lý do (không bắt buộc)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Nhập chi tiết lý do nghỉ..."
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
        >
          Gửi đơn xin nghỉ
        </Button>

        <Text style={styles.noteText}>
          * Đơn xin nghỉ cần được gửi trước ít nhất 1 ngày
        </Text>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  studentCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  studentClass: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  reasonCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reasonChipSelected: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reasonChipText: {
    color: '#6B7280',
  },
  reasonChipTextSelected: {
    color: '#FFFFFF',
  },
  dateCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  input: {
    marginBottom: 12,
  },
  notesCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  notesInput: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 10,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  noteText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
