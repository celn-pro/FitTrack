// Health tip icon mapping utility
export const getHealthTipIcon = (category: string, tipText?: string): string => {
  const lowerTip = tipText?.toLowerCase() || '';

  if (lowerTip.includes('sleep') || category === 'sleep') return 'hotel';
  if (lowerTip.includes('hydrate') || lowerTip.includes('water') || category === 'hydration') return 'local-drink';
  if (lowerTip.includes('stress') || lowerTip.includes('mind') || category === 'mental') return 'self-improvement';
  if (lowerTip.includes('protein') || lowerTip.includes('diet') || category === 'nutrition') return 'restaurant';
  if (lowerTip.includes('cardio') || lowerTip.includes('workout') || category === 'exercise') return 'fitness-center';

  return 'info';
};

// Activity type icon mapping
export const getActivityIcon = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case 'workout':
      return 'fitness-center';
    case 'nutrition':
      return 'restaurant';
    case 'achievement':
      return 'emoji-events';
    case 'general':
      return 'info';
    default:
      return 'info';
  }
};

// Fitness level icon mapping
export const getFitnessLevelIcon = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'trending-up';
    case 'intermediate':
      return 'fitness-center';
    case 'advanced':
      return 'military-tech';
    default:
      return 'fitness-center';
  }
};
