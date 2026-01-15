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

// Placeholder screens for other roles
const TeacherDashboard = () => null;
const AdminDashboard = () => null;

export type RootStackParamList = {
  Auth: undefined;
  Parent: undefined;
  Student: undefined;
  Teacher: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'parent' ? (
          <Stack.Screen name="Parent" component={ParentTabs} />
        ) : user?.role === 'student' ? (
          <Stack.Screen name="Student" component={StudentTabs} />
        ) : user?.role === 'teacher' ? (
          <Stack.Screen name="Teacher" component={TeacherDashboard} />
        ) : (
          <Stack.Screen name="Admin" component={AdminDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
