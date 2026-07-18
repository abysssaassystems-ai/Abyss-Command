"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// Import your decoupled modular layout sub-views
import BankFeedTab from "@/viewbars/personal-finance/BankFeedTab";
import MonthlyBudgetTab from "@/viewbars/personal-finance/MonthlyBudgetTab";
import MySubscriptionsTab from "@/viewbars/personal-finance/MySubscriptionsTab";
import CanIAffordThisTab from "@/viewbars/personal-finance/CanIAffordThisTab";
import InvestmentsAndGoalsTab from "@/viewbars/personal-finance/InvestmentsAndGoalsTab";
import SpendingTab from "@/viewbars/personal-finance/SpendingTab";

type FinanceTabID = "overview" | "budget" | "subscriptions" | "spending" | "simulator" | "investments";

export interface AccountAsset {
  id: string;
  name: string;
  type: "checking" | "savings" | "investment" | "credit_card";
  balance: number;
  institution: string;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
}

export interface SubscriptionBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface VacationTrip {
  id: string;
  name: string;
  destination: string;
  target: number;
  saved: number;
  date: string;
}

export default function BudgetDashboard(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<FinanceTabID>("overview");

  // TENANT ISOLATION AND GATEKEEPER STATES
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // APP COMPONENT MASTER DATA REPOSITORIES
  const [purchaseCost, setPurchaseCost] = useState<string>("");
  const [purchaseVerdict, setPurchaseVerdict] = useState<{decision: string; message: string} | null>(null);
  const [investmentInput, setInvestmentInput] = useState<string>("");
  const [projectedGrowth, setProjectedGrowth] = useState<number | null>(null);

  const [accounts, setAccounts] = useState<AccountAsset[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionBill[]>([]);
  const [vacations, setVacations] = useState<VacationTrip[]>([]);

  // 1. HANDSHAKE VERIFICATION & BILLING ROUTE GUARD
  useEffect(() => {
    const session = localStorage.getItem("active_software_user");
    if (!session) {
      setHasAccess(false);
      return;
    }

    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    async function verifyModuleAccess() {
      const { data, error } = await supabase
        .from('client_module_access')
        .select('is_active')
        .eq('client_email', parsedUser.email)
        .eq('module_id', 'personal-finance')
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setHasAccess(false);
      } else {
        setHasAccess(true);
        // Hydrate target tables matching this client's ecosystem keys
        hydrateFinanceWorkspace(parsedUser.email);
      }
    }
    verifyModuleAccess();
  }, [activeTab]);

  // 2. LIVE DATABASE STREAM RETRIEVAL FOR SPECIFIC LOGGED USER
  async function hydrateFinanceWorkspace(email: string) {
    try {
      // Pull down checking, savings, and card records from financial_accounts
      const { data: dbAccounts } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('client_email', email);

      // Pull down limits and spends from budget_categories
      const { data: dbCategories } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('client_email', email);

      // Pull down upcoming savings milestones from vacation_goals
      const { data: dbVacations } = await supabase
        .from('vacation_goals')
        .select('*')
        .eq('client_email', email);

      if (dbAccounts) setAccounts(dbAccounts);
      if (dbCategories) setCategories(dbCategories);
      if (dbVacations) setVacations(dbVacations);

      // Fallback fallback defaults to maintain layout visibility if initial tables are blank
      if (!dbAccounts || dbAccounts.length === 0) {
        setAccounts([
          { id: "acc_1", name: "Main Checking", type: "checking", balance: 3450, institution: "Chase" },
          { id: "acc_2", name: "High-Yield Savings", type: "savings", balance: 12800, institution: "Ally" },
          { id: "acc_3", name: "Investment Portfolio", type: "investment", balance: 24150, institution: "Schwab" },
          { id: "acc_4", name: "Sapphire Card", type: "credit_card", balance: -840, institution: "Chase" }
        ]);
      }

      if (!dbCategories || dbCategories.length === 0) {
        setCategories([
          { name: "Groceries & Food", spent: 420, limit: 600, color: "bg-blue-500" },
          { name: "Entertainment & Play", spent: 180, limit: 250, color: "bg-purple-500" },
          { name: "Rent & Utilities", spent: 1200, limit: 1400, color: "bg-gray-600" }
        ]);
      }

      setSubscriptions([
        { id: "sub_1", name: "Netflix Premium", amount: 15.49, dueDate: "In 3 Days" },
        { id: "sub_2", name: "Spotify Family", amount: 16.99, dueDate: "In 8 Days" },
        { id: "sub_3", name: "Gym Membership", amount: 50.00, dueDate: "July 1st" }
      ]);

      if (!dbVacations || dbVacations.length === 0) {
        setVacations([
          { id: "vac_1", name: "Tokyo Summer 2026", destination: "Tokyo, Japan", target: 4500, saved: 3100, date: "2026-08-15" },
          { id: "vac_2", name: "Alps Skiing Trip", destination: "Chamonix, France", target: 3000, saved: 850, date: "2026-12-20" }
        ]);
      }
    } catch (err) {
      console.error("FINANCE_HYDRATION_EXCEPTION:", err);
    }
  }

  // --- LIVE ISOLATED REVENUE CALCULATORS ---
  const totalAssets = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const liquidCash = accounts.filter(a => ["checking", "savings"].includes(a.type)).reduce((acc, curr) => acc + curr.balance, 0);
  const upcomingBillsTotal = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalBudgetLimit = categories.reduce((acc, curr) => acc + curr.limit, 0);
  const totalBudgetSpent = categories.reduce((acc, curr) => acc + curr.spent, 0);

  // --- PREDICTIVE TRANSACTION ALGORITHMS ---
  const evaluatePurchaseAffordability = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(purchaseCost) || 0;
    if (cost <= 0) return;

    const safetyBuffer = 1500; 
    const accessibleSpendCap = liquidCash - upcomingBillsTotal - safetyBuffer;

    if (cost <= accessibleSpendCap * 0.1) {
      setPurchaseVerdict({
        decision: "Approved ✔",
        message: `Perfectly safe to purchase. This item represents less than 10% of your remaining flexible budget margin ($${Math.round(accessibleSpendCap).toLocaleString()}), keeping your protection cash completely uncompromised.`
      });
    } else if (cost <= accessibleSpendCap) {
      setPurchaseVerdict({
        decision: "Caution Required ⚠️",
        message: "Affordable, but structural adjustments recommended. This single asset acquisition drawing down your remaining liquid margin directly delays active vacation funding targets."
      });
    } else {
      setPurchaseVerdict({
        decision: "Denied ✕",
        message: "High Risk Outflow Detected. This purchase breaks past allowable disposable allowance balances, threatening primary protection parameters or fixed recurring contract positions."
      });
    }
  };

  const calculateCompoundProjections = (e: React.FormEvent) => {
    e.preventDefault();
    const deposit = parseFloat(investmentInput) || 0;
    if (deposit <= 0) return;

    const monthlyRate = 0.08 / 12;
    const totalMonths = 10 * 12;
    const futureValue = deposit * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    setProjectedGrowth(Math.round(futureValue));
  };

  const handleFundVacation = async (id: string, amount: number) => {
    if (liquidCash < amount || !user) return;

    // Local state calculation rehydration fallback
    setVacations(prev => prev.map(v => v.id === id ? { ...v, saved: Math.min(v.saved + amount, v.target) } : v));
    setAccounts(prev => prev.map(a => a.id === "acc_1" ? { ...a, balance: a.balance - amount } : a));

    // Async push update sequence into live vacation_goals table row parameters
    await supabase
      .from('vacation_goals')
      .update({ saved: vacations.find(v => v.id === id)!.saved + amount })
      .eq('id', id)
      .eq('client_email', user.email);
  };

  // 3. EMBED BILLING WALL TO PREVENT UNPAID INTERCEPTIONS
  if (hasAccess === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-white select-none">
        <div className="p-[1px] bg-gradient-to-br from-purple-600 via-blue-500 to-gray-200 rounded-3xl shadow-xl max-w-md w-full">
          <div className="bg-white rounded-[23px] p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto border border-blue-100 text-blue-600 font-bold">💳</div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">License Activation Required</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your company account profile has not deployed the Capital-Engine Personal Finance module infrastructure node yet. Turn on access immediately from your catalog terminal.
            </p>
            <Link href="/dashboard/app-catalogue" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:opacity-95">
              Activate Finance Engine ($9.99/mo)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading baseline barrier state
  if (hasAccess === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-xs text-gray-400 uppercase tracking-widest animate-pulse bg-white select-none">
        // Unlocking secure transaction vaults...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-purple-100 flex flex-col select-none">
      
      {/* SECTION WRAPPER: TRIPLE GRADIENT FRAME EMBEDDED LAYOUT CONTAINER PANEL */}
      <div className="p-[1px] bg-gradient-to-r from-purple-600 via-blue-500 to-gray-200 rounded-3xl shadow-xl max-w-6xl w-full mx-auto mt-4">
        <div className="bg-white rounded-[23px] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[75vh]">
          
          {/* INTERACTIVE NAVIGATION PORTAL SIDEBAR */}
          <aside className="w-full md:w-64 bg-gray-50/50 md:border-r border-b md:border-b-0 border-gray-200 p-4 sm:p-6 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible custom-scrollbar z-20">
            <span className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider mb-1 hidden md:block">
              // LEDGER SYSTEMS
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[130px] md:min-w-0 ${
                activeTab === "overview" ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              🏦 Bank Feed Node
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("budget")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
                activeTab === "budget" ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              📊 Monthly Budgets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("subscriptions")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
                activeTab === "subscriptions" ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              ⏳ Bills & Contracts
            </button>
            
            <div className="h-[1px] bg-gray-200 my-1 hidden md:block" />
            <span className="text-[9px] font-mono font-bold uppercase text-gray-400 tracking-wider mb-1 hidden md:block">
              // PREDICTIVE ENGINE
            </span>

            <button
              type="button"
              onClick={() => setActiveTab("spending")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
                activeTab === "spending" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              🛍️ Spending Analysis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("simulator")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
                activeTab === "simulator" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              🧠 Purchase Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("investments")}
              className={`w-full text-left px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center shrink-0 md:shrink border md:border-none min-w-[150px] md:min-w-0 ${
                activeTab === "investments" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white md:bg-transparent text-gray-600 border-gray-200 hover:bg-gray-100/70"
              }`}
            >
              📈 Growth Forecasts
            </button>
          </aside>

          {/* WORKSPACE CONTENT ROUTER CANVAS */}
          <section className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white relative z-10">
            {activeTab === "overview" && (
              <BankFeedTab accounts={accounts} totalAssets={totalAssets} />
            )}

            {activeTab === "budget" && (
              <MonthlyBudgetTab />
            )}

            {activeTab === "subscriptions" && (
              <MySubscriptionsTab subscriptions={subscriptions} />
            )}

            {activeTab === "spending" && (
              <SpendingTab />
            )}

            {activeTab === "simulator" && (
              <CanIAffordThisTab 
                purchaseCost={purchaseCost}
                setPurchaseCost={setPurchaseCost}
                purchaseVerdict={purchaseVerdict}
                evaluatePurchaseAffordability={evaluatePurchaseAffordability}
              />
            )}

            {activeTab === "investments" && (
              <InvestmentsAndGoalsTab 
                vacations={vacations}
                handleFundVacation={handleFundVacation}
                investmentInput={investmentInput}
                setInvestmentInput={setInvestmentInput}
                calculateCompoundProjections={calculateCompoundProjections}
                projectedGrowth={projectedGrowth}
              />
            )}
          </section>

        </div>
      </div>
    </div>
  );
}