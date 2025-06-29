// src/styles/spacing.ts
export const SPACING = {
  // Base spacing unit (4px)
  unit: 4,
  
  // Spacing scale based on 4px unit
  xs: 4,      // 4px - minimal spacing
  sm: 8,      // 8px - small spacing
  md: 12,     // 12px - medium spacing
  lg: 16,     // 16px - large spacing
  xl: 20,     // 20px - extra large spacing
  '2xl': 24,  // 24px - 2x large spacing
  '3xl': 32,  // 32px - 3x large spacing
  '4xl': 40,  // 40px - 4x large spacing
  '5xl': 48,  // 48px - 5x large spacing
  '6xl': 64,  // 64px - 6x large spacing
  
  // Component-specific spacing
  component: {
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    margin: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },
  },
  
  // Screen margins
  screen: {
    horizontal: 16,  // Standard horizontal screen padding
    vertical: 20,    // Standard vertical screen padding
    top: 24,         // Top spacing for screens
    bottom: 32,      // Bottom spacing for screens
  },
  
  // Card spacing
  card: {
    padding: 16,
    margin: 12,
    gap: 12,
  },
  
  // Button spacing
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  
  // Input spacing
  input: {
    padding: 12,
    margin: 8,
  },
};

// Border radius scale
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  full: 9999,  // Fully rounded
  
  // Component-specific radius
  button: 8,
  card: 12,
  input: 8,
  modal: 16,
  avatar: 9999,
};

// Shadow definitions
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
