/**
 * Leave Request Screen
 * Submit absence request form with tabs for new request and history
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useParentStore } from '../../stores';

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

export const LeaveRequestScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

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
    // Submit logic here
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
    // Submit appeal logic here
    console.log('Submit appeal:', { selectedRequest, appealType, appealDetail });
    setAppealModalVisible(false);
    setAppealDetail('');
    setSelectedRequest(null);
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-[60px] px-6 pb-6 rounded-b-[30px]">
        <Text className="text-[20px] font-extrabold text-white">Đơn xin nghỉ phép</Text>
        <Text className="text-[12px] text-blue-100 font-medium mt-0.5">Quản lý đơn xin nghỉ học</Text>
      </View>

      <ScrollView className="px-6 pt-6 pb-[140px]" showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View className="flex-row space-x-2 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('new')}
            className={`flex-1 py-2.5 rounded-xl ${activeTab === 'new' ? 'bg-[#0284C7]' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-sm font-black text-center ${activeTab === 'new' ? 'text-white' : 'text-gray-400'}`}>
              Tạo đơn mới
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl ${activeTab === 'history' ? 'bg-[#0284C7]' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-sm font-black text-center ${activeTab === 'history' ? 'text-white' : 'text-gray-400'}`}>
              Lịch sử đơn
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'new' ? (
          <>
            {/* New Request Form */}
            <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              {/* Leave Type */}
              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Lý do nghỉ</Text>
                <View className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">{selectedReason}</Text>
                </View>
              </View>

              {/* Reason Details */}
              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Chi tiết lý do</Text>
                <TextInput
                  value={detailReason}
                  onChangeText={setDetailReason}
                  className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Date Range */}
              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Từ ngày</Text>
                <View className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">{startDate}</Text>
                </View>
              </View>

              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Đến ngày</Text>
                <View className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">{endDate}</Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] py-3.5 rounded-xl shadow-lg items-center"
              >
                <Text className="text-white font-extrabold text-sm text-center">Gửi đơn xin nghỉ</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Requests Preview */}
            <View className="mt-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 font-extrabold text-sm">Đơn gần đây</Text>
                <TouchableOpacity onPress={() => setActiveTab('history')}>
                  <Text className="text-[#0284C7] text-[10px] font-bold uppercase tracking-wider">Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                {recentRequests.slice(0, 2).map((request) => (
                  <View key={request.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-row items-center space-x-2">
                        <View className={`px-2 py-0.5 rounded-full ${request.status === 'approved' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                          <Text className={`text-[8px] font-black uppercase ${request.status === 'approved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {request.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                          </Text>
                        </View>
                        <Text className="text-gray-400 text-[9px] font-medium">{request.date}</Text>
                      </View>
                      <Text className="text-gray-500 text-[9px] font-medium">{request.duration}</Text>
                    </View>
                    <Text className="text-gray-800 font-bold text-sm mb-1">{request.reason}</Text>
                    <Text className="text-gray-400 text-[9px] font-medium mb-2">{request.dateRange}</Text>
                    {request.status === 'approved' && (
                      <TouchableOpacity
                        onPress={() => openAppealModal(request)}
                        className="bg-amber-50 border border-amber-200 py-2 rounded-xl items-center"
                      >
                        <Text className="text-amber-700 font-bold text-xs text-center">Phúc khảo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* History List */}
            <View className="space-y-3">
              {recentRequests.map((request) => (
                <View key={request.id} className={`p-4 rounded-2xl border shadow-sm ${request.status === 'pending' ? 'bg-white border-amber-200' : 'bg-white border-gray-100'}`}>
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-row items-center space-x-2">
                      <View className={`px-2 py-0.5 rounded-full ${request.status === 'approved' ? 'bg-emerald-100' : request.status === 'pending' ? 'bg-amber-100' : 'bg-rose-100'}`}>
                        <Text className={`text-[8px] font-black uppercase ${request.status === 'approved' ? 'text-emerald-700' : request.status === 'pending' ? 'text-amber-700' : 'text-rose-700'}`}>
                          {request.status === 'approved' ? 'Đã duyệt' : request.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                        </Text>
                      </View>
                      <Text className="text-gray-400 text-[9px] font-medium">{request.date}</Text>
                    </View>
                    <Text className="text-gray-500 text-[9px] font-medium">{request.duration}</Text>
                  </View>
                  <Text className="text-gray-800 font-bold text-sm mb-1">{request.reason}</Text>
                  <Text className="text-gray-400 text-[9px] font-medium mb-2">{request.dateRange}</Text>
                  {request.status === 'approved' && (
                    <TouchableOpacity
                      onPress={() => openAppealModal(request)}
                      className="bg-amber-50 border border-amber-200 py-2 rounded-xl items-center"
                    >
                      <Text className="text-amber-700 font-bold text-xs text-center">Phúc khảo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
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
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-3xl p-6 w-full max-h-[80%]">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-800 font-extrabold text-lg">Phúc khảo đơn</Text>
              <TouchableOpacity onPress={closeAppealModal} className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                <Text className="text-gray-500">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Request Info */}
            {selectedRequest && (
              <View className="bg-blue-50 p-3 rounded-xl mb-4">
                <Text className="text-gray-500 text-[10px] font-medium mb-1">Đơn xin nghỉ:</Text>
                <Text className="text-gray-800 font-bold text-sm mb-2">{selectedRequest.reason}</Text>
                <Text className="text-gray-500 text-[10px] font-medium mb-1">Thời gian:</Text>
                <Text className="text-gray-800 font-bold text-xs">{selectedRequest.dateRange}</Text>
              </View>
            )}

            {/* Appeal Form */}
            <View className="space-y-3">
              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Lý do phúc khảo</Text>
                <View className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">{appealType}</Text>
                </View>
              </View>

              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Giải trình chi tiết</Text>
                <TextInput
                  value={appealDetail}
                  onChangeText={setAppealDetail}
                  placeholder="Nhập chi tiết lý do phúc khảo..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium"
                  textAlignVertical="top"
                />
              </View>

              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">File đính kèm (nếu có)</Text>
                <View className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center">
                  <Text className="text-gray-400 text-xs font-medium text-center">Tap để tải file lên</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={submitAppeal}
                className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] py-3.5 rounded-xl shadow-lg items-center"
              >
                <Text className="text-white font-extrabold text-sm text-center">Gửi yêu cầu phúc khảo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
