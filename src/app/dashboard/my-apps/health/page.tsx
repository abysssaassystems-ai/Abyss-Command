"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import HealthSidebar from "@/components/HealthSidebar";
import NutritionTab from "@/viewbars/health/NutritionTab";
import MealsTab from "@/viewbars/health/MealsTab";
import WorkoutsTab from "@/viewbars/health/WorkoutsTab";
import GoalsTab from "@/viewbars/health/GoalsTab";
import OverviewTab from "@/viewbars/health/OverviewTab";
import SupplementsTab from "@/viewbars/health/SupplementsTab";
import TrendsTab from "@/viewbars/health/TrendsTab";

// Processors and types imported directly from local utilities
import { calculateMetabolicBaseline, calculateCaloricTarget, calculateMacronutrientSplit } from "./processors";
import { ActivityLevel, FitnessGoal, BiologicalSex, TabID, FoodLogItem, SupplementStackItem } from "./types";

export default function HealthHub(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabID>("overview");

  // TENANT ISOLATION AND GATEKEEPER STATES
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // GLOBAL BIOMETRIC STATES
  const [weight, setWeight] = useState<number>(82);
  const [height, setHeight] = useState<number>(180);
  const [age, setAge] = useState<number>(28);
  const [sex, setSex] = useState<BiologicalSex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderately_active");
  const [goal, setGoal] = useState<FitnessGoal>("fat_loss");

  // CLOUD DATABASE BACKED REPOSITORIES
  const [foodLog, setFoodLog] = useState<FoodLogItem[]>([]);
  const [supplementStack, setSupplementStack] = useState<SupplementStackItem[]>([]);

  // 1. HANDSHAKE VERIFICATION & BILLING ROUTE GUARD
  useEffect(() => {
    async function verifyModuleAccess() {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser || !authUser.email) {
          setHasAccess(false);
          return;
        }

        setUser(authUser);

        // Verify module entry entitlement permissions criteria records
        const { data, error } = await supabase
          .from('client_module_access')
          .select('is_active')
          .eq('client_email', authUser.email)
          .eq('module_id', 'health-tracker')
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          setHasAccess(false);
        } else {
          setHasAccess(true);
          // Hydrate dynamic data using user ID to match database tables
          await hydrateHealthWorkspace(authUser.id);
        }
      } catch (err) {
        console.error("HEALTH_SECURITY_EXEC_EXCEPTION:", err);
        setHasAccess(false);
      }
    }

    verifyModuleAccess();
  }, []);

  // 2. LIVE DATABASE STREAM RETRIEVAL VIA USER_ID
  async function hydrateHealthWorkspace(userId: string) {
    try {
      // Pull dynamic biometric variables out of daily_biometrics_log
      const { data: biometrics } = await supabase
        .from('daily_biometrics_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (biometrics) {
        if (biometrics.weight) setWeight(biometrics.weight);
        if (biometrics.height) setHeight(biometrics.height);
        if (biometrics.age) setAge(biometrics.age);
        if (biometrics.sex) setSex(biometrics.sex as BiologicalSex);
      }

      // Stream user isolated nutrient ingest loops from food_logs
      const { data: dbFoods } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId);

      // Stream custom stack arrays from supplement_logs
      const { data: dbSupps } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', userId);

      if (dbFoods && dbFoods.length > 0) setFoodLog(dbFoods);
      if (dbSupps && dbSupps.length > 0) setSupplementStack(dbSupps);

      // Fixed Comment Syntax: Render fallback initial entries if records are pristine empty
      if (!dbFoods || dbFoods.length === 0) {
        setFoodLog([
          { id: "b1", name: "Scrambled Eggs", servingText: "2 Each", protein: 12, carbs: 1, fats: 10, calories: 140, mealType: "breakfast" },
          { id: "b2", name: "Banana, Medium", servingText: "1 Each", protein: 1, carbs: 27, fats: 0, calories: 105, mealType: "breakfast" },
          { id: "l1", name: "Pizza, Cheese", servingText: "1 Slice", protein: 12, carbs: 32, fats: 9, calories: 200, mealType: "lunch" }
        ]);
      }

      if (!dbSupps || dbSupps.length === 0) {
        setSupplementStack([
          { id: "sup_1", name: "Creatine Monohydrate", dosage: "5g", timing: "pre_workout", isTaken: false },
          { id: "sup_2", name: "Omega-3 Fish Oil", dosage: "2000mg", timing: "morning", isTaken: true }
        ]);
      }

    } catch (err) {
      console.error("HEALTH_HYDRATION_EXCEPTION:", err);
    }
  }

  // --- CORE ANALYTICAL MATHEMATICAL ENGINES ---
  const metabolicBaseline = calculateMetabolicBaseline({ weightKg: weight, heightCm: height, ageYears: age, sex, activityLevel: activity });
  const caloricTarget = calculateCaloricTarget({ tdee: metabolicBaseline.payload.tdee, goal, aggressionFactor: "moderate" });
  const macroSplit = calculateMacronutrientSplit({ targetCalories: caloricTarget.payload.targetCalories, weightKg: weight, preference: "high_protein" });

  const totalCalories = foodLog.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = foodLog.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = foodLog.reduce((acc, item) => acc + item.carbs, 0);
  const totalFats = foodLog.reduce((acc, item) => acc + item.fats, 0);

  if (hasAccess === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white select-none">
        <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-3xl shadow-xl max-w-md w-full">
          <div className="bg-white rounded-[23px] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto border border-purple-100 text-purple-600 font-bold">🍏</div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Bio-Engine Locked</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your active workspace profile has not verified a license deployment for the Bio-Engine Biometrics tracking console node. Provision access immediately from the marketplace.
            </p>
            <Link href="/dashboard/app-catalogue" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:opacity-95">
              Unlock Module Terminal ($9.99/mo)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccess === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-gray-400 uppercase tracking-widest animate-pulse bg-white select-none">
        // Synchronizing cloud biometrics parameters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex font-sans antialiased select-none">
      <HealthSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto w-full min-h-screen flex flex-col lg:flex-row border-l border-gray-200 bg-white">
        <div className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl bg-white">
          
          {activeTab === "overview" && (
            <OverviewTab 
              foodLog={foodLog} 
              setFoodLog={setFoodLog}
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

        <div className="w-full lg:w-80 bg-gray-50/70 border-t lg:border-t-0 lg:border-l border-gray-200 p-6 space-y-6 shrink-0 z-10">
          <div>
            <span className="text-[10px] font-mono font-black text-purple-600 uppercase tracking-widest block mb-0.5">
              // BIOMETRIC TELEMETRY READOUT
            </span>
            <h3 className="text-base font-black text-gray-900 uppercase italic tracking-tight">
              Calculus Stack
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-gray-500 font-sans font-medium">BMR Baseline:</span>
              <span className="text-purple-600 font-bold">{metabolicBaseline.payload.bmr} kcal</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <span className="text-gray-500 font-sans font-medium">Active TDEE:</span>
              <span className="text-blue-600 font-bold">{metabolicBaseline.payload.tdee} kcal</span>
            </div>

            <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-2xl shadow-sm">
              <div className="bg-white rounded-[15px] p-4 space-y-4">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block border-b border-gray-100 pb-1">
                  // CALORIC ALLOCATIONS
                </span>
                
                <div className="space-y-3 font-sans">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">Protein Target</span>
                      <span className="text-purple-600 font-mono font-bold">{totalProtein}g / {macroSplit.payload.proteinGrams}g</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${Math.min((totalProtein / macroSplit.payload.proteinGrams) * 100, 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">Carbohydrates</span>
                      <span className="text-blue-600 font-mono font-bold">{totalCarbs}g / {macroSplit.payload.carbsGrams}g</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${Math.min((totalCarbs / macroSplit.payload.carbsGrams) * 100, 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">Lipids / Fats</span>
                      <span className="text-gray-900 font-mono font-bold">{totalFats}g / {macroSplit.payload.fatsGrams}g</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-gray-400 h-full transition-all duration-300" style={{ width: `${Math.min((totalFats / macroSplit.payload.fatsGrams) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 text-center">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                    NET CALORIC TARGET: {caloricTarget.payload.targetCalories} KCAL
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}