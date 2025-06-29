// App-wide constants

export const APP_CONFIG = {
  name: 'FitTrack',
  version: '1.0.0',
  description: 'Health and Fitness Tracking App for DIT Students',
  supportEmail: 'support@fittrack.app',
  privacyPolicyUrl: 'https://fittrack.app/privacy',
  termsOfServiceUrl: 'https://fittrack.app/terms',
} as const;

export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  extraSlow: 1000,
} as const;

export const SCREEN_NAMES = {
  // Auth
  SPLASH: 'Splash',
  LOGIN: 'Login',
  
  // Onboarding
  ONBOARDING_WELCOME: 'OnboardingWelcome',
  ONBOARDING_REGISTRATION: 'OnboardingRegistration',
  ONBOARDING_PROFILE_SETUP: 'OnboardingProfileSetup',
  
  // Main Tabs
  HOME: 'Home',
  TRACKING: 'Tracking',
  SOCIAL: 'Social',
  COURSES: 'Courses',
  PROFILE: 'Profile',
  
  // Detail Screens
  WORKOUT_DETAIL: 'WorkoutDetail',
  NUTRITION_DETAIL: 'NutritionDetail',
  HYDRATION_DETAIL: 'HydrationDetail',
  REST_DETAIL: 'RestDetail',
  HEALTH_TIP_DETAIL: 'HealthTipDetail',
  DID_YOU_KNOW_DETAIL: 'DidYouKnowDetail',
  COURSE_DETAIL: 'CourseDetail',
  TOPIC_DETAIL: 'TopicDetail',
  
  // Other Screens
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'NotificationCenter',
  CHATBOT: 'Chatbot',
  AR_WORKOUT: 'ARWorkout',
  ERROR_OFFLINE: 'ErrorOffline',
  MEAL_PLANNING: 'MealPlanning',
  RECOMMENDATIONS: 'Recommendations',
  PROGRESS_TRACKING: 'ProgressTracking',
  SOCIAL_FEED: 'SocialFeed',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@fittrack/auth_token',
  USER_DATA: '@fittrack/user_data',
  THEME_PREFERENCE: '@fittrack/theme_preference',
  ONBOARDING_COMPLETED: '@fittrack/onboarding_completed',
  COURSE_PROGRESS: '@fittrack/course_progress',
  SETTINGS: '@fittrack/settings',
  CACHED_DATA: '@fittrack/cached_data',
} as const;
