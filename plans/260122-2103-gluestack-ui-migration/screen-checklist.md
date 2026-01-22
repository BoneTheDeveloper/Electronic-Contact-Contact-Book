# Screen Migration Checklist

## Paper Components Inventory

Total files using React Native Paper: **21 files**

### Auth Screens (2 files)

- [ ] **CustomLoginScreen.tsx**
  - Components: Text, TextInput, Button, Avatar, Portal, Modal, ActivityIndicator (7)
  - Complexity: HIGH (multi-screen flow, modals, forms)
  - Priority: CRITICAL
  - Est. time: 45min

- [ ] **LoginScreen.tsx**
  - Components: TextInput, Button, Text, useTheme (4)
  - Complexity: MEDIUM (form, theme usage)
  - Priority: MEDIUM
  - Est. time: 30min

### Parent Screens (15 files)

- [ ] **Dashboard.tsx**
  - Components: Text, Avatar, Card (3)
  - Complexity: MEDIUM (grid layout, service icons)
  - Priority: HIGH (main screen)
  - Est. time: 30min

- [ ] **PaymentDetail.tsx**
  - Components: Text, Card, Button, Chip, Divider (5)
  - Complexity: MEDIUM (invoice details, status chips)
  - Priority: HIGH
  - Est. time: 35min

- [ ] **PaymentOverview.tsx**
  - Components: Text, Card, Chip (3)
  - Complexity: MEDIUM (list, filters)
  - Priority: HIGH
  - Est. time: 30min

- [ ] **PaymentMethod.tsx**
  - Components: Text, Card, RadioButton, Button (4)
  - Complexity: MEDIUM (radio groups)
  - Priority: HIGH
  - Est. time: 35min

- [ ] **PaymentReceipt.tsx**
  - Components: Text, Card, Button, Divider (4)
  - Complexity: LOW (static content)
  - Priority: MEDIUM
  - Est. time: 25min

- [ ] **Schedule.tsx**
  - Components: Text, Card, Chip (3)
  - Complexity: MEDIUM (timeline)
  - Priority: MEDIUM
  - Est. time: 30min

- [ ] **Attendance.tsx**
  - Components: Text, Card, Chip (3)
  - Complexity: MEDIUM (calendar grid)
  - Priority: MEDIUM
  - Est. time: 30min

- [ ] **Grades.tsx**
  - Components: Text, Card, Chip (3)
  - Complexity: MEDIUM (grade cards)
  - Priority: MEDIUM
  - Est. time: 30min

- [ ] **LeaveRequest.tsx**
  - Components: Text, Card, TextInput, Button, Chip (5)
  - Complexity: HIGH (form, multi-step)
  - Priority: MEDIUM
  - Est. time: 40min

- [ ] **TeacherFeedback.tsx**
  - Components: Text, Card, Avatar, Divider, Chip (5)
  - Complexity: MEDIUM (list, avatars)
  - Priority: MEDIUM
  - Est. time: 30min

- [ ] **TeacherDirectory.tsx**
  - Components: Text, Card, Avatar, Divider (4)
  - Complexity: LOW (directory list)
  - Priority: LOW
  - Est. time: 25min

- [ ] **News.tsx**
  - Components: Text, Card, Chip, Avatar (4)
  - Complexity: MEDIUM (news cards)
  - Priority: LOW
  - Est. time: 30min

- [ ] **Notifications.tsx**
  - Components: Text, Card, Avatar, Divider (4)
  - Complexity: LOW (notification list)
  - Priority: LOW
  - Est. time: 25min

- [ ] **Messages.tsx**
  - Components: Text, Card, Avatar, Badge (4)
  - Complexity: MEDIUM (message threads)
  - Priority: LOW
  - Est. time: 30min

- [ ] **Summary.tsx**
  - Components: Text, Card, ProgressBar, Chip (4)
  - Complexity: MEDIUM (charts, progress)
  - Priority: MEDIUM
  - Est. time: 35min

### Student Screens (2 files)

- [ ] **Student/Dashboard.tsx**
  - Components: Text, Avatar (2)
  - Complexity: LOW
  - Priority: MEDIUM
  - Est. time: 20min

- [ ] **Student/StudentScreens.tsx**
  - Components: Text, Card, Chip, Button, Avatar, Divider (6)
  - Complexity: MEDIUM (multiple screens)
  - Priority: MEDIUM
  - Est. time: 35min

### Navigation Components (4 files)

- [ ] **ParentTabs.tsx**
  - Check for Paper usage
  - Est. time: 10min

- [ ] **StudentTabs.tsx**
  - Check for Paper usage
  - Est. time: 10min

- [ ] **AuthNavigator.tsx**
  - Check for Paper usage
  - Est. time: 10min

- [ ] **RootNavigator.tsx**
  - Check for Paper usage
  - Est. time: 10min

### Theme Files (1 file)

