/**
 * Attendance Screen
 * Attendance history with month selector and weekly calendar grid
 * Uses real Supabase data via student store
 * Proper StyleSheet styling
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, StyleSheet, type ViewStyle } from 'react-native';
import { useStudentStore } from '../../stores';
import { useAuthStore } from '../../stores';
import { Icon } from '../../components/ui';
import type { StudentHomeStackNavigationProp } from '../../navigation/types';

interface AttendanceScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface WeekAttendanceData {
  weekNumber: number;
  dateRange: string;
  days: Array<{
    dayName: string;
    date: string;
    status: 'present' | 'absent' | 'weekend' | null;
  }>;
  presentCount: number;
  totalCount: number;
}

// Day names in Vietnamese
const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Group attendance records by week
 */
const groupByWeek = (attendance: Array<{ date: string; status: string }>): WeekAttendanceData[] => {
  const weeksMap = new Map<number, WeekAttendanceData>();

  attendance.forEach(record => {
    const date = new Date(record.date);
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Convert to ISO week day (1 = Monday, 7 = Sunday)
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    if (!weeksMap.has(weekNumber)) {
      // Calculate week range
      const weekStart = getWeekStart(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const dateRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

      weeksMap.set(weekNumber, {
        weekNumber,
        dateRange,
        days: Array(7).fill(null).map((_, i) => ({
          dayName: DAY_NAMES[i] || '',
          date: formatDate(new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000)),
          status: i === 6 ? 'weekend' : null, // Sunday is weekend
        })) as Array<{
          dayName: string;
          date: string;
          status: 'present' | 'absent' | 'weekend' | null;
        }>,
        presentCount: 0,
        totalCount: 0,
      });
    }

    const week = weeksMap.get(weekNumber)!;
    const dayIndex = isoDayOfWeek - 1; // Convert to 0-based index

    if (dayIndex >= 0 && dayIndex < 7) {
      const day = week.days[dayIndex];
      if (day) {
        day.status = record.status as 'present' | 'absent' | null;
      }
    }
  });

  // Calculate counts for each week
  weeksMap.forEach(week => {
    const validDays = week.days.filter(d => d.status !== 'weekend');
    week.presentCount = week.days.filter(d => d.status === 'present').length;
    week.totalCount = validDays.length;
  });

  return Array.from(weeksMap.values()).sort((a, b) => b.weekNumber - a.weekNumber);
};

/**
 * Get ISO week number
 */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Get week start date (Monday)
 */
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Format month for filtering (YYYY-MM)
 */
const getMonthFilter = (month: string): string => {
  const currentYear = new Date().getFullYear();
  const monthNum = parseInt(month, 10);
  const year = monthNum >= 10 ? currentYear - 1 : currentYear;
  return `${year}-${String(monthNum).padStart(2, '0')}`;
};

