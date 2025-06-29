// Fitness-related constants

export const FITNESS_LEVELS = [
  { label: 'Beginner', value: 'beginner', description: 'New to fitness or returning after a break' },
  { label: 'Intermediate', value: 'intermediate', description: 'Regular exercise routine for 6+ months' },
  { label: 'Advanced', value: 'advanced', description: 'Consistent training for 2+ years' },
] as const;

export const ACTIVITY_LEVELS = [
  { label: 'Sedentary', value: 'sedentary', description: 'Little to no exercise' },
  { label: 'Light', value: 'light', description: 'Light exercise 1-3 days/week' },
  { label: 'Moderate', value: 'moderate', description: 'Moderate exercise 3-5 days/week' },
  { label: 'Active', value: 'active', description: 'Hard exercise 6-7 days/week' },
  { label: 'Very Active', value: 'very_active', description: 'Very hard exercise, physical job' },
] as const;

export const FITNESS_GOALS = [
  { label: 'Weight Loss', value: 'weight_loss', icon: 'trending-down' },
  { label: 'Muscle Gain', value: 'muscle_gain', icon: 'fitness-center' },
  { label: 'Endurance', value: 'endurance', icon: 'directions-run' },
  { label: 'Strength', value: 'strength', icon: 'sports-gymnastics' },
  { label: 'Flexibility', value: 'flexibility', icon: 'self-improvement' },
  { label: 'General Health', value: 'general_health', icon: 'favorite' },
] as const;

export const WORKOUT_TYPES = [
  { label: 'Cardio', value: 'cardio', icon: 'directions-run' },
  { label: 'Strength', value: 'strength', icon: 'fitness-center' },
  { label: 'Flexibility', value: 'flexibility', icon: 'self-improvement' },
  { label: 'Sports', value: 'sports', icon: 'sports-soccer' },
  { label: 'Yoga', value: 'yoga', icon: 'spa' },
  { label: 'Pilates', value: 'pilates', icon: 'accessibility' },
] as const;

export const ACTIVITY_TYPES = [
  { label: 'Workout', value: 'workout', icon: 'fitness-center' },
  { label: 'Nutrition', value: 'nutrition', icon: 'restaurant' },
  { label: 'Achievement', value: 'achievement', icon: 'emoji-events' },
  { label: 'General', value: 'general', icon: 'info' },
] as const;

export const DIFFICULTY_LEVELS = [
  { label: 'Easy', value: 'easy', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'Hard', value: 'hard', color: '#EF4444' },
] as const;

export const BODY_PARTS = [
  { label: 'Full Body', value: 'full_body' },
  { label: 'Upper Body', value: 'upper_body' },
  { label: 'Lower Body', value: 'lower_body' },
  { label: 'Core', value: 'core' },
  { label: 'Arms', value: 'arms' },
  { label: 'Legs', value: 'legs' },
  { label: 'Back', value: 'back' },
  { label: 'Chest', value: 'chest' },
  { label: 'Shoulders', value: 'shoulders' },
] as const;

export const NUTRITION_CATEGORIES = [
  { label: 'Breakfast', value: 'breakfast', icon: 'wb-sunny' },
  { label: 'Lunch', value: 'lunch', icon: 'wb-sunny' },
  { label: 'Dinner', value: 'dinner', icon: 'brightness-3' },
  { label: 'Snack', value: 'snack', icon: 'local-cafe' },
  { label: 'Pre-Workout', value: 'pre_workout', icon: 'fitness-center' },
  { label: 'Post-Workout', value: 'post_workout', icon: 'fitness-center' },
] as const;

export const HEALTH_TIP_CATEGORIES = [
  { label: 'Nutrition', value: 'nutrition', icon: 'restaurant' },
  { label: 'Exercise', value: 'exercise', icon: 'fitness-center' },
  { label: 'Sleep', value: 'sleep', icon: 'hotel' },
  { label: 'Mental Health', value: 'mental', icon: 'psychology' },
  { label: 'Hydration', value: 'hydration', icon: 'local-drink' },
] as const;

export const MOODS = [
  { emoji: '😊', label: 'Great', value: 'great', color: '#10B981' },
  { emoji: '🙂', label: 'Good', value: 'good', color: '#F59E0B' },
  { emoji: '😐', label: 'Okay', value: 'okay', color: '#6366F1' },
  { emoji: '😔', label: 'Low', value: 'low', color: '#F97316' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: '#EF4444' },
] as const;
