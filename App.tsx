import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { lightTheme, darkTheme } from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { apolloClient } from './src/config/apolloClient'; // You'll need to create this

import { useTheme } from './src/hooks/useTheme'; // Import your custom hook

const App: React.FC = () => {
  const { theme: activeTheme } = useTheme(); // This hook listens for system changes

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