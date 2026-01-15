/**
 * Grades Screen
 * Subject grades with color-coded badges
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import { getGradesByStudentId, getGradeLetter } from '../../mock-data';
import { colors } from '../../theme';

interface SubjectGrades {
  subject: string;
  grades: Array<{
    id: string;
    examType: string;
    score: number;
    maxScore: number;
    date: string;
    remarks?: string;
  }>;
  average: number;
}

export const GradesScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const grades = selectedChild ? getGradesByStudentId(selectedChild.id) : [];

  // Group grades by subject
  const subjectsMap = new Map<string, SubjectGrades['grades']>();
  grades.forEach(grade => {
    if (!subjectsMap.has(grade.subject)) {
      subjectsMap.set(grade.subject, []);
    }
    subjectsMap.get(grade.subject)!.push({
      id: grade.id,
      examType: grade.examType,
      score: grade.score,
      maxScore: grade.maxScore,
      date: grade.date,
      remarks: grade.remarks,
    });
  });

  const subjectsData: SubjectGrades[] = Array.from(subjectsMap.entries()).map(([subject, subjectGrades]) => {
    const average = subjectGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / subjectGrades.length;
    return { subject, grades: subjectGrades, average };
  }).sort((a, b) => a.subject.localeCompare(b.subject));

  const getGradeColorByScore = (average: number) => {
    if (average >= 90) return colors.gradeA;
    if (average >= 80) return colors.gradeB;
    if (average >= 70) return colors.gradeC;
    if (average >= 60) return colors.gradeD;
    return colors.gradeF;
  };

  const getExamTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      midterm: 'Giữa kỳ',
      final: 'Cuối kỳ',
      quiz: 'Kiểm tra',
      assignment: 'Bài tập',
    };
    return labels[type] || type;
  };

  const getExamTypeColor = (type: string) => {
    const colorsMap: Record<string, string> = {
      midterm: '#8B5CF6',
      final: '#DC2626',
      quiz: '#059669',
      assignment: '#D97706',
    };
    return colorsMap[type] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng điểm môn học</Text>
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
        {subjectsData.map((subjectData) => (
          <Card key={subjectData.subject} style={styles.subjectCard}>
            <Card.Content>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subjectData.subject}</Text>
                <View style={[styles.averageBadge, { backgroundColor: `${getGradeColorByScore(subjectData.average)}20` }]}>
                  <Text style={[styles.averageText, { color: getGradeColorByScore(subjectData.average) }]}>
                    {subjectData.average.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.gradesList}>
                {subjectData.grades.map((grade) => (
                  <View key={grade.id} style={styles.gradeItem}>
                    <View style={styles.gradeInfo}>
                      <Chip
                        mode="flat"
                        compact
                        style={[styles.examTypeChip, { backgroundColor: `${getExamTypeColor(grade.examType)}20` }]}
                        textStyle={[styles.examTypeText, { color: getExamTypeColor(grade.examType) }]}
                      >
                        {getExamTypeLabel(grade.examType)}
                      </Chip>
                      <Text style={styles.gradeDate}>{grade.date}</Text>
                    </View>
                    <View style={[styles.scoreBadge, { backgroundColor: `${getGradeColorByScore((grade.score / grade.maxScore) * 100)}20` }]}>
                      <Text style={[styles.scoreText, { color: getGradeColorByScore((grade.score / grade.maxScore) * 100) }]}>
                        {grade.score}/{grade.maxScore}
                      </Text>
                      <Text style={[styles.gradeLetter, { color: getGradeColorByScore((grade.score / grade.maxScore) * 100) }]}>
                        {getGradeLetter(grade.score, grade.maxScore)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        ))}
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
  subjectCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  averageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  averageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  gradesList: {
    gap: 12,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  gradeInfo: {
    flex: 1,
    gap: 6,
  },
  examTypeChip: {
    alignSelf: 'flex-start',
    height: 26,
  },
  examTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  gradeDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  gradeLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
});
