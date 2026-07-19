import { 
  MealLog, 
  WorkoutLog, 
  FoodItem, 
  ActivityMetadata, 
  WeightEntry,
  BiometricProfileInput,
  CalorieTargetInput,
  MacroDistributionInput,
  HealthNodeOutput,
  ActivityLevel
} from "./types";
import { MET_VALUES, HealthValidationRules } from "./definitions";

// Physical activity coefficients matching standard clinical protocols
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  athlete: 1.9,
};

// ==========================================
// METABOLIC BASELINE PROCESSORS
// ==========================================

/**
 * Computes Basal Metabolic Rate via Mifflin-St Jeor and derives TDEE
 */
export const calculateMetabolicBaseline = (
  input: BiometricProfileInput
): HealthNodeOutput<{ bmr: number; tdee: number }> => {
  // Defensive Sanitization: Prevent zero or negative input values from corrupting formulas
  const weightKg = Math.max(10, Number(input.weightKg) || 0);
  const heightCm = Math.max(50, Number(input.heightCm) || 0);
  const ageYears = Math.max(1, Number(input.ageYears) || 0);
  const { sex, activityLevel } = input;

  const sexModifier = sex === "male" ? 5 : sex === "female" ? -161 : -78; 
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + sexModifier;

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = bmr * multiplier;

  return {
    success: true,
    timestamp: new Date().toISOString(),
    payload: {
      bmr: Math.round(Math.max(500, bmr)), // Enforces realistic baseline floor limits
      tdee: Math.round(Math.max(600, tdee))
    }
  };
};

/**
 * Modulates caloric inputs based on dynamic goal states
 */
export const calculateCaloricTarget = (
  input: CalorieTargetInput
): HealthNodeOutput<{ targetCalories: number; netCaloricDelta: number }> => {
  const tdee = Math.max(600, Number(input.tdee) || 0);
  const { goal, aggressionFactor } = input;
  
  let deltaPct = 0;
  if (goal === "fat_loss") {
    deltaPct = aggressionFactor === "conservative" ? -0.15 : aggressionFactor === "moderate" ? -0.20 : -0.25;
  } else if (goal === "muscle_gain") {
    deltaPct = aggressionFactor === "conservative" ? 0.05 : aggressionFactor === "moderate" ? 0.10 : 0.15;
  }

  const netCaloricDelta = Math.round(tdee * deltaPct);
  // Enforces a hard clinical minimum boundary of 1200 kcal to protect user safety profiles
  const targetCalories = Math.max(1200, Math.round(tdee + netCaloricDelta)); 

  return {
    success: true,
    timestamp: new Date().toISOString(),
    payload: { targetCalories, netCaloricDelta }
  };
};

/**
 * Partitions target macronutrients across dynamic strategy distributions
 */
export const calculateMacronutrientSplit = (
  input: MacroDistributionInput
): HealthNodeOutput<{
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  proteinCalories: number;
  carbCalories: number;
  fatCalories: number;
}> => {
  const targetCalories = Math.max(1200, Number(input.targetCalories) || 0);
  const weightKg = Math.max(10, Number(input.weightKg) || 0);
  const { preference } = input;
  
  let proteinGrams = 0;
  let fatsGrams = 0;
  let carbsGrams = 0;

  switch (preference) {
    case "high_protein":
      proteinGrams = Math.round(weightKg * 2.4);
      fatsGrams = Math.round((targetCalories * 0.25) / 9);
      break;

    case "low_carb_keto":
      proteinGrams = Math.round((targetCalories * 0.20) / 4);
      fatsGrams = Math.round((targetCalories * 0.75) / 9);
      carbsGrams = Math.round((targetCalories * 0.05) / 4);
      break;

    case "balanced":
    default:
      proteinGrams = Math.round(weightKg * 2.0);
      fatsGrams = Math.round((targetCalories * 0.30) / 9);
      break;
  }

  // THERMODYNAMIC SAFEGUARD: If fixed requirements exceed overall target limits, re-normalize
  let proteinCalories = proteinGrams * 4;
  let fatCalories = fatsGrams * 9;
  
  if (proteinCalories + fatCalories > targetCalories && preference !== "low_carb_keto") {
    // Dynamically throttle down protein targets to preserve target integrity limits
    fatsGrams = Math.round((targetCalories * 0.20) / 9); // Allocate safe baseline operational lipid floors
    fatCalories = fatsGrams * 9;
    proteinCalories = targetCalories - fatCalories;
    proteinGrams = Math.round(proteinCalories / 4);
    carbsGrams = 0;
  } else if (preference !== "low_carb_keto") {
    const allocatedCalories = proteinCalories + fatCalories;
    const remainingCalories = Math.max(0, targetCalories - allocatedCalories);
    carbsGrams = Math.round(remainingCalories / 4);
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    payload: {
      proteinGrams,
      carbsGrams,
      fatsGrams,
      proteinCalories: proteinGrams * 4,
      carbCalories: carbsGrams * 4,
      fatCalories: fatsGrams * 9
    }
  };
};

