import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { useThemeStore } from './src/store/themeStore';
import { lightTheme, darkTheme } from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { apolloClient } from './src/config/apolloClient'; // You'll need to create this

const App: React.FC = () => {
  // Detect system theme
  const systemTheme = useColorScheme();

  // Get theme state from Zustand store
  const { theme: userTheme } = useThemeStore();

  // Determine the active theme
  let activeTheme;
  if (userTheme === 'system') {
    activeTheme = systemTheme === 'dark' ? darkTheme : lightTheme;
  } else {
    activeTheme = userTheme === 'dark' ? darkTheme : lightTheme;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        <ThemeProvider theme={activeTheme}>
          <StatusBar
            barStyle={activeTheme === darkTheme ? 'light-content' : 'dark-content'}
            backgroundColor={activeTheme.colors.background}
          />
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;