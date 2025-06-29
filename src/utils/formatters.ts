// Formatting utility functions

export const formatDate = (dateInput: string | number | Date): string => {
  let date: Date;

  // Handle different input types
  if (typeof dateInput === 'number' || (typeof dateInput === 'string' && /^\d+$/.test(dateInput))) {
    date = new Date(Number(dateInput));
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput); // fallback: show raw value if parsing fails
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export const formatCalories = (calories: number): string => {
  if (calories >= 1000) {
    return `${(calories / 1000).toFixed(1)}k cal`;
  }
  return `${calories} cal`;
};

export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

export const formatWeight = (kg: number, unit: 'kg' | 'lbs' = 'kg'): string => {
  if (unit === 'lbs') {
    const lbs = kg * 2.20462;
    return `${lbs.toFixed(1)} lbs`;
  }
  return `${kg.toFixed(1)} kg`;
};

export const formatHeight = (cm: number, unit: 'cm' | 'ft' = 'cm'): string => {
  if (unit === 'ft') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  return `${cm} cm`;
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};
