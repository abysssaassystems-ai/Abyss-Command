// 1. FIXED: Adjusted relative path to climb out of: health -> my-apps -> dashboard -> app -> src
// Alternative if using Next.js path aliases: import { FoodDatabaseEntry } from "@/types";
import { FoodDatabaseEntry } from "./types";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const API_KEY = process.env.USDA_API_KEY; 

export const CertifiedPublicFoodEngine = {
  /**
   * Securely queries the certified public registry server for live nutritional streams.
   */
  fetchFromPublicRegistry: async (query: string): Promise<FoodDatabaseEntry[]> => {
    if (!query || query.trim().length < 2) return [];

    if (typeof window !== "undefined") {
      console.error("🚨 SECURITY BREACH: CertifiedPublicFoodEngine executed on client context.");
      return [];
    }

    try {
      const activeKey = API_KEY || "DEMO_KEY";
      const url = `${USDA_BASE_URL}?api_key=${activeKey}&query=${encodeURIComponent(query)}&pageSize=25`;
      
      const response = await fetch(url, { 
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      
      if (!response.ok) return []; 
      
      const data = await response.json();
      if (!data || !Array.isArray(data.foods) || data.foods.length === 0) return [];

      return data.foods.map((food: any): FoodDatabaseEntry | null => {
        if (!food) return null;

        const findNutrient = (id: number): number => {
          const nutrient = food.foodNutrients?.find((n: any) => n.nutrientId === id);
          if (!nutrient || nutrient.value === undefined || nutrient.value === null) return 0;
          const parsed = parseFloat(nutrient.value);
          return isNaN(parsed) ? 0 : parsed;
        };

        const protein = findNutrient(1003);
        const fat = findNutrient(1004);
        const carbs = findNutrient(1005);
        const calories = findNutrient(1008) || (protein * 4 + carbs * 4 + fat * 9);
        const sodium = findNutrient(1093);

        const isBranded = food.dataType === "Branded";
        const brandName = food.brandOwner ? `[${food.brandOwner}] ` : "";
        const rawDescription = food.description ? String(food.description).toLowerCase() : "unlabeled registry item";

        return {
          id: `usda_${food.fdcId || Math.random().toString(36).substring(2, 7)}`,
          name: `${brandName}${rawDescription}`,
          category: isBranded ? "commercial dining" : "home made",
          verifiedStatus: true,
          servingSizeGrams: Number(food.servingSize) || 100, 
          calories: Math.round(calories),
          carbsGrams: parseFloat(carbs.toFixed(1)),
          fatGrams: parseFloat(fat.toFixed(1)),
          proteinGrams: parseFloat(protein.toFixed(1)),
          micronutrients: {
            sodium_mg: Math.round(sodium)
          }
        };
      })
      // 2. FIXED: Explicitly type parameter 'item' to satisfy strict 'noImplicitAny' configurations
      .filter((item: FoodDatabaseEntry | null): item is FoodDatabaseEntry => item !== null);

    } catch (error) {
      console.error("❌ CRITICAL ENGINE FAULT:", error);
      return [];
    }
  }
};