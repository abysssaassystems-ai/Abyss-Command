"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FoodDatabaseEntry, MealType, FoodLogItem } from "@/app/dashboard/my-apps/health/types";
import { CertifiedPublicFoodEngine } from "@/app/dashboard/my-apps/health/CertifiedPublicFoodEngine";
import { 
  Plus, 
  X, 
  Search, 
  Droplets, 
  Moon, 
  Trash2, 
  Loader2, 
  Utensils
} from "lucide-react";

interface NutritionTabProps {
  foodLog: FoodLogItem[];
  setFoodLog: React.Dispatch<React.SetStateAction<FoodLogItem[]>>;
}

export default function NutritionTab({ foodLog, setFoodLog }: NutritionTabProps): React.JSX.Element {
  // --- MULTI-TENANT SECURE AUTHENTICATION MATRIX HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
  const [activeSearchMeal, setActiveSearchMeal] = useState<MealType | null>(null);

  // Lifestyle Tracking States partitioned by tenant context
  const [waterOunces, setWaterOunces] = useState<number>(48);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  // Form Field registries
  const [foodName, setFoodName] = useState("");
  const [servingInput, setServingInput] = useState("");
  const [proteinIn, setProteinIn] = useState("");
  const [carbsIn, setCarbsIn] = useState("");
  const [fatsIn, setFatsIn] = useState("");
  const [caloriesIn, setCaloriesIn] = useState("");

  // Live API Engine States
  const [searchResults, setSearchResults] = useState<FoodDatabaseEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Hydrate tenant credentials and sync decoupled metrics securely
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
        
        // Hydrate client state metrics from active verified configuration space partitions
        const storedWater = localStorage.getItem(`nutrition_water_${user.email}`);
        const storedSleep = localStorage.getItem(`nutrition_sleep_${user.email}`);
        if (storedWater) setWaterOunces(Number(storedWater));
        if (storedSleep) setSleepHours(Number(storedSleep));
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    // 1. Core asynchronous verification signature pass
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("NUTRITION_AUTH_HYDRATION_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Continuous real-time subscription channel stream context sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper macro check to validate if security boundary context is actively ready
  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);

  // Sync state loops to client storage boundaries safely
  const updateWaterPartition = (val: number) => {
    setWaterOunces(val);
    if (isSecuredTenant) {
      localStorage.setItem(`nutrition_water_${tenantEmail}`, val.toString());
    }
  };

  const updateSleepPartition = (val: number) => {
    setSleepHours(val);
    if (isSecuredTenant) {
      localStorage.setItem(`nutrition_sleep_${tenantEmail}`, val.toString());
    }
  };

  // Debounced query lookups tracking high-frequency dataset arrays
  useEffect(() => {
    if (foodName.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const publicRegistryMatches = await CertifiedPublicFoodEngine.fetchFromPublicRegistry(foodName);
        setSearchResults(publicRegistryMatches);
      } catch (err) {
        console.error("Database lookup pipeline encountered an anomaly:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [foodName]);

  const handleSelectRegistryItem = (item: FoodDatabaseEntry) => {
    let rawName = item.name;
    if (item.name.startsWith("[")) {
      const closeBracket = item.name.indexOf("]");
      if (closeBracket !== -1) {
        rawName = item.name.substring(closeBracket + 1).trim();
      }
    }
    setFoodName(rawName);
    setServingInput(`${item.servingSizeGrams}g serving`);
    setCaloriesIn(item.calories.toString());
    setProteinIn(item.proteinGrams.toString());
    setCarbsIn(item.carbsGrams.toString());
    setFatsIn(item.fatGrams.toString());
    setSearchResults([]); 
  };

  // --- MATHEMATICAL EQUATION MODEL METRICS ---
  const budgetTargetCals = 1693;
  const totalCalories = foodLog.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = foodLog.reduce((acc, item) => acc + item.proteinGrams, 0);
  const totalCarbs = foodLog.reduce((acc, item) => acc + item.carbsGrams, 0);
  const totalFats = foodLog.reduce((acc, item) => acc + item.fatGrams, 0);
  const caloriesRemaining = budgetTargetCals - totalCalories;

  const handleLogFood = (e: React.FormEvent, mealType: MealType) => {
    e.preventDefault();
    if (!foodName || tenantEmail === "unauthenticated_session") return;

    const p = Number(proteinIn) || 0;
    const c = Number(carbsIn) || 0;
    const f = Number(fatsIn) || 0;
    const finalCals = Number(caloriesIn) || (p * 4) + (c * 4) + (f * 9);

    setFoodLog([
      ...foodLog,
      {
        id: Date.now().toString(),
        name: foodName,
        servingText: servingInput || "1 Serving",
        proteinGrams: p,
        carbsGrams: c,
        fatGrams: f,
        calories: finalCals,
        mealType: mealType,
      },
    ]);

    // Reset localized variables
    setFoodName("");
    setServingInput("");
    setProteinIn("");
    setCarbsIn("");
    setFatsIn("");
    setCaloriesIn("");
    setActiveSearchMeal(null);
  };

  const handleDeleteItem = (id: string) => {
    setFoodLog(foodLog.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-4 sm:px-1">
      
      {/* 1. PROGRESS CORNER: MATHEMATICAL CALORIE DASHBOARD CARD */}
      <div className="bg-white border border-gray-200 shadow-xs rounded-[2rem] p-5 sm:p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600" />
        
        <span className="text-[10px] uppercase font-mono font-black text-gray-400 tracking-widest block mb-2">// Absolute Metabolic Balance Layer</span>
        
        {/* Responsive Grid Matrix splits to block data typography fracture points */}
        <div className="grid grid-cols-3 gap-2 items-center max-w-md mx-auto my-3 border border-gray-100 bg-gray-50/50 p-3 rounded-2xl font-mono">
          <div className="text-center">
            <span className="text-xl sm:text-2xl font-black text-gray-900 block tracking-tight tabular-nums">{budgetTargetCals}</span>
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Target Cap</span>
          </div>
          <div className="text-gray-300 font-light text-sm uppercase font-sans font-black">Vs</div>
          <div className="text-center">
            <span className="text-xl sm:text-2xl font-black text-purple-600 block tracking-tight tabular-nums">{totalCalories}</span>
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Logged In</span>
          </div>
        </div>

        <div className="pt-2 max-w-xs mx-auto">
          <span className={`text-4xl font-mono font-black tracking-tighter block tabular-nums ${caloriesRemaining < 0 ? "text-rose-600" : "text-gray-900"}`}>
            {caloriesRemaining}
          </span>
          <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-400 block mt-1">
            Net Remaining Kcal Balance
          </span>
        </div>

        {/* Client Hardware-Accelerated Progress Track Slider Frame */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-5 border border-gray-200/40">
          <div 
            className="bg-purple-600 h-full rounded-full transition-all duration-500 ease-out shadow-xs" 
            style={{ width: `${Math.min((totalCalories / budgetTargetCals) * 100, 100)}%` }}
          />
        </div>

        {/* Macro Summary Split Subheader Bar */}
        <div className="grid grid-cols-3 gap-2 text-[10px] font-mono font-black uppercase tracking-wider pt-4 mt-4 border-t border-gray-100">
          <div className="text-blue-600 bg-blue-50/30 py-1 rounded border border-blue-100/40">P: <span className="text-gray-900 font-bold">{totalProtein}g</span></div>
          <div className="text-purple-600 bg-purple-50/30 py-1 rounded border border-purple-100/40">C: <span className="text-gray-900 font-bold">{totalCarbs}g</span></div>
          <div className="text-amber-600 bg-amber-50/30 py-1 rounded border border-amber-100/40">F: <span className="text-gray-900 font-bold">{totalFats}g</span></div>
        </div>
      </div>

      {/* 2. LIFESTYLE ADJACENT TELEMETRY WIDGET PIPELINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Hydration Input Stack */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
              <Droplets className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">Intracellular Water</span>
              <h3 className="text-base font-mono font-black text-gray-900 tracking-tight mt-0.5 tabular-nums">
                {waterOunces} <span className="text-xs font-sans font-bold text-gray-400 lowercase">fl oz</span>
              </h3>
            </div>
          </div>
          <div className="flex gap-1 shrink-0 select-none">
            <button 
              type="button"
              disabled={tenantEmail === "unauthenticated_session"}
              onClick={() => updateWaterPartition(Math.max(0, waterOunces - 8))} 
              className="bg-gray-50 border border-gray-200 text-gray-500 font-black w-11 h-11 rounded-xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm cursor-pointer"
            >
              -
            </button>
            <button 
              type="button"
              disabled={tenantEmail === "unauthenticated_session"}
              onClick={() => updateWaterPartition(waterOunces + 8)} 
              className="bg-purple-600 text-white font-mono font-black text-[10px] uppercase px-3 h-11 rounded-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center min-w-[54px] tracking-wider cursor-pointer"
            >
              +8 oz
            </button>
          </div>
        </div>

        {/* Sleep Duration Input Stack */}
        <div className="bg-white border border-gray-200 shadow-xs rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
              <Moon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-gray-400 block uppercase tracking-wider">Endocrine Architecture</span>
              <h3 className="text-base font-mono font-black text-gray-900 tracking-tight mt-0.5 tabular-nums">
                {sleepHours} <span className="text-xs font-sans font-bold text-gray-400 lowercase">hours</span>
              </h3>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11 shrink-0 shadow-inner">
            <input 
              type="number" 
              step="0.5"
              min="0"
              max="24"
              disabled={tenantEmail === "unauthenticated_session"}
              value={sleepHours || ""} 
              onChange={(e) => updateSleepPartition(parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              className="w-12 bg-transparent border-none font-mono font-black text-sm text-gray-800 outline-none text-center p-0 focus:ring-0 tabular-nums disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 3. RESPONSIVE MEAL CONTROLLER SECTION ARRAYS */}
      <div className="space-y-4">
        {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => {
          const filteredItems = foodLog.filter((item) => item.mealType === type);
          const categoryTotal = filteredItems.reduce((acc, item) => acc + item.calories, 0);
          const isSearchOpen = activeSearchMeal === type;

          return (
            <div key={type} className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
              
              {/* Category Header Row Strip */}
              <div className="px-4 sm:px-5 py-3.5 flex justify-between items-center border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-baseline gap-2 min-w-0 pr-2 font-mono">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 truncate">
                    {type}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 shrink-0 tracking-normal tabular-nums">
                    • {categoryTotal} kcal allocation
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    if (isSearchOpen) {
                      setActiveSearchMeal(null);
                    } else {
                      setActiveSearchMeal(type);
                      setFoodName(""); 
                    }
                  }} 
                  className={`text-[10px] font-mono font-black uppercase tracking-wider px-4 py-2 rounded-xl border transition-all shrink-0 h-9 flex items-center justify-center cursor-pointer ${
                    isSearchOpen 
                      ? "bg-gray-100 border-gray-300 text-gray-500" 
                      : "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100/40"
                  }`}
                >
                  {isSearchOpen ? "Close Drawer" : "＋ Log Entry"}
                </button>
              </div>

              {/* SLIDEOUT INLINE SEARCH & INPUT DRAWER SUBPANEL */}
              {isSearchOpen && (
                <div className="p-4 sm:p-5 bg-gray-50/40 border-b border-gray-100 space-y-4 animate-fadeIn relative">
                  <div className="space-y-1.5 relative">
                    <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3.5 shadow-xs focus-within:border-purple-500 transition-colors">
                      <Search className="w-4 h-4 text-gray-400 shrink-0 stroke-[2.5] mr-2" />
                      <input 
                        type="text" 
                        required
                        autoFocus
                        disabled={tenantEmail === "unauthenticated_session"}
                        placeholder={tenantEmail === "unauthenticated_session" ? "Session locked" : "Query central nutritional logs (e.g. Avocado, Basmati Oats)..."}
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full bg-transparent py-3 text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none disabled:opacity-50" 
                      />
                      {isSearching && (
                        <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0 select-none ml-2" />
                      )}
                    </div>

                    {/* SUGGESTIONS OVERLAY FLUID MENU */}
                    {searchResults.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 bg-white border border-gray-200 rounded-xl overflow-y-auto z-50 shadow-lg divide-y divide-gray-100 font-mono">
                        {searchResults.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleSelectRegistryItem(item)}
                            className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer text-left transition-colors"
                          >
                            <div className="text-xs font-black text-gray-900 uppercase tracking-tight">{item.name.toLowerCase()}</div>
                            <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider tabular-nums">
                              {item.calories} Kcal | P: {item.proteinGrams}g | C: {item.carbsGrams}g | F: {item.fatGrams}g
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual customization metrics alignment sheet */}
                  <form onSubmit={(e) => handleLogFood(e, type)} className="space-y-4 text-xs font-mono font-black uppercase tracking-wider">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Serving Frame Reference</label>
                        <input type="text" disabled={tenantEmail === "unauthenticated_session"} placeholder="e.g. 1 Container, 150g" value={servingInput} onChange={(e) => setServingInput(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-sans font-medium outline-none focus:border-purple-500 normal-case text-gray-800 disabled:opacity-40" />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1">Absolute Calories</label>
                        <input type="number" step="any" disabled={tenantEmail === "unauthenticated_session"} placeholder="0" value={caloriesIn} onChange={(e) => setCaloriesIn(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-purple-600 outline-none focus:border-purple-500 tabular-nums disabled:opacity-40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1 text-center">Protein (g)</label>
                        <input type="number" step="any" disabled={tenantEmail === "unauthenticated_session"} placeholder="0" value={proteinIn} onChange={(e) => setProteinIn(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 text-center font-bold text-blue-600 outline-none focus:border-purple-500 tabular-nums disabled:opacity-40" />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1 text-center">Carbs (g)</label>
                        <input type="number" step="any" disabled={tenantEmail === "unauthenticated_session"} placeholder="0" value={carbsIn} onChange={(e) => setCarbsIn(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 text-center font-bold text-purple-600 outline-none focus:border-purple-500 tabular-nums disabled:opacity-40" />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 block mb-1 text-center">Fats (g)</label>
                        <input type="number" step="any" disabled={tenantEmail === "unauthenticated_session"} placeholder="0" value={fatsIn} onChange={(e) => setFatsIn(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 text-center font-bold text-amber-600 outline-none focus:border-purple-500 tabular-nums disabled:opacity-40" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button type="submit" disabled={tenantEmail === "unauthenticated_session"} className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-mono font-black uppercase tracking-wider text-[10px] px-6 h-11 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                        {tenantEmail === "unauthenticated_session" ? "Console Locked" : "Commit To Local Log"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* RENDER ACTIVE USER HISTORICAL LOG ENTRIES */}
              {filteredItems.length === 0 ? (
                <div className="px-5 py-5 text-xs text-gray-400 font-mono font-bold tracking-wider uppercase bg-white">// [ STORAGE_LINE_VACANT: No data allocated ]</div>
              ) : (
                <div className="divide-y divide-gray-100 bg-white">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="px-4 sm:px-5 py-3.5 flex justify-between items-center hover:bg-gray-50/40 transition-colors group">
                      
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className="text-xs font-black text-gray-900 truncate capitalize tracking-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center flex-wrap gap-x-2 text-[10px] text-gray-400 mt-1 font-mono font-bold uppercase tracking-wider tabular-nums">
                          <span className="truncate max-w-[120px] font-sans font-medium normal-case text-gray-500">{item.servingText}</span>
                          <span className="text-gray-200 select-none">•</span>
                          <span className="text-blue-600">P: {item.proteinGrams}g</span>
                          <span className="text-purple-600">C: {item.carbsGrams}g</span>
                          <span className="text-amber-600">F: {item.fatGrams}g</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-black">
                        <span className="text-gray-900 text-right min-w-[50px] tabular-nums bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                          {item.calories} <span className="text-[9px] text-gray-400 uppercase font-black">kcal</span>
                        </span>
                        
                        <button 
                          type="button"
                          onClick={() => handleDeleteItem(item.id)} 
                          className="text-gray-300 hover:text-rose-600 transition-colors border border-transparent hover:border-gray-100 w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer"
                          title="Purge transaction entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}