"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Search, 
  MapPin, 
  Calculator, 
  Tag, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  Globe,
  Loader2,
  Compass
} from "lucide-react";

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
}: CanIAffordThisTabProps): React.JSX.Element {
  
  // --- STATE REGISTRIES ---
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [catalogItems, setCatalogItems] = useState<CatalogProductNode[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(false);
  const [tenantEmail, setTenantEmail] = useState<string>("authenticating...");

  // --- GEOLOCATION STATE ENGINES ---
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "prompting" | "secured" | "denied">("idle");
  const [locationError, setLocationError] = useState<string>("");

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setTenantEmail(user.email);
      } else if (user) {
        setTenantEmail("anonymous_isolated");
      } else {
        setTenantEmail("unauthenticated_session");
      }
    }

    async function syncTenantSession() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          handleUserIdentity(user);
        } else {
          handleUserIdentity(null);
        }
      } catch (err) {
        console.error("AFFORDABILITY_AUTH_HANDSHAKE_EXCEPTION:", err);
        setTenantEmail("fault_containment_mode");
      }
    }
    syncTenantSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserIdentity(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isSecuredTenant = tenantEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(tenantEmail);

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

  // --- QUERY DEBOUNCE INGESTION CONTROLLER ---
  useEffect(() => {
    if (!isSecuredTenant) {
      setCatalogItems([]);
      return;
    }

    const delayDebounceLoader = setTimeout(async () => {
      setIsLoadingCatalog(true);
      try {
        const latParam = latitude ? `&lat=${latitude}` : "";
        const lonParam = longitude ? `&lon=${longitude}` : "";
        
        // Appends cryptographically validated tenant information inside query boundaries
        const response = await fetch(
          `/api/catalog?q=${encodeURIComponent(searchQuery)}${latParam}${lonParam}&tenant=${encodeURIComponent(tenantEmail)}`
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
  }, [searchQuery, latitude, longitude, tenantEmail, isSecuredTenant]);

  // --- ACTION ANCHOR HUBS ---
  const handleApplyPriceToSimulator = (targetPrice: number) => {
    setPurchaseCost(targetPrice.toString());
  };

  const activeSelectedProduct = catalogItems.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1200px] mx-auto p-1 text-gray-800 select-none">
      
      {/* 1. TOP TITLE HEADER STRIP */}
      <div className="border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" /> Capital Allocation Simulator
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5 text-left">
            Cross-examine luxury acquisition items instantly against systemic liquid protection boundaries and live recurring liabilities.
          </p>
        </div>

        {/* GEOLOCATION ACTION DECK CONTROL */}
        <div className="shrink-0">
          {locationStatus === "idle" && (
            <button
              type="button"
              disabled={!isSecuredTenant}
              onClick={requestUserLocationToken}
              className="text-[10px] font-mono font-black uppercase tracking-wider bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2.5 rounded-xl transition-all border border-gray-200 flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Scan Proximity Deals
            </button>
          )}
          {locationStatus === "prompting" && (
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50/50 px-3 py-2.5 rounded-xl border border-blue-100 animate-pulse flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 animate-spin" /> Resolving GPS Matrix...
            </span>
          )}
          {locationStatus === "secured" && (
            <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Target Locked ({latitude?.toFixed(2)}, {longitude?.toFixed(2)})
            </span>
          )}
          {locationStatus === "denied" && (
            <button
              type="button"
              onClick={requestUserLocationToken}
              title={locationError}
              className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-3 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-100/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Location Blocked (Retry)
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN SPLIT GRAPHIC SECTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        
        {/* INTERACTIVE INPUT CALCULATOR DECK (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block text-left ml-1">
            Configure Position Parameters
          </span>
          
          <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-[2rem] shadow-sm">
            <div className="bg-white rounded-[31px] p-5 sm:p-6 space-y-4 relative overflow-hidden">
              
              <form onSubmit={evaluatePurchaseAffordability} className="space-y-3">
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-mono font-black text-gray-400 text-base">$</span>
                  <input 
                    type="number" 
                    step="any"
                    required
                    disabled={!isSecuredTenant}
                    placeholder={tenantEmail === "authenticating..." ? "Verifying Token Clearance..." : "Custom targeted cost threshold..."}
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 h-12 text-sm font-bold text-gray-800 outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/10 transition-all font-mono tabular-nums shadow-inner disabled:opacity-60"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!isSecuredTenant}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white font-mono font-black h-11 rounded-xl tracking-wider text-xs uppercase shadow-sm transition-all cursor-pointer active:scale-[0.99] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                >
                  Compute Operational Verdict
                </button>
              </form>

              {purchaseVerdict && isSecuredTenant && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 animate-fadeIn text-left space-y-1.5">
                  <span className={`text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    purchaseVerdict.decision.includes("Approved") 
                      ? "text-emerald-600" 
                      : purchaseVerdict.decision.includes("Caution") ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {purchaseVerdict.decision.includes("Approved") ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )} 
                    {purchaseVerdict.decision}
                  </span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {purchaseVerdict.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EXTENSIVE PRODUCT CATALOG HUB (Right 3 Columns) */}
        <div className="lg:col-span-3 space-y-3">
          <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-wider block text-left ml-1">
            Global Product Schema Registry
          </span>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-[2rem] p-5 space-y-4">
            
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400 w-4 h-4" />
              <input 
                type="text"
                disabled={!isSecuredTenant}
                placeholder={tenantEmail === "unauthenticated_session" ? "Authentication required to query index records" : "Search premium assets, infrastructure schemas, or brands..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all shadow-inner disabled:opacity-60"
              />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {tenantEmail === "authenticating..." ? (
                <div className="py-12 text-center text-xs font-mono font-bold text-purple-600 uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Secure Credentials...
                </div>
              ) : tenantEmail === "unauthenticated_session" ? (
                <div className="py-12 text-center text-xs font-mono font-bold text-rose-500 flex flex-col items-center justify-center gap-1.5">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span>SECURE INDEX ACQUISITION RESTRICTED</span>
                </div>
              ) : isLoadingCatalog ? (
                <div className="py-12 text-center text-xs font-mono font-bold text-purple-600 uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" /> Polling ledger index keys...
                </div>
              ) : catalogItems.length > 0 ? (
                catalogItems.map((prod) => {
                  const isSelected = prod.id === selectedProductId;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProductId(isSelected ? null : prod.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center cursor-pointer ${
                        isSelected 
                          ? "bg-purple-50/50 border-purple-400 shadow-sm" 
                          : "bg-white border-gray-100 hover:border-gray-200 shadow-xs"
                      }`}
                    >
                      <div className="min-w-0 pr-4 text-left">
                        <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-500">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-black text-gray-900 tracking-tight mt-1.5 truncate">
                          {prod.title}
                        </h4>
                      </div>
                      <span className="font-mono font-black text-xs text-gray-900 tabular-nums shrink-0 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        ${prod.basePrice.toLocaleString()}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs font-mono font-bold text-gray-400 flex flex-col items-center justify-center gap-1">
                  <HelpCircle className="w-5 h-5 text-gray-300" />
                  <span>NO RECORDS FOUND IN ACTIVE DIRECTORY</span>
                </div>
              )}
            </div>

            {activeSelectedProduct && isSecuredTenant && (
              <div className="border-t border-gray-100 pt-4 animate-slideDown space-y-4 text-left">
                <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-gray-900 uppercase font-mono tracking-wider">
                      {activeSelectedProduct.title} Specifications
                    </h5>
                    <p className="text-[11px] text-gray-500 font-medium font-mono mt-1 leading-relaxed">
                      {activeSelectedProduct.specs}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-black text-purple-600 uppercase tracking-wider block ml-0.5">
                    {locationStatus === "secured" ? "📍 Live Local Discount Outlets Verified" : "🌐 Regional Baseline Outlets Registry"}
                  </span>
                  
                  <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-gray-50/20 shadow-sm">
                    {activeSelectedProduct.localDeals.map((deal, idx) => (
                      <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-gray-50/60 transition-colors">
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-gray-900 tracking-tight">{deal.retailer}</span>
                            <span className="text-[9px] text-gray-400 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-gray-100">
                              {locationStatus === "secured" ? deal.distance : "Distance Encrypted"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1 font-mono uppercase">
                            <Tag className="w-3 h-3 stroke-[2.5]" /> {deal.promotion}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-none pt-2 sm:pt-0 border-gray-100">
                          <div className="text-left sm:text-right font-mono">
                            <span className="text-gray-900 font-black block text-sm tabular-nums">${deal.currentPrice.toLocaleString()}</span>
                            <span className="text-[9px] text-gray-400 block line-through tracking-normal tabular-nums">${activeSelectedProduct.basePrice}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleApplyPriceToSimulator(deal.currentPrice)}
                            className="bg-white hover:bg-purple-600 hover:text-white border border-gray-200 hover:border-purple-600 text-gray-700 font-mono font-black text-[10px] px-3 h-8 rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
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