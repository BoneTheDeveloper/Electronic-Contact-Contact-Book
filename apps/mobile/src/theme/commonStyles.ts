/**
 * Common styles to replace Tailwind classes
 * Used when NativeWind is not available
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

export const commonStyles = StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  row: { flexDirection: 'row' },

  // Alignment
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },

  // Spacing (scale: 4px base)
  p0: { padding: 0 },
  p1: { padding: 4 },
  p2: { padding: 8 },
  p3: { padding: 12 },
  p4: { padding: 16 },
  p5: { padding: 20 },
  p6: { padding: 24 },

  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: 4 },
  px2: { paddingHorizontal: 8 },
  px3: { paddingHorizontal: 12 },
  px4: { paddingHorizontal: 16 },
  px6: { paddingHorizontal: 24 },

  py0: { paddingVertical: 0 },
  py1: { paddingVertical: 4 },
  py2: { paddingVertical: 8 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  py6: { paddingVertical: 24 },

  m0: { margin: 0 },
  m1: { margin: 4 },
  m2: { margin: 8 },
  m3: { margin: 12 },
  m4: { margin: 16 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mb5: { marginBottom: 20 },
  mb6: { marginBottom: 24 },
  mt0_5: { marginTop: 2 },
  mt1: { marginTop: 4 },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  mt4: { marginTop: 16 },
  ml2: { marginLeft: 8 },
  ml3: { marginLeft: 12 },
  mr2: { marginRight: 8 },
  mr3: { marginRight: 12 },
  mx4: { marginHorizontal: 16 },

  // Sizing
  wFull: { width: '100%' },
  w23: { width: '23%' },
  w60: { width: 60 },
  hFull: { height: '100%' },
  h7: { height: 28 },
  h60: { height: 60 },
  hPx: { height: 1 },

  // Border radius
  rounded: { borderRadius: 4 },
  roundedFull: { borderRadius: 9999 },
  roundedXl: { borderRadius: 12 },
  rounded2xl: { borderRadius: 16 },
  roundedB20: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },

  // Colors (will be overridden by inline styles for dynamic colors)
  bgWhite: { backgroundColor: '#ffffff' },
  bgGray50: { backgroundColor: '#f9fafb' },
  bgGray100: { backgroundColor: '#f3f4f6' },
  bgGreen100: { backgroundColor: '#dcfce7' },
  bgRed100: { backgroundColor: '#fee2e2' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgBlue100: { backgroundColor: '#dbeafe' },
  bgGray200: { backgroundColor: '#e5e7eb' },

  // Text colors
  textWhite: { color: '#ffffff' },
  textGray400: { color: '#9ca3af' },
  textGray500: { color: '#6b7280' },
  textGray800: { color: '#1f2937' },
  textGreen600: { color: '#16a34a' },
  textRed600: { color: '#dc2626' },
  textAmber600: { color: '#d97706' },
  textBlue600: { color: '#2563eb' },

  // Typography
  textXs: { fontSize: 12 },
  textSm: { fontSize: 14 },
  textBase: { fontSize: 16 },
  textLg: { fontSize: 18 },
  textXl: { fontSize: 20 },
  text2xl: { fontSize: 24 },
  text10: { fontSize: 10 },
  text11: { fontSize: 11 },
  text14: { fontSize: 14 },
  text15: { fontSize: 15 },
  text20: { fontSize: 20 },
  text28: { fontSize: 28 },

  fontNormal: { fontWeight: '400' },
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  fontExtrabold: { fontWeight: '800' },

  leading22: { lineHeight: 22 },
  uppercase: { textTransform: 'uppercase' },
  trackingWider: { letterSpacing: 0.05 },
  textRight: { textAlign: 'right' },
  textCenter: { textAlign: 'center' },

  // Borders
  border: { borderWidth: 1 },
  borderGray100: { borderColor: '#f3f4f6' },
  borderGray200: { borderColor: '#e5e7eb' },
  borderT: { borderTopWidth: 1 },

  // Opacity
  opacity80: { opacity: 0.8 },

  // Shadow
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

// Helper to combine styles
export const combineStyles = (...styles: (Style | undefined | null | false)[]): Style => {
  return StyleSheet.flatten(styles.filter(Boolean) as Style[]);
};
