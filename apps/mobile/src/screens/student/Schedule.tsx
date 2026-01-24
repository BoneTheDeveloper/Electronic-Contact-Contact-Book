/**
 * Schedule Screen
 * Class timetable display with week day selector and period cards
 * Matches wireframe design with back button and bottom nav
 */

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useStudentStore } from "../../stores";
import { useAuthStore } from "../../stores";
import { Icon } from "../../components/ui";
import { WeekDaySelector } from "../../components/ui";
import type { StudentHomeStackNavigationProp } from "../../navigation/types";

interface ScheduleScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface Period {
  id: string;
  periodNumber: number;
  time: string;
  subject: string;
  subjectShort: string;
  teacher: string;
  room: string;
  session: "morning" | "afternoon";
  color: { bg: string; text: string };
}

interface DaySchedule {
  dayOfWeek: number;
  dayLabel: string;
  dayName: string;
  dayNumber: number;
  periods: Period[];
}

// Subject colors
const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  "Toán": { bg: '#EFF6FF', text: '#1D4ED8' },
  "Toán học": { bg: '#EFF6FF', text: '#1D4ED8' },
  "Ngữ văn": { bg: '#FAF5FF', text: '#9333EA' },
  "Văn": { bg: '#FAF5FF', text: '#9333EA' },
  "Tiếng Anh": { bg: '#ECFDF5', text: '#059669' },
  "Anh": { bg: '#ECFDF5', text: '#059669' },
  "Vật lý": { bg: '#EEF2FF', text: '#4F46E5' },
  "Lý": { bg: '#EEF2FF', text: '#4F46E5' },
  "Hóa học": { bg: '#FEF3C7', text: '#D97706' },
  "Hóa": { bg: '#FEF3C7', text: '#D97706' },
  "Lịch sử": { bg: '#FEF2F2', text: '#DC2626' },
  "Sử": { bg: '#FEF2F2', text: '#DC2626' },
  "Địa lý": { bg: '#ECFEFF', text: '#0891B2' },
  "Địa": { bg: '#ECFEFF', text: '#0891B2' },
  "Sinh học": { bg: '#F0FDF4', text: '#16A34A' },
  "Sinh": { bg: '#F0FDF4', text: '#16A34A' },
};

// Day names mapping (only 5 days for wireframe)
const DAY_INFO = [
  { dayOfWeek: 1, dayLabel: "T2", dayName: "Thứ Hai" },
  { dayOfWeek: 2, dayLabel: "T3", dayName: "Thứ Ba" },
  { dayOfWeek: 3, dayLabel: "T4", dayName: "Thứ Tư" },
  { dayOfWeek: 4, dayLabel: "T5", dayName: "Thứ Năm" },
  { dayOfWeek: 5, dayLabel: "T6", dayName: "Thứ Sáu" },
];

const getSubjectShort = (subjectName: string): string => {
  const shortNames: Record<string, string> = {
    "Toán học": "Toán",
    "Ngữ văn": "Văn",
    "Tiếng Anh": "Anh",
    "Vật lý": "Lý",
    "Hóa học": "Hóa",
    "Lịch sử": "Sử",
    "Địa lý": "Địa",
    "Sinh học": "Sinh",
    "Giáo dục công dân": "GDCD",
    "Thể dục": "TD",
    "Tin học": "Tin",
  };
  return shortNames[subjectName] || subjectName.substring(0, 3);
};

const getSubjectColor = (subjectName: string): { bg: string; text: string } => {
  return SUBJECT_COLORS[subjectName] || { bg: '#F3F4F6', text: '#6B7280' };
};

const getDayNumber = (dayOfWeek: number): number => {
  const now = new Date();
  const currentDay = now.getDay() || 7;
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.getDate();
};

const getWeekRange = (): string => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  return `Từ ${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} đến ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}/${endOfWeek.getFullYear()}`;
};

