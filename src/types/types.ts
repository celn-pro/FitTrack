// types.ts
// TypeScript interfaces for the response
export interface StepMedia {
  type: string;
  url: string;
  caption?: string;
}

export interface Step {
  title: string;
  description: string;
  duration?: number;
  media?: StepMedia[];
}

export interface Article {
  title: string;
  url: string;
  summary?: string;
}

export interface MacroNutrient {
  grams: number | null;
  calories: number | null;
  percentage: number;
}

export interface Macros {
  protein?: MacroNutrient;
  carbohydrates?: MacroNutrient;
  fats?: MacroNutrient;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  image?: string;
  steps?: Step[];
  tips?: string[];
  articles?: Article[];
  macros?: Macros;
  calories?: number;
  reminders?: string[];
  dailyGoalMl?: number;
  sleepGoalHours?: number;
  calculatedCalories?: number;
  difficultyLevel?: string;
  estimatedDuration?: number;
  personalizedTips?: string[];
  createdAt: string;
  source?: string; // 'exercisedb' | 'wger' | 'generated'
  hasWorkingImage?: boolean; // true = real images, false = placeholders
}

export interface GetRecommendationsResponse {
  getRecommendations: Recommendation[];
}

// Legacy interfaces for backward compatibility
export interface RecommendationStep extends Step {}
export interface CalorieInfo {
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  dailyWaterGoal: number;
  recommendedSleepHours: number;
  activityMultiplier: number;
  bmi: number;
  bmiCategory: string;
  idealWeightRange: {
    min: number;
    max: number;
  };
}