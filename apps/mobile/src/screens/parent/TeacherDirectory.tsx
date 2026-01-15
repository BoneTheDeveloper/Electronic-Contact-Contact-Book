/**
 * Teacher Directory Screen
 * Contact list of teachers
 */

import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { mockTeachers } from '../../mock-data';
import { colors } from '../../theme';

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
      <TouchableOpacity activeOpacity={0.7}>
        <Card style={styles.teacherCard}>
          <Card.Content style={styles.teacherContent}>
            <Avatar.Text
              size={56}
              label={initials}
              style={{ backgroundColor: '#E0F2FE' }}
              labelStyle={{ color: colors.primary }}
            />
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{item.name}</Text>
              <Text style={styles.subjects}>{item.subjects.join(', ')}</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>Email:</Text>
                  <Text style={styles.contactValue}>{item.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>ĐT:</Text>
                  <Text style={styles.contactValue}>{item.phone}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh bạ giáo viên</Text>
        <Text style={styles.headerSubtitle}>Thông tin liên hệ giáo viên</Text>
      </View>
      <FlatList
        data={mockTeachers}
        renderItem={renderTeacher}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
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
  teacherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  teacherContent: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  teacherInfo: {
    flex: 1,
    marginLeft: 12,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subjects: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginRight: 8,
    width: 45,
  },
  contactValue: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#E5E7EB',
    marginLeft: 68,
  },
});
