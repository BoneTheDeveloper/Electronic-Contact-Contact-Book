/**
 * Typography System for EContact School App
 * Based on Material Design 3 with Inter font
 */

export const typography = {
  // Font Family
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  // Font Sizes (using sp - scalable pixels)
  fontSize: {
    // Display
    displayLarge: 57,
    displayMedium: 45,
    displaySmall: 36,

    // Headlines
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,

    // Titles
    titleLarge: 22,
    titleMedium: 16,
    titleSmall: 14,

    // Body
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,

    // Labels
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 11,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Letter Spacing
  letterSpacing: {
    none: 0,
    small: 0.15,
    medium: 0.25,
    large: 0.5,
    button: 1,
  },
};

export type TypographyKeys = keyof typeof typography;
