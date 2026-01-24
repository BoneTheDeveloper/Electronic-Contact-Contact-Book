/**
 * Root Navigator
 * Main navigation container with auth flow handling
 */

import React from 'react';
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
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'parent' ? (
          <Stack.Screen name="Parent" component={ParentTabs} />
        ) : user?.role === 'student' ? (
          <Stack.Screen name="Student" component={StudentTabs} />
        ) : (
          // Fallback to auth if role is not parent or student
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