// ==========================================
// INTAKE & WEARABLE DATA PROCESSORS
// ==========================================
export const processDailyNutrients = (meals: MealLog[]) => {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 };
  if (!Array.isArray(meals)) return totals;

  meals.forEach((meal) => {
    if (!meal || !Array.isArray(meal.foods)) return;
    
    meal.foods.forEach((food) => {
      if (!food || !HealthValidationRules.validateNutritionalIntegrity(food)) return;

      // Safe parameter access loops prevent NaN contamination propagation cascades
      totals.calories += Number(food.calories) || 0;
      totals.protein += Number(food.proteinGrams) || 0;
      totals.carbs += Number(food.carbsGrams) || 0;
      totals.fat += Number(food.fatGrams) || 0;
      totals.sodium += Number(food.micronutrients?.sodium_mg) || 0;
    });
  });

  // Smooth parsing clean up
  totals.calories = Math.round(totals.calories);
  totals.protein = parseFloat(totals.protein.toFixed(1));
  totals.carbs = parseFloat(totals.carbs.toFixed(1));
  totals.fat = parseFloat(totals.fat.toFixed(1));
  totals.sodium = Math.round(totals.sodium);

  return totals;
};

export const processWearableExpenditure = (
  metadata: ActivityMetadata | null | undefined, 
  userWeightKg: number, 
  durationMin: number,
  activityKey: string
): number => {
  const sanitizedWeight = Math.max(30, userWeightKg || 0);
  const sanitizedDuration = Math.max(0, durationMin || 0);
  
  const met = MET_VALUES[activityKey] || 3.0;
  const calculatedBurn = met * 3.5 * (sanitizedWeight / 200) * sanitizedDuration;
  
  // Safe optional chaining fallback prevents object property access errors
  const steps = Number(metadata?.stepsCount) || 0;
  const stepBonusCalories = steps * 0.04; 
  
  return Math.round(calculatedBurn + stepBonusCalories);
};

export const calculatePredictiveVelocity = (
  weightHistory: WeightEntry[], 
  netCaloricDeficitAvg: number
): { projectedWeightIn30Days: number; velocityRate: string } => {
  if (!Array.isArray(weightHistory) || weightHistory.length === 0) {
    return { projectedWeightIn30Days: 0, velocityRate: "stable" };
  }
  
  const lastEntry = weightHistory[weightHistory.length - 1];
  if (!lastEntry || typeof lastEntry.weight !== "number") {
    return { projectedWeightIn30Days: 0, velocityRate: "stable" };
  }

  const currentWeight = lastEntry.weight;
  const monthlyWeightDeltaKg = (netCaloricDeficitAvg * 30) / 7700;
  const projectedWeight = Math.max(30, currentWeight + monthlyWeightDeltaKg);

  // Complete velocity state classifications
  let velocityRate = "maintenance_trajectory";
  if (netCaloricDeficitAvg < -500) {
    velocityRate = "aggressive_loss";
  } else if (netCaloricDeficitAvg < -150) {
    velocityRate = "moderate_loss";
  } else if (netCaloricDeficitAvg > 500) {
    velocityRate = "aggressive_surplus";
  } else if (netCaloricDeficitAvg > 150) {
    velocityRate = "moderate_surplus";
  }

  return {
    projectedWeightIn30Days: parseFloat(projectedWeight.toFixed(2)),
    velocityRate
  };
};