"use client";

import React, { useState, useEffect } from "react";
import { FoodDatabaseEntry, MealType, FoodLogItem } from "@/app/dashboard/health/types";
import { CertifiedPublicFoodEngine } from "@/app/dashboard/health/CertifiedPublicFoodEngine";

interface NutritionTabProps {
  foodLog: FoodLogItem[];
  setFoodLog: React.Dispatch<React.SetStateAction<FoodLogItem[]>>;
}

export default function NutritionTab({ foodLog, setFoodLog }: NutritionTabProps) {
  const [activeSearchMeal, setActiveSearchMeal] = useState<MealType | null>(null);

  // Lifestyle Tracking States
  const [waterOunces, setWaterOunces] = useState<number>(48);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  // Form states
  const [foodName, setFoodName] = useState("");
  const [servingInput, setServingInput] = useState("");
  const [proteinIn, setProteinIn] = useState("");
  const [carbsIn, setCarbsIn] = useState("");
  const [fatsIn, setFatsIn] = useState("");
  const [caloriesIn, setCaloriesIn] = useState("");

  // Live API Engine States
  const [searchResults, setSearchResults] = useState<FoodDatabaseEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
        console.error("Database search encountered an anomaly", err);
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

  const budgetTargetCals = 1693;
  const totalCalories = foodLog.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = foodLog.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = foodLog.reduce((acc, item) => acc + item.carbs, 0);
  const totalFats = foodLog.reduce((acc, item) => acc + item.fats, 0);
  const caloriesRemaining = budgetTargetCals - totalCalories;

  const handleLogFood = (e: React.FormEvent, mealType: MealType) => {
    e.preventDefault();
    if (!foodName) return;

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
        protein: p,
        carbs: c,
        fats: f,
        calories: finalCals,
        mealType: mealType,
      },
    ]);

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
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-fadeIn text-slate-700 px-3 sm:px-0 auto-scrolling-container">
      
      {/* 1. PROGRESS CORNER: MATHEMATICAL CALORIE DASHBOARD CARD */}
      <div className="bg-white border border-slate-100 shadow-md rounded-[2rem] p-5 sm:p-8 text-center relative overflow-hidden transform-gpu">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-sky-400" />
        
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">My Daily Log</p>
        
        {/* Responsive Flex/Grid Split to protect small mobile screens from text wrapping fractures */}
        <div className="flex justify-between items-center max-w-sm mx-auto my-4 gap-2 px-2">
          <div className="flex-1 text-center">
            <span className="text-xl sm:text-3xl font-black text-slate-800 block tabular-nums">{budgetTargetCals}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide select-none">Budget</span>
          </div>
          <div className="text-xl font-bold text-slate-200 shrink-0 select-none">-</div>
          <div className="flex-1 text-center">
            <span className="text-xl sm:text-3xl font-black text-blue-500 block tabular-nums">{totalCalories}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide select-none">Food Logged</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 max-w-xs mx-auto">
          <span className="text-4xl font-black text-slate-900 tracking-tight block tabular-nums">
            {caloriesRemaining}
          </span>
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mt-0.5 select-none">
            Calories Remaining
          </span>
        </div>

        {/* hardware-accelerated tracking progress bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-6 border border-slate-200/40">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_2px_8px_rgba(59,130,246,0.3)] will-change-transform" 
            style={{ width: `${Math.min((totalCalories / budgetTargetCals) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* 2. UNIVERSAL TARGET COMPACT INFRASTRUCTURE WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Hydration Input Stack */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-blue-50 p-2 sm:p-2.5 rounded-full shrink-0 select-none">💧</span>
            <div>
              <span className="text-xs font-bold text-slate-400 block select-none">Hydration</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-tight tabular-nums">
                {waterOunces} <span className="text-xs font-normal text-slate-400">fl oz</span>
              </h3>
            </div>
          </div>
          {/* Enhanced hit target layouts (Strict 44px global touch criteria compliance) */}
          <div className="flex gap-1.5 shrink-0">
            <button 
              type="button"
              onClick={() => setWaterOunces(prev => Math.max(0, prev - 8))} 
              className="bg-slate-50 border border-slate-200 text-slate-500 font-bold w-11 h-11 rounded-xl hover:bg-slate-100 active:scale-95 transition-all select-none touch-manipulation flex items-center justify-center text-lg"
            >
              -
            </button>
            <button 
              type="button"
              onClick={() => setWaterOunces(prev => prev + 8)} 
              className="bg-blue-500 text-white text-xs font-bold px-3.5 h-11 rounded-xl hover:bg-blue-600 active:scale-95 transition-all select-none touch-manipulation flex items-center justify-center min-w-[54px]"
            >
              +8 oz
            </button>
          </div>
        </div>

        {/* Sleep Duration Input Stack */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-indigo-50 p-2 sm:p-2.5 rounded-full shrink-0 select-none">🌙</span>
            <div>
              <span className="text-xs font-bold text-slate-400 block select-none">Sleep Duration</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-tight tabular-nums">
                {sleepHours} <span className="text-xs font-normal text-slate-400">hours</span>
              </h3>
            </div>
          </div>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 shrink-0 shadow-inner">
            <input 
              type="number" 
              step="0.5"
              min="0"
              max="24"
              value={sleepHours || ""} 
              onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
              placeholder="0.0"
              /* Fixed: text-base (16px) overrides Safari's automatic mobile viewport zooming rules */
              className="w-12 bg-transparent border-none font-bold text-base text-slate-800 outline-none text-center p-0 focus:ring-0 tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* 3. RESPONSIVE MEAL CONTROLLER SHEETS */}
      <div className="space-y-4">
        {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((type) => {
          const filteredItems = foodLog.filter((item) => item.mealType === type);
          const categoryTotal = filteredItems.reduce((acc, item) => acc + item.calories, 0);
          const isSearchOpen = activeSearchMeal === type;

          return (
            <div key={type} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transform-gpu">
              
              {/* Responsive Container Strip */}
              <div className="px-4 sm:px-6 py-4 flex justify-between items-center border-b border-slate-50 bg-slate-50/40 select-none">
                <div className="flex items-baseline gap-2 min-w-0 pr-2">
                  <h3 className="text-sm font-extrabold capitalize text-slate-800 truncate">
                    {type}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 shrink-0 tabular-nums">
                    • {categoryTotal} cal
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
                  className={`text-xs font-bold px-4 py-2 rounded-full border transition-all touch-manipulation shrink-0 h-9 flex items-center justify-center ${
                    isSearchOpen 
                      ? "bg-slate-100 border-slate-200 text-slate-500" 
                      : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100/60"
                  }`}
                >
                  {isSearchOpen ? "Cancel" : "＋ Add Food"}
                </button>
              </div>

              {/* SLIDEOUT INLINE LOG DRAWER BLOCK */}
              {isSearchOpen && (
                <div className="p-4 sm:p-5 bg-slate-50/50 border-b border-slate-100 space-y-4 animate-fadeIn relative">
                  <div className="space-y-1.5 relative">
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        autoFocus
                        placeholder="Search for a food item (e.g., Apple, Oats)..." 
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        /* Fixed: text-base (16px) protects mobile viewports from auto-zooming */
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-xs font-medium text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-blue-400 transition-all" 
                      />
                      {isSearching && (
                        <span className="absolute right-4 top-3.5 text-[10px] font-bold text-blue-500 animate-pulse select-none">Searching...</span>
                      )}
                    </div>

                    {/* SUGGESTIONS OVERLAY */}
                    {searchResults.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 bg-white border border-slate-200 rounded-xl overflow-y-auto z-50 shadow-xl divide-y divide-slate-50 custom-scrollbar">
                        {searchResults.map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleSelectRegistryItem(item)}
                            className="px-4 py-3 hover:bg-slate-50/80 cursor-pointer text-left transition-colors touch-manipulation"
                          >
                            <div className="text-xs font-bold text-slate-800 capitalize">{item.name.toLowerCase()}</div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5 tabular-nums">
                              {item.calories} cal | P: {item.proteinGrams}g | C: {item.carbsGrams}g | F: {item.fatGrams}g
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual adjustment matrix input items */}
                  <form onSubmit={(e) => handleLogFood(e, type)} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 select-none">Serving Size</label>
                        <input type="text" placeholder="e.g., 1 Cup, 100g" value={servingInput} onChange={(e) => setServingInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-800 font-medium outline-none focus:border-blue-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 select-none">Calories</label>
                        <input type="number" step="any" placeholder="0" value={caloriesIn} onChange={(e) => setCaloriesIn(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 sm:py-2 text-base sm:text-xs text-blue-600 font-extrabold outline-none focus:border-blue-400 tabular-nums" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center select-none">Protein (g)</label>
                        <input type="number" step="any" placeholder="0" value={proteinIn} onChange={(e) => setProteinIn(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-1.5 text-center text-base sm:text-xs font-bold text-orange-500 outline-none focus:border-blue-400 tabular-nums" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center select-none">Carbs (g)</label>
                        <input type="number" step="any" placeholder="0" value={carbsIn} onChange={(e) => setCarbsIn(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-1.5 text-center text-base sm:text-xs font-bold text-amber-500 outline-none focus:border-blue-400 tabular-nums" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 text-center select-none">Fats (g)</label>
                        <input type="number" step="any" placeholder="0" value={fatsIn} onChange={(e) => setFatsIn(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-1.5 text-center text-base sm:text-xs font-bold text-purple-500 outline-none focus:border-blue-400 tabular-nums" />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button type="submit" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 h-11 sm:h-9 rounded-full uppercase tracking-wider text-[10px] shadow-md transition-colors touch-manipulation flex items-center justify-center">
                        Add to Log
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* RENDER CURRENT REPOSITORY LOG ENTRIES */}
              {filteredItems.length === 0 ? (
                <div className="px-5 py-5 text-xs text-slate-400 italic bg-white select-none">// Nothing logged for this meal yet.</div>
              ) : (
                <div className="divide-y divide-slate-50 bg-white">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="px-4 sm:px-5 py-3.5 flex justify-between items-center hover:bg-slate-50/40 transition-all group">
                      
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className="text-xs font-bold text-slate-800 truncate capitalize tracking-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center flex-wrap gap-x-2 text-[10px] text-slate-400 mt-0.5 font-medium tabular-nums">
                          <span className="truncate max-w-[120px]">{item.servingText}</span>
                          <span className="text-slate-200 select-none">•</span>
                          <span className="text-orange-500/90 font-bold shrink-0">P: {item.protein}g</span>
                          <span className="text-amber-500/90 font-bold shrink-0">C: {item.carbs}g</span>
                          <span className="text-purple-500/90 font-bold shrink-0">F: {item.fats}g</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <span className="font-extrabold text-slate-800 text-xs text-right min-w-[45px] tabular-nums">
                          {item.calories} <span className="text-[10px] text-slate-400 font-normal font-sans select-none">cal</span>
                        </span>
                        
                        {/* Friendly, optimized touch target purge option button */}
                        <button 
                          type="button"
                          onClick={() => handleDeleteItem(item.id)} 
                          className="text-slate-300 hover:text-rose-500 transition-colors text-base font-bold w-11 h-11 rounded-xl flex items-center justify-center touch-manipulation select-none"
                          title="Remove food entry"
                        >
                          ✕
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