"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FoodDatabaseEntry } from "@/app/dashboard/my-apps/health/types";
import { CertifiedPublicFoodEngine } from "@/app/dashboard/my-apps/health/CertifiedPublicFoodEngine";
import { 
  Search, 
  Star, 
  Globe, 
  Loader2, 
  X, 
  Utensils, 
  Info 
} from "lucide-react";

export default function MealsTab(): React.JSX.Element {
  // --- MULTI-TENANT ARCHITECTURE HANDSHAKE ---
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<FoodDatabaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Interactive State Tracking Loops scoped by Tenant
  const [favorites, setFavorites] = useState<FoodDatabaseEntry[]>([]);
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Securely fetch tenant credentials and look up saved macro parameters
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
        // Hydrate isolated tenant-specific configuration profiles cleanly from local partitions
        const savedFavs = localStorage.getItem(`macro_favs_${user.email}`);
        if (savedFavs) {
          try {
            setFavorites(JSON.parse(savedFavs));
          } catch (parseErr) {
            console.error("MEALS_FAVORITES_PARSE_EXCEPTION:", parseErr);
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } else if (user) {
        setTenantEmail("anonymous_isolated");
        setFavorites([]);
      } else {
        setTenantEmail("unauthenticated_session");
        setFavorites([]);
      }
    }

    // 1. Core asynchronous verification handshake
    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("MEALS_AUTH_HYDRATION_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    // 2. Real-time auth state subscription line connection
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync isolated tenant favorites back onto client local space configuration rules
  const saveFavoritesToPartition = (updatedFavs: FoodDatabaseEntry[]) => {
    setFavorites(updatedFavs);
    const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);
    if (isSecuredTenant) {
      localStorage.setItem(`macro_favs_${tenantEmail}`, JSON.stringify(updatedFavs));
    }
  };

  // Debounce query inputs to match high-frequency market tickers
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setItems([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const liveRegistryFeed = await CertifiedPublicFoodEngine.fetchFromPublicRegistry(searchQuery);
        setItems(liveRegistryFeed);
      } catch (err) {
        console.error("Live registry data pipeline failed to stream parsing variables:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Action: Toggle favorite matrix states bound within active tenant partition
  const toggleFavorite = (food: FoodDatabaseEntry) => {
    const isAlreadyFavorited = favorites.some((fav) => fav.id === food.id);
    let updated: FoodDatabaseEntry[] = [];
    
    if (isAlreadyFavorited) {
      updated = favorites.filter((fav) => fav.id !== food.id);
    } else {
      updated = [...favorites, food];
    }
    
    saveFavoritesToPartition(updated);
  };

  // Determine active view registry feed allocation
  const displayedItems = filterFavorites
    ? favorites.filter((fav) =>
        fav.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn text-gray-800 select-none px-4 sm:px-1 flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      
      <div className="space-y-6 w-full">
        {/* 1. ARCHITECTURAL LIGHT THEMED CONTROL HEADER */}
        <div className="border-b border-gray-200 pb-5">
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
            Nutritional Database Index
          </span>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-purple-600" /> Integrated Resource Explorer
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
            Instantly review macronutrient profiles, industrial grocery lots, commercial distributions, and dietary telemetry across public ledgers.
          </p>
        </div>

        {/* 2. OPTIMIZED SEARCH CONSOLE & SECTOR CONTROLS */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-200">
            <Search className="text-gray-400 w-4 h-4 shrink-0 stroke-[2.5]" />
            <input 
              type="text" 
              placeholder={filterFavorites ? "Filter active saved favorites pipeline..." : "Query global catalog profiles, brands, or verified vendor profiles..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-300 outline-none" 
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0" />
            )}
            {searchQuery && !isLoading && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")} 
                className="text-gray-400 hover:text-gray-600 cursor-pointer flex items-center transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Pill Segmented Configuration Selectors */}
          <div className="flex gap-2 text-xs font-mono font-black uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setFilterFavorites(false)}
              className={`px-4 py-2 rounded-xl border transition-all h-9 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                !filterFavorites
                  ? "bg-purple-600 text-white border-purple-600 font-black"
                  : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Global Registry Feed
            </button>
            <button
              type="button"
              onClick={() => setFilterFavorites(true)}
              disabled={tenantEmail === "unauthenticated_session"}
              className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all h-9 shadow-xs disabled:opacity-40 ${
                tenantEmail === "unauthenticated_session" ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                filterFavorites
                  ? "bg-blue-600 text-white border-blue-600 font-black"
                  : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" /> Tenant Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* 3. LOG DATA TRANSMISSION TIMELINE FRAME */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 border border-gray-100 bg-gray-50/20 p-2 rounded-2xl">
          {displayedItems.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed text-center py-16 rounded-xl text-xs text-gray-400 font-mono font-bold uppercase tracking-wider px-4">
              {filterFavorites
                ? "[ REGISTRY_VACANT: No matching saved profiles matching current criteria parameters ]"
                : searchQuery.trim().length >= 3 
                  ? "[ NO_MATCHING_DATA_ARRAYS_FOUND ]"
                  : "Input minimum 3 characters to interface target transmission arrays..."}
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
                  className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center gap-4 shadow-xs hover:border-gray-300 transition-all group"
                >
                  {/* Left Descriptive Element Block */}
                  <div className="min-w-0 flex-1 flex gap-3 items-center">
                    
                    <button
                      type="button"
                      onClick={() => toggleFavorite(food)}
                      disabled={tenantEmail === "unauthenticated_session"}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-90 shadow-xs shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                        tenantEmail !== "unauthenticated_session" ? "cursor-pointer" : ""
                      } ${
                        isFavorited 
                          ? "text-blue-600 bg-blue-50/50 border-blue-200" 
                          : "text-gray-300 bg-gray-50 border-gray-100 hover:text-gray-400"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {extractedBrand && (
                          <span className="bg-purple-50 text-purple-600 text-[9px] font-mono font-black tracking-wider uppercase px-2 py-0.5 rounded border border-purple-100 truncate max-w-[140px]">
                            {extractedBrand}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight capitalize truncate">
                          {cleanName}
                        </h4>
                      </div>
                      <p className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase">
                        Baseline Frame Allocation: <span className="text-gray-900 font-black">{food.servingSizeGrams}g System Unit</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Metric Block Layout */}
                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px]">
                    
                    {/* Modular breakdown tags */}
                    <div className="hidden sm:flex gap-1.5 font-black uppercase tracking-wider">
                      <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 shadow-xs">
                        P: <span className="text-gray-900 ml-0.5 font-mono">{food.proteinGrams}g</span>
                      </div>
                      <div className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100 shadow-xs">
                        C: <span className="text-gray-900 ml-0.5 font-mono">{food.carbsGrams}g</span>
                      </div>
                      <div className="bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200 shadow-xs">
                        F: <span className="text-gray-900 ml-0.5 font-mono">{food.fatGrams}g</span>
                      </div>
                    </div>

                    {/* Absolute Calorie Target Counter */}
                    <div className="text-right min-w-[60px] bg-gray-900 text-white rounded-xl px-2.5 py-1.5 shadow-sm border border-gray-950">
                      <span className="text-sm font-black block leading-none tracking-tight tabular-nums">
                        {food.calories}
                      </span>
                      <span className="text-[8px] uppercase tracking-widest font-black text-purple-300 block mt-1">
                        kcal
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
      <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-4 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">P</span>
            <span className="text-gray-500">Protein <strong className="text-gray-900 block font-mono font-black mt-0.5">4 Kcal / g</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">C</span>
            <span className="text-gray-500">Carbohydrates <strong className="text-gray-900 block font-mono font-black mt-0.5">4 Kcal / g</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="w-5 h-5 rounded-md bg-gray-700 text-white flex items-center justify-center font-bold shadow-xs">F</span>
            <span className="text-gray-500">Lipid Fats <strong className="text-gray-900 block font-mono font-black mt-0.5">9 Kcal / g</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs"><Info className="w-3 h-3 stroke-[2.5]" /></span>
            <span className="text-gray-500">Sodium Balance <strong className="text-gray-900 block font-mono font-black mt-0.5">Absolute mg</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
}