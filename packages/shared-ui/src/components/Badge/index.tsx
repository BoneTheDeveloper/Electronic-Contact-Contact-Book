import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../tokens/colors';

export interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  children: string;
  size?: 'sm' | 'md';
}

export function Badge({ variant, children, size = 'md' }: BadgeProps) {
  const bgColors = {
    success: colors.success[50],
    warning: colors.warning[50],
    error: colors.error[50],
    info: colors.primary[50],
  };
  const textColors = {
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.primary[500],
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bgColors[variant] },
        size === 'sm' && styles.sm,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: textColors[variant] },
          size === 'sm' && styles.textSm,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
  },
});
