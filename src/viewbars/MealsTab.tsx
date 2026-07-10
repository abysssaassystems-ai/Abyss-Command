"use client";

import React, { useState, useEffect } from "react";
import { FoodDatabaseEntry } from "@/app/dashboard/health/types";
import { CertifiedPublicFoodEngine } from "@/app/dashboard/health/CertifiedPublicFoodEngine";

export default function MealsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<FoodDatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Interactive State Tracking Loops
  const [favorites, setFavorites] = useState<FoodDatabaseEntry[]>([]);
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Debounce query inputs to match high-frequency market tickers
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setItems([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const liveRegistryFeed = await CertifiedPublicFoodEngine.fetchFromPublicRegistry(searchQuery);
        setItems(liveRegistryFeed);
      } catch (err) {
        console.error("Live lookup segment failed to stream", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Action: Toggle favorite matrix states
  const toggleFavorite = (food: FoodDatabaseEntry) => {
    if (favorites.some((fav) => fav.id === food.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== food.id));
    } else {
      setFavorites([...favorites, food]);
    }
  };

  // Determine active view registry feed allocation
  const displayedItems = filterFavorites
    ? favorites.filter((fav) =>
        fav.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  // Temporary alias to guarantee structural code execution safety against previous debouncers
  const setIsSearching = setIsLoading;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-fadeIn text-slate-700 px-3 sm:px-0 flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      
      <div className="space-y-6 w-full">
        {/* 1. APPOACHABLE LOSE IT STYLE HEADER */}
        <div className="border-b border-slate-100 pb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 select-none">Food Explorer</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Search Food Database
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">
            Instantly check nutrient facts, brand items, commercial restaurant menus, and daily staples across verified public logs.
          </p>
        </div>

        {/* 2. OPTIMIZED SEARCH HOOD & PILL FILTERS */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-md focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200">
            <span className="text-slate-400 text-xl pl-1 select-none">🔍</span>
            <input 
              type="text" 
              placeholder={filterFavorites ? "Filter your favorite foods..." : "Search foods, brands, or restaurants..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              /* Fixed: text-base (16px) completely blocks mobile Safari from executing automatic view zooms */
              className="w-full bg-transparent text-base sm:text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none" 
            />
            {isLoading && (
              <div className="flex items-center gap-2 shrink-0 select-none pr-1">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {searchQuery && !isLoading && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 h-10 flex items-center justify-center select-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Pill Filter Navigation Toggles */}
          <div className="flex gap-2 select-none">
            <button
              type="button"
              onClick={() => setFilterFavorites(false)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all h-9 flex items-center justify-center touch-manipulation ${
                !filterFavorites
                  ? "bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🌐 Global Registry
            </button>
            <button
              type="button"
              onClick={() => setFilterFavorites(true)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-2 transition-all h-9 flex items-center justify-center touch-manipulation ${
                filterFavorites
                  ? "bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-400/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              ★ Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* 3. SEARCH RESULTS TIMELINE STREAM CONTAINER */}
        <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
          {displayedItems.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/60 border-dashed text-center py-16 rounded-2xl text-xs text-slate-400 font-medium select-none px-4">
              {filterFavorites
                ? "No saved items match your filter criteria criteria parameters."
                : searchQuery.trim().length >= 3 
                  ? "No matching registry items found for this search string."
                  : "Type at least 3 characters to search the global nutritional logs..."}
            </div>
          ) : (
            displayedItems.map((food) => {
              let cleanName = food.name;
              let extractedBrand = "";
              
              if (food.name.startsWith("[")) {
                const closeBracketIndex = food.name.indexOf("]");
                if (closeBracketIndex !== -1) {
                  extractedBrand = food.name.substring(1, closeBracketIndex).trim();
                  cleanName = food.name.substring(closeBracketIndex + 1).trim();
                }
              }

              const isFavorited = favorites.some((fav) => fav.id === food.id);

              return (
                <div 
                  key={food.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 group relative"
                >
                  {/* Left Descriptive Element Block */}
                  <div className="min-w-0 flex-1 flex gap-2 items-center">
                    
                    {/* Fixed: Target area scale expanded to 44px to satisfy standard structural hardware hit criteria */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(food)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all active:scale-90 select-none ${
                        isFavorited ? "text-amber-400 bg-amber-50" : "text-slate-300 hover:text-slate-400 bg-slate-50"
                      }`}
                    >
                      {isFavorited ? "★" : "☆"}
                    </button>

                    <div className="min-w-0 flex-1 pl-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {extractedBrand && (
                          <span className="bg-blue-50 text-blue-600 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md border border-blue-100/40 truncate max-w-[140px] select-none">
                            {extractedBrand}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight capitalize truncate pr-2">
                          {cleanName}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5 select-none">
                        Serving Standard: <span className="text-slate-500">{food.servingSizeGrams}g</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Metric Block Layout (Differentiated Text Element Sizing) */}
                  <div className="flex items-center gap-4 shrink-0 font-sans">
                    
                    {/* Compact pill tags grouped for instant glance parsing */}
                    <div className="hidden sm:flex gap-1 text-[9px] font-bold select-none">
                      <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg border border-orange-100/30">
                        P <span className="text-slate-700 ml-0.5">{food.proteinGrams}g</span>
                      </div>
                      <div className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100/30">
                        C <span className="text-slate-700 ml-0.5">{food.carbsGrams}g</span>
                      </div>
                      <div className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg border border-purple-100/30">
                        F <span className="text-slate-700 ml-0.5">{food.fatGrams}g</span>
                      </div>
                    </div>

                    {/* Absolute Calorie Counter (Using tabular numbers to lock vertical spacing layout frames) */}
                    <div className="text-right min-w-[55px] bg-slate-50 rounded-xl px-2.5 py-1.5 border border-slate-100">
                      <span className="text-sm font-black text-slate-800 block leading-none tabular-nums">
                        {food.calories}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block mt-0.5 select-none">
                        cal
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. PREMIUM COMPACT SCANNABLE LOG MACRO REFERENCE LEGEND FOOTER */}
      <div className="w-full bg-white border border-slate-100 shadow-sm rounded-2xl p-4 mt-8 select-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center font-bold border border-orange-100/60">P</span>
            <span>Protein <strong className="text-slate-600 font-bold">(4 cal/g)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100/60">C</span>
            <span>Carbs <strong className="text-slate-600 font-bold">(4 cal/g)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center font-bold border border-purple-100/60">F</span>
            <span>Fats <strong className="text-slate-600 font-bold">(9 cal/g)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-bold border border-slate-200/60">Na</span>
            <span>Sodium <strong className="text-slate-600 font-bold">(mg)</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
}