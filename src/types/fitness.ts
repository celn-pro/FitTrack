// Fitness-related TypeScript types

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  height?: number; // cm
  weight?: number; // kg
  fitnessLevel?: FitnessLevel;
  activityLevel?: ActivityLevel;
  fitnessGoals?: string[];
  preferredWorkoutTypes?: string[];
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Calculated fields
  age?: number;
  bmi?: number;
}

export interface WorkoutStep {
  title: string;
  description: string;
  image?: string;
  duration?: number; // seconds
  reps?: number;
  sets?: number;
  restTime?: number; // seconds
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  duration: number; // minutes
  calories?: number;
  equipment?: string[];
  bodyParts?: string[];
  steps: WorkoutStep[];
  coverImage?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionMacro {
  grams: number | null;
  calories: number | null;
  percentage: number;
}

export interface NutritionInfo {
  protein: NutritionMacro;
  carbs: NutritionMacro;
  fats: NutritionMacro;
  totalCalories: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  nutrition: NutritionInfo;
  ingredients: string[];
  instructions?: string[];
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  servings: number;
  image?: string;
  createdAt: string;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'hydration';
  difficulty: DifficultyLevel;
  estimatedReadTime: number; // minutes
  tags?: string[];
  createdAt: string;
}

export interface DidYouKnowFact {
  id: string;
  fact: string;
  category: string;
  source: string;
  difficulty: DifficultyLevel;
  estimatedReadTime: number; // minutes
  isVerified: boolean;
  tags?: string[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'workout' | 'nutrition' | 'hydration' | 'sleep' | 'weight';
  data: {
    [key: string]: any;
  };
  timestamp: string;
  notes?: string;
}

export interface ProgressMetric {
  id: string;
  userId: string;
  metric: 'weight' | 'body_fat' | 'muscle_mass' | 'steps' | 'calories' | 'water_intake';
  value: number;
  unit: string;
  timestamp: string;
  source?: 'manual' | 'device' | 'app';
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'general_health';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  duration: number; // minutes
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  coverImage?: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  lessons: Lesson[];
  learningObjectives: string[];
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  duration: number; // minutes
  order: number;
  videoUrl?: string;
  resources?: LessonResource[];
  exercises?: Exercise[];
  quiz?: Quiz;
  isCompleted?: boolean;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'article' | 'image';
  url: string;
  description?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'practical' | 'reflection' | 'assignment';
  instructions: string[];
  estimatedTime: number; // minutes
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // minutes
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}
