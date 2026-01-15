/**
 * Shared Typography Tokens
 * Font: Inter
 */

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    h1: ['32px', { lineHeight: '40px', fontWeight: '600' as const }],
    h2: ['24px', { lineHeight: '32px', fontWeight: '600' as const }],
    h3: ['20px', { lineHeight: '28px', fontWeight: '500' as const }],
    h4: ['16px', { lineHeight: '24px', fontWeight: '500' as const }],
    body: ['14px', { lineHeight: '20px', fontWeight: '400' as const }],
    small: ['12px', { lineHeight: '16px', fontWeight: '400' as const }],
    xs: ['10px', { lineHeight: '14px', fontWeight: '400' as const }],
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type Typography = typeof typography;
