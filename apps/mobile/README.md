# School Management Mobile App

## Overview

Mobile application for the School Management System built with React Native and Expo.

## Tech Stack

### Core Framework
- React Native 0.81.5
- Expo ~54.0.0
- React 19.1.0

### Navigation
- React Navigation 7.x
- - @react-navigation/native ^7.0.0
- - @react-navigation/native-stack ^7.0.0
- - @react-navigation/bottom-tabs ^7.0.0
- - react-native-screens ~4.20.0
- - react-native-safe-area-context 4.14.0

### UI Components
- React Native Paper 5.14.5 (Material Design)
- react-native-svg 15.8.0

### State & Data
- Zustand 4.5.2 (state management)
- @react-native-async-storage/async-storage 2.2.0

### Development
- expo-dev-client ~6.0.0
- expo-status-bar ~3.0.0
- TypeScript 5.3.3

## New Architecture

This app uses React Native's New Architecture (Fabric + TurboModules) for improved performance.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on web
pnpm web
```

### Scripts

- `pnpm start` - Start Expo development server
- `pnpm dev` - Start with cache cleared
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS device/simulator
- `pnpm web` - Run in web browser
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## Project Structure

```
apps/mobile/
├── app/                 # Expo Router app directory
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── constants/          # App constants
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── assets/             # Images, fonts, etc.
├── docs/               # Documentation
└── scripts/            # Build and utility scripts
```

## Compatibility

See [docs/NEW_ARCHITECTURE_COMPATIBILITY.md](./docs/NEW_ARCHITECTURE_COMPATIBILITY.md) for detailed compatibility information.

## Development Build

To create a development build with New Architecture enabled:

```bash
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios
```

## Troubleshooting

### Metro bundler issues
```bash
pnpm start -- --clear
```

### Type errors
```bash
pnpm typecheck
```

### Clean build
```bash
rm -rf node_modules
rm -rf package-lock.json
pnpm install
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
