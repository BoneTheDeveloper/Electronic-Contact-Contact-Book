/**
 * StatCard Component
 * Summary statistic cards with icons
 * Used in Dashboard and Summary screens
 * Gradient or solid background options
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatColor = 'blue' | 'green' | 'orange' | 'purple';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatColor;
  variant?: 'solid' | 'gradient';
}

const COLOR_CONFIGS: Record<StatColor, { bg: string; text: string; border: string }> = {
  blue: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  green: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  orange: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  purple: { bg: '#FAF5FF', text: '#9333EA', border: '#E9D5FF' },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'blue',
  variant = 'solid',
}) => {
  const config = COLOR_CONFIGS[color];

  return (
    <View
      style={[
        styles.card,
        variant === 'solid' && { backgroundColor: config.bg },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color: config.text }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
