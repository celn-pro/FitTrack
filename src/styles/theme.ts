// src/styles/theme.ts
import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';

export const lightTheme = {
  colors: {
    // Primary colors
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,

    // Secondary colors
    secondary: COLORS.secondary,
    secondaryLight: COLORS.secondaryLight,
    secondaryDark: COLORS.secondaryDark,

    // Accent colors
    accent: COLORS.accent,
    accentLight: COLORS.accentLight,
    accentDark: COLORS.accentDark,

    // Status colors
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,

    // Background colors
    background: COLORS.lightBackground,
    backgroundSecondary: COLORS.lightBackgroundSecondary,
    surface: COLORS.surface,

    // Card colors
    card: COLORS.cardLight,
    cardSecondary: COLORS.cardLightSecondary,

    // Text colors
    text: COLORS.text,
    textLight: COLORS.textLight,
    secondaryText: COLORS.secondaryText,
    white: COLORS.white,

    // Border colors
    border: COLORS.border,

    // Gradient colors
    gradientStart: COLORS.gradientStart,
    gradientEnd: COLORS.gradientEnd,
    gradientSecondaryStart: COLORS.gradientSecondaryStart,
    gradientSecondaryEnd: COLORS.gradientSecondaryEnd,

    // Shadow
    shadow: COLORS.shadow,
  },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

export const darkTheme = {
  colors: {
    // Primary colors
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,

    // Secondary colors
    secondary: COLORS.secondary,
    secondaryLight: COLORS.secondaryLight,
    secondaryDark: COLORS.secondaryDark,

    // Accent colors
    accent: COLORS.accent,
    accentLight: COLORS.accentLight,
    accentDark: COLORS.accentDark,

    // Status colors
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,

    // Background colors
    background: COLORS.darkBackground,
    backgroundSecondary: COLORS.darkBackgroundSecondary,
    surface: COLORS.surfaceDark,

    // Card colors
    card: COLORS.cardDark,
    cardSecondary: COLORS.cardDarkSecondary,

    // Text colors
    text: COLORS.white,
    textLight: COLORS.secondaryTextDark,
    secondaryText: COLORS.secondaryTextDark,
    white: COLORS.white,

    // Border colors
    border: COLORS.borderDark,

    // Gradient colors
    gradientStart: COLORS.gradientStart,
    gradientEnd: COLORS.gradientEnd,
    gradientSecondaryStart: COLORS.gradientSecondaryStart,
    gradientSecondaryEnd: COLORS.gradientSecondaryEnd,

    // Shadow
    shadow: COLORS.shadowDark,
  },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

export type ThemeType = typeof lightTheme;