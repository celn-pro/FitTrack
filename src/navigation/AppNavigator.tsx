import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { AnimatedTabBar } from '../components/navigation';
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
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import NutritionDetailScreen from '../screens/NutritionDetailScreen';
import HydrationDetailScreen from '../screens/HydrationDetailScreen';
import RestDetailScreen from '../screens/RestDetailScreen';
import HealthTipDetailScreen from '../screens/HealthTipDetailScreen';
import DidYouKnowDetailScreen from '../screens/DidYouKnowDetailScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={ActivityTracking}
        options={{
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialFeed}
        options={{
          tabBarLabel: 'Social',
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarLabel: 'Learn',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  const screenOptions = {
    headerShown: false,
    animation: 'slide_from_right' as const,
    animationDuration: 300,
  };

  const modalScreenOptions = {
    headerShown: false,
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={screenOptions}
        >
          {/* Auth & Onboarding Screens */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="OnboardingWelcome"
            component={Welcome}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OnboardingRegistration"
            component={Registration}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OnboardingProfileSetup"
            component={ProfileSetup}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ animation: 'slide_from_bottom' }}
          />

          {/* Main App */}
          <Stack.Screen
            name="Home"
            component={MainTabs}
            options={{ animation: 'fade' }}
          />

          {/* Detail Screens */}
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
          <Stack.Screen name="NutritionDetail" component={NutritionDetailScreen} />
          <Stack.Screen name="HydrationDetail" component={HydrationDetailScreen} />
          <Stack.Screen name="RestDetail" component={RestDetailScreen} />
          <Stack.Screen name="HealthTipDetail" component={HealthTipDetailScreen} />
          <Stack.Screen name="DidYouKnowDetail" component={DidYouKnowDetailScreen} />
          <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
          <Stack.Screen name="TopicDetail" component={TopicDetailScreen} />

          {/* Modal Screens */}
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={modalScreenOptions}
          />
          <Stack.Screen
            name="NotificationCenter"
            component={NotificationCenter}
            options={modalScreenOptions}
          />
          <Stack.Screen
            name="Chatbot"
            component={Chatbot}
            options={modalScreenOptions}
          />

          {/* Other Screens */}
          <Stack.Screen name="MealPlanning" component={MealPlanning} />
          <Stack.Screen name="Recommendations" component={Recommendations} />
          <Stack.Screen name="ProgressTracking" component={ProgressTracking} />
          <Stack.Screen name="ARWorkout" component={ARWorkout} />
          <Stack.Screen
            name="ErrorOffline"
            component={ErrorOffline}
            options={{ animation: 'fade' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;