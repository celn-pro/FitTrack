// Storage service layer
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@fittrack/auth_token',
  USER_DATA: '@fittrack/user_data',
  THEME_PREFERENCE: '@fittrack/theme_preference',
  ONBOARDING_COMPLETED: '@fittrack/onboarding_completed',
  COURSE_PROGRESS: '@fittrack/course_progress',
  SETTINGS: '@fittrack/settings',
} as const;

// Generic storage functions
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
    throw error;
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Specific storage functions
export const saveAuthToken = (token: string) => setItem(STORAGE_KEYS.AUTH_TOKEN, token);
export const getAuthToken = () => getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
export const removeAuthToken = () => removeItem(STORAGE_KEYS.AUTH_TOKEN);

export const saveUserData = (userData: any) => setItem(STORAGE_KEYS.USER_DATA, userData);
export const getUserData = () => getItem(STORAGE_KEYS.USER_DATA);
export const removeUserData = () => removeItem(STORAGE_KEYS.USER_DATA);

export const saveThemePreference = (theme: string) => setItem(STORAGE_KEYS.THEME_PREFERENCE, theme);
export const getThemePreference = () => getItem<string>(STORAGE_KEYS.THEME_PREFERENCE);

export const setOnboardingCompleted = () => setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
export const getOnboardingCompleted = () => getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
