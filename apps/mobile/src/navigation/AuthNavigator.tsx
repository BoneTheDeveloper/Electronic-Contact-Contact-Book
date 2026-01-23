/**
 * Auth Navigator
 * Handles authentication screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores';

import CustomLoginScreen from '../screens/auth/CustomLoginScreen';
import DebugLogsScreen from '../screens/debug/DebugLogsScreen';

export type AuthStackParamList = {
  Login: undefined;
  DebugLogs: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="Login" component={CustomLoginScreen as any} />
      <Stack.Screen
        name="DebugLogs"
        component={DebugLogsScreen as any}
        options={{
          headerShown: true,
          title: 'Debug Logs',
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#FFFFFF',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
