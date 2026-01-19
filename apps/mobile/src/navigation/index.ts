/**
 * Navigation exports for EContact School App
 */

export { default as RootNavigator } from './RootNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export { default as ParentTabs } from './ParentTabs';
export { default as StudentTabs } from './StudentTabs';

// Export all centralized types from types.ts
export type {
  RootStackParamList,
  RootStackNavigationProp,
  AuthStackParamList,
  AuthStackNavigationProp,
  ParentTabParamList,
  ParentHomeStackParamList,
  ParentHomeStackNavigationProp,
  ParentPaymentStackParamList,
  ParentCommStackParamList,
  ParentCommStackNavigationProp,
  StudentTabParamList,
  StudentHomeStackParamList,
  StudentHomeStackNavigationProp,
  NavigationProp,
} from './types';
