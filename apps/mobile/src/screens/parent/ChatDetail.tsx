/**
 * Chat Detail Screen
 * Individual conversation view with mock messages
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ScreenHeader, Icon } from '../../components/ui';
import type { ParentCommStackParamList } from '../../navigation/types';

interface ChatDetailProps {
  navigation?: any;
  route?: RouteProp<ParentCommStackParamList, 'ChatDetail'>;
}

interface ChatMessage {
  id: string;
  text: string;
  isSent: boolean;
  time: string;
}

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

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(p => p.length > 0);
  if (parts.length === 0) return 'GV';
  if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
  const first = (parts[0] || '').charAt(0);
  const last = (parts[parts.length - 1] || '').charAt(0);
  return `${first}${last}`.toUpperCase();
};

// Mock messages data
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Chào thầy/cô, em là phụ huynh của em Hoàng B 9A.',
    isSent: true,
    time: '08:30',
  },
  {
    id: '2',
    text: 'Chào phụ huynh, thầy có điều muốn trao đổi về việc học của cháu.',
    isSent: false,
    time: '08:35',
  },
  {
    id: '3',
    text: 'Cháu Hoàng B hôm nay đi học rất đầy đủ, tập trung tốt.',
    isSent: false,
    time: '08:36',
  },
  {
    id: '4',
    text: 'Dạ, cảm ơn thầy đã thông báo. Em sẽ nhắc cháu tiếp tục cố gắng.',
    isSent: true,
    time: '08:40',
  },
  {
    id: '5',
    text: 'Tuần sau có bài kiểm tra giữa kỳ, phụ huynh nhắc cháu ôn bài kỹ nhé.',
    isSent: false,
    time: '08:42',
  },
];

export const ChatDetailScreen: React.FC<ChatDetailProps> = ({ navigation, route }) => {
  const { chatId, teacherName } = route?.params || {};
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [gradientType] = useState('blue');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isSent: true,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = (message: ChatMessage) => {
    if (message.isSent) {
      return (
        <View key={message.id} style={styles.sentMessageContainer}>
          <View style={styles.sentMessage}>
            <Text style={styles.sentMessageText}>{message.text}</Text>
            <Text style={styles.sentMessageTime}>{message.time}</Text>
          </View>
        </View>
      );
    }
    return (
      <View key={message.id} style={styles.receivedMessageContainer}>
        <View style={styles.receivedMessage}>
          <Text style={styles.receivedMessageText}>{message.text}</Text>
          <Text style={styles.receivedMessageTime}>{message.time}</Text>
        </View>
      </View>
    );
  };

  const displayName = teacherName || 'Giáo viên';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: getGradientColors(gradientType)[0] },
              ]}
            >
              <View
                style={[
                  styles.avatarInner,
                  { backgroundColor: getGradientColors(gradientType)[1] },
                ]}
              >
                <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
              </View>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerName}>{displayName}</Text>
              <Text style={styles.headerStatus}>Đang hoạt động</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="phone-alt" size={20} color="#0284C7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        <Text style={styles.dateSeparator}>Hôm nay</Text>
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="paperclip" size={20} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={18} color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerStatus: {
    fontSize: 11,
    fontWeight: '500',
    color: '#10B981',
    marginTop: 1,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  dateSeparator: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  sentMessage: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  sentMessageText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sentMessageTime: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  receivedMessageText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
    marginBottom: 2,
  },
  receivedMessageTime: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 36,
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
    maxHeight: 80,
  },
  sendButtonActive: {
    backgroundColor: '#0284C7',
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
