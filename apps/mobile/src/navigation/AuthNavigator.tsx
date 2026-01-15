/**
 * Auth Navigator
 * Handles authentication screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores';
import { colors } from '../theme';

import CustomLoginScreen from '../screens/auth/CustomLoginScreen';

export type AuthStackParamList = {
  Login: undefined;
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
      <Stack.Screen name="Login" component={CustomLoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
