"use client";

import React, { useState, useEffect } from "react";

interface LocalDiscountDeal {
  retailer: string;
  distance: string;
  promotion: string;
  currentPrice: number;
  discount: number;
}

interface CatalogProductNode {
  id: string;
  title: string;
  basePrice: number;
  category: string;
  specs: string;
  localDeals: LocalDiscountDeal[];
}

interface CanIAffordThisTabProps {
  purchaseCost: string;
  setPurchaseCost: (val: string) => void;
  purchaseVerdict: { decision: string; message: string } | null;
  evaluatePurchaseAffordability: (e: React.FormEvent) => void;
}

export default function CanIAffordThisTab({ 
  purchaseCost, 
  setPurchaseCost, 
  purchaseVerdict, 
  evaluatePurchaseAffordability 
}: CanIAffordThisTabProps) {
  
  // --- STATE REGISTRIES ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [catalogItems, setCatalogItems] = useState<CatalogProductNode[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(false);

  // --- GEOLOCATION STATE ENGINES ---
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "prompting" | "secured" | "denied">("idle");
  const [locationError, setLocationError] = useState<string>("");

  // --- HTML5 GEOLOCATION API HANDSHAKE ---
  const requestUserLocationToken = () => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      setLocationError("Geolocation is unsupported by this browser client context.");
      return;
    }

    setLocationStatus("prompting");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationStatus("secured");
      },
      (error) => {
        console.error("Location request rejected:", error.message);
        setLocationStatus("denied");
        setLocationError(
          error.code === 1 
            ? "Permission denied. Enable location services to discover nearby deals." 
            : "Unable to retrieve localized coordinates context."
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // --- QUERY DEBOUNCE INGESTION CONTROLLER (Updated for Location Tracking) ---
  useEffect(() => {
    const delayDebounceLoader = setTimeout(async () => {
      setIsLoadingCatalog(true);
      try {
        // Appends coordinates metrics straight into the query parameters stream if verified
        const latParam = latitude ? `&lat=${latitude}` : "";
        const lonParam = longitude ? `&lon=${longitude}` : "";
        
        const response = await fetch(
          `/api/catalog?q=${encodeURIComponent(searchQuery)}${latParam}${lonParam}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setCatalogItems(data.catalog || []);
        }
      } catch (err) {
        console.error("Failed querying localized asset indexes:", err);
      } finally {
        setIsLoadingCatalog(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceLoader);
  }, [searchQuery, latitude, longitude]); // Triggers fresh query calculations instantly if position updates

  // --- ACTION ANCHOR HUBS ---
  const handleApplyPriceToSimulator = (targetPrice: number) => {
    setPurchaseCost(targetPrice.toString());
  };

  const activeSelectedProduct = catalogItems.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1200px] mx-auto p-1">
      
      {/* 1. TOP TITLE HEADER STRIP */}
      <div className="border-b border-slate-200/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Purchase Simulator</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Cross-examine luxury acquisition items instantly against structural protection boundaries and live recurring liabilities.
          </p>
        </div>

        {/* GEOLOCATION ACTION DECK CAPABILITY CONTROL */}
        <div className="shrink-0 select-none">
          {locationStatus === "idle" && (
            <button
              type="button"
              onClick={requestUserLocationToken}
              className="text-[11px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-all border border-slate-200/40"
            >
              📍 Scan Nearby Deals
            </button>
          )}
          {locationStatus === "prompting" && (
            <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 animate-pulse block">
              🛰️ Querying GPS Position...
            </span>
          )}
          {locationStatus === "secured" && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 block font-mono">
              🎯 Location Locked ({latitude?.toFixed(2)}, {longitude?.toFixed(2)})
            </span>
          )}
          {locationStatus === "denied" && (
            <button
              type="button"
              onClick={requestUserLocationToken}
              title={locationError}
              className="text-[11px] font-bold text-rose-500 bg-rose-50 px-3 py-2 rounded-xl border border-rose-100 hover:bg-rose-100/60 transition-all block"
            >
              ⚠️ Location Disabled (Retry)
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN SPLIT GRAPHIC SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* INTERACTIVE INPUT CALCULATOR DECK (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-1 select-none">Configure Variable Matrix</span>
          
          <div className="bg-white border border-slate-100 shadow-md rounded-[2rem] p-5 sm:p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
            
            <form onSubmit={evaluatePurchaseAffordability} className="space-y-3">
              <div className="relative flex items-center">
                <span className="absolute left-4 font-black text-slate-400 text-base select-none">$</span>
                <input 
                  type="number" 
                  step="any"
                  required
                  placeholder="Enter custom targeted cost threshold..." 
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 h-12 text-base font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all font-mono tabular-nums"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-xl tracking-wider text-xs uppercase shadow-xs transition-all touch-manipulation select-none active:scale-98"
              >
                Compute Operational Verdict →
              </button>
            </form>

            {purchaseVerdict && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-fadeIn text-left space-y-1.5">
                <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  purchaseVerdict.decision.includes("Approved") ? "text-emerald-500" : purchaseVerdict.decision.includes("Caution") ? "text-amber-500" : "text-rose-500"
                }`}>
                  <span className="text-sm">⚜</span> {purchaseVerdict.decision}
                </span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {purchaseVerdict.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* EXTENSIVE PRODUCT CATALOG HUB (Right 3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-1 select-none">Explore Intelligent Catalog Registry</span>
          
          <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-5 space-y-4">
            
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 select-none text-xs">🔍</span>
              <input 
                type="text"
                placeholder="Search premium product schemas, brands, infrastructure nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 h-10 text-xs font-bold text-slate-800 outline-none focus:border-blue-300 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {isLoadingCatalog ? (
                <div className="py-8 text-center text-xs font-medium text-slate-400 animate-pulse">Syncing dynamic global lookup entries...</div>
              ) : catalogItems.length > 0 ? (
                catalogItems.map((prod) => {
                  const isSelected = prod.id === selectedProductId;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProductId(isSelected ? null : prod.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center ${
                        isSelected ? "bg-slate-50/80 border-blue-400 shadow-xs" : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="min-w-0 pr-4">
                        <span className="text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{prod.category}</span>
                        <h4 className="text-xs font-bold text-slate-800 tracking-tight mt-1 truncate">{prod.title}</h4>
                      </div>
                      <span className="font-mono font-black text-xs text-slate-900 tabular-nums shrink-0">${prod.basePrice.toLocaleString()}</span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs font-bold text-slate-400 select-none">No structural matching products found.</div>
              )}
            </div>

            {activeSelectedProduct && (
              <div className="border-t border-slate-100 pt-4 animate-slideDown space-y-3 text-left">
                <div className="bg-blue-50/40 border border-blue-100/50 p-3 rounded-xl">
                  <h5 className="text-xs font-bold text-slate-800">{activeSelectedProduct.title} Specs</h5>
                  <p className="text-[11px] text-slate-400 font-medium font-mono mt-0.5 leading-tight">{activeSelectedProduct.specs}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-black text-blue-500 uppercase tracking-wider block ml-0.5 select-none">
                    {locationStatus === "secured" ? "📍 Live Neighborhood Discount Outlets Near You" : "🌐 Regional Retail Baseline Listings"}
                  </span>
                  
                  <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/30">
                    {activeSelectedProduct.localDeals.map((deal, idx) => (
                      <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 tracking-tight">{deal.retailer}</span>
                            <span className="text-[9px] text-slate-400 font-mono tracking-tighter">({locationStatus === "secured" ? deal.distance : "Distance locked"})</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-500 block mt-0.5">🏷️ {deal.promotion}</span>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-none pt-2 sm:pt-0 border-slate-100">
                          <div className="text-left sm:text-right font-mono">
                            <span className="text-slate-900 font-black block text-xs tabular-nums">${deal.currentPrice.toLocaleString()}</span>
                            <span className="text-[9px] text-slate-400 block line-through tabular-nums">${activeSelectedProduct.basePrice}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleApplyPriceToSimulator(deal.currentPrice)}
                            className="bg-white hover:bg-blue-500 hover:text-white border border-slate-200 hover:border-blue-500 text-slate-700 font-black text-[10px] px-3 h-8 rounded-lg uppercase tracking-wider transition-all select-none active:scale-95"
                          >
                            Apply Deal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}