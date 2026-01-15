---
title: "Phase 02A: Mobile Core Infrastructure"
description: "Setup Expo app with navigation, state management, and design system"
status: completed
priority: P1
effort: 4h
created: 2026-01-12
completed: 2026-01-12
---

# Phase 02A: Mobile Core Infrastructure

## Context Links
- Parent: [plan.md](./plan.md)
- Depends: [phase-01](./phase-01-project-setup.md)
- Research: [mobile-architecture](./research/researcher-mobile-architecture.md)
- Docs: [design-guidelines](../../docs/design-guidelines.md)

## Parallelization Info
- **Can run with**: Phase 02B (Web Core), Phase 02C (Database)
- **Must complete before**: Phase 03 (Shared UI), Phase 04A (Mobile Features)
- **Exclusive files**: `apps/mobile/*` only

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Expo app with React Navigation v6, Zustand, React Native Paper |
| Review Status | Not Started |

## Key Insights
- Bottom tab nav for main sections, stack nav for screen flows
- Zustand stores: auth, student, parent, ui
- React Native Paper with custom theme (#0284C7 primary)

## Requirements
- Expo SDK ~50
- React Navigation v6
- Zustand v4
- React Native Paper v5
- TypeScript strict mode

## Architecture

### App Structure
```
apps/mobile/
├── app.json                  # Expo config
├── App.tsx                   # Root entry
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── ParentTabs.tsx
│   │   └── StudentTabs.tsx
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── student.ts
│   │   ├── parent.ts
│   │   └── ui.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   ├── screens/
│   │   ├── auth/
│   │   ├── parent/
│   │   └── student/
│   └── mock-data/
│       └── index.ts
```

### Navigation Hierarchy
```
RootNavigator (Auth check)
├── AuthStack
│   ├── Login
│   └── RoleSelection
├── ParentTabs
│   ├── HomeStack (Dashboard, child selection)
│   ├── AcademicStack (Schedule, grades, attendance)
│   ├── PaymentStack (Overview, detail, receipt)
│   ├── CommStack (Messages, notifications, news)
│   └── MoreStack (Teacher contacts, feedback, profile)
└── StudentTabs
    └── Dashboard
```

## File Ownership

### Files to Create (Exclusive to 02A)
| File | Owner |
|------|-------|
| `apps/mobile/app.json` | Phase 02A |
| `apps/mobile/App.tsx` | Phase 02A |
| `apps/mobile/package.json` | Phase 02A |
| `apps/mobile/tsconfig.json` | Phase 02A |
| `apps/mobile/src/navigation/*` | Phase 02A |
| `apps/mobile/src/stores/*` | Phase 02A |
| `apps/mobile/src/theme/*` | Phase 02A |
| `apps/mobile/src/screens/auth/*` | Phase 02A |
| `apps/mobile/src/mock-data/index.ts` | Phase 02A |

## Implementation Steps

1. **Initialize Expo App**
   ```bash
   npx create-expo-app@latest apps/mobile --template blank-typescript
   cd apps/mobile
   ```

2. **Install Dependencies**
   ```bash
   npx expo install react-native-screens react-native-safe-area-context
   npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
   npm install zustand react-native-paper react-native-vector-icons
   npm install @react-native-async-storage/async-storage
   ```

3. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "EContact School",
       "slug": "econtact-school",
       "version": "1.0.0",
       "orientation": "portrait",
       "splash": { "image": "./assets/splash.png" }
     }
   }
   ```

4. **Create Theme** (src/theme/theme.ts)
   ```typescript
   import { MD3LightTheme } from 'react-native-paper';
   import { colors } from './colors';

   export const theme = {
     ...MD3LightTheme,
     colors: {
       ...MD3LightTheme.colors,
       primary: colors.primary,
       secondary: colors.secondary,
     }
   };
   ```

5. **Create Zustand Stores**
   ```typescript
   // src/stores/auth.ts
   import { create } from 'zustand';

   interface AuthState {
     user: User | null;
     login: (email: string, password: string) => Promise<void>;
     logout: () => void;
   }

   export const useAuthStore = create<AuthState>((set) => ({
     user: null,
     login: async (email, password) => { /* mock impl */ },
     logout: () => set({ user: null })
   }));
   ```

6. **Setup Navigation**
   ```typescript
   // src/navigation/RootNavigator.tsx
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';

   export function RootNavigator() {
     const { user } = useAuthStore();
     return (
       <NavigationContainer>
         <Stack.Navigator>
           {user ? <Stack.Screen name="App" component={AppTabs} /> : <Stack.Screen name="Auth" component={AuthStack} />}
         </Stack.Navigator>
       </NavigationContainer>
     );
   }
   ```

7. **Create Auth Screens**
   - Login screen with email/password
   - Mock authentication (accept any credentials)
   - Store user in AsyncStorage

8. **Setup Mock Data Loader**
   ```typescript
   // src/mock-data/index.ts
   import mockStudents from './students.json';
   import mockGrades from './grades.json';

   export const loadMockData = async () => ({
     students: mockStudents,
     grades: mockGrades
   });
   ```

## Todo List
- [x] Initialize Expo app
- [x] Install navigation dependencies
- [x] Install Zustand and Paper
- [x] Create theme files
- [x] Setup navigation structure
- [x] Create auth store
- [x] Create student/parent stores
- [x] Build login screen
- [x] Setup mock data loader
- [x] Test navigation flow

## Success Criteria
- Expo dev server starts: `npx expo start`
- Login screen renders
- Navigation between tabs works
- Theme applied (#0284C7 visible)
- Mock data loads from JSON

## Conflict Prevention
- Exclusive ownership of `apps/mobile/*`
- No overlap with Phase 02B (different directory)
- Shared types consumed from `packages/shared-types`

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Expo SDK version conflicts | Lock to SDK ~50 |
| Navigation type errors | Strict navigation typing |
| AsyncStorage async issues | Proper await handling |

## Security Considerations
- Mock auth accepts any credentials (document this!)
- No token validation (MVP only)
- Secure passwords not needed for demo

## Next Steps
- Phase 03 (Shared UI) - may share components
- Phase 04A (Mobile Features) - builds screens on this foundation
