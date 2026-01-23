/**
 * Messages Screen
 * Chat and notifications from teachers
 */

import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/ui';
import type { ParentCommStackNavigationProp } from '../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface MessagesScreenProps {
  navigation: ParentCommStackNavigationProp;
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerChildInfo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  messageContainer: {
    marginBottom: 12,
    borderRadius: 12,
  },
  messageUnread: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  messageRead: {
    backgroundColor: 'white',
  },
  messageContent: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    backgroundColor: '#E0F2FE',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#22C55E',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: colors.error,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teacherName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  messageTime: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  subject: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.primary,
  },
  lastMessage: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
});

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => (navigation as any).navigate('ChatDetail', { messageId: item.id })}
      activeOpacity={0.7}
      style={[
        styles.messageContainer,
        item.unreadCount > 0 ? styles.messageUnread : styles.messageRead,
      ]}
    >
      <View style={styles.messageContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.teacherAvatar}
            </Text>
          </View>
          {item.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.messageTextContainer}>
          <View style={styles.messageHeader}>
            <Text style={styles.teacherName}>
              {item.teacherName}
            </Text>
            <Text style={styles.messageTime}>
              {item.time}
            </Text>
          </View>
          <Text style={styles.subject}>
            {item.subject}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Tin nhắn"
        showBackButton={false}
        rightComponent={selectedChild ? (
          <Text style={styles.headerChildInfo}>
            {selectedChild.grade}{selectedChild.section}
          </Text>
        ) : undefined}
      />
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item: Message) => item.id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
