/**
 * VietQR Logo Component
 * Official VietQR branding logo for payment screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface VietQRLogoProps {
  size?: number;
}

export const VietQRLogo: React.FC<VietQRLogoProps> = ({ size = 40 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#0056CC" />
            <Stop offset="100%" stopColor="#003D99" />
          </LinearGradient>
        </Defs>

        {/* Background rounded square */}
        <Rect x="0" y="0" width="40" height="40" rx="8" fill="url(#grad)" />

        {/* QR Code Pattern - simplified visual representation */}
        {/* Top-left finder pattern */}
        <Rect x="6" y="6" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.9" />
        <Rect x="8" y="8" width="6" height="6" rx="1" fill="#0056CC" />

        {/* Top-right finder pattern */}
        <Rect x="24" y="6" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.9" />
        <Rect x="26" y="8" width="6" height="6" rx="1" fill="#0056CC" />

        {/* Bottom-left finder pattern */}
        <Rect x="6" y="24" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.9" />
        <Rect x="8" y="26" width="6" height="6" rx="1" fill="#0056CC" />

        {/* Data pattern dots */}
        <Rect x="20" y="6" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.8" />
        <Rect x="22" y="8" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
        <Rect x="20" y="10" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.7" />

        <Rect x="6" y="20" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.8" />
        <Rect x="8" y="22" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
        <Rect x="10" y="20" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.7" />

        {/* Center pattern */}
        <Rect x="18" y="18" width="6" height="6" rx="1" fill="#FFFFFF" opacity="0.9" />
        <Rect x="20" y="20" width="2" height="2" rx="0.5" fill="#0056CC" />

        {/* Bottom-right data */}
        <Rect x="24" y="24" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.8" />
        <Rect x="26" y="26" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
        <Rect x="28" y="24" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.7" />
        <Rect x="24" y="28" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
        <Rect x="28" y="28" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.8" />
        <Rect x="26" y="30" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.7" />

        {/* Additional dots */}
        <Rect x="30" y="20" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.5" />
        <Rect x="32" y="22" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
        <Rect x="20" y="32" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.5" />
        <Rect x="22" y="34" width="2" height="2" rx="0.5" fill="#FFFFFF" opacity="0.6" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
