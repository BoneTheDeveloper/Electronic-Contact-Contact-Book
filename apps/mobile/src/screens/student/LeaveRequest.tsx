/**
 * Leave Request Screen
 * Submit absence request form with tabs for new request and history
 * Proper StyleSheet styling
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, StyleSheet, type ViewStyle } from 'react-native';
import { Icon } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

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
  const [startDate, setStartDate] = useState('2026-01-10');
  const [endDate, setEndDate] = useState('2026-01-10');

  // Appeal modal state
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestItem | null>(null);
  const [appealType, setAppealType] = useState('Muốn xin thêm ngày nghỉ');
  const [appealDetail, setAppealDetail] = useState('');

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
    console.log('Submit leave request:', { selectedReason, detailReason, startDate, endDate });
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
              {/* Leave Type */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Lý do nghỉ</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText}>{selectedReason}</Text>
                </View>
              </View>

              {/* Reason Details */}
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

              {/* Date Range */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Từ ngày</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText}>{startDate}</Text>
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Đến ngày</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.valueText}>{endDate}</Text>
                </View>
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
                    <View key={request.id} style={styles.requestCard}>
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
                          onPress={() => openAppealModal(request)}
                          style={styles.appealButton}
                        >
                          <Text style={styles.appealButtonText}>Phúc khảo</Text>
                        </TouchableOpacity>
                      )}
                    </View>
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
                  <View
                    key={request.id}
                    style={[
                      styles.requestCard,
                      request.status === 'pending' && styles.requestCardPending,
                    ]}
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
                        onPress={() => openAppealModal(request)}
                        style={styles.appealButton}
                      >
                        <Text style={styles.appealButtonText}>Phúc khảo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
                <View style={styles.fileUploadBox}>
                  <Text style={styles.fileUploadText}>Tap để tải file lên</Text>
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
  fileUploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  fileUploadText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
