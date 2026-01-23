/**
 * Schedule Screen
 * Class timetable display
 */

import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';

interface ScheduleDay {
  date: string;
  dayName: string;
  periods: Period[];
}

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

const MOCK_SCHEDULE: ScheduleDay[] = [
  {
    date: '2026-01-13',
    dayName: 'Thứ Hai',
    periods: [
      { time: '07:00 - 07:45', subject: 'Toán', teacher: 'Thầy Nguyễn Văn A', room: 'Phòng 101' },
      { time: '07:50 - 08:35', subject: 'Văn', teacher: 'Cô Trần Thị B', room: 'Phòng 101' },
      { time: '08:40 - 09:25', subject: 'Anh', teacher: 'Cô Lê Thị C', room: 'Phòng Lab 1' },
      { time: '09:40 - 10:25', subject: 'Lý', teacher: 'Thầy Phạm Văn D', room: 'Phòng Lab 2' },
      { time: '10:30 - 11:15', subject: 'Hóa', teacher: 'Cô Hoàng Thị E', room: 'Phòng Lab 2' },
    ],
  },
  {
    date: '2026-01-14',
    dayName: 'Thứ Ba',
    periods: [
      { time: '07:00 - 07:45', subject: 'Sinh', teacher: 'Cô Ngô Thị F', room: 'Phòng Lab 3' },
      { time: '07:50 - 08:35', subject: 'Sử', teacher: 'Thầy Đỗ Văn G', room: 'Phòng 102' },
      { time: '08:40 - 09:25', subject: 'Địa', teacher: 'Cô Vũ Thị H', room: 'Phòng 102' },
      { time: '09:40 - 10:25', subject: 'GDCD', teacher: 'Thầy Lê Văn I', room: 'Phòng 103' },
      { time: '10:30 - 11:15', subject: 'TD', teacher: 'Cô Nguyễn Thị K', room: 'Sân trường' },
    ],
  },
];

export const ScheduleScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const renderPeriod = (period: Period, index: number) => (
    <View key={index} className="flex-row items-start gap-3">
      <View className="w-25">
        <Text className="text-xs text-gray-500 font-medium">{period.time}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-gray-800">{period.subject}</Text>
        <Text className="text-xs text-gray-500">{period.teacher}</Text>
        <View className="self-start bg-sky-100 px-2 py-0.5 rounded-full h-6">
          <Text className="text-[10px] text-sky-600 font-semibold">{period.room}</Text>
        </View>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <View className="mb-4 bg-white rounded-2xl shadow-sm">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-800">{item.dayName}</Text>
          <Text className="text-xs text-gray-500">{item.date}</Text>
        </View>
        <View className="gap-3">
          {item.periods.map((period, index) => renderPeriod(period, index))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-blue-600 pt-15 px-6 pb-6 rounded-b-2xl">
        <Text className="text-2xl font-bold text-white">Thời khóa biểu</Text>
        {selectedChild && (
          <Text className="text-sm text-white/80 mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item: ScheduleDay) => item.date}
        contentContainerClassName="p-4 pb-25"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
