/**
 * Summary Screen
 * Academic summary and overall performance
 */

import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useStudentStore } from '../../stores';
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

export const StudentSummaryScreen: React.FC = () => {
  const { studentData } = useStudentStore();
  
  // Using mock data
  // Using mock data

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

  const getPerformanceColor = (average: number): string => {
    if (average >= 90) return colors.gradeA;
    if (average >= 80) return colors.gradeB;
    if (average >= 70) return colors.gradeC;
    if (average >= 60) return colors.gradeD;
    return colors.gradeF;
  };

  const getPerformanceLabel = (average: number): string => {
    if (average >= 90) return 'Xuất sắc';
    if (average >= 80) return 'Khá giỏi';
    if (average >= 70) return 'Khá';
    if (average >= 60) return 'Trung bình - Khá';
    if (average >= 50) return 'Trung bình';
    return 'Cần cố gắng';
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-[60px] px-6 pb-6 rounded-b-[20px]">
        <Text className="text-[24px] font-bold text-white">Kết quả tổng hợp</Text>
        {selectedChild && (
          <Text className="text-[14px] text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        className="px-4 pb-[100px]"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {/* Overall Performance Card */}
        <View className="bg-white rounded-2xl shadow-sm p-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[14px] text-gray-500 font-semibold">Điểm trung bình</Text>
              <Text
                className="text-[48px] font-extrabold mt-2"
                style={{ color: getPerformanceColor(academicSummary.overallAverage) }}
              >
                {academicSummary.overallAverage.toFixed(1)}
              </Text>
              <Text className="text-[16px] text-gray-800 font-semibold mt-1">
                {getPerformanceLabel(academicSummary.overallAverage)}
              </Text>
            </View>
            <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center">
              <Text
                className="text-[36px] font-extrabold"
                style={{ color: getPerformanceColor(academicSummary.overallAverage) }}
              >
                {getGradeLetter(academicSummary.overallAverage, 100)}
              </Text>
            </View>
          </View>
        </View>

        {/* Subject Performance */}
        <View className="bg-white rounded-xl p-4">
          <Text className="text-[18px] font-bold text-gray-800 mb-4">Điểm môn học</Text>
          {academicSummary.subjectSummaries.map((subject) => (
            <View key={subject.subject} className="mb-5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[15px] font-semibold text-gray-800">{subject.subject}</Text>
                <View
                  className="px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: `${getPerformanceColor(subject.average)}20` }}
                >
                  <Text
                    className="text-[14px] font-bold"
                    style={{ color: getPerformanceColor(subject.average) }}
                  >
                    {subject.grade}
                  </Text>
                </View>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] text-gray-500">Trung bình</Text>
                  <Text className="text-[14px] font-bold text-gray-800">{subject.average.toFixed(1)}</Text>
                </View>
                <View className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${subject.average}%`,
                      backgroundColor: getPerformanceColor(subject.average),
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Attendance Summary */}
        <View className="bg-white rounded-xl p-4">
          <Text className="text-[18px] font-bold text-gray-800 mb-4">Điểm danh</Text>
          <View className="flex-row items-center gap-5">
            <View className="items-center min-w-[80px]">
              <Text className="text-[36px] font-extrabold text-sky-600">
                {academicSummary.attendanceStats.percentage}%
              </Text>
              <Text className="text-[12px] text-gray-500 mt-1">Đi học</Text>
            </View>
            <View className="flex-1 gap-3">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="text-[13px] text-gray-700">
                  Có mặt: {academicSummary.attendanceStats.present}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-orange-500" />
                <Text className="text-[13px] text-gray-700">
                  Muộn: {academicSummary.attendanceStats.late}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-red-500" />
                <Text className="text-[13px] text-gray-700">
                  Vắng: {academicSummary.attendanceStats.absent}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View className="bg-white rounded-xl p-4">
          <Text className="text-[18px] font-bold text-gray-800 mb-4">Thống kê</Text>
          <View className="flex-row justify-around pt-2">
            <View className="items-center">
              <Text className="text-[28px] font-extrabold text-sky-600">{academicSummary.totalGrades}</Text>
              <Text className="text-[12px] text-gray-500 mt-1">Bài kiểm tra</Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-extrabold text-sky-600">{academicSummary.subjectSummaries.length}</Text>
              <Text className="text-[12px] text-gray-500 mt-1">Môn học</Text>
            </View>
            <View className="items-center">
              <Text className="text-[28px] font-extrabold text-sky-600">{attendance.length}</Text>
              <Text className="text-[12px] text-gray-500 mt-1">Ngày điểm danh</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
