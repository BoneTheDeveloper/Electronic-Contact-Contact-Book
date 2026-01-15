/**
 * EContact School Mobile App
 * Main entry point with React Native Paper provider and navigation
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { RootNavigator } from './src/navigation';
import { lightTheme, darkTheme } from './src/theme';
import { useUIStore } from './src/stores';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.primary}
        />
        <RootNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
