/**
 * Grades Screen
 * Subject grades with semester selector and grade types grid
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useParentStore } from '../../stores';
import { getGradesByStudentId } from '../../mock-data';

interface SubjectGradeData {
  subject: string;
  shortName: string;
  iconColor: string;
  grades: {
    tx1: number;
    tx2: number;
    tx3: number;
    gk: number;
    ck: number;
  };
  average: number;
}

interface GradeCellProps {
  label: string;
  score: number;
  bgColor: string;
  textColor: string;
}

const GradeCell: React.FC<GradeCellProps> = ({ label, score, bgColor, textColor }) => (
  <View className={`${bgColor} rounded-lg p-2 items-center`}>
    <Text className={`${textColor} text-[8px] font-black mb-1 uppercase`}>{label}</Text>
    <Text className={`${textColor} text-sm font-extrabold`}>{score.toFixed(1)}</Text>
  </View>
);

const SUBJECT_ICONS: Record<string, { shortName: string; iconColor: string }> = {
  'Toán học': { shortName: 'Toán', iconColor: 'bg-orange-100 text-orange-500' },
  'Ngữ văn': { shortName: 'Văn', iconColor: 'bg-purple-100 text-purple-600' },
  'Tiếng Anh': { shortName: 'Anh', iconColor: 'bg-emerald-100 text-emerald-600' },
  'Vật lý': { shortName: 'Lý', iconColor: 'bg-indigo-100 text-indigo-600' },
  'Hóa học': { shortName: 'Hóa', iconColor: 'bg-amber-100 text-amber-600' },
  'Lịch sử': { shortName: 'Sử', iconColor: 'bg-rose-100 text-rose-600' },
  'Địa lý': { shortName: 'Địa', iconColor: 'bg-cyan-100 text-cyan-600' },
  'Sinh học': { shortName: 'Sinh', iconColor: 'bg-green-100 text-green-600' },
};

export const GradesScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
  const grades = selectedChild ? getGradesByStudentId(selectedChild.id) : [];

  const [selectedSemester, setSelectedSemester] = useState<'I' | 'II'>('I');
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectGradeData | null>(null);
  const [appealDetail, setAppealDetail] = useState('');

  // Mock data for subjects with grade types
  const subjectsData: SubjectGradeData[] = [
    { subject: 'Toán học', shortName: 'Toán', iconColor: 'bg-orange-100 text-orange-500', grades: { tx1: 8.5, tx2: 9.0, tx3: 8.8, gk: 8.0, ck: 9.0 }, average: 8.47 },
    { subject: 'Ngữ văn', shortName: 'Văn', iconColor: 'bg-purple-100 text-purple-600', grades: { tx1: 7.5, tx2: 8.0, tx3: 7.3, gk: 7.5, ck: 8.0 }, average: 7.85 },
    { subject: 'Tiếng Anh', shortName: 'Anh', iconColor: 'bg-emerald-100 text-emerald-600', grades: { tx1: 9.0, tx2: 8.5, tx3: 9.3, gk: 8.5, ck: 9.0 }, average: 8.88 },
    { subject: 'Vật lý', shortName: 'Lý', iconColor: 'bg-indigo-100 text-indigo-600', grades: { tx1: 7.5, tx2: 7.0, tx3: 7.3, gk: 7.5, ck: 8.0 }, average: 7.50 },
    { subject: 'Hóa học', shortName: 'Hóa', iconColor: 'bg-amber-100 text-amber-600', grades: { tx1: 8.0, tx2: 7.5, tx3: 8.3, gk: 8.0, ck: 8.5 }, average: 8.00 },
    { subject: 'Lịch sử', shortName: 'Sử', iconColor: 'bg-rose-100 text-rose-600', grades: { tx1: 8.5, tx2: 8.0, tx3: 8.8, gk: 8.5, ck: 9.0 }, average: 8.50 },
  ];

  const overallAverage = subjectsData.reduce((sum, s) => sum + s.average, 0) / subjectsData.length;
  const overallRating = overallAverage >= 9 ? 'Xuất sắc' : overallAverage >= 8 ? 'Giỏi' : overallAverage >= 7 ? 'Khá' : overallAverage >= 5 ? 'Trung bình' : 'Yếu';

  const openAppealModal = (subject: SubjectGradeData) => {
    setSelectedSubject(subject);
    setAppealModalVisible(true);
  };

  const closeAppealModal = () => {
    setAppealModalVisible(false);
    setAppealDetail('');
    setSelectedSubject(null);
  };

  const submitAppeal = () => {
    setAppealModalVisible(false);
    setSuccessModalVisible(true);
    setAppealDetail('');
    setSelectedSubject(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-[60px] px-6 pb-6 rounded-b-[30px]">
        <Text className="text-[20px] font-extrabold text-white">Bảng điểm môn học</Text>
        <Text className="text-[12px] text-blue-100 font-medium mt-0.5">Năm học 2025 - 2026</Text>
      </View>

      <ScrollView contentContainerClassName="px-6 pt-6 pb-[140px]" showsVerticalScrollIndicator={false}>
        {/* Semester Selector */}
        <View className="flex-row space-x-2 mb-6">
          <TouchableOpacity
            onPress={() => setSelectedSemester('I')}
            className={`flex-1 py-2.5 rounded-xl ${selectedSemester === 'I' ? 'bg-[#0284C7]' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-sm font-black text-center ${selectedSemester === 'I' ? 'text-white' : 'text-gray-400'}`}>
              Học kỳ I
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedSemester('II')}
            className={`flex-1 py-2.5 rounded-xl ${selectedSemester === 'II' ? 'bg-[#0284C7]' : 'bg-white border border-gray-200'}`}
          >
            <Text className={`text-sm font-black text-center ${selectedSemester === 'II' ? 'text-white' : 'text-gray-400'}`}>
              Học kỳ II
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall Summary Card */}
        <View className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] p-5 rounded-[24px] shadow-lg mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-blue-100 text-[9px] font-black uppercase tracking-wider mb-1">Điểm trung bình</Text>
              <Text className="text-white text-[36px] font-extrabold">{overallAverage.toFixed(1)}</Text>
              <Text className="text-blue-100 text-xs font-medium mt-1">Xếp loại: {overallRating}</Text>
            </View>
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center">
              <Text className="text-white text-3xl">✓</Text>
            </View>
          </View>
        </View>

        {/* Subject Grades List */}
        <Text className="text-gray-800 font-extrabold text-sm mb-3">Chi tiết các môn</Text>

        <View className="space-y-3">
          {subjectsData.map((subjectData) => {
            const iconInfo = SUBJECT_ICONS[subjectData.subject] || { shortName: subjectData.subject.substring(0, 3), iconColor: 'bg-gray-100 text-gray-600' };

            return (
              <View key={subjectData.subject} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center space-x-3">
                    <View className={`w-11 h-11 ${iconInfo.iconColor} rounded-xl items-center justify-center`}>
                      <Text className="text-sm font-black">{iconInfo.shortName}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-800 font-bold text-sm">{subjectData.subject}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center space-x-2">
                    <View className="items-right">
                      <Text className="text-[#0284C7] font-extrabold text-lg">{subjectData.average.toFixed(2)}</Text>
                      <Text className="text-gray-400 text-[9px] font-medium text-right">ĐTB</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openAppealModal(subjectData)}
                      className="w-8 h-8 bg-amber-50 border border-amber-200 rounded-xl items-center justify-center"
                    >
                      <Text className="text-amber-600 text-sm">✏</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Grade Grid */}
                <View className="flex flex-row justify-between gap-2">
                  <GradeCell label="TX1" score={subjectData.grades.tx1} bgColor="bg-blue-50" textColor="text-blue-700" />
                  <GradeCell label="TX2" score={subjectData.grades.tx2} bgColor="bg-blue-50" textColor="text-blue-700" />
                  <GradeCell label="TX3" score={subjectData.grades.tx3} bgColor="bg-blue-50" textColor="text-blue-700" />
                  <GradeCell label="GK" score={subjectData.grades.gk} bgColor="bg-purple-50" textColor="text-purple-700" />
                  <GradeCell label="CK" score={subjectData.grades.ck} bgColor="bg-orange-50" textColor="text-orange-700" />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Appeal Modal */}
      <Modal
        visible={appealModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAppealModal}
      >
        <View className="flex-1 bg-black/60 justify-end px-4">
          <View className="bg-white rounded-[28px] p-6 w-full">
            {/* Drag Handle */}
            <View className="w-10 h-1 bg-gray-300 rounded-2xl self-center mb-4" />

            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
              <View>
                <Text className="text-gray-800 font-extrabold text-xl">Phúc khảo điểm</Text>
                <Text className="text-gray-400 text-xs font-medium mt-0.5">Yêu cầu xem lại điểm</Text>
              </View>
              <TouchableOpacity onPress={closeAppealModal} className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center">
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Grade Info Card */}
            {selectedSubject && (
              <View className="bg-blue-50 p-4 rounded-2xl mb-5 border border-blue-100">
                <View className="flex-row items-start space-x-3">
                  <View className="w-10 h-10 bg-[#0284C7] rounded-xl items-center justify-center">
                    <Text className="text-white text-lg">📄</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">Môn học</Text>
                    <Text className="text-gray-800 font-extrabold text-base mb-2">{selectedSubject.subject}</Text>
                    <View className="flex-row items-center space-x-4">
                      <View>
                        <Text className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">ĐTB</Text>
                        <Text className="text-[#0284C7] font-extrabold text-lg">{selectedSubject.average.toFixed(2)}</Text>
                      </View>
                      <View className="h-8 w-px bg-gray-300" />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">Chi tiết</Text>
                        <Text className="text-gray-700 font-bold text-[10px]">
                          TX1: {selectedSubject.grades.tx1} • TX2: {selectedSubject.grades.tx2} • TX3: {selectedSubject.grades.tx3}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Appeal Form */}
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Loại điểm cần phúc khảo</Text>
                <View className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">Điểm TX1</Text>
                </View>
              </View>

              <View>
                <Text className="text-gray-700 text-[10px] font-black uppercase tracking-wider mb-2">Lý do phúc khảo</Text>
                <View className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <Text className="text-gray-800 text-sm font-medium">Thầy cô tính sai điểm</Text>
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
                  numberOfLines={4}
                  className="w-full bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium"
                  textAlignVertical="top"
                />
                <Text className="text-gray-400 text-[10px] font-medium mt-1.5">
                  ℹ Cung cấp càng nhiều chi tiết càng tốt
                </Text>
              </View>

              <TouchableOpacity
                onPress={submitAppeal}
                className="w-full bg-gradient-to-r from-[#0284C7] to-[#0369A1] py-4 rounded-xl shadow-lg items-center"
              >
                <Text className="text-white font-extrabold text-sm text-center">Gửi yêu cầu phúc khảo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[28px] p-6 w-full items-center">
            <View className="w-10 h-1 bg-gray-300 rounded-2xl self-center mb-4" />

            <View className="w-20 h-20 bg-emerald-500 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-4xl">✓</Text>
            </View>

            <Text className="text-gray-800 font-extrabold text-xl mb-2">Đã gửi thành công!</Text>
            <Text className="text-gray-500 text-sm font-medium mb-6 text-center">
              Yêu cầu phúc khảo của bạn đã được gửi đến giáo viên. Chúng tôi sẽ thông báo kết quả sớm nhất.
            </Text>

            <TouchableOpacity
              onPress={closeSuccessModal}
              className="w-full bg-gradient-to-r from-[#0284C7] to-[#0369A1] py-4 rounded-xl shadow-lg items-center"
            >
              <Text className="text-white font-extrabold text-sm text-center">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
