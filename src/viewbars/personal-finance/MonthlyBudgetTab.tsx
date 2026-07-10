"use client";

import React, { useState, useEffect, useCallback } from "react";

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

export default function MonthlyBudgetTab() {
  const devUserId = "mock-dev-user-uuid-123";

  // --- STATE REGISTRIES ---
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

  // --- DATA INGESTION HANDSHAKES ---
  const fetchLiveAggregatedBudget = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/budget?user_id=${devUserId}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to query budget data synchronization arrays:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAggregatedBudget();
  }, [fetchLiveAggregatedBudget]);

  // Add individual row into local state container
  const handleCreateBudgetEnvelope = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatLimit) return;

    const kwArray = newCatKeywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
    if (kwArray.length === 0) kwArray.push(newCatName.split(" ")[0].toLowerCase());

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: devUserId,
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
      console.error("Failed to register category item payload:", err);
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

  // Submits the complete custom structured macro-budget framework to database api targets
  const handleGenerateFreshBudgetStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedCategories.length === 0 || !newBudgetTitle) return;
    setIsSyncing(true);

    try {
      // Loop over your dynamic custom matrix built inside the wizard overlay modal
      for (const item of stagedCategories) {
        const kwArray = item.keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
        if (kwArray.length === 0) kwArray.push(item.name.split(" ")[0].toLowerCase());

        await fetch("/api/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: devUserId,
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
      console.error("Failed to deploy wizard template metrics:", err);
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
    <div className="space-y-6 animate-fadeIn max-w-[1300px] mx-auto p-2 relative">
      
      {/* 1. TOP GLOBAL CONTROL PANEL SECTION */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none">
        <div>
          <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase font-mono">
            {timeframe} Analytics Mode
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">{currentMonthName} Console</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowBudgetModal(true)}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-4 rounded-xl transition-all shadow-sm active:scale-98"
          >
            ✴️ Create New Budget
          </button>
          <button
            type="button"
            onClick={fetchLiveAggregatedBudget}
            disabled={isSyncing}
            className="flex-1 sm:flex-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs h-10 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
          >
            <span className={isSyncing ? "animate-spin block" : ""}>🔄</span>
            <span>Sync Live Ledgers</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-4 rounded-xl transition-all shadow-sm active:scale-98"
          >
            {showAddForm ? "Close Drawer" : "＋ New Category Rule"}
          </button>
        </div>
      </div>

      {/* 2. TIMEFRAME SWITCHER BAR */}
      <div className="bg-slate-100 p-1 rounded-xl flex gap-1 max-w-md select-none border border-slate-200/40">
        {(["monthly", "weekly", "daily"] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setTimeframe(view)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              timeframe === view ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {view} View
          </button>
        ))}
      </div>

      {/* 3. DUAL COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          
          {showAddForm && (
            <form onSubmit={handleCreateBudgetEnvelope} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-left animate-slideDown">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">Provision Dynamic Tracking Rule</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (e.g., Target Run, Gas)..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                />
                <input
                  type="number"
                  required
                  placeholder="Monthly Base Cap Allocation Limit ($)..."
                  value={newCatLimit}
                  onChange={(e) => setNewCatLimit(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                />
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 h-11 justify-between text-xs font-bold text-slate-500">
                  <span>Structural Target Bucket:</span>
                  <select 
                    value={newCatType} 
                    onChange={(e) => setNewCatType(e.target.value as any)}
                    className="outline-none bg-transparent font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="category">Budget Category Container</option>
                    <option value="basic">Budget Basics Block</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Sync Search Keywords (e.g., walmart, shell)..."
                  value={newCatKeywords}
                  onChange={(e) => setNewCatKeywords(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-11 rounded-xl uppercase tracking-wider transition-all shadow-sm">
                Deploy Tracking Envelope Configuration
              </button>
            </form>
          )}

          {/* BASICS */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest select-none">Fixed Foundations Summary</h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="bg-slate-50/50 px-4 py-2.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <span>Name Matrix</span>
                <div className="flex gap-16 pr-4">
                  <span>Cap Target</span>
                  <span>Actual Core</span>
                </div>
              </div>
              {basicItems.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50/40 transition-colors">
                  <span className="underline decoration-slate-200 underline-offset-4 decoration-2 hover:text-blue-500 cursor-pointer transition-colors">{item.name}</span>
                  <div className="flex gap-14 font-mono font-bold tracking-tight text-right tabular-nums">
                    <span className="text-slate-500">${item.limit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className={item.spent > 0 ? "text-emerald-500" : "text-slate-400"}>${item.spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest select-none font-sans">Flexible Envelopes Ledger</h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="bg-slate-50/50 px-4 py-2.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <span>Name Matrix</span>
                <div className="flex gap-16 pr-4">
                  <span>Cap Target</span>
                  <span>Actual Core</span>
                </div>
              </div>
              {coreCategoryItems.map((item) => (
                <div key={item.id} className="p-4 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50/40 transition-colors">
                  <span className="underline decoration-slate-200 underline-offset-4 decoration-2 hover:text-blue-500 cursor-pointer transition-colors">{item.name}</span>
                  <div className="flex gap-14 font-mono font-bold tracking-tight text-right tabular-nums">
                    <span className="text-slate-500">${item.limit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className={item.spent > 0 ? "text-slate-800" : "text-slate-400"}>${item.spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY SIDE PANEL */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md flex flex-col items-center relative overflow-hidden">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block self-start mb-6 select-none">{timeframe} Metrics Engine</span>
            
            <div className="relative w-44 h-44 flex items-center justify-center select-none">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={radius} className="text-slate-100" strokeWidth="14" stroke="currentColor" fill="transparent" />
                <circle cx="100" cy="100" r={radius} className="text-blue-500 transition-all duration-700 ease-in-out" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" />
              </svg>
              <div className="absolute text-center flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">Available</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 tabular-nums">
                  ${remainingSpendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold mt-1 font-mono tabular-nums">allocation of ${spendingBudgetLimit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-bold text-center leading-relaxed mt-6 border-t border-slate-50 pt-4 w-full">
              That's <span className="text-blue-600 font-black font-mono">${burnRateContext.rate.toFixed(2)} / operational unit</span> {burnRateContext.label}
            </p>

            <div className="w-full mt-6 space-y-3.5 border-t border-slate-100 pt-5 text-xs font-bold text-slate-600">
              <div className="flex justify-between items-center select-none">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[7px] text-indigo-500">⊕</span><span>Target Parameter</span></div>
                <span className="font-mono font-black text-slate-900 tabular-nums">${spendingBudgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center select-none">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-500">⊖</span><span>Active Expenditure</span></div>
                <span className="font-mono font-black text-slate-900 tabular-nums">${currentSpendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center select-none border-t border-slate-50 pt-3.5">
                <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[7px] text-emerald-500">⊜</span><span>Remaining Safety Value</span></div>
                <span className="font-mono font-black text-emerald-500 tabular-nums">${remainingSpendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL DRAWER OVERLAY DIALOG FOR THE DYNAMIC BUDGET BUILDER WIZARD */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-left overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 max-w-2xl w-full space-y-5 shadow-2xl my-8 animate-scaleUp max-h-[90vh] flex flex-col">
            
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Dynamic Budget Architect Wizard</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Map custom tracking timelines across the calendar year and assemble transaction line envelopes inline.</p>
            </div>

            <form onSubmit={handleGenerateFreshBudgetStructure} className="space-y-4 flex-1 overflow-y-auto pr-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* CALENDAR TIMELINE SEGMENT TRACKER */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block ml-0.5 select-none">Interval Mode</label>
                    <select
                      value={wizardTimeframeType}
                      onChange={(e) => {
                        setWizardTimeframeType(e.target.value as any);
                        setWizardTimeframeValue(e.target.value === "month" ? "January" : "4");
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    >
                      <option value="month">Calendar Month</option>
                      <option value="weeks">Custom Week Horizon</option>
                      <option value="days">Custom Day Horizon</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block ml-0.5 select-none">Timeframe Boundary</label>
                    {wizardTimeframeType === "month" ? (
                      <select
                        value={wizardTimeframeValue}
                        onChange={(e) => setWizardTimeframeValue(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 font-mono"
                      />
                    )}
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block ml-0.5 select-none">Budget Profile Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., Primary Household, LLC Node..." 
                      value={newBudgetTitle}
                      onChange={(e) => setNewBudgetTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 h-11 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* INLINE DYNAMIC CATEGORY ENVELOPE STRUCTOR STAGE */}
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider block">Stage New Inline Tracking Node</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Category Name (e.g., Auto Loan, Gas)..." 
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 h-10 text-xs font-bold text-slate-800 outline-none"
                    />
                    <input 
                      type="number" 
                      placeholder="Cap Budget Value ($)..." 
                      value={stageLimit}
                      onChange={(e) => setStageLimit(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 h-10 text-xs font-bold text-slate-800 outline-none font-mono"
                    />
                    <select
                      value={stageType}
                      onChange={(e) => setStageType(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-3 h-10 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="category">Discretionary Category Row</option>
                      <option value="basic">Fixed Foundation Basics Row</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Plaid Match Keywords (e.g., shell, chevron)..." 
                      value={stageKeywords}
                      onChange={(e) => setStageKeywords(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 h-10 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addRowToStagingMatrix}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 rounded-xl uppercase tracking-wider transition-all select-none"
                  >
                    ＋ Append Row Item into Staging Matrix
                  </button>
                </div>

                {/* ACTIVE STAGED ENVELOPES ITERATION LEDGER PREVIEW */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 block ml-1 select-none">Staging Ledger Matrix Queue ({stagedCategories.length})</span>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white max-h-[160px] overflow-y-auto shadow-sm">
                    {stagedCategories.map((row, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs hover:bg-slate-50 transition-colors">
                        <div className="min-w-0 flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 truncate">{row.name}</span>
                            <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${row.type === 'basic' ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                              {row.type}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate font-mono mt-0.5">Tags: {row.keywords || "auto-generated"}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="font-mono font-black text-slate-900">${row.limit.toLocaleString()}</span>
                          <button
                            type="button"
                            onClick={() => removeRowFromStagingMatrix(idx)}
                            className="text-rose-500 hover:text-rose-600 text-xs font-black p-1 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ACTION COMMAND DECKS */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs h-11 rounded-xl transition-all uppercase tracking-wider"
                >
                  Abort Action
                </button>
                <button
                  type="submit"
                  disabled={stagedCategories.length === 0 || !newBudgetTitle}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs h-11 rounded-xl transition-all uppercase tracking-wider shadow-md disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Instantiate Node Framework
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}