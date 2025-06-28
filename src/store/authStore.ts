// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  workoutReminders: boolean;
  nutritionTips: boolean;
  progressUpdates: boolean;
  emailNotifications: boolean;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessLevel?: string;
  activityLevel?: string;
  fitnessGoals?: string[];
  healthConditions?: string[];
  injuries?: string[];
  dietaryPreferences?: string[];
  dietaryRestrictions?: string[];
  preferredWorkoutTypes?: string[];
  isEmailVerified?: boolean;
  isProfileComplete: boolean;
  notificationSettings?: NotificationSettings;
  age?: number;
  bmi?: number;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  // Legacy fields for backward compatibility
  name?: string;
  fitnessGoal?: string;
  dietaryPreference?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getUser: () => User | null;
  getToken: () => string | null;
  isProfileComplete: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User) => 
        set((state) => ({
          user,
          isAuthenticated: true,
          isLoading: false,
        })),

      setToken: (token: string) => 
        set((state) => ({
          token,
          isAuthenticated: !!token && !!state.user,
        })),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: () =>
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })),

      setLoading: (isLoading: boolean) =>
        set(() => ({ isLoading })),

      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isProfileComplete: () => get().user?.isProfileComplete ?? false,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Utility functions for authentication
export const authUtils = {
  // Check if user session is valid
  isSessionValid: (): boolean => {
    const { user, token } = useAuthStore.getState();
    return !!(user && token);
  },

  // Get auth headers for API calls
  getAuthHeaders: (): { Authorization?: string } => {
    const token = useAuthStore.getState().getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Clear auth data (for logout or expired sessions)
  clearAuth: (): void => {
    useAuthStore.getState().logout();
  },

  // Check if profile setup is needed
  needsProfileSetup: (): boolean => {
    const { user } = useAuthStore.getState();
    return !!(user && !user.isProfileComplete);
  },

  // Get user's display name
  getDisplayName: (): string => {
    const user = useAuthStore.getState().getUser();
    if (!user) return 'User';

    // Try firstName first (new structure)
    if (user.firstName) {
      return user.firstName;
    }

    // Try legacy name field
    if (user.name) {
      return user.name.split(' ')[0]; // Return first name
    }

    // Fallback to email username if email exists
    if (user.email) {
      return user.email.split('@')[0];
    }

    // Final fallback
    return 'User';
  },

  // Calculate BMI if height and weight are available
  calculateBMI: (): number | null => {
    const user = useAuthStore.getState().getUser();
    if (!user?.height || !user?.weight) return null;
    
    const heightInMeters = user.height / 100;
    return parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(1));
  },

  // Get BMI category
  getBMICategory: (): string | null => {
    const bmi = authUtils.calculateBMI();
    if (!bmi) return null;
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },
};