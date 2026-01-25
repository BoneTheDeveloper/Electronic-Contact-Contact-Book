/**
 * Leave Request Screen
 * Submit absence request form with tabs for new request and history
 * Proper StyleSheet styling
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, StyleSheet, type ViewStyle, Platform, Pressable, Alert } from 'react-native';
import { Icon } from '../../components/ui';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface LeaveRequestScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface LeaveRequestItem {
  id: string;
  reason: string;
  dateRange: string;
  date: string;
  duration: string;
  status: 'approved' | 'pending' | 'rejected';
}

const LEAVE_REASONS = [
  'Ốm đau',
  'Việc cá nhân',
  'Khác',
];

export const StudentLeaveRequestScreen: React.FC<LeaveRequestScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [detailReason, setDetailReason] = useState('');
  // Today's date for validation (25/1/2026)
  const today = new Date(2026, 0, 25);
  // No pre-selected dates - user must choose
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Picker states
  const [showReasonPicker, setShowReasonPicker] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showOtherReasonInput, setShowOtherReasonInput] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [selectingStartDate, setSelectingStartDate] = useState(true);

  // File upload state
  const [attachedFile, setAttachedFile] = useState<{ name: string; uri: string; size?: number } | null>(null);

  // Appeal modal state
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestItem | null>(null);
  const [appealType, setAppealType] = useState('Muốn xin thêm ngày nghỉ');
  const [appealDetail, setAppealDetail] = useState('');

  // Detail/Edit modal state
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editReason, setEditReason] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDetail, setEditDetail] = useState('');

  const { user } = useAuthStore();
  const { studentData, leaveRequests, loadLeaveRequests, createLeaveRequest } = useStudentStore();

  useEffect(() => {
    if (user?.id && user?.role === 'student') {
      loadLeaveRequests(user.id);
    }
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!user?.id || !studentData) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin học sinh');
      return;
    }

    if (!selectedReason) {
      Alert.alert('Lỗi', 'Vui lòng chọn lý do nghỉ');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn khoảng thời gian nghỉ');
      return;
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const reason = showOtherReasonInput ? otherReasonText : `${selectedReason!}: ${detailReason}`;

    try {
      const result = await createLeaveRequest({
        studentId: user.id,
        classId: studentData.classId,
        requestType: 'leave',
        startDate: startDateStr,
        endDate: endDateStr,
        reason,
      });

      if (result) {
        Alert.alert('Thành công', 'Đơn xin nghỉ phép đã được gửi');
        // Reset form
        setSelectedReason(null);
        setDetailReason('');
        setStartDate(null);
        setEndDate(null);
        setAttachedFile(null);
      } else {
        Alert.alert('Lỗi', 'Không thể gửi đơn xin nghỉ phép');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi đơn');
    }
  };

  // Calendar helpers
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return isStartDate(day) || isEndDate(day);
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getDate() === startDate.getDate() &&
           date.getMonth() === startDate.getMonth() &&
           date.getFullYear() === startDate.getFullYear();
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getDate() === endDate.getDate() &&
           date.getMonth() === endDate.getMonth() &&
           date.getFullYear() === endDate.getFullYear();
  };

  const isBeforeToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const dateTimestamp = date.getTime();
    return dateTimestamp < todayTimestamp;
  };

  const handleDatePress = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const selectedTimestamp = selectedDate.getTime();

    // Prevent selecting dates before today
    if (selectedTimestamp < todayTimestamp) {
      return;
    }

    if (selectingStartDate || !startDate) {
      // First click: set as initial choice (both start and end same)
      setStartDate(selectedDate);
      setEndDate(selectedDate);
      setSelectingStartDate(false);
    } else {
      // Second click: create range, auto-determine start/end based on which is earlier/later
      const startTimestamp = startDate.getTime();
      if (selectedTimestamp === startTimestamp) {
        // Clicked the same date again - restart selection
        setSelectingStartDate(true);
      } else if (selectedTimestamp < startTimestamp) {
        // Selected date is earlier, becomes start date
        setStartDate(selectedDate);
      } else {
        // Selected date is later, becomes end date
        setEndDate(selectedDate);
      }
    }
  };

  const handleResetRange = () => {
    setSelectingStartDate(true);
    setStartDate(null);
    setEndDate(null);
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    setShowReasonPicker(false);
    if (reason === 'Khác') {
      setShowOtherReasonInput(true);
    } else {
      setShowOtherReasonInput(false);
      setOtherReasonText('');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAttachedFile({
          name: file.name,
          uri: file.uri,
          size: file.size,
        });
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Lỗi', 'Không thể tải file lên');
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const formatDateDisplay = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openAppealModal = (request: LeaveRequestItem) => {
    setSelectedRequest(request);
    setAppealModalVisible(true);
  };

  const closeAppealModal = () => {
    setAppealModalVisible(false);
    setAppealDetail('');
    setSelectedRequest(null);
  };

  const submitAppeal = () => {
    console.log('Submit appeal:', { selectedRequest, appealType, appealDetail });
    setAppealModalVisible(false);
    setAppealDetail('');
    setSelectedRequest(null);
  };

  const openDetailModal = (request: LeaveRequestItem) => {
    setSelectedRequest(request);
    setEditReason(request.reason);
    setEditStartDate(request.dateRange.split(' - ')[0]);
    setEditEndDate(request.dateRange.split(' - ')[1]);
    setEditDetail('');
    setEditMode(false);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setEditMode(false);
    setSelectedRequest(null);
    setEditReason('');
    setEditStartDate('');
    setEditEndDate('');
    setEditDetail('');
  };

  const startEdit = () => {
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Reset to original values
    if (selectedRequest) {
      setEditReason(selectedRequest.reason);
      setEditStartDate(selectedRequest.dateRange.split(' - ')[0]);
      setEditEndDate(selectedRequest.dateRange.split(' - ')[1]);
      setEditDetail('');
    }
  };

  const saveEdit = () => {
    console.log('Save edit:', { selectedRequest, editReason, editStartDate, editEndDate, editDetail });
    // TODO: Update the request in the backend
    setDetailModalVisible(false);
    setEditMode(false);
    setSelectedRequest(null);
  };

  const getStatusConfig = (status: LeaveRequestItem['status']) => {
    switch (status) {
      case 'approved':
        return { bg: '#ECFDF5', text: '#059669', label: 'Đã duyệt' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Chờ duyệt' };
      case 'rejected':
        return { bg: '#FEF2F2', text: '#DC2626', label: 'Từ chối' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBg}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Đơn xin nghỉ phép</Text>
            <Text style={styles.headerSubtitle}>Quản lý đơn xin nghỉ học</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('new')}
            style={[
              styles.tab,
              activeTab === 'new' ? styles.tabActive : styles.tabInactive,
            ] as ViewStyle}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'new' ? styles.tabTextActive : styles.tabTextInactive,
            ]}>
              Tạo đơn mới
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[
              styles.tab,
              activeTab === 'history' ? styles.tabActive : styles.tabInactive,
            ] as ViewStyle}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'history' ? styles.tabTextActive : styles.tabTextInactive,
            ]}>
              Lịch sử đơn
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'new' ? (
          <>
            {/* New Request Form */}
            <View style={styles.formCard}>
              {/* Leave Type - Dropdown */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Lý do nghỉ</Text>
                <TouchableOpacity
                  style={styles.valueBoxTouchable}
                  onPress={() => setShowReasonPicker(true)}
                >
                  <Text style={[styles.valueText, !selectedReason && styles.placeholderText]}>
                    {selectedReason || 'Chọn lý do nghỉ'}
                  </Text>
                  <Icon name="chevron-down" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Other Reason Input (shown when "Khác" is selected) */}
              {showOtherReasonInput ? (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Nhập lý do khác</Text>
                  <TextInput
                    value={otherReasonText}
                    onChangeText={setOtherReasonText}
                    placeholder="Nhập lý do nghỉ của bạn..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.inputBox}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              ) : (
                /* Reason Details - shown only when NOT "Khác" */
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Chi tiết lý do</Text>
                  <TextInput
                    value={detailReason}
                    onChangeText={setDetailReason}
                    style={styles.inputBox}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}

              {/* Date Range Selection */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Khoảng nghỉ</Text>
                <TouchableOpacity
                  style={styles.valueBoxTouchable}
                  onPress={() => {
                    setShowCalendarModal(true);
                    setSelectingStartDate(true);
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                  }}
                >
                  <Text style={[styles.valueText, !startDate && styles.placeholderText]}>
                    {startDate && endDate ? `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}` : 'Chọn khoảng thời gian'}
                  </Text>
                  <Icon name="calendar" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* File Upload */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>File đính kèm (nếu có)</Text>
                {attachedFile ? (
                  <View style={styles.fileAttachedBox}>
                    <Icon name="file-document" size={20} color="#0284C7" />
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>{attachedFile.name}</Text>
                      {attachedFile.size && (
                        <Text style={styles.fileSize}>{(attachedFile.size / 1024).toFixed(0)} KB</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={removeFile} style={styles.removeFileButton}>
                      <Icon name="close" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.fileUploadBox} onPress={handleFileUpload}>
                    <Icon name="upload-cloud" size={24} color="#9CA3AF" />
                    <Text style={styles.fileUploadText}>Tap để tải file lên</Text>
                    <Text style={styles.fileUploadSubtext}>(PDF, Hình ảnh)</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Gửi đơn xin nghỉ</Text>
              </TouchableOpacity>
            </View>

          </>
        ) : (
          <>
            {/* History List */}
            <View style={styles.historyList}>
              {leaveRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                return (
                  <TouchableOpacity
                    key={request.id}
                    style={[
                      styles.requestCard,
                      request.status === 'pending' && styles.requestCardPending,
                    ]}
                    onPress={() => openDetailModal(request)}
                    activeOpacity={0.95}
                  >
                    <View style={styles.requestHeader}>
                      <View style={styles.requestBadges}>
                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>
                            {statusConfig.label}
                          </Text>
                        </View>
                        <Text style={styles.requestDate}>{request.date}</Text>
                      </View>
                      <Text style={styles.requestDuration}>{request.duration}</Text>
                    </View>
                    <Text style={styles.requestReason}>{request.reason}</Text>
                    <Text style={styles.requestDateRange}>{request.dateRange}</Text>
                    {request.status === 'approved' && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          openAppealModal(request);
                        }}
                        style={styles.appealButton}
                      >
                        <Text style={styles.appealButtonText}>Phúc khảo</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Appeal Modal */}
      <Modal
        visible={appealModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAppealModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phúc khảo đơn</Text>
              <TouchableOpacity onPress={closeAppealModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Request Info */}
            {selectedRequest && (
              <View style={styles.modalRequestInfo}>
                <Text style={styles.modalInfoLabel}>Đơn xin nghỉ:</Text>
                <Text style={styles.modalInfoReason}>{selectedRequest.reason}</Text>
                <Text style={styles.modalInfoLabel}>Thời gian:</Text>
                <Text style={styles.modalInfoDateRange}>{selectedRequest.dateRange}</Text>
              </View>
            )}

            {/* Appeal Form */}
            <View style={styles.appealForm}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Lý do phúc khảo</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText}>{appealType}</Text>
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Giải trình chi tiết</Text>
                <TextInput
                  value={appealDetail}
                  onChangeText={setAppealDetail}
                  placeholder="Nhập chi tiết lý do phúc khảo..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  style={styles.inputBox}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>File đính kèm (nếu có)</Text>
                <View style={styles.fileUploadBoxSimple}>
                  <Text style={styles.fileUploadTextSimple}>Tap để tải file lên</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={submitAppeal}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Gửi yêu cầu phúc khảo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail/Edit Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editMode ? 'Chỉnh sửa đơn' : 'Chi tiết đơn xin nghỉ'}</Text>
              <TouchableOpacity onPress={closeDetailModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Request Info or Edit Form */}
            {selectedRequest && (
              <View style={styles.appealForm}>
                {editMode ? (
                  <>
                    {/* Edit Form */}
                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Lý do nghỉ</Text>
                      <TextInput
                        value={editReason}
                        onChangeText={setEditReason}
                        style={styles.inputBox}
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Từ ngày</Text>
                      <TextInput
                        value={editStartDate}
                        onChangeText={setEditStartDate}
                        style={styles.inputBox}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Đến ngày</Text>
                      <TextInput
                        value={editEndDate}
                        onChangeText={setEditEndDate}
                        style={styles.inputBox}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>

                    <View style={styles.formField}>
                      <Text style={styles.fieldLabel}>Chi tiết</Text>
                      <TextInput
                        value={editDetail}
                        onChangeText={setEditDetail}
                        placeholder="Nhập chi tiết thêm..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={3}
                        style={styles.inputBox}
                        textAlignVertical="top"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    {/* View Mode */}
                    <View style={styles.modalRequestInfo}>
                      <Text style={styles.modalInfoLabel}>Lý do:</Text>
                      <Text style={styles.modalInfoReason}>{selectedRequest.reason}</Text>
                      <Text style={styles.modalInfoLabel}>Thời gian:</Text>
                      <Text style={styles.modalInfoDateRange}>{selectedRequest.dateRange}</Text>
                      <Text style={styles.modalInfoLabel}>Số ngày:</Text>
                      <Text style={styles.modalInfoDateRange}>{selectedRequest.duration}</Text>
                      <Text style={styles.modalInfoLabel}>Trạng thái:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusConfig(selectedRequest.status).bg, marginTop: 4 }]}>
                        <Text style={[styles.statusBadgeText, { color: getStatusConfig(selectedRequest.status).text }]}>
                          {getStatusConfig(selectedRequest.status).label}
                        </Text>
                      </View>
                    </View>

                    {/* Action buttons based on status */}
                    {selectedRequest.status === 'pending' && (
                      <TouchableOpacity
                        onPress={startEdit}
                        style={styles.editButton}
                      >
                        <Text style={styles.editButtonText}>Chỉnh sửa đơn</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {/* Footer Actions */}
                {editMode && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      onPress={cancelEdit}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={saveEdit}
                      style={styles.submitButton}
                    >
                      <Text style={styles.submitButtonText}>Lưu thay đổi</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Reason Picker Modal */}
      <Modal
        visible={showReasonPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReasonPicker(false)}
      >
        <View style={styles.bottomModalOverlay}>
          <Pressable style={styles.pressableOverlay} onPress={() => setShowReasonPicker(false)} />
          <View style={styles.bottomModalContent}>
            <View style={styles.bottomModalHeader}>
              <TouchableOpacity onPress={() => setShowReasonPicker(false)}>
                <Text style={styles.bottomModalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <Text style={styles.bottomModalTitle}>Chọn lý do nghỉ</Text>
              <View style={{ width: 40 }} />
            </View>
            <ScrollView style={styles.pickerScroll}>
              {LEAVE_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[styles.pickerItem, selectedReason === reason && styles.pickerItemSelected]}
                  onPress={() => handleReasonChange(reason)}
                >
                  <Text style={[
                    styles.pickerItemText,
                    selectedReason === reason && styles.pickerItemTextSelected
                  ]}>
                    {reason}
                  </Text>
                  {selectedReason === reason && (
                    <Icon name="check" size={18} color="#0284C7" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal - Date range selection */}
      <Modal
        visible={showCalendarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.pickerModalContainer}>
          <View style={styles.calendarContainer}>
            {/* Header with month navigation */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={previousMonth} style={styles.calendarNavButton}>
                <Icon name="arrow-left" size={24} color="#0284C7" />
              </TouchableOpacity>
              <Text style={styles.calendarTitle}>
                Tháng {currentMonth + 1}/{currentYear}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.calendarNavButton}>
                <Icon name="arrow-right" size={24} color="#0284C7" />
              </TouchableOpacity>
            </View>

            {/* Weekday headers */}
            <View style={styles.weekdayRow}>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => (
                <View key={`empty-${i}`} style={styles.calendarDay} />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                const day = i + 1;
                const isTodayDate = isToday(day);
                const isSelectedDate = isSelected(day);
                const isDisabledDate = isBeforeToday(day);

                let dayStyle = styles.calendarDay;
                let textStyle = styles.calendarDayText;

                // Apply styles in order: selected -> today -> disabled (selected takes priority)
                if (isSelectedDate && !isDisabledDate) {
                  dayStyle = { ...dayStyle, ...styles.calendarDaySelected };
                  textStyle = { ...textStyle, ...styles.calendarDayTextSelected };
                }
                if (isTodayDate) {
                  dayStyle = { ...dayStyle, ...styles.calendarDayToday };
                }
                if (isDisabledDate) {
                  dayStyle = { ...dayStyle, ...styles.calendarDayDisabled };
                  textStyle = { ...textStyle, ...styles.calendarDayTextDisabled };
                }

                if (isDisabledDate) {
                  return (
                    <View key={day} style={dayStyle}>
                      <Text style={textStyle}>{day}</Text>
                    </View>
                  );
                }

                return (
                  <TouchableOpacity
                    key={day}
                    style={dayStyle}
                    onPress={() => handleDatePress(day)}
                    activeOpacity={0.7}
                  >
                    <Text style={textStyle}>{day}</Text>
                    {isTodayDate && <View style={styles.todayPin} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Range info and actions */}
            <View style={styles.calendarFooter}>
              <Text style={styles.calendarRangeText}>
                {selectingStartDate || !startDate ? 'Chọn ngày bắt đầu' : `Đã chọn: ${formatDateDisplay(startDate)} - ${endDate ? formatDateDisplay(endDate) : formatDateDisplay(startDate)}`}
              </Text>
              <View style={styles.calendarActions}>
                <TouchableOpacity
                  onPress={handleResetRange}
                  style={styles.calendarResetButton}
                >
                  <Text style={styles.calendarResetButtonText}>Đặt lại</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowCalendarModal(false)}
                  style={styles.calendarConfirmButton}
                >
                  <Text style={styles.calendarConfirmButtonText}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    backgroundColor: '#0284C7',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(224, 242, 254, 0.9)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#0284C7',
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#9CA3AF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  fieldLabel: {
    color: '#374151',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  valueText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  inputBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  recentSection: {
    marginTop: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
  },
  viewAllText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  requestCardPending: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  requestDate: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  requestDuration: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '500',
  },
  requestReason: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  requestDateRange: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 8,
  },
  appealButton: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  appealButtonText: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  historyList: {
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalRequestInfo: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalInfoLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  modalInfoReason: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalInfoDateRange: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '700',
  },
  appealForm: {
    gap: 12,
  },
  fileUploadBoxSimple: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  fileUploadTextSimple: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 14,
  },
  // Interactive form elements
  valueBoxTouchable: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // File upload styles
  fileAttachedBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  removeFileButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileUploadBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  fileUploadText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  fileUploadSubtext: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  // Bottom modal (picker) styles
  bottomModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pressableOverlay: {
    flex: 1,
  },
  bottomModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: '70%',
  },
  bottomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  bottomModalCancelText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  bottomModalTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  pickerScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerItemText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#0284C7',
    fontWeight: '600',
  },
  // Date picker modal styles
  pickerModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pickerTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  androidPickerButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  androidPickerButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  // Calendar styles
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 360,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  calendarTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 12,
    position: 'relative',
  },
  calendarDayText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayTextDisabled: {
    color: '#9CA3AF',
  },
  calendarDayToday: {
    // No background/border - just the red dot indicator
  },
  calendarDaySelected: {
    backgroundColor: '#0284C7',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDayStart: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  calendarDayEnd: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  todayPin: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
  calendarFooter: {
    gap: 12,
  },
  calendarRangeText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  calendarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarResetButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarResetButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 14,
  },
  calendarConfirmButton: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarConfirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
