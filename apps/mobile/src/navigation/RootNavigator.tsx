/**
 * Root Navigator
 * Main navigation container with auth flow handling
 */

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores';

import AuthNavigator from './AuthNavigator';
import ParentTabs from './ParentTabs';
import StudentTabs from './StudentTabs';

export type RootStackParamList = {
  Auth: undefined;
  Parent: undefined;
  Student: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('[RootNavigator] Render:', { isAuthenticated, userRole: user?.role });

  return (
    <NavigationContainer
      linking={undefined}
      documentTitle={{
        formatter: (options, route) =>
          `${route?.name ?? 'EContact'} - EContact School`,
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator as any} />
        ) : user?.role === 'parent' ? (
          <Stack.Screen name="Parent" component={ParentTabs as any} />
        ) : user?.role === 'student' ? (
          <Stack.Screen name="Student" component={StudentTabs as any} />
        ) : (
          // Fallback to auth if role is not parent or student
          <Stack.Screen name="Auth" component={AuthNavigator as any} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
