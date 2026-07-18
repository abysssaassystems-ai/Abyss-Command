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
    const { weightKg, heightCm, ageYears, sex, activityLevel } = input;
  
    const sexModifier = sex === "male" ? 5 : sex === "female" ? -161 : -78; // Neutral midpoint for unspecified sex
    const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + sexModifier;
  
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
    const tdee = bmr * multiplier;
  
    return {
      success: true,
      timestamp: new Date().toISOString(),
      payload: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
      }
    };
  };
  
  /**
   * Modulates caloric inputs based on dynamic goal states
   */
  export const calculateCaloricTarget = (
    input: CalorieTargetInput
  ): HealthNodeOutput<{ targetCalories: number; netCaloricDelta: number }> => {
    const { tdee, goal, aggressionFactor } = input;
    
    let deltaPct = 0;
    if (goal === "fat_loss") {
      deltaPct = aggressionFactor === "conservative" ? -0.15 : aggressionFactor === "moderate" ? -0.20 : -0.25;
    } else if (goal === "muscle_gain") {
      deltaPct = aggressionFactor === "conservative" ? 0.05 : aggressionFactor === "moderate" ? 0.10 : 0.15;
    }
  
    const netCaloricDelta = Math.round(tdee * deltaPct);
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
    const { targetCalories, weightKg, preference } = input;
    
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
  
    if (preference !== "low_carb_keto") {
      const allocatedCalories = (proteinGrams * 4) + (fatsGrams * 9);
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
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0 };
  
    meals.forEach((meal) => {
      if (!meal.foods) return;
      meal.foods.forEach((food) => {
        if (!HealthValidationRules.validateNutritionalIntegrity(food)) return;
  
        totals.calories += food.calories;
        totals.protein += food.proteinGrams;
        totals.carbs += food.carbsGrams;
        totals.fat += food.fatGrams;
        totals.sodium += food.micronutrients.sodium_mg;
      });
    });
  
    return totals;
  };
  
  export const processWearableExpenditure = (
    metadata: ActivityMetadata, 
    userWeightKg: number, 
    durationMin: number,
    activityKey: string
  ): number => {
    const met = MET_VALUES[activityKey] || 3.0;
    const calculatedBurn = met * 3.5 * (userWeightKg / 200) * durationMin;
    const stepBonusCalories = metadata.stepsCount * 0.04; 
    
    return Math.round(calculatedBurn + stepBonusCalories);
  };
  
  export const calculatePredictiveVelocity = (
    weightHistory: WeightEntry[], 
    netCaloricDeficitAvg: number
  ): { projectedWeightIn30Days: number; velocityRate: string } => {
    if (weightHistory.length === 0) return { projectedWeightIn30Days: 0, velocityRate: "stable" };
    
    const currentWeight = weightHistory[weightHistory.length - 1].weight;
    const monthlyWeightDeltaKg = (netCaloricDeficitAvg * 30) / 7700;
    const projectedWeight = currentWeight + monthlyWeightDeltaKg;
  
    return {
      projectedWeightIn30Days: parseFloat(projectedWeight.toFixed(2)),
      velocityRate: netCaloricDeficitAvg < -300 ? "aggressive_loss" : "maintenance_trajectory"
    };
  };