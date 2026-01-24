/**
 * StatusBadge Component
 * Status badges with consistent colors
 * Used for payments, attendance, leave requests
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BadgeSize = 'sm' | 'md';

type BadgeStatus =
  | 'paid'
  | 'unpaid'
  | 'partial'
  | 'present'
  | 'absent'
  | 'late'
  | 'excused'
  | 'approved'
  | 'pending'
  | 'rejected';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: BadgeSize;
}

const STATUS_CONFIG: Record<BadgeStatus, { label: string; bg: string; text: string }> = {
  // Payment statuses
  paid: { label: 'Đã thanh toán', bg: '#ECFDF5', text: '#059669' },
  unpaid: { label: 'Chưa thanh toán', bg: '#FEF2F2', text: '#DC2626' },
  partial: { label: 'Thanh toán một phần', bg: '#FFF7ED', text: '#EA580C' },

  // Attendance statuses
  present: { label: 'Có mặt', bg: '#ECFDF5', text: '#059669' },
  absent: { label: 'Vắng mặt', bg: '#FEF2F2', text: '#DC2626' },
  late: { label: 'Đi muộn', bg: '#FFF7ED', text: '#EA580C' },
  excused: { label: 'Có phép', bg: '#EFF6FF', text: '#1D4ED8' },

  // Leave request statuses
  approved: { label: 'Được duyệt', bg: '#ECFDF5', text: '#059669' },
  pending: { label: 'Chờ duyệt', bg: '#FEF3C7', text: '#D97706' },
  rejected: { label: 'Từ chối', bg: '#FEF2F2', text: '#DC2626' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
        { backgroundColor: config.bg },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: config.text },
        ]}
      />
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: config.text },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
  },
  textMd: {
    fontSize: 11,
  },
});
