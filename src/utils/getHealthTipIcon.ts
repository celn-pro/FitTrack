export const getHealthTipIcon = (category: string, tipText?: string): string => {
  const lowerTip = tipText?.toLowerCase() || '';

  if (lowerTip.includes('sleep') || category === 'sleep') return 'hotel';
  if (lowerTip.includes('hydrate') || lowerTip.includes('water') || category === 'hydration') return 'local-drink';
  if (lowerTip.includes('stress') || lowerTip.includes('mind') || category === 'mental') return 'self-improvement';
  if (lowerTip.includes('protein') || lowerTip.includes('diet') || category === 'nutrition') return 'restaurant';
  if (lowerTip.includes('cardio') || lowerTip.includes('workout') || category === 'exercise') return 'fitness-center';

  return 'info';
};
