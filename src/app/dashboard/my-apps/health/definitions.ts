import { FoodItem } from "./types";

/**
 * Metabolic Equivalent of Task (MET) Coefficients
 * Calibrated against standard clinical tracking protocols for energy expenditure calculation pipelines.
 */
export const MET_VALUES: Record<string, number> = {
  walking_leisure: 2.5,
  walking_brisk: 3.8,
  running_jog: 7.0,
  running_fast: 11.5,
  cycling_leisure: 4.0,
  cycling_intense: 8.5,
  weightlifting_general: 3.5,
  weightlifting_heavy: 6.0,
  hiit: 8.0,
  swimming_moderate: 5.8,
  yoga_stretching: 2.5,
  elliptical_trainer: 5.0,
};

/**
 * Global Boundary Specifications and Validation Schemas
 * Prevents telemetry pollution, data corruption overflows, or client-side tampering profiles.
 */
export const HealthValidationRules = {
  /**
   * Evaluates a food target log structural matrix before executing computational logic loops.
   * Blocks memory injection, negative values, and extreme out-of-bound telemetry profiles.
   */
  validateNutritionalIntegrity: (food: Partial<FoodItem> | null | undefined): boolean => {
    if (!food) return false;

    // Direct initialization with strict fallbacks to isolate variable state parameters
    const calories = food.calories ?? 0;
    const protein = food.proteinGrams ?? 0;
    const carbs = food.carbsGrams ?? 0;
    const fat = food.fatGrams ?? 0;
    const sodium = food.micronutrients?.sodium_mg ?? 0;

    // 1. Operational Float Guard: Block NaN, Infinity, or multi-nested injection streams
    if (
      !Number.isFinite(calories) ||
      !Number.isFinite(protein) ||
      !Number.isFinite(carbs) ||
      !Number.isFinite(fat) ||
      !Number.isFinite(sodium)
    ) {
      return false;
    }

    // 2. Absolute Mathematical Floor & Ceiling Boundaries
    if (calories < 0 || calories > 12000) return false;    // Limit past realistic daily cap profiles
    if (protein < 0 || protein > 1200) return false;
    if (carbs < 0 || carbs > 2000) return false;
    if (fat < 0 || fat > 600) return false;
    if (sodium < 0 || sodium > 60000) return false;       // Hard limit to avoid integer anomalies

    // 3. Thermodynamic Boundary Rule Check
    // Evaluates whether structural macro assignments align with standard thermodynamic laws.
    // Allow up to a 20% margin for standard consumer product rounding tolerances.
    const calculatedMacroCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    if (calculatedMacroCalories > calories * 1.20 + 75) {
      // Rejects payload if tracking parameters declare an energy profile that defies physics
      return false;
    }

    return true;
  }
};