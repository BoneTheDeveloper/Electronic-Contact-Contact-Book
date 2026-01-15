/**
 * Schedule Screen
 * Class timetable display
 */

import React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import { colors } from '../../theme';

interface ScheduleDay {
  date: string;
  dayName: string;
  periods: Period[];
}

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

const MOCK_SCHEDULE: ScheduleDay[] = [
  {
    date: '2026-01-13',
    dayName: 'Thứ Hai',
    periods: [
      { time: '07:00 - 07:45', subject: 'Toán', teacher: 'Thầy Nguyễn Văn A', room: 'Phòng 101' },
      { time: '07:50 - 08:35', subject: 'Văn', teacher: 'Cô Trần Thị B', room: 'Phòng 101' },
      { time: '08:40 - 09:25', subject: 'Anh', teacher: 'Cô Lê Thị C', room: 'Phòng Lab 1' },
      { time: '09:40 - 10:25', subject: 'Lý', teacher: 'Thầy Phạm Văn D', room: 'Phòng Lab 2' },
      { time: '10:30 - 11:15', subject: 'Hóa', teacher: 'Cô Hoàng Thị E', room: 'Phòng Lab 2' },
    ],
  },
  {
    date: '2026-01-14',
    dayName: 'Thứ Ba',
    periods: [
      { time: '07:00 - 07:45', subject: 'Sinh', teacher: 'Cô Ngô Thị F', room: 'Phòng Lab 3' },
      { time: '07:50 - 08:35', subject: 'Sử', teacher: 'Thầy Đỗ Văn G', room: 'Phòng 102' },
      { time: '08:40 - 09:25', subject: 'Địa', teacher: 'Cô Vũ Thị H', room: 'Phòng 102' },
      { time: '09:40 - 10:25', subject: 'GDCD', teacher: 'Thầy Lê Văn I', room: 'Phòng 103' },
      { time: '10:30 - 11:15', subject: 'TD', teacher: 'Cô Nguyễn Thị K', room: 'Sân trường' },
    ],
  },
];

export const ScheduleScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const renderPeriod = (period: Period, index: number) => (
    <View key={index} style={styles.periodRow}>
      <View style={styles.periodTime}>
        <Text style={styles.periodTimeText}>{period.time}</Text>
      </View>
      <View style={styles.periodInfo}>
        <Text style={styles.periodSubject}>{period.subject}</Text>
        <Text style={styles.periodTeacher}>{period.teacher}</Text>
        <Chip mode="flat" compact style={styles.roomChip} textStyle={styles.roomChipText}>
          {period.room}
        </Chip>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <Card style={styles.dayCard}>
      <Card.Content>
        <View style={styles.dayHeader}>
          <Text style={styles.dayName}>{item.dayName}</Text>
          <Text style={styles.dayDate}>{item.date}</Text>
        </View>
        <View style={styles.periodsContainer}>
          {item.periods.map((period, index) => renderPeriod(period, index))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item) => item.date}
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
  dayCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  dayDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  periodsContainer: {
    gap: 12,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  periodTime: {
    width: 100,
  },
  periodTimeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodInfo: {
    flex: 1,
    gap: 4,
  },
  periodSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  periodTeacher: {
    fontSize: 12,
    color: '#6B7280',
  },
  roomChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    height: 24,
  },
  roomChipText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
});
