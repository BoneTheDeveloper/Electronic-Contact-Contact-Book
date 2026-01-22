/**
 * Messages Screen
 * Chat and notifications from teachers
 */

import React from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Message {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    teacherName: 'Cô Trần Thị B',
    teacherAvatar: 'TB',
    subject: 'Ngữ văn',
    lastMessage: 'Chào phụ huynh, em B có tiến bộ tốt trong...',
    time: '10:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    teacherName: 'Thầy Nguyễn Văn A',
    teacherAvatar: 'NA',
    subject: 'Toán học',
    lastMessage: 'Về bài tập tối qua, có vài điểm cần lưu ý...',
    time: 'Hôm qua',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    teacherName: 'GVCN 10A',
    teacherAvatar: 'G',
    subject: 'Chủ nhiệm',
    lastMessage: 'Nhắc nhở: Họp phụ huynh ngày 25/01...',
    time: '08/01',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    teacherName: 'Cô Lê Thị C',
    teacherAvatar: 'LC',
    subject: 'Tiếng Anh',
    lastMessage: 'Em B cần luyện thêm phần ngữ pháp nhé...',
    time: '05/01',
    unreadCount: 0,
    isOnline: false,
  },
];

interface MessagesScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => (navigation as any).navigate('ChatDetail', { messageId: item.id })}
      activeOpacity={0.7}
      className={`mb-3 rounded-2xl ${item.unreadCount > 0 ? 'bg-sky-50 border border-sky-600' : 'bg-white'}`}
    >
      <View className="flex-row p-3 py-2">
        <View className="relative mr-3">
          <View
            className="rounded-full justify-center items-center"
            style={{ width: 56, height: 56, backgroundColor: '#E0F2FE' }}
          >
            <Text className="text-base font-bold" style={{ color: colors.primary }}>
              {item.teacherAvatar}
            </Text>
          </View>
          {item.isOnline && (
            <View
              className="absolute bottom-0.5 right-0.5 rounded-full border-2 border-white"
              style={{ width: 14, height: 14, backgroundColor: '#22C55E' }}
            />
          )}
          {item.unreadCount > 0 && (
            <View
              className="absolute -top-1 -right-1 rounded-full justify-center items-center"
              style={{
                width: 20,
                height: 20,
                backgroundColor: colors.error,
                minWidth: 20,
              }}
            >
              <Text className="text-white text-[10px] font-bold">
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-900 text-base font-extrabold">
              {item.teacherName}
            </Text>
            <Text className="text-gray-400 text-xs">
              {item.time}
            </Text>
          </View>
          <Text className="text-xs font-semibold mb-1" style={{ color: colors.primary }}>
            {item.subject}
          </Text>
          <Text className="text-gray-600 text-[13px] leading-[18px]" numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className="bg-primary pt-16 px-6 pb-6"
        style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: colors.primary }}
      >
        <Text className="text-white text-2xl font-extrabold">Tin nhắn</Text>
        {selectedChild && (
          <Text className="text-white/80 text-sm mt-1">
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
