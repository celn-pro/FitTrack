// src/navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  OnboardingWelcome: undefined;
  OnboardingRegistration: undefined;
  OnboardingProfileSetup: undefined;
  Home: undefined;
  Login: undefined;
  Profile: undefined;
  MealPlanning: undefined;
  Recommendations: undefined;
  ProgressTracking: undefined;
  SocialFeed: undefined;
  Settings: undefined;
  NotificationCenter: undefined;
  Chatbot: undefined;
  ARWorkout: undefined;
  ErrorOffline: undefined;
  WorkoutDetail: { workout: any };
  NutritionDetail: {nutrition: any};
  HydrationDetail: {hydration: any};
  RestDetail: {rest: any};
  HealthTipDetail:{tip: any};
  DidYouKnowDetail: { fact: any };
};

export type TabParamList = {
  Home: undefined;
  Tracking: undefined;
  Profile: undefined;
  Social: undefined;
  Settings: undefined;
};