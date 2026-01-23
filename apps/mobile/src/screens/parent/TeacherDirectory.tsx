/**
 * Teacher Directory Screen
 * Contact list of teachers
 */

import React from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
import { mockTeachers } from '../../mock-data';

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  email: string;
  phone: string;
}

export const TeacherDirectoryScreen: React.FC = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    header: {
      backgroundColor: '#0ea5e9',
      paddingTop: 64,
      paddingHorizontal: 24,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#ffffff',
      opacity: 0.8,
      marginTop: 4,
    },
    teacherCard: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    teacherCardRow: {
      flexDirection: 'row',
      paddingVertical: 12,
    },
    avatarContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#bae6fd',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: '#0284c7',
      fontWeight: 'bold',
      fontSize: 16,
    },
    teacherInfo: {
      flex: 1,
      marginLeft: 12,
    },
    teacherName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 4,
    },
    teacherSubjects: {
      fontSize: 14,
      color: '#0284c7',
      fontWeight: '600',
      marginBottom: 8,
    },
    contactInfo: {
      gap: 4,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactLabel: {
      fontSize: 12,
      color: '#9ca3af',
      fontWeight: '500',
      marginRight: 8,
      width: 45,
    },
    contactValue: {
      fontSize: 12,
      color: '#6b7280',
      fontWeight: '500',
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 96,
    },
    separator: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginLeft: 68,
    },
  });
  const renderTeacher = ({ item }: { item: Teacher }) => {
    const initials = item.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.teacherCard}>
        <View style={styles.teacherCardRow}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {initials}
            </Text>
          </View>

          {/* Teacher Info */}
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>
              {item.name}
            </Text>
            <Text style={styles.teacherSubjects}>
              {item.subjects.join(', ')}
            </Text>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>
                  Email:
                </Text>
                <Text style={styles.contactValue}>
                  {item.email}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>
                  ĐT:
                </Text>
                <Text style={styles.contactValue}>
                  {item.phone}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Danh bạ giáo viên
        </Text>
        <Text style={styles.headerSubtitle}>
          Thông tin liên hệ giáo viên
        </Text>
      </View>

      {/* Teacher List */}
      <FlatList
        data={mockTeachers}
        renderItem={renderTeacher}
        keyExtractor={(item: Teacher) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};
