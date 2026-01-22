---
title: "React Native Paper to Gluestack UI Migration"
description: "Migrate from React Native Paper v5.14.5 to Gluestack UI v1.1.73 for Fabric/New Architecture compatibility"
status: completed
priority: P1
effort: 12h
branch: master
tags: [ui, migration, fabric, new-architecture, gluestack]
created: 2026-01-22
completed: 2026-01-22
---

# React Native Paper → Gluestack UI Migration Plan

## Problem Statement

React Native Paper v5.14.5 is incompatible with React Native 0.81.5 + New Architecture (Fabric), causing:
```
TypeError: expected dynamic type 'boolean', but had type 'string'
```

## Solution

Migrate to **Gluestack UI v3.0.0** with NativeWind v4, fully compatible with Fabric.

---

## Phase 1: Setup & Configuration (2h)

### 1.1 Install Dependencies
```bash
cd apps/mobile
pnpm remove react-native-paper
pnpm add nativewind tailwindcss@3.4.0 @gluestack-ui/themed@^1.1.73
pnpm add -D @babel/plugin-proposal-decorators
```

**Files:**
- `apps/mobile/package.json`

### 1.2 Configure Babel
Update `apps/mobile/babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

### 1.3 Configure Metro Bundler
Update `apps/mobile/metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

### 1.4 Create Tailwind Config
Create `apps/mobile/tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './src/**/**/*.{js,jsx,ts,tsx}',
    './app/**/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0284C7',
        'primary-light': '#38BDF8',
        'primary-dark': '#0369A1',
        'light-blue': '#E0F2FE',
        secondary: '#64748B',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        'custom-28': '28px',
      },
      fontFamily: {
        sans: ['Inter'],
      },
    },
  },
};
```

### 1.5 Create Global CSS
Create `apps/mobile/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.6 Update App Entry Point
Update `apps/mobile/App.tsx`:
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { RootNavigator } from './src/navigation';
import { useUIStore } from './src/stores';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css'; // Import global CSS

const App: React.FC = () => {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <RootNavigator />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
};

export default App;
```

### 1.7 Remove React Native Paper Theme
Delete `apps/mobile/src/theme/theme.ts` (replaced by Tailwind config)

---

## Phase 2: Component Mapping Strategy (1h)

### Paper → Gluestack Component Map

| Paper Component | Gluestack UI | NativeWind Alternative |
|----------------|--------------|----------------------|
| `Button` | `Button` | `Pressable` + `className` |
| `TextInput` | `Input` | `TextInput` + `className` |
| `Avatar` | `Avatar` | `View` + `className` |
| `Avatar.Image` | `Avatar` + `Image` | `Image` + `className` |
| `Avatar.Text` | `Avatar` | `View` + `className` |
| `Card` | `Box` | `View` + `className` |
| `Card.Content` | `VStack` | `View` + `className` |
| `Chip` | `Badge` | `View` + `className` |
| `Text` | `Text` | `Text` + `className` |
| `Divider` | `Divider` | `View` + `h-px bg-gray-200` |
| `Modal` | `Modal` + `AlertDialog` | `Modal` |
| `Portal` | `Portal` | Built-in |
| `ActivityIndicator` | `Spinner` | `ActivityIndicator` |
| `ProgressBar` | `Progress` | Custom |
| `RadioButton` | `RadioGroup` | Custom |
| `Badge` | `Badge` | `View` + `absolute` |

### Common Pattern Transformations

**Paper Button:**
```typescript
// Before
<Button mode="contained" onPress={handlePress}>
  Submit
</Button>

// After (Gluestack)
<Button onPress={handlePress}>
  <ButtonText>Submit</ButtonText>
</Button>

// After (NativeWind)
<Pressable className="bg-primary rounded-lg p-3" onPress={handlePress}>
  <Text className="text-white font-medium text-center">Submit</Text>
</Pressable>
```

**Paper TextInput:**
```typescript
// Before
<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
/>

// After (Gluestack)
<Input>
  <InputField
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
  />
</Input>

// After (NativeWind)
<TextInput
  className="border border-gray-300 rounded-lg p-3 bg-white"
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
/>
```

