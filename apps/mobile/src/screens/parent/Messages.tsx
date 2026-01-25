/**
 * Messages Screen
 * Chat list with online teachers section
 * Wireframe: messages.html
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { mockTeachers } from '../../mock-data';
import { Icon } from '../../components/ui';
import { ScreenHeader } from '../../components/ui';
import type { ParentCommStackNavigationProp } from '../../navigation/types';

interface MessagesScreenProps {
  navigation?: ParentCommStackNavigationProp;
}

interface Message {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  isOnline: boolean;
  isRead?: boolean;
  gradientType: string;
}

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return 'GV';
  if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
  const first = (parts[0] || '').charAt(0);
  const last = (parts[parts.length - 1] || '').charAt(0);
  return `${first}${last}`.toUpperCase();
};

const getGradientColors = (type: string) => {
  const colors = {
    blue: ['#60A5FA', '#3B82F6'],
    purple: ['#C084FC', '#A855F7'],
    pink: ['#F472B6', '#EC4899'],
    green: ['#4ADE80', '#22C55E'],
    amber: ['#FCD34D', '#F59E0B'],
    cyan: ['#5EEAD4', '#2DD4BF'],
  };
  return colors[type as keyof typeof colors] || colors.blue;
};

// Mock recent chat data
const RECENT_CHATS_DATA: Omit<Message, 'teacherId' | 'teacherName' | 'teacherAvatar' | 'gradientType' | 'isOnline'>[] = [
  {
    id: '1',
    lastMessage: 'Cháu Hoàng B hôm nay đi học rất đầy đủ...',
    time: '5 phút',
    unreadCount: 2,
    isRead: false,
  },
  {
    id: '2',
    lastMessage: 'Điểm kiểm tra hôm nay cháu đã tiến bộ khá...',
    time: '1 giờ',
    unreadCount: 0,
    isRead: true,
  },
  {
    id: '3',
    lastMessage: 'Nhớ nhắc cháu review từ vựng trước khi đến lớp...',
    time: 'Hôm qua',
    unreadCount: 5,
    isRead: false,
  },
  {
    id: '4',
    lastMessage: 'Sắp đến bài kiểm tra giữa kỳ, cần ôn bài kỹ nhé...',
    time: '2 ngày',
    unreadCount: 0,
    isRead: false,
  },
  {
    id: '5',
    lastMessage: 'Bài thuyết trình của nhóm cháu làm rất tốt!',
    time: '1 tuần',
    unreadCount: 0,
    isRead: false,
  },
  {
    id: '6',
    lastMessage: 'Chúc cháu năm học mới học thật tốt nhé!',
    time: '2 tuần',
    unreadCount: 0,
    isRead: false,
  },
];

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine mockTeachers with chat data
  const { onlineTeachers, recentChats } = useMemo(() => {
    const online = mockTeachers.filter(t => t.status === 'online');
    const chats = mockTeachers.map((teacher, index) => {
      const chatData = RECENT_CHATS_DATA[index % RECENT_CHATS_DATA.length];
      return {
        ...chatData,
        id: teacher.id,
        teacherId: teacher.id,
        teacherName: teacher.name,
        teacherAvatar: getInitials(teacher.name),
        gradientType: teacher.avatarColor || 'blue',
        isOnline: teacher.status === 'online',
      } as Message;
    });
    return { onlineTeachers: online, recentChats: chats };
  }, []);

  const renderOnlineTeacher = (teacher: typeof mockTeachers[0]) => (
    <View style={styles.onlineTeacherContainer}>
      <View style={styles.onlineAvatarContainer}>
        <View
          style={[
            styles.onlineAvatar,
            {
              backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[0],
            },
          ]}
        >
          <View
            style={[
              styles.onlineAvatarInner,
              {
                backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[1],
              },
            ]}
          >
            <Text style={styles.onlineAvatarText}>{getInitials(teacher.name)}</Text>
          </View>
        </View>
        <View style={styles.onlineIndicator} />
      </View>
      <Text style={styles.onlineTeacherName}>{teacher.name}</Text>
    </View>
  );

  const renderChat = (item: Message) => (
    <TouchableOpacity
      key={item.id}
      style={styles.chatCard}
      onPress={() => navigation?.navigate('ChatDetail', { chatId: item.teacherId, teacherName: item.teacherName })}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.chatAvatar,
            {
              backgroundColor: getGradientColors(item.gradientType)[0],
            },
          ]}
        >
          <View
            style={[
              styles.chatAvatarInner,
              {
                backgroundColor: getGradientColors(item.gradientType)[1],
              },
            ]}
          >
            <Text style={styles.chatAvatarText}>{item.teacherAvatar}</Text>
          </View>
        </View>
        {item.isOnline && <View style={styles.chatOnlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.teacherName}>{item.teacherName}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{item.time}</Text>
            {item.isRead && (
              <Icon name="check-double" size={12} color="#9CA3AF" />
            )}
          </View>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount && item.unreadCount > 0 && (
            <View
              style={[
                styles.unreadBadge,
                item.unreadCount > 9 ? styles.unreadBadgeLarge : null,
              ]}
            >
              <Text style={styles.unreadBadgeText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ScreenHeader title="Tin nhắn" showBackButton={false} />

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Online Teachers Section */}
      <View style={styles.onlineSection}>
        <Text style={styles.onlineTitle}>Đang hoạt động</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.onlineScroll}
        >
          {onlineTeachers.map((teacher) => (
            <View key={teacher.id}>{renderOnlineTeacher(teacher)}</View>
          ))}
        </ScrollView>
      </View>

      {/* Recent Chats */}
      <ScrollView
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
      >
        {recentChats.map((chat) => renderChat(chat))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  onlineSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  onlineTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  onlineScroll: {
    flexDirection: 'row',
    gap: 16,
  },
  onlineTeacherContainer: {
    alignItems: 'center',
  },
  onlineAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  onlineAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineAvatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineTeacherName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4B5563',
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 96,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatAvatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeLarge: {
    minWidth: 22,
  },
  unreadBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
