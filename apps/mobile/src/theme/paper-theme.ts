/**
 * React Native Paper Theme Configuration
 * Based on design guidelines with #0284C7 as primary color
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: '#E0F2FE',
    secondary: colors.secondary,
    secondaryContainer: '#F1F5F9',
    tertiary: '#6366F1',
    tertiaryContainer: '#EEF2FF',
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    background: '#F9FAFB',
    error: colors.error,
    errorContainer: '#FEE2E2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1F2937',
    onSurfaceVariant: '#6B7280',
    onError: '#FFFFFF',
    onBackground: '#1F2937',
    onErrorContainer: colors.error,
    outline: '#E5E7EB',
    outlineVariant: '#F3F4F6',
    inverseSurface: '#1F2937',
    inverseOnSurface: '#F9FAFB',
    inversePrimary: '#E0F2FE',
    shadow: 'rgba(0, 0, 0, 0.1)',
    scrim: 'rgba(0, 0, 0, 0.4)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: '#0369A1',
    secondary: colors.secondaryLight,
    secondaryContainer: '#334155',
    tertiary: '#818CF8',
    tertiaryContainer: '#312E81',
    surface: '#1F2937',
    surfaceVariant: '#374151',
    background: '#111827',
    error: colors.error,
    errorContainer: '#7F1D1D',
    onPrimary: '#FFFFFF',
    onSecondary: '#1F2937',
    onSurface: '#F9FAFB',
    onSurfaceVariant: '#D1D5DB',
    onError: '#FFFFFF',
    onBackground: '#F9FAFB',
    onErrorContainer: '#FEE2E2',
    outline: '#374151',
    outlineVariant: '#4B5563',
    inverseSurface: '#F9FAFB',
    inverseOnSurface: '#1F2937',
    inversePrimary: '#0369A1',
    shadow: 'rgba(0, 0, 0, 0.3)',
    scrim: 'rgba(0, 0, 0, 0.6)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
};
