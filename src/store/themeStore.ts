// src/store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeState = {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system', // Default to system theme
      toggleTheme: () =>
        set((state) => ({
          theme:
            state.theme === 'light'
              ? 'dark'
              : state.theme === 'dark'
              ? 'system'
              : 'light',
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);