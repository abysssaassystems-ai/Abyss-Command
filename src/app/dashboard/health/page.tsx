"use client";

import React, { useState } from "react";
import HealthSidebar from "@/components/HealthSidebar";
import NutritionTab from "@/viewbars/NutritionTab";
import MealsTab from "@/viewbars/MealsTab";
import WorkoutsTab from "@/viewbars/WorkoutsTab";
import GoalsTab from "@/viewbars/GoalsTab";
import OverviewTab from "@/viewbars/OverviewTab";
import SupplementsTab from "@/viewbars/SupplementsTab";
import TrendsTab from "@/viewbars/TrendsTab";

// Local relative imports adjusted directly to current folder level
import { calculateMetabolicBaseline, calculateCaloricTarget, calculateMacronutrientSplit } from "./processors";
import { ActivityLevel, FitnessGoal, BiologicalSex, TabID, FoodLogItem, SupplementStackItem } from "./types";

export default function HealthHub() {
  // Set default entry point to your new central timeline overview console
  const [activeTab, setActiveTab] = useState<TabID>("overview");

  // Global Biometric States (Feeds downstream math parameters dynamically)
  const [weight, setWeight] = useState<number>(82);
  const [height, setHeight] = useState<number>(180);
  const [age, setAge] = useState<number>(28);
  const [sex, setSex] = useState<BiologicalSex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderately_active");
  const [goal, setGoal] = useState<FitnessGoal>("fat_loss");

  // Shared Food Log Core State Engine Array
  const [foodLog, setFoodLog] = useState<FoodLogItem[]>([
    { id: "b1", name: "Scrambled Eggs", servingText: "2 Each", protein: 12, carbs: 1, fats: 10, calories: 140, mealType: "breakfast" },
    { id: "b2", name: "Banana, Medium", servingText: "1 Each", protein: 1, carbs: 27, fats: 0, calories: 105, mealType: "breakfast" },
    { id: "b3", name: "Coffee, w/ Skim Milk", servingText: "8 Fluid ounces", protein: 3, carbs: 6, fats: 0, calories: 55, mealType: "breakfast" },
    { id: "l1", name: "Pizza, Cheese", servingText: "1 Slice", protein: 12, carbs: 32, fats: 9, calories: 200, mealType: "lunch" },
    { id: "l2", name: "Carrots, Baby", servingText: "10 Each", protein: 1, carbs: 8, fats: 0, calories: 35, mealType: "lunch" },
    { id: "l3", name: "Iced Tea", servingText: "16 Fluid ounces", protein: 0, carbs: 5, fats: 0, calories: 20, mealType: "lunch" },
    { id: "l4", name: "Salad, Greens", servingText: "1 Cup", protein: 2, carbs: 10, fats: 1, calories: 59, mealType: "lunch" }
  ]);

  // Shared Supplement Pipeline State (Feeds both Overview and Supplements tabs smoothly)
  const [supplementStack, setSupplementStack] = useState<SupplementStackItem[]>([
    { id: "sup_1", name: "Creatine Monohydrate", dosage: "5g", timing: "pre_workout", isTaken: false },
    { id: "sup_2", name: "Omega-3 Fish Oil", dosage: "2000mg", timing: "morning", isTaken: true },
    { id: "sup_3", name: "Caffeine / Thermogenic", dosage: "200mg", timing: "morning", isTaken: true },
    { id: "sup_4", name: "Whey Isolate", dosage: "30g", timing: "night", isTaken: false }
  ]);

  // Compute live calculations downstream
  const metabolicBaseline = calculateMetabolicBaseline({ weightKg: weight, heightCm: height, ageYears: age, sex, activityLevel: activity });
  const caloricTarget = calculateCaloricTarget({ tdee: metabolicBaseline.payload.tdee, goal, aggressionFactor: "moderate" });
  const macroSplit = calculateMacronutrientSplit({ targetCalories: caloricTarget.payload.targetCalories, weightKg: weight, preference: "high_protein" });

  const totalCalories = foodLog.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = foodLog.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = foodLog.reduce((acc, item) => acc + item.carbs, 0);
  const totalFats = foodLog.reduce((acc, item) => acc + item.fats, 0);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex font-sans antialiased selection:bg-[#00F2FE]/30 select-none">
      
      {/* Left Hand Command Panel Nav Sideframe */}
      <HealthSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Content View Switcher Shell */}
      <main className="flex-1 overflow-y-auto w-full min-h-screen flex flex-col lg:flex-row border-l border-gray-800/60">
        
        {/* Wide Interactive Workplace Workspace Canvas */}
        <div className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
          
          {activeTab === "overview" && (
            <OverviewTab 
              foodLog={foodLog} 
              setFoodLog={setFoodLog}
              supplementStack={supplementStack}
              setSupplementStack={setSupplementStack}
              targetCalories={caloricTarget.payload.targetCalories}
            />
          )}

          {activeTab === "nutrition" && (
            <NutritionTab foodLog={foodLog} setFoodLog={setFoodLog} />
          )}

          {activeTab === "meals" && <MealsTab />}
          {activeTab === "workouts" && <WorkoutsTab />}
          {activeTab === "goals" && <GoalsTab />}
          
          {activeTab === "supplements" && (
            <SupplementsTab 
              supplementStack={supplementStack} 
              setSupplementStack={setSupplementStack} 
            />
          )}
          
          {activeTab === "trends" && (
            <TrendsTab foodLog={foodLog} />
          )}

        </div>

        {/* Right Side Asymmetric Status Bar (The Telemetry Stack) */}
        <div className="w-full lg:w-80 bg-[#121824]/40 border-t lg:border-t-0 lg:border-l border-gray-800/80 p-6 space-y-6 shrink-0">
          <div>
            <span className="text-[9px] font-mono font-black text-[#00B8C4] uppercase tracking-widest block mb-1">
              // REALTIME BIOMETRIC READOUT
            </span>
            <h3 className="text-sm font-black text-white uppercase italic tracking-wide">
              Static Telemetry
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="bg-[#121824] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <span className="text-gray-400">BMR Baseline:</span>
              <span className="text-blue-400 font-bold font-mono">{metabolicBaseline.payload.bmr} kcal</span>
            </div>

            <div className="bg-[#121824] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <span className="text-gray-400">Active TDEE:</span>
              <span className="text-gray-200 font-bold font-mono">{metabolicBaseline.payload.tdee} kcal</span>
            </div>

            {/* Live Macro Distribution Targets Barometers */}
            <div className="bg-[#121824] border border-gray-800 rounded-xl p-4 space-y-3">
              <span className="text-[10px] text-[#00F2FE] font-black uppercase tracking-wider block">
                // TARGET ALLOCATIONS
              </span>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-orange-400 font-bold">Protein (Target)</span>
                    <span className="text-gray-300">{totalProtein} / {macroSplit.payload.proteinGrams}g</span>
                  </div>
                  <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full transition-all duration-300" style={{ width: `${Math.min((totalProtein / macroSplit.payload.proteinGrams) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-amber-400 font-bold">Carbs (Target)</span>
                    <span className="text-gray-300">{totalCarbs} / {macroSplit.payload.carbsGrams}g</span>
                  </div>
                  <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${Math.min((totalCarbs / macroSplit.payload.carbsGrams) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-purple-400 font-bold">Fats (Target)</span>
                    <span className="text-gray-300">{totalFats} / {macroSplit.payload.fatsGrams}g</span>
                  </div>
                  <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${Math.min((totalFats / macroSplit.payload.fatsGrams) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}