export const StudentScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { studentData, schedule, isLoading, loadSchedule } = useStudentStore();

  const [selectedDay, setSelectedDay] = useState(1); // 1-5 (T2-T6)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'home' | 'messages' | 'profile'>('home');

  useEffect(() => {
    if (studentData?.classId) {
      loadSchedule(studentData.classId);
    }
  }, [studentData?.classId]);

  const weekSchedule = useMemo(() => {
    const dayMap = new Map<number, Period[]>();

    schedule.forEach(item => {
      if (!dayMap.has(item.dayOfWeek)) {
        dayMap.set(item.dayOfWeek, []);
      }

      const session = item.periodId <= 5 ? "morning" : "afternoon";
      const timeRange = getTimeRange(item.periodId);
      const color = getSubjectColor(item.subjectName);

      dayMap.get(item.dayOfWeek)!.push({
        id: item.id,
        periodNumber: item.periodId,
        time: timeRange,
        subject: item.subjectName,
        subjectShort: getSubjectShort(item.subjectName),
        teacher: `GV ${item.subjectName}`,
        room: item.room || "Phòng học",
        session,
        color,
      });
    });

    return DAY_INFO.map(dayInfo => ({
      dayOfWeek: dayInfo.dayOfWeek,
      dayLabel: dayInfo.dayLabel,
      dayName: dayInfo.dayName,
      dayNumber: getDayNumber(dayInfo.dayOfWeek),
      periods: dayMap.get(dayInfo.dayOfWeek) || [],
    }));
  }, [schedule]);

  const selectedSchedule = weekSchedule.find(d => d.dayOfWeek === selectedDay) || weekSchedule[0]!;
  const morningPeriods = selectedSchedule.periods.filter((p) => p.session === "morning");
  const afternoonPeriods = selectedSchedule.periods.filter((p) => p.session === "afternoon");

  function getTimeRange(periodId: number): string {
    const times: Record<number, string> = {
      1: "07:00 - 07:45",
      2: "07:50 - 08:35",
      3: "08:40 - 09:25",
      4: "09:35 - 10:20",
      5: "10:25 - 11:10",
      6: "13:30 - 14:15",
      7: "14:20 - 15:05",
      8: "15:10 - 15:55",
      9: "16:00 - 16:45",
      10: "16:50 - 17:35",
    };
    return times[periodId] || "--:-- - --:--";
  }

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    const index = DAY_INFO.findIndex(d => d.dayOfWeek === day);
    setSelectedDayIndex(index >= 0 ? index : 0);
  };

  if (isLoading && schedule.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>Đang tải thời khóa biểu...</Text>
        </View>
      </View>
    );
  }

  const weekStart = new Date();
  const dayOfWeek = weekStart.getDay();
  const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  weekStart.setDate(diff);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Thời khóa biểu</Text>
            <Text style={styles.headerSubtitle}>{getWeekRange()}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Day Selector - Using shared component */}
        <View style={styles.daySelectorContainer}>
          <WeekDaySelector
            selectedDay={selectedDay}
            weekStart={weekStart}
            onChange={handleDayChange}
          />
        </View>

        {/* Morning Section */}
        {morningPeriods.length > 0 && (
          <>
            <View style={styles.sessionHeader}>
              <View style={[styles.sessionDot, { backgroundColor: '#F97316' }]} />
              <Text style={styles.sessionTitle}>BUỔI SÁNG</Text>
            </View>
            {morningPeriods.map(renderPeriodCard)}
          </>
        )}

        {/* Afternoon Section */}
        {afternoonPeriods.length > 0 && (
          <>
            <View style={styles.sessionHeader}>
              <View style={[styles.sessionDot, { backgroundColor: '#0EA5E9' }]} />
              <Text style={styles.sessionTitle}>BUỔI CHIỀU</Text>
            </View>
            {afternoonPeriods.map(renderPeriodCard)}
          </>
        )}

        {morningPeriods.length === 0 && afternoonPeriods.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Không có lịch học</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Icon name="home" size={24} color={activeTab === 'home' ? '#0284C7' : '#D1D5DB'} />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Trang chủ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.messageIconContainer}>
            <Icon name="message" size={24} color="#D1D5DB" />
            <View style={styles.messageBadge} />
          </View>
          <Text style={styles.navLabel}>Tin nhắn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Icon name="account" size={24} color={activeTab === 'profile' ? '#0284C7' : '#D1D5DB'} />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderPeriodCard(period: Period) {
    return (
      <View key={period.id} style={styles.periodCard}>
        <View style={styles.periodCardHeader}>
          <View style={styles.periodInfo}>
            <View style={styles.periodBadges}>
              <View style={[
                styles.periodBadge,
                { backgroundColor: period.session === "morning" ? '#FFF7ED' : '#E0F2FE' }
              ]}>
                <Text style={[
                  styles.periodBadgeText,
                  { color: period.session === "morning" ? '#F97316' : '#0EA5E9' }
                ]}>
                  Tiết {period.periodNumber}
                </Text>
              </View>
              <Text style={styles.periodTime}>{period.time}</Text>
            </View>
            <Text style={styles.subjectName}>{period.subject}</Text>
            <Text style={styles.periodDetails}>{period.teacher} • {period.room}</Text>
          </View>
          <View style={[styles.subjectIcon, { backgroundColor: period.color.bg }]}>
            <Text style={[styles.subjectIconText, { color: period.color.text }]}>
              {period.subjectShort}
            </Text>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#0284C7',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(224, 242, 254, 0.9)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },
  daySelectorContainer: {
    marginBottom: 24,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sessionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sessionTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
  },
  periodCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  periodInfo: {
    flex: 1,
  },
  periodBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  periodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  periodBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  periodTime: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  subjectName: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  periodDetails: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIconText: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 32,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    color: '#D1D5DB',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#0284C7',
  },
  messageIconContainer: {
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
