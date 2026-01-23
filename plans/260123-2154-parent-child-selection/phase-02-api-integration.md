---
title: "Phase 2: API Integration"
description: "Create Supabase queries to fetch parent's children from database"
status: pending
priority: P1
effort: 1.5h
branch: master
tags: [api, supabase, typescript, mobile]
created: 2026-01-23
---

## Overview

Create real Supabase queries to replace mock data in parent store, enabling fetch of parent's actual children from database.

**Context Links:**
- Database Setup: [Phase 1](./phase-01-database-setup.md)
- Current Store: `apps/mobile/src/stores/parent.ts`
- Test Parent UUID from Phase 1

## Requirements

### Functional
- Query `student_guardians` + `students` + `profiles` tables
- Return structured child data matching `ChildData` interface
- Handle empty results (no children)
- Handle errors gracefully

### Non-Functional
- Type-safe with TypeScript
- Efficient query with proper joins
- Error handling for network/auth failures
- Compatible with existing store interface

## Current Implementation (Mock)

```typescript
// apps/mobile/src/stores/parent.ts (lines 65-101)
loadChildren: async (parentId: string) => {
  set({ isLoading: true, error: null });
  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    const mockChildren: ChildData[] = [ /* mock data */ ];
    set({ children: mockChildren, isLoading: false });
  } catch (error) { /* error handling */ }
}
```

## Implementation Steps

### Step 1: Create Supabase Client Module (20 min)

Create `apps/mobile/src/lib/supabase/queries.ts` (if not exists):

```typescript
import { supabase } from './client';

export interface ChildData {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
  studentCode: string;
  isPrimary?: boolean;
  avatarUrl?: string;
}

/**
 * Fetch all children for a given parent
 * @param parentId - UUID from parents table
 * @returns Array of child data
 */
export const getParentChildren = async (
  parentId: string
): Promise<ChildData[]> => {
  const { data, error } = await supabase
    .from('student_guardians')
    .select(`
      student_id,
      is_primary,
      students!inner(
        id,
        student_code,
        grade,
        section,
        class_id,
        profiles!inner(
          full_name,
          avatar_url
        )
      )
    `)
    .eq('guardian_id', parentId)
    .eq('students.profiles.status', 'active');

  if (error) {
    console.error('Error fetching children:', error);
    throw new Error(`Failed to load children: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((item: any) => ({
    id: item.students.id,
    name: item.students.profiles.full_name,
    rollNumber: item.students.student_code,
    classId: item.students.class_id || '',
    section: item.students.section || '',
    grade: item.students.grade || 0,
    studentCode: item.students.student_code,
    isPrimary: item.is_primary,
    avatarUrl: item.students.profiles.avatar_url,
  }));
};

/**
 * Get parent ID from profile phone/email
 * @param phone - Parent phone number
 * @returns Parent UUID
 */
export const getParentIdByPhone = async (
  phone: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('parents')
    .select('id')
    .eq('phone', phone)
    .single();

  if (error || !data) {
    console.error('Error finding parent:', error);
    return null;
  }

  return data.id;
};
```

### Step 2: Update Parent Store (30 min)

Modify `apps/mobile/src/stores/parent.ts`:

```typescript
import { getParentChildren, getParentIdByPhone } from '../../lib/supabase/queries';

// In ParentState interface, update loadChildren:
loadChildren: (parentId: string) => Promise<void>;

// In implementation:
loadChildren: async (parentId: string) => {
  set({ isLoading: true, error: null });

  try {
    const children = await getParentChildren(parentId);

    if (children.length === 0) {
      set({
        isLoading: false,
        error: 'No children found. Please contact school administration.',
        children: [],
      });
      return;
    }

    // Auto-select first child or primary child
    const primaryChild = children.find(c => c.isPrimary);
    const defaultChildId = primaryChild?.id || children[0]?.id || null;

    set({
      children,
      selectedChildId: defaultChildId,
      isLoading: false,
    });
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error
        ? error.message
        : 'Failed to load children. Please check your connection.',
      children: [],
    });
  }
},
```

### Step 3: Add AsyncStorage Persistence (25 min)

Create `apps/mobile/src/lib/storage/childSelection.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CHILD_KEY = '@selected_child';

