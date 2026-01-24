/**
 * Schedule Screen
 * Class timetable display with week day selector and period cards
 * Uses real Supabase data via student store
 */

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useStudentStore } from "../../stores";
import { useAuthStore } from "../../stores";

interface Period {
  id: string;
  periodNumber: number;
  time: string;
  subject: string;
  subjectShort: string;
  teacher: string;
  room: string;
  session: "morning" | "afternoon";
  color: string;
}

interface DaySchedule {
  dayOfWeek: number;
  dayLabel: string;
  dayName: string;
  dayNumber: number;
  periods: Period[];
}

// Day names mapping
const DAY_INFO = [
  { dayOfWeek: 1, dayLabel: "T2", dayName: "Thứ Hai" },
  { dayOfWeek: 2, dayLabel: "T3", dayName: "Thứ Ba" },
  { dayOfWeek: 3, dayLabel: "T4", dayName: "Thứ Tư" },
  { dayOfWeek: 4, dayLabel: "T5", dayName: "Thứ Năm" },
  { dayOfWeek: 5, dayLabel: "T6", dayName: "Thứ Sáu" },
  { dayOfWeek: 6, dayLabel: "T7", dayName: "Thứ Bảy" },
  { dayOfWeek: 7, dayLabel: "CN", dayName: "Chủ Nhật" },
];

// Subject colors
const SUBJECT_COLORS: Record<string, string> = {
  "Toán": "bg-blue-100 text-blue-600",
  "Ngữ văn": "bg-purple-100 text-purple-600",
  "Tiếng Anh": "bg-emerald-100 text-emerald-600",
  "Anh": "bg-emerald-100 text-emerald-600",
  "Vật lý": "bg-indigo-100 text-indigo-600",
  "Hóa học": "bg-amber-100 text-amber-600",
  "Lịch sử": "bg-rose-100 text-rose-600",
  "Địa lý": "bg-cyan-100 text-cyan-600",
  "Sinh học": "bg-green-100 text-green-600",
};

// Get subject short name
const getSubjectShort = (subjectName: string): string => {
  const shortNames: Record<string, string> = {
    "Toán học": "Toán",
    "Ngữ văn": "Văn",
    "Tiếng Anh": "Anh",
    "Vật lý": "Lý",
    "Hóa học": "Hóa",
    "Lịch sử": "Sử",
    "Địa lý": "Địa",
    "Sinh học": "Sinh",
    "Giáo dục công dân": "GDCD",
    "Thể dục": "TD",
    "Tin học": "Tin",
  };
  return shortNames[subjectName] || subjectName.substring(0, 3);
};

// Get subject color
const getSubjectColor = (subjectName: string): string => {
  return SUBJECT_COLORS[subjectName] || "bg-gray-100 text-gray-600";
};

// Get day number for current week
const getDayNumber = (dayOfWeek: number): number => {
  const now = new Date();
  const currentDay = now.getDay() || 7; // 0 = Sunday -> 7
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.getDate();
};

