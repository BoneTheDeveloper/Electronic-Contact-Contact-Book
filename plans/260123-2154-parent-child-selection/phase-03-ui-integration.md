---
title: "Phase 3: UI Integration"
description: "Connect real child data to dashboard and selection screens"
status: pending
priority: P1
effort: 2h
branch: master
tags: [ui, mobile, react-native, integration]
created: 2026-01-23
---

## Overview

Integrate real child data from parent store into dashboard and child selection UI. Ensure child switching works correctly and data persists.

**Context Links:**
- API Integration: [Phase 2](./phase-02-api-integration.md)
- Dashboard UI: `apps/mobile/src/screens/parent/Dashboard.tsx`
- Child Selection: `apps/mobile/src/screens/parent/ChildSelection.tsx`
- Parent Store: `apps/mobile/src/stores/parent.ts`

## Requirements

### Functional
- Dashboard displays selected child's real info
- Child selection screen shows real children from DB
- Child switching updates dashboard immediately
- Handle loading states during data fetch
- Handle empty states (no children)

### Non-Functional
- Smooth transitions between children
- Loading indicators for async operations
- Error states with user-friendly messages
- Type-safe props passing

## Current UI Implementation

### Dashboard (`Dashboard.tsx`)
```typescript
// Lines 49-51: Already using store correctly
const { children, selectedChildId } = useParentStore();
const selectedChild = children.find(c => c.id === selectedChildId) || children[0];
```
✅ **No changes needed** - already wired to store

### Child Selection (`ChildSelection.tsx`)
```typescript
// Lines 18, 54-84: Already using store correctly
const { children, selectedChildId, setSelectedChildId } = useParentStore();
{children.map((child) => { /* ... */ })}
```
✅ **No changes needed** - already wired to store

## Implementation Steps

### Step 1: Add Loading State to Dashboard (20 min)

Update dashboard to show loading indicator:

```typescript
// apps/mobile/src/screens/parent/Dashboard.tsx
export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { children, selectedChildId, isLoading } = useParentStore();

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  // Loading state
  if (isLoading && children.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.userName}>{user?.name || 'Phụ huynh'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!isLoading && children.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.userName}>{user?.name || 'Phụ huynh'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="account-question" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Không tìm thấy học sinh</Text>
          <Text style={styles.emptyText}>
            Vui lòng liên hệ văn phòng trường để được hỗ trợ.
          </Text>
        </View>
      </View>
    );
  }

  // Rest of component unchanged...
};
```

Add styles:
```typescript
const styles = StyleSheet.create({
  // ... existing styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
```

### Step 2: Add Loading to Child Selection (15 min)

```typescript
// apps/mobile/src/screens/parent/ChildSelection.tsx
export const ChildSelectionScreen: React.FC<ChildSelectionScreenProps> = ({ navigation }) => {
  const { children, selectedChildId, setSelectedChildId, isLoading, error } = useParentStore();
  const [tempSelectedId, setTempSelectedId] = useState(selectedChildId);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chọn con em" onBack={() => navigation?.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>Đang tải danh sách...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (children.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Chọn con em" onBack={() => navigation?.goBack()} />
        <View style={styles.emptyContainer}>
          <Icon name="account-question" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Không tìm thấy học sinh</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Text style={styles.emptyText}>
            Vui lòng liên hệ văn phòng trường để được hỗ trợ.
          </Text>
        </View>
      </View>
    );
  }

  // Rest of component unchanged...
};
```

### Step 3: Ensure Children Load on Auth (25 min)

Update auth flow to trigger loadChildren after parent login:

```typescript
// apps/mobile/src/screens/auth/LoginScreen.tsx or auth store
// After successful parent authentication:

const handleParentLogin = async (phone: string) => {
  try {
    // ... existing auth logic ...

    // Get parent ID and load children
    const parentId = await getParentIdByPhone(phone);

    if (parentId) {
      await loadChildren(parentId);
    }

    // Navigate to dashboard
    navigation.reset({
      index: 0,
      routes: [{ name: 'ParentHome' }],
    });
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Step 4: Verify Child Switching (20 min)

Test child selection flow:

1. Open dashboard → shows primary child
2. Tap child card → opens selection screen
3. Select different child → tap confirm
4. Dashboard updates to new child
5. Restart app → same child selected (persistence)

Add navigation update on child switch:

```typescript
// apps/mobile/src/screens/parent/ChildSelection.tsx
const handleConfirm = async () => {
  if (tempSelectedId) {
    setSelectedChildId(tempSelectedId); // Now persists to AsyncStorage
    navigation?.goBack();

    // Optional: Refresh data that depends on selected child
    // This happens automatically via store subscription
  }
};
```

### Step 5: Update Other Parent Screens (40 min)

Ensure other parent screens use selected child context:

**Attendance.tsx, Grades.tsx, Schedule.tsx, etc.**

```typescript
// Example for Attendance.tsx
export const AttendanceScreen: React.FC = () => {
  const { selectedChildId, children } = useParentStore();
  const selectedChild = children.find(c => c.id === selectedChildId);

  useEffect(() => {
    if (selectedChildId) {
      // Load attendance for selected child
      loadAttendance(selectedChildId);
    }
  }, [selectedChildId]);

  if (!selectedChild) {
    return <EmptyState message="Vui lòng chọn học sinh" />;
  }

  // Rest of component...
};
```

Create reusable hook:
```typescript
// apps/mobile/src/hooks/useSelectedChild.ts
export const useSelectedChild = () => {
  const { selectedChildId, children } = useParentStore();
  const selectedChild = useMemo(
    () => children.find(c => c.id === selectedChildId) || children[0] || null,
    [selectedChildId, children]
  );

  return { selectedChild, selectedChildId, hasChildren: children.length > 0 };
};
```

## Success Criteria

- [ ] Dashboard shows loading indicator on first load
- [ ] Dashboard displays real child data from DB
- [ ] Child selection screen shows real children
- [ ] Switching children updates dashboard immediately
- [ ] Child selection persists after app restart
- [ ] Empty states show helpful messages
- [ ] Error states display user-friendly text
- [ ] All parent screens filter by selected child

## Testing Checklist

- [ ] Parent login → children load automatically
- [ ] Dashboard shows primary child by default
- [ ] Tap child card → selection screen opens
- [ ] Select different child → confirm → dashboard updates
- [ ] Kill app → reopen → same child selected
- [ ] Logout → login → child selection persists
- [ ] Navigate to Grades → shows selected child's grades
- [ ] Navigate to Attendance → shows selected child's attendance
- [ ] Navigate to Schedule → shows selected child's schedule

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Store not updating | Low | Medium | Verify subscriptions work |
| Persistence fails | Low | Low | Fall back to first child |
| Navigation issues | Low | Medium | Test all parent screens |
| Type errors | Low | High | TypeScript compilation |

## Rollback Plan

UI changes are minimal (mostly loading states). To rollback:
1. Comment out loading/empty state code
2. Dashboard/Selection screens revert to existing behavior
3. Store still uses real data (from Phase 2)

## Deliverables

1. Updated `Dashboard.tsx` with loading/empty states
2. Updated `ChildSelection.tsx` with loading/empty states
3. Auth flow integration (`LoginScreen.tsx` or auth store)
4. `useSelectedChild` hook for other screens
5. Updated parent screens (Attendance, Grades, Schedule, etc.)

## Next Phase

Proceed to [Phase 4: Testing](./phase-04-testing.md)
