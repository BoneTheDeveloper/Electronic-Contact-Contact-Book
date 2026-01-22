/**
 * Leave Request Screen
 * Submit absence request form
 */

import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, TextInput as RNTextInput, Text } from 'react-native';
import { useParentStore } from '../../stores';

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
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-primary pt-15 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Đơn xin nghỉ phép</Text>
        {selectedChild && (
          <Text className="text-sm text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>

      <ScrollView
        contentContainerClassName="p-4 pb-25"
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <View className="mb-5 bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-xs text-gray-500 font-semibold mb-1">Học sinh</Text>
          <Text className="text-lg font-bold text-gray-900">{selectedChild?.name}</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            Lớp {selectedChild?.grade}{selectedChild?.section}
          </Text>
        </View>

        {/* Reason Selection */}
        <Text className="text-base font-bold text-gray-900 mb-3 mt-2">Lý do nghỉ</Text>
        <View className="mb-5 bg-white rounded-2xl p-4 shadow-sm">
          <View className="flex-row flex-wrap gap-2">
            {LEAVE_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                onPress={() => setSelectedReason(reason.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedReason === reason.id
                    ? 'bg-primary border-primary'
                    : 'bg-transparent border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedReason === reason.id ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Range */}
        <Text className="text-base font-bold text-gray-900 mb-3 mt-2">Thời gian nghỉ</Text>
        <View className="mb-5 bg-white rounded-2xl p-4 shadow-sm">
          <View className="mb-3">
            <Text className="text-sm text-gray-700 font-medium mb-2">Từ ngày *</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
              <RNTextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="flex-1 text-base text-gray-900"
              />
              <Text className="text-primary text-2xl">📅</Text>
            </View>
          </View>
          <View>
            <Text className="text-sm text-gray-700 font-medium mb-2">Đến ngày *</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-white">
              <RNTextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="flex-1 text-base text-gray-900"
              />
              <Text className="text-primary text-2xl">📅</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <Text className="text-base font-bold text-gray-900 mb-3 mt-2">Ghi chú thêm</Text>
        <View className="mb-5 bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-sm text-gray-700 font-medium mb-2">Chi tiết lý do (không bắt buộc)</Text>
          <View className="border border-gray-300 rounded-xl px-4 py-3 bg-white min-h-25">
            <RNTextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Nhập chi tiết lý do nghỉ..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              className="text-base text-gray-900"
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary mt-2 py-3 rounded-xl shadow-sm active:opacity-80"
        >
          <Text className="text-base font-bold text-white text-center">Gửi đơn xin nghỉ</Text>
        </TouchableOpacity>

        <Text className="text-xs text-gray-400 text-center mt-4 italic">
          * Đơn xin nghỉ cần được gửi trước ít nhất 1 ngày
        </Text>
      </ScrollView>
    </View>
  );
};
