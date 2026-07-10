import { FoodDatabaseEntry } from "../types";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || "DEMO_KEY"; // Falls back to public demo limits if not set

export const CertifiedPublicFoodEngine = {
  /**
   * Hits the certified public registry server to pull live nutritional item streams
   * @param query - Text input string (e.g., "Chipotle chicken bowl" or "raw macaroni")
   */
  fetchFromPublicRegistry: async (query: string): Promise<FoodDatabaseEntry[]> => {
    if (!query || query.trim().length < 2) return [];

    try {
      // Build search payload matching stock ticker parameters
      const url = `${USDA_BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=25`;
      
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error(`USDA Server Delta Exception: ${response.status}`);
      
      const data = await response.json();
      if (!data.foods || data.foods.length === 0) return [];

      // Stream mapping loop to normalize the live data into our platform types
      return data.foods.map((food: any) => {
        const findNutrient = (id: number): number => {
          const nutrient = food.foodNutrients?.find((n: any) => n.nutrientId === id);
          return nutrient ? parseFloat(nutrient.value) : 0;
        };

        // Extract certified system weights
        const protein = findNutrient(1003);
        const fat = findNutrient(1004);
        const carbs = findNutrient(1005);
        const calories = findNutrient(1008) || (protein * 4 + carbs * 4 + fat * 9);
        const sodium = findNutrient(1093);

        const isBranded = food.dataType === "Branded";
        const brandName = food.brandOwner ? `[${food.brandOwner}] ` : "";

        return {
          id: `usda_${food.fdcId}`,
          name: `${brandName}${food.description.toLowerCase()}`,
          category: isBranded ? "commercial dining" : "home made",
          verifiedStatus: true,
          servingSizeGrams: food.servingSize || 100, // Normalized to 100g standard if raw component
          calories: Math.round(calories),
          carbsGrams: parseFloat(carbs.toFixed(1)),
          fatGrams: parseFloat(fat.toFixed(1)),
          proteinGrams: parseFloat(protein.toFixed(1)),
          micronutrients: {
            sodium_mg: Math.round(sodium)
          }
        };
      });

    } catch (error) {
      console.error("CRITICAL ENGINE FAULT: Public Registry Connection Broken", error);
      return [];
    }
  }
};