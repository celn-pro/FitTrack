import React, { useEffect } from 'react';
import { StatusBar, LogBox, View, Text } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { lightTheme, darkTheme } from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { apolloClient } from './src/config/apolloClient';
import { useTheme } from './src/hooks/useTheme';
import { createErrorBoundary } from './src/utils/errorHandling';
import { LoadingSpinner } from './src/components/ui';

// Error Fallback Component
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <SafeAreaProvider>
    <ThemeProvider theme={lightTheme}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: lightTheme.colors.background
      }}>
        <Text style={{
          color: lightTheme.colors.error,
          marginBottom: 16,
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          Something went wrong
        </Text>
        <Text style={{
          color: lightTheme.colors.text,
          textAlign: 'center',
          fontSize: 14
        }}>
          {error?.message || 'An unexpected error occurred'}
        </Text>
      </View>
    </ThemeProvider>
  </SafeAreaProvider>
);

// Create Error Boundary
const AppErrorBoundary = createErrorBoundary(ErrorFallback);

const AppContent: React.FC = () => {
  const { theme: activeTheme, isDark } = useTheme();

  useEffect(() => {
    // Hide specific warnings in development
    if (__DEV__) {
      LogBox.ignoreLogs([
        'Warning: componentWillReceiveProps',
        'Warning: componentWillMount',
        'Animated: `useNativeDriver`',
      ]);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <ThemeProvider theme={activeTheme}>
            <StatusBar
              barStyle={isDark ? 'light-content' : 'dark-content'}
              backgroundColor={activeTheme.colors.background}
              translucent={true}
            />
            <AppNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
};

export default App;