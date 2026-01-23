/**
 * Card Component
 * Styled card following design guidelines
 * Uses React Native Paper with custom styling
 */

import React from 'react';
import { Card as PaperCard } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

export interface CardProps {
  children: React.ReactNode | string | number | boolean | null | undefined;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'contained';
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  onPress,
}) => {
  // Map variant to Paper mode ('contained' maps to 'elevated')
  const mode = variant === 'outlined' ? 'outlined' : 'elevated';

  return (
    <PaperCard
      mode={mode}
      style={[styles.card, style]}
      contentStyle={styles.content}
      onPress={onPress}
    >
      {children as any}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});

export default Card;