export const StudentScheduleScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { studentData, schedule, isLoading, loadSchedule } = useStudentStore();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Monday (T2)

  // Load schedule when student data is available
  useEffect(() => {
    if (user?.id && user?.role === 'student') {
      // First load student data to get classId
      if (!studentData) {
        // We need to load student profile first
        // For now, use a default loading approach
      }
    }
  }, [user?.id]);

  // Load schedule when classId is available
  useEffect(() => {
    if (studentData?.classId) {
      loadSchedule(studentData.classId);
    }
  }, [studentData?.classId]);

  // Group schedule by day of week
  const weekSchedule = useMemo(() => {
    const dayMap = new Map<number, Period[]>();

    schedule.forEach(item => {
      if (!dayMap.has(item.dayOfWeek)) {
        dayMap.set(item.dayOfWeek, []);
      }

      // Determine session based on period (1-5 morning, 6-10 afternoon)
      const session = item.periodId <= 5 ? "morning" : "afternoon";
      const timeRange = getTimeRange(item.periodId);
      const color = getSubjectColor(item.subjectName);

      dayMap.get(item.dayOfWeek)!.push({
        id: item.id,
        periodNumber: item.periodId,
        time: timeRange,
        subject: item.subjectName,
        subjectShort: getSubjectShort(item.subjectName),
        teacher: `GV ${item.subjectName}`, // Would need teacher name from profiles
        room: item.room || "Phòng học",
        session,
        color,
      });
    });

    return DAY_INFO.map(dayInfo => ({
      dayOfWeek: dayInfo.dayOfWeek,
      dayLabel: dayInfo.dayLabel,
      dayName: dayInfo.dayName,
      dayNumber: getDayNumber(dayInfo.dayOfWeek),
      periods: dayMap.get(dayInfo.dayOfWeek) || [],
    }));
  }, [schedule]);

  const selectedSchedule = weekSchedule[selectedDayIndex];
  const morningPeriods = selectedSchedule.periods.filter((p) => p.session === "morning");
  const afternoonPeriods = selectedSchedule.periods.filter((p) => p.session === "afternoon");

  // Get time range for period
  function getTimeRange(periodId: number): string {
    const times: Record<number, string> = {
      1: "07:00 - 07:45",
      2: "07:50 - 08:35",
      3: "08:40 - 09:25",
      4: "09:35 - 10:20",
      5: "10:25 - 11:10",
      6: "13:30 - 14:15",
      7: "14:20 - 15:05",
      8: "15:10 - 15:55",
      9: "16:00 - 16:45",
      10: "16:50 - 17:35",
    };
    return times[periodId] || "--:-- - --:--";
  }

  const renderPeriodCard = (period: Period) => (
    <View
      key={period.id}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-3"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View
              className={`px-2 py-0.5 rounded-full ${
                period.session === "morning"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-sky-100 text-sky-600"
              }`}
            >
              <Text className="text-[8px] font-black uppercase">
                Tiết {period.periodNumber}
              </Text>
            </View>
            <Text className="text-gray-400 text-[9px] font-medium">
              {period.time}
            </Text>
          </View>
          <Text className="text-gray-800 font-bold text-base mb-0.5">
            {period.subject}
          </Text>
          <Text className="text-gray-500 text-xs font-medium">
            {period.room}
          </Text>
        </View>
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${period.color.split(" ")[0]}`}
        >
          <Text
            className={`font-black text-sm ${period.color.split(" ")[1]}`}
          >
            {period.subjectShort}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDaySelector = () => (
    <View className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {weekSchedule.map((day, index) => (
            <TouchableOpacity
              key={day.dayOfWeek}
              onPress={() => setSelectedDayIndex(index)}
              className={`flex-1 py-2 rounded-xl mx-1 w-14 items-center ${
                selectedDayIndex === index ? "bg-[#0284C7]" : ""
              }`}
            >
              <Text
                className={`text-[9px] font-black uppercase ${
                  selectedDayIndex === index ? "text-white" : "text-gray-400"
                }`}
              >
                {day.dayLabel}
              </Text>
              <Text
                className={`text-sm font-bold ${
                  selectedDayIndex === index ? "text-white" : "text-gray-400"
                }`}
              >
                {day.dayNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderSessionHeader = (title: string, colorClass: string) => (
    <View className="flex-row items-center gap-2 mb-3 mt-6">
      <View className={`w-2 h-2 ${colorClass} rounded-full`} />
      <Text className="text-gray-800 font-extrabold text-sm">{title}</Text>
    </View>
  );

  // Loading state
  if (isLoading && schedule.length === 0) {
    return (
      <View className="flex-1 bg-[#F8FAFC] justify-center items-center">
        <ActivityIndicator size="large" color="#0284C7" />
        <Text className="mt-4 text-sm text-gray-500">Đang tải thời khóa biểu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="bg-[#0284C7] pt-16 px-6 pb-4 rounded-b-3xl">
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-white text-xl font-extrabold">
              Thời khóa biểu
            </Text>
            <Text className="text-blue-100 text-xs font-medium mt-0.5">
              {studentData?.className || "Lớp học"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {renderDaySelector()}

        {morningPeriods.length > 0 && (
          <>
            {renderSessionHeader("BUỔI SÁNG", "bg-orange-500")}
            {morningPeriods.map(renderPeriodCard)}
          </>
        )}

        {afternoonPeriods.length > 0 && (
          <>
            {renderSessionHeader("BUỔI CHIỀU", "bg-sky-500")}
            {afternoonPeriods.map(renderPeriodCard)}
          </>
        )}

        {morningPeriods.length === 0 && afternoonPeriods.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-sm">Không có lịch học</Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};
