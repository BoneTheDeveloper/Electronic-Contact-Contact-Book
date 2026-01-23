/**
 * Type declarations for className support in React Native
 * NOTE: This provides TypeScript support for className props.
 * For runtime functionality, NativeWind v4 must be properly installed.
 *
 * To install NativeWind v4:
 * npm install nativewind tailwindcss
 * npm install -D @types/babel__core
 */

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
    style?: ViewStyle;
  }
  interface TextProps {
    className?: string;
    style?: TextStyle;
  }
  interface ImageProps {
    className?: string;
    style?: ImageStyle;
  }
  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
    contentContainerStyle?: ViewStyle;
  }
  interface FlatListProps<T> {
    className?: string;
    contentContainerClassName?: string;
    contentContainerStyle?: ViewStyle;
  }
}
