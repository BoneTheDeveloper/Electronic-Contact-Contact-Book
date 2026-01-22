# Phase 02: Library Compatibility

## Context Links

- [Research: React 19 Compatibility](../260122-1532-expo-sdk54-upgrade/research/researcher-02-react19-compatibility.md)
- [New Architecture Compatibility](../../apps/mobile/docs/NEW_ARCHITECTURE_COMPATIBILITY.md)

## Overview

Audit and update code for breaking changes in React Navigation 7.x, React Native Paper 6.x, and other libraries.

## Key Insights

- React Navigation 7.x: `navigate()` behavior changed, use `popTo()` for back navigation
- React Native Paper 6.x: Typography components replaced with `<Text variant="">`
- AsyncStorage v1 compatible, no changes required
- All core React Native libraries compatible

## Requirements

- Update all React Navigation usage patterns
- Migrate React Native Paper components to v6 API
- Verify AsyncStorage operations work
- Test all screens for rendering issues

## Architecture

**Component Migration Areas:**

```
Navigation Updates:
├── RootNavigator.tsx - NavigationContainer
├── AuthNavigator.tsx - Stack navigation
├── ParentTabs.tsx - Tab navigation
└── StudentTabs.tsx - Tab navigation

Paper Updates (Typography):
├── All screens using Headline, Title, Subheading, Paragraph, Caption
├── Replace with <Text variant="...">
├── Update BottomNavigation routes API
└── Configure theme version (MD3 default)

Paper Updates (Components):
├── Card, Avatar, Button, TextInput - API changes minimal
├── Surface, Dialog, Portal - verify compatibility
└── ThemeProvider - verify version config
```

## Related Code Files

**Navigation:**
- `apps/mobile/src/navigation/RootNavigator.tsx`
- `apps/mobile/src/navigation/AuthNavigator.tsx`
- `apps/mobile/src/navigation/ParentTabs.tsx`
- `apps/mobile/src/navigation/StudentTabs.tsx`

**Screens (Paper Usage):**
- `apps/mobile/src/screens/parent/Dashboard.tsx`
- `apps/mobile/src/screens/parent/Grades.tsx`
- `apps/mobile/src/screens/parent/Attendance.tsx`
- `apps/mobile/src/screens/auth/LoginScreen.tsx`
- All other screens in `src/screens/`

**Theme:**
- `apps/mobile/src/theme/` - Theme configuration

## Implementation Steps

### 1. React Navigation 7.x Updates

**File: `src/navigation/RootNavigator.tsx`**

No major changes - NavigationContainer API stable.

**Search for `navigate()` usage:**
```bash
cd apps/mobile
grep -r "navigation.navigate(" src/
```

**Fix: Replace deprecated navigate patterns**
```typescript
// Before (may not work as expected in v7)
navigation.navigate('PreviousScreen');

// After
navigation.popTo('PreviousScreen');
```

### 2. React Native Paper 6.x Migration

**Typography Component Replacement:**

```typescript
// Before (Paper 5.x)
import { Headline, Title, Subheading, Paragraph, Caption } from 'react-native-paper';

<Headline>Heading</Headline>
<Title>Title</Title>
<Subheading>Subheading</Subheading>
<Paragraph>Body text</Paragraph>
<Caption>Caption</Caption>

// After (Paper 6.x)
import { Text } from 'react-native-paper';

<Text variant="headlineLarge">Heading</Text>
<Text variant="titleLarge">Title</Text>
<Text variant="titleMedium">Subheading</Text>
<Text variant="bodyLarge">Body text</Text>
<Text variant="bodySmall">Caption</Text>
```

**Create migration helper in `src/theme/paperV6Helpers.ts`:**
```typescript
import { Text } from 'react-native-paper';

// Re-export for gradual migration
export const Typography = {
  Headline: (props: any) => <Text variant="headlineMedium" {...props} />,
  Title: (props: any) => <Text variant="titleLarge" {...props} />,
  Subheading: (props: any) => <Text variant="titleMedium" {...props} />,
  Paragraph: (props: any) => <Text variant="bodyMedium" {...props} />,
  Caption: (props: any) => <Text variant="bodySmall" {...props} />,
};
```

**BottomNavigation Routes API:**

```typescript
// Before
const routes = [
  { key: 'home', title: 'Home', icon: 'home', color: '#0284C7' }
];

// After
const routes = [
  { key: 'home', title: 'Home', focusedIcon: 'home' }
];
```

### 3. Theme Configuration

**Update `src/theme/index.ts`:**
```typescript
import { MD3LightTheme } from 'react-native-paper';

// Paper 6.x uses Material Design 3 by default
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0284C7',
    // ... custom colors
  }
};
```

### 4. Screen-by-Screen Audit

**Audit script:**
```bash
cd apps/mobile
grep -r "from 'react-native-paper'" src/screens/
```

**Replace in each file:**
1. Replace typography imports
2. Replace typography usage
3. Verify component props

### 5. AsyncStorage Verification

**Verify usage patterns:**
```bash
cd apps/mobile
grep -r "AsyncStorage" src/
```

**No changes required - API compatible.**

## Todo List

- [ ] Audit all Navigation.navigate() usage
- [ ] Update navigation patterns to use popTo() where needed
- [ ] Create Paper v6 typography helper
- [ ] Replace typography components in all screens
- [ ] Update BottomNavigation routes API
- [ ] Configure theme for MD3
- [ ] Test AsyncStorage operations
- [ ] Run typecheck

## Success Criteria

- [ ] No deprecated navigation patterns
- [ ] All Paper components use v6 API
- [ ] Theme configured for Material Design 3
- [ ] No TypeScript errors
- [ ] App compiles successfully

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Typography rendering issues | Medium | High | Test all screens thoroughly |
| Navigation state loss | Low | High | Test navigation flows |
| Theme inconsistencies | Low | Medium | Verify all colors/styles |
| Paper 6.x bugs | High | Medium | Monitor GitHub issues |

## Security Considerations

- Verify no sensitive data in AsyncStorage
- Check Paper components handle input validation

## Next Steps

Proceed to Phase 03: New Architecture Config
