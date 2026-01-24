/**
 * Schedule Screen (Thời khóa biểu)
 * Middle school (THCS) student schedule with category tabs (Lịch học, Học bù, Lịch thi)
 * Matches wireframe design
 */

import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { WeekDaySelector } from "../../components/ui";
import type { StudentHomeStackNavigationProp } from "../../navigation/types";

interface ScheduleScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

type CategoryType = 'hoc' | 'bu' | 'thi';

interface Period {
  id: string;
  periodNumber: string;
  time: string;
  subject: string;
  room: string;
  teacher: string;
  color: { bg: string; text: string };
  note?: string; // For makeup classes - reason/date info
  studyDate?: string; // For makeup classes - the actual date
  examId?: string; // For exams
  examDate?: string; // For exams - the exam date
  duration?: string; // For exams
}

interface DaySchedule {
  dayOfWeek: number;
  dayLabel: string;
  periods: Period[];
}

// Day labels for middle school (T2-T6)
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6'];

const getDayNumber = (dayOfWeek: number): number => {
  const now = new Date();
  const currentDay = now.getDay() || 7;
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  return targetDate.getDate();
};

export const StudentScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(1); // 1-5 (T2-T6)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('hoc');

  // Mock schedule data for middle school (THCS) students
  const mockScheduleData = useMemo(() => ({
    hoc: [
      // T2 (Monday)
      { dayOfWeek: 1, dayLabel: 'T2', periods: [
        { id: 'h1-1', periodNumber: '1', time: '07:15 – 08:00', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h1-2', periodNumber: '2', time: '08:05 – 08:50', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h1-3', periodNumber: '3', time: '09:10 – 09:55', subject: 'Tiếng Anh', room: 'Phòng 201', teacher: 'GV: Lê Thu Hương', color: { bg: '#D1FAE5', text: '#059669' } },
        { id: 'h1-4', periodNumber: '4', time: '10:00 – 10:45', subject: 'Lịch sử & Địa lý', room: 'Phòng 6A1', teacher: 'GV: Võ Minh Triết', color: { bg: '#FEE2E2', text: '#DC2626' } },
        { id: 'h1-5', periodNumber: '5', time: '10:50 – 11:35', subject: 'Tin học', room: 'Phòng Tin 1', teacher: 'GV: Trần Minh Tuấn', color: { bg: '#E0E7FF', text: '#4F46E5' } },
        { id: 'h1-6', periodNumber: '6', time: '14:00 – 14:45', subject: 'Bồi dưỡng Toán', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h1-7', periodNumber: '7', time: '14:50 – 15:35', subject: 'Thể dục', room: 'Sân thể thao', teacher: 'GV: Nguyễn Hùng', color: { bg: '#DBEAFE', text: '#2563EB' } },
        { id: 'h1-8', periodNumber: '8', time: '15:45 – 16:30', subject: 'Hoạt động trải nghiệm', room: 'Hội trường', teacher: 'GVCN', color: { bg: '#FEF3C7', text: '#D97706' } },
      ]},
      // T3 (Tuesday)
      { dayOfWeek: 2, dayLabel: 'T3', periods: [
        { id: 'h2-1', periodNumber: '1', time: '07:15 – 08:00', subject: 'Ngữ văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h2-2', periodNumber: '2', time: '08:05 – 08:50', subject: 'Ngữ văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h2-3', periodNumber: '3', time: '09:10 – 09:55', subject: 'Khoa học tự nhiên', room: 'Lab 1', teacher: 'GV: Phạm Quốc Khánh', color: { bg: '#DCFCE7', text: '#16A34A' } },
        { id: 'h2-4', periodNumber: '4', time: '10:00 – 10:45', subject: 'GDCD', room: 'Phòng 6A1', teacher: 'GV: Lê Văn Đức', color: { bg: '#FEF3C7', text: '#D97706' } },
        { id: 'h2-5', periodNumber: '5', time: '10:50 – 11:35', subject: 'Nghệ thuật', room: 'Phòng Mỹ thuật', teacher: 'GV: Hoàng Mai', color: { bg: '#FEE2E2', text: '#DC2626' } },
        { id: 'h2-6', periodNumber: '6', time: '14:00 – 14:45', subject: 'CLB Tin học', room: 'Phòng Tin 1', teacher: 'GV: Trần Minh Tuấn', color: { bg: '#E0E7FF', text: '#4F46E5' } },
        { id: 'h2-7', periodNumber: '7', time: '14:50 – 15:35', subject: 'Tiếng Anh tăng cường', room: 'Phòng 201', teacher: 'GV: Lê Thu Hương', color: { bg: '#D1FAE5', text: '#059669' } },
        { id: 'h2-8', periodNumber: '8', time: '15:45 – 16:30', subject: 'Hoạt động trải nghiệm', room: 'Hội trường', teacher: 'GVCN', color: { bg: '#FEF3C7', text: '#D97706' } },
      ]},
      // T4 (Wednesday)
      { dayOfWeek: 3, dayLabel: 'T4', periods: [
        { id: 'h3-1', periodNumber: '1', time: '07:15 – 08:00', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h3-2', periodNumber: '2', time: '08:05 – 08:50', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h3-3', periodNumber: '3', time: '09:10 – 09:55', subject: 'Tiếng Anh', room: 'Phòng 201', teacher: 'GV: Lê Thu Hương', color: { bg: '#D1FAE5', text: '#059669' } },
        { id: 'h3-4', periodNumber: '4', time: '10:00 – 10:45', subject: 'Lịch sử & Địa lý', room: 'Phòng 6A1', teacher: 'GV: Võ Minh Triết', color: { bg: '#FEE2E2', text: '#DC2626' } },
        { id: 'h3-5', periodNumber: '5', time: '10:50 – 11:35', subject: 'Công nghệ', room: 'Phòng Công nghệ', teacher: 'GV: Trần Tuấn', color: { bg: '#EEF2FF', text: '#6366F1' } },
        { id: 'h3-6', periodNumber: '6', time: '14:00 – 14:45', subject: 'Bồi dưỡng Văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h3-7', periodNumber: '7', time: '14:50 – 15:35', subject: 'Thể dục', room: 'Sân thể thao', teacher: 'GV: Nguyễn Hùng', color: { bg: '#DBEAFE', text: '#2563EB' } },
        { id: 'h3-8', periodNumber: '8', time: '15:45 – 16:30', subject: 'Hướng nghiệp', room: 'Hội trường', teacher: 'GV: Lê Đức', color: { bg: '#ECFEFF', text: '#0891B2' } },
      ]},
      // T5 (Thursday)
      { dayOfWeek: 4, dayLabel: 'T5', periods: [
        { id: 'h4-1', periodNumber: '1', time: '07:15 – 08:00', subject: 'Ngữ văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h4-2', periodNumber: '2', time: '08:05 – 08:50', subject: 'Ngữ văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h4-3', periodNumber: '3', time: '09:10 – 09:55', subject: 'Khoa học tự nhiên', room: 'Lab 1', teacher: 'GV: Vũ Thị Hương', color: { bg: '#DCFCE7', text: '#16A34A' } },
        { id: 'h4-4', periodNumber: '4', time: '10:00 – 10:45', subject: 'GDCD', room: 'Phòng 6A1', teacher: 'GV: Lê Văn Đức', color: { bg: '#FEF3C7', text: '#D97706' } },
        { id: 'h4-5', periodNumber: '5', time: '10:50 – 11:35', subject: 'Tin học', room: 'Phòng Tin 1', teacher: 'GV: Trần Minh Tuấn', color: { bg: '#E0E7FF', text: '#4F46E5' } },
        { id: 'h4-6', periodNumber: '6', time: '14:00 – 14:45', subject: 'CLB Thể thao', room: 'Sân thể thao', teacher: 'GV: Nguyễn Hùng', color: { bg: '#DBEAFE', text: '#2563EB' } },
        { id: 'h4-7', periodNumber: '7', time: '14:50 – 15:35', subject: 'Tiếng Anh tăng cường', room: 'Phòng 201', teacher: 'GV: Lê Thu Hương', color: { bg: '#D1FAE5', text: '#059669' } },
        { id: 'h4-8', periodNumber: '8', time: '15:45 – 16:30', subject: 'Hoạt động trải nghiệm', room: 'Hội trường', teacher: 'GVCN', color: { bg: '#FEF3C7', text: '#D97706' } },
      ]},
      // T6 (Friday)
      { dayOfWeek: 5, dayLabel: 'T6', periods: [
        { id: 'h5-1', periodNumber: '1', time: '07:15 – 08:00', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h5-2', periodNumber: '2', time: '08:05 – 08:50', subject: 'Toán học', room: 'Phòng 6A1', teacher: 'GV: Nguyễn Thị Lan', color: { bg: '#FFEDD5', text: '#EA580C' } },
        { id: 'h5-3', periodNumber: '3', time: '09:10 – 09:55', subject: 'Tiếng Anh', room: 'Phòng 201', teacher: 'GV: Lê Thu Hương', color: { bg: '#D1FAE5', text: '#059669' } },
        { id: 'h5-4', periodNumber: '4', time: '10:00 – 10:45', subject: 'Lịch sử & Địa lý', room: 'Phòng 6A1', teacher: 'GV: Võ Minh Triết', color: { bg: '#FEE2E2', text: '#DC2626' } },
        { id: 'h5-5', periodNumber: '5', time: '10:50 – 11:35', subject: 'Nghệ thuật', room: 'Phòng Mỹ thuật', teacher: 'GV: Hoàng Mai', color: { bg: '#FEE2E2', text: '#DC2626' } },
        { id: 'h5-6', periodNumber: '6', time: '14:00 – 14:45', subject: 'Bồi dưỡng Văn', room: 'Phòng 6A1', teacher: 'GV: Trần Văn Minh', color: { bg: '#F3E8FF', text: '#9333EA' } },
        { id: 'h5-7', periodNumber: '7', time: '14:50 – 15:35', subject: 'Thể dục', room: 'Sân thể thao', teacher: 'GV: Nguyễn Hùng', color: { bg: '#DBEAFE', text: '#2563EB' } },
        { id: 'h5-8', periodNumber: '8', time: '15:45 – 16:30', subject: 'Sinh hoạt lớp', room: 'Phòng 6A1', teacher: 'GVCN', color: { bg: '#DCFCE7', text: '#16A34A' } },
      ]},
    ],
    bu: [
      // Makeup classes (Học bù)
      { dayOfWeek: 3, dayLabel: 'T4', periods: [
        { id: 'b1-1', periodNumber: 'BÙ', time: '13:30', subject: 'Vật lý', room: 'Phòng Lab 1', teacher: 'GV: Phạm Quốc Khánh', color: { bg: '#EEF2FF', text: '#6366F1' }, studyDate: '25/01/2026', note: '20/01/2026' },
      ]},
    ],
    thi: [
      // Exam schedule (Lịch thi)
      { dayOfWeek: 1, dayLabel: 'T2', periods: [
        { id: 'e1-1', periodNumber: '', time: '07:30', subject: 'Toán học', room: 'Phòng thi 01', teacher: 'BGH', color: { bg: '#FFEDD5', text: '#EA580C' }, examId: 'SBD: 20250045', examDate: '25/01/2026', duration: '60 Phút' },
        { id: 'e1-2', periodNumber: '', time: '09:30', subject: 'Ngữ văn', room: 'Phòng thi 02', teacher: 'BGH', color: { bg: '#F3E8FF', text: '#9333EA' }, examId: 'SBD: 20250045', examDate: '25/01/2026', duration: '90 Phút' },
        { id: 'e1-3', periodNumber: '', time: '14:00', subject: 'Tiếng Anh', room: 'Phòng thi 03', teacher: 'BGH', color: { bg: '#D1FAE5', text: '#059669' }, examId: 'SBD: 20250045', examDate: '26/01/2026', duration: '60 Phút' },
        { id: 'e1-4', periodNumber: '', time: '07:30', subject: 'Vật lý', room: 'Phòng thi 04', teacher: 'BGH', color: { bg: '#EEF2FF', text: '#6366F1' }, examId: 'SBD: 20250045', examDate: '27/01/2026', duration: '60 Phút' },
        { id: 'e1-5', periodNumber: '', time: '09:30', subject: 'Hóa học', room: 'Phòng thi 05', teacher: 'BGH', color: { bg: '#FEF3C7', text: '#D97706' }, examId: 'SBD: 20250045', examDate: '27/01/2026', duration: '60 Phút' },
        { id: 'e1-6', periodNumber: '', time: '14:00', subject: 'Lịch sử', room: 'Phòng thi 06', teacher: 'BGH', color: { bg: '#FEE2E2', text: '#DC2626' }, examId: 'SBD: 20250045', examDate: '28/01/2026', duration: '45 Phút' },
        { id: 'e1-7', periodNumber: '', time: '07:30', subject: 'Địa lý', room: 'Phòng thi 07', teacher: 'BGH', color: { bg: '#ECFEFF', text: '#0891B2' }, examId: 'SBD: 20250045', examDate: '29/01/2026', duration: '45 Phút' },
      ]},
    ],
  }), []);

  const currentSchedule = useMemo(() => {
    const data = mockScheduleData[selectedCategory];
    const selectedData = data.find(d => d.dayOfWeek === selectedDay) || data[0];
    return selectedData || { dayOfWeek: 1, dayLabel: 'T2', periods: [] };
  }, [selectedDay, selectedCategory, mockScheduleData]);

  const weekStart = new Date();
  const dayOfWeek = weekStart.getDay();
  const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  weekStart.setDate(diff);

  return (
    <View style={styles.container}>
      {/* Header Background with Gradient */}
      <View style={styles.headerBg} />

      {/* Header - Centered like wireframe */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <View style={styles.backIconContainer}>
            <Text style={styles.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Thời khóa biểu</Text>
          <Text style={styles.headerSubtitle}>Năm học 2025 - 2026</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabsContainer}>
        {(['hoc', 'bu', 'thi'] as CategoryType[]).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category && styles.categoryTabTextActive,
            ]}>
              {category === 'hoc' ? 'Lịch học' : category === 'bu' ? 'Học bù' : 'Lịch thi'}
            </Text>
            {selectedCategory === category && <View style={styles.categoryTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Week Day Selector - only for regular schedule */}
        {selectedCategory === 'hoc' && (
          <View style={styles.daySelectorContainer}>
            <WeekDaySelector
              selectedDay={selectedDay}
              weekStart={weekStart}
              onChange={setSelectedDay}
              numberOfDays={5}
            />
          </View>
        )}

        {/* Content based on category */}
        <View style={styles.contentContainer}>
          {selectedCategory === 'thi' ? (
            // Exam card style
            currentSchedule.periods.map(renderExamCard)
          ) : selectedCategory === 'bu' ? (
            // Makeup class style
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionDot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.sectionTitle}>Lịch học bổ sung</Text>
              </View>
              {currentSchedule.periods.length > 0 ? currentSchedule.periods.map(renderMakeupCard) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Không có lịch học bù</Text>
                </View>
              )}
            </>
          ) : (
            // Regular class style - split by morning/afternoon
            <>
              {/* Morning Section */}
              <View style={styles.sessionHeader}>
                <View style={[styles.sessionDot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.sessionTitle}>Sáng</Text>
              </View>
              {currentSchedule.periods.filter(p => parseInt(p.periodNumber) <= 5).map(renderPeriodCard)}

              {/* Afternoon Section */}
              {currentSchedule.periods.some(p => parseInt(p.periodNumber) > 5) && (
                <>
                  <View style={styles.sessionHeader}>
                    <View style={[styles.sessionDot, { backgroundColor: '#0EA5E9' }]} />
                    <Text style={styles.sessionTitle}>Chiều</Text>
                  </View>
                  {currentSchedule.periods.filter(p => parseInt(p.periodNumber) > 5).map(renderPeriodCard)}
                </>
              )}

              {currentSchedule.periods.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Không có lịch học</Text>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );

  function renderPeriodCard(period: Period) {
    const periodNum = parseInt(period.periodNumber);
    const isMorning = periodNum <= 5;
    const badgeBg = isMorning ? '#FFF7ED' : '#E0F2FE';
    const badgeText = isMorning ? '#F97316' : '#0EA5E9';

    return (
      <TouchableOpacity
        key={period.id}
        style={styles.periodCard}
        activeOpacity={0.95}
      >
        <View style={styles.periodCardHeader}>
          <View style={styles.periodInfo}>
            <View style={styles.periodBadges}>
              <View style={styles.periodBadge}>
                <Text style={styles.periodNumber}>Tiết {period.periodNumber}</Text>
              </View>
              <Text style={styles.periodTime}>{period.time}</Text>
            </View>
            <Text style={styles.subjectName}>{period.subject}</Text>
            <Text style={styles.periodDetails}>{period.teacher} • {period.room}</Text>
          </View>
          <View style={[styles.subjectIcon, { backgroundColor: period.color.bg }]}>
            <Text style={[styles.subjectIconText, { color: period.color.text }]}>
              {getSubjectShort(period.subject)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderMakeupCard(period: Period) {
    return (
      <TouchableOpacity
        key={period.id}
        style={[styles.periodCard, styles.makeupCard]}
        activeOpacity={0.95}
      >
        <View style={styles.periodCardHeader}>
          <View style={styles.periodInfo}>
            <Text style={styles.subjectName}>{period.subject}</Text>
            <Text style={styles.periodDetails}>{period.teacher}</Text>
            <View style={styles.makeupDates}>
              <Text style={[styles.periodDetails, styles.makeupNote]}>Ngày học: {period.studyDate || period.note}</Text>
              <Text style={[styles.periodDetails, styles.makeupNote]}>Bù ngày: {period.note}</Text>
            </View>
          </View>
          <View style={[styles.makeupSquareIcon, { backgroundColor: period.color.bg }]}>
            <Text style={[styles.makeupSquareText, { color: period.color.text }]}>
              {getSubjectShort(period.subject)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderExamCard(period: Period) {
    return (
      <TouchableOpacity
        key={period.id}
        style={[styles.periodCard, styles.examCard]}
        activeOpacity={0.95}
      >
        <View style={styles.periodCardHeader}>
          <View style={styles.periodInfo}>
            <View style={styles.periodBadges}>
              <View style={styles.periodBadge}>
                <Text style={styles.periodNumber}>{period.examDate || ''}</Text>
              </View>
              <Text style={styles.periodTime}>{period.time}</Text>
            </View>
            <Text style={styles.subjectName}>{period.subject}</Text>
            <Text style={styles.periodDetails}>{period.examId} • {period.room} • {period.duration}</Text>
          </View>
          <View style={[styles.subjectIcon, { backgroundColor: period.color.bg }]}>
            <Text style={[styles.subjectIconText, { color: period.color.text }]}>
              {getSubjectShort(period.subject)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function getSubjectShort(subjectName: string): string {
    const shortNames: Record<string, string> = {
      "Toán học": "Toán",
      "Ngữ văn": "Văn",
      "Tiếng Anh": "Anh",
      "Vật lý": "Lý",
      "Hóa học": "Hóa",
      "Lịch sử": "Sử",
      "Địa lý": "Địa",
      "Lịch sử & Địa lý": "Sử&Địa",
      "Sinh học": "Sinh",
      "Khoa học tự nhiên": "KHTN",
      "Giáo dục công dân": "GDCD",
      "Thể dục": "TD",
      "Tin học": "Tin",
      "Công nghệ": "CN",
      "Nghệ thuật": "MT",
      "Bồi dưỡng Toán": "BD Toán",
      "Bồi dưỡng Văn": "BD Văn",
      "Tiếng Anh tăng cường": "Anh TC",
      "Hoạt động trải nghiệm": "HTD",
      "Hướng nghiệp": "HN",
      "Sinh hoạt lớp": "SHL",
      "CLB Tin học": "CLB Tin",
      "CLB Thể thao": "CLB TD",
    };
    return shortNames[subjectName] || subjectName.substring(0, 4);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#0284C7',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 24,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
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
  headerSpacer: {
    width: 36,
  },
  categoryTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginTop: 4,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
  },
  categoryTabActive: {
    position: 'relative',
  },
  categoryTabText: {
    color: 'rgba(224, 242, 254, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  categoryTabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 16,
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  daySelectorContainer: {
    marginBottom: 16,
  },
  contentContainer: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginTop: 12,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sessionTitle: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '800',
  },
  periodCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
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
    gap: 6,
    marginBottom: 3,
  },
  periodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  periodNumber: {
    fontSize: 8,
    fontWeight: '700',
    color: '#6B7280',
  },
  periodTime: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  subjectName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  periodDetails: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIconText: {
    fontSize: 12,
    fontWeight: '800',
  },
  // Makeup styles
  makeupCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
  },
  makeupSquareIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeupSquareText: {
    fontSize: 14,
    fontWeight: '800',
  },
  makeupDates: {
    marginTop: 4,
    gap: 2,
  },
  makeupNote: {
    color: '#6B7280',
  },
  // Exam styles
  examCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
  },
  // Icon card styles
  periodIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
});
