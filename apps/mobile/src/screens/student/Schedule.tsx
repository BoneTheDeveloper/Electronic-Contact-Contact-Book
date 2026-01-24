/**
 * Schedule Screen
 * Class timetable display with week day selector and period cards
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useStudentStore } from "../../stores";

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
  date: string;
  dayLabel: string;
  dayName: string;
  dayNumber: number;
  periods: Period[];
}

const MOCK_SCHEDULE: DaySchedule[] = [
  {
    date: "2026-01-06",
    dayLabel: "T2",
    dayName: "Thứ Hai",
    dayNumber: 6,
    periods: [],
  },
  {
    date: "2026-01-07",
    dayLabel: "T3",
    dayName: "Thứ Ba",
    dayNumber: 7,
    periods: [
      {
        id: "1",
        periodNumber: 1,
        time: "07:00 - 07:45",
        subject: "Toán học",
        subjectShort: "Toán",
        teacher: "Nguyễn Thị Lan",
        room: "Phòng 301",
        session: "morning",
        color: "bg-blue-100 text-blue-600",
      },
      {
        id: "2",
        periodNumber: 2,
        time: "07:50 - 08:35",
        subject: "Ngữ văn",
        subjectShort: "Văn",
        teacher: "Trần Văn Minh",
        room: "Phòng 301",
        session: "morning",
        color: "bg-purple-100 text-purple-600",
      },
      {
        id: "3",
        periodNumber: 3,
        time: "08:40 - 09:25",
        subject: "Tiếng Anh",
        subjectShort: "Anh",
        teacher: "Lê Thu Hương",
        room: "Phòng 201",
        session: "morning",
        color: "bg-emerald-100 text-emerald-600",
      },
      {
        id: "6",
        periodNumber: 6,
        time: "13:30 - 14:15",
        subject: "Vật lý",
        subjectShort: "Lý",
        teacher: "Phạm Quốc Khánh",
        room: "Phòng Lab 1",
        session: "afternoon",
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        id: "7",
        periodNumber: 7,
        time: "14:20 - 15:05",
        subject: "Hóa học",
        subjectShort: "Hóa",
        teacher: "Hoàng Thị Mai",
        room: "Phòng Lab 2",
        session: "afternoon",
        color: "bg-amber-100 text-amber-600",
      },
    ],
  },
  {
    date: "2026-01-08",
    dayLabel: "T4",
    dayName: "Thứ Tư",
    dayNumber: 8,
    periods: [],
  },
  {
    date: "2026-01-09",
    dayLabel: "T5",
    dayName: "Thứ Năm",
    dayNumber: 9,
    periods: [],
  },
  {
    date: "2026-01-10",
    dayLabel: "T6",
    dayName: "Thứ Sáu",
    dayNumber: 10,
    periods: [],
  },
];

export const StudentScheduleScreen: React.FC = () => {
  const { studentData } = useStudentStore();
  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);

  const selectedSchedule = MOCK_SCHEDULE[selectedDayIndex];
  const morningPeriods = selectedSchedule.periods.filter((p) => p.session === "morning");
  const afternoonPeriods = selectedSchedule.periods.filter((p) => p.session === "afternoon");

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
            GV: {period.teacher} • {period.room}
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
          {MOCK_SCHEDULE.map((day, index) => (
            <TouchableOpacity
              key={day.date}
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

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="bg-[#0284C7] pt-16 px-6 pb-4 rounded-b-3xl">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-extrabold">
              Thời khóa biểu
            </Text>
            <Text className="text-blue-100 text-xs font-medium mt-0.5">
              Tuần 02 - Từ 06/01 đến 12/01/2026
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

