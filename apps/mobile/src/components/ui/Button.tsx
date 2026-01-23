/**
 * Button Component
 * Styled button following design guidelines
 * Uses React Native Paper with custom styling
 */

import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode | string | number | boolean | null | undefined;
  mode?: 'contained' | 'outlined' | 'text' | 'elevated' | 'contained-tonal';
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textColor?: string;
  buttonColor?: string;
  uppercase?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  children,
  style,
  buttonColor,
  textColor,
  uppercase = false,
  ...props
}) => {
  return (
    <PaperButton
      mode={mode}
      style={[styles.button, style]}
      contentStyle={styles.content}
      labelStyle={styles.label}
      buttonColor={buttonColor}
      textColor={textColor}
      uppercase={uppercase}
      {...props}
    >
      {children as any}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    marginVertical: 8,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default Button;
