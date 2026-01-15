# Tech Stack - Mobile EContact Mock UI

## Project Overview
Mobile mock UI for school econtact app targeting students and parents. Built with React Native for iOS/Android compatibility.

## Core Technologies

### Frontend Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | latest | React Native development tooling |
| **React Native** | latest | Cross-platform mobile framework |
| **TypeScript** | latest | Type safety and developer experience |

### Navigation & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Navigation** | v6+ | Screen navigation (Stack, Tab) |
| **React Native Paper** | latest | Material Design components |
| **React Native Vector Icons** | latest | Icon library |

### State & Data
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | latest | Lightweight state management |
| **Context API** | built-in | Global state (auth, theme) |
| **Axios** | latest | HTTP client (future API integration) |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | latest | Code linting |
| **Prettier** | latest | Code formatting |
| **TypeScript** | latest | Static typing |

## Design System

### Colors (Professional/Academic)
```typescript
const colors = {
  primary: '#1e88e5',      // Trust, focus
  primaryLight: '#42a5f5', // Lighter variant
  secondary: '#43a047',    // Growth, harmony
  success: '#4caf50',      // Positive feedback
  warning: '#ff9800',      // Warnings
  error: '#f44336',        // Errors, alerts
  info: '#2196f3',         // Information
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#212121',
  textSecondary: '#757575',
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
mobile_mock_ui/
├── assets/
│   ├── icons/           # PNG/SVG icons
│   ├── images/          # Logo, avatars
│   └── styles/          # Theme, colors config
├── mock_data/           # JSON mock data files
│   ├── users.json
│   ├── academic.json
│   ├── attendance.json
│   ├── grades.json
│   ├── notifications.json
│   └── fees.json
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation config
│   ├── store/           # Zustand stores
│   ├── services/        # Data services
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── App.tsx              # Root component
└── package.json
```

## MVP Screens (Phase 1)

1. **Auth Screen** - Login mock
2. **Dashboard** - Overview of grades, attendance, notifications
3. **Profile** - Student/parent info
4. **Grades** - Subject-wise grades with trends
5. **Attendance** - Calendar view with attendance records
6. **Notifications** - Categorized alerts
7. **Fees** - Payment status and history

## Future Enhancements (Iterative)

- Class schedule
- Assignment tracker
- Library portal
- Parent-child linking
- Push notifications
- Payment gateway integration
