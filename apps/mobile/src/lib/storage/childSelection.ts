/**
 * AsyncStorage utilities for child selection persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CHILD_KEY = '@econtact_selected_child';

/**
 * Save selected child ID to AsyncStorage
 */
export const saveSelectedChild = async (childId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(SELECTED_CHILD_KEY, childId);
  } catch (error) {
    console.error('[STORAGE] Error saving child selection:', error);
  }
};

/**
 * Get selected child ID from AsyncStorage
 */
export const getSelectedChild = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SELECTED_CHILD_KEY);
  } catch (error) {
    console.error('[STORAGE] Error loading child selection:', error);
    return null;
  }
};

/**
 * Clear selected child ID from AsyncStorage
 */
export const clearSelectedChild = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SELECTED_CHILD_KEY);
  } catch (error) {
    console.error('[STORAGE] Error clearing child selection:', error);
  }
};
