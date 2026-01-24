/**
 * Attendance Screen
 * Attendance history with month selector and weekly calendar grid
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';

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

// Day names in Vietnamese
const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Group attendance records by week
 */
const groupByWeek = (attendance: Array<{ date: string; status: string }>): WeekAttendanceData[] => {
  const weeksMap = new Map<number, WeekAttendanceData>();

  attendance.forEach(record => {
    const date = new Date(record.date);
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Convert to ISO week day (1 = Monday, 7 = Sunday)
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    if (!weeksMap.has(weekNumber)) {
      // Calculate week range
      const weekStart = getWeekStart(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const dateRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

      weeksMap.set(weekNumber, {
        weekNumber,
        dateRange,
        days: Array(7).fill(null).map((_, i) => ({
          dayName: DAY_NAMES[i] || '',
          date: formatDate(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000)),
          status: i === 6 ? 'weekend' : null, // Sunday is weekend
        })) as Array<{
          dayName: string;
          date: string;
          status: 'present' | 'absent' | 'weekend' | null;
        }>,
        presentCount: 0,
        totalCount: 0,
      });
    }

    const week = weeksMap.get(weekNumber)!;
    const dayIndex = isoDayOfWeek - 1; // Convert to 0-based index

    if (dayIndex >= 0 && dayIndex < 7) {
      const day = week.days[dayIndex];
      if (day) {
        day.status = record.status as 'present' | 'absent' | null;
      }
    }
  });

  // Calculate counts for each week
  weeksMap.forEach(week => {
    const validDays = week.days.filter(d => d.status !== 'weekend');
    week.presentCount = week.days.filter(d => d.status === 'present').length;
    week.totalCount = validDays.length;
  });

  return Array.from(weeksMap.values()).sort((a, b) => b.weekNumber - a.weekNumber);
};

/**
 * Get ISO week number
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Get week start date (Monday)
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Format month for filtering (YYYY-MM)
 */
const getMonthFilter = (month: string): string => {
  const currentYear = new Date().getFullYear();
  const monthNum = parseInt(month, 10);
  const year = monthNum >= 10 ? currentYear - 1 : currentYear;
  return `${year}-${String(monthNum).padStart(2, '0')}`;
};

export const StudentAttendanceScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { attendance, isLoading, error, loadAttendance } = useStudentStore();

  const [selectedMonth, setSelectedMonth] = useState<'10' | '11' | '12' | '1'>('11');
  const [refreshing, setRefreshing] = useState(false);

  // Load attendance data when student ID or month changes
  const loadData = async () => {
    if (user?.id && user?.role === 'student') {
      const monthFilter = getMonthFilter(selectedMonth);
      await loadAttendance(user.id, monthFilter);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, selectedMonth]);

  const handleReload = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate stats
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;

  // Group attendance by week
  const weeklyData = groupByWeek(attendance);

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

  // Loading state
  if (isLoading && attendance.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0284C7" />
        <Text className="mt-4 text-sm text-gray-500">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Error state
  if (error && attendance.length === 0) {
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
            <Text className="text-[20px] font-extrabold text-white">Lịch sử điểm danh</Text>
            <Text className="text-[12px] text-blue-100 font-medium mt-0.5">Theo dõi attendance học sinh</Text>
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
