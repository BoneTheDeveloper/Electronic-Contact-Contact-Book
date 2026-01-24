/**
 * Summary Screen
 * Academic summary and overall performance with proper StyleSheet
 * Matches wireframe design
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Svg } from 'react-native';
import { Circle } from 'react-native-svg';
import { Icon } from '../../components/ui';
import { StatCard } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface SummaryScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface SubjectSummary {
  subject: string;
  average: number;
  grade: string;
}

const MOCK_SUBJECTS: SubjectSummary[] = [
  { subject: 'Toán học', average: 8.5, grade: 'A' },
  { subject: 'Ngữ văn', average: 7.8, grade: 'B' },
  { subject: 'Tiếng Anh', average: 9.0, grade: 'A+' },
  { subject: 'Vật lý', average: 7.2, grade: 'B' },
  { subject: 'Hóa học', average: 8.0, grade: 'A' },
  { subject: 'Lịch sử', average: 7.5, grade: 'B' },
];

const OVERALL_SCORE = 8.2;
const ATTENDANCE_PERCENTAGE = 95;
const CONDUCT_SCORE = 90;

type TabType = 'semester1' | 'yearly';

export const StudentSummaryScreen: React.FC<SummaryScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('semester1');

  const getGradeColor = (grade: string): { bg: string; text: string } => {
    if (grade === 'A+' || grade === 'A') return { bg: '#ECFDF5', text: '#059669' };
    if (grade === 'B') return { bg: '#EFF6FF', text: '#1D4ED8' };
    if (grade === 'C') return { bg: '#FEF3C7', text: '#D97706' };
    return { bg: '#F3F4F6', text: '#6B7280' };
  };

  const getProgressWidth = (average: number): number => {
    return Math.min(average * 10, 100);
  };

  const getProgressColor = (average: number): string => {
    if (average >= 9) return '#059669';
    if (average >= 8) return '#1D4ED8';
    if (average >= 7) return '#3B82F6';
    if (average >= 6) return '#F59E0B';
    return '#EF4444';
  };

  const renderProgressRing = (percentage: number) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <Svg width={100} height={100} style={styles.progressRing}>
        {/* Background circle */}
        <Circle
          cx={50}
          cy={50}
          r={radius}
          stroke="#C7D2FE"
          strokeWidth={8}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={50}
          cy={50}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={8}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Background */}
      <View style={styles.headerBg} />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Kết quả tổng hợp</Text>
          <Text style={styles.headerSubtitle}>Năm học 2025 - 2026</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Semester Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'semester1' && styles.tabActive]}
            onPress={() => setActiveTab('semester1')}
          >
            <Text style={[styles.tabText, activeTab === 'semester1' && styles.tabTextActive]}>
              Học kỳ I
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'yearly' && styles.tabActive]}
            onPress={() => setActiveTab('yearly')}
          >
            <Text style={[styles.tabText, activeTab === 'yearly' && styles.tabTextActive]}>
              Cả năm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall Score Card */}
        <View style={styles.overallCard}>
          <View style={styles.overallInfo}>
            <Text style={styles.overallLabel}>Điểm tổng kết</Text>
            <Text style={styles.overallScore}>{OVERALL_SCORE}</Text>
            <View style={styles.overallBadges}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>Giỏi</Text>
              </View>
              <Text style={styles.overallRank}>Xếp hạng 5/40</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            {renderProgressRing(OVERALL_SCORE * 10)}
            <View style={styles.progressCenter}>
              <Text style={styles.progressPercent}>{Math.round(OVERALL_SCORE * 10)}%</Text>
            </View>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Đi học đúng giờ"
            value={`${ATTENDANCE_PERCENTAGE}%`}
            icon={<Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='#059669' strokeWidth={3}>
              <Path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
              <Path d='M22 4L12 14.01L9 11.01' />
            </Svg>}
            color="green"
          />
          <StatCard
            label="Hạnh kiểm"
            value="Tốt"
            icon={<Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='#9333EA' strokeWidth={3}>
              <Path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
            </Svg>}
            color="purple"
          />
        </View>

        {/* Subject Breakdown */}
        <Text style={styles.sectionTitle}>Chi tiết các môn</Text>

        {MOCK_SUBJECTS.map((subject, index) => {
          const colors = getGradeColor(subject.grade);
          const progressWidth = getProgressWidth(subject.average);
          const progressColor = getProgressColor(subject.average);

          return (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subject.subject}</Text>
                <View style={[styles.gradeBadge, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.gradeBadgeText, { color: colors.text }]}>
                    {subject.grade}
                  </Text>
                </View>
              </View>
              <View style={styles.subjectStats}>
                <Text style={styles.subjectAverage}>{subject.average.toFixed(1)}</Text>
                <Text style={styles.subjectMax}>/10</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressWidth}%`, backgroundColor: progressColor }]} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#0284C7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
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
    paddingBottom: 128,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  overallCard: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  overallInfo: {
    flex: 1,
  },
  overallLabel: {
    color: '#C7D2FE',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  overallScore: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  overallBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  overallRank: {
    color: '#C7D2FE',
    fontSize: 9,
    fontWeight: '500',
  },
  progressContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    transform: [{ rotate: '-90deg' }],
  },
  progressCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
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
  subjectName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  subjectAverage: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: '800',
  },
  subjectMax: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
});
