import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { colors } from '../../tokens/colors';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  variant = 'circle',
  style,
  imageStyle,
}: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name?: string) => {
    if (!name) return colors.neutral[300];
    const colorIndex = name.charCodeAt(0) % 5;
    const avatarColors = [
      colors.primary[500],
      colors.success[500],
      colors.warning[500],
      colors.error[500],
      colors.neutral[600],
    ];
    return avatarColors[colorIndex];
  };

  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const textSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  };

  const avatarSize = sizes[size];
  const textSize = textSizes[size];

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={[
          styles.image,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: variant === 'circle' ? avatarSize / 2 : 4,
          },
          imageStyle,
        ]}
        accessibilityLabel={alt}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: avatarSize,
          height: avatarSize,
          backgroundColor: getAvatarColor(name),
          borderRadius: variant === 'circle' ? avatarSize / 2 : 4,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: textSize,
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.neutral[200],
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
