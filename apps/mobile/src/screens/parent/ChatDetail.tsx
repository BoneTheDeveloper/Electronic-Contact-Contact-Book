/**
 * Chat Detail Screen
 * Individual conversation view
 * Placeholder component for navigation
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../components/ui';
import type { ParentCommStackNavigationProp } from '../../navigation/types';

interface ChatDetailProps {
  navigation?: ParentCommStackNavigationProp;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export const ChatDetailScreen: React.FC<ChatDetailProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Tin nhắn"
        onBack={() => navigation?.goBack()}
      />
      <Text style={styles.placeholderText}>Chat Detail - Placeholder</Text>
    </View>
  );
};
