/**
 * Grades Screen
 * Subject grades with color-coded badges
 */

import React from 'react';
import { View, ScrollView, Text } from 'react-native';
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
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-[60px] px-6 pb-6 rounded-b-[20px]">
        <Text className="text-[24px] font-bold text-white">Bảng điểm môn học</Text>
        {selectedChild && (
          <Text className="text-[14px] text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerClassName="p-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
      >
        {subjectsData.map((subjectData) => (
          <View key={subjectData.subject} className="mb-4 bg-white rounded-2xl shadow-sm">
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <Text className="text-[18px] font-bold text-gray-900">{subjectData.subject}</Text>
                <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${getGradeColorByScore(subjectData.average)}20` }}>
                  <Text className="text-[16px] font-bold" style={{ color: getGradeColorByScore(subjectData.average) }}>
                    {subjectData.average.toFixed(1)}
                  </Text>
                </View>
              </View>
              <View className="gap-3">
                {subjectData.grades.map((grade) => (
                  <View key={grade.id} className="flex-row justify-between items-center py-2">
                    <View className="flex-1 gap-1.5">
                      <View className="self-start h-[26px] px-2 py-0.5 rounded-md" style={{ backgroundColor: `${getExamTypeColor(grade.examType)}20` }}>
                        <Text className="text-[11px] font-semibold" style={{ color: getExamTypeColor(grade.examType) }}>
                          {getExamTypeLabel(grade.examType)}
                        </Text>
                      </View>
                      <Text className="text-[11px] text-gray-500">{grade.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${getGradeColorByScore((grade.score / grade.maxScore) * 100)}20` }}>
                      <Text className="text-[14px] font-bold" style={{ color: getGradeColorByScore((grade.score / grade.maxScore) * 100) }}>
                        {grade.score}/{grade.maxScore}
                      </Text>
                      <Text className="text-[18px] font-extrabold" style={{ color: getGradeColorByScore((grade.score / grade.maxScore) * 100) }}>
                        {getGradeLetter(grade.score, grade.maxScore)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
