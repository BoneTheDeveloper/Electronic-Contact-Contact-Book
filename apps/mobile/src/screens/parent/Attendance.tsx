/**
 * Attendance Screen
 * Attendance history with month selector and weekly calendar grid
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useParentStore } from '../../stores';
import { getAttendanceByStudentId } from '../../mock-data';

interface WeekAttendanceData {
  weekNumber: number;
  dateRange: string;
  days: Array<{
    dayName: string;
    date: string;
    status: 'present' | 'absent' | 'weekend' | null;
  }>;
  presentCount: number;
  totalCount: number;
}

export const AttendanceScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
  const attendance = selectedChild ? getAttendanceByStudentId(selectedChild.id) : [];

  const [selectedMonth, setSelectedMonth] = useState<'10' | '11' | '12' | '1'>('11');

  // Calculate stats
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;

  // Mock weekly data
  const weeklyData: WeekAttendanceData[] = [
    {
      weekNumber: 2,
      dateRange: '06/01 - 12/01',
      days: [
        { dayName: 'T2', date: '06/01', status: 'present' },
        { dayName: 'T3', date: '07/01', status: 'present' },
        { dayName: 'T4', date: '08/01', status: 'present' },
        { dayName: 'T5', date: '09/01', status: 'present' },
        { dayName: 'T6', date: '10/01', status: 'present' },
        { dayName: 'T7', date: '11/01', status: 'present' },
        { dayName: 'CN', date: '12/01', status: 'weekend' },
      ],
      presentCount: 6,
      totalCount: 6,
    },
    {
      weekNumber: 1,
      dateRange: '30/12 - 05/01',
      days: [
        { dayName: 'T2', date: '30/12', status: 'present' },
        { dayName: 'T3', date: '31/12', status: 'absent' },
        { dayName: 'T4', date: '01/01', status: 'present' },
        { dayName: 'T5', date: '02/01', status: 'present' },
        { dayName: 'T6', date: '03/01', status: 'present' },
        { dayName: 'T7', date: '04/01', status: 'present' },
        { dayName: 'CN', date: '05/01', status: 'weekend' },
      ],
      presentCount: 5,
      totalCount: 6,
    },
  ];

  const DayCell: React.FC<{ dayName: string; status: 'present' | 'absent' | 'weekend' | null }> = ({ dayName, status }) => {
    if (status === 'weekend') {
      return (
        <View className="flex-col items-center py-2">
          <Text className="text-[8px] font-black text-gray-400 uppercase mb-1">{dayName}</Text>
          <View className="w-7 h-7 bg-gray-100 rounded-lg" />
        </View>
      );
    }

    if (status === 'present') {
      return (
        <View className="flex-col items-center py-2">
          <Text className="text-[8px] font-black text-gray-400 uppercase mb-1">{dayName}</Text>
          <View className="w-7 h-7 bg-emerald-100 rounded-lg items-center justify-center">
            <Text className="text-emerald-600 text-sm">✓</Text>
          </View>
        </View>
      );
    }

    if (status === 'absent') {
      return (
        <View className="flex-col items-center py-2">
          <Text className="text-[8px] font-black text-gray-400 uppercase mb-1">{dayName}</Text>
          <View className="w-7 h-7 bg-rose-100 rounded-lg items-center justify-center">
            <Text className="text-rose-600 text-sm font-bold">✕</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] pt-[60px] px-6 pb-6 rounded-b-[30px]">
        <Text className="text-[20px] font-extrabold text-white">Lịch sử điểm danh</Text>
        <Text className="text-[12px] text-blue-100 font-medium mt-0.5">Theo dõi attendance học sinh</Text>
      </View>

      <ScrollView className="px-6 pt-6 pb-[140px]" showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <Text className="text-emerald-600 text-[9px] font-black uppercase tracking-wider mb-1">Có mặt</Text>
            <Text className="text-emerald-700 text-2xl font-extrabold">{presentCount}</Text>
            <Text className="text-emerald-500 text-[9px] font-medium">ngày</Text>
          </View>
          <View className="flex-1 bg-rose-50 p-3 rounded-2xl border border-rose-100">
            <Text className="text-rose-600 text-[9px] font-black uppercase tracking-wider mb-1">Vắng mặt</Text>
            <Text className="text-rose-700 text-2xl font-extrabold">{absentCount}</Text>
            <Text className="text-rose-500 text-[9px] font-medium">ngày</Text>
          </View>
          <View className="flex-1 bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <Text className="text-amber-600 text-[9px] font-black uppercase tracking-wider mb-1">Có phép</Text>
            <Text className="text-amber-700 text-2xl font-extrabold">{excusedCount}</Text>
            <Text className="text-amber-500 text-[9px] font-medium">ngày</Text>
          </View>
        </View>

        {/* Month Selector */}
        <View className="flex-row space-x-2 mb-5 overflow-x-scroll">
          {(['10', '11', '12', '1'] as const).map((month) => (
            <TouchableOpacity
              key={month}
              onPress={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-xl ${selectedMonth === month ? 'bg-[#0284C7]' : 'bg-white border border-gray-200'}`}
            >
              <Text className={`text-xs font-black ${selectedMonth === month ? 'text-white' : 'text-gray-400'}`}>
                Tháng {month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attendance Calendar */}
        <Text className="text-gray-800 font-extrabold text-sm mb-3">Chi tiết điểm danh</Text>

        <View className="space-y-3">
          {weeklyData.map((week) => (
            <View key={week.weekNumber} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-800 font-bold text-sm">Tuần 0{week.weekNumber} ({week.dateRange})</Text>
                <View className={`px-2 py-1 rounded-full ${week.presentCount === week.totalCount ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  <Text className={`text-[9px] font-black uppercase ${week.presentCount === week.totalCount ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {week.presentCount}/{week.totalCount} ngày
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between gap-1">
                {week.days.map((day, index) => (
                  <DayCell key={index} dayName={day.dayName} status={day.status} />
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View className="flex-row justify-center space-x-6 pt-4">
          <View className="flex-row items-center space-x-2">
            <View className="w-4 h-4 bg-emerald-100 rounded-lg items-center justify-center">
              <Text className="text-emerald-600 text-xs">✓</Text>
            </View>
            <Text className="text-[10px] font-black text-gray-500 uppercase">Có mặt</Text>
          </View>
          <View className="flex-row items-center space-x-2">
            <View className="w-4 h-4 bg-rose-100 rounded-lg items-center justify-center">
              <Text className="text-rose-600 text-xs font-bold">✕</Text>
            </View>
            <Text className="text-[10px] font-black text-gray-500 uppercase">Vắng</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
