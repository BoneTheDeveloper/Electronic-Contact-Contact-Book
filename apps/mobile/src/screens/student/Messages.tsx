/**
 * Messages Screen
 * Chat and notifications from teachers for students
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const StudentMessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tin nhắn</Text>
      <Text style={styles.subtitle}>Tính năng đang phát triển</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
});
