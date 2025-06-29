// src/styles/typography.ts
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'Inter-Regular',      // Modern, readable font
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    light: 'Inter-Light',
    // Fallback to system fonts if custom fonts aren't loaded
    systemRegular: 'System',
    systemBold: 'System',
  },
  fontSize: {
    xs: 10,        // Extra small - captions, labels
    sm: 12,        // Small - secondary text, metadata
    base: 14,      // Base - body text
    md: 16,        // Medium - primary text
    lg: 18,        // Large - subheadings
    xl: 20,        // Extra large - headings
    '2xl': 24,     // 2X large - section titles
    '3xl': 28,     // 3X large - page titles
    '4xl': 32,     // 4X large - hero text
    '5xl': 36,     // 5X large - display text
    '6xl': 48,     // 6X large - hero display
  },
  lineHeight: {
    tight: 1.2,    // Tight line height for headings
    normal: 1.4,   // Normal line height for body text
    relaxed: 1.6,  // Relaxed line height for reading
    loose: 1.8,    // Loose line height for large text
  },
  letterSpacing: {
    tight: -0.5,   // Tight letter spacing
    normal: 0,     // Normal letter spacing
    wide: 0.5,     // Wide letter spacing
    wider: 1,      // Wider letter spacing
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};