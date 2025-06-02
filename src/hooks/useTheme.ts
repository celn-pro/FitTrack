import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../styles/theme';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  return {
    theme: theme === 'light' ? lightTheme : darkTheme,
    toggleTheme,
    isDark: theme === 'dark',
    themeName: theme,
  };
};