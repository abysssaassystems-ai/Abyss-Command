export type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "athlete";
export type FitnessGoal = "fat_loss" | "maintenance" | "muscle_gain";
export type BiologicalSex = "male" | "female";
export type TabID = "overview" | "nutrition" | "meals" | "goals" | "workouts" | "trends" | "supplements";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodLogItem {
  id: string;
  name: string;
  servingText: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  mealType: MealType;
}

export interface FoodDatabaseEntry {
  id: string;
  name: string;
  category: "home made" | "fast food" | "commercial dining";
  verifiedStatus: boolean;
  servingSizeGrams: number;
  calories: number;
  carbsGrams: number;
  fatGrams: number;
  proteinGrams: number;
  micronutrients: {
    sodium_mg: number;
  };
}

export interface FoodItem {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  micronutrients: {
    sodium_mg: number;
  };
}

export interface MealLog {
  id: string;
  type: MealType;
  foods: FoodItem[];
}

export interface WorkoutLog {
  id: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
}

export interface ActivityMetadata {
  stepsCount: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface BiometricProfileInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  sex: BiologicalSex;
  activityLevel: ActivityLevel;
}

export interface CalorieTargetInput {
  tdee: number;
  goal: FitnessGoal;
  aggressionFactor: "conservative" | "moderate" | "aggressive";
}

export interface MacroDistributionInput {
  targetCalories: number;
  weightKg: number;
  preference: "high_protein" | "low_carb_keto" | "balanced";
}

export interface HealthNodeOutput<T> {
  success: boolean;
  timestamp: string;
  payload: T;
}

// Moving this here resolves your viewbars import errors cleanly
export interface SupplementStackItem {
  id: string;
  name: string;
  dosage: string;
  timing: "morning" | "noon" | "night" | "pre_workout";
  isTaken: boolean;
}