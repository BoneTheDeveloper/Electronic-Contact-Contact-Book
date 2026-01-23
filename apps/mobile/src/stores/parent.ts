/**
 * Parent Store
 * Manages parent-specific data and operations
 */

import { create } from 'zustand';

interface ChildData {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  section: string;
  grade: number;
  studentCode: string;
}

interface Fee {
  id: string;
  type: 'tuition' | 'transport' | 'library' | 'lab' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  remarks?: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

interface ParentState {
  // State
  children: ChildData[];
  selectedChildId: string | null;
  fees: Fee[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadChildren: (parentId: string) => Promise<void>;
  selectChild: (childId: string) => void;
  setSelectedChildId: (childId: string) => void;
  loadFees: (childId: string) => Promise<void>;
  loadMessages: (parentId: string) => Promise<void>;
  clearError: () => void;
}

export const useParentStore = create<ParentState>((set) => ({
  // Initial state
  children: [],
  selectedChildId: null,
  fees: [],
  messages: [],
  isLoading: false,
  error: null,

  // Load children
  loadChildren: async (parentId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock children data
      const mockChildren: ChildData[] = [
        {
          id: '2',
          name: 'Nguyen Van B',
          rollNumber: 'STU001',
          classId: 'CLASS10A',
          section: 'A',
          grade: 10,
          studentCode: 'ST2024001',
        },
        {
          id: '5',
          name: 'Nguyen Thi C',
          rollNumber: 'STU002',
          classId: 'CLASS8B',
          section: 'B',
          grade: 8,
          studentCode: 'ST2024002',
        },
      ];

      set({ children: mockChildren, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load children',
      });
    }
  },

  // Select child
  selectChild: (childId: string) => {
    set({ selectedChildId: childId });
  },

  // Set selected child ID
  setSelectedChildId: (childId: string) => {
    set({ selectedChildId: childId });
  },

  // Load fees for selected child
  loadFees: async (childId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock fees data
      const mockFees: Fee[] = [
        {
          id: '1',
          type: 'tuition',
          amount: 5000000,
          dueDate: '2026-01-15',
          status: 'pending',
        },
        {
          id: '2',
          type: 'transport',
          amount: 500000,
          dueDate: '2026-01-10',
          status: 'paid',
          paidDate: '2026-01-08',
        },
        {
          id: '3',
          type: 'library',
          amount: 200000,
          dueDate: '2025-12-01',
          status: 'overdue',
        },
      ];

      set({ fees: mockFees, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load fees',
      });
    }
  },

  // Load messages
  loadMessages: async (parentId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      // Mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          from: 'School Admin',
          subject: 'Parent-Teacher Meeting',
          content: 'Reminder: Parent-teacher meeting scheduled for January 20th at 10:00 AM.',
          date: '2026-01-12',
          read: false,
        },
        {
          id: '2',
          from: 'Teacher A',
          subject: 'Student Performance Update',
          content: 'Your child is performing well in Mathematics. Keep up the good work!',
          date: '2026-01-10',
          read: true,
        },
      ];

      set({ messages: mockMessages, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load messages',
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
