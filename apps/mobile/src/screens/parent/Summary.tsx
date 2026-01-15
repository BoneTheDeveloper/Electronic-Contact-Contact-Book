/**
 * Summary Screen
 * Academic summary and overall performance
 */

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, ProgressBar, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import {
  getGradesByStudentId,
  getAttendanceByStudentId,
  calculateAttendancePercentage,
  getGradeLetter,
} from '../../mock-data';
import { colors } from '../../theme';

interface SubjectSummary {
  subject: string;
  average: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
}

export const SummaryScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const grades = selectedChild ? getGradesByStudentId(selectedChild.id) : [];
  const attendance = selectedChild ? getAttendanceByStudentId(selectedChild.id) : [];

  const academicSummary = useMemo(() => {
    // Calculate overall average
    const overallAverage = grades.length > 0
      ? grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
      : 0;

    // Group by subject
    const subjectsMap = new Map<string, number[]>();
    grades.forEach(grade => {
      if (!subjectsMap.has(grade.subject)) {
        subjectsMap.set(grade.subject, []);
      }
      subjectsMap.get(grade.subject)!.push((grade.score / grade.maxScore) * 100);
    });

    const subjectSummaries: SubjectSummary[] = Array.from(subjectsMap.entries()).map(([subject, scores]) => {
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      return {
        subject,
        average,
        grade: getGradeLetter(average, 100),
        trend: 'stable' as const,
      };
    }).sort((a, b) => b.average - a.average);

    // Attendance stats
    const attendanceStats = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      percentage: calculateAttendancePercentage(attendance),
    };

    return {
      overallAverage,
      subjectSummaries,
      attendanceStats,
      totalGrades: grades.length,
    };
  }, [grades, attendance]);

  const getPerformanceColor = (average: number) => {
    if (average >= 90) return colors.gradeA;
    if (average >= 80) return colors.gradeB;
    if (average >= 70) return colors.gradeC;
    if (average >= 60) return colors.gradeD;
    return colors.gradeF;
  };

  const getPerformanceLabel = (average: number) => {
    if (average >= 90) return 'Xuất sắc';
    if (average >= 80) return 'Khá giỏi';
    if (average >= 70) return 'Khá';
    if (average >= 60) return 'Trung bình - Khá';
    if (average >= 50) return 'Trung bình';
    return 'Cần cố gắng';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kết quả tổng hợp</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Performance Card */}
        <Card style={styles.overallCard}>
          <Card.Content style={styles.overCardContent}>
            <View style={styles.overallInfo}>
              <View>
                <Text style={styles.overallLabel}>Điểm trung bình</Text>
                <Text style={[styles.overallScore, { color: getPerformanceColor(academicSummary.overallAverage) }]}>
                  {academicSummary.overallAverage.toFixed(1)}
                </Text>
                <Text style={styles.overallPerformance}>
                  {getPerformanceLabel(academicSummary.overallAverage)}
                </Text>
              </View>
              <View style={styles.gradeBadge}>
                <Text style={[styles.gradeText, { color: getPerformanceColor(academicSummary.overallAverage) }]}>
                  {getGradeLetter(academicSummary.overallAverage, 100)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Subject Performance */}
        <Card style={styles.subjectsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Điểm môn học</Text>
            {academicSummary.subjectSummaries.map((subject) => (
              <View key={subject.subject} style={styles.subjectItem}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject.subject}</Text>
                  <View style={[
                    styles.gradeBadgeSmall,
                    { backgroundColor: `${getPerformanceColor(subject.average)}20` }
                  ]}>
                    <Text style={[
                      styles.gradeTextSmall,
                      { color: getPerformanceColor(subject.average) }
                    ]}>
                      {subject.grade}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Trung bình</Text>
                    <Text style={styles.progressValue}>{subject.average.toFixed(1)}</Text>
                  </View>
                  <ProgressBar
                    progress={subject.average / 100}
                    color={getPerformanceColor(subject.average)}
                    style={styles.progressBar}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Attendance Summary */}
        <Card style={styles.attendanceCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Điểm danh</Text>
            <View style={styles.attendanceStats}>
              <View style={styles.attendanceMain}>
                <Text style={styles.attendancePercentage}>
                  {academicSummary.attendanceStats.percentage}%
                </Text>
                <Text style={styles.attendanceLabel}>Đi học</Text>
              </View>
              <View style={styles.attendanceDetails}>
                <View style={styles.attendanceItem}>
                  <View style={[styles.attendanceDot, { backgroundColor: colors.attendancePresent }]} />
                  <Text style={styles.attendanceItemText}>
                    Có mặt: {academicSummary.attendanceStats.present}
                  </Text>
                </View>
                <View style={styles.attendanceItem}>
                  <View style={[styles.attendanceDot, { backgroundColor: colors.attendanceLate }]} />
                  <Text style={styles.attendanceItemText}>
                    Muộn: {academicSummary.attendanceStats.late}
                  </Text>
                </View>
                <View style={styles.attendanceItem}>
                  <View style={[styles.attendanceDot, { backgroundColor: colors.attendanceAbsent }]} />
                  <Text style={styles.attendanceItemText}>
                    Vắng: {academicSummary.attendanceStats.absent}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Additional Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Thống kê</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{academicSummary.totalGrades}</Text>
                <Text style={styles.statLabel}>Bài kiểm tra</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{academicSummary.subjectSummaries.length}</Text>
                <Text style={styles.statLabel}>Môn học</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{attendance.length}</Text>
                <Text style={styles.statLabel}>Ngày điểm danh</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  overallCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  overCardContent: {
    padding: 24,
  },
  overallInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  overallScore: {
    fontSize: 48,
    fontWeight: '800',
    marginTop: 8,
  },
  overallPerformance: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginTop: 4,
  },
  gradeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 36,
    fontWeight: '800',
  },
  subjectsCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  subjectItem: {
    marginBottom: 20,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  gradeBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeTextSmall: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  attendanceCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  attendanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  attendanceMain: {
    alignItems: 'center',
    minWidth: 80,
  },
  attendancePercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  attendanceDetails: {
    flex: 1,
    gap: 12,
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  attendanceItemText: {
    fontSize: 13,
    color: '#374151',
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
