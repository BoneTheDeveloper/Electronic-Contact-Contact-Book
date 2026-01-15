/**
 * UI Store
 * Manages global UI state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // State
  isLoading: boolean;
  isDrawerOpen: boolean;
  notifications: Notification[];
  isDarkMode: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      isLoading: false,
      isDrawerOpen: false,
      notifications: [],
      isDarkMode: false,

      // Set loading state
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Toggle drawer
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      // Close drawer
      closeDrawer: () => set({ isDrawerOpen: false }),

      // Show notification
      showNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        const duration = notification.duration || 3000;
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, duration);
      },

      // Remove notification
      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      // Toggle dark mode
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }), // Only persist dark mode
    }
  )
);
