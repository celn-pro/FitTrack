// src/styles/theme.ts
import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';

export const lightTheme = {
  colors: {
    background: COLORS.lightBackground,
    text: COLORS.text,
    secondaryText: COLORS.secondaryText,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    white: COLORS.white,
  },
  typography: TYPOGRAPHY,
};

export const darkTheme = {
  colors: {
    background: COLORS.darkBackground,
    text: COLORS.white,
    secondaryText: '#AAA',
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    white: COLORS.white,
  },
  typography: TYPOGRAPHY,
};

export type ThemeType = typeof lightTheme;