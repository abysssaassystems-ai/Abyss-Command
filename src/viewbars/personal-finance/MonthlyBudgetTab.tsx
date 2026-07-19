"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  PieChart, 
  RefreshCw, 
  Plus, 
  X, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Calendar, 
  ArrowDownRight, 
  ArrowDownLeft,
  ArrowUpRight, 
  SlidersHorizontal,
  FolderPlus,
  Loader2,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface BudgetNode {
  id: string;
  name: string;
  limit: number;
  spent: number;
  group_type: "basic" | "category";
}

interface StagedCategoryNode {
  name: string;
  limit: number;
  type: "basic" | "category";
  keywords: string;
}

export default function MonthlyBudgetTab(): React.JSX.Element {
  // --- MULTI-TENANT SESSION HANDSHAKE STATE ---
  const [userEmail, setUserEmail] = useState<string>("authenticating...");
  const [categories, setCategories] = useState<BudgetNode[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showBudgetModal, setShowBudgetModal] = useState<boolean>(false);

  // Timeframe View Tab Selector Engine
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly" | "daily">("monthly");

  // Inline Category Form Input States
  const [newCatName, setNewCatName] = useState<string>("");
  const [newCatLimit, setNewCatLimit] = useState<string>("");
  const [newCatType, setNewCatType] = useState<"basic" | "category">("category");
  const [newCatKeywords, setNewCatKeywords] = useState<string>("");

  // --- WIZARD ARCHITECT MODAL STATE STORAGE ---
  const [newBudgetTitle, setNewBudgetTitle] = useState<string>("");
  const [wizardTimeframeType, setWizardTimeframeType] = useState<"month" | "weeks" | "days">("month");
  const [wizardTimeframeValue, setWizardTimeframeValue] = useState<string>("January");
  
  // Dynamic Inline Array Staging Matrix for the Wizard
  const [stagedCategories, setStagedCategories] = useState<StagedCategoryNode[]>([
    { name: "Earnings", limit: 5000, type: "basic", keywords: "stripe, payout, salary" },
    { name: "Bills & Utilities", limit: 1500, type: "basic", keywords: "rent, power, netflix" },
    { name: "Groceries", limit: 600, type: "category", keywords: "wfm, target, grocery" }
  ]);

  // Mini-inputs for staging individual rows inside the wizard modal
  const [stageName, setStageName] = useState<string>("");
  const [stageLimit, setStageLimit] = useState<string>("");
  const [stageType, setStageType] = useState<"basic" | "category">("category");
  const [stageKeywords, setStageKeywords] = useState<string>("");

  // --- MULTI-TENANT ARCHITECTURE SECURE HANDSHAKE ---
  useEffect(() => {
    function handleUserIdentity(user: any) {
      if (user?.email) {
        setUserEmail(user.email);
      } else if (user) {
        setUserEmail("anonymous_isolated");
      } else {
        setUserEmail("unauthenticated_session");
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
        console.error("BUDGET_AUTH_HANDSHAKE_EXCEPTION:", err);
        setUserEmail("fault_containment_mode");
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

  const isSecuredTenant = userEmail && !["authenticating...", "unauthenticated_session", "fault_containment_mode"].includes(userEmail);

  // --- TEMPORAL CHRON METRIC CALCULATORS ---
  const currentMonthName = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  
  const getDaysMetadata = () => {
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDaysInMonth = totalDays - now.getDate() + 1;
    const remainingDaysInWeek = 7 - now.getDay();
    return { remainingDaysInMonth, remainingDaysInWeek, totalDays };
  };
  const { remainingDaysInMonth, remainingDaysInWeek } = getDaysMetadata();

  // --- SECURE CLOUD NETWORK DATA INGESTION ---
  const fetchLiveAggregatedBudget = useCallback(async () => {
    if (!isSecuredTenant) {
      setCategories([]);
      return;
    }
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/budget?user_id=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to query multi-tenant budget ledger allocation pools:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [userEmail, isSecuredTenant]);

  useEffect(() => {
    if (isSecuredTenant) {
      fetchLiveAggregatedBudget();
    }
  }, [isSecuredTenant, fetchLiveAggregatedBudget]);

  // Add individual custom bucket framework parameters directly linked with the signature
  const handleCreateBudgetEnvelope = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatLimit || !isSecuredTenant) return;

    const kwArray = newCatKeywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
    if (kwArray.length === 0) kwArray.push(newCatName.split(" ")[0].toLowerCase());

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userEmail, // Strict multi-tenant row boundary token validation
          name: newCatName,
          budget_limit: parseFloat(newCatLimit) || 0,
          group_type: newCatType,
          keywords: kwArray,
        }),
      });

      if (response.ok) {
        setNewCatName("");
        setNewCatLimit("");
        setNewCatKeywords("");
        setShowAddForm(false);
        fetchLiveAggregatedBudget();
      }
    } catch (err) {
      console.error("Failed to transmit category allocation context data:", err);
    }
  };

  // --- WIZARD INTERACTIVE HANDLERS ---
  const addRowToStagingMatrix = () => {
    if (!stageName || !stageLimit) return;
    setStagedCategories((prev) => [
      ...prev,
      {
        name: stageName,
        limit: parseFloat(stageLimit) || 0,
        type: stageType,
        keywords: stageKeywords
      }
    ]);
    setStageName("");
    setStageLimit("");
    setStageKeywords("");
  };

  const removeRowFromStagingMatrix = (index: number) => {
    setStagedCategories((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Deployment framework mapping the collection of configured rules securely inside rows
  const handleGenerateFreshBudgetStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedCategories.length === 0 || !newBudgetTitle || !isSecuredTenant) return;
    setIsSyncing(true);

    try {
      for (const item of stagedCategories) {
        const kwArray = item.keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
        if (kwArray.length === 0) kwArray.push(item.name.split(" ")[0].toLowerCase());

        await fetch("/api/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userEmail, // Validated secure row context string
            name: item.name,
            budget_limit: item.limit,
            group_type: item.type,
            keywords: kwArray
          })
        });
      }

      setNewBudgetTitle("");
      setShowBudgetModal(false);
      fetchLiveAggregatedBudget();
    } catch (err) {
      console.error("Failed to execute budget wizard template script generation:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- TIMEFRAME DIVISION FACTOR COEFFICIENTS ---
  const getTimeframeScaleFactor = () => {
    if (timeframe === "weekly") return 1 / 4.33;
    if (timeframe === "daily") return 1 / 30.42;
    return 1.0;
  };
  const scale = getTimeframeScaleFactor();

  const scaledCategories = categories.map(c => ({
    ...c,
    limit: c.limit * scale,
    spent: c.spent * scale
  }));

  const basicItems = scaledCategories.filter((c) => c.group_type === "basic");
  const coreCategoryItems = scaledCategories.filter((c) => c.group_type === "category");

  const spendingBudgetLimit = coreCategoryItems.reduce((sum, c) => sum + c.limit, 0);
  const currentSpendingTotal = coreCategoryItems.reduce((sum, c) => sum + c.spent, 0);
  const remainingSpendingBalance = Math.max(spendingBudgetLimit - currentSpendingTotal, 0);

  const getBurnRateVerdict = () => {
    if (timeframe === "weekly") {
      const dailyAllowance = remainingDaysInWeek > 0 ? (remainingSpendingBalance / remainingDaysInWeek) : 0;
      return { rate: dailyAllowance, label: `for the next ${remainingDaysInWeek} days left this week.` };
    }
    if (timeframe === "daily") {
      return { rate: remainingSpendingBalance, label: "remaining safe allowance margin for today." };
    }
    const dailyAllowance = remainingDaysInMonth > 0 ? (remainingSpendingBalance / remainingDaysInMonth) : 0;
    return { rate: dailyAllowance, label: `for the next ${remainingDaysInMonth} days of this month cycle.` };
  };
  const burnRateContext = getBurnRateVerdict();

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = spendingBudgetLimit > 0 
    ? circumference - (Math.min(currentSpendingTotal, spendingBudgetLimit) / spendingBudgetLimit) * circumference 
    : circumference;

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1300px] mx-auto p-2 relative text-gray-800 select-none">
      
      {/* 1. TOP GLOBAL CONTROL PANEL SECTION */}
      <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-600 font-mono font-black px-2.5 py-1 rounded-md tracking-wider uppercase">
            {timeframe} Execution View
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" /> {currentMonthName} Control Matrix
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            disabled={!isSecuredTenant}
            onClick={() => setShowBudgetModal(true)}
            className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-blue-600 text-white font-mono font-black text-xs h-10 px-4 rounded-xl shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" /> Budget Framework Wizard
          </button>
          
          <button
            type="button"
            onClick={fetchLiveAggregatedBudget}
            disabled={isSyncing || !isSecuredTenant}
            className="flex-1 sm:flex-none border border-gray-200 bg-white text-gray-700 font-mono font-black text-xs h-10 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:border-gray-300 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            )}
            <span>Sync Live Envelopes</span>
          </button>

          <button
            type="button"
            disabled={!isSecuredTenant}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 sm:flex-none bg-gray-900 text-white font-mono font-black text-xs h-10 px-4 rounded-xl shadow-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {showAddForm ? <X className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-blue-400" />}
            <span>{showAddForm ? "Dismiss Drawer" : "New Track Rule"}</span>
          </button>
        </div>
      </div>

      {/* 2. TIMEFRAME SWITCHER TAB SELECTOR BAR */}
      <div className="bg-gray-100 p-1 rounded-xl flex gap-1 max-w-md border border-gray-200/50 shadow-inner">
        {(["monthly", "weekly", "daily"] as const).map((view) => (
          <button
            key={view}
            type="button"
            disabled={!isSecuredTenant}
            onClick={() => setTimeframe(view)}
            className={`flex-1 py-2 text-xs font-mono font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              timeframe === view && isSecuredTenant
                ? "bg-white text-purple-600 border border-gray-100 shadow-sm" 
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {view} Parameters
          </button>
        ))}
      </div>

      {/* 3. DUAL COLUMN DESIGN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          
          {showAddForm && isSecuredTenant && (
            <form onSubmit={handleCreateBudgetEnvelope} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 text-left animate-slideDown shadow-inner">
              <span className="text-[10px] font-mono font-black uppercase text-purple-600 tracking-wider block">
                Provision Dynamic Verification Pipeline Node
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Envelope Name (e.g., Target Run, Fuel)..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-purple-500 transition-all"
                />
                <input
                  type="number"
                  required
                  placeholder="Monthly Base Cap Limit Allocation ($)..."
                  value={newCatLimit}
                  onChange={(e) => setNewCatLimit(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-purple-500 font-mono"
                />
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 h-11 justify-between text-xs font-bold text-gray-400">
                  <span className="font-mono text-[10px] uppercase">Target Framework Pool:</span>
                  <select 
                    value={newCatType} 
                    onChange={(e) => setNewCatType(e.target.value as any)}
                    className="outline-none bg-transparent font-black text-gray-900 cursor-pointer"
                  >
                    <option value="category">Discretionary Envelope</option>
                    <option value="basic">Fixed Baseline Resource</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Plaid Sync Match Keywords (comma separated)..."
                  value={newCatKeywords}
                  onChange={(e) => setNewCatKeywords(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-purple-500"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-mono font-black text-xs h-11 rounded-xl uppercase tracking-wider shadow-sm hover:opacity-95 cursor-pointer">
                Deploy Tracking Envelope Configuration
              </button>
            </form>
          )}

          {/* FIXED FOUNDATIONS BASELINE ACCUMULATION PANELS */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
            <h4 className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" /> FIXED ASSET STRUCTURE FOUNDATION
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              <div className="bg-gray-50/70 px-4 py-2.5 flex justify-between text-[9px] font-mono font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <span>Account Ledger Nodes</span>
                <div className="flex gap-16 pr-4">
                  <span>Cap Metric</span>
                  <span>Actual Core</span>
                </div>
              </div>
              
              {userEmail === "authenticating..." ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-purple-600 uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Clearance...
                </div>
              ) : userEmail === "unauthenticated_session" ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-rose-500 bg-rose-50/20 border border-dashed border-rose-100 rounded-xl m-2 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Security Clearance Context Not Sourced
                </div>
              ) : basicItems.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">No structural entries linked</div>
              ) : basicItems.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs font-black text-gray-900 hover:bg-gray-50/40 transition-colors group">
                  <span className="underline decoration-gray-200 underline-offset-4 decoration-2 group-hover:text-purple-600 cursor-pointer transition-colors text-left">
                    {item.name}
                  </span>
                  <div className="flex gap-14 font-mono font-black tracking-tight text-right tabular-nums">
                    <span className="text-gray-400">${item.limit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-emerald-600 flex items-center gap-0.5">
                      <ArrowDownLeft className="w-3 h-3 text-emerald-500 shrink-0" />
                      ${item.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FLEXIBLE ENVELOPES REGISTRY LIST */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
            <h4 className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FolderPlus className="w-3.5 h-3.5 text-blue-600" /> VARIABLE CAPITAL FLUID ENVELOPES
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              <div className="bg-gray-50/70 px-4 py-2.5 flex justify-between text-[9px] font-mono font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <span>Discretionary Matrix Envelopes</span>
                <div className="flex gap-16 pr-4">
                  <span>Target Bound</span>
                  <span>Active Ledger</span>
                </div>
              </div>
              
              {userEmail === "authenticating..." ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-purple-600 uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" /> Querying Target Matrix...
                </div>
              ) : userEmail === "unauthenticated_session" ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-rose-500 bg-rose-50/20 border border-dashed border-rose-100 rounded-xl m-2 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Core Partition Off-line
                </div>
              ) : coreCategoryItems.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono font-bold text-gray-400 uppercase tracking-wide">No fluid allocation targets monitored</div>
              ) : coreCategoryItems.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs font-black text-gray-900 hover:bg-gray-50/40 transition-colors group">
                  <span className="underline decoration-gray-200 underline-offset-4 decoration-2 group-hover:text-blue-600 cursor-pointer transition-colors text-left">
                    {item.name}
                  </span>
                  <div className="flex gap-14 font-mono font-black tracking-tight text-right tabular-nums">
                    <span className="text-gray-400">${item.limit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-gray-900 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3 text-purple-400 shrink-0" />
                      ${item.spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS DISK SUMMARY RIGHT SIDE PANEL */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center relative overflow-hidden">
            <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest block self-start mb-6">
              {timeframe} METRICS COMPUTATION ENGINE
            </span>
            
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} className="text-gray-100" strokeWidth="12" stroke="currentColor" fill="transparent" />
                <circle cx="100" cy="100" r={radius} className="text-purple-600 transition-all duration-700 ease-in-out" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={isSecuredTenant ? strokeDashoffset : circumference} strokeLinecap="round" stroke="currentColor" fill="transparent" />
              </svg>
              <div className="absolute text-center flex flex-col justify-center items-center">
                <span className="text-[9px] font-mono font-black uppercase text-gray-400 tracking-widest flex items-center gap-0.5">
                  <PieChart className="w-3 h-3 text-purple-600" /> Liquid SAFE
                </span>
                <span className="text-2xl font-mono font-black text-gray-900 tracking-tight mt-1 tabular-nums">
                  {!isSecuredTenant ? "$ --.--" : `$${remainingSpendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <span className="text-[8px] bg-purple-50 text-purple-600 font-bold border border-purple-100 px-2 py-0.5 rounded-md mt-1.5 font-mono tabular-nums">
                  OF ${isSecuredTenant ? spendingBudgetLimit.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "--"}
                </span>
              </div>
            </div>

            {/* HIGH-CONTRAST CHRON BURN RATE VERDICT FRAME */}
            <div className="w-full mt-6 p-[1px] bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-xs">
              <div className="bg-white p-3.5 rounded-[11px] text-center">
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  {isSecuredTenant ? (
                    <>Operational target velocity ceiling: <span className="text-purple-600 font-black font-mono block text-sm mt-0.5">${burnRateContext.rate.toFixed(2)} / Unit Interval</span> {burnRateContext.label}</>
                  ) : (
                    <span className="text-gray-400 font-mono text-[10px] uppercase block py-1">Awaiting Authorization Payload</span>
                  )}
                </p>
              </div>
            </div>

            <div className="w-full mt-6 space-y-3 border-t border-gray-100 pt-5 text-xs font-black text-gray-500 font-mono uppercase tracking-wide">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400" /><span>Structural Limit</span></div>
                <span className="text-gray-900 tabular-nums">${isSecuredTenant ? spendingBudgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /><span>Active Execution</span></div>
                <span className="text-gray-900 tabular-nums">${isSecuredTenant ? currentSpendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-gray-900">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span>Available Delta</span></div>
                <span className="text-emerald-600 text-sm font-black tabular-nums">${isSecuredTenant ? remainingSpendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL DRAWER OVERLAY DIALOG FOR THE DYNAMIC BUDGET BUILDER WIZARD */}
      {showBudgetModal && isSecuredTenant && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-gray-200 p-6 max-w-2xl w-full space-y-5 shadow-2xl my-8 max-h-[90vh] flex flex-col">
            
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Dynamic Budget Template Architect
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Design system allocation horizons and register tracking matrices recursively across tenant parameters.
              </p>
            </div>

            <form onSubmit={handleGenerateFreshBudgetStructure} className="space-y-4 flex-1 overflow-y-auto pr-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* TIMELINE MATRIX ANCHORS SELECTION ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black uppercase text-gray-400 block ml-0.5">Interval Parameter</label>
                    <select
                      value={wizardTimeframeType}
                      onChange={(e) => {
                        setWizardTimeframeType(e.target.value as any);
                        setWizardTimeframeValue(e.target.value === "month" ? "January" : "4");
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-black text-gray-800 outline-none focus:border-purple-500"
                    >
                      <option value="month">Standard Month Cycle</option>
                      <option value="weeks">Week Frame Boundary</option>
                      <option value="days">Custom Day Increment</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black uppercase text-gray-400 block ml-0.5">Chron Boundary</label>
                    {wizardTimeframeType === "month" ? (
                      <select
                        value={wizardTimeframeValue}
                        onChange={(e) => setWizardTimeframeValue(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-black text-gray-800 outline-none focus:border-purple-500"
                      >
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        required
                        value={wizardTimeframeValue}
                        onChange={(e) => setWizardTimeframeValue(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-purple-500 font-mono"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono font-black uppercase text-gray-400 block ml-0.5">Framework Title Profile</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., Household Ledger Node..." 
                      value={newBudgetTitle}
                      onChange={(e) => setNewBudgetTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 h-11 text-xs font-bold text-gray-800 outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* STAGING INLINE FIELD MANIPULATION DESK */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/40 space-y-3 shadow-inner">
                  <span className="text-[10px] font-mono font-black uppercase text-gray-900 tracking-wider block">
                    Stage Live Evaluation Row Node
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Envelope Label (e.g., Insurance, Utilities)..." 
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 h-10 text-xs font-bold text-gray-800 outline-none"
                    />
                    <div className="relative flex items-center">
                      <DollarSign className="absolute right-3 w-3.5 h-3.5 text-gray-400" />
                      <input 
                        type="number" 
                        placeholder="Cap Target Budget Valuation ($)..." 
                        value={stageLimit}
                        onChange={(e) => setStageLimit(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-8 h-10 text-xs font-bold text-gray-800 outline-none font-mono"
                      />
                    </div>
                    <select
                      value={stageType}
                      onChange={(e) => setStageType(e.target.value as any)}
                      className="bg-white border border-gray-200 rounded-xl px-3 h-10 text-xs font-black text-gray-800 outline-none cursor-pointer"
                    >
                      <option value="category">Fluid Variable Allocation Type</option>
                      <option value="basic">Fixed Foundation Core Resource</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Plaid Match Keywords Token Strings (comma sep)..." 
                      value={stageKeywords}
                      onChange={(e) => setStageKeywords(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 h-10 text-xs font-bold text-gray-800 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addRowToStagingMatrix}
                    className="w-full bg-gray-900 text-white font-mono font-black text-[10px] h-9 rounded-xl uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    ＋ Commit Item Parameters Into Structural Staging Matrix
                  </button>
                </div>

                {/* CURRENT ACTIVE STAGING LEDGER PREVIEW BOUNDS */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono font-black uppercase text-gray-400 block ml-1">
                    Staging Matrix Processing Queue ({stagedCategories.length} Nodes Registered)
                  </span>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-white max-h-[160px] overflow-y-auto shadow-sm">
                    {stagedCategories.map((row, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center text-xs hover:bg-gray-50/50 transition-colors">
                        <div className="min-w-0 flex-1 pr-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 truncate">{row.name}</span>
                            <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-md border ${
                              row.type === 'basic' 
                                ? 'bg-purple-50 border-purple-100 text-purple-600' 
                                : 'bg-blue-50 border-blue-100 text-blue-600'
                            }`}>
                              {row.type}
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-400 block truncate font-mono mt-0.5">Signature Key tags: {row.keywords || "SYSTEM_FALLBACK"}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-mono font-black text-gray-900 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                            ${row.limit.toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeRowFromStagingMatrix(idx)}
                            className="text-gray-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ACTION COMMAND BLOCK SELECTION PANEL STRIP */}
              <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-mono font-black text-xs h-11 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                >
                  Abort Construction
                </button>
                <button
                  type="submit"
                  disabled={stagedCategories.length === 0 || !newBudgetTitle}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white font-mono font-black text-xs h-11 rounded-xl uppercase tracking-wider shadow-md disabled:shadow-none transition-all disabled:cursor-not-allowed cursor-pointer"
                >
                  Instantiate Profile Framework Array
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}