export const StudentAttendanceScreen: React.FC<AttendanceScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { attendance, isLoading, error, loadAttendance } = useStudentStore();

  const [selectedMonth, setSelectedMonth] = useState<'10' | '11' | '12' | '1'>('11');
  const [refreshing, setRefreshing] = useState(false);

  // Load attendance data when student ID or month changes
  const loadData = async () => {
    if (user?.id && user?.role === 'student') {
      const monthFilter = getMonthFilter(selectedMonth);
      await loadAttendance(user.id, monthFilter);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, selectedMonth]);

  const handleReload = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate stats
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;

  // Group attendance by week
  const weeklyData = groupByWeek(attendance);

  const DayCell: React.FC<{ dayName: string; status: 'present' | 'absent' | 'weekend' | null }> = ({ dayName, status }) => {
    if (status === 'weekend') {
      return (
        <View style={styles.dayCell}>
          <Text style={styles.dayCellLabel}>{dayName}</Text>
          <View style={styles.dayCellBoxWeekend} />
        </View>
      );
    }

    if (status === 'present') {
      return (
        <View style={styles.dayCell}>
          <Text style={styles.dayCellLabel}>{dayName}</Text>
          <View style={styles.dayCellBoxPresent}>
            <Text style={styles.dayCellPresent}>✓</Text>
          </View>
        </View>
      );
    }

    if (status === 'absent') {
      return (
        <View style={styles.dayCell}>
          <Text style={styles.dayCellLabel}>{dayName}</Text>
          <View style={styles.dayCellBoxAbsent}>
            <Text style={styles.dayCellAbsent}>✕</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  // Loading state
  if (isLoading && attendance.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Error state
  if (error && attendance.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
        </View>
        <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          onPress={handleReload}
          disabled={refreshing}
          style={[styles.retryButton, refreshing && styles.retryButtonDisabled]}
        >
          <Text style={styles.retryButtonText}>
            {refreshing ? 'Đang tải...' : 'Thử lại'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBg}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Lịch sử điểm danh</Text>
            <Text style={styles.headerSubtitle}>Theo dõi attendance học sinh</Text>
          </View>
          <TouchableOpacity
            onPress={handleReload}
            disabled={refreshing}
            style={[styles.refreshButton, refreshing && styles.refreshButtonDisabled]}
          >
            <Text style={[styles.refreshIcon, refreshing && styles.refreshIconSpinning]}>
              {refreshing ? '⟳' : '↻'}
            </Text>
          </TouchableOpacity>
        </View>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCardPresent}>
            <Text style={styles.statLabelPresent}>Có mặt</Text>
            <Text style={styles.statValuePresent}>{presentCount}</Text>
            <Text style={styles.statUnit}>ngày</Text>
          </View>
          <View style={styles.statCardAbsent}>
            <Text style={styles.statLabelAbsent}>Vắng mặt</Text>
            <Text style={styles.statValueAbsent}>{absentCount}</Text>
            <Text style={styles.statUnit}>ngày</Text>
          </View>
          <View style={styles.statCardExcused}>
            <Text style={styles.statLabelExcused}>Có phép</Text>
            <Text style={styles.statValueExcused}>{excusedCount}</Text>
            <Text style={styles.statUnit}>ngày</Text>
          </View>
        </View>

        {/* Month Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthSelectorScroll}
          contentContainerStyle={styles.monthSelectorContent}
        >
          {(['10', '11', '12', '1'] as const).map((month) => (
            <TouchableOpacity
              key={month}
              onPress={() => setSelectedMonth(month)}
              style={[
                styles.monthTab,
                selectedMonth === month ? styles.monthTabActive : styles.monthTabInactive,
              ] as ViewStyle}
            >
              <Text style={[
                styles.monthTabText,
                selectedMonth === month ? styles.monthTabTextActive : styles.monthTabTextInactive,
              ]}>
                Tháng {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Attendance Calendar */}
        <Text style={styles.sectionTitle}>Chi tiết điểm danh</Text>

        <View style={styles.weekList}>
          {weeklyData.map((week) => {
            const isPerfectAttendance = week.presentCount === week.totalCount;
            return (
              <View key={week.weekNumber} style={styles.weekCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>Tuần 0{week.weekNumber} ({week.dateRange})</Text>
                  <View style={[
                    styles.weekBadge,
                    { backgroundColor: isPerfectAttendance ? '#ECFDF5' : '#FEF2F2' }
                  ]}>
                    <Text style={[
                      styles.weekBadgeText,
                      { color: isPerfectAttendance ? '#059669' : '#DC2626' }
                    ]}>
                      {week.presentCount}/{week.totalCount} ngày
                    </Text>
                  </View>
                </View>
                <View style={styles.weekDaysRow}>
                  {week.days.map((day, index) => (
                    <DayCell key={index} dayName={day.dayName} status={day.status} />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.legendIconPresent}>
              <Text style={styles.legendIconTextPresent}>✓</Text>
            </View>
            <Text style={styles.legendText}>Có mặt</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendIconAbsent}>
              <Text style={styles.legendIconTextAbsent}>✕</Text>
            </View>
            <Text style={styles.legendText}>Vắng</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    backgroundColor: '#0284C7',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(224, 242, 254, 0.9)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  refreshButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  refreshIconSpinning: {
    // Animation would require Animated API
  },
  errorBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#FEE2E2',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCardPresent: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statLabelPresent: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValuePresent: {
    color: '#047857',
    fontSize: 24,
    fontWeight: '800',
  },
  statCardAbsent: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statLabelAbsent: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValueAbsent: {
    color: '#B91C1C',
    fontSize: 24,
    fontWeight: '800',
  },
  statCardExcused: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statLabelExcused: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValueExcused: {
    color: '#B45309',
    fontSize: 24,
    fontWeight: '800',
  },
  statUnit: {
    fontSize: 9,
    fontWeight: '500',
  },
  monthSelectorScroll: {
    marginBottom: 20,
  },
  monthSelectorContent: {
    gap: 8,
  },
  monthTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  monthTabActive: {
    backgroundColor: '#0284C7',
  },
  monthTabInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  monthTabText: {
    fontSize: 12,
    fontWeight: '800',
  },
  monthTabTextActive: {
    color: '#FFFFFF',
  },
  monthTabTextInactive: {
    color: '#9CA3AF',
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  weekList: {
    gap: 12,
  },
  weekCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  weekBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weekBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayCellLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayCellBoxWeekend: {
    width: 28,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  dayCellBoxPresent: {
    width: 28,
    height: 28,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellPresent: {
    color: '#059669',
    fontSize: 14,
  },
  dayCellBoxAbsent: {
    width: 28,
    height: 28,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellAbsent: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIconPresent: {
    width: 16,
    height: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendIconTextPresent: {
    color: '#059669',
    fontSize: 12,
  },
  legendIconAbsent: {
    width: 16,
    height: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendIconTextAbsent: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  legendText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FEF2F2',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    color: '#DC2626',
    fontSize: 30,
  },
  errorTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
