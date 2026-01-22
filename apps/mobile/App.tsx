/**
 * EContact School Mobile App
 * Main entry point with navigation
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation';
import { useUIStore } from './src/stores';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;
