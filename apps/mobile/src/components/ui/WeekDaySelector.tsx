/**
 * WeekDaySelector Component
 * Horizontal scrollable day tabs for schedule
 * T2-T7 labels with date numbers below
 * Active state styling with touch feedback
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, type ViewStyle, type TextStyle } from 'react-native';

// Vietnamese weekday labels
const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const WEEKDAY_FULL_NAMES = [
  'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
];

interface WeekDaySelectorProps {
  selectedDay: number; // 1-7 (Mon-Sun, where 1=Monday/T2, 7=Sunday/CN)
  weekStart: Date;
  onChange: (day: number) => void;
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDay,
  weekStart,
  onChange,
}) => {
  const getDateForDay = (dayIndex: number): Date => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  const getDayNumber = (dayIndex: number): number => {
    return getDateForDay(dayIndex).getDate();
  };

  const isToday = (dayIndex: number): boolean => {
    const today = new Date();
    const targetDate = getDateForDay(dayIndex);
    return (
      targetDate.getDate() === today.getDate() &&
      targetDate.getMonth() === today.getMonth() &&
      targetDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {WEEKDAY_LABELS.map((label, index) => {
        const dayNum = index + 1; // 1-7
        const isSelected = selectedDay === dayNum;
        const today = isToday(index);

        const dayTabStyle: ViewStyle = isSelected
          ? StyleSheet.compose(styles.dayTab, styles.dayTabSelected) as ViewStyle
          : today && !isSelected
          ? StyleSheet.compose(styles.dayTab, styles.dayTabToday) as ViewStyle
          : styles.dayTab;

        const weekdayLabelStyle: TextStyle = isSelected
          ? StyleSheet.compose(styles.weekdayLabel, styles.weekdayLabelSelected) as TextStyle
          : styles.weekdayLabel;

        const dayNumberStyle: TextStyle = isSelected
          ? StyleSheet.compose(styles.dayNumber, styles.dayNumberSelected) as TextStyle
          : today && !isSelected
          ? StyleSheet.compose(styles.dayNumber, styles.dayNumberToday) as TextStyle
          : styles.dayNumber;

        return (
          <TouchableOpacity
            key={label}
            style={dayTabStyle}
            onPress={() => onChange(dayNum)}
            activeOpacity={0.7}
          >
            <Text style={weekdayLabelStyle}>
              {label}
            </Text>
            <Text style={dayNumberStyle}>
              {getDayNumber(index)}
            </Text>
            {today && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dayTab: {
    width: 48,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dayTabSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  dayTabToday: {
    borderColor: '#0284C7',
    borderWidth: 1.5,
  },
  weekdayLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  weekdayLabelSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: '#0284C7',
  },
  todayDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0284C7',
  },
});
