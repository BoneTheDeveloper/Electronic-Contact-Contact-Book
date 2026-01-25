/**
 * Parent Navigator
 * Wraps ParentTabs with modal screens like ChildSelection
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentTabs from './ParentTabs';
import { ChildSelectionScreen } from '../screens/parent';

export type ParentNavigatorParamList = {
  ParentTabs: undefined;
  ChildSelection: undefined;
};

const Stack = createNativeStackNavigator<ParentNavigatorParamList>();

const ParentNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParentTabs" component={ParentTabs} />
      <Stack.Screen
        name="ChildSelection"
        component={ChildSelectionScreen}
        options={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
