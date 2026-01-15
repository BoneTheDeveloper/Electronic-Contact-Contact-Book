/**
 * Messages Screen
 * Chat and notifications from teachers
 */

import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Badge } from 'react-native-paper';
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
    >
      <Card style={[styles.messageCard, item.unreadCount > 0 && styles.unreadCard]}>
        <Card.Content style={styles.messageContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={56}
              label={item.teacherAvatar}
              style={{ backgroundColor: '#E0F2FE' }}
              labelStyle={{ color: colors.primary }}
            />
            {item.isOnline && <View style={styles.onlineIndicator} />}
            {item.unreadCount > 0 && (
              <Badge
                style={styles.unreadBadge}
                size={20}
              >
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Badge>
            )}
          </View>
          <View style={styles.messageInfo}>
            <View style={styles.messageHeader}>
              <Text style={styles.teacherName}>{item.teacherName}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  messageContent: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
  },
  messageInfo: {
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  subject: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