- [ ] **theme/theme.ts**
  - Action: DELETE (replaced by Tailwind config)
  - Est. time: 5min

### App Entry Point (1 file)

- [ ] **App.tsx**
  - Replace PaperProvider with GluestackUIProvider
  - Import global.css
  - Est. time: 15min

---

## Component Usage Summary

| Component | Usage Count | Files |
|-----------|-------------|-------|
| Text | 21 | All screens |
| Card | 15 | Most parent/student screens |
| Chip | 9 | Status indicators, filters |
| Avatar | 7 | User profile, teacher directory |
| Button | 7 | Forms, actions |
| Divider | 6 | Section separators |
| TextInput | 3 | Auth, LeaveRequest |
| Modal | 1 | CustomLoginScreen |
| Portal | 1 | CustomLoginScreen |
| ActivityIndicator | 1 | CustomLoginScreen |
| ProgressBar | 1 | Summary |
| RadioButton | 1 | PaymentMethod |
| Badge | 1 | Messages |

---

## Migration Order Strategy

### Wave 1: Critical Path (Day 1 - 2h)
1. App.tsx - Setup Gluestack provider
2. theme/theme.ts - Remove
3. CustomLoginScreen.tsx - Auth flow
4. Dashboard.tsx - Main entry point

### Wave 2: High Priority (Day 2 - 3h)
5. PaymentDetail.tsx
6. PaymentOverview.tsx
7. PaymentMethod.tsx
8. Schedule.tsx
9. Attendance.tsx

### Wave 3: Medium Priority (Day 3 - 2.5h)
10. Grades.tsx
11. LeaveRequest.tsx
12. TeacherFeedback.tsx
13. Summary.tsx
14. News.tsx
15. Messages.tsx

### Wave 4: Low Priority (Day 4 - 1h)
16. PaymentReceipt.tsx
17. TeacherDirectory.tsx
18. Notifications.tsx
19. Student/Dashboard.tsx
20. Student/StudentScreens.tsx
21. Navigation components

---

## Testing Checklist per Screen

After migrating each screen, verify:

- [ ] Screen renders without errors
- [ ] All text is visible
- [ ] Buttons are pressable
- [ ] Forms accept input
- [ ] Modals open/close correctly
- [ ] Navigation works
- [ ] Styling matches wireframe
- [ ] No TypeScript errors
- [ ] Platform-specific rendering (iOS/Android)
- [ ] Dark mode toggle (if applicable)

---

## Migration Template

### Before Migration

```typescript
// File: src/screens/parent/ExampleScreen.tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { colors } from '../../theme';

const ExampleScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Title</Text>
          <Text variant="bodyMedium">Content</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Action</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    margin: 16,
    borderRadius: 12,
  },
});

export default ExampleScreen;
```

### After Migration (NativeWind)

```typescript
// File: src/screens/parent/ExampleScreen.tsx
import React from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';

const ExampleScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="m-4 bg-white rounded-2xl p-4 shadow-sm">
        <Text className="text-xl font-bold mb-2">Title</Text>
        <Text className="text-base text-gray-700 mb-4">Content</Text>
        <Pressable className="bg-primary rounded-xl p-4">
          <Text className="text-white font-semibold text-center">Action</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ExampleScreen;
```

### Migration Steps

1. **Remove Paper imports**
   ```diff
   - import { Text, Card, Button } from 'react-native-paper';
   - import { colors } from '../../theme';
   + // No imports needed for Text
   ```

2. **Replace StyleSheet with className**
   ```diff
   - style={styles.container}
   + className="flex-1 bg-white"
   ```

3. **Replace Paper components**
   ```diff
   - <Card style={styles.card}>
   -   <Card.Content>
   + <View className="m-4 bg-white rounded-2xl p-4 shadow-sm">
   ```

4. **Update Text variants**
   ```diff
   - <Text variant="titleLarge">Title</Text>
   + <Text className="text-xl font-bold">Title</Text>
   - <Text variant="bodyMedium">Content</Text>
   + <Text className="text-base text-gray-700">Content</Text>
   ```

5. **Update Buttons**
   ```diff
   - <Button mode="contained">Action</Button>
   + <Pressable className="bg-primary rounded-xl p-4">
   +   <Text className="text-white font-semibold text-center">Action</Text>
   + </Pressable>
   ```

6. **Remove StyleSheet**
   ```diff
   - const styles = StyleSheet.create({...});
   ```

---

## Quick Conversion Commands

### Find Paper usage
```bash
cd apps/mobile
grep -r "from 'react-native-paper'" src/
grep -r "from \"react-native-paper\"" src/
```

### Find StyleSheet usage (to convert to Tailwind)
```bash
cd apps/mobile
grep -r "StyleSheet.create" src/
```

### Count components per file
```bash
cd apps/mobile
for file in src/screens/**/*.tsx; do
  echo "=== $file ==="
  grep -o "import.*from 'react-native-paper'" "$file" | wc -l
done
```