**Paper Card:**
```typescript
// Before
<Card>
  <Card.Content>
    <Text variant="titleLarge">Title</Text>
    <Text variant="bodyMedium">Content</Text>
  </Card.Content>
</Card>

// After (Gluestack)
<Box bg="$white" borderRadius="$lg" p="$4">
  <Text fontSize="$xl" fontWeight="$bold">Title</Text>
  <Text>Content</Text>
</Box>

// After (NativeWind)
<View className="bg-white rounded-2xl p-4 shadow-sm">
  <Text className="text-xl font-bold">Title</Text>
  <Text className="text-base">Content</Text>
</View>
```

**Paper Avatar:**
```typescript
// Before
<Avatar.Text label="JD" size={40} />
<Avatar.Image source={{ uri: avatarUrl }} size={40} />

// After (Gluestack)
<Avatar size="md">
  <AvatarFallbackText>JD</AvatarFallbackText>
</Avatar>

// After (NativeWind)
<View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
  <Text className="text-white font-medium">JD</Text>
</View>
```

**Paper Chip:**
```typescript
// Before
<Chip mode="flat" textStyle={{ color: '#0284C7' }}>
  Paid
</Chip>

// After (Gluestack)
<Badge bg="$lightBlue">
  <BadgeText color="$primary">Paid</BadgeText>
</Badge>

// After (NativeWind)
<View className="bg-light-blue px-3 py-1 rounded-full">
  <Text className="text-primary text-sm">Paid</Text>
</View>
```

---

## Phase 3: Migration by Screen (6h)

### 3.1 Auth Screens (Priority: CRITICAL)

**Files to migrate:**
- `src/screens/auth/CustomLoginScreen.tsx` (5 Paper components)
- `src/screens/auth/LoginScreen.tsx` (4 Paper components)

**Migration Steps:**
1. Replace `Text`, `TextInput`, `Button`, `Avatar`, `Portal`, `Modal`, `ActivityIndicator`
2. Convert StyleSheet to Tailwind classes
3. Test authentication flow

**Key Changes for CustomLoginScreen:**
```typescript
// Remove
import { Text, TextInput, Button, Avatar, Portal, Modal, ActivityIndicator } from 'react-native-paper';

// Add (Gluestack)
import { Button, ButtonText, Input, InputField, Text, Avatar, AvatarFallbackText, Modal, ModalBackdrop, ModalContent, Spinner } from '@gluestack-ui/themed';

// OR (NativeWind - PREFERRED for simplicity)
import { Text, TextInput, Pressable, View, Modal, ActivityIndicator } from 'react-native';
```

### 3.2 Parent Screens (Priority: HIGH)

**Files to migrate:**
1. `src/screens/parent/Dashboard.tsx` (3 components: Text, Avatar, Card)
2. `src/screens/parent/PaymentDetail.tsx` (5 components: Text, Card, Button, Chip, Divider)
3. `src/screens/parent/PaymentOverview.tsx` (3 components)
4. `src/screens/parent/PaymentMethod.tsx` (4 components: Text, Card, RadioButton, Button)
5. `src/screens/parent/PaymentReceipt.tsx` (4 components: Text, Card, Button, Divider)
6. `src/screens/parent/Schedule.tsx` (3 components: Text, Card, Chip)
7. `src/screens/parent/Attendance.tsx` (3 components: Text, Card, Chip)
8. `src/screens/parent/Grades.tsx` (3 components: Text, Card, Chip)
9. `src/screens/parent/LeaveRequest.tsx` (5 components: Text, Card, TextInput, Button, Chip)
10. `src/screens/parent/TeacherFeedback.tsx` (5 components)
11. `src/screens/parent/TeacherDirectory.tsx` (4 components: Text, Card, Avatar, Divider)
12. `src/screens/parent/News.tsx` (4 components: Text, Card, Chip, Avatar)
13. `src/screens/parent/Notifications.tsx` (4 components: Text, Card, Avatar, Divider)
14. `src/screens/parent/Messages.tsx` (4 components: Text, Card, Avatar, Badge)
15. `src/screens/parent/Summary.tsx` (4 components: Text, Card, ProgressBar, Chip)

### 3.3 Student Screens (Priority: MEDIUM)

