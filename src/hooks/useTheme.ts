import { useThemeStore } from '../store/themeStore';
import { lightTheme, darkTheme } from '../styles/theme';
import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => listener.remove();
  }, []);

  // Determine which theme to use
  let colorScheme = theme;
  if (theme === 'system') {
    colorScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
  }

  return {
    theme: colorScheme === 'light' ? lightTheme : darkTheme,
    toggleTheme,
    isDark: colorScheme === 'dark',
  };
};