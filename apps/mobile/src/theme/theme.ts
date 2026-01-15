/**
 * React Native Paper Theme for EContact School App
 * Extends MD3LightTheme with custom colors and typography
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './typography';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary Colors
    primary: colors.primary,
    primaryContainer: colors.primaryLight,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryLight,

    // Background & Surface
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,

    // Error Colors
    error: colors.error,
    errorContainer: colors.errorLight,
    onError: '#FFFFFF',
    onErrorContainer: colors.errorDark,

    // Text Colors
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,

    // Border & Outline
    outline: colors.border,
    outlineVariant: colors.borderDark,

    // Status Colors
    success: colors.success,
    warning: colors.warning,

    // Custom Colors
    notification: colors.error,
    shadow: 'rgba(0, 0, 0, 0.1)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  // Typography configuration
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeight.regular as any,
    },
    medium: {
      fontFamily: typography.fontFamily.medium,
      fontWeight: typography.fontWeight.medium as any,
    },
    light: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeight.regular as any,
    },
    thin: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeight.regular as any,
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primaryLight,
    primaryContainer: colors.primaryDark,
    secondary: colors.secondaryLight,
    secondaryContainer: colors.secondaryDark,
    background: '#121212',
    surface: '#1E1E1E',
    error: colors.errorLight,
  },
};

// Default export
export default lightTheme;
