# Tech Stack - Mobile EContact App

## Project Overview
Mobile application for school econtact system targeting parents and students. Built with React Native and Expo for iOS/Android compatibility. Custom React Navigation implementation with Material Design components.

## Core Technologies

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | ~54.0.0 | React Native development tooling |
| **React Native** | 0.81.0 | Cross-platform mobile framework |
| **TypeScript** | ^5.3.3 | Type safety and developer experience |

### Navigation & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Navigation** | ^7.0.0 | Screen navigation (Stack, Tab) |
| **React Native Paper** | ^5.11.3 | Material Design components |
| **React Native Vector Icons** | ^10.0.3 | Icon library |
| **React Native SVG** | ^15.15.1 | SVG rendering |

### State & Data
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | ^4.4.7 | Lightweight state management |
| **Context API** | built-in | Global state (auth, theme) |
| **AsyncStorage** | ^1.21.0 | Persistent storage |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | ^6.0.0 | Code linting |
| **TypeScript ESLint** | ^6.0.0 | TypeScript linting |
| **TypeScript** | ^5.3.3 | Static typing |

## Design System

### Colors (Sky Blue Theme - #0284C7)
```typescript
const colors = {
  primary: '#0284C7',      // Main brand color
  primaryDark: '#075985',  // Gradient end, hover states
  primaryLight: '#E0F2FE', // Background highlights
  secondary: '#10B981',     // Success, positive actions
  warning: '#F59E0B',      // Warnings, pending items
  error: '#EF4444',        // Errors, critical issues
  background: '#ffffff',
  surface: '#f3f4f6',
  text: '#111827',
  textSecondary: '#6B7280',
}
```

### Typography
```typescript
const typography = {
  fontFamily: 'Roboto',
  h1: { fontSize: 32, fontWeight: '600' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '500' },
  body: { fontSize: 16, fontWeight: '400' },
  bodySmall: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
}
```

### Icon Standards
- **Size**: 24dp for all icons
- **Style**: Material Design icons
- **Color**: Monochromatic, matching context

## Project Structure

```
apps/mobile/
├── assets/                    # Images, icons, logos
│   ├── icon.png               # App icon
│   ├── splash.png             # Splash screen
│   └── README.md              # Asset instructions
├── src/
│   ├── components/            # Reusable UI components
│   ├── screens/               # Screen components
│   ├── navigation/            # Navigation configs
│   ├── stores/                # Zustand stores
│   ├── mock-data/             # Mock data files
│   └── utils/                 # Helper functions
├── App.tsx                    # Root component & navigation
├── package.json               # Dependencies & scripts
├── app.json                   # Expo configuration
└── tsconfig.json              # TypeScript config
```

## Current Implementation Status

### Completed Components
1. **Navigation Structure** - Custom React Navigation setup
2. **Mock Authentication** - Role-based login (parent/student)
3. **Dashboard Layout** - 9 service icon grid
4. **Theme System** - Sky blue (#0284C7) with Material Design

### Phase 1 Screens (In Progress)
1. **Auth Screen** - Login with role selection
2. **Dashboard** - Overview with service icons
3. **Schedule** - Calendar and class schedule
4. **Grades** - Academic performance tracking
5. **Attendance** - Daily/weekly attendance records

### Planned Features (Phase 2)
- **Messages** - Teacher communication
- **Notifications** - Push notifications
- **News** - School announcements
- **Teachers** - Teacher directory
- **Leave Requests** - Absence management

## Development Environment

### Scripts
```json
{
  "start": "expo start",
  "dev": "expo start --clear",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "eslint . --ext .ts,.tsx",
  "typecheck": "tsc --noEmit"
}
```

### Important Notes
- **Expo SDK 54+ Requirement**: Now requires development builds (EAS) - Expo Go no longer supports this version
- **Development Builds**: Use `npx expo install` for dependencies, then `npx eas build` for production builds
- **Development Build Installation**: After creating a development build, use Expo Go to open the QR code for installation

### Entry Point Configuration
- **Main**: `./App.tsx` (Custom navigation)
- **Asset Bundle**: `**/*` (All files in assets directory)
- **Platform**: iOS/Android/Web support

## Future Enhancements

### Phase 2: Backend Integration
- Real API endpoints (replace mock data)
- Authentication service integration
- Push notifications (Expo Notifications)

### Phase 3: Advanced Features
- Parent-child account linking
- Class schedule with reminders
- Assignment tracker with deadlines
- Fee payment integration

### Phase 4: Production Readiness
- Offline mode support
- Biometric authentication
- Dark theme support
- Performance optimization
