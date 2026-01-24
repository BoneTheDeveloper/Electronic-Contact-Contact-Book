/**
 * WeekDaySelector Component
 * Horizontal scrollable day tabs for schedule
 * T2-T7 labels with date numbers below
 * Active state styling with touch feedback
 * Supports 5-day (THCS) or 7-day (THPT) week
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';

// Vietnamese weekday labels
const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const WEEKDAY_FULL_NAMES = [
  'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
];

interface WeekDaySelectorProps {
  selectedDay: number; // 1-7 (Mon-Sun, where 1=Monday/T2, 7=Sunday/CN)
  weekStart: Date;
  onChange: (day: number) => void;
  numberOfDays?: 5 | 7; // 5 days for THCS (T2-T6), 7 days for THPT (T2-CN)
}

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDay,
  weekStart,
  onChange,
  numberOfDays = 7,
}) => {
  const visibleLabels = WEEKDAY_LABELS.slice(0, numberOfDays);

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
    <View style={styles.container}>
      {visibleLabels.map((label, index) => {
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
            {today && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dayTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayTabSelected: {
    backgroundColor: '#0284C7',
  },
  dayTabToday: {
    backgroundColor: 'transparent',
  },
  weekdayLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  weekdayLabelSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: '#9CA3AF',
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
