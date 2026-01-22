/**
 * Teacher Directory Screen
 * Contact list of teachers
 */

import React from 'react';
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { mockTeachers } from '../../mock-data';

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  email: string;
  phone: string;
}

export const TeacherDirectoryScreen: React.FC = () => {
  const renderTeacher = ({ item }: { item: Teacher }) => {
    const initials = item.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <TouchableOpacity activeOpacity={0.7} className="bg-white rounded-xl shadow-sm">
        <View className="flex-row py-3">
          {/* Avatar */}
          <View className="w-14 h-14 rounded-full bg-sky-100 items-center justify-center">
            <View className="text-sky-600 font-bold text-base">
              {initials}
            </View>
          </View>

          {/* Teacher Info */}
          <View className="flex-1 ml-3">
            <View className="text-base font-bold text-gray-800 mb-1">
              {item.name}
            </View>
            <View className="text-sm text-sky-600 font-semibold mb-2">
              {item.subjects.join(', ')}
            </View>

            {/* Contact Info */}
            <View className="gap-1">
              <View className="flex-row items-center">
                <View className="text-xs text-gray-400 font-medium mr-2 w-[45px]">
                  Email:
                </View>
                <View className="text-xs text-gray-500 font-medium">
                  {item.email}
                </View>
              </View>
              <View className="flex-row items-center">
                <View className="text-xs text-gray-400 font-medium mr-2 w-[45px]">
                  ĐT:
                </View>
                <View className="text-xs text-gray-500 font-medium">
                  {item.phone}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-2xl">
        <View className="text-2xl font-bold text-white">
          Danh bạ giáo viên
        </View>
        <View className="text-sm text-white/80 mt-1">
          Thông tin liên hệ giáo viên
        </View>
      </View>

      {/* Teacher List */}
      <FlatList
        data={mockTeachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 ml-[68px]" />}
      />
    </View>
  );
};
