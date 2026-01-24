/**
 * Grades Screen
 * Subject grades with semester selector and grade types grid
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';

interface SubjectGradeData {
  subjectId: string;
  subjectName: string;
  shortName: string;
  iconColor: string;
  grades: Array<{
    id: string;
    label: string;
    score: number | null;
    maxScore: number;
    assessmentType: string;
  }>;
  average: number;
}

interface GradeCellProps {
  label: string;
  score: number | null;
  maxScore: number;
  bgColor: string;
  textColor: string;
}

const GradeCell: React.FC<GradeCellProps> = ({ label, score, maxScore, bgColor, textColor }) => (
  <View className={`${bgColor} rounded-lg p-2 items-center`}>
    <Text className={`${textColor} text-[8px] font-black mb-1 uppercase`}>{label}</Text>
    <Text className={`${textColor} text-sm font-extrabold`}>
      {score !== null ? score.toFixed(1) : '-'}
    </Text>
  </View>
);

const SUBJECT_ICONS: Record<string, { shortName: string; iconColor: string }> = {
  'Toán': { shortName: 'Toán', iconColor: 'bg-orange-100 text-orange-500' },
  'Ngữ văn': { shortName: 'Văn', iconColor: 'bg-purple-100 text-purple-600' },
  'Tiếng Anh': { shortName: 'Anh', iconColor: 'bg-emerald-100 text-emerald-600' },
  'Anh': { shortName: 'Anh', iconColor: 'bg-emerald-100 text-emerald-600' },
  'Vật lý': { shortName: 'Lý', iconColor: 'bg-indigo-100 text-indigo-600' },
  'Hóa học': { shortName: 'Hóa', iconColor: 'bg-amber-100 text-amber-600' },
  'Lịch sử': { shortName: 'Sử', iconColor: 'bg-rose-100 text-rose-600' },
  'Địa lý': { shortName: 'Địa', iconColor: 'bg-cyan-100 text-cyan-600' },
  'Sinh học': { shortName: 'Sinh', iconColor: 'bg-green-100 text-green-600' },
};

export const StudentGradesScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { grades, isLoading, error, loadGrades } = useStudentStore();

  const [selectedSemester, setSelectedSemester] = useState<'I' | 'II'>('I');
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectGradeData | null>(null);
  const [appealDetail, setAppealDetail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load grades when student ID changes
  const loadData = async () => {
    if (user?.id && user?.role === 'student') {
      await loadGrades(user.id);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleReload = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Group grades by subject and calculate averages
  const subjectsData = useMemo(() => {
    const semesterFilter = selectedSemester === 'I' ? '1' : '2';

    // Filter grades by semester
    const semesterGrades = grades.filter(g => g.semester === semesterFilter);

    // Group by subject
    const subjectMap = new Map<string, SubjectGradeData>();

    semesterGrades.forEach(grade => {
      if (!subjectMap.has(grade.subjectId)) {
        const iconInfo = SUBJECT_ICONS[grade.subjectName] || {
          shortName: grade.subjectName.substring(0, 3),
          iconColor: 'bg-gray-100 text-gray-600'
        };

        subjectMap.set(grade.subjectId, {
          subjectId: grade.subjectId,
          subjectName: grade.subjectName,
          shortName: iconInfo.shortName,
          iconColor: iconInfo.iconColor,
          grades: [],
          average: 0,
        });
      }

      const subject = subjectMap.get(grade.subjectId)!;

      // Add grade with appropriate label
      let label = grade.assessmentType;
      if (grade.assessmentType === 'quiz') {
        // Assign TX labels for quizzes
        const quizCount = subject.grades.filter(g => g.assessmentType === 'quiz').length;
        label = `TX${quizCount + 1}`;
      } else if (grade.assessmentType === 'midterm') {
        label = 'GK';
      } else if (grade.assessmentType === 'final') {
        label = 'CK';
      }

      subject.grades.push({
        id: grade.id,
        label,
        score: grade.score,
        maxScore: grade.maxScore,
        assessmentType: grade.assessmentType,
      });
    });

    // Calculate averages
    subjectMap.forEach(subject => {
      const validScores = subject.grades
        .map(g => g.score !== null ? (g.score / g.maxScore) * 10 : 0) // Normalize to 10-point scale
        .filter(s => s > 0);

      subject.average = validScores.length > 0
        ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length
        : 0;
    });

    return Array.from(subjectMap.values());
  }, [grades, selectedSemester]);

  // Calculate overall average
  const overallAverage = useMemo(() => {
    if (subjectsData.length === 0) return 0;
    const sum = subjectsData.reduce((acc, s) => acc + s.average, 0);
    return sum / subjectsData.length;
  }, [subjectsData]);

  const overallRating = useMemo(() => {
    if (overallAverage >= 9) return 'Xuất sắc';
    if (overallAverage >= 8) return 'Giỏi';
    if (overallAverage >= 7) return 'Khá';
    if (overallAverage >= 5) return 'Trung bình';
    return 'Yếu';
  }, [overallAverage]);

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

  // Loading state
  if (isLoading && grades.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0284C7" />
        <Text className="mt-4 text-sm text-gray-500">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Error state
  if (error && grades.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center px-6">
        <View className="w-20 h-20 bg-rose-100 rounded-full items-center justify-center mb-4">
          <Text className="text-rose-600 text-3xl">⚠</Text>
        </View>
        <Text className="text-gray-800 font-extrabold text-lg mb-2">Lỗi tải dữ liệu</Text>
        <Text className="text-gray-500 text-sm text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={handleReload}
          disabled={refreshing}
          className={`bg-[#0284C7] py-3 px-8 rounded-xl ${refreshing ? 'opacity-50' : ''}`}
        >
          <Text className="text-white font-extrabold text-sm">
            {refreshing ? 'Đang tải...' : 'Thử lại'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-[60px] px-6 pb-6 rounded-b-[30px]">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-[20px] font-extrabold text-white">Bảng điểm môn học</Text>
            <Text className="text-[12px] text-blue-100 font-medium mt-0.5">Năm học 2025 - 2026</Text>
          </View>
          <TouchableOpacity
            onPress={handleReload}
            disabled={refreshing}
            className={`w-10 h-10 bg-white/20 rounded-full items-center justify-center ${refreshing ? 'opacity-50' : ''}`}
          >
            <Text className={`text-white ${refreshing ? 'animate-spin' : ''}`}>{refreshing ? '⟳' : '↻'}</Text>
          </TouchableOpacity>
        </View>
        {error && (
          <View className="mt-3 bg-rose-500/20 px-3 py-2 rounded-lg">
            <Text className="text-rose-100 text-xs">{error}</Text>
          </View>
        )}
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
          {subjectsData.map((subjectData) => (
            <View key={subjectData.subjectId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center space-x-3">
                  <View className={`w-11 h-11 ${subjectData.iconColor} rounded-xl items-center justify-center`}>
                    <Text className="text-sm font-black">{subjectData.shortName}</Text>
                  </View>
                  <View>
                    <Text className="text-gray-800 font-bold text-sm">{subjectData.subjectName}</Text>
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

              {/* Grade Grid - Display up to 5 most recent grades */}
              <View className="flex flex-row justify-between gap-2">
                {subjectData.grades.slice(0, 5).map((grade) => (
                  <View key={grade.id} className="bg-blue-50 rounded-lg p-2 items-center flex-1">
                    <Text className="text-blue-700 text-[8px] font-black mb-1 uppercase">{grade.label}</Text>
                    <Text className="text-blue-700 text-sm font-extrabold">
                      {grade.score !== null ? (grade.score / grade.maxScore * 10).toFixed(1) : '-'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Empty state */}
        {subjectsData.length === 0 && !isLoading && (
          <View className="bg-white p-8 rounded-2xl border border-gray-100 items-center">
            <Text className="text-gray-400 text-sm text-center">Chưa có dữ liệu điểm</Text>
          </View>
        )}
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
                    <Text className="text-gray-800 font-extrabold text-base mb-2">{selectedSubject.subjectName}</Text>
                    <View className="flex-row items-center space-x-4">
                      <View>
                        <Text className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">ĐTB</Text>
                        <Text className="text-[#0284C7] font-extrabold text-lg">{selectedSubject.average.toFixed(2)}</Text>
                      </View>
                      <View className="h-8 w-px bg-gray-300" />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">Chi tiết</Text>
                        <Text className="text-gray-700 font-bold text-[10px]">
                          {selectedSubject.grades.length > 0 ? selectedSubject.grades.map(g => `${g.label}: ${g.score !== null ? (g.score / g.maxScore * 10).toFixed(1) : '-'}`).join(' • ') : 'Chưa có điểm'}
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