export const saveSelectedChild = async (childId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SELECTED_CHILD_KEY, childId);
  } catch (error) {
    console.error('Error saving child selection:', error);
  }
};

export const getSelectedChild = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SELECTED_CHILD_KEY);
  } catch (error) {
    console.error('Error loading child selection:', error);
    return null;
  }
};

export const clearSelectedChild = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SELECTED_CHILD_KEY);
  } catch (error) {
    console.error('Error clearing child selection:', error);
  }
};
```

Update parent store to use persistence:

```typescript
import { saveSelectedChild, getSelectedChild } from '../../lib/storage/childSelection';

// In setSelectedChildId:
setSelectedChildId: async (childId: string) => {
  set({ selectedChildId: childId });
  await saveSelectedChild(childId);
},

// Add new action to loadChildren:
loadChildren: async (parentId: string) => {
  set({ isLoading: true, error: null });

  try {
    const children = await getParentChildren(parentId);

    if (children.length === 0) {
      set({
        isLoading: false,
        error: 'No children found. Please contact school administration.',
        children: [],
      });
      return;
    }

    // Load saved selection or use default
    const savedChildId = await getSelectedChild();
    const primaryChild = children.find(c => c.isPrimary);
    const defaultChildId = savedChildId && children.find(c => c.id === savedChildId)
      ? savedChildId
      : (primaryChild?.id || children[0]?.id || null);

    set({
      children,
      selectedChildId: defaultChildId,
      isLoading: false,
    });
  } catch (error) {
    set({
      isLoading: false,
      error: error instanceof Error
        ? error.message
        : 'Failed to load children. Please check your connection.',
      children: [],
    });
  }
},
```

### Step 4: Update Auth Flow (15 min)

Ensure children load after parent login in auth store/screen:

```typescript
// In auth store or login screen:
// After successful parent login:
const { loadChildren } = useParentStore();
await loadChildren(parentId);
```

## Success Criteria

- [ ] `getParentChildren()` query returns correct child data
- [ ] Parent store loads real data (no mock)
- [ ] Empty case handled (shows error message)
- [ ] Child selection persists after app restart
- [ ] Errors caught and displayed appropriately
- [ ] TypeScript compiles without errors

## Testing Commands

```typescript
// Test query directly
import { getParentChildren } from './lib/supabase/queries';
const children = await getParentChildren('[PARENT_UUID_FROM_PHASE1]');
console.log('Children:', children);

// Test store
import { useParentStore } from './stores';
const { loadChildren, children, selectedChildId } = useParentStore();
await loadChildren('[PARENT_UUID_FROM_PHASE1]');
console.log('Store children:', children);
console.log('Selected:', selectedChildId);
```

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| RLS blocks query | Medium | High | Verify policies allow parent access |
| Empty results | Low | Medium | Handle gracefully with error message |
| AsyncStorage fails | Low | Low | Fall back to first child |
| Type mismatches | Low | Medium | Strong typing + tests |

## Rollback Plan

Keep mock code as comment, revert if critical issues:
```typescript
// Rollback to mock:
// const mockChildren: ChildData[] = [ /* ... */ ];
// set({ children: mockChildren, isLoading: false });
```

## Deliverables

1. `apps/mobile/src/lib/supabase/queries.ts` with `getParentChildren()`
2. `apps/mobile/src/lib/storage/childSelection.ts` with persistence
3. Updated `apps/mobile/src/stores/parent.ts` (real data + persistence)
4. Auth flow integration

## Next Phase

Proceed to [Phase 3: UI Integration](./phase-03-ui-integration.md)
