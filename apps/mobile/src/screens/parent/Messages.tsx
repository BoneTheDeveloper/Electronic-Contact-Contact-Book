/**
 * Messages Screen
 * Chat and notifications from teachers
 */

import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';
import { ScreenHeader } from '../../components/ui';
import type { ParentCommStackNavigationProp } from '../../navigation/types';

interface MessagesScreenProps {
  navigation?: ParentCommStackNavigationProp;
}

interface Message {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject?: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  isOnline: boolean;
  gradientType?: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    teacherName: 'Nguyễn Thị H (GVCN)',
    teacherAvatar: 'NH',
    subject: 'Chủ nhiệm',
    lastMessage: 'Cháu Hoàng B hôm nay đi học rất đầy đủ...',
    time: '5 phút',
    unreadCount: 2,
    isOnline: true,
    gradientType: 'blue',
  },
  {
    id: '2',
    teacherName: 'Trần Văn H (Toán)',
    teacherAvatar: 'TH',
    subject: 'Toán học',
    lastMessage: 'Điểm kiểm tra hôm nay cháu đã tiến bộ khá...',
    time: '1 giờ',
    unreadCount: 0,
    isOnline: true,
    gradientType: 'purple',
  },
  {
    id: '3',
    teacherName: 'Lê Thị P (Anh)',
    teacherAvatar: 'LP',
    subject: 'Tiếng Anh',
    lastMessage: 'Nhớ nhắc cháu review từ vựng trước khi đến lớp...',
    time: 'Hôm qua',
    unreadCount: 5,
    isOnline: false,
    gradientType: 'pink',
  },
  {
    id: '4',
    teacherName: 'Phạm Minh K (Lý)',
    teacherAvatar: 'PM',
    subject: 'Vật lý',
    lastMessage: 'Sắp đến bài kiểm tra giữa kỳ, cần ôn bài kỹ nhé...',
    time: '2 ngày',
    unreadCount: 0,
    isOnline: false,
    gradientType: 'green',
  },
  {
    id: '5',
    teacherName: 'Trần Hùng M (Sử)',
    teacherAvatar: 'TH',
    subject: 'Lịch sử',
    lastMessage: 'Bài thuyết trình của nhóm cháu làm rất tốt,继续保持...',
    time: '1 tuần',
    unreadCount: 0,
    isOnline: false,
    gradientType: 'amber',
  },
  {
    id: '6',
    teacherName: 'Nguyễn Thu T (GVCN 8A)',
    teacherAvatar: 'NT',
    subject: 'Chủ nhiệm cũ',
    lastMessage: 'Chúc cháu năm học mới học thật tốt nhé!',
    time: '2 tuần',
    unreadCount: 0,
    isOnline: false,
    gradientType: 'cyan',
  },
];

const ONLINE_TEACHERS: Message[] = [
  {
    id: 'online-1',
    teacherName: 'Nguyễn T.H',
    teacherAvatar: 'GV',
    isOnline: true,
    gradientType: 'blue',
  },
  {
    id: 'online-2',
    teacherName: 'Trần V.H',
    teacherAvatar: 'TH',
    isOnline: true,
    gradientType: 'purple',
  },
  {
    id: 'online-3',
    teacherName: 'Lê T.P',
    teacherAvatar: 'LP',
    isOnline: true,
    gradientType: 'pink',
  },
  {
    id: 'online-4',
    teacherName: 'Phạm V.K',
    teacherAvatar: 'PM',
    isOnline: true,
    gradientType: 'green',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerChildInfo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  // Search bar styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },

  // Online teachers section
  onlineSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  onlineTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  onlineScrollContainer: {
    flexDirection: 'row',
    gap: 16,
    overflow: 'scroll',
    paddingHorizontal: 4,
  },
  onlineAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineTeacherName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 6,
  },

  // Chat styles
  messageContainer: {
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageContent: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#22C55E',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  readCheckmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 18,
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
    marginBottom: 2,
  },
  teacherName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  messageTime: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  messageSubtitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
});

const getGradientColors = (type: string) => {
  const gradients = {
    blue: ['#60A5FA', '#3B82F6'],
    purple: ['#C084FC', '#A855F7'],
    pink: ['#F472B6', '#EC4899'],
    green: ['#4ADE80', '#22C55E'],
    amber: ['#FCD34D', '#F59E0B'],
    cyan: ['#5EEAD4', '#2DD4BF'],
  };
  return gradients[type as keyof typeof gradients] || gradients.blue;
};

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const renderOnlineTeacher = ({ item }: { item: Message }) => (
    <View style={{ flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatar,
          {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'transparent'
          }
        ]}>
          <View style={{
            width: '100%',
            height: '100%',
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: '100%',
              height: '100%',
              borderRadius: 28,
              backgroundColor: getGradientColors(item.gradientType!)[0],
            }}>
            <View style={{
              width: '100%',
              height: '100%',
              borderRadius: 28,
              backgroundColor: getGradientColors(item.gradientType!)[1],
              opacity: 0.8,
            }}>
              <Text style={styles.avatarText}>
                {item.teacherAvatar}
              </Text>
              </View>
              </View>
          </View>
        </View>
        {item.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      <Text style={styles.onlineTeacherName}>
        {item.teacherName}
      </Text>
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate('ChatDetail' as keyof ParentCommStackParamList, { chatId: item.id })}
      activeOpacity={0.7}
      style={styles.messageContainer}
    >
      <View style={styles.messageContent}>
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            {
              backgroundColor: 'transparent'
            }
          ]}>
            <View style={{
              width: '100%',
              height: '100%',
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: '100%',
                height: '100%',
                borderRadius: 24,
                backgroundColor: getGradientColors(item.gradientType!)[0],
              }}>
              <View style={{
                width: '100%',
                height: '100%',
                borderRadius: 24,
                backgroundColor: getGradientColors(item.gradientType!)[1],
                opacity: 0.8,
              }}>
                <Text style={styles.avatarText}>
                  {item.teacherAvatar}
                </Text>
                </View>
                </View>
            </View>
          </View>
          {item.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
          {item.unreadCount > 0 && (
            <View style={[
              styles.unreadBadge,
              {
                backgroundColor: item.unreadCount > 0 ? '#0284C7' : '#EF4444'
              }
            ]}>
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
          <View style={styles.messageSubtitle}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.primary,
              marginBottom: 2,
            }}>
              {item.subject}
            </Text>
          </View>
          <Text style={styles.lastMessage}>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm cuộc trò chuyện..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Online Teachers Section */}
      <View style={styles.onlineSection}>
        <Text style={styles.onlineTitle}>Đang hoạt động</Text>
        <FlatList
          data={ONLINE_TEACHERS}
          renderItem={renderOnlineTeacher}
          keyExtractor={(item: Message) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.onlineScrollContainer}
        />
      </View>

      {/* Chat List */}
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
