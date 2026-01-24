/**
 * AvatarInitials Component
 * Circle avatar with initials
 * Gradient background options
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg';
type AvatarGradient = 'blue' | 'purple' | 'orange' | 'emerald';

interface AvatarInitialsProps {
  name: string;
  size?: AvatarSize;
  gradient?: AvatarGradient;
}

const SIZE_CONFIG: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
};

const FONT_SIZE_CONFIG: Record<AvatarSize, number> = {
  sm: 12,
  md: 18,
  lg: 24,
};

const GRADIENTS: Record<AvatarGradient, { start: string; end: string; text: string }> = {
  blue: { start: '#0EA5E9', end: '#0284C7', text: '#FFFFFF' },
  purple: { start: '#A855F7', end: '#9333EA', text: '#FFFFFF' },
  orange: { start: '#FB923C', end: '#EA580C', text: '#FFFFFF' },
  emerald: { start: '#34D399', end: '#059669', text: '#FFFFFF' },
};

export const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  size = 'md',
  gradient = 'blue',
}) => {
  const config = GRADIENTS[gradient];
  const avatarSize = SIZE_CONFIG[size];
  const fontSize = FONT_SIZE_CONFIG[size];

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) {
      return parts[0]!.slice(0, 2).toUpperCase();
    }
    const first = parts[0]!.charAt(0);
    const last = parts[parts.length - 1]!.charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          backgroundColor: config.start,
          borderRadius: avatarSize / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize,
            color: config.text,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontWeight: '800',
  },
});
