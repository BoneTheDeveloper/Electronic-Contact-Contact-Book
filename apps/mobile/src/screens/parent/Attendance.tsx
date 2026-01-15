/**
 * Attendance Screen
 * Attendance history with stats
 */

import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useParentStore } from '../../stores';
import { getAttendanceByStudentId, calculateAttendancePercentage } from '../../mock-data';
import { colors } from '../../theme';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

const STATUS_CONFIG = {
  present: { label: 'Có mặt', color: colors.attendancePresent, bgColor: '#DCFCE7' },
  absent: { label: 'Vắng mặt', color: colors.attendanceAbsent, bgColor: '#FEE2E2' },
  late: { label: 'Đi muộn', color: colors.attendanceLate, bgColor: '#FEF3C7' },
  excused: { label: 'Có phép', color: colors.attendanceExcused, bgColor: '#DBEAFE' },
};

export const AttendanceScreen: React.FC = () => {
  const { children, selectedChildId } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  const attendance = selectedChild ? getAttendanceByStudentId(selectedChild.id) : [];

  const stats = useMemo(() => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    const percentage = calculateAttendancePercentage(attendance);
    const total = attendance.length;
    return { present, absent, late, excused, percentage, total };
  }, [attendance]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử điểm danh</Text>
        {selectedChild && (
          <Text style={styles.headerSubtitle}>
            {selectedChild.name} • Lớp {selectedChild.grade}{selectedChild.section}
          </Text>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Thống kê điểm danh</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.statValue, { color: colors.attendancePresent }]}>
                    {stats.present}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Có mặt</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.statValue, { color: colors.attendanceAbsent }]}>
                    {stats.absent}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Vắng</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.statValue, { color: colors.attendanceLate }]}>
                    {stats.late}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Muộn</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statBadge, { backgroundColor: '#DBEAFE' }]}>
                  <Text style={[styles.statValue, { color: colors.attendanceExcused }]}>
                    {stats.excused}
                  </Text>
                </View>
                <Text style={styles.statLabel}>Có phép</Text>
              </View>
            </View>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageLabel}>Tỷ lệ đi học</Text>
              <Text style={styles.percentageValue}>{stats.percentage}%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Attendance History */}
        <Text style={styles.historyTitle}>Lịch sử chi tiết</Text>
        {attendance.map((record) => {
          const config = STATUS_CONFIG[record.status];
          return (
            <Card key={record.date} style={styles.recordCard}>
              <Card.Content>
                <View style={styles.recordHeader}>
                  <View style={styles.recordDateContainer}>
                    <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                    {record.remarks && (
                      <Text style={styles.recordRemarks}>{record.remarks}</Text>
                    )}
                  </View>
                  <Chip
                    mode="flat"
                    compact
                    style={[styles.statusChip, { backgroundColor: config.bgColor }]}
                    textStyle={[styles.statusChipText, { color: config.color }]}
                  >
                    {config.label}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          );
        })}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '23%',
    alignItems: 'center',
  },
  statBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  percentageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  percentageValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  recordCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDateContainer: {
    flex: 1,
  },
  recordDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  recordRemarks: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
