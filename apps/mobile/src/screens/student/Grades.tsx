/**
 * Grades Screen
 * Subject grades with semester selector and grade types grid
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';
import { GradePicker } from '../../components/ui/GradePicker';
import { Icon } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface GradesScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface SubjectGradeData {
  subjectId: string;
  subjectName: string;
  shortName: string;
  iconColor: string;
  textColor: string;
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
  <View style={[styles.gradeCell, { backgroundColor: bgColor }]}>
    <Text style={[styles.gradeCellLabel, { color: textColor }]}>{label}</Text>
    <Text style={[styles.gradeCellScore, { color: textColor }]}>
      {score !== null ? score.toFixed(1) : '-'}
    </Text>
  </View>
);

const SUBJECT_ICONS: Record<string, { shortName: string; iconColor: { bg: string; text: string } }> = {
  'Toán': { shortName: 'Toán', iconColor: { bg: '#FFF7ED', text: '#F97316' } },
  'Ngữ văn': { shortName: 'Văn', iconColor: { bg: '#FAF5FF', text: '#A855F7' } },
  'Tiếng Anh': { shortName: 'Anh', iconColor: { bg: '#ECFDF5', text: '#10B981' } },
  'Anh': { shortName: 'Anh', iconColor: { bg: '#ECFDF5', text: '#10B981' } },
  'Vật lý': { shortName: 'Lý', iconColor: { bg: '#EEF2FF', text: '#6366F1' } },
  'Hóa học': { shortName: 'Hóa', iconColor: { bg: '#FFFBEB', text: '#F59E0B' } },
  'Lịch sử': { shortName: 'Sử', iconColor: { bg: '#FFF1F2', text: '#E11D48' } },
  'Địa lý': { shortName: 'Địa', iconColor: { bg: '#ECFEFF', text: '#06B6D4' } },
  'Sinh học': { shortName: 'Sinh', iconColor: { bg: '#F0FDF4', text: '#22C55E' } },
};

// Grade cell colors matching wireframe
const GRADE_CELL_COLORS: Record<string, { bg: string; text: string }> = {
  'TX': { bg: '#EFF6FF', text: '#1D4ED8' },      // Blue for quizzes (TX)
  'GK': { bg: '#FAF5FF', text: '#9333EA' },      // Purple for midterm (GK)
  'CK': { bg: '#FFF7ED', text: '#EA580C' },      // Orange for final (CK)
  'default': { bg: '#EFF6FF', text: '#1D4ED8' }, // Default blue
};

const getGradeCellColors = (label: string): { bg: string; text: string } => {
  if (label.startsWith('TX')) return GRADE_CELL_COLORS['TX']!;
  if (label === 'GK') return GRADE_CELL_COLORS['GK']!;
  if (label === 'CK') return GRADE_CELL_COLORS['CK']!;
  return GRADE_CELL_COLORS['default']!;
};

// Appeal options matching wireframe
const APPEAL_GRADE_TYPES = [
  { label: 'Điểm TX1', value: 'TX1' },
  { label: 'Điểm TX2', value: 'TX2' },
  { label: 'Điểm TX3', value: 'TX3' },
  { label: 'Điểm Giữa kỳ (GK)', value: 'GK' },
  { label: 'Điểm Cuối kỳ (CK)', value: 'CK' },
  { label: 'Điểm trung bình môn', value: 'DTB' },
];

const APPEAL_REASONS = [
  { label: 'Thầy cô tính sai điểm', value: 'wrong_calculation' },
  { label: 'Thiếu bài tập được thêm vào', value: 'missing_assignment' },
  { label: 'Mình đã làm bài nhưng bị vắng', value: 'absent_with_work' },
  { label: 'Yêu cầu xem lại bài', value: 'review_request' },
  { label: 'Khác', value: 'other' },
];

export const StudentGradesScreen: React.FC<GradesScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { grades, isLoading, error, loadGrades } = useStudentStore();

  const [selectedSemester, setSelectedSemester] = useState<'I' | 'II'>('I');
  const [appealModalVisible, setAppealModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectGradeData | null>(null);
  const [appealGradeType, setAppealGradeType] = useState('TX1');
  const [appealReason, setAppealReason] = useState('wrong_calculation');
  const [appealDetail, setAppealDetail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load grades when student ID or semester changes
  const loadData = async () => {
    if (user?.id && user?.role === 'student') {
      const semesterParam = selectedSemester === 'I' ? '1' : '2';
      await loadGrades(user.id, semesterParam);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, selectedSemester]);

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
          iconColor: { bg: '#F3F4F6', text: '#6B7280' }
        };

        subjectMap.set(grade.subjectId, {
          subjectId: grade.subjectId,
          subjectName: grade.subjectName,
          shortName: iconInfo.shortName,
          iconColor: iconInfo.iconColor.bg,
          textColor: iconInfo.iconColor.text,
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
    // Reset form
    setAppealGradeType('TX1');
    setAppealReason('wrong_calculation');
    setAppealDetail('');
  };

  const closeAppealModal = () => {
    setAppealModalVisible(false);
    setAppealDetail('');
    setSelectedSubject(null);
  };

  const submitAppeal = async () => {
    if (!user?.id || !selectedSubject) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin');
      return;
    }

    try {
      await createGradeAppeal({
        gradeEntryId: selectedSubject.grades[0]?.id || '',
        studentId: user.id,
        reason: appealReason,
        detail: appealDetail,
      });

      setAppealModalVisible(false);
      setSuccessModalVisible(true);
      setAppealDetail('');
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error submitting appeal:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu phúc khảo');
    }
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  // Loading state
  if (isLoading && grades.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Error state
  if (error && grades.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorIconContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
        </View>
        <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          onPress={handleReload}
          disabled={refreshing}
          style={refreshing ? [styles.retryButton, styles.retryButtonDisabled] : styles.retryButton}
        >
          <Text style={styles.retryButtonText}>
            {refreshing ? 'Đang tải...' : 'Thử lại'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Bảng điểm môn học</Text>
            <Text style={styles.headerSubtitle}>Năm học 2025 - 2026</Text>
          </View>
          <TouchableOpacity
            onPress={handleReload}
            disabled={refreshing}
            style={refreshing ? [styles.refreshButton, styles.refreshButtonDisabled] : styles.refreshButton}
          >
            <Text style={styles.refreshIcon}>{refreshing ? '⟳' : '↻'}</Text>
          </TouchableOpacity>
        </View>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Semester Selector */}
        <View style={styles.semesterSelector}>
          <TouchableOpacity
            onPress={() => setSelectedSemester('I')}
            style={selectedSemester === 'I' ? [styles.semesterTab, styles.semesterTabActive] : styles.semesterTab}
          >
            <Text style={selectedSemester === 'I' ? styles.semesterTabTextActive : styles.semesterTabTextInactive}>
              Học kỳ I
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedSemester('II')}
            style={selectedSemester === 'II' ? [styles.semesterTab, styles.semesterTabActive] : styles.semesterTab}
          >
            <Text style={selectedSemester === 'II' ? styles.semesterTabTextActive : styles.semesterTabTextInactive}>
              Học kỳ II
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View>
              <Text style={styles.summaryLabel}>Điểm trung bình</Text>
              <Text style={styles.summaryScore}>{overallAverage.toFixed(1)}</Text>
              <Text style={styles.summaryRating}>Xếp loại: {overallRating}</Text>
            </View>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>✓</Text>
            </View>
          </View>
        </View>

        {/* Subject Grades List */}
        <Text style={styles.sectionTitle}>Chi tiết các môn</Text>

        <View style={styles.subjectsList}>
          {subjectsData.map((subjectData) => (
            <View key={subjectData.subjectId} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectInfo}>
                  <View style={[styles.subjectIcon, { backgroundColor: subjectData.iconColor }]}>
                    <Text style={[styles.subjectIconText, { color: subjectData.textColor }]}>
                      {subjectData.shortName}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.subjectName}>{subjectData.subjectName}</Text>
                  </View>
                </View>
                <View style={styles.subjectGrade}>
                  <View style={styles.subjectGradeTextContainer}>
                    <Text style={styles.subjectGradeText}>{subjectData.average.toFixed(2)}</Text>
                    <Text style={styles.subjectGradeLabel}>ĐTB</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openAppealModal(subjectData)}
                    style={styles.appealButton}
                  >
                    <Text style={styles.appealButtonText}>✏</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Grade Grid - Display up to 5 most recent grades with color coding */}
              <View style={styles.gradeGrid}>
                {subjectData.grades.slice(0, 5).map((grade) => {
                  const colors = getGradeCellColors(grade.label);
                  return (
                    <View key={grade.id} style={[styles.gradeCell, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.gradeCellLabel, { color: colors.text }]}>{grade.label}</Text>
                      <Text style={[styles.gradeCellScore, { color: colors.text }]}>
                        {grade.score !== null ? (grade.score / grade.maxScore * 10).toFixed(1) : '-'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Empty state */}
        {subjectsData.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Chưa có dữ liệu điểm</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.appealModalContent}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Phúc khảo điểm</Text>
                <Text style={styles.modalSubtitle}>Yêu cầu xem lại điểm</Text>
              </View>
              <TouchableOpacity onPress={closeAppealModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Grade Info Card */}
            {selectedSubject && (
              <View style={styles.gradeInfoCard}>
                <View style={styles.gradeInfoContent}>
                  <View style={styles.gradeInfoIcon}>
                    <Text style={styles.gradeInfoIconText}>📄</Text>
                  </View>
                  <View style={styles.gradeInfoDetails}>
                    <Text style={styles.gradeInfoLabel}>Môn học</Text>
                    <Text style={styles.gradeInfoSubject}>{selectedSubject.subjectName}</Text>
                    <View style={styles.gradeInfoStats}>
                      <View>
                        <Text style={styles.gradeInfoStatLabel}>ĐTB</Text>
                        <Text style={styles.gradeInfoStatValue}>{selectedSubject.average.toFixed(2)}</Text>
                      </View>
                      <View style={styles.gradeInfoDivider} />
                      <View style={styles.gradeInfoDetail}>
                        <Text style={styles.gradeInfoStatLabel}>Chi tiết</Text>
                        <Text style={styles.gradeInfoDetailText}>
                          {selectedSubject.grades.length > 0
                            ? selectedSubject.grades.map(g => `${g.label}: ${g.score !== null ? (g.score / g.maxScore * 10).toFixed(1) : '-'}`).join(' • ')
                            : 'Chưa có điểm'
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Appeal Form */}
            <View style={styles.appealForm}>
              <GradePicker
                label="Loại điểm cần phúc khảo"
                options={APPEAL_GRADE_TYPES}
                value={appealGradeType}
                onChange={setAppealGradeType}
              />

              <GradePicker
                label="Lý do phúc khảo"
                options={APPEAL_REASONS}
                value={appealReason}
                onChange={setAppealReason}
              />

              <View>
                <Text style={styles.textAreaLabel}>Giải trình chi tiết</Text>
                <TextInput
                  value={appealDetail}
                  onChangeText={setAppealDetail}
                  placeholder="Nhập chi tiết lý do phúc khảo..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  textAlignVertical="top"
                />
                <Text style={styles.textAreaHint}>
                  ℹ Cung cấp càng nhiều chi tiết càng tốt
                </Text>
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

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.dragHandle} />

            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Đã gửi thành công!</Text>
            <Text style={styles.successMessage}>
              Yêu cầu phúc khảo của bạn đã được gửi đến giáo viên. Chúng tôi sẽ thông báo kết quả sớm nhất.
            </Text>

            <TouchableOpacity
              onPress={closeSuccessModal}
              style={styles.successCloseButton}
            >
              <Text style={styles.successCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FEE2E2',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 32,
    color: '#DC2626',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Header
  header: {
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#DBEAFE',
    fontWeight: '500',
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  errorBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#FEE2E2',
    fontSize: 12,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },

  // Semester selector
  semesterSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  semesterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  semesterTabActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  semesterTabText: {
    fontSize: 14,
    fontWeight: '800',
  },
  semesterTabTextActive: {
    color: '#FFFFFF',
  },
  semesterTabTextInactive: {
    color: '#9CA3AF',
  },

  // Summary card
  summaryCard: {
    backgroundColor: '#0284C7',
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#DBEAFE',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryScore: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  summaryRating: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    color: '#FFFFFF',
    fontSize: 24,
  },

  // Section title
  sectionTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },

  // Subjects list
  subjectsList: {
    gap: 12,
  },
  subjectCard: {
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
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIconText: {
    fontSize: 14,
    fontWeight: '800',
  },
  subjectName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  subjectGrade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectGradeTextContainer: {
    alignItems: 'flex-end',
  },
  subjectGradeText: {
    color: '#0284C7',
    fontSize: 18,
    fontWeight: '800',
  },
  subjectGradeLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  appealButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appealButtonText: {
    color: '#F59E0B',
    fontSize: 14,
  },

  // Grade grid
  gradeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  gradeCell: {
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    flex: 1,
  },
  gradeCellLabel: {
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gradeCellScore: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Empty state
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },

  // Appeal modal
  appealModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButtonText: {
    color: '#6B7280',
    fontSize: 18,
  },

  // Grade info card
  gradeInfoCard: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  gradeInfoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  gradeInfoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#0284C7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeInfoIconText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  gradeInfoDetails: {
    flex: 1,
  },
  gradeInfoLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  gradeInfoSubject: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  gradeInfoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gradeInfoStatLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gradeInfoStatValue: {
    color: '#0284C7',
    fontSize: 18,
    fontWeight: '800',
  },
  gradeInfoDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#D1D5DB',
  },
  gradeInfoDetail: {
    flex: 1,
  },
  gradeInfoDetailText: {
    color: '#374151',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },

  // Appeal form
  appealForm: {
    gap: 16,
  },
  textAreaLabel: {
    color: '#374151',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    minHeight: 100,
  },
  textAreaHint: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Success modal
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
  },
  successTitle: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  successCloseButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
