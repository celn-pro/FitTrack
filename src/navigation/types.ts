// src/navigation/types.ts
export type RootStackParamList = {
  Splash: undefined;
  OnboardingWelcome: undefined;
  OnboardingRegistration: undefined;
  OnboardingProfileSetup: undefined;
  Home: undefined;
  Tracking: undefined;
  Login: undefined;
  Profile: undefined;
  Courses: undefined;
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
  CourseDetail: { course: any };
  TopicDetail: { topic: any };
};

export type TabParamList = {
  Home: undefined;
  Tracking: undefined;
  Profile: undefined;
  Courses: undefined;
  Social: undefined;
  Settings: undefined;
};