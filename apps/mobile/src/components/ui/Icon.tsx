/**
 * Icon Component
 * SVG icon wrapper using react-native-svg
 * Replaces emoji icons with proper SVG icons
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import * as Svg from 'react-native-svg';
const { Path, Circle, Polyline, Rect, Line } = Svg;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export type IconName =
  | 'calendar'
  | 'check-circle'
  | 'account-check'
  | 'file-document'
  | 'message-reply'
  | 'newspaper'
  | 'chart-pie'
  | 'account-group'
  | 'cash'
  | 'bell'
  | 'arrow-left'
  | 'arrow-right'
  | 'check'
  | 'close'
  | 'home'
  | 'message'
  | 'user'
  | 'settings'
  | 'chevron-down'
  | 'chevron-up'
  | 'school'
  | 'trophy'
  | 'clock'
  | 'notification'
  | 'book'
  | 'upload-cloud'
  | 'x';

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#6B7280',
  style,
}) => {
  const renderIcon = () => {
    switch (name) {
      case 'calendar':
        return (
          <>
            <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth={2} fill="none" />
            <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        );

      case 'check-circle':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M8 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'account-check':
        return (
          <>
            <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2.5} fill="none" />
            <Polyline points="15 11 18 13 23 8" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'file-document':
        return (
          <>
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Polyline points="10 9 9 9 8 9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'message-reply':
        return (
          <>
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="9 11 12 8 15 11" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'newspaper':
        return (
          <>
            <Path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M18 14h-8" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Path d="M15 18h-5" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Path d="M10 6h8v4h-8V6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'chart-pie':
        return (
          <>
            <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M22 12A10 10 0 0 0 12 2v10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'account-group':
        return (
          <>
            <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'cash':
        return (
          <>
            <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={2} fill="none" />
            <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        );

      case 'bell':
        return (
          <>
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'arrow-left':
        return (
          <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'arrow-right':
        return (
          <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'check':
        return (
          <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'close':
        return (
          <>
            <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        );

      case 'home':
        return (
          <>
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="9 22 9 12 15 12 15 22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'message':
        return (
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'user':
        return (
          <>
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} fill="none" />
          </>
        );

      case 'settings':
        return (
          <>
            <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} fill="none" />
            <Path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
          </>
        );

      case 'chevron-down':
        return (
          <Polyline points="6 9 12 15 18 9" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'chevron-up':
        return (
          <Polyline points="18 15 12 9 6 15" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        );

      case 'school':
        return (
          <>
            <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'trophy':
        return (
          <>
            <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M4 22h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} fill="none" />
            <Polyline points="12 6 12 12 16 14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'notification':
        return (
          <>
            <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'book':
        return (
          <>
            <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'upload-cloud':
        return (
          <>
            <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="17 8 12 3 7 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        );

      case 'x':
        return (
          <>
            <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg.default width={size} height={size} viewBox="0 0 24 24">
        {renderIcon()}
      </Svg.default>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;
