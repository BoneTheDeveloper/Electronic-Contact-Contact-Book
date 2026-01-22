/**
 * Attendance Screen
 * Attendance history with stats
 */

import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useParentStore } from '../../stores';
import { getAttendanceByStudentId, calculateAttendancePercentage } from '../../mock-data';
import { colors } from '../../theme';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

const STATUS_CONFIG = {
  present: { label: 'Có mặt', color: colors.attendancePresent, bgColor: '#DCFCE7' },
  absent: { label: 'Vắng mặt', color: colors.attendanceAbsent, bgColor: '#FEE2E2' },
  late: { label: 'Đi muộn', color: colors.attendanceLate, bgColor: '#FEF3C7' },
  excused: { label: 'Có phép', color: colors.attendanceExcused, bgColor: '#DBEAFE' },
};

export const AttendanceScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const attendance = selectedChild ? getAttendanceByStudentId(selectedChild.id) : [];

  const stats = useMemo(() => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    const percentage = calculateAttendancePercentage(attendance);
    const total = attendance.length;
    return { present, absent, late, excused, percentage, total };
  }, [attendance]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-[#0284C7] pt-[60px] px-6 pb-6 rounded-b-[20px]">
        <Text className="text-[24px] font-bold text-white">Lịch sử điểm danh</Text>
        {selectedChild && (
          <Text className="text-[14px] text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>

      <ScrollView
        className="px-4 pb-[100px]"
        contentContainerStyle={{ paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <View className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <Text className="text-[18px] font-bold text-gray-800 mb-4">Thống kê điểm danh</Text>
          <View className="flex-row flex-wrap justify-between mb-5">
            {/* Present */}
            <View className="w-[23%] items-center">
              <View className="w-[60px] h-[60px] rounded-full bg-green-100 justify-center items-center mb-2">
                <Text className="text-[20px] font-extrabold text-green-600">
                  {stats.present}
                </Text>
              </View>
              <Text className="text-[11px] font-semibold text-gray-500 text-center">Có mặt</Text>
            </View>
            {/* Absent */}
            <View className="w-[23%] items-center">
              <View className="w-[60px] h-[60px] rounded-full bg-red-100 justify-center items-center mb-2">
                <Text className="text-[20px] font-extrabold text-red-600">
                  {stats.absent}
                </Text>
              </View>
              <Text className="text-[11px] font-semibold text-gray-500 text-center">Vắng</Text>
            </View>
            {/* Late */}
            <View className="w-[23%] items-center">
              <View className="w-[60px] h-[60px] rounded-full bg-amber-100 justify-center items-center mb-2">
                <Text className="text-[20px] font-extrabold text-amber-600">
                  {stats.late}
                </Text>
              </View>
              <Text className="text-[11px] font-semibold text-gray-500 text-center">Muộn</Text>
            </View>
            {/* Excused */}
            <View className="w-[23%] items-center">
              <View className="w-[60px] h-[60px] rounded-full bg-blue-100 justify-center items-center mb-2">
                <Text className="text-[20px] font-extrabold text-blue-600">
                  {stats.excused}
                </Text>
              </View>
              <Text className="text-[11px] font-semibold text-gray-500 text-center">Có phép</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center pt-4 border-t border-gray-200">
            <Text className="text-[16px] font-semibold text-gray-800">Tỷ lệ đi học</Text>
            <Text className="text-[28px] font-extrabold text-[#0284C7]">{stats.percentage}%</Text>
          </View>
        </View>

        {/* Attendance History */}
        <Text className="text-[18px] font-bold text-gray-800 mb-3 mt-2">Lịch sử chi tiết</Text>
        {attendance.map((record) => {
          const config = STATUS_CONFIG[record.status];
          return (
            <View
              key={record.date}
              className="mb-3 bg-white rounded-xl border border-gray-100 p-4"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-gray-800">{formatDate(record.date)}</Text>
                  {record.remarks && (
                    <Text className="text-[12px] text-gray-500 mt-0.5">{record.remarks}</Text>
                  )}
                </View>
                <View
                  className="h-7 px-3 rounded-full justify-center items-center"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Text
                    className="text-[11px] font-bold uppercase"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