**Files to migrate:**
1. `src/screens/student/Dashboard.tsx` (2 components: Text, Avatar)
2. `src/screens/student/StudentScreens.tsx` (6 components: Text, Card, Chip, Button, Avatar, Divider)

### 3.4 Navigation Components (Priority: MEDIUM)

**Files to migrate:**
- `src/navigation/ParentTabs.tsx` - Check for Paper usage
- `src/navigation/StudentTabs.tsx` - Check for Paper usage
- `src/navigation/AuthNavigator.tsx` - Check for Paper usage
- `src/navigation/RootNavigator.tsx` - Check for Paper usage

---

## Phase 4: Testing & Verification (2h)

### 4.1 Fabric Compatibility Test
```bash
# Clear cache
npx expo start --clear

# Test on iOS Simulator
npx expo run:ios

# Test on Android Emulator
npx expo run:android
```

**Verification Checklist:**
- [ ] No more `TypeError: expected dynamic type 'boolean'` errors
- [ ] All screens render without crashes
- [ ] Modal/Portal components work correctly
- [ ] Touch interactions respond properly

### 4.2 Visual Regression Test
Compare migrated UI against wireframes in `docs/wireframe/Mobile/`:

**Key Design Tokens to Verify:**
- Primary color: `#0284C7` (sky blue) ✓
- Light blue: `#E0F2FE` ✓
- Border radius: `rounded-2xl`, `rounded-3xl`, `rounded-[28px]` ✓
- Typography: Inter font ✓
- Card shadows: `shadow-sm`, `shadow-md` ✓
- Spacing: Consistent padding/margins ✓

### 4.3 Platform Testing
- [ ] iOS rendering
- [ ] Android rendering
- [ ] Dark mode toggle (if supported)
- [ ] Navigation transitions
- [ ] Modal presentations

### 4.4 Performance Testing
```bash
# Test bundle size
npx expo export

# Measure render performance
# Use React DevTools Profiler
```

---

## Phase 5: Cleanup (1h)

### 5.1 Remove Unused Files
```bash
# Remove React Native Paper theme
rm apps/mobile/src/theme/theme.ts

# Remove any Paper-specific type definitions
# Check for @types/react-native-paper in package.json
```

### 5.2 Update Documentation
Update `README.md`:
```diff
- React Native Paper 5.x (Material Design)
+ Gluestack UI 3.x + NativeWind v4 (Tailwind CSS)
```

Update `CLAUDE.md`:
- Remove React Native Paper references
- Add Gluestack UI guidelines
- Update component patterns

### 5.3 Type Safety Check
```bash
cd apps/mobile
pnpm typecheck
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking changes in component API | HIGH | Use NativeWind patterns for flexibility |
| Visual inconsistencies | MEDIUM | Reference wireframes strictly |
| Navigation integration issues | LOW | React Navigation unchanged |
| Performance degradation | LOW | Gluestack is Fabric-optimized |
| Dark mode breakage | MEDIUM | Test mode switching early |

---

## Rollback Strategy

If migration fails:
```bash
cd apps/mobile
git checkout HEAD -- package.json
pnpm install
git checkout HEAD -- src/
```

---

## Post-Migration Benefits

✅ **Fabric Compatibility** - Full React Native 0.81.5 + New Architecture support
✅ **Tailwind CSS** - Consistent styling with web app
✅ **Smaller Bundle** - Remove Paper dependency
✅ **Better Performance** - Fabric-native components
✅ **Modern DX** - CSS-like utility classes

---

## Unresolved Questions

1. **Icon Library**: What icon system should replace Material Icons? (React Native Vector Icons, Ionicons, or Lucide?)
2. **Animation**: Should we use `react-native-reanimated` for animations, or Gluestack's built-in animations?
3. **Form Validation**: Should we integrate `react-hook-form` + `zod` during migration?
4. **Testing**: Should we add @testing-library/react-native tests during migration?
5. **Dark Mode**: Is full dark mode support required, or light-only sufficient?

---

## References

- [Gluestack UI React Native Docs](https://gluestack.io/ui/docs/native/rn/overview)
- [NativeWind v4 Documentation](https://www.nativewind.dev/)
- [React Native 0.81 Fabric Docs](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [Wireframe Design System](../../docs/wireframe/Mobile/)
