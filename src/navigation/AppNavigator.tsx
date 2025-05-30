import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import SplashScreen from '../screens/SplashScreen';
import Welcome from '../screens/onboarding/Welcome';
import Registration from '../screens/onboarding/Registration';
import ProfileSetup from '../screens/onboarding/ProfileSetup';
import Home from '../screens/Home';
import ActivityTracking from '../screens/ActivityTracking';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import MealPlanning from '../screens/MealPlanning';
import Recommendations from '../screens/Recommendations';
import ProgressTracking from '../screens/ProgressTracking';
import SocialFeed from '../screens/SocialFeed';
import Settings from '../screens/Settings';
import NotificationCenter from '../screens/NotificationCenter';
import Chatbot from '../screens/Chatbot';
import ARWorkout from '../screens/ARWorkout';
import ErrorOffline from '../screens/ErrorOffline';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = 'home'; // default icon
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Tracking') iconName = 'fitness-center';
        else if (route.name === 'Profile') iconName = 'person';
        else if (route.name === 'Social') iconName = 'group';
        else if (route.name === 'Settings') iconName = 'settings';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4A90E2',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: { backgroundColor: '#FFF', borderTopWidth: 0 },
    })}
  >
    <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Tab.Screen name="Tracking" component={ActivityTracking} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    <Tab.Screen name="Social" component={SocialFeed} options={{ headerShown: false }} />
    <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingWelcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingRegistration" component={Registration} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingProfileSetup" component={ProfileSetup} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="MealPlanning" component={MealPlanning} options={{ headerShown: false }} />
          <Stack.Screen name="Recommendations" component={Recommendations} options={{ headerShown: false }} />
          <Stack.Screen name="ProgressTracking" component={ProgressTracking} options={{ headerShown: false }} />
          <Stack.Screen name="SocialFeed" component={SocialFeed} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationCenter" component={NotificationCenter} options={{ headerShown: false }} />
          <Stack.Screen name="Chatbot" component={Chatbot} options={{ headerShown: false }} />
          <Stack.Screen name="ARWorkout" component={ARWorkout} options={{ headerShown: false }} />
          <Stack.Screen name="ErrorOffline" component={ErrorOffline} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;