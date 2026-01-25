/**
 * Summary Screen
 * Academic summary and overall performance with proper StyleSheet
 * Matches wireframe design
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../../components/ui';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface SummaryScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface SubjectSummary {
  subject: string;
  average: number;
  rating: string;
}

type TabType = 'semester1' | 'yearly';

export const StudentSummaryScreen: React.FC<SummaryScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('semester1');
  const { user } = useAuthStore();
  const { grades, attendance, attendancePercentage, loadGrades, loadAttendance } = useStudentStore();

  useEffect(() => {
    if (user?.id && user?.role === 'student') {
      loadGrades(user.id, activeTab === 'semester1' ? '1' : '2');
      loadAttendance(user.id);
    }
  }, [user?.id, activeTab]);

  // Calculate subject averages from grades
  const subjectSummaries = useMemo(() => {
    const subjectMap = new Map<string, { total: number; count: number }>();

    grades.forEach(grade => {
      if (grade.score !== null) {
        const normalizedScore = (grade.score / grade.maxScore) * 10;
        const current = subjectMap.get(grade.subjectName) || { total: 0, count: 0 };
        subjectMap.set(grade.subjectName, {
          total: current.total + normalizedScore,
          count: current.count + 1,
        });
      }
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => {
      const average = data.total / data.count;
      let rating = 'TB';
      if (average >= 9) rating = 'Giỏi';
      else if (average >= 8) rating = 'Giỏi';
      else if (average >= 7) rating = 'Khá';
      else if (average >= 6) rating = 'TB';
      else rating = 'Kém';

      return { subject, average, rating };
    }).sort((a, b) => b.average - a.average);
  }, [grades]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    if (subjectSummaries.length === 0) return 0;
    return subjectSummaries.reduce((sum, s) => sum + s.average, 0) / subjectSummaries.length;
  }, [subjectSummaries]);

  // Get overall rating
  const getOverallRating = (): string => {
    if (overallScore >= 9) return 'Xuất sắc';
    if (overallScore >= 8) return 'Giỏi';
    if (overallScore >= 7) return 'Khá';
    if (overallScore >= 6) return 'TB';
    return 'Kém';
  };

  const getRatingColor = (rating: string): { bg: string; text: string } => {
    if (rating === 'Giỏi') return { bg: '#ECFDF5', text: '#059669' };
    if (rating === 'Khá') return { bg: '#EFF6FF', text: '#1D4ED8' };
    if (rating === 'TB') return { bg: '#FEF3C7', text: '#D97706' };
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

        {/* Simple Stat Cards */}
        <View style={styles.simpleStatsRow}>
          <View style={[styles.simpleStatCard, styles.scoreCard]}>
            <Text style={styles.simpleStatLabel}>Điểm tổng kết</Text>
            <View style={styles.scoreContent}>
              <Text style={styles.simpleStatScore}>{overallScore.toFixed(1)}</Text>
              <View style={[styles.ratingBadge, styles.scoreRatingBadge]}>
                <Text style={[styles.simpleStatRating, styles.scoreRating]}>{getOverallRating()}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.simpleStatCard, styles.conductCard]}>
            <Text style={styles.simpleStatLabel}>Hạnh kiểm</Text>
            <View style={[styles.ratingBadge, styles.conductRatingBadge]}>
              <Text style={[styles.simpleStatRating, styles.conductRating]}>Tốt</Text>
            </View>
          </View>
        </View>

        {/* Subject Breakdown */}
        <Text style={styles.sectionTitle}>Chi tiết các môn</Text>

        {subjectSummaries.length === 0 ? (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#9ca3af' }}>Chưa có dữ liệu điểm</Text>
          </View>
        ) : (
          subjectSummaries.map((subject, index) => {
          const colors = getRatingColor(subject.rating);
          const progressWidth = getProgressWidth(subject.average);
          const progressColor = getProgressColor(subject.average);

          return (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subject.subject}</Text>
                <View style={[styles.gradeBadge, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.gradeBadgeText, { color: colors.text }]}>
                    {subject.rating}
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
        })
        )}
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
  simpleStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  simpleStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  simpleStatLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  simpleStatScore: {
    color: '#1F2937',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  simpleStatRating: {
    fontSize: 14,
    fontWeight: '700',
  },
  scoreCard: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
  },
  scoreRatingBadge: {
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
  },
  scoreRating: {
    color: '#9333EA',
  },
  conductCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  conductRatingBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  conductRating: {
    color: '#F97316',
  },
});
