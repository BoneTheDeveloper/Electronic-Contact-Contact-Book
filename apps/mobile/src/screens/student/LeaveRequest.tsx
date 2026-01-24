/**
 * Leave Request Screen
 * Submit absence request form with tabs for new request and history
 * Proper StyleSheet styling
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, StyleSheet, type ViewStyle, Platform, Pressable, Alert } from 'react-native';
import { Icon } from '../../components/ui';
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
  'Đi gia đình',
  'Ốm đau',
  'Lễ tết',
  'Việc cá nhân',
  'Khác',
];

export const StudentLeaveRequestScreen: React.FC<LeaveRequestScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [selectedReason, setSelectedReason] = useState('Đi gia đình');
  const [detailReason, setDetailReason] = useState('Có việc gia đình cần về quê');
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 0, 10));
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 0, 10));

  // Picker states
  const [showReasonPicker, setShowReasonPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showOtherReasonInput, setShowOtherReasonInput] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');

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

  // Mock recent requests
  const recentRequests: LeaveRequestItem[] = [
    {
      id: '1',
      reason: 'Đi gia đình',
      dateRange: '20/12/2025 - 20/12/2025',
      date: '20/12/2025',
      duration: '1 ngày',
      status: 'approved',
    },
    {
      id: '2',
      reason: 'Ốm đau',
      dateRange: '10/01/2026 - 11/01/2026',
      date: 'Hôm nay',
      duration: '2 ngày',
      status: 'pending',
    },
  ];

  const handleSubmit = () => {
    const startDateStr = startDate.toLocaleDateString('vi-VN');
    const endDateStr = endDate.toLocaleDateString('vi-VN');
    console.log('Submit leave request:', { selectedReason, detailReason, startDateStr, endDateStr, attachedFile });
    Alert.alert('Thành công', 'Đơn xin nghỉ phép đã được gửi');
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

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
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
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
                  <Text style={styles.valueText}>{selectedReason}</Text>
                  <Icon name="chevron-down" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Other Reason Input (shown when "Khác" is selected) */}
              {showOtherReasonInput && (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Nhập lý do khác</Text>
                  <TextInput
                    value={otherReasonText}
                    onChangeText={setOtherReasonText}
                    placeholder="Nhập lý do nghỉ của bạn..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.inputBox}
                  />
                </View>
              )}

              {/* Reason Details */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Chi tiết lý do</Text>
                <TextInput
                  value={detailReason}
                  onChangeText={setDetailReason}
                  placeholder="Nhập chi tiết lý do nghỉ..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.inputBox}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Date Range - Start Date */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Từ ngày</Text>
                <TouchableOpacity
                  style={styles.valueBoxTouchable}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.valueText}>{formatDateDisplay(startDate)}</Text>
                  <Icon name="calendar" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Date Range - End Date */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Đến ngày</Text>
                <TouchableOpacity
                  style={styles.valueBoxTouchable}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.valueText}>{formatDateDisplay(endDate)}</Text>
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

            {/* Recent Requests Preview */}
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>Đơn gần đây</Text>
                <TouchableOpacity onPress={() => setActiveTab('history')}>
                  <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.requestsList}>
                {recentRequests.slice(0, 2).map((request) => {
                  const statusConfig = getStatusConfig(request.status);
                  return (
                    <TouchableOpacity
                      key={request.id}
                      style={styles.requestCard}
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
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* History List */}
            <View style={styles.historyList}>
              {recentRequests.map((request) => {
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

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          minimumDate={new Date(2020, 0, 1)}
          maximumDate={new Date(2030, 11, 31)}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date(2030, 11, 31)}
        />
      )}
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
